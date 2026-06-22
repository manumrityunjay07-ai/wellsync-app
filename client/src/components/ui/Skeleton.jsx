/**
 * Reusable Skeleton loading component with shimmer animation.
 * Uses CSS variables so it works in both dark and light mode.
 */

export function Skeleton({ width = '100%', height = 16, borderRadius = 8, style = {} }) {
  return (
    <div
      className="skeleton"
      style={{ width, height, borderRadius, flexShrink: 0, ...style }}
    />
  )
}

export function SkeletonCard({ rows = 3 }) {
  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <Skeleton height={20} width="60%" />
      {Array.from({ length: rows }).map((_, i) => (
        <Skeleton key={i} height={14} width={i % 2 === 0 ? '90%' : '75%'} />
      ))}
    </div>
  )
}

export function SkeletonPillarGrid() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem' }}>
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <Skeleton height={40} width={40} borderRadius={10} />
          <Skeleton height={14} width="50%" />
          <Skeleton height={28} width="60%" />
          <Skeleton height={8} borderRadius={99} />
        </div>
      ))}
    </div>
  )
}

export function SkeletonList({ rows = 4 }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="card" style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <Skeleton width={40} height={40} borderRadius={10} />
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <Skeleton height={14} width="70%" />
            <Skeleton height={12} width="50%" />
          </div>
        </div>
      ))}
    </div>
  )
}

export default Skeleton
