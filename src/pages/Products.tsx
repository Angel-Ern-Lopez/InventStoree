import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import ProductForm from '../components/products/ProductForm'
import ProductList from '../components/products/ProductList'
import { supabase } from '../lib/supabase'
import type { Product, ProductFormValues } from '../types/product'

const initialForm: ProductFormValues = {
    name: '',
    sku: '',
    quantity: '0',
    lowStockThreshold: '10',
}

const Products = () => {
    const [products, setProducts] = useState<Product[]>([])
    const [form, setForm] = useState<ProductFormValues>(initialForm)
    const [editingProductId, setEditingProductId] = useState<string | null>(null)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [deletingProductId, setDeletingProductId] = useState<string | null>(null)
    const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)
    const [errorMessage, setErrorMessage] = useState('')
    const [loadError, setLoadError] = useState('')
    const [successMessage, setSuccessMessage] = useState('')

    const loadProducts = async () => {
        setLoading(true)
        setLoadError('')

        const { data, error } = await supabase
            .from('products')
            .select('id, name, sku, quantity, low_stock_threshold')
            .order('created_at', { ascending: false })

        if (error) {
            setLoadError(error.message)
        } else {
            setProducts(data ?? [])
        }

        setLoading(false)
    }

    useEffect(() => {
        void loadProducts()
    }, [])

    useEffect(() => {
        if (!successMessage) return

        const timeoutId = window.setTimeout(() => {
            setSuccessMessage('')
        }, 3000)

        return () => window.clearTimeout(timeoutId)
    }, [successMessage])

    const handleFormChange = (field: keyof ProductFormValues, value: string) => {
        setForm((currentForm) => ({ ...currentForm, [field]: value }))
    }

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        setErrorMessage('')
        setSuccessMessage('')

        const quantity = Number(form.quantity)
        const lowStockThreshold = Number(form.lowStockThreshold)

        if (!form.name.trim()) {
            setErrorMessage('Product name is required.')
            return
        }

        if (!Number.isInteger(quantity) || quantity < 0) {
            setErrorMessage('Quantity must be a whole number of zero or more.')
            return
        }

        if (!Number.isInteger(lowStockThreshold) || lowStockThreshold < 0) {
            setErrorMessage('Low-stock threshold must be a whole number of zero or more.')
            return
        }

        setSaving(true)

        const productValues = {
            name: form.name.trim(),
            sku: form.sku.trim() || null,
            quantity,
            low_stock_threshold: lowStockThreshold,
        }

        const { error } = editingProductId
            ? await supabase.from('products').update(productValues).eq('id', editingProductId)
            : await supabase.from('products').insert(productValues)

        if (error) {
            setErrorMessage(
                error.code === '23505'
                    ? 'That SKU is already in use by one of your products.'
                    : error.message,
            )
        } else {
            setForm(initialForm)
            setEditingProductId(null)
            setSuccessMessage(editingProductId ? 'Product updated successfully.' : 'Product added successfully.')
            await loadProducts()
        }

        setSaving(false)
    }

    const startEditing = (product: Product) => {
        setEditingProductId(product.id)
        setForm({
            name: product.name,
            sku: product.sku ?? '',
            quantity: String(product.quantity),
            lowStockThreshold: String(product.low_stock_threshold),
        })
        setErrorMessage('')
        setSuccessMessage('')
    }

    const cancelEditing = () => {
        setEditingProductId(null)
        setForm(initialForm)
        setErrorMessage('')
        setSuccessMessage('')
    }

    const handleDelete = async (product: Product) => {
        setDeletingProductId(product.id)
        setErrorMessage('')
        setSuccessMessage('')

        const { error } = await supabase.from('products').delete().eq('id', product.id)

        if (error) {
            setErrorMessage(error.message)
        } else {
            if (editingProductId === product.id) cancelEditing()
            setSuccessMessage('Product deleted successfully.')
            await loadProducts()
        }

        setDeletingProductId(null)
        setConfirmDeleteId(null)
    }

    return (
        <div className="products-page">
            <header className="products-header">
                <p className="eyebrow">Inventory</p>
                <h1>Products</h1>
                <p className="products-description">Keep your stock organized and up to date.</p>
            </header>

            <div className="products-grid">
                <ProductForm
                    values={form}
                    isEditing={editingProductId !== null}
                    saving={saving}
                    errorMessage={errorMessage}
                    successMessage={successMessage}
                    onChange={handleFormChange}
                    onSubmit={handleSubmit}
                    onCancel={cancelEditing}
                />
                <ProductList
                    products={products}
                    loading={loading}
                    loadError={loadError}
                    confirmDeleteId={confirmDeleteId}
                    deletingProductId={deletingProductId}
                    onEdit={startEditing}
                    onRequestDelete={setConfirmDeleteId}
                    onCancelDelete={() => setConfirmDeleteId(null)}
                    onDelete={handleDelete}
                />
            </div>
        </div>
    )
}

export default Products
