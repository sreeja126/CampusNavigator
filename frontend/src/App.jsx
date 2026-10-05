import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import FacultyDirectory from './pages/FacultyDirectory'
import TimetableViewer from './pages/TimetableViewer'
import SearchPage from './pages/SearchPage'
import BuildingsPage from './pages/BuildingsPage'
import CampusMap from './pages/CampusMap'

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

  return (
    <nav className="border-b border-gray-200 bg-white">
      <div className="max-w-4xl mx-auto px-6 py-3 flex gap-2">
        <Link to="/" className={linkClass}>Home</Link>
        <Link to="/faculty" className={linkClass}>Faculty Directory</Link>
        <Link to="/timetable" className={linkClass}>Timetable</Link>
        <Link to="/search" className={linkClass}>Search</Link>
        <Link to="/buildings" className={linkClass}>Buildings</Link>
        <Link to="/map" className={linkClass}>Campus Map</Link>
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
          <Route path="/" element={<HomePage />} />
          <Route path="/faculty" element={<FacultyDirectory />} />
          <Route path="/timetable" element={<TimetableViewer />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/buildings" element={<BuildingsPage />} />
          <Route path="/map" element={<CampusMap />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App