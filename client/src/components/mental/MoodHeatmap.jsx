import { useMemo } from 'react'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay, isToday } from 'date-fns'

const moodColors = {
  happy: '#22C55E',
  calm: '#818CF8',
  excited: '#F59E0B',
  neutral: '#94A3B8',
  tired: '#6366F1',
  sad: '#60A5FA',
  anxious: '#F97316',
  frustrated: '#EF4444',
}

export default function MoodHeatmap({ logs = [], month = new Date() }) {
  const days = useMemo(() => {
    const start = startOfMonth(month)
    const end = endOfMonth(month)
    return eachDayOfInterval({ start, end })
  }, [month])

  const logMap = useMemo(() => {
    const m = {}
    logs.forEach(log => {
      const key = format(new Date(log.logged_at), 'yyyy-MM-dd')
      m[key] = log
    })
    return m
  }, [logs])

  const firstDayOfWeek = getDay(startOfMonth(month))
  const blanks = Array(firstDayOfWeek).fill(null)

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  return (
    <div className="card">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
        <h3 style={{ fontSize: '1rem' }}>Mood Calendar</h3>
        <span style={{ fontSize: '0.8rem', color: 'var(--muted)', fontFamily: 'Plus Jakarta Sans', fontWeight: 600 }}>
          {format(month, 'MMMM yyyy')}
        </span>
      </div>

      {/* Week headers */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4, marginBottom: 6 }}>
        {weekDays.map(d => (
          <div key={d} style={{ textAlign: 'center', fontSize: '0.65rem', color: 'var(--muted)', fontFamily: 'Plus Jakarta Sans', fontWeight: 600 }}>
            {d}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4 }}>
        {blanks.map((_, i) => <div key={`blank-${i}`} />)}
        {days.map(day => {
          const key = format(day, 'yyyy-MM-dd')
          const log = logMap[key]
          const color = log ? (moodColors[log.mood] || '#94A3B8') : null
          const today = isToday(day)

          return (
            <div
              key={key}
              title={log ? `${format(day, 'd')}: ${log.mood} (stress: ${log.stress_level})` : format(day, 'd')}
              style={{
                aspectRatio: '1',
                borderRadius: 6,
                background: color || 'var(--bg)',
                border: `1.5px solid ${today ? '#6366F1' : color ? 'transparent' : 'var(--border)'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: log ? 'pointer' : 'default',
                transition: 'transform 0.15s',
                opacity: color ? 1 : 0.5,
              }}
              onMouseEnter={e => color && (e.currentTarget.style.transform = 'scale(1.15)')}
              onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
            >
              <span style={{ fontSize: '0.6rem', color: color ? 'white' : 'var(--muted)', fontWeight: 700 }}>
                {format(day, 'd')}
              </span>
            </div>
          )
        })}
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginTop: '1rem' }}>
        {Object.entries(moodColors).map(([mood, color]) => (
          <div key={mood} style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <div style={{ width: 10, height: 10, borderRadius: 3, background: color }} />
            <span style={{ fontSize: '0.65rem', color: 'var(--muted)', textTransform: 'capitalize' }}>{mood}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
