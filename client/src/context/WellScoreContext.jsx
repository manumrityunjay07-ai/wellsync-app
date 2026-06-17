import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { useAuth } from './AuthContext'
import api from '../services/api'

const WellScoreContext = createContext(null)

export function WellScoreProvider({ children }) {
  const { user } = useAuth()
  const [todayScore, setTodayScore] = useState(null)
  const [scoreHistory, setScoreHistory] = useState([])
  const [loading, setLoading] = useState(false)

  const calculateScore = useCallback(async () => {
    if (!user) return
    try {
      setLoading(true)
      const { data } = await api.post('/api/ai/well-score')
      setTodayScore(data)
      return data
    } catch (err) {
      console.error('Error calculating WellScore:', err)
    } finally {
      setLoading(false)
    }
  }, [user])

  const fetchTodayScore = useCallback(async () => {
    if (!user) return
    try {
      setLoading(true)
      const { data } = await api.get('/api/wellness/score')
      if (data) {
        setTodayScore(data)
      } else {
        const result = await calculateScore()
        setTodayScore(result)
      }
    } catch (err) {
      console.error('Error fetching WellScore:', err)
    } finally {
      setLoading(false)
    }
  }, [user, calculateScore])

  const fetchHistory = useCallback(async (days = 30) => {
    if (!user) return
    try {
      const { data } = await api.get(`/api/wellness/history?days=${days}`)
      setScoreHistory(data)
    } catch (err) {
      console.error('Error fetching score history:', err)
    }
  }, [user])



  useEffect(() => {
    if (user) {
      fetchTodayScore()
      fetchHistory()
    }
  }, [user, fetchTodayScore, fetchHistory])

  const getStatusInfo = (score) => {
    if (!score && score !== 0) return { label: 'N/A', color: '#94A3B8', cssClass: '' }
    if (score >= 80) return { label: 'Thriving 🟢', color: '#10B981', cssClass: 'status-thriving' }
    if (score >= 60) return { label: 'Doing Well 🟡', color: '#F59E0B', cssClass: 'status-good' }
    if (score >= 40) return { label: 'Needs Attention 🟠', color: '#F97316', cssClass: 'status-attention' }
    return { label: 'Take Action 🔴', color: '#EF4444', cssClass: 'status-action' }
  }

  return (
    <WellScoreContext.Provider value={{
      todayScore,
      scoreHistory,
      loading,
      fetchTodayScore,
      fetchHistory,
      calculateScore,
      getStatusInfo,
    }}>
      {children}
    </WellScoreContext.Provider>
  )
}

export function useWellScore() {
  const context = useContext(WellScoreContext)
  if (!context) throw new Error('useWellScore must be used within WellScoreProvider')
  return context
}
