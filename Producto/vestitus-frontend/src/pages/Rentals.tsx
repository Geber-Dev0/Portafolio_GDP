import { useState, useEffect } from 'react'
import { rentalService } from '../services/rentals.service'
import { useAuth } from '../contexts/useAuth'
import type { Rental } from '../types'
import { CalendarDays, User, Filter, XCircle } from 'lucide-react'

const statuses = ['', 'active', 'completed', 'cancelled'] as const
const statusLabels: Record<string, string> = { active: 'Activo', completed: 'Completado', cancelled: 'Cancelado' }

function normalizeStatus(s: string): Rental['status'] {
  return (s === 'confirmed' ? 'active' : s) as Rental['status']
}

export default function Rentals() {
  const { clientId, isEmployee } = useAuth()
  const [rentals, setRentals] = useState<Rental[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [showMineOnly, setShowMineOnly] = useState(false)
  const [cancelling, setCancelling] = useState<string | null>(null)

  const load = () => {
    const req = isEmployee ? rentalService.getAll() : rentalService.getSelf()
    req
      .then(data => setRentals(data.map(r => ({ ...r, status: normalizeStatus(r.status) })).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())))
      .catch((err) => setError(err?.response?.data?.message || 'Error al cargar arriendos'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const handleCancel = async (id: string) => {
    setCancelling(id)
    try {
      if (isEmployee) {
        await rentalService.update(id, { status: 'cancelled' })
      } else {
        await rentalService.cancelSelf(id)
      }
      load()
    } catch {
      setError('Error al cancelar el arriendo')
    } finally {
      setCancelling(null)
    }
  }

  const filtered = rentals.filter(r => {
    if (statusFilter && r.status !== statusFilter) return false
    if (showMineOnly && clientId && r.client_id !== clientId) return false
    return true
  })

  if (loading) return <div className="flex justify-center py-32"><div className="animate-spin h-6 w-6 border-2 border-[var(--gold)] border-t-transparent rounded-full" /></div>

  if (error) return (
    <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
      <div className="text-center py-20 bg-[var(--card)] rounded-2xl border border-[var(--border)]">
        <p className="text-red-600 text-sm">{error}</p>
      </div>
    </div>
  )

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
      <div className="mb-8">
        <span className="season-label text-[var(--gold)]">Historial</span>
        <h1 className="font-serif text-4xl md:text-5xl text-[var(--text)] mt-2 flex items-center gap-3">
          <CalendarDays className="h-8 w-8 text-[var(--gold)]" /> Mis Arriendos
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
        {clientId && (
          <button onClick={() => setShowMineOnly(!showMineOnly)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs tracking-[0.1em] uppercase border transition-colors ${showMineOnly ? 'bg-[var(--gold)]/20 text-[var(--gold-dark)] border-[var(--gold)]' : 'border-[var(--border)] text-[var(--muted)] hover:text-[var(--text)]'}`}>
            <User className="h-3 w-3" /> Solo míos
          </button>
        )}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-20 bg-[var(--card)] rounded-2xl border border-[var(--border)]">
          <CalendarDays className="h-10 w-10 text-[var(--muted)] mx-auto mb-4" />
          <p className="text-[var(--muted)]">{statusFilter ? 'No hay arriendos con ese estado.' : 'No tienes arriendos registrados.'}</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((rental) => (
            <div key={rental.id} className="bg-[var(--card)] rounded-2xl border border-[var(--border)] p-6 hover-lift">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-serif text-lg text-[var(--text)]">{rental.product?.name || 'Producto'}</h3>
                  <p className="text-xs text-[var(--muted)] mt-1 tracking-wide">
                    {new Date(rental.start_date).toLocaleDateString()} — {new Date(rental.end_date).toLocaleDateString()}
                  </p>
                  <p className="text-xs text-[var(--muted)] mt-0.5 tracking-wide">Período: {rental.period_type}</p>
                  {rental.client?.name && (
                    <p className="text-xs text-[var(--muted)] mt-0.5 tracking-wide">Cliente: {rental.client.name}</p>
                  )}
                </div>
                <div className="text-right">
                  <span className={`badge ${rental.status === 'active' ? 'bg-green-100 text-green-800' : rental.status === 'completed' ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800'}`}>
                    {statusLabels[rental.status] || rental.status}
                  </span>
                  {rental.status === 'active' && (
                    <button onClick={() => handleCancel(rental.id)} disabled={cancelling === rental.id}
                      className="block ml-auto mt-2 text-[10px] tracking-[0.1em] uppercase text-red-600 hover:text-red-800 transition-colors disabled:opacity-50 flex items-center gap-1">
                      <XCircle className="h-3 w-3" /> {cancelling === rental.id ? 'Cancelando…' : 'Cancelar'}
                    </button>
                  )}
                  <p className="price text-lg font-medium text-[var(--text)] mt-2">${rental.rental_price?.toLocaleString('es-CL')}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
