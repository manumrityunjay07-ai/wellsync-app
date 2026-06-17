import { motion } from 'framer-motion'
import { Sparkles, Trophy, AlertCircle, RefreshCw } from 'lucide-react'
import { useState } from 'react'

export default function AIBriefing({ briefing, topWin, topConcern, onRecalculate, loading }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      style={{
        background: 'linear-gradient(135deg, #4F46E5 0%, #6366F1 50%, #818CF8 100%)',
        borderRadius: 20, padding: '1.5rem',
        color: 'white', position: 'relative', overflow: 'hidden',
      }}
    >
      {/* Decorative circles */}
      <div style={{ position: 'absolute', top: -30, right: -30, width: 120, height: 120, borderRadius: '50%', background: 'rgba(255,255,255,0.08)' }} />
      <div style={{ position: 'absolute', bottom: -40, left: -20, width: 100, height: 100, borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Sparkles size={18} />
          <span style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 700, fontSize: '0.95rem' }}>
            AI Daily Briefing
          </span>
        </div>
        <button
          onClick={onRecalculate}
          disabled={loading}
          style={{
            background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: 8,
            padding: '0.375rem 0.75rem', color: 'white', cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.75rem',
            fontFamily: 'Plus Jakarta Sans', fontWeight: 600,
          }}
        >
          <RefreshCw size={12} className={loading ? 'animate-spin' : ''} />
          {loading ? 'Calculating...' : 'Refresh'}
        </button>
      </div>

      {/* Briefing text */}
      {briefing ? (
        <p style={{ fontSize: '0.9rem', lineHeight: 1.6, opacity: 0.95, marginBottom: '1.25rem', zIndex: 1, position: 'relative' }}>
          {briefing}
        </p>
      ) : (
        <p style={{ fontSize: '0.9rem', opacity: 0.7, marginBottom: '1.25rem' }}>
          Log today's data across all pillars to get your AI briefing.
        </p>
      )}

      {/* Win / Concern */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
        <div style={{ background: 'rgba(255,255,255,0.15)', borderRadius: 12, padding: '0.875rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', marginBottom: '0.375rem' }}>
            <Trophy size={13} />
            <span style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Top Win</span>
          </div>
          <p style={{ fontSize: '0.8rem', opacity: 0.9, lineHeight: 1.4 }}>
            {topWin || 'Complete today to find out!'}
          </p>
        </div>
        <div style={{ background: 'rgba(255,255,255,0.12)', borderRadius: 12, padding: '0.875rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', marginBottom: '0.375rem' }}>
            <AlertCircle size={13} />
            <span style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Watch Out</span>
          </div>
          <p style={{ fontSize: '0.8rem', opacity: 0.9, lineHeight: 1.4 }}>
            {topConcern || 'Nothing flagged today!'}
          </p>
        </div>
      </div>
    </motion.div>
  )
}
