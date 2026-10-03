import apiClient from './client'

export async function searchAll(q) {
  const res = await apiClient.get('/api/search/', { params: { q } })
  return res.data
}

export async function getFacultyStatus(facultyId) {
  const res = await apiClient.get(`/api/faculty/${facultyId}/status`)
  return res.data
}