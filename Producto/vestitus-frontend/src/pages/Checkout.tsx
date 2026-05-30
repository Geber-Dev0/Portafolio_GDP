import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useCart } from '../contexts/CartContext'
import { useAuth } from '../contexts/useAuth'
import { rentalService } from '../services/rentals.service'
import { salesService } from '../services/sales.service'
import { productService } from '../services/products.service'
import { CheckCircle, AlertCircle, ArrowLeft, ShoppingBag, Info } from 'lucide-react'

function calcRentalDays(start: string, end: string): number {
  if (!start || !end) return 1
  return Math.max(1, Math.ceil((new Date(end).getTime() - new Date(start).getTime()) / (1000 * 60 * 60 * 24)))
}

export default function Checkout() {
  const { items, clearCart } = useCart()
  const { user, clientId } = useAuth()
  const navigate = useNavigate()
  const [processing, setProcessing] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')
  const [hasSales] = useState(() => items.some(i => i.type === 'sale'))
  const [hasRentals] = useState(() => items.some(i => i.type === 'rent'))

  const handleConfirm = async () => {
    setProcessing(true)
    setError('')

    if (!clientId) {
      setError('No se pudo identificar tu perfil de cliente. Intenta cerrar sesión y volver a iniciar.')
      setProcessing(false)
      return
    }

    const rentItems = items.filter(i => i.type === 'rent')
    for (const item of rentItems) {
      if (!item.startDate || !item.endDate) {
        setError(`"${item.product.name}": debe seleccionar fecha de inicio y término`)
        setProcessing(false)
        return
      }
      if (new Date(item.endDate) <= new Date(item.startDate)) {
        setError(`"${item.product.name}": la fecha de término debe ser posterior a la de inicio`)
        setProcessing(false)
        return
      }
    }

    const saleItems = items.filter(i => i.type === 'sale')
    for (const item of saleItems) {
      try {
        const fresh = await productService.getById(item.product.id)
        if ((fresh.stock ?? 0) < item.quantity) {
          setError(`"${item.product.name}": stock insuficiente (disponible: ${fresh.stock ?? 0}, solicitado: ${item.quantity})`)
          setProcessing(false)
          return
        }
      } catch {
        setError(`"${item.product.name}": no se pudo verificar el stock`)
        setProcessing(false)
        return
      }
    }

    for (const item of rentItems) {
      try {
        await rentalService.checkAvailability(item.product.id, item.startDate!, item.endDate!)
      } catch {
        setError(`"${item.product.name}": no disponible en las fechas seleccionadas`)
        setProcessing(false)
        return
      }
    }

    const createdRentals: string[] = []
    const createdSales: string[] = []

    try {
      for (const item of rentItems) {
        const rental = await rentalService.create({
          client_id: clientId,
          product_id: item.product.id,
          start_date: item.startDate || '',
          end_date: item.endDate || '',
          period_type: (item.periodType || 'days') as 'days' | 'weeks' | 'months',
        })
        createdRentals.push(rental.id)
      }
      for (const item of saleItems) {
        const sale = await salesService.create({
          client_id: clientId,
          product_id: item.product.id,
          sale_price: item.product.price,
          quantity: item.quantity,
        })
        createdSales.push(sale.id)
      }
      clearCart()
      setDone(true)
    } catch (err: unknown) {
      for (const id of createdRentals) {
        try { await rentalService.delete(id) } catch {}
      }
      for (const id of createdSales) {
        try { await salesService.delete(id) } catch {}
      }
      const rollbackParts: string[] = []
      if (createdRentals.length > 0) rollbackParts.push('arriendos')
      if (createdSales.length > 0) rollbackParts.push('compras')
      const rollbackMsg = rollbackParts.length > 0 ? ` Se cancelaron ${rollbackParts.join(' y ')} creados previamente.` : ''
      const msg = err && typeof err === 'object' && 'response' in err
        ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
        : 'Error al procesar la orden'
      setError((msg || 'Error al procesar la orden') + rollbackMsg)
    } finally {
      setProcessing(false)
    }
  }

  if (items.length === 0 && !done) { navigate('/cart'); return null }

  if (done) {
    return (
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="text-center py-20">
          <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-6" />
          <h1 className="font-serif text-3xl text-[var(--text)] mb-2">¡Orden Confirmada!</h1>
          <p className="text-[var(--muted)] mb-8">Recibirás un correo con los detalles de tu pedido.</p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Link to="/products" className="bg-[var(--text)] text-white px-8 py-3 rounded-full text-xs tracking-[0.1em] uppercase hover:bg-[var(--gold-dark)] transition-colors">
              Seguir Comprando
            </Link>
            {hasSales && (
              <Link to="/purchases" className="border border-[var(--border)] text-[var(--text)] px-8 py-3 rounded-full text-xs tracking-[0.1em] uppercase hover:bg-[var(--surface)] transition-colors">
                Ir a Mis Compras
              </Link>
            )}
            {hasRentals && (
              <Link to="/rentals" className="border border-[var(--border)] text-[var(--text)] px-8 py-3 rounded-full text-xs tracking-[0.1em] uppercase hover:bg-[var(--surface)] transition-colors">
                Ir a Mis Arriendos
              </Link>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-6 lg:px-8 py-16">
      <Link to="/cart" className="inline-flex items-center gap-2 text-xs tracking-[0.1em] uppercase text-[var(--muted)] hover:text-[var(--text)] transition-colors mb-8">
        <ArrowLeft className="h-3 w-3" /> Volver al Carrito
      </Link>

      <div className="mb-12">
        <span className="season-label text-[var(--gold)]">Checkout</span>
        <h1 className="font-serif text-4xl md:text-5xl text-[var(--text)] mt-2">Confirmar Orden</h1>
      </div>

      {!user && (
        <div className="bg-[var(--surface)] rounded-2xl border border-[var(--border)] p-6 mb-8 text-center">
          <ShoppingBag className="h-8 w-8 text-[var(--muted)] mx-auto mb-3" />
          <p className="text-sm text-[var(--muted)] mb-3">Debes iniciar sesión para completar la compra.</p>
          <Link to="/login" className="inline-block bg-[var(--text)] text-white px-6 py-2.5 rounded-full text-xs tracking-[0.1em] uppercase">
            Ingresar
          </Link>
        </div>
      )}

      <div className="space-y-4 mb-8">
        {items.map((item) => {
          const rentalTotal = item.type === 'rent' && item.startDate
            ? item.product.price * calcRentalDays(item.startDate, item.endDate || '') * item.quantity
            : item.product.price * item.quantity
          return (
          <div key={item.id} className="bg-[var(--card)] rounded-2xl border border-[var(--border)] p-4 flex items-center gap-4">
            <div className="w-16 h-20 rounded-lg overflow-hidden bg-[var(--bg)] flex-shrink-0">
              {item.product.images?.[0] && (
                <img src={item.product.images[0].url} alt="" className="w-full h-full object-cover" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-serif text-[var(--text)]">{item.product.name}</p>
              <span className={`badge text-xs ${item.type === 'rent' ? 'bg-[var(--gold)]/20 text-[var(--gold-dark)]' : 'bg-[var(--text)]/10 text-[var(--text)]'}`}>
                {item.type === 'rent' ? 'Arriendo' : 'Compra'} × {item.quantity}
              </span>
              {item.type === 'rent' && item.startDate && (
                <p className="text-xs text-[var(--muted)] mt-1">
                  {new Date(item.startDate).toLocaleDateString()} — {new Date(item.endDate || '').toLocaleDateString()}
                </p>
              )}
            </div>
            {item.type === 'rent' && item.startDate ? (
              <div className="text-right">
                <p className="price text-[var(--text)] font-medium">${rentalTotal.toLocaleString('es-CL')}</p>
                <p className="text-[10px] text-[var(--muted)] mt-0.5">precio estimado</p>
              </div>
            ) : (
              <p className="price text-[var(--text)] font-medium">${rentalTotal.toLocaleString('es-CL')}</p>
            )}
          </div>
        )})}
      </div>

      <div className="bg-[var(--card)] rounded-2xl border border-[var(--border)] p-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[var(--text)] font-medium">Total estimado</span>
          <span className="price text-2xl font-medium text-[var(--text)]">
            ${items.reduce((sum, item) => {
              if (item.type === 'rent' && item.startDate) {
                return sum + item.product.price * calcRentalDays(item.startDate, item.endDate || '') * item.quantity
              }
              return sum + item.product.price * item.quantity
            }, 0).toLocaleString('es-CL')}
          </span>
        </div>
        {items.some(i => i.type === 'rent') && (
          <div className="flex items-start gap-2 text-xs text-[var(--muted)] mb-4">
            <Info className="h-3 w-3 flex-shrink-0 mt-0.5" />
            <span>Los precios de arriendo son estimados según las fechas seleccionadas.</span>
          </div>
        )}

        {error && (
          <div className="flex items-center gap-2 text-red-600 text-sm mb-4">
            <AlertCircle className="h-4 w-4 flex-shrink-0" /> {error}
          </div>
        )}

        <button onClick={handleConfirm} disabled={processing || !user}
          className="w-full bg-[var(--text)] text-white py-3 rounded-full text-sm tracking-[0.1em] uppercase hover:bg-[var(--gold-dark)] transition-colors disabled:opacity-50">
          {processing ? 'Procesando...' : 'Confirmar Orden'}
        </button>
      </div>
    </div>
  )
}
