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
  CTableFoot,
  CTableHead,
  CTableHeaderCell,
  CTableRow
} from '@coreui/react'
import { useEffect, useMemo, useState } from 'react'

// Imports cho Icons
import {
  cilEnvelopeClosed,
  cilFile,
  cilFilter,
  cilSearch,
  cilSettings,
  cilX
} from '@coreui/icons'
import CIcon from '@coreui/icons-react'

// =====================================================================
// 0. CẤU HÌNH CỘT (QUẢN LÝ CỘT & EXCEL)
// =====================================================================
const DEFAULT_COLUMNS = [
  { key: 'stt', label: 'STT', visible: true, width: '50px', align: 'center' },
  { key: 'code', label: 'Mã nhân viên (3)', visible: true, width: '150px', sticky: true }, // Sticky 2
  { key: 'name', label: 'Họ và tên', visible: true, width: '150px' },
  { key: 'department', label: 'Đơn vị công tác (1)', visible: true, width: '150px' },
  { key: 'position', label: 'Vị trí công việc (2)', visible: true, width: '150px' },
  
  // Nhóm cột: Số giờ làm việc
  { key: 'realHours', label: 'Đi làm thực tế trong ca', visible: true, width: '150px', align: 'end' },
  { key: 'otHours', label: 'Làm thêm', visible: true, width: '100px', align: 'end' },
  { key: 'total', label: 'Tổng cộng', visible: true, width: '100px', align: 'end' },
]

// =====================================================================
// 1. CSS TÙY CHỈNH
// =====================================================================
const WorkingHoursStyles = () => (
  <style>
    {`
    .page-container { padding: 1rem; background-color: #f3f4f7; min-height: 100vh; }
    .page-header { margin-bottom: 1rem; }
    .page-title { font-size: 1.3rem; font-weight: 700; margin-bottom: 0.25rem; color: #3c4b64; }
    .page-subtitle { color: #768192; font-size: 0.85rem; }
    .filter-bar { display: flex; justify-content: space-between; align-items: center; padding: 0.5rem 0; }
    .filter-right { display: flex; gap: 8px; align-items: center; width: 100%; justify-content: flex-end; position: relative; }
    .search-bar { width: 300px; }
    
    .btn-orange { background-color: #ea580c; border-color: #ea580c; color: white; font-weight: 600; display: flex; align-items: center; gap: 6px; }
    .btn-orange:hover { background-color: #c2410c; border-color: #c2410c; color: white; }
    .btn-orange .dropdown-toggle::after { margin-left: 0.5em; }

    .icon-btn { color: #768192; border-color: #d8dbe0; background-color: #fff; padding: 0.375rem 0.5rem; }
    .icon-btn:hover { background-color: #ebedef; color: #3c4b64; }

    /* Table Styles */
    .table-header-cell { font-weight: 700; font-size: 0.75rem; background-color: #f0f2f5; color: #3c4b64; vertical-align: middle; text-align: center; border: 1px solid #d8dbe0; white-space: nowrap; }
    
    /* Sticky Column Logic */
    .sticky-col-pin { position: -webkit-sticky; position: sticky; left: 50px; z-index: 10; background-color: #fff; border-right: 1px solid #d8dbe0; width: 40px; }
    .sticky-col-code { position: -webkit-sticky; position: sticky; left: 90px; z-index: 10; background-color: #fff; border-right: 1px solid #d8dbe0; }
    
    /* Header của cột sticky */
    .table-header-cell.sticky-col-code, .table-header-cell.sticky-col-pin { background-color: #f0f2f5; z-index: 20; }
    
    /* Footer Table */
    .table-footer-cell { font-weight: 700; background-color: #fff; border-top: 2px solid #d8dbe0; vertical-align: middle; font-size: 0.8rem; }

    /* Empty State */
    .empty-state-row { height: 450px; }
    .empty-state-container { display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; color: #8a93a2; }
    .empty-state-text { margin-top: 1rem; font-size: 0.9rem; color: #9da5b1; }

    /* Popup Styles */
    .popup-container { position: absolute; top: 100%; right: 0; width: 320px; background: white; border: 1px solid #d8dbe0; box-shadow: 0 4px 12px rgba(0,0,0,0.15); border-radius: 4px; z-index: 1000; margin-top: 5px; display: flex; flex-direction: column; max-height: 500px; }
    .popup-header { display: flex; justify-content: space-between; align-items: center; padding: 12px 16px; border-bottom: 1px solid #ebedef; }
    .popup-title { font-weight: 700; font-size: 1rem; color: #3c4b64; margin: 0; }
    .popup-body { padding: 12px 16px; overflow-y: auto; flex-grow: 1; }
    .popup-footer { padding: 12px 16px; border-top: 1px solid #ebedef; display: flex; justify-content: space-between; background-color: #f9fafb; }
    .col-setting-item { display: flex; align-items: center; margin-bottom: 10px; justify-content: space-between; }
    `}
  </style>
)

