import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Sidebar from '../components/layout/Sidebar'
import BottomNav from '../components/layout/BottomNav'
import api from '../services/api'
import { MessageCircle, Send, Bot, User, Sparkles } from 'lucide-react'

const WELCOME_MSG = {
  id: 'welcome',
  role: 'bot',
  text: "Hi! I'm WellBot 👋 Your personal AI health assistant. Ask me anything about your health data, or anything health-related!\n\nFor example:\n• \"Is my blood pressure reading normal?\"\n• \"What should I eat today?\"\n• \"Why do I feel tired even after 8 hours of sleep?\"",
  time: new Date(),
}

const SUGGESTIONS = [
  'Is my blood pressure normal?',
  'What should I eat today?',
  'Why am I feeling low energy?',
  'How is my sleep this week?',
]

export default function Chat() {
  const [messages, setMessages] = useState([WELCOME_MSG])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [healthSummary, setHealthSummary] = useState(null)
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)
  const bottomRef = useRef(null)

  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', handler)
    fetchHealthSummary()
    return () => window.removeEventListener('resize', handler)
  }, [])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const fetchHealthSummary = async () => {
    try {
      const { data } = await api.get('/api/wellness/score')
      setHealthSummary(data)
    } catch (err) {
      setHealthSummary(null)
    }
  }

  const sendMessage = async (text) => {
    const msg = text || input.trim()
    if (!msg || loading) return

    setInput('')
    const userMsg = { id: Date.now(), role: 'user', text: msg, time: new Date() }
    setMessages(prev => [...prev, userMsg])
    setLoading(true)

    try {
      const { data } = await api.post('/api/ai/chat', { message: msg })
      setMessages(prev => [...prev, { id: Date.now() + 1, role: 'bot', text: data.response, time: new Date() }])
    } catch (err) {
      setMessages(prev => [...prev, {
        id: Date.now() + 1, role: 'bot',
        text: 'I\'m having trouble connecting right now. Please try again later.',
        time: new Date()
      }])
    } finally {
      setLoading(false)
    }
  }

  const formatTime = (t) => t.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })

  return (
    <div style={{ display: 'flex' }}>
      {!isMobile && <Sidebar />}
      <main style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        height: isMobile ? 'calc(100vh - 64px)' : '100vh',
        overflow: 'hidden',
      }}>
        {/* Header */}
        <div style={{
          padding: '1.5rem 2rem', borderBottom: '1px solid var(--border)',
          background: 'white', flexShrink: 0,
          display: 'flex', alignItems: 'center', gap: '0.875rem',
        }}>
          <div style={{
            width: 42, height: 42, borderRadius: 14,
            background: 'linear-gradient(135deg, #818CF8, #4F46E5)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Bot size={20} color="white" />
          </div>
          <div>
            <h1 style={{ fontSize: '1.1rem', color: '#0F172A' }}>WellBot</h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
              <div style={{ width: 7, height: 7, borderRadius: 99, background: '#10B981' }} />
              <span style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>AI Health Assistant · Powered by Gemini</span>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem 2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Suggestions */}
          {messages.length <= 1 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.5rem' }}>
              {SUGGESTIONS.map(s => (
                <button key={s} onClick={() => sendMessage(s)}
                  style={{
                    padding: '0.5rem 0.875rem', borderRadius: 99, fontSize: '0.78rem',
                    fontFamily: 'Plus Jakarta Sans', fontWeight: 600, cursor: 'pointer',
                    border: '1.5px solid #818CF840', background: '#818CF810', color: '#4F46E5',
                    transition: 'all 0.15s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = '#818CF820'}
                  onMouseLeave={e => e.currentTarget.style.background = '#818CF810'}
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          <AnimatePresence>
            {messages.map(msg => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                  display: 'flex',
                  flexDirection: msg.role === 'user' ? 'row-reverse' : 'row',
                  gap: '0.75rem',
                  alignItems: 'flex-end',
                }}
              >
                {/* Avatar */}
                <div style={{
                  width: 32, height: 32, borderRadius: 99, flexShrink: 0,
                  background: msg.role === 'bot' ? 'linear-gradient(135deg, #818CF8, #4F46E5)' : 'linear-gradient(135deg, #10B981, #059669)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {msg.role === 'bot' ? <Bot size={15} color="white" /> : <User size={15} color="white" />}
                </div>

                {/* Bubble */}
                <div style={{ maxWidth: '75%' }}>
                  <div style={{
                    padding: '0.875rem 1.125rem',
                    borderRadius: msg.role === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                    background: msg.role === 'user' ? 'linear-gradient(135deg, #4F46E5, #6366F1)' : 'white',
                    color: msg.role === 'user' ? 'white' : '#0F172A',
                    border: msg.role === 'bot' ? '1px solid var(--border)' : 'none',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                    fontSize: '0.875rem',
                    lineHeight: 1.6,
                    whiteSpace: 'pre-wrap',
                  }}>
                    {msg.text}
                  </div>
                  <div style={{ fontSize: '0.65rem', color: 'var(--muted)', marginTop: '0.25rem', textAlign: msg.role === 'user' ? 'right' : 'left', paddingLeft: msg.role === 'bot' ? '0.5rem' : 0, paddingRight: msg.role === 'user' ? '0.5rem' : 0 }}>
                    {formatTime(msg.time)}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Loading indicator */}
          {loading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'flex', alignItems: 'flex-end', gap: '0.75rem' }}>
              <div style={{ width: 32, height: 32, borderRadius: 99, background: 'linear-gradient(135deg, #818CF8, #4F46E5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Bot size={15} color="white" />
              </div>
              <div style={{ background: 'white', border: '1px solid var(--border)', borderRadius: '18px 18px 18px 4px', padding: '0.875rem 1.25rem', display: 'flex', gap: '4px' }}>
                {[0, 1, 2].map(i => (
                  <motion.div key={i} style={{ width: 7, height: 7, borderRadius: 99, background: '#818CF8' }}
                    animate={{ y: [-3, 3, -3] }} transition={{ repeat: Infinity, duration: 0.8, delay: i * 0.15 }} />
                ))}
              </div>
            </motion.div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div style={{
          padding: '1rem 2rem', borderTop: '1px solid var(--border)',
          background: 'white', flexShrink: 0,
        }}>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-end' }}>
            <textarea
              className="input"
              placeholder="Ask WellBot anything about your health..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() } }}
              rows={1}
              style={{ resize: 'none', flex: 1, paddingRight: '1rem' }}
            />
            <button
              onClick={() => sendMessage()}
              disabled={!input.trim() || loading}
              style={{
                width: 44, height: 44, borderRadius: 12, border: 'none', cursor: 'pointer',
                background: input.trim() ? 'linear-gradient(135deg, #4F46E5, #6366F1)' : 'var(--border)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 0.2s', flexShrink: 0,
              }}
            >
              <Send size={17} color={input.trim() ? 'white' : 'var(--muted)'} />
            </button>
          </div>
          <p style={{ fontSize: '0.65rem', color: 'var(--muted)', marginTop: '0.375rem', textAlign: 'center' }}>
            WellBot uses your health data for context. Press Enter to send, Shift+Enter for new line.
          </p>
        </div>
      </main>
      {isMobile && <BottomNav />}
    </div>
  )
}
