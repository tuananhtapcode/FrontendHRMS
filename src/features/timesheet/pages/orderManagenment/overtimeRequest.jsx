// import {
//   CButton,
//   CSpinner,
// } from '@coreui/react'
// import { useState } from 'react'
// import { useNavigate } from 'react-router-dom'

// // Imports cho Icons
// import {
//   cilDescription, // Icon tài liệu (dùng lại)
//   cilPlus, // Icon dấu cộng
// } from '@coreui/icons'
// import CIcon from '@coreui/icons-react'

// // =====================================================================
// // 1. CSS TÙY CHỈNH (Cho trang trống)
// // =====================================================================
// const OvertimeRequestStyles = () => (
//   <style>
//     {`
//     .page-container {
//       padding: 1rem;
//       height: calc(100vh - 100px); /* Trừ đi header của layout chính */
//       display: flex;
//       align-items: center;
//       justify-content: center;
//       background-color: #fff; /* Nền trắng */
//     }

//     .empty-state-wrapper {
//       text-align: center;
//       max-width: 500px;
//     }

//     .empty-state-icon {
//       width: 80px;
//       height: 80px;
//       color: #6f42c1; /* Màu tím nhạt giống trong ảnh Đơn xin nghỉ */
//       margin-bottom: 1.5rem;
//       opacity: 0.8;
//     }

//     .empty-state-title {
//       font-size: 1.25rem;
//       font-weight: 700;
//       color: #3c4b64;
//       margin-bottom: 0.5rem;
//     }

//     .empty-state-description {
//       color: #768192;
//       margin-bottom: 1.5rem;
//       font-size: 0.95rem;
//     }

//     /* Custom nút Thêm (Primary Blue) */
//     .btn-add-primary {
//       padding: 0.5rem 1.5rem;
//       font-weight: 600;
//       display: inline-flex;
//       align-items: center;
//       gap: 8px;
//       background-color: #ea580c; border-color: #ea580c; color: white; font-weight: 600;
//     }
//     .btn-add-primary:hover { background-color: #c2410c; color: white; border-color: #c2410c; }
//     `}
//   </style>
// )

// // =====================================================================
// // 2. COMPONENT TRẠNG THÁI TRỐNG (EMPTY STATE)
// // =====================================================================
// const EmptyState = ({ onAdd }) => {
//   return (
//     <div className="empty-state-wrapper">
//       {/* Icon tài liệu */}
//       <div className="mb-3">
//         <CIcon icon={cilDescription} size="xl" className="empty-state-icon" />
//       </div>

//       {/* Sửa tiêu đề */}
//       <h3 className="empty-state-title">Đơn đăng kí đi muộn, về sớm</h3>

//       {/* Sửa mô tả */}
//       <p className="empty-state-description">
//         Tổng hợp danh sách đơn đăng kí đi muộn, về sớm hoặc làm thêm giờ của nhân viên trong công ty
//       </p>

//       {/* Nút Thêm (Màu Primary, Không Dropdown) */}
//       <CButton 
//         color="primary" 
//         className="btn-add-primary" 
//         onClick={onAdd}
//       >
//         <CIcon icon={cilPlus} size="sm" />
//         Thêm
//       </CButton>
//     </div>
//   )
// }

// // =====================================================================
// // 3. COMPONENT CHA (MAIN)
// // =====================================================================
// const OvertimeRequestPage = () => {
//   // Giả sử chưa có dữ liệu (data = [])
//   const [data, setData] = useState([]) 
//   const [loading, setLoading] = useState(false)
//   const navigate = useNavigate()

//   const handleAddNew = () => {
//     // Sửa URL điều hướng đến trang thêm mới của Đăng kí làm thêm/đi muộn
//     navigate('/timesheet/overtimeRequest/add') 
//   }

//   if (loading) {
//     return (
//       <div className="d-flex justify-content-center align-items-center vh-100">
//         <CSpinner color="primary" />
//       </div>
//     )
//   }

//   return (
//     <>
//       <OvertimeRequestStyles />
      
