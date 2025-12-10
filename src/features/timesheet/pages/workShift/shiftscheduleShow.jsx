
import {
  cilCloudUpload,
  cilFile,
  cilFilter,
  cilPlus,
  cilSearch,
  cilSettings,
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
import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// =====================================================================
// 0. CẤU HÌNH CỘT
// =====================================================================
const DEFAULT_COLUMNS = [
  { key: 'checkbox', label: '', visible: true, width: 50, type: 'checkbox' },
  { key: 'shift_code', label: 'Mã ca', visible: true, width: 120 },
  { key: 'shift_name', label: 'Tên ca', visible: true, width: 220 },
  { key: 'applied_unit', label: 'Đơn vị áp dụng', visible: true, width: 200 },
  { key: 'start_time', label: 'Giờ bắt đầu ca', visible: true, width: 150, align: 'center' },
  { key: 'check_in_from', label: 'Chấm vào đầu ca từ', visible: true, width: 180, align: 'center' },
  { key: 'check_in_to', label: 'Chấm vào đầu ca đến', visible: true, width: 180, align: 'center' },
  { key: 'end_time', label: 'Giờ kết thúc ca', visible: true, width: 150, align: 'center' },
  { key: 'check_out_from', label: 'Chấm ra cuối ca từ', visible: true, width: 180, align: 'center' },
  { key: 'check_out_to', label: 'Chấm ra cuối ca đến', visible: true, width: 180, align: 'center' },
];

// =====================================================================
// 1. CSS TÙY CHỈNH
// =====================================================================
const ShiftListStyles = () => (
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
    .import-steps { display: flex; gap: 10px; margin-bottom: 20px; font-size: 0.9rem; }
    .step-item { color: #8a93a2; font-weight: 500; }
    .step-item.active { color: #ea580c; font-weight: 700; }
    .upload-zone { border: 2px dashed #d8dbe0; border-radius: 8px; padding: 40px 20px; text-align: center; background-color: #f9fafb; margin-bottom: 20px; transition: all 0.3s ease; cursor: pointer; }
    .upload-zone:hover { border-color: #ea580c; background-color: #fff7ed; }
    .upload-text { font-weight: 600; margin-bottom: 10px; font-size: 1.1rem; }
    .upload-hint { color: #8a93a2; font-size: 0.85rem; margin-top: 10px; }
    .btn-upload-select { color: #ea580c; border-color: #ea580c; font-weight: 600; }
    .btn-upload-select:hover { background-color: #ea580c; color: white; }
    .popup-container { position: absolute; top: 100%; right: 0; width: 320px; background: white; border: 1px solid #d8dbe0; box-shadow: 0 4px 12px rgba(0,0,0,0.15); border-radius: 4px; z-index: 1000; margin-top: 5px; display: flex; flex-direction: column; max-height: 500px; }
    .popup-header { display: flex; justify-content: space-between; align-items: center; padding: 12px 16px; border-bottom: 1px solid #ebedef; }
    .popup-title { font-weight: 700; font-size: 1rem; color: #3c4b64; margin: 0; }
    .popup-body { padding: 12px 16px; overflow-y: auto; flex-grow: 1; }
    .popup-footer { padding: 12px 16px; border-top: 1px solid #ebedef; display: flex; justify-content: space-between; background-color: #f9fafb; }
    .col-setting-item { display: flex; align-items: center; margin-bottom: 10px; justify-content: space-between; }
    .table-wrapper-fullscreen { flex-grow: 1; background-color: #fff; border-radius: 4px; box-shadow: 0 1px 2px rgba(0,0,0,0.05); overflow: auto; position: relative; }
    .table-header-cell { background-color: #f0f2f5; font-weight: 700; font-size: 0.8rem; color: #3c4b64; white-space: nowrap; vertical-align: middle; position: sticky; top: 0; z-index: 10; box-shadow: 0 1px 0 #d8dbe0; }
    tbody tr:hover { background-color: #ececec; }
    `}
  </style>
)

// =====================================================================
// 2. COMPONENTS
// =====================================================================
const PageHeader = ({ onImportClick, onAddClick }) => (
  <div className="page-header">
    <div className="page-title">Ca làm việc</div>
    <div className="header-actions">
      <CButton color="secondary" variant="outline" className="fw-semibold bg-white text-dark border-secondary" onClick={onImportClick}><CIcon icon={cilCloudUpload} className="me-2" />Nhập khẩu</CButton>
      <CButton className="btn-orange" onClick={onAddClick}><CIcon icon={cilPlus} className="me-1" /> Thêm</CButton>
    </div>
  </div>
)

// --- COMPONENT BỘ LỌC NÂNG CAO (ĐÃ CẬP NHẬT) ---
const AdvancedFilterPopup = ({ visible, onClose, onApply, columns }) => {
    const [checkedColumns, setCheckedColumns] = useState({});
    const [columnSearchValues, setColumnSearchValues] = useState({});

    if (!visible) return null;

    const handleCheckColumn = (key) => setCheckedColumns(p => ({ ...p, [key]: !p[key] }));

    // Xử lý nút Áp dụng: Chỉ lấy những cột ĐƯỢC CHECK và CÓ GIÁ TRỊ
    const handleApply = () => { 
        const activeFilters = {};
        Object.keys(checkedColumns).forEach(key => {
            if (checkedColumns[key] && columnSearchValues[key]) {
                activeFilters[key] = columnSearchValues[key];
            }
        });
        onApply(activeFilters); 
        onClose(); 
    };

    // Xử lý nút Bỏ lọc: Reset toàn bộ
    const handleClear = () => {
        setCheckedColumns({});
        setColumnSearchValues({});
        onApply({}); // Gửi object rỗng để reset bảng
        onClose();
    };

    return (
        <div className="popup-container filter-popup">
            <div className="popup-header">
                <h5 className="popup-title">Bộ lọc nâng cao</h5>
                <CButton color="link" onClick={onClose}><CIcon icon={cilX} /></CButton>
            </div>
            <div className="popup-body">
                {columns.filter(c => c.key !== 'checkbox' && c.visible).map(col => (
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
            {/* FOOTER CÓ 2 NÚT: BỎ LỌC & ÁP DỤNG */}
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
  const toggleCol = (key) => setTempColumns(prev => prev.map(c => c.key === key ? { ...c, visible: !c.visible } : c));
  const handleSave = () => { onUpdateColumns(tempColumns); onClose(); };
  return (<div className="popup-container settings-popup"><div className="popup-header"><h5 className="popup-title">Tùy chỉnh cột</h5><CButton color="link" onClick={onClose}><CIcon icon={cilX} /></CButton></div><div className="popup-body">{tempColumns.map(col => col.key !== 'checkbox' && (<div key={col.key} className="col-setting-item"><CFormCheck label={col.label} checked={col.visible} onChange={() => toggleCol(col.key)} /></div>))}</div><div className="popup-footer"><CButton color="light" size="sm" onClick={() => { onResetDefault(); onClose(); }}>Mặc định</CButton><CButton size="sm" className="btn-orange text-white" onClick={handleSave}>Lưu</CButton></div></div>)
}

const FilterBar = ({ filters, onFilterChange, onExportExcel, onApplyAdvancedFilter, columns, onUpdateColumns, onResetDefaultColumns }) => {
  const [showFilterPopup, setShowFilterPopup] = useState(false);
  const [showSettingsPopup, setShowSettingsPopup] = useState(false);
  return (
    <div className="filter-bar">
      <div className="filter-left"><CInputGroup className="search-bar"><CInputGroupText className="bg-white border-end-0 text-secondary"><CIcon icon={cilSearch} size="sm" /></CInputGroupText><CFormInput className="border-start-0 ps-0" placeholder="Tìm kiếm chung" value={filters.search} onChange={(e) => onFilterChange((prev) => ({ ...prev, search: e.target.value }))} size="sm" /></CInputGroup></div>
      <div className="filter-right" style={{ position: 'relative' }}>
        <span className="text-muted fs-6" style={{ fontSize: '0.9rem' }}>Trạng thái</span>
        <CDropdown><CDropdownToggle color="transparent" className="fw-bold fs-6" size="sm">Tất cả</CDropdownToggle><CDropdownMenu><CDropdownItem>Tất cả</CDropdownItem><CDropdownItem>Đang áp dụng</CDropdownItem><CDropdownItem>Ngừng áp dụng</CDropdownItem></CDropdownMenu></CDropdown>
        <div className="vr mx-2"></div>
        <CDropdown><CDropdownToggle variant="outline" color="secondary" size="sm" className="bg-white text-dark border-secondary">Tất cả đơn vị</CDropdownToggle><CDropdownMenu><CDropdownItem>Tất cả đơn vị</CDropdownItem><CDropdownItem>Văn phòng Hà Nội</CDropdownItem><CDropdownItem>Nhà máy Bắc Ninh</CDropdownItem></CDropdownMenu></CDropdown>

        <CTooltip content="Xuất Excel">
          <CButton variant="outline" color="dark" size="sm" className="btn-icon-only" onClick={onExportExcel}>
            Xuất Excel
          </CButton>
        </CTooltip>

        <div style={{ position: 'relative', display: 'inline-block' }}><CTooltip content="Bộ lọc"><CButton variant="outline" color="dark" size="sm" className="btn-icon-only" onClick={() => { setShowFilterPopup(!showFilterPopup); setShowSettingsPopup(false); }} active={showFilterPopup}><CIcon icon={cilFilter} /></CButton></CTooltip><AdvancedFilterPopup visible={showFilterPopup} onClose={() => setShowFilterPopup(false)} onApply={onApplyAdvancedFilter} columns={columns} /></div>
        <div style={{ position: 'relative', display: 'inline-block' }}><CTooltip content="Cài đặt cột"><CButton variant="outline" color="dark" size="sm" className="btn-icon-only" onClick={() => { setShowSettingsPopup(!showSettingsPopup); setShowFilterPopup(false); }} active={showSettingsPopup}><CIcon icon={cilSettings} /></CButton></CTooltip><ColumnSettingsPopup visible={showSettingsPopup} onClose={() => setShowSettingsPopup(false)} columns={columns} onUpdateColumns={onUpdateColumns} onResetDefault={onResetDefaultColumns} /></div>
      </div>
    </div>
  )
}

const PageTable = ({ data, columns }) => {
  const visibleColumns = columns.filter(col => col.visible);
  return (
    <div className="table-wrapper-fullscreen">
        <CTable hover className="mb-0" align="middle" style={{ minWidth: '1600px' }}>
            <CTableHead>
            <CTableRow>
                {visibleColumns.map((col) => {
                    let className = "table-header-cell";
                    if (col.align) className += ` text-${col.align}`;
                    return (<CTableHeaderCell key={col.key} className={className} style={{ width: col.width }}>{col.type === 'checkbox' ? <div className="text-center"><CFormCheck /></div> : col.label}</CTableHeaderCell>);
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
                        let content = item[col.key];
                        if (col.type === 'checkbox') content = <div className="text-center"><CFormCheck /></div>;
                        return <CTableDataCell key={`${item.id}-${col.key}`} className={className} style={{ fontSize: '0.9rem', color: '#333' }}>{content}</CTableDataCell>;
                    })}
                </CTableRow>
                ))
            ) : (<CTableRow><CTableDataCell colSpan={visibleColumns.length} className="text-center py-4 text-muted">Không có dữ liệu</CTableDataCell></CTableRow>)}
            </CTableBody>
        </CTable>
    </div>
  )
}

const MOCK_DATA = [
  { id: 1, shift_code: 'abc123', shift_name: 'ABC', applied_unit: 'Tất cả đơn vị', start_time: '08:00', check_in_from: '07:00', check_in_to: '08:00', end_time: '08:30', check_out_from: '08:30', check_out_to: '09:00' },
  { id: 2, shift_code: 'HC', shift_name: 'Ca hành chính', applied_unit: 'Tất cả đơn vị', start_time: '08:00', check_in_from: '07:00', check_in_to: '09:00', end_time: '17:30', check_out_from: '16:30', check_out_to: '18:30' },
  { id: 3, shift_code: 'TC1', shift_name: 'tăng ca', applied_unit: 'Tất cả đơn vị', start_time: '08:00', check_in_from: '07:00', check_in_to: '09:00', end_time: '17:30', check_out_from: '16:30', check_out_to: '18:30' },
]

// =====================================================================
// 5. MAIN
// =====================================================================
const ShiftScheduleShow = () => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [columns, setColumns] = useState(DEFAULT_COLUMNS)
  const [filters, setFilters] = useState({ search: '', columnFilters: {} })
  const [visibleImportModal, setVisibleImportModal] = useState(false)
  const [importFile, setImportFile] = useState(null)
  const fileInputRef = useRef(null)
  const navigate = useNavigate();

  useEffect(() => { setTimeout(() => { setData(MOCK_DATA); setLoading(false); }, 300); }, []);
  const handleFileSelect = (e) => { const file = e.target.files[0]; if (file) setImportFile(file); }
  const triggerFileSelect = () => fileInputRef.current.click();
  const handleConfirmImport = () => { if (!importFile) return; setVisibleImportModal(false); alert("Import thành công!"); }

  // --- LOGIC LỌC DỮ LIỆU ĐƯỢC CẬP NHẬT ---
  const filteredData = useMemo(() => {
    return data.filter(item => {
        // 1. Tìm kiếm chung (Search Box)
        const search = filters.search.toLowerCase();
        const matchSearch = !search || Object.values(item).some(v => String(v).toLowerCase().includes(search));

        // 2. Tìm kiếm nâng cao (Filter Popup)
        // Kiểm tra tất cả các cột đang được lọc
        const columnFilters = filters.columnFilters || {};
        const matchColumns = Object.keys(columnFilters).every(key => {
            const filterVal = columnFilters[key].toLowerCase();
            const itemVal = String(item[key] || '').toLowerCase();
            return itemVal.includes(filterVal);
        });

        // Kết hợp cả 2 điều kiện
        return matchSearch && matchColumns;
    });
  }, [data, filters]);

  const handleExportExcel = () => {
    const headers = columns.filter(c => c.key !== 'checkbox' && c.visible).map(c => c.label);
    const csvRows = [headers.join(',')];
    filteredData.forEach(item => {
      const rowData = columns
        .filter(c => c.key !== 'checkbox' && c.visible)
        .map(c => {
          const val = item[c.key] || '';
          return `"${val}"`;
        });
      csvRows.push(rowData.join(','));
    });
    const csvString = csvRows.join('\n');
    const blob = new Blob(['\uFEFF' + csvString], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'danh_sach_ca_lam_viec.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleAddNew = () => {
    navigate('/timesheet/shiftscheduleShow/add');
  }

  if (loading) return <div className="d-flex justify-content-center p-5"><CSpinner color="warning" /></div>

  return (
    <>
      <ShiftListStyles />
      <div className="page-container">
        <PageHeader
          onImportClick={() => { setVisibleImportModal(true); setImportFile(null); }}
          onAddClick={handleAddNew}
        />
        <FilterBar
          filters={filters}
          onFilterChange={setFilters}
          onExportExcel={handleExportExcel}
          onApplyAdvancedFilter={(cf) => setFilters(p => ({ ...p, columnFilters: cf }))}
          columns={columns} onUpdateColumns={setColumns} onResetDefaultColumns={() => setColumns(DEFAULT_COLUMNS)}
        />
        <PageTable data={filteredData} columns={columns} />
      </div>

      <CModal alignment="center" size="lg" visible={visibleImportModal} onClose={() => setVisibleImportModal(false)}>
        <CModalHeader><CModalTitle className="fw-bold fs-5">Nhập khẩu ca làm việc</CModalTitle></CModalHeader>
        <CModalBody>
          <div className="import-steps"><span className="step-item active">1. Tải lên tệp</span><span className="step-item text-muted"> &gt; 2. Kiểm tra dữ liệu</span></div>
          <div className="upload-zone" onClick={!importFile ? triggerFileSelect : undefined}>
            {importFile ? (<div><CIcon icon={cilFile} size="3xl" className="text-success mb-3" /><div className="fw-bold text-success">{importFile.name}</div><CButton color="link" className="text-danger mt-2 text-decoration-none" onClick={(e) => { e.stopPropagation(); setImportFile(null); }}>Xóa file</CButton></div>) : (<><div className="upload-text">Kéo thả tệp vào đây</div><input type="file" ref={fileInputRef} onChange={handleFileSelect} accept=".xls,.xlsx" style={{ display: 'none' }} /><CButton variant="outline" className="btn-upload-select" onClick={(e) => { e.stopPropagation(); triggerFileSelect(); }}><CIcon icon={cilCloudUpload} className="me-2" />Chọn tệp</CButton><div className="upload-hint">File .xls, .xlsx</div></>)}
          </div>
          <div className="text-center"><a href="#" className="link-orange" style={{ color: '#ea580c', textDecoration: 'none', fontWeight: 600 }}>Tải xuống tệp mẫu</a></div>
        </CModalBody>
        <CModalFooter className="bg-light border-top-0"><CButton color="white" className="border" onClick={() => setVisibleImportModal(false)}>Hủy</CButton><CButton className="btn-orange text-white" onClick={handleConfirmImport}>Tiếp theo</CButton></CModalFooter>
      </CModal>
    </>
  )
}

export default ShiftScheduleShow
