function BuildingPin({ building, onClick, isActive }) {
  const x = building.map_x_percent ?? 50
  const y = building.map_y_percent ?? 50

  return (
    <button
      onClick={() => onClick(building)}
      style={{ left: `${x}%`, top: `${y}%` }}
      className={`absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group`}
    >
      <div
        className={`w-9 h-9 rounded-full flex items-center justify-center text-white font-semibold text-sm shadow-md border-2 transition-transform
          ${isActive ? 'bg-blue-600 border-blue-700 scale-110' : 'bg-blue-500 border-white group-hover:scale-110'}`}
      >
        {building.name?.[6] /* letter after "Block " e.g. "A" */ || '?'}
      </div>
      <span className="mt-1 text-xs font-medium text-gray-700 bg-white/80 px-1.5 py-0.5 rounded shadow-sm whitespace-nowrap">
        {building.name}
      </span>
    </button>
  )
}

export default BuildingPin