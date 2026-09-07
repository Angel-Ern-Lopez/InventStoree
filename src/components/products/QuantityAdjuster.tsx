import { useEffect, useState } from 'react'

type QuantityAdjusterProps = {
    onAdjust: (amount: number) => Promise<void>
    disabled?: boolean
}

const QuantityAdjuster = ({ onAdjust, disabled = false }: QuantityAdjusterProps) => {
    const [customAmount, setCustomAmount] = useState('1')
    const [adjusting, setAdjusting] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')
    const [successMessage, setSuccessMessage] = useState('')

    useEffect(() => {
        if (!successMessage) return

        const timeoutId = window.setTimeout(() => {
            setSuccessMessage('')
        }, 2000)

        return () => window.clearTimeout(timeoutId)
    }, [successMessage])

    const adjustQuantity = async (amount: number) => {
        if (disabled || adjusting) return

        setErrorMessage('')
        setSuccessMessage('')
        setAdjusting(true)

        try {
            await onAdjust(amount)
            setSuccessMessage('Updated')
        } catch (error) {
            setErrorMessage(error instanceof Error ? error.message : 'Unable to update quantity.')
        } finally {
            setAdjusting(false)
        }
    }

    const applyCustomAmount = (direction: 1 | -1) => {
        const amount = Number(customAmount)

        if (!Number.isInteger(amount) || amount <= 0) {
            setErrorMessage('Enter a whole number greater than zero.')
            return
        }

        void adjustQuantity(direction * amount)
    }

    const isDisabled = disabled || adjusting

    return (
        <div className="quantity-adjuster" aria-label="Adjust product quantity">
            <div className="quantity-quick-actions">
                <button type="button" onClick={() => void adjustQuantity(-1)} disabled={isDisabled}>
                    -1
                </button>
                <button type="button" onClick={() => void adjustQuantity(1)} disabled={isDisabled}>
                    +1
                </button>
                <button type="button" onClick={() => void adjustQuantity(-5)} disabled={isDisabled}>
                    -5
                </button>
                <button type="button" onClick={() => void adjustQuantity(5)} disabled={isDisabled}>
                    +5
                </button>
            </div>
            <div className="quantity-custom-actions">
                <input
                    type="number"
                    min="1"
                    step="1"
                    value={customAmount}
                    onChange={(event) => setCustomAmount(event.target.value)}
                    aria-label="Custom quantity amount"
                    disabled={isDisabled}
                />
                <button type="button" onClick={() => applyCustomAmount(-1)} disabled={isDisabled}>
                    Remove
                </button>
                <button type="button" onClick={() => applyCustomAmount(1)} disabled={isDisabled}>
                    Add
                </button>
            </div>
            {adjusting && <span className="quantity-status">Updating...</span>}
            {!adjusting && successMessage && <span className="quantity-status success-message">{successMessage}</span>}
            {errorMessage && <span className="quantity-status error-message" role="alert">{errorMessage}</span>}
        </div>
    )
}

export default QuantityAdjuster
