import type { Product } from '../../types/product'
import QuantityAdjuster from './QuantityAdjuster'

type ProductListProps = {
    products: Product[]
    loading: boolean
    loadError: string
    confirmDeleteId: string | null
    deletingProductId: string | null
    onAdjustQuantity: (productId: string, amount: number) => Promise<void>
    onEdit: (product: Product) => void
    onRequestDelete: (productId: string) => void
    onCancelDelete: () => void
    onDelete: (product: Product) => void
}

const ProductList = ({
    products,
    loading,
    loadError,
    confirmDeleteId,
    deletingProductId,
    onAdjustQuantity,
    onEdit,
    onRequestDelete,
    onCancelDelete,
    onDelete,
}: ProductListProps) => {
    return (
        <section className="product-list-panel" aria-labelledby="product-list-heading">
            <div className="panel-heading">
                <div>
                    <p className="eyebrow">Catalog</p>
                    <h2 id="product-list-heading">Your products</h2>
                </div>
                <span className="product-count">{products.length}</span>
            </div>

            {loading && <p className="empty-state">Loading products...</p>}
            {!loading && loadError && <p className="empty-state error-message">Unable to load products.</p>}
            {!loading && !loadError && products.length === 0 && (
                <div className="empty-state">
                    <span className="empty-state-icon" aria-hidden="true">+</span>
                    <h3>No products yet</h3>
                    <p>Add your first product using the form.</p>
                </div>
            )}
            {!loading && !loadError && products.length > 0 && (
                <div className="product-list">
                    {products.map((product) => (
                        <article className="product-row" key={product.id}>
                            <div>
                                <h3>{product.name}</h3>
                                <p>{product.sku || 'No SKU assigned'}</p>
                            </div>
                            <div className="product-stock">
                                <strong>{product.quantity}</strong>
                                <span className={product.quantity <= product.low_stock_threshold ? 'low-stock' : ''}>
                                    {product.quantity <= product.low_stock_threshold ? 'Low stock' : 'In stock'}
                                </span>
                            </div>
                            <QuantityAdjuster
                                onAdjust={(amount) => onAdjustQuantity(product.id, amount)}
                                disabled={deletingProductId === product.id}
                            />
                            <div className="product-actions">
                                {confirmDeleteId === product.id ? (
                                    <>
                                        <span className="delete-prompt">Delete this product?</span>
                                        <button
                                            type="button"
                                            className="text-button"
                                            onClick={onCancelDelete}
                                            disabled={deletingProductId === product.id}
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="button"
                                            className="text-button danger-button"
                                            onClick={() => onDelete(product)}
                                            disabled={deletingProductId === product.id}
                                        >
                                            {deletingProductId === product.id ? 'Deleting...' : 'Delete'}
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <button type="button" className="text-button" onClick={() => onEdit(product)}>
                                            Edit
                                        </button>
                                        <button
                                            type="button"
                                            className="text-button danger-button"
                                            onClick={() => onRequestDelete(product.id)}
                                        >
                                            Delete
                                        </button>
                                    </>
                                )}
                            </div>
                        </article>
                    ))}
                </div>
            )}
        </section>
    )
}

export default ProductList
