import { useState, useEffect } from 'react'
import { salesService } from '../services/sales.service'
import type { Sale } from '../types'
import { ShoppingBag, Filter } from 'lucide-react'

const statuses = ['', 'paid', 'cancelled'] as const
const statusLabels: Record<string, string> = { paid: 'Pagado', pending: 'Pendiente', cancelled: 'Cancelado' }

export default function Purchases() {
  const [sales, setSales] = useState<Sale[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('')

  useEffect(() => {
    salesService.getSelf()
      .then(data => setSales(data.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const filtered = sales.filter(s => !statusFilter || s.payment_status === statusFilter)

  if (loading) return <div className="flex justify-center py-32"><div className="animate-spin h-6 w-6 border-2 border-[var(--gold)] border-t-transparent rounded-full" /></div>

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
      <div className="mb-8">
        <span className="season-label text-[var(--gold)]">Historial</span>
        <h1 className="font-serif text-4xl md:text-5xl text-[var(--text)] mt-2 flex items-center gap-3">
          <ShoppingBag className="h-8 w-8 text-[var(--gold)]" /> Mis Compras
        </h1>
      </div>

      <div className="flex flex-wrap items-center gap-4 mb-10">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-[var(--muted)]" />
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-[var(--surface)] border border-[var(--border)] rounded-full px-4 py-2 text-xs outline-none focus:ring-2 focus:ring-[var(--gold)] text-[var(--text)]">
            <option value="">Todos los estados</option>
            {statuses.filter(Boolean).map(s => (
              <option key={s} value={s}>{statusLabels[s]}</option>
            ))}
          </select>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-20 bg-[var(--card)] rounded-2xl border border-[var(--border)]">
          <ShoppingBag className="h-10 w-10 text-[var(--muted)] mx-auto mb-4" />
          <p className="text-[var(--muted)]">{statusFilter ? 'No hay compras con ese estado.' : 'No tienes compras registradas.'}</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((sale) => (
            <div key={sale.id} className="bg-[var(--card)] rounded-2xl border border-[var(--border)] p-6 hover-lift">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-20 rounded-lg overflow-hidden bg-[var(--surface)] flex-shrink-0">
                    {sale.product?.images?.[0] && (
                      <img src={sale.product.images[0].url} alt="" className="w-full h-full object-cover" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-serif text-lg text-[var(--text)]">{sale.product?.name || 'Producto'}</h3>
                    <p className="text-xs text-[var(--muted)] mt-1 tracking-wide">
                      {new Date(sale.created_at).toLocaleString('es-CL')}
                    </p>
                    {sale.quantity && sale.quantity > 1 && (
                      <p className="text-xs text-[var(--muted)] mt-0.5 tracking-wide">Cantidad: {sale.quantity}</p>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <span className={`badge ${sale.payment_status === 'paid' ? 'bg-green-100 text-green-800' : sale.payment_status === 'cancelled' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'}`}>
                    {statusLabels[sale.payment_status] || sale.payment_status}
                  </span>
                  <p className="price text-lg font-medium text-[var(--text)] mt-2">${(sale.sale_price * (sale.quantity || 1)).toLocaleString('es-CL')}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
