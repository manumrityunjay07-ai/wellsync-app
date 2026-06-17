import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

export default function Privacy() {
  return (
    <div style={{ padding: '2rem', maxWidth: 800, margin: '0 auto', background: 'var(--bg)', minHeight: '100vh' }}>
      <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--muted)', textDecoration: 'none', marginBottom: '2rem' }}>
        <ArrowLeft size={16} /> Back to Home
      </Link>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Privacy Policy</h1>
        <p style={{ color: 'var(--muted)', marginBottom: '2rem' }}>Last updated: June 2026</p>
        
        <div className="card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <section>
            <h2 style={{ fontSize: '1.25rem', marginBottom: '0.75rem' }}>1. Data Collection</h2>
            <p style={{ color: 'var(--muted)', lineHeight: 1.6 }}>We collect health, nutrition, and mood data strictly to provide you with insights. We do not sell your personal data to third parties.</p>
          </section>
          
          <section>
            <h2 style={{ fontSize: '1.25rem', marginBottom: '0.75rem' }}>2. AI Processing</h2>
            <p style={{ color: 'var(--muted)', lineHeight: 1.6 }}>We use Google Gemini AI to process your inputs (such as meal descriptions or journal entries) to generate insights. By using WellSync, you consent to your data being processed by our AI providers.</p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.25rem', marginBottom: '0.75rem' }}>3. Data Security</h2>
            <p style={{ color: 'var(--muted)', lineHeight: 1.6 }}>Your data is securely stored in Supabase with strict row-level security policies. Only you can access your personal health data.</p>
          </section>
        </div>
      </motion.div>
    </div>
  )
}
