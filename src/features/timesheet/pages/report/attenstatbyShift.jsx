import {
  CButton,
  CCard,
  CCardBody,
  CDropdown,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
  CFormCheck,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CSpinner,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow
} from '@coreui/react'
import { useEffect, useMemo, useState } from 'react'

// Imports cho Icons
import {
  cilArrowTop,
  cilEnvelopeClosed,
  cilFile,
  cilFilter,
  cilSearch,
  cilSettings,
  cilX // Thêm icon đóng popup
} from '@coreui/icons'
import CIcon from '@coreui/icons-react'

// =====================================================================
// 0. CẤU HÌNH CỘT (Dùng cho Settings và Excel)
// =====================================================================
const DEFAULT_COLUMNS = [
  { key: 'date', label: 'Ngày làm việc', visible: true, group: 'main' },
  { key: 'shift', label: 'Ca làm việc', visible: true, group: 'main' },
  { key: 'time', label: 'Thời gian', visible: true, group: 'main' },
  { key: 'assignedCount', label: 'Được phân ca', visible: true, group: 'main' },
  { key: 'presentCount', label: 'Đi làm (SL)', visible: true, group: 'present' },
  { key: 'presentRate', label: 'Đi làm (%)', visible: true, group: 'present' },
  { key: 'absentCount', label: 'Vắng mặt (SL)', visible: true, group: 'absent' },
  { key: 'absentRate', label: 'Vắng mặt (%)', visible: true, group: 'absent' },
]

// =====================================================================
// 1. CSS TÙY CHỈNH
// =====================================================================
const AttendanceStatsStyles = () => (
  <style>
    {`
    .page-container { padding: 1rem; background-color: #f3f4f7; min-height: 100vh; }
    .page-header { margin-bottom: 1rem; }
    .page-title { font-size: 1.3rem; font-weight: 700; margin-bottom: 0.25rem; color: #3c4b64; }
    .page-subtitle { color: #768192; font-size: 0.85rem; }
    .filter-bar { display: flex; justify-content: space-between; align-items: center; padding: 0.5rem 0; }
    .filter-right { display: flex; gap: 8px; align-items: center; width: 100%; justify-content: flex-end; position: relative; }
    .search-bar { width: 250px; }
    .btn-orange { background-color: #ea580c; border-color: #ea580c; color: white; font-weight: 600; }
    .btn-orange:hover { background-color: #c2410c; color: white; border-color: #c2410c; }

    .btn-orange .dropdown-toggle::after { margin-left: 0.5em; }
    .icon-btn { color: #768192; border-color: #d8dbe0; background-color: #fff; padding: 0.375rem 0.5rem; }
    .icon-btn:hover { background-color: #ebedef; color: #3c4b64; }
    .table-header-cell { font-weight: 700; font-size: 0.75rem; background-color: #f0f2f5; color: #3c4b64; vertical-align: middle; text-align: center; border: 1px solid #d8dbe0; }
    .header-group { background-color: #ebedef; }
    .sticky-col-first { position: -webkit-sticky; position: sticky; left: 0; z-index: 10; background-color: #fff; border-right: 1px solid #d8dbe0; }
    .table-header-cell.sticky-col-first { background-color: #f0f2f5; z-index: 20; }
    .empty-state-row { height: 450px; }
    .empty-state-container { display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; color: #8a93a2; }
    .empty-state-text { margin-top: 1rem; font-size: 0.9rem; color: #9da5b1; }

    /* CSS cho Popup */
    .popup-container { position: absolute; top: 100%; right: 0; width: 300px; background: white; border: 1px solid #d8dbe0; box-shadow: 0 4px 12px rgba(0,0,0,0.15); border-radius: 4px; z-index: 1000; margin-top: 5px; display: flex; flex-direction: column; max-height: 400px; }
    .popup-header { display: flex; justify-content: space-between; align-items: center; padding: 10px 15px; border-bottom: 1px solid #ebedef; }
    .popup-title { font-weight: 700; font-size: 0.9rem; margin: 0; }
    .popup-body { padding: 10px 15px; overflow-y: auto; flex-grow: 1; }
    .popup-footer { padding: 10px 15px; border-top: 1px solid #ebedef; display: flex; justify-content: space-between; background-color: #f9fafb; }
    .col-setting-item { display: flex; align-items: center; margin-bottom: 8px; justify-content: space-between; }
    `}
  </style>
)

// =====================================================================
// 2. COMPONENT POPUPS (FILTER & SETTINGS)
// =====================================================================

