import type { ChangeEvent, FormEvent } from 'react'
import type { ProductFormValues } from '../../types/product'

type ProductFormProps = {
    values: ProductFormValues
    isEditing: boolean
    saving: boolean
    errorMessage: string
    successMessage: string
    onChange: (field: keyof ProductFormValues, value: string) => void
    onSubmit: (event: FormEvent<HTMLFormElement>) => void
    onCancel: () => void
}

const ProductForm = ({
    values,
    isEditing,
    saving,
    errorMessage,
    successMessage,
    onChange,
    onSubmit,
    onCancel,
}: ProductFormProps) => {
    const handleChange = (field: keyof ProductFormValues) => (event: ChangeEvent<HTMLInputElement>) => {
        onChange(field, event.target.value)
    }

    return (
        <section className="product-form-panel" aria-labelledby="add-product-heading">
            <p className="eyebrow">{isEditing ? 'Update item' : 'Get started'}</p>
            <h2 id="add-product-heading">{isEditing ? 'Edit product' : 'Add a product'}</h2>
            <p className="panel-description">
                {isEditing ? 'Update this product\'s details and stock settings.' : 'Create your first inventory item or add another product to your catalog.'}
            </p>

            <form onSubmit={onSubmit}>
                <label>
                    Product name
                    <input
                        required
                        value={values.name}
                        onChange={handleChange('name')}
                        placeholder="e.g. Wireless keyboard"
                    />
                </label>

                <label>
                    SKU <span className="optional-label">Optional</span>
                    <input
                        value={values.sku}
                        onChange={handleChange('sku')}
                        placeholder="e.g. KEY-001"
                    />
                </label>

                <div className="form-row">
                    <label>
                        Starting quantity
                        <input
                            type="number"
                            min="0"
                            step="1"
                            value={values.quantity}
                            onChange={handleChange('quantity')}
                        />
                    </label>
                    <label>
                        Low-stock alert
                        <input
                            type="number"
                            min="0"
                            step="1"
                            value={values.lowStockThreshold}
                            onChange={handleChange('lowStockThreshold')}
                        />
                    </label>
                </div>

                {errorMessage && <p className="form-message error-message" role="alert">{errorMessage}</p>}
                {successMessage && <p className="form-message success-message" role="status">{successMessage}</p>}

                <button className="primary-button" type="submit" disabled={saving}>
                    {saving ? (isEditing ? 'Saving changes...' : 'Adding product...') : (isEditing ? 'Save changes' : 'Add product')}
                </button>
                {isEditing && (
                    <button className="secondary-button" type="button" onClick={onCancel} disabled={saving}>
                        Cancel editing
                    </button>
                )}
            </form>
        </section>
    )
}

export default ProductForm
