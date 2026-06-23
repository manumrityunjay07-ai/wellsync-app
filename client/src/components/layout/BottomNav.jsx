import { NavLink } from 'react-router-dom'
import { LayoutDashboard, Brain, Dumbbell, TrendingUp, Salad, Download } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { usePWA } from '../../hooks/usePWA'

const items = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Home' },
  { to: '/mental', icon: Brain, label: 'Mental', color: '#818CF8' },
  { to: '/fitness', icon: Dumbbell, label: 'Fitness', color: '#F97316' },
  { to: '/nutrition', icon: Salad, label: 'Nutrition', color: '#22C55E' },
  { to: '/progress', icon: TrendingUp, label: 'Progress', color: '#818CF8' },
]

export default function BottomNav() {
  const { isInstallable, install } = usePWA()
  
  return (
    <>
      <AnimatePresence>
        {isInstallable && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            onClick={install}
            style={{
              position: 'fixed', bottom: 'calc(max(0.5rem, env(safe-area-inset-bottom)) + 65px)', left: '50%', transform: 'translateX(-50%)',
              background: 'linear-gradient(135deg, #4F46E5, #818CF8)', color: 'white',
              border: 'none', borderRadius: 99, padding: '0.625rem 1.25rem',
              display: 'flex', alignItems: 'center', gap: '0.5rem',
              fontFamily: 'Plus Jakarta Sans', fontWeight: 700, fontSize: '0.85rem',
              boxShadow: '0 4px 14px rgba(79, 70, 229, 0.4)', zIndex: 1000, cursor: 'pointer'
            }}
          >
            <Download size={16} />
            Install App
          </motion.button>
        )}
      </AnimatePresence>

      <nav style={{
        position: 'fixed', bottom: 0, left: 0, right: 0,
        background: 'var(--surface)',
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
              whileTap={{ scale: 0.85 }}
              transition={{ type: 'spring', stiffness: 400, damping: 17 }}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, padding: '0.375rem 0.75rem', position: 'relative' }}
            >
              {/* Active indicator pill */}
              {isActive && (
                <motion.div
                  layoutId="bottomNavPill"
                  style={{
                    position: 'absolute', top: 0, left: '50%',
                    transform: 'translateX(-50%)',
                    width: 32, height: 3, borderRadius: 99,
                    background: color || 'var(--primary)',
                  }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              )}

              <div style={{
                width: isActive ? 44 : 32, height: 28,
                borderRadius: isActive ? 14 : 8,
                background: isActive ? (color ? `${color}20` : 'rgba(212,175,55,0.15)') : 'transparent',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)',
              }}>
                <Icon size={18} color={isActive ? (color || 'var(--primary)') : 'var(--muted)'} />
              </div>

              <span style={{
                fontSize: '0.6rem', fontFamily: 'Plus Jakarta Sans', fontWeight: 700,
                color: isActive ? (color || 'var(--primary)') : 'var(--muted)',
                transition: 'color 0.2s',
              }}>
                {label}
              </span>
            </motion.div>
          )}
        </NavLink>
      ))}
      </nav>
    </>
  )
}
