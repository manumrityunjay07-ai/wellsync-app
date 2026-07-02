import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Sidebar from '../components/layout/Sidebar'
import BottomNav from '../components/layout/BottomNav'
import { useAuth } from '../context/AuthContext'
import { exportToCSV } from '../utils/reportGenerator'
import api from '../services/api'
import toast from 'react-hot-toast'
import {
  User, Target, Shield, Download, LogOut, Edit3, Save,
  Brain, Dumbbell, Salad, Moon, Activity, Sparkles, TrendingUp, Users, Flame, Award
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useWellScore } from '../context/WellScoreContext'

const InfoRow = ({ label, value }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 0', borderBottom: '1px solid var(--border)' }}>
    <span style={{ fontSize: '0.85rem', color: 'var(--muted)', fontWeight: 600 }}>{label}</span>
    <span style={{ fontSize: '0.875rem', color: 'var(--text)', fontWeight: 500 }}>{value || '—'}</span>
  </div>
)

const pillarConfig = [
  { key: 'mental', icon: Brain, color: '#818CF8' },
  { key: 'fitness', icon: Dumbbell, color: '#F97316' },
  { key: 'nutrition', icon: Salad, color: '#22C55E' },
  { key: 'sleep', icon: Moon, color: '#6366F1' },
  { key: 'vitals', icon: Activity, color: '#EF4444' },
  { key: 'wellness', icon: Sparkles, color: '#F59E0B' },
]

const BADGE_CONFIG = [
  { id: 'first_log', title: 'First Step', emoji: '🏆', desc: 'Log your first health data.' },
  { id: 'streak_7', title: '7-Day Warrior', emoji: '🔥', desc: 'Log workouts for 7 days.' },
  { id: 'wellscore_80', title: 'Optimal Health', emoji: '⭐', desc: 'Achieve a WellScore of 80+.' },
  { id: 'sleep_7', title: 'Deep Sleeper', emoji: '🌙', desc: 'Log sleep for 7 days.' },
  { id: 'mood_7', title: 'Zen Master', emoji: '🧘', desc: 'Log mood for 7 days.' },
  { id: 'vitals_14', title: 'Biometric Pro', emoji: '❤️', desc: 'Log vitals for 14 days.' },
]

