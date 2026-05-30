import { Link } from 'react-router-dom'
import { useCart } from '../contexts/CartContext'
import { ShoppingBag, Trash2, ArrowLeft, Minus, Plus, AlertCircle, Info } from 'lucide-react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { es } from 'date-fns/locale'

const today = () => new Date().toISOString().split('T')[0]

function calcRentalDays(start: string, end: string): number {
  if (!start || !end) return 1
  return Math.max(1, Math.ceil((new Date(end).getTime() - new Date(start).getTime()) / (1000 * 60 * 60 * 24)))
}

const addDays = (d: string, n: number) => { const dt = new Date(d); dt.setDate(dt.getDate() + n); return dt.toISOString().split('T')[0] }

function itemPrice(item: { product: { price: number }; type: string; quantity: number; startDate?: string; endDate?: string }): number {
  if (item.type === 'rent') {
    const days = calcRentalDays(item.startDate || '', item.endDate || '')
    return item.product.price * days * item.quantity
  }
  return item.product.price * item.quantity
}

export default function Cart() {
  const { items, removeItem, updateItem, clearCart, itemCount } = useCart()

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
                    <label className="text-xs text-[var(--muted)] block">Inicio</label>
                    <div className="mt-1">
                      <DatePicker
                        locale={es}
                        selected={item.startDate ? new Date(item.startDate) : null}
                        onChange={(d: Date | null) => {
                          if (d) {
                            const sd = d.toISOString().split('T')[0]
                            const ed = item.endDate && sd ? (new Date(item.endDate) <= new Date(sd) ? addDays(sd, calcRentalDays(sd, item.endDate)) : item.endDate) : ''
                            updateItem(item.id, { startDate: sd, endDate: ed || addDays(sd, 1) })
                          }
                        }}
                        minDate={new Date()}
                        placeholderText="Fecha"
                        className="bg-[var(--surface)] border border-[var(--border)] rounded-full px-3 py-1.5 text-xs outline-none focus:ring-2 focus:ring-[var(--gold)] text-[var(--text)] w-[140px]"
                        calendarClassName="modern-calendar"
                        shouldCloseOnSelect
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-[var(--muted)] block">Días</label>
                    <div className="flex items-center gap-2 mt-1">
                      <button type="button"
                        onClick={() => {
                          const sd = item.startDate || today()
                          const cur = calcRentalDays(sd, item.endDate || '')
                          const nd = Math.max(1, cur - 1)
                          updateItem(item.id, { endDate: addDays(sd, nd) })
                        }}
                        className="w-7 h-7 border border-[var(--border)] rounded-full flex items-center justify-center hover:bg-[var(--surface)] transition-colors">
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="text-sm text-[var(--text)] w-6 text-center font-medium">
                        {item.startDate && item.endDate ? calcRentalDays(item.startDate, item.endDate) : '-'}
                      </span>
                      <button type="button"
                        onClick={() => {
                          const sd = item.startDate || today()
                          const cur = calcRentalDays(sd, item.endDate || '')
                          const nd = Math.min(30, cur + 1)
                          updateItem(item.id, { endDate: addDays(sd, nd) })
                        }}
                        className="w-7 h-7 border border-[var(--border)] rounded-full flex items-center justify-center hover:bg-[var(--surface)] transition-colors">
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
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
              <p className="price text-lg font-medium text-[var(--text)]">${itemPrice(item).toLocaleString('es-CL')}</p>
              {item.type === 'rent' && item.startDate && item.endDate && new Date(item.endDate) > new Date(item.startDate) && (
                <p className="text-[10px] text-[var(--muted)] mt-0.5">precio estimado</p>
              )}
              <button onClick={() => removeItem(item.id)} className="mt-2 text-xs text-[var(--muted)] hover:text-red-600 transition-colors">
                <Trash2 className="h-4 w-4 inline" /> Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-[var(--card)] rounded-2xl border border-[var(--border)] p-6">
        {items.some(i => i.type === 'rent') && (
          <div className="flex items-start gap-2 text-xs text-[var(--muted)] mb-4">
            <Info className="h-3 w-3 flex-shrink-0 mt-0.5" />
            <span>Los precios de arriendo son estimados según las fechas seleccionadas.</span>
          </div>
        )}
        <div className="flex items-center justify-between mb-6">
          <span className="text-sm text-[var(--muted)]">Subtotal</span>
          <span className="price text-2xl font-medium text-[var(--text)]">${items.reduce((s, i) => s + itemPrice(i), 0).toLocaleString('es-CL')}</span>
        </div>
        {items.some(i => i.type === 'rent' && (!i.startDate || !i.endDate)) && (
          <div className="flex items-start gap-2 text-xs text-amber-700 bg-amber-50 p-3 rounded-xl mb-4">
            <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
            <span>Hay prendas en arriendo sin fechas seleccionadas. Complétalas antes de pagar.</span>
          </div>
        )}
        {items.some(i => i.type === 'rent' && i.startDate && i.endDate && new Date(i.endDate) <= new Date(i.startDate)) && (
          <div className="flex items-start gap-2 text-xs text-red-700 bg-red-50 p-3 rounded-xl mb-4">
            <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
            <span>Hay arriendos con fechas inválidas (la fecha de término debe ser posterior a la de inicio).</span>
          </div>
        )}
        {(() => {
          const hasInvalidDates = items.some(i => i.type === 'rent' && (!i.startDate || !i.endDate || new Date(i.endDate) <= new Date(i.startDate)))
          return (
            <Link to={hasInvalidDates ? '#' : '/checkout'}
              onClick={(e) => { if (hasInvalidDates) e.preventDefault() }}
              className={`block w-full text-white py-3 rounded-full text-sm tracking-[0.1em] uppercase text-center transition-colors ${hasInvalidDates ? 'bg-[var(--muted)] cursor-not-allowed' : 'bg-[var(--text)] hover:bg-[var(--gold-dark)]'}`}>
              Ir a Pagar
            </Link>
          )
        })()}
      </div>
    </div>
  )
}
