import { useEffect, useState } from 'react'
import CategoryForm from '../components/settings/CategoryForm'
import CategoryList from '../components/settings/CategoryList'
import { supabase } from '../lib/supabase'
import type { Category } from '../types/product'

const Settings = () => {
    const [categories, setCategories] = useState<Category[]>([])
    const [loading, setLoading] = useState(true)
    const [loadError, setLoadError] = useState('')
    const [saving, setSaving] = useState(false)
    const [savingId, setSavingId] = useState<string | null>(null)
    const [deletingId, setDeletingId] = useState<string | null>(null)
    const [errorMessage, setErrorMessage] = useState('')
    const [successMessage, setSuccessMessage] = useState('')

    const loadCategories = async () => {
        setLoading(true)
        setLoadError('')

        const { data, error } = await supabase
            .from('categories')
            .select('id, name')
            .order('name', { ascending: true })

        if (error) {
            setLoadError(error.message)
        } else {
            setCategories(data ?? [])
        }

        setLoading(false)
    }

    useEffect(() => {
        void loadCategories()
    }, [])

    useEffect(() => {
        if (!successMessage) return

        const timeoutId = window.setTimeout(() => setSuccessMessage(''), 3000)
        return () => window.clearTimeout(timeoutId)
    }, [successMessage])

    const handleCreate = async (name: string) => {
        setErrorMessage('')
        setSuccessMessage('')
        setSaving(true)

        try {
            const { data, error } = await supabase
                .from('categories')
                .insert({ name })
                .select('id, name')
                .single()

            if (error) {
                throw new Error(error.code === '23505' ? 'You already have a category with that name.' : error.message)
            }

            if (data) {
                setCategories((currentCategories) => [...currentCategories, data].sort((first, second) => first.name.localeCompare(second.name)))
                setSuccessMessage('Category added successfully.')
            }
        } finally {
            setSaving(false)
        }
    }

    const handleRename = async (category: Category, name: string) => {
        setErrorMessage('')
        setSuccessMessage('')
        setSavingId(category.id)

        try {
            const { data, error } = await supabase
                .from('categories')
                .update({ name })
                .eq('id', category.id)
                .select('id, name')
                .single()

            if (error) {
                throw new Error(error.code === '23505' ? 'You already have a category with that name.' : error.message)
            }

            if (data) {
                setCategories((currentCategories) => currentCategories
                    .map((currentCategory) => currentCategory.id === category.id ? data : currentCategory)
                    .sort((first, second) => first.name.localeCompare(second.name)))
                setSuccessMessage('Category renamed successfully.')
            }
        } finally {
            setSavingId(null)
        }
    }

    const handleDelete = async (category: Category) => {
        setErrorMessage('')
        setSuccessMessage('')
        setDeletingId(category.id)

        try {
            const { error } = await supabase.from('categories').delete().eq('id', category.id)

            if (error) {
                throw new Error(error.message)
            }

            setCategories((currentCategories) => currentCategories.filter((currentCategory) => currentCategory.id !== category.id))
            setSuccessMessage('Category deleted successfully.')
        } finally {
            setDeletingId(null)
        }
    }

    return (
        <div className="settings-page">
            <header className="settings-header">
                <p className="eyebrow">Workspace</p>
                <h1>Settings</h1>
                <p className="products-description">Manage the categories used to organize your inventory.</p>
            </header>

            {errorMessage && <p className="settings-global-message error-message" role="alert">{errorMessage}</p>}
            <div className="settings-grid">
                <CategoryForm
                    saving={saving}
                    errorMessage=""
                    successMessage={successMessage}
                    onCreate={handleCreate}
                />
                <CategoryList
                    categories={categories}
                    loading={loading}
                    loadError={loadError}
                    savingId={savingId}
                    deletingId={deletingId}
                    onRename={handleRename}
                    onDelete={handleDelete}
                />
            </div>
        </div>
    )
}

export default Settings
