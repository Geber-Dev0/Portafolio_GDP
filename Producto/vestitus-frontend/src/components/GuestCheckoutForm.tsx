import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useCart } from '../contexts/CartContext'
import { clientService } from '../services/clients.service'
import { salesService } from '../services/sales.service'
import { rentalService } from '../services/rentals.service'
import { productService } from '../services/products.service'
import AddressAutocomplete from './AddressAutocomplete'
import type { GeocodingSuggestion } from '../services/geocoding.service'
import { validateRut, formatRut } from '../utils/rut'
import { CheckCircle, AlertCircle } from 'lucide-react'
import axios from 'axios'

export default function GuestCheckoutForm() {
  const { items, clearCart } = useCart()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    rut: '',
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    region: '',
    commune: '',
    address: '',
  })
  const [error, setError] = useState('')
  const [processing, setProcessing] = useState(false)
  const [done, setDone] = useState(false)

  const updateField = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  const handleAddressSelect = (s: GeocodingSuggestion) => {
    const updates: Partial<typeof form> = {}
    if (s.state) updates.region = s.state
    if (s.commune) updates.commune = s.commune
    if (Object.keys(updates).length > 0) {
      setForm(prev => ({ ...prev, ...updates }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (processing) return
    setError('')

    if (!form.first_name.trim() || !form.last_name.trim() || !form.email.trim() || !form.phone.trim() || !form.rut.trim() || !form.region.trim() || !form.commune.trim() || !form.address.trim()) {
      setError('Completa todos los campos obligatorios')
      return
    }

    if (!validateRut(form.rut)) {
      setError('RUT inválido')
      return
    }

    setProcessing(true)

    try {
      const client = await clientService.create({
        first_name: form.first_name.trim(),
        last_name: form.last_name.trim(),
        name: `${form.first_name.trim()} ${form.last_name.trim()}`,
        email: form.email,
        phone: form.phone,
        tax_document: form.rut,
        region: form.region.trim(),
        commune: form.commune.trim(),
        address: form.address.trim(),
        client_type: 'natural',
      })

      const clientId = client.id

      for (const item of items) {
        if (item.type === 'rent') {
          await rentalService.create({
            client_id: clientId,
            product_id: item.product.id,
            start_date: item.startDate || '',
            end_date: item.endDate || '',
            period_type: (item.periodType || 'days') as 'days' | 'weeks' | 'months',
          })
        } else {
          const fresh = await productService.getById(item.product.id)
          if ((fresh.stock ?? 0) < item.quantity) {
            setError(`"${item.product.name}": stock insuficiente`)
            setProcessing(false)
            return
          }
          await salesService.create({
            client_id: clientId,
            product_id: item.product.id,
            sale_price: item.product.price,
            quantity: item.quantity,
          })
        }
      }

      clearCart()
      setDone(true)
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || 'Error al procesar la compra')
      } else {
        setError('Error al procesar la compra')
      }
    } finally {
      setProcessing(false)
    }
  }

  if (done) {
    return (
      <div className="text-center py-12">
        <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-6" />
        <h2 className="font-serif text-2xl text-[var(--text)] mb-2">¡Compra Realizada!</h2>
        <p className="text-[var(--muted)] mb-8">Recibirás un correo con los detalles de tu pedido.</p>
        <Link to="/products" className="inline-block bg-[var(--text)] text-white px-8 py-3 rounded-full text-xs tracking-[0.1em] uppercase hover:bg-[var(--gold-dark)] transition-colors">
          Seguir Comprando
        </Link>
      </div>
    )
  }

  const inputClass = 'w-full bg-[var(--surface)] border border-[var(--border)] rounded-full px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--gold)] text-[var(--text)]'

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="flex items-center gap-2 text-red-600 text-sm mb-4">
          <AlertCircle className="h-4 w-4 flex-shrink-0" /> {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-xs tracking-[0.1em] uppercase text-[var(--muted)] block mb-1.5">RUT</label>
          <input type="text" value={form.rut} onChange={(e) => updateField('rut', formatRut(e.target.value))} placeholder="12.345.678-9" required className={inputClass} />
        </div>
        <div>
          <label className="text-xs tracking-[0.1em] uppercase text-[var(--muted)] block mb-1.5">Celular</label>
          <input type="tel" value={form.phone} onChange={(e) => updateField('phone', e.target.value)} placeholder="+569 1234 5678" required className={inputClass} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-xs tracking-[0.1em] uppercase text-[var(--muted)] block mb-1.5">Nombres</label>
          <input type="text" value={form.first_name} onChange={(e) => updateField('first_name', e.target.value)} required className={inputClass} />
        </div>
        <div>
          <label className="text-xs tracking-[0.1em] uppercase text-[var(--muted)] block mb-1.5">Apellidos</label>
          <input type="text" value={form.last_name} onChange={(e) => updateField('last_name', e.target.value)} required className={inputClass} />
        </div>
      </div>

      <div>
        <label className="text-xs tracking-[0.1em] uppercase text-[var(--muted)] block mb-1.5">Email</label>
        <input type="email" value={form.email} onChange={(e) => updateField('email', e.target.value)} required className={inputClass} />
      </div>

      <div>
        <label className="text-xs tracking-[0.1em] uppercase text-[var(--muted)] block mb-1.5">Dirección</label>
        <AddressAutocomplete
          value={form.address}
          onChange={(val) => updateField('address', val)}
          onSelect={handleAddressSelect}
          placeholder="Ej: Av. Providencia 1234, Santiago"
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-xs tracking-[0.1em] uppercase text-[var(--muted)] block mb-1.5">
            Región <span className="text-[10px] text-[var(--muted)]">(auto desde dirección)</span>
          </label>
          <input type="text" value={form.region} onChange={(e) => updateField('region', e.target.value)} required
            placeholder="Se llena automáticamente" className={inputClass} />
        </div>
        <div>
          <label className="text-xs tracking-[0.1em] uppercase text-[var(--muted)] block mb-1.5">
            Comuna <span className="text-[10px] text-[var(--muted)]">(auto desde dirección)</span>
          </label>
          <input type="text" value={form.commune} onChange={(e) => updateField('commune', e.target.value)} required
            placeholder="Se llena automáticamente" className={inputClass} />
        </div>
      </div>

      <div className="bg-[var(--surface)] rounded-xl p-4 border border-[var(--border)]">
        <p className="text-sm font-medium text-[var(--text)] mb-2">Resumen del pedido</p>
        {items.map(item => (
          <div key={item.id} className="flex justify-between text-xs text-[var(--muted)] py-1">
            <span>{item.product.name} × {item.quantity}</span>
            <span>${(item.product.price * item.quantity).toLocaleString('es-CL')}</span>
          </div>
        ))}
        <div className="border-t border-[var(--border)] mt-2 pt-2 flex justify-between text-sm font-medium text-[var(--text)]">
          <span>Total</span>
          <span>${items.reduce((s, i) => s + i.product.price * i.quantity, 0).toLocaleString('es-CL')}</span>
        </div>
      </div>

      <button type="submit" disabled={processing}
        className="w-full bg-[var(--text)] text-white py-3 rounded-full text-sm tracking-[0.1em] uppercase hover:bg-[var(--gold-dark)] transition-colors disabled:opacity-50">
        {processing ? 'Procesando...' : 'Completar Compra como Invitado'}
      </button>
    </form>
  )
}
