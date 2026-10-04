import { useEffect, useState } from 'react'
import { getBuildings } from '../api/buildings'
import { getRooms } from '../api/rooms'

function BuildingsPage() {
  const [buildings, setBuildings] = useState([])
  const [roomsByBuilding, setRoomsByBuilding] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    getBuildings()
      .then(async (data) => {
        setBuildings(data)
        // Fetch rooms for each building in parallel
        const entries = await Promise.all(
          data.map(async (b) => {
            const rooms = await getRooms({ buildingId: b.id })
            return [b.id, rooms]
          })
        )
        setRoomsByBuilding(Object.fromEntries(entries))
      })
      .catch(() => setError('Could not load buildings. Is the backend running?'))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Buildings</h1>
      <p className="text-gray-500 mb-6">
        Campus buildings and their rooms — data layer for the upcoming campus map.
      </p>

      {loading && <p className="text-gray-500">Loading buildings...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && buildings.length === 0 && (
        <p className="text-gray-500">
          No buildings yet — run <code>python -m app.seed_buildings</code> in the backend.
        </p>
      )}

      <div className="space-y-4">
        {buildings.map((b) => (
          <div key={b.id} className="bg-white border border-gray-200 rounded-xl p-4">
            <h2 className="font-semibold text-gray-900">{b.name}</h2>
            {b.description && <p className="text-sm text-gray-500 mb-3">{b.description}</p>}

            <div className="flex flex-wrap gap-2">
              {(roomsByBuilding[b.id] || []).map((r) => (
                <span
                  key={r.id}
                  className="inline-flex items-center gap-1 bg-gray-50 border border-gray-200 text-gray-700 text-xs font-medium px-2 py-1 rounded-full"
                >
                  📍 {r.room_no}
                  <span className="text-gray-400">({r.room_type})</span>
                </span>
              ))}
              {(roomsByBuilding[b.id] || []).length === 0 && (
                <span className="text-sm text-gray-400">No rooms yet</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default BuildingsPage