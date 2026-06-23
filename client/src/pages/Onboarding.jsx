import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { ChevronRight, ChevronLeft, Check, User, Target, Activity, Sparkles } from 'lucide-react'
import toast from 'react-hot-toast'

const conditions = ['None', 'Diabetes', 'High BP', 'Thyroid', 'PCOD', 'Asthma', 'Heart Disease', 'Custom']
const defaultHabits = ['Drink 8 glasses of water', 'Sleep by 11pm', 'No phone after 10pm', 'Meditate 10 mins', 'Walk 5000 steps']
const fitnessGoals = ['Lose weight', 'Build muscle', 'Improve endurance', 'Stay active', 'Recover from injury', 'Maintain current fitness']

const steps = [
  { id: 1, label: 'Personal Info', icon: User, desc: 'Tell us about yourself' },
  { id: 2, label: 'Your Goals', icon: Target, desc: 'What do you want to achieve?' },
  { id: 3, label: 'Health Profile', icon: Activity, desc: 'Any conditions we should know about?' },
  { id: 4, label: 'Starter Habits', icon: Sparkles, desc: 'Pick habits to track from Day 1' },
]

export default function Onboarding() {
  const { updateProfile, user } = useAuth()
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)

  const [personal, setPersonal] = useState({ name: '', age: '', gender: '' })
  const [goals, setGoals] = useState({ fitness: '', calorie_target: 2000, protein_target: 120, water_glasses: 8 })
  const [condition, setCondition] = useState('None')
  const [selectedHabits, setSelectedHabits] = useState([defaultHabits[0], defaultHabits[3]])

  const toggleHabit = (h) => setSelectedHabits(prev =>
    prev.includes(h) ? prev.filter(x => x !== h) : [...prev, h]
  )

  const handleFinish = async () => {
    setLoading(true)
    try {
      await updateProfile({
        name: personal.name,
        age: parseInt(personal.age) || null,
        gender: personal.gender,
        health_goals: goals,
        condition_profile: { condition, custom: condition === 'Custom' ? condition : null },
      })
      // Note: habits would be created via API in production
      toast.success('Profile setup complete! Welcome to WellSync 🎉')
      navigate('/dashboard')
    } catch (err) {
      toast.error('Failed to save profile. You can update it later in Settings.')
      navigate('/dashboard')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'linear-gradient(135deg, #EEF2FF 0%, #F8FAFC 50%, #EEF2FF 100%)',
      padding: '2rem',
    }}>
      <div style={{ width: '100%', maxWidth: 560 }}>
        {/* Progress steps */}
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '2.5rem', gap: '0.5rem' }}>
          {steps.map((s, i) => {
            const done = step > s.id
            const active = step === s.id
            return (
              <div key={s.id} style={{ display: 'flex', alignItems: 'center', flex: i < steps.length - 1 ? 1 : 'auto' }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 99, flexShrink: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: done ? '#10B981' : active ? '#4F46E5' : 'white',
                  border: `2px solid ${done ? '#10B981' : active ? '#4F46E5' : 'var(--border)'}`,
                  color: done || active ? 'white' : 'var(--muted)',
                  fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: '0.85rem',
                  transition: 'all 0.3s',
                }}>
                  {done ? <Check size={15} /> : s.id}
                </div>
                {i < steps.length - 1 && (
                  <div style={{ flex: 1, height: 2, background: done ? '#10B981' : 'var(--border)', margin: '0 0.375rem', transition: 'background 0.3s' }} />
                )}
              </div>
            )
          })}
        </div>

        {/* Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.3 }}
            style={{
              background: 'white', borderRadius: 24, padding: '2.5rem',
              boxShadow: '0 8px 40px rgba(0,0,0,0.08)',
            }}
          >
            {/* Step header */}
            <div style={{ marginBottom: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.375rem' }}>
                <span style={{ fontSize: '0.75rem', color: '#4F46E5', fontFamily: 'Plus Jakarta Sans', fontWeight: 700 }}>
                  STEP {step} OF {steps.length}
                </span>
              </div>
              <h2 style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>{steps[step - 1].label}</h2>
              <p style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>{steps[step - 1].desc}</p>
            </div>

            {/* Step 1: Personal Info */}
            {step === 1 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--muted)', display: 'block', marginBottom: '0.375rem' }}>Your Name</label>
                  <input className="input" placeholder="e.g. Aarav Sharma" value={personal.name} onChange={e => setPersonal({ ...personal, name: e.target.value })} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--muted)', display: 'block', marginBottom: '0.375rem' }}>Age</label>
                    <input className="input" type="number" min={10} max={100} placeholder="25" value={personal.age} onChange={e => setPersonal({ ...personal, age: e.target.value })} />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--muted)', display: 'block', marginBottom: '0.375rem' }}>Gender</label>
                    <select className="input" value={personal.gender} onChange={e => setPersonal({ ...personal, gender: e.target.value })}>
                      <option value="">Select</option>
                      <option>Male</option>
                      <option>Female</option>
                      <option>Non-binary</option>
                      <option>Prefer not to say</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Goals */}
            {step === 2 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--muted)', display: 'block', marginBottom: '0.625rem' }}>Primary Fitness Goal</label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.625rem' }}>
                    {fitnessGoals.map(g => (
                      <button key={g} onClick={() => setGoals({ ...goals, fitness: g })}
                        style={{
                          padding: '0.75rem', borderRadius: 10, border: `1.5px solid ${goals.fitness === g ? '#4F46E5' : 'var(--border)'}`,
                          background: goals.fitness === g ? '#EEF2FF' : 'white',
                          color: goals.fitness === g ? '#4F46E5' : 'var(--text)',
                          fontFamily: 'Plus Jakarta Sans', fontWeight: 500, fontSize: '0.8rem',
                          cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s',
                        }}>
                        {g}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--muted)', display: 'block', marginBottom: '0.375rem' }}>
                    Daily Calorie Target: <span style={{ color: '#4F46E5' }}>{goals.calorie_target} kcal</span>
                  </label>
                  <input type="range" min={1200} max={4000} step={50} value={goals.calorie_target}
                    onChange={e => setGoals({ ...goals, calorie_target: parseInt(e.target.value) })}
                    style={{ width: '100%', accentColor: '#4F46E5' }} />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--muted)', display: 'block', marginBottom: '0.375rem' }}>
                    Daily Protein Target: <span style={{ color: '#22C55E' }}>{goals.protein_target}g</span>
                  </label>
                  <input type="range" min={40} max={250} step={5} value={goals.protein_target}
                    onChange={e => setGoals({ ...goals, protein_target: parseInt(e.target.value) })}
                    style={{ width: '100%', accentColor: '#22C55E' }} />
                </div>
              </div>
            )}

            {/* Step 3: Health Profile */}
            {step === 3 && (
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--muted)', display: 'block', marginBottom: '0.75rem' }}>
                  Do you manage any of these conditions?
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.625rem' }}>
                  {conditions.map(c => (
                    <button key={c} onClick={() => setCondition(c)}
                      style={{
                        padding: '0.875rem', borderRadius: 12,
                        border: `1.5px solid ${condition === c ? '#EF4444' : 'var(--border)'}`,
                        background: condition === c ? '#FEE2E2' : 'white',
                        color: condition === c ? '#EF4444' : 'var(--text)',
                        fontFamily: 'Plus Jakarta Sans', fontWeight: 600, fontSize: '0.875rem',
                        cursor: 'pointer', transition: 'all 0.15s',
                        display: 'flex', alignItems: 'center', gap: '0.5rem',
                      }}>
                      {condition === c && <Check size={14} />}
                      {c}
                    </button>
                  ))}
                </div>
                {condition === 'Custom' && (
                  <input className="input" style={{ marginTop: '0.75rem' }} placeholder="Describe your condition..." />
                )}
                <p style={{ fontSize: '0.75rem', color: 'var(--muted)', marginTop: '1rem' }}>
                  This helps AI weigh your health pillars appropriately. You can update this anytime.
                </p>
              </div>
            )}

            {/* Step 4: Habits */}
            {step === 4 && (
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--muted)', display: 'block', marginBottom: '0.75rem' }}>
                  Pick habits to track (you can add more later):
                </label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {defaultHabits.map(h => (
                    <button key={h} onClick={() => toggleHabit(h)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '0.75rem',
                        padding: '0.875rem 1rem', borderRadius: 12,
                        border: `1.5px solid ${selectedHabits.includes(h) ? '#F59E0B' : 'var(--border)'}`,
                        background: selectedHabits.includes(h) ? '#FEF3C7' : 'white',
                        cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s',
                        fontFamily: 'Plus Jakarta Sans', fontWeight: 500, fontSize: '0.875rem',
                        color: selectedHabits.includes(h) ? '#92400E' : 'var(--text)',
                      }}>
                      <div style={{
                        width: 20, height: 20, borderRadius: 6, border: `2px solid ${selectedHabits.includes(h) ? '#F59E0B' : 'var(--border)'}`,
                        background: selectedHabits.includes(h) ? '#F59E0B' : 'transparent',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                      }}>
                        {selectedHabits.includes(h) && <Check size={11} color="white" />}
                      </div>
                      {h}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation buttons */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1.5rem' }}>
          <button
            onClick={() => setStep(s => s - 1)}
            disabled={step === 1}
            className="btn btn-secondary"
            style={{ visibility: step === 1 ? 'hidden' : 'visible' }}
          >
            <ChevronLeft size={16} /> Back
          </button>
          
          {step < steps.length ? (
            <button onClick={() => setStep(s => s + 1)} className="btn btn-primary">
              Continue <ChevronRight size={16} />
            </button>
          ) : (
            <button onClick={handleFinish} className="btn btn-primary" disabled={loading}>
              {loading ? 'Setting up...' : 'Start My Journey! 🚀'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
