import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/useAuth'
import { clientService } from '../services/clients.service'
import { salesService } from '../services/sales.service'
import type { Client, Sale } from '../types'
import { User, ShoppingBag, CalendarDays, Mail, Shield, FileText, Package } from 'lucide-react'

const roleLabels: Record<string, string> = {
  admin: 'Administrador',
  employee: 'Empleado',
  customer: 'Cliente',
}

export default function Profile() {
  const { user, clientId } = useAuth()
  const [client, setClient] = useState<Client | null>(null)
  const [sales, setSales] = useState<Sale[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        if (clientId) {
          const [clientData, allSales] = await Promise.all([
            clientService.getById(clientId),
            salesService.getAll(),
          ])
          setClient(clientData)
          setSales(allSales.filter(s => s.client_id === clientId))
        }
      } catch {} finally {
        setLoading(false)
      }
    }
    load()
  }, [clientId])

  if (loading) return <div className="flex justify-center py-32"><div className="animate-spin h-6 w-6 border-2 border-[var(--gold)] border-t-transparent rounded-full" /></div>

  return (
    <div className="max-w-3xl mx-auto px-6 lg:px-8 py-16">
      <div className="mb-12">
        <span className="season-label text-[var(--gold)]">Perfil</span>
        <h1 className="font-serif text-4xl md:text-5xl text-[var(--text)] mt-2 flex items-center gap-3">
          <User className="h-8 w-8 text-[var(--gold)]" /> Mi Cuenta
        </h1>
      </div>

      <div className="space-y-6">
        <div className="bg-[var(--card)] rounded-2xl border border-[var(--border)] p-6">
          <h2 className="font-serif text-lg text-[var(--text)] mb-4">Información de Usuario</h2>
          <div className="space-y-3 text-sm">
            <div className="flex items-center gap-3">
              <Mail className="h-4 w-4 text-[var(--muted)]" />
              <span className="text-[var(--text)]">{user?.email}</span>
            </div>
            <div className="flex items-center gap-3">
              <Shield className="h-4 w-4 text-[var(--muted)]" />
              <span className="text-[var(--text)]">{roleLabels[user?.role || ''] || user?.role}</span>
            </div>
          </div>
        </div>

        {client && (
          <div className="bg-[var(--card)] rounded-2xl border border-[var(--border)] p-6">
            <h2 className="font-serif text-lg text-[var(--text)] mb-4">Datos de Facturación</h2>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-3">
                <User className="h-4 w-4 text-[var(--muted)]" />
                <span className="text-[var(--text)]">{client.name}</span>
              </div>
              <div className="flex items-center gap-3">
                <FileText className="h-4 w-4 text-[var(--muted)]" />
                <span className="text-[var(--text)]">{client.client_type === 'natural' ? 'Persona Natural' : client.client_type === 'empresa' ? 'Empresa' : 'Agrupación Cultural'}</span>
              </div>
              {client.tax_document && (
                <div className="flex items-center gap-3">
                  <FileText className="h-4 w-4 text-[var(--muted)]" />
                  <span className="text-[var(--text)]">RUT: {client.tax_document}</span>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="flex gap-4">
          <Link to="/rentals"
            className="flex items-center gap-2 bg-[var(--card)] rounded-2xl border border-[var(--border)] p-5 hover-lift transition-all flex-1">
            <CalendarDays className="h-6 w-6 text-[var(--gold)]" />
            <div>
              <p className="text-sm font-medium text-[var(--text)]">Mis Arriendos</p>
              <p className="text-xs text-[var(--muted)]">Ver historial de arriendos</p>
            </div>
          </Link>
          <Link to="/products"
            className="flex items-center gap-2 bg-[var(--card)] rounded-2xl border border-[var(--border)] p-5 hover-lift transition-all flex-1">
            <Package className="h-6 w-6 text-[var(--gold)]" />
            <div>
              <p className="text-sm font-medium text-[var(--text)]">Catálogo</p>
              <p className="text-xs text-[var(--muted)]">Seguir comprando</p>
            </div>
          </Link>
        </div>

        <div className="bg-[var(--card)] rounded-2xl border border-[var(--border)] p-6">
          <h2 className="font-serif text-lg text-[var(--text)] mb-4 flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-[var(--gold)]" /> Mis Compras
          </h2>
          {sales.length === 0 ? (
            <div className="text-center py-10">
              <ShoppingBag className="h-10 w-10 text-[var(--muted)] mx-auto mb-4" />
              <p className="text-sm text-[var(--muted)]">No tienes compras registradas.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {sales.map((sale) => (
                <div key={sale.id} className="flex items-center gap-4 p-4 bg-[var(--bg)] rounded-xl">
                  <div className="w-12 h-14 rounded-lg overflow-hidden bg-[var(--surface)] flex-shrink-0">
                    {sale.product?.images?.[0] && (
                      <img src={sale.product.images[0].url} alt="" className="w-full h-full object-cover" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[var(--text)]">{sale.product?.name || 'Producto'}</p>
                    <p className="text-xs text-[var(--muted)]">{new Date(sale.created_at).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-[var(--text)]">${(sale.sale_price * (sale.quantity || 1)).toLocaleString('es-CL')}</p>
                    {sale.quantity && sale.quantity > 1 && <p className="text-[10px] text-[var(--muted)]">×{sale.quantity}</p>}
                    <span className={`badge text-[10px] ${sale.payment_status === 'paid' ? 'bg-green-100 text-green-800' : sale.payment_status === 'cancelled' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'}`}>
                      {sale.payment_status === 'paid' ? 'Pagado' : sale.payment_status === 'cancelled' ? 'Cancelado' : 'Pendiente'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