// =====================================================================
// 2. COMPONENT POPUPS (FILTER & SETTINGS)
// =====================================================================

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
        {columns.filter(c => c.key !== 'stt' && c.key !== 'pin' && c.visible).map(col => (
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
        <CButton size="sm" className="btn-orange text-white" onClick={handleApply}>Áp dụng</CButton>
      </div>
    </div>
  )
}

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
        <CButton size="sm" className="btn-orange text-white" onClick={handleSave}>Lưu</CButton>
      </div>
    </div>
  )
}

// =====================================================================
// 3. COMPONENT HEADER
// =====================================================================
const PageHeader = () => (
  <div className="page-header">
    <h2 className="page-title">Tổng hợp số giờ làm việc của nhân viên</h2>
    <div className="page-subtitle">Tháng này, Trạng thái lao động: Đang làm việc</div>
  </div>
)

// =====================================================================
// 4. COMPONENT FILTER BAR (ĐÃ TÍCH HỢP)
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
        {/* Search */}
        <CInputGroup className="search-bar" size="sm">
          <CInputGroupText className="bg-white border-end-0"><CIcon icon={cilSearch} size="sm" /></CInputGroupText>
          <CFormInput className="border-start-0 ps-0" placeholder="Tìm kiếm" value={filters.search} onChange={handleSearchChange} />
        </CInputGroup>
        
        {/* Dropdown */}
        <CDropdown>
          <CDropdownToggle className="btn-orange" size="sm">Chọn tham số</CDropdownToggle>
          <CDropdownMenu>
            <CDropdownItem href="#">Tháng này</CDropdownItem>
            <CDropdownItem href="#">Tháng trước</CDropdownItem>
          </CDropdownMenu>
        </CDropdown>

        {/* Buttons */}
        <CButton color="light" variant="outline" className="icon-btn" size="sm" title="Gửi Email"><CIcon icon={cilEnvelopeClosed} size="sm" /></CButton>
        
        {/* EXCEL */}
        <CButton color="light" variant="outline" className="icon-btn" size="sm" title="Xuất Excel" onClick={onExportExcel}>
          <CIcon icon={cilFile} size="sm" /> 
        </CButton>

        {/* FILTER */}
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

        {/* SETTINGS */}
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
// 5. COMPONENT TABLE (ĐÃ CẬP NHẬT RENDER ĐỘNG)
// =====================================================================
const PageTable = ({ data, columns }) => {
  const hasData = Array.isArray(data) && data.length > 0
  
  // Lọc cột hiển thị
  const visibleColumns = columns.filter(c => c.visible)

  // -- LOGIC CỘT CON --
  const workingCols = ['realHours', 'otHours', 'total']
  const visibleWorkingCols = columns.filter(c => workingCols.includes(c.key) && c.visible).length

  // -- LOGIC FOOTER COLSPAN --
  // Tìm index của cột số liệu đầu tiên để tính gộp ô "Tổng cộng"
  const firstMetricIndex = visibleColumns.findIndex(c => workingCols.includes(c.key))
  const footerColSpan = firstMetricIndex > -1 ? firstMetricIndex : visibleColumns.length

  // Tính toán tổng (Giả lập)
  const totals = {
    realHours: 0,
    otHours: 0,
    total: 0
  }

  // Helper
  const isVisible = (key) => columns.find(c => c.key === key)?.visible

  return (
    <div style={{ borderTop: '1px solid #d8dbe0' }}>
      <CTable hover responsive className="mb-0" small bordered>
        <CTableHead>
          <CTableRow>
            {isVisible('stt') && <CTableHeaderCell rowSpan={2} className="table-header-cell" style={{ width: '50px' }}>STT</CTableHeaderCell>}
            {isVisible('pin') && <CTableHeaderCell rowSpan={2} className="table-header-cell sticky-col-pin" style={{ width: '40px' }}><span style={{fontSize: '0.8rem'}}>📌</span></CTableHeaderCell>}
            {isVisible('code') && <CTableHeaderCell rowSpan={2} className="table-header-cell sticky-col-code" style={{ width: '150px' }}>Mã nhân viên (3)</CTableHeaderCell>}
            
            {isVisible('name') && <CTableHeaderCell rowSpan={2} className="table-header-cell" style={{ minWidth: '150px' }}>Họ và tên</CTableHeaderCell>}
            {isVisible('department') && <CTableHeaderCell rowSpan={2} className="table-header-cell" style={{ minWidth: '150px' }}>Đơn vị công tác (1)</CTableHeaderCell>}
            {isVisible('position') && <CTableHeaderCell rowSpan={2} className="table-header-cell" style={{ minWidth: '150px' }}>Vị trí công việc (2)</CTableHeaderCell>}
            
            {/* Nhóm cột "Số giờ làm việc" */}
            {visibleWorkingCols > 0 && (
              <CTableHeaderCell colSpan={visibleWorkingCols} className="table-header-cell" style={{backgroundColor: '#ebedef'}}>
                Số giờ làm việc
              </CTableHeaderCell>
            )}
          </CTableRow>

          {/* Hàng 2: Các cột con */}
          <CTableRow>
            {isVisible('realHours') && <CTableHeaderCell className="table-header-cell">Đi làm thực tế trong ca</CTableHeaderCell>}
            {isVisible('otHours') && <CTableHeaderCell className="table-header-cell">Làm thêm</CTableHeaderCell>}
            {isVisible('total') && <CTableHeaderCell className="table-header-cell">Tổng cộng</CTableHeaderCell>}
          </CTableRow>
        </CTableHead>
        
        <CTableBody>
          {!hasData ? (
            <CTableRow>
              <CTableDataCell colSpan={visibleColumns.length} className="p-0 border-0">
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
              <CTableRow key={item.id || index}>
                {visibleColumns.map(col => {
                  let className = ""
                  // Xử lý sticky
                  if (col.key === 'pin') className += " sticky-col-pin text-center"
                  if (col.key === 'code') className += " sticky-col-code font-weight-bold"
                  if (col.align) className += ` text-${col.align}`
                  
                  let content = item[col.key]
                  
                  if (col.key === 'stt') content = index + 1
                  if (col.key === 'pin') content = ''
                  if (col.key === 'total') className += " font-weight-bold"

                  return (
                    <CTableDataCell key={col.key} className={className}>
                      {content}
                    </CTableDataCell>
                  )
                })}
              </CTableRow>
            ))
          )}
        </CTableBody>

        {/* Footer - Tổng cộng */}
        {hasData && (
          <CTableFoot>
            <CTableRow>
              <CTableHeaderCell colSpan={footerColSpan} className="table-footer-cell ps-3 sticky-footer-label text-start">
                Tổng cộng
              </CTableHeaderCell>
              
              {visibleColumns.slice(footerColSpan).map(col => {
                 let content = ""
                 if(totals[col.key] !== undefined) content = totals[col.key]
                 
                 return (
                   <CTableHeaderCell key={`foot-${col.key}`} className={`table-footer-cell text-${col.align || 'center'}`}>
                     {content}
                   </CTableHeaderCell>
                 )
              })}
            </CTableRow>
          </CTableFoot>
        )}
      </CTable>
    </div>
  )
}

