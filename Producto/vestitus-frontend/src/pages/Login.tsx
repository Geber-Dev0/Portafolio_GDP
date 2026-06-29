import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../contexts/useAuth'
import axios from 'axios'
import { CheckCircle } from 'lucide-react'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [showCredentials, setShowCredentials] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const redirect = searchParams.get('redirect') || '/'
  const justRegistered = searchParams.get('registered') === 'true'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (submitting) return
    setError('')
    setSubmitting(true)
    try {
      const user = await login(email, password)
      if (searchParams.has('redirect')) {
        navigate(redirect)
      } else if (user.role === 'admin' || user.role === 'employee') {
        navigate('/admin')
      } else {
        navigate('/')
      }
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || 'Error al iniciar sesión')
      } else {
        setError('Error al iniciar sesión')
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <span className="season-label text-[var(--gold)]">Acceso</span>
          <h1 className="font-serif text-4xl text-[var(--text)] mt-2">Iniciar Sesión</h1>
          <p className="text-sm text-[var(--muted)] mt-2">Ingresa a tu cuenta de Vestitus</p>
        </div>

        <div className="bg-[var(--card)] rounded-2xl border border-[var(--border)] p-8">
          {justRegistered && (
            <div className="flex items-center gap-2 bg-green-50 text-green-700 text-xs p-3 rounded-xl mb-4 border border-green-200">
              <CheckCircle className="h-4 w-4 flex-shrink-0" /> Cuenta creada correctamente. Inicia sesión.
            </div>
          )}
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
            </div>
            <button type="submit" disabled={submitting}
              className="w-full bg-[var(--text)] text-[var(--card)] py-3 rounded-full text-sm tracking-[0.1em] uppercase hover:bg-[var(--gold-dark)] transition-colors btn-gold disabled:opacity-50">
              {submitting ? 'Ingresando…' : 'Ingresar'}
            </button>
          </form>

          <p className="text-center text-xs text-[var(--muted)] mt-6">
            ¿No tienes cuenta?{' '}
            <Link to="/register" className="text-[var(--text)] underline hover:text-[var(--gold)] transition-colors">Regístrate</Link>
          </p>

          <div className="mt-6">
            <button type="button" onClick={() => setShowCredentials(!showCredentials)}
              className="w-full text-xs text-[var(--muted)] hover:text-[var(--text)] transition-colors underline">
              {showCredentials ? 'Ocultar' : 'Mostrar'} credenciales de prueba
            </button>
            {showCredentials && (
              <div className="mt-2 p-4 bg-[var(--bg)] rounded-xl text-xs text-[var(--muted)] space-y-1">
                <p className="text-[var(--text)] font-medium mb-1">Credenciales de prueba:</p>
                <p>Email: nira.sleyton@gmail.com</p>
                <p>Password: nira.vestitus26$</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
