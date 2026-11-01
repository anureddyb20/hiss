import React from 'react'

interface StatusBadgeProps {
  status: 'new' | 'open' | 'pending' | 'resolved' | 'closed'
}

const statusClasses: Record<StatusBadgeProps['status'], string> = {
  new: 'bg-blue-100 text-blue-800',
  open: 'bg-green-100 text-green-800',
  pending: 'bg-yellow-100 text-yellow-800',
  resolved: 'bg-teal-100 text-teal-800',
  closed: 'bg-gray-100 text-gray-800',
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const classes = statusClasses[status]
  return <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ${classes}`}>{status}</span>
}