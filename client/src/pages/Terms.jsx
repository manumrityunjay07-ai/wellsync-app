import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

export default function Terms() {
  return (
    <div style={{ padding: '2rem', maxWidth: 800, margin: '0 auto', background: 'var(--bg)', minHeight: '100vh' }}>
      <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--muted)', textDecoration: 'none', marginBottom: '2rem' }}>
        <ArrowLeft size={16} /> Back to Home
      </Link>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Terms of Service</h1>
        <p style={{ color: 'var(--muted)', marginBottom: '2rem' }}>Last updated: June 2026</p>
        
        <div className="card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <section>
            <h2 style={{ fontSize: '1.25rem', marginBottom: '0.75rem' }}>1. Not Medical Advice</h2>
            <p style={{ color: 'var(--muted)', lineHeight: 1.6 }}>WellSync is a wellness tracking application. The insights, scores, and AI estimations provided by the app are for informational purposes only and do not constitute professional medical advice, diagnosis, or treatment.</p>
          </section>
          
          <section>
            <h2 style={{ fontSize: '1.25rem', marginBottom: '0.75rem' }}>2. Acceptable Use</h2>
            <p style={{ color: 'var(--muted)', lineHeight: 1.6 }}>You agree not to misuse the app or the AI services provided. We reserve the right to limit or suspend accounts that abuse our generative AI features.</p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.25rem', marginBottom: '0.75rem' }}>3. Fair Usage</h2>
            <p style={{ color: 'var(--muted)', lineHeight: 1.6 }}>We provide a generous free tier for all users. However, access to AI features is subject to rate limits to prevent abuse and manage costs.</p>
          </section>
        </div>
      </motion.div>
    </div>
  )
}
