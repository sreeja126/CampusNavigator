const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

function formatTime(t) {
  if (!t) return ''
  return t.slice(0, 5) // "09:00:00" -> "09:00"
}

function TimetableGrid({ entries }) {
  const periods = [...new Set(entries.map((e) => e.period_number))].sort((a, b) => a - b)

  const cellFor = (day, period) =>
    entries.find((e) => e.day_of_week === day && e.period_number === period)

  if (entries.length === 0) {
    return <p className="text-gray-500">No timetable entries found for this selection.</p>
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border-collapse text-sm">
        <thead>
          <tr>
            <th className="text-left p-2 bg-gray-100 border border-gray-200 font-semibold text-gray-600">
              Period
            </th>
            {DAYS.map((day) => (
              <th
                key={day}
                className="text-left p-2 bg-gray-100 border border-gray-200 font-semibold text-gray-600"
              >
                {day}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {periods.map((period) => (
            <tr key={period}>
              <td className="p-2 border border-gray-200 font-medium text-gray-700 bg-gray-50">
                {period}
              </td>
              {DAYS.map((day) => {
                const cell = cellFor(day, period)
                return (
                  <td key={day} className="p-2 border border-gray-200 align-top min-w-[140px]">
                    {cell ? (
                      <div>
                        <p className="font-medium text-gray-900">{cell.subject}</p>
                        <p className="text-xs text-gray-500">
                          {formatTime(cell.start_time)}–{formatTime(cell.end_time)}
                        </p>
                        {cell.room_no && (
                          <p className="text-xs text-gray-500">📍 {cell.room_no}</p>
                        )}
                        {cell.faculty_name && (
                          <p className="text-xs text-blue-600">{cell.faculty_name}</p>
                        )}
                      </div>
                    ) : (
                      <span className="text-gray-300">—</span>
                    )}
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default TimetableGrid