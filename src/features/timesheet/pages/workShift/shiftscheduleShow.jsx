
import {
  cilCloudUpload,
  cilFile,
  cilFilter,
  cilPencil,
  cilPlus,
  cilSearch,
  cilSettings,
  cilTrash,
  cilX,
  cilWarning // Import thêm icon cảnh báo cho Modal xóa
} from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import {
  CButton,
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
import { shiftscheduleApi } from '../../api/shiftscheduleApi'; 

// =====================================================================
// 0. CẤU HÌNH CỘT
// =====================================================================
const DEFAULT_COLUMNS = [
  { key: 'shiftId', label: 'ID', visible: true, width: 60, align: 'center' },
  { key: 'code', label: 'Mã ca', visible: true, width: 100 },
  { key: 'name', label: 'Tên ca', visible: true, width: 180 },
  { key: 'startTime', label: 'Bắt đầu', visible: true, width: 90, align: 'center' },
  { key: 'endTime', label: 'Kết thúc', visible: true, width: 90, align: 'center' },
  { key: 'expectedWorkMinutes', label: 'Phút làm', visible: true, width: 90, align: 'center' },
  { key: 'breakMinutes', label: 'Nghỉ', visible: true, width: 70, align: 'center' },
  { key: 'graceMinutes', label: 'Cho phép trễ', visible: true, width: 70, align: 'center' },
  { key: 'overtimeLabel', label: 'Tính OT', visible: true, width: 80, align: 'center' },
  { key: 'payType', label: 'Loại lương', visible: true, width: 100, align: 'center' },
  { key: 'hourlyRate', label: 'Lương/Giờ', visible: true, width: 100, align: 'right' },
  { key: 'overtimeRate', label: 'Hệ số OT', visible: true, width: 90, align: 'center' },
  { key: 'actions', label: '', visible: true, width: 80 }
];

// =====================================================================
// 1. CSS STYLES
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
    
    .row-actions { display: flex; gap: 8px; justify-content: center; opacity: 0; visibility: hidden; transform: translateY(5px); transition: all 0.2s ease-in-out; }
    tbody tr:hover .row-actions { opacity: 1; visibility: visible; transform: translateY(0); }
    .btn-action { width: 32px; height: 32px; border-radius: 50%; background: transparent; border: none; display: flex; align-items: center; justify-content: center; cursor: pointer; color: #768192; transition: all 0.2s; }
    .btn-action:hover { background-color: #e2e8f0; transform: scale(1.1); }
    .btn-action.edit:hover { color: #f59e0b; background-color: #fef3c7; }
    .btn-action.delete:hover { color: #ef4444; background-color: #fee2e2; }
    
    .sticky-col-last { position: sticky; right: 0; z-index: 12; background: #fff; box-shadow: -2px 0 5px rgba(0,0,0,0.05); }
    .table-header-cell.sticky-col-last { z-index: 15; }
    `}
  </style>
)

// =====================================================================
// 2. COMPONENTS CON
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

const AdvancedFilterPopup = ({ visible, onClose, onApply, columns }) => {
  const [checkedColumns, setCheckedColumns] = useState({});
  const [columnSearchValues, setColumnSearchValues] = useState({});
  if (!visible) return null;
  const handleCheckColumn = (key) => setCheckedColumns(p => ({ ...p, [key]: !p[key] }));
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
  const handleClear = () => { setCheckedColumns({}); setColumnSearchValues({}); onApply({}); onClose(); };
  return (
    <div className="popup-container filter-popup">
      <div className="popup-header"><h5 className="popup-title">Bộ lọc nâng cao</h5><CButton color="link" onClick={onClose}><CIcon icon={cilX} /></CButton></div>
      <div className="popup-body">
        {columns.filter(c => c.key !== 'checkbox' && c.visible).map(col => (
          <div key={col.key} className="mb-2">
            <CFormCheck label={col.label} checked={!!checkedColumns[col.key]} onChange={() => handleCheckColumn(col.key)} />
            {checkedColumns[col.key] && (
              <CFormInput size="sm" className="mt-1 ms-4" placeholder={`Lọc ${col.label}...`} value={columnSearchValues[col.key] || ''} onChange={e => setColumnSearchValues(p => ({ ...p, [col.key]: e.target.value }))} />
            )}
          </div>
        ))}
      </div>
      <div className="popup-footer"><CButton color="light" size="sm" onClick={handleClear}>Bỏ lọc</CButton><CButton size="sm" className="btn-orange text-white" onClick={handleApply}>Áp dụng</CButton></div>
    </div>
  );
};

const ColumnSettingsPopup = ({ visible, onClose, columns, onUpdateColumns, onResetDefault }) => {
  const [tempColumns, setTempColumns] = useState(columns);
  useEffect(() => { if (visible) setTempColumns(columns); }, [visible, columns]);
  if (!visible) return null;
  const toggleCol = (key) => setTempColumns(prev => prev.map(c => c.key === key ? { ...c, visible: !c.visible } : c));
  const handleSave = () => { onUpdateColumns(tempColumns); onClose(); };
  return (
    <div className="popup-container settings-popup">
      <div className="popup-header"><h5 className="popup-title">Tùy chỉnh cột</h5><CButton color="link" onClick={onClose}><CIcon icon={cilX} /></CButton></div>
      <div className="popup-body">
        {tempColumns.map(col => col.key !== 'checkbox' && (
          <div key={col.key} className="col-setting-item"><CFormCheck label={col.label} checked={col.visible} onChange={() => toggleCol(col.key)} /></div>
        ))}
      </div>
      <div className="popup-footer"><CButton color="light" size="sm" onClick={() => { onResetDefault(); onClose(); }}>Mặc định</CButton><CButton size="sm" className="btn-orange text-white" onClick={handleSave}>Lưu</CButton></div>
    </div>
  )
}

const FilterBar = ({ filters, onFilterChange, onExportExcel, onApplyAdvancedFilter, columns, onUpdateColumns, onResetDefaultColumns }) => {
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
        <CTooltip content="Xuất Excel">
          <CButton variant="outline" color="dark" size="sm" className="btn-icon-only" onClick={onExportExcel}>
            Xuất Excel
          </CButton>
        </CTooltip>
        <div style={{ position: 'relative', display: 'inline-block' }}>
          <CTooltip content="Bộ lọc">
            <CButton variant="outline" color="dark" size="sm" className="btn-icon-only" onClick={() => { setShowFilterPopup(!showFilterPopup); setShowSettingsPopup(false); }} active={showFilterPopup}><CIcon icon={cilFilter} /></CButton>
          </CTooltip>
          <AdvancedFilterPopup visible={showFilterPopup} onClose={() => setShowFilterPopup(false)} onApply={onApplyAdvancedFilter} columns={columns} />
        </div>
        <div style={{ position: 'relative', display: 'inline-block' }}>
          <CTooltip content="Cài đặt cột">
            <CButton variant="outline" color="dark" size="sm" className="btn-icon-only" onClick={() => { setShowSettingsPopup(!showSettingsPopup); setShowFilterPopup(false); }} active={showSettingsPopup}><CIcon icon={cilSettings} /></CButton>
          </CTooltip>
          <ColumnSettingsPopup visible={showSettingsPopup} onClose={() => setShowSettingsPopup(false)} columns={columns} onUpdateColumns={onUpdateColumns} onResetDefault={onResetDefaultColumns} />
        </div>
      </div>
    </div>
  )
}

// Update: onDelete nhận vào toàn bộ item để lấy mã ca hiển thị lên modal
const PageTable = ({ data, columns, onDelete, onEdit }) => {
  const visibleColumns = columns.filter(col => col.visible);
  return (
    <div className="table-wrapper-fullscreen">
      <CTable hover className="mb-0" align="middle" style={{ minWidth: '1400px' }}>
        <CTableHead>
          <CTableRow>
            {visibleColumns.map((col) => {
              let className = "table-header-cell";
              if (col.align) className += ` text-${col.align}`;
              if (col.key === 'actions') className += " sticky-col-last";
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

                  // CỘT ACTIONS
                  if (col.key === 'actions') {
                    return (
                      <CTableDataCell key={`${item.id}-${col.key}`} className="sticky-col-last">
                        <div className="row-actions">
                          <CTooltip content="Chỉnh sửa">
                            <button className="btn-action edit" onClick={() => onEdit(item)}><CIcon icon={cilPencil} /></button>
                          </CTooltip>
                          <CTooltip content="Xóa">
                            {/* Chuyền cả item vào onDelete để lấy mã ca hiển thị */}
                            <button className="btn-action delete" onClick={() => onDelete(item)}><CIcon icon={cilTrash} /></button>
                          </CTooltip>
                        </div>
                      </CTableDataCell>
                    );
                  }

                  // CỘT CHECKBOX
                  if (col.type === 'checkbox') {
                    return (<CTableDataCell key={`${item.id}-${col.key}`} className="text-center"><CFormCheck /></CTableDataCell>);
                  }

                  // CỘT DỮ LIỆU
                  const content = item[col.key];
                  return (
                    <CTableDataCell key={`${item.id}-${col.key}`} className={className} style={{ fontSize: '0.9rem', color: '#333' }}>
                      {content !== undefined && content !== null ? content : '-'}
                    </CTableDataCell>
                  )
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
// 5. MAIN
// =====================================================================
const ShiftScheduleShow = () => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [columns, setColumns] = useState(DEFAULT_COLUMNS)
  const [filters, setFilters] = useState({ search: '', columnFilters: {} })
  
  // States cho Import
  const [visibleImportModal, setVisibleImportModal] = useState(false)
  const [importFile, setImportFile] = useState(null)
  
  // States cho Delete Modal
  const [visibleDeleteModal, setVisibleDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  const fileInputRef = useRef(null)
  const navigate = useNavigate();

  // --- FETCH DATA ---
  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await shiftscheduleApi.getAll();
      const rawData = response.data?.data || response.data || []; 

      if (Array.isArray(rawData)) {
        const mappedData = rawData.map(item => ({
            ...item, 
            id: item.shiftId, 
            overtimeLabel: item.overtimeEligible ? "Có" : "Không",
            payType: item.payType === 'hourly' ? 'Theo giờ' : (item.payType === 'fixed' ? 'Cố định' : item.payType)
        }));
        setData(mappedData);
      } else {
        setData([]);
      }
    } catch (error) {
      console.error("Lỗi lấy dữ liệu:", error);
      setData([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  // Import Logic
  const handleFileSelect = (e) => { const file = e.target.files[0]; if (file) setImportFile(file); }
  const triggerFileSelect = () => fileInputRef.current.click();
  const handleConfirmImport = () => { if (!importFile) return; setVisibleImportModal(false); alert("Import thành công!"); }

  // --- DELETE LOGIC (MỚI) ---
  const handleOpenDeleteModal = (item) => {
    setItemToDelete(item);
    setVisibleDeleteModal(true);
  }

  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;
    try {
        await shiftscheduleApi.delete(itemToDelete.id); // Dùng ID để xóa
        alert("Xóa thành công!");
        fetchData(); // Load lại dữ liệu
    } catch (e) {
        console.error(e);
        alert("Xóa thất bại!");
    } finally {
        setVisibleDeleteModal(false);
        setItemToDelete(null);
    }
  }

  // --- EDIT LOGIC (MỚI) ---
  const handleEdit = (item) => {
      // Điều hướng sang trang update kèm theo ID của ca làm việc
      navigate(`/timesheet/shiftscheduleShow/update/${item.id}`);
  }

  const filteredData = useMemo(() => {
    return data.filter(item => {
      const search = filters.search.toLowerCase();
      const matchSearch = !search || Object.values(item).some(v => String(v).toLowerCase().includes(search));
      const columnFilters = filters.columnFilters || {};
      const matchColumns = Object.keys(columnFilters).every(key => {
        const filterVal = columnFilters[key].toLowerCase();
        const itemVal = String(item[key] || '').toLowerCase();
        return itemVal.includes(filterVal);
      });
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
  const handleAddNew = () => { navigate('/timesheet/shiftscheduleShow/add'); }

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
        <PageTable 
            data={filteredData} 
            columns={columns} 
            onDelete={handleOpenDeleteModal} // Truyền hàm mở Modal
            onEdit={handleEdit} // Truyền hàm Edit
        />
      </div>

      {/* --- IMPORT MODAL --- */}
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

      {/* --- DELETE CONFIRMATION MODAL --- */}
      <CModal alignment="center" visible={visibleDeleteModal} onClose={() => setVisibleDeleteModal(false)}>
        <CModalHeader closeButton>
          <CModalTitle className="fw-bold text-danger">
             <CIcon icon={cilWarning} className="me-2" />
             Xác nhận xóa
          </CModalTitle>
        </CModalHeader>
        <CModalBody>
          {itemToDelete && (
             <span>
                Bạn có chắc chắn muốn xóa ca có mã <strong>{itemToDelete.code}</strong> không? 
                <br/>
                <small className="text-muted">Hành động này không thể hoàn tác.</small>
             </span>
          )}
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setVisibleDeleteModal(false)}>
            Hủy bỏ
          </CButton>
          <CButton color="danger" className="text-white" onClick={handleConfirmDelete}>
            Đồng ý xóa
          </CButton>
        </CModalFooter>
      </CModal>
    </>
  )
}

export default ShiftScheduleShow