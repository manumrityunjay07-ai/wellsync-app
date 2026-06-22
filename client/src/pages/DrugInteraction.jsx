import { useState } from 'react'
import { motion } from 'framer-motion'
import { Pill, Search, Loader2, AlertTriangle, CheckCircle, Info, Shield } from 'lucide-react'
import api from '../services/api'
import toast from 'react-hot-toast'

const severityConfig = {
  high: { color: '#EF4444', bg: '#FEF2F2', icon: AlertTriangle, label: 'HIGH RISK' },
  moderate: { color: '#F59E0B', bg: '#FFFBEB', icon: Info, label: 'MODERATE' },
  low: { color: '#10B981', bg: '#ECFDF5', icon: CheckCircle, label: 'LOW RISK' },
  unknown: { color: '#6B7280', bg: 'var(--bg)', icon: Shield, label: 'UNKNOWN' },
}

export default function DrugInteraction() {
  const [drug1, setDrug1] = useState('')
  const [drug2, setDrug2] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)

  const handleCheck = async (e) => {
    e.preventDefault()
    if (!drug1.trim() || !drug2.trim()) return toast.error('Please enter both drug names')
    setLoading(true)
    setResult(null)
    try {
      const { data } = await api.post('/api/ai/drug-interaction', { drug1: drug1.trim(), drug2: drug2.trim() })
      setResult(data)
    } catch {
      toast.error('Failed to analyze interaction. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const severity = result ? (severityConfig[result.severity?.toLowerCase()] || severityConfig.unknown) : null
  const SeverityIcon = severity?.icon || Shield

  return (
    <div className="page" style={{ maxWidth: 900 }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card"
        style={{ background: 'var(--surface)', border: '1px solid var(--border)', padding: '2.5rem' }}>

        <h2 style={{ fontSize: '1.5rem', color: 'var(--text)', display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
          <Pill color="var(--primary)" /> DRUG INTERACTION CHECKER
        </h2>
        <p style={{ color: 'var(--muted)', marginBottom: '2.5rem', lineHeight: 1.6 }}>
          Powered by OpenFDA + Gemini AI. Enter two drug names to analyze potential interactions, contraindications, and clinical implications.
        </p>

        <form onSubmit={handleCheck}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: '1rem', alignItems: 'center', marginBottom: '1.5rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--muted)', marginBottom: '0.5rem', fontWeight: 600 }}>DRUG 1</label>
              <input
                className="input"
                value={drug1}
                onChange={e => setDrug1(e.target.value)}
                placeholder="e.g. Warfarin"
                style={{ width: '100%' }}
              />
            </div>
            <div style={{ textAlign: 'center', color: 'var(--muted)', fontWeight: 700, fontSize: '1.25rem', paddingTop: '1.5rem' }}>+</div>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--muted)', marginBottom: '0.5rem', fontWeight: 600 }}>DRUG 2</label>
              <input
                className="input"
                value={drug2}
                onChange={e => setDrug2(e.target.value)}
                placeholder="e.g. Aspirin"
                style={{ width: '100%' }}
              />
            </div>
          </div>

          <button className="btn btn-primary" type="submit" disabled={loading} style={{ width: '100%', padding: '0.875rem', fontSize: '1rem' }}>
            {loading ? <><Loader2 className="spinner" size={18} /> Analyzing Interaction...</> : <><Search size={18} /> Analyze Interaction</>}
          </button>
        </form>

        {result && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ marginTop: '2.5rem' }}>
            {/* Severity Banner */}
            <div style={{
              background: severity.bg, border: `2px solid ${severity.color}`,
              borderRadius: 12, padding: '1.5rem', display: 'flex', alignItems: 'center',
              gap: '1rem', marginBottom: '2rem'
            }}>
              <div style={{ width: 48, height: 48, borderRadius: '50%', background: severity.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <SeverityIcon size={24} color="white" />
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: severity.color, fontWeight: 800, letterSpacing: '2px', marginBottom: '0.25rem' }}>{severity.label}</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#111' }}>
                  {drug1} + {drug2} Interaction
                </div>
              </div>
            </div>

            {/* AI Summary */}
            <div style={{ background: 'var(--bg)', borderRadius: 12, padding: '1.5rem', border: '1px solid var(--border)', marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1rem', color: 'var(--text)', marginBottom: '1rem', fontWeight: 700 }}>AI Clinical Analysis</h3>
              <p style={{ color: 'var(--muted)', lineHeight: 1.8 }}>{result.summary}</p>
            </div>

            {/* Detail Cards */}
            {result.details && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
                {result.details.map((detail, i) => (
                  <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                    style={{ background: 'var(--bg)', padding: '1.25rem', borderRadius: 10, border: '1px solid var(--border)' }}>
                    <div style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 700, marginBottom: '0.5rem', textTransform: 'uppercase' }}>{detail.label}</div>
                    <div style={{ fontSize: '0.9rem', color: 'var(--text)', lineHeight: 1.5 }}>{detail.value}</div>
                  </motion.div>
                ))}
              </div>
            )}

            <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'rgba(239,68,68,0.05)', borderRadius: 8, border: '1px solid rgba(239,68,68,0.2)' }}>
              <p style={{ fontSize: '0.8rem', color: 'var(--muted)', margin: 0 }}>
                ⚕️ <strong>Disclaimer:</strong> This tool is for informational purposes only. Always consult a licensed healthcare provider before making clinical decisions.
              </p>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}
