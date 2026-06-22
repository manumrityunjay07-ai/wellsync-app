import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

/**
 * Reusable EmptyState component for pages with no data.
 */
export default function EmptyState({ emoji = '📭', title, description, ctaLabel, ctaTo, onCta }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        justifyContent: 'center', textAlign: 'center',
        padding: '4rem 2rem', gap: '1rem'
      }}
    >
      <div style={{
        width: 80, height: 80, borderRadius: 24,
        background: 'var(--bg)', border: '1px solid var(--border)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '2.5rem', marginBottom: '0.5rem',
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
      }}>
        {emoji}
      </div>

      <h3 style={{ fontSize: '1.1rem', color: 'var(--text)', fontWeight: 700 }}>
        {title}
      </h3>

      <p style={{ fontSize: '0.9rem', color: 'var(--muted)', maxWidth: 320, lineHeight: 1.6 }}>
        {description}
      </p>

      {(ctaLabel && ctaTo) && (
        <Link to={ctaTo} className="btn btn-primary" style={{ marginTop: '0.5rem', padding: '0.75rem 2rem' }}>
          {ctaLabel}
        </Link>
      )}
      {(ctaLabel && onCta) && (
        <button className="btn btn-primary" onClick={onCta} style={{ marginTop: '0.5rem', padding: '0.75rem 2rem' }}>
          {ctaLabel}
        </button>
      )}
    </motion.div>
  )
}
