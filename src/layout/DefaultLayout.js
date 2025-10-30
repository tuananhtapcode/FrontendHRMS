import AppStore from '../components/AppStore'
import { AppContent, AppFooter, AppHeader, AppSidebar } from '../components/index'

const DefaultLayout = () => {
  return (
    <div>
      <div className="wrapper d-flex flex-column min-vh-100">
        <AppHeader />
        <div className="body flex-grow-1">
          <AppContent />
        </div>
        <AppFooter />
      </div>
      <AppSidebar />
      <AppStore />
    </div>
  )
}

export default DefaultLayout