// =====================================================================
// 5. COMPONENT CHA (MAIN)
// =====================================================================
const TotalWorkingHoursPage = () => {
  // Mock Data (Bỏ comment để hiện data test)
  // const MOCK_DATA = [
  //   { id: 1, code: 'NV001', name: 'Nguyễn Văn A', position: 'Nhân viên', department: 'IT', realHours: 160, otHours: 10, total: 170 },
  //   { id: 2, code: 'NV002', name: 'Trần Thị B', position: 'Kế toán', department: 'TC', realHours: 160, otHours: 0, total: 160 },
  // ]

  const [data, setData] = useState([]) // Mặc định rỗng để hiện empty state
  const [loading, setLoading] = useState(true)
  const [columns, setColumns] = useState(DEFAULT_COLUMNS)
  const [filters, setFilters] = useState({ search: '', columnFilters: {} })
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false)
      // setData(MOCK_DATA) 
    }, 500)
    return () => clearTimeout(timer)
  }, [])

  // --- LOGIC LỌC DỮ LIỆU ---
  const filteredData = useMemo(() => {
    return data.filter(item => {
      const search = filters.search.toLowerCase()
      const matchSearch = !search || Object.values(item).some(v => String(v).toLowerCase().includes(search))

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
    const visibleCols = columns.filter(c => c.visible && c.key !== 'pin')
    const headers = visibleCols.map(c => c.label)
    
    const csvRows = [headers.join(',')]
    
    filteredData.forEach((item, index) => {
      const rowData = visibleCols.map(c => {
        let val = item[c.key] || ''
        if (c.key === 'stt') val = index + 1
        return `"${val}"`
      })
      csvRows.push(rowData.join(','))
    })

    const csvString = csvRows.join('\n')
    const blob = new Blob(['\uFEFF' + csvString], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', 'tong_hop_gio_lam.csv')
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
      <WorkingHoursStyles /> 

      <div className="page-container">
        <PageHeader />
        
        <CCard className="border-0 shadow-sm">
          <CCardBody className="p-0"> 
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

            <PageTable data={filteredData} columns={columns} />
          </CCardBody>
        </CCard>
      </div>
    </>
  )
}

export default TotalWorkingHoursPage