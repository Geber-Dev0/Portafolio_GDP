import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/useAuth'
import { clientService } from '../services/clients.service'
import type { Client } from '../types'
import { User, ShoppingBag, CalendarDays, Mail, Shield, FileText } from 'lucide-react'

const roleLabels: Record<string, string> = {
  admin: 'Administrador',
  employee: 'Empleado',
  customer: 'Cliente',
}

export default function Profile() {
  const { user } = useAuth()
  const [client, setClient] = useState<Client | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    clientService.getSelf()
      .then(setClient)
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

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
          <Link to="/purchases"
            className="flex items-center gap-2 bg-[var(--card)] rounded-2xl border border-[var(--border)] p-5 hover-lift transition-all flex-1">
            <ShoppingBag className="h-6 w-6 text-[var(--gold)]" />
            <div>
              <p className="text-sm font-medium text-[var(--text)]">Mis Compras</p>
              <p className="text-xs text-[var(--muted)]">Ver historial de compras</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}
