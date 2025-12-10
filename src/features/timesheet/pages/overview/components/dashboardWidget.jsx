import { cilReload, cilSettings } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { CCard, CCardBody, CCardHeader } from '@coreui/react'
import './dashboardWidget.css'

/**
 * @param {object} props
 * @param {string} props.title - Tiêu đề
 * @param {string} props.subtitle - Phụ đề
 * @param {string} props.unit - Đơn vị tính
 * @param {React.ReactNode} props.children - Nội dung
 * @param {function} props.onSettingsClick - (MỚI) Hàm gọi khi bấm icon settings
 * @param {function} props.onReload
 */
const DashboardWidget = ({ title, subtitle, unit, children, onSettingsClick, onReload  }) => {
  // Hàm xử lý khi bấm Tải lại
  const handleReload = (e) => {
    e.stopPropagation()
    if (onReload) {
      onReload() // Gọi hàm của cha
    } else {
      console.log(`Đang tải lại widget: ${title}`)
    }
  }

  // (SỬA) Hàm xử lý khi bấm Thiết lập
  // Giờ nó sẽ gọi prop từ cha, nếu có
  const handleSettings = (e) => {
    e.stopPropagation()
    if (onSettingsClick) {
      onSettingsClick() // Gọi hàm của cha
    } else {
      console.log(`Mở thiết lập widget: ${title}`)
    }
  }

  // Biến kiểm tra xem có dùng dropdown hay không
  const useDropdown = title.startsWith('Nhân viên')

  // Tách riêng phần controls ra cho dễ đọc
  const renderControls = () => {
    // TRƯỜNG HỢP HIỂN THỊ ICON (Ảnh 2)
    return (
      <>
        <CIcon icon={cilReload} className="cursor-pointer" onClick={handleReload} />
        <CIcon
          icon={cilSettings}
          className="cursor-pointer"
          onClick={handleSettings} // <-- SỬ DỤNG HÀM ĐÃ SỬA
        />
      </>
    )
  }

  return (
    <CCard className="h-100 dashboard-widget">
      <CCardHeader className="widget-header">
        <div className="widget-title-group">
          <h5 className="widget-title">{title}</h5>
          <span className="widget-subtitle">{subtitle}</span>
        </div>

        <div className="widget-controls-wrapper">
          <div className="widget-controls-top">{renderControls()}</div>
          {unit && <span className="widget-unit">{unit}</span>}
        </div>
      </CCardHeader>
      <CCardBody className="widget-body">{children}</CCardBody>
    </CCard>
  )
}

export default DashboardWidget