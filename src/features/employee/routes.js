import React from 'react'
import { Navigate } from 'react-router-dom'

const EmployeePagesOverview = React.lazy(() => import('./pages/Overview'))

const EmployeePagesProfile = React.lazy(() => import('./pages/Profile'))

const TimesheetTimekeepingRemote = React.lazy(() => import('./pages/TimesheetTimekeepingRemote'))
const TimesheetShiftPlan = React.lazy(() => import('./pages/TimesheetShiftPlan'))
const TimesheetTimesheetGrid = React.lazy(() => import('./pages/TimesheetTimesheetGrid'))

const TimesheetAttendance = React.lazy(() => import('./pages/TimesheetAttendance'))
const TimesheetOvertimeRequest = React.lazy(() => import('./pages/TimesheetOvertimeRequest'))
const TimesheetChangeShift = React.lazy(() => import('./pages/TimesheetChangeShift'))

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
  {
    path: '/employee/timesheet/timekeeping-remote',
    name: 'TimesheetTimekeepingRemote',
    element: TimesheetTimekeepingRemote,
  },
  {
    path: '/employee/timesheet/shiftplan',
    name: 'TimesheetShiftPlan',
    element: TimesheetShiftPlan,
  },
  {
    path: '/employee/timesheet/timesheet-grid',
    name: 'TimesheetTimesheetGrid',
    element: TimesheetTimesheetGrid,
  },

  {
    path: '/employee/timesheet/attendance',
    name: 'TimesheetAttendance',
    element: TimesheetAttendance,
  },
  {
    path: '/employee/timesheet/overtime-request',
    name: 'TimesheetOvertimeRequest',
    element: TimesheetOvertimeRequest,
  },
  {
    path: '/employee/timesheet/change-shift',
    name: 'TimesheetChangeShift',
    element: TimesheetChangeShift,
  },
]

export default routes
