import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import GlassCard from '../components/ui/GlassCard'
import Input from '../components/ui/Input'
import Button from '../components/ui/Button'
import { register } from '../api/auth'

export default function Register() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ username: '', email: '', password: '', passwordConfirm: '' })
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      await register(form.username, form.email, form.password, form.passwordConfirm)
      navigate('/login')
    } catch (err) {
      setError(err.response?.data?.detail ?? 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const update = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }))

  return (
    <div className="void-bg min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <span className="text-3xl font-bold text-offwhite">
            ⚡ <span className="text-accent-violet-light">Life</span>OS
          </span>
          <p className="text-offwhite-subtle text-sm mt-2">Start your journey.</p>
        </div>
        <GlassCard>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <h2 className="text-lg font-semibold text-offwhite mb-2">Create account</h2>
            {error && <p className="text-red-400 text-sm">{error}</p>}
            <Input label="Username" value={form.username} onChange={update('username')} required />
            <Input label="Email" type="email" value={form.email} onChange={update('email')} required />
            <Input label="Password" type="password" value={form.password} onChange={update('password')} required />
            <Input label="Confirm password" type="password" value={form.passwordConfirm} onChange={update('passwordConfirm')} required />
            <Button type="submit" disabled={loading} className="w-full mt-2">
              {loading ? 'Creating account...' : 'Create account'}
            </Button>
            <p className="text-center text-offwhite-subtle text-sm">
              Have an account?{' '}
              <Link to="/login" className="text-accent-violet-light hover:underline">Sign in</Link>
            </p>
          </form>
        </GlassCard>
      </div>
    </div>
  )
}
