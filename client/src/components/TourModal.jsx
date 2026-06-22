import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, X, Sparkles, Brain, Activity } from 'lucide-react'

export default function TourModal({ onComplete }) {
  const [step, setStep] = useState(0)

  const steps = [
    {
      title: 'Welcome to WellSync!',
      desc: 'Let us show you around your new intelligent health dashboard.',
      icon: <Sparkles size={32} color="#4F46E5" />
    },
    {
      title: 'WellScore Intelligence',
      desc: 'Our AI analyzes your sleep, nutrition, fitness, and mood to give you a single actionable score every day.',
      icon: <Activity size={32} color="#10B981" />
    },
    {
      title: 'Payer & Drug Intel',
      desc: 'As a provider or patient, you have direct access to FDA drug interactions and payer coverage data via Archimedes AI.',
      icon: <Brain size={32} color="#8B5CF6" />
    }
  ]

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(s => s + 1)
    } else {
      onComplete()
    }
  }

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0,0,0,0.5)', zIndex: 9999,
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem'
    }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        style={{
          background: 'var(--surface)', borderRadius: 24, padding: '2.5rem',
          width: '100%', maxWidth: 450, position: 'relative', textAlign: 'center',
          border: '1px solid var(--border)'
        }}
      >
        <button onClick={onComplete} style={{ position: 'absolute', top: 16, right: 16, background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--muted)' }}>
          <X size={20} />
        </button>

        <div style={{ width: 64, height: 64, borderRadius: 32, background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', border: '1px solid var(--border)' }}>
          {steps[step].icon}
        </div>

        <h3 style={{ fontSize: '1.5rem', color: 'var(--text)', marginBottom: '1rem' }}>{steps[step].title}</h3>
        <p style={{ color: 'var(--muted)', lineHeight: 1.6, marginBottom: '2rem' }}>{steps[step].desc}</p>

        <div style={{ display: 'flex', gap: '4px', justifyContent: 'center', marginBottom: '2rem' }}>
          {steps.map((_, i) => (
            <div key={i} style={{ width: i === step ? 24 : 8, height: 8, borderRadius: 4, background: i === step ? '#4F46E5' : 'var(--border)', transition: 'all 0.3s' }} />
          ))}
        </div>

        <button onClick={handleNext} className="btn btn-primary" style={{ width: '100%', padding: '0.875rem' }}>
          {step === steps.length - 1 ? "Let's Go!" : "Next"}
        </button>
      </motion.div>
    </div>
  )
}
