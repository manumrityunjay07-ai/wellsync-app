import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  Brain, Dumbbell, Salad, Moon, Activity, Sparkles,
  ArrowRight, Star, Shield, Zap, Heart, TrendingUp, MessageCircle
} from 'lucide-react'

const pillars = [
  { icon: Brain, label: 'Mental Health', desc: 'Mood tracking, stress insights & coping toolkit', color: '#818CF8', bg: '#818CF820' },
  { icon: Dumbbell, label: 'Fitness', desc: 'AI-personalised workout plans & streak tracking', color: '#F97316', bg: '#F9731620' },
  { icon: Salad, label: 'Nutrition', desc: 'Describe meals in plain text — AI estimates macros', color: '#22C55E', bg: '#22C55E20' },
  { icon: Moon, label: 'Sleep & Recovery', desc: 'Sleep debt calculator & daily recovery scoring', color: '#6366F1', bg: '#6366F120' },
  { icon: Activity, label: 'Vitals', desc: 'Blood pressure, heart rate & glucose trends', color: '#EF4444', bg: '#EF444420' },
  { icon: Sparkles, label: 'Wellness', desc: 'Habit streaks, badges & weekly wisdom reports', color: '#F59E0B', bg: '#F59E0B20' },
]

const stats = [
  { value: '6', label: 'Health Pillars', desc: 'All tracked in one place' },
  { value: '0₹', label: 'Total Cost', desc: 'Completely free, forever' },
  { value: 'AI', label: 'Powered Insights', desc: 'Google Gemini 1.5 Flash' },
  { value: '1', label: 'WellScore', desc: 'Your complete health in one number' },
]

const features = [
  { icon: Zap, title: 'Instant AI Macro Estimation', desc: 'Type "2 rotis with dal" and get calories, protein, carbs automatically — no food databases to search.', color: '#F59E0B' },
  { icon: TrendingUp, title: 'Cross-Pillar Intelligence', desc: 'AI finds patterns across ALL your data. "You feel anxious on Tuesdays because you slept under 5h on Mondays."', color: '#818CF8' },
  { icon: MessageCircle, title: 'WellBot Health Assistant', desc: 'Chat with your personal AI health coach about your data. Gets smarter as you log more.', color: '#22C55E' },
  { icon: Shield, title: 'Doctor Report PDF', desc: 'One click generates a clean, shareable health report ready to hand to your doctor.', color: '#6366F1' },
  { icon: Heart, title: 'Habit Streaks & Badges', desc: 'Gamified wellness — earn badges, maintain streaks, challenge friends on the leaderboard.', color: '#EF4444' },
  { icon: Star, title: 'Zero Cost, Zero Limits', desc: 'Built on Supabase, Vercel, and Gemini free tiers. No credit card. No premium tier. Ever.', color: '#F97316' },
]

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.5, ease: 'easeOut' } })
}

