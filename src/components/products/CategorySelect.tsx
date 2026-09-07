import { useState } from 'react'
import type { Category } from '../../types/product'

type CategorySelectProps = {
    value: string
    categories: Category[]
    disabled?: boolean
    onChange: (value: string) => void
    onCreateCategory: (name: string) => Promise<Category>
}

const CategorySelect = ({
    value,
    categories,
    disabled = false,
    onChange,
    onCreateCategory,
}: CategorySelectProps) => {
    const [isCreating, setIsCreating] = useState(false)
    const [categoryName, setCategoryName] = useState('')
    const [saving, setSaving] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')

    const handleCreate = async () => {
        const name = categoryName.trim()
        if (!name) {
            setErrorMessage('Enter a category name.')
            return
        }

        setSaving(true)
        setErrorMessage('')

        try {
            const category = await onCreateCategory(name)
            onChange(category.id)
            setCategoryName('')
            setIsCreating(false)
        } catch (error) {
            setErrorMessage(error instanceof Error ? error.message : 'Unable to create category.')
        } finally {
            setSaving(false)
        }
    }

    const handleCancel = () => {
        setCategoryName('')
        setErrorMessage('')
        setIsCreating(false)
    }

    if (isCreating) {
        return (
            <div className="category-create-control">
                <div className="category-create-row">
                    <input
                        maxLength={80}
                        value={categoryName}
                        onChange={(event) => setCategoryName(event.target.value)}
                        placeholder="e.g. Tech Products"
                        aria-label="New category name"
                        autoFocus
                        disabled={saving || disabled}
                    />
                    <button type="button" className="compact-button" onClick={() => void handleCreate()} disabled={saving || disabled}>
                        {saving ? 'Adding...' : 'Add'}
                    </button>
                    <button type="button" className="compact-button secondary-compact-button" onClick={handleCancel} disabled={saving}>
                        Cancel
                    </button>
                </div>
                {errorMessage && <span className="category-control-message error-message" role="alert">{errorMessage}</span>}
            </div>
        )
    }

    return (
        <div className="category-select-control">
            <select value={value} onChange={(event) => onChange(event.target.value)} disabled={disabled}>
                <option value="">No category</option>
                {categories.map((category) => (
                    <option key={category.id} value={category.id}>{category.name}</option>
                ))}
            </select>
            <button type="button" className="compact-button" onClick={() => setIsCreating(true)} disabled={disabled}>
                New category
            </button>
        </div>
    )
}

export default CategorySelect
