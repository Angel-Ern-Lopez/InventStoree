import type { Product } from '../../types/product'

type ProductSnapshotProps = {
    title: string
    products: Product[]
    emptyMessage: string
    showStatus?: boolean
    scrollable?: boolean
}

const ProductSnapshot = ({ title, products, emptyMessage, showStatus = false, scrollable = false }: ProductSnapshotProps) => {
    return (
        <section className={`dashboard-panel${scrollable ? ' dashboard-panel-scrollable' : ''}`} aria-labelledby={`${title.toLowerCase().replaceAll(' ', '-')}-heading`}>
            <div className="dashboard-panel-heading">
                <h2 id={`${title.toLowerCase().replaceAll(' ', '-')}-heading`}>{title}</h2>
                <span>{products.length}</span>
            </div>
            {products.length === 0 ? (
                <p className="dashboard-empty">{emptyMessage}</p>
            ) : (
                <div className={`dashboard-snapshot-list${scrollable ? ' dashboard-snapshot-scrollable' : ''}`}>
                    {products.map((product) => (
                        <article className="dashboard-snapshot-row" key={product.id}>
                            <div>
                                <h3>{product.name}</h3>
                                <p>{product.sku || 'No SKU assigned'}</p>
                            </div>
                            <div className="dashboard-snapshot-stock">
                                <strong>{product.quantity}</strong>
                                {showStatus && <span>Low stock</span>}
                            </div>
                        </article>
                    ))}
                </div>
            )}
        </section>
    )
}

export default ProductSnapshot
