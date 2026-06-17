import { useState } from 'react'
import { motion } from 'framer-motion'
import { format } from 'date-fns'

const moodOptions = [
  { emoji: '😊', label: 'Happy', value: 'happy' },
  { emoji: '😌', label: 'Calm', value: 'calm' },
  { emoji: '😔', label: 'Sad', value: 'sad' },
  { emoji: '😤', label: 'Frustrated', value: 'frustrated' },
  { emoji: '😰', label: 'Anxious', value: 'anxious' },
  { emoji: '🤩', label: 'Excited', value: 'excited' },
  { emoji: '😴', label: 'Tired', value: 'tired' },
  { emoji: '😐', label: 'Neutral', value: 'neutral' },
]

export default function MoodPicker({ onSubmit, loading }) {
  const [selectedMood, setSelectedMood] = useState(null)
  const [stress, setStress] = useState(5)
  const [note, setNote] = useState('')

  const handleSubmit = () => {
    if (!selectedMood) return
    onSubmit({ mood: selectedMood, stress_level: stress, journal_note: note })
    setNote('')
  }

  return (
    <div className="card">
      <h3 style={{ fontSize: '1rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <span style={{ fontSize: '1.1rem' }}>🧠</span> How are you feeling today?
      </h3>

      {/* Mood grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.625rem', marginBottom: '1.5rem' }}>
        {moodOptions.map(({ emoji, label, value }) => (
          <motion.button
            key={value}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedMood(value)}
            style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem',
              padding: '0.875rem 0.5rem', borderRadius: 12,
              border: `2px solid ${selectedMood === value ? '#818CF8' : 'var(--border)'}`,
              background: selectedMood === value ? '#EEF2FF' : 'var(--bg)',
              cursor: 'pointer', transition: 'all 0.15s',
            }}
          >
            <span style={{ fontSize: '1.5rem' }}>{emoji}</span>
            <span style={{
              fontSize: '0.65rem', fontFamily: 'Plus Jakarta Sans', fontWeight: 600,
              color: selectedMood === value ? '#4F46E5' : 'var(--muted)',
            }}>
              {label}
            </span>
          </motion.button>
        ))}
      </div>

      {/* Stress slider */}
      <div style={{ marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
          <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--muted)' }}>Stress Level</label>
          <div style={{
            background: stress <= 3 ? '#D1FAE5' : stress <= 6 ? '#FEF3C7' : '#FEE2E2',
            color: stress <= 3 ? '#065F46' : stress <= 6 ? '#92400E' : '#991B1B',
            borderRadius: 99, padding: '0.15rem 0.625rem', fontSize: '0.75rem', fontFamily: 'Space Grotesk', fontWeight: 700,
          }}>
            {stress}/10
          </div>
        </div>
        <input
          type="range" min={1} max={10} value={stress}
          onChange={e => setStress(parseInt(e.target.value))}
          style={{ width: '100%', accentColor: '#818CF8' }}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.65rem', color: 'var(--muted)' }}>
          <span>Very low</span><span>Very high</span>
        </div>
      </div>

      {/* Journal */}
      <div style={{ marginBottom: '1.25rem' }}>
        <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--muted)', display: 'block', marginBottom: '0.375rem' }}>
          Journal Note (optional, max 100 words)
        </label>
        <textarea
          className="input"
          style={{ resize: 'vertical', minHeight: 80 }}
          placeholder="What's on your mind today? AI will detect the emotional tone..."
          value={note}
          onChange={e => setNote(e.target.value.split(' ').slice(0, 100).join(' '))}
          rows={3}
        />
        <div style={{ fontSize: '0.7rem', color: 'var(--muted)', textAlign: 'right' }}>
          {note.split(' ').filter(Boolean).length}/100 words
        </div>
      </div>

      <button
        className="btn btn-primary"
        style={{ width: '100%', background: 'linear-gradient(135deg, #818CF8, #6366F1)' }}
        onClick={handleSubmit}
        disabled={!selectedMood || loading}
      >
        {loading ? 'Saving...' : 'Log Today\'s Mood ✓'}
      </button>
    </div>
  )
}
