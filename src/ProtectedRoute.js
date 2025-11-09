import { Navigate } from 'react-router-dom'

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('access_token') // hoặc sessionStorage

  // if (!token) {
  //   // nếu chưa login thì redirect về /login
  //   return <Navigate to="/login" replace />
  // }

  // nếu có token thì cho vào app
  return children
}

export default ProtectedRoute
