import apiClient from './client'

export async function searchAll(q) {
  const res = await apiClient.get('/api/search/', { params: { q } })
  return res.data
}

export async function getFacultyStatus(facultyId) {
  const res = await apiClient.get(`/api/faculty/${facultyId}/status`)
  return res.data
}

export async function getRoomLiveInfo(roomNo) {
  const data = await searchAll(roomNo)
  // search matches by substring, so find the exact room number match
  const exact = data.rooms.find((r) => r.room_no === roomNo)
  return exact || { room_no: roomNo, current_subject: null, current_faculty_name: null }
}