export default function Profile() {
  const { profile, updateProfile, signOut, toggleRole } = useAuth()
  const { todayScore, scoreHistory } = useWellScore()
  const navigate = useNavigate()
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({
    name: profile?.name || '',
    age: profile?.age || '',
    gender: profile?.gender || '',
  })
  const [loading, setLoading] = useState(false)
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)
  const [streaks, setStreaks] = useState(null)
  const [badges, setBadges] = useState([])

  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', handler)
    
    // Fetch gamification data
    Promise.all([
      api.get('/api/wellness/streaks'),
      api.get('/api/wellness/badges')
    ]).then(([streakRes, badgeRes]) => {
      setStreaks(streakRes.data)
      setBadges(badgeRes.data)
    }).catch(err => console.error('Failed to load gamification data', err))

    return () => window.removeEventListener('resize', handler)
  }, [])

  const handleSave = async () => {
    setLoading(true)
    try {
      const payload = { ...form, age: form.age ? parseInt(form.age) : null }
      await updateProfile(payload)
      toast.success('Profile updated!')
      setEditing(false)
    } catch {
      toast.error('Failed to update profile.')
    } finally {
      setLoading(false)
    }
  }

  const handleExport = async () => {
    try {
      const { data } = await api.get('/api/wellness/export')
      exportToCSV(data, 'WellSync_HealthData')
      toast.success('Health data exported as CSV!')
    } catch {
      toast.error('Export failed. Try again.')
    }
  }

  const handleSignOut = async () => {
    await signOut()
    navigate('/auth')
  }

  // Stats derived from score history
  const totalLogs = scoreHistory.length
  const avgScore = totalLogs
    ? Math.round(scoreHistory.reduce((a, s) => a + (s.score || 0), 0) / totalLogs)
    : 0
  const bestScore = totalLogs ? Math.max(...scoreHistory.map(s => s.score || 0)) : 0
  const pillarScores = todayScore?.pillar_breakdown || {}

  return (
    <div style={{ display: 'flex' }}>
      {!isMobile && <Sidebar />}
      <main className="main-content" style={{ flex: 1, maxWidth: 760 }}>
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.375rem' }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(129,140,248,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <User size={19} color="#818CF8" />
            </div>
            <h1 style={{ fontSize: '1.5rem' }}>Profile & Settings</h1>
          </div>
          <p style={{ color: 'var(--muted)', fontSize: '0.9rem', marginLeft: '3rem' }}>
            Manage your health profile, goals, and account settings.
          </p>
        </motion.div>

        {/* Avatar + Hero */}
        <motion.div
          className="card"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            marginBottom: '1.25rem',
            background: 'linear-gradient(135deg, #4F46E5 0%, #818CF8 100%)',
            border: 'none', color: 'white', position: 'relative', overflow: 'hidden',
          }}
        >
          <div style={{ position: 'absolute', top: -30, right: -30, width: 150, height: 150, borderRadius: '50%', background: 'rgba(255,255,255,0.07)' }} />
          <div style={{ position: 'absolute', bottom: -40, left: 80, width: 100, height: 100, borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />

          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', position: 'relative', zIndex: 1 }}>
            <div style={{
              width: 72, height: 72, borderRadius: '50%', flexShrink: 0,
              background: 'rgba(255,255,255,0.2)',
              border: '3px solid rgba(255,255,255,0.4)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: 'Plus Jakarta Sans', fontWeight: 800, fontSize: '1.8rem', color: 'white',
            }}>
              {profile?.name?.[0]?.toUpperCase() || '?'}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 800, fontSize: '1.3rem', color: 'white' }}>
                {profile?.name || 'Complete your profile'}
              </div>
              <div style={{ opacity: 0.8, fontSize: '0.875rem', marginTop: '0.125rem' }}>{profile?.email || ''}</div>
              {profile?.age && profile?.gender && (
                <div style={{ fontSize: '0.75rem', opacity: 0.7, marginTop: '0.25rem' }}>
                  {profile.age} years · {profile.gender}
                </div>
              )}
            </div>
            <button
              onClick={() => editing ? handleSave() : setEditing(true)}
              disabled={loading}
              style={{
                background: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.3)',
                borderRadius: 10, padding: '0.5rem 1rem', color: 'white',
                fontFamily: 'Plus Jakarta Sans', fontWeight: 600, fontSize: '0.8rem',
                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.375rem',
              }}
            >
              {editing ? <><Save size={14} /> Save</> : <><Edit3 size={14} /> Edit Profile</>}
            </button>
          </div>

          {/* Mini stats */}
          <div style={{ display: 'flex', gap: '1.5rem', marginTop: '1.25rem', paddingTop: '1.25rem', borderTop: '1px solid rgba(255,255,255,0.15)', position: 'relative', zIndex: 1 }}>
            {[
              { label: 'Avg Score', value: avgScore || '—' },
              { label: 'Best Score', value: bestScore || '—' },
              { label: 'Days Tracked', value: totalLogs },
              { label: "Today's Score", value: todayScore?.score || '—' },
            ].map(s => (
              <div key={s.label} style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: 'Space Grotesk', fontWeight: 800, fontSize: '1.4rem', color: 'white', lineHeight: 1 }}>{s.value}</div>
                <div style={{ fontSize: '0.65rem', opacity: 0.75, fontFamily: 'Plus Jakarta Sans', fontWeight: 600, marginTop: '0.125rem' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Today's Pillar Mini-Scores */}
        {todayScore && (
          <motion.div className="card" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} style={{ marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <TrendingUp size={17} color="#818CF8" />
                <h3 style={{ fontSize: '1rem' }}>Today's Pillar Breakdown</h3>
              </div>
              <button onClick={() => navigate('/progress')} style={{ background: 'none', border: 'none', fontSize: '0.8rem', color: '#818CF8', fontFamily: 'Plus Jakarta Sans', fontWeight: 700, cursor: 'pointer' }}>
                View Full Analytics →
              </button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
              {pillarConfig.map(({ key, icon: Icon, color }) => {
                const score = pillarScores[key] || 0
                return (
                  <div key={key} style={{ background: 'var(--bg)', borderRadius: 10, padding: '0.875rem', textAlign: 'center' }}>
                    <div style={{ width: 32, height: 32, borderRadius: 8, background: `${color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.5rem' }}>
                      <Icon size={16} color={color} />
                    </div>
                    <div style={{ fontFamily: 'Space Grotesk', fontWeight: 800, fontSize: '1.1rem', color: score > 0 ? color : 'var(--muted)' }}>{score || '—'}</div>
                    <div style={{ fontSize: '0.6rem', color: 'var(--muted)', fontFamily: 'Plus Jakarta Sans', fontWeight: 700, textTransform: 'capitalize' }}>{key}</div>
                  </div>
                )
              })}
            </div>
          </motion.div>
        )}

        {/* Streaks */}
        {streaks && (
          <motion.div className="card" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }} style={{ marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '1rem' }}>
              <Flame size={17} color="#EF4444" />
              <h3 style={{ fontSize: '1rem' }}>Active Streaks</h3>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
              {pillarConfig.map(({ key, color }) => {
                const count = streaks[key] || 0
                return (
                  <div key={key} style={{ background: count > 0 ? `${color}15` : 'var(--bg)', borderRadius: 10, padding: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', border: `1px solid ${count > 0 ? color + '40' : 'transparent'}` }}>
                    <div style={{ fontSize: '0.75rem', fontFamily: 'Plus Jakarta Sans', fontWeight: 600, textTransform: 'capitalize', color: count > 0 ? 'var(--text)' : 'var(--muted)' }}>{key}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <span style={{ fontFamily: 'Space Grotesk', fontWeight: 800, fontSize: '1rem', color: count > 0 ? color : 'var(--muted)' }}>{count}</span>
                      {count > 0 && <span style={{ fontSize: '0.8rem' }}>🔥</span>}
                    </div>
                  </div>
                )
              })}
            </div>
          </motion.div>
        )}

        {/* Achievements */}
        <motion.div className="card" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.09 }} style={{ marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '1rem' }}>
            <Award size={17} color="#F59E0B" />
            <h3 style={{ fontSize: '1rem' }}>Achievements</h3>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '0.75rem' }}>
            {BADGE_CONFIG.map(badge => {
              const earned = badges.includes(badge.id)
              return (
                <div key={badge.id} style={{ 
                  display: 'flex', alignItems: 'center', gap: '0.875rem', 
                  background: 'var(--bg)', padding: '0.875rem', borderRadius: 10,
                  opacity: earned ? 1 : 0.5, filter: earned ? 'none' : 'grayscale(100%)'
                }}>
                  <div style={{ fontSize: '1.5rem', background: 'var(--surface)', width: 40, height: 40, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {badge.emoji}
                  </div>
                  <div>
                    <div style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 700, fontSize: '0.85rem', color: 'var(--text)' }}>{badge.title}</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--muted)' }}>{badge.desc}</div>
                  </div>
                </div>
              )
            })}
          </div>
        </motion.div>

        {/* Personal Info */}
        <motion.div className="card" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} style={{ marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '1rem' }}>
            <User size={17} color="#818CF8" />
            <h3 style={{ fontSize: '1rem' }}>Personal Information</h3>
          </div>
          {editing ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--muted)', display: 'block', marginBottom: '0.375rem' }}>Name</label>
                <input className="input" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Your full name" />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.875rem' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--muted)', display: 'block', marginBottom: '0.375rem' }}>Age</label>
                  <input className="input" type="number" value={form.age} onChange={e => setForm({ ...form, age: e.target.value })} placeholder="25" />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--muted)', display: 'block', marginBottom: '0.375rem' }}>Gender</label>
                  <select className="input" value={form.gender} onChange={e => setForm({ ...form, gender: e.target.value })}>
                    <option value="">Select</option>
                    <option>Male</option>
                    <option>Female</option>
                    <option>Non-binary</option>
                    <option>Prefer not to say</option>
                  </select>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button className="btn btn-primary" style={{ flex: 1 }} onClick={handleSave} disabled={loading}>
                  <Save size={14} /> {loading ? 'Saving...' : 'Save Changes'}
                </button>
                <button className="btn btn-secondary" onClick={() => setEditing(false)}>Cancel</button>
              </div>
            </div>
          ) : (
            <>
              <InfoRow label="Name" value={profile?.name} />
              <InfoRow label="Age" value={profile?.age ? `${profile.age} years` : null} />
              <InfoRow label="Gender" value={profile?.gender} />
              <InfoRow label="Health Condition" value={profile?.condition_profile?.condition} />
            </>
          )}
        </motion.div>

        {/* Health Goals */}
        <motion.div className="card" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} style={{ marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
              <Target size={17} color="#22C55E" />
              <h3 style={{ fontSize: '1rem' }}>Health Goals</h3>
            </div>
            <button className="btn btn-secondary" style={{ fontSize: '0.78rem', padding: '0.4rem 0.875rem' }} onClick={() => navigate('/onboarding')}>
              Update Goals
            </button>
          </div>
          <InfoRow label="Fitness Goal" value={profile?.health_goals?.fitness} />
          <InfoRow label="Calorie Target" value={profile?.health_goals?.calorie_target ? `${profile.health_goals.calorie_target} kcal/day` : null} />
          <InfoRow label="Protein Target" value={profile?.health_goals?.protein_target ? `${profile.health_goals.protein_target}g/day` : null} />
          <InfoRow label="Water Goal" value={profile?.health_goals?.water_glasses ? `${profile.health_goals.water_glasses} glasses/day` : null} />
          <InfoRow label="Sleep Target" value={profile?.health_goals?.sleep_target ? `${profile.health_goals.sleep_target} hrs/night` : null} />
        </motion.div>

        {/* Data & Account */}
        <motion.div className="card" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '1.25rem' }}>
            <Shield size={17} color="#F59E0B" />
            <h3 style={{ fontSize: '1rem' }}>Data & Account</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <button
              className="btn btn-secondary"
              style={{ width: '100%', justifyContent: 'flex-start', gap: '0.75rem' }}
              onClick={handleExport}
            >
              <Download size={16} color="#22C55E" />
              Export All Health Data as CSV
            </button>
            <button
              className="btn"
              style={{ width: '100%', justifyContent: 'flex-start', gap: '0.75rem', background: 'rgba(239,68,68,0.12)', color: '#EF4444', border: '1.5px solid rgba(239,68,68,0.3)' }}
              onClick={handleSignOut}
            >
              <LogOut size={16} />
              Sign Out
            </button>
          </div>
          <p style={{ fontSize: '0.7rem', color: 'var(--muted)', marginTop: '1.25rem', textAlign: 'center', lineHeight: 1.5 }}>
            WellSync — ₹0 cost forever · React + Node.js + Supabase + Google Gemini AI
          </p>
        </motion.div>
      </main>
      {isMobile && <BottomNav />}
    </div>
  )
}
