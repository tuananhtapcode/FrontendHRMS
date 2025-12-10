
import {
  CAvatar,
  CBadge,
  CButton,
  CDropdown,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
  CFormCheck,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CSpinner,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow
} from '@coreui/react';
import { useEffect, useMemo, useRef, useState } from 'react';

// Imports Icons
import {
  cilArrowTop,
  cilCloudUpload,
  cilFile,
  cilFilter,
  cilOptions,
  cilReload,
  cilSearch,
  cilSettings,
  cilX
} from '@coreui/icons';
import CIcon from '@coreui/icons-react';

// =====================================================================
// 0. CẤU HÌNH CỘT MẶC ĐỊNH
// =====================================================================
const DEFAULT_COLUMNS = [
  // Sticky Columns (Thường nên giữ lại, không cho ẩn hoặc xử lý riêng)
  { key: 'checkbox', label: '', visible: true, sticky: true, width: 50, type: 'checkbox' },
  { key: 'employee_code', label: 'Mã nhân viên', visible: true, sticky: true, width: 120 },
  { key: 'full_name', label: 'Họ và tên', visible: true, sticky: true, width: 220 },

  // Data Columns (Có thể ẩn hiện)
  { key: 'gender', label: 'Giới tính', visible: true },
  { key: 'date_of_birth', label: 'Ngày sinh', visible: true },
  { key: 'phone_number', label: 'Số điện thoại', visible: true },
  { key: 'email', label: 'Email', visible: true },
  { key: 'department_name', label: 'Phòng ban', visible: true },
  { key: 'job_position_name', label: 'Vị trí công việc', visible: true },
  { key: 'hire_date', label: 'Ngày vào làm', visible: true },
  { key: 'bank_name', label: 'Ngân hàng', visible: false }, // Mặc định ẩn
  { key: 'bank_account', label: 'Tên chủ tài khoản', visible: false }, // Mặc định ẩn
  { key: 'bank_number', label: 'Số tài khoản', visible: false }, // Mặc định ẩn
  { key: 'address', label: 'Địa chỉ', visible: true },
  { key: 'status', label: 'Trạng thái', visible: true, align: 'center' },
];

