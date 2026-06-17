import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider, useAuth } from './context/AuthContext'
import { WellScoreProvider } from './context/WellScoreContext'

// Pages
import Landing from './pages/Landing'
import Auth from './pages/Auth'
import Onboarding from './pages/Onboarding'
import Dashboard from './pages/Dashboard'
import Mental from './pages/Mental'
import Fitness from './pages/Fitness'
import Nutrition from './pages/Nutrition'
import Sleep from './pages/Sleep'
import Vitals from './pages/Vitals'
import Wellness from './pages/Wellness'
import Chat from './pages/Chat'
import Friends from './pages/Friends'
import Profile from './pages/Profile'
import Privacy from './pages/Privacy'
import Terms from './pages/Terms'
import ResetPassword from './pages/ResetPassword'

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return (
    <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{
          width: 48, height: 48, borderRadius: 14, margin: '0 auto 1rem',
          background: 'linear-gradient(135deg, #818CF8, #4F46E5)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          animation: 'pulse 1.5s ease-in-out infinite',
        }}>
          <span style={{ color: 'white', fontSize: '1.5rem' }}>✨</span>
        </div>
        <p style={{ color: 'var(--muted)', fontFamily: 'Plus Jakarta Sans', fontWeight: 600 }}>Loading WellSync...</p>
      </div>
    </div>
  )
  if (!user) return <Navigate to="/auth" replace />
  return children
}

function AppRoutes() {
  const { user } = useAuth()
  return (
    <Routes>
      <Route path="/" element={user ? <Navigate to="/dashboard" /> : <Landing />} />
      <Route path="/auth" element={user ? <Navigate to="/dashboard" /> : <Auth />} />
      <Route path="/reset-password" element={user ? <Navigate to="/dashboard" /> : <ResetPassword />} />
      <Route path="/privacy" element={<Privacy />} />
      <Route path="/terms" element={<Terms />} />
      <Route path="/onboarding" element={<ProtectedRoute><Onboarding /></ProtectedRoute>} />
      <Route path="/dashboard" element={<ProtectedRoute><WellScoreProvider><Dashboard /></WellScoreProvider></ProtectedRoute>} />
      <Route path="/mental" element={<ProtectedRoute><Mental /></ProtectedRoute>} />
      <Route path="/fitness" element={<ProtectedRoute><Fitness /></ProtectedRoute>} />
      <Route path="/nutrition" element={<ProtectedRoute><Nutrition /></ProtectedRoute>} />
      <Route path="/sleep" element={<ProtectedRoute><Sleep /></ProtectedRoute>} />
      <Route path="/vitals" element={<ProtectedRoute><Vitals /></ProtectedRoute>} />
      <Route path="/wellness" element={<ProtectedRoute><WellScoreProvider><Wellness /></WellScoreProvider></ProtectedRoute>} />
      <Route path="/chat" element={<ProtectedRoute><Chat /></ProtectedRoute>} />
      <Route path="/friends" element={<ProtectedRoute><Friends /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  )
}

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              fontFamily: 'Plus Jakarta Sans',
              fontWeight: 600,
              fontSize: '0.875rem',
              borderRadius: '12px',
              border: '1px solid var(--border)',
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            },
            success: { iconTheme: { primary: '#10B981', secondary: 'white' } },
            error: { iconTheme: { primary: '#EF4444', secondary: 'white' } },
          }}
        />
      </AuthProvider>
    </Router>
  )
}
