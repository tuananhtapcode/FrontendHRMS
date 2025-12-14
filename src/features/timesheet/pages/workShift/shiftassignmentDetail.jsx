import {
  cilCalendar,
  cilFilter,
  cilPencil,
  cilPlus,
  cilSearch,
  cilSettings,
  cilTrash,
  cilX,
  cilSave,
} from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import {
  CButton,
  CCol,
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
  CTooltip,
} from '@coreui/react'
import { useEffect, useMemo, useState } from 'react'
import { shiftscheduleApi } from '../../api/shiftscheduleApi'

// =====================================================================
// 0. CẤU HÌNH & CONSTANTS
// =====================================================================

const DEFAULT_COLUMNS = [
  { key: 'checkbox', label: '', visible: true, width: 40, type: 'checkbox' },
  { key: 'employee_info', label: 'Nhân viên', visible: true, width: 220 },
  { key: 'departmentName', label: 'Phòng ban', visible: true, width: 180 },
  { key: 'shiftName', label: 'Ca làm việc', visible: true, width: 150 },
  { key: 'assignmentDate', label: 'Ngày làm việc', visible: true, width: 120, align: 'center' },
  { key: 'time_range', label: 'Thời gian', visible: true, width: 140, align: 'center' },
  { key: 'note', label: 'Ghi chú', visible: true, width: 180 },
  { key: 'actions', label: 'Thao tác', visible: true, width: 100, fixed: 'right', align: 'center' },
]

const formatDateVN = (dateStr) => {
  if (!dateStr) return ''
  const [y, m, d] = dateStr.split('-')
  return `${d}/${m}/${y}`
}

const getCurrentMonthRange = () => {
  const date = new Date()
  const firstDay = new Date(date.getFullYear(), date.getMonth(), 1)
  const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0)
  const toStr = (d) => d.toISOString().split('T')[0]
  return { start: toStr(firstDay), end: toStr(lastDay) }
}

// =====================================================================
// 1. STYLE CSS
// =====================================================================
const PageStyles = () => (
  <style>
    {`
    .page-container { padding: 1rem; background-color: #f3f4f7; height: 100vh; display: flex; flex-direction: column; overflow: hidden; }
    .page-header, .filter-bar { flex-shrink: 0; }
    .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; }
    .page-title { font-size: 1.5rem; font-weight: 700; color: #3c4b64; }
    .header-actions { display: flex; gap: 8px; align-items: center; }
    
    .filter-bar { display: flex; justify-content: space-between; align-items: center; background-color: #fff; padding: 0.5rem 1rem; border-radius: 0.375rem; box-shadow: 0 1px 2px rgba(0,0,0,0.05); margin-bottom: 1rem; flex-wrap: wrap; gap: 10px; }
    .filter-left { flex-grow: 1; }
    .search-bar { width: 300px; max-width: 100%; }
    .filter-right { display: flex; gap: 8px; align-items: center; }

    .btn-orange { background-color: #ea580c; border-color: #ea580c; color: white; font-weight: 600; }
    .btn-orange:hover { background-color: #c2410c; color: white; border-color: #c2410c; }
    .btn-icon-only { padding: 0.25rem 0.5rem; display: flex; align-items: center; justify-content: center; }

    /* Popups */
    .popup-container { position: absolute; top: 100%; right: 0; width: 320px; background: white; border: 1px solid #d8dbe0; box-shadow: 0 4px 12px rgba(0,0,0,0.15); border-radius: 4px; z-index: 1000; margin-top: 5px; display: flex; flex-direction: column; max-height: 500px; }
    .popup-header { display: flex; justify-content: space-between; align-items: center; padding: 12px 16px; border-bottom: 1px solid #ebedef; }
    .popup-title { font-weight: 700; font-size: 1rem; color: #3c4b64; margin: 0; }
    .popup-body { padding: 12px 16px; overflow-y: auto; flex-grow: 1; }
    .popup-footer { padding: 12px 16px; border-top: 1px solid #ebedef; display: flex; justify-content: space-between; background-color: #f9fafb; }

    /* Table */
    .table-wrapper-fullscreen { flex-grow: 1; background-color: #fff; border-radius: 4px; box-shadow: 0 1px 2px rgba(0,0,0,0.05); overflow: auto; position: relative; }
    .table-header-cell { background-color: #f0f2f5; font-weight: 700; font-size: 0.8rem; color: #3c4b64; white-space: nowrap; vertical-align: middle; position: sticky; top: 0; z-index: 10; box-shadow: 0 1px 0 #d8dbe0; }
    tbody tr:hover { background-color: #ececec; }
    .sticky-col-first { position: sticky; left: 0; z-index: 9; background: #fff; }
    .sticky-col-last { position: sticky; right: 0; z-index: 9; background: #fff; }

    /* Actions Button */
    .row-actions { display: flex; justify-content: center; gap: 8px; opacity: 0; visibility: hidden; transform: translateY(4px); transition: all 0.15s ease-in-out; }
    tbody tr:hover .row-actions { opacity: 1; visibility: visible; transform: translateY(0); }
    .btn-action { width: 30px; height: 30px; border-radius: 50%; border: none; background: transparent; display: flex; align-items: center; justify-content: center; cursor: pointer; color: #6b7280; transition: all 0.15s ease; }
    .btn-action:hover { background: #f1f5f9; transform: scale(1.05); }
    .btn-action.edit:hover { color: #f59e0b; background-color: #fef3c7; }
    .btn-action.delete:hover { color: #ef4444; background-color: #fee2e2; }

    input[type="date"]::-webkit-calendar-picker-indicator { cursor: pointer; }
    `}
  </style>
)

