import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { 
  Brain, Dumbbell, Salad, Moon, Activity, Sparkles,
  ArrowRight, CheckCircle, Zap, Shield, Heart, BarChart3
} from 'lucide-react'

const pillars = [
  { icon: Brain, label: 'Mental Health', desc: 'Mood tracking, journaling, stress patterns, and coping tools.', color: '#818CF8' },
  { icon: Dumbbell, label: 'Physical Fitness', desc: 'AI workout plans, streak counter, and personal records.', color: '#F97316' },
  { icon: Salad, label: 'Nutrition', desc: 'Log meals in plain English — AI estimates calories instantly.', color: '#22C55E' },
  { icon: Moon, label: 'Sleep & Recovery', desc: 'Sleep debt tracker, recovery scores, and pattern insights.', color: '#6366F1' },
  { icon: Activity, label: 'Vitals & Meds', desc: 'Track vitals, medication logs, and generate PDF doctor reports.', color: '#EF4444' },
  { icon: Sparkles, label: 'Habits & Wellness', desc: 'Custom habits, streak badges, and weekly wellness reports.', color: '#F59E0B' },
]

const features = [
  { icon: BarChart3, title: 'One Score For Everything', desc: 'WellScore (0–100) unifies all 6 pillars into a single daily health number.' },
  { icon: Zap, title: 'Cross-Pillar AI Insights', desc: 'Gemini AI finds patterns you\'d never notice: "You sleep better when you skip coffee after 2pm."' },
  { icon: Shield, title: 'Built For Indian Bodies', desc: 'Meal estimation understands idli, sambar, roti, dal — not just burgers and salads.' },
  { icon: Heart, title: 'Generous Free Tier', desc: 'Get started tracking all your health pillars with our generous free tier, no credit card required.' },
]

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5 } })
}

