import defaultNav from '../_nav'
import employeesInfomationNav from '../features/employees-information/_nav'
import systemNav from '../features/system/_nav'
import employeePagesNav from '../views/pages/employeePages/_nav'

export const navigationMap = {
  '/employees-information': employeesInfomationNav,
  '/system': systemNav,
  '/employee': employeePagesNav,
  '': defaultNav,
}
