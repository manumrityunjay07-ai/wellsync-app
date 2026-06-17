import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { Sparkles, Mail, Lock, User, Eye, EyeOff, Globe } from 'lucide-react'
import toast from 'react-hot-toast'

export default function Auth() {
  const [mode, setMode] = useState('login') // 'login' | 'signup'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const { signIn, signUp, signInWithGoogle, resetPassword } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      if (mode === 'login') {
        await signIn(email, password)
        navigate('/dashboard')
      } else {
        await signUp(email, password, name)
        toast.success('Account created! Please verify your email.')
        navigate('/onboarding')
      }
    } catch (err) {
      toast.error(err.message || 'Authentication failed')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogle = async () => {
    try {
      await signInWithGoogle()
    } catch (err) {
      toast.error(err.message || 'Google sign-in failed')
    }
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex',
      background: 'linear-gradient(135deg, #F8FAFC 0%, #EEF2FF 50%, #F8FAFC 100%)',
    }}>
      {/* Left — branding */}
      <div style={{
        flex: 1, display: 'none', flexDirection: 'column', justifyContent: 'center',
        padding: '3rem', background: 'linear-gradient(135deg, #4F46E5 0%, #818CF8 100%)',
      }}
        className="auth-left"
      >
        <div style={{ color: 'white', maxWidth: 400 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2.5rem' }}>
            <div style={{ width: 44, height: 44, borderRadius: 13, background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Sparkles size={22} />
            </div>
            <span style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 800, fontSize: '1.3rem' }}>WellSync</span>
          </div>
          <h2 style={{ fontSize: '2rem', lineHeight: 1.2, marginBottom: '1rem', color: 'white' }}>
            Your personal<br />health intelligence<br />system.
          </h2>
          <p style={{ opacity: 0.85, lineHeight: 1.7, fontSize: '0.95rem' }}>
            Track 6 health pillars. Get AI-powered insights. All for ₹0.
          </p>
          <div style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {['WellScore: your daily health in one number', 'Gemini AI finds patterns in your data', 'Doctor PDF reports in one click', '100% free, no credit card ever'].map(f => (
              <div key={f} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', opacity: 0.9 }}>
                <div style={{ width: 6, height: 6, borderRadius: 99, background: '#FDE68A', flexShrink: 0 }} />
                {f}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right — form */}
      <div style={{
        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '2rem',
      }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            background: 'white', borderRadius: 24, padding: '2.5rem',
            width: '100%', maxWidth: 420,
            boxShadow: '0 8px 40px rgba(0,0,0,0.08)',
          }}
        >
          {/* Logo (mobile) */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem', textDecoration: 'none' }}>
            <div style={{ width: 32, height: 32, borderRadius: 9, background: 'linear-gradient(135deg, #818CF8, #4F46E5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Sparkles size={15} color="white" />
            </div>
            <span style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 800, color: '#0F172A' }}>WellSync</span>
          </Link>

          {/* Tabs */}
          <div style={{ display: 'flex', background: 'var(--bg)', borderRadius: 12, padding: 4, marginBottom: '1.75rem' }}>
            {['login', 'signup'].map(m => (
              <button
                key={m}
                onClick={() => setMode(m)}
                style={{
                  flex: 1, padding: '0.625rem', borderRadius: 9, border: 'none',
                  fontFamily: 'Plus Jakarta Sans', fontWeight: 600, fontSize: '0.875rem',
                  cursor: 'pointer', transition: 'all 0.2s',
                  background: mode === m ? 'white' : 'transparent',
                  color: mode === m ? '#0F172A' : 'var(--muted)',
                  boxShadow: mode === m ? '0 1px 4px rgba(0,0,0,0.08)' : 'none',
                }}
              >
                {m === 'login' ? 'Log In' : 'Sign Up'}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <AnimatePresence mode="wait">
              {mode === 'signup' && (
                <motion.div key="name" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                  <div style={{ position: 'relative' }}>
                    <User size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)' }} />
                    <input
                      type="text" placeholder="Your full name"
                      value={name} onChange={e => setName(e.target.value)}
                      required={mode === 'signup'}
                      className="input" style={{ paddingLeft: '2.5rem' }}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div style={{ position: 'relative' }}>
              <Mail size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)' }} />
              <input
                type="email" placeholder="Email address"
                value={email} onChange={e => setEmail(e.target.value)} required
                className="input" style={{ paddingLeft: '2.5rem' }}
              />
            </div>

            <div style={{ position: 'relative' }}>
              <Lock size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)' }} />
              <input
                type={showPass ? 'text' : 'password'} placeholder="Password"
                value={password} onChange={e => setPassword(e.target.value)} required
                className="input" style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem' }}
              />
              <button type="button" onClick={() => setShowPass(!showPass)} style={{
                position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)',
                background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted)',
              }}>
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            {mode === 'login' && (
              <div style={{ textAlign: 'right', marginTop: '-0.5rem' }}>
                <button
                  type="button"
                  onClick={async () => {
                    if (!email) return toast.error('Please enter your email first')
                    try {
                      await resetPassword(email)
                      toast.success('Password reset email sent!')
                    } catch (err) {
                      toast.error(err.message || 'Failed to send reset email')
                    }
                  }}
                  style={{ background: 'none', border: 'none', color: '#4F46E5', fontSize: '0.8rem', cursor: 'pointer', fontFamily: 'Plus Jakarta Sans', fontWeight: 600 }}
                >
                  Forgot Password?
                </button>
              </div>
            )}

            <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: '100%', padding: '0.875rem' }}>
              {loading ? 'Please wait...' : mode === 'login' ? 'Log In' : 'Create Account'}
            </button>
          </form>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', margin: '1.25rem 0' }}>
            <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
            <span style={{ fontSize: '0.75rem', color: 'var(--muted)', fontWeight: 500 }}>or</span>
            <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
          </div>

          <button
            onClick={handleGoogle}
            className="btn btn-secondary"
            style={{ width: '100%', padding: '0.875rem', gap: '0.75rem' }}
          >
            <Globe size={18} color="#4285F4" />
            Continue with Google
          </button>

          <p style={{ textAlign: 'center', fontSize: '0.75rem', color: 'var(--muted)', marginTop: '1.25rem' }}>
            By continuing, you agree to our{' '}
            <span style={{ color: '#4F46E5', cursor: 'pointer' }}>Terms</span> and{' '}
            <span style={{ color: '#4F46E5', cursor: 'pointer' }}>Privacy Policy</span>.
          </p>
        </motion.div>
      </div>

      <style>{`
        @media (min-width: 768px) { .auth-left { display: flex !important; } }
      `}</style>
    </div>
  )
}
