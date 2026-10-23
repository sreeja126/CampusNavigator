import apiClient from './client'

const TOKEN_KEY = 'cn_token'
const ROLE_KEY = 'cn_role'
const NAME_KEY = 'cn_name'

function storeSession(data) {
  localStorage.setItem(TOKEN_KEY, data.access_token)
  localStorage.setItem(ROLE_KEY, data.role)
  localStorage.setItem(NAME_KEY, data.name)
}

export async function registerUser(name, studentId, password) {
  const res = await apiClient.post('/api/auth/register', { name, student_id: studentId, password })
  storeSession(res.data)
  return res.data
}

export async function loginUser(studentId, password) {
  const res = await apiClient.post('/api/auth/login', { student_id: studentId, password })
  storeSession(res.data)
  return res.data
}

export async function loginAdmin(username, password) {
  const res = await apiClient.post('/api/auth/admin-login', { username, password })
  storeSession(res.data)
  return res.data
}

export function logout() {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(ROLE_KEY)
  localStorage.removeItem(NAME_KEY)
}

export function isLoggedIn() {
  return !!localStorage.getItem(TOKEN_KEY)
}

export function isAdmin() {
  return localStorage.getItem(ROLE_KEY) === 'admin'
}

export function getName() {
  return localStorage.getItem(NAME_KEY) || ''
}