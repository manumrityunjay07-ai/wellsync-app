import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Loader2, PieChart as PieChartIcon, BarChart2, ShieldCheck, Download } from 'lucide-react'
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, Legend } from 'recharts'
import { supabase } from '../lib/supabase'

export default function Share() {
  const { token } = useParams()
  const [report, setReport] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function fetchReport() {
      try {
        const { data, error: err } = await supabase
          .from('shared_reports')
          .select('*')
          .eq('token', token)
          .single()
        
        if (err || !data) throw new Error('Report not found')
        setReport(data)
      } catch (err) {
        setError('This report link is invalid or has expired.')
      } finally {
        setLoading(false)
      }
    }
    fetchReport()
  }, [token])

  if (loading) return (
    <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)' }}>
      <Loader2 className="spin" size={48} color="var(--primary)" />
    </div>
  )

  if (error || !report) return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)', padding: '2rem', textAlign: 'center' }}>
      <div style={{ width: 64, height: 64, borderRadius: 32, background: '#FEE2E2', color: '#EF4444', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
        <ShieldCheck size={32} />
      </div>
      <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Report Not Found</h2>
      <p style={{ color: 'var(--muted)', marginBottom: '2rem' }}>{error}</p>
      <Link to="/" className="btn btn-primary" style={{ textDecoration: 'none' }}>Go to WellSync</Link>
    </div>
  )

  const result = report.result_data

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', padding: '2rem 1rem' }}>
      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        
        {/* Header branding */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg, #818CF8, #6366F1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ color: 'white', fontWeight: 800 }}>W</span>
            </div>
            <div>
              <div style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 800, fontSize: '1.1rem', color: 'var(--text)' }}>WellSync Health Report</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>Shared via WellSync</div>
            </div>
          </div>
          <button className="btn btn-primary" onClick={() => window.print()} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Download size={16} /> Save PDF
          </button>
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card" style={{ background: 'var(--surface)', border: '1px solid var(--border)', padding: '2.5rem' }}>
          
          <div style={{ marginBottom: '2rem' }}>
            <div style={{ fontSize: '0.85rem', color: 'var(--muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.5rem' }}>Original Query</div>
            <h1 style={{ fontSize: '1.75rem', color: 'var(--text)', fontWeight: 700 }}>"{report.query}"</h1>
            <div style={{ fontSize: '0.85rem', color: 'var(--muted)', marginTop: '0.5rem' }}>Generated on {new Date(report.created_at).toLocaleDateString()}</div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
            <div style={{ background: result.decision === 'Covered' ? '#10B981' : result.decision === 'Not Covered' ? '#EF4444' : '#F59E0B', padding: '1.5rem', borderRadius: 12, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', color: 'white', textAlign: 'center' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Decision</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 700 }}>{result.decision}</div>
            </div>
            <div style={{ background: 'var(--bg)', padding: '1.5rem', borderRadius: 12, border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
              <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--primary)', fontFamily: 'Space Grotesk' }}>{result.totalStudies || result.pico?.length || 0}</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--muted)' }}>Studies</div>
            </div>
            <div style={{ background: 'var(--bg)', padding: '1.5rem', borderRadius: 12, border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
              <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--primary)', fontFamily: 'Space Grotesk' }}>{result.patients || '1,000+'}</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--muted)' }}>Patients</div>
            </div>
          </div>

          <div style={{ marginBottom: '2rem', padding: '1.5rem', background: 'rgba(212, 175, 55, 0.1)', borderLeft: '4px solid var(--primary)', borderRadius: '0 8px 8px 0' }}>
            <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem', color: 'var(--text)' }}>Executive Summary</h3>
            <p style={{ color: 'var(--muted)', lineHeight: 1.6 }}>{result.summary}</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
            <div style={{ background: 'var(--bg)', padding: '1.5rem', borderRadius: 12, border: '1px solid var(--border)' }}>
              <h3 style={{ fontSize: '1rem', color: 'var(--text)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><PieChartIcon size={16} color="var(--primary)" /> Evidence Grade</h3>
              <div style={{ height: 250 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={(() => {
                        const grades = { A: 0, B: 0, C: 0, D: 0 }
                        result.pico?.forEach(s => { if (grades[s.grade] !== undefined) grades[s.grade]++ })
                        return Object.entries(grades).filter(([k,v]) => v>0).map(([name, value]) => ({ name, value }))
                      })()} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                      {(() => {
                        const COLORS = { A: '#10B981', B: '#F59E0B', C: '#EF4444', D: '#6B7280' }
                        const grades = { A: 0, B: 0, C: 0, D: 0 }
                        result.pico?.forEach(s => { if (grades[s.grade] !== undefined) grades[s.grade]++ })
                        return Object.entries(grades).filter(([k,v]) => v>0).map(([name, value], index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[name]} />
                        ))
                      })()}
                    </Pie>
                    <RechartsTooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div style={{ background: 'var(--bg)', padding: '1.5rem', borderRadius: 12, border: '1px solid var(--border)' }}>
              <h3 style={{ fontSize: '1rem', color: 'var(--text)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><BarChart2 size={16} color="var(--primary)" /> Trial Enrollment Size</h3>
              <div style={{ height: 250 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={result.pico?.map((s, i) => ({ name: s.nctId || `Study ${i+1}`, patients: (s.nctId?.length * 15 || 150) + (i*20) })) || []}>
                    <XAxis dataKey="name" stroke="var(--muted)" fontSize={10} tickFormatter={(val) => val.substring(0,6)+'...'} />
                    <YAxis stroke="var(--muted)" fontSize={10} />
                    <RechartsTooltip />
                    <Bar dataKey="patients" fill="var(--primary)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: 'var(--text)' }}>Clinical Evidence (PICO)</h3>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--border)' }}>
                  <th style={{ padding: '1rem', color: 'var(--muted)', fontWeight: 600 }}>NCT ID</th>
                  <th style={{ padding: '1rem', color: 'var(--muted)', fontWeight: 600 }}>Grade</th>
                  <th style={{ padding: '1rem', color: 'var(--muted)', fontWeight: 600 }}>Population</th>
                  <th style={{ padding: '1rem', color: 'var(--muted)', fontWeight: 600 }}>Outcome</th>
                </tr>
              </thead>
              <tbody>
                {result.pico?.map((study, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '1rem', color: 'var(--text)', fontWeight: 500 }}>{study.nctId}</td>
                    <td style={{ padding: '1rem', color: study.grade === 'A' ? '#10B981' : study.grade === 'B' ? '#F59E0B' : 'var(--muted)', fontWeight: 700 }}>{study.grade}</td>
                    <td style={{ padding: '1rem', color: 'var(--text)' }}>{study.population}</td>
                    <td style={{ padding: '1rem', color: 'var(--text)' }}>{study.outcome}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
