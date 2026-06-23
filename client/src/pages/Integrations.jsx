import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Smartphone, Activity, RefreshCw, CheckCircle2, Plus, Zap, AlertCircle } from 'lucide-react'
import api from '../services/api'
import toast from 'react-hot-toast'

const integrationsList = [
  {
    id: 'apple_health',
    name: 'Apple Health',
    description: 'Sync steps, workouts, sleep, and vitals from your iPhone and Apple Watch.',
    color: '#FF2D55',
    icon: <Activity size={24} color="#FF2D55" />
  },
  {
    id: 'google_fit',
    name: 'Google Fit',
    description: 'Import activities, heart rate, and daily movements from Android devices.',
    color: '#4285F4',
    icon: <Smartphone size={24} color="#4285F4" />
  },
  {
    id: 'oura',
    name: 'Oura Ring',
    description: 'Advanced sleep staging, readiness scores, and temperature trends.',
    color: '#000000',
    icon: <div style={{ width: 24, height: 24, borderRadius: '50%', border: '3px solid #000' }} />
  },
  {
    id: 'fitbit',
    name: 'Fitbit',
    description: 'All-day activity tracking, workouts, and sleep scores from Fitbit wearables.',
    color: '#00B0B9',
    icon: <Activity size={24} color="#00B0B9" />
  }
]

export default function Integrations() {
  const [connected, setConnected] = useState({ apple_health: true }) // Mock starting with one connected
  const [syncing, setSyncing] = useState(null)
  const [connecting, setConnecting] = useState(null)

  const handleToggleConnect = (id) => {
    if (connected[id]) {
      // Disconnect
      setConnected(prev => ({ ...prev, [id]: false }))
      toast.success('Device disconnected.')
    } else {
      // Connect (Mock OAuth)
      setConnecting(id)
      setTimeout(() => {
        setConnected(prev => ({ ...prev, [id]: true }))
        setConnecting(null)
        toast.success('Successfully connected device!')
      }, 1500)
    }
  }

  const handleSync = async (id, name) => {
    if (!connected[id]) return
    setSyncing(id)

    try {
      // Create some mock data
      const mockFitness = {
        exercise_name: 'Running',
        duration_mins: 45,
        calories_burned: 420,
        intensity: 'high',
        notes: `Synced from ${name}`
      }
      
      const mockSleep = {
        duration_hrs: 7.5,
        quality_rating: 4,
        restedness_rating: 4,
        notes: `Auto-detected by ${name}`
      }

      await api.post('/api/fitness/log', mockFitness)
      await api.post('/api/sleep/log', mockSleep)

      toast.success(`${name} data synced successfully!`)
    } catch (err) {
      toast.error('Failed to sync device data.')
    } finally {
      setSyncing(null)
    }
  }

  return (
    <div className="page fade-in">
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Zap size={32} color="var(--primary)" />
          Device Integrations
        </h1>
        <p style={{ color: 'var(--muted)', fontSize: '1.1rem', maxWidth: 600 }}>
          Connect your favorite wearables and health platforms. WellSync will automatically import and analyze your data to give you real-time insights.
        </p>
      </div>

      <div className="grid-2">
        {integrationsList.map(device => {
          const isConnected = connected[device.id]
          const isSyncing = syncing === device.id
          const isConnecting = connecting === device.id

          return (
            <motion.div
              key={device.id}
              whileHover={{ y: -2 }}
              className="card"
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '1.5rem',
                border: isConnected ? `1px solid ${device.color}40` : '1px solid var(--border)',
                background: isConnected ? `linear-gradient(to bottom right, var(--surface), ${device.color}08)` : 'var(--surface)'
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <div style={{
                    width: 50, height: 50, borderRadius: 14,
                    background: `${device.color}15`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}>
                    {device.icon}
                  </div>
                  {isConnected && (
                    <span className="pill" style={{ background: `${device.color}15`, color: device.color }}>
                      <CheckCircle2 size={14} /> Connected
                    </span>
                  )}
                </div>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>{device.name}</h3>
                <p style={{ color: 'var(--muted)', fontSize: '0.9rem', lineHeight: 1.5 }}>
                  {device.description}
                </p>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', paddingTop: '1rem', borderTop: '1px solid var(--border)' }}>
                {isConnected ? (
                  <>
                    <button
                      className="btn"
                      onClick={() => handleSync(device.id, device.name)}
                      disabled={isSyncing}
                      style={{
                        flex: 1,
                        background: 'var(--text)',
                        color: 'var(--bg)',
                      }}
                    >
                      {isSyncing ? <RefreshCw size={18} className="spin" /> : <RefreshCw size={18} />}
                      {isSyncing ? 'Syncing...' : 'Sync Now'}
                    </button>
                    <button
                      className="btn btn-secondary"
                      onClick={() => handleToggleConnect(device.id)}
                      style={{ borderColor: 'var(--border)', color: 'var(--text)' }}
                    >
                      Disconnect
                    </button>
                  </>
                ) : (
                  <button
                    className="btn btn-primary"
                    onClick={() => handleToggleConnect(device.id)}
                    disabled={isConnecting}
                    style={{ flex: 1, background: device.color }}
                  >
                    {isConnecting ? <RefreshCw size={18} className="spin" /> : <Plus size={18} />}
                    {isConnecting ? 'Connecting...' : 'Connect'}
                  </button>
                )}
              </div>
            </motion.div>
          )
        })}
      </div>
      
      <div className="card" style={{ marginTop: '2rem', background: 'rgba(59, 130, 246, 0.05)', borderColor: 'rgba(59, 130, 246, 0.2)' }}>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
          <AlertCircle size={24} color="#3B82F6" style={{ flexShrink: 0 }} />
          <div>
            <h4 style={{ fontSize: '1rem', marginBottom: '0.25rem', color: '#3B82F6' }}>How syncing works</h4>
            <p style={{ fontSize: '0.9rem', color: 'var(--muted)', lineHeight: 1.5 }}>
              WellSync pulls your recent data directly from connected APIs securely. For demonstration purposes, clicking "Sync Now" will immediately generate and inject mock Fitness and Sleep data into your timeline. Go check your Home dashboard after syncing!
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