export default function Landing() {
  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', color: 'var(--text)', overflowX: 'hidden' }}>
      {/* Navbar */}
      <nav style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '1.25rem 2.5rem',
        background: 'rgba(19, 27, 58, 0.85)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid var(--border)',
        position: 'sticky', top: 0, zIndex: 100,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: 'linear-gradient(135deg, #818CF8, #6366F1)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Sparkles size={18} color="white" />
          </div>
          <span style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 800, fontSize: '1.25rem', color: '#F8FAFC', letterSpacing: '-0.02em' }}>
            WellSync
          </span>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <Link to="/auth" style={{
            padding: '0.5rem 1.25rem', borderRadius: 10,
            border: '1.5px solid var(--border)', color: 'var(--muted)',
            fontFamily: 'Plus Jakarta Sans', fontWeight: 600, fontSize: '0.875rem',
            textDecoration: 'none', transition: 'all 0.2s',
          }}>
            Sign In
          </Link>
          <Link to="/auth" className="btn btn-primary" style={{ padding: '0.5rem 1.5rem' }}>
            Get Started Free
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section style={{ padding: '7rem 2rem 5rem', textAlign: 'center', maxWidth: 900, margin: '0 auto', position: 'relative' }}>
        {/* Background glow */}
        <div style={{
          position: 'absolute', top: '20%', left: '50%', transform: 'translateX(-50%)',
          width: 600, height: 400, borderRadius: '50%',
          background: 'radial-gradient(ellipse, rgba(129,140,248,0.15) 0%, transparent 70%)',
          filter: 'blur(40px)', pointerEvents: 'none',
        }} />

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
            background: 'rgba(129,140,248,0.15)', border: '1px solid rgba(129,140,248,0.3)',
            borderRadius: 99, padding: '0.4rem 1rem', marginBottom: '2rem',
          }}>
            <Sparkles size={14} color="#818CF8" />
            <span style={{ fontSize: '0.8rem', color: '#818CF8', fontFamily: 'Plus Jakarta Sans', fontWeight: 700, letterSpacing: '0.05em' }}>
              POWERED BY GOOGLE GEMINI AI
            </span>
          </div>

          <h1 style={{
            fontSize: 'clamp(2.8rem, 6vw, 5rem)',
            lineHeight: 1.1, marginBottom: '1.5rem',
            color: '#F8FAFC', fontFamily: 'Plus Jakarta Sans', fontWeight: 800,
            letterSpacing: '-0.03em',
          }}>
            Every part of you,{' '}
            <span style={{ background: 'linear-gradient(135deg, #818CF8, #6366F1)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              in sync.
            </span>
          </h1>

          <p style={{ fontSize: '1.2rem', color: 'var(--muted)', lineHeight: 1.7, marginBottom: '2.5rem', maxWidth: 620, margin: '0 auto 2.5rem' }}>
            WellSync tracks 6 pillars of your health — mood, workouts, food, sleep, vitals, and habits —
            and uses AI to combine them into a single <strong style={{ color: '#F8FAFC' }}>WellScore</strong>.
            Built entirely free. No subscriptions. No paywalls.
          </p>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/auth" className="btn btn-primary" style={{ padding: '0.875rem 2.5rem', fontSize: '1rem' }}>
              Start for Free <ArrowRight size={18} />
            </Link>
            <Link to="/demo" style={{
              padding: '0.875rem 2rem', borderRadius: 12, fontSize: '1rem',
              border: '1.5px solid var(--border)', color: 'var(--muted)',
              fontFamily: 'Plus Jakarta Sans', fontWeight: 600,
              textDecoration: 'none', transition: 'all 0.2s',
              display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
            }}>
              See Demo
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Stats */}
      <section style={{ padding: '3rem 2rem', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', background: 'var(--surface)' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '2rem' }}>
          {stats.map((stat, i) => (
            <motion.div key={stat.label}
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              style={{ textAlign: 'center' }}
            >
              <div style={{ fontSize: '2.8rem', fontWeight: 800, color: '#818CF8', fontFamily: 'Space Grotesk', lineHeight: 1 }}>{stat.value}</div>
              <div style={{ fontSize: '1rem', fontWeight: 700, color: '#F8FAFC', fontFamily: 'Plus Jakarta Sans', margin: '0.375rem 0 0.25rem' }}>{stat.label}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>{stat.desc}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 6 Pillars */}
      <section style={{ padding: '6rem 2rem', maxWidth: 1200, margin: '0 auto' }}>
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }}>
          <motion.p custom={0} variants={fadeUp} style={{ textAlign: 'center', fontSize: '0.8rem', color: '#818CF8', fontFamily: 'Plus Jakarta Sans', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
            6 Health Pillars
          </motion.p>
          <motion.h2 custom={1} variants={fadeUp} style={{ textAlign: 'center', fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', color: '#F8FAFC', marginBottom: '1rem', fontFamily: 'Plus Jakarta Sans' }}>
            Everything tracked. All connected.
          </motion.h2>
          <motion.p custom={2} variants={fadeUp} style={{ textAlign: 'center', color: 'var(--muted)', marginBottom: '3.5rem', fontSize: '1.05rem', maxWidth: 560, margin: '0 auto 3.5rem' }}>
            Most people use 5 different apps. WellSync puts them all in one place and finds the connections.
          </motion.p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
            {pillars.map(({ icon: Icon, label, desc, color, bg }, i) => (
              <motion.div key={label} custom={i + 3} variants={fadeUp}
                style={{
                  background: 'var(--surface)', border: `1px solid var(--border)`,
                  borderRadius: 16, padding: '1.5rem',
                  borderTop: `3px solid ${color}`,
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  cursor: 'default',
                }}
                whileHover={{ y: -4, boxShadow: `0 12px 40px rgba(0,0,0,0.3)` }}
              >
                <div style={{ width: 44, height: 44, borderRadius: 12, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                  <Icon size={22} color={color} />
                </div>
                <h3 style={{ fontSize: '1.05rem', color: '#F8FAFC', marginBottom: '0.5rem', fontFamily: 'Plus Jakarta Sans' }}>{label}</h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--muted)', lineHeight: 1.6 }}>{desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Features */}
      <section style={{ padding: '5rem 2rem', background: 'var(--surface)', borderTop: '1px solid var(--border)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <motion.h2 custom={0} variants={fadeUp} style={{ textAlign: 'center', fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', color: '#F8FAFC', marginBottom: '0.75rem' }}>
              Features that matter
            </motion.h2>
            <motion.p custom={1} variants={fadeUp} style={{ textAlign: 'center', color: 'var(--muted)', marginBottom: '3rem', fontSize: '1rem' }}>
              Not just tracking — actual intelligence.
            </motion.p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.25rem' }}>
              {features.map(({ icon: Icon, title, desc, color }, i) => (
                <motion.div key={title} custom={i + 2} variants={fadeUp}
                  style={{ background: 'var(--bg)', borderRadius: 16, padding: '1.5rem', border: '1px solid var(--border)' }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                    <div style={{ width: 40, height: 40, borderRadius: 10, background: `${color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Icon size={20} color={color} />
                    </div>
                    <div>
                      <h3 style={{ fontSize: '0.95rem', color: '#F8FAFC', marginBottom: '0.5rem', fontFamily: 'Plus Jakarta Sans' }}>{title}</h3>
                      <p style={{ fontSize: '0.85rem', color: 'var(--muted)', lineHeight: 1.6 }}>{desc}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{ padding: '6rem 2rem', textAlign: 'center' }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }} transition={{ duration: 0.5 }}
          style={{
            maxWidth: 700, margin: '0 auto',
            background: 'linear-gradient(135deg, rgba(129,140,248,0.15), rgba(99,102,241,0.1))',
            border: '1px solid rgba(129,140,248,0.3)', borderRadius: 24, padding: '4rem 2rem',
          }}
        >
          <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', color: '#F8FAFC', marginBottom: '1rem', fontFamily: 'Plus Jakarta Sans' }}>
            Start your health journey today
          </h2>
          <p style={{ color: 'var(--muted)', fontSize: '1.1rem', marginBottom: '2rem', lineHeight: 1.6 }}>
            No credit card. No trial. No hidden fees.<br />
            <strong style={{ color: '#818CF8' }}>Total cost: ₹0.</strong>
          </p>
          <Link to="/auth" className="btn btn-primary" style={{ padding: '1rem 3rem', fontSize: '1.1rem' }}>
            Create Your Free Account <ArrowRight size={20} />
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer style={{ background: 'var(--surface)', borderTop: '1px solid var(--border)', padding: '2rem', textAlign: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
          <div style={{ width: 28, height: 28, borderRadius: 8, background: 'linear-gradient(135deg, #818CF8, #6366F1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Sparkles size={14} color="white" />
          </div>
          <span style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 800, fontSize: '1rem', color: '#F8FAFC' }}>WellSync</span>
        </div>
        <p style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>
          Built with React, Node.js, Supabase &amp; Google Gemini AI · Every part of you, in sync.
        </p>
        <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', marginTop: '1rem' }}>
          <Link to="/privacy" style={{ color: 'var(--muted)', fontSize: '0.8rem', textDecoration: 'none' }}>Privacy</Link>
          <Link to="/terms" style={{ color: 'var(--muted)', fontSize: '0.8rem', textDecoration: 'none' }}>Terms</Link>
          <Link to="/auth" style={{ color: '#818CF8', fontSize: '0.8rem', textDecoration: 'none' }}>Get Started</Link>
        </div>
      </footer>
    </div>
  )
}