//       <div className="page-container">
//         {/* Vì chưa có dữ liệu nên hiển thị màn hình Empty State */}
//         {data.length === 0 ? (
//           <EmptyState onAdd={handleAddNew} />
//         ) : (
//           <div>
//             {/* Sau này nếu có dữ liệu thì hiển thị bảng ở đây */}
//             <p>Đã có dữ liệu...</p>
//           </div>
//         )}
//       </div>
//     </>
//   )
// }

// export default OvertimeRequestPage








import {
  cilCloudUpload,
  cilFile,
  cilFilter,
  cilPencil,
  cilPlus,
  cilReload,
  cilSearch,
  cilSettings,
  cilTrash,
  cilX
} from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import {
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
  CTableRow,
  CTooltip
} from '@coreui/react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// =====================================================================
// 0. CẤU HÌNH MẶC ĐỊNH (CỘT LÀM THÊM GIỜ)
// =====================================================================
const DEFAULT_COLUMNS = [
  { key: 'checkbox', label: '', visible: true, width: 50, type: 'checkbox' },
  { key: 'emp_code', label: 'Mã nhân viên', visible: true, width: 120 },
  { key: 'applicant', label: 'Người nộp đơn', visible: true, width: 180 },
  { key: 'department', label: 'Đơn vị công tác', visible: true, width: 200 },
  { key: 'apply_date', label: 'Ngày nộp', visible: true, width: 120, align: 'center' },
  { key: 'ot_from', label: 'Làm thêm từ', visible: true, width: 140, align: 'center' },
  { key: 'ot_to', label: 'Làm thêm đến', visible: true, width: 140, align: 'center' },
  { key: 'ot_hours', label: 'Số giờ', visible: true, width: 100, align: 'center' },
  { key: 'break_from', label: 'Nghỉ từ', visible: false, width: 120, align: 'center' }, // Mặc định ẩn cho gọn
  { key: 'break_to', label: 'Nghỉ đến', visible: false, width: 120, align: 'center' }, // Mặc định ẩn cho gọn
  { key: 'timezone', label: 'Múi giờ', visible: false, width: 150 },
  { key: 'ot_timing', label: 'Thời điểm', visible: true, width: 150 }, 
  { key: 'applied_shift', label: 'Ca áp dụng', visible: true, width: 150 },
  { key: 'reason', label: 'Lý do', visible: true, width: 200 },
  { key: 'status', label: 'Trạng thái', visible: true, width: 140, align: 'center' },
  { key: 'approver', label: 'Người duyệt', visible: true, width: 180 },
  { key: 'related', label: 'Người liên quan', visible: false, width: 180 },
  { key: 'actions', label: '', visible: true, width: 80 }
];

const INITIAL_FILTERS = { 
  search: '', 
  status: 'all', 
  unit: 'all', 
  columnFilters: {} 
};

// DỮ LIỆU GIẢ LẬP (OVERTIME)
const MOCK_DB = [
  { 
    id: 1, emp_code: 'NV001', applicant: 'Nguyễn Văn A', department: 'Phòng Kỹ thuật', 
    apply_date: '12/12/2025', ot_from: '17:30 12/12', ot_to: '20:30 12/12', ot_hours: '3.0',
    break_from: '19:00', break_to: '19:15', timezone: '(UTC+07:00)', 
    ot_timing: 'Sau ca làm việc', applied_shift: 'HC', reason: 'Deploy hệ thống', 
    status: 'Đã duyệt', approver: 'Trần Văn B', related: '-'
  },
  { 
    id: 2, emp_code: 'NV002', applicant: 'Trần Thị C', department: 'Phòng HCNS', 
    apply_date: '13/12/2025', ot_from: '08:00 14/12', ot_to: '12:00 14/12', ot_hours: '4.0',
    break_from: '', break_to: '', timezone: '(UTC+07:00)', 
    ot_timing: 'Ngày nghỉ', applied_shift: 'OFF', reason: 'Tổ chức sự kiện', 
    status: 'Chờ duyệt', approver: 'Nguyễn X', related: 'Lê Văn D'
  },
  { 
    id: 3, emp_code: 'NV003', applicant: 'Lê Văn D', department: 'Kho vận', 
    apply_date: '10/12/2025', ot_from: '17:00 10/12', ot_to: '19:00 10/12', ot_hours: '2.0',
    break_from: '', break_to: '', timezone: '(UTC+07:00)', 
    ot_timing: 'Sau ca làm việc', applied_shift: 'Ca 1', reason: 'Kiểm kê kho', 
    status: 'Từ chối', approver: 'Nguyễn X', related: '-'
  },
];

