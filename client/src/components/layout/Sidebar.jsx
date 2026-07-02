import { NavLink, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { LayoutDashboard, Brain, Dumbbell, Salad, Moon, 
  Activity, Sparkles, MessageCircle, Users, User,
  LogOut, ChevronLeft, ChevronRight, TrendingUp, Sun,
  Search, Network, Bell, ShieldAlert, FileText
} from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useTheme } from '../../context/ThemeContext'
import { usePWA } from '../../hooks/usePWA'

const navSections = [
  {
    title: 'OVERVIEW',
    items: [
      { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
      { to: '/progress', icon: TrendingUp, label: 'Progress', color: '#818CF8' },
    ]
  },
  {
    title: 'HEALTH PILLARS',
    items: [
      { to: '/mental', icon: Brain, label: 'Mental', color: '#818CF8' },
      { to: '/fitness', icon: Dumbbell, label: 'Fitness', color: '#F97316' },
      { to: '/nutrition', icon: Salad, label: 'Nutrition', color: '#22C55E' },
      { to: '/sleep', icon: Moon, label: 'Sleep', color: '#6366F1' },
      { to: '/vitals', icon: Activity, label: 'Vitals', color: '#EF4444' },
      { to: '/wellness', icon: Sparkles, label: 'Wellness', color: '#F59E0B' },
    ]
  },
  {
    title: 'CLINICAL INTEL',
    items: [
      { to: '/evidence', icon: Search, label: 'Evidence Search', color: '#10B981' },
      { to: '/frontiers', icon: Network, label: '7 Frontiers', color: '#8B5CF6' },
      { to: '/alerts', icon: Bell, label: 'Intelligence Hub', color: '#EF4444' },
      { to: '/drug-interaction', icon: ShieldAlert, label: 'Drug Interaction', color: '#F97316' },
      { to: '/cost-analysis', icon: FileText, label: 'Cost Analysis', color: '#F59E0B' },
    ]
  },
  {
    title: 'SOCIAL & MORE',
    items: [
      { to: '/chat', icon: MessageCircle, label: 'WellBot', color: '#22C55E' },
      { to: '/friends', icon: Users, label: 'Friends', color: '#6366F1' },
      { to: '/profile', icon: User, label: 'Profile' },
    ]
  },
]

export default function Sidebar() {
  const { signOut, profile } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const navigate = useNavigate()
  const [collapsed, setCollapsed] = useState(false)
  const { isInstallable, install } = usePWA()

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
        background: 'var(--surface)',
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
            style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 800, fontSize: '1.1rem', color: 'var(--text)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            WellSync
          </motion.span>
        )}
      </div>

      {/* Nav Items */}
      <nav style={{ flex: 1, overflowY: 'auto', padding: '0.75rem 0.5rem', display: 'flex', flexDirection: 'column', gap: 0 }}>
        {navSections.map(section => (
          <div key={section.title} style={{ marginBottom: '0.5rem' }}>
            {!collapsed && (
              <div style={{ fontSize: '0.6rem', fontFamily: 'Plus Jakarta Sans', fontWeight: 800, color: 'var(--muted)', letterSpacing: '0.1em', padding: '0.5rem 0.75rem 0.25rem', textTransform: 'uppercase' }}>
                {section.title}
              </div>
            )}
            {section.items.map(({ to, icon: Icon, label, color }) => (
              <NavLink
                key={to}
                to={to}
                style={({ isActive }) => ({
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.5rem 0.75rem',
                  borderRadius: 10,
                  textDecoration: 'none',
                  transition: 'all 0.15s',
                  background: isActive ? (color ? `${color}18` : 'rgba(99,102,241,0.12)') : 'transparent',
                  color: isActive ? (color || '#818CF8') : 'var(--muted)',
                  fontFamily: 'Plus Jakarta Sans',
                  fontWeight: isActive ? 700 : 500,
                  fontSize: '0.85rem',
                  marginBottom: 2,
                })}
              >
                {({ isActive }) => (
                  <>
                    <div style={{
                      width: 30, height: 30, borderRadius: 8, flexShrink: 0,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      background: isActive ? (color ? `${color}25` : 'rgba(99,102,241,0.18)') : 'transparent',
                      transition: 'all 0.15s',
                    }}>
                      <Icon size={16} color={isActive ? (color || '#818CF8') : 'var(--muted)'} />
                    </div>
                    {!collapsed && <span style={{ whiteSpace: 'nowrap' }}>{label}</span>}
                    {isActive && !collapsed && (
                      <div style={{ marginLeft: 'auto', width: 5, height: 5, borderRadius: 99, background: color || '#818CF8', flexShrink: 0 }} />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </div>
        ))}

      </nav>

      {/* Bottom section */}
      <div style={{ padding: '0.75rem 0.5rem', borderTop: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: 4 }}>
        
        {/* PWA Install */}
        {isInstallable && (
          <button
            onClick={install}
            style={{
              display: 'flex', alignItems: 'center', gap: '0.75rem',
              padding: '0.625rem 0.75rem', borderRadius: 10, width: '100%',
              background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.1), rgba(99, 102, 241, 0.1))', 
              border: '1px solid rgba(79, 70, 229, 0.2)', cursor: 'pointer',
              color: '#4F46E5', fontSize: '0.875rem', fontFamily: 'Plus Jakarta Sans', fontWeight: 700,
              transition: 'all 0.15s', marginBottom: '0.25rem'
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(79, 70, 229, 0.15)' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'linear-gradient(135deg, rgba(79, 70, 229, 0.1), rgba(99, 102, 241, 0.1))' }}
          >
            <LayoutDashboard size={17} />
            {!collapsed && <span>Install App</span>}
          </button>
        )}

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          style={{
            display: 'flex', alignItems: 'center', gap: '0.75rem',
            padding: '0.625rem 0.75rem', borderRadius: 10, width: '100%',
            background: 'transparent', border: 'none', cursor: 'pointer',
            color: 'var(--muted)', fontSize: '0.875rem', fontFamily: 'Plus Jakarta Sans', fontWeight: 500,
            transition: 'all 0.15s',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg)'; e.currentTarget.style.color = 'var(--primary)' }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--muted)' }}
        >
          {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
          {!collapsed && <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>}
        </button>

        <button
          onClick={handleSignOut}
          style={{
            display: 'flex', alignItems: 'center', gap: '0.75rem',
            padding: '0.625rem 0.75rem', borderRadius: 10, width: '100%',
            background: 'transparent', border: 'none', cursor: 'pointer',
            color: 'var(--muted)', fontSize: '0.875rem', fontFamily: 'Plus Jakarta Sans', fontWeight: 500,
            transition: 'all 0.15s',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = '#FEE2E2'; e.currentTarget.style.color = '#EF4444' }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--muted)' }}
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
