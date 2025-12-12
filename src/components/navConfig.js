import defaultNav from '../_nav'
import employeesInfomationNav from '../features/employees-information/_nav'
import payrollNav from '../features/payroll/_nav'
import systemNav from '../features/system/_nav'
import employeePagesNav from '../features/employee/_nav'
import timesheetNav from '../features/timesheet/_nav'

export const navigationMap = {
  '/employees-information': employeesInfomationNav,
  '/system': systemNav,
  '/employee': employeePagesNav,
  '/payroll': payrollNav,
  '/timesheet': timesheetNav,
  '': defaultNav,
}
