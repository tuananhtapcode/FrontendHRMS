import React from 'react'
import { Navigate } from 'react-router-dom'

const EmployeePagesOverview = React.lazy(() => import('./pages/Overview'))
const EmployeePagesProfile = React.lazy(() => import('./pages/Profile'))

const routes = [
  {
    path: '/employee',
    name: 'EmployeePages',
    element: <Navigate to="/employee/overview" replace />,
  },
  {
    path: '/employee/overview',
    name: 'EmployeePagesOverview',
    element: EmployeePagesOverview,
  },
  {
    path: '/employee/profile',
    name: 'EmployeePagesProfile',
    element: EmployeePagesProfile,
  },
]

export default routes