// Popup Bộ lọc nâng cao
const AdvancedFilterPopup = ({ visible, onClose, onApply, columns }) => {
  const [checkedColumns, setCheckedColumns] = useState({})
  const [columnSearchValues, setColumnSearchValues] = useState({})

  if (!visible) return null

  const handleCheckColumn = (key) => setCheckedColumns(p => ({ ...p, [key]: !p[key] }))

  const handleApply = () => {
    const activeFilters = {}
    Object.keys(checkedColumns).forEach(key => {
      if (checkedColumns[key] && columnSearchValues[key]) {
        activeFilters[key] = columnSearchValues[key]
      }
    })
    onApply(activeFilters)
    onClose()
  }

  const handleClear = () => {
    setCheckedColumns({})
    setColumnSearchValues({})
    onApply({})
    onClose()
  }

  return (
    <div className="popup-container">
      <div className="popup-header">
        <h5 className="popup-title">Bộ lọc nâng cao</h5>
        <CButton color="link" size="sm" className="p-0 text-dark" onClick={onClose}><CIcon icon={cilX} /></CButton>
      </div>
      <div className="popup-body">
        {columns.filter(c => c.visible).map(col => (
          <div key={col.key} className="mb-2">
            <CFormCheck
              label={col.label}
              checked={!!checkedColumns[col.key]}
              onChange={() => handleCheckColumn(col.key)}
            />
            {checkedColumns[col.key] && (
              <CFormInput
                size="sm"
                className="mt-1 ms-4"
                placeholder={`Lọc ${col.label}...`}
                value={columnSearchValues[col.key] || ''}
                onChange={e => setColumnSearchValues(p => ({ ...p, [col.key]: e.target.value }))}
              />
            )}
          </div>
        ))}
      </div>
      <div className="popup-footer">
        <CButton color="light" size="sm" onClick={handleClear}>Bỏ lọc</CButton>
        <CButton size="sm" className="btn-orange" onClick={handleApply}>Áp dụng</CButton>
      </div>
    </div>
  )
}

// Popup Cài đặt cột
const ColumnSettingsPopup = ({ visible, onClose, columns, onUpdateColumns, onResetDefault }) => {
  const [tempColumns, setTempColumns] = useState(columns)
  useEffect(() => { if (visible) setTempColumns(columns) }, [visible, columns])
  
  if (!visible) return null

  const toggleCol = (key) => setTempColumns(prev => prev.map(c => c.key === key ? { ...c, visible: !c.visible } : c))
  
  const handleSave = () => { onUpdateColumns(tempColumns); onClose() }

  return (
    <div className="popup-container">
      <div className="popup-header">
        <h5 className="popup-title">Tùy chỉnh cột</h5>
        <CButton color="link" size="sm" className="p-0 text-dark" onClick={onClose}><CIcon icon={cilX} /></CButton>
      </div>
      <div className="popup-body">
        {tempColumns.map(col => (
          <div key={col.key} className="col-setting-item">
            <CFormCheck label={col.label} checked={col.visible} onChange={() => toggleCol(col.key)} />
          </div>
        ))}
      </div>
      <div className="popup-footer">
        <CButton color="light" size="sm" onClick={() => { onResetDefault(); onClose() }}>Mặc định</CButton>
        <CButton size="sm" className="btn-orange" onClick={handleSave}>Lưu</CButton>
      </div>
    </div>
  )
}

// =====================================================================
// 3. COMPONENT HEADER
// =====================================================================
const PageHeader = () => {
  return (
    <div className="page-header">
      <h2 className="page-title">Thống kê tình hình đi làm, vắng mặt theo ca làm việc</h2>
      <div className="page-subtitle">
        Tháng này, Thống kê theo: Tổng số nhân viên, Ca làm việc: Tất cả ca
      </div>
    </div>
  )
}

