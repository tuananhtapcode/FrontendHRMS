
import {
  CButton,
  CCard,
  CCardBody,
  CCol,
  CDropdown,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
  CForm,
  CFormCheck,
  CFormInput,
  CFormLabel,
  CFormSelect,
  CInputGroup,
  CInputGroupText,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CRow,
  CSpinner,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CTooltip
} from '@coreui/react'
import { useCallback, useEffect, useMemo, useState } from 'react'

// Imports Icons
import {
  cilFilter,
  cilInfo,
  cilPencil,
  cilPlus,
  cilReload,
  cilSearch,
  cilSettings,
  cilTrash,
  cilX
} from '@coreui/icons'
import CIcon from '@coreui/icons-react'

// =====================================================================
// 0. CẤU HÌNH CỘT MẶC ĐỊNH CHO BẢNG CHÍNH
// =====================================================================
const DEFAULT_COLUMNS = [
  { key: 'checkbox', label: '', visible: true, width: '40px', fixed: 'left' },
  { key: 'name', label: 'Tên bảng chấm công', visible: true, minWidth: '250px' },
  { key: 'timeRange', label: 'Thời gian', visible: true, minWidth: '180px' },
  { key: 'type', label: 'Chấm công', visible: true, minWidth: '200px' },
  { key: 'unit', label: 'Đơn vị áp dụng', visible: true, minWidth: '150px' },
  { key: 'position', label: 'Vị trí áp dụng', visible: true, minWidth: '180px' },
  { key: 'status', label: 'Trạng thái xác nhận', visible: true, minWidth: '160px' },
  { key: 'actions', label: '', visible: true, width: '90px', fixed: 'right' }
]

// =====================================================================
// 1. CSS TÙY CHỈNH (STYLES) - Đã cập nhật cho Modal
// =====================================================================
const SummaryTimesheetStyles = () => (
  <style>
    {`
    /* === Layout === */
    .page-container {
      padding: 1rem;
      background-color: #f3f4f7;
      height: 100vh;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }
    .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; flex-shrink: 0; }
    .page-title { font-size: 1.75rem; font-weight: 500; margin: 0; }
    
    /* === Filter Bar === */
    .filter-bar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; flex-shrink: 0; }
    .filter-left { flex-grow: 1; margin-right: 1rem; max-width: 400px; }
    .filter-right { display: flex; gap: 8px; align-items: center; position: relative; }
    
    /* === Buttons === */
    .btn-orange { background-color: #ea580c; border-color: #ea580c; color: white; font-weight: 600; display: flex; align-items: center; }
    .btn-orange:hover { background-color: #c2410c; color: white; border-color: #c2410c; }

    /* === Table Wrapper (Full Height) === */
    .card-full-height { flex-grow: 1; display: flex; flex-direction: column; overflow: hidden; border: none; box-shadow: 0 1px 2px rgba(0,0,0,0.05); }
    .table-wrapper-fullscreen { flex-grow: 1; background-color: #fff; overflow: auto; position: relative; }
    
    /* === Sticky Headers & Columns === */
    .table-header-cell { background-color: #f8f9fa; white-space: nowrap; font-weight: 600; position: sticky; top: 0; z-index: 10; border-bottom: 1px solid #d8dbe0; vertical-align: top; }
    .sticky-col-first { position: sticky; left: 0; z-index: 11; background-color: #fff; box-shadow: 2px 0 5px rgba(0,0,0,0.05); }
    .sticky-col-last { position: sticky; right: 0; z-index: 11; background-color: #fff; box-shadow: -2px 0 5px rgba(0,0,0,0.05); }
    .table-header-cell.sticky-col-first { z-index: 20; background-color: #f8f9fa; }
    .table-header-cell.sticky-col-last { z-index: 20; background-color: #f8f9fa; }

    /* === Row Hover Actions === */
    .row-actions { display: flex; gap: 8px; justify-content: center; opacity: 0; visibility: hidden; transition: all 0.2s; }
    tbody tr:hover .row-actions { opacity: 1; visibility: visible; }
    .btn-action { width: 32px; height: 32px; border-radius: 50%; border: none; background: transparent; display: flex; align-items: center; justify-content: center; transition: all 0.2s; color: #768192; }
    .btn-action:hover { background-color: #e2e8f0; transform: scale(1.1); }
    .btn-action.edit:hover { color: #f59e0b; background-color: #fef3c7; }
    .btn-action.delete:hover { color: #ef4444; background-color: #fee2e2; }

    /* === Misc === */
    .status-badge { background-color: #f2f4f6; color: #636f83; padding: 4px 10px; border-radius: 4px; font-size: 0.875rem; white-space: nowrap; }
    
    /* === Popups Styles === */
    .popup-wrapper { position: relative; display: inline-block; }
    .popup-container { 
        position: absolute; top: 100%; right: 0; width: 320px; 
        background: white; border: 1px solid #d8dbe0; box-shadow: 0 4px 12px rgba(0,0,0,0.15); 
        border-radius: 4px; z-index: 1000; margin-top: 5px; 
        display: flex; flex-direction: column; max-height: 450px; 
    }
    .popup-header { display: flex; justify-content: space-between; align-items: center; padding: 12px 16px; border-bottom: 1px solid #ebedef; }
    .popup-title { font-weight: 700; font-size: 1rem; color: #3c4b64; margin: 0; }
    .popup-body { padding: 12px 16px; overflow-y: auto; flex-grow: 1; }
    .popup-footer { padding: 12px 16px; border-top: 1px solid #ebedef; display: flex; justify-content: space-between; background-color: #f9fafb; }
    .filter-item { margin-bottom: 8px; }
    .popup-filter-input { margin-top: 5px; margin-left: 24px; width: calc(100% - 24px); font-size: 0.875rem; }

    /* === MODAL STYLES (NEW) === */
    .add-timesheet-modal .modal-dialog { max-width: 800px; margin-top: 15vh; }
    .required-label::after { content: ' *'; color: #e55353; }
    .info-icon { width: 14px; height: 14px; margin-left: 4px; color: #636f83; cursor: help; }
    
    /* Table trong modal */
    .modal-table-wrapper { border: 1px solid #d8dbe0; border-radius: 4px; overflow: hidden; margin-top: 10px; }
    .modal-table-scroll { max-height: 300px; overflow-y: auto; overflow-x: auto; }
    .modal-table-scroll table { min-width: 100%; white-space: nowrap; }
    .modal-table-scroll th { background-color: #f8f9fa; position: sticky; top: 0; z-index: 5; border-bottom: 1px solid #d8dbe0; }
    `}
  </style>
)

