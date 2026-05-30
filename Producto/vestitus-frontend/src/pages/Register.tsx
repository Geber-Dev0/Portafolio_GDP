import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/useAuth'
import axios from 'axios'

export default function Register() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const { register } = useAuth()
  const navigate = useNavigate()

  const passwordStrength = (pw: string): { label: string; color: string; width: string } => {
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

  const strength = passwordStrength(password)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (submitting) return
    setError('')
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden')
      return
    }
    setSubmitting(true)
    try {
      await register(email, password)
      navigate('/login?registered=true')
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

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <span className="season-label text-[var(--gold)]">Bienvenido</span>
          <h1 className="font-serif text-4xl text-[var(--text)] mt-2">Crear Cuenta</h1>
          <p className="text-sm text-[var(--muted)] mt-2">Regístrate en Vestitus</p>
        </div>

        <div className="bg-[var(--card)] rounded-2xl border border-[var(--border)] p-8">
          {error && <div className="bg-red-50 text-red-600 text-xs p-3 rounded-xl mb-4 border border-red-100">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-xs tracking-[0.1em] uppercase text-[var(--muted)] block mb-1.5">Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-full px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--gold)] text-[var(--text)]" />
            </div>
            <div>
              <label className="text-xs tracking-[0.1em] uppercase text-[var(--muted)] block mb-1.5">Contraseña</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required
                className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-full px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--gold)] text-[var(--text)]" />
              {password.length > 0 && (
                <div className="mt-2">
                  <div className="h-1 bg-[var(--border)] rounded-full overflow-hidden">
                    <div className={`h-full rounded-full transition-all duration-300 ${strength.color}`} style={{ width: strength.width }} />
                  </div>
                  <p className="text-[10px] text-[var(--muted)] mt-0.5 tracking-wide">{strength.label}</p>
                </div>
              )}
            </div>
            <div>
              <label className="text-xs tracking-[0.1em] uppercase text-[var(--muted)] block mb-1.5">Confirmar Contraseña</label>
              <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required
                className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-full px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--gold)] text-[var(--text)]" />
            </div>
            <button type="submit" disabled={submitting}
              className="w-full bg-[var(--text)] text-[var(--card)] py-3 rounded-full text-sm tracking-[0.1em] uppercase hover:bg-[var(--gold-dark)] transition-colors btn-gold disabled:opacity-50">
              {submitting ? 'Registrando…' : 'Registrarse'}
            </button>
          </form>

          <p className="text-center text-xs text-[var(--muted)] mt-6">
            ¿Ya tienes cuenta?{' '}
            <Link to="/login" className="text-[var(--text)] underline hover:text-[var(--gold)] transition-colors">Inicia sesión</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
