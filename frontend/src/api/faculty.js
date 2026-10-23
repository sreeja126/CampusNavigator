import apiClient from './client'

export async function getFacultyList({ department, q } = {}) {
  const params = {}
  if (department) params.department = department
  if (q) params.q = q

  const res = await apiClient.get('/api/faculty/', { params })
  return res.data
}

export async function getFacultyById(id) {
  const res = await apiClient.get(`/api/faculty/${id}`)
  return res.data
}

export async function createFaculty(data) {
  const res = await apiClient.post('/api/faculty/', data)
  return res.data
}

export async function updateFaculty(id, data) {
  const res = await apiClient.patch(`/api/faculty/${id}`, data)
  return res.data
}

export async function deleteFaculty(id) {
  await apiClient.delete(`/api/faculty/${id}`)
}