import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { loginUser, loginAdmin } from '../api/auth'

function Login() {
  const [role, setRole] = useState('student')
  const [studentId, setStudentId] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      if (role === 'student') {
        await loginUser(studentId, password)
        navigate('/')
      } else {
        await loginAdmin(username, password)
        navigate('/admin')
      }
    } catch {
      setError('Incorrect credentials. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-sm mx-auto p-6 mt-12">
      <h1 className="text-xl font-bold text-gray-900 mb-1">Log In</h1>
      <p className="text-gray-500 text-sm mb-6">Access Campus Navigator.</p>

      <div className="flex gap-1 bg-gray-100 rounded-lg p-1 mb-5">
        <button
          type="button"
          onClick={() => { setRole('student'); setError(null) }}
          className={`flex-1 py-1.5 rounded-md text-sm font-medium transition-colors ${
            role === 'student' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500'
          }`}
        >
          Student / Faculty
        </button>
        <button
          type="button"
          onClick={() => { setRole('admin'); setError(null) }}
          className={`flex-1 py-1.5 rounded-md text-sm font-medium transition-colors ${
            role === 'admin' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500'
          }`}
        >
          Admin
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        {role === 'student' ? (
          <input
            type="text"
            placeholder="Student / Faculty ID"
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            required
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        ) : (
          <input
            type="text"
            placeholder="Admin username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        )}
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        {error && <p className="text-sm text-red-500">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white rounded-lg py-2 text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Signing in...' : 'Sign in'}
        </button>
      </form>

      {role === 'student' && (
        <p className="text-sm text-gray-500 mt-4 text-center">
          New here? <Link to="/register" className="text-blue-600 hover:underline">Create an account</Link>
        </p>
      )}
    </div>
  )
}

export default Login