// =====================================================================
// 2. COMPONENT POPUP: BỘ LỌC NÂNG CAO
// =====================================================================
const AdvancedFilterPopup = ({ visible, onClose, columns, filterValues, onApply, onClear }) => {
  const [tempValues, setTempValues] = useState(filterValues);
  useEffect(() => { if (visible) setTempValues(filterValues) }, [visible, filterValues]);

  if (!visible) return null;

  const handleToggle = (key) => {
    setTempValues(prev => {
        if (prev[key] !== undefined) {
            const next = { ...prev };
            delete next[key];
            return next;
        } else {
            return { ...prev, [key]: '' };
        }
    })
  }

  return (
    <div className="popup-container">
      <div className="popup-header">
        <h5 className="popup-title">Lọc theo cột</h5>
        <CButton color="link" onClick={onClose} className="p-0 text-secondary"><CIcon icon={cilX} /></CButton>
      </div>
      <div className="popup-body">
        {columns.map(col => (
          col.key !== 'checkbox' && col.key !== 'actions' && (
            <div key={col.key} className="filter-item">
              <CFormCheck 
                id={`filter-check-${col.key}`} label={col.label} checked={tempValues[col.key] !== undefined} 
                onChange={() => handleToggle(col.key)}
              />
              {tempValues[col.key] !== undefined && (
                <CFormInput size="sm" className="popup-filter-input" placeholder={`Nhập để lọc ${col.label}...`}
                    value={tempValues[col.key]} onChange={(e) => setTempValues({...tempValues, [col.key]: e.target.value})} autoFocus
                />
              )}
            </div>
          )
        ))}
      </div>
      <div className="popup-footer">
        <CButton color="light" size="sm" onClick={() => { onClear(); onClose(); }}>Bỏ lọc</CButton>
        <CButton size="sm" className="btn-orange text-white" onClick={() => { onApply(tempValues); onClose(); }}>Áp dụng</CButton>
      </div>
    </div>
  )
}

