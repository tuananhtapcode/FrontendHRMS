import {
  CButton,
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
import { useEffect, useState } from 'react';

// Imports Icons
import {
  cilCalendar,
  cilClock,
  cilCog,
  cilPencil,
  cilReload,
  cilSearch,
  cilSettings,
  cilTrash,
  cilX
} from '@coreui/icons';
import CIcon from '@coreui/icons-react';

// =====================================================================
// 0. CẤU HÌNH CỘT
// =====================================================================
const DEFAULT_COLUMNS = [
  { key: 'checkbox', label: '', visible: true, width: '40px', fixed: true },
  { key: 'name', label: 'Tên bảng đăng ký ca', visible: true },
  { key: 'unit', label: 'Đơn vị áp dụng', visible: true },
  { key: 'timeRange', label: 'Thời gian', visible: true },
  { key: 'manager', label: 'Người quản lý', visible: true },
  { key: 'deadline', label: 'Hạn đăng ký', visible: true },
  { key: 'employeeCount', label: 'Số lượng nhân viên', visible: true, align: 'center' },
  { key: 'status', label: 'Trạng thái', visible: true },
  { key: 'actions', label: '', visible: true, width: '90px', fixed: true }
];

// =====================================================================
// HELPER: HÀM XÓA DẤU TIẾNG VIỆT ĐỂ TÌM KIẾM CHÍNH XÁC HƠN
// =====================================================================
const removeAccents = (str) => {
  if (!str) return "";
  return str.normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d").replace(/Đ/g, "D")
    .toLowerCase();
}

// =====================================================================
// 1. CSS TÙY CHỈNH
// =====================================================================
const PageStyles = () => (
  <style>
    {`
    /* Layout Full Height */
    .page-container { 
        padding: 1rem; 
        background-color: #f3f4f7; 
        height: 100vh; 
        display: flex;
        flex-direction: column;
        overflow: hidden; 
    }
    .page-header, .filter-bar { flex-shrink: 0; }
    
    .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
    .page-title { font-size: 1.75rem; font-weight: 500; color: #3c4b64; }
    .header-actions { display: flex; gap: 12px; }
    
    .filter-bar { display: flex; justify-content: space-between; align-items: center; background-color: #fff; padding: 0.5rem 1rem; border-radius: 0.375rem; box-shadow: 0 1px 2px rgba(0,0,0,0.05); margin-bottom: 1rem; flex-wrap: wrap; gap: 10px; }
    .filter-left { flex-grow: 1; }
    .search-bar { width: 300px; max-width: 100%; }
    .filter-right { display: flex; gap: 8px; align-items: center; }

    .btn-orange { background-color: #ea580c; border-color: #ea580c; color: white; font-weight: 600; }
    .btn-orange:hover { background-color: #c2410c; color: white; border-color: #c2410c; }
    .btn-icon-only { padding: 0.25rem 0.5rem; display: flex; align-items: center; justify-content: center; }

    /* Popups Settings */
    .popup-container { position: absolute; top: 100%; right: 0; width: 320px; background: white; border: 1px solid #d8dbe0; box-shadow: 0 4px 12px rgba(0,0,0,0.15); border-radius: 4px; z-index: 1000; margin-top: 5px; display: flex; flex-direction: column; max-height: 500px; }
    .popup-header { display: flex; justify-content: space-between; align-items: center; padding: 12px 16px; border-bottom: 1px solid #ebedef; }
    .popup-title { font-weight: 700; font-size: 1rem; color: #3c4b64; margin: 0; }
    .popup-body { padding: 12px 16px; overflow-y: auto; flex-grow: 1; }
    .popup-footer { padding: 12px 16px; border-top: 1px solid #ebedef; display: flex; justify-content: space-between; background-color: #f9fafb; }
    .col-setting-item { display: flex; align-items: center; margin-bottom: 10px; justify-content: space-between; }

    /* Table Full Height Wrapper */
    .table-wrapper-fullscreen {
        flex-grow: 1;
        background-color: #fff;
        border-radius: 4px;
        box-shadow: 0 1px 2px rgba(0,0,0,0.05);
        overflow: auto; 
        position: relative;
    }

    .table-header-cell { 
        background-color: #f0f2f5; 
        font-weight: 700; 
        font-size: 0.8rem; 
        color: #3c4b64; 
        white-space: nowrap; 
        vertical-align: middle; 
        position: sticky; top: 0; z-index: 10;
        box-shadow: 0 1px 0 #d8dbe0;
    }

    tbody tr:hover { background-color: #ececec; }

    /* Custom Cell Styles */
    .manager-cell { display: flex; align-items: center; }
    .manager-avatar { width: 28px; height: 28px; border-radius: 50%; background-color: #e0e0e0; color: #757575; display: flex; align-items: center; justify-content: center; font-weight: 600; font-size: 0.8rem; margin-right: 8px; }
    .text-danger { color: var(--cui-danger, #e55353); }
    .text-link { color: var(--cui-primary, #321fdb); cursor: pointer; font-weight: 500; }
    .text-link:hover { text-decoration: underline; }
    
    /* Action Column Sticky Right */
    .sticky-col-first { position: sticky; left: 0; z-index: 11; background-color: #fff; }
    .sticky-col-last { position: sticky; right: 0; z-index: 11; background-color: #fff; box-shadow: -2px 0 5px rgba(0,0,0,0.05); }
    .action-cell-container { position: relative; height: 100%; min-width: 90px; }
    .row-actions {
      display: flex;
      gap: 8px;
      opacity: 0;
      visibility: hidden;
      transform: translateY(4px);
      transition: all 0.15s ease-in-out;
    }

    tbody tr:hover .row-actions {
      visibility: visible;
      opacity: 1;
      transform: translateY(0);
    }
    .btn-action {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    border: none;
    background: transparent;
    color: #6b7280;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: 0.15s;
    }
    .btn-action:hover { background: #f1f5f9; transform: scale(1.05); }
    .btn-action.edit:hover { color: #f59e0b; background-color: #fef3c7; }
    .btn-action.delete:hover { color: #ef4444; background-color: #fee2e2; }
    
    input[type="date"]::-webkit-calendar-picker-indicator {
      opacity: 0;
      cursor: pointer;
      position: absolute;
      right: 10px;
    }

    /* Firefox */
    input[type="date"] {
      -moz-appearance: textfield;
    }
    /* Modal Fix */
    .custom-modal-fix .modal-dialog { margin-top: 20vh; }
    .modal-form-label { font-weight: 500; }
    `}
  </style>
)

// =====================================================================
// 2. COMPONENT POPUP SETTINGS
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
// 3. HEADER & FILTER BAR (ĐÃ TỐI ƯU TÌM KIẾM)
// =====================================================================
const PageHeader = ({ onAddNew, onSetupRules }) => (
  <div className="page-header">
    <h2 className="page-title">Đăng ký ca</h2>
    <div className="header-actions">
      <CButton color="secondary" variant="outline" onClick={onSetupRules}>
        <CIcon icon={cilCog} className="me-2" /> Thiết lập quy định đăng ký ca
      </CButton>
      <CButton className="btn-orange" onClick={onAddNew}>+ Thêm</CButton>
    </div>
  </div>
)

const FilterBar = ({ filters, onFilterChange, onReload, columns, onUpdateColumns, onResetDefaultColumns }) => {
  const [showSettingsPopup, setShowSettingsPopup] = useState(false);
  const [localSearch, setLocalSearch] = useState(filters.search);

  // Đồng bộ khi filters bên ngoài bị reset (VD: nút Reload)
  useEffect(() => {
    if (filters.search === '') setLocalSearch('');
  }, [filters.search]);

  // Debounce: Đợi 500ms sau khi ngừng gõ mới tìm kiếm
  useEffect(() => {
    const timer = setTimeout(() => {
      if (localSearch !== filters.search) {
        onFilterChange(prev => ({ ...prev, search: localSearch }));
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [localSearch, filters.search, onFilterChange]);

  return (
    <div className="filter-bar">
      <div className="filter-left">
        <CInputGroup className="search-bar">
          <CInputGroupText className="bg-white border-end-0 text-secondary"><CIcon icon={cilSearch} size="sm" /></CInputGroupText>
          <CFormInput
            className="border-start-0 ps-0"
            placeholder="Tìm kiếm..."
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            size="sm"
          />
        </CInputGroup>
      </div>
      <div className="filter-right" style={{ position: 'relative' }}>
        <CDropdown>
          <CDropdownToggle variant="outline" color="secondary" size="sm" className="bg-white text-dark border-secondary">
            {filters.unit === 'all' ? 'Tất cả đơn vị' : filters.unit}
          </CDropdownToggle>
          <CDropdownMenu>
            <CDropdownItem onClick={() => onFilterChange(p => ({ ...p, unit: 'all' }))}>Tất cả đơn vị</CDropdownItem>
            <CDropdownItem onClick={() => onFilterChange(p => ({ ...p, unit: 'HRS' }))}>HRS</CDropdownItem>
            <CDropdownItem onClick={() => onFilterChange(p => ({ ...p, unit: 'NhaMay' }))}>Nhà máy</CDropdownItem>
          </CDropdownMenu>
        </CDropdown>

        <CTooltip content="Tải lại">
          <CButton variant="outline" color="dark" size="sm" className="btn-icon-only" onClick={onReload}><CIcon icon={cilReload} /></CButton>
        </CTooltip>

        <div style={{ position: 'relative', display: 'inline-block' }}>
          <CTooltip content="Cài đặt cột">
            <CButton variant="outline" color="dark" size="sm" className="btn-icon-only" onClick={() => setShowSettingsPopup(!showSettingsPopup)} active={showSettingsPopup}>
              <CIcon icon={cilSettings} />
            </CButton>
          </CTooltip>
          <ColumnSettingsPopup visible={showSettingsPopup} onClose={() => setShowSettingsPopup(false)} columns={columns} onUpdateColumns={onUpdateColumns} onResetDefault={onResetDefaultColumns} />
        </div>
      </div>
    </div>
  )
}

// =====================================================================
// 4. TABLE COMPONENT
// =====================================================================
const PageTable = ({ data, columns, onEdit, onDelete, onStatusClick }) => {
  const visibleColumns = columns.filter(col => col.visible);

  return (
    <div className="table-wrapper-fullscreen">
      <CTable hover className="mb-0" align="middle" style={{ minWidth: "max-content" }}>

        {/* ================= HEADER ================= */}
        <CTableHead>
          <CTableRow>
            {visibleColumns.map((col) => {
              let className = "table-header-cell";

              if (col.fixed || col.key === "checkbox") className += " sticky-col-first";
              if (col.key === "actions") className += " sticky-col-last";
              if (col.align) className += ` text-${col.align}`;

              return (
                <CTableHeaderCell
                  key={col.key}
                  className={className}
                  style={{ width: col.width }}
                >
                  {col.key === "checkbox"
                    ? <div className="text-center"><CFormCheck /></div>
                    : col.label}
                </CTableHeaderCell>
              );
            })}
          </CTableRow>
        </CTableHead>

        {/* ================= BODY ================= */}
        <CTableBody>
          {data.length === 0 ? (
            <CTableRow>
              <CTableDataCell
                colSpan={visibleColumns.length}
                className="text-center py-4 text-muted"
              >
                Không tìm thấy dữ liệu
              </CTableDataCell>
            </CTableRow>
          ) : (
            data.map((item) => (
              <CTableRow key={item.id}>
                {visibleColumns.map((col) => {
                  // ---------- Sticky class ----------
                  let className = "";
                  if (col.fixed || col.key === "checkbox") className += " sticky-col-first";
                  if (col.key === "actions") className += " sticky-col-last";
                  if (col.align) className += ` text-${col.align}`;

                  let content = item[col.key];

                  // ---------- Checkbox ----------
                  if (col.key === "checkbox") {
                    content = (
                      <div className="text-center">
                        <CFormCheck />
                      </div>
                    );
                  }

                  // ---------- Manager ----------
                  if (col.key === "manager") {
                    content = (
                      <div className="manager-cell">
                        <div className="manager-avatar">{item.managerAvatar}</div>
                        {item.managerName}
                      </div>
                    );
                  }

                  // ---------- Deadline ----------
                  if (col.key === "deadline") {
                    content = (
                      <span className={item.deadlineExpired ? "text-danger" : ""}>
                        {item.deadline}
                        {item.deadlineExpired ? " (Đã hết hạn)" : ""}
                      </span>
                    );
                  }

                  // ---------- Status (clickable) ----------
                  if (col.key === "status") {
                    content = (
                      <span className="text-link" onClick={() => onStatusClick(item)}>
                        {item.status}
                      </span>
                    );
                  }

                  // ---------- ACTIONS ----------
                  if (col.key === "actions") {
                    content = (
                      <div className="row-actions">
                        <CTooltip content="Chỉnh sửa">
                          <button
                            className="btn-action edit"
                            onClick={() => onEdit(item)}
                          >
                            <CIcon icon={cilPencil} />
                          </button>
                        </CTooltip>

                        <CTooltip content="Xóa">
                          <button
                            className="btn-action delete"
                            onClick={() => onDelete(item)}
                          >
                            <CIcon icon={cilTrash} />
                          </button>
                        </CTooltip>
                      </div>
                    );
                  }

                  return (
                    <CTableDataCell
                      key={`${item.id}-${col.key}`}
                      className={className}
                      style={{ fontSize: "0.9rem", color: "#333" }}
                    >
                      {content}
                    </CTableDataCell>
                  );
                })}
              </CTableRow>
            ))
          )}
        </CTableBody>

      </CTable>
    </div>
  );
};

// =====================================================================
// 5. MOCK DATA (Dữ liệu mẫu)
// =====================================================================
const MOCK_DATA = [
  {
    id: 1,
    name: 'Yêu cầu đăng ký ca từ 01/11/2025 đến 30/11/2025 - H...',
    unit: 'HRS',
    timeRange: '01/11/2025 - 30/11/2025',
    managerName: 'nguyễn việt',
    managerAvatar: 'NV',
    deadline: '13/11/2025 23:59',
    deadlineExpired: true,
    employeeCount: 0,
    status: 'Đang đăng ký',
  },
  {
    id: 2,
    name: 'Đăng ký làm thêm giờ Nhà Máy',
    unit: 'NhaMay',
    timeRange: '05/11/2025 - 06/11/2025',
    managerName: 'Trần Văn A',
    managerAvatar: 'TA',
    deadline: '05/11/2025 12:00',
    deadlineExpired: false,
    employeeCount: 5,
    status: 'Đang mở',
  },
]

// =====================================================================
// 6. ADD MODAL
// =====================================================================
const formatDate = (date) => {
  // Định dạng YYYY-MM-DD theo giờ địa phương để tránh lỗi lệch múi giờ
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const calculateDateRange = (type) => {
  const today = new Date();
  let start = new Date(today);
  let end = new Date(today);

  switch (type) {
    case 'thisWeek': {
      // Tuần này: Tính từ Thứ 2 đến Chủ nhật
      const day = today.getDay(); // 0 (CN) -> 6 (T7)
      const diffToMonday = today.getDate() - day + (day === 0 ? -6 : 1); 
      start.setDate(diffToMonday);
      end = new Date(start);
      end.setDate(start.getDate() + 6);
      break;
    }
    case 'nextWeek': {
      // Tuần sau: Cộng thêm 7 ngày từ logic tuần này
      const day = today.getDay();
      const diffToMonday = today.getDate() - day + (day === 0 ? -6 : 1);
      start.setDate(diffToMonday + 7);
      end = new Date(start);
      end.setDate(start.getDate() + 6);
      break;
    }
    case 'thisMonth': {
      // Tháng này: Ngày 1 đến ngày cuối tháng
      start = new Date(today.getFullYear(), today.getMonth(), 1);
      end = new Date(today.getFullYear(), today.getMonth() + 1, 0);
      break;
    }
    case 'nextMonth': {
      // Tháng sau
      start = new Date(today.getFullYear(), today.getMonth() + 1, 1);
      end = new Date(today.getFullYear(), today.getMonth() + 2, 0);
      break;
    }
    default:
      return null;
  }
  return { start: formatDate(start), end: formatDate(end) };
};

// =====================================================================
// 6. ADD MODAL (ĐÃ SỬA)
// =====================================================================
const AddRegistrationModal = ({ visible, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: '', 
    unit: 'SinhVienDungThu', 
    timeRangeType: 'custom', // Mặc định là Tùy chọn
    startDate: '', 
    endDate: '',
    deadlineDate: '', 
    deadlineTime: '23:59',
  });

  // Reset form khi mở modal
  useEffect(() => {
    if (!visible) return;

    const todayStr = formatDate(new Date());

    setFormData(prev => ({
      ...prev,
      name: 'Yêu cầu đăng ký ca mới',
      unit: 'SinhVienDungThu',
      timeRangeType: 'custom', // Luôn mặc định là Tùy chọn khi mở
      startDate: todayStr,     // Mặc định hiện ngày hôm nay
      endDate: todayStr,       // Mặc định hiện ngày hôm nay
      deadlineDate: todayStr,  // Hạn đăng ký luôn là hôm nay
    }));
  }, [visible]);

  // Xử lý thay đổi input thường
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Nếu người dùng tự sửa ngày tháng bằng tay, chuyển select về 'custom'
    if (name === 'startDate' || name === 'endDate') {
        setFormData(prev => ({ ...prev, [name]: value, timeRangeType: 'custom' }));
    } else {
        setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  // Xử lý riêng cho Dropdown thời gian
  const handleTimeRangeSelect = (e) => {
    const type = e.target.value;
    
    // Cập nhật loại thời gian
    let newUpdate = { timeRangeType: type };

    // Nếu chọn custom thì không đổi ngày, giữ nguyên ngày hiện tại đang có
    if (type !== 'custom') {
      const dates = calculateDateRange(type);
      if (dates) {
        newUpdate.startDate = dates.start;
        newUpdate.endDate = dates.end;
      }
    }
    
    setFormData(prev => ({ ...prev, ...newUpdate }));
  };

  return (
    <CModal visible={visible} onClose={onClose} className="custom-modal-fix" size="lg">
      <CModalHeader onClose={onClose}><CModalTitle>Thêm yêu cầu đăng ký ca</CModalTitle></CModalHeader>
      <CModalBody>
        <CForm>
          <CRow className="mb-3">
            <CFormLabel htmlFor="name" className="col-sm-3 col-form-label modal-form-label">Tên bảng đăng ký ca <span className="text-danger">*</span></CFormLabel>
            <CCol sm={9}><CFormInput type="text" id="name" name="name" value={formData.name} onChange={handleInputChange} /></CCol>
          </CRow>
          <CRow className="mb-3">
            <CFormLabel htmlFor="unit" className="col-sm-3 col-form-label modal-form-label">Đơn vị áp dụng <span className="text-danger">*</span></CFormLabel>
            <CCol sm={9}>
              <CFormSelect id="unit" name="unit" value={formData.unit} onChange={handleInputChange}>
                <option value="SinhVienDungThu">SinhVienDungThu</option><option value="HRS">HRS</option><option value="NhaMay">Nhà máy</option>
              </CFormSelect>
            </CCol>
          </CRow>
          
          {/* PHẦN CHỌN THỜI GIAN ĐÃ SỬA */}
          <CRow className="mb-3">
            <CFormLabel htmlFor="timeRangeType" className="col-sm-3 col-form-label modal-form-label">Thời gian <span className="text-danger">*</span></CFormLabel>
            <CCol sm={9}>
              <CFormSelect 
                id="timeRangeType" 
                name="timeRangeType" 
                value={formData.timeRangeType} 
                onChange={handleTimeRangeSelect} // Sử dụng hàm xử lý riêng
              >
                <option value="thisWeek">Tuần này</option>
                <option value="nextWeek">Tuần sau</option>
                <option value="thisMonth">Tháng này</option>
                <option value="nextMonth">Tháng sau</option>
                <option value="custom">Tùy chọn</option>
              </CFormSelect>
            </CCol>
          </CRow>

          <CRow className="mb-3">
            <CCol sm={{ span: 9, offset: 3 }}>
              <CRow>
                <CCol>
                  <CInputGroup>
                    <CFormInput
                      type="date"
                      name="startDate"
                      value={formData.startDate}
                      onChange={handleInputChange}
                      onFocus={(e) => e.target.showPicker()}
                    />
                    <CInputGroupText
                      style={{ cursor: 'pointer' }}
                      onClick={(e) => e.currentTarget.previousSibling.showPicker()}
                    >
                      <CIcon icon={cilCalendar} />
                    </CInputGroupText>
                  </CInputGroup>
                </CCol>
                <CCol>
                  <CInputGroup>
                    <CFormInput
                      type="date"
                      name="endDate"
                      value={formData.endDate}
                      onChange={handleInputChange}
                      onFocus={(e) => e.target.showPicker()}
                    />
                    <CInputGroupText
                      style={{ cursor: 'pointer' }}
                      onClick={(e) => e.currentTarget.previousSibling.showPicker()}
                    >
                      <CIcon icon={cilCalendar} />
                    </CInputGroupText>
                  </CInputGroup>
                </CCol>
              </CRow>
            </CCol>
          </CRow>

          <CRow className="mb-3">
            <CFormLabel htmlFor="deadlineDate" className="col-sm-3 col-form-label modal-form-label">Hạn đăng ký <span className="text-danger">*</span></CFormLabel>
            <CCol sm={9}>
              <CRow>
                <CCol>
                  <CInputGroup>
                    <CFormInput
                      type="date"
                      name="deadlineDate"
                      value={formData.deadlineDate}
                      onChange={handleInputChange}
                      onFocus={(e) => e.target.showPicker()}
                    />
                    <CInputGroupText
                      style={{ cursor: 'pointer' }}
                      onClick={(e) => e.currentTarget.previousSibling.showPicker()}
                    >
                      <CIcon icon={cilCalendar} />
                    </CInputGroupText>
                  </CInputGroup>
                </CCol>
                <CCol><CInputGroup><CFormInput type="text" name="deadlineTime" value={formData.deadlineTime} onChange={handleInputChange} /><CInputGroupText><CIcon icon={cilClock} /></CInputGroupText></CInputGroup></CCol>
              </CRow>
            </CCol>
          </CRow>
        </CForm>
      </CModalBody>
      <CModalFooter>
        <CButton color="secondary" variant="outline" onClick={onClose}>Hủy</CButton>
        <CButton color="primary" className="btn-orange" onClick={() => onSave(formData)}>Lưu</CButton>
      </CModalFooter>
    </CModal>
  );
};

// =====================================================================
// 7. MAIN PAGE
// =====================================================================
const ShiftRegistrationPage = () => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({ search: '', unit: 'all' })
  const [columns, setColumns] = useState(DEFAULT_COLUMNS)
  const [isModalVisible, setIsModalVisible] = useState(false)

  // LOGIC LỌC DỮ LIỆU ĐƯỢC CHUẨN HÓA
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      let filteredData = [...MOCK_DATA];

      // 1. Lọc theo Unit
      if (filters.unit !== 'all') {
        filteredData = filteredData.filter(item => item.unit === filters.unit);
      }

      // 2. Lọc theo Search (Dùng hàm removeAccents để tìm kiếm không dấu)
      if (filters.search) {
        const searchTerm = removeAccents(filters.search);
        filteredData = filteredData.filter(item => {
          const name = removeAccents(item.name || '');
          const manager = removeAccents(item.managerName || '');
          return name.includes(searchTerm) || manager.includes(searchTerm);
        });
      }

      setData(filteredData);
      setLoading(false);
    }, 300); // Giả lập độ trễ mạng
  }, [filters]);

  const handleReload = () => {
    setLoading(true);
    setColumns(DEFAULT_COLUMNS);
    setFilters({ search: '', unit: 'all' }); // Reset bộ lọc về mặc định
  };

  return (
    <>
      <PageStyles />
      <div className="page-container">
        <PageHeader onAddNew={() => setIsModalVisible(true)} onSetupRules={() => alert('Setup Rules')} />

        <FilterBar
          filters={filters}
          onFilterChange={setFilters}
          onReload={handleReload}
          columns={columns}
          onUpdateColumns={setColumns}
          onResetDefaultColumns={() => setColumns(DEFAULT_COLUMNS)}
        />

        {loading ? (
          <div className="d-flex justify-content-center p-5"><CSpinner color="primary" /></div>
        ) : (
          <PageTable
            data={data}
            columns={columns}
            onEdit={(item) => alert('Edit ' + item.name)}
            onDelete={(item) => alert('Delete ' + item.name)}
            onStatusClick={(item) => alert('Status ' + item.status)}
          />
        )}
      </div>
      <AddRegistrationModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onSave={(formData) => {
          console.log('Form Data:', formData);
          setIsModalVisible(false);
          alert('Thêm thành công');
        }}
      />
    </>
  )
}

export default ShiftRegistrationPage