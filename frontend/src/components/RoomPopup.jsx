function RoomPopup({ room, liveInfo, onClose }) {
  if (!room) return null

  const typeLabel = {
    lab: '🧪 Lab',
    classroom: '🏫 Classroom',
    cabin: '🚪 Cabin',
    other: '📍 Room',
  }[room.room_type] || '📍 Room'

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
      {room.photo_url ? (
        <img
          src={room.photo_url}
          alt={room.room_no}
          className="w-full h-40 object-cover"
        />
      ) : (
        <div className="w-full h-40 bg-gray-100 flex items-center justify-center text-gray-400 text-sm">
          No photo added yet
        </div>
      )}

      <div className="p-4">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-semibold text-gray-900">{room.room_no}</h3>
            <p className="text-sm text-gray-500">
              {typeLabel} · Floor {room.floor}
            </p>
          </div>
          {onClose && (
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-sm">
              ✕
            </button>
          )}
        </div>

        <div className="mt-3">
          {liveInfo === undefined && (
            <p className="text-sm text-gray-400">Checking current status...</p>
          )}
          {liveInfo && liveInfo.current_subject ? (
            <p className="text-sm text-green-700">
              🟢 Ongoing: {liveInfo.current_subject}
              {liveInfo.current_faculty_name && ` — ${liveInfo.current_faculty_name}`}
            </p>
          ) : (
            liveInfo !== undefined && (
              <p className="text-sm text-gray-500">No class in session right now</p>
            )
          )}
        </div>
      </div>
    </div>
  )
}

export default RoomPopup