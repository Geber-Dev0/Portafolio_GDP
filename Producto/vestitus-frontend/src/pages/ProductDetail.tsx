import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { productService } from '../services/products.service'
import { useCart } from '../contexts/CartContext'
import type { Product } from '../types'
import { useAuth } from '../contexts/useAuth'
import { Calendar, ChevronLeft, ChevronRight, ArrowLeft, ShoppingBag, AlertCircle, Minus, Plus } from 'lucide-react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { es } from 'date-fns/locale'

const today = () => new Date().toISOString().split('T')[0]
const addDays = (d: string, n: number) => { const dt = new Date(d); dt.setDate(dt.getDate() + n); return dt.toISOString().split('T')[0] }

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>()
  const { user } = useAuth()
  const { addItem } = useCart()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [currentImage, setCurrentImage] = useState(0)
  const [startDate, setStartDate] = useState(today())
  const [days, setDays] = useState(1)
  const [added, setAdded] = useState(false)
  const [addingSale, setAddingSale] = useState(false)
  const [addingRent, setAddingRent] = useState(false)
  const [addedSale, setAddedSale] = useState(false)
  const [dateError, setDateError] = useState('')
  const [saleError, setSaleError] = useState('')
  useEffect(() => {
    if (id) {
      productService.getById(id).then(setProduct).catch(console.error).finally(() => setLoading(false))
    }
  }, [id])

  const handleAddRentToCart = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!product) return
    if (!startDate) { setDateError('Selecciona una fecha de inicio'); return }
    if (days < 1 || days > 30) { setDateError('Los días deben ser entre 1 y 30'); return }
    const endDate = addDays(startDate, days)
    setDateError('')
    setAddingRent(true)
    await new Promise(r => setTimeout(r, 300))
    addItem(product, 'rent', { startDate, endDate, periodType: 'days' })
    setAddingRent(false)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  const handleAddSaleToCart = async () => {
    if (!product) return
    if ((product.stock ?? 0) < 1) { setSaleError('Producto sin stock disponible'); return }
    setSaleError('')
    setAddingSale(true)
    await new Promise(r => setTimeout(r, 300))
    addItem(product, 'sale')
    setAddingSale(false)
    setAddedSale(true)
    setTimeout(() => setAddedSale(false), 2000)
  }

  if (loading) return <div className="flex justify-center py-32"><div className="animate-spin h-6 w-6 border-2 border-[var(--gold)] border-t-transparent rounded-full" /></div>
  if (!product) return (
    <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
      <Link to="/products" className="inline-flex items-center gap-2 text-xs tracking-[0.1em] uppercase text-[var(--muted)] hover:text-[var(--text)] transition-colors mb-8">
        <ArrowLeft className="h-3 w-3" /> Volver al Catálogo
      </Link>
      <div className="text-center py-20 text-[var(--muted)]">Producto no encontrado</div>
    </div>
  )

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
      <Link to="/products" className="inline-flex items-center gap-2 text-xs tracking-[0.1em] uppercase text-[var(--muted)] hover:text-[var(--text)] transition-colors mb-8">
        <ArrowLeft className="h-3 w-3" /> Volver al Catálogo
      </Link>

      <div className="grid md:grid-cols-2 gap-12">
        <div>
          <div className="aspect-[3/4] bg-[var(--bg)] rounded-2xl overflow-hidden relative">
            {product.images?.[currentImage] ? (
              <img src={product.images[currentImage].url} alt={product.name} className="w-full h-full object-cover" />
            ) : (
              <div className="flex items-center justify-center h-full text-[var(--muted)]">
                <span className="text-xs tracking-[0.1em] uppercase">Sin imagen</span>
              </div>
            )}
          </div>

          {product.images && product.images.length > 1 && (
            <div className="flex items-center gap-3 mt-4">
              <button onClick={() => setCurrentImage(Math.max(0, currentImage - 1))} disabled={currentImage === 0}
                className="p-2 border border-[var(--border)] rounded-full disabled:opacity-30 hover:bg-[var(--surface)] transition-colors">
                <ChevronLeft className="h-4 w-4" />
              </button>
              <div className="flex gap-2 overflow-x-auto flex-1">
                {product.images.map((img, i) => (
                  <button key={img.id} onClick={() => setCurrentImage(i)}
                    className={`w-16 h-20 rounded-xl overflow-hidden flex-shrink-0 border-2 transition-colors ${i === currentImage ? 'border-[var(--gold)]' : 'border-transparent'}`}>
                    <img src={img.url} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
              <button onClick={() => setCurrentImage(Math.min(product.images.length - 1, currentImage + 1))} disabled={currentImage === product.images.length - 1}
                className="p-2 border border-[var(--border)] rounded-full disabled:opacity-30 hover:bg-[var(--surface)] transition-colors">
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>

        <div className="flex flex-col text-center">
          <span className="season-label text-[var(--gold)]"></span>
          <span className={`mt-3 inline-block self-center badge ${product.type === 'rent' ? 'bg-[var(--gold)]/20 text-[var(--gold-dark)]' : 'bg-[var(--text)] text-white'}`}>
            {product.type === 'rent' ? 'Arriendo' : product.type === 'sale' ? 'Venta' : 'Arriendo y Venta'}
          </span>

          <h1 className="font-serif text-4xl md:text-5xl text-[var(--text)] mt-4 leading-tight">{product.name}</h1>
          <p className="text-sm text-[var(--muted)] mt-2 capitalize">{product.category}</p>

          <p className="price text-3xl font-medium text-[var(--text)] mt-6">${product.price.toLocaleString('es-CL')}</p>

          <div className="border-t border-[var(--border)] my-8" />

          <div className="space-y-3 text-sm mx-auto">
            {product.size && (
              <div className="flex items-center justify-center gap-3">
                <span className="text-[var(--muted)] text-xs tracking-[0.1em] uppercase w-16">Talla</span>
                <span className="text-[var(--text)]">{product.size}</span>
              </div>
            )}
            {product.color && (
              <div className="flex items-center justify-center gap-3">
                <span className="text-[var(--muted)] text-xs tracking-[0.1em] uppercase w-16">Color</span>
                <span className="text-[var(--text)]">{product.color}</span>
              </div>
            )}
            <div className="flex items-center justify-center gap-3">
              <span className="text-[var(--muted)] text-xs tracking-[0.1em] uppercase w-16">Stock</span>
              <span className="text-[var(--text)]">{product.stock} unidades</span>
            </div>
            <div className="flex items-center justify-center gap-3">
              <span className="text-[var(--muted)] text-xs tracking-[0.1em] uppercase w-16">Estado</span>
              <span className={`text-xs tracking-wide ${product.is_available ? 'text-green-700' : 'text-red-600'}`}>
                {product.is_available ? 'Disponible' : 'No disponible'}
              </span>
            </div>
          </div>

          {product.description && (
            <>
              <div className="border-t border-[var(--border)] my-8" />
              <p className="text-sm text-[var(--muted)] leading-relaxed text-center">{product.description}</p>
            </>
          )}

          <div className="border-t border-[var(--border)] my-8" />

          {user ? (
            <div className="space-y-4">
              {(product.type === 'sale' || product.type === 'both') && (
                <div>
                  <button onClick={handleAddSaleToCart} disabled={addingSale || addedSale || (product.stock ?? 0) < 1}
                    className="w-full bg-[var(--text)] text-white py-3 rounded-full text-sm tracking-[0.1em] uppercase hover:bg-[var(--gold-dark)] transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
                    <ShoppingBag className="h-4 w-4" />
                    {(product.stock ?? 0) < 1 ? 'Sin stock' : addingSale ? 'Agregando...' : addedSale ? '✓ Agregado' : 'Comprar'}
                  </button>
                  {saleError && <p className="flex items-center gap-1 text-red-600 text-xs mt-2"><AlertCircle className="h-3 w-3" /> {saleError}</p>}
                </div>
              )}

              {(product.type === 'rent' || product.type === 'both') && (
                <form onSubmit={handleAddRentToCart}>
                  <h3 className="font-serif text-xl text-[var(--text)] mb-4 flex items-center justify-center gap-2">
                    <Calendar className="h-4 w-4 text-[var(--gold)]" /> Arriendo
                  </h3>
                  <div className="mb-4">
                    <label className="text-xs text-[var(--muted)] block mb-1 tracking-wide">Fecha de inicio</label>
                    <DatePicker
                      locale={es}
                      selected={startDate ? new Date(startDate) : null}
                      onChange={(d: Date | null) => { if (d) { setStartDate(d.toISOString().split('T')[0]); setDateError('') } }}
                      minDate={new Date()}
                      dateFormat="d 'de' MMMM, yyyy"
                      placeholderText="Seleccionar fecha"
                      className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-full px-4 py-2.5 text-sm text-[var(--text)] hover:border-[var(--gold)] transition-colors outline-none focus:ring-2 focus:ring-[var(--gold)]"
                      calendarClassName="modern-calendar"
                      shouldCloseOnSelect
                    />
                  </div>
                  <div className="mb-4">
                    <label className="text-xs text-[var(--muted)] block mb-1 tracking-wide">Días</label>
                    <div className="flex items-center justify-center gap-4">
                      <button type="button" onClick={() => setDays(Math.max(1, days - 1))}
                        className="w-10 h-10 border border-[var(--border)] rounded-full flex items-center justify-center hover:bg-[var(--surface)] transition-colors text-[var(--text)]">
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="text-xl font-medium text-[var(--text)] w-8 text-center">{days}</span>
                      <button type="button" onClick={() => setDays(Math.min(30, days + 1))}
                        className="w-10 h-10 border border-[var(--border)] rounded-full flex items-center justify-center hover:bg-[var(--surface)] transition-colors text-[var(--text)]">
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  <button type="submit" disabled={addingRent || added}
                    className="w-full bg-[var(--text)] text-white py-3 rounded-full text-sm tracking-[0.1em] uppercase hover:bg-[var(--gold-dark)] transition-colors disabled:opacity-50">
                    {addingRent ? 'Agregando...' : added ? '✓ Agendado' : `Arrendar (${days} ${days === 1 ? 'día' : 'días'})`}
                  </button>
                  {dateError && <p className="flex items-center gap-1 text-red-600 text-xs mt-2"><AlertCircle className="h-3 w-3" /> {dateError}</p>}
                </form>
              )}
            </div>
          ) : (
            <div className="p-4 bg-[var(--surface)] rounded-xl border border-[var(--border)] text-center">
              <p className="text-sm text-[var(--muted)] mb-3">Inicia sesión para agregar al carrito</p>
              <Link to="/login" className="inline-block bg-[var(--text)] text-white px-6 py-2.5 rounded-full text-xs tracking-[0.1em] uppercase hover:bg-[var(--gold-dark)] transition-colors">
                Ingresar
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
