import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Sidebar from '../components/layout/Sidebar'
import BottomNav from '../components/layout/BottomNav'
import { WorkoutLogger, StreakCounter, WorkoutPlan } from '../components/fitness/WorkoutLogger'
import api from '../services/api'
import toast from 'react-hot-toast'
import { Dumbbell, RefreshCw } from 'lucide-react'
import EmptyState from '../components/ui/EmptyState'
import { SkeletonList } from '../components/ui/Skeleton'
import { useAuth } from '../context/AuthContext'
import UpgradeModal from '../components/ui/UpgradeModal'

export default function Fitness() {
  const { profile } = useAuth()
  const [isUpgradeOpen, setIsUpgradeOpen] = useState(false)
  const [logs, setLogs] = useState([])
  const [streak, setStreak] = useState(0)
  const [plan, setPlan] = useState(null)
  const [loading, setLoading] = useState(false)
  const [planLoading, setPlanLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)


  async function fetchData() {
    setFetching(true)
    try {
      const [logsRes, streakRes, planRes] = await Promise.allSettled([
        api.get('/api/fitness/log?days=30'),
        api.get('/api/fitness/streak'),
        api.get('/api/fitness/plan'),
      ])
      if (logsRes.status === 'fulfilled') setLogs(logsRes.value.data)
      if (streakRes.status === 'fulfilled') setStreak(streakRes.value.data.streak || 0)
      if (planRes.status === 'fulfilled') setPlan(planRes.value.data)
    } catch (err) {
      setLogs([])
    } finally {
      setFetching(false)
    }
  }

  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', handler)
    fetchData()
    return () => window.removeEventListener('resize', handler)
  }, [])

  const handleWorkoutSubmit = async (data) => {
    setLoading(true)
    try {
      await api.post('/api/fitness/log', data)
      toast.success('Workout logged! Keep crushing it 💪')
      fetchData()
    } catch (err) {
      toast.error('Failed to save workout.')
    } finally {
      setLoading(false)
    }
  }

  const generatePlan = async () => {
    if (profile?.plan !== 'pro') {
      setIsUpgradeOpen(true)
      return
    }
    setPlanLoading(true)
    try {
      const { data } = await api.post('/api/ai/workout-plan')
      setPlan(data)
      toast.success('AI workout plan generated! 🗓️')
    } catch (err) {
      toast.error('Failed to generate plan.')
    } finally {
      setPlanLoading(false)
    }
  }

  const totalMins = logs.reduce((a, l) => a + (l.duration_mins || 0), 0)
  const avgDuration = logs.length ? Math.round(totalMins / logs.length) : 0

  return (
    <div style={{ display: 'flex' }}>
      {!isMobile && <Sidebar />}
      <main className="main-content" style={{ flex: 1 }}>
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.375rem' }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: '#F9731620', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Dumbbell size={19} color="#F97316" />
            </div>
            <h1 style={{ fontSize: '1.5rem' }}>Physical Fitness</h1>
          </div>
          <p style={{ color: 'var(--muted)', fontSize: '0.9rem', marginLeft: '3rem' }}>
            Log workouts, track streaks, and follow your AI-generated training plan.
          </p>
        </motion.div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
          {[
            { label: 'Current Streak', value: `${streak} days`, icon: '🔥', color: '#F97316' },
            { label: 'Total Workouts', value: logs.length, icon: '💪', color: '#6366F1' },
            { label: 'Avg Duration', value: `${avgDuration} min`, icon: '⏱', color: '#22C55E' },
          ].map(stat => (
            <motion.div key={stat.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="card" style={{ textAlign: 'center', padding: '1.25rem' }}>
              <div style={{ fontSize: '1.5rem', marginBottom: '0.375rem' }}>{stat.icon}</div>
              <div style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: '1.3rem', color: stat.color }}>{stat.value}</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--muted)', fontFamily: 'Plus Jakarta Sans', fontWeight: 600 }}>{stat.label}</div>
            </motion.div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '1.25rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
              <WorkoutLogger onSubmit={handleWorkoutSubmit} loading={loading} />
            </motion.div>
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }}>
              <StreakCounter streak={streak} />
            </motion.div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
              <div className="card">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <h3 style={{ fontSize: '1rem' }}>🗓️ AI Workout Plan</h3>
                  <button onClick={generatePlan} disabled={planLoading} className="btn btn-secondary" style={{ fontSize: '0.75rem', padding: '0.375rem 0.875rem' }}>
                    <RefreshCw size={12} /> {planLoading ? 'Generating...' : 'Generate'}
                  </button>
                </div>
                <WorkoutPlan plan={plan} />
              </div>
            </motion.div>

            {/* Recent Logs */}
            <motion.div className="card" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
              <h3 style={{ fontSize: '1rem', marginBottom: '1rem' }}>Recent Workouts</h3>
              {fetching ? (
                <SkeletonList rows={3} />
              ) : logs.length === 0 ? (
                <EmptyState emoji="💪" title="No workouts logged" description="Log your first session!" />
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                  {logs.slice(0, 5).map((log, i) => (
                    <div key={i} style={{
                      display: 'flex', alignItems: 'center', gap: '0.875rem',
                      padding: '0.75rem', background: 'var(--bg)', borderRadius: 10,
                    }}>
                      <div style={{ width: 36, height: 36, borderRadius: 99, background: '#F9731620', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem' }}>
                        💪
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 600, fontSize: '0.875rem' }}>{log.exercise_name}</div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--muted)' }}>{log.duration_mins} min · {log.intensity}</div>
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
      <UpgradeModal isOpen={isUpgradeOpen} onClose={() => setIsUpgradeOpen(false)} featureName="AI Workout Plan Generator" />
    </div>
  )
}
