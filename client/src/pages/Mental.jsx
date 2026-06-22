import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Sidebar from '../components/layout/Sidebar'
import BottomNav from '../components/layout/BottomNav'
import MoodPicker from '../components/mental/MoodPicker'
import MoodHeatmap from '../components/mental/MoodHeatmap'
import CopingToolkit from '../components/mental/CopingToolkit'
import api from '../services/api'
import toast from 'react-hot-toast'
import { Brain } from 'lucide-react'
import EmptyState from '../components/ui/EmptyState'
import { SkeletonList } from '../components/ui/Skeleton'

export default function Mental() {
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)


  const fetchLogs = async () => {
    setFetching(true)
    try {
      const { data } = await api.get('/api/mood/history?days=30')
      setLogs(data)
    } catch (err) {
      // Demo data for UI
      setLogs([])
    } finally {
      setFetching(false)
    }
  }

  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', handler)
    fetchLogs()
    return () => window.removeEventListener('resize', handler)
  }, [])

  const handleMoodSubmit = async (moodData) => {
    setLoading(true)
    try {
      let aiTone = 'neutral'
      if (moodData.journal_note) {
        const { data } = await api.post('/api/ai/mood-tone', { journalNote: moodData.journal_note })
        aiTone = data.tone || 'neutral'
      }
      await api.post('/api/mood', { ...moodData, ai_tone: aiTone })
      toast.success(`Mood logged! AI detected: ${aiTone} 🧠`)
      fetchLogs()
    } catch (err) {
      toast.error('Failed to save mood. Check your connection.')
    } finally {
      setLoading(false)
    }
  }

  // Latest mood stats
  const todayLog = logs[0]
  const avgStress = logs.length ? Math.round(logs.reduce((a, l) => a + l.stress_level, 0) / logs.length) : null

  return (
    <div style={{ display: 'flex' }}>
      {!isMobile && <Sidebar />}
      <main className="main-content" style={{ flex: 1 }}>
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.375rem' }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: '#818CF820', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Brain size={19} color="#818CF8" />
            </div>
            <h1 style={{ fontSize: '1.5rem', color: '#0F172A' }}>Mental Health</h1>
          </div>
          <p style={{ color: 'var(--muted)', fontSize: '0.9rem', marginLeft: '3rem' }}>
            Track your mood, manage stress, and build emotional resilience.
          </p>
        </motion.div>

        {/* Stats row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
          {[
            { label: 'Today\'s Mood', value: todayLog ? `${todayLog.mood}` : '—', icon: '😊', color: '#818CF8' },
            { label: 'Avg Stress', value: avgStress ? `${avgStress}/10` : '—', icon: '🧠', color: '#F97316' },
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
          {/* Left column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
              <MoodPicker onSubmit={handleMoodSubmit} loading={loading} />
            </motion.div>
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
              <CopingToolkit />
            </motion.div>
          </div>

          {/* Right column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
              <MoodHeatmap logs={logs} />
            </motion.div>

            {/* Recent logs */}
            <motion.div className="card" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
              <h3 style={{ fontSize: '1rem', marginBottom: '1rem' }}>Recent Mood Logs</h3>
              {fetching ? (
                <SkeletonList rows={3} />
              ) : logs.length === 0 ? (
                <EmptyState emoji="🧠" title="No mood logs yet" description="Log your first check-in above!" />
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {logs.slice(0, 5).map((log, i) => (
                    <div key={i} style={{
                      display: 'flex', alignItems: 'center', gap: '0.875rem',
                      padding: '0.75rem', background: 'var(--bg)', borderRadius: 10,
                    }}>
                      <div style={{ width: 36, height: 36, borderRadius: 99, background: '#818CF820', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem' }}>
                        {log.mood === 'happy' ? '😊' : log.mood === 'anxious' ? '😰' : log.mood === 'calm' ? '😌' : log.mood === 'sad' ? '😔' : '😐'}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 600, fontSize: '0.875rem', textTransform: 'capitalize' }}>{log.mood}</div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--muted)' }}>Stress: {log.stress_level}/10 · {log.ai_tone && `AI: ${log.ai_tone}`}</div>
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
