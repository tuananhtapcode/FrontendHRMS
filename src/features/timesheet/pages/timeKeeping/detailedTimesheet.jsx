
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
} from '@coreui/react';
import { useCallback, useEffect, useRef, useState } from 'react';

// Imports Icons
import {
  cilLockLocked,
  cilPencil,
  cilReload,
  cilSearch,
  cilSettings,
  cilTrash,
  cilX
} from '@coreui/icons';
import CIcon from '@coreui/icons-react';
// ==========================
// FORMAT + AUTO TẠO TÊN BẢNG
// ==========================
const formatDateVN = (date) => {
  if (!date) return ''
  const d = new Date(date)
  const day = String(d.getDate()).padStart(2, '0')
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const year = d.getFullYear()
  return `${day}/${month}/${year}`
}

const formatInputDate = (date) => {
  const d = new Date(date)
  const day = String(d.getDate()).padStart(2, '0')
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const year = d.getFullYear()
  return `${year}-${month}-${day}`
}

const buildTimesheetName = (start, end) => {
  if (!start || !end) return ''
  return `Bảng chấm công từ ngày ${formatDateVN(start)} đến ngày ${formatDateVN(end)}`
}

// =====================================================================
// 0. CẤU HÌNH CỘT
// =====================================================================
const DEFAULT_COLUMNS = [
  { key: 'checkbox', label: '', visible: true, width: '40px', fixed: 'left' },
  { key: 'timeRange', label: 'Thời gian', visible: true, minWidth: '200px' },
  { key: 'name', label: 'Tên bảng chấm công', visible: true, minWidth: '250px' },
  { key: 'type', label: 'Chấm công', visible: true, minWidth: '120px' },
  { key: 'unit', label: 'Đơn vị áp dụng', visible: true, minWidth: '150px' },
  { key: 'position', label: 'Vị trí áp dụng', visible: true, minWidth: '150px' },
  { key: 'status', label: 'Trạng thái', visible: true, minWidth: '120px' },
  { key: 'actions', label: '', visible: true, width: '90px', fixed: 'right' }
];