// =====================================================================
// 3. COMPONENT POPUP: CÀI ĐẶT CỘT
// =====================================================================
const ColumnSettingsPopup = ({ visible, onClose, columns, onSave, onReset }) => {
  const [tempColumns, setTempColumns] = useState(columns);
  useEffect(() => { if (visible) setTempColumns(columns) }, [visible, columns]);

  if (!visible) return null;

  const handleToggle = (key) => {
    setTempColumns(prev => prev.map(col => col.key === key ? { ...col, visible: !col.visible } : col))
  }

  return (
    <div className="popup-container">
      <div className="popup-header">
        <h5 className="popup-title">Ẩn/Hiện cột</h5>
        <CButton color="link" onClick={onClose} className="p-0 text-secondary"><CIcon icon={cilX} /></CButton>
      </div>
      <div className="popup-body">
        {tempColumns.map(col => (
          col.key !== 'checkbox' && col.key !== 'actions' && (
            <div key={col.key} className="filter-item">
              <CFormCheck id={`vis-check-${col.key}`} label={col.label} checked={col.visible} onChange={() => handleToggle(col.key)} />
            </div>
          )
        ))}
      </div>
      <div className="popup-footer">
        <CButton color="light" size="sm" onClick={() => { onReset(); onClose(); }}>Mặc định</CButton>
        <CButton size="sm" className="btn-orange text-white" onClick={() => { onSave(tempColumns); onClose(); }}>Lưu</CButton>
      </div>
    </div>
  )
}

// =====================================================================
// 4. COMPONENT HEADER & FILTER BAR
// =====================================================================
const PageHeader = ({ onAddNew }) => (
  <div className="page-header">
    <h2 className="page-title">Bảng chấm công tổng hợp</h2>
    <div className="header-actions">
      <CButton className="btn-orange" onClick={onAddNew}>
        <CIcon icon={cilPlus} className="me-2" /> Thêm
      </CButton>
    </div>
  </div>
)

const FilterBar = ({ 
  filters, onFilterChange, onReload, columns, 
  columnFilterValues, onApplyColumnFilters, onUpdateColumns, onResetColumns 
}) => {
  const [showFilterPopup, setShowFilterPopup] = useState(false)
  const [showSettingsPopup, setShowSettingsPopup] = useState(false)

  return (
    <div className="filter-bar">
      <div className="filter-left">
        <CInputGroup>
          <CInputGroupText className="bg-white text-secondary border-end-0"><CIcon icon={cilSearch} /></CInputGroupText>
          <CFormInput className="border-start-0" placeholder="Tìm kiếm nhanh..." value={filters.search} onChange={(e) => onFilterChange({ ...filters, search: e.target.value })} />
        </CInputGroup>
      </div>

      <div className="filter-right">
        <CDropdown>
          <CDropdownToggle color="white" variant="outline" className="text-secondary border-secondary">
             {filters.unit === 'all' ? 'Tất cả đơn vị' : filters.unit}
          </CDropdownToggle>
          <CDropdownMenu>
             <CDropdownItem onClick={() => onFilterChange({ ...filters, unit: 'all' })}>Tất cả đơn vị</CDropdownItem>
             <CDropdownItem onClick={() => onFilterChange({ ...filters, unit: 'Thuận Nguyễn Phúc' })}>Thuận Nguyễn Phúc</CDropdownItem>
             <CDropdownItem onClick={() => onFilterChange({ ...filters, unit: 'Nhà máy' })}>Nhà máy</CDropdownItem>
          </CDropdownMenu>
        </CDropdown>

        <CTooltip content="Tải lại"><CButton color="dark" variant="outline" onClick={onReload}><CIcon icon={cilReload} /></CButton></CTooltip>

        <div className="popup-wrapper">
          <CTooltip content="Bộ lọc nâng cao">
            <CButton color="dark" variant="outline" className={` ${showFilterPopup ? 'active' : ''}`} onClick={() => { setShowFilterPopup(!showFilterPopup); setShowSettingsPopup(false); }}>
              <CIcon icon={cilFilter} />
            </CButton>
          </CTooltip>
          <AdvancedFilterPopup visible={showFilterPopup} onClose={() => setShowFilterPopup(false)} columns={columns} filterValues={columnFilterValues} onApply={onApplyColumnFilters} onClear={() => onApplyColumnFilters({})} />
        </div>

        <div className="popup-wrapper">
          <CTooltip content="Cài đặt cột">
            <CButton color="dark" variant="outline" className={` ${showSettingsPopup ? 'active' : ''}`} onClick={() => { setShowSettingsPopup(!showSettingsPopup); setShowFilterPopup(false); }}>
              <CIcon icon={cilSettings} />
            </CButton>
          </CTooltip>
          <ColumnSettingsPopup visible={showSettingsPopup} onClose={() => setShowSettingsPopup(false)} columns={columns} onSave={onUpdateColumns} onReset={onResetColumns} />
        </div>
      </div>
    </div>
  )
}

