import React from 'react'

interface KpiCardProps {
  title: string
  number: number | string
  trend?: number // positive = up, negative = down, omitted = neutral
}

export const KpiCard: React.FC<KpiCardProps> = ({
  title,
  number,
  trend = 0,
}) => {
  const trendClass = trend > 0 ? 'trend-up' : trend < 0 ? 'trend-down' : 'trend-neutral'
  return (
    <div
      className="kpi-card bg-white rounded-lg p-6 shadow-sm border border-gray-200"
    >
      <p className="text-sm text-gray-500 uppercase mb-1">{title}</p>
      <p className="text-3xl font-bold text-gray-900">{number}</p>
      {trend !== undefined && (
        <span className={`trend ${trendClass} text-sm inline-block ml-2`}>
          {trend > 0 ? '▲' : trend < 0 ? '▼' : '—'} {Math.abs(trend).toFixed(1)}%
        </span>
      )}
    </div>
  )
}