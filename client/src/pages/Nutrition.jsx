import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Sidebar from '../components/layout/Sidebar'
import BottomNav from '../components/layout/BottomNav'
import { MealLogger, MacroRings, WaterTracker } from '../components/nutrition/MealLogger'
import api from '../services/api'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'
import { Salad } from 'lucide-react'

export default function Nutrition() {
  const { profile } = useAuth()
  const [logs, setLogs] = useState([])
  const [today, setToday] = useState(null)
  
  const getTodayKey = () => `water_${new Date().toDateString()}`
  const [glasses, setGlasses] = useState(() => {
    const saved = localStorage.getItem(getTodayKey())
    return saved ? parseInt(saved) : 0
  })

  const addGlass = () => {
    const next = Math.min(glasses + 1, 12)
    setGlasses(next)
    localStorage.setItem(getTodayKey(), next)
  }

  const removeGlass = () => {
    const next = Math.max(glasses - 1, 0)
    setGlasses(next)
    localStorage.setItem(getTodayKey(), next)
  }

  const [loading, setLoading] = useState(false)
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)

  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', handler)
    fetchData()
    return () => window.removeEventListener('resize', handler)
  }, [])

  const fetchData = async () => {
    try {
      const [todayRes, logsRes] = await Promise.allSettled([
        api.get('/api/nutrition/today'),
        api.get('/api/nutrition/log?days=7'),
      ])
      if (todayRes.status === 'fulfilled') setToday(todayRes.value.data)
      if (logsRes.status === 'fulfilled') setLogs(logsRes.value.data)
    } catch (err) {
      setLogs([])
    }
  }

  const handleMealLog = async (data) => {
    setLoading(true)
    try {
      await api.post('/api/nutrition/log', data)
      toast.success('Meal logged! 🥗')
      fetchData()
    } catch (err) {
      toast.error('Failed to save meal.')
    } finally {
      setLoading(false)
    }
  }

  const goals = profile?.health_goals || {}

  const mealTypeEmoji = { breakfast: '🌅', lunch: '☀️', dinner: '🌙', snack: '🍎' }

  return (
    <div style={{ display: 'flex' }}>
      {!isMobile && <Sidebar />}
      <main className="main-content" style={{ flex: 1 }}>
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.375rem' }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: '#22C55E20', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Salad size={19} color="#22C55E" />
            </div>
            <h1 style={{ fontSize: '1.5rem' }}>Nutrition</h1>
          </div>
          <p style={{ color: 'var(--muted)', fontSize: '0.9rem', marginLeft: '3rem' }}>
            Log meals by describing them naturally. AI estimates your macros instantly.
          </p>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '1.25rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
              <MealLogger onSubmit={handleMealLog} loading={loading} />
            </motion.div>
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }}>
              <WaterTracker
                glasses={glasses}
                goal={goals.water_glasses || 8}
                onAdd={addGlass}
                onRemove={removeGlass}
              />
            </motion.div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
              <MacroRings today={today} goals={goals} />
            </motion.div>

            <motion.div className="card" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
              <h3 style={{ fontSize: '1rem', marginBottom: '1rem' }}>Today's Meals</h3>
              {logs.length === 0 ? (
                <div className="empty-state" style={{ padding: '2rem' }}>
                  <Salad size={32} color="var(--muted)" />
                  <p>No meals logged today. Log your first meal above!</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                  {logs.filter(l => {
                    const d = new Date(l.logged_at)
                    const today = new Date()
                    return d.toDateString() === today.toDateString()
                  }).map((log, i) => (
                    <div key={i} style={{
                      display: 'flex', alignItems: 'flex-start', gap: '0.875rem',
                      padding: '0.875rem', background: 'var(--bg)', borderRadius: 10,
                    }}>
                      <div style={{ fontSize: '1.5rem' }}>{mealTypeEmoji[log.meal_type] || '🍽'}</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 600, fontSize: '0.85rem', marginBottom: '0.25rem', textTransform: 'capitalize' }}>{log.meal_type}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--muted)', lineHeight: 1.4 }}>{log.meal_description}</div>
                        {log.ai_calories && (
                          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
                            {[
                              { v: log.ai_calories, u: 'kcal', c: '#F97316' },
                              { v: `${log.ai_protein_g}g`, u: 'protein', c: '#22C55E' },
                              { v: `${log.ai_carbs_g}g`, u: 'carbs', c: '#F59E0B' },
                            ].map(({ v, u, c }) => (
                              <span key={u} style={{ fontSize: '0.65rem', fontFamily: 'Space Grotesk', fontWeight: 700, color: c }}>
                                {v} <span style={{ fontWeight: 400, color: 'var(--muted)' }}>{u}</span>
                              </span>
                            ))}
                          </div>
                        )}
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
