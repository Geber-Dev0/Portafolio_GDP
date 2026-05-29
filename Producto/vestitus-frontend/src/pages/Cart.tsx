import { Link } from 'react-router-dom'
import { useCart } from '../contexts/CartContext'
import { ShoppingBag, Trash2, ArrowLeft, Minus, Plus, AlertCircle } from 'lucide-react'

export default function Cart() {
  const { items, removeItem, updateItem, clearCart, total, itemCount } = useCart()

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="text-center py-20">
          <ShoppingBag className="h-12 w-12 text-[var(--muted)] mx-auto mb-4" />
          <h1 className="font-serif text-3xl text-[var(--text)] mb-2">Tu carrito está vacío</h1>
          <p className="text-[var(--muted)] mb-8">Agrega productos para continuar.</p>
          <Link to="/products" className="inline-block bg-[var(--text)] text-white px-8 py-3 rounded-full text-xs tracking-[0.1em] uppercase hover:bg-[var(--gold-dark)] transition-colors">
            Ver Catálogo
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
      <Link to="/products" className="inline-flex items-center gap-2 text-xs tracking-[0.1em] uppercase text-[var(--muted)] hover:text-[var(--text)] transition-colors mb-8">
        <ArrowLeft className="h-3 w-3" /> Continuar Comprando
      </Link>

      <div className="flex items-center justify-between mb-12">
        <div>
          <span className="season-label text-[var(--gold)]">Carrito</span>
          <h1 className="font-serif text-4xl md:text-5xl text-[var(--text)] mt-2 flex items-center gap-3">
            <ShoppingBag className="h-8 w-8 text-[var(--gold)]" /> {itemCount} {itemCount === 1 ? 'prenda' : 'prendas'}
          </h1>
        </div>
        <button onClick={clearCart} className="text-xs tracking-[0.1em] uppercase text-[var(--muted)] hover:text-red-600 transition-colors">
          Vaciar Carrito
        </button>
      </div>

      <div className="space-y-4 mb-12">
        {items.map((item) => (
          <div key={item.id} className="bg-[var(--card)] rounded-2xl border border-[var(--border)] p-6 flex items-start gap-6">
            <div className="w-24 h-32 rounded-xl overflow-hidden bg-[var(--bg)] flex-shrink-0">
              {item.product.images?.[0] ? (
                <img src={item.product.images[0].url} alt={item.product.name} className="w-full h-full object-cover" />
              ) : (
                <div className="flex items-center justify-center h-full text-[var(--muted)] text-xs">Sin img</div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <Link to={`/products/${item.product.id}`} className="font-serif text-lg text-[var(--text)] hover:text-[var(--gold-dark)] transition-colors">
                {item.product.name}
              </Link>
              <span className={`ml-3 inline-block badge text-xs ${item.type === 'rent' ? 'bg-[var(--gold)]/20 text-[var(--gold-dark)]' : 'bg-[var(--text)]/10 text-[var(--text)]'}`}>
                {item.type === 'rent' ? 'Arriendo' : 'Compra'}
              </span>
              <p className="text-xs text-[var(--muted)] mt-1 capitalize">{item.product.category}</p>

              {item.type === 'rent' && (
                <div className="flex flex-wrap items-center gap-4 mt-3">
                  <div>
                    <label className="text-xs text-[var(--muted)] block">Desde</label>
                    <input type="date" value={item.startDate || ''} onChange={(e) => updateItem(item.id, { startDate: e.target.value })}
                      className="bg-[var(--surface)] border border-[var(--border)] rounded-full px-3 py-1.5 text-xs outline-none focus:ring-2 focus:ring-[var(--gold)] text-[var(--text)] mt-1" />
                  </div>
                  <div>
                    <label className="text-xs text-[var(--muted)] block">Hasta</label>
                    <input type="date" value={item.endDate || ''} onChange={(e) => updateItem(item.id, { endDate: e.target.value })}
                      className="bg-[var(--surface)] border border-[var(--border)] rounded-full px-3 py-1.5 text-xs outline-none focus:ring-2 focus:ring-[var(--gold)] text-[var(--text)] mt-1" />
                  </div>
                  <div>
                    <label className="text-xs text-[var(--muted)] block">Período</label>
                    <select value={item.periodType || 'days'} onChange={(e) => updateItem(item.id, { periodType: e.target.value as 'days' | 'weeks' | 'months' })}
                      className="bg-[var(--surface)] border border-[var(--border)] rounded-full px-3 py-1.5 text-xs outline-none focus:ring-2 focus:ring-[var(--gold)] text-[var(--text)] mt-1">
                      <option value="days">Días</option>
                      <option value="weeks">Semanas</option>
                      <option value="months">Meses</option>
                    </select>
                  </div>
                </div>
              )}

              {item.type === 'sale' && (
                <div className="flex items-center gap-3 mt-3">
                  <span className="text-xs text-[var(--muted)]">Cantidad:</span>
                  <div className="flex items-center gap-2">
                    <button onClick={() => updateItem(item.id, { quantity: Math.max(1, item.quantity - 1) })}
                      className="p-1 border border-[var(--border)] rounded-full hover:bg-[var(--surface)] transition-colors">
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="text-sm text-[var(--text)] w-6 text-center">{item.quantity}</span>
                    <button onClick={() => updateItem(item.id, { quantity: Math.min(item.product.stock, item.quantity + 1) })}
                      disabled={item.quantity >= item.product.stock}
                      className="p-1 border border-[var(--border)] rounded-full hover:bg-[var(--surface)] transition-colors disabled:opacity-30">
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              )}
            </div>
            <div className="text-right flex-shrink-0">
              <p className="price text-lg font-medium text-[var(--text)]">${(item.product.price * item.quantity).toLocaleString('es-CL')}</p>
              <button onClick={() => removeItem(item.id)} className="mt-2 text-xs text-[var(--muted)] hover:text-red-600 transition-colors">
                <Trash2 className="h-4 w-4 inline" /> Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-[var(--card)] rounded-2xl border border-[var(--border)] p-6">
        <div className="flex items-center justify-between mb-6">
          <span className="text-sm text-[var(--muted)]">Subtotal</span>
          <span className="price text-2xl font-medium text-[var(--text)]">${total.toLocaleString('es-CL')}</span>
        </div>
        {items.some(i => i.type === 'rent' && (!i.startDate || !i.endDate)) && (
          <div className="flex items-start gap-2 text-xs text-amber-700 bg-amber-50 p-3 rounded-xl mb-4">
            <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
            <span>Hay prendas en arriendo sin fechas seleccionadas. Complétalas antes de pagar.</span>
          </div>
        )}
        <Link to="/checkout"
          className="block w-full bg-[var(--text)] text-white py-3 rounded-full text-sm tracking-[0.1em] uppercase text-center hover:bg-[var(--gold-dark)] transition-colors">
          Ir a Pagar
        </Link>
      </div>
    </div>
  )
}
