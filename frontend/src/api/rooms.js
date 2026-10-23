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

export async function createRoom(data) {
  const res = await apiClient.post('/api/rooms/', data)
  return res.data
}

export async function updateRoom(id, data) {
  const res = await apiClient.patch(`/api/rooms/${id}`, data)
  return res.data
}

export async function deleteRoom(id) {
  await apiClient.delete(`/api/rooms/${id}`)
}