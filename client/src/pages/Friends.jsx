import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Sidebar from '../components/layout/Sidebar'
import BottomNav from '../components/layout/BottomNav'
import api from '../services/api'
import toast from 'react-hot-toast'
import { Users, UserPlus, Trophy, Sword, Search, Check, Clock } from 'lucide-react'

export default function Friends() {
  const [friends, setFriends] = useState([])
  const [leaderboard, setLeaderboard] = useState([])
  const [pendingRequests, setPendingRequests] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)

  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', handler)
    fetchData()
    return () => window.removeEventListener('resize', handler)
  }, [])

  const fetchData = async () => {
    try {
      const [friendsRes, leaderboardRes, pendingRes] = await Promise.allSettled([
        api.get('/api/friends'),
        api.get('/api/friends/leaderboard'),
        api.get('/api/friends/pending'),
      ])
      if (friendsRes.status === 'fulfilled') setFriends(friendsRes.value.data)
      if (leaderboardRes.status === 'fulfilled') setLeaderboard(leaderboardRes.value.data)
      if (pendingRes.status === 'fulfilled') setPendingRequests(pendingRes.value.data || [])
    } catch (err) {
      setFriends([])
    }
  }

  const addFriend = async () => {
    if (!searchQuery.trim()) return
    setLoading(true)
    try {
      await api.post('/api/friends/add', { email: searchQuery })
      toast.success(`Friend request sent to ${searchQuery}!`)
      setSearchQuery('')
      fetchData()
    } catch (err) {
      toast.error(err.response?.data?.error || 'User not found or request failed.')
    } finally {
      setLoading(false)
    }
  }

  const acceptRequest = async (requestId) => {
    try {
      await api.patch(`/api/friends/${requestId}/accept`)
      toast.success('Friend request accepted! 🎉')
      fetchData()
    } catch (err) {
      toast.error('Failed to accept request.')
    }
  }

  const getMedalEmoji = (rank) => {
    if (rank === 1) return '🥇'
    if (rank === 2) return '🥈'
    if (rank === 3) return '🥉'
    return `#${rank}`
  }

  const getScoreColor = (score) => {
    if (score >= 80) return '#10B981'
    if (score >= 60) return '#F59E0B'
    if (score >= 40) return '#F97316'
    return '#EF4444'
  }

  return (
    <div style={{ display: 'flex' }}>
      {!isMobile && <Sidebar />}
      <main className="main-content" style={{ flex: 1 }}>
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.375rem' }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: '#818CF820', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Users size={19} color="#818CF8" />
            </div>
            <h1 style={{ fontSize: '1.5rem' }}>Friends & Leaderboard</h1>
          </div>
          <p style={{ color: 'var(--muted)', fontSize: '0.9rem', marginLeft: '3rem' }}>
            Compete with friends on WellScore. No social feed — just a clean weekly leaderboard.
          </p>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '1.25rem' }}>
          {/* Leaderboard */}
          <motion.div className="card" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
              <Trophy size={18} color="#F59E0B" />
              <h3 style={{ fontSize: '1rem' }}>This Week's Leaderboard</h3>
            </div>

            {leaderboard.length === 0 ? (
              <div className="empty-state" style={{ padding: '2.5rem' }}>
                <Users size={36} color="var(--muted)" />
                <p>Add friends to see the leaderboard!</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {leaderboard.map((entry, i) => (
                  <motion.div
                    key={entry.user_id || i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '1rem',
                      padding: '0.875rem 1rem', borderRadius: 12,
                      background: entry.is_me ? 'rgba(99,102,241,0.08)' : (i === 0 ? 'linear-gradient(135deg, #FEF9C3, #FEF3C7)' : 'var(--bg)'),
                      border: entry.is_me ? '1.5px solid #6366F1' : `1.5px solid ${i === 0 ? '#F59E0B40' : 'transparent'}`,
                    }}
                  >
                    <div style={{ width: 32, textAlign: 'center', fontSize: i < 3 ? '1.25rem' : '0.85rem', fontFamily: 'Space Grotesk', fontWeight: 700, color: 'var(--muted)' }}>
                      {getMedalEmoji(i + 1)}
                    </div>
                    <div style={{
                      width: 36, height: 36, borderRadius: 99,
                      background: `linear-gradient(135deg, ${getScoreColor(entry.score)}40, ${getScoreColor(entry.score)}80)`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontFamily: 'Plus Jakarta Sans', fontWeight: 700, fontSize: '0.875rem',
                      color: getScoreColor(entry.score),
                      flexShrink: 0,
                    }}>
                      {entry.name?.[0]?.toUpperCase() || '?'}
                    </div>
                    <div style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
                      <div style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 700, fontSize: '0.9rem' }}>{entry.name || 'Anonymous'}</div>
                      {entry.is_me && (
                        <span style={{ fontSize: '0.65rem', background: '#6366F1', color: 'white', borderRadius: 99, padding: '0.15rem 0.5rem', fontFamily: 'Plus Jakarta Sans', fontWeight: 700, marginLeft: 6 }}>YOU</span>
                      )}
                    </div>
                    <div style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: '1.3rem', color: getScoreColor(entry.score) }}>
                      {entry.score}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Friends + Add */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* Add Friend */}
            <motion.div className="card" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                <UserPlus size={18} color="#818CF8" />
                <h3 style={{ fontSize: '1rem' }}>Add a Friend</h3>
              </div>
              <div style={{ display: 'flex', gap: '0.625rem' }}>
                <div style={{ flex: 1, position: 'relative' }}>
                  <Search size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)' }} />
                  <input
                    className="input"
                    style={{ paddingLeft: '2.5rem' }}
                    placeholder="Enter friend's email address..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && addFriend()}
                  />
                </div>
                <button
                  className="btn btn-primary"
                  onClick={addFriend}
                  disabled={!searchQuery.trim() || loading}
                  style={{ padding: '0.75rem 1rem' }}
                >
                  <UserPlus size={16} />
                </button>
              </div>
            </motion.div>

            {/* Pending Requests */}
            {pendingRequests.length > 0 && (
              <motion.div className="card" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                  <Users size={18} color="#F59E0B" />
                  <h3 style={{ fontSize: '1rem' }}>Pending Requests ({pendingRequests.length})</h3>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                  {pendingRequests.map(req => (
                    <div key={req.id} style={{ display: 'flex', alignItems: 'center', gap: '0.875rem', padding: '0.75rem', background: 'var(--bg)', borderRadius: 10 }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 600, fontSize: '0.875rem' }}>{req.requester?.name || req.requester?.email}</div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--muted)' }}>wants to be friends</div>
                      </div>
                      <button onClick={() => acceptRequest(req.id)} className="btn btn-primary" style={{ padding: '0.5rem 0.75rem', fontSize: '0.75rem' }}>
                        Accept
                      </button>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Friends List */}
            <motion.div className="card" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }}>
              <h3 style={{ fontSize: '1rem', marginBottom: '1rem' }}>Friends ({friends.length})</h3>
              {friends.length === 0 ? (
                <div className="empty-state" style={{ padding: '2rem' }}>
                  <Users size={28} color="var(--muted)" />
                  <p>No friends added yet. Search by username above!</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                  {friends.map((f, i) => (
                    <div key={i} style={{
                      display: 'flex', alignItems: 'center', gap: '0.875rem',
                      padding: '0.75rem', background: 'var(--bg)', borderRadius: 10,
                    }}>
                      <div style={{
                        width: 36, height: 36, borderRadius: 99,
                        background: 'linear-gradient(135deg, #818CF840, #6366F140)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontFamily: 'Plus Jakarta Sans', fontWeight: 700, fontSize: '0.875rem', color: '#4F46E5',
                      }}>
                        {f.friend?.name?.[0]?.toUpperCase() || '?'}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 600, fontSize: '0.875rem' }}>{f.friend?.name || 'Unknown'}</div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--muted)' }}>@{f.friend?.username || 'user'}</div>
                      </div>
                      <div style={{
                        display: 'flex', alignItems: 'center', gap: '0.375rem',
                        padding: '0.25rem 0.625rem', borderRadius: 99, fontSize: '0.7rem',
                        background: f.status === 'accepted' ? '#D1FAE5' : '#FEF3C7',
                        color: f.status === 'accepted' ? '#065F46' : '#92400E',
                        fontWeight: 700,
                      }}>
                        {f.status === 'accepted' ? <><Check size={11} /> Friends</> : <><Clock size={11} /> Pending</>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Challenge card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
              style={{
                background: 'linear-gradient(135deg, #4F46E5, #818CF8)',
                borderRadius: 16, padding: '1.25rem', color: 'white',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <Sword size={16} />
                <span style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 700 }}>Active Challenge</span>
              </div>
              <p style={{ fontSize: '0.875rem', opacity: 0.9, marginBottom: '1rem' }}>
                "Who can hit 80+ WellScore for 7 days straight?"
              </p>
              <button style={{
                background: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.3)',
                borderRadius: 10, padding: '0.5rem 1rem', color: 'white',
                fontFamily: 'Plus Jakarta Sans', fontWeight: 600, fontSize: '0.8rem',
                cursor: 'pointer',
              }}>
                Send Challenge to Friends 🗡️
              </button>
            </motion.div>
          </div>
        </div>
      </main>
      {isMobile && <BottomNav />}
    </div>
  )
}
