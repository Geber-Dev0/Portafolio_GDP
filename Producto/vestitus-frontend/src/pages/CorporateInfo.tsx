import { useState, useEffect } from 'react'
import { corporateInfoService } from '../services/corporate-info.service'
import type { CorporateInfo } from '../types'
import { Target, Eye, Building2, MapPin, Phone, Mail } from 'lucide-react'

export default function CorporateInfo() {
  const [info, setInfo] = useState<CorporateInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    corporateInfoService.get()
      .then(setInfo)
      .catch((err) => setError(err?.response?.data?.message || 'Error al cargar información corporativa'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="flex justify-center py-32"><div className="animate-spin h-6 w-6 border-2 border-[var(--gold)] border-t-transparent rounded-full" /></div>

  if (error) return (
    <div className="max-w-4xl mx-auto px-6 lg:px-8 py-16">
      <div className="text-center py-20 bg-[var(--card)] rounded-2xl border border-[var(--border)]">
        <p className="text-red-600 text-sm">{error}</p>
      </div>
    </div>
  )

  return (
    <div className="max-w-4xl mx-auto px-6 lg:px-8 py-16">
      <div className="text-center mb-16">
        <span className="season-label text-[var(--gold)]">Vestitus</span>
        <h1 className="font-serif text-4xl md:text-5xl text-[var(--text)] mt-2">Sobre Nosotros</h1>
      </div>

      {info ? (
        <div className="space-y-6">
          <div className="bg-[var(--card)] p-8 rounded-2xl border border-[var(--border)] hover-lift">
            <div className="flex items-start gap-5">
              <div className="bg-[var(--gold)]/10 p-3 rounded-xl">
                <Target className="h-5 w-5 text-[var(--gold-dark)]" />
              </div>
              <div>
                <h2 className="font-serif text-2xl text-[var(--text)] mb-2">Misión</h2>
                <p className="text-sm text-[var(--muted)] leading-relaxed">{info.mission}</p>
              </div>
            </div>
          </div>

          <div className="bg-[var(--card)] p-8 rounded-2xl border border-[var(--border)] hover-lift">
            <div className="flex items-start gap-5">
              <div className="bg-[var(--gold)]/10 p-3 rounded-xl">
                <Eye className="h-5 w-5 text-[var(--gold-dark)]" />
              </div>
              <div>
                <h2 className="font-serif text-2xl text-[var(--text)] mb-2">Visión</h2>
                <p className="text-sm text-[var(--muted)] leading-relaxed">{info.vision}</p>
              </div>
            </div>
          </div>

          <div className="bg-[var(--card)] p-8 rounded-2xl border border-[var(--border)] hover-lift">
            <div className="flex items-start gap-5">
              <div className="bg-[var(--gold)]/10 p-3 rounded-xl">
                <Building2 className="h-5 w-5 text-[var(--gold-dark)]" />
              </div>
              <div>
                <h2 className="font-serif text-2xl text-[var(--text)] mb-2">Objetivos</h2>
                <p className="text-sm text-[var(--muted)] leading-relaxed">{info.objectives}</p>
              </div>
            </div>
          </div>

          <div className="bg-[var(--card)] p-8 rounded-2xl border border-[var(--border)]">
            <h2 className="font-serif text-2xl text-[var(--text)] mb-6">Contacto</h2>
            <div className="space-y-4 text-sm">
              <div className="flex items-center gap-3 text-[var(--muted)]">
                <MapPin className="h-4 w-4 text-[var(--gold)]" /> {info.address}
              </div>
              <div className="flex items-center gap-3 text-[var(--muted)]">
                <Phone className="h-4 w-4 text-[var(--gold)]" /> {info.phone}
              </div>
              <div className="flex items-center gap-3 text-[var(--muted)]">
                <Mail className="h-4 w-4 text-[var(--gold)]" /> {info.email}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-20 bg-[var(--card)] rounded-2xl border border-[var(--border)]">
          <p className="text-[var(--muted)]">No hay información corporativa disponible.</p>
        </div>
      )}
    </div>
  )
}
