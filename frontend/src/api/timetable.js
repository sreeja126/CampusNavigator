import apiClient from './client'

export async function getClassSections() {
  const res = await apiClient.get('/api/timetable/class-sections')
  return res.data
}

export async function getTimetable({ classSection, facultyId } = {}) {
  const params = {}
  if (classSection) params.class_section = classSection
  if (facultyId) params.faculty_id = facultyId

  const res = await apiClient.get('/api/timetable/', { params })
  return res.data
}

export async function uploadTimetable(file) {
  const formData = new FormData()
  formData.append('file', file)

  const res = await apiClient.post('/api/timetable/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return res.data
}