function StatusBadge({ status }) {
  if (!status) return null

  if (status.status === 'in_class') {
    return (
      <div className="inline-flex items-center gap-1 bg-green-50 text-green-700 text-xs font-medium px-2 py-1 rounded-full">
        🟢 In class — {status.location} ({status.subject}) until {status.until}
      </div>
    )
  }

  if (status.status === 'in_cabin') {
    return (
      <div className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 text-xs font-medium px-2 py-1 rounded-full">
        🔵 In cabin — {status.location}
      </div>
    )
  }

  return (
    <div className="inline-flex items-center gap-1 bg-gray-100 text-gray-500 text-xs font-medium px-2 py-1 rounded-full">
      ⚪ Status unknown
    </div>
  )
}

export default StatusBadge