// =====================================================================
// 1. CSS TÙY CHỈNH (ĐÃ LÀM ĐẸP NÚT & HIỆU ỨNG HOVER)
// =====================================================================
const DetailedTimesheetStyles = () => (
  <style>
    {`
    .page-container {
      padding: 1rem;
      background-color: #f3f4f7;
      height: 100vh;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }

    /* === Header === */
    .page-header { flex-shrink: 0; display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
    .page-title { font-size: 1.75rem; font-weight: 500; }
    .header-actions { display: flex; gap: 12px; }

    /* === Filter Bar === */
    .filter-bar { flex-shrink: 0; display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; }
    .filter-left { flex-grow: 1; max-width: 350px; }
    .filter-right { display: flex; gap: 8px; align-items: center; position: relative; }
    

    /* === Table Wrapper === */
    .card-full-height {
        flex-grow: 1; display: flex; flex-direction: column; overflow: hidden;
        border: none; box-shadow: 0 1px 2px rgba(0,0,0,0.05);
    }
    .table-wrapper-fullscreen {
        flex-grow: 1; background-color: #fff; overflow: auto; position: relative;
    }

    /* === Sticky Columns === */
    .sticky-col-first {
      position: sticky; left: 0; z-index: 10; background-color: #fff;
      box-shadow: 2px 0 5px rgba(0,0,0,0.05);
    }
    .sticky-col-last {
      position: sticky; right: 0; z-index: 10; background-color: #fff;
      box-shadow: -2px 0 5px rgba(0,0,0,0.05);
    }
    .table-header-cell { position: sticky; top: 0; z-index: 20; background-color: #f8f9fa; white-space: nowrap; }
    .table-header-cell.sticky-col-first, .table-header-cell.sticky-col-last { z-index: 30; }

    /* === Row Hover Effect === */
    tbody tr { transition: background-color 0.2s; }
    tbody tr:hover .sticky-col-first,
    tbody tr:hover .sticky-col-last,
    tbody tr:hover td { 
        background-color: #f8f9fa; /* Màu nền khi hover vào dòng */
    }

    /* === (MỚI) ACTION BUTTONS CSS === */
    .row-actions {
        display: flex; gap: 8px; justify-content: center;
        /* Mặc định ẩn */
        opacity: 0;
        visibility: hidden;
        transform: translateY(5px);
        transition: all 0.2s ease-in-out;
    }

    /* Khi hover vào dòng TR thì hiện row-actions lên */
    tbody tr:hover .row-actions {
        opacity: 1;
        visibility: visible;
        transform: translateY(0);
    }

    /* Style cho nút thao tác đẹp hơn (Tròn, Clean) */
    .btn-action {
        width: 32px; height: 32px;
        border-radius: 50%;
        border: none;
        background: transparent;
        display: flex; align-items: center; justify-content: center;
        transition: all 0.2s;
        cursor: pointer;
        color: #768192;
    }
    .btn-action:hover {
        background-color: #e2e8f0;
        transform: scale(1.1);
    }
    .btn-action.edit:hover { color: #f59e0b; background-color: #fef3c7; } /* Hover Sửa ra màu cam nhạt */
    .btn-action.delete:hover { color: #ef4444; background-color: #fee2e2; } /* Hover Xóa ra màu đỏ nhạt */

    /* === Status Cell === */
    .status-cell { display: flex; align-items: center; gap: 6px; font-weight: 500; color: #8a93a2; }
    
    /* === Popup Settings === */
    .popup-container { position: absolute; top: 100%; right: 0; width: 320px; background: white; border: 1px solid #d8dbe0; box-shadow: 0 4px 12px rgba(0,0,0,0.15); border-radius: 4px; z-index: 1000; margin-top: 5px; display: flex; flex-direction: column; max-height: 500px; }
    .popup-header { display: flex; justify-content: space-between; align-items: center; padding: 12px 16px; border-bottom: 1px solid #ebedef; }
    .popup-title { font-weight: 700; font-size: 1rem; color: #3c4b64; margin: 0; }
    .popup-body { padding: 12px 16px; overflow-y: auto; flex-grow: 1; }
    .popup-footer { padding: 12px 16px; border-top: 1px solid #ebedef; display: flex; justify-content: space-between; background-color: #f9fafb; }
    .col-setting-item { display: flex; align-items: center; margin-bottom: 10px; justify-content: space-between; }

    /* === Misc === */
    .col-form-label.required::after { content: ' *'; color: #e55353; }
    .btn-orange { background-color: #ea580c; border-color: #ea580c; color: white; font-weight: 600; }
    .btn-orange:hover { background-color: #c2410c; color: white; border-color: #c2410c; }
    .add-timesheet-modal .modal-dialog { margin-top: 15vh; }
    `}
  </style>
)

// =====================================================================
// 2. COMPONENT POPUP CÀI ĐẶT CỘT
// =====================================================================
const ColumnSettingsPopup = ({ visible, onClose, columns, onUpdateColumns, onResetDefault }) => {
  const [tempColumns, setTempColumns] = useState(columns);
  useEffect(() => { if (visible) setTempColumns(columns); }, [visible, columns]);

  if (!visible) return null;

  const toggleCol = (key) => setTempColumns(prev => prev.map(c => c.key === key ? { ...c, visible: !c.visible } : c));
  const handleSave = () => { onUpdateColumns(tempColumns); onClose(); };

  return (
    <div className="popup-container settings-popup">
      <div className="popup-header">
        <h5 className="popup-title">Tùy chỉnh cột</h5>
        <CButton color="link" onClick={onClose} className="p-0 text-secondary"><CIcon icon={cilX} /></CButton>
      </div>
      <div className="popup-body">
        {tempColumns.map(col => (
          col.key !== 'checkbox' && col.key !== 'actions' && (
            <div key={col.key} className="col-setting-item">
              <CFormCheck label={col.label} checked={col.visible} onChange={() => toggleCol(col.key)} />
            </div>
          )
        ))}
      </div>
      <div className="popup-footer">
        <CButton color="light" size="sm" onClick={() => { onResetDefault(); onClose(); }}>Mặc định</CButton>
        <CButton size="sm" className="btn-orange text-white" onClick={handleSave}>Lưu</CButton>
      </div>
    </div>
  )
}

