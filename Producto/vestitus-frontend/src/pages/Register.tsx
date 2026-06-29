import { Link } from 'react-router-dom'
import RegistrationForm from '../components/RegistrationForm'

export default function Register() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-lg">
        <div className="text-center mb-10">
          <span className="season-label text-[var(--gold)]">Bienvenido</span>
          <h1 className="font-serif text-4xl text-[var(--text)] mt-2">Crear Cuenta</h1>
          <p className="text-sm text-[var(--muted)] mt-2">Completa tus datos para registrarte en Vestitus</p>
        </div>

        <div className="bg-[var(--card)] rounded-2xl border border-[var(--border)] p-8">
          <RegistrationForm />
          <p className="text-center text-xs text-[var(--muted)] mt-6">
            ¿Ya tienes cuenta?{' '}
            <Link to="/login" className="text-[var(--text)] underline hover:text-[var(--gold)] transition-colors">Inicia sesión</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
