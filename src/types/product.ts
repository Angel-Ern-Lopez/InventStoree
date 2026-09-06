export type Product = {
    id: string
    name: string
    sku: string | null
    quantity: number
    low_stock_threshold: number
}

export type ProductFormValues = {
    name: string
    sku: string
    quantity: string
    lowStockThreshold: string
}