// =====================================================================
// 3. COMPONENT HEADER
// =====================================================================
const PageHeader = ({ onAddNew }) => (
  <div className="page-header">
    <h2 className="page-title">Bảng chấm công chi tiết</h2>
    <div className="header-actions">
      <CButton className="btn-orange" onClick={onAddNew}>+ Thêm</CButton>
    </div>
  </div>
)

// =====================================================================
// 4. COMPONENT FILTER BAR
// =====================================================================
const FilterBar = ({ filters, onFilterChange, onReload, columns, onUpdateColumns, onResetDefaultColumns }) => {
  const [showSettingsPopup, setShowSettingsPopup] = useState(false);

  return (
    <div className="filter-bar">
      <div className="filter-left">
        <CInputGroup className="search-bar">
          <CInputGroupText className="bg-white border-end-0"><CIcon icon={cilSearch} /></CInputGroupText>
          <CFormInput
            className="border-start-0"
            placeholder="Tìm kiếm..."
            value={filters.search}
            onChange={(e) => onFilterChange((prev) => ({ ...prev, search: e.target.value }))}
          />
        </CInputGroup>
      </div>
      <div className="filter-right">
        <CDropdown>
          <CDropdownToggle color="secondary" variant="outline" className="bg-white text-dark border-secondary">
            {filters.unit === 'all' ? 'Tất cả đơn vị' : filters.unit}
          </CDropdownToggle>
          <CDropdownMenu>
            <CDropdownItem onClick={() => onFilterChange(p => ({ ...p, unit: 'all' }))}>Tất cả đơn vị</CDropdownItem>
            <CDropdownItem onClick={() => onFilterChange(p => ({ ...p, unit: 'HRS' }))}>HRS</CDropdownItem>
            <CDropdownItem onClick={() => onFilterChange(p => ({ ...p, unit: 'Nhà máy' }))}>Nhà máy</CDropdownItem>
          </CDropdownMenu>
        </CDropdown>

        <CTooltip content="Tải lại">
          <CButton color="dark" variant="outline" onClick={onReload}>
            <CIcon icon={cilReload} />
          </CButton>
        </CTooltip>

        <div style={{ position: 'relative', display: 'inline-block' }}>
          <CTooltip content="Cài đặt cột">
            <CButton
              variant="outline" color="dark"

              onClick={() => setShowSettingsPopup(!showSettingsPopup)}
              active={showSettingsPopup}
            >
              <CIcon icon={cilSettings} />
            </CButton>
          </CTooltip>
          <ColumnSettingsPopup
            visible={showSettingsPopup}
            onClose={() => setShowSettingsPopup(false)}
            columns={columns}
            onUpdateColumns={onUpdateColumns}
            onResetDefault={onResetDefaultColumns}
          />
        </div>
      </div>
    </div>
  )
}

// =====================================================================
// 5. COMPONENT TABLE (ĐÃ CẬP NHẬT NÚT ACTIONS)
// =====================================================================
const PageTable = ({ data, columns, onEdit, onDelete }) => {
  const safeData = Array.isArray(data) ? data : [];
  const visibleCols = columns.filter(col => col.visible);

  return (
    <div className="table-wrapper-fullscreen">
      <CTable hover className="mb-0" align="middle" style={{ minWidth: 'max-content' }}>
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
          {safeData.map((item) => (
            <CTableRow key={item.id}>
              {visibleCols.map(col => {
                if (col.key === 'checkbox') {
                  return (
                    <CTableDataCell key={col.key} className="sticky-col-first">
                      <CFormCheck />
                    </CTableDataCell>
                  )
                }

                if (col.key === 'actions') {
                  return (
                    <CTableDataCell key={col.key} className="sticky-col-last">
                      <div className="row-actions">
                        <CTooltip content="Chỉnh sửa">
                          <button className="btn-action edit" onClick={() => onEdit(item)}>
                            <CIcon icon={cilPencil} />
                          </button>
                        </CTooltip>
                        <CTooltip content="Xóa">
                          <button className="btn-action delete" onClick={() => onDelete(item)}>
                            <CIcon icon={cilTrash} />
                          </button>
                        </CTooltip>
                      </div>
                    </CTableDataCell>
                  )
                }

                if (col.key === 'status') {
                  return (
                    <CTableDataCell key={col.key}>
                      <div className="status-cell">
                        <CIcon icon={cilLockLocked} size="sm" />
                        <span>{item.status}</span>
                      </div>
                    </CTableDataCell>
                  )
                }

                return (
                  <CTableDataCell key={col.key}>
                    {item[col.key]}
                  </CTableDataCell>
                )
              })}
            </CTableRow>
          ))}
        </CTableBody>
      </CTable>
    </div>
  )
}

