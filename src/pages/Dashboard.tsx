import { useEffect, useState } from 'react'
import ProductSnapshot from '../components/dashboard/ProductSnapshot'
import StatCard from '../components/dashboard/StatCard'
import { supabase } from '../lib/supabase'
import type { Product } from '../types/product'

type DashboardProduct = Product & {
    updated_at: string | null
}

const Dashboard = () => {
    const [products, setProducts] = useState<DashboardProduct[]>([])
    const [categoryCount, setCategoryCount] = useState(0)
    const [loading, setLoading] = useState(true)
    const [errorMessage, setErrorMessage] = useState('')

    useEffect(() => {
        const loadDashboard = async () => {
            setLoading(true)
            setErrorMessage('')

            const [{ data: productData, error: productError }, { count, error: categoryError }] = await Promise.all([
                supabase
                    .from('products')
                    .select('id, name, sku, category_id, quantity, low_stock_threshold, updated_at')
                    .order('updated_at', { ascending: false }),
                supabase
                    .from('categories')
                    .select('id', { count: 'exact', head: true }),
            ])

            if (productError || categoryError) {
                setErrorMessage(productError?.message ?? categoryError?.message ?? 'Unable to load dashboard data.')
            } else {
                setProducts(productData ?? [])
                setCategoryCount(count ?? 0)
            }

            setLoading(false)
        }

        void loadDashboard()
    }, [])

    const totalQuantity = products.reduce((total, product) => total + product.quantity, 0)
    const lowStockProducts = products.filter((product) => product.quantity <= product.low_stock_threshold)
    const recentProducts = products.slice(0, 5)

    return (
        <div className="dashboard-page">
            <header className="dashboard-header">
                <p className="eyebrow">Overview</p>
                <h1>Dashboard</h1>
                <p className="products-description">A quick view of your inventory health.</p>
            </header>

            {loading && <p className="dashboard-message">Loading your inventory...</p>}
            {!loading && errorMessage && <p className="dashboard-message error-message" role="alert">{errorMessage}</p>}
            {!loading && !errorMessage && (
                <>
                    <section className="dashboard-stats" aria-label="Inventory summary">
                        <StatCard label="Products" value={products.length} detail="Items in your catalog" tone="blue" />
                        <StatCard label="Units in stock" value={totalQuantity} detail="Across all products" tone="green" />
                        <StatCard label="Low stock" value={lowStockProducts.length} detail="Need your attention" tone="amber" />
                        <StatCard label="Categories" value={categoryCount} detail="Ways to organize stock" tone="neutral" />
                    </section>

                    <section className="dashboard-snapshot-grid">
                        <ProductSnapshot
                            title="Recently updated"
                            products={recentProducts}
                            emptyMessage="Products you add will appear here."
                        />
                        <ProductSnapshot
                            title="Low-stock products"
                            products={lowStockProducts}
                            emptyMessage="Your inventory is fully stocked."
                            showStatus
                            scrollable
                        />
                    </section>
                </>
            )}
        </div>
    )
}

export default Dashboard
