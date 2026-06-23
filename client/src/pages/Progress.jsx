import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Sidebar from '../components/layout/Sidebar'
import BottomNav from '../components/layout/BottomNav'
import api from '../services/api'
import { TrendingUp, Brain, Dumbbell, Salad, Moon, Activity, Sparkles, Calendar, Award, BarChart2 } from 'lucide-react'
import { SkeletonList } from '../components/ui/Skeleton'
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar, RadarChart, Radar, PolarGrid, PolarAngleAxis,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, PolarRadiusAxis, Legend
} from 'recharts'
import { format, subDays } from 'date-fns'
import { useWellScore } from '../context/WellScoreContext'

const pillars = [
  { key: 'mental', label: 'Mental', icon: Brain, color: '#818CF8' },
  { key: 'fitness', label: 'Fitness', icon: Dumbbell, color: '#F97316' },
  { key: 'nutrition', label: 'Nutrition', icon: Salad, color: '#22C55E' },
  { key: 'sleep', label: 'Sleep', icon: Moon, color: '#6366F1' },
  { key: 'vitals', label: 'Vitals', icon: Activity, color: '#EF4444' },
  { key: 'wellness', label: 'Wellness', icon: Sparkles, color: '#F59E0B' },
]

const PERIOD_OPTIONS = [
  { label: '7 Days', days: 7 },
  { label: '14 Days', days: 14 },
  { label: '30 Days', days: 30 },
]

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div style={{
      background: 'var(--surface)', border: '1px solid var(--border)',
      borderRadius: 10, padding: '0.75rem 1rem', fontSize: '0.8rem',
    }}>
      <div style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 700, marginBottom: '0.25rem', color: 'var(--text)' }}>{label}</div>
      {payload.map(p => (
        <div key={p.name} style={{ color: p.color, fontWeight: 600 }}>{p.name}: {p.value}</div>
      ))}
    </div>
  )
}

