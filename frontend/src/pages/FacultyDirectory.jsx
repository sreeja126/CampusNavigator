  import { useEffect, useState } from 'react'
  import { getFacultyList } from '../api/faculty'
  import FacultyCard from '../components/FacultyCard'
  
  function FacultyDirectory() {
    const [faculty, setFaculty] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [search, setSearch] = useState('')
    const [department, setDepartment] = useState('')
  
    useEffect(() => {
      setLoading(true)
      setError(null)
  
      getFacultyList({ q: search || undefined, department: department || undefined })
        .then((data) => setFaculty(data))
        .catch(() => setError('Could not load faculty. Is the backend running?'))
        .finally(() => setLoading(false))
    }, [search, department])
  
    // Departments derived from loaded data, for the filter dropdown
    const departments = [...new Set(faculty.map((f) => f.department))]
  
    return (
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Faculty Directory</h1>
        <p className="text-gray-500 mb-6">Find a faculty member and their cabin location.</p>
  
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <input
            type="text"
            placeholder="Search by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <select
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="">All departments</option>
            {departments.map((dep) => (
              <option key={dep} value={dep}>{dep}</option>
            ))}
          </select>
        </div>
  
        {loading && <p className="text-gray-500">Loading faculty...</p>}
        {error && <p className="text-red-500">{error}</p>}
  
        {!loading && !error && faculty.length === 0 && (
          <p className="text-gray-500">No faculty found.</p>
        )}
  
        <div className="grid sm:grid-cols-2 gap-4">
          {faculty.map((f) => (
            <FacultyCard key={f.id} faculty={f} />
          ))}
        </div>
      </div>
    )
  }
  
  export default FacultyDirectory
  