// =====================================================================
// 6. DỮ LIỆU GIẢ
// =====================================================================
const MOCK_DATA = [
  { id: 1, timeRange: '01/11/2025 - 30/11/2025', name: 'Bảng chấm công từ ngày 01/11/2025...', type: 'Theo ca', unit: 'HRS', position: 'Tất cả vị trí', status: 'Chưa khóa' },
  { id: 2, timeRange: '01/10/2025 - 31/10/2025', name: 'Bảng chấm công Khối Vận hành T10', type: 'Theo giờ', unit: 'Vận hành', position: 'Nhân viên kho', status: 'Đã khóa' },
  { id: 3, timeRange: '01/11/2025 - 30/11/2025', name: 'Bảng chấm công Nhà máy T11', type: 'Theo ca', unit: 'Nhà máy', position: 'Tổ sản xuất A', status: 'Chưa khóa' },
  { id: 4, timeRange: '01/12/2025 - 31/12/2025', name: 'Dự kiến chấm công T12', type: 'Theo ca', unit: 'HRS', position: 'Tất cả vị trí', status: 'Chưa khóa' },
  { id: 5, timeRange: '01/12/2025 - 31/12/2025', name: 'Dự kiến chấm công T12 NM', type: 'Theo giờ', unit: 'Nhà máy', position: 'Bảo vệ', status: 'Chưa khóa' },
]