export default function Landing() {
  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      {/* Navbar */}
      <nav style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '1rem 2rem', background: 'rgba(255,255,255,0.9)',
        backdropFilter: 'blur(20px)', borderBottom: '1px solid var(--border)',
        position: 'sticky', top: 0, zIndex: 100,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
          <div style={{
            width: 34, height: 34, borderRadius: 10,
            background: 'linear-gradient(135deg, #818CF8, #4F46E5)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Sparkles size={16} color="white" />
          </div>
          <span style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 800, fontSize: '1.1rem', color: '#0F172A' }}>
            WellSync
          </span>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Link to="/auth" className="btn btn-secondary" style={{ padding: '0.5rem 1.25rem' }}>Log In</Link>
          <Link to="/auth" className="btn btn-primary" style={{ padding: '0.5rem 1.25rem' }}>
            Get Started Free
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section style={{ padding: '5rem 2rem 4rem', textAlign: 'center', maxWidth: 780, margin: '0 auto' }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
            background: 'rgba(99,102,241,0.1)', borderRadius: 99,
            padding: '0.375rem 1rem', marginBottom: '1.5rem',
          }}>
            <Sparkles size={13} color="#6366F1" />
            <span style={{ fontSize: '0.8rem', color: '#4F46E5', fontFamily: 'Plus Jakarta Sans', fontWeight: 700 }}>
              Powered by Google Gemini AI
            </span>
          </div>

          <h1 style={{
            fontSize: 'clamp(2.5rem, 6vw, 4rem)',
            lineHeight: 1.1, marginBottom: '1.25rem',
            background: 'var(--gradient-hero)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}>
            Every Part of You,<br />In Sync.
          </h1>

          <p style={{ fontSize: '1.1rem', color: 'var(--muted)', lineHeight: 1.7, marginBottom: '2.5rem', maxWidth: 560, margin: '0 auto 2.5rem' }}>
            Track mood, workouts, food, sleep, vitals, and habits — all in one place. 
            Gemini AI combines everything into a single WellScore and finds patterns 
            you'd never notice yourself.
          </p>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/auth" className="btn btn-primary" style={{ padding: '0.875rem 2rem', fontSize: '1rem' }}>
              Start Tracking Free <ArrowRight size={18} />
            </Link>
            <a href="#pillars" className="btn btn-secondary" style={{ padding: '0.875rem 2rem', fontSize: '1rem' }}>
              See How It Works
            </a>
          </div>

          <div style={{ display: 'flex', gap: '2rem', justifyContent: 'center', marginTop: '2.5rem', flexWrap: 'wrap' }}>
            {['Generous free tier', '6 health pillars', 'AI-powered', 'PWA ready'].map(tag => (
              <div key={tag} style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', color: 'var(--muted)', fontSize: '0.85rem' }}>
                <CheckCircle size={14} color="#10B981" />
                {tag}
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Score Preview */}
      <section style={{ padding: '2rem', display: 'flex', justifyContent: 'center' }}>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          style={{
            background: 'linear-gradient(135deg, #4F46E5, #818CF8)',
            borderRadius: 24, padding: '2.5rem',
            maxWidth: 700, width: '100%',
            display: 'flex', alignItems: 'center', gap: '2rem',
            flexWrap: 'wrap', justifyContent: 'center',
            boxShadow: '0 20px 60px rgba(99,102,241,0.3)',
          }}
        >
          {/* Score Ring Preview (static) */}
          <div style={{ textAlign: 'center' }}>
            <svg width={140} height={140} style={{ transform: 'rotate(-90deg)' }}>
              <circle cx={70} cy={70} r={54} fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth={13} />
              <circle cx={70} cy={70} r={54} fill="none" stroke="white" strokeWidth={13}
                strokeLinecap="round" strokeDasharray={339} strokeDashoffset={68}
                style={{ filter: 'drop-shadow(0 0 10px rgba(255,255,255,0.5))' }} />
            </svg>
            <div style={{ marginTop: '-4.5rem', textAlign: 'center', color: 'white' }}>
              <div style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: '2.5rem' }}>80</div>
              <div style={{ fontSize: '0.7rem', opacity: 0.8, fontWeight: 600 }}>WELLSCORE</div>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, marginTop: 2 }}>Thriving 🟢</div>
            </div>
          </div>
          {/* Pillar scores */}
          <div style={{ flex: 1, minWidth: 240 }}>
            {[
              { label: 'Mental', score: 85, color: '#818CF8' },
              { label: 'Fitness', score: 70, color: '#F97316' },
              { label: 'Nutrition', score: 78, color: '#22C55E' },
              { label: 'Sleep', score: 82, color: '#C7D2FE' },
              { label: 'Vitals', score: 90, color: '#FCA5A5' },
              { label: 'Wellness', score: 75, color: '#FDE68A' },
            ].map(({ label, score, color }) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.625rem' }}>
                <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.8rem', width: 70, fontFamily: 'Plus Jakarta Sans', fontWeight: 500 }}>{label}</span>
                <div style={{ flex: 1, height: 6, background: 'rgba(255,255,255,0.2)', borderRadius: 99 }}>
                  <div style={{ width: `${score}%`, height: '100%', background: color, borderRadius: 99 }} />
                </div>
                <span style={{ color: 'white', fontSize: '0.8rem', fontFamily: 'Space Grotesk', fontWeight: 600, width: 30, textAlign: 'right' }}>{score}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* 6 Pillars */}
      <section id="pillars" style={{ padding: '4rem 2rem', maxWidth: 1100, margin: '0 auto' }}>
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }}>
          <motion.h2 custom={0} variants={fadeUp} style={{ textAlign: 'center', fontSize: '2rem', marginBottom: '0.5rem' }}>
            6 Health Pillars, One App
          </motion.h2>
          <motion.p custom={1} variants={fadeUp} style={{ textAlign: 'center', color: 'var(--muted)', marginBottom: '3rem' }}>
            Everything your health needs, tracked together.
          </motion.p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.25rem' }}>
            {pillars.map(({ icon: Icon, label, desc, color }, i) => (
              <motion.div key={label} custom={i + 2} variants={fadeUp}>
                <div style={{
                  background: 'var(--surface)', borderRadius: 16, padding: '1.5rem',
                  border: '1px solid var(--border)',
                  boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = `0 8px 30px ${color}20` }}
                  onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.04)' }}
                >
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: `${color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                    <Icon size={22} color={color} />
                  </div>
                  <h3 style={{ fontSize: '1rem', marginBottom: '0.375rem', color: '#0F172A' }}>{label}</h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--muted)', lineHeight: 1.6 }}>{desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Features */}
      <section style={{ padding: '4rem 2rem', background: 'var(--surface)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <motion.h2
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
            style={{ textAlign: 'center', fontSize: '2rem', marginBottom: '3rem' }}
          >
            What Makes WellSync Different
          </motion.h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '2rem' }}>
            {features.map(({ icon: Icon, title, desc }, i) => (
              <motion.div key={title}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                style={{ textAlign: 'center', padding: '1rem' }}
              >
                <div style={{
                  width: 56, height: 56, borderRadius: 16, margin: '0 auto 1rem',
                  background: 'linear-gradient(135deg, rgba(99,102,241,0.1), rgba(79,70,229,0.15))',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Icon size={24} color="#4F46E5" />
                </div>
                <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>{title}</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--muted)', lineHeight: 1.6 }}>{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '5rem 2rem', textAlign: 'center' }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
        >
          <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Start Your Health Journey Today</h2>
          <p style={{ color: 'var(--muted)', marginBottom: '2rem', maxWidth: 400, margin: '0 auto 2rem' }}>
            Start with our generous free tier. No credit card required.
          </p>
          <Link to="/auth" className="btn btn-primary" style={{ padding: '1rem 2.5rem', fontSize: '1.05rem' }}>
            Create Your Account <ArrowRight size={18} />
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid var(--border)', padding: '1.5rem 2rem', textAlign: 'center', color: 'var(--muted)', fontSize: '0.8rem' }}>
        WellSync — Every part of you, in sync. Built with React, Node.js, Supabase, and Google Gemini AI.
      </footer>
    </div>
  )
}
