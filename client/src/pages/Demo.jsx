import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { 
  Network, FileSearch, Bell, Pill, DollarSign, BarChart2, 
  ChevronRight, ChevronLeft, Activity, Shield, BookOpen, Zap
} from 'lucide-react'

const slides = [
  {
    id: 0,
    tag: 'OVERVIEW',
    title: 'The Healthcare Intelligence Platform',
    subtitle: 'Archimedes connects 7 disjointed healthcare data silos into one AI-powered, queryable intelligence layer.',
    icon: Network,
    color: '#D4AF37',
    features: [
      { icon: FileSearch, label: 'Payer Intelligence', desc: 'Query 18,443+ payer policy documents instantly' },
      { icon: Bell, label: 'Live Intel Alerts', desc: 'FDA updates, guideline changes, trial readouts in real-time' },
      { icon: BarChart2, label: 'Evidence Analytics', desc: 'PICO extraction from clinical trials with data visualizations' },
      { icon: Network, label: '7 Frontiers Graph', desc: 'Visual map connecting biology to coverage decisions' },
    ],
    cta: 'Explore the 7 Frontiers'
  },
  {
    id: 1,
    tag: 'AI ENGINE',
    title: 'Gemini-Powered Evidence Analysis',
    subtitle: 'Ask any coverage or clinical question in plain English. Archimedes returns a structured PICO analysis, evidence grade, and executive summary — in seconds.',
    icon: Zap,
    color: '#8B5CF6',
    features: [
      { icon: BookOpen, label: 'Live PubMed', desc: 'Real-time peer-reviewed literature fetched on every query' },
      { icon: Activity, label: 'ClinicalTrials.gov', desc: 'Direct integration with 400K+ registered clinical studies' },
      { icon: Shield, label: 'Evidence Grading', desc: 'AI grades each study A/B/C using GRADE methodology' },
      { icon: BarChart2, label: 'Recharts Visualizations', desc: 'Interactive pie and bar charts for evidence distribution' },
    ],
    cta: 'Try Payer Intel Search'
  },
  {
    id: 2,
    tag: 'NEW: CLINICAL TOOLS',
    title: 'Drug Interactions & Cost Analysis',
    subtitle: 'Two powerful new AI tools for clinicians and market access teams — powered by OpenFDA data and Gemini AI.',
    icon: Pill,
    color: '#10B981',
    features: [
      { icon: Pill, label: 'Drug Interaction Checker', desc: 'Enter any two drugs to get severity, mechanism, and clinical guidance' },
      { icon: DollarSign, label: 'Cost-Effectiveness Analysis', desc: 'Get WAC pricing, copay estimates, and biosimilar alternatives' },
      { icon: Shield, label: 'OpenFDA Integration', desc: 'Pulls real FDA drug label data for accurate interaction context' },
      { icon: BookOpen, label: 'AI Clinical Summary', desc: 'Gemini synthesizes data into plain-English provider guidance' },
    ],
    cta: 'Try Drug Interaction Checker'
  },
  {
    id: 3,
    tag: 'PATIENT PLATFORM',
    title: 'WellSync: Whole-Person Health',
    subtitle: 'The patient-facing side of the platform tracks 6 health pillars — Mental, Fitness, Nutrition, Sleep, Vitals, and Wellness — with an AI WellScore.',
    icon: Activity,
    color: '#F43F5E',
    features: [
      { icon: Activity, label: 'WellScore Ring', desc: 'Daily AI-calculated score across all 6 health pillars' },
      { icon: Zap, label: 'AI Briefing', desc: 'Personalized daily health briefing from WellBot' },
      { icon: Bell, label: 'Smart Notifications', desc: 'Low score alerts and actionable recommendations' },
      { icon: Shield, label: 'Secure & Private', desc: 'All data encrypted, Supabase-powered, HIPAA-aligned' },
    ],
    cta: 'Sign Up Free'
  }
]

