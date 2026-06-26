import { X } from 'lucide-react'
import { Link } from 'react-router-dom'
import { QuantitySelector } from './QuantitySelector'
import { useCart } from './context/CartContext'
import { formatPrice } from '../utils/formatPrice'

export function CartItem({ item }) {
  const { updateQuantity, removeItem } = useCart()

  const hasWholesale = item.wholesalePrice && item.unitsToWholesalePrice
  const usesWholesale = hasWholesale && item.quantity >= item.unitsToWholesalePrice

  return (
    <div className="flex gap-4 p-4 rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)]">
      <Link to={`/producto/${item.slug}`} className="shrink-0">
        <img
          src={item.images[0]}
          alt={item.name}
          className="w-24 h-24 object-cover rounded-xl"
        />
      </Link>

      <div className="flex-1 min-w-0">
        <div className="flex justify-between gap-2">
          <Link
            to={`/producto/${item.slug}`}
            className="font-semibold text-[var(--color-text-primary)] hover:text-[var(--color-primary)] transition-colors line-clamp-1"
          >
            {item.name}
          </Link>
          <button
            onClick={() => removeItem(item.id)}
            className="p-1 text-[var(--color-text-muted)] hover:text-red-500 transition-colors shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-sm text-[var(--color-text-muted)] mt-1">
          {formatPrice(item.unitPrice)} c/u
          {usesWholesale && (
            <span className="ml-2 text-[var(--color-primary)] font-medium">(mayorista)</span>
          )}
        </p>

        <div className="flex items-center justify-between mt-4">
          <QuantitySelector
            quantity={item.quantity}
            onIncrease={() => updateQuantity(item.id, item.quantity + 1)}
            onDecrease={() => updateQuantity(item.id, item.quantity - 1)}
          />

          <span className="text-lg font-bold text-[var(--color-primary)]">
            {formatPrice(item.subtotal)}
          </span>
        </div>
      </div>
    </div>
  )
}
