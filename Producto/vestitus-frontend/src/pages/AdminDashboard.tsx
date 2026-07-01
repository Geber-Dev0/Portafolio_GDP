import { useState, useEffect, useCallback } from 'react'
import { productService } from '../services/products.service'
import { rentalService } from '../services/rentals.service'
import { clientService } from '../services/clients.service'
import { salesService } from '../services/sales.service'
import { returnsService } from '../services/returns.service'
import { dispatchesService } from '../services/dispatches.service'
import { damageTypesService } from '../services/damage-types.service'
import { corporateInfoService } from '../services/corporate-info.service'
import type { Product, Rental, Client, Sale, Return as ReturnType, Dispatch, DamageType, CorporateInfo, ProductImage } from '../types'
import { LayoutDashboard, Package, CalendarDays, Users, Plus, ChevronLeft, ChevronRight, DollarSign, Undo2, AlertTriangle, Building2, Upload, Pencil, Trash2, Image as ImageIcon, X, AlertCircle, CheckCircle2, Truck } from 'lucide-react'

const CATEGORIES = ['vestidos', 'trajes', 'casual', 'formal']
const PAGE_SIZE = 10

function ConfirmModal({ open, title, message, onConfirm, onCancel }: {
  open: boolean; title: string; message: string; onConfirm: () => void; onCancel: () => void
}) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={onCancel}>
      <div className="bg-[var(--card)] rounded-2xl border border-[var(--border)] p-6 max-w-sm w-full mx-4 shadow-xl" onClick={(e) => e.stopPropagation()}>
        <h3 className="font-serif text-xl text-[var(--text)]">{title}</h3>
        <p className="text-sm text-[var(--muted)] mt-2">{message}</p>
        <div className="flex gap-3 mt-6 justify-end">
          <button onClick={onCancel} className="px-5 py-2.5 rounded-full text-xs tracking-[0.1em] uppercase border border-[var(--border)] text-[var(--muted)] hover:text-[var(--text)] transition-colors">Cancelar</button>
          <button onClick={onConfirm} className="px-5 py-2.5 rounded-full text-xs tracking-[0.1em] uppercase bg-red-600 text-white hover:bg-red-700 transition-colors">Confirmar</button>
        </div>
      </div>
    </div>
  )
}

function Pagination({ current, total, onChange }: { current: number; total: number; onChange: (page: number) => void }) {
  if (total <= 1) return null
  return (
    <div className="flex items-center justify-center gap-3 mt-6">
      <button onClick={() => onChange(current - 1)} disabled={current === 1}
        className="p-2 border border-[var(--border)] rounded-full disabled:opacity-30 hover:bg-[var(--surface)] transition-colors">
        <ChevronLeft className="h-4 w-4" />
      </button>
      <span className="text-xs text-[var(--muted)] tracking-wide">{current} de {total}</span>
      <button onClick={() => onChange(current + 1)} disabled={current === total}
        className="p-2 border border-[var(--border)] rounded-full disabled:opacity-30 hover:bg-[var(--surface)] transition-colors">
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  )
}

const TABS = [
  { key: 'products', label: 'Productos', icon: Package },
  { key: 'rentals', label: 'Arriendos', icon: CalendarDays },
  { key: 'clients', label: 'Clientes', icon: Users },
  { key: 'sales', label: 'Ventas', icon: DollarSign },
  { key: 'returns', label: 'Devoluciones', icon: Undo2 },
  { key: 'dispatches', label: 'Despachos', icon: Truck },
  { key: 'damage-types', label: 'Daños', icon: AlertTriangle },
  { key: 'corporate-info', label: 'Info Corporativa', icon: Building2 },
] as const

type Tab = (typeof TABS)[number]['key']