// =====================================================================
// 2. COMPONENT MODAL FORM (THÊM / SỬA) - ĐÃ GIA CỐ AN TOÀN
// =====================================================================
const ShiftAssignmentFormModal = ({ visible, onClose, onSave, editingItem }) => {
  // 1. State
  const [departments, setDepartments] = useState([])
  const [shifts, setShifts] = useState([])
  const [isLoadingDropdown, setIsLoadingDropdown] = useState(false)
  const [formData, setFormData] = useState({
    departmentId: '',
    shiftName: '', // Dùng để hiện trên UI
    shiftId: '', // Dùng để gửi cho API (ẨN ĐI)
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
    note: '',
  })

  // 2. Effect khi mở Modal
  useEffect(() => {
    if (visible) {
      fetchDropdownData() // Gọi hàm tải dữ liệu phòng ban và ca làm việc
      if (editingItem) {
        setFormData({
          departmentId: editingItem.departmentId || '',
          shiftId: editingItem.shiftId || '',
          startDate: editingItem.assignmentDate || '',
          endDate: editingItem.assignmentDate || '',
          note: editingItem.note || '',
        })
      } else {
        // Reset form khi thêm mới
        setFormData({
          departmentId: '',
          shiftId: '',
          startDate: new Date().toISOString().split('T')[0],
          endDate: new Date().toISOString().split('T')[0],
          note: '',
        })
      }
    }
  }, [visible, editingItem])

  // 3. Hàm gọi API Dropdown (CÓ TRY/CATCH AN TOÀN)
  const fetchDropdownData = async () => {
    setIsLoadingDropdown(true)
    try {
      const deptRes = await shiftscheduleApi.getAllDepartments()

      // [FIX] Cố gắng lấy data từ nhiều nguồn khác nhau để tránh lỗi undefined
      const deptList = deptRes?.data?.departmentResponseList || deptRes?.data || []
      console.log('Danh sách phòng ban tải về:', deptList)

      if (Array.isArray(deptList) && deptList.length > 0) {
        setDepartments(deptList)
      } else {
        setDepartments([])
      }

      // --- PHẦN SHIFT GIỮ NGUYÊN ---
      const shiftRes = await shiftscheduleApi.getAllShifts()
      const shiftList = shiftRes?.data?.data || []

      if (Array.isArray(shiftList) && shiftList.length > 0) {
        setShifts(shiftList)
      } else {
        setShifts([])
      }
    } catch (error) {
      console.error('Lỗi tải dữ liệu:', error)
    } finally {
      setIsLoadingDropdown(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target

    if (name === 'departmentId') {
      console.log('Đã chọn ID phòng ban:', value)
    }

    // Nếu người dùng chọn Ca làm việc
    if (name === 'shiftId') {
      const selectedShift = shifts.find((s) => String(s.shiftId) === String(value))
      setFormData({
        ...formData,
        shiftId: value,
        shiftName: selectedShift ? selectedShift.name : '',
      })
    } else {
      setFormData({
        ...formData,
        [name]: value,
      })
    }
  }

  const handleConfirm = () => {
    // Validate cơ bản
    if (!formData.shiftId) {
      return alert('Vui lòng chọn Ca làm việc')
    }

    if (!editingItem) {
      if (!formData.departmentId) return alert('Vui lòng chọn Phòng ban')
      if (formData.startDate > formData.endDate)
        return alert('Ngày bắt đầu không thể sau ngày kết thúc')
    }

    onSave(formData)
  }

  return (
    <CModal visible={visible} onClose={onClose} size="lg" backdrop="static" alignment="center">
      <CModalHeader>
        <CModalTitle>
          {editingItem ? 'Cập nhật phân ca' : 'Phân ca hàng loạt cho Phòng ban'}
        </CModalTitle>
      </CModalHeader>
      <CModalBody>
        {isLoadingDropdown ? (
          <div className="text-center py-4">
            <CSpinner size="sm" /> Đang tải dữ liệu...
          </div>
        ) : (
          <CForm>
            {/* --- SỬA (EDIT) --- */}
            {editingItem && (
              <div className="alert alert-info mb-3">
                <strong>Nhân viên:</strong> {editingItem.employeeName} ({editingItem.employeeCode})
                <br />
                <strong>Ngày:</strong> {formatDateVN(editingItem.assignmentDate)}
              </div>
            )}

            {/* --- THÊM MỚI (ADD) --- */}
            {!editingItem && (
              <CRow className="mb-3">
                <CCol md={12}>
                  <CFormLabel>
                    Chọn Phòng ban <span className="text-danger">*</span>
                  </CFormLabel>
                  <CFormSelect
                    name="departmentId"
                    value={formData.departmentId}
                    onChange={handleChange}
                  >
                    <option value="">-- Chọn phòng ban --</option>
                    {departments && departments.length > 0 ? (
                      departments.map((d, i) => {
                        // [FIX QUAN TRỌNG]: Lấy cả departmentId hoặc id để tránh lỗi
                        const realId = d.departmentId || d.id

                        return (
                          <option key={i} value={realId}>
                            {d.name || d.departmentName}
                          </option>
                        )
                      })
                    ) : (
                      <option disabled>Không có phòng ban nào</option>
                    )}
                  </CFormSelect>
                </CCol>
              </CRow>
            )}

            <CRow className="mb-3">
              <CCol md={12}>
                <CFormLabel>
                  Chọn Ca làm việc <span className="text-danger">*</span>
                </CFormLabel>

                <CFormSelect name="shiftId" value={formData.shiftId} onChange={handleChange}>
                  <option value="">-- Chọn ca làm việc --</option>
                  {shifts.map((s, i) => (
                    <option key={i} value={s.shiftId}>
                      {s.name} ({s.startTime?.slice(0, 5)} - {s.endTime?.slice(0, 5)})
                    </option>
                  ))}
                </CFormSelect>
              </CCol>
            </CRow>

            {!editingItem && (
              <CRow className="mb-3">
                <CCol md={6}>
                  <CFormLabel>
                    Từ ngày <span className="text-danger">*</span>
                  </CFormLabel>
                  <CFormInput
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleChange}
                  />
                </CCol>
                <CCol md={6}>
                  <CFormLabel>
                    Đến ngày <span className="text-danger">*</span>
                  </CFormLabel>
                  <CFormInput
                    type="date"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleChange}
                  />
                </CCol>
              </CRow>
            )}

            <CRow className="mb-3">
              <CCol md={12}>
                <CFormLabel>Ghi chú</CFormLabel>
                <CFormInput
                  type="text"
                  name="note"
                  value={formData.note}
                  onChange={handleChange}
                  placeholder="Ghi chú..."
                />
              </CCol>
            </CRow>
          </CForm>
        )}
      </CModalBody>
      <CModalFooter>
        <CButton color="secondary" onClick={onClose}>
          Hủy bỏ
        </CButton>
        <CButton className="btn-orange text-white" onClick={handleConfirm}>
          <CIcon icon={cilSave} className="me-1" /> Lưu dữ liệu
        </CButton>
      </CModalFooter>
    </CModal>
  )
}