// =====================================================================
// 1. CSS TÙY CHỈNH
// =====================================================================
const EmployeeListStyles = () => (
  <style>
    {`
    .page-container {
      height: 100vh;
      display: flex;
      flex-direction: column;
      padding: 1rem;
      background-color: #f3f4f7;
      overflow: hidden;
    }

    /* wrapper full height */
    .table-wrapper-fullscreen {
      height: 100%;
      display: flex;
      flex-direction: column;
      background-color: #fff;
      overflow: hidden;         
    }

    /* coreui responsive wrapper */
    .table-wrapper-fullscreen > .table-responsive {
      flex: 1;                   
      overflow-x: auto;
      overflow-y: auto;
    }

    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
    }
    .page-title {
      font-size: 1.5rem;
      font-weight: 700;
      color: #3c4b64;
    }
    .header-actions {
      display: flex;
      gap: 8px;
    }

    .filter-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background-color: #fff;
      padding: 0.75rem 1rem;
      border-radius: 0.375rem;
      box-shadow: 0 1px 2px rgba(0,0,0,0.05);
      margin-bottom: 1rem;
      flex-wrap: wrap;
      gap: 10px;
      position: relative;
    }
    .filter-left { flex-grow: 1; }
    .search-bar { width: 300px; max-width: 100%; }
    .filter-right { display: flex; gap: 8px; align-items: center; }
    .filter-right .dropdown-toggle,
    .filter-right .dropdown-toggle *,
    .filter-right .dropdown-item,
    .filter-right .dropdown-item * {
      cursor: pointer !important;
      user-select: none;
    }
    
    .btn-upload-select { color: #ea580c; border-color: #ea580c; font-weight: 600; }
    .btn-upload-select:hover { background-color: #ea580c; color: white; }

    /* Import Wizard Styles */
    .import-steps { display: flex; gap: 10px; margin-bottom: 20px; font-size: 0.9rem; }
    .step-item { color: #8a93a2; font-weight: 500; }
    .step-item.active { color: #ea580c; font-weight: 700; }
    
    .upload-zone {
        border: 2px dashed #d8dbe0;
        border-radius: 8px; padding: 40px 20px; text-align: center;
        background-color: #f9fafb; margin-bottom: 20px; transition: all 0.3s ease; cursor: pointer;
    }
    .upload-zone:hover { border-color: #ea580c; background-color: #fff7ed; }
    .upload-text { font-weight: 600; margin-bottom: 10px; font-size: 1.1rem; }
    .upload-hint { color: #8a93a2; font-size: 0.85rem; margin-top: 10px; }
    
    .note-section { font-size: 0.9rem; color: #3c4b64; }
    .link-orange { color: #ea580c; text-decoration: none; font-weight: 600; cursor: pointer; }
    .link-orange:hover { text-decoration: underline; }

    /* --- POPUP STYLES (Shared for Filter & Settings) --- */
    .popup-container {
        position: absolute;
        top: 100%;
        right: 0;
        width: 320px;
        background: white;
        border: 1px solid #d8dbe0;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        border-radius: 4px;
        z-index: 1000;
        margin-top: 5px;
        display: flex;
        flex-direction: column;
        max-height: 500px;
    }
    .popup-header {
        display: flex; justify-content: space-between; align-items: center;
        padding: 12px 16px; border-bottom: 1px solid #ebedef;
    }
    .popup-title { font-weight: 700; font-size: 1rem; color: #3c4b64; margin: 0; }
    .popup-body { padding: 12px 16px; overflow-y: auto; flex-grow: 1; }
    .popup-footer {
        padding: 12px 16px; border-top: 1px solid #ebedef;
        display: flex; justify-content: space-between; background-color: #f9fafb;
    }
    .btn-apply { background-color: #ea580c; border-color: #ea580c; color: white; }
    .btn-apply:hover { background-color: #c2410c; color: white;}
    
    .column-search-box { margin-top: 5px; margin-left: 24px; animation: fadeIn 0.2s ease-in-out; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(-5px); } to { opacity: 1; transform: translateY(0); } }

    /* Column Settings Specific */
    .col-setting-item { display: flex; align-items: center; margin-bottom: 10px; justify-content: space-between; }
    .col-drag-handle { color: #9da5b1; cursor: grab; margin-right: 8px; }

    /* --- Table Styles --- */
    .sticky-col { position: -webkit-sticky; position: sticky; z-index: 10; background-color: #fff; }
    th.sticky-col { z-index: 20; background-color: #f0f2f5; }

    /* Dynamic Sticky Positions */
    .col-sticky-0 { left: 0; border-right: 1px solid #d8dbe0; }
    .col-sticky-1 { left: 50px; border-right: 1px solid #d8dbe0; }
    .col-sticky-2 { left: 170px; border-right: 1px solid #d8dbe0; box-shadow: 2px 0 5px rgba(0,0,0,0.05); }

    .table-header-cell {
      background-color: #f0f2f5; font-weight: 700; font-size: 0.8rem;
      color: #3c4b64; white-space: nowrap; vertical-align: middle;
    }
    .employee-info { display: flex; align-items: center; gap: 10px; }
    .table-avatar { width: 30px; height: 30px; font-size: 0.75rem; }
    tbody tr:hover .sticky-col { background-color: #ececec !important; }
    .badge-status { font-weight: 500; padding: 6px 10px; }
    `}
  </style>
)

// =====================================================================
// 2. COMPONENTS
// =====================================================================

