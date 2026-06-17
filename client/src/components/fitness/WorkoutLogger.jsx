import { useState } from 'react'
import { motion } from 'framer-motion'
import { Flame, Plus, Trophy, Target } from 'lucide-react'

const intensities = ['low', 'medium', 'high']
const muscleGroups = ['Chest', 'Back', 'Shoulders', 'Arms', 'Legs', 'Core', 'Full Body', 'Cardio']

export function WorkoutLogger({ onSubmit, loading }) {
  const [form, setForm] = useState({
    exercise_name: '',
    duration_mins: 30,
    intensity: 'medium',
    muscle_groups: [],
    energy_after: 7,
  })

  const toggleMuscle = (m) => setForm(f => ({
    ...f,
    muscle_groups: f.muscle_groups.includes(m)
      ? f.muscle_groups.filter(x => x !== m)
      : [...f.muscle_groups, m]
  }))

  const handleSubmit = () => {
    if (!form.exercise_name) return
    onSubmit(form)
    setForm({ exercise_name: '', duration_mins: 30, intensity: 'medium', muscle_groups: [], energy_after: 7 })
  }

  return (
    <div className="card">
      <h3 style={{ fontSize: '1rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <span style={{ fontSize: '1.1rem' }}>💪</span> Log Workout
      </h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <input
          className="input"
          placeholder="Workout name (e.g. Morning Run, Push Day...)"
          value={form.exercise_name}
          onChange={e => setForm({ ...form, exercise_name: e.target.value })}
        />

        <div>
          <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--muted)', display: 'block', marginBottom: '0.375rem' }}>
            Duration: <span style={{ color: '#F97316' }}>{form.duration_mins} mins</span>
          </label>
          <input type="range" min={5} max={180} step={5} value={form.duration_mins}
            onChange={e => setForm({ ...form, duration_mins: parseInt(e.target.value) })}
            style={{ width: '100%', accentColor: '#F97316' }} />
        </div>

        <div>
          <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--muted)', display: 'block', marginBottom: '0.5rem' }}>Intensity</label>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {intensities.map(i => (
              <button key={i} onClick={() => setForm({ ...form, intensity: i })}
                style={{
                  flex: 1, padding: '0.625rem', borderRadius: 10, border: `1.5px solid ${form.intensity === i ? '#F97316' : 'var(--border)'}`,
                  background: form.intensity === i ? '#FFF7ED' : 'var(--bg)',
                  color: form.intensity === i ? '#F97316' : 'var(--muted)',
                  fontFamily: 'Plus Jakarta Sans', fontWeight: 600, fontSize: '0.8rem',
                  cursor: 'pointer', textTransform: 'capitalize', transition: 'all 0.15s',
                }}>
                {i === 'low' ? '🟢' : i === 'medium' ? '🟡' : '🔴'} {i}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--muted)', display: 'block', marginBottom: '0.5rem' }}>Muscle Groups Worked</label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem' }}>
            {muscleGroups.map(m => (
              <button key={m} onClick={() => toggleMuscle(m)}
                style={{
                  padding: '0.375rem 0.75rem', borderRadius: 99, fontSize: '0.75rem',
                  fontFamily: 'Plus Jakarta Sans', fontWeight: 600, cursor: 'pointer',
                  border: `1.5px solid ${form.muscle_groups.includes(m) ? '#F97316' : 'var(--border)'}`,
                  background: form.muscle_groups.includes(m) ? '#F9731620' : 'var(--bg)',
                  color: form.muscle_groups.includes(m) ? '#F97316' : 'var(--muted)',
                  transition: 'all 0.15s',
                }}>
                {m}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--muted)', display: 'block', marginBottom: '0.375rem' }}>
            Energy Level After: <span style={{ color: '#F97316' }}>{form.energy_after}/10</span>
          </label>
          <input type="range" min={1} max={10} value={form.energy_after}
            onChange={e => setForm({ ...form, energy_after: parseInt(e.target.value) })}
            style={{ width: '100%', accentColor: '#F97316' }} />
        </div>

        <button
          className="btn btn-primary"
          style={{ background: 'linear-gradient(135deg, #F97316, #EA580C)' }}
          onClick={handleSubmit}
          disabled={!form.exercise_name || loading}
        >
          {loading ? 'Saving...' : 'Log Workout 💪'}
        </button>
      </div>
    </div>
  )
}

export function StreakCounter({ streak = 0 }) {
  const maxDisplay = 7
  const days = Array.from({ length: maxDisplay }, (_, i) => i < streak % maxDisplay || streak >= maxDisplay)

  return (
    <div className="card" style={{ textAlign: 'center' }}>
      <div style={{ fontSize: '3rem', marginBottom: '0.25rem' }}>🔥</div>
      <div style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: '3rem', color: '#F97316', lineHeight: 1 }}>
        {streak}
      </div>
      <div style={{ color: 'var(--muted)', fontSize: '0.85rem', marginBottom: '1rem' }}>
        Day workout streak!
      </div>
      <div style={{ display: 'flex', gap: '0.375rem', justifyContent: 'center' }}>
        {days.map((active, i) => (
          <div key={i} style={{
            width: 28, height: 28, borderRadius: 8,
            background: active ? '#F97316' : 'var(--bg)',
            border: `2px solid ${active ? '#F97316' : 'var(--border)'}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '0.7rem',
          }}>
            {active ? '🔥' : ''}
          </div>
        ))}
      </div>
      {streak === 0 && (
        <p style={{ fontSize: '0.75rem', color: 'var(--muted)', marginTop: '0.75rem' }}>
          Log your first workout to start your streak!
        </p>
      )}
    </div>
  )
}

export function WorkoutPlan({ plan = null }) {
  if (!plan) return (
    <div className="card">
      <h3 style={{ fontSize: '1rem', marginBottom: '0.75rem' }}>🗓️ This Week's AI Plan</h3>
      <div className="empty-state">
        <Target size={32} color="var(--muted)" />
        <p>No plan generated yet. Your plan is created every Monday based on your recent workouts.</p>
      </div>
    </div>
  )

  const intensityColors = { low: '#22C55E', medium: '#F59E0B', high: '#EF4444' }

  return (
    <div className="card">
      <h3 style={{ fontSize: '1rem', marginBottom: '1rem' }}>🗓️ This Week's AI Plan</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {plan.week_plan?.map((day, i) => (
          <div key={i} style={{
            display: 'flex', gap: '1rem', alignItems: 'flex-start',
            padding: '0.875rem', background: 'var(--bg)', borderRadius: 12,
            borderLeft: `4px solid ${intensityColors[day.intensity] || '#94A3B8'}`,
          }}>
            <div style={{ minWidth: 36, textAlign: 'center' }}>
              <div style={{ fontSize: '0.65rem', color: 'var(--muted)', fontWeight: 700 }}>{day.day.slice(0, 3).toUpperCase()}</div>
              <div style={{ fontSize: '1.2rem' }}>{day.type === 'rest' ? '😴' : day.type === 'active recovery' ? '🧘' : '💪'}</div>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 600, fontSize: '0.875rem' }}>{day.workout_name}</div>
              {day.duration_mins && (
                <div style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>{day.duration_mins} mins · {day.intensity}</div>
              )}
              {day.reason && (
                <div style={{ fontSize: '0.7rem', color: 'var(--muted)', marginTop: '0.25rem', fontStyle: 'italic' }}>{day.reason}</div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
