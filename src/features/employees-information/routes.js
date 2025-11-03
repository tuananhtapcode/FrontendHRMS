import React from 'react'
import { Navigate } from 'react-router-dom'
const EmployeesInformationDashboard = React.lazy(() => import('./pages/Dashboard'))

const routes = [
  {
    path: '/employees-information',
    name: 'EmployeesInformation',
    element: <Navigate to="/employees-information/dashboard" replace />,
  },
  {
    path: '/employees-information/dashboard',
    name: 'EmployeesInformationDashboard',
    element: EmployeesInformationDashboard,
  },
]

export default routes
