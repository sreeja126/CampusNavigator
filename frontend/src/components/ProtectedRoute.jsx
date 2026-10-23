import { Navigate } from 'react-router-dom'
import { isLoggedIn } from '../api/auth'

/** Requires any logged-in identity (regular user OR admin). */
function ProtectedRoute({ children }) {
  if (!isLoggedIn()) {
    return <Navigate to="/login" replace />
  }
  return children
}

export default ProtectedRoute