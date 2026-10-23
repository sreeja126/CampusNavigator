   import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { logout } from '../api/auth'
import { getFacultyList, createFaculty, updateFaculty, deleteFaculty } from '../api/faculty'
import { uploadTimetable } from '../api/timetable'
import { getBuildings, updateBuilding } from '../api/buildings'
import { getRooms, updateRoom } from '../api/rooms'

const TABS = ['Faculty', 'Timetable', 'Rooms']

function AdminDashboard() {
  const [tab, setTab] = useState('Faculty')
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/admin/login')
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-500 text-sm">Manage faculty, timetables, and room data.</p>
        </div>
        <button
          onClick={handleLogout}
          className="text-sm text-gray-500 hover:text-gray-700 border border-gray-300 rounded-lg px-3 py-1.5"
        >
          Log out
        </button>
      </div>

      <div className="flex gap-2 mb-6">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              tab === t ? 'bg-blue-600 text-white' : 'bg-white border border-gray-300 text-gray-600'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === 'Faculty' && <FacultyAdmin />}
      {tab === 'Timetable' && <TimetableAdmin />}
      {tab === 'Rooms' && <RoomsAdmin />}
    </div>
  )
}

// ---------- Faculty tab ----------

function FacultyAdmin() {
  const [faculty, setFaculty] = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({ name: '', department: '', designation: '', cabin_no: '', email: '' })
  const [editingId, setEditingId] = useState(null)
  const [error, setError] = useState(null)

  const load = () => {
    setLoading(true)
    getFacultyList()
      .then(setFaculty)
      .catch(() => setError('Could not load faculty.'))
      .finally(() => setLoading(false))
  }

  useEffect(load, [])

  const resetForm = () => {
    setForm({ name: '', department: '', designation: '', cabin_no: '', email: '' })
    setEditingId(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    try {
      if (editingId) {
        await updateFaculty(editingId, form)
      } else {
        await createFaculty(form)
      }
      resetForm()
      load()
    } catch {
      setError('Save failed. Make sure you are logged in and all fields are valid.')
    }
  }

  const handleEdit = (f) => {
    setForm({
      name: f.name,
      department: f.department,
      designation: f.designation || '',
      cabin_no: f.cabin_no || '',
      email: f.email || '',
    })
    setEditingId(f.id)
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this faculty member?')) return
    await deleteFaculty(id)
    load()
  }

  return (
    <div className="grid md:grid-cols-[1fr_2fr] gap-6">
      <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-xl p-4 space-y-2 h-fit">
        <h2 className="font-semibold text-gray-900 mb-2">
          {editingId ? 'Edit Faculty' : 'Add Faculty'}
        </h2>
        {['name', 'department', 'designation', 'cabin_no', 'email'].map((field) => (
          <input
            key={field}
            placeholder={field.replace('_', ' ')}
            value={form[field]}
            onChange={(e) => setForm({ ...form, [field]: e.target.value })}
            required={field === 'name' || field === 'department'}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        ))}
        {error && <p className="text-sm text-red-500">{error}</p>}
        <div className="flex gap-2">
          <button type="submit" className="flex-1 bg-blue-600 text-white rounded-lg py-2 text-sm font-medium hover:bg-blue-700">
            {editingId ? 'Save changes' : 'Add faculty'}
          </button>
          {editingId && (
            <button type="button" onClick={resetForm} className="px-3 py-2 text-sm text-gray-500 border border-gray-300 rounded-lg">
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="space-y-2">
        {loading && <p className="text-gray-500 text-sm">Loading...</p>}
        {!loading && faculty.map((f) => (
          <div key={f.id} className="bg-white border border-gray-200 rounded-xl p-3 flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">{f.name}</p>
              <p className="text-xs text-gray-500">{f.designation} · {f.department} · Cabin {f.cabin_no || '—'}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => handleEdit(f)} className="text-sm text-blue-600 hover:underline">Edit</button>
              <button onClick={() => handleDelete(f.id)} className="text-sm text-red-500 hover:underline">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ---------- Timetable tab ----------

function TimetableAdmin() {
  const [uploading, setUploading] = useState(false)
  const [result, setResult] = useState(null)

  const handleUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    setUploading(true)
    setResult(null)
    try {
      const summary = await uploadTimetable(file)
      setResult(summary)
    } catch {
      setResult({ error: 'Upload failed. Make sure you are logged in.' })
    } finally {
      setUploading(false)
      e.target.value = ''
    }
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 max-w-lg">
      <h2 className="font-semibold text-gray-900 mb-2">Upload Timetable</h2>
      <p className="text-sm text-gray-500 mb-3">
        Upload a CSV or Excel file with columns: class_section, day_of_week, period_number,
        start_time, end_time, subject, room_no, faculty_name
      </p>
      <input type="file" accept=".csv,.xlsx,.xls" onChange={handleUpload} disabled={uploading} className="text-sm" />

      {uploading && <p className="text-sm text-gray-500 mt-2">Uploading...</p>}
      {result && !result.error && (
        <p className="text-sm text-green-600 mt-2">
          Inserted {result.rows_inserted} of {result.rows_processed} rows.
        </p>
      )}
      {result?.error && <p className="text-sm text-red-500 mt-2">{result.error}</p>}
    </div>
  )
}

// ---------- Rooms tab ----------

function RoomsAdmin() {
  const [buildings, setBuildings] = useState([])
  const [selectedBuildingId, setSelectedBuildingId] = useState('')
  const [rooms, setRooms] = useState([])
  const [buildingForm, setBuildingForm] = useState({ floor_plan_image_url: '' })
  const [roomForms, setRoomForms] = useState({})
  const [message, setMessage] = useState(null)

  useEffect(() => {
    getBuildings().then((data) => {
      setBuildings(data)
      if (data.length > 0) setSelectedBuildingId(data[0].id)
    })
  }, [])

  useEffect(() => {
    if (!selectedBuildingId) return
    const building = buildings.find((b) => b.id === Number(selectedBuildingId))
    setBuildingForm({ floor_plan_image_url: building?.floor_plan_image_url || '' })

    getRooms({ buildingId: selectedBuildingId }).then((data) => {
      setRooms(data)
      const forms = {}
      data.forEach((r) => {
        forms[r.id] = {
          photo_url: r.photo_url || '',
          x_percent: r.x_percent ?? '',
          y_percent: r.y_percent ?? '',
        }
      })
      setRoomForms(forms)
    })
  }, [selectedBuildingId, buildings])

  const handleBuildingSave = async () => {
    await updateBuilding(selectedBuildingId, buildingForm)
    setMessage('Building floor plan image saved.')
  }

  const handleRoomSave = async (roomId) => {
    const data = roomForms[roomId]
    await updateRoom(roomId, {
      photo_url: data.photo_url || null,
      x_percent: data.x_percent === '' ? null : Number(data.x_percent),
      y_percent: data.y_percent === '' ? null : Number(data.y_percent),
    })
    setMessage(`Room saved.`)
  }

  return (
    <div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Building</label>
        <select
          value={selectedBuildingId}
          onChange={(e) => setSelectedBuildingId(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
        >
          {buildings.map((b) => (
            <option key={b.id} value={b.id}>{b.name}</option>
          ))}
        </select>
      </div>

      {message && <p className="text-sm text-green-600 mb-3">{message}</p>}

      <div className="bg-white border border-gray-200 rounded-xl p-4 mb-4">
        <h2 className="font-semibold text-gray-900 mb-2">Floor Plan Image</h2>
        <p className="text-xs text-gray-500 mb-2">
          Paste an image URL. Once set, this building's floor plan page will show clickable
          room hotspots over the image instead of a plain list.
        </p>
        <div className="flex gap-2">
          <input
            placeholder="https://..."
            value={buildingForm.floor_plan_image_url}
            onChange={(e) => setBuildingForm({ floor_plan_image_url: e.target.value })}
            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm"
          />
          <button onClick={handleBuildingSave} className="bg-blue-600 text-white rounded-lg px-4 py-2 text-sm font-medium hover:bg-blue-700">
            Save
          </button>
        </div>
      </div>

      <h2 className="font-semibold text-gray-900 mb-2">Rooms</h2>
      <div className="space-y-3">
        {rooms.map((r) => (
          <div key={r.id} className="bg-white border border-gray-200 rounded-xl p-4">
            <p className="font-medium text-gray-900 mb-2">📍 {r.room_no} <span className="text-xs text-gray-400">({r.room_type}, floor {r.floor})</span></p>
            <div className="grid sm:grid-cols-3 gap-2">
              <input
                placeholder="Photo URL"
                value={roomForms[r.id]?.photo_url || ''}
                onChange={(e) => setRoomForms({ ...roomForms, [r.id]: { ...roomForms[r.id], photo_url: e.target.value } })}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm sm:col-span-1"
              />
              <input
                placeholder="X % (hotspot)"
                value={roomForms[r.id]?.x_percent ?? ''}
                onChange={(e) => setRoomForms({ ...roomForms, [r.id]: { ...roomForms[r.id], x_percent: e.target.value } })}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
              />
              <input
                placeholder="Y % (hotspot)"
                value={roomForms[r.id]?.y_percent ?? ''}
                onChange={(e) => setRoomForms({ ...roomForms, [r.id]: { ...roomForms[r.id], y_percent: e.target.value } })}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
              />
            </div>
            <button
              onClick={() => handleRoomSave(r.id)}
              className="mt-2 text-sm bg-gray-900 text-white rounded-lg px-4 py-1.5 hover:bg-gray-800"
            >
              Save room
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default AdminDashboard