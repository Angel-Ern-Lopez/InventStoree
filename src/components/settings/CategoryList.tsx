import { useState } from 'react'
import type { Category } from '../../types/product'

type CategoryListProps = {
    categories: Category[]
    loading: boolean
    loadError: string
    savingId: string | null
    deletingId: string | null
    onRename: (category: Category, name: string) => Promise<void>
    onDelete: (category: Category) => Promise<void>
}

const CategoryList = ({
    categories,
    loading,
    loadError,
    savingId,
    deletingId,
    onRename,
    onDelete,
}: CategoryListProps) => {
    const [editingId, setEditingId] = useState<string | null>(null)
    const [editingName, setEditingName] = useState('')
    const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)
    const [searchTerm, setSearchTerm] = useState('')

    const normalizedSearchTerm = searchTerm.trim().toLowerCase()
    const filteredCategories = categories.filter((category) => (
        !normalizedSearchTerm || category.name.toLowerCase().includes(normalizedSearchTerm)
    ))

    const startEditing = (category: Category) => {
        setEditingId(category.id)
        setEditingName(category.name)
        setConfirmDeleteId(null)
    }

    const cancelEditing = () => {
        setEditingId(null)
        setEditingName('')
    }

    const saveRename = async (category: Category) => {
        const trimmedName = editingName.trim()
        if (!trimmedName) return

        await onRename(category, trimmedName)
        cancelEditing()
    }

    const confirmDelete = async (category: Category) => {
        await onDelete(category)
        setConfirmDeleteId(null)
    }

    return (
        <section className="settings-panel category-list-panel" aria-labelledby="category-list-heading">
            <div className="panel-heading">
                <div>
                    <p className="eyebrow">Your catalog</p>
                    <h2 id="category-list-heading">Categories</h2>
                </div>
                <span className="product-count">{filteredCategories.length}</span>
            </div>

            {!loading && !loadError && categories.length > 0 && (
                <label className="category-search-field">
                    <span className="sr-only">Search categories</span>
                    <input
                        type="search"
                        value={searchTerm}
                        onChange={(event) => setSearchTerm(event.target.value)}
                        placeholder="Search categories"
                    />
                </label>
            )}

            {loading && <p className="empty-state">Loading categories...</p>}
            {!loading && loadError && <p className="empty-state error-message">Unable to load categories.</p>}
            {!loading && !loadError && categories.length === 0 && (
                <div className="empty-state">
                    <span className="empty-state-icon" aria-hidden="true">+</span>
                    <h3>No categories yet</h3>
                    <p>Create a category to organize your products.</p>
                </div>
            )}
            {!loading && !loadError && categories.length > 0 && filteredCategories.length === 0 && (
                <div className="empty-state category-search-empty">
                    <h3>No matching categories</h3>
                    <p>Try a different search.</p>
                </div>
            )}
            {!loading && !loadError && filteredCategories.length > 0 && (
                <div className="category-settings-list">
                    {filteredCategories.map((category) => (
                        <article className="category-settings-row" key={category.id}>
                            {editingId === category.id ? (
                                <div className="category-edit-control">
                                    <input
                                        maxLength={80}
                                        value={editingName}
                                        onChange={(event) => setEditingName(event.target.value)}
                                        aria-label={`Rename ${category.name}`}
                                        autoFocus
                                        disabled={savingId === category.id}
                                    />
                                    <button className="text-button" type="button" onClick={() => void saveRename(category)} disabled={savingId === category.id}>
                                        {savingId === category.id ? 'Saving...' : 'Save'}
                                    </button>
                                    <button className="text-button" type="button" onClick={cancelEditing} disabled={savingId === category.id}>
                                        Cancel
                                    </button>
                                </div>
                            ) : confirmDeleteId === category.id ? (
                                <div className="category-delete-control">
                                    <span>Delete {category.name}?</span>
                                    <button className="text-button" type="button" onClick={() => void confirmDelete(category)} disabled={deletingId === category.id}>
                                        {deletingId === category.id ? 'Deleting...' : 'Delete'}
                                    </button>
                                    <button className="text-button" type="button" onClick={() => setConfirmDeleteId(null)} disabled={deletingId === category.id}>
                                        Cancel
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <span className="category-name">{category.name}</span>
                                    <div className="category-row-actions">
                                        <button className="text-button" type="button" onClick={() => startEditing(category)}>Rename</button>
                                        <button className="text-button danger-button" type="button" onClick={() => setConfirmDeleteId(category.id)}>Delete</button>
                                    </div>
                                </>
                            )}
                        </article>
                    ))}
                </div>
            )}
        </section>
    )
}

export default CategoryList
