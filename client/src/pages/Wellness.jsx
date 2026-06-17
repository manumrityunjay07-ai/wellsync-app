import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Sidebar from '../components/layout/Sidebar'
import BottomNav from '../components/layout/BottomNav'
import api from '../services/api'
import toast from 'react-hot-toast'
import { Sparkles, Plus, Check, X, Trophy, Star, Zap, Droplets, Moon, Flame } from 'lucide-react'
import { useWellScore } from '../context/WellScoreContext'

const BADGE_DEFINITIONS = [
  { id: 'first_log', icon: '🌱', name: 'First Step', desc: 'Logged your first health entry', color: '#22C55E' },
  { id: 'streak_7', icon: '🔥', name: 'Week Warrior', desc: '7-day workout streak', color: '#F97316' },
  { id: 'wellscore_80', icon: '🏆', name: 'WellScore Champion', desc: 'Achieved 80+ WellScore', color: '#F59E0B' },
  { id: 'hydration', icon: '💧', name: 'Hydration Hero', desc: 'Hit water goal 5 days in a row', color: '#0EA5E9' },
  { id: 'sleep_7', icon: '😴', name: '7-Day Sleeper', desc: 'Logged sleep for 7 consecutive days', color: '#6366F1' },
  { id: 'mood_7', icon: '🧠', name: 'Mood Master', desc: 'Logged mood for 7 days straight', color: '#818CF8' },
  { id: 'habits_100', icon: '⭐', name: 'Habit Star', desc: 'Completed all habits for 3 days', color: '#F59E0B' },
  { id: 'vitals_14', icon: '❤️', name: 'Vital Tracker', desc: 'Logged vitals for 14 days', color: '#EF4444' },
]

