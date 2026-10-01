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