// =====================================================================
// 4. COMPONENT FILTER BAR (Đã tích hợp các nút chức năng)
// =====================================================================
const FilterBar = ({ 
  filters, onFilterChange, 
  onExportExcel, 
  onApplyAdvancedFilter, columns, onUpdateColumns, onResetDefaultColumns 
}) => {
  const [showFilterPopup, setShowFilterPopup] = useState(false)
  const [showSettingsPopup, setShowSettingsPopup] = useState(false)

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

        {/* Nút Gửi Email */}
        <CButton color="light" variant="outline" className="icon-btn" size="sm" title="Gửi Email">
          <CIcon icon={cilEnvelopeClosed} size="sm" />
        </CButton>

        {/* --- NÚT XUẤT EXCEL (cilFile) --- */}
        <CButton color="light" variant="outline" className="icon-btn" size="sm" title="Xuất Excel" onClick={onExportExcel}>
          <CIcon icon={cilFile} size="sm" /> 
        </CButton>

        {/* --- NÚT BỘ LỌC (cilFilter) --- */}
        <div style={{ position: 'relative' }}>
          <CButton 
            color="light" variant="outline" className="icon-btn" size="sm" title="Bộ lọc"
            onClick={() => { setShowFilterPopup(!showFilterPopup); setShowSettingsPopup(false) }}
            active={showFilterPopup}
          >
            <CIcon icon={cilFilter} size="sm" />
          </CButton>
          <AdvancedFilterPopup visible={showFilterPopup} onClose={() => setShowFilterPopup(false)} onApply={onApplyAdvancedFilter} columns={columns} />
        </div>

        {/* --- NÚT CÀI ĐẶT (cilSettings) --- */}
        <div style={{ position: 'relative' }}>
          <CButton 
            color="light" variant="outline" className="icon-btn" size="sm" title="Cài đặt"
            onClick={() => { setShowSettingsPopup(!showSettingsPopup); setShowFilterPopup(false) }}
            active={showSettingsPopup}
          >
            <CIcon icon={cilSettings} size="sm" />
          </CButton>
          <ColumnSettingsPopup visible={showSettingsPopup} onClose={() => setShowSettingsPopup(false)} columns={columns} onUpdateColumns={onUpdateColumns} onResetDefault={onResetDefaultColumns} />
        </div>

      </div>
    </div>
  )
}

// =====================================================================
// 5. COMPONENT TABLE (Đã xử lý ẩn/hiện cột)
// =====================================================================
const PageTable = ({ data, columns }) => {
  const hasData = Array.isArray(data) && data.length > 0

  // Helper để kiểm tra visibility
  const isVisible = (key) => columns.find(c => c.key === key)?.visible;

  // Tính colSpan cho các nhóm cột
  const presentCols = ['presentCount', 'presentRate'];
  const absentCols = ['absentCount', 'absentRate'];
  
  const visiblePresent = columns.filter(c => presentCols.includes(c.key) && c.visible).length;
  const visibleAbsent = columns.filter(c => absentCols.includes(c.key) && c.visible).length;

  return (
    <div style={{ borderTop: '1px solid #d8dbe0' }}>
      <CTable hover responsive className="mb-0" small bordered>
        <CTableHead>
          <CTableRow>
            {isVisible('date') && (
              <CTableHeaderCell rowSpan={2} className="table-header-cell sticky-col-first" style={{ width: '150px' }}>
                Ngày làm việc <CIcon icon={cilArrowTop} size="sm" /> (1)
              </CTableHeaderCell>
            )}
            {isVisible('shift') && (
              <CTableHeaderCell rowSpan={2} className="table-header-cell" style={{ width: '150px' }}>
                Ca làm việc <CIcon icon={cilArrowTop} size="sm" /> (2)
              </CTableHeaderCell>
            )}
            {isVisible('time') && (
              <CTableHeaderCell rowSpan={2} className="table-header-cell" style={{ width: '120px' }}>
                Thời gian
              </CTableHeaderCell>
            )}
            {isVisible('assignedCount') && (
              <CTableHeaderCell rowSpan={2} className="table-header-cell" style={{ width: '120px' }}>
                Được phân ca
              </CTableHeaderCell>
            )}
            
            {/* Nhóm cột Đi làm - Chỉ hiện nếu có ít nhất 1 cột con visible */}
            {visiblePresent > 0 && (
              <CTableHeaderCell colSpan={visiblePresent} className="table-header-cell header-group">
                Đi làm
              </CTableHeaderCell>
            )}
            
            {/* Nhóm cột Vắng mặt */}
            {visibleAbsent > 0 && (
              <CTableHeaderCell colSpan={visibleAbsent} className="table-header-cell header-group">
                Vắng mặt
              </CTableHeaderCell>
            )}
          </CTableRow>

          <CTableRow>
            {isVisible('presentCount') && <CTableHeaderCell className="table-header-cell">Số lượng</CTableHeaderCell>}
            {isVisible('presentRate') && <CTableHeaderCell className="table-header-cell">Tỷ lệ (%)</CTableHeaderCell>}
            {isVisible('absentCount') && <CTableHeaderCell className="table-header-cell">Số lượng</CTableHeaderCell>}
            {isVisible('absentRate') && <CTableHeaderCell className="table-header-cell">Tỷ lệ (%)</CTableHeaderCell>}
          </CTableRow>
        </CTableHead>
        
        <CTableBody>
          {!hasData ? (
            <CTableRow>
              {/* Tính tổng số cột đang hiển thị để colSpan cho EmptyState */}
              <CTableDataCell colSpan={columns.filter(c=>c.visible).length} className="p-0 border-0">
                <div className="empty-state-row">
                    <div className="empty-state-container">
                        <span style={{ fontSize: '2rem', marginBottom: '10px', opacity: 0.3, filter: 'grayscale(100%)' }}>📄</span> 
                        <span className="empty-state-text">Không có dữ liệu</span>
                    </div>
                </div>
              </CTableDataCell>
            </CTableRow>
          ) : (
            data.map((item, index) => (
              <CTableRow key={index}>
                {isVisible('date') && <CTableDataCell className="sticky-col-first text-center font-weight-bold">{item.date}</CTableDataCell>}
                {isVisible('shift') && <CTableDataCell className="text-center">{item.shift}</CTableDataCell>}
                {isVisible('time') && <CTableDataCell className="text-center">{item.time}</CTableDataCell>}
                {isVisible('assignedCount') && <CTableDataCell className="text-center">{item.assignedCount}</CTableDataCell>}
                
                {isVisible('presentCount') && <CTableDataCell className="text-center">{item.presentCount}</CTableDataCell>}
                {isVisible('presentRate') && <CTableDataCell className="text-center">{item.presentRate}%</CTableDataCell>}
                
                {isVisible('absentCount') && <CTableDataCell className="text-center">{item.absentCount}</CTableDataCell>}
                {isVisible('absentRate') && <CTableDataCell className="text-center">{item.absentRate}%</CTableDataCell>}
              </CTableRow>
            ))
          )}
        </CTableBody>
      </CTable>
    </div>
  )
}