export default function Wellness() {
  const { todayScore, scoreHistory } = useWellScore()
  const [habits, setHabits] = useState([])
  const [todayLogs, setTodayLogs] = useState([])
  const [weeklyReport, setWeeklyReport] = useState(null)
  const [newHabit, setNewHabit] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)
  const [earnedBadges, setEarnedBadges] = useState([])
  const [crossInsights, setCrossInsights] = useState(null)
  const [insightsLoading, setInsightsLoading] = useState(false)

  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', handler)
    fetchData()
    fetchInsights()
    return () => window.removeEventListener('resize', handler)
  }, [])

  const fetchData = async () => {
    try {
      const [habitsRes, reportRes, badgesRes] = await Promise.allSettled([
        api.get('/api/wellness/habits'),
        api.get('/api/wellness/weekly-report'),
        api.get('/api/wellness/badges'),
      ])
      if (habitsRes.status === 'fulfilled') {
        setHabits(habitsRes.value.data)
        setTodayLogs(habitsRes.value.data.filter(h => h.completed_today))
      }
      if (reportRes.status === 'fulfilled') setWeeklyReport(reportRes.value.data)
      if (badgesRes.status === 'fulfilled') setEarnedBadges(badgesRes.value.data || [])
    } catch (err) {
      setHabits([])
    }
  }

  const fetchInsights = async () => {
    const cached = localStorage.getItem('cross_insights_date')
    const cachedData = localStorage.getItem('cross_insights_data')
    if (cached === new Date().toDateString() && cachedData) {
      setCrossInsights(JSON.parse(cachedData))
      return
    }
    try {
      setInsightsLoading(true)
      const { data } = await api.post('/api/ai/cross-insights')
      setCrossInsights(data)
      localStorage.setItem('cross_insights_date', new Date().toDateString())
      localStorage.setItem('cross_insights_data', JSON.stringify(data))
    } catch (err) {
      console.error('Insights failed:', err)
    } finally {
      setInsightsLoading(false)
    }
  }

  const addHabit = async () => {
    if (!newHabit.trim()) return
    try {
      await api.post('/api/wellness/habits', { habit_name: newHabit, target_per_week: 7 })
      toast.success('Habit added! 🌟')
      setNewHabit('')
      setShowForm(false)
      fetchData()
    } catch (err) {
      toast.error('Failed to add habit.')
    }
  }

  const toggleHabit = async (habit) => {
    try {
      if (habit.completed_today) {
        await api.delete(`/api/wellness/habit-log/${habit.id}`)
      } else {
        await api.post('/api/wellness/habit-log', { habit_id: habit.id })
      }
      setHabits(prev => prev.map(h => h.id === habit.id ? { ...h, completed_today: !h.completed_today } : h))
    } catch (err) {
      toast.error('Failed to update habit.')
    }
  }

  const completedCount = habits.filter(h => h.completed_today).length
  const completionRate = habits.length ? Math.round((completedCount / habits.length) * 100) : 0

  return (
    <div style={{ display: 'flex' }}>
      {!isMobile && <Sidebar />}
      <main className="main-content" style={{ flex: 1 }}>
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.375rem' }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: '#F59E0B20', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Sparkles size={19} color="#F59E0B" />
            </div>
            <h1 style={{ fontSize: '1.5rem' }}>Wellness & Habits</h1>
          </div>
          <p style={{ color: 'var(--muted)', fontSize: '0.9rem', marginLeft: '3rem' }}>
            Build lasting habits, earn badges, and track your overall wellbeing.
          </p>
        </motion.div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
          {[
            { label: 'Today\'s Score', value: todayScore?.score || '—', icon: '⭐', color: '#F59E0B' },
            { label: 'Habits Done', value: `${completedCount}/${habits.length}`, icon: '✅', color: '#22C55E' },
            { label: 'Badges Earned', value: earnedBadges.length, icon: '🏆', color: '#F97316' },
          ].map(stat => (
            <motion.div key={stat.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="card" style={{ textAlign: 'center', padding: '1.25rem' }}>
              <div style={{ fontSize: '1.5rem', marginBottom: '0.375rem' }}>{stat.icon}</div>
              <div style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: '1.3rem', color: stat.color }}>{stat.value}</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--muted)', fontFamily: 'Plus Jakarta Sans', fontWeight: 600 }}>{stat.label}</div>
            </motion.div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '1.25rem' }}>
          <div>
            {/* Habit Tracker */}
            <motion.div className="card" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1rem' }}>Today's Habits</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontFamily: 'Space Grotesk', fontWeight: 700, color: '#F59E0B', fontSize: '0.9rem' }}>
                  {completionRate}%
                </span>
                <button onClick={() => setShowForm(!showForm)} className="btn btn-secondary" style={{ fontSize: '0.75rem', padding: '0.375rem 0.75rem' }}>
                  <Plus size={12} /> New
                </button>
              </div>
            </div>

            {/* Progress bar */}
            <div style={{ height: 6, background: 'var(--bg)', borderRadius: 99, marginBottom: '1.25rem' }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${completionRate}%` }}
                style={{ height: '100%', background: 'linear-gradient(90deg, #F59E0B, #F97316)', borderRadius: 99 }}
              />
            </div>

            {showForm && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                style={{ background: 'var(--bg)', borderRadius: 12, padding: '0.875rem', marginBottom: '1rem' }}
              >
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <input
                    className="input"
                    placeholder="e.g. Meditate 10 mins"
                    value={newHabit}
                    onChange={e => setNewHabit(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && addHabit()}
                    style={{ flex: 1 }}
                  />
                  <button className="btn btn-primary" style={{ padding: '0.75rem' }} onClick={addHabit}>
                    <Check size={16} />
                  </button>
                  <button className="btn btn-secondary" style={{ padding: '0.75rem' }} onClick={() => setShowForm(false)}>
                    <X size={16} />
                  </button>
                </div>
              </motion.div>
            )}

            {habits.length === 0 ? (
              <div className="empty-state" style={{ padding: '2rem' }}>
                <Sparkles size={28} color="var(--muted)" />
                <p>No habits yet! Add your first habit above.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                {habits.map((habit, i) => (
                  <motion.button
                    key={habit.id || i}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => toggleHabit(habit)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '0.875rem',
                      padding: '0.875rem', borderRadius: 12,
                      border: `1.5px solid ${habit.completed_today ? '#F59E0B40' : 'var(--border)'}`,
                      background: habit.completed_today ? '#FEF3C7' : 'var(--bg)',
                      cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s',
                    }}
                  >
                    <div style={{
                      width: 24, height: 24, borderRadius: 7, flexShrink: 0,
                      border: `2px solid ${habit.completed_today ? '#F59E0B' : 'var(--border)'}`,
                      background: habit.completed_today ? '#F59E0B' : 'transparent',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      transition: 'all 0.2s',
                    }}>
                      {habit.completed_today && <Check size={13} color="white" />}
                    </div>
                    <span style={{
                      fontFamily: 'Plus Jakarta Sans', fontWeight: 600, fontSize: '0.875rem',
                      color: habit.completed_today ? '#92400E' : '#0F172A',
                      textDecoration: habit.completed_today ? 'line-through' : 'none',
                      opacity: habit.completed_today ? 0.8 : 1,
                    }}>
                      {habit.habit_name}
                    </span>
                    {habit.completed_today && <span style={{ marginLeft: 'auto', fontSize: '0.7rem', color: '#F59E0B', fontWeight: 700 }}>✓ Done!</span>}
                  </motion.button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Cross Insights */}
          {(crossInsights || insightsLoading) && (
            <motion.div className="card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} style={{ marginTop: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                <Sparkles size={18} color="#6366F1" />
                <h3 style={{ fontSize: '1rem' }}>AI Cross-Pillar Insights</h3>
              </div>
              {insightsLoading ? (
                <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--muted)' }}>
                  <div style={{ margin: '0 auto 1rem', width: 24, height: 24, border: '3px solid #E2E8F0', borderTopColor: '#6366F1', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                  Analysing your 7-day data across all pillars...
                </div>
              ) : crossInsights?.insights ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {crossInsights.insights.map((insight, i) => (
                    <div key={i} style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 12, padding: '1rem' }}>
                      <div style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.375rem', color: '#1E293B' }}>{insight.title}</div>
                      <p style={{ fontSize: '0.85rem', color: '#475569', lineHeight: 1.5, marginBottom: '0.75rem' }}>{insight.detail}</p>
                      <div style={{ background: '#EEF2FF', borderRadius: 8, padding: '0.625rem', fontSize: '0.8rem', color: '#3730A3', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.375rem', marginBottom: '0.75rem' }}>
                        <Zap size={14} /> {insight.action}
                      </div>
                      <div style={{ display: 'flex', gap: '0.375rem', flexWrap: 'wrap' }}>
                        {insight.pillars_involved?.map(p => {
                          const colors = { mental: '#818CF8', fitness: '#F97316', nutrition: '#22C55E', sleep: '#6366F1', vitals: '#EF4444', wellness: '#F59E0B' }
                          return (
                            <span key={p} style={{ fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', padding: '0.15rem 0.5rem', borderRadius: 99, background: `${colors[p] || '#94A3B8'}20`, color: colors[p] || '#94A3B8' }}>
                              {p}
                            </span>
                          )
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              ) : null}
            </motion.div>
          )}

          </div>

          {/* Right column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* Badges */}
            <motion.div className="card" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
              <h3 style={{ fontSize: '1rem', marginBottom: '1.25rem' }}>🏆 Achievements</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem' }}>
                {BADGE_DEFINITIONS.map(badge => {
                  const earned = earnedBadges.includes(badge.id)
                  return (
                    <div key={badge.id} style={{
                      padding: '0.875rem', borderRadius: 12, textAlign: 'center',
                      background: earned ? `${badge.color}15` : 'var(--bg)',
                      border: `1.5px solid ${earned ? `${badge.color}40` : 'var(--border)'}`,
                      opacity: earned ? 1 : 0.5,
                      transition: 'all 0.2s',
                    }}>
                      <div style={{ fontSize: earned ? '1.75rem' : '1.5rem', marginBottom: '0.25rem', filter: earned ? 'none' : 'grayscale(1)' }}>
                        {badge.icon}
                      </div>
                      <div style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 700, fontSize: '0.75rem', color: earned ? badge.color : 'var(--muted)' }}>
                        {badge.name}
                      </div>
                      <div style={{ fontSize: '0.6rem', color: 'var(--muted)', marginTop: '0.125rem' }}>{badge.desc}</div>
                    </div>
                  )
                })}
              </div>
            </motion.div>

            {/* Weekly Report */}
            {weeklyReport && (
              <motion.div className="card" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
                <h3 style={{ fontSize: '1rem', marginBottom: '1rem' }}>📋 Weekly Wellness Report</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <div style={{ background: '#D1FAE5', borderRadius: 10, padding: '0.875rem', borderLeft: '3px solid #10B981' }}>
                    <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#065F46', marginBottom: '0.25rem' }}>✅ WHAT WENT WELL</div>
                    <p style={{ fontSize: '0.825rem', color: '#065F46', lineHeight: 1.5 }}>{weeklyReport.went_well}</p>
                  </div>
                  <div style={{ background: '#FEF3C7', borderRadius: 10, padding: '0.875rem', borderLeft: '3px solid #F59E0B' }}>
                    <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#92400E', marginBottom: '0.25rem' }}>⚠️ AREAS TO IMPROVE</div>
                    <p style={{ fontSize: '0.825rem', color: '#92400E', lineHeight: 1.5 }}>{weeklyReport.to_improve}</p>
                  </div>
                  <div style={{ background: '#EEF2FF', borderRadius: 10, padding: '0.875rem', borderLeft: '3px solid #6366F1' }}>
                    <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#3730A3', marginBottom: '0.5rem' }}>💡 TOP 3 RECOMMENDATIONS</div>
                    <ol style={{ paddingLeft: '1rem', margin: 0 }}>
                      {weeklyReport.recommendations?.map((r, i) => (
                        <li key={i} style={{ fontSize: '0.8rem', color: '#3730A3', marginBottom: '0.25rem' }}>{r}</li>
                      ))}
                    </ol>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </main>
      {isMobile && <BottomNav />}
    </div>
  )
}
