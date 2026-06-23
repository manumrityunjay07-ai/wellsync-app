import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, CheckCircle2, ShieldCheck, X } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import toast from 'react-hot-toast'

export default function UpgradeModal({ isOpen, onClose, featureName }) {
  const { updateProfile } = useAuth()

  const handleUpgrade = async () => {
    try {
      await updateProfile({ plan: 'pro' })
      toast.success('Successfully upgraded to WellSync Pro! 🎉')
      onClose()
    } catch (err) {
      toast.error('Failed to upgrade. Please try again.')
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(15, 23, 42, 0.75)',
          backdropFilter: 'blur(12px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 9999, padding: '1.5rem'
        }}>
          {/* Backdrop click */}
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} onClick={onClose} />

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            style={{
              background: 'var(--surface)',
              border: '2px solid rgba(212, 175, 55, 0.4)',
              boxShadow: '0 20px 50px rgba(0, 0, 0, 0.3), inset 0 0 20px rgba(212, 175, 55, 0.05)',
              borderRadius: 24,
              width: '100%',
              maxWidth: 480,
              padding: '2.5rem',
              position: 'relative',
              zIndex: 10,
              overflow: 'hidden'
            }}
          >
            {/* Gold light glow in background */}
            <div style={{
              position: 'absolute', top: '-10%', left: '50%', transform: 'translateX(-50%)',
              width: 250, height: 100, borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(212,175,55,0.15) 0%, rgba(212,175,55,0) 70%)',
              pointerEvents: 'none'
            }} />

            {/* Close Button */}
            <button 
              onClick={onClose}
              style={{
                position: 'absolute', top: '1rem', right: '1rem',
                background: 'transparent', border: 'none', cursor: 'pointer',
                color: 'var(--muted)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                padding: '0.25rem', borderRadius: 8, transition: 'all 0.2s'
              }}
              onMouseEnter={e => e.currentTarget.style.color = 'var(--text)'}
              onMouseLeave={e => e.currentTarget.style.color = 'var(--muted)'}
            >
              <X size={20} />
            </button>

            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <div style={{
                width: 60, height: 60, borderRadius: '50%',
                background: 'linear-gradient(135deg, #F59E0B, #D4AF37)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 1rem', boxShadow: '0 8px 24px rgba(212, 175, 55, 0.3)'
              }}>
                <Sparkles size={28} color="white" />
              </div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 800, fontFamily: 'Space Grotesk', color: 'var(--text)', marginBottom: '0.5rem' }}>
                Unlock WellSync Pro
              </h3>
              <p style={{ color: 'var(--muted)', fontSize: '0.9rem', lineHeight: 1.5 }}>
                {featureName ? `Upgrade to Pro to access ${featureName} and unlock clinical-grade health intelligence.` : 'Unlock clinical-grade health intelligence and advanced analytical tools.'}
              </p>
            </div>

            {/* Features list */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2.5rem' }}>
              {[
                'Unlimited Evidence & PICO searches',
                'Advanced FDA Drug Interaction Checker',
                'Treatment Cost-Effectiveness reports',
                'AI Cross-Pillar insights & advice',
                'Personalized AI workout & nutrition coaching',
                'Doctor-ready health reports (PDF/CSV)'
              ].map((benefit, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <CheckCircle2 size={18} color="#D4AF37" style={{ flexShrink: 0 }} />
                  <span style={{ fontSize: '0.875rem', color: 'var(--text)', fontWeight: 600 }}>{benefit}</span>
                </div>
              ))}
            </div>

            {/* Pricing info & Upgrade CTA */}
            <div style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 16, padding: '1.25rem', marginBottom: '2rem', textAlign: 'center' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.25rem' }}>PRO MEMBERSHIP</div>
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: '0.25rem' }}>
                <span style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text)', fontFamily: 'Space Grotesk' }}>$19</span>
                <span style={{ fontSize: '0.9rem', color: 'var(--muted)', fontWeight: 600 }}>/month</span>
              </div>
            </div>

            <button
              onClick={handleUpgrade}
              style={{
                width: '100%',
                padding: '1rem',
                borderRadius: 14,
                border: 'none',
                background: 'linear-gradient(135deg, #F59E0B, #D4AF37)',
                color: 'white',
                fontFamily: 'Plus Jakarta Sans',
                fontWeight: 700,
                fontSize: '1rem',
                cursor: 'pointer',
                boxShadow: '0 8px 24px rgba(212, 175, 55, 0.3)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                transition: 'all 0.2s'
              }}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <ShieldCheck size={18} />
              Upgrade Now (Simulated)
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
