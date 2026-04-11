import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import GlassCard from '../components/ui/GlassCard'
import Input from '../components/ui/Input'
import Button from '../components/ui/Button'
import { login } from '../api/auth'
import useAuth from '../hooks/useAuth'

export default function Login() {
  const navigate = useNavigate()
  const { setAuth } = useAuth()
  const [form, setForm] = useState({ username: '', password: '' })
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const { data } = await login(form.username, form.password)
      setAuth(null, data.access, data.refresh)
      navigate('/dashboard')
    } catch {
      setError('Invalid credentials. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="void-bg min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <span className="text-3xl font-bold text-offwhite">
            ⚡ <span className="text-accent-violet-light">Life</span>OS
          </span>
          <p className="text-offwhite-subtle text-sm mt-2">Your life, gamified.</p>
        </div>
        <GlassCard>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <h2 className="text-lg font-semibold text-offwhite mb-2">Sign in</h2>
            {error && <p className="text-red-400 text-sm">{error}</p>}
            <Input label="Username" value={form.username} onChange={(e) => setForm(f => ({ ...f, username: e.target.value }))} required />
            <Input label="Password" type="password" value={form.password} onChange={(e) => setForm(f => ({ ...f, password: e.target.value }))} required />
            <Button type="submit" disabled={loading} className="w-full mt-2">
              {loading ? 'Signing in...' : 'Sign in'}
            </Button>
            <p className="text-center text-offwhite-subtle text-sm">
              No account?{' '}
              <Link to="/register" className="text-accent-violet-light hover:underline">Register</Link>
            </p>
          </form>
        </GlassCard>
      </div>
    </div>
  )
}
