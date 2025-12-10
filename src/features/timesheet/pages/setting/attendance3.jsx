import {
  cilArrowLeft,
  cilList,
  cilPlus,
  cilSearch,
  cilX // Icon dấu X để xóa BSSID
} from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import {
  CButton,
  CCard,
  CCardBody,
  CForm,
  CFormCheck,
  CFormInput,
  CFormLabel,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CNav,
  CNavItem,
  CNavLink,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow
} from '@coreui/react'
import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'

// ============================================================================
// 1. COMPONENT MODAL: THÊM WI-FI (MỚI)
// ============================================================================
const AddWifiModal = ({ visible, onClose }) => {
  const [wifiName, setWifiName] = useState('')
  // Khởi tạo mảng BSSID với 2 dòng trống giống như trong ảnh
  const [bssids, setBssids] = useState(['', '']) 

  const handleAddBssidRow = () => {
    setBssids([...bssids, ''])
  }

  const handleRemoveBssidRow = (index) => {
    const newBssids = bssids.filter((_, i) => i !== index)
    setBssids(newBssids)
  }

  const handleChangeBssid = (index, value) => {
    const newBssids = [...bssids]
    newBssids[index] = value
    setBssids(newBssids)
  }

  const handleSave = () => {
    console.log('Saving:', { wifiName, bssids })
    alert('Đã lưu thông tin Wi-Fi!')
    onClose()
  }

  return (
    <CModal visible={visible} onClose={onClose} alignment="center">
      <CModalHeader onClose={onClose}>
        <CModalTitle className="fw-bold">Thêm Wi-Fi</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <CForm>
          {/* Tên Wi-Fi */}
          <div className="mb-3">
            <CFormLabel className="fw-bold" style={{fontSize: '0.9rem'}}>
              Tên Wi-Fi <span className="text-danger">*</span>
            </CFormLabel>
            <CFormInput 
              placeholder="" 
              value={wifiName}
              onChange={(e) => setWifiName(e.target.value)}
            />
          </div>

          {/* Danh sách BSSID */}
          <div className="mb-2">
            <CFormLabel className="fw-bold" style={{fontSize: '0.9rem'}}>
              BSSID <span className="text-danger">*</span>
            </CFormLabel>
            
            {bssids.map((bssid, index) => (
              <div key={index} className="d-flex align-items-center mb-2">
                <CFormInput 
                  value={bssid}
                  onChange={(e) => handleChangeBssid(index, e.target.value)}
                  className="me-2"
                />
                {/* Nút Xóa dòng */}
                <CIcon 
                  icon={cilX} 
                  className="text-danger" 
                  style={{ cursor: 'pointer', fontSize: '1.2rem' }} 
                  onClick={() => handleRemoveBssidRow(index)}
                />
              </div>
            ))}
          </div>

          {/* Nút + Thêm dòng BSSID */}
          <div>
            <span 
              className="text-warning fw-bold" 
              style={{ cursor: 'pointer', color: '#f9b115' }}
              onClick={handleAddBssidRow}
            >
              + Thêm
            </span>
          </div>
        </CForm>
      </CModalBody>
      <CModalFooter className="border-top-0">
        <CButton color="secondary" variant="outline" onClick={onClose}>
          Hủy
        </CButton>
        <CButton 
          className="text-white fw-bold" 
          style={{ backgroundColor: '#f26522', borderColor: '#f26522' }}
          onClick={handleSave}
        >
          Lưu
        </CButton>
      </CModalFooter>
    </CModal>
  )
}