// =====================================================================
// 5. COMPONENT TABLE (MAIN PAGE)
// =====================================================================
const PageTable = ({ data, columns, onEdit, onDelete }) => {
  const visibleCols = columns.filter(col => col.visible);
  return (
    <div className="table-wrapper-fullscreen">
      <CTable hover className="mb-0" align="middle" style={{ minWidth: '1000px' }}>
        <CTableHead>
          <CTableRow>
            {visibleCols.map(col => {
               let className = "table-header-cell";
               if (col.fixed === 'left') className += " sticky-col-first";
               if (col.fixed === 'right') className += " sticky-col-last";
               return (
                 <CTableHeaderCell key={col.key} className={className} style={{ width: col.width, minWidth: col.minWidth }}>
                    {col.key === 'checkbox' ? <CFormCheck /> : col.label}
                 </CTableHeaderCell>
               )
            })}
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {data.length === 0 ? (
            <CTableRow><CTableDataCell colSpan={visibleCols.length} className="text-center p-5 text-muted">Không có dữ liệu phù hợp</CTableDataCell></CTableRow>
          ) : (
            data.map(item => (
              <CTableRow key={item.id}>
                 {visibleCols.map(col => {
                    if (col.key === 'checkbox') return <CTableDataCell key={col.key} className="sticky-col-first text-center"><CFormCheck /></CTableDataCell>
                    if (col.key === 'actions') return (
                        <CTableDataCell key={col.key} className="sticky-col-last">
                           <div className="row-actions">
                              <CTooltip content="Sửa"><button className="btn-action edit" onClick={() => onEdit(item)}><CIcon icon={cilPencil} /></button></CTooltip>
                              <CTooltip content="Xóa"><button className="btn-action delete" onClick={() => onDelete(item)}><CIcon icon={cilTrash} /></button></CTooltip>
                           </div>
                        </CTableDataCell>
                    )
                    if (col.key === 'status') return <CTableDataCell key={col.key}><span className="status-badge">{item[col.key]}</span></CTableDataCell>
                    return <CTableDataCell key={col.key}>{item[col.key]}</CTableDataCell>
                 })}
              </CTableRow>
            ))
          )}
        </CTableBody>
      </CTable>
    </div>
  )
}

// =====================================================================
// 6. DỮ LIỆU GIẢ (MOCK DATA)
// =====================================================================
const MOCK_DATA = [
  { id: 1, name: 'Bảng chấm công tổng hợp 01/12/2025 - 31/12/2025', timeRange: '01/12/2025 - 31/12/2025', type: 'Theo ca (Công chuẩn cố định)', unit: 'Thuận Nguyễn Phúc', position: 'Trưởng phòng Tài chính/Kế toán', status: 'Chưa gửi xác nhận' },
  { id: 2, name: 'Bảng chấm công tổng hợp Nhà máy T12', timeRange: '01/12/2025 - 31/12/2025', type: 'Theo giờ (Công chuẩn theo tháng)', unit: 'Nhà máy', position: 'Tổ sản xuất A', status: 'Đã xác nhận' },
  { id: 3, name: 'Bảng chấm công tổng hợp HRS T12', timeRange: '01/12/2025 - 31/12/2025', type: 'Theo ca', unit: 'HRS', position: 'Nhân viên IT', status: 'Đang chờ duyệt' },
]

// Dữ liệu Vị trí (Giả lập Database)
const MOCK_POSITIONS_DB = [
    { id: 'pos1', name: 'Trưởng phòng Tài chính/Kế toán', unitId: 'ThuanNguyenPhuc' },
    { id: 'pos2', name: 'Nhân viên Kế toán', unitId: 'ThuanNguyenPhuc' },
    { id: 'pos3', name: 'Tổ trưởng sản xuất', unitId: 'NhaMay' },
    { id: 'pos4', name: 'Công nhân vận hành', unitId: 'NhaMay' },
    { id: 'pos5', name: 'IT Helpdesk', unitId: 'HRS' },
]