// =====================================================================
// 3. CÁC COMPONENT PHỤ (HEADER, FILTER, TABLE)
// =====================================================================
const PageHeader = ({ onAdd }) => (
  <div className="page-header">
    <div className="page-title">Phân ca chi tiết</div>
    <div className="header-actions">
      <CButton className="btn-orange" onClick={onAdd}>
        <CIcon icon={cilPlus} className="me-1" /> Thêm
      </CButton>
    </div>
  </div>
)

const AdvancedFilterPopup = ({ visible, onClose, onApply, columns }) => {
  const [checkedColumns, setCheckedColumns] = useState({})
  const [columnSearchValues, setColumnSearchValues] = useState({})
  if (!visible) return null
  const handleApply = () => {
    const activeFilters = {}
    Object.keys(checkedColumns).forEach((key) => {
      if (checkedColumns[key] && columnSearchValues[key])
        activeFilters[key] = columnSearchValues[key]
    })
    onApply(activeFilters)
    onClose()
  }
  return (
    <div className="popup-container filter-popup">
      <div className="popup-header">
        <h5 className="popup-title">Bộ lọc nâng cao</h5>
        <CButton color="link" onClick={onClose}>
          <CIcon icon={cilX} />
        </CButton>
      </div>
      <div className="popup-body">
        {columns
          .filter((c) => c.key !== 'checkbox' && c.key !== 'actions' && c.visible)
          .map((col) => (
            <div key={col.key} className="mb-2">
              <CFormCheck
                label={col.label}
                checked={!!checkedColumns[col.key]}
                onChange={() => setCheckedColumns((p) => ({ ...p, [col.key]: !p[col.key] }))}
              />
              {checkedColumns[col.key] && (
                <CFormInput
                  size="sm"
                  className="mt-1 ms-4"
                  placeholder={`Lọc ${col.label}...`}
                  value={columnSearchValues[col.key] || ''}
                  onChange={(e) =>
                    setColumnSearchValues((p) => ({ ...p, [col.key]: e.target.value }))
                  }
                />
              )}
            </div>
          ))}
      </div>
      <div className="popup-footer">
        <CButton
          color="light"
          size="sm"
          onClick={() => {
            setCheckedColumns({})
            setColumnSearchValues({})
            onApply({})
            onClose()
          }}
        >
          Bỏ lọc
        </CButton>
        <CButton size="sm" className="btn-orange text-white" onClick={handleApply}>
          Áp dụng
        </CButton>
      </div>
    </div>
  )
}