export default function AdminDashboard() {
  const [tab, setTab] = useState<Tab>('products')

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
      <div className="mb-12">
        <span className="season-label text-[var(--gold)]">Gestión</span>
        <h1 className="font-serif text-4xl md:text-5xl text-[var(--text)] mt-2 flex items-center gap-3">
          <LayoutDashboard className="h-8 w-8 text-[var(--gold)]" /> Panel de Administración
        </h1>
      </div>

      <div className="flex gap-1 mb-8 border-b border-[var(--border)] pb-2 overflow-x-auto">
        {TABS.map(({ key, label, icon: Icon }) => (
          <button key={key} onClick={() => setTab(key)}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs tracking-[0.1em] uppercase rounded-t-lg transition whitespace-nowrap ${tab === key ? 'bg-[var(--text)] text-[var(--card)]' : 'text-[var(--muted)] hover:text-[var(--text)]'}`}>
            <Icon className="h-3.5 w-3.5" /> {label}
          </button>
        ))}
      </div>

      {tab === 'products' && <AdminProducts />}
      {tab === 'rentals' && <AdminRentals />}
      {tab === 'clients' && <AdminClients />}
      {tab === 'sales' && <AdminSales />}
      {tab === 'returns' && <AdminReturns />}
      {tab === 'dispatches' && <AdminDispatches />}
      {tab === 'damage-types' && <AdminDamageTypes />}
      {tab === 'corporate-info' && <AdminCorporateInfo />}
    </div>
  )
}

/* ───── TOAST ───── */

function Toast({ message, type, onClose }: { message: string; type: 'success' | 'error'; onClose: () => void }) {
  useEffect(() => {
    const t = setTimeout(onClose, 4000)
    return () => clearTimeout(t)
  }, [onClose])
  return (
    <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3 rounded-2xl shadow-xl border text-sm max-w-sm animate-slide-up ${type === 'success' ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800'}`}>
      {type === 'success' ? <CheckCircle2 className="h-5 w-5 flex-shrink-0" /> : <AlertCircle className="h-5 w-5 flex-shrink-0" />}
      <span className="flex-1">{message}</span>
      <button onClick={onClose} className="flex-shrink-0 opacity-60 hover:opacity-100 transition-opacity"><X className="h-4 w-4" /></button>
    </div>
  )
}

/* ───── PRODUCTOS ───── */

function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [form, setForm] = useState({ name: '', description: '', category: '', type: 'both' as Product['type'], price: 0, stock: 0, size: '', color: '' })
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})
  const [page, setPage] = useState(1)
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null)
  const [deleteImageTarget, setDeleteImageTarget] = useState<{ img: ProductImage; pid: string } | null>(null)
  const [imageUploading, setImageUploading] = useState(false)
  const [imageError, setImageError] = useState('')
  const [pendingImages, setPendingImages] = useState<File[]>([])
  const [submitting, setSubmitting] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  const load = useCallback(async () => {
    try { const data = await productService.getAll(); setProducts(data) } finally { setLoading(false) }
  }, [])

  useEffect(() => { load() }, [load])

  const validate = () => {
    const errs: Record<string, string> = {}
    if (!form.name.trim()) errs.name = 'El nombre es obligatorio'
    if (!form.category) errs.category = 'Selecciona una categoría'
    if (form.price <= 0) errs.price = 'El precio debe ser mayor a 0'
    if (form.stock < 0) errs.stock = 'El stock no puede ser negativo'
    setFormErrors(errs)
    return Object.keys(errs).length === 0
  }

  const openCreate = () => {
    setEditingId(null)
    setEditingProduct(null)
    setForm({ name: '', description: '', category: '', type: 'both', price: 0, stock: 0, size: '', color: '' })
    setFormErrors({})
    setImageError('')
    setPendingImages([])
    setShowForm(true)
  }

  const openEdit = (p: Product) => {
    setEditingId(p.id)
    setEditingProduct(p)
    setForm({ name: p.name, description: p.description, category: p.category, type: p.type, price: p.price, stock: p.stock, size: p.size || '', color: p.color || '' })
    setFormErrors({})
    setImageError('')
    setPendingImages([])
    setShowForm(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    setSubmitting(true)
    try {
      if (editingId) {
        await productService.update(editingId, form)
        setToast({ message: 'Producto actualizado correctamente', type: 'success' })
        setShowForm(false)
        setEditingId(null)
        setEditingProduct(null)
      } else {
        const created = await productService.create(form)
        let createdId = created.id
        if (pendingImages.length > 0) {
          setToast({ message: 'Subiendo imágenes...', type: 'success' })
          for (const file of pendingImages) {
            await productService.uploadImage(createdId, file)
          }
          setPendingImages([])
        }
        const fresh = await productService.getById(createdId)
        setEditingId(fresh.id)
        setEditingProduct(fresh)
        setForm({ name: fresh.name, description: fresh.description, category: fresh.category, type: fresh.type, price: fresh.price, stock: fresh.stock, size: fresh.size || '', color: fresh.color || '' })
        setToast({ message: 'Producto creado con imágenes', type: 'success' })
      }
      setPage(1)
      load()
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || 'Error al guardar el producto'
      setToast({ message: msg, type: 'error' })
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await productService.delete(id)
      setDeleteTarget(null)
      setToast({ message: 'Producto eliminado correctamente', type: 'success' })
      setPage(1)
      load()
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || 'Error al eliminar el producto'
      setToast({ message: msg, type: 'error' })
    }
  }

  const handleImageUpload = async (productId: string, file: File) => {
    const maxSize = 5 * 1024 * 1024
    if (file.size > maxSize) {
      setImageError('La imagen no debe superar los 5MB')
      return
    }
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setImageError('Formato no válido. Usa JPEG, PNG o WebP')
      return
    }
    setImageError('')
    setImageUploading(true)
    try {
      await productService.uploadImage(productId, file)
      setToast({ message: 'Imagen subida correctamente', type: 'success' })
      load()
      if (editingId === productId && editingProduct) {
        const updated = await productService.getById(productId)
        setEditingProduct(updated)
      }
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || 'Error al subir la imagen'
      setToast({ message: msg, type: 'error' })
    } finally {
      setImageUploading(false)
    }
  }

  const handleQueueImage = (file: File) => {
    if (file.size > 5 * 1024 * 1024) {
      setImageError('La imagen no debe superar los 5MB')
      return
    }
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setImageError('Formato no válido. Usa JPEG, PNG o WebP')
      return
    }
    setImageError('')
    setPendingImages(prev => [...prev, file])
  }

  const handleDeleteImage = async () => {
    if (!deleteImageTarget) return
    const { img, pid } = deleteImageTarget
    try {
      await productService.deleteImage(pid, img.id)
      setDeleteImageTarget(null)
      setToast({ message: 'Imagen eliminada correctamente', type: 'success' })
      load()
      if (editingId === pid && editingProduct) {
        const updated = await productService.getById(pid)
        setEditingProduct(updated)
      }
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || 'Error al eliminar la imagen'
      setToast({ message: msg, type: 'error' })
    }
  }

  if (loading) return <div className="animate-pulse h-40 bg-[var(--border)] rounded-2xl" />

  const totalPages = Math.ceil(products.length / PAGE_SIZE)
  const paginated = products.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  return (
    <div>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <ConfirmModal
        open={!!deleteTarget}
        title="Eliminar producto"
        message="¿Estás seguro de eliminar este producto? Esta acción no se puede deshacer."
        onConfirm={() => deleteTarget && handleDelete(deleteTarget)}
        onCancel={() => setDeleteTarget(null)}
      />

      <ConfirmModal
        open={!!deleteImageTarget}
        title="Eliminar imagen"
        message="¿Estás seguro de eliminar esta imagen?"
        onConfirm={handleDeleteImage}
        onCancel={() => setDeleteImageTarget(null)}
      />

      <div className="flex justify-between items-center mb-6">
        <h2 className="font-serif text-xl text-[var(--text)]">Productos <span className="text-[var(--muted)] font-sans text-sm">({products.length})</span></h2>
        <button onClick={() => showForm ? setShowForm(false) : openCreate()}
          className="flex items-center gap-2 bg-[var(--text)] text-[var(--card)] px-5 py-2.5 rounded-full text-xs tracking-[0.1em] uppercase hover:bg-[var(--gold-dark)] transition-colors">
          <Plus className="h-3.5 w-3.5" /> {showForm ? 'Cancelar' : 'Nuevo'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-[var(--card)] p-6 rounded-2xl border border-[var(--border)] mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="text-xs tracking-[0.1em] uppercase text-[var(--muted)] block mb-1.5">Nombre</label>
              <input value={form.name} onChange={(e) => { setForm({ ...form, name: e.target.value }); setFormErrors({ ...formErrors, name: '' }) }}
                className={`w-full bg-[var(--surface)] border rounded-full px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--gold)] ${formErrors.name ? 'border-red-400' : 'border-[var(--border)]'}`} />
              {formErrors.name && <p className="text-red-500 text-[10px] mt-1">{formErrors.name}</p>}
            </div>
            <div>
              <label className="text-xs tracking-[0.1em] uppercase text-[var(--muted)] block mb-1.5">Categoría</label>
              <select value={form.category} onChange={(e) => { setForm({ ...form, category: e.target.value }); setFormErrors({ ...formErrors, category: '' }) }}
                className={`w-full bg-[var(--surface)] border rounded-full px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--gold)] ${formErrors.category ? 'border-red-400' : 'border-[var(--border)]'}`}>
                <option value="">Seleccionar</option>
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
              {formErrors.category && <p className="text-red-500 text-[10px] mt-1">{formErrors.category}</p>}
            </div>
            <div className="md:col-span-2">
              <label className="text-xs tracking-[0.1em] uppercase text-[var(--muted)] block mb-1.5">Descripción</label>
              <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3}
                className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--gold)]" />
            </div>
            <div>
              <label className="text-xs tracking-[0.1em] uppercase text-[var(--muted)] block mb-1.5">Precio</label>
              <input type="number" value={form.price} onChange={(e) => { setForm({ ...form, price: Number(e.target.value) }); setFormErrors({ ...formErrors, price: '' }) }}
                className={`w-full bg-[var(--surface)] border rounded-full px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--gold)] ${formErrors.price ? 'border-red-400' : 'border-[var(--border)]'}`} />
              {formErrors.price && <p className="text-red-500 text-[10px] mt-1">{formErrors.price}</p>}
            </div>
            <div>
              <label className="text-xs tracking-[0.1em] uppercase text-[var(--muted)] block mb-1.5">Stock</label>
              <input type="number" value={form.stock} onChange={(e) => { setForm({ ...form, stock: Number(e.target.value) }); setFormErrors({ ...formErrors, stock: '' }) }}
                className={`w-full bg-[var(--surface)] border rounded-full px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--gold)] ${formErrors.stock ? 'border-red-400' : 'border-[var(--border)]'}`} />
              {formErrors.stock && <p className="text-red-500 text-[10px] mt-1">{formErrors.stock}</p>}
            </div>
            <div>
              <label className="text-xs tracking-[0.1em] uppercase text-[var(--muted)] block mb-1.5">Tipo</label>
              <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as Product['type'] })} required
                className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-full px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--gold)]">
                <option value="both">Ambos</option>
                <option value="rent">Arriendo</option>
                <option value="sale">Venta</option>
              </select>
            </div>
            <div>
              <label className="text-xs tracking-[0.1em] uppercase text-[var(--muted)] block mb-1.5">Talla</label>
              <input value={form.size} onChange={(e) => setForm({ ...form, size: e.target.value })}
                className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-full px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--gold)]" />
            </div>
            <div>
              <label className="text-xs tracking-[0.1em] uppercase text-[var(--muted)] block mb-1.5">Color</label>
              <input value={form.color} onChange={(e) => setForm({ ...form, color: e.target.value })}
                className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-full px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--gold)]" />
            </div>
          </div>

          {/* Image management — always visible */}
          <div className="mt-8 pt-8 border-t border-[var(--border)]">
            <h3 className="font-serif text-lg text-[var(--text)] mb-4 flex items-center gap-2">
              <ImageIcon className="h-5 w-5 text-[var(--gold)]" /> Imágenes del producto
            </h3>

            {editingId && editingProduct ? (
              <>
                {editingProduct.images && editingProduct.images.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-6">
                    {editingProduct.images.map((img) => (
                      <div key={img.id} className="relative group aspect-[3/4] rounded-xl overflow-hidden border border-[var(--border)] bg-[var(--bg)]">
                        <img src={img.url} alt="" className="w-full h-full object-cover"
                          onError={(e) => { e.currentTarget.style.display = 'none' }} />
                        <button type="button" onClick={() => setDeleteImageTarget({ img, pid: editingId })}
                          className="absolute top-2 right-2 bg-red-600 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700">
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-[var(--muted)] mb-6">Este producto no tiene imágenes aún.</p>
                )}

                <div className="flex items-center gap-4">
                  <label className={`cursor-pointer flex items-center gap-2 bg-[var(--surface)] border border-[var(--border)] rounded-full px-5 py-2.5 text-xs tracking-[0.1em] uppercase text-[var(--text)] hover:border-[var(--gold)] transition-colors ${imageUploading ? 'opacity-50 pointer-events-none' : ''}`}>
                    <Upload className="h-3.5 w-3.5" />
                    {imageUploading ? 'Subiendo...' : 'Subir imagen'}
                    <input type="file" accept="image/jpeg,image/png,image/webp" className="hidden" disabled={imageUploading}
                      onChange={(e) => { const f = e.target.files?.[0]; if (f) handleImageUpload(editingId, f); e.target.value = '' }} />
                  </label>
                  <span className="text-[10px] text-[var(--muted)]">JPEG, PNG o WebP. Máx 5MB.</span>
                </div>
              </>
            ) : (
              <>
                {pendingImages.length > 0 ? (
                  <div className="mb-6 space-y-2">
                    {pendingImages.map((f, i) => (
                      <div key={i} className="flex items-center gap-3 text-sm text-[var(--text)] bg-[var(--surface)] rounded-xl px-4 py-2 border border-[var(--border)]">
                        <ImageIcon className="h-4 w-4 text-[var(--gold)]" />
                        <span className="flex-1 truncate">{f.name}</span>
                        <span className="text-[10px] text-[var(--muted)]">{(f.size / 1024).toFixed(0)} KB</span>
                        <button type="button" onClick={() => setPendingImages(prev => prev.filter((_, j) => j !== i))}
                          className="text-red-500 hover:text-red-700">
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-[var(--muted)] mb-6">Selecciona imágenes para subir después de crear el producto.</p>
                )}

                <div className="flex items-center gap-4">
                  <label className="cursor-pointer flex items-center gap-2 bg-[var(--surface)] border border-[var(--border)] rounded-full px-5 py-2.5 text-xs tracking-[0.1em] uppercase text-[var(--text)] hover:border-[var(--gold)] transition-colors">
                    <Upload className="h-3.5 w-3.5" />
                    Agregar imagen
                    <input type="file" accept="image/jpeg,image/png,image/webp" className="hidden"
                      onChange={(e) => { const f = e.target.files?.[0]; if (f) { handleQueueImage(f); } e.target.value = '' }} />
                  </label>
                  <span className="text-[10px] text-[var(--muted)]">JPEG, PNG o WebP. Máx 5MB.</span>
                </div>
              </>
            )}
            {imageError && <p className="text-red-500 text-xs mt-2 flex items-center gap-1"><AlertCircle className="h-3 w-3" /> {imageError}</p>}
          </div>

          <div className="flex gap-3 mt-8 pt-8 border-t border-[var(--border)]">
            <button type="submit" disabled={submitting}
              className="bg-[var(--text)] text-[var(--card)] px-6 py-2.5 rounded-full text-xs tracking-[0.1em] uppercase hover:bg-[var(--gold-dark)] transition-colors btn-gold disabled:opacity-50 disabled:cursor-not-allowed">
              {submitting ? 'Guardando...' : editingId ? 'Actualizar Producto' : 'Crear Producto'}
            </button>
          </div>
        </form>
      )}

      <div className="bg-[var(--card)] rounded-2xl border border-[var(--border)] overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-[var(--surface)] text-[var(--muted)] text-xs tracking-[0.05em] uppercase">
            <tr>
              <th className="text-left p-4 font-medium">Nombre</th>
              <th className="text-left p-4 font-medium">Categoría</th>
              <th className="text-left p-4 font-medium">Tipo</th>
              <th className="text-right p-4 font-medium">Precio</th>
              <th className="text-right p-4 font-medium">Stock</th>
              <th className="text-center p-4 font-medium">Disp.</th>
              <th className="text-center p-4 font-medium">Imágenes</th>
              <th className="text-center p-4 font-medium">Acción</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)]">
            {paginated.map((p) => (
              <tr key={p.id} className="hover:bg-[var(--surface)] transition-colors">
                <td className="p-4 font-medium text-[var(--text)]">{p.name}</td>
                <td className="p-4 text-[var(--muted)] capitalize">{p.category}</td>
                <td className="p-4">
                  <span className={`badge ${p.type === 'rent' ? 'bg-[var(--gold)]/20 text-[var(--gold-dark)]' : 'bg-[var(--text)]/10 text-[var(--text)]'}`}>{p.type === 'rent' ? 'Arriendo' : p.type === 'sale' ? 'Venta' : 'Dual'}</span>
                </td>
                <td className="p-4 text-right text-[var(--text)] price">${p.price.toLocaleString('es-CL')}</td>
                <td className="p-4 text-right text-[var(--text)]">{p.stock}</td>
                <td className="p-4 text-center">{p.is_available ? <span className="text-green-700 text-xs">Sí</span> : <span className="text-red-600 text-xs">No</span>}</td>
                <td className="p-4 text-center">
                  <div className="flex items-center justify-center gap-1">
                    {p.images && p.images.length > 0 ? (
                      p.images.slice(0, 3).map((img) => (
                        <div key={img.id} className="w-7 h-7 rounded-md overflow-hidden border border-[var(--border)] bg-[var(--bg)]">
                          <img src={img.url} alt="" className="w-full h-full object-cover"
                            onError={(e) => { e.currentTarget.style.display = 'none' }} />
                        </div>
                      ))
                    ) : (
                      <span className="text-[10px] text-[var(--muted)]">—</span>
                    )}
                    {p.images && p.images.length > 3 && <span className="text-[10px] text-[var(--muted)]">+{p.images.length - 3}</span>}
                  </div>
                </td>
                <td className="p-4 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <button onClick={() => openEdit(p)} className="text-xs text-[var(--text)] hover:text-[var(--gold-dark)] transition-colors tracking-wide flex items-center gap-1">
                      <Pencil className="h-3 w-3" /> Editar
                    </button>
                    <button onClick={() => setDeleteTarget(p.id)} className="text-xs text-red-600 hover:text-red-800 transition-colors tracking-wide">Eliminar</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Pagination current={page} total={totalPages} onChange={(p) => { setPage(p) }} />
    </div>
  )
}

/* ───── ARRIENDOS ───── */

function AdminRentals() {
  const [rentals, setRentals] = useState<Rental[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [statusTarget, setStatusTarget] = useState<{ id: string; status: Rental['status'] } | null>(null)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  const load = useCallback(async () => {
    try { const data = await rentalService.getAll(); setRentals(data) } finally { setLoading(false) }
  }, [])

  useEffect(() => { load() }, [load])

  const handleStatusUpdate = async () => {
    if (!statusTarget) return
    try {
      await rentalService.update(statusTarget.id, { status: statusTarget.status })
      setStatusTarget(null)
      setToast({ message: 'Estado actualizado correctamente', type: 'success' })
      load()
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || 'Error al actualizar estado'
      setToast({ message: msg, type: 'error' })
    }
  }

  if (loading) return <div className="animate-pulse h-40 bg-[var(--border)] rounded-2xl" />

  const totalPages = Math.ceil(rentals.length / PAGE_SIZE)
  const paginated = rentals.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  return (
    <div>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <ConfirmModal
        open={!!statusTarget}
        title="Cambiar estado"
        message={`¿Cambiar estado del arriendo a "${statusTarget?.status === 'active' ? 'Activo' : statusTarget?.status === 'completed' ? 'Completado' : 'Cancelado'}"?`}
        onConfirm={handleStatusUpdate}
        onCancel={() => setStatusTarget(null)}
      />

      <h2 className="font-serif text-xl text-[var(--text)] mb-6">Arriendos <span className="text-[var(--muted)] font-sans text-sm">({rentals.length})</span></h2>
      <div className="bg-[var(--card)] rounded-2xl border border-[var(--border)] overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-[var(--surface)] text-[var(--muted)] text-xs tracking-[0.05em] uppercase">
            <tr>
              <th className="text-left p-4 font-medium">Producto</th>
              <th className="text-left p-4 font-medium">Cliente</th>
              <th className="text-left p-4 font-medium">Período</th>
              <th className="text-right p-4 font-medium">Total</th>
              <th className="text-center p-4 font-medium">Estado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)]">
            {paginated.map((r) => (
              <tr key={r.id} className="hover:bg-[var(--surface)] transition-colors">
                <td className="p-4 font-medium text-[var(--text)]">{r.product?.name || '—'}</td>
                <td className="p-4 text-[var(--muted)]">{r.client?.name || '—'}</td>
                <td className="p-4 text-[var(--muted)] text-xs">{new Date(r.start_date).toLocaleDateString()} — {new Date(r.end_date).toLocaleDateString()}</td>
                <td className="p-4 text-right text-[var(--text)] price">${r.rental_price?.toLocaleString('es-CL')}</td>
                <td className="p-4 text-center">
                  <select value={r.status} onChange={(e) => setStatusTarget({ id: r.id, status: e.target.value as Rental['status'] })}
                    className={`badge appearance-none cursor-pointer ${r.status === 'active' ? 'bg-green-100 text-green-800' : r.status === 'completed' ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800'}`}>
                    <option value="active">Activo</option>
                    <option value="completed">Completado</option>
                    <option value="cancelled">Cancelado</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Pagination current={page} total={totalPages} onChange={(p) => { setPage(p) }} />
    </div>
  )
}

/* ───── CLIENTES ───── */

function AdminClients() {
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState({ name: '', email: '', phone: '', client_type: 'natural' as Client['client_type'], tax_document: '' })
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  const load = useCallback(async () => {
    try { const data = await clientService.getAll(); setClients(data) } finally { setLoading(false) }
  }, [])

  useEffect(() => { load() }, [load])

  const validate = () => {
    const errs: Record<string, string> = {}
    if (!form.name.trim()) errs.name = 'El nombre es obligatorio'
    if (!form.email.trim()) errs.email = 'El email es obligatorio'
    setFormErrors(errs)
    return Object.keys(errs).length === 0
  }

  const openCreate = () => {
    setEditingId(null)
    setForm({ name: '', email: '', phone: '', client_type: 'natural', tax_document: '' })
    setFormErrors({})
    setShowForm(true)
  }

  const openEdit = (c: Client) => {
    setEditingId(c.id)
    setForm({ name: c.name, email: c.email, phone: c.phone, client_type: c.client_type, tax_document: c.tax_document || '' })
    setFormErrors({})
    setShowForm(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    setSubmitting(true)
    try {
      if (editingId) {
        await clientService.update(editingId, form)
        setToast({ message: 'Cliente actualizado correctamente', type: 'success' })
      } else {
        await clientService.create(form)
        setToast({ message: 'Cliente creado correctamente', type: 'success' })
      }
      setShowForm(false)
      setEditingId(null)
      setPage(1)
      load()
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || 'Error al guardar el cliente'
      setToast({ message: msg, type: 'error' })
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await clientService.delete(id)
      setDeleteTarget(null)
      setToast({ message: 'Cliente eliminado correctamente', type: 'success' })
      setPage(1)
      load()
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || 'Error al eliminar el cliente'
      setToast({ message: msg, type: 'error' })
    }
  }

  if (loading) return <div className="animate-pulse h-40 bg-[var(--border)] rounded-2xl" />

  const totalPages = Math.ceil(clients.length / PAGE_SIZE)
  const paginated = clients.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  return (
    <div>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <ConfirmModal
        open={!!deleteTarget}
        title="Eliminar cliente"
        message="¿Estás seguro de eliminar este cliente? Esta acción no se puede deshacer."
        onConfirm={() => deleteTarget && handleDelete(deleteTarget)}
        onCancel={() => setDeleteTarget(null)}
      />

      <div className="flex justify-between items-center mb-6">
        <h2 className="font-serif text-xl text-[var(--text)]">Clientes <span className="text-[var(--muted)] font-sans text-sm">({clients.length})</span></h2>
        <button onClick={() => showForm ? setShowForm(false) : openCreate()}
          className="flex items-center gap-2 bg-[var(--text)] text-[var(--card)] px-5 py-2.5 rounded-full text-xs tracking-[0.1em] uppercase hover:bg-[var(--gold-dark)] transition-colors">
          <Plus className="h-3.5 w-3.5" /> {showForm ? 'Cancelar' : 'Nuevo'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-[var(--card)] p-6 rounded-2xl border border-[var(--border)] mb-8 grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="text-xs tracking-[0.1em] uppercase text-[var(--muted)] block mb-1.5">Nombre</label>
            <input value={form.name} onChange={(e) => { setForm({ ...form, name: e.target.value }); setFormErrors({ ...formErrors, name: '' }) }} required
              className={`w-full bg-[var(--surface)] border rounded-full px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--gold)] ${formErrors.name ? 'border-red-400' : 'border-[var(--border)]'}`} />
            {formErrors.name && <p className="text-red-500 text-[10px] mt-1">{formErrors.name}</p>}
          </div>
          <div>
            <label className="text-xs tracking-[0.1em] uppercase text-[var(--muted)] block mb-1.5">Email</label>
            <input type="email" value={form.email} onChange={(e) => { setForm({ ...form, email: e.target.value }); setFormErrors({ ...formErrors, email: '' }) }} required
              className={`w-full bg-[var(--surface)] border rounded-full px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--gold)] ${formErrors.email ? 'border-red-400' : 'border-[var(--border)]'}`} />
            {formErrors.email && <p className="text-red-500 text-[10px] mt-1">{formErrors.email}</p>}
          </div>
          <div>
            <label className="text-xs tracking-[0.1em] uppercase text-[var(--muted)] block mb-1.5">Teléfono</label>
            <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required
              className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-full px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--gold)]" />
          </div>
          <div>
            <label className="text-xs tracking-[0.1em] uppercase text-[var(--muted)] block mb-1.5">Tipo</label>
            <select value={form.client_type} onChange={(e) => setForm({ ...form, client_type: e.target.value as Client['client_type'] })}
              className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-full px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--gold)]">
              <option value="natural">Persona Natural</option>
              <option value="empresa">Empresa</option>
              <option value="agrupacion_cultural">Agrupación Cultural</option>
            </select>
          </div>
          <div>
            <label className="text-xs tracking-[0.1em] uppercase text-[var(--muted)] block mb-1.5">RUT / Documento</label>
            <input value={form.tax_document} onChange={(e) => setForm({ ...form, tax_document: e.target.value })}
              className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-full px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--gold)]" />
          </div>
          <div className="md:col-span-2">
            <button type="submit" disabled={submitting}
              className="bg-[var(--text)] text-[var(--card)] px-6 py-2.5 rounded-full text-xs tracking-[0.1em] uppercase hover:bg-[var(--gold-dark)] transition-colors btn-gold disabled:opacity-50 disabled:cursor-not-allowed">
              {submitting ? 'Guardando...' : editingId ? 'Actualizar Cliente' : 'Crear Cliente'}
            </button>
          </div>
        </form>
      )}

      <div className="bg-[var(--card)] rounded-2xl border border-[var(--border)] overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-[var(--surface)] text-[var(--muted)] text-xs tracking-[0.05em] uppercase">
            <tr>
              <th className="text-left p-4 font-medium">Nombre</th>
              <th className="text-left p-4 font-medium">Email</th>
              <th className="text-left p-4 font-medium">Teléfono</th>
              <th className="text-left p-4 font-medium">Tipo</th>
              <th className="text-center p-4 font-medium">Acción</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)]">
            {paginated.map((c) => (
              <tr key={c.id} className="hover:bg-[var(--surface)] transition-colors">
                <td className="p-4 font-medium text-[var(--text)]">{c.name}</td>
                <td className="p-4 text-[var(--muted)]">{c.email}</td>
                <td className="p-4 text-[var(--muted)]">{c.phone}</td>
                <td className="p-4">
                  <span className="badge bg-[var(--bg)] text-[var(--muted)]">{c.client_type === 'natural' ? 'Persona' : c.client_type === 'empresa' ? 'Empresa' : 'Ag. Cultural'}</span>
                </td>
                <td className="p-4 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <button onClick={() => openEdit(c)} className="text-xs text-[var(--text)] hover:text-[var(--gold-dark)] transition-colors tracking-wide flex items-center gap-1">
                      <Pencil className="h-3 w-3" /> Editar
                    </button>
                    <button onClick={() => setDeleteTarget(c.id)} className="text-xs text-red-600 hover:text-red-800 transition-colors tracking-wide">Eliminar</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Pagination current={page} total={totalPages} onChange={(p) => { setPage(p) }} />
    </div>
  )
}

/* ───── VENTAS ───── */

function AdminSales() {
  const [sales, setSales] = useState<Sale[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  const load = useCallback(async () => {
    try { const data = await salesService.getAll(); setSales(data) } finally { setLoading(false) }
  }, [])

  useEffect(() => { load() }, [load])

  const handleCancel = async (id: string) => {
    try {
      await salesService.update(id, { payment_status: 'cancelled' })
      setToast({ message: 'Venta cancelada correctamente', type: 'success' })
      load()
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || 'Error al cancelar venta'
      setToast({ message: msg, type: 'error' })
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await salesService.delete(id)
      setDeleteTarget(null)
      setToast({ message: 'Venta eliminada y stock restaurado', type: 'success' })
      setPage(1); load()
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || 'Error al eliminar venta'
      setToast({ message: msg, type: 'error' })
    }
  }

  if (loading) return <div className="animate-pulse h-40 bg-[var(--border)] rounded-2xl" />

  const totalPages = Math.ceil(sales.length / PAGE_SIZE)
  const paginated = sales.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  return (
    <div>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <ConfirmModal open={!!deleteTarget} title="Eliminar venta" message="¿Estás seguro de eliminar esta venta? El stock será restaurado."
        onConfirm={() => deleteTarget && handleDelete(deleteTarget)} onCancel={() => setDeleteTarget(null)} />

      <h2 className="font-serif text-xl text-[var(--text)] mb-6">Ventas <span className="text-[var(--muted)] font-sans text-sm">({sales.length})</span></h2>
      <div className="bg-[var(--card)] rounded-2xl border border-[var(--border)] overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-[var(--surface)] text-[var(--muted)] text-xs tracking-[0.05em] uppercase">
            <tr>
              <th className="text-left p-4 font-medium">Producto</th>
              <th className="text-left p-4 font-medium">Cliente</th>
              <th className="text-right p-4 font-medium">Total</th>
              <th className="text-center p-4 font-medium">Pago</th>
              <th className="text-left p-4 font-medium">Fecha</th>
              <th className="text-center p-4 font-medium">Acción</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)]">
            {paginated.map((s) => (
              <tr key={s.id} className="hover:bg-[var(--surface)] transition-colors">
                <td className="p-4 font-medium text-[var(--text)]">{s.product?.name || '—'}</td>
                <td className="p-4 text-[var(--muted)]">{s.client?.name || '—'}</td>
                <td className="p-4 text-right text-[var(--text)] price">${s.sale_price.toLocaleString('es-CL')}</td>
                <td className="p-4 text-center">
                  <span className={`badge ${s.payment_status === 'paid' ? 'bg-green-100 text-green-800' : s.payment_status === 'pending' ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'}`}>
                    {s.payment_status === 'paid' ? 'Pagado' : s.payment_status === 'pending' ? 'Pendiente' : 'Cancelado'}
                  </span>
                </td>
                <td className="p-4 text-[var(--muted)] text-xs">{new Date(s.created_at).toLocaleDateString()}</td>
                <td className="p-4 text-center">
                  <div className="flex items-center justify-center gap-2">
                    {s.payment_status !== 'cancelled' && (
                      <button onClick={() => handleCancel(s.id)} className="text-xs text-amber-600 hover:text-amber-800 transition-colors tracking-wide">Anular</button>
                    )}
                    <button onClick={() => setDeleteTarget(s.id)} className="text-xs text-red-600 hover:text-red-800 transition-colors tracking-wide">Eliminar</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Pagination current={page} total={totalPages} onChange={(p) => { setPage(p) }} />
    </div>
  )
}

/* ───── DEVOLUCIONES ───── */

function AdminReturns() {
  const [returns, setReturns] = useState<ReturnType[]>([])
  const [rentals, setRentals] = useState<Rental[]>([])
  const [damageTypes, setDamageTypes] = useState<DamageType[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ rental_id: '', product_state: 'good', damage_type_id: '', notes: '' })
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState(false)
  const [page, setPage] = useState(1)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  const load = useCallback(async () => {
    try {
      const [rData, rlData, dtData] = await Promise.all([
        returnsService.getAll(),
        rentalService.getAll(),
        damageTypesService.getAll(),
      ])
      setReturns(rData); setRentals(rlData); setDamageTypes(dtData)
    } finally { setLoading(false) }
  }, [])

  useEffect(() => { load() }, [load])

  const validate = () => {
    const errs: Record<string, string> = {}
    if (!form.rental_id) errs.rental_id = 'Selecciona un arriendo'
    if (!form.product_state) errs.product_state = 'Selecciona el estado del producto'
    setFormErrors(errs)
    return Object.keys(errs).length === 0
  }

  const openCreate = () => {
    setForm({ rental_id: '', product_state: 'good', damage_type_id: '', notes: '' })
    setFormErrors({})
    setShowForm(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    setSubmitting(true)
    try {
      await returnsService.create({
        rental_id: form.rental_id,
        product_state: form.product_state,
        damage_type_id: form.damage_type_id || undefined,
      })
      setToast({ message: 'Devolución registrada correctamente', type: 'success' })
      setShowForm(false); setPage(1); load()
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || 'Error al registrar devolución'
      setToast({ message: msg, type: 'error' })
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <div className="animate-pulse h-40 bg-[var(--border)] rounded-2xl" />

  const totalPages = Math.ceil(returns.length / PAGE_SIZE)
  const paginated = returns.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  return (
    <div>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="flex justify-between items-center mb-6">
        <h2 className="font-serif text-xl text-[var(--text)]">Devoluciones <span className="text-[var(--muted)] font-sans text-sm">({returns.length})</span></h2>
        <button onClick={() => showForm ? setShowForm(false) : openCreate()}
          className="flex items-center gap-2 bg-[var(--text)] text-[var(--card)] px-5 py-2.5 rounded-full text-xs tracking-[0.1em] uppercase hover:bg-[var(--gold-dark)] transition-colors">
          <Plus className="h-3.5 w-3.5" /> {showForm ? 'Cancelar' : 'Nueva Devolución'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-[var(--card)] p-6 rounded-2xl border border-[var(--border)] mb-8 grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="text-xs tracking-[0.1em] uppercase text-[var(--muted)] block mb-1.5">Arriendo</label>
            <select value={form.rental_id} onChange={(e) => { setForm({ ...form, rental_id: e.target.value }); setFormErrors({ ...formErrors, rental_id: '' }) }} required
              className={`w-full bg-[var(--surface)] border rounded-full px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--gold)] ${formErrors.rental_id ? 'border-red-400' : 'border-[var(--border)]'}`}>
              <option value="">Seleccionar arriendo</option>
              {rentals.filter(r => r.status !== 'cancelled').map((rl) => (
                <option key={rl.id} value={rl.id}>{rl.product?.name || rl.product_id.slice(0, 8)} — {new Date(rl.start_date).toLocaleDateString()}</option>
              ))}
            </select>
            {formErrors.rental_id && <p className="text-red-500 text-[10px] mt-1">{formErrors.rental_id}</p>}
          </div>
          <div>
            <label className="text-xs tracking-[0.1em] uppercase text-[var(--muted)] block mb-1.5">Estado del Producto</label>
            <select value={form.product_state} onChange={(e) => setForm({ ...form, product_state: e.target.value })}
              className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-full px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--gold)]">
              <option value="good">Bueno</option>
              <option value="fair">Regular</option>
              <option value="damaged">Dañado</option>
              <option value="lost">Perdido</option>
            </select>
          </div>
          <div>
            <label className="text-xs tracking-[0.1em] uppercase text-[var(--muted)] block mb-1.5">Tipo de Daño</label>
            <select value={form.damage_type_id} onChange={(e) => setForm({ ...form, damage_type_id: e.target.value })}
              className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-full px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--gold)]">
              <option value="">Sin daño</option>
              {damageTypes.map((dt) => (
                <option key={dt.id} value={dt.id}>{dt.name} (+${dt.surcharge_amount.toLocaleString('es-CL')})</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs tracking-[0.1em] uppercase text-[var(--muted)] block mb-1.5">Notas</label>
            <input value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })}
              className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-full px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--gold)]" />
          </div>
          <div className="md:col-span-2">
            <button type="submit" disabled={submitting}
              className="bg-[var(--text)] text-[var(--card)] px-6 py-2.5 rounded-full text-xs tracking-[0.1em] uppercase hover:bg-[var(--gold-dark)] transition-colors btn-gold disabled:opacity-50 disabled:cursor-not-allowed">
              {submitting ? 'Guardando...' : 'Registrar Devolución'}
            </button>
          </div>
        </form>
      )}

      <div className="bg-[var(--card)] rounded-2xl border border-[var(--border)] overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-[var(--surface)] text-[var(--muted)] text-xs tracking-[0.05em] uppercase">
            <tr>
              <th className="text-left p-4 font-medium">Producto</th>
              <th className="text-left p-4 font-medium">Estado Producto</th>
              <th className="text-right p-4 font-medium">Recargo</th>
              <th className="text-left p-4 font-medium">Fecha</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)]">
            {paginated.map((r) => (
              <tr key={r.id} className="hover:bg-[var(--surface)] transition-colors">
                <td className="p-4 text-[var(--text)]">{r.rental?.product?.name || r.rental_id.slice(0, 8) + '…'}</td>
                <td className="p-4 text-[var(--muted)]">{r.product_state}</td>
                <td className="p-4 text-right text-[var(--text)]">${r.surcharge_amount?.toLocaleString('es-CL') || '0'}</td>
                <td className="p-4 text-[var(--muted)] text-xs">{new Date(r.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Pagination current={page} total={totalPages} onChange={(p) => { setPage(p) }} />
    </div>
  )
}

/* ───── DESPACHOS ───── */

function AdminDispatches() {
  const [items, setItems] = useState<Dispatch[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState({ sale_id: '', rental_id: '', courier: '', tracking_number: '', cost: 0, status: 'pending' as Dispatch['status'] })
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [page, setPage] = useState(1)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  const load = useCallback(async () => {
    try { const data = await dispatchesService.getAll(); setItems(data) } finally { setLoading(false) }
  }, [])

  useEffect(() => { load() }, [load])

  const validate = () => {
    const errs: Record<string, string> = {}
    if (!form.courier.trim()) errs.courier = 'El courier es obligatorio'
    if (!form.tracking_number.trim()) errs.tracking_number = 'El número de seguimiento es obligatorio'
    if (form.cost < 0) errs.cost = 'El costo no puede ser negativo'
    setFormErrors(errs)
    return Object.keys(errs).length === 0
  }

  const openCreate = () => {
    setEditingId(null)
    setForm({ sale_id: '', rental_id: '', courier: '', tracking_number: '', cost: 0, status: 'pending' })
    setFormErrors({})
    setShowForm(true)
  }

  const openEdit = (d: Dispatch) => {
    setEditingId(d.id)
    setForm({ sale_id: d.sale_id || '', rental_id: d.rental_id || '', courier: d.courier, tracking_number: d.tracking_number, cost: d.cost, status: d.status })
    setFormErrors({})
    setShowForm(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    setSubmitting(true)
    try {
      if (editingId) {
        await dispatchesService.update(editingId, form)
        setToast({ message: 'Despacho actualizado correctamente', type: 'success' })
      } else {
        await dispatchesService.create(form)
        setToast({ message: 'Despacho creado correctamente', type: 'success' })
      }
      setShowForm(false); setEditingId(null); setPage(1); load()
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || 'Error al guardar el despacho'
      setToast({ message: msg, type: 'error' })
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await dispatchesService.delete(id); setDeleteTarget(null)
      setToast({ message: 'Despacho eliminado correctamente', type: 'success' })
      setPage(1); load()
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || 'Error al eliminar el despacho'
      setToast({ message: msg, type: 'error' })
    }
  }

  if (loading) return <div className="animate-pulse h-40 bg-[var(--border)] rounded-2xl" />

  const totalPages = Math.ceil(items.length / PAGE_SIZE)
  const paginated = items.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  return (
    <div>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <ConfirmModal open={!!deleteTarget} title="Eliminar despacho" message="¿Estás seguro de eliminar este despacho?"
        onConfirm={() => deleteTarget && handleDelete(deleteTarget)} onCancel={() => setDeleteTarget(null)} />

      <div className="flex justify-between items-center mb-6">
        <h2 className="font-serif text-xl text-[var(--text)]">Despachos <span className="text-[var(--muted)] font-sans text-sm">({items.length})</span></h2>
        <button onClick={() => showForm ? setShowForm(false) : openCreate()}
          className="flex items-center gap-2 bg-[var(--text)] text-[var(--card)] px-5 py-2.5 rounded-full text-xs tracking-[0.1em] uppercase hover:bg-[var(--gold-dark)] transition-colors">
          <Plus className="h-3.5 w-3.5" /> {showForm ? 'Cancelar' : 'Nuevo'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-[var(--card)] p-6 rounded-2xl border border-[var(--border)] mb-8 grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="text-xs tracking-[0.1em] uppercase text-[var(--muted)] block mb-1.5">Courier</label>
            <input value={form.courier} onChange={(e) => { setForm({ ...form, courier: e.target.value }); setFormErrors({ ...formErrors, courier: '' }) }} required
              className={`w-full bg-[var(--surface)] border rounded-full px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--gold)] ${formErrors.courier ? 'border-red-400' : 'border-[var(--border)]'}`} />
            {formErrors.courier && <p className="text-red-500 text-[10px] mt-1">{formErrors.courier}</p>}
          </div>
          <div>
            <label className="text-xs tracking-[0.1em] uppercase text-[var(--muted)] block mb-1.5">N° Seguimiento</label>
            <input value={form.tracking_number} onChange={(e) => { setForm({ ...form, tracking_number: e.target.value }); setFormErrors({ ...formErrors, tracking_number: '' }) }} required
              className={`w-full bg-[var(--surface)] border rounded-full px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--gold)] ${formErrors.tracking_number ? 'border-red-400' : 'border-[var(--border)]'}`} />
            {formErrors.tracking_number && <p className="text-red-500 text-[10px] mt-1">{formErrors.tracking_number}</p>}
          </div>
          <div>
            <label className="text-xs tracking-[0.1em] uppercase text-[var(--muted)] block mb-1.5">Costo</label>
            <input type="number" value={form.cost} onChange={(e) => { setForm({ ...form, cost: Number(e.target.value) }); setFormErrors({ ...formErrors, cost: '' }) }} required
              className={`w-full bg-[var(--surface)] border rounded-full px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--gold)] ${formErrors.cost ? 'border-red-400' : 'border-[var(--border)]'}`} />
            {formErrors.cost && <p className="text-red-500 text-[10px] mt-1">{formErrors.cost}</p>}
          </div>
          <div>
            <label className="text-xs tracking-[0.1em] uppercase text-[var(--muted)] block mb-1.5">Estado</label>
            <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as Dispatch['status'] })}
              className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-full px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--gold)]">
              <option value="pending">Pendiente</option>
              <option value="shipped">Enviado</option>
              <option value="delivered">Entregado</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <button type="submit" disabled={submitting}
              className="bg-[var(--text)] text-[var(--card)] px-6 py-2.5 rounded-full text-xs tracking-[0.1em] uppercase hover:bg-[var(--gold-dark)] transition-colors btn-gold disabled:opacity-50 disabled:cursor-not-allowed">
              {submitting ? 'Guardando...' : editingId ? 'Actualizar Despacho' : 'Crear Despacho'}
            </button>
          </div>
        </form>
      )}

      <div className="bg-[var(--card)] rounded-2xl border border-[var(--border)] overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-[var(--surface)] text-[var(--muted)] text-xs tracking-[0.05em] uppercase">
            <tr>
              <th className="text-left p-4 font-medium">Courier</th>
              <th className="text-left p-4 font-medium">Seguimiento</th>
              <th className="text-right p-4 font-medium">Costo</th>
              <th className="text-center p-4 font-medium">Estado</th>
              <th className="text-left p-4 font-medium">Fecha</th>
              <th className="text-center p-4 font-medium">Acción</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)]">
            {paginated.map((d) => (
              <tr key={d.id} className="hover:bg-[var(--surface)] transition-colors">
                <td className="p-4 font-medium text-[var(--text)]">{d.courier}</td>
                <td className="p-4 text-[var(--muted)]">{d.tracking_number}</td>
                <td className="p-4 text-right text-[var(--text)]">${d.cost.toLocaleString('es-CL')}</td>
                <td className="p-4 text-center">
                  <span className={`badge ${d.status === 'delivered' ? 'bg-green-100 text-green-800' : d.status === 'shipped' ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-800'}`}>
                    {d.status === 'delivered' ? 'Entregado' : d.status === 'shipped' ? 'Enviado' : 'Pendiente'}
                  </span>
                </td>
                <td className="p-4 text-[var(--muted)] text-xs">{new Date(d.created_at).toLocaleDateString()}</td>
                <td className="p-4 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <button onClick={() => openEdit(d)} className="text-xs text-[var(--text)] hover:text-[var(--gold-dark)] transition-colors tracking-wide flex items-center gap-1">
                      <Pencil className="h-3 w-3" /> Editar
                    </button>
                    <button onClick={() => setDeleteTarget(d.id)} className="text-xs text-red-600 hover:text-red-800 transition-colors tracking-wide">Eliminar</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Pagination current={page} total={totalPages} onChange={(p) => { setPage(p) }} />
    </div>
  )
}

/* ───── TIPOS DE DAÑO ───── */

function AdminDamageTypes() {
  const [items, setItems] = useState<DamageType[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState({ name: '', surcharge_amount: 0 })
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  const load = useCallback(async () => {
    try { const data = await damageTypesService.getAll(); setItems(data) } finally { setLoading(false) }
  }, [])

  useEffect(() => { load() }, [load])

  const validate = () => {
    const errs: Record<string, string> = {}
    if (!form.name.trim()) errs.name = 'El nombre es obligatorio'
    if (form.surcharge_amount < 0) errs.surcharge_amount = 'El recargo no puede ser negativo'
    setFormErrors(errs)
    return Object.keys(errs).length === 0
  }

  const openCreate = () => { setEditingId(null); setForm({ name: '', surcharge_amount: 0 }); setFormErrors({}); setShowForm(true) }
  const openEdit = (d: DamageType) => { setEditingId(d.id); setForm({ name: d.name, surcharge_amount: d.surcharge_amount }); setFormErrors({}); setShowForm(true) }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    setSubmitting(true)
    try {
      if (editingId) {
        await damageTypesService.update(editingId, form)
        setToast({ message: 'Tipo de daño actualizado correctamente', type: 'success' })
      } else {
        await damageTypesService.create(form)
        setToast({ message: 'Tipo de daño creado correctamente', type: 'success' })
      }
      setShowForm(false); setEditingId(null); load()
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || 'Error al guardar el tipo de daño'
      setToast({ message: msg, type: 'error' })
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await damageTypesService.delete(id); setDeleteTarget(null)
      setToast({ message: 'Tipo de daño eliminado correctamente', type: 'success' })
      load()
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || 'Error al eliminar el tipo de daño'
      setToast({ message: msg, type: 'error' })
    }
  }

  if (loading) return <div className="animate-pulse h-40 bg-[var(--border)] rounded-2xl" />

  return (
    <div>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <ConfirmModal open={!!deleteTarget} title="Eliminar tipo de daño" message="¿Estás seguro de eliminar este tipo de daño?"
        onConfirm={() => deleteTarget && handleDelete(deleteTarget)} onCancel={() => setDeleteTarget(null)} />

      <div className="flex justify-between items-center mb-6">
        <h2 className="font-serif text-xl text-[var(--text)]">Tipos de Daño <span className="text-[var(--muted)] font-sans text-sm">({items.length})</span></h2>
        <button onClick={() => showForm ? setShowForm(false) : openCreate()}
          className="flex items-center gap-2 bg-[var(--text)] text-[var(--card)] px-5 py-2.5 rounded-full text-xs tracking-[0.1em] uppercase hover:bg-[var(--gold-dark)] transition-colors">
          <Plus className="h-3.5 w-3.5" /> {showForm ? 'Cancelar' : 'Nuevo'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-[var(--card)] p-6 rounded-2xl border border-[var(--border)] mb-8 grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="text-xs tracking-[0.1em] uppercase text-[var(--muted)] block mb-1.5">Nombre</label>
            <input value={form.name} onChange={(e) => { setForm({ ...form, name: e.target.value }); setFormErrors({ ...formErrors, name: '' }) }} required
              className={`w-full bg-[var(--surface)] border rounded-full px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--gold)] ${formErrors.name ? 'border-red-400' : 'border-[var(--border)]'}`} />
            {formErrors.name && <p className="text-red-500 text-[10px] mt-1">{formErrors.name}</p>}
          </div>
          <div>
            <label className="text-xs tracking-[0.1em] uppercase text-[var(--muted)] block mb-1.5">Recargo ($)</label>
            <input type="number" value={form.surcharge_amount} onChange={(e) => { setForm({ ...form, surcharge_amount: Number(e.target.value) }); setFormErrors({ ...formErrors, surcharge_amount: '' }) }} required
              className={`w-full bg-[var(--surface)] border rounded-full px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--gold)] ${formErrors.surcharge_amount ? 'border-red-400' : 'border-[var(--border)]'}`} />
            {formErrors.surcharge_amount && <p className="text-red-500 text-[10px] mt-1">{formErrors.surcharge_amount}</p>}
          </div>
          <div className="md:col-span-2">
            <button type="submit" disabled={submitting}
              className="bg-[var(--text)] text-[var(--card)] px-6 py-2.5 rounded-full text-xs tracking-[0.1em] uppercase hover:bg-[var(--gold-dark)] transition-colors btn-gold disabled:opacity-50 disabled:cursor-not-allowed">
              {submitting ? 'Guardando...' : editingId ? 'Actualizar' : 'Crear'}
            </button>
          </div>
        </form>
      )}

      <div className="bg-[var(--card)] rounded-2xl border border-[var(--border)] overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-[var(--surface)] text-[var(--muted)] text-xs tracking-[0.05em] uppercase">
            <tr>
              <th className="text-left p-4 font-medium">Nombre</th>
              <th className="text-right p-4 font-medium">Recargo</th>
              <th className="text-center p-4 font-medium">Acción</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)]">
            {items.map((d) => (
              <tr key={d.id} className="hover:bg-[var(--surface)] transition-colors">
                <td className="p-4 font-medium text-[var(--text)]">{d.name}</td>
                <td className="p-4 text-right text-[var(--text)]">${d.surcharge_amount.toLocaleString('es-CL')}</td>
                <td className="p-4 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <button onClick={() => openEdit(d)} className="text-xs text-[var(--text)] hover:text-[var(--gold-dark)] transition-colors tracking-wide flex items-center gap-1">
                      <Pencil className="h-3 w-3" /> Editar
                    </button>
                    <button onClick={() => setDeleteTarget(d.id)} className="text-xs text-red-600 hover:text-red-800 transition-colors tracking-wide">Eliminar</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

/* ───── INFO CORPORATIVA ───── */

function AdminCorporateInfo() {
  const [info, setInfo] = useState<CorporateInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState({ mission: '', vision: '', objectives: '', address: '', phone: '', email: '' })
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  useEffect(() => {
    corporateInfoService.get()
      .then((data) => { setInfo(data); setForm({ mission: data.mission, vision: data.vision, objectives: data.objectives, address: data.address, phone: data.phone, email: data.email }) })
      .catch(() => setToast({ message: 'Error al cargar información corporativa', type: 'error' }))
      .finally(() => setLoading(false))
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!info) return
    setSubmitting(true)
    try {
      await corporateInfoService.update(info.id, form)
      setInfo({ ...info, ...form })
      setEditing(false)
      setToast({ message: 'Información actualizada correctamente', type: 'success' })
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || 'Error al guardar'
      setToast({ message: msg, type: 'error' })
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <div className="animate-pulse h-40 bg-[var(--border)] rounded-2xl" />

  return (
    <div>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="flex justify-between items-center mb-6">
        <h2 className="font-serif text-xl text-[var(--text)]">Información Corporativa</h2>
        <button onClick={() => setEditing(!editing)}
          className="flex items-center gap-2 bg-[var(--text)] text-[var(--card)] px-5 py-2.5 rounded-full text-xs tracking-[0.1em] uppercase hover:bg-[var(--gold-dark)] transition-colors">
          <Pencil className="h-3.5 w-3.5" /> {editing ? 'Cancelar' : 'Editar'}
        </button>
      </div>

      {editing ? (
        <form onSubmit={handleSubmit} className="bg-[var(--card)] p-6 rounded-2xl border border-[var(--border)] space-y-5">
          <div>
            <label className="text-xs tracking-[0.1em] uppercase text-[var(--muted)] block mb-1.5">Misión</label>
            <textarea value={form.mission} onChange={(e) => setForm({ ...form, mission: e.target.value })} rows={3}
              className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--gold)]" />
          </div>
          <div>
            <label className="text-xs tracking-[0.1em] uppercase text-[var(--muted)] block mb-1.5">Visión</label>
            <textarea value={form.vision} onChange={(e) => setForm({ ...form, vision: e.target.value })} rows={3}
              className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--gold)]" />
          </div>
          <div>
            <label className="text-xs tracking-[0.1em] uppercase text-[var(--muted)] block mb-1.5">Objetivos</label>
            <textarea value={form.objectives} onChange={(e) => setForm({ ...form, objectives: e.target.value })} rows={3}
              className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--gold)]" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-xs tracking-[0.1em] uppercase text-[var(--muted)] block mb-1.5">Dirección</label>
              <input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })}
                className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-full px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--gold)]" />
            </div>
            <div>
              <label className="text-xs tracking-[0.1em] uppercase text-[var(--muted)] block mb-1.5">Teléfono</label>
              <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-full px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--gold)]" />
            </div>
            <div>
              <label className="text-xs tracking-[0.1em] uppercase text-[var(--muted)] block mb-1.5">Email</label>
              <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-full px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--gold)]" />
            </div>
          </div>
          <button type="submit" disabled={submitting}
            className="bg-[var(--text)] text-[var(--card)] px-6 py-2.5 rounded-full text-xs tracking-[0.1em] uppercase hover:bg-[var(--gold-dark)] transition-colors btn-gold disabled:opacity-50 disabled:cursor-not-allowed">
            {submitting ? 'Guardando...' : 'Guardar Cambios'}
          </button>
        </form>
      ) : info ? (
        <div className="bg-[var(--card)] p-6 rounded-2xl border border-[var(--border)] space-y-4">
          <div><span className="text-xs tracking-[0.1em] uppercase text-[var(--muted)]">Misión</span><p className="text-sm text-[var(--text)] mt-1">{info.mission}</p></div>
          <div><span className="text-xs tracking-[0.1em] uppercase text-[var(--muted)]">Visión</span><p className="text-sm text-[var(--text)] mt-1">{info.vision}</p></div>
          <div><span className="text-xs tracking-[0.1em] uppercase text-[var(--muted)]">Objetivos</span><p className="text-sm text-[var(--text)] mt-1">{info.objectives}</p></div>
          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-[var(--border)]">
            <div><span className="text-xs tracking-[0.1em] uppercase text-[var(--muted)]">Dirección</span><p className="text-sm text-[var(--text)] mt-1">{info.address}</p></div>
            <div><span className="text-xs tracking-[0.1em] uppercase text-[var(--muted)]">Teléfono</span><p className="text-sm text-[var(--text)] mt-1">{info.phone}</p></div>
            <div><span className="text-xs tracking-[0.1em] uppercase text-[var(--muted)]">Email</span><p className="text-sm text-[var(--text)] mt-1">{info.email}</p></div>
          </div>
        </div>
      ) : (
        <p className="text-[var(--muted)] text-sm">No hay información corporativa disponible.</p>
      )}
    </div>
  )
}
