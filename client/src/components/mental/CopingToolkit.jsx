import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Wind, BookOpen, Hand, Timer, X } from 'lucide-react'

const tools = [
  {
    id: 'breathing',
    icon: Wind,
    label: '4-7-8 Breathing',
    desc: 'A calming breath technique to reduce anxiety in 2 minutes.',
    color: '#818CF8',
    Component: BreathingTimer,
  },
  {
    id: 'grounding',
    icon: Hand,
    label: '5-4-3-2-1 Grounding',
    desc: 'Ground yourself by engaging all 5 senses.',
    color: '#22C55E',
    Component: GroundingExercise,
  },
  {
    id: 'journal',
    icon: BookOpen,
    label: 'Journaling Prompts',
    desc: 'Thought-provoking questions to reflect and grow.',
    color: '#F59E0B',
    Component: JournalPrompts,
  },
]

function BreathingTimer() {
  const [phase, setPhase] = useState('idle') // idle | inhale | hold | exhale
  const [count, setCount] = useState(0)
  const [interval, setIntervalId] = useState(null)
  const [cycles, setCycles] = useState(0)

  const phaseConfig = {
    inhale: { label: 'Inhale', duration: 4, color: '#818CF8', next: 'hold' },
    hold: { label: 'Hold', duration: 7, color: '#6366F1', next: 'exhale' },
    exhale: { label: 'Exhale', duration: 8, color: '#4F46E5', next: 'inhale' },
  }

  const start = () => {
    setPhase('inhale')
    setCount(4)
    let currentPhase = 'inhale'
    let currentCount = 4

    const id = setInterval(() => {
      currentCount--
      if (currentCount <= 0) {
        const nextPhase = phaseConfig[currentPhase].next
        if (nextPhase === 'inhale') setCycles(c => c + 1)
        currentPhase = nextPhase
        currentCount = phaseConfig[nextPhase].duration
        setPhase(nextPhase)
      }
      setCount(currentCount)
    }, 1000)
    setIntervalId(id)
  }

  const stop = () => {
    clearInterval(interval)
    setPhase('idle')
    setCount(0)
    setCycles(0)
  }

  const config = phaseConfig[phase]

  return (
    <div style={{ textAlign: 'center', padding: '1rem' }}>
      <div style={{
        width: 140, height: 140, borderRadius: '50%', margin: '0 auto 1.5rem',
        border: `4px solid ${phase !== 'idle' ? config.color : 'var(--border)'}`,
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        transition: 'all 0.5s',
        boxShadow: phase !== 'idle' ? `0 0 30px ${config.color}40` : 'none',
        background: phase !== 'idle' ? `${config.color}10` : 'transparent',
      }}>
        <div style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: '2.5rem', color: phase !== 'idle' ? config.color : 'var(--muted)' }}>
          {phase !== 'idle' ? count : '?'}
        </div>
        <div style={{ fontSize: '0.7rem', color: phase !== 'idle' ? config.color : 'var(--muted)', fontWeight: 600 }}>
          {phase !== 'idle' ? config.label.toUpperCase() : 'START'}
        </div>
      </div>
      {cycles > 0 && <p style={{ fontSize: '0.8rem', color: 'var(--muted)', marginBottom: '1rem' }}>Cycles completed: {cycles}</p>}
      <button
        className="btn"
        style={{ background: phase === 'idle' ? 'linear-gradient(135deg, #818CF8, #6366F1)' : '#FEE2E2', color: phase === 'idle' ? 'white' : '#EF4444' }}
        onClick={phase === 'idle' ? start : stop}
      >
        {phase === 'idle' ? '▶ Start Breathing' : '■ Stop'}
      </button>
    </div>
  )
}