// =====================================================================
// 6. COMPONENT CHA (MAIN)
// =====================================================================
const AttendanceStatsByShiftPage = () => {
  // Mock Data (để test tính năng, hiện tại bạn để mảng rỗng thì test sẽ ra file Excel có header)
  const [data, setData] = useState([]) 
  const [loading, setLoading] = useState(true)
  const [columns, setColumns] = useState(DEFAULT_COLUMNS)
  const [filters, setFilters] = useState({ search: '', columnFilters: {} })
  
  // Giả lập loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false)
      // Uncomment dòng dưới để test dữ liệu thật
      // setData([{date: '01/10/2023', shift: 'Ca 1', time: '08:00', assignedCount: 10, presentCount: 9, presentRate: 90, absentCount: 1, absentRate: 10}]) 
    }, 500)
    return () => clearTimeout(timer)
  }, [])

  // --- LOGIC LỌC DỮ LIỆU ---
  const filteredData = useMemo(() => {
    return data.filter(item => {
      // 1. Tìm kiếm chung
      const search = filters.search.toLowerCase()
      const matchSearch = !search || Object.values(item).some(v => String(v).toLowerCase().includes(search))

      // 2. Tìm kiếm nâng cao
      const columnFilters = filters.columnFilters || {}
      const matchColumns = Object.keys(columnFilters).every(key => {
        const filterVal = columnFilters[key].toLowerCase()
        const itemVal = String(item[key] || '').toLowerCase()
        return itemVal.includes(filterVal)
      })

      return matchSearch && matchColumns
    })
  }, [data, filters])

  // --- LOGIC XUẤT EXCEL ---
  const handleExportExcel = () => {
    const visibleCols = columns.filter(c => c.visible)
    const headers = visibleCols.map(c => c.label)
    
    // Tạo nội dung CSV
    const csvRows = [headers.join(',')] // Dòng header
    
    filteredData.forEach(item => {
      const rowData = visibleCols.map(c => {
        const val = item[c.key] || ''
        return `"${val}"` // Bọc dấu ngoặc kép để tránh lỗi dấu phẩy
      })
      csvRows.push(rowData.join(','))
    })

    const csvString = csvRows.join('\n')
    // Thêm BOM (\uFEFF) để Excel hiển thị đúng tiếng Việt
    const blob = new Blob(['\uFEFF' + csvString], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', 'thong_ke_ca_lam_viec.csv')
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
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
                onExportExcel={handleExportExcel}
                onApplyAdvancedFilter={(cf) => setFilters(p => ({ ...p, columnFilters: cf }))}
                columns={columns}
                onUpdateColumns={setColumns}
                onResetDefaultColumns={() => setColumns(DEFAULT_COLUMNS)}
              />
            </div>

            {/* Phần Table */}
            <PageTable data={filteredData} columns={columns} />
          </CCardBody>
        </CCard>
      </div>
    </>
  )
}

export default AttendanceStatsByShiftPage