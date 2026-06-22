import { NavLink, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  LayoutDashboard, Brain, Dumbbell, Salad, Moon, 
  Activity, Sparkles, MessageCircle, Users, User,
  LogOut, ChevronLeft, ChevronRight, FileSearch, Network, Bell, Pill, DollarSign
} from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/alerts', icon: Bell, label: 'Intelligence Hub', color: '#EF4444' },
  { to: '/evidence', icon: FileSearch, label: 'Payer Intel', color: '#D4AF37' },
  { to: '/drug-interaction', icon: Pill, label: 'Drug Interactions', color: '#8B5CF6' },
  { to: '/cost-analysis', icon: DollarSign, label: 'Cost Analysis', color: '#10B981' },
  { to: '/frontiers', icon: Network, label: '7 Frontiers', color: '#10B981' },
  { to: '/mental', icon: Brain, label: 'Mental', color: '#818CF8' },
  { to: '/fitness', icon: Dumbbell, label: 'Fitness', color: '#F97316' },
  { to: '/nutrition', icon: Salad, label: 'Nutrition', color: '#22C55E' },
  { to: '/sleep', icon: Moon, label: 'Sleep', color: '#6366F1' },
  { to: '/vitals', icon: Activity, label: 'Vitals', color: '#EF4444' },
  { to: '/wellness', icon: Sparkles, label: 'Wellness', color: '#F59E0B' },
  { to: '/chat', icon: MessageCircle, label: 'WellBot' },
  { to: '/friends', icon: Users, label: 'Friends' },
  { to: '/profile', icon: User, label: 'Profile' },
]

export default function Sidebar() {
  const { signOut, profile } = useAuth()
  const navigate = useNavigate()
  const [collapsed, setCollapsed] = useState(false)

  const handleSignOut = async () => {
    await signOut()
    navigate('/auth')
  }

  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 72 : 240 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      style={{
        height: '100vh',
        background: '#ffffff',
        borderRight: '1px solid var(--border)',
        display: 'flex',
        flexDirection: 'column',
        position: 'sticky',
        top: 0,
        overflow: 'hidden',
        zIndex: 100,
        flexShrink: 0,
      }}
    >
      {/* Logo */}
      <div style={{ padding: '1.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.75rem', borderBottom: '1px solid var(--border)' }}>
        <div style={{
          width: 36, height: 36, borderRadius: 10, flexShrink: 0,
          background: 'linear-gradient(135deg, #818CF8, #6366F1)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Sparkles size={18} color="white" />
        </div>
        {!collapsed && (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 800, fontSize: '1.1rem', color: '#0F172A' }}
          >
            WellSync
          </motion.span>
        )}
      </div>

      {/* Nav Items */}
      <nav style={{ flex: 1, overflowY: 'auto', padding: '1rem 0.5rem', display: 'flex', flexDirection: 'column', gap: 2 }}>
        {navItems.map(({ to, icon: Icon, label, color }) => {
          return (
            <NavLink
              key={to}
              to={to}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.625rem 0.75rem',
                borderRadius: 10,
                textDecoration: 'none',
                transition: 'all 0.15s',
                background: isActive ? 'linear-gradient(135deg, rgba(99,102,241,0.1), rgba(79,70,229,0.1))' : 'transparent',
                color: isActive ? '#4F46E5' : '#64748B',
                fontFamily: 'Plus Jakarta Sans',
                fontWeight: isActive ? 600 : 500,
                fontSize: '0.875rem',
              })}
            >
              {({ isActive }) => (
                <>
                  <div style={{
                    width: 32, height: 32, borderRadius: 8, flexShrink: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: isActive ? (color ? `${color}20` : 'rgba(99,102,241,0.15)') : 'transparent',
                  }}>
                    <Icon size={17} color={isActive ? (color || '#4F46E5') : '#94A3B8'} />
                  </div>
                  {!collapsed && <span style={{ whiteSpace: 'nowrap' }}>{label}</span>}
                  {isActive && !collapsed && (
                    <motion.div
                      layoutId="sidebar-indicator"
                      style={{
                        marginLeft: 'auto', width: 4, height: 4, borderRadius: 99,
                        background: color || '#4F46E5',
                      }}
                    />
                  )}
                </>
              )}
            </NavLink>
          )
        })}
      </nav>

      {/* Bottom section */}
      <div style={{ padding: '0.75rem 0.5rem', borderTop: '1px solid var(--border)' }}>
        <button
          onClick={handleSignOut}
          style={{
            display: 'flex', alignItems: 'center', gap: '0.75rem',
            padding: '0.625rem 0.75rem', borderRadius: 10, width: '100%',
            background: 'transparent', border: 'none', cursor: 'pointer',
            color: '#94A3B8', fontSize: '0.875rem', fontFamily: 'Plus Jakarta Sans', fontWeight: 500,
            transition: 'all 0.15s',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = '#FEE2E2'; e.currentTarget.style.color = '#EF4444' }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#94A3B8' }}
        >
          <LogOut size={17} />
          {!collapsed && <span>Sign Out</span>}
        </button>
      </div>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        style={{
          position: 'absolute', bottom: 70, right: -12,
          width: 24, height: 24, borderRadius: 99,
          background: '#ffffff', border: '1px solid var(--border)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        }}
      >
        {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
      </button>
    </motion.aside>
  )
}
