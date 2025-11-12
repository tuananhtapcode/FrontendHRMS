import React from 'react'
import { Navigate } from 'react-router-dom'

const SystemCompanyInfo = React.lazy(() => import('./pages/CompanyInfo'))
const SystemCategoryMember = React.lazy(() => import('./pages/CategoryMember'))

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
  {
    path: '/system/category/member',
    name: 'SystemCategoryMember',
    element: SystemCategoryMember,
  },
]

export default routes
