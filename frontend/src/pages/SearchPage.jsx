  import { useState } from 'react'
import { searchAll } from '../api/search'
import StatusBadge from '../components/StatusBadge'

function SearchPage() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [searched, setSearched] = useState(false)

  const handleSearch = async (e) => {
    e.preventDefault()
    if (!query.trim()) return

    setLoading(true)
    setError(null)
    setSearched(true)
    try {
      const data = await searchAll(query.trim())
      setResults(data)
    } catch {
      setError('Search failed. Is the backend running?')
    } finally {
      setLoading(false)
    }
  }

  const hasResults =
    results && (results.faculty.length > 0 || results.rooms.length > 0)

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Search</h1>
      <p className="text-gray-500 mb-6">
        Find a faculty member or a room — see where they are right now.
      </p>

      <form onSubmit={handleSearch} className="flex gap-3 mb-8">
        <input
          type="text"
          placeholder="Search by faculty name or room number..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-blue-700"
        >
          Search
        </button>
      </form>

      {loading && <p className="text-gray-500">Searching...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {searched && !loading && !error && !hasResults && (
        <p className="text-gray-500">No matches found for "{query}".</p>
      )}

      {results?.faculty.length > 0 && (
        <div className="mb-8">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
            Faculty
          </h2>
          <div className="space-y-3">
            {results.faculty.map((f) => (
              <div
                key={f.id}
                className="bg-white border border-gray-200 rounded-xl p-4 flex items-center justify-between"
              >
                <div>
                  <p className="font-semibold text-gray-900">{f.name}</p>
                  <p className="text-sm text-gray-500">
                    {f.designation} · {f.department}
                  </p>
                </div>
                <StatusBadge status={f.status} />
              </div>
            ))}
          </div>
        </div>
      )}

      {results?.rooms.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
            Rooms
          </h2>
          <div className="space-y-3">
            {results.rooms.map((r) => (
              <div
                key={r.room_no}
                className="bg-white border border-gray-200 rounded-xl p-4"
              >
                <p className="font-semibold text-gray-900">📍 {r.room_no}</p>
                {r.current_subject ? (
                  <p className="text-sm text-green-700 mt-1">
                    🟢 Ongoing: {r.current_subject}
                    {r.current_faculty_name && ` — ${r.current_faculty_name}`}
                  </p>
                ) : (
                  <p className="text-sm text-gray-500 mt-1">No class in session right now</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default SearchPage