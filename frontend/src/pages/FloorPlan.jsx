  import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getBuilding } from '../api/buildings'
import { getRooms } from '../api/rooms'
import { getRoomLiveInfo } from '../api/search'
import RoomHotspot from '../components/RoomHotspot'
import RoomPopup from '../components/RoomPopup'

function FloorPlan() {
  const { buildingId } = useParams()

  const [building, setBuilding] = useState(null)
  const [rooms, setRooms] = useState([])
  const [floor, setFloor] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [selectedRoom, setSelectedRoom] = useState(null)
  const [liveInfo, setLiveInfo] = useState(undefined)

  useEffect(() => {
    setLoading(true)
    setError(null)
    Promise.all([getBuilding(buildingId), getRooms({ buildingId })])
      .then(([buildingData, roomsData]) => {
        setBuilding(buildingData)
        setRooms(roomsData)
        const floors = [...new Set(roomsData.map((r) => r.floor))].sort((a, b) => a - b)
        if (floors.length > 0) setFloor(floors[0])
      })
      .catch(() => setError('Could not load this building. Is the backend running?'))
      .finally(() => setLoading(false))
  }, [buildingId])

  const handleRoomClick = async (room) => {
    setSelectedRoom(room)
    setLiveInfo(undefined)
    try {
      const info = await getRoomLiveInfo(room.room_no)
      setLiveInfo(info)
    } catch {
      setLiveInfo({ current_subject: null, current_faculty_name: null })
    }
  }

  const floors = [...new Set(rooms.map((r) => r.floor))].sort((a, b) => a - b)
  const roomsOnFloor = rooms.filter((r) => r.floor === floor)
  const hasFloorPlanImage = !!building?.floor_plan_image_url

  return (
    <div className="max-w-5xl mx-auto p-6">
      <Link to="/map" className="text-sm text-blue-600 hover:underline">
        ← Back to campus map
      </Link>

      {loading && <p className="text-gray-500 mt-4">Loading...</p>}
      {error && <p className="text-red-500 mt-4">{error}</p>}

      {!loading && !error && building && (
        <>
          <h1 className="text-2xl font-bold text-gray-900 mt-2 mb-1">{building.name}</h1>
          <p className="text-gray-500 mb-6">{building.description}</p>

          {floors.length > 1 && (
            <div className="flex gap-2 mb-6">
              {floors.map((f) => (
                <button
                  key={f}
                  onClick={() => { setFloor(f); setSelectedRoom(null) }}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
                    floor === f
                      ? 'bg-blue-600 text-white'
                      : 'bg-white border border-gray-300 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  Floor {f}
                </button>
              ))}
            </div>
          )}

          <div className="grid md:grid-cols-[2fr_1fr] gap-6">
            {hasFloorPlanImage ? (
              // --- True floor plan with image + hotspots ---
              <div className="relative w-full rounded-2xl border border-gray-200 overflow-hidden">
                <img
                  src={building.floor_plan_image_url}
                  alt={`${building.name} floor ${floor} plan`}
                  className="w-full h-auto block"
                />
                {roomsOnFloor.map((r) => (
                  <RoomHotspot
                    key={r.id}
                    room={r}
                    onClick={handleRoomClick}
                    isActive={selectedRoom?.id === r.id}
                  />
                ))}
              </div>
            ) : (
              // --- Fallback: grid of room cards when no floor plan image is set yet ---
              <div>
                <p className="text-sm text-gray-400 mb-3">
                  No floor plan image uploaded yet for this building — showing rooms as a list instead.
                </p>
                <div className="grid sm:grid-cols-2 gap-3">
                  {roomsOnFloor.map((r) => (
                    <button
                      key={r.id}
                      onClick={() => handleRoomClick(r)}
                      className={`text-left bg-white border rounded-xl p-3 hover:shadow-sm transition-shadow ${
                        selectedRoom?.id === r.id ? 'border-blue-400 ring-1 ring-blue-200' : 'border-gray-200'
                      }`}
                    >
                      <p className="font-medium text-gray-900">📍 {r.room_no}</p>
                      <p className="text-xs text-gray-500">{r.room_type}</p>
                    </button>
                  ))}
                  {roomsOnFloor.length === 0 && (
                    <p className="text-sm text-gray-400">No rooms on this floor yet.</p>
                  )}
                </div>
              </div>
            )}

            {/* Side panel — room details */}
            <div>
              {!selectedRoom && (
                <div className="bg-white border border-gray-200 rounded-xl p-4">
                  <p className="text-gray-400 text-sm">Select a room to see its details and photo.</p>
                </div>
              )}
              {selectedRoom && (
                <RoomPopup
                  room={selectedRoom}
                  liveInfo={liveInfo}
                  onClose={() => setSelectedRoom(null)}
                />
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default FloorPlan