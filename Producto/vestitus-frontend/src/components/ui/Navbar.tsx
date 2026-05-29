import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/useAuth'
import { useCart } from '../../contexts/CartContext'
import { Menu, X, ShoppingBag, ChevronDown } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'
import { SEASON_LABEL } from '../../constants'

const categoryLinks = [
  { slug: 'vestidos', label: 'Vestidos' },
  { slug: 'trajes', label: 'Trajes' },
  { slug: 'casual', label: 'Casual' },
  { slug: 'formal', label: 'Formal' },
]

export default function Navbar() {
  const { user, logout, isEmployee } = useAuth()
  const { itemCount } = useCart()
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [catalogOpen, setCatalogOpen] = useState(false)
  const [mobileCatalogOpen, setMobileCatalogOpen] = useState(false)
  const catalogRef = useRef<HTMLDivElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMobileOpen(false)
      }
      if (catalogRef.current && !catalogRef.current.contains(e.target as Node)) {
        setCatalogOpen(false)
      }
    }
    function handleEscape(e: KeyboardEvent) {
      if (e.key === 'Escape') { setMobileOpen(false); setCatalogOpen(false) }
    }
    if (mobileOpen || catalogOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      document.addEventListener('keydown', handleEscape)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [mobileOpen, catalogOpen])

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <nav className="bg-[var(--bg)] border-b border-[var(--border)]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <Link to="/" className="flex items-center gap-2">
            <span className="font-serif text-2xl tracking-tight text-[var(--text)]">Vestitus</span>
            <span className="hidden sm:inline text-xs tracking-[0.2em] uppercase text-[var(--muted)] ml-2">{SEASON_LABEL}</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <div ref={catalogRef} className="relative" onMouseEnter={() => setCatalogOpen(true)} onMouseLeave={() => setCatalogOpen(false)}>
              <Link to="/products"
                className="flex items-center gap-1 text-sm tracking-wide text-[var(--text)] hover:text-[var(--gold)] transition-colors">
                Catálogo <ChevronDown className={`h-3 w-3 transition-transform ${catalogOpen ? 'rotate-180' : ''}`} />
              </Link>
              {catalogOpen && (
                <div className="absolute top-full left-0 mt-2 w-48 bg-[var(--card)] rounded-2xl border border-[var(--border)] shadow-xl py-2 z-50">
                  {categoryLinks.map(cat => (
                    <Link key={cat.slug} to={`/products?category=${cat.slug}`}
                      className="block px-5 py-2.5 text-sm text-[var(--text)] hover:text-[var(--gold)] hover:bg-[var(--surface)] transition-colors">
                      {cat.label}
                    </Link>
                  ))}
                  <div className="border-t border-[var(--border)] mx-3 my-1" />
                  <Link to="/products"
                    className="block px-5 py-2.5 text-sm text-[var(--muted)] hover:text-[var(--text)] hover:bg-[var(--surface)] transition-colors">
                    Ver Todos
                  </Link>
                </div>
              )}
            </div>
            {user && (
              <Link to="/rentals" className="text-sm tracking-wide text-[var(--text)] hover:text-[var(--gold)] transition-colors">Mis Arriendos</Link>
            )}
            {isEmployee && (
              <Link to="/admin" className="text-sm tracking-wide text-[var(--text)] hover:text-[var(--gold)] transition-colors">Admin</Link>
            )}
            <Link to="/corporate-info" className="text-sm tracking-wide text-[var(--text)] hover:text-[var(--gold)] transition-colors">Nosotros</Link>
            <Link to="/cart" className="relative text-sm tracking-wide text-[var(--text)] hover:text-[var(--gold)] transition-colors">
              <ShoppingBag className="h-5 w-5" />
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 h-4 w-4 rounded-full bg-[var(--gold)] text-[10px] text-white flex items-center justify-center font-sans">{itemCount}</span>
              )}
            </Link>
          </div>

          <div className="flex items-center gap-6">
            {user ? (
              <>
                <span className="hidden lg:block text-xs text-[var(--muted)] tracking-wide">{user.email}</span>
                <button onClick={handleLogout} className="hidden md:block text-xs tracking-[0.1em] uppercase text-[var(--muted)] hover:text-[var(--text)] transition-colors">
                  Salir
                </button>
              </>
            ) : (
              <div className="hidden md:flex items-center gap-4">
                <Link to="/login" className="text-xs tracking-[0.1em] uppercase text-[var(--text)] hover:text-[var(--gold)] transition-colors">Ingresar</Link>
                <Link to="/register" className="text-xs tracking-[0.1em] uppercase bg-[var(--text)] text-white px-5 py-2.5 rounded-full hover:bg-[var(--gold-dark)] transition-colors">
                  Registrarse
                </Link>
              </div>
            )}
            <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden text-[var(--text)]">
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {mobileOpen && (
        <div ref={menuRef} className="md:hidden border-t border-[var(--border)] bg-[var(--bg)] px-6 py-4 space-y-2">
          <div>
            <button onClick={() => setMobileCatalogOpen(!mobileCatalogOpen)}
              className="flex items-center gap-1 text-sm tracking-wide py-1 w-full text-left">
              Catálogo <ChevronDown className={`h-3 w-3 transition-transform ${mobileCatalogOpen ? 'rotate-180' : ''}`} />
            </button>
            {mobileCatalogOpen && (
              <div className="pl-4 mt-1 space-y-1 border-l border-[var(--border)] ml-1">
                {categoryLinks.map(cat => (
                  <Link key={cat.slug} to={`/products?category=${cat.slug}`}
                    className="block text-sm tracking-wide py-1.5 text-[var(--muted)] hover:text-[var(--text)]"
                    onClick={() => setMobileOpen(false)}>
                    {cat.label}
                  </Link>
                ))}
                <Link to="/products" className="block text-sm tracking-wide py-1.5 text-[var(--muted)] hover:text-[var(--text)]"
                  onClick={() => setMobileOpen(false)}>
                  Ver Todos
                </Link>
              </div>
            )}
          </div>
          {user && <Link to="/rentals" className="block text-sm tracking-wide py-1" onClick={() => setMobileOpen(false)}>Mis Arriendos</Link>}
          {isEmployee && <Link to="/admin" className="block text-sm tracking-wide py-1" onClick={() => setMobileOpen(false)}>Admin</Link>}
          <Link to="/corporate-info" className="block text-sm tracking-wide py-1" onClick={() => setMobileOpen(false)}>Nosotros</Link>
          <Link to="/cart" className="block text-sm tracking-wide py-1" onClick={() => setMobileOpen(false)}>
            Carrito {itemCount > 0 && `(${itemCount})`}
          </Link>
          {!user && (
            <>
              <div className="border-t border-[var(--border)] pt-3 mt-3" />
              <Link to="/login" className="block text-sm tracking-wide py-1" onClick={() => setMobileOpen(false)}>Ingresar</Link>
              <Link to="/register" className="block text-sm tracking-wide py-1" onClick={() => setMobileOpen(false)}>Registrarse</Link>
            </>
          )}
        </div>
      )}
    </nav>
  )
}