// ============================================================================
// 2. COMPONENT CON: TRANG DANH MỤC WI-FI
// ============================================================================
const WifiListComponent = ({ onBack }) => {
  const [isModalVisible, setIsModalVisible] = useState(false)

  return (
    <div className="bg-white p-3 h-100">
      {/* HEADER */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div className="d-flex align-items-center gap-3">
          <CButton color="transparent" className="p-0 border-0" onClick={onBack}>
            <CIcon icon={cilArrowLeft} size="xl" className="text-secondary"/>
          </CButton>
          <h4 className="mb-0 fw-bold">Danh mục Wi-Fi</h4>
        </div>
        {/* Nút Thêm mở Modal */}
        <CButton 
          style={{ backgroundColor: '#f26522', border: 'none' }} 
          className="text-white fw-bold"
          onClick={() => setIsModalVisible(true)}
        >
          <CIcon icon={cilPlus} className="me-2" />
          Thêm
        </CButton>
      </div>

      {/* NOTE & INSTRUCTION */}
      <div className="mb-4">
        <p className="mb-1">
          Xem hướng dẫn cách tra cứu BSSID của Wi-Fi <span className="text-danger fw-bold" style={{cursor:'pointer'}}>tại đây</span>.
        </p>
        <p className="mb-0">
          <strong>Lưu ý:</strong> Cần khai báo tất cả BSSID của Wi-Fi để tránh gặp lỗi nhân viên không chấm công được khi kết nối đến BSSID ngoài danh mục.
        </p>
      </div>

      {/* SEARCH BAR */}
      <div className="mb-3" style={{ maxWidth: '300px', position: 'relative' }}>
        <CFormInput placeholder="Tìm kiếm" className="ps-5" />
        <CIcon 
          icon={cilSearch} 
          style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#999' }} 
        />
      </div>

      {/* TABLE */}
      <div className="border rounded">
        <CTable hover responsive className="mb-0">
          <CTableHead className="bg-light">
            <CTableRow>
              <CTableHeaderCell className="py-3 ps-3 bg-light" style={{width: '50%'}}>Tên Wi-Fi</CTableHeaderCell>
              <CTableHeaderCell className="py-3 bg-light">BSSID</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {/* EMPTY STATE */}
            <CTableRow>
              <CTableDataCell colSpan="2" className="text-center py-5">
                <div style={{ minHeight: '300px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                    <div className="mb-3" style={{ opacity: 0.5 }}>
                        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#f9b115" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                            <polyline points="14 2 14 8 20 8"></polyline>
                            <line x1="16" y1="13" x2="8" y2="13"></line>
                            <line x1="16" y1="17" x2="8" y2="17"></line>
                            <polyline points="10 9 9 9 8 9"></polyline>
                        </svg>
                    </div>
                    <span className="text-muted fst-italic">Không có dữ liệu</span>
                </div>
              </CTableDataCell>
            </CTableRow>
          </CTableBody>
        </CTable>
      </div>

      {/* MODAL ADD WIFI */}
      <AddWifiModal 
        visible={isModalVisible} 
        onClose={() => setIsModalVisible(false)} 
      />
    </div>
  )
}

// ============================================================================
// 3. COMPONENT CHÍNH
// ============================================================================
const MobileAppAttendance = () => {
  const [activeTab, setActiveTab] = useState('Chấm công trên ứng dụng')
  const [subTab, setSubTab] = useState('wifi') 
  const [showWifiList, setShowWifiList] = useState(false) 

  const navigate = useNavigate()

  if (showWifiList) {
      return <WifiListComponent onBack={() => setShowWifiList(false)} />
  }

  return (
    <div className="p-3">
      {/* HEADER */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div className="d-flex align-items-center">
          <h4 className="mb-0 fw-bold">Quy định chấm công</h4>
        </div>
        <CButton color="white" style={{ border: '1px solid #f9b115', color: '#f9b115' }}>
          + Gợi ý hình thức chấm công
        </CButton>
      </div>

      <CCard>
        <CCardBody>
          {/* TABS CHÍNH */}
          <CNav variant="tabs" className="mb-4">
            {[
              { label: 'Chung', path: '/timesheet/attendanceRules' },
              { label: 'Số công chuẩn', path: '/timesheet/attendanceRules/standardwork' },
              { label: 'Tùy chỉnh bảng công', path: '/timesheet/attendanceRules/custom' },
              { label: 'Chấm công trên ứng dụng', path: '/timesheet/attendanceRules/app' },
            ].map((tab) => (
              <CNavItem key={tab.label}>
                <CNavLink
                  as={NavLink}
                  to={tab.path}
                  end
                  style={({ isActive }) => ({
                    color: isActive ? '#f9b115' : '#666',
                    borderBottom: isActive ? '2px solid #f9b115' : 'none',
                    fontWeight: isActive ? 'bold' : 'normal',
                  })}
                >
                  {tab.label}
                </CNavLink>
              </CNavItem>
            ))}
          </CNav>

          {/* CONTENT */}
          <div className="mb-3 d-flex align-items-center bg-light p-2 rounded">
            <span className="fw-bold me-3" style={{fontSize: '0.9rem'}}>Cho phép nhân viên chấm công trên:</span>
            <div className="d-flex gap-3">
              <CFormCheck 
                id="allowWeb" 
                label="Ứng dụng web" 
                checked={true} 
                disabled 
                readOnly
              />
              <CFormCheck 
                id="allowMobile" 
                label="Ứng dụng mobile" 
                checked={true} 
                disabled 
                readOnly
              />
            </div>
          </div>

          {/* SUB-NAV */}
          <div className="mb-3 border-bottom pb-2">
            {[
              { id: 'no_auth', label: 'Không xác thực' },
              { id: 'wifi', label: 'Kết nối Wi-Fi' },
              { id: 'gps', label: 'Định vị GPS' },
              { id: 'qr', label: 'Quét mã QR' },
              { id: 'face', label: 'Xác nhận khuôn mặt' },
              { id: 'doc', label: 'Xác thực bằng tài liệu' },
              { id: 'manage', label: 'Quản lý xác nhận' },
            ].map((item, index, arr) => (
              <span key={item.id}>
                <span 
                  className={`cursor-pointer px-2 ${subTab === item.id ? 'text-warning fw-bold' : 'text-secondary'}`}
                  style={{cursor: 'pointer', fontSize: '0.9rem'}}
                  onClick={() => setSubTab(item.id)}
                >
                  {item.label}
                </span>
                {index < arr.length - 1 && <span className="text-muted">|</span>}
              </span>
            ))}
          </div>

          {/* NỘI DUNG TAB wifi */}
          {subTab === 'wifi' && (
            <div>
              <div className="mb-3">
                <p className="text-muted mb-0" style={{fontSize: '0.85rem'}}>
                  Cho phép nhân viên chấm công bằng cách kết nối đến Wi-Fi của công ty <span className="text-warning cursor-pointer">Xem hướng dẫn</span>
                </p>
              </div>

              {/* Toolbar */}
              <div className="d-flex justify-content-between align-items-center mb-3">
                <div style={{width: '300px', position: 'relative'}}>
                  <CFormInput size="sm" placeholder="Tìm kiếm" className="ps-5" />
                  <CIcon icon={cilSearch} size="sm" style={{position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#999'}} />
                </div>
                <div>
                  <CButton 
                    color="white" 
                    size="sm" 
                    className="me-2 border text-secondary"
                    onClick={() => setShowWifiList(true)}
                  >
                    <CIcon icon={cilList} className="me-1" /> Danh mục Wi-Fi
                  </CButton>
                </div>
              </div>

              {/* Bảng dữ liệu (Empty State) - Màn hình chính */}
              <div className="border rounded" style={{minHeight: '400px'}}>
                <CTable hover responsive className="mb-0">
                  <CTableHead>
                    <CTableRow>
                      <CTableHeaderCell className="bg-light border-bottom" style={{width: '30%', padding: '12px 16px'}}>
                        Đơn vị áp dụng
                      </CTableHeaderCell>
                      <CTableHeaderCell className="bg-light border-bottom" style={{width: '30%', padding: '12px 16px'}}>
                        Nhân viên áp dụng
                      </CTableHeaderCell>
                      <CTableHeaderCell className="bg-light border-bottom" style={{padding: '12px 16px'}}>
                        Wi-Fi chấm công
                      </CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    <CTableRow>
                      <CTableDataCell colSpan="3" className="text-center" style={{height: '350px', verticalAlign: 'middle'}}>
                        <div className="d-flex flex-column align-items-center justify-content-center text-muted">
                          <div style={{fontSize: '4rem', opacity: 0.2, marginBottom: '15px'}}>📄</div>
                          <span style={{fontSize: '0.9rem', color: '#999'}}>Không có dữ liệu</span>
                        </div>
                      </CTableDataCell>
                    </CTableRow>
                  </CTableBody>
                </CTable>
              </div>
            </div>
          )}
          
          {/* Các tab khác */}
          {subTab !== 'wifi' && (
            <div className="text-center py-5 text-muted">
              Nội dung cho tab <strong>{subTab}</strong> đang được cập nhật...
            </div>
          )}

        </CCardBody>
      </CCard>
    </div>
  )
}

export default MobileAppAttendance