const PageHeader = ({ onReloadClick, onImportClick }) => (
  <div className="page-header">
    <div className="page-title">Hồ sơ nhân viên</div>
    <div className="header-actions">
      <CButton className="btn-apply" size="sm" onClick={onReloadClick}>
        <CIcon icon={cilReload} className="me-2" />
        Lấy lại dữ liệu
      </CButton>
      <CButton variant="outline" size="sm" onClick={onImportClick}>
        <CIcon icon={cilCloudUpload} className="me-2" />
        Nhập khẩu
      </CButton>
      <CButton variant="outline" size="sm">
        <CIcon icon={cilOptions} />
      </CButton>
    </div>
  </div>
)

// --- POPUP BỘ LỌC NÂNG CAO ---
const AdvancedFilterPopup = ({ visible, onClose, onApply, columns }) => {
  const [checkedColumns, setCheckedColumns] = useState({});
  const [columnSearchValues, setColumnSearchValues] = useState({});
  const [generalSearch, setGeneralSearch] = useState("");

  if (!visible) return null;

  const handleCheckColumn = (colKey) => {
    const isChecked = !checkedColumns[colKey];
    setCheckedColumns(prev => ({ ...prev, [colKey]: isChecked }));
    if (!isChecked) {
      setColumnSearchValues(prev => {
        const newState = { ...prev };
        delete newState[colKey];
        return newState;
      });
    }
  };

  const handleColumnSearchChange = (colKey, value) => {
    setColumnSearchValues(prev => ({ ...prev, [colKey]: value }));
  };

  const handleApply = () => {
    onApply({ columnFilters: columnSearchValues, generalFilter: generalSearch });
    onClose();
  };

  const handleReset = () => {
    setCheckedColumns({}); setColumnSearchValues({}); setGeneralSearch("");
    onApply({ columnFilters: {}, generalFilter: "" });
  };

  // Chỉ hiển thị các cột có thể lọc (trừ checkbox và hình ảnh nếu có)
  const filterableColumns = columns.filter(c => c.key !== 'checkbox' && c.key !== 'avatar' && c.visible);

  return (
    <div className="popup-container filter-popup">
      <div className="popup-header">
        <h5 className="popup-title">Bộ lọc</h5>
        <CButton color="link" className="text-secondary p-0" onClick={onClose}><CIcon icon={cilX} /></CButton>
      </div>
      <div className="popup-body">
        <CInputGroup className="mb-3">
          <CInputGroupText className="bg-white border-end-0 px-2"><CIcon icon={cilSearch} size="sm" /></CInputGroupText>
          <CFormInput className="border-start-0 ps-1" size="sm" placeholder="Tìm kiếm nhanh..." value={generalSearch} onChange={(e) => setGeneralSearch(e.target.value)} />
        </CInputGroup>
        {filterableColumns.map(col => (
          <div key={col.key} className="mb-2">
            <CFormCheck
              id={`chk-filter-${col.key}`} label={col.label}
              checked={!!checkedColumns[col.key]} onChange={() => handleCheckColumn(col.key)}
              style={{ cursor: 'pointer' }}
            />
            {checkedColumns[col.key] && (
              <div className="column-search-box">
                <CFormInput size="sm" placeholder={`Lọc ${col.label}...`} value={columnSearchValues[col.key] || ''} onChange={(e) => handleColumnSearchChange(col.key, e.target.value)} />
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="popup-footer">
        <CButton color="light" size="sm" onClick={handleReset}>Bỏ lọc</CButton>
        <CButton size="sm" className="btn-apply" onClick={handleApply}>Áp dụng</CButton>
      </div>
    </div>
  );
};

// --- POPUP TÙY CHỈNH CỘT (NEW) ---
const ColumnSettingsPopup = ({ visible, onClose, columns, onUpdateColumns, onResetDefault }) => {
  // State tạm thời để lưu trạng thái checkbox khi chưa ấn "Lưu"
  const [tempColumns, setTempColumns] = useState(columns);
  const [searchTerm, setSearchTerm] = useState('');

  // Reset tempColumns khi mở popup
  useEffect(() => {
    if (visible) {
      setTempColumns(columns);
    }
  }, [visible, columns]);

  if (!visible) return null;

  const handleToggleColumn = (key) => {
    setTempColumns(prev => prev.map(col =>
      col.key === key ? { ...col, visible: !col.visible } : col
    ));
  };

  const handleSave = () => {
    onUpdateColumns(tempColumns);
    onClose();
  };

  const handleReset = () => {
    onResetDefault();
    onClose();
  }

  // Filter cột theo từ khóa tìm kiếm
  const displayedColumns = tempColumns.filter(col =>
    col.label.toLowerCase().includes(searchTerm.toLowerCase()) && col.key !== 'checkbox' // Ẩn checkbox config
  );

  return (
    <div className="popup-container settings-popup">
      <div className="popup-header">
        <h5 className="popup-title">Tùy chỉnh cột</h5>
        <CButton color="link" className="text-secondary p-0" onClick={onClose}><CIcon icon={cilX} /></CButton>
      </div>
      <div className="popup-body">
        <CInputGroup className="mb-3">
          <CFormInput
            size="sm" placeholder="Tìm kiếm cột..."
            value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
          />
        </CInputGroup>

        <div className="column-list">
          {displayedColumns.map((col, index) => (
            <div key={col.key} className="col-setting-item">
              <div className="d-flex align-items-center">
                {/* Có thể thêm icon drag handle ở đây nếu muốn sort */}
                {/* <CIcon icon={cilMenu} className="col-drag-handle" size="sm"/> */}
                <CFormCheck
                  id={`chk-col-${col.key}`}
                  label={col.label}
                  checked={col.visible}
                  onChange={() => handleToggleColumn(col.key)}
                // Disable nếu là cột quan trọng (nếu muốn)
                // disabled={col.sticky} 
                />
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="popup-footer">
        <CButton color="light" size="sm" onClick={handleReset}>Mặc định</CButton>
        <CButton size="sm" className="btn-apply" onClick={handleSave}>Lưu</CButton>
      </div>
    </div>
  )
}

const FilterBar = ({ filters, onFilterChange, onTableReload, onExportExcel, onApplyAdvancedFilter, columns, onUpdateColumns, onResetDefaultColumns }) => {
  const [showFilterPopup, setShowFilterPopup] = useState(false);
  const [showSettingsPopup, setShowSettingsPopup] = useState(false);

  const statusOptions = [
    { label: 'Tất cả', value: 'All' },
    { label: 'Đang làm việc', value: 'Active' },
    { label: 'Nghỉ phép', value: 'OnLeave' },
    { label: 'Đã nghỉ việc', value: 'Resigned' },
    { label: 'Thôi việc', value: 'Terminated' }
  ];

  const currentStatusLabel = statusOptions.find(opt => opt.value === filters.status)?.label || 'Tất cả';

  return (
    <div className="filter-bar">
      <div className="filter-left">
        <CInputGroup className="search-bar">
          <CInputGroupText className="bg-white border-end-0">
            <CIcon icon={cilSearch} size="sm" />
          </CInputGroupText>
          <CFormInput
            className="border-start-0 ps-0"
            placeholder="Tìm kiếm chung..."
            value={filters.search}
            onChange={(e) => onFilterChange((prev) => ({ ...prev, search: e.target.value }))}
            size="sm"
          />
        </CInputGroup>
      </div>

      <div className="filter-right" style={{ position: 'relative' }}>
        {/* ... Các Dropdown Status, Đơn vị giữ nguyên ... */}
        <CDropdown>
          <CDropdownToggle color="transparent" className="fw-bold text-nowrap" size="sm">
            {currentStatusLabel} <span className="caret"></span>
          </CDropdownToggle>
          <CDropdownMenu>
            {statusOptions.map((opt) => (
              <CDropdownItem key={opt.value} component="button" active={filters.status === opt.value} onClick={() => onFilterChange((prev) => ({ ...prev, status: opt.value }))}>
                {opt.label}
              </CDropdownItem>
            ))}
          </CDropdownMenu>
        </CDropdown>

        <CDropdown>
          <CDropdownToggle variant="outline" size="sm">Tất cả đơn vị</CDropdownToggle>
          <CDropdownMenu>
            <CDropdownItem>Phòng Kế Toán</CDropdownItem>
            <CDropdownItem>Phòng IT</CDropdownItem>
          </CDropdownMenu>
        </CDropdown>

        <CButton variant="outline" size="sm" onClick={onTableReload} title="Tải lại bảng dữ liệu"><CIcon icon={cilReload} /></CButton>
        <CButton variant="outline" size="sm" onClick={onExportExcel} title="Xuất Excel">Xuất Excel</CButton>

        {/* Nút Bộ Lọc Nâng Cao */}
        <div style={{ position: 'relative', display: 'inline-block' }}>
          <CButton
            variant="outline" size="sm"
            onClick={() => { setShowFilterPopup(!showFilterPopup); setShowSettingsPopup(false); }}
            active={showFilterPopup}
            className={Object.keys(filters.columnFilters || {}).length > 0 ? 'border-warning text-warning' : ''}
          >
            <CIcon icon={cilFilter} />
          </CButton>
          <AdvancedFilterPopup
            visible={showFilterPopup}
            onClose={() => setShowFilterPopup(false)}
            onApply={onApplyAdvancedFilter}
            columns={columns}
          />
        </div>

        {/* Nút Cài Đặt Cột (NEW) */}
        <div style={{ position: 'relative', display: 'inline-block' }}>
          <CButton
            variant="outline" size="sm"
            onClick={() => { setShowSettingsPopup(!showSettingsPopup); setShowFilterPopup(false); }}
            active={showSettingsPopup}
          >
            <CIcon icon={cilSettings} />
          </CButton>
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

// Bảng dữ liệu (Động theo columns config)
const PageTable = ({ data, columns }) => {
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
  }

  const renderStatus = (status) => {
    let color = 'secondary'; let text = status;
    switch (status) {
      case 'Active': color = 'success'; text = 'Đang làm việc'; break;
      case 'OnLeave': color = 'warning'; text = 'Nghỉ phép'; break;
      case 'Resigned': color = 'danger'; text = 'Đã nghỉ việc'; break;
      case 'Terminated': color = 'dark'; text = 'Thôi việc'; break;
      default: break;
    }
    return <CBadge color={color} shape="rounded-pill" className={`badge-status bg-opacity-25 text-${color === 'dark' ? 'dark' : color}`}>{text}</CBadge>;
  }

  // Lọc ra các cột visible
  const visibleColumns = columns.filter(col => col.visible);

  return (
    <div className="table-wrapper-fullscreen">
      {/* Tính toán minWidth dựa trên số lượng cột để tránh co cụm */}
      <CTable hover responsive className="mb-0" align="middle" style={{ minWidth: `${visibleColumns.length * 150}px` }}>
        <CTableHead>
          <CTableRow>
            {visibleColumns.map((col, index) => {
              // Xử lý class cho sticky
              let className = "table-header-cell";
              if (col.sticky) {
                className += " sticky-col";
                // Logic sticky đơn giản: 3 cột đầu tiên
                if (index === 0) className += " col-sticky-0"; // Checkbox
                if (index === 1) className += " col-sticky-1"; // Code
                if (index === 2) className += " col-sticky-2"; // Name
              }
              if (col.align) className += ` text-${col.align}`;

              return (
                <CTableHeaderCell key={col.key} className={className} style={{ width: col.width }}>
                  {col.type === 'checkbox' ? (
                    <div className="text-center"><CFormCheck /></div>
                  ) : (
                    <>
                      {col.key === 'full_name' && <CIcon icon={cilArrowTop} size="xs" className="me-1" />}
                      {col.label}
                    </>
                  )}
                </CTableHeaderCell>
              );
            })}
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {data.length > 0 ? (
            data.map((item) => (
              <CTableRow key={item.employee_id}>
                {visibleColumns.map((col, index) => {
                  let className = "";
                  if (col.sticky) {
                    className += " sticky-col";
                    if (index === 0) className += " col-sticky-0";
                    if (index === 1) className += " col-sticky-1";
                    if (index === 2) className += " col-sticky-2";
                  }
                  if (col.align) className += ` text-${col.align}`;

                  let content = item[col.key];

                  // Custom Rendering
                  if (col.type === 'checkbox') {
                    content = <div className="text-center"><CFormCheck /></div>;
                  } else if (col.key === 'full_name') {
                    content = (
                      <div className="employee-info">
                        <CAvatar size="sm" className="table-avatar text-white" style={{ backgroundColor: item.avatarColor }}>{item.avatarText}</CAvatar>
                        <span className="fw-semibold text-primary">{item.full_name}</span>
                      </div>
                    );
                  } else if (col.key === 'gender') {
                    content = item.gender === 'Male' ? 'Nam' : (item.gender === 'Female' ? 'Nữ' : 'Khác');
                  } else if (col.key === 'date_of_birth' || col.key === 'hire_date') {
                    content = formatDate(item[col.key]);
                  } else if (col.key === 'status') {
                    content = renderStatus(item.status);
                  }

                  return (
                    <CTableDataCell key={`${item.employee_id}-${col.key}`} className={className}>
                      {content}
                    </CTableDataCell>
                  );
                })}
              </CTableRow>
            ))
          ) : (
            <CTableRow>
              <CTableDataCell colSpan={visibleColumns.length} className="text-center py-4 text-muted">Không tìm thấy dữ liệu phù hợp</CTableDataCell>
            </CTableRow>
          )}
        </CTableBody>
      </CTable>
    </div>
  )
}

// =====================================================================
// 5. DỮ LIỆU GIẢ (MOCK DATA)
// =====================================================================
const MOCK_DATA = [
  {
    employee_id: 1,
    employee_code: 'NV000001',
    full_name: 'Hoàng Việt',
    gender: 'Male',
    date_of_birth: '1995-05-15',
    email: 'hoangviet@hrms.com',
    phone_number: '0988777666',
    hire_date: '2023-01-10',
    department_name: 'Phòng IT',
    job_position_name: 'Senior Developer',
    bank_name: 'Vietcombank',
    bank_account: 'HOANG VIET',
    bank_number: '001100223344',
    address: '123 Đường Láng, Hà Nội',
    status: 'Active',
    avatarText: 'HV',
    avatarColor: '#321fdb',
  },
  {
    employee_id: 2,
    employee_code: 'NV000002',
    full_name: 'Nguyễn Thị Ánh',
    gender: 'Female',
    date_of_birth: '1998-08-20',
    email: 'anh.nguyen@hrms.com',
    phone_number: '0912345678',
    hire_date: '2023-03-15',
    department_name: 'Phòng Kế Toán',
    job_position_name: 'Kế toán viên',
    bank_name: 'Techcombank',
    bank_account: 'NGUYEN THI ANH',
    bank_number: '190333444555',
    address: '456 Cầu Giấy, Hà Nội',
    status: 'Active',
    avatarText: 'NA',
    avatarColor: '#39f',
  },
  {
    employee_id: 3,
    employee_code: 'NV000003',
    full_name: 'Lê Văn Cường',
    gender: 'Male',
    date_of_birth: '1990-12-05',
    email: 'cuong.le@hrms.com',
    phone_number: '0909090909',
    hire_date: '2022-06-01',
    department_name: 'Phòng Sản Xuất',
    job_position_name: 'Trưởng nhóm',
    bank_name: 'MB Bank',
    bank_account: 'LE VAN CUONG',
    bank_number: '999988887777',
    address: 'Khu công nghiệp Bắc Thăng Long',
    status: 'Resigned',
    avatarText: 'LC',
    avatarColor: '#e55353',
  }
]

// =====================================================================
// 6. COMPONENT CHA (MAIN)
// =====================================================================
const EmployeeListPage = () => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)

  // State Columns Config
  const [columns, setColumns] = useState(DEFAULT_COLUMNS)

  // State Modal
  const [visibleReloadModal, setVisibleReloadModal] = useState(false)
  const [visibleImportModal, setVisibleImportModal] = useState(false)
  const [importFile, setImportFile] = useState(null)
  const fileInputRef = useRef(null)

  // State Filter
  const [filters, setFilters] = useState({
    search: '',
    status: 'All',
    columnFilters: {}
  })

  const loadXLSX = () => {
    return new Promise((resolve, reject) => {
      if (window.XLSX) { resolve(window.XLSX); return; }
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js';
      script.onload = () => resolve(window.XLSX);
      script.onerror = reject;
      document.body.appendChild(script);
    });
  }

  const fetchData = () => {
    setLoading(true);
    setTimeout(() => { setData(MOCK_DATA); setLoading(false); }, 500)
  }

  useEffect(() => { fetchData(); loadXLSX(); }, [])

  // --- HÀM XỬ LÝ ---
  const handleOpenReloadModal = () => setVisibleReloadModal(true);
  const handleConfirmReload = () => { fetchData(); setVisibleReloadModal(false); }

  const handleOpenImportModal = () => { setVisibleImportModal(true); setImportFile(null); }
  const handleFileSelect = (e) => { const file = e.target.files[0]; if (file) setImportFile(file); }
  const triggerFileSelect = () => fileInputRef.current.click();
  const handleConfirmImport = () => { if (!importFile) { alert("Vui lòng chọn tệp!"); return; } setVisibleImportModal(false); alert("Đã ghi nhận file."); }

  const handleTableReload = () => {
    console.log("Reset toàn bộ về trạng thái ban đầu...");
    setFilters({
      search: '',
      status: 'All',
      columnFilters: {}
    });
    setColumns(DEFAULT_COLUMNS);
  }

  const handleExportExcel = async () => {
    try {
      if (!window.XLSX) await loadXLSX();
      const XLSX = window.XLSX;

      // Chỉ xuất các cột đang hiện
      const visibleCols = columns.filter(c => c.visible && c.key !== 'checkbox');
      const exportData = filteredData.map(item => {
        const row = {};
        visibleCols.forEach(col => {
          row[col.label] = item[col.key];
        });
        return row;
      });

      const ws = XLSX.utils.json_to_sheet(exportData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Danh sách nhân viên");
      XLSX.writeFile(wb, "Danh_sach_nhan_vien.xlsx");
    } catch (error) { console.error("Lỗi:", error); }
  }

  const handleApplyAdvancedFilter = (advancedFilters) => {
    setFilters(prev => ({ ...prev, columnFilters: advancedFilters.columnFilters }));
  };

  // Update columns handler
  const handleUpdateColumns = (newColumns) => {
    setColumns(newColumns);
  }
  const handleResetDefaultColumns = () => {
    setColumns(DEFAULT_COLUMNS);
  }

  const filteredData = useMemo(() => {
    return data.filter(item => {
      const searchTerm = filters.search.toLowerCase().trim();
      const matchesSearch =
        !searchTerm ||
        Object.values(item).some(val => String(val).toLowerCase().includes(searchTerm));

      const matchesStatus = filters.status === 'All' || item.status === filters.status;

      let matchesColumnFilters = true;
      if (filters.columnFilters && Object.keys(filters.columnFilters).length > 0) {
        matchesColumnFilters = Object.entries(filters.columnFilters).every(([key, value]) => {
          if (!value) return true;
          const itemValue = item[key] ? String(item[key]).toLowerCase() : '';
          return itemValue.includes(value.toLowerCase().trim());
        });
      }

      return matchesSearch && matchesStatus && matchesColumnFilters;
    });
  }, [data, filters]);

  if (loading) return <div className="d-flex justify-content-center align-items-center vh-100"><CSpinner color="primary" /></div>

  return (
    <>
      <EmployeeListStyles />
      <div className="page-container">
        <PageHeader onReloadClick={handleOpenReloadModal} onImportClick={handleOpenImportModal} />
        <FilterBar
          filters={filters}
          onFilterChange={setFilters}
          onTableReload={handleTableReload}
          onExportExcel={handleExportExcel}
          onApplyAdvancedFilter={handleApplyAdvancedFilter}
          columns={columns}
          onUpdateColumns={handleUpdateColumns}
          onResetDefaultColumns={handleResetDefaultColumns}
        />
        <div style={{ flex: 1, minHeight: 0 }}>
          <PageTable data={filteredData} columns={columns} />
        </div>
      </div>
      {/* ... (Modals giữ nguyên) ... */}
      <CModal alignment="center" visible={visibleReloadModal} onClose={() => setVisibleReloadModal(false)}>
        <CModalHeader><CModalTitle className="fw-bold fs-5">Thông báo</CModalTitle></CModalHeader>
        <CModalBody>Chương trình sẽ cập nhật dữ liệu nhân viên mới nhất từ <strong>Hệ thống</strong>. Bạn có chắc chắn muốn thực hiện chức năng này không?</CModalBody>
        <CModalFooter className="border-top-0">
          <CButton color="light" onClick={() => setVisibleReloadModal(false)}>Hủy</CButton>
          <CButton className="btn-apply" onClick={handleConfirmReload}>Đồng ý</CButton>
        </CModalFooter>
      </CModal>

      <CModal alignment="center" size="lg" visible={visibleImportModal} onClose={() => setVisibleImportModal(false)}>
        <CModalHeader><CModalTitle className="fw-bold fs-5">Nhập khẩu</CModalTitle></CModalHeader>
        <CModalBody>
          <div className="import-steps">
            <span className="step-item active">1. Tải lên tệp nhập khẩu</span>
            <span className="step-item text-muted"> &gt; 2. Ghép trường thông tin</span>
            <span className="step-item text-muted"> &gt; 3. Kiểm tra dữ liệu</span>
          </div>
          <div className="upload-zone" onClick={!importFile ? triggerFileSelect : undefined}>
            {importFile ? (
              <div><CIcon icon={cilFile} size="3xl" className="text-success mb-3" /><div className="fw-bold text-success">{importFile.name}</div><CButton color="link" className="text-danger mt-2 text-decoration-none" onClick={(e) => { e.stopPropagation(); setImportFile(null); }}>Xóa file</CButton></div>
            ) : (
              <><div className="upload-text">Kéo thả tệp vào đây</div><div className="mb-2">hoặc</div><input type="file" ref={fileInputRef} onChange={handleFileSelect} accept=".xls,.xlsx,.ods,.csv" style={{ display: 'none' }} /><CButton variant="outline" className="btn-upload-select" onClick={(e) => { e.stopPropagation(); triggerFileSelect(); }}><CIcon icon={cilCloudUpload} className="me-2" />Chọn tệp</CButton><div className="upload-hint">Chấp nhận file .xls, .xlsx, .ods và .csv</div></>
            )}
          </div>
        </CModalBody>
        <CModalFooter className="bg-light border-top-0">
          <CButton color="white" className="border" onClick={() => setVisibleImportModal(false)}>Hủy</CButton>
          <CButton className="btn-apply" onClick={handleConfirmImport}>Tiếp theo</CButton>
        </CModalFooter>
      </CModal>
    </>
  )
}

export default EmployeeListPage