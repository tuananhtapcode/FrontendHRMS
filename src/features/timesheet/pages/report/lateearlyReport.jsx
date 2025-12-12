import {
  CButton,
  CCard,
  CCardBody,
  CDropdown,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CSpinner,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
import { useEffect, useState } from 'react'

// Imports cho Icons
import {
  cilEnvelopeClosed, // Icon Email
  cilFile,
  cilFilter,
  cilSearch,
  cilSettings
} from '@coreui/icons'
import CIcon from '@coreui/icons-react'

// =====================================================================
// 1. CSS TÙY CHỈNH
// =====================================================================
const LateEarlyReportStyles = () => (
  <style>
    {`
    .page-container {
      padding: 1rem;
      background-color: #f3f4f7;
      min-height: 100vh;
    }

    /* --- Header --- */
    .page-header {
      margin-bottom: 1rem;
    }
    .page-title {
      font-size: 1.3rem;
      font-weight: 700;
      margin-bottom: 0.25rem;
      color: #3c4b64;
    }
    .page-subtitle {
      color: #768192;
      font-size: 0.85rem;
    }

    /* --- Filter Bar --- */
    .filter-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0; 
      padding: 0.5rem 0;
    }
    .filter-right {
      display: flex;
      gap: 8px;
      align-items: center;
    }
    .search-bar {
      width: 300px;
    }
    
    /* Nút Chọn tham số (Màu Cam) */
    .btn-orange {
      background-color: #f9b115;
      border-color: #f9b115;
      color: #fff;
      font-weight: 600;
      font-size: 0.875rem;
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .btn-orange:hover {
      background-color: #e59d0e;
      border-color: #e59d0e;
      color: #fff;
    }
    .btn-orange .dropdown-toggle::after {
      margin-left: 0.5em; /* Chỉnh khoảng cách mũi tên */
    }

    /* Nút Icon nhỏ */
    .icon-btn {
      color: #768192;
      border-color: #d8dbe0;
      background-color: #fff;
      padding: 0.375rem 0.5rem;
    }
    .icon-btn:hover {
      background-color: #ebedef;
      color: #3c4b64;
    }

    /* --- Table Styles --- */
    .table-header-cell {
      font-weight: 700;
      font-size: 0.75rem;
      background-color: #f0f2f5; /* Màu nền header xám nhạt */
      color: #3c4b64;
      white-space: nowrap;
      vertical-align: middle;
      text-align: center;
      border-bottom: 1px solid #d8dbe0;
    }
    
    /* Cột dính (Sticky) */
    .sticky-col-first {
      position: -webkit-sticky;
      position: sticky;
      left: 0;
      z-index: 10;
      background-color: #fff; 
      border-right: 1px solid #d8dbe0;
    }
    .table-header-cell.sticky-col-first {
        background-color: #f0f2f5; /* Header dính cũng phải xám */
        z-index: 20; /* Header dính phải nổi cao nhất */
    }
    
    /* --- Empty State --- */
    .empty-state-row {
      height: 400px; /* Chiều cao cố định để căn giữa */
    }
    .empty-state-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100%;
      color: #8a93a2;
    }
    .empty-state-text {
      margin-top: 1rem;
      font-size: 0.9rem;
    }
    `}
  </style>
)

// =====================================================================
// 2. COMPONENT HEADER
// =====================================================================
const PageHeader = () => {
  return (
    <div className="page-header">
      <h2 className="page-title">Danh sách nhân viên đi muộn, về sớm, nghỉ</h2>
      <div className="page-subtitle">
        Hôm nay, SinhvienDungThu, Xem theo: Đi muộn
      </div>
    </div>
  )
}

// =====================================================================
// 3. COMPONENT FILTER BAR
// =====================================================================
const FilterBar = ({ filters, onFilterChange }) => {
  const handleSearchChange = (e) => {
    onFilterChange((prev) => ({ ...prev, search: e.target.value }))
  }

  return (
    <div className="filter-bar">
      <div className="filter-left">
         {/* Trống bên trái, chỉ có search bên phải trong ảnh, nhưng tôi để search bên phải cho giống layout chung */}
      </div>
      <div className="filter-right">
        {/* Thanh tìm kiếm */}
        <CInputGroup className="search-bar" size="sm">
          <CInputGroupText className="bg-white border-end-0">
            <CIcon icon={cilSearch} size="sm" />
          </CInputGroupText>
          <CFormInput
            className="border-start-0 ps-0"
            placeholder="Tìm kiếm"
            value={filters.search}
            onChange={handleSearchChange}
          />
        </CInputGroup>
        
        {/* Nút Chọn tham số (Màu Cam) */}
        <CDropdown>
          <CDropdownToggle className="btn-orange" size="sm">
            Chọn tham số
          </CDropdownToggle>
          <CDropdownMenu>
            <CDropdownItem href="#">Tham số 1</CDropdownItem>
            <CDropdownItem href="#">Tham số 2</CDropdownItem>
          </CDropdownMenu>
        </CDropdown>

        {/* Các nút icon nhỏ */}
        <CButton color="light" variant="outline" className="icon-btn" size="sm" title="Gửi Email">
          <CIcon icon={cilEnvelopeClosed} size="sm" />
        </CButton>
        <CButton color="light" variant="outline" className="icon-btn" size="sm" title="Xuất Excel">
          <CIcon icon={cilFile} size="sm" /> 
        </CButton>
        <CButton color="light" variant="outline" className="icon-btn" size="sm" title="Bộ lọc">
          <CIcon icon={cilFilter} size="sm" />
        </CButton>
        <CButton color="light" variant="outline" className="icon-btn" size="sm" title="Cài đặt">
          <CIcon icon={cilSettings} size="sm" />
        </CButton>
      </div>
    </div>
  )
}

// =====================================================================
// 4. COMPONENT TABLE
// =====================================================================
const PageTable = ({ data }) => {
  const hasData = Array.isArray(data) && data.length > 0

  return (
    <div style={{ borderTop: '1px solid #d8dbe0' }}>
      <CTable hover responsive className="mb-0" small>
        <CTableHead>
          <CTableRow>
            <CTableHeaderCell className="table-header-cell" style={{ width: '40px' }}>STT</CTableHeaderCell>
            <CTableHeaderCell className="table-header-cell sticky-col-first text-start" style={{ width: '120px' }}>
              Mã nhân viên (2)
            </CTableHeaderCell>
            <CTableHeaderCell className="table-header-cell" style={{ width: '30px' }}>
                {/* Icon cái ghim */}
                <span style={{fontSize: '0.8rem'}}>📌</span>
            </CTableHeaderCell>
            <CTableHeaderCell className="table-header-cell text-start">Tên nhân viên</CTableHeaderCell>
            <CTableHeaderCell className="table-header-cell">Vị trí công việc</CTableHeaderCell>
            <CTableHeaderCell className="table-header-cell">Đơn vị công tác</CTableHeaderCell>
            <CTableHeaderCell className="table-header-cell">Ngày (1)</CTableHeaderCell>
            <CTableHeaderCell className="table-header-cell">Ca</CTableHeaderCell>
            <CTableHeaderCell className="table-header-cell text-end">Số phút</CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {!hasData ? (
            // Empty State Row (Chiếm trọn 9 cột)
            <CTableRow>
              <CTableDataCell colSpan={9} className="p-0 border-0">
                <div className="empty-state-row">
                    <div className="empty-state-container">
                        {/* Bạn có thể dùng CIcon cilDescription hoặc một SVG khác nếu muốn */}
                        <span style={{ fontSize: '1.5rem', marginBottom: '10px', opacity: 0.5 }}>📄</span> 
                        <span className="empty-state-text">Không có dữ liệu</span>
                    </div>
                </div>
              </CTableDataCell>
            </CTableRow>
          ) : (
            // Data Rows
            data.map((item, index) => (
              <CTableRow key={item.id}>
                <CTableDataCell className="text-center">{index + 1}</CTableDataCell>
                <CTableDataCell className="sticky-col-first font-weight-bold">{item.code}</CTableDataCell>
                <CTableDataCell className="text-center"></CTableDataCell>
                <CTableDataCell>{item.name}</CTableDataCell>
                <CTableDataCell className="text-center">{item.position}</CTableDataCell>
                <CTableDataCell className="text-center">{item.department}</CTableDataCell>
                <CTableDataCell className="text-center">{item.date}</CTableDataCell>
                <CTableDataCell className="text-center">{item.shift}</CTableDataCell>
                <CTableDataCell className="text-end text-danger font-weight-bold">{item.minutes}</CTableDataCell>
              </CTableRow>
            ))
          )}
        </CTableBody>
      </CTable>
    </div>
  )
}

// =====================================================================
// 5. COMPONENT CHA (MAIN)
// =====================================================================
const LateEarlyReportPage = () => {
  // State data: để rỗng ([]) để hiển thị Empty State như ảnh
  const [data, setData] = useState([]) 
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    search: '',
  })
  
  // Giả lập loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false)
    }, 500)
    return () => clearTimeout(timer)
  }, [])

  const handleReload = () => {
    setLoading(true)
    setTimeout(() => setLoading(false), 500)
  }

  if (loading) { 
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <CSpinner color="primary" />
      </div>
    )
  }

  return (
    <> 
      <LateEarlyReportStyles /> 

      <div className="page-container">
        <PageHeader />
        
        <CCard className="border-0 shadow-sm">
          <CCardBody className="p-0"> 
            {/* Phần Filter nằm bên trong Card */}
            <div className="p-2 border-bottom"> 
              <FilterBar 
                filters={filters} 
                onFilterChange={setFilters}
                onReload={handleReload}
              />
            </div>

            {/* Phần Table */}
            <PageTable data={data} />
          </CCardBody>
        </CCard>
      </div>
    </>
  )
}

export default LateEarlyReportPage