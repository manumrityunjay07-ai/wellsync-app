import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Bell, AlertTriangle, Info, FileText, CheckCircle, Search, Loader2 } from 'lucide-react'
import { supabase } from '../lib/supabase'

export default function Alerts() {
  const [filter, setFilter] = useState('all')
  const [alerts, setAlerts] = useState([])
  const [loading, setLoading] = useState(true)

  const mockAlerts = [
    { id: '1', type: 'warning', category: 'fda', title: 'FDA Label Update: Keytruda', desc: 'New safety warning added for immune-mediated pneumonitis. Applies to 14 active patients.', time: '2 hours ago' },
    { id: '2', type: 'info', category: 'trials', title: 'Trial Readout: NCT0456123', desc: 'Phase III results published showing 42% improvement in progression-free survival.', time: '5 hours ago' },
    { id: '3', type: 'success', category: 'payer', title: 'Aetna Policy Change', desc: 'Prior authorization requirement removed for Continuous Glucose Monitors (CGM) in Type 2 Diabetes.', time: '1 day ago' },
    { id: '4', type: 'info', category: 'guidelines', title: 'AHA Hypertension Guidelines', desc: 'Updated BP targets released for patients > 65 years old. Review recommended.', time: '2 days ago' },
    { id: '5', type: 'warning', category: 'payer', title: 'Cigna Step Therapy Addition', desc: 'New step therapy requirement for TNF inhibitors. Methotrexate trial required first.', time: '3 days ago' },
  ]

  useEffect(() => {
    async function fetchAlerts() {
      try {
        const { data, error } = await supabase
          .from('alerts')
          .select('*')
          .order('created_at', { ascending: false })
        
        if (error || !data || data.length === 0) {
          // Fallback to mock data if table doesn't exist or is empty
          setAlerts(mockAlerts)
        } else {
          // Map real DB data
          setAlerts(data.map(a => ({
            id: a.id,
            type: a.type,
            category: a.category,
            title: a.title,
            desc: a.description,
            time: new Date(a.created_at).toLocaleDateString()
          })))
        }
      } catch (err) {
        setAlerts(mockAlerts)
      } finally {
        setLoading(false)
      }
    }
    fetchAlerts()
  }, [])

  const filteredAlerts = filter === 'all' ? alerts : alerts.filter(a => a.type === filter)

  return (
    <div className="page" style={{ maxWidth: 900 }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card" style={{ background: 'var(--surface)', border: '1px solid var(--border)', padding: '2.5rem' }}>
        
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.5rem', color: 'var(--text)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Bell color="var(--primary)" />
            INTELLIGENCE HUB
          </h2>
          
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button className={`btn ${filter === 'all' ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setFilter('all')} style={{ padding: '0.5rem 1rem' }}>All</button>
            <button className={`btn ${filter === 'warning' ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setFilter('warning')} style={{ padding: '0.5rem 1rem' }}>Alerts</button>
            <button className={`btn ${filter === 'info' ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setFilter('info')} style={{ padding: '0.5rem 1rem' }}>Updates</button>
          </div>
        </div>

        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem 0' }}>
            <Loader2 className="spinner" size={32} color="var(--primary)" />
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {filteredAlerts.map((alert, i) => (
              <motion.div 
              key={alert.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              style={{
                background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 12,
                padding: '1.5rem', display: 'flex', gap: '1.25rem', alignItems: 'flex-start'
              }}
            >
              <div style={{ 
                width: 40, height: 40, borderRadius: '50%', flexShrink: 0,
                background: alert.type === 'warning' ? '#FEF2F2' : alert.type === 'success' ? '#ECFDF5' : '#EFF6FF',
                color: alert.type === 'warning' ? '#EF4444' : alert.type === 'success' ? '#10B981' : '#3B82F6',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                {alert.type === 'warning' ? <AlertTriangle size={20} /> : alert.type === 'success' ? <CheckCircle size={20} /> : <Info size={20} />}
              </div>
              
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                  <h3 style={{ fontSize: '1.05rem', color: 'var(--text)', fontWeight: 600 }}>{alert.title}</h3>
                  <span style={{ fontSize: '0.75rem', color: 'var(--muted)', fontWeight: 500 }}>{alert.time}</span>
                </div>
                <p style={{ color: 'var(--muted)', fontSize: '0.9rem', lineHeight: 1.5, marginBottom: '1rem' }}>
                  {alert.desc}
                </p>
                
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <button className="btn btn-ghost" style={{ fontSize: '0.8rem', padding: '0.4rem 0.75rem', background: 'var(--surface)' }}>
                    <Search size={14} /> Analyze Impact
                  </button>
                  <button className="btn btn-ghost" style={{ fontSize: '0.8rem', padding: '0.4rem 0.75rem', background: 'var(--surface)' }}>
                    <FileText size={14} /> View Source
                  </button>
                </div>
              </div>
            </motion.div>
            ))}
            
            {filteredAlerts.length === 0 && (
              <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--muted)' }}>
                No intelligence alerts found for this filter.
              </div>
            )}
          </div>
        )}

      </motion.div>
    </div>
  )
}