function GroundingExercise() {
  const steps = [
    { n: 5, sense: 'see', icon: '👁', prompt: 'Name 5 things you can see right now.' },
    { n: 4, sense: 'touch', icon: '✋', prompt: 'Name 4 things you can physically touch.' },
    { n: 3, sense: 'hear', icon: '👂', prompt: 'Name 3 things you can hear around you.' },
    { n: 2, sense: 'smell', icon: '👃', prompt: 'Name 2 things you can smell.' },
    { n: 1, sense: 'taste', icon: '👅', prompt: 'Name 1 thing you can taste.' },
  ]
  const [currentStep, setCurrentStep] = useState(0)
  const step = steps[currentStep]

  return (
    <div style={{ padding: '1rem' }}>
      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', marginBottom: '1.5rem' }}>
        {steps.map((s, i) => (
          <div key={i} style={{
            width: 28, height: 28, borderRadius: 99,
            background: i < currentStep ? '#22C55E' : i === currentStep ? '#818CF8' : 'var(--border)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'white', fontSize: '0.7rem', fontWeight: 700, transition: 'all 0.3s',
          }}>
            {i < currentStep ? '✓' : s.n}
          </div>
        ))}
      </div>
      <div style={{ textAlign: 'center', padding: '1.5rem', background: '#818CF810', borderRadius: 16, marginBottom: '1.25rem' }}>
        <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>{step.icon}</div>
        <p style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 600, color: 'var(--text)', lineHeight: 1.5 }}>{step.prompt}</p>
      </div>
      <div style={{ display: 'flex', gap: '0.75rem' }}>
        {currentStep > 0 && <button className="btn btn-secondary" onClick={() => setCurrentStep(s => s - 1)}>Back</button>}
        <button
          className="btn btn-primary"
          style={{ flex: 1, background: 'linear-gradient(135deg, #22C55E, #16A34A)' }}
          onClick={() => currentStep < steps.length - 1 ? setCurrentStep(s => s + 1) : setCurrentStep(0)}
        >
          {currentStep < steps.length - 1 ? 'Done ✓ Next' : 'Restart 🔄'}
        </button>
      </div>
    </div>
  )
}

const prompts = [
  'What is one small win from today that you\'re grateful for?',
  'What emotion showed up the most today, and what triggered it?',
  'What\'s something you\'ve been avoiding? What would it feel like to face it?',
  'Describe a moment today where you felt most like yourself.',
  'What would you tell a close friend who was feeling exactly how you feel right now?',
  'What does "a good day" look like for you this week?',
  'What are 3 things you can control, and 3 you cannot?',
]

function JournalPrompts() {
  const [promptIdx, setPromptIdx] = useState(0)
  const prompt = prompts[promptIdx]

  return (
    <div style={{ padding: '1rem' }}>
      <div style={{
        background: 'linear-gradient(135deg, #FEF3C7, #FDE68A)',
        borderRadius: 16, padding: '1.5rem', marginBottom: '1.25rem',
        borderLeft: '4px solid #F59E0B',
      }}>
        <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>💭</div>
        <p style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 600, color: 'var(--text)', lineHeight: 1.6, fontSize: '0.95rem' }}>
          {prompt}
        </p>
      </div>
      <button
        className="btn btn-secondary"
        style={{ width: '100%' }}
        onClick={() => setPromptIdx((promptIdx + 1) % prompts.length)}
      >
        New Prompt 🔀
      </button>
    </div>
  )
}

export default function CopingToolkit() {
  const [open, setOpen] = useState(null)
  const selected = tools.find(t => t.id === open)

  return (
    <div className="card">
      <h3 style={{ fontSize: '1rem', marginBottom: '1.25rem' }}>🧘 Coping Toolkit</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {tools.map(({ id, icon: Icon, label, desc, color }) => (
          <button
            key={id}
            onClick={() => setOpen(id)}
            style={{
              display: 'flex', alignItems: 'center', gap: '1rem',
              padding: '1rem', borderRadius: 12,
              border: `1.5px solid ${open === id ? color : 'var(--border)'}`,
              background: open === id ? `${color}10` : 'var(--bg)',
              cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s',
            }}
          >
            <div style={{ width: 40, height: 40, borderRadius: 10, background: `${color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Icon size={20} color={color} />
            </div>
            <div>
              <div style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 600, fontSize: '0.875rem', color: 'var(--text)' }}>{label}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>{desc}</div>
            </div>
          </button>
        ))}
      </div>

      <AnimatePresence>
        {open && selected && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            style={{
              position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              zIndex: 1000, padding: '1rem',
            }}
            onClick={(e) => { if (e.target === e.currentTarget) setOpen(null) }}
          >
            <div style={{
              background: 'var(--surface)', borderRadius: 20, padding: '1.5rem',
              width: '100%', maxWidth: 420,
              boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                <h3 style={{ fontSize: '1.1rem' }}>{selected.label}</h3>
                <button onClick={() => setOpen(null)} className="btn btn-ghost" style={{ borderRadius: 99, padding: '0.375rem' }}>
                  <X size={18} />
                </button>
              </div>
              <selected.Component />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
