import { useState } from 'react'
import { motion } from 'framer-motion'
import Sidebar from '../components/layout/Sidebar'
import BottomNav from '../components/layout/BottomNav'
import { useAuth } from '../context/AuthContext'
import { exportToCSV } from '../utils/reportGenerator'
import api from '../services/api'
import toast from 'react-hot-toast'
import { User, Target, Shield, Download, LogOut, Edit3, Save, Network } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const InfoRow = ({ label, value }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 0', borderBottom: '1px solid var(--border)' }}>
    <span style={{ fontSize: '0.85rem', color: 'var(--muted)', fontWeight: 600 }}>{label}</span>
    <span style={{ fontSize: '0.875rem', color: '#0F172A', fontWeight: 500 }}>{value || '—'}</span>
  </div>
)

export default function Profile() {
  const { profile, updateProfile, signOut, toggleRole } = useAuth()
  const navigate = useNavigate()
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({
    name: profile?.name || '',
    age: profile?.age || '',
    gender: profile?.gender || '',
  })
  const [loading, setLoading] = useState(false)
  const isMobile = window.innerWidth < 768

  const handleSave = async () => {
    setLoading(true)
    try {
      await updateProfile(form)
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
      toast.success('Data exported as CSV!')
    } catch {
      toast.error('Export failed. Try again.')
    }
  }

  const handleSignOut = async () => {
    await signOut()
    navigate('/auth')
  }

  return (
    <div style={{ display: 'flex' }}>
      {!isMobile && <Sidebar />}
      <main className="main-content" style={{ flex: 1, maxWidth: 700 }}>
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '1.5rem' }}>Profile & Settings</h1>
          <p style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>Manage your health profile, goals, and account settings.</p>
        </motion.div>

        {/* Avatar + name */}
        <motion.div
          className="card"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: '1.25rem' }}
        >
          <div style={{
            width: 64, height: 64, borderRadius: 99, flexShrink: 0,
            background: 'linear-gradient(135deg, #818CF8, #4F46E5)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'Plus Jakarta Sans', fontWeight: 800, fontSize: '1.5rem', color: 'white',
          }}>
            {profile?.name?.[0]?.toUpperCase() || '?'}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 800, fontSize: '1.2rem' }}>{profile?.name || 'Complete your profile'}</div>
            <div style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>{profile?.email || ''}</div>
          </div>
          <button
            onClick={() => editing ? handleSave() : setEditing(true)}
            className="btn btn-secondary"
            disabled={loading}
            style={{ fontSize: '0.8rem' }}
          >
            {editing ? <><Save size={14} /> Save</> : <><Edit3 size={14} /> Edit</>}
          </button>
        </motion.div>

        {/* Personal Info */}
        <motion.div className="card" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} style={{ marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '1rem' }}>
            <User size={17} color="#4F46E5" />
            <h3 style={{ fontSize: '1rem' }}>Personal Information</h3>
          </div>
          {editing ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--muted)', display: 'block', marginBottom: '0.375rem' }}>Name</label>
                <input className="input" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.875rem' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--muted)', display: 'block', marginBottom: '0.375rem' }}>Age</label>
                  <input className="input" type="number" value={form.age} onChange={e => setForm({ ...form, age: e.target.value })} />
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
        <motion.div className="card" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} style={{ marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '1rem' }}>
            <Target size={17} color="#22C55E" />
            <h3 style={{ fontSize: '1rem' }}>Health Goals</h3>
          </div>
          <InfoRow label="Fitness Goal" value={profile?.health_goals?.fitness} />
          <InfoRow label="Calorie Target" value={profile?.health_goals?.calorie_target ? `${profile.health_goals.calorie_target} kcal/day` : null} />
          <InfoRow label="Protein Target" value={profile?.health_goals?.protein_target ? `${profile.health_goals.protein_target}g/day` : null} />
          <InfoRow label="Water Goal" value={profile?.health_goals?.water_glasses ? `${profile.health_goals.water_glasses} glasses/day` : null} />
          <button className="btn btn-secondary" style={{ width: '100%', marginTop: '0.875rem', fontSize: '0.85rem' }} onClick={() => navigate('/onboarding')}>
            Update Goals
          </button>
        </motion.div>

        {/* Data & Account */}
        <motion.div className="card" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '1.25rem' }}>
            <Shield size={17} color="#F59E0B" />
            <h3 style={{ fontSize: '1rem' }}>Data & Account</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <button
              className="btn btn-secondary"
              style={{ width: '100%', justifyContent: 'flex-start', gap: '0.75rem' }}
              onClick={async () => {
                try {
                  await toggleRole()
                  toast.success(`Switched to ${profile.role === 'provider' ? 'Patient' : 'Provider'} Mode`)
                } catch {
                  toast.error('Failed to switch roles')
                }
              }}
            >
              <Network size={16} color="var(--primary)" />
              Switch to {profile?.role === 'provider' ? 'Patient' : 'Provider'} Mode
            </button>
            <button
              className="btn btn-secondary"
              style={{ width: '100%', justifyContent: 'flex-start', gap: '0.75rem' }}
              onClick={handleExport}
            >
              <Download size={16} color="#22C55E" />
              Export All Data as CSV
            </button>
            <button
              className="btn"
              style={{ width: '100%', justifyContent: 'flex-start', gap: '0.75rem', background: '#FEE2E2', color: '#EF4444', border: '1.5px solid #EF444440' }}
              onClick={handleSignOut}
            >
              <LogOut size={16} />
              Sign Out
            </button>
          </div>
          <p style={{ fontSize: '0.7rem', color: 'var(--muted)', marginTop: '1rem', textAlign: 'center' }}>
            WellSync — ₹0 cost · Built with React, Node.js, Supabase & Gemini AI
          </p>
        </motion.div>
      </main>
      {isMobile && <BottomNav />}
    </div>
  )
}
