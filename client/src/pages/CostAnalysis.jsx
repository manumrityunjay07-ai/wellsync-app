import { useState } from 'react'
import { motion } from 'framer-motion'
import { DollarSign, Search, Loader2, TrendingDown, BarChart2, FileText } from 'lucide-react'
import api from '../services/api'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'
import UpgradeModal from '../components/ui/UpgradeModal'

export default function CostAnalysis() {
  const { profile } = useAuth()
  const [isUpgradeOpen, setIsUpgradeOpen] = useState(false)
  const [drug, setDrug] = useState('')
  const [indication, setIndication] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)

  const handleAnalyze = async (e) => {
    e.preventDefault()
    if (!drug.trim()) return toast.error('Please enter a drug name')
    if (profile?.plan !== 'pro') {
      setIsUpgradeOpen(true)
      return
    }
    setLoading(true)
    setResult(null)
    try {
      const { data } = await api.post('/api/ai/cost-analysis', { drug: drug.trim(), indication: indication.trim() })
      setResult(data)
    } catch {
      toast.error('Failed to generate cost analysis. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page" style={{ maxWidth: 1000 }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card"
        style={{ background: 'var(--surface)', border: '1px solid var(--border)', padding: '2.5rem' }}>

        <h2 style={{ fontSize: '1.5rem', color: 'var(--text)', display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
          <DollarSign color="var(--primary)" /> COST-EFFECTIVENESS ANALYZER
        </h2>
        <p style={{ color: 'var(--muted)', marginBottom: '2.5rem', lineHeight: 1.6 }}>
          Powered by public drug pricing data + Gemini AI. Get a structured cost-effectiveness report comparing branded vs. generic alternatives.
        </p>

        <form onSubmit={handleAnalyze}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--muted)', marginBottom: '0.5rem', fontWeight: 600 }}>DRUG / TREATMENT</label>
              <input className="input" value={drug} onChange={e => setDrug(e.target.value)} placeholder="e.g. Humira, Ozempic, Keytruda" style={{ width: '100%' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--muted)', marginBottom: '0.5rem', fontWeight: 600 }}>INDICATION (optional)</label>
              <input className="input" value={indication} onChange={e => setIndication(e.target.value)} placeholder="e.g. Rheumatoid Arthritis" style={{ width: '100%' }} />
            </div>
          </div>
          <button className="btn btn-primary" type="submit" disabled={loading} style={{ width: '100%', padding: '0.875rem', fontSize: '1rem' }}>
            {loading ? <><Loader2 className="spinner" size={18} /> Generating Report...</> : <><BarChart2 size={18} /> Generate Cost Report</>}
          </button>
        </form>

        {result && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ marginTop: '2.5rem' }}>
            {/* Summary */}
            <div style={{ background: 'rgba(212,175,55,0.08)', border: '1px solid var(--primary)', borderRadius: 12, padding: '1.5rem', marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '1rem', color: 'var(--primary)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <FileText size={16} /> Executive Summary
              </h3>
              <p style={{ color: 'var(--muted)', lineHeight: 1.8 }}>{result.summary}</p>
            </div>

            {/* Cost Breakdown */}
            {result.costTiers && (
              <div style={{ marginBottom: '2rem' }}>
                <h3 style={{ fontSize: '1.1rem', color: 'var(--text)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <TrendingDown size={18} color="var(--primary)" /> Cost Breakdown
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
                  {result.costTiers.map((tier, i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                      style={{ background: 'var(--bg)', padding: '1.5rem', borderRadius: 10, border: '1px solid var(--border)', textAlign: 'center' }}>
                      <div style={{ fontSize: '0.8rem', color: 'var(--muted)', fontWeight: 600, marginBottom: '0.5rem', textTransform: 'uppercase' }}>{tier.label}</div>
                      <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--primary)', fontFamily: 'Space Grotesk' }}>{tier.cost}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--muted)', marginTop: '0.5rem' }}>{tier.note}</div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Alternatives */}
            {result.alternatives && result.alternatives.length > 0 && (
              <div>
                <h3 style={{ fontSize: '1.1rem', color: 'var(--text)', marginBottom: '1rem' }}>Cost-Effective Alternatives</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {result.alternatives.map((alt, i) => (
                    <div key={i} style={{ background: 'var(--bg)', padding: '1rem 1.5rem', borderRadius: 10, border: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ color: 'var(--text)', fontWeight: 600 }}>{alt.name}</div>
                        <div style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>{alt.note}</div>
                      </div>
                      <div style={{ color: '#10B981', fontWeight: 700, fontSize: '1.1rem', fontFamily: 'Space Grotesk' }}>{alt.savings}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'rgba(59,130,246,0.05)', borderRadius: 8, border: '1px solid rgba(59,130,246,0.2)' }}>
              <p style={{ fontSize: '0.8rem', color: 'var(--muted)', margin: 0 }}>
                📊 <strong>Note:</strong> Cost data is derived from publicly available sources (CMS, GoodRx, FDA Orange Book). Actual prices may vary by payer and formulary.
              </p>
            </div>
          </motion.div>
        )}
      <UpgradeModal isOpen={isUpgradeOpen} onClose={() => setIsUpgradeOpen(false)} featureName="Treatment Cost-Effectiveness Report" />
      </motion.div>
    </div>
  )
}
