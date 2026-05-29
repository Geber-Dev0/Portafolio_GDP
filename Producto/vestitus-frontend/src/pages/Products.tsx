import { useState, useEffect, useRef } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { productService, type ProductFilters } from '../services/products.service'
import { useCart } from '../contexts/CartContext'
import type { Product } from '../types'
import { Search, SlidersHorizontal, X, ChevronLeft, ChevronRight, ArrowRight, Sparkles } from 'lucide-react'
import { SEASON_LABEL } from '../constants'
import { sampleProducts } from '../data/sampleProducts'

const categories = ['', 'vestidos', 'trajes', 'casual', 'formal']
const categoryCards = [
  { slug: '', label: 'Ver Todas las Categorías', image: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=800&q=80' },
  { slug: 'vestidos', label: 'Vestidos', image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&q=80' },
  { slug: 'trajes', label: 'Trajes', image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&q=80' },
  { slug: 'casual', label: 'Casual', image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800&q=80' },
  { slug: 'formal', label: 'Formal', image: 'https://images.unsplash.com/photo-1544441893-675973e31985?w=800&q=80' },
]
const PAGE_SIZE = 12
const FALLBACK_IMAGE = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="800" height="1000" viewBox="0 0 800 1000"%3E%3Crect fill="%23E0D8CC" width="800" height="1000"/%3E%3Ctext fill="%238A8078" font-family="sans-serif" font-size="20" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3E%3C/text%3E%3C/svg%3E'
const BANNER_IMG = 'https://images.unsplash.com/photo-1774544349354-6fbe1de7f0d3?w=1600&q=80'

export default function Products() {
  const { addItem } = useCart()
  const [searchParams] = useSearchParams()
  const initialCategory = searchParams.get('category') || ''
  const [allProducts, setAllProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState<ProductFilters>({ category: initialCategory })
  const [debouncedFilters, setDebouncedFilters] = useState<ProductFilters>({ category: initialCategory })
  const [showFilters, setShowFilters] = useState(false)
  const [page, setPage] = useState(1)
  const [addedId, setAddedId] = useState<string | null>(null)
  const [showProducts, setShowProducts] = useState(false)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const categoriesRef = useRef<HTMLDivElement>(null)
  const productsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    debounceRef.current = setTimeout(() => {
      setDebouncedFilters(filters)
      setPage(1)
    }, 300)
    return () => clearTimeout(debounceRef.current)
  }, [filters])

  // Load all products from backend once, merge with samples, then filter client-side
  useEffect(() => {
    productService.getAll()
      .then(data => {
        const seen = new Set(data.map(p => p.name))
        setAllProducts([...data, ...sampleProducts.filter(p => !seen.has(p.name))])
      })
      .catch(() => setAllProducts(sampleProducts))
      .finally(() => setLoading(false))
  }, [])

  // Apply filters client-side
  const filtered = allProducts.filter(p => {
    if (debouncedFilters.category && p.category !== debouncedFilters.category) return false
    if (debouncedFilters.type && p.type !== debouncedFilters.type) return false
    if (debouncedFilters.available) {
      const avail = debouncedFilters.available === 'true'
      if (p.is_available !== avail) return false
    }
    return true
  })

  const activeFilterCount = [filters.category, filters.type, filters.available].filter(Boolean).length

  const clearFilters = () => {
    setFilters({})
  }

  const handleAddToCart = (e: React.MouseEvent, product: Product, type: 'rent' | 'sale') => {
    e.preventDefault()
    e.stopPropagation()
    addItem(product, type)
    setAddedId(`${product.id}-${type}`)
    setTimeout(() => setAddedId(null), 1500)
  }

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const activeCategory = filters.category

  return (
    <div>
      {/* AW Collection Banner */}
      <section className="relative h-[50vh] md:h-[60vh] min-h-[350px] bg-[var(--text)] overflow-hidden flex items-center">
        <img
          src={BANNER_IMG}
          alt="Colección Otoño/Invierno"
          className="absolute inset-0 w-full h-full object-cover object-[50%_30%]"
          onError={(e) => { e.currentTarget.style.display = 'none' }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--text)]/85 via-[var(--text)]/60 to-transparent" />
        <div className="relative max-w-7xl mx-auto px-6 lg:px-8 w-full">
          <span className="season-label text-[var(--gold)]">{SEASON_LABEL}</span>
          <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl text-[var(--card)] leading-[0.9] tracking-tight mt-3 max-w-2xl">
            Nueva Temporada
          </h1>
          <p className="text-[var(--card)]/70 text-lg md:text-xl max-w-lg mt-4">
            Descubre nuestra colección Otoño/Invierno. Prendas exclusivas para arriendo y venta.
          </p>
          <button onClick={() => { setShowProducts(true); setTimeout(() => categoriesRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100) }}
            className="mt-8 inline-flex items-center gap-2 bg-[var(--gold)] text-[var(--text)] px-8 py-3 rounded-full text-sm tracking-[0.1em] uppercase font-medium hover:bg-[var(--card)] transition-all">
            <Sparkles className="h-4 w-4" /> Explorar Colección
          </button>
        </div>
      </section>

      <div ref={categoriesRef} className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        {/* Category Cards */}
        <div className="mb-16">
          <div className="flex items-end justify-between mb-8">
            <div>
              <span className="season-label text-[var(--gold)]">Categorías</span>
              <h2 className="font-serif text-3xl md:text-4xl text-[var(--text)] mt-2">Explora por tipo</h2>
            </div>
            {activeCategory && (
              <button onClick={() => setFilters({ ...filters, category: '' })}
                className="text-xs tracking-[0.1em] uppercase text-[var(--muted)] hover:text-[var(--text)] transition-colors">
                <X className="h-3 w-3 inline" /> Limpiar filtro
              </button>
            )}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
            {categoryCards.map((cat, idx) => {
              const isAll = idx === 0
              const isActive = !isAll && activeCategory === cat.slug
              return (
                <button
                  key={cat.slug || 'all'}
                  onClick={() => {
                    setFilters({ ...filters, category: isAll ? '' : isActive ? '' : cat.slug })
                    if (!showProducts) {
                      setShowProducts(true)
                      setTimeout(() => productsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 200)
                    }
                  }}
                  className={`group relative aspect-[3/4] rounded-2xl overflow-hidden border transition-all ${isActive ? 'border-[var(--gold)] ring-2 ring-[var(--gold)]' : 'border-[var(--border)] hover:border-[var(--gold)]'}`}
                >
                  <img
                    src={cat.image}
                    alt={cat.label}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    onError={(e) => { e.currentTarget.src = FALLBACK_IMAGE }}
                    loading="lazy"
                    width={400}
                    height={533}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[var(--text)]/80 via-transparent to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-5 text-left">
                    <h3 className={`font-serif text-xl md:text-2xl transition-colors ${isActive ? 'text-[var(--gold)]' : 'text-[var(--card)]'}`}>
                      {cat.label}
                    </h3>
                    <span className={`inline-flex items-center gap-1 text-xs tracking-[0.1em] uppercase mt-1 transition-opacity ${isActive ? 'text-[var(--gold)] opacity-100' : 'text-[var(--gold)] opacity-0 group-hover:opacity-100'}`}>
                      {isActive ? 'Seleccionado' : 'Explorar'} <ArrowRight className="h-3 w-3" />
                    </span>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Products section — hidden until user clicks a category or "Explorar" */}
        {showProducts && (
          <div ref={productsRef}>
            <div className="flex items-end justify-between mb-8">
              <div>
                <span className="season-label text-[var(--gold)]">Catálogo</span>
                <h2 className="font-serif text-3xl md:text-4xl text-[var(--text)] mt-2">
                  {activeCategory ? activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1) : 'Todas las prendas'}
                </h2>
              </div>
              <button onClick={() => setShowFilters(!showFilters)}
                className="relative flex items-center gap-2 text-xs tracking-[0.1em] uppercase text-[var(--muted)] hover:text-[var(--text)] transition-colors">
                <SlidersHorizontal className="h-3 w-3" /> Filtros
                {activeFilterCount > 0 && (
                  <span className="absolute -top-2 -right-3 h-4 w-4 rounded-full bg-[var(--gold)] text-[10px] text-white flex items-center justify-center font-sans">{activeFilterCount}</span>
                )}
              </button>
            </div>

            {showFilters && (
              <div className="bg-[var(--surface)] p-6 rounded-2xl border border-[var(--border)] mb-10 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="text-xs tracking-[0.1em] uppercase text-[var(--muted)] block mb-2">Categoría</label>
                  <select value={filters.category || ''} onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                    className="w-full bg-[var(--card)] border border-[var(--border)] rounded-full px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--gold)] text-[var(--text)]">
                    <option value="">Todas</option>
                    {categories.filter(Boolean).map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs tracking-[0.1em] uppercase text-[var(--muted)] block mb-2">Tipo</label>
                  <select value={filters.type || ''} onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                    className="w-full bg-[var(--card)] border border-[var(--border)] rounded-full px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--gold)] text-[var(--text)]">
                    <option value="">Todos</option>
                    <option value="rent">Arriendo</option>
                    <option value="sale">Venta</option>
                    <option value="both">Ambos</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs tracking-[0.1em] uppercase text-[var(--muted)] block mb-2">Disponibilidad</label>
                  <select value={filters.available || ''} onChange={(e) => setFilters({ ...filters, available: e.target.value })}
                    className="w-full bg-[var(--card)] border border-[var(--border)] rounded-full px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--gold)] text-[var(--text)]">
                    <option value="">Todos</option>
                    <option value="true">Disponible</option>
                    <option value="false">No disponible</option>
                  </select>
                </div>
              </div>
            )}

            {activeFilterCount > 0 && (
              <div className="flex items-center gap-2 -mt-2 mb-10 flex-wrap">
                {filters.category && <span className="badge bg-[var(--gold)]/20 text-[var(--gold-dark)]">Categoría: {filters.category}</span>}
                {filters.type && <span className="badge bg-[var(--gold)]/20 text-[var(--gold-dark)]">Tipo: {filters.type === 'rent' ? 'Arriendo' : filters.type === 'sale' ? 'Venta' : 'Ambos'}</span>}
                {filters.available && <span className="badge bg-[var(--gold)]/20 text-[var(--gold-dark)]">{filters.available === 'true' ? 'Disponible' : 'No disponible'}</span>}
                <button onClick={clearFilters} className="flex items-center gap-1 text-xs text-[var(--muted)] hover:text-[var(--text)] transition-colors ml-2">
                  <X className="h-3 w-3" /> Limpiar
                </button>
              </div>
            )}

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="animate-pulse bg-[var(--border)] rounded-2xl aspect-[3/4]" />
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-20">
                <Search className="h-10 w-10 text-[var(--muted)] mx-auto mb-4" />
                <p className="text-[var(--muted)]">No se encontraron productos.</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {paginated.map((product, i) => (
                    <Link key={product.id} to={`/products/${product.id}`} className={`group ${i === 0 ? 'lg:col-span-2 lg:row-span-2' : ''}`}>
                      <div className="bg-[var(--card)] rounded-2xl overflow-hidden border border-[var(--border)] hover-lift h-full flex flex-col">
                        <div className={`relative overflow-hidden bg-[var(--bg)] ${i === 0 ? 'aspect-[4/5]' : 'aspect-[3/4]'}`}>
                          {product.images?.[0] ? (
                            <img src={product.images[0].url} alt={product.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                          ) : (
                            <div className="flex items-center justify-center h-full text-[var(--muted)]">
                              <Search className="h-8 w-8" />
                            </div>
                          )}
                          {!product.is_available && (
                            <div className="absolute inset-0 bg-[var(--text)]/60 flex items-center justify-center backdrop-blur-sm">
                              <span className="badge bg-[var(--text)] text-[var(--card)]">No disponible</span>
                            </div>
                          )}
                          <div className="absolute top-3 left-3">
                            <span className={`badge ${product.type === 'rent' ? 'bg-[var(--gold)]/20 text-[var(--gold-dark)]' : 'bg-[var(--text)]/10 text-[var(--text)]'}`}>
                              {product.type === 'rent' ? 'Arriendo' : product.type === 'sale' ? 'Venta' : 'Dual'}
                            </span>
                          </div>
                        </div>
                        <div className="p-4 flex-1 flex flex-col justify-between">
                          <div>
                            <h3 className="font-serif text-lg text-[var(--text)] group-hover:text-[var(--gold-dark)] transition-colors">{product.name}</h3>
                            <p className="text-xs text-[var(--muted)] mt-1 capitalize tracking-wide">{product.category}</p>
                          </div>
                          <div className="mt-3">
                            <div className="flex items-center justify-between">
                              <span className="font-sans text-lg font-medium text-[var(--text)] price">${product.price.toLocaleString('es-CL')}</span>
                            </div>
                            {product.is_available && (
                              <div className="mt-2 flex gap-2">
                                {(product.type === 'sale' || product.type === 'both') && (
                                  <button onClick={(e) => handleAddToCart(e, product, 'sale')}
                                    className="flex-1 text-xs tracking-[0.1em] uppercase bg-[var(--text)] text-white py-2 rounded-full hover:bg-[var(--gold-dark)] transition-colors disabled:opacity-50"
                                    disabled={addedId === `${product.id}-sale`}>
                                    {addedId === `${product.id}-sale` ? '✓ Agregado' : 'Comprar'}
                                  </button>
                                )}
                                {(product.type === 'rent' || product.type === 'both') && (
                                  <button onClick={(e) => handleAddToCart(e, product, 'rent')}
                                    className="flex-1 text-xs tracking-[0.1em] uppercase border border-[var(--border)] text-[var(--text)] py-2 rounded-full hover:bg-[var(--surface)] transition-colors disabled:opacity-50"
                                    disabled={addedId === `${product.id}-rent`}>
                                    {addedId === `${product.id}-rent` ? '✓ Agregado' : 'Arrendar'}
                                  </button>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>

                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-3 mt-12">
                    <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                      className="p-2 border border-[var(--border)] rounded-full disabled:opacity-30 hover:bg-[var(--surface)] transition-colors">
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                      <button key={p} onClick={() => setPage(p)}
                        className={`w-8 h-8 rounded-full text-xs font-sans transition-colors ${p === page ? 'bg-[var(--text)] text-white' : 'text-[var(--muted)] hover:text-[var(--text)] border border-[var(--border)]'}`}>
                        {p}
                      </button>
                    ))}
                    <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                      className="p-2 border border-[var(--border)] rounded-full disabled:opacity-30 hover:bg-[var(--surface)] transition-colors">
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
