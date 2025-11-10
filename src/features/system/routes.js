import React from 'react'
import { Navigate } from 'react-router-dom'

const SystemCompanyInfo = React.lazy(() => import('./pages/CompanyInfo'))
const routes = [
  {
    path: '/system',
    name: 'System',
    element: <Navigate to="/system/company-info/general-info" replace />,
  },
  {
    path: '/system/company-info/general-info',
    name: 'SystemCompanyInfo',
    element: SystemCompanyInfo,
  },
]

export default routes
