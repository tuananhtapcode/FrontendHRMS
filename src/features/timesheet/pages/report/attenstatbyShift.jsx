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
  cilArrowTop,
  cilEnvelopeClosed,
  cilFile,
  cilFilter,
  cilSearch,
  cilSettings
} from '@coreui/icons'
import CIcon from '@coreui/icons-react'

// =====================================================================
// 1. CSS TÙY CHỈNH (Xử lý Header bảng phức tạp)
// =====================================================================
const AttendanceStatsStyles = () => (
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
      padding: 0.5rem 0;
    }
    .filter-right {
      display: flex;
      gap: 8px;
      align-items: center;
      width: 100%;
      justify-content: flex-end;
    }
    .search-bar {
      width: 250px;
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
      margin-left: 0.5em;
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

    /* --- Table Styles (Header Phức Tạp) --- */
    .table-header-cell {
      font-weight: 700;
      font-size: 0.75rem;
      background-color: #f0f2f5;
      color: #3c4b64;
      vertical-align: middle;
      text-align: center;
      border: 1px solid #d8dbe0; /* Viền cho các ô header */
    }
    
    /* Header nhóm (Đi làm, Vắng mặt) */
    .header-group {
      background-color: #ebedef; 
    }

    /* Cột Sticky (Ngày làm việc) */
    .sticky-col-first {
      position: -webkit-sticky;
      position: sticky;
      left: 0;
      z-index: 10;
      background-color: #fff; 
      border-right: 1px solid #d8dbe0;
    }
    .table-header-cell.sticky-col-first {
        background-color: #f0f2f5; 
        z-index: 20; 
    }
    
    /* --- Empty State --- */
    .empty-state-row {
      height: 450px; /* Chiều cao lớn để đẩy nội dung ra giữa màn hình */
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
      color: #9da5b1;
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
      <h2 className="page-title">Thống kê tình hình đi làm, vắng mặt theo ca làm việc</h2>
      <div className="page-subtitle">
        Tháng này, SinhvienDungThu, Thống kê theo: Tổng số nhân viên, Ca làm việc: Tất cả ca
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
      <div className="filter-left"></div>

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
            <CDropdownItem href="#">Tháng này</CDropdownItem>
            <CDropdownItem href="#">Tháng trước</CDropdownItem>
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
// 4. COMPONENT TABLE (Header Phức Tạp)
// =====================================================================
const PageTable = ({ data }) => {
  const hasData = Array.isArray(data) && data.length > 0

  return (
    <div style={{ borderTop: '1px solid #d8dbe0' }}>
      <CTable hover responsive className="mb-0" small bordered>
        <CTableHead>
          {/* Hàng 1: Các ô gộp dòng (rowSpan) và gộp cột (colSpan) */}
          <CTableRow>
            <CTableHeaderCell rowSpan={2} className="table-header-cell sticky-col-first" style={{ width: '150px' }}>
              Ngày làm việc <CIcon icon={cilArrowTop} size="sm" /> (1)
            </CTableHeaderCell>
            <CTableHeaderCell rowSpan={2} className="table-header-cell" style={{ width: '150px' }}>
              Ca làm việc <CIcon icon={cilArrowTop} size="sm" /> (2)
            </CTableHeaderCell>
            <CTableHeaderCell rowSpan={2} className="table-header-cell" style={{ width: '120px' }}>
              Thời gian
            </CTableHeaderCell>
            <CTableHeaderCell rowSpan={2} className="table-header-cell" style={{ width: '120px' }}>
              Được phân ca
            </CTableHeaderCell>
            
            {/* Nhóm cột Đi làm */}
            <CTableHeaderCell colSpan={2} className="table-header-cell header-group">
              Đi làm
            </CTableHeaderCell>
            
            {/* Nhóm cột Vắng mặt */}
            <CTableHeaderCell colSpan={2} className="table-header-cell header-group">
              Vắng mặt
            </CTableHeaderCell>
          </CTableRow>

          {/* Hàng 2: Các cột con của Đi làm và Vắng mặt */}
          <CTableRow>
            <CTableHeaderCell className="table-header-cell">Số lượng</CTableHeaderCell>
            <CTableHeaderCell className="table-header-cell">Tỷ lệ (%)</CTableHeaderCell>
            <CTableHeaderCell className="table-header-cell">Số lượng</CTableHeaderCell>
            <CTableHeaderCell className="table-header-cell">Tỷ lệ (%)</CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        
        <CTableBody>
          {!hasData ? (
            // Empty State Row (Chiếm trọn 8 cột)
            <CTableRow>
              <CTableDataCell colSpan={8} className="p-0 border-0">
                <div className="empty-state-row">
                    <div className="empty-state-container">
                        {/* Icon Empty State */}
                        <span style={{ fontSize: '2rem', marginBottom: '10px', opacity: 0.3, filter: 'grayscale(100%)' }}>📄</span> 
                        <span className="empty-state-text">Không có dữ liệu</span>
                    </div>
                </div>
              </CTableDataCell>
            </CTableRow>
          ) : (
            // Data Rows
            data.map((item, index) => (
              <CTableRow key={index}>
                <CTableDataCell className="sticky-col-first text-center font-weight-bold">{item.date}</CTableDataCell>
                <CTableDataCell className="text-center">{item.shift}</CTableDataCell>
                <CTableDataCell className="text-center">{item.time}</CTableDataCell>
                <CTableDataCell className="text-center">{item.assignedCount}</CTableDataCell>
                <CTableDataCell className="text-center">{item.presentCount}</CTableDataCell>
                <CTableDataCell className="text-center">{item.presentRate}%</CTableDataCell>
                <CTableDataCell className="text-center">{item.absentCount}</CTableDataCell>
                <CTableDataCell className="text-center">{item.absentRate}%</CTableDataCell>
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
const AttendanceStatsByShiftPage = () => {
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

  if (loading) { 
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <CSpinner color="primary" />
      </div>
    )
  }

  return (
    <> 
      <AttendanceStatsStyles /> 

      <div className="page-container">
        <PageHeader />
        
        <CCard className="border-0 shadow-sm">
          <CCardBody className="p-0"> 
            {/* Phần Filter */}
            <div className="p-2 border-bottom"> 
              <FilterBar 
                filters={filters} 
                onFilterChange={setFilters}
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

export default AttendanceStatsByShiftPage