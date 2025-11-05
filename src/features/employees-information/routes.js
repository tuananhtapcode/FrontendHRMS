import React from 'react'
import { Navigate } from 'react-router-dom'
const EmployeesInformationDashboard = React.lazy(() => import('./pages/Dashboard'))
const EmployeesInformationProfileView = React.lazy(() => import('./pages/ProfileView'))
const EmployeesInformationProfileCreate = React.lazy(() => import('./pages/ProfileCreate'))

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
  {
    path: '/employees-information/profile/view',
    name: 'EmployeesInformationProfileView',
    element: EmployeesInformationProfileView,
  },
  {
    path: '/employees-information/profile/create',
    name: 'EmployeesInformationProfileCreate',
    element: EmployeesInformationProfileCreate,
  },
]

export default routes
