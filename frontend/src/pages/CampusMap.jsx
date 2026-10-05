   import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getBuildings } from '../api/buildings'
import { getRooms } from '../api/rooms'
import BuildingPin from '../components/BuildingPin'

function CampusMap() {
  const [buildings, setBuildings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [selected, setSelected] = useState(null)
  const [selectedRooms, setSelectedRooms] = useState([])
  const [roomsLoading, setRoomsLoading] = useState(false)

  useEffect(() => {
    getBuildings()
      .then(setBuildings)
      .catch(() => setError('Could not load buildings. Is the backend running?'))
      .finally(() => setLoading(false))
  }, [])

  const handlePinClick = async (building) => {
    setSelected(building)
    setRoomsLoading(true)
    try {
      const rooms = await getRooms({ buildingId: building.id })
      setSelectedRooms(rooms)
    } catch {
      setSelectedRooms([])
    } finally {
      setRoomsLoading(false)
    }
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Campus Map</h1>
      <p className="text-gray-500 mb-6">
        Click a building to see what's inside. (Placeholder layout — swap in a real campus image anytime.)
      </p>

      {loading && <p className="text-gray-500">Loading map...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && (
        <div className="grid md:grid-cols-[2fr_1fr] gap-6">
          {/* The map itself */}
          <div
            className="relative w-full rounded-2xl border border-gray-200 overflow-hidden"
            style={{
              aspectRatio: '4 / 3',
              backgroundImage:
                'linear-gradient(0deg, rgba(0,0,0,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.04) 1px, transparent 1px)',
              backgroundSize: '40px 40px',
              backgroundColor: '#f0fdf4', // soft green, like campus greenery
            }}
          >
            {buildings.map((b) => (
              <BuildingPin
                key={b.id}
                building={b}
                onClick={handlePinClick}
                isActive={selected?.id === b.id}
              />
            ))}
          </div>

          {/* Side panel showing selected building's rooms */}
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            {!selected && (
              <p className="text-gray-400 text-sm">Select a building to see details here.</p>
            )}

            {selected && (
              <>
                <h2 className="font-semibold text-gray-900">{selected.name}</h2>
                {selected.description && (
                  <p className="text-sm text-gray-500 mb-3">{selected.description}</p>
                )}

                {roomsLoading && <p className="text-sm text-gray-400">Loading rooms...</p>}

                {!roomsLoading && selectedRooms.length === 0 && (
                  <p className="text-sm text-gray-400">No rooms recorded for this building yet.</p>
                )}

                {!roomsLoading && selectedRooms.length > 0 && (
                  <ul className="space-y-2 mt-2">
                    {selectedRooms.map((r) => (
                      <li
                        key={r.id}
                        className="flex items-center justify-between text-sm border border-gray-100 rounded-lg px-3 py-2"
                      >
                        <span className="font-medium text-gray-700">📍 {r.room_no}</span>
                        <span className="text-gray-400 text-xs">
                          Floor {r.floor} · {r.room_type}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}

                <Link
                  to="/buildings"
                  className="inline-block mt-4 text-sm text-blue-600 hover:underline"
                >
                  View all buildings →
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default CampusMap