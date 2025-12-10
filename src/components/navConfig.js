import defaultNav from '../_nav'
import systemNav from '../features/system/_nav'
import timesheetNav from '../features/timesheet/_nav'

export const navigationMap = {
  '/system': systemNav,
  '/timesheet': timesheetNav,


  '': defaultNav,
}
