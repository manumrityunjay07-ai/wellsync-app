import { useAuth } from '../../context/AuthContext'
import { motion } from 'framer-motion'
import { Lock, Sparkles, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function PremiumGuard({ children, featureName = "This feature" }) {
  const { profile } = useAuth()

  // If user is pro, render the actual content
  if (profile?.subscription_tier === 'pro') {
    return children
  }

  // Otherwise show the paywall
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', height: '100%', minHeight: '70vh',
      padding: '2rem', textAlign: 'center'
    }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          background: 'var(--surface)', padding: '3rem', borderRadius: 24,
          border: '1px solid var(--border)', maxWidth: 480,
          boxShadow: '0 20px 40px rgba(0,0,0,0.05)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem'
        }}
      >
        <div style={{
          width: 80, height: 80, borderRadius: 20,
          background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(168, 85, 247, 0.1))',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          border: '1px solid rgba(99, 102, 241, 0.2)'
        }}>
          <Lock size={36} color="#6366F1" />
        </div>
        
        <div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.5rem', background: 'linear-gradient(135deg, #6366F1, #A855F7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            WellSync Pro Required
          </h2>
          <p style={{ color: 'var(--muted)', lineHeight: 1.6 }}>
            {featureName} is an advanced feature reserved for WellSync Pro members. Upgrade to unlock powerful AI capabilities and the full Clinical Intelligence suite.
          </p>
        </div>

        <Link to="/pricing" style={{ textDecoration: 'none', width: '100%' }}>
          <button style={{
            width: '100%', padding: '1rem', borderRadius: 12,
            background: 'linear-gradient(135deg, #6366F1, #818CF8)',
            border: 'none', color: 'white', fontSize: '1rem', fontFamily: 'Plus Jakarta Sans', fontWeight: 700,
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem',
            boxShadow: '0 8px 16px rgba(99, 102, 241, 0.2)',
            transition: 'transform 0.2s'
          }}
          onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.02)'}
          onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
          >
            <Sparkles size={20} />
            View Pro Plans
            <ArrowRight size={18} />
          </button>
        </Link>
      </motion.div>
    </div>
  )
}