// Dữ liệu Bảng chi tiết (trong Modal)
const MOCK_DATA_DETAILS = [
  { id: 101, name: 'Bảng chấm công từ ngày 01/12/2025 đến 31/12/2025', timeRange: '01/12/2025 - 31/12/2025', unit: 'Thuận Nguyễn Phúc', position: 'Trưởng phòng Tài chính/Kế toán' },
  { id: 102, name: 'Bảng chấm công Nhà máy T12', timeRange: '01/12/2025 - 31/12/2025', unit: 'Nhà máy', position: 'Tổ trưởng sản xuất' },
  { id: 103, name: 'Bảng chấm công HCNS', timeRange: '01/12/2025 - 31/12/2025', unit: 'Thuận Nguyễn Phúc', position: 'Nhân viên Kế toán' },
]

// =====================================================================
// 7. COMPONENT MAIN
// =====================================================================
const SummaryTimesheetPage = () => {
  // State Main Page
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [isFiltering, setIsFiltering] = useState(false)
  const [filters, setFilters] = useState({ search: '', unit: 'all' })
  const [columns, setColumns] = useState(DEFAULT_COLUMNS)
  const [columnFilterValues, setColumnFilterValues] = useState({})

  // State Modal
  const [addModalVisible, setAddModalVisible] = useState(false)
  
  // Form State
  const [newSummaryForm, setNewSummaryForm] = useState({ 
      unit: 'ThuanNguyenPhuc', 
      position: '', 
      name: 'Bảng chấm công tổng hợp - Thuận Nguyễn Phúc', 
      calculationType: 'standard_minus_leave' 
  })

  // State vị trí (lấy từ DB)
  const [positionList, setPositionList] = useState([]) 
  const [loadingPositions, setLoadingPositions] = useState(false)

  // State bảng chi tiết trong modal
  const [detailSearch, setDetailSearch] = useState('')
  const [selectedDetails, setSelectedDetails] = useState({ 101: true })

  // --- LOGIC FETCH DATA MAIN PAGE ---
  const fetchData = useCallback(async (globalFilters, colFilters) => {
    setIsFiltering(true)
    await new Promise(resolve => setTimeout(resolve, 300));
    
    let filteredData = [...MOCK_DATA]
    if (globalFilters.search) filteredData = filteredData.filter(i => i.name.toLowerCase().includes(globalFilters.search.toLowerCase()));
    if (globalFilters.unit !== 'all') filteredData = filteredData.filter(i => i.unit === globalFilters.unit);
    Object.keys(colFilters).forEach(key => {
       const val = colFilters[key]?.toLowerCase();
       if (val) filteredData = filteredData.filter(item => String(item[key]).toLowerCase().includes(val))
    })
    setData(filteredData)
    setLoading(false)
    setIsFiltering(false)
  }, [])

  useEffect(() => { fetchData(filters, columnFilterValues) }, [filters, columnFilterValues, fetchData])

  // --- LOGIC FETCH VỊ TRÍ TỪ DB KHI CHỌN ĐƠN VỊ ---
  useEffect(() => {
    const fetchPositionsFromDB = async () => {
        setLoadingPositions(true);
        await new Promise(resolve => setTimeout(resolve, 300)); // Giả lập API delay
        
        const filtered = MOCK_POSITIONS_DB.filter(p => p.unitId === newSummaryForm.unit);
        setPositionList(filtered);
        
        // Reset vị trí khi đổi đơn vị
        setNewSummaryForm(prev => ({ ...prev, position: '' }));
        setLoadingPositions(false);
    }
    if (newSummaryForm.unit) fetchPositionsFromDB();
  }, [newSummaryForm.unit]);

  // --- HANDLERS ---
  const handleUpdateColumns = (newCols) => setColumns(newCols)
  const handleResetColumns = () => setColumns(DEFAULT_COLUMNS)
  const handleApplyColumnFilters = (newValues) => setColumnFilterValues(newValues)
  const handleReload = () => {
    setFilters({ search: '', unit: 'all' })
    setColumns(DEFAULT_COLUMNS)
    setColumnFilterValues({})
    fetchData({ search: '', unit: 'all' }, {})
  }
  const handleEdit = (item) => alert(`Sửa: ${item.name}`)
  const handleDelete = (item) => { if(window.confirm('Xóa?')) alert(`Đã xóa: ${item.name}`) }

  // Modal Handlers
  const handleNewFormChange = (e) => {
      const { name, value } = e.target;
      setNewSummaryForm(prev => {
          if (name === 'unit') {
             const unitName = value === 'ThuanNguyenPhuc' ? 'Thuận Nguyễn Phúc' : value === 'NhaMay' ? 'Nhà Máy' : 'HRS';
             return { ...prev, [name]: value, name: `Bảng chấm công tổng hợp - ${unitName}` };
          }
          return { ...prev, [name]: value };
      });
  }

  const filteredDetailList = useMemo(() => {
      if (!detailSearch) return MOCK_DATA_DETAILS;
      return MOCK_DATA_DETAILS.filter(i => i.name.toLowerCase().includes(detailSearch.toLowerCase()));
  }, [detailSearch]);

  const handleSave = () => {
      console.log('Form:', newSummaryForm);
      console.log('Selected Details:', selectedDetails);
      setAddModalVisible(false);
  }

  if (loading && !isFiltering) return <div className="d-flex justify-content-center align-items-center vh-100"><CSpinner color="primary" /></div>

  return (
    <>
      <SummaryTimesheetStyles />
      <div className="page-container">
        <PageHeader onAddNew={() => setAddModalVisible(true)} />
        <CCard className="card-full-height">
          <CCardBody className="d-flex flex-column p-0">
            <div className="p-3 border-bottom">
              <FilterBar 
                filters={filters} onFilterChange={setFilters} onReload={handleReload}
                columns={columns} columnFilterValues={columnFilterValues}
                onApplyColumnFilters={handleApplyColumnFilters}
                onUpdateColumns={handleUpdateColumns} onResetColumns={handleResetColumns}
              />
            </div>
            {isFiltering ? <div className="d-flex justify-content-center p-5"><CSpinner color="primary" /></div> : (
              <PageTable data={data} columns={columns} onEdit={handleEdit} onDelete={handleDelete} />
            )}
          </CCardBody>
        </CCard>
      </div>

      {/* ================= MODAL THÊM MỚI ================= */}
      <CModal 
        visible={addModalVisible} onClose={() => setAddModalVisible(false)} 
        size="lg" className="add-timesheet-modal" backdrop="static"
      >
        <CModalHeader onClose={() => setAddModalVisible(false)}>
            <CModalTitle className="fw-bold">Thêm bảng chấm công tổng hợp</CModalTitle>
        </CModalHeader>
        
        <CModalBody className="p-4">
          <CForm>
             {/* 1. Đơn vị áp dụng */}
             <CRow className="mb-3 align-items-center">
                <CFormLabel className="col-sm-3 required-label fw-semibold">Đơn vị áp dụng</CFormLabel>
                <CCol sm={9}>
                    <CFormSelect name="unit" value={newSummaryForm.unit} onChange={handleNewFormChange}>
                        <option value="ThuanNguyenPhuc">Thuận Nguyễn Phúc</option>
                        <option value="NhaMay">Nhà máy</option>
                        <option value="HRS">HRS</option>
                    </CFormSelect>
                </CCol>
             </CRow>

             {/* 2. Vị trí áp dụng (Lấy từ DB) */}
             <CRow className="mb-3 align-items-center">
                <CFormLabel className="col-sm-3 fw-semibold">Vị trí áp dụng</CFormLabel>
                <CCol sm={9}>
                    {loadingPositions ? (
                        <div className="text-muted small pt-2">Đang tải danh sách vị trí...</div>
                    ) : (
                        <CFormSelect 
                            name="position" value={newSummaryForm.position} onChange={handleNewFormChange}
                            disabled={!newSummaryForm.unit}
                        >
                            <option value="">Tất cả các vị trí trong đơn vị</option>
                            {positionList.map(pos => (
                                <option key={pos.id} value={pos.id}>{pos.name}</option>
                            ))}
                        </CFormSelect>
                    )}
                </CCol>
             </CRow>

             {/* 3. Tên bảng chấm công */}
             <CRow className="mb-3 align-items-center">
                <CFormLabel className="col-sm-3 required-label fw-semibold">Tên bảng chấm công</CFormLabel>
                <CCol sm={9}>
                    <CFormInput name="name" value={newSummaryForm.name} onChange={handleNewFormChange} />
                </CCol>
             </CRow>

             {/* 4. Cách tính (Radio Buttons) */}
             <CRow className="mb-3">
                <CFormLabel className="col-sm-3 fw-semibold pt-0">Cách tính tổng công hưởng lương</CFormLabel>
                <CCol sm={9}>
                    <div className="d-flex align-items-center gap-4">
                        <CFormCheck 
                            type="radio" name="calculationType" id="calcType1" label="Số công chuẩn - Nghỉ không lương" 
                            checked={newSummaryForm.calculationType === 'standard_minus_leave'} 
                            onChange={handleNewFormChange} style={{ cursor: 'pointer' }}
                        />
                        <div className="d-flex align-items-center">
                            <CFormCheck 
                                type="radio" name="calculationType" id="calcType2" label="Cộng tổng công thực tế" 
                                checked={newSummaryForm.calculationType === 'total_actual'} 
                                onChange={handleNewFormChange} style={{ cursor: 'pointer' }}
                            />
                            <CTooltip content="Tổng công thực tế bao gồm cả làm thêm giờ...">
                                <CIcon icon={cilInfo} className="info-icon" />
                            </CTooltip>
                        </div>
                    </div>
                </CCol>
             </CRow>

             {/* 5. Danh sách & Search */}
             <div className="mt-4">
                <div className="d-flex justify-content-between align-items-center mb-2">
                    <CFormLabel className="fw-semibold mb-0">Danh sách bảng chấm công chi tiết</CFormLabel>
                    <div style={{ width: '300px' }}>
                        <CInputGroup size="sm">
                             <CInputGroupText className="bg-white border-end-0"><CIcon icon={cilSearch} /></CInputGroupText>
                             <CFormInput className="border-start-0" placeholder="Tìm kiếm" value={detailSearch} onChange={(e) => setDetailSearch(e.target.value)} />
                        </CInputGroup>
                    </div>
                </div>

                <div className="modal-table-wrapper">
                    <div className="modal-table-scroll">
                        <CTable hover className="mb-0 text-sm">
                            <CTableHead>
                                <CTableRow>
                                    <CTableHeaderCell style={{width:'40px'}} className="text-center"><CFormCheck /></CTableHeaderCell>
                                    <CTableHeaderCell>Tên bảng chấm công</CTableHeaderCell>
                                    <CTableHeaderCell>Thời gian</CTableHeaderCell>
                                    <CTableHeaderCell>Đơn vị</CTableHeaderCell>
                                    <CTableHeaderCell>Vị trí công việc</CTableHeaderCell>
                                </CTableRow>
                            </CTableHead>
                            <CTableBody>
                                {filteredDetailList.length > 0 ? filteredDetailList.map(item => (
                                    <CTableRow key={item.id}>
                                        <CTableDataCell className="text-center">
                                            <CFormCheck checked={!!selectedDetails[item.id]} onChange={(e) => setSelectedDetails(p => ({...p, [item.id]: e.target.checked}))} />
                                        </CTableDataCell>
                                        <CTableDataCell>{item.name}</CTableDataCell>
                                        <CTableDataCell>{item.timeRange}</CTableDataCell>
                                        <CTableDataCell>{item.unit}</CTableDataCell>
                                        <CTableDataCell>{item.position}</CTableDataCell>
                                    </CTableRow>
                                )) : (
                                    <CTableRow><CTableDataCell colSpan="5" className="text-center text-muted py-3">Không tìm thấy dữ liệu</CTableDataCell></CTableRow>
                                )}
                            </CTableBody>
                        </CTable>
                    </div>
                </div>
             </div>
          </CForm>
        </CModalBody>
        <CModalFooter className="bg-light border-top-0">
          <CButton color="light" className="bg-white border text-secondary" onClick={() => setAddModalVisible(false)}>Hủy</CButton>
          <CButton className="btn-orange text-white px-4" onClick={handleSave}>Lưu</CButton>
        </CModalFooter>
      </CModal>
    </>
  )
}

export default SummaryTimesheetPage