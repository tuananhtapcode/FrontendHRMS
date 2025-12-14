import React from 'react'
import { Navigate } from 'react-router-dom'

const CompanyInfo = React.lazy(() => import('./pages/CompanyInfo'))
const CategoryMember = React.lazy(() => import('./pages/CategoryMember'))
const Logs = React.lazy(() => import('./pages/Logs'))
const routes = [
  {
    path: '/system',
    name: 'System',
    element: <Navigate to="/system/company-info/general-info" replace />,
  },
  {
    path: '/system/company-info/general-info',
    name: 'CompanyInfo',
    element: CompanyInfo,
  },
  {
    path: '/system/category/member',
    name: 'CategoryMember',
    element: CategoryMember,
  },
  {
    path: '/system/logs',
    name: 'Logs',
    element: Logs,
  },
]

export default routes