// =====================================================================
// 1. CSS TÙY CHỈNH (GIỮ NGUYÊN STRUCUTRE CŨ)
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
    .filter-right .dropdown-toggle, .filter-right .dropdown-toggle *, .filter-right .dropdown-item, .filter-right .dropdown-item * { cursor: pointer !important; user-select: none; }
    .btn-orange { background-color: #ea580c; border-color: #ea580c; color: white; font-weight: 600; }
    .btn-orange:hover { background-color: #c2410c; color: white; border-color: #c2410c; }
    .btn-icon-only { padding: 0.25rem 0.5rem; display: flex; align-items: center; justify-content: center; }
    
    /* POPUP & MODAL */
    .popup-container { position: absolute; top: 100%; right: 0; width: 320px; background: white; border: 1px solid #d8dbe0; box-shadow: 0 4px 12px rgba(0,0,0,0.15); border-radius: 4px; z-index: 1000; margin-top: 5px; display: flex; flex-direction: column; max-height: 500px; }
    .popup-header { display: flex; justify-content: space-between; align-items: center; padding: 12px 16px; border-bottom: 1px solid #ebedef; }
    .popup-title { font-weight: 700; font-size: 1rem; color: #3c4b64; margin: 0; }
    .popup-body { padding: 12px 16px; overflow-y: auto; flex-grow: 1; }
    .popup-footer { padding: 12px 16px; border-top: 1px solid #ebedef; display: flex; justify-content: space-between; background-color: #f9fafb; }
    .col-setting-item { display: flex; align-items: center; margin-bottom: 10px; justify-content: space-between; }
    
    /* TABLE */
    .table-wrapper-fullscreen { flex-grow: 1; background-color: #fff; border-radius: 4px; box-shadow: 0 1px 2px rgba(0,0,0,0.05); overflow: auto; position: relative; }
    .table-header-cell { background-color: #f0f2f5; font-weight: 700; font-size: 0.8rem; color: #3c4b64; white-space: nowrap; vertical-align: middle; position: sticky; top: 0; z-index: 10; box-shadow: 0 1px 0 #d8dbe0; }
    tbody tr:hover { background-color: #ececec; }
    
    /* ACTIONS & STICKY */
    .row-actions { display: flex; gap: 8px; justify-content: center; opacity: 0; visibility: hidden; transform: translateY(5px); transition: all 0.2s ease-in-out; }
    tbody tr:hover .row-actions { opacity: 1; visibility: visible; transform: translateY(0); }
    .btn-action { width: 32px; height: 32px; border-radius: 50%; background: transparent; border: none; display: flex; align-items: center; justify-content: center; cursor: pointer; color: #768192; transition: all 0.2s; }
    .btn-action:hover { background-color: #e2e8f0; transform: scale(1.1); }
    .btn-action.edit:hover { color: #f59e0b; background-color: #fef3c7; }
    .btn-action.delete:hover { color: #ef4444; background-color: #fee2e2; }
    
    .sticky-col-last { position: sticky; right: 0; z-index: 12; background: #fff; box-shadow: -2px 0 5px rgba(0,0,0,0.05); }
    .table-header-cell.sticky-col-last { z-index: 15; }

    /* IMPORT & BADGES */
    .import-steps { display: flex; gap: 10px; margin-bottom: 20px; font-size: 0.9rem; }
    .step-item { color: #8a93a2; font-weight: 500; }
    .step-item.active { color: #ea580c; font-weight: 700; }
    .upload-zone { border: 2px dashed #d8dbe0; border-radius: 8px; padding: 40px 20px; text-align: center; background-color: #f9fafb; margin-bottom: 20px; transition: all 0.3s ease; cursor: pointer; }
    .upload-zone:hover { border-color: #ea580c; background-color: #fff7ed; }
    .upload-text { font-weight: 600; margin-bottom: 10px; font-size: 1.1rem; }
    .btn-upload-select { color: #ea580c; border-color: #ea580c; font-weight: 600; }
    .badge-status { padding: 4px 8px; border-radius: 4px; font-size: 0.8rem; font-weight: 600; }
    .status-approved { background-color: #d1e7dd; color: #0f5132; }
    .status-pending { background-color: #fff3cd; color: #664d03; }
    .status-rejected { background-color: #f8d7da; color: #842029; }
    `}
  </style>
)

// =====================================================================
// 2. COMPONENTS POPUP
// =====================================================================
const AdvancedFilterPopup = ({ visible, onClose, onApply, columns }) => {
  const [checkedColumns, setCheckedColumns] = useState({});
  const [columnSearchValues, setColumnSearchValues] = useState({});

  if (!visible) return null;

  const handleApply = () => {
    const activeFilters = {};
    Object.keys(checkedColumns).forEach(key => {
      if (checkedColumns[key] && columnSearchValues[key]) activeFilters[key] = columnSearchValues[key];
    });
    onApply(activeFilters);
    onClose();
  };

  const handleClear = () => {
    setCheckedColumns({});
    setColumnSearchValues({});
    onApply({}); 
    onClose();
  };

  return (
    <div className="popup-container filter-popup">
      <div className="popup-header">
        <h5 className="popup-title">Bộ lọc nâng cao</h5>
        <CButton color="link" onClick={onClose} className="p-0 text-secondary"><CIcon icon={cilX} /></CButton>
      </div>
      <div className="popup-body">
        {columns.filter(c => c.key !== 'checkbox' && c.key !== 'actions' && c.visible).map(col => (
          <div key={col.key} className="mb-2">
            <CFormCheck label={col.label} checked={!!checkedColumns[col.key]} onChange={() => setCheckedColumns(p => ({ ...p, [col.key]: !p[col.key] }))} />
            {checkedColumns[col.key] && (
              <CFormInput size="sm" className="mt-1 ms-4" placeholder={`Lọc ${col.label}...`} value={columnSearchValues[col.key] || ''} onChange={e => setColumnSearchValues(p => ({ ...p, [col.key]: e.target.value }))} />
            )}
          </div>
        ))}
      </div>
      <div className="popup-footer">
        <CButton color="light" size="sm" onClick={handleClear}>Bỏ lọc</CButton>
        <CButton size="sm" className="btn-orange text-white" onClick={handleApply}>Áp dụng</CButton>
      </div>
    </div>
  );
};

const ColumnSettingsPopup = ({ visible, onClose, columns, onUpdateColumns, onResetDefault }) => {
  const [tempColumns, setTempColumns] = useState(columns);
  useEffect(() => { if (visible) setTempColumns(columns); }, [visible, columns]);
  if (!visible) return null;
  
  const handleSave = () => { onUpdateColumns(tempColumns); onClose(); };
  
  return (
    <div className="popup-container settings-popup">
      <div className="popup-header"><h5 className="popup-title">Tùy chỉnh cột</h5><CButton color="link" onClick={onClose} className="p-0 text-secondary"><CIcon icon={cilX} /></CButton></div>
      <div className="popup-body">
        {tempColumns.map(col => col.key !== 'checkbox' && col.key !== 'actions' && (
          <div key={col.key} className="col-setting-item">
            <CFormCheck label={col.label} checked={col.visible} onChange={() => setTempColumns(p => p.map(c => c.key === col.key ? { ...c, visible: !c.visible } : c))} />
          </div>
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
// 3. HEADER & FILTER BAR
// =====================================================================
const PageHeader = ({ onImportClick, onAddClick }) => (
  <div className="page-header">
    <div className="page-title">Đăng ký làm thêm</div>
    <div className="header-actions">
      <CButton color="secondary" variant="outline" className="fw-semibold bg-white text-dark border-secondary" onClick={onImportClick}><CIcon icon={cilCloudUpload} className="me-2" />Nhập khẩu</CButton>
      <CButton className="btn-orange" onClick={onAddClick}><CIcon icon={cilPlus} className="me-1" /> Thêm</CButton>
    </div>
  </div>
)

const FilterBar = ({ filters, onFilterChange, onExportExcel, onReload, onApplyAdvancedFilter, columns, onUpdateColumns, onResetDefaultColumns }) => {
  const [showFilterPopup, setShowFilterPopup] = useState(false);
  const [showSettingsPopup, setShowSettingsPopup] = useState(false);

  return (
    <div className="filter-bar">
      <div className="filter-left">
        <CInputGroup className="search-bar">
          <CInputGroupText className="bg-white border-end-0 text-secondary"><CIcon icon={cilSearch} size="sm" /></CInputGroupText>
          <CFormInput className="border-start-0 ps-0" placeholder="Tìm kiếm chung" value={filters.search} onChange={(e) => onFilterChange((prev) => ({ ...prev, search: e.target.value }))} size="sm" />
        </CInputGroup>
      </div>
      <div className="filter-right" style={{ position: 'relative' }}>
        <span className="text-muted fs-6" style={{ fontSize: '0.9rem' }}>Trạng thái</span>
        <CDropdown>
            <CDropdownToggle color="transparent" className="fw-bold fs-6" size="sm">{filters.status === 'all' ? 'Tất cả' : filters.status}</CDropdownToggle>
            <CDropdownMenu>
                <CDropdownItem onClick={() => onFilterChange(p => ({...p, status: 'all'}))}>Tất cả</CDropdownItem>
                <CDropdownItem onClick={() => onFilterChange(p => ({...p, status: 'Đã duyệt'}))}>Đã duyệt</CDropdownItem>
                <CDropdownItem onClick={() => onFilterChange(p => ({...p, status: 'Chờ duyệt'}))}>Chờ duyệt</CDropdownItem>
                <CDropdownItem onClick={() => onFilterChange(p => ({...p, status: 'Từ chối'}))}>Từ chối</CDropdownItem>
            </CDropdownMenu>
        </CDropdown>
        <div className="vr mx-2"></div>
        <CDropdown>
            <CDropdownToggle variant="outline" color="secondary" size="sm" className="bg-white text-dark border-secondary">{filters.unit === 'all' ? 'Tất cả đơn vị' : filters.unit}</CDropdownToggle>
            <CDropdownMenu>
                <CDropdownItem onClick={() => onFilterChange(p => ({...p, unit: 'all'}))}>Tất cả đơn vị</CDropdownItem>
                <CDropdownItem onClick={() => onFilterChange(p => ({...p, unit: 'Phòng Kỹ thuật'}))}>Phòng Kỹ thuật</CDropdownItem>
                <CDropdownItem onClick={() => onFilterChange(p => ({...p, unit: 'Phòng HCNS'}))}>Phòng HCNS</CDropdownItem>
            </CDropdownMenu>
        </CDropdown>

        <CTooltip content="Tải lại">
          <CButton variant="outline" color="dark" size="sm" className="btn-icon-only" onClick={onReload}><CIcon icon={cilReload} /></CButton>
        </CTooltip>

        <CTooltip content="Xuất Excel">
          <CButton variant="outline" color="dark" size="sm" className="btn-icon-only" onClick={onExportExcel}>Xuất Excel</CButton>
        </CTooltip>

        <div style={{ position: 'relative', display: 'inline-block' }}>
            <CTooltip content="Bộ lọc nâng cao"><CButton variant="outline" color="dark" size="sm" className="btn-icon-only" onClick={() => { setShowFilterPopup(!showFilterPopup); setShowSettingsPopup(false); }} active={showFilterPopup}><CIcon icon={cilFilter} /></CButton></CTooltip>
            <AdvancedFilterPopup visible={showFilterPopup} onClose={() => setShowFilterPopup(false)} onApply={onApplyAdvancedFilter} columns={columns} />
        </div>

        <div style={{ position: 'relative', display: 'inline-block' }}>
            <CTooltip content="Cài đặt cột"><CButton variant="outline" color="dark" size="sm" className="btn-icon-only" onClick={() => { setShowSettingsPopup(!showSettingsPopup); setShowFilterPopup(false); }} active={showSettingsPopup}><CIcon icon={cilSettings} /></CButton></CTooltip>
            <ColumnSettingsPopup visible={showSettingsPopup} onClose={() => setShowSettingsPopup(false)} columns={columns} onUpdateColumns={onUpdateColumns} onResetDefault={onResetDefaultColumns} />
        </div>
      </div>
    </div>
  )
}

// =====================================================================
// 4. TABLE COMPONENT
// =====================================================================
const PageTable = ({ data, columns }) => {
  const visibleColumns = columns.filter(col => col.visible);
  return (
    <div className="table-wrapper-fullscreen">
      <CTable hover className="mb-0" align="middle" style={{ minWidth: '2000px' }}>
        <CTableHead>
          <CTableRow>
            {visibleColumns.map((col) => {
              let className = "table-header-cell";
              if (col.align) className += ` text-${col.align}`;
              if (col.key === 'actions') className += " sticky-col-last";
              return <CTableHeaderCell key={col.key} className={className} style={{ width: col.width }}>{col.type === 'checkbox' ? <div className="text-center"><CFormCheck /></div> : col.label}</CTableHeaderCell>;
            })}
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {data.length > 0 ? (
            data.map((item) => (
              <CTableRow key={item.id}>
                {visibleColumns.map((col) => {
                  let className = "";
                  if (col.align) className += ` text-${col.align}`;
                  if (col.key === 'actions') {
                    return (
                      <CTableDataCell key={`${item.id}-${col.key}`} className="sticky-col-last">
                        <div className="row-actions">
                          <CTooltip content="Chỉnh sửa"><button className="btn-action edit"><CIcon icon={cilPencil} /></button></CTooltip>
                          <CTooltip content="Xóa"><button className="btn-action delete"><CIcon icon={cilTrash} /></button></CTooltip>
                        </div>
                      </CTableDataCell>
                    );
                  }
                  if (col.type === 'checkbox') return <CTableDataCell key={`${item.id}-${col.key}`} className="text-center"><CFormCheck /></CTableDataCell>;
                  if (col.key === 'status') {
                    let badgeClass = 'badge-status ' + (item.status === 'Đã duyệt' ? 'status-approved' : item.status === 'Từ chối' ? 'status-rejected' : 'status-pending');
                    return <CTableDataCell key={`${item.id}-${col.key}`} className="text-center"><span className={badgeClass}>{item.status}</span></CTableDataCell>;
                  }
                  return <CTableDataCell key={`${item.id}-${col.key}`} className={className} style={{ fontSize: '0.9rem', color: '#333' }}>{item[col.key]}</CTableDataCell>
                })}
              </CTableRow>
            ))
          ) : (<CTableRow><CTableDataCell colSpan={visibleColumns.length} className="text-center py-4 text-muted">Không có dữ liệu</CTableDataCell></CTableRow>)}
        </CTableBody>
      </CTable>
    </div>
  )
}

// =====================================================================
// 5. MAIN PAGE
// =====================================================================
const OvertimeRequestPage = () => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [isFiltering, setIsFiltering] = useState(false)
  
  const [columns, setColumns] = useState(DEFAULT_COLUMNS)
  const [filters, setFilters] = useState(INITIAL_FILTERS)
  const [visibleImportModal, setVisibleImportModal] = useState(false)
  const [importFile, setImportFile] = useState(null)
  
  const fileInputRef = useRef(null)
  const navigate = useNavigate();

  // --- HÀM FETCH DATA ---
  const fetchData = useCallback(async (currentFilters) => {
    setIsFiltering(true);
    await new Promise(r => setTimeout(r, 300));

    let result = MOCK_DB.filter(item => {
        const search = currentFilters.search.toLowerCase();
        // Lọc chung trên tất cả các trường
        const matchSearch = !search || Object.values(item).some(v => String(v).toLowerCase().includes(search));
        const matchStatus = currentFilters.status === 'all' || item.status === currentFilters.status;
        const matchUnit = currentFilters.unit === 'all' || item.department === currentFilters.unit;
        
        // Lọc nâng cao theo từng cột
        const columnFilters = currentFilters.columnFilters || {};
        const matchColumns = Object.keys(columnFilters).every(key => {
            const filterVal = columnFilters[key].toLowerCase();
            const itemVal = String(item[key] || '').toLowerCase();
            return itemVal.includes(filterVal);
        });
        return matchSearch && matchStatus && matchUnit && matchColumns;
    });

    setData(result);
    setLoading(false);
    setIsFiltering(false);
  }, []);

  useEffect(() => {
    fetchData(filters);
  }, [filters, fetchData]);

  const handleReload = () => {
    const defaultFilters = { search: '', status: 'all', unit: 'all', columnFilters: {} }
    setFilters(defaultFilters)
    setColumns(DEFAULT_COLUMNS)
    fetchData(defaultFilters)
  }

  // Logic Import/Export
  const handleFileSelect = (e) => { const file = e.target.files[0]; if (file) setImportFile(file); }
  const triggerFileSelect = () => fileInputRef.current.click();
  const handleConfirmImport = () => { if (!importFile) return; setVisibleImportModal(false); alert("Import thành công!"); }

  const handleExportExcel = () => {
    const headers = columns.filter(c => c.key !== 'checkbox' && c.visible && c.key !== 'actions').map(c => c.label);
    const keys = columns.filter(c => c.key !== 'checkbox' && c.visible && c.key !== 'actions').map(c => c.key);
    const csvRows = [headers.join(',')];
    data.forEach(item => {
      const rowData = keys.map(k => `"${item[k] || ''}"`);
      csvRows.push(rowData.join(','));
    });
    const csvString = csvRows.join('\n');
    const blob = new Blob(['\uFEFF' + csvString], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'danh_sach_lam_them.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading && !isFiltering) return <div className="d-flex justify-content-center align-items-center vh-100"><CSpinner color="primary" /></div>

  return (
    <>
      <PageStyles />
      <div className="page-container">
        <PageHeader onImportClick={() => { setVisibleImportModal(true); setImportFile(null); }} onAddClick={() => navigate('/timesheet/overtimeRequest/add')} />
        
        <FilterBar
          filters={filters}
          onFilterChange={setFilters}
          onExportExcel={handleExportExcel}
          onReload={handleReload}
          onApplyAdvancedFilter={(cf) => setFilters(p => ({ ...p, columnFilters: cf }))}
          columns={columns} 
          onUpdateColumns={setColumns} 
          onResetDefaultColumns={() => setColumns(DEFAULT_COLUMNS)}
        />
        
        {isFiltering ? (
           <div className="d-flex justify-content-center p-5 table-wrapper-fullscreen">
               <CSpinner color="primary" />
           </div>
        ) : (
           <PageTable data={data} columns={columns} />
        )}
      </div>

      <CModal alignment="center" size="lg" visible={visibleImportModal} onClose={() => setVisibleImportModal(false)}>
        <CModalHeader><CModalTitle className="fw-bold fs-5">Nhập khẩu dữ liệu làm thêm</CModalTitle></CModalHeader>
        <CModalBody>
          <div className="import-steps"><span className="step-item active">1. Tải lên tệp</span><span className="step-item text-muted"> &gt; 2. Kiểm tra dữ liệu</span></div>
          <div className="upload-zone" onClick={!importFile ? triggerFileSelect : undefined}>
            {importFile ? (<div><CIcon icon={cilFile} size="3xl" className="text-success mb-3" /><div className="fw-bold text-success">{importFile.name}</div><CButton color="link" className="text-danger mt-2 text-decoration-none" onClick={(e) => { e.stopPropagation(); setImportFile(null); }}>Xóa file</CButton></div>) : (<><div className="upload-text">Kéo thả tệp vào đây</div><input type="file" ref={fileInputRef} onChange={handleFileSelect} accept=".xls,.xlsx" style={{ display: 'none' }} /><CButton variant="outline" className="btn-upload-select" onClick={(e) => { e.stopPropagation(); triggerFileSelect(); }}><CIcon icon={cilCloudUpload} className="me-2" />Chọn tệp</CButton><div className="upload-hint">File .xls, .xlsx</div></>)}
          </div>
          <div className="text-center"><a href="#" style={{ color: '#ea580c', textDecoration: 'none', fontWeight: 600 }}>Tải xuống tệp mẫu</a></div>
        </CModalBody>
        <CModalFooter className="bg-light border-top-0">
            <CButton color="white" className="border" onClick={() => setVisibleImportModal(false)}>Hủy</CButton>
            <CButton className="btn-orange text-white" onClick={handleConfirmImport}>Tiếp theo</CButton>
        </CModalFooter>
      </CModal>
    </>
  )
}

export default OvertimeRequestPage;