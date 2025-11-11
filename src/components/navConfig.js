import defaultNav from '../_nav'
import payrollNav from '../features/payroll/_nav'
import systemNav from '../features/system/_nav'

export const navigationMap = {
  '/system': systemNav,
  '/payroll': payrollNav,
  '': defaultNav,
  
}
