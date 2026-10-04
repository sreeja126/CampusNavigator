import apiClient from './client'

export async function getBuildings() {
  const res = await apiClient.get('/api/buildings/')
  return res.data
}

export async function getBuilding(id) {
  const res = await apiClient.get(`/api/buildings/${id}`)
  return res.data
}