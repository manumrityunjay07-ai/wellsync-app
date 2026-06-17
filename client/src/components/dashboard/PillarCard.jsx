import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

const pillarColors = {
  mental: '#818CF8',
  fitness: '#F97316',
  nutrition: '#22C55E',
  sleep: '#6366F1',
  vitals: '#EF4444',
  wellness: '#F59E0B',
}

export default function PillarCard({ pillar, score, icon: Icon, label, to, lastLogged, index }) {
  const color = pillarColors[pillar] || '#818CF8'
  const hasData = score !== null && score !== undefined

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ translateY: -4, boxShadow: `0 8px 30px ${color}20` }}
      style={{
        background: 'var(--surface)',
        borderRadius: 16,
        border: '1px solid var(--border)',
        padding: '1.25rem',
        cursor: 'pointer',
        transition: 'all 0.2s',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <Link to={to} style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
        {/* Background accent */}
        <div style={{
          position: 'absolute', top: -20, right: -20,
          width: 80, height: 80, borderRadius: '50%',
          background: `${color}12`,
        }} />

        {/* Icon */}
        <div style={{
          width: 40, height: 40, borderRadius: 12,
          background: `${color}18`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          marginBottom: '0.875rem',
        }}>
          <Icon size={20} color={color} />
        </div>

        {/* Label */}
        <div style={{
          fontSize: '0.8rem', fontFamily: 'Plus Jakarta Sans', fontWeight: 600,
          color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.05em',
          marginBottom: '0.25rem',
        }}>
          {label}
        </div>

        {/* Score */}
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '0.5rem', marginBottom: '0.75rem' }}>
          <span style={{
            fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: '2rem',
            color: hasData ? color : 'var(--border)', lineHeight: 1,
          }}>
            {hasData ? score : '—'}
          </span>
          {hasData && <span style={{ fontSize: '0.75rem', color: 'var(--muted)', marginBottom: '0.2rem' }}>/100</span>}
        </div>

        {/* Score bar */}
        <div style={{ height: 4, background: 'var(--bg)', borderRadius: 99, marginBottom: '0.75rem' }}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${hasData ? score : 0}%` }}
            transition={{ duration: 1, ease: 'easeOut', delay: 0.3 + index * 0.05 }}
            style={{ height: '100%', background: color, borderRadius: 99 }}
          />
        </div>

        {/* Footer */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: '0.7rem', color: 'var(--muted)' }}>
            {lastLogged ? `Logged ${lastLogged}` : 'No data today'}
          </span>
          <ArrowRight size={13} color={color} />
        </div>
      </Link>
    </motion.div>
  )
}
