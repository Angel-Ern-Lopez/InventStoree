export type Category = {
    id: string
    name: string
}

export type Product = {
    id: string
    name: string
    sku: string | null
    category_id: string | null
    category_name?: string
    quantity: number
    low_stock_threshold: number
}

export type ProductFormValues = {
    name: string
    sku: string
    categoryId: string
    quantity: string
    lowStockThreshold: string
}
