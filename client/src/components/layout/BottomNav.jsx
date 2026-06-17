import { NavLink } from 'react-router-dom'
import { LayoutDashboard, Brain, Dumbbell, Salad, Moon, Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'

const items = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Home' },
  { to: '/mental', icon: Brain, label: 'Mental', color: '#818CF8' },
  { to: '/fitness', icon: Dumbbell, label: 'Fitness', color: '#F97316' },
  { to: '/nutrition', icon: Salad, label: 'Nutrition', color: '#22C55E' },
  { to: '/wellness', icon: Sparkles, label: 'Wellness', color: '#F59E0B' },
]

export default function BottomNav() {
  return (
    <nav style={{
      position: 'fixed', bottom: 0, left: 0, right: 0,
      background: 'rgba(255,255,255,0.9)',
      backdropFilter: 'blur(20px)',
      borderTop: '1px solid var(--border)',
      display: 'flex', alignItems: 'center', justifyContent: 'space-around',
      padding: '0.5rem 0 max(0.5rem, env(safe-area-inset-bottom))',
      zIndex: 1000,
    }}>
      {items.map(({ to, icon: Icon, label, color }) => (
        <NavLink
          key={to}
          to={to}
          style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
        >
          {({ isActive }) => (
            <motion.div
              whileTap={{ scale: 0.9 }}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, padding: '0.375rem 0.75rem' }}
            >
              <div style={{
                width: isActive ? 40 : 32, height: isActive ? 28 : 28,
                borderRadius: isActive ? 14 : 8,
                background: isActive ? (color ? `${color}20` : 'rgba(99,102,241,0.12)') : 'transparent',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 0.2s',
              }}>
                <Icon size={18} color={isActive ? (color || '#4F46E5') : '#94A3B8'} />
              </div>
              <span style={{
                fontSize: '0.6rem', fontFamily: 'Plus Jakarta Sans', fontWeight: 600,
                color: isActive ? (color || '#4F46E5') : '#94A3B8',
                transition: 'color 0.2s',
              }}>
                {label}
              </span>
            </motion.div>
          )}
        </NavLink>
      ))}
    </nav>
  )
}
