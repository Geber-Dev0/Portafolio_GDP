import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-16">
      <div className="text-center max-w-sm">
        <span className="season-label text-[var(--gold)]">Error 404</span>
        <h1 className="font-serif text-7xl md:text-8xl text-[var(--text)] mt-2 leading-none">404</h1>
        <p className="text-[var(--muted)] mt-4 text-sm leading-relaxed">
          Esta página no existe o ha sido movida.
        </p>
        <Link to="/" className="inline-flex items-center gap-2 mt-8 bg-[var(--text)] text-[var(--card)] px-6 py-3 rounded-full text-sm tracking-[0.1em] uppercase hover:bg-[var(--gold-dark)] transition-colors btn-gold">
          <ArrowLeft className="h-4 w-4" /> Volver al Inicio
        </Link>
      </div>
    </div>
  )
}
