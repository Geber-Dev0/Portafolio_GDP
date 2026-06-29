import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/useAuth'
import { clientService } from '../services/clients.service'
import AddressAutocomplete from './AddressAutocomplete'
import type { GeocodingSuggestion } from '../services/geocoding.service'
import { validateRut, formatRut, isOver18 } from '../utils/rut'
import axios from 'axios'

export default function RegistrationForm() {
  const { register } = useAuth()
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
    gender: '',
    birth_date: '',
    password: '',
    confirmPassword: '',
  })
  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState(false)

  const passwordStrength = (pw: string) => {
    const score = [
      pw.length >= 8,
      /[a-z]/.test(pw),
      /[A-Z]/.test(pw),
      /\d/.test(pw),
      /[^a-zA-Z0-9]/.test(pw),
    ].filter(Boolean).length
    if (score === 0) return { label: '', color: '', width: '0%' }
    if (score <= 2) return { label: 'Débil', color: 'bg-red-500', width: '33%' }
    if (score <= 4) return { label: 'Media', color: 'bg-amber-500', width: '66%' }
    return { label: 'Fuerte', color: 'bg-green-500', width: '100%' }
  }

  const strength = passwordStrength(form.password)

  const updateField = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }))
    if (fieldErrors[field]) {
      setFieldErrors(prev => { const n = { ...prev }; delete n[field]; return n })
    }
  }

  const handleAddressSelect = (s: GeocodingSuggestion) => {
    const updates: Partial<typeof form> = {}
    if (s.state) updates.region = s.state
    if (s.commune) updates.commune = s.commune
    if (Object.keys(updates).length > 0) {
      setForm(prev => ({ ...prev, ...updates }))
    }
  }

  const validate = (): boolean => {
    const errs: Record<string, string> = {}

    if (!form.first_name.trim() || form.first_name.trim().length < 2) errs.first_name = 'Mínimo 2 caracteres'
    if (!form.last_name.trim() || form.last_name.trim().length < 2) errs.last_name = 'Mínimo 2 caracteres'
    if (!form.email.trim()) errs.email = 'Email requerido'
    if (!form.phone.trim()) errs.phone = 'Celular requerido'
    else if (!/^(\+?56)?9\d{8}$/.test(form.phone.replace(/\s/g, ''))) errs.phone = 'Formato: +569XXXXXXXX o 9XXXXXXXX'
    if (!form.rut.trim()) errs.rut = 'RUT requerido'
    else if (!validateRut(form.rut)) errs.rut = 'RUT inválido'
    if (!form.region.trim()) errs.region = 'Región requerida'
    if (!form.commune.trim()) errs.commune = 'Comuna requerida'
    if (!form.address.trim()) errs.address = 'Dirección requerida'
    if (!form.gender) errs.gender = 'Selecciona una opción'
    if (!form.birth_date) errs.birth_date = 'Fecha de nacimiento requerida'
    else if (!isOver18(form.birth_date)) errs.birth_date = 'Debes ser mayor de 18 años'
    if (form.password.length < 8) errs.password = 'Mínimo 8 caracteres'
    if (form.password !== form.confirmPassword) errs.confirmPassword = 'Las contraseñas no coinciden'

    setFieldErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (submitting) return
    setError('')
    if (!validate()) return

    setSubmitting(true)
    try {
      await register(form.email, form.password)
      await clientService.create({
        first_name: form.first_name.trim(),
        last_name: form.last_name.trim(),
        name: `${form.first_name.trim()} ${form.last_name.trim()}`,
        email: form.email,
        phone: form.phone,
        tax_document: form.rut,
        region: form.region.trim(),
        commune: form.commune.trim(),
        address: form.address.trim(),
        gender: form.gender,
        birth_date: form.birth_date,
        client_type: 'natural',
      })
      navigate('/')
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || 'Error al registrarse')
      } else {
        setError('Error al registrarse')
      }
    } finally {
      setSubmitting(false)
    }
  }

  const inputClass = (field: string) =>
    `w-full bg-[var(--surface)] border ${fieldErrors[field] ? 'border-red-400' : 'border-[var(--border)]'} rounded-full px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--gold)] text-[var(--text)]`

  const selectClass = (field: string) =>
    `w-full bg-[var(--surface)] border ${fieldErrors[field] ? 'border-red-400' : 'border-[var(--border)]'} rounded-full px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--gold)] text-[var(--text)]`

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && <div className="bg-red-50 text-red-600 text-xs p-3 rounded-xl mb-4 border border-red-100">{error}</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-xs tracking-[0.1em] uppercase text-[var(--muted)] block mb-1.5">RUT</label>
          <input type="text" value={form.rut} onChange={(e) => updateField('rut', formatRut(e.target.value))} placeholder="12.345.678-9"
            className={inputClass('rut')} />
          {fieldErrors.rut && <p className="text-red-500 text-[10px] mt-1">{fieldErrors.rut}</p>}
        </div>
        <div>
          <label className="text-xs tracking-[0.1em] uppercase text-[var(--muted)] block mb-1.5">Celular</label>
          <input type="tel" value={form.phone} onChange={(e) => updateField('phone', e.target.value)} placeholder="+569 1234 5678"
            className={inputClass('phone')} />
          {fieldErrors.phone && <p className="text-red-500 text-[10px] mt-1">{fieldErrors.phone}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-xs tracking-[0.1em] uppercase text-[var(--muted)] block mb-1.5">Nombres</label>
          <input type="text" value={form.first_name} onChange={(e) => updateField('first_name', e.target.value)} required
            className={inputClass('first_name')} />
          {fieldErrors.first_name && <p className="text-red-500 text-[10px] mt-1">{fieldErrors.first_name}</p>}
        </div>
        <div>
          <label className="text-xs tracking-[0.1em] uppercase text-[var(--muted)] block mb-1.5">Apellidos</label>
          <input type="text" value={form.last_name} onChange={(e) => updateField('last_name', e.target.value)} required
            className={inputClass('last_name')} />
          {fieldErrors.last_name && <p className="text-red-500 text-[10px] mt-1">{fieldErrors.last_name}</p>}
        </div>
      </div>

      <div>
        <label className="text-xs tracking-[0.1em] uppercase text-[var(--muted)] block mb-1.5">Email</label>
        <input type="email" value={form.email} onChange={(e) => updateField('email', e.target.value)} required
          className={inputClass('email')} />
        {fieldErrors.email && <p className="text-red-500 text-[10px] mt-1">{fieldErrors.email}</p>}
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
        {fieldErrors.address && <p className="text-red-500 text-[10px] mt-1">{fieldErrors.address}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-xs tracking-[0.1em] uppercase text-[var(--muted)] block mb-1.5">
            Región <span className="text-[10px] text-[var(--muted)]">(auto desde dirección)</span>
          </label>
          <input type="text" value={form.region} onChange={(e) => updateField('region', e.target.value)} required
            placeholder="Se llena automáticamente" className={inputClass('region')} />
          {fieldErrors.region && <p className="text-red-500 text-[10px] mt-1">{fieldErrors.region}</p>}
        </div>
        <div>
          <label className="text-xs tracking-[0.1em] uppercase text-[var(--muted)] block mb-1.5">
            Comuna <span className="text-[10px] text-[var(--muted)]">(auto desde dirección)</span>
          </label>
          <input type="text" value={form.commune} onChange={(e) => updateField('commune', e.target.value)} required
            placeholder="Se llena automáticamente" className={inputClass('commune')} />
          {fieldErrors.commune && <p className="text-red-500 text-[10px] mt-1">{fieldErrors.commune}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-xs tracking-[0.1em] uppercase text-[var(--muted)] block mb-1.5">Género</label>
          <select value={form.gender} onChange={(e) => updateField('gender', e.target.value)} required
            className={selectClass('gender')}>
            <option value="">Seleccionar</option>
            <option value="masculino">Masculino</option>
            <option value="femenino">Femenino</option>
            <option value="otro">Otro</option>
            <option value="no_especifica">No especifica</option>
          </select>
          {fieldErrors.gender && <p className="text-red-500 text-[10px] mt-1">{fieldErrors.gender}</p>}
        </div>
        <div>
          <label className="text-xs tracking-[0.1em] uppercase text-[var(--muted)] block mb-1.5">Fecha de Nacimiento</label>
          <input type="date" value={form.birth_date} onChange={(e) => updateField('birth_date', e.target.value)} required
            className={inputClass('birth_date')} />
          {fieldErrors.birth_date && <p className="text-red-500 text-[10px] mt-1">{fieldErrors.birth_date}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-xs tracking-[0.1em] uppercase text-[var(--muted)] block mb-1.5">Contraseña</label>
          <input type="password" value={form.password} onChange={(e) => updateField('password', e.target.value)} required
            className={inputClass('password')} />
          {form.password.length > 0 && (
            <div className="mt-2">
              <div className="h-1 bg-[var(--border)] rounded-full overflow-hidden">
                <div className={`h-full rounded-full transition-all duration-300 ${strength.color}`} style={{ width: strength.width }} />
              </div>
              <p className="text-[10px] text-[var(--muted)] mt-0.5 tracking-wide">{strength.label}</p>
            </div>
          )}
          {fieldErrors.password && <p className="text-red-500 text-[10px] mt-1">{fieldErrors.password}</p>}
        </div>
        <div>
          <label className="text-xs tracking-[0.1em] uppercase text-[var(--muted)] block mb-1.5">Confirmar Contraseña</label>
          <input type="password" value={form.confirmPassword} onChange={(e) => updateField('confirmPassword', e.target.value)} required
            className={inputClass('confirmPassword')} />
          {fieldErrors.confirmPassword && <p className="text-red-500 text-[10px] mt-1">{fieldErrors.confirmPassword}</p>}
        </div>
      </div>

      <button type="submit" disabled={submitting}
        className="w-full bg-[var(--text)] text-[var(--card)] py-3 rounded-full text-sm tracking-[0.1em] uppercase hover:bg-[var(--gold-dark)] transition-colors btn-gold disabled:opacity-50">
        {submitting ? 'Registrando...' : 'Crear Cuenta y Registrar Datos'}
      </button>
    </form>
  )
}
