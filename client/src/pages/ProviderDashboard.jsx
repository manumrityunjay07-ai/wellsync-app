import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Sidebar from '../components/layout/Sidebar'
import BottomNav from '../components/layout/BottomNav'
import { Users, AlertTriangle, CheckCircle, Activity, Search } from 'lucide-react'
import api from '../services/api'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'

export default function ProviderDashboard() {
  const { profile } = useAuth()
  const [patients, setPatients] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)

  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', handler)
    
    // Fetch patients
    api.get('/api/provider/patients')
      .then(res => setPatients(res.data))
      .catch(err => {
        console.error('Failed to fetch patients', err)
        toast.error('Failed to load patient roster.')
      })
      .finally(() => setLoading(false))

    return () => window.removeEventListener('resize', handler)
  }, [])

  // Filter patients by search term
  const filteredPatients = patients.filter(p => 
    p.name?.toLowerCase().includes(search.toLowerCase()) || 
    p.email?.toLowerCase().includes(search.toLowerCase()) ||
    p.condition_profile?.condition?.toLowerCase().includes(search.toLowerCase())
  )

  const needsAttentionCount = patients.filter(p => p.needsAttention).length

  return (
    <div style={{ display: 'flex' }}>
      {!isMobile && <Sidebar />}
      <main className="main-content" style={{ flex: 1, maxWidth: 1000 }}>
        
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.375rem' }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(59, 130, 246, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Users size={19} color="#3B82F6" />
            </div>
            <h1 style={{ fontSize: '1.5rem' }}>Provider Hub</h1>
          </div>
          <p style={{ color: 'var(--muted)', fontSize: '0.9rem', marginLeft: '3rem' }}>
            Monitor your patients' WellScores, vitals, and condition progress.
          </p>
        </motion.div>

        {/* Overview Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
          <motion.div className="card" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--muted)', fontWeight: 600, marginBottom: '0.25rem' }}>Total Patients</div>
            <div style={{ fontSize: '2rem', fontFamily: 'Space Grotesk', fontWeight: 800, color: 'var(--text)' }}>
              {loading ? '-' : patients.length}
            </div>
          </motion.div>

          <motion.div className="card" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} style={{ border: needsAttentionCount > 0 ? '1px solid rgba(239, 68, 68, 0.3)' : undefined }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--muted)', fontWeight: 600, marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              Needs Attention {needsAttentionCount > 0 && <AlertTriangle size={14} color="#EF4444" />}
            </div>
            <div style={{ fontSize: '2rem', fontFamily: 'Space Grotesk', fontWeight: 800, color: needsAttentionCount > 0 ? '#EF4444' : 'var(--text)' }}>
              {loading ? '-' : needsAttentionCount}
            </div>
          </motion.div>

          <motion.div className="card" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--muted)', fontWeight: 600, marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              Stable <CheckCircle size={14} color="#10B981" />
            </div>
            <div style={{ fontSize: '2rem', fontFamily: 'Space Grotesk', fontWeight: 800, color: '#10B981' }}>
              {loading ? '-' : patients.length - needsAttentionCount}
            </div>
          </motion.div>
        </div>

        {/* Patient Roster */}
        <motion.div className="card" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
            <h3 style={{ fontSize: '1.1rem' }}>Patient Roster</h3>
            <div style={{ position: 'relative', width: isMobile ? '100%' : '250px' }}>
              <Search size={16} color="var(--muted)" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
              <input 
                type="text" 
                className="input" 
                placeholder="Search by name or condition..." 
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{ paddingLeft: '2.5rem', width: '100%' }}
              />
            </div>
          </div>

          <div style={{ overflowX: 'auto' }}>
            {loading ? (
              <p style={{ textAlign: 'center', color: 'var(--muted)', padding: '2rem 0' }}>Loading patients...</p>
            ) : filteredPatients.length === 0 ? (
              <p style={{ textAlign: 'center', color: 'var(--muted)', padding: '2rem 0' }}>No patients found.</p>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '600px' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border)' }}>
                    <th style={{ padding: '0.75rem 0.5rem', color: 'var(--muted)', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}>Patient</th>
                    <th style={{ padding: '0.75rem 0.5rem', color: 'var(--muted)', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}>Condition</th>
                    <th style={{ padding: '0.75rem 0.5rem', color: 'var(--muted)', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}>Age/Gender</th>
                    <th style={{ padding: '0.75rem 0.5rem', color: 'var(--muted)', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}>WellScore</th>
                    <th style={{ padding: '0.75rem 0.5rem', color: 'var(--muted)', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPatients.map(patient => (
                    <tr key={patient.id} style={{ borderBottom: '1px solid var(--border)', transition: 'background 0.2s', cursor: 'pointer' }} onMouseEnter={e => e.currentTarget.style.background = 'var(--bg)'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                      <td style={{ padding: '1rem 0.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(99,102,241,0.1)', color: '#6366F1', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Space Grotesk', fontWeight: 700 }}>
                            {patient.name?.charAt(0).toUpperCase() || '?'}
                          </div>
                          <div>
                            <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text)' }}>{patient.name || 'Anonymous Patient'}</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>{patient.email}</div>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '1rem 0.5rem', fontSize: '0.85rem' }}>
                        {patient.condition_profile?.condition ? (
                          <span style={{ background: 'rgba(59, 130, 246, 0.1)', color: '#3B82F6', padding: '0.2rem 0.6rem', borderRadius: 99, fontWeight: 600 }}>
                            {patient.condition_profile.condition}
                          </span>
                        ) : <span style={{ color: 'var(--muted)' }}>None</span>}
                      </td>
                      <td style={{ padding: '1rem 0.5rem', fontSize: '0.85rem', color: 'var(--text)' }}>
                        {patient.age || '--'} / {patient.gender ? patient.gender.charAt(0) : '-'}
                      </td>
                      <td style={{ padding: '1rem 0.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <Activity size={16} color={patient.latestScore === null ? 'var(--muted)' : (patient.needsAttention ? '#EF4444' : '#10B981')} />
                          <span style={{ fontFamily: 'Space Grotesk', fontWeight: 800, fontSize: '1.1rem', color: patient.latestScore === null ? 'var(--muted)' : (patient.needsAttention ? '#EF4444' : 'var(--text)') }}>
                            {patient.latestScore === null ? 'N/A' : patient.latestScore}
                          </span>
                        </div>
                      </td>
                      <td style={{ padding: '1rem 0.5rem' }}>
                        {patient.needsAttention ? (
                          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem', background: 'rgba(239, 68, 68, 0.1)', color: '#EF4444', padding: '0.3rem 0.6rem', borderRadius: 6, fontSize: '0.75rem', fontWeight: 700 }}>
                            <AlertTriangle size={12} />
                            Review
                          </div>
                        ) : (
                          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem', background: 'rgba(16, 185, 129, 0.1)', color: '#10B981', padding: '0.3rem 0.6rem', borderRadius: 6, fontSize: '0.75rem', fontWeight: 700 }}>
                            <CheckCircle size={12} />
                            Stable
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </motion.div>

      </main>
      {isMobile && <BottomNav />}
    </div>
  )
}
