import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Check, Sparkles, ArrowLeft, Star, Zap } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'
import api from '../services/api'

const featuresFree = [
  'Basic Daily Logging (6 Pillars)',
  'Standard WellScore Calculation',
  '7-Day History & Trends',
  'Basic Profile & Goals',
  'Community Leaderboards'
]

const featuresPro = [
  'Everything in Free, plus:',
  'WellBot AI Health Assistant',
  'Advanced Clinical Evidence Search',
  'Drug Interaction Checker',
  'Medical Cost Analysis Tool',
  '30-Day Extended History',
  'Priority Feature Access'
]

export default function Pricing() {
  const navigate = useNavigate()
  const { profile, fetchProfile, user } = useAuth()
  const [loading, setLoading] = useState(false)

  const isPro = profile?.subscription_tier === 'pro'

  useEffect(() => {
    const query = new URLSearchParams(window.location.search)
    if (query.get('success')) {
      toast.success("Payment Successful! Welcome to WellSync Pro 🎉")
      if (user) fetchProfile(user) // Refresh profile to get new tier
      window.history.replaceState(null, '', '/pricing')
      setTimeout(() => navigate('/dashboard'), 2000)
    }
    if (query.get('canceled')) {
      toast.error("Payment was canceled.")
      window.history.replaceState(null, '', '/pricing')
    }
  }, [user, fetchProfile, navigate])

  const handleUpgrade = async () => {
    if (isPro) {
      toast.success("You are already a Pro member!")
      return
    }

    setLoading(true)
    try {
      const { data } = await api.post('/api/stripe/create-checkout-session', {
        userId: profile.id,
        returnUrl: window.location.origin + '/pricing'
      })
      
      if (data.url) {
        window.location.href = data.url
      } else {
        throw new Error('No checkout URL returned')
      }
    } catch (error) {
      toast.error("Failed to start checkout. Please try again.")
      console.error(error)
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', padding: '2rem' }}>
      <button 
        onClick={() => navigate(-1)}
        style={{
          display: 'flex', alignItems: 'center', gap: '0.5rem',
          background: 'var(--surface)', border: '1px solid var(--border)',
          padding: '0.5rem 1rem', borderRadius: 99, color: 'var(--text)',
          cursor: 'pointer', fontFamily: 'Plus Jakarta Sans', fontWeight: 600,
          marginBottom: '2rem'
        }}
      >
        <ArrowLeft size={16} />
        Back
      </button>

      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(99, 102, 241, 0.1)', color: '#6366F1', padding: '0.5rem 1rem', borderRadius: 99, fontWeight: 700, fontSize: '0.85rem', marginBottom: '1rem' }}
        >
          <Sparkles size={16} />
          UPGRADE YOUR HEALTH
        </motion.div>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text)', marginBottom: '1rem' }}>
          Choose Your WellSync Journey
        </h1>
        <p style={{ color: 'var(--muted)', fontSize: '1.1rem', maxWidth: 600, margin: '0 auto' }}>
          Unlock advanced AI capabilities and clinical intelligence tools to take your health tracking to the next level.
        </p>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap', paddingBottom: '4rem' }}>
        {/* FREE PLAN */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          style={{
            background: 'var(--surface)', padding: '2.5rem', borderRadius: 24,
            border: '1px solid var(--border)', width: '100%', maxWidth: 380,
            display: 'flex', flexDirection: 'column'
          }}
        >
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text)', marginBottom: '0.5rem' }}>Basic</h3>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.25rem' }}>
              <span style={{ fontSize: '3rem', fontWeight: 800, color: 'var(--text)' }}>$0</span>
              <span style={{ color: 'var(--muted)' }}>/forever</span>
            </div>
            <p style={{ color: 'var(--muted)', marginTop: '0.5rem', fontSize: '0.9rem' }}>Essential tools to get started.</p>
          </div>

          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2.5rem' }}>
            {featuresFree.map((feature, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ width: 20, height: 20, borderRadius: '50%', background: 'rgba(34, 197, 94, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Check size={12} color="#22C55E" />
                </div>
                <span style={{ color: 'var(--text)', fontSize: '0.95rem' }}>{feature}</span>
              </div>
            ))}
          </div>

          <button style={{
            width: '100%', padding: '1rem', borderRadius: 12,
            background: 'var(--bg)', border: '1px solid var(--border)',
            color: 'var(--text)', fontSize: '1rem', fontFamily: 'Plus Jakarta Sans', fontWeight: 700,
            cursor: isPro ? 'pointer' : 'default', opacity: isPro ? 1 : 0.5
          }}>
            {isPro ? 'Downgrade' : 'Current Plan'}
          </button>
        </motion.div>

        {/* PRO PLAN */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          style={{
            background: 'var(--surface)', padding: '2.5rem', borderRadius: 24,
            border: '2px solid #6366F1', width: '100%', maxWidth: 380,
            display: 'flex', flexDirection: 'column', position: 'relative',
            boxShadow: '0 20px 40px rgba(99, 102, 241, 0.15)'
          }}
        >
          <div style={{
            position: 'absolute', top: -14, left: '50%', transform: 'translateX(-50%)',
            background: 'linear-gradient(135deg, #6366F1, #A855F7)', color: 'white',
            padding: '0.25rem 1rem', borderRadius: 99, fontSize: '0.75rem', fontWeight: 800,
            letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: '0.25rem'
          }}>
            <Star size={12} fill="currentColor" /> MOST POPULAR
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              WellSync Pro
            </h3>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.25rem' }}>
              <span style={{ fontSize: '3rem', fontWeight: 800, color: 'var(--text)' }}>$9</span>
              <span style={{ color: 'var(--muted)' }}>/month</span>
            </div>
            <p style={{ color: '#6366F1', marginTop: '0.5rem', fontSize: '0.9rem', fontWeight: 600 }}>Supercharge your wellness tracking.</p>
          </div>

          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2.5rem' }}>
            {featuresPro.map((feature, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ width: 20, height: 20, borderRadius: '50%', background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15), rgba(168, 85, 247, 0.15))', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Check size={12} color="#6366F1" />
                </div>
                <span style={{ color: 'var(--text)', fontSize: '0.95rem', fontWeight: i === 0 ? 600 : 400 }}>{feature}</span>
              </div>
            ))}
          </div>

          <button 
            onClick={handleUpgrade}
            disabled={loading || isPro}
            style={{
              width: '100%', padding: '1rem', borderRadius: 12,
              background: isPro ? '#10B981' : 'linear-gradient(135deg, #6366F1, #818CF8)',
              border: 'none', color: 'white', fontSize: '1rem', fontFamily: 'Plus Jakarta Sans', fontWeight: 700,
              cursor: isPro ? 'default' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
              boxShadow: isPro ? 'none' : '0 8px 16px rgba(99, 102, 241, 0.3)',
              opacity: loading ? 0.7 : 1, transition: 'all 0.2s'
            }}
          >
            {loading ? (
              <span style={{ display: 'inline-block', animation: 'spin 1s linear infinite' }}>⏳</span>
            ) : isPro ? (
              <>
                <Check size={20} /> Active Plan
              </>
            ) : (
              <>
                <Zap size={20} /> Upgrade Now
              </>
            )}
          </button>
        </motion.div>
      </div>
    </div>
  )
}
