import { CSidebar, CSidebarFooter, CSidebarHeader } from '@coreui/react'
import { useSelector } from 'react-redux'
import app from '../_app'
import { AppStoreNav } from './AppStoreNav'

const AppStore = () => {
  const appStoreShow = useSelector((state) => state.appStoreShow)

  return (
    <CSidebar
      className="border-end app-store"
      colorScheme="light"
      position="fixed"
      visible={appStoreShow}
    >
      <CSidebarHeader className="border-bottom">
        <input type="text" className="form-control" placeholder="Tìm kiếm..."></input>
      </CSidebarHeader>
      <AppStoreNav items={app} />
      <CSidebarFooter className="border-top d-none d-lg-flex"></CSidebarFooter>
    </CSidebar>
  )
}

export default AppStore
