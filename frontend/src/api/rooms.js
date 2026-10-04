import apiClient from './client'

export async function getRooms({ buildingId, floor, roomType } = {}) {
  const params = {}
  if (buildingId !== undefined) params.building_id = buildingId
  if (floor !== undefined) params.floor = floor
  if (roomType) params.room_type = roomType

  const res = await apiClient.get('/api/rooms/', { params })
  return res.data
}

export async function getRoom(id) {
  const res = await apiClient.get(`/api/rooms/${id}`)
  return res.data
}