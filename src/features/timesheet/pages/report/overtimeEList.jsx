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
  CTableFoot,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
import { useEffect, useState } from 'react'

// Imports cho Icons
import {
  cilEnvelopeClosed,
  cilFile,
  cilFilter,
  cilSearch,
  cilSettings
} from '@coreui/icons'
import CIcon from '@coreui/icons-react'

// =====================================================================
// 1. CSS TÙY CHỈNH
// =====================================================================
const OvertimeListStyles = () => (
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

    /* --- Table Styles --- */
    .table-header-cell {
      font-weight: 700;
      font-size: 0.75rem;
      background-color: #f0f2f5; /* Màu nền header xám nhạt */
      color: #3c4b64;
      vertical-align: middle;
      text-align: center;
      border: 1px solid #d8dbe0;
      white-space: nowrap;
      height: 45px;
    }

    /* Cột Sticky 1: Mã nhân viên */
    .sticky-col-code {
      position: -webkit-sticky;
      position: sticky;
      left: 50px; /* Cách trái 50px (sau cột STT) */
      z-index: 10;
      background-color: #fff; 
      border-right: 1px solid #d8dbe0;
    }

    /* Header của cột sticky */
    .table-header-cell.sticky-col-code {
        background-color: #f0f2f5; 
        z-index: 20; 
    }
    
    /* --- Footer Table --- */
    .table-footer-cell {
        font-weight: 700;
        background-color: #fff;
        border-top: 2px solid #d8dbe0;
        vertical-align: middle;
        font-size: 0.8rem;
        height: 40px;
    }

    /* --- Empty State --- */
    .empty-state-row {
      height: 450px; 
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
      <h2 className="page-title">Danh sách nhân viên làm thêm giờ</h2>
      <div className="page-subtitle">
        Tháng này, SinhvienDungThu
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
        
        {/* Nút Chọn tham số */}
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
// 4. COMPONENT TABLE
// =====================================================================
const PageTable = ({ data }) => {
  const hasData = Array.isArray(data) && data.length > 0

  // Tính tổng cho Footer (Giả lập - nếu data rỗng thì là 0)
  const totals = {
    totalHours: 0,
    paidHours: 0,
    compHours: 0
  }

  return (
    <div style={{ borderTop: '1px solid #d8dbe0' }}>
      <CTable hover responsive className="mb-0" small bordered>
        <CTableHead>
          <CTableRow>
            <CTableHeaderCell className="table-header-cell" style={{ width: '50px' }}>STT</CTableHeaderCell>
            <CTableHeaderCell className="table-header-cell sticky-col-code" style={{ width: '150px' }}>
              Mã nhân viên
            </CTableHeaderCell>
            <CTableHeaderCell className="table-header-cell" style={{ width: '30px' }}>
                 <span style={{fontSize: '0.8rem'}}>📌</span>
            </CTableHeaderCell>
            <CTableHeaderCell className="table-header-cell" style={{ minWidth: '150px' }}>
              Tên nhân viên
            </CTableHeaderCell>
            <CTableHeaderCell className="table-header-cell" style={{ minWidth: '150px' }}>
              Vị trí công việc (2)
            </CTableHeaderCell>
            <CTableHeaderCell className="table-header-cell" style={{ minWidth: '150px' }}>
              Đơn vị công tác (1)
            </CTableHeaderCell>
            <CTableHeaderCell className="table-header-cell" style={{ minWidth: '120px' }}>
              Ngày làm thêm (3)
            </CTableHeaderCell>
            <CTableHeaderCell className="table-header-cell" style={{ minWidth: '100px' }}>
              Tổng giờ
            </CTableHeaderCell>
            <CTableHeaderCell className="table-header-cell" style={{ minWidth: '150px' }}>
              Làm thêm hưởng lương
            </CTableHeaderCell>
            <CTableHeaderCell className="table-header-cell" style={{ minWidth: '150px' }}>
              Làm thêm nghỉ bù
            </CTableHeaderCell>
            <CTableHeaderCell className="table-header-cell" style={{ minWidth: '200px' }}>
              Lý do làm thêm
            </CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        
        <CTableBody>
          {!hasData ? (
            // Empty State Row
            <CTableRow>
              <CTableDataCell colSpan={11} className="p-0 border-0">
                <div className="empty-state-row">
                    <div className="empty-state-container">
                        <span style={{ fontSize: '2rem', marginBottom: '10px', opacity: 0.3, filter: 'grayscale(100%)' }}>📄</span> 
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
                <CTableDataCell className="sticky-col-code font-weight-bold">{item.code}</CTableDataCell>
                <CTableDataCell className="text-center"></CTableDataCell>
                <CTableDataCell>{item.name}</CTableDataCell>
                <CTableDataCell>{item.position}</CTableDataCell>
                <CTableDataCell>{item.department}</CTableDataCell>
                <CTableDataCell className="text-center">{item.otDate}</CTableDataCell>
                <CTableDataCell className="text-end font-weight-bold">{item.totalHours}</CTableDataCell>
                <CTableDataCell className="text-end">{item.paidHours}</CTableDataCell>
                <CTableDataCell className="text-end">{item.compHours}</CTableDataCell>
                <CTableDataCell>{item.reason}</CTableDataCell>
              </CTableRow>
            ))
          )}
        </CTableBody>

        {/* Footer - Tổng cộng */}
        <CTableFoot>
          <CTableRow>
            {/* Gộp 7 cột đầu tiên cho chữ "Tổng cộng" */}
            <CTableHeaderCell colSpan={7} className="table-footer-cell ps-3 text-start">
              Tổng cộng
            </CTableHeaderCell>
            <CTableHeaderCell className="table-footer-cell text-end">{totals.totalHours}</CTableHeaderCell>
            <CTableHeaderCell className="table-footer-cell text-end">{totals.paidHours}</CTableHeaderCell>
            <CTableHeaderCell className="table-footer-cell text-end">{totals.compHours}</CTableHeaderCell>
            <CTableHeaderCell className="table-footer-cell"></CTableHeaderCell>
          </CTableRow>
        </CTableFoot>
      </CTable>
    </div>
  )
}

// =====================================================================
// 5. COMPONENT CHA (MAIN)
// =====================================================================
const OvertimeEmployeeListPage = () => {
  const [data, setData] = useState([]) // Để rỗng để hiện Empty State
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({ search: '' })
  
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
      <OvertimeListStyles /> 

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

export default OvertimeEmployeeListPage