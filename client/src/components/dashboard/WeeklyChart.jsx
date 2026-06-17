import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer
} from 'recharts'
import { format } from 'date-fns'

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div style={{
        background: 'white', border: '1px solid var(--border)',
        borderRadius: 10, padding: '0.75rem 1rem',
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
      }}>
        <div style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 600, fontSize: '0.8rem', color: 'var(--muted)', marginBottom: '0.25rem' }}>
          {label}
        </div>
        <div style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: '1.2rem', color: '#4F46E5' }}>
          {payload[0].value}
        </div>
        <div style={{ fontSize: '0.7rem', color: 'var(--muted)' }}>WellScore</div>
      </div>
    )
  }
  return null
}

export default function WeeklyChart({ data = [] }) {
  const chartData = data.map(d => ({
    day: format(new Date(d.calculated_at || d.date), 'EEE'),
    score: d.score,
  }))

  if (chartData.length === 0) {
    return (
      <div className="empty-state" style={{ height: 160 }}>
        <p style={{ fontSize: '0.85rem' }}>No score history yet. Log your first day to see your trend!</p>
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={160}>
      <AreaChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#6366F1" stopOpacity={0.2} />
            <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
        <XAxis dataKey="day" tick={{ fontSize: 11, fill: 'var(--muted)', fontFamily: 'Plus Jakarta Sans' }} axisLine={false} tickLine={false} />
        <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: 'var(--muted)' }} axisLine={false} tickLine={false} />
        <Tooltip content={<CustomTooltip />} />
        <Area
          type="monotone"
          dataKey="score"
          stroke="#6366F1"
          strokeWidth={2.5}
          fill="url(#scoreGrad)"
          dot={{ fill: '#6366F1', strokeWidth: 0, r: 4 }}
          activeDot={{ r: 6, fill: '#4F46E5' }}
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}
