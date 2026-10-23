import { BrowserRouter, Routes, Route, Link, useNavigate } from 'react-router-dom'
import FacultyDirectory from './pages/FacultyDirectory'
import TimetableViewer from './pages/TimetableViewer'
import SearchPage from './pages/SearchPage'
import BuildingsPage from './pages/BuildingsPage'
import CampusMap from './pages/CampusMap'
import FloorPlan from './pages/FloorPlan'
import Login from './pages/Login'
import Register from './pages/Register'
import AdminDashboard from './pages/AdminDashboard'
import ProtectedRoute from './components/ProtectedRoute'
import AdminRoute from './components/AdminRoute'
import { isLoggedIn, isAdmin, getName, logout } from './api/auth'

function HomePage() {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-gray-900">Campus Navigator</h1>
      <p className="text-gray-500 mt-1">
        Find faculty cabins, classrooms, and timetables — without the confusion.
      </p>
    </div>
  )
}

function NavBar() {
  const linkClass = "px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100"
  const navigate = useNavigate()
  const loggedIn = isLoggedIn()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav className="border-b border-gray-200 bg-white">
      <div className="max-w-5xl mx-auto px-6 py-3 flex items-center justify-between">
        <div className="flex flex-wrap gap-2">
          <Link to="/" className={linkClass}>Home</Link>
          <Link to="/faculty" className={linkClass}>Faculty Directory</Link>
          <Link to="/timetable" className={linkClass}>Timetable</Link>
          <Link to="/search" className={linkClass}>Search</Link>
          <Link to="/buildings" className={linkClass}>Buildings</Link>
          <Link to="/map" className={linkClass}>Campus Map</Link>
          {isAdmin() && <Link to="/admin" className={linkClass}>Admin</Link>}
        </div>
        <div className="flex items-center gap-3">
          {loggedIn ? (
            <>
              <span className="text-sm text-gray-500 hidden sm:inline">Hi, {getName()}</span>
              <button
                onClick={handleLogout}
                className="text-sm text-gray-500 hover:text-gray-700 border border-gray-300 rounded-lg px-3 py-1.5"
              >
                Log out
              </button>
            </>
          ) : (
            <Link to="/login" className="text-sm bg-blue-600 text-white rounded-lg px-3 py-1.5 hover:bg-blue-700">
              Log in
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <NavBar />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
          <Route path="/faculty" element={<ProtectedRoute><FacultyDirectory /></ProtectedRoute>} />
          <Route path="/timetable" element={<ProtectedRoute><TimetableViewer /></ProtectedRoute>} />
          <Route path="/search" element={<ProtectedRoute><SearchPage /></ProtectedRoute>} />
          <Route path="/buildings" element={<ProtectedRoute><BuildingsPage /></ProtectedRoute>} />
          <Route path="/map" element={<ProtectedRoute><CampusMap /></ProtectedRoute>} />
          <Route
            path="/buildings/:buildingId/floor-plan"
            element={<ProtectedRoute><FloorPlan /></ProtectedRoute>}
          />

          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App