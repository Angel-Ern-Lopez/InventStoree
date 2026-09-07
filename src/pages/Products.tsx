import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import ProductForm from '../components/products/ProductForm'
import ProductList from '../components/products/ProductList'
import { supabase } from '../lib/supabase'
import type { Category, Product, ProductFormValues } from '../types/product'

const initialForm: ProductFormValues = {
    name: '',
    sku: '',
    categoryId: '',
    quantity: '0',
    lowStockThreshold: '10',
}

const Products = () => {
    const [products, setProducts] = useState<Product[]>([])
    const [categories, setCategories] = useState<Category[]>([])
    const [form, setForm] = useState<ProductFormValues>(initialForm)
    const [editingProductId, setEditingProductId] = useState<string | null>(null)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [deletingProductId, setDeletingProductId] = useState<string | null>(null)
    const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)
    const [errorMessage, setErrorMessage] = useState('')
    const [loadError, setLoadError] = useState('')
    const [successMessage, setSuccessMessage] = useState('')
    const [searchTerm, setSearchTerm] = useState('')
    const [categoryFilter, setCategoryFilter] = useState('')
    const [lowStockOnly, setLowStockOnly] = useState(false)

    const loadProducts = async () => {
        setLoading(true)
        setLoadError('')

        const [{ data: productData, error: productError }, { data: categoryData, error: categoryError }] = await Promise.all([
            supabase
                .from('products')
                .select('id, name, sku, category_id, quantity, low_stock_threshold')
                .order('created_at', { ascending: false }),
            supabase
                .from('categories')
                .select('id, name')
                .order('name', { ascending: true }),
        ])

        if (productError) {
            setLoadError(productError.message)
        } else {
            const availableCategories = categoryError ? [] : (categoryData ?? [])
            setCategories(availableCategories)
            const categoryNames = new Map(availableCategories.map((category) => [category.id, category.name]))
            setProducts((productData ?? []).map((product) => ({
                ...product,
                category_name: product.category_id ? categoryNames.get(product.category_id) : undefined,
            })))
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

    const handleCreateCategory = async (name: string): Promise<Category> => {
        const { data, error } = await supabase
            .from('categories')
            .insert({ name })
            .select('id, name')
            .single()

        if (error) {
            throw new Error(
                error.code === '23505'
                    ? 'You already have a category with that name.'
                    : error.message,
            )
        }

        if (!data) {
            throw new Error('The category was not created.')
        }

        setCategories((currentCategories) => (
            [...currentCategories, data].sort((first, second) => first.name.localeCompare(second.name))
        ))

        return data
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
            category_id: form.categoryId || null,
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
            categoryId: product.category_id ?? '',
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

    const handleAdjustQuantity = async (productId: string, amount: number) => {
        const { data, error } = await supabase.rpc('adjust_product_quantity', {
            product_id: productId,
            adjustment_amount: amount,
        })

        if (error) {
            throw new Error(error.message)
        }

        if (!data) {
            throw new Error('The quantity was not updated.')
        }

        setProducts((currentProducts) => currentProducts.map((product) => (
            product.id === productId
                ? { ...data as Product, category_name: product.category_name }
                : product
        )))
    }

    const normalizedSearchTerm = searchTerm.trim().toLowerCase()
    const filteredProducts = products.filter((product) => {
        const matchesSearch = !normalizedSearchTerm
            || product.name.toLowerCase().includes(normalizedSearchTerm)
            || product.sku?.toLowerCase().includes(normalizedSearchTerm)
        const matchesCategory = !categoryFilter || product.category_id === categoryFilter
        const matchesStock = !lowStockOnly || product.quantity <= product.low_stock_threshold

        return matchesSearch && matchesCategory && matchesStock
    })

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
                    categories={categories}
                    onCreateCategory={handleCreateCategory}
                    onChange={handleFormChange}
                    onSubmit={handleSubmit}
                    onCancel={cancelEditing}
                />
                <ProductList
                    products={filteredProducts}
                    loading={loading}
                    loadError={loadError}
                    confirmDeleteId={confirmDeleteId}
                    deletingProductId={deletingProductId}
                    onAdjustQuantity={handleAdjustQuantity}
                    onEdit={startEditing}
                    onRequestDelete={setConfirmDeleteId}
                    onCancelDelete={() => setConfirmDeleteId(null)}
                    onDelete={handleDelete}
                    searchTerm={searchTerm}
                    categoryId={categoryFilter}
                    lowStockOnly={lowStockOnly}
                    categories={categories}
                    onSearchChange={setSearchTerm}
                    onCategoryChange={setCategoryFilter}
                    onLowStockChange={setLowStockOnly}
                />
            </div>
        </div>
    )
}

export default Products