const ColumnSettingsPopup = ({ visible, onClose, columns, onUpdateColumns, onResetDefault }) => {
  const [tempColumns, setTempColumns] = useState(columns)
  useEffect(() => {
    if (visible) setTempColumns(columns)
  }, [visible, columns])
  if (!visible) return null
  const handleSave = () => {
    onUpdateColumns(tempColumns)
    onClose()
  }
  return (
    <div className="popup-container settings-popup">
      <div className="popup-header">
        <h5 className="popup-title">Tùy chỉnh cột</h5>
        <CButton color="link" onClick={onClose}>
          <CIcon icon={cilX} />
        </CButton>
      </div>
      <div className="popup-body">
        {tempColumns.map(
          (col) =>
            col.key !== 'checkbox' &&
            col.key !== 'actions' && (
              <div key={col.key} className="col-setting-item mb-2">
                <CFormCheck
                  label={col.label}
                  checked={col.visible}
                  onChange={() =>
                    setTempColumns((prev) =>
                      prev.map((c) => (c.key === col.key ? { ...c, visible: !c.visible } : c)),
                    )
                  }
                />
              </div>
            ),
        )}
      </div>
      <div className="popup-footer">
        <CButton
          color="light"
          size="sm"
          onClick={() => {
            onResetDefault()
            onClose()
          }}
        >
          Mặc định
        </CButton>
        <CButton size="sm" className="btn-orange text-white" onClick={handleSave}>
          Lưu
        </CButton>
      </div>
    </div>
  )
}

