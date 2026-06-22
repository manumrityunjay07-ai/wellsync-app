import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Sidebar from '../components/layout/Sidebar'
import BottomNav from '../components/layout/BottomNav'
import api from '../services/api'
import { useAuth } from '../context/AuthContext'
import { generateDoctorReport } from '../utils/reportGenerator'
import toast from 'react-hot-toast'
import { Activity, AlertTriangle, FileText, Plus, Check, X } from 'lucide-react'
import { format } from 'date-fns'
import EmptyState from '../components/ui/EmptyState'
import { SkeletonList } from '../components/ui/Skeleton'

const vitalTypes = {
  'Blood Pressure': { unit: 'mmHg', placeholder: '120/80', example: '120/80' },
  'Blood Sugar (Fasting)': { unit: 'mg/dL', placeholder: '95', example: '95' },
  'Blood Sugar (PP)': { unit: 'mg/dL', placeholder: '140', example: '140' },
  'Heart Rate': { unit: 'bpm', placeholder: '72', example: '72' },
  'SpO2': { unit: '%', placeholder: '98', example: '98' },
  'Weight': { unit: 'kg', placeholder: '70', example: '70' },
  'Body Temperature': { unit: '°C', placeholder: '36.6', example: '36.6' },
}

export default function Vitals() {
  const { profile } = useAuth()
  const [vitals, setVitals] = useState([])
  const [medications, setMedications] = useState([])
  const [alerts, setAlerts] = useState([])
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [newVital, setNewVital] = useState({ type: 'Blood Sugar (Fasting)', value: '' })
  const [newMed, setNewMed] = useState({ name: '', dosage: '', frequency: 'daily' })
  const [showMedForm, setShowMedForm] = useState(false)
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)

  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', handler)
    fetchData()
    return () => window.removeEventListener('resize', handler)
  }, [])

  async function fetchData() {
    setFetching(true)
    try {
      const [vitalsRes, medsRes, alertsRes] = await Promise.allSettled([
        api.get('/api/vitals/log?days=14'),
        api.get('/api/vitals/medications'),
        api.get('/api/vitals/alerts'),
      ])
      if (vitalsRes.status === 'fulfilled') setVitals(vitalsRes.value.data)
      if (medsRes.status === 'fulfilled') setMedications(medsRes.value.data)
      if (alertsRes.status === 'fulfilled') setAlerts(alertsRes.value.data?.alerts || [])
    } catch {
      setVitals([])
    } finally {
      setFetching(false)
    }
  }

  const logVital = async () => {
    if (!newVital.value) return
    setLoading(true)
    try {
      const { unit } = vitalTypes[newVital.type]
      await api.post('/api/vitals/log', {
        vital_type: newVital.type,
        value: parseFloat(newVital.value),
        unit,
      })
      toast.success(`${newVital.type} logged!`)
      setNewVital({ ...newVital, value: '' })
      fetchData()
    } catch {
      toast.error('Failed to log vital.')
    } finally {
      setLoading(false)
    }
  }

  const addMedication = async () => {
    if (!newMed.name) return
    try {
      await api.post('/api/vitals/medications', newMed)
      toast.success('Medication added!')
      
      // Archimedes Guideline Alert Trigger
      try {
        const { data: alertData } = await api.post('/api/ai/guideline-alert', { medication: newMed.name })
        if (alertData.hasAlert) {
          toast(alertData.alertMessage, {
            icon: '🚨',
            duration: 8000,
            style: { background: '#131B3A', color: '#D4AF37', border: '1px solid #D4AF37' }
          })
        }
      } catch (err) {
        console.error('Failed to check guidelines', err)
      }

      setNewMed({ name: '', dosage: '', frequency: 'daily' })
      setShowMedForm(false)
      fetchData()
    } catch {
      toast.error('Failed to add medication.')
    }
  }

  const toggleMedTaken = async (id, taken) => {
    try {
      await api.patch(`/api/vitals/medications/${id}`, { taken_today: !taken })
      setMedications(prev => prev.map(m => m.id === id ? { ...m, taken_today: !taken } : m))
    } catch {
      toast.error('Failed to update medication status.')
    }
  }

  const downloadReport = async () => {
    try {
      const { data: scoreData } = await api.get('/api/wellness/history?days=30')
      generateDoctorReport({
        profile,
        vitals,
        medications,
        wellScores: scoreData,
        dateRange: 'Last 30 days',
      })
      toast.success('Report downloaded! 📄')
    } catch {
      toast.error('Failed to generate report.')
    }
  }

  const alertColors = { info: '#818CF8', warning: '#F59E0B', urgent: '#EF4444' }

  return (
    <div style={{ display: 'flex' }}>
      {!isMobile && <Sidebar />}
      <main className="main-content" style={{ flex: 1 }}>
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.375rem' }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: '#EF444420', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Activity size={19} color="#EF4444" />
              </div>
              <h1 style={{ fontSize: '1.5rem' }}>Vitals & Medications</h1>
            </div>
            <button onClick={downloadReport} className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem' }}>
              <FileText size={14} />
              Doctor PDF
            </button>
          </div>
          <p style={{ color: 'var(--muted)', fontSize: '0.9rem', marginLeft: '3rem' }}>
            Log vitals, track medications, and get AI health alerts.
          </p>
        </motion.div>

        <div style={{ background: '#F0F9FF', color: '#0369A1', padding: '0.75rem 1.25rem', borderRadius: 8, fontSize: '0.8rem', marginBottom: '1.5rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <AlertTriangle size={16} style={{ flexShrink: 0 }} />
          <span><strong>Disclaimer:</strong> This app provides AI-generated insights for informational purposes only. It is not a substitute for professional medical advice, diagnosis, or treatment.</span>
        </div>

        {/* AI Alerts */}
        {alerts.length > 0 && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: '1.5rem' }}>
            {alerts.map((alert, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'flex-start', gap: '0.875rem',
                padding: '1rem 1.25rem', borderRadius: 12, marginBottom: '0.75rem',
                background: `${alertColors[alert.severity]}15`,
                border: `1.5px solid ${alertColors[alert.severity]}40`,
              }}>
                <AlertTriangle size={18} color={alertColors[alert.severity]} style={{ flexShrink: 0, marginTop: 2 }} />
                <div>
                  <div style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 700, fontSize: '0.9rem', color: alertColors[alert.severity], marginBottom: '0.25rem' }}>
                    {alert.vital} — {alert.trend}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text)', lineHeight: 1.5 }}>{alert.message}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--muted)', marginTop: '0.25rem', fontStyle: 'italic' }}>👉 {alert.action}</div>
                </div>
              </div>
            ))}
          </motion.div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '1.25rem' }}>
          {/* Log Vital */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <motion.div className="card" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
              <h3 style={{ fontSize: '1rem', marginBottom: '1.25rem' }}>📊 Log a Vital Reading</h3>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--muted)', display: 'block', marginBottom: '0.375rem' }}>Vital Type</label>
                <select className="input" value={newVital.type} onChange={e => setNewVital({ ...newVital, type: e.target.value })}>
                  {Object.keys(vitalTypes).map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--muted)', display: 'block', marginBottom: '0.375rem' }}>
                  Value ({vitalTypes[newVital.type]?.unit})
                </label>
                <input
                  className="input"
                  type="text"
                  placeholder={vitalTypes[newVital.type]?.placeholder}
                  value={newVital.value}
                  onChange={e => setNewVital({ ...newVital, value: e.target.value })}
                />
              </div>
              <button
                className="btn btn-primary"
                style={{ width: '100%', background: 'linear-gradient(135deg, #EF4444, #DC2626)' }}
                onClick={logVital}
                disabled={!newVital.value || loading}
              >
                {loading ? 'Saving...' : 'Log Vital ✓'}
              </button>
            </motion.div>

            {/* Recent vitals */}
            <motion.div className="card" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }}>
              <h3 style={{ fontSize: '1rem', marginBottom: '1rem' }}>Recent Readings</h3>
              {fetching ? (
                <SkeletonList rows={3} />
              ) : vitals.length === 0 ? (
                <EmptyState emoji="📈" title="No vitals logged" description="Log your first reading above!" />
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {vitals.slice(0, 6).map((v, i) => (
                    <div key={i} style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      padding: '0.625rem 0.875rem', background: 'var(--bg)', borderRadius: 10,
                      borderLeft: `3px solid ${v.ai_flag === 'urgent' ? '#EF4444' : v.ai_flag === 'warning' ? '#F59E0B' : '#22C55E'}`,
                    }}>
                      <div>
                        <div style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 600, fontSize: '0.8rem' }}>{v.vital_type}</div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--muted)' }}>{format(new Date(v.logged_at), 'dd MMM, h:mm a')}</div>
                      </div>
                      <div style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: '1rem', color: '#EF4444' }}>
                        {v.value} {v.unit}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </div>

          {/* Medications */}
          <motion.div className="card" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1rem' }}>💊 Medications</h3>
              <button onClick={() => setShowMedForm(!showMedForm)} className="btn btn-secondary" style={{ fontSize: '0.75rem', padding: '0.375rem 0.875rem' }}>
                <Plus size={12} /> Add
              </button>
            </div>

            {showMedForm && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                style={{ background: 'var(--bg)', borderRadius: 12, padding: '1rem', marginBottom: '1rem' }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <input className="input" placeholder="Medicine name (e.g. Metformin)" value={newMed.name} onChange={e => setNewMed({ ...newMed, name: e.target.value })} />
                  <input className="input" placeholder="Dosage (e.g. 500mg)" value={newMed.dosage} onChange={e => setNewMed({ ...newMed, dosage: e.target.value })} />
                  <select className="input" value={newMed.frequency} onChange={e => setNewMed({ ...newMed, frequency: e.target.value })}>
                    <option value="daily">Daily</option>
                    <option value="twice daily">Twice Daily</option>
                    <option value="as needed">As Needed</option>
                    <option value="weekly">Weekly</option>
                  </select>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button className="btn btn-primary" style={{ flex: 1, fontSize: '0.8rem' }} onClick={addMedication}>Save</button>
                    <button className="btn btn-secondary" onClick={() => setShowMedForm(false)}><X size={14} /></button>
                  </div>
                </div>
              </motion.div>
            )}

            {medications.length === 0 ? (
              <div className="empty-state" style={{ padding: '2rem' }}>
                <p style={{ fontSize: '0.85rem' }}>No medications added yet. Click + Add to start tracking.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {medications.map((med, i) => (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'center', gap: '1rem',
                    padding: '0.875rem', background: 'var(--bg)', borderRadius: 12,
                    opacity: med.taken_today ? 0.7 : 1,
                  }}>
                    <button
                      onClick={() => toggleMedTaken(med.id, med.taken_today)}
                      style={{
                        width: 26, height: 26, borderRadius: 8, border: `2px solid ${med.taken_today ? '#22C55E' : 'var(--border)'}`,
                        background: med.taken_today ? '#22C55E' : 'transparent',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        cursor: 'pointer', flexShrink: 0, transition: 'all 0.2s',
                      }}
                    >
                      {med.taken_today && <Check size={13} color="white" />}
                    </button>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 600, fontSize: '0.875rem', textDecoration: med.taken_today ? 'line-through' : 'none' }}>
                        {med.name}
                      </div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--muted)' }}>{med.dosage} · {med.frequency}</div>
                    </div>
                    {med.taken_today && (
                      <span style={{ fontSize: '0.7rem', color: '#22C55E', fontWeight: 700, fontFamily: 'Plus Jakarta Sans' }}>TAKEN ✓</span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </main>
      {isMobile && <BottomNav />}
    </div>
  )
}