// =====================================================================
// 7. COMPONENT MAIN
// =====================================================================
const DetailedTimesheetPage = () => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [isFiltering, setIsFiltering] = useState(false)
  const [columns, setColumns] = useState(DEFAULT_COLUMNS);
  const [filters, setFilters] = useState({ search: '', unit: 'all' })
  const isInitialMount = useRef(true)

  const [addModalVisible, setAddModalVisible] = useState(false)
  const [newTimesheetForm, setNewTimesheetForm] = useState({
    unit: 'SinhvienDungThu',
    position: 'all',
    includeSub: false,
    name: '',
    timePeriod: 'this_month',
    startDate: '',
    endDate: '',
    type: 'Theo ca',
    standardWork: 'fixed'
  })


  const fetchData = useCallback(async (currentFilters) => {
    setIsFiltering(true)
    await new Promise(resolve => setTimeout(resolve, 300));
    let filteredData = [...MOCK_DATA]
    if (currentFilters.unit && currentFilters.unit !== 'all') {
      filteredData = filteredData.filter(item => item.unit === currentFilters.unit)
    }
    if (currentFilters.search) {
      const searchTerm = currentFilters.search.toLowerCase()
      filteredData = filteredData.filter(item => item.name.toLowerCase().includes(searchTerm) || item.position.toLowerCase().includes(searchTerm))
    }
    setData(filteredData)
    setLoading(false)
    setIsFiltering(false)
  }, [])

  useEffect(() => { fetchData(filters) }, [fetchData])

  useEffect(() => {
    if (isInitialMount.current) { isInitialMount.current = false } else { fetchData(filters) }
  }, [filters, fetchData])

  useEffect(() => {
    let start, end
    const today = new Date()

    if (newTimesheetForm.timePeriod === 'this_month') {
      start = new Date(today.getFullYear(), today.getMonth(), 1)
      end = new Date(today.getFullYear(), today.getMonth() + 1, 0)
    }

    if (newTimesheetForm.timePeriod === 'last_month') {
      start = new Date(today.getFullYear(), today.getMonth() - 1, 1)
      end = new Date(today.getFullYear(), today.getMonth(), 0)
    }

    if (newTimesheetForm.timePeriod !== 'custom' && start && end) {
      const s = formatInputDate(start)
      const e = formatInputDate(end)

      setNewTimesheetForm(prev => ({
        ...prev,
        startDate: s,
        endDate: e,
        name: buildTimesheetName(s, e)
      }))
    }
  }, [newTimesheetForm.timePeriod])
  useEffect(() => {
    if (newTimesheetForm.type === 'Theo gio') {
      setNewTimesheetForm(prev => ({
        ...prev,
        standardWork: 'fixed'
      }))
    }
  }, [newTimesheetForm.type])

  useEffect(() => {
    if (!newTimesheetForm.startDate || !newTimesheetForm.endDate) return

    setNewTimesheetForm(prev => ({
      ...prev,
      name: buildTimesheetName(
        prev.startDate,
        prev.endDate
      )
    }))

  }, [
    newTimesheetForm.startDate,
    newTimesheetForm.endDate
  ])


  const handleNewFormChange = (e) => {
    const { name, value, type, checked } = e.target
    setNewTimesheetForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
  }

  const handleAddNew = () => setAddModalVisible(true)
  const handleSaveNewTimesheet = () => { console.log('Lưu:', newTimesheetForm); setAddModalVisible(false) }
  // const handleSaveNewTimesheet = () => {
  //   const newItem = {
  //     id: Date.now(),
  //     timeRange: `${formatDateVN(newTimesheetForm.startDate)} - ${formatDateVN(newTimesheetForm.endDate)}`,
  //     name: newTimesheetForm.name,
  //     type: newTimesheetForm.type,
  //     unit: newTimesheetForm.unit,
  //     position: newTimesheetForm.position,
  //     status: 'Chưa khóa'
  //   }

  //   setData(prev => [newItem, ...prev])

  //   setAddModalVisible(false)
  // }
  const handleEditItem = (item) => alert('Sửa: ' + item.name)
  const handleDeleteItem = (item) => { if (window.confirm(`Xóa "${item.name}"?`)) alert('Đã xóa') }
  const handleReload = () => {
    const defaultFilters = { search: '', unit: 'all' }
    setFilters(defaultFilters)
    setColumns(DEFAULT_COLUMNS)
    fetchData(defaultFilters)
  }


  if (loading && !isFiltering) return <div className="d-flex justify-content-center align-items-center vh-100"><CSpinner color="primary" /></div>

  return (
    <>
      <DetailedTimesheetStyles />
      <div className="page-container">
        <PageHeader onAddNew={handleAddNew} />

        <CCard className="card-full-height">
          <CCardBody className="d-flex flex-column p-0">
            <div className="p-3 border-bottom">
              <FilterBar
                filters={filters}
                onFilterChange={setFilters}
                onReload={handleReload}
                columns={columns}
                onUpdateColumns={setColumns}
                onResetDefaultColumns={() => setColumns(DEFAULT_COLUMNS)}
              />
            </div>
            {isFiltering ? (
              <div className="d-flex justify-content-center p-5"><CSpinner color="primary" /></div>
            ) : (
              <PageTable
                data={data}
                columns={columns}
                onEdit={handleEditItem}
                onDelete={handleDeleteItem}
              />
            )}
          </CCardBody>
        </CCard>
      </div>

      {/* Modal giữ nguyên như cũ */}
      <CModal visible={addModalVisible} onClose={() => setAddModalVisible(false)} className="add-timesheet-modal" size="lg">
        <CModalHeader onClose={() => setAddModalVisible(false)}><CModalTitle>Thêm bảng chấm công chi tiết</CModalTitle></CModalHeader>
        <CModalBody>
          <CForm>
            <CRow className="mb-3">
              <CFormLabel className="col-sm-4 col-form-label required">Đơn vị áp dụng</CFormLabel>
              <CCol sm={8}>
                <CFormSelect name="unit" value={newTimesheetForm.unit} onChange={handleNewFormChange}>
                  <option value="SinhvienDungThu">SinhvienDungThu</option><option value="HRS">HRS</option><option value="NhaMay">Nhà máy</option>
                </CFormSelect>
              </CCol>
            </CRow>
            <CRow className="mb-3">
              <CFormLabel className="col-sm-4 col-form-label">Vị trí áp dụng</CFormLabel>
              <CCol sm={8}>
                <CFormSelect name="position" value={newTimesheetForm.position} onChange={handleNewFormChange}>
                  <option value="all">Tất cả vị trí trong đơn vị</option><option value="manager">Quản lý</option><option value="staff">Nhân viên</option>
                </CFormSelect>
              </CCol>
            </CRow>
            <CRow className="mb-3"><CCol sm={8} className="offset-sm-4"><CFormCheck label="Tính cả nhân viên kiêm nhiệm" name="includeSub" checked={newTimesheetForm.includeSub} onChange={handleNewFormChange} /></CCol></CRow>
            <CRow className="mb-3">
              <CFormLabel className="col-sm-4 col-form-label required">
                Tên bảng chấm công
              </CFormLabel>

              <CCol sm={8}>
                <CFormInput
                  name="name"
                  value={newTimesheetForm.name}
                  onChange={handleNewFormChange}
                />
              </CCol>
            </CRow>
            <CRow className="mb-3">
              <CFormLabel className="col-sm-4 col-form-label required">
                Thời gian
              </CFormLabel>
              <CCol sm={8}>
                <CFormSelect
                  name="timePeriod"
                  value={newTimesheetForm.timePeriod}
                  onChange={handleNewFormChange}
                >
                  <option value="this_month">Tháng này</option>
                  <option value="last_month">Tháng trước</option>
                  <option value="custom">Tùy chỉnh</option>
                </CFormSelect>
              </CCol>
            </CRow>

            <CRow className="mb-3">
              <CFormLabel className="col-sm-4 col-form-label"></CFormLabel>

              <CCol sm={4}>
                <CFormInput
                  type="date"
                  name="startDate"
                  value={newTimesheetForm.startDate}
                  onChange={handleNewFormChange}
                  readOnly={newTimesheetForm.timePeriod !== 'custom'}
                />
              </CCol>

              <CCol sm={4}>
                <CFormInput
                  type="date"
                  name="endDate"
                  value={newTimesheetForm.endDate}
                  onChange={handleNewFormChange}
                  readOnly={newTimesheetForm.timePeriod !== 'custom'}
                />
              </CCol>
            </CRow>

            <CRow className="mb-3">
              <CFormLabel className="col-sm-4 col-form-label required">Hình thức chấm công</CFormLabel>
              <CCol sm={8}>
                <CFormSelect
                  name="type"
                  value={newTimesheetForm.type}
                  onChange={handleNewFormChange}
                >
                  <option value="Theo ca">Theo ca</option>
                  <option value="Theo ngay">Theo ngày</option>
                  <option value="Theo gio">Theo giờ</option>
                </CFormSelect>
              </CCol>
            </CRow>
            {(newTimesheetForm.type === 'Theo ca' || newTimesheetForm.type === 'Theo ngay') && (
              <CRow className="mb-3">
                <CFormLabel className="col-sm-4 col-form-label"></CFormLabel>
                <CCol sm={8} className="d-flex gap-4">
                  <CFormCheck type="radio" name="standardWork" label="Công chuẩn cố định" value="fixed" checked={newTimesheetForm.standardWork === 'fixed'} onChange={handleNewFormChange} />
                  <CFormCheck type="radio" name="standardWork" label="Công chuẩn theo tháng" value="monthly" checked={newTimesheetForm.standardWork === 'monthly'} onChange={handleNewFormChange} />
                </CCol>
              </CRow>
            )}
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" variant="outline" onClick={() => setAddModalVisible(false)}>Hủy</CButton>
          <CButton className="btn-orange" onClick={handleSaveNewTimesheet}>Lưu</CButton>
        </CModalFooter>
      </CModal>
    </>
  )
}

export default DetailedTimesheetPage