export default function Demo() {
  const [current, setCurrent] = useState(0)
  const [direction, setDirection] = useState(1)

  const slide = slides[current]
  const Icon = slide.icon

  const go = (dir) => {
    setDirection(dir)
    setCurrent(c => Math.max(0, Math.min(slides.length - 1, c + dir)))
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--text)', fontFamily: 'Plus Jakarta Sans' }}>
      {/* Navbar */}
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.25rem 2.5rem', borderBottom: '1px solid var(--border)', background: 'rgba(19,27,58,0.8)', backdropFilter: 'blur(20px)', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Network size={22} color="var(--primary)" />
          <span style={{ fontWeight: 800, fontSize: '1.2rem', letterSpacing: '1px', textTransform: 'uppercase' }}>Archimedes</span>
          <span style={{ background: 'rgba(212,175,55,0.15)', color: 'var(--primary)', padding: '0.25rem 0.75rem', borderRadius: 99, fontSize: '0.75rem', fontWeight: 700 }}>LIVE DEMO</span>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Link to="/auth" className="btn btn-secondary" style={{ padding: '0.5rem 1.25rem', fontSize: '0.9rem' }}>Log In</Link>
          <Link to="/auth" className="btn btn-primary" style={{ padding: '0.5rem 1.25rem', fontSize: '0.9rem' }}>Get Started</Link>
        </div>
      </nav>

      {/* Slide Dots */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', padding: '1.5rem 0 0' }}>
        {slides.map((s, i) => (
          <button key={i} onClick={() => { setDirection(i > current ? 1 : -1); setCurrent(i) }}
            style={{ width: i === current ? 32 : 8, height: 8, borderRadius: 99, border: 'none', cursor: 'pointer', background: i === current ? 'var(--primary)' : 'var(--border)', transition: 'all 0.3s' }} />
        ))}
      </div>

      {/* Main Slide */}
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={current}
          custom={direction}
          initial={{ opacity: 0, x: direction * 80 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: direction * -80 }}
          transition={{ duration: 0.4, ease: 'easeInOut' }}
          style={{ maxWidth: 1100, margin: '0 auto', padding: '3rem 2rem 2rem' }}
        >
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: `${slide.color}15`, border: `1px solid ${slide.color}40`, color: slide.color, padding: '0.4rem 1rem', borderRadius: 99, fontSize: '0.75rem', fontWeight: 800, letterSpacing: '2px', marginBottom: '1.5rem' }}>
              <Icon size={14} /> {slide.tag}
            </div>
            <h1 style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)', lineHeight: 1.2, marginBottom: '1.25rem', color: 'var(--text)' }}>
              {slide.title}
            </h1>
            <p style={{ fontSize: '1.2rem', color: 'var(--muted)', maxWidth: 700, margin: '0 auto', lineHeight: 1.7 }}>
              {slide.subtitle}
            </p>
          </div>

          {/* Feature Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
            {slide.features.map((feat, i) => {
              const FeatIcon = feat.icon
              return (
                <motion.div key={i}
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.08 }}
                  style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, padding: '1.5rem', borderTop: `3px solid ${slide.color}` }}
                >
                  <div style={{ width: 40, height: 40, borderRadius: 10, background: `${slide.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                    <FeatIcon size={20} color={slide.color} />
                  </div>
                  <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text)' }}>{feat.label}</h3>
                  <p style={{ fontSize: '0.875rem', color: 'var(--muted)', lineHeight: 1.5 }}>{feat.desc}</p>
                </motion.div>
              )
            })}
          </div>

          {/* CTA */}
          <div style={{ textAlign: 'center' }}>
            <Link to="/auth" className="btn btn-primary" style={{ padding: '0.875rem 2.5rem', fontSize: '1.05rem' }}>
              {slide.cta} <ChevronRight size={18} />
            </Link>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Arrows */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', padding: '2rem 0 3rem' }}>
        <button className="btn btn-secondary" onClick={() => go(-1)} disabled={current === 0}
          style={{ padding: '0.75rem 1.5rem', opacity: current === 0 ? 0.4 : 1 }}>
          <ChevronLeft size={18} /> Previous
        </button>
        <button className="btn btn-primary" onClick={() => go(1)} disabled={current === slides.length - 1}
          style={{ padding: '0.75rem 1.5rem', opacity: current === slides.length - 1 ? 0.4 : 1 }}>
          Next <ChevronRight size={18} />
        </button>
      </div>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid var(--border)', padding: '1.5rem', textAlign: 'center', color: 'var(--muted)', fontSize: '0.85rem' }}>
        <p>Archimedes by WellSync · Built with Gemini AI · <Link to="/auth" style={{ color: 'var(--primary)' }}>Access the Full Platform →</Link></p>
      </footer>
    </div>
  )
}
