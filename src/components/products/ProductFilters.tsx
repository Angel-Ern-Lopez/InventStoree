import type { Category } from '../../types/product'

type ProductFiltersProps = {
    searchTerm: string
    categoryId: string
    lowStockOnly: boolean
    categories: Category[]
    resultCount: number
    onSearchChange: (value: string) => void
    onCategoryChange: (value: string) => void
    onLowStockChange: (value: boolean) => void
}

const ProductFilters = ({
    searchTerm,
    categoryId,
    lowStockOnly,
    categories,
    resultCount,
    onSearchChange,
    onCategoryChange,
    onLowStockChange,
}: ProductFiltersProps) => {
    return (
        <div className="product-filters" aria-label="Product filters">
            <label className="search-field">
                <span className="sr-only">Search products</span>
                <input
                    type="search"
                    value={searchTerm}
                    onChange={(event) => onSearchChange(event.target.value)}
                    placeholder="Search name or SKU"
                />
            </label>
            <label className="filter-field">
                <span className="sr-only">Filter by category</span>
                <select value={categoryId} onChange={(event) => onCategoryChange(event.target.value)}>
                    <option value="">All categories</option>
                    {categories.map((category) => (
                        <option key={category.id} value={category.id}>{category.name}</option>
                    ))}
                </select>
            </label>
            <label className="low-stock-filter">
                <input
                    type="checkbox"
                    checked={lowStockOnly}
                    onChange={(event) => onLowStockChange(event.target.checked)}
                />
                Low stock
            </label>
            <span className="filter-count">{resultCount} shown</span>
        </div>
    )
}

export default ProductFilters
