import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Brain, Dumbbell, Salad, Moon, Activity, Sparkles, Bell, Calendar } from 'lucide-react'
import { format } from 'date-fns'
import Sidebar from '../components/layout/Sidebar'
import BottomNav from '../components/layout/BottomNav'
import WellScoreRing from '../components/dashboard/WellScoreRing'
import PillarCard from '../components/dashboard/PillarCard'
import AIBriefing from '../components/dashboard/AIBriefing'
import WeeklyChart from '../components/dashboard/WeeklyChart'
import { useAuth } from '../context/AuthContext'
import { useWellScore } from '../context/WellScoreContext'
import api from '../services/api'

const pillars = [
  { pillar: 'mental', icon: Brain, label: 'Mental', to: '/mental' },
  { pillar: 'fitness', icon: Dumbbell, label: 'Fitness', to: '/fitness' },
  { pillar: 'nutrition', icon: Salad, label: 'Nutrition', to: '/nutrition' },
  { pillar: 'sleep', icon: Moon, label: 'Sleep', to: '/sleep' },
  { pillar: 'vitals', icon: Activity, label: 'Vitals', to: '/vitals' },
  { pillar: 'wellness', icon: Sparkles, label: 'Wellness', to: '/wellness' },
]

export default function Dashboard() {
  const { user, profile } = useAuth()
  const { todayScore, scoreHistory, loading, calculateScore } = useWellScore()
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)
  const [showNotifs, setShowNotifs] = useState(false)
  const [notifs, setNotifs] = useState([])

  useEffect(() => {
    const alerts = []
    if (todayScore && todayScore.score < 50) {
      alerts.push({ type: 'warning', msg: `Your WellScore is ${todayScore.score} today — check your pillars` })
    }
    if (todayScore?.top_concern) {
      alerts.push({ type: 'info', msg: todayScore.top_concern })
    }
    setNotifs(alerts)
  }, [todayScore])

  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', handler)
    return () => window.removeEventListener('resize', handler)
  }, [])

  const greeting = () => {
    const h = new Date().getHours()
    if (h < 12) return 'Good morning'
    if (h < 17) return 'Good afternoon'
    return 'Good evening'
  }

  const pillarScores = todayScore?.pillar_breakdown || {}

  return (
    <div style={{ display: 'flex' }}>
      {!isMobile && <Sidebar />}

      <main className="main-content" style={{ flex: 1 }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}
        >
          <div>
            <p style={{ fontSize: '0.8rem', color: 'var(--muted)', fontFamily: 'Plus Jakarta Sans', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              {format(new Date(), 'EEEE, d MMMM')}
            </p>
            <h1 style={{ fontSize: '1.6rem', color: '#0F172A' }}>
              {greeting()}, {profile?.name?.split(' ')[0] || 'there'} 👋
            </h1>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', position: 'relative' }}>
            <button
              onClick={() => setShowNotifs(!showNotifs)}
              className="btn btn-ghost"
              style={{ borderRadius: 12, border: '1px solid var(--border)', background: 'white', position: 'relative' }}
            >
              <Bell size={18} color="var(--muted)" />
              {notifs.length > 0 && (
                <div style={{ position: 'absolute', top: 6, right: 6, width: 8, height: 8, background: '#EF4444', borderRadius: '50%' }} />
              )}
            </button>
            {showNotifs && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                style={{
                  position: 'absolute', top: '120%', right: 0, background: 'white',
                  border: '1px solid var(--border)', borderRadius: 16, width: 280,
                  boxShadow: '0 10px 25px rgba(0,0,0,0.05)', zIndex: 50, overflow: 'hidden'
                }}
              >
                <div style={{ padding: '1rem', borderBottom: '1px solid var(--border)', fontFamily: 'Plus Jakarta Sans', fontWeight: 700, fontSize: '0.9rem' }}>
                  Notifications ({notifs.length})
                </div>
                {notifs.length === 0 ? (
                  <div style={{ padding: '1.5rem', textAlign: 'center', color: 'var(--muted)', fontSize: '0.85rem' }}>
                    You're all caught up!
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    {notifs.map((n, i) => (
                      <div key={i} style={{
                        padding: '1rem', borderBottom: i < notifs.length - 1 ? '1px solid var(--border)' : 'none',
                        display: 'flex', gap: '0.75rem', alignItems: 'flex-start'
                      }}>
                        <div style={{ marginTop: 2 }}>
                          {n.type === 'warning' ? <Activity size={16} color="#F97316" /> : <Sparkles size={16} color="#6366F1" />}
                        </div>
                        <div style={{ fontSize: '0.85rem', lineHeight: 1.4, color: '#1E293B' }}>{n.msg}</div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Hero: WellScore + AI Briefing */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : '260px 1fr',
          gap: '1.25rem',
          marginBottom: '1.5rem',
        }}>
          {/* Score ring */}
          <motion.div
            className="card"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}
          >
            <WellScoreRing score={todayScore?.score || 0} size={160} strokeWidth={14} />
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: '0.75rem', color: 'var(--muted)', fontFamily: 'Plus Jakarta Sans', fontWeight: 600 }}>
                {todayScore ? `Updated ${format(new Date(todayScore.calculated_at), 'h:mm a')}` : 'Log data to calculate'}
              </p>
            </div>
          </motion.div>

          {/* AI Briefing */}
          <AIBriefing
            briefing={todayScore?.ai_briefing}
            topWin={todayScore?.top_win}
            topConcern={todayScore?.top_concern}
            onRecalculate={calculateScore}
            loading={loading}
          />
        </div>

        {/* 6 Pillar Cards */}
        <div style={{ marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1rem', color: '#0F172A', marginBottom: '1rem' }}>Today's Pillars</h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)',
            gap: '0.875rem',
          }}>
            {pillars.map(({ pillar, icon, label, to }, i) => (
              <PillarCard
                key={pillar}
                pillar={pillar}
                icon={icon}
                label={label}
                to={to}
                score={pillarScores[pillar] || null}
                index={i}
              />
            ))}
          </div>
        </div>

        {/* Today's Tasks + Streak */}
        <motion.div className="card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          style={{ marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h2 style={{ fontSize: '1rem', color: 'var(--text)' }}>Today's Health Tasks</h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(251,191,36,0.1)', padding: '0.3rem 0.75rem', borderRadius: 99, border: '1px solid rgba(251,191,36,0.3)' }}>
              <span style={{ fontSize: '1rem' }}>🔥</span>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#F59E0B' }}>
                {todayScore ? Math.max(1, Math.floor(todayScore.score / 10)) : 0} day streak
              </span>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: '0.75rem' }}>
            {[
              { label: 'Log your mood', done: !!todayScore?.mood_score, path: '/mental', emoji: '🧠' },
              { label: 'Log a workout', done: !!todayScore?.fitness_score, path: '/fitness', emoji: '💪' },
              { label: 'Log your meals', done: !!todayScore?.nutrition_score, path: '/nutrition', emoji: '🥗' },
              { label: 'Log your sleep', done: !!todayScore?.sleep_score, path: '/sleep', emoji: '🌙' },
              { label: 'Log your vitals', done: !!todayScore?.vitals_score, path: '/vitals', emoji: '❤️' },
              { label: 'Complete a habit', done: !!todayScore?.wellness_score, path: '/wellness', emoji: '✨' },
            ].map((task, i) => (
              <a key={i} href={task.path} style={{ textDecoration: 'none' }}>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.875rem 1rem',
                  background: task.done ? 'rgba(16,185,129,0.08)' : 'var(--bg)',
                  border: `1px solid ${task.done ? '#10B981' : 'var(--border)'}`,
                  borderRadius: 10, cursor: 'pointer', transition: 'all 0.2s'
                }}>
                  <div style={{ width: 22, height: 22, borderRadius: '50%', border: `2px solid ${task.done ? '#10B981' : 'var(--border)'}`, background: task.done ? '#10B981' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '0.7rem', color: 'white' }}>
                    {task.done ? '✓' : ''}
                  </div>
                  <span style={{ fontSize: '0.85rem', fontWeight: 600, color: task.done ? '#10B981' : 'var(--text)', textDecoration: task.done ? 'line-through' : 'none' }}>{task.emoji} {task.label}</span>
                </div>
              </a>
            ))}
          </div>
        </motion.div>

        {/* Weekly Chart */}
        <motion.div
          className="card"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <h2 style={{ fontSize: '1rem' }}>7-Day WellScore Trend</h2>
            <div style={{
              display: 'flex', alignItems: 'center', gap: '0.375rem',
              background: 'rgba(99,102,241,0.1)', borderRadius: 99, padding: '0.25rem 0.75rem',
            }}>
              <Calendar size={12} color="#4F46E5" />
              <span style={{ fontSize: '0.7rem', color: '#4F46E5', fontFamily: 'Plus Jakarta Sans', fontWeight: 700 }}>LAST 7 DAYS</span>
            </div>
          </div>
          <WeeklyChart data={scoreHistory.slice(-7)} />
        </motion.div>
      </main>

      {isMobile && <BottomNav />}
    </div>
  )
}
