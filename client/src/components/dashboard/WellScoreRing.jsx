import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { getScoreColor } from '../../utils/scoreCalculator'

export default function WellScoreRing({ score = 0, size = 200, strokeWidth = 16 }) {
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const progress = Math.min(100, Math.max(0, score))
  const offset = circumference - (progress / 100) * circumference
  const color = getScoreColor(score)

  const getLabel = (s) => {
    if (s >= 80) return 'Thriving'
    if (s >= 60) return 'Doing Well'
    if (s >= 40) return 'Needs Attention'
    return 'Take Action'
  }

  return (
    <div style={{ position: 'relative', width: size, height: size, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        {/* Track */}
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none"
          stroke="var(--border)"
          strokeWidth={strokeWidth}
        />
        {/* Progress */}
        <motion.circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, ease: 'easeOut', delay: 0.2 }}
          style={{ filter: `drop-shadow(0 0 8px ${color}60)` }}
        />
      </svg>

      {/* Center content */}
      <div style={{
        position: 'absolute', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', gap: 2,
      }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          style={{
            fontFamily: 'Space Grotesk', fontWeight: 700,
            fontSize: size > 150 ? '2.5rem' : '1.75rem',
            color: color, lineHeight: 1,
          }}
        >
          {score}
        </motion.div>
        <div style={{ fontSize: '0.7rem', color: 'var(--muted)', fontFamily: 'Plus Jakarta Sans', fontWeight: 600 }}>
          WELLSCORE
        </div>
        <div style={{
          fontSize: '0.7rem', fontWeight: 700, fontFamily: 'Plus Jakarta Sans',
          color, marginTop: 2,
        }}>
          {score > 0 ? getLabel(score) : '—'}
        </div>
      </div>

      {/* Glow effect */}
      <div style={{
        position: 'absolute', inset: 0, borderRadius: '50%',
        background: `radial-gradient(circle, ${color}08 0%, transparent 70%)`,
        pointerEvents: 'none',
      }} />
    </div>
  )
}
