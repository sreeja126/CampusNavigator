import { Navigate } from 'react-router-dom'
import { isLoggedIn, isAdmin } from '../api/auth'

/** Requires an admin-role login specifically; sends non-admins (and logged-out visitors) away. */
function AdminRoute({ children }) {
  if (!isLoggedIn()) {
    return <Navigate to="/login" replace />
  }
  if (!isAdmin()) {
    return <Navigate to="/" replace />
  }
  return children
}

export default AdminRoute