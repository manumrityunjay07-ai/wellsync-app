import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Sidebar from '../components/layout/Sidebar'
import BottomNav from '../components/layout/BottomNav'
import api from '../services/api'
import toast from 'react-hot-toast'
import { Moon, Clock, Star, BedDouble, AlertCircle } from 'lucide-react'
import { format, differenceInHours, differenceInMinutes } from 'date-fns'

function RecoveryBadge({ score }) {
  const config = {
    green: { label: 'Ready to Push 🟢', bg: '#D1FAE5', text: '#065F46', border: '#10B981' },
    yellow: { label: 'Moderate 🟡', bg: '#FEF3C7', text: '#92400E', border: '#F59E0B' },
    red: { label: 'Rest Day 🔴', bg: '#FEE2E2', text: '#991B1B', border: '#EF4444' },
  }
  const c = config[score] || config.yellow
  return (
    <div style={{
      padding: '0.75rem 1.25rem', borderRadius: 12,
      background: c.bg, color: c.text, border: `1.5px solid ${c.border}`,
      fontFamily: 'Plus Jakarta Sans', fontWeight: 700, fontSize: '0.9rem', textAlign: 'center',
    }}>
      Recovery: {c.label}
    </div>
  )
}

export default function Sleep() {
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(false)
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)
  const [bedtime, setBedtime] = useState('23:00')
  const [wakeTime, setWakeTime] = useState('07:00')
  const [quality, setQuality] = useState(3)
  const [restedness, setRestedness] = useState(3)

  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', handler)
    fetchLogs()
    return () => window.removeEventListener('resize', handler)
  }, [])

  const fetchLogs = async () => {
    try {
      const { data } = await api.get('/api/sleep/log?days=14')
      setLogs(data)
    } catch (err) {
      setLogs([])
    }
  }

  const calcDuration = () => {
    const today = new Date()
    const bed = new Date(`${format(today, 'yyyy-MM-dd')}T${bedtime}`)
    const wake = new Date(`${format(today, 'yyyy-MM-dd')}T${wakeTime}`)
    if (wake <= bed) wake.setDate(wake.getDate() + 1)
    const mins = differenceInMinutes(wake, bed)
    return (mins / 60).toFixed(1)
  }

  const handleSubmit = async () => {
    setLoading(true)
    try {
      const duration = calcDuration()
      const today = format(new Date(), 'yyyy-MM-dd')
      await api.post('/api/sleep/log', {
        bedtime: `${today}T${bedtime}:00`,
        wake_time: `${today}T${wakeTime}:00`,
        duration_hrs: parseFloat(duration),
        quality_rating: quality,
        restedness_rating: restedness,
      })
      toast.success(`Sleep logged! ${duration} hours — quality: ${quality}⭐`)
      fetchLogs()
    } catch (err) {
      toast.error('Failed to save sleep log.')
    } finally {
      setLoading(false)
    }
  }

  const getRecovery = (log) => {
    if (!log) return 'yellow'
    if (log.duration_hrs >= 7.5 && log.quality_rating >= 4) return 'green'
    if (log.duration_hrs >= 6 && log.quality_rating >= 3) return 'yellow'
    return 'red'
  }

  const avgSleep = logs.length ? (logs.reduce((a, l) => a + l.duration_hrs, 0) / logs.length).toFixed(1) : 0
  
  const weekMs = 7 * 24 * 60 * 60 * 1000
  const thisWeek = logs.filter(l => new Date(l.logged_at) > new Date(Date.now() - weekMs))
  const totalSlept = thisWeek.reduce((a, l) => a + (l.duration_hrs || 0), 0)
  const target = 49 // 7 hours × 7 days
  const sleepDebt = Math.max(0, target - totalSlept).toFixed(1)

  const todayLog = logs[0]
  const duration = calcDuration()

  return (
    <div style={{ display: 'flex' }}>
      {!isMobile && <Sidebar />}
      <main className="main-content" style={{ flex: 1 }}>
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.375rem' }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: '#6366F120', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Moon size={19} color="#6366F1" />
            </div>
            <h1 style={{ fontSize: '1.5rem' }}>Sleep & Recovery</h1>
          </div>
          <p style={{ color: 'var(--muted)', fontSize: '0.9rem', marginLeft: '3rem' }}>
            Log your sleep, track debt, and get your daily recovery score.
          </p>
        </motion.div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
          {[
            { label: 'Avg Sleep', value: `${avgSleep}h`, icon: '🌙', color: '#6366F1' },
            { label: 'Sleep Debt', value: `${sleepDebt}h`, icon: '💤', color: parseFloat(sleepDebt) > 2 ? '#EF4444' : '#10B981' },
            { label: 'Days Tracked', value: logs.length, icon: '📅', color: '#22C55E' },
          ].map(stat => (
            <motion.div key={stat.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="card" style={{ textAlign: 'center', padding: '1.25rem' }}>
              <div style={{ fontSize: '1.5rem', marginBottom: '0.375rem' }}>{stat.icon}</div>
              <div style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: '1.3rem', color: stat.color }}>{stat.value}</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--muted)', fontFamily: 'Plus Jakarta Sans', fontWeight: 600 }}>{stat.label}</div>
            </motion.div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '1.25rem' }}>
          {/* Sleep Logger */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
            <div className="card">
              <h3 style={{ fontSize: '1rem', marginBottom: '1.25rem' }}>🌙 Log Last Night's Sleep</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--muted)', display: 'block', marginBottom: '0.375rem' }}>
                    🛏 Bedtime
                  </label>
                  <input type="time" className="input" value={bedtime} onChange={e => setBedtime(e.target.value)} />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--muted)', display: 'block', marginBottom: '0.375rem' }}>
                    ☀️ Wake Time
                  </label>
                  <input type="time" className="input" value={wakeTime} onChange={e => setWakeTime(e.target.value)} />
                </div>
              </div>

              <div style={{
                background: '#EEF2FF', borderRadius: 12, padding: '1rem',
                textAlign: 'center', marginBottom: '1.25rem',
              }}>
                <div style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: '2rem', color: '#4F46E5' }}>{duration}h</div>
                <div style={{ fontSize: '0.75rem', color: '#6366F1' }}>sleep duration</div>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--muted)', display: 'block', marginBottom: '0.5rem' }}>
                  Sleep Quality: {'⭐'.repeat(quality)}
                </label>
                <input type="range" min={1} max={5} value={quality} onChange={e => setQuality(parseInt(e.target.value))} style={{ width: '100%', accentColor: '#6366F1' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.65rem', color: 'var(--muted)' }}>
                  <span>Very poor</span><span>Excellent</span>
                </div>
              </div>

              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--muted)', display: 'block', marginBottom: '0.5rem' }}>
                  How Rested Do You Feel: {'⭐'.repeat(restedness)}
                </label>
                <input type="range" min={1} max={5} value={restedness} onChange={e => setRestedness(parseInt(e.target.value))} style={{ width: '100%', accentColor: '#818CF8' }} />
              </div>

              <button
                className="btn btn-primary"
                style={{ width: '100%', background: 'linear-gradient(135deg, #6366F1, #4F46E5)' }}
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? 'Saving...' : 'Log Sleep 🌙'}
              </button>
            </div>
          </motion.div>

          {/* Recovery + History */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* Sleep Debt Progress Card */}
            <motion.div className="card" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <AlertCircle size={18} color={sleepDebt > 5 ? '#EF4444' : sleepDebt > 0 ? '#F59E0B' : '#10B981'} />
                  <h3 style={{ fontSize: '1rem' }}>Weekly Sleep Debt</h3>
                </div>
                <div style={{ fontFamily: 'Space Grotesk', fontWeight: 700, color: sleepDebt > 0 ? '#EF4444' : '#10B981' }}>
                  {sleepDebt}h debt
                </div>
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--muted)', marginBottom: '1rem' }}>
                {totalSlept.toFixed(1)} / {target} hrs slept this week
              </div>
              <div style={{ height: 8, background: 'var(--bg)', borderRadius: 99, marginBottom: '0.75rem', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${Math.min(100, (totalSlept / target) * 100)}%`, background: sleepDebt > 5 ? '#EF4444' : sleepDebt > 0 ? '#F59E0B' : '#10B981', borderRadius: 99 }} />
              </div>
              <div style={{ fontSize: '0.75rem', fontWeight: 600, color: sleepDebt > 5 ? '#EF4444' : sleepDebt > 0 ? '#D97706' : '#059669', background: sleepDebt > 5 ? '#FEE2E2' : sleepDebt > 0 ? '#FEF3C7' : '#D1FAE5', padding: '0.5rem', borderRadius: 8, textAlign: 'center' }}>
                {sleepDebt > 5 ? "Significant sleep debt — prioritise rest" : sleepDebt > 0 ? "Slight deficit — aim for earlier bedtimes" : "Sleep target met this week! 🎉"}
              </div>
            </motion.div>
            {todayLog && (
              <motion.div className="card" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
                <h3 style={{ fontSize: '1rem', marginBottom: '0.875rem' }}>Today's Recovery</h3>
                <RecoveryBadge score={getRecovery(todayLog)} />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginTop: '0.875rem' }}>
                  <div style={{ background: 'var(--bg)', padding: '0.875rem', borderRadius: 10, textAlign: 'center' }}>
                    <div style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: '1.4rem', color: '#6366F1' }}>{todayLog.duration_hrs}h</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--muted)' }}>Last night</div>
                  </div>
                  <div style={{ background: 'var(--bg)', padding: '0.875rem', borderRadius: 10, textAlign: 'center' }}>
                    <div style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: '1.4rem', color: '#818CF8' }}>{'⭐'.repeat(todayLog.quality_rating)}</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--muted)' }}>Quality</div>
                  </div>
                </div>
              </motion.div>
            )}

            <motion.div className="card" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
              <h3 style={{ fontSize: '1rem', marginBottom: '1rem' }}>Sleep History</h3>
              {logs.length === 0 ? (
                <div className="empty-state" style={{ padding: '2rem' }}>
                  <Moon size={32} color="var(--muted)" />
                  <p>No sleep logs yet. Log your first night!</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {logs.slice(0, 7).map((log, i) => (
                    <div key={i} style={{
                      display: 'flex', alignItems: 'center', gap: '0.875rem',
                      padding: '0.75rem', background: 'var(--bg)', borderRadius: 10,
                    }}>
                      <div style={{ width: 8, height: 8, borderRadius: 99, background: log.duration_hrs >= 7 ? '#10B981' : log.duration_hrs >= 6 ? '#F59E0B' : '#EF4444', flexShrink: 0 }} />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontFamily: 'Space Grotesk', fontWeight: 600, fontSize: '0.9rem', color: '#6366F1' }}>{log.duration_hrs}h</div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--muted)' }}>Quality: {'⭐'.repeat(log.quality_rating)}</div>
                      </div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--muted)' }}>
                        {new Date(log.logged_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </main>
      {isMobile && <BottomNav />}
    </div>
  )
}
