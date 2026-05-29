import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-[var(--text)] text-[var(--muted)]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="md:col-span-2">
            <span className="font-serif text-2xl text-[var(--card)]">Vestitus</span>
            <p className="text-sm mt-3 max-w-xs leading-relaxed">
              Plataforma de arriendo y venta de vestuario. Moda sostenible, looks extraordinarios.
            </p>
          </div>
          <div>
            <h3 className="text-xs tracking-[0.15em] uppercase text-[var(--card)] mb-4">Enlaces</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/products" className="hover:text-[var(--gold)] transition-colors">Catálogo</Link></li>
              <li><Link to="/corporate-info" className="hover:text-[var(--gold)] transition-colors">Nosotros</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-xs tracking-[0.15em] uppercase text-[var(--card)] mb-4">Contacto</h3>
            <ul className="space-y-2 text-sm">
              <li>contacto@vestitus.cl</li>
              <li>+56 9 1234 5678</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-[var(--text)]/20 mt-12 pt-8 text-center text-xs tracking-[0.1em] uppercase">
          &copy; {new Date().getFullYear()} Vestitus. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  )
}
