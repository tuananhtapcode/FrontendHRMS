import React from 'react'
import { Navigate } from 'react-router-dom'
const EmployeesInformationDashboard = React.lazy(() => import('./pages/Dashboard'))
const EmployeesInformationProfileView = React.lazy(() => import('./pages/ProfileView'))
const EmployeesInformationProfileCreate = React.lazy(() => import('./pages/ProfileCreate'))

const EmployeesInformationReportList = React.lazy(() => import('./pages/ReportList'))
const EmployeesInformationReportEmployeeAmount = React.lazy(
  () => import('./pages/Report/EmployeeAmount'),
)
const EmployeesInformationReportEmployeeFluctuationSituation = React.lazy(
  () => import('./pages/Report/EmployeeFluctuationSituation'),
)
const EmployeesInformationReportEmployeeNewRecruitTermination = React.lazy(
  () => import('./pages/Report/EmployeeNewRecruitTermination'),
)
const EmployeesInformationReportEmployeeInDepartmentOverTime = React.lazy(
  () => import('./pages/Report/EmployeeInDepartmentOverTime'),
)
const EmployeesInformationReportEmployeeBirthday = React.lazy(
  () => import('./pages/Report/EmployeeBirthday'),
)
const EmployeesInformationReportEmployeeTermination = React.lazy(
  () => import('./pages/Report/EmployeeTermination'),
)
const EmployeesInformationReportEmployeeAnniversary = React.lazy(
  () => import('./pages/Report/EmployeeAnniversary'),
)
const EmployeesInformationReportChangeSalaryHistory = React.lazy(
  () => import('./pages/Report/ChangeSalaryHistory'),
)
const EmployeesInformationReportEmployeeSalaryAdjustment = React.lazy(
  () => import('./pages/Report/EmployeeSalaryAdjustment'),
)
const EmployeesInformationReportVaccinationStatus = React.lazy(
  () => import('./pages/Report/VaccinationStatus'),
)
const EmployeesInformationReportStatisticScheduleVaccination = React.lazy(
  () => import('./pages/Report/StatisticScheduleVaccination'),
)
const EmployeesInformationReportEmployeeRetirement = React.lazy(
  () => import('./pages/Report/EmployeeRetirement'),
)
const EmployeesInformationReportEmployeeLackOfPaper = React.lazy(
  () => import('./pages/Report/EmployeeLackOfPaper'),
)

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
  {
    path: '/employees-information/report/list',
    name: 'EmployeesInformationReportList',
    element: EmployeesInformationReportList,
  },
  {
    path: '/employees-information/report/employee-amount',
    name: 'EmployeesInformationReportEmployeeAmount',
    element: EmployeesInformationReportEmployeeAmount,
  },
  {
    path: '/employees-information/report/employee-fluctuation-situation',
    name: 'EmployeesInformationReportEmployeeFluctuationSituation',
    element: EmployeesInformationReportEmployeeFluctuationSituation,
  },
  {
    path: '/employees-information/report/employee-new-recruit-termination',
    name: 'EmployeesInformationReportEmployeeNewRecruitTermination',
    element: EmployeesInformationReportEmployeeNewRecruitTermination,
  },
  {
    path: '/employees-information/report/employee-in-department-over-time',
    name: 'EmployeesInformationReportEmployeeInDepartmentOverTime',
    element: EmployeesInformationReportEmployeeInDepartmentOverTime,
  },
  {
    path: '/employees-information/report/employee-birthday',
    name: 'EmployeesInformationReportEmployeeBirthday',
    element: EmployeesInformationReportEmployeeBirthday,
  },
  {
    path: '/employees-information/report/employee-termination',
    name: 'EmployeesInformationReportEmployeeTermination',
    element: EmployeesInformationReportEmployeeTermination,
  },
  {
    path: '/employees-information/report/employee-anniversary',
    name: 'EmployeesInformationReportEmployeeAnniversary',
    element: EmployeesInformationReportEmployeeAnniversary,
  },
  {
    path: '/employees-information/report/change-salary-history',
    name: 'EmployeesInformationReportChangeSalaryHistory',
    element: EmployeesInformationReportChangeSalaryHistory,
  },
  {
    path: '/employees-information/report/employee-salary-adjustment',
    name: 'EmployeesInformationReportEmployeeSalaryAdjustment',
    element: EmployeesInformationReportEmployeeSalaryAdjustment,
  },
  {
    path: '/employees-information/report/vaccination-status',
    name: 'EmployeesInformationReportVaccinationStatus',
    element: EmployeesInformationReportVaccinationStatus,
  },
  {
    path: '/employees-information/report/statistic-schedule-vaccination',
    name: 'EmployeesInformationReportStatisticScheduleVaccination',
    element: EmployeesInformationReportStatisticScheduleVaccination,
  },
  {
    path: '/employees-information/report/employee-retirement',
    name: 'EmployeesInformationReportEmployeeRetirement',
    element: EmployeesInformationReportEmployeeRetirement,
  },
  {
    path: '/employees-information/report/employee-lack-of-paper',
    name: 'EmployeesInformationReportEmployeeLackOfPaper',
    element: EmployeesInformationReportEmployeeLackOfPaper,
  },
]

export default routes
