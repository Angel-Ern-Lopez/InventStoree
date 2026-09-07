import { useState } from 'react'
import type { FormEvent } from 'react'

type CategoryFormProps = {
    saving: boolean
    errorMessage: string
    successMessage: string
    onCreate: (name: string) => Promise<void>
}

const CategoryForm = ({ saving, errorMessage, successMessage, onCreate }: CategoryFormProps) => {
    const [name, setName] = useState('')
    const [localError, setLocalError] = useState('')

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        const trimmedName = name.trim()
        if (!trimmedName) return

        setLocalError('')

        try {
            await onCreate(trimmedName)
            setName('')
        } catch (error) {
            setLocalError(error instanceof Error ? error.message : 'Unable to create category.')
        }
    }

    return (
        <section className="settings-panel" aria-labelledby="add-category-heading">
            <p className="eyebrow">Organize inventory</p>
            <h2 id="add-category-heading">Add a category</h2>
            <p className="panel-description">Create labels that make your product catalog easier to browse.</p>
            <form className="category-settings-form" onSubmit={handleSubmit}>
                <label>
                    Category name
                    <input
                        required
                        maxLength={80}
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                        placeholder="e.g. Tech Products"
                        disabled={saving}
                    />
                </label>
                {(localError || errorMessage) && <p className="form-message error-message" role="alert">{localError || errorMessage}</p>}
                {successMessage && <p className="form-message success-message" role="status">{successMessage}</p>}
                <button className="primary-button" type="submit" disabled={saving}>
                    {saving ? 'Adding category...' : 'Add category'}
                </button>
            </form>
        </section>
    )
}

export default CategoryForm
