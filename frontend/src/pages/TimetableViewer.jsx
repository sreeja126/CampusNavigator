import { useEffect, useState } from 'react'
import { getClassSections, getTimetable, uploadTimetable } from '../api/timetable'
import TimetableGrid from '../components/TimetableGrid'

function TimetableViewer() {
  const [sections, setSections] = useState([])
  const [selectedSection, setSelectedSection] = useState('')
  const [entries, setEntries] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const [uploadResult, setUploadResult] = useState(null)
  const [uploading, setUploading] = useState(false)

  const loadSections = () => {
    getClassSections()
      .then((data) => {
        setSections(data)
        if (data.length > 0 && !selectedSection) {
          setSelectedSection(data[0])
        }
      })
      .catch(() => setError('Could not load class sections.'))
  }

  useEffect(() => {
    loadSections()
  }, [])

  useEffect(() => {
    if (!selectedSection) return
    setLoading(true)
    getTimetable({ classSection: selectedSection })
      .then((data) => setEntries(data))
      .catch(() => setError('Could not load timetable.'))
      .finally(() => setLoading(false))
  }, [selectedSection])

  const handleFileUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    setUploading(true)
    setUploadResult(null)
    try {
      const result = await uploadTimetable(file)
      setUploadResult(result)
      loadSections() // refresh dropdown in case new sections were added
      if (selectedSection) {
        const data = await getTimetable({ classSection: selectedSection })
        setEntries(data)
      }
    } catch (err) {
      setUploadResult({ error: 'Upload failed. Check your file format and try again.' })
    } finally {
      setUploading(false)
      e.target.value = '' // reset file input
    }
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Timetable</h1>
      <p className="text-gray-500 mb-6">View class schedules or upload an updated timetable.</p>

      <div className="bg-white border border-gray-200 rounded-xl p-4 mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Upload timetable (CSV or Excel)
        </label>
        <input
          type="file"
          accept=".csv,.xlsx,.xls"
          onChange={handleFileUpload}
          disabled={uploading}
          className="text-sm"
        />
        {uploading && <p className="text-sm text-gray-500 mt-2">Uploading...</p>}
        {uploadResult && !uploadResult.error && (
          <div className="text-sm mt-2">
            <p className="text-green-600">
              Inserted {uploadResult.rows_inserted} of {uploadResult.rows_processed} rows.
            </p>
            {uploadResult.errors.length > 0 && (
              <ul className="text-amber-600 list-disc list-inside mt-1">
                {uploadResult.errors.map((err, i) => (
                  <li key={i}>{err}</li>
                ))}
              </ul>
            )}
          </div>
        )}
        {uploadResult?.error && (
          <p className="text-sm text-red-500 mt-2">{uploadResult.error}</p>
        )}
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Class Section</label>
        <select
          value={selectedSection}
          onChange={(e) => setSelectedSection(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          {sections.length === 0 && <option value="">No sections uploaded yet</option>}
          {sections.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      {loading && <p className="text-gray-500">Loading timetable...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && <TimetableGrid entries={entries} />}
    </div>
  )
}

export default TimetableViewer