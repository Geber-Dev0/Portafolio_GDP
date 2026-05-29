import { useState, useEffect, useCallback } from 'react'
import { productService } from '../services/products.service'
import { rentalService } from '../services/rentals.service'
import { clientService } from '../services/clients.service'
import { salesService } from '../services/sales.service'
import { returnsService } from '../services/returns.service'
import { dispatchesService } from '../services/dispatches.service'
import { damageTypesService } from '../services/damage-types.service'
import { corporateInfoService } from '../services/corporate-info.service'
import type { Product, Rental, Client, Sale, Return as ReturnType, Dispatch, DamageType, CorporateInfo } from '../types'
import { LayoutDashboard, Package, CalendarDays, Users, Plus, ChevronLeft, ChevronRight, DollarSign, Undo2, Truck, AlertTriangle, Building2, Upload, Pencil } from 'lucide-react'

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

/* ───── PRODUCTOS ───── */

function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState({ name: '', description: '', category: '', type: 'both' as Product['type'], price: 0, stock: 0, size: '', color: '' })
  const [page, setPage] = useState(1)
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null)

  const load = useCallback(async () => {
    try { const data = await productService.getAll(); setProducts(data) } finally { setLoading(false) }
  }, [])

  useEffect(() => { load() }, [load])

  const openCreate = () => {
    setEditingId(null)
    setForm({ name: '', description: '', category: '', type: 'both', price: 0, stock: 0, size: '', color: '' })
    setShowForm(true)
  }

  const openEdit = (p: Product) => {
    setEditingId(p.id)
    setForm({ name: p.name, description: p.description, category: p.category, type: p.type, price: p.price, stock: p.stock, size: p.size || '', color: p.color || '' })
    setShowForm(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (editingId) {
      await productService.update(editingId, form)
    } else {
      await productService.create(form)
    }
    setShowForm(false)
    setEditingId(null)
    load()
  }

  const handleDelete = async (id: string) => {
    await productService.delete(id)
    setDeleteTarget(null)
    load()
  }

  const handleImageUpload = async (productId: string, file: File) => {
    await productService.uploadImage(productId, file)
    load()
  }

  if (loading) return <div className="animate-pulse h-40 bg-[var(--border)] rounded-2xl" />

  const totalPages = Math.ceil(products.length / PAGE_SIZE)
  const paginated = products.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  return (
    <div>
      <ConfirmModal
        open={!!deleteTarget}
        title="Eliminar producto"
        message="¿Estás seguro de eliminar este producto? Esta acción no se puede deshacer."
        onConfirm={() => deleteTarget && handleDelete(deleteTarget)}
        onCancel={() => setDeleteTarget(null)}
      />

      <div className="flex justify-between items-center mb-6">
        <h2 className="font-serif text-xl text-[var(--text)]">Productos <span className="text-[var(--muted)] font-sans text-sm">({products.length})</span></h2>
        <button onClick={() => showForm ? setShowForm(false) : openCreate()}
          className="flex items-center gap-2 bg-[var(--text)] text-[var(--card)] px-5 py-2.5 rounded-full text-xs tracking-[0.1em] uppercase hover:bg-[var(--gold-dark)] transition-colors">
          <Plus className="h-3.5 w-3.5" /> {showForm ? 'Cancelar' : 'Nuevo'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-[var(--card)] p-6 rounded-2xl border border-[var(--border)] mb-8 grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="text-xs tracking-[0.1em] uppercase text-[var(--muted)] block mb-1.5">Nombre</label>
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required
              className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-full px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--gold)]" />
          </div>
          <div>
            <label className="text-xs tracking-[0.1em] uppercase text-[var(--muted)] block mb-1.5">Categoría</label>
            <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} required
              className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-full px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--gold)]">
              <option value="">Seleccionar</option>
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="text-xs tracking-[0.1em] uppercase text-[var(--muted)] block mb-1.5">Descripción</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3}
              className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--gold)]" />
          </div>
          <div>
            <label className="text-xs tracking-[0.1em] uppercase text-[var(--muted)] block mb-1.5">Precio</label>
            <input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} required
              className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-full px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--gold)]" />
          </div>
          <div>
            <label className="text-xs tracking-[0.1em] uppercase text-[var(--muted)] block mb-1.5">Stock</label>
            <input type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })} required
              className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-full px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--gold)]" />
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
          <div className="md:col-span-2 flex gap-3">
            <button type="submit"
              className="bg-[var(--text)] text-[var(--card)] px-6 py-2.5 rounded-full text-xs tracking-[0.1em] uppercase hover:bg-[var(--gold-dark)] transition-colors btn-gold">
              {editingId ? 'Actualizar Producto' : 'Crear Producto'}
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
              <th className="text-center p-4 font-medium">Imagen</th>
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
                  <label className="cursor-pointer text-xs text-[var(--muted)] hover:text-[var(--text)] transition-colors flex items-center justify-center gap-1">
                    <Upload className="h-3 w-3" />
                    <input type="file" accept="image/jpeg,image/png,image/webp" className="hidden"
                      onChange={(e) => { const f = e.target.files?.[0]; if (f) handleImageUpload(p.id, f); e.target.value = '' }} />
                  </label>
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

  const load = useCallback(async () => {
    try { const data = await rentalService.getAll(); setRentals(data) } finally { setLoading(false) }
  }, [])

  useEffect(() => { load() }, [load])

  const handleStatusUpdate = async () => {
    if (!statusTarget) return
    await rentalService.update(statusTarget.id, { status: statusTarget.status })
    setStatusTarget(null)
    load()
  }

  if (loading) return <div className="animate-pulse h-40 bg-[var(--border)] rounded-2xl" />

  const totalPages = Math.ceil(rentals.length / PAGE_SIZE)
  const paginated = rentals.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  return (
    <div>
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
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null)

  const load = useCallback(async () => {
    try { const data = await clientService.getAll(); setClients(data) } finally { setLoading(false) }
  }, [])

  useEffect(() => { load() }, [load])

  const openCreate = () => {
    setEditingId(null)
    setForm({ name: '', email: '', phone: '', client_type: 'natural', tax_document: '' })
    setShowForm(true)
  }

  const openEdit = (c: Client) => {
    setEditingId(c.id)
    setForm({ name: c.name, email: c.email, phone: c.phone, client_type: c.client_type, tax_document: c.tax_document || '' })
    setShowForm(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (editingId) {
      await clientService.update(editingId, form)
    } else {
      await clientService.create(form)
    }
    setShowForm(false)
    setEditingId(null)
    load()
  }

  const handleDelete = async (id: string) => {
    await clientService.delete(id)
    setDeleteTarget(null)
    load()
  }

  if (loading) return <div className="animate-pulse h-40 bg-[var(--border)] rounded-2xl" />

  const totalPages = Math.ceil(clients.length / PAGE_SIZE)
  const paginated = clients.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  return (
    <div>
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
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required
              className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-full px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--gold)]" />
          </div>
          <div>
            <label className="text-xs tracking-[0.1em] uppercase text-[var(--muted)] block mb-1.5">Email</label>
            <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required
              className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-full px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--gold)]" />
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
            <button type="submit"
              className="bg-[var(--text)] text-[var(--card)] px-6 py-2.5 rounded-full text-xs tracking-[0.1em] uppercase hover:bg-[var(--gold-dark)] transition-colors btn-gold">
              {editingId ? 'Actualizar Cliente' : 'Crear Cliente'}
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

  useEffect(() => { salesService.getAll().then(setSales).catch(console.error).finally(() => setLoading(false)) }, [])

  if (loading) return <div className="animate-pulse h-40 bg-[var(--border)] rounded-2xl" />

  const totalPages = Math.ceil(sales.length / PAGE_SIZE)
  const paginated = sales.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  return (
    <div>
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
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)

  useEffect(() => { returnsService.getAll().then(setReturns).catch(console.error).finally(() => setLoading(false)) }, [])

  if (loading) return <div className="animate-pulse h-40 bg-[var(--border)] rounded-2xl" />

  const totalPages = Math.ceil(returns.length / PAGE_SIZE)
  const paginated = returns.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  return (
    <div>
      <h2 className="font-serif text-xl text-[var(--text)] mb-6">Devoluciones <span className="text-[var(--muted)] font-sans text-sm">({returns.length})</span></h2>
      <div className="bg-[var(--card)] rounded-2xl border border-[var(--border)] overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-[var(--surface)] text-[var(--muted)] text-xs tracking-[0.05em] uppercase">
            <tr>
              <th className="text-left p-4 font-medium">Arriendo</th>
              <th className="text-left p-4 font-medium">Estado Producto</th>
              <th className="text-right p-4 font-medium">Recargo</th>
              <th className="text-left p-4 font-medium">Fecha</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)]">
            {paginated.map((r) => (
              <tr key={r.id} className="hover:bg-[var(--surface)] transition-colors">
                <td className="p-4 text-[var(--text)]">{r.rental_id}</td>
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
  const [dispatches, setDispatches] = useState<Dispatch[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)

  useEffect(() => { dispatchesService.getAll().then(setDispatches).catch(console.error).finally(() => setLoading(false)) }, [])

  if (loading) return <div className="animate-pulse h-40 bg-[var(--border)] rounded-2xl" />

  const totalPages = Math.ceil(dispatches.length / PAGE_SIZE)
  const paginated = dispatches.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  return (
    <div>
      <h2 className="font-serif text-xl text-[var(--text)] mb-6">Despachos <span className="text-[var(--muted)] font-sans text-sm">({dispatches.length})</span></h2>
      <div className="bg-[var(--card)] rounded-2xl border border-[var(--border)] overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-[var(--surface)] text-[var(--muted)] text-xs tracking-[0.05em] uppercase">
            <tr>
              <th className="text-left p-4 font-medium">Courier</th>
              <th className="text-left p-4 font-medium">N° Seguimiento</th>
              <th className="text-center p-4 font-medium">Estado</th>
              <th className="text-right p-4 font-medium">Costo</th>
              <th className="text-left p-4 font-medium">Fecha</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)]">
            {paginated.map((d) => (
              <tr key={d.id} className="hover:bg-[var(--surface)] transition-colors">
                <td className="p-4 font-medium text-[var(--text)]">{d.courier}</td>
                <td className="p-4 text-[var(--muted)]">{d.tracking_number}</td>
                <td className="p-4 text-center">
                  <span className={`badge ${d.status === 'delivered' ? 'bg-green-100 text-green-800' : d.status === 'shipped' ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-800'}`}>
                    {d.status === 'delivered' ? 'Entregado' : d.status === 'shipped' ? 'Enviado' : 'Pendiente'}
                  </span>
                </td>
                <td className="p-4 text-right text-[var(--text)]">${d.cost.toLocaleString('es-CL')}</td>
                <td className="p-4 text-[var(--muted)] text-xs">{new Date(d.created_at).toLocaleDateString()}</td>
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
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null)

  const load = useCallback(async () => {
    try { const data = await damageTypesService.getAll(); setItems(data) } finally { setLoading(false) }
  }, [])

  useEffect(() => { load() }, [load])

  const openCreate = () => { setEditingId(null); setForm({ name: '', surcharge_amount: 0 }); setShowForm(true) }
  const openEdit = (d: DamageType) => { setEditingId(d.id); setForm({ name: d.name, surcharge_amount: d.surcharge_amount }); setShowForm(true) }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (editingId) { await damageTypesService.update(editingId, form) }
    else { await damageTypesService.create(form) }
    setShowForm(false); setEditingId(null); load()
  }

  const handleDelete = async (id: string) => { await damageTypesService.delete(id); setDeleteTarget(null); load() }

  if (loading) return <div className="animate-pulse h-40 bg-[var(--border)] rounded-2xl" />

  return (
    <div>
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
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required
              className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-full px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--gold)]" />
          </div>
          <div>
            <label className="text-xs tracking-[0.1em] uppercase text-[var(--muted)] block mb-1.5">Recargo ($)</label>
            <input type="number" value={form.surcharge_amount} onChange={(e) => setForm({ ...form, surcharge_amount: Number(e.target.value) })} required
              className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-full px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--gold)]" />
          </div>
          <div className="md:col-span-2">
            <button type="submit" className="bg-[var(--text)] text-[var(--card)] px-6 py-2.5 rounded-full text-xs tracking-[0.1em] uppercase hover:bg-[var(--gold-dark)] transition-colors btn-gold">
              {editingId ? 'Actualizar' : 'Crear'}
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
  const [form, setForm] = useState({ mission: '', vision: '', objectives: '', address: '', phone: '', email: '' })

  useEffect(() => {
    corporateInfoService.get()
      .then((data) => { setInfo(data); setForm({ mission: data.mission, vision: data.vision, objectives: data.objectives, address: data.address, phone: data.phone, email: data.email }) })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!info) return
    await corporateInfoService.update(info.id, form)
    setInfo({ ...info, ...form })
    setEditing(false)
  }

  if (loading) return <div className="animate-pulse h-40 bg-[var(--border)] rounded-2xl" />

  return (
    <div>
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
          <button type="submit"
            className="bg-[var(--text)] text-[var(--card)] px-6 py-2.5 rounded-full text-xs tracking-[0.1em] uppercase hover:bg-[var(--gold-dark)] transition-colors btn-gold">
            Guardar Cambios
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
