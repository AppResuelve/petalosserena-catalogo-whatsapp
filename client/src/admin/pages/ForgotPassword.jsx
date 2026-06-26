import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Loader } from 'lucide-react'
import api from '../../api/admin'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email) return
    setError('')
    setLoading(true)
    try {
      await api.post('/auth/forgot-password', { email })
      setSent(true)
    } catch (err) {
      let msg = 'Error al enviar'
      try { const b = typeof err.response?.data === 'string' ? JSON.parse(err.response.data) : err.response?.data; msg = b?.error || b?.message || msg } catch {}
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  if (sent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950 px-4">
        <div className="w-full max-w-sm text-center">
          <div className="w-14 h-14 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-4">
            <svg className="w-7 h-7 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
          </div>
          <h1 className="text-xl font-bold text-zinc-100 mb-2">Revisá tu email</h1>
          <p className="text-sm text-zinc-400 mb-6">Si el email existe, te enviamos un link para restablecer tu contraseña.</p>
          <Link to="/login" className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors">Volver al login</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 px-4">
      <div className="w-full max-w-sm">
        <Link to="/login" className="inline-flex items-center gap-1 text-sm text-zinc-500 hover:text-zinc-300 mb-6">
          <ArrowLeft className="w-4 h-4" /> Volver al login
        </Link>

        <h1 className="text-xl font-bold text-zinc-100 mb-1">¿Olvidaste tu contraseña?</h1>
        <p className="text-sm text-zinc-500 mb-6">Ingresá tu email y te mandamos un link para restablecerla.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">{error}</div>
          )}
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-1.5">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoFocus
              className="w-full px-3 py-2.5 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-cyan-500 text-sm"
              placeholder="admin@admin.com"
            />
          </div>
          <button type="submit" disabled={loading}
            className="w-full py-2.5 px-4 bg-cyan-500 text-white rounded-lg font-medium hover:bg-cyan-600 transition-colors disabled:opacity-50 text-sm">
            {loading ? <><Loader className="w-4 h-4 animate-spin inline mr-2" />Enviando...</> : 'Enviar link'}
          </button>
        </form>
      </div>
    </div>
  )
}