export default function Progress() {
  const { scoreHistory } = useWellScore()
  const [period, setPeriod] = useState(30)
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)
  const [streaks, setStreaks] = useState({ mental: 0, fitness: 0, nutrition: 0, sleep: 0, vitals: 0, wellness: 0 })
  const [fetching, setFetching] = useState(true)

  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', handler)
    fetchStreaks()
    return () => window.removeEventListener('resize', handler)
  }, [])

  async function fetchStreaks() {
    setFetching(true)
    try {
      const res = await api.get('/api/wellness/streaks')
      if (res.data) setStreaks(res.data)
    } catch {
      // silently fail — streaks stay 0
    } finally {
      setFetching(false)
    }
  }

  // Filter history by period
  const cutoff = subDays(new Date(), period)
  const filtered = scoreHistory
    .filter(s => new Date(s.date || s.calculated_at) >= cutoff)
    .map(s => ({
      date: format(new Date(s.date || s.calculated_at), 'MMM d'),
      score: s.score || 0,
      mental: s.pillar_breakdown?.mental || 0,
      fitness: s.pillar_breakdown?.fitness || 0,
      nutrition: s.pillar_breakdown?.nutrition || 0,
      sleep: s.pillar_breakdown?.sleep || 0,
      vitals: s.pillar_breakdown?.vitals || 0,
      wellness: s.pillar_breakdown?.wellness || 0,
    }))

  // Summary stats
  const avgScore = filtered.length ? Math.round(filtered.reduce((a, s) => a + s.score, 0) / filtered.length) : 0
  const maxScore = filtered.length ? Math.max(...filtered.map(s => s.score)) : 0
  const trend = filtered.length >= 2 ? filtered[filtered.length - 1].score - filtered[0].score : 0

  // Radar data — latest pillar breakdown
  const latest = scoreHistory[scoreHistory.length - 1]
  const radarData = pillars.map(p => ({
    pillar: p.label,
    score: latest?.pillar_breakdown?.[p.key] || 0,
    fullMark: 100,
  }))

  // Best pillar
  const bestPillar = pillars.reduce((best, p) => {
    const avg = filtered.length
      ? Math.round(filtered.reduce((a, s) => a + (s[p.key] || 0), 0) / filtered.length)
      : 0
    return avg > (best.avg || 0) ? { ...p, avg } : best
  }, {})

  return (
    <div style={{ display: 'flex' }}>
      {!isMobile && <Sidebar />}
      <main className="main-content" style={{ flex: 1 }}>
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.375rem' }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(129,140,248,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <TrendingUp size={19} color="#818CF8" />
                </div>
                <h1 style={{ fontSize: '1.5rem' }}>Progress & Analytics</h1>
              </div>
              <p style={{ color: 'var(--muted)', fontSize: '0.9rem', marginLeft: '3rem' }}>
                Deep dive into your health trends across all 6 pillars.
              </p>
            </div>
            {/* Period selector */}
            <div style={{ display: 'flex', gap: '0.5rem', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, padding: '0.25rem' }}>
              {PERIOD_OPTIONS.map(opt => (
                <button
                  key={opt.days}
                  onClick={() => setPeriod(opt.days)}
                  style={{
                    padding: '0.375rem 0.875rem', borderRadius: 8, border: 'none', cursor: 'pointer',
                    fontFamily: 'Plus Jakarta Sans', fontWeight: 600, fontSize: '0.8rem',
                    background: period === opt.days ? 'linear-gradient(135deg, #818CF8, #6366F1)' : 'transparent',
                    color: period === opt.days ? 'white' : 'var(--muted)',
                    transition: 'all 0.2s',
                  }}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Summary Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
          {[
            { label: 'Avg WellScore', value: avgScore, icon: '🎯', color: '#818CF8', suffix: '/100' },
            { label: 'Peak Score', value: maxScore, icon: '🏆', color: '#F59E0B', suffix: '/100' },
            { label: `${period}d Trend`, value: trend >= 0 ? `+${trend}` : trend, icon: trend >= 0 ? '📈' : '📉', color: trend >= 0 ? '#10B981' : '#EF4444', suffix: ' pts' },
            { label: 'Days Logged', value: filtered.length, icon: '📅', color: '#22C55E', suffix: ` / ${period}` },
          ].map((stat, i) => (
            <motion.div key={stat.label}
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              className="card" style={{ textAlign: 'center', padding: '1.25rem' }}
            >
              <div style={{ fontSize: '1.5rem', marginBottom: '0.375rem' }}>{stat.icon}</div>
              <div style={{ fontFamily: 'Space Grotesk', fontWeight: 800, fontSize: '1.5rem', color: stat.color }}>
                {stat.value}<span style={{ fontSize: '0.9rem', fontWeight: 600 }}>{stat.suffix}</span>
              </div>
              <div style={{ fontSize: '0.7rem', color: 'var(--muted)', fontFamily: 'Plus Jakarta Sans', fontWeight: 600 }}>{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* WellScore Trend Chart */}
        <motion.div className="card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} style={{ marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1rem' }}>WellScore Over Time</h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', background: 'rgba(129,140,248,0.1)', borderRadius: 99, padding: '0.25rem 0.75rem' }}>
              <Calendar size={12} color="#818CF8" />
              <span style={{ fontSize: '0.7rem', color: '#818CF8', fontFamily: 'Plus Jakarta Sans', fontWeight: 700 }}>LAST {period} DAYS</span>
            </div>
          </div>
          {filtered.length === 0 ? (
            <div style={{ textAlign: 'center', color: 'var(--muted)', padding: '3rem', fontSize: '0.9rem' }}>
              No score history yet. Log your health data to see trends! 🌱
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={filtered}>
                <defs>
                  <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#818CF8" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="#818CF8" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: 'var(--muted)' }} tickLine={false} axisLine={false} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: 'var(--muted)' }} tickLine={false} axisLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="score" name="WellScore" stroke="#818CF8" strokeWidth={2.5} fill="url(#scoreGrad)" dot={false} activeDot={{ r: 5, fill: '#818CF8' }} />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </motion.div>

        {/* Pillar Breakdown Charts */}
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
          {/* Radar Chart */}
          <motion.div className="card" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
            <h2 style={{ fontSize: '1rem', marginBottom: '1.25rem' }}>Today's Pillar Balance</h2>
            {!latest ? (
              <div style={{ textAlign: 'center', color: 'var(--muted)', padding: '2rem', fontSize: '0.875rem' }}>Calculate your WellScore to see the radar.</div>
            ) : (
              <ResponsiveContainer width="100%" height={240}>
                <RadarChart data={radarData}>
                  <PolarGrid stroke="var(--border)" />
                  <PolarAngleAxis dataKey="pillar" tick={{ fontSize: 11, fill: 'var(--muted)', fontFamily: 'Plus Jakarta Sans', fontWeight: 600 }} />
                  <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
                  <Radar name="Score" dataKey="score" stroke="#818CF8" fill="#818CF8" fillOpacity={0.25} strokeWidth={2} dot={{ fill: '#818CF8', r: 3 }} />
                </RadarChart>
              </ResponsiveContainer>
            )}
          </motion.div>

          {/* Pillar Bar Chart */}
          <motion.div className="card" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
            <h2 style={{ fontSize: '1rem', marginBottom: '1.25rem' }}>Average Pillar Scores</h2>
            {filtered.length === 0 ? (
              <div style={{ textAlign: 'center', color: 'var(--muted)', padding: '2rem', fontSize: '0.875rem' }}>No data yet.</div>
            ) : (
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={pillars.map(p => ({
                  name: p.label,
                  avg: filtered.length ? Math.round(filtered.reduce((a, s) => a + (s[p.key] || 0), 0) / filtered.length) : 0,
                  color: p.color,
                }))} barSize={28}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: 'var(--muted)' }} tickLine={false} axisLine={false} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: 'var(--muted)' }} tickLine={false} axisLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="avg" name="Avg Score" radius={[6, 6, 0, 0]}
                    fill="#818CF8"
                    label={{ position: 'top', fontSize: 10, fill: 'var(--muted)', fontWeight: 700 }}
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </motion.div>
        </div>

        {/* Multi-pillar line chart */}
        <motion.div className="card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} style={{ marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1rem', marginBottom: '1.25rem' }}>All Pillars Over Time</h2>
          {filtered.length === 0 ? (
            <div style={{ textAlign: 'center', color: 'var(--muted)', padding: '3rem', fontSize: '0.9rem' }}>Log health data to see pillar trends.</div>
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={filtered}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: 'var(--muted)' }} tickLine={false} axisLine={false} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: 'var(--muted)' }} tickLine={false} axisLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: '0.75rem', fontFamily: 'Plus Jakarta Sans', fontWeight: 600 }} />
                {pillars.map(p => (
                  <Line key={p.key} type="monotone" dataKey={p.key} name={p.label} stroke={p.color} strokeWidth={1.5} dot={false} activeDot={{ r: 4 }} />
                ))}
              </LineChart>
            </ResponsiveContainer>
          )}
        </motion.div>

        {/* Streaks & Achievements */}
        <motion.div className="card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
            <Award size={18} color="#F59E0B" />
            <h2 style={{ fontSize: '1rem' }}>Pillar Streaks</h2>
          </div>
          {fetching ? <SkeletonList rows={3} /> : (
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2,1fr)' : 'repeat(3,1fr)', gap: '0.875rem' }}>
              {pillars.map(({ key, label, icon: Icon, color }) => {
                const streak = streaks[key] || 0
                return (
                  <div key={key} style={{
                    background: 'var(--bg)', borderRadius: 12, padding: '1rem',
                    border: `1px solid ${streak > 0 ? color + '40' : 'var(--border)'}`,
                    display: 'flex', alignItems: 'center', gap: '0.875rem',
                  }}>
                    <div style={{ width: 40, height: 40, borderRadius: 10, background: `${color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Icon size={20} color={color} />
                    </div>
                    <div>
                      <div style={{ fontFamily: 'Space Grotesk', fontWeight: 800, fontSize: '1.4rem', color: streak > 0 ? color : 'var(--muted)' }}>
                        {streak} <span style={{ fontSize: '0.75rem', fontWeight: 500, color: 'var(--muted)' }}>days</span>
                      </div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--muted)', fontFamily: 'Plus Jakarta Sans', fontWeight: 600 }}>{label}</div>
                    </div>
                    {streak >= 7 && <span style={{ marginLeft: 'auto', fontSize: '1.25rem' }}>🔥</span>}
                  </div>
                )
              })}
            </div>
          )}
          {bestPillar.label && (
            <div style={{
              marginTop: '1rem', padding: '0.875rem 1rem', borderRadius: 10,
              background: `${bestPillar.color}15`, border: `1px solid ${bestPillar.color}30`,
              display: 'flex', alignItems: 'center', gap: '0.75rem',
            }}>
              <span style={{ fontSize: '1.25rem' }}>⭐</span>
              <div style={{ fontSize: '0.85rem', color: 'var(--text)' }}>
                <strong style={{ color: bestPillar.color }}>{bestPillar.label}</strong> is your strongest pillar with an avg of <strong>{bestPillar.avg}/100</strong> over {period} days.
              </div>
            </div>
          )}
        </motion.div>
      </main>
      {isMobile && <BottomNav />}
    </div>
  )
}