const FilterBar = ({
  filters,
  onFilterChange,
  onApplyAdvancedFilter,
  columns,
  onUpdateColumns,
  onResetDefaultColumns,
}) => {
  const [showFilterPopup, setShowFilterPopup] = useState(false)
  const [showSettingsPopup, setShowSettingsPopup] = useState(false)
  return (
    <div className="filter-bar">
      <div className="filter-left">
        <CInputGroup className="search-bar">
          <CInputGroupText className="bg-white border-end-0 text-secondary">
            <CIcon icon={cilSearch} size="sm" />
          </CInputGroupText>
          <CFormInput
            className="border-start-0 ps-0"
            placeholder="Tìm kiếm nhanh..."
            value={filters.search}
            onChange={(e) => onFilterChange((prev) => ({ ...prev, search: e.target.value }))}
            size="sm"
          />
        </CInputGroup>
      </div>
      <div className="filter-right" style={{ position: 'relative' }}>
        <div style={{ position: 'relative', display: 'inline-block' }}>
          <CTooltip content="Bộ lọc nâng cao">
            <CButton
              variant="outline"
              color="dark"
              size="sm"
              className="btn-icon-only"
              active={showFilterPopup}
              onClick={() => {
                setShowFilterPopup(!showFilterPopup)
                setShowSettingsPopup(false)
              }}
            >
              <CIcon icon={cilFilter} />
            </CButton>
          </CTooltip>
          <AdvancedFilterPopup
            visible={showFilterPopup}
            onClose={() => setShowFilterPopup(false)}
            onApply={onApplyAdvancedFilter}
            columns={columns}
          />
        </div>
        <div style={{ position: 'relative', display: 'inline-block' }}>
          <CTooltip content="Cài đặt cột">
            <CButton
              variant="outline"
              color="dark"
              size="sm"
              className="btn-icon-only"
              active={showSettingsPopup}
              onClick={() => {
                setShowSettingsPopup(!showSettingsPopup)
                setShowFilterPopup(false)
              }}
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

const PageTable = ({ data, columns, onEdit, onDeleteClick }) => {
  const visibleColumns = columns.filter((col) => col.visible)
  return (
    <div className="table-wrapper-fullscreen">
      <CTable hover className="mb-0" align="middle" style={{ minWidth: 'max-content' }}>
        <CTableHead>
          <CTableRow>
            {visibleColumns.map((col) => {
              let className = 'table-header-cell'
              if (col.align) className += ` text-${col.align}`
              if (col.fixed === 'left') className += ' sticky-col-first'
              if (col.fixed === 'right') className += ' sticky-col-last'
              return (
                <CTableHeaderCell key={col.key} className={className} style={{ width: col.width }}>
                  {col.type === 'checkbox' ? (
                    <div className="text-center">
                      <CFormCheck />
                    </div>
                  ) : (
                    col.label
                  )}
                </CTableHeaderCell>
              )
            })}
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {data.length > 0 ? (
            data.map((item) => (
              <CTableRow key={item.id}>
                {visibleColumns.map((col) => {
                  let className = ''
                  if (col.align) className += ` text-${col.align}`
                  if (col.fixed === 'left') className += ' sticky-col-first'
                  if (col.fixed === 'right') className += ' sticky-col-last'

                  // ACTIONS COLUMN
                  if (col.key === 'actions') {
                    return (
                      <CTableDataCell key={`${item.id}-${col.key}`} className={className}>
                        <div className="row-actions">
                          <CTooltip content="Sửa">
                            <button className="btn-action edit" onClick={() => onEdit(item)}>
                              <CIcon icon={cilPencil} />
                            </button>
                          </CTooltip>
                          <CTooltip content="Xóa">
                            <button
                              className="btn-action delete"
                              onClick={() => onDeleteClick(item)}
                            >
                              <CIcon icon={cilTrash} />
                            </button>
                          </CTooltip>
                        </div>
                      </CTableDataCell>
                    )
                  }

                  // DATA COLUMNS
                  let displayValue = item[col.key]
                  if (col.key === 'employee_info') {
                    displayValue = (
                      <div>
                        <div className="fw-bold">{item.employeeName}</div>
                        <div className="small text-muted">{item.employeeCode}</div>
                      </div>
                    )
                  } else if (col.key === 'assignmentDate') {
                    displayValue = formatDateVN(item.assignmentDate)
                  } else if (col.key === 'time_range') {
                    displayValue = (
                      <span className="badge bg-light text-dark border">{item.time_range}</span>
                    )
                  }

                  return (
                    <CTableDataCell
                      key={`${item.id}-${col.key}`}
                      className={className}
                      style={{ fontSize: '0.9rem', color: '#333' }}
                    >
                      {col.type === 'checkbox' ? (
                        <div className="text-center">
                          <CFormCheck />
                        </div>
                      ) : (
                        displayValue
                      )}
                    </CTableDataCell>
                  )
                })}
              </CTableRow>
            ))
          ) : (
            <CTableRow>
              <CTableDataCell
                colSpan={visibleColumns.length}
                className="text-center py-4 text-muted"
              >
                Không có dữ liệu trong tháng này
              </CTableDataCell>
            </CTableRow>
          )}
        </CTableBody>
      </CTable>
    </div>
  )
}

// =====================================================================
// 4. MAIN COMPONENT (LOGIC CHÍNH)
// =====================================================================
const ShiftAssignmentDetail = () => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [columns, setColumns] = useState(DEFAULT_COLUMNS)
  const [filters, setFilters] = useState({ search: '', columnFilters: {} })

  const [deleteModalVisible, setDeleteModalVisible] = useState(false)
  const [itemToDelete, setItemToDelete] = useState(null)

  // State quản lý Modal Form (Thêm/Sửa)
  const [formModalVisible, setFormModalVisible] = useState(false)
  const [editingItem, setEditingItem] = useState(null)

  // --- API: Load Data ---
  const loadData = async () => {
    setLoading(true)
    try {
      const { start, end } = getCurrentMonthRange()
      const res = await shiftscheduleApi.getAllAssignments(start, end)

      if (res.data && res.data.success) {
        const apiData = res.data.data
        const formattedData = apiData.map((item) => ({
          ...item,
          id: item.shiftAssignmentId,
          employee_info: `${item.employeeName} (${item.employeeCode})`,
          time_range: `${item.startTime?.slice(0, 5)} - ${item.endTime?.slice(0, 5)}`,
        }))
        setData(formattedData)
      } else {
        setData([])
      }
    } catch (error) {
      console.error('Lỗi tải dữ liệu:', error)
      setData([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  // --- HANDLER: MỞ FORM THÊM MỚI ---
  const handleOpenAdd = () => {
    setEditingItem(null) // Reset
    setFormModalVisible(true)
  }

  // --- HANDLER: MỞ FORM SỬA ---
  const handleOpenEdit = (item) => {
    setEditingItem(item) // Set item
    setFormModalVisible(true)
  }

  // --- HANDLER: LƯU DỮ LIỆU ---
  const handleSaveData = async (formData) => {
    try {
      // 1. Log dữ liệu ra để kiểm tra
      console.log('Dữ liệu gốc từ Form:', formData)

      if (editingItem) {
        // SỬA
        const updatePayload = {
          shiftAssignmentId: editingItem.shiftAssignmentId,
          employeeId: editingItem.employeeId,
          assignmentDate: editingItem.assignmentDate,
          shiftId: Number(formData.shiftId), // [FIX] Ép kiểu số
          note: formData.note,
          isApproved: true,
        }
        await shiftscheduleApi.assignShift(updatePayload)
        alert('Cập nhật thành công!')
      } else {
        // THÊM MỚI

        // Validate...
        if (!formData.departmentId) {
          alert('Lỗi: ID Phòng ban đang trống. Vui lòng chọn lại.')
          return
        }

        const bulkPayload = {
          // --- SỬA Ở ĐÂY ---
          // Đổi tên key thành snake_case để khớp với @JsonProperty("department_id") trong Java
          department_id: Number(formData.departmentId),
          shift_id: Number(formData.shiftId),

          startDate: formData.startDate,
          endDate: formData.endDate,
          note: formData.note || '',
        }

        console.log('Payload chuẩn gửi đi:', bulkPayload)

        await shiftscheduleApi.bulkAssignByDepartment(bulkPayload)
        alert('Phân ca hàng loạt thành công!')
      }

      setFormModalVisible(false)
      loadData()
    } catch (error) {
      console.error('Lỗi khi lưu:', error)
      alert('Lưu thất bại: ' + (error.response?.data?.message || error.message))
    }
  }

  // --- HANDLER: XÓA ---
  const confirmDelete = async () => {
    if (itemToDelete) {
      try {
        await shiftscheduleApi.deleteAssignment(itemToDelete.shiftAssignmentId)
        setData((prev) => prev.filter((i) => i.id !== itemToDelete.id))
        setDeleteModalVisible(false)
        setItemToDelete(null)
      } catch (error) {
        alert('Lỗi khi xóa: ' + error.message)
      }
    }
  }

  // --- FILTER CLIENT ---
  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const search = filters.search.toLowerCase()
      const matchSearch =
        !search ||
        item.employeeName?.toLowerCase().includes(search) ||
        item.employeeCode?.toLowerCase().includes(search) ||
        item.departmentName?.toLowerCase().includes(search)

      const columnFilters = filters.columnFilters || {}
      const matchColumns = Object.keys(columnFilters).every((key) => {
        const itemVal = String(item[key] || '').toLowerCase()
        return itemVal.includes(columnFilters[key].toLowerCase())
      })
      return matchSearch && matchColumns
    })
  }, [data, filters])

  if (loading)
    return (
      <div className="d-flex justify-content-center p-5">
        <CSpinner color="warning" />
      </div>
    )

  return (
    <>
      <PageStyles />
      <div className="page-container">
        <PageHeader onAdd={handleOpenAdd} />

        <FilterBar
          filters={filters}
          onFilterChange={setFilters}
          onApplyAdvancedFilter={(cf) => setFilters((p) => ({ ...p, columnFilters: cf }))}
          columns={columns}
          onUpdateColumns={setColumns}
          onResetDefaultColumns={() => setColumns(DEFAULT_COLUMNS)}
        />

        <PageTable
          data={filteredData}
          columns={columns}
          onEdit={handleOpenEdit}
          onDeleteClick={(item) => {
            setItemToDelete(item)
            setDeleteModalVisible(true)
          }}
        />
      </div>

      {/* MODAL FORM */}
      <ShiftAssignmentFormModal
        visible={formModalVisible}
        onClose={() => setFormModalVisible(false)}
        onSave={handleSaveData}
        editingItem={editingItem}
      />

      {/* MODAL XÓA */}
      <CModal
        visible={deleteModalVisible}
        onClose={() => setDeleteModalVisible(false)}
        alignment="center"
      >
        <CModalHeader>
          <CModalTitle>Xác nhận xóa</CModalTitle>
        </CModalHeader>
        <CModalBody>
          Bạn có muốn xóa lịch làm việc của <strong>{itemToDelete?.employeeName}</strong> ngày{' '}
          <strong>{formatDateVN(itemToDelete?.assignmentDate)}</strong> không?
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setDeleteModalVisible(false)}>
            Hủy
          </CButton>
          <CButton color="danger" className="text-white" onClick={confirmDelete}>
            Xóa
          </CButton>
        </CModalFooter>
      </CModal>
    </>
  )
}

export default ShiftAssignmentDetail
