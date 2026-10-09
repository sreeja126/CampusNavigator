function RoomHotspot({ room, onClick, isActive }) {
  const x = room.x_percent ?? 50
  const y = room.y_percent ?? 50

  const typeColor = {
    lab: 'bg-purple-500 border-purple-600',
    classroom: 'bg-blue-500 border-blue-600',
    cabin: 'bg-amber-500 border-amber-600',
    other: 'bg-gray-500 border-gray-600',
  }[room.room_type] || 'bg-gray-500 border-gray-600'

  return (
    <button
      onClick={() => onClick(room)}
      style={{ left: `${x}%`, top: `${y}%` }}
      className="absolute -translate-x-1/2 -translate-y-1/2 group"
    >
      <div
        className={`w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-md border-2 transition-transform
          ${typeColor} ${isActive ? 'scale-125 ring-2 ring-offset-2 ring-blue-400' : 'group-hover:scale-110'}`}
      >
        📍
      </div>
      <span className="absolute left-1/2 -translate-x-1/2 top-8 text-[11px] font-medium text-gray-700 bg-white/90 px-1.5 py-0.5 rounded shadow-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
        {room.room_no}
      </span>
    </button>
  )
}

export default RoomHotspot