
import {
  CButton,
  CCard,
  CCardBody,
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
  CSpinner,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CTooltip,
  CForm
} from '@coreui/react'
import { useCallback, useEffect, useRef, useState } from 'react'

import {
  cilArrowThickFromBottom,
  cilCalendar,
  cilChevronLeft,
  cilChevronRight,
  cilCloudUpload,
  cilFile,
  cilFilter,
  cilInfo,
  cilPaperclip,
  cilPencil,
  cilReload,
  cilSearch,
  cilSettings,
  cilTrash,
  cilWarning,
  cilX
} from '@coreui/icons'
import CIcon from '@coreui/icons-react'
// Đảm bảo đường dẫn import api đúng với project của bạn
import { timesheetApi } from '../../api/timeKeeping'; 

// =====================================================================
// 0. UTILS & CONFIG
// =====================================================================

// Cấu hình cột theo đúng dữ liệu JSON trả về từ API
const DEFAULT_COLUMNS = [
  { key: 'employeeCode', label: 'Mã nhân viên', visible: true, width: '120px' },
  { key: 'employeeName', label: 'Họ và tên', visible: true, width: '200px' },
  { key: 'departmentName', label: 'Phòng ban', visible: true, width: '200px' },
  { key: 'source', label: 'Nguồn', visible: true, width: '100px' },
  { key: 'time', label: 'Thời gian chấm công', visible: true, width: '180px' },
  { key: 'actions', label: '', visible: true, width: '80px', fixed: 'right' }
]

// Format hiển thị ngày trên UI (Header toolbar)
const formatDisplayDate = (d) => {
    if (!d) return '';
    const year = d.getFullYear();
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const day = d.getDate().toString().padStart(2, '0');
    return `${day}/${month}/${year}`;
}

// Format ngày để gửi lên API (YYYY-MM-DD)
const formatInputDate = (d) => {
    if (!d) return '';
    const year = d.getFullYear();
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const day = d.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// Format hiển thị datetime từ chuỗi ISO (2025-12-14T20:10:19)
const formatDateTimeDisplay = (isoString) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    // Format: DD/MM/YYYY HH:mm:ss
    return date.toLocaleString('vi-VN', {
        year: 'numeric', month: '2-digit', day: '2-digit',
        hour: '2-digit', minute: '2-digit', second: '2-digit'
    });
}

// =====================================================================
// 1. CSS STYLES
// =====================================================================
const RawTimesheetStyles = () => (
  <style>
    {`
    .page-container {
      padding: 1rem;
      background-color: #f3f4f7;
      height: 100vh;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }

    /* === Header === */
    .page-header-wrapper {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1rem;
        flex-shrink: 0;
        flex-wrap: wrap;
        gap: 10px;
    }
    .header-left-group {
        display: flex;
        align-items: center;
        gap: 15px;
        flex-wrap: wrap;
    }
    .page-title {
        font-size: 1.25rem;
        font-weight: 700;
        color: #3c4b64;
        margin: 0;
        white-space: nowrap;
    }
    .warning-text {
        font-size: 0.875rem;
        color: #b07e0c;
        display: flex;
        align-items: center;
        margin: 0;
        white-space: nowrap;
        background-color: #fff7ed;
        padding: 4px 10px;
        border-radius: 4px;
        border: 1px solid #ffedd5;
    }

    /* === Card Full Height === */
    .card-full-height { flex-grow: 1; display: flex; flex-direction: column; overflow: hidden; border: none; box-shadow: 0 1px 2px rgba(0,0,0,0.05); }

    /* === Toolbar === */
    .toolbar-container {
        background: #fff;
        padding: 10px 16px;
        border-bottom: 1px solid #d8dbe0;
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 10px;
        flex-shrink: 0;
        overflow: visible;
        z-index: 20;
        flex-wrap: wrap;
    }
    .toolbar-left {
        flex-grow: 1;
        min-width: 200px;
        max-width: 300px;
    }
    .toolbar-right {
        display: flex;
        align-items: center;
        gap: 8px;
        position: relative;
        flex-shrink: 0;
        margin-left: auto;
    }

    /* === Date Control === */
    .date-control-group { display: flex; align-items: center; background: #fff; border: 1px solid #ced4da; border-radius: 4px; overflow: hidden; height: 38px; }
    .date-text-display { padding: 0 12px; font-size: 0.875rem; font-weight: 600; color: #3c4b64; min-width: 150px; text-align: center; line-height: 38px; border-right: 1px solid #ced4da; background-color: #fff; }
    .date-calendar-btn { width: 40px; height: 100%; display: flex; align-items: center; justify-content: center; cursor: pointer; background-color: #f8f9fa; transition: all 0.2s; color: #636f83; }
    .date-calendar-btn:hover { background-color: #ea580c; color: #fff; }

    /* === Buttons === */
    .btn-icon-group {
        display: flex;
        gap: 6px;
    }
    .btn-tool {
        color: #4f5d73;
        border-color: #ced4da;
        height: 38px;
        width: 38px;
        padding: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: white;
    }
    .btn-tool:hover, .btn-tool.active { background-color: #ebedef; border-color: #b1b7c1; color: #3c4b64; }

    /* === ACTION BUTTONS CSS === */
    .row-actions {
        display: flex; gap: 8px; justify-content: center;
        opacity: 0; visibility: hidden;
        transform: translateY(5px);
        transition: all 0.2s ease-in-out;
    }
    tbody tr:hover .row-actions {
        opacity: 1; visibility: visible;
        transform: translateY(0);
    }
    .btn-action {
        width: 32px; height: 32px; border-radius: 50%; border: none;
        background: transparent; display: flex; align-items: center; justify-content: center;
        transition: all 0.2s; cursor: pointer; color: #768192;
    }
    .btn-action:hover { background-color: #e2e8f0; transform: scale(1.1); }
    .btn-action.edit:hover { color: #f59e0b; background-color: #fef3c7; }
    .btn-action.delete:hover { color: #ef4444; background-color: #fee2e2; }

    /* === Popup Styles === */
    .popup-wrapper { position: relative; display: inline-block; }
    .popup-container {
        position: absolute;
        top: 100%;
        right: 0;
        width: 320px;
        background: white;
        border: 1px solid #d8dbe0;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        border-radius: 4px;
        z-index: 1050;
        margin-top: 5px;
        display: flex;
        flex-direction: column;
        max-height: 450px;
    }
    .popup-header { display: flex; justify-content: space-between; align-items: center; padding: 12px 16px; border-bottom: 1px solid #ebedef; }
    .popup-title { font-weight: 700; font-size: 1rem; color: #3c4b64; margin: 0; }
    .popup-body { padding: 12px 16px; overflow-y: auto; flex-grow: 1; }
    .popup-footer { padding: 12px 16px; border-top: 1px solid #ebedef; display: flex; justify-content: space-between; background-color: #f9fafb; }
    .filter-item { margin-bottom: 8px; }
    .popup-filter-input { margin-top: 5px; margin-left: 24px; width: calc(100% - 24px); font-size: 0.875rem; }
    .btn-orange { background-color: #ea580c; border-color: #ea580c; color: white; font-weight: 600; }
    .btn-orange:hover { background-color: #c2410c; color: white; border-color: #c2410c; }

    /* === Table Wrapper === */
    .table-wrapper-fullscreen { flex-grow: 1; background-color: #fff; overflow: auto; position: relative; z-index: 1; }
    .custom-table th { background-color: #f0f2f5; font-weight: 600; font-size: 0.8rem; text-transform: uppercase; color: #3c4b64; white-space: nowrap; border-bottom: 1px solid #d8dbe0; padding: 12px 10px; position: sticky; top: 0; z-index: 10; }
    .sticky-col-right { position: sticky; right: 0; z-index: 11; background-color: #fff; box-shadow: -2px 0 5px rgba(0,0,0,0.05); }
    th.sticky-col-right { z-index: 20; background-color: #f0f2f5; }

    /* === Empty State === */
    .empty-state-container { height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; color: #9da5b1; min-height: 300px; }
    .empty-icon-wrapper { background-color: #fef0e6; width: 64px; height: 64px; border-radius: 8px; display: flex; align-items: center; justify-content: center; margin-bottom: 16px; color: #f9b115; position: relative; }
    .empty-text { font-size: 0.9rem; color: #ced2d8; }

    /* === Import Modal === */
    .import-steps { display: flex; gap: 10px; margin-bottom: 20px; font-size: 0.9rem; }
    .step-item { color: #8a93a2; font-weight: 500; }
    .step-item.active { color: #ea580c; font-weight: 700; }
    .upload-zone { border: 2px dashed #d8dbe0; border-radius: 8px; padding: 40px 20px; text-align: center; background-color: #f9fafb; margin-bottom: 20px; transition: all 0.3s ease; cursor: pointer; }
    .upload-zone:hover { border-color: #ea580c; background-color: #fff7ed; }
    .upload-text { font-weight: 600; margin-bottom: 10px; font-size: 1.1rem; }
    .upload-hint { color: #8a93a2; font-size: 0.85rem; margin-top: 10px; }
    .btn-upload-select { color: #ea580c; border-color: #ea580c; font-weight: 600; }
    .btn-upload-select:hover { background-color: #ea580c; color: white; }
    .link-orange { color: #ea580c; text-decoration: none; font-weight: 600; }
    .link-orange:hover { text-decoration: underline; }
    `}
  </style>
)

// =====================================================================
// 2. SUB-COMPONENTS
// =====================================================================
const AdvancedFilterPopup = ({ visible, onClose, columns, filterValues, onApply, onClear }) => {
    const [tempValues, setTempValues] = useState(filterValues);
    useEffect(() => { if (visible) setTempValues(filterValues) }, [visible, filterValues]);
    if (!visible) return null;
    return (
      <div className="popup-container">
        <div className="popup-header"><h5 className="popup-title">Lọc theo cột</h5><CButton color="link" onClick={onClose} className="p-0 text-secondary"><CIcon icon={cilX} /></CButton></div>
        <div className="popup-body">
          {columns.map(col => col.visible && col.key !== 'actions' && (
              <div key={col.key} className="filter-item">
                <CFormCheck id={`filter-check-${col.key}`} label={col.label} checked={tempValues[col.key] !== undefined} onChange={() => setTempValues(p => { if(p[col.key]!==undefined){const n={...p};delete n[col.key];return n} return {...p,[col.key]:''} })} />
                {tempValues[col.key] !== undefined && <CFormInput size="sm" className="popup-filter-input" placeholder={`Lọc ${col.label}...`} value={tempValues[col.key]} onChange={(e) => setTempValues({...tempValues, [col.key]: e.target.value})} autoFocus />}
              </div>
          ))}
        </div>
        <div className="popup-footer"><CButton color="light" size="sm" onClick={() => { onClear(); onClose(); }}>Bỏ lọc</CButton><CButton size="sm" className="btn-orange text-white" onClick={() => { onApply(tempValues); onClose(); }}>Áp dụng</CButton></div>
      </div>
    )
}

const ColumnSettingsPopup = ({ visible, onClose, columns, onSave, onReset }) => {
    const [tempColumns, setTempColumns] = useState(columns);
    useEffect(() => { if (visible) setTempColumns(columns) }, [visible, columns]);
    if (!visible) return null;
    return (
      <div className="popup-container">
        <div className="popup-header"><h5 className="popup-title">Ẩn/Hiện cột</h5><CButton color="link" onClick={onClose} className="p-0 text-secondary"><CIcon icon={cilX} /></CButton></div>
        <div className="popup-body">{tempColumns.map(col => col.key !== 'actions' && <div key={col.key} className="filter-item"><CFormCheck id={`vis-check-${col.key}`} label={col.label} checked={col.visible} onChange={() => setTempColumns(p => p.map(c => c.key === col.key ? { ...c, visible: !c.visible } : c))} /></div>)}</div>
        <div className="popup-footer"><CButton color="light" size="sm" onClick={() => { onReset(); onClose(); }}>Mặc định</CButton><CButton size="sm" className="btn-orange text-white" onClick={() => { onSave(tempColumns); onClose(); }}>Lưu</CButton></div>
      </div>
    )
}

// =====================================================================
// 3. MAIN COMPONENT
// =====================================================================
const RawTimesheetPage = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  // Date State (Lưu ý: API getAttendanceLogs chỉ hỗ trợ 1 ngày cụ thể, nên ta dùng startDate làm ngày chính)
  const [selectedDate, setSelectedDate] = useState(new Date()); 
  
  // UI State
  const [columns, setColumns] = useState(DEFAULT_COLUMNS);
  const [searchText, setSearchText] = useState('');
  const [columnFilters, setColumnFilters] = useState({});
  const [showFilterPopup, setShowFilterPopup] = useState(false);
  const [showSettingsPopup, setShowSettingsPopup] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [importFile, setImportFile] = useState(null);
  const fileInputRef = useRef(null);

  // Pagination (Simple version for display)
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(50); // Lấy 50 dòng để hiện nhiều dữ liệu

  // --- EDIT & DELETE STATES ---
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [editForm, setEditForm] = useState({ date: '', time: '' });

  // --- FETCH DATA LOGIC (GỌI API THỰC) ---
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
        const dateStr = formatInputDate(selectedDate);
        
        // Gọi API: getAttendanceLogs(employeeId, date, page, size)
        // Ta truyền null vào employeeId để lấy tất cả
        const res = await timesheetApi.getAttendanceLogs(null, dateStr, page, pageSize);

        if (res && res.data && res.data.data && res.data.data.content) {
            let fetchedData = res.data.data.content;

            // Client-side Filtering (Nếu API chưa hỗ trợ search text/filter chi tiết)
            if (searchText) {
                const lowerSearch = searchText.toLowerCase();
                fetchedData = fetchedData.filter(item => 
                    (item.employeeName && item.employeeName.toLowerCase().includes(lowerSearch)) ||
                    (item.employeeCode && item.employeeCode.toLowerCase().includes(lowerSearch))
                );
            }

            // Client-side Column Filtering
            if (Object.keys(columnFilters).length > 0) {
                fetchedData = fetchedData.filter(item => {
                    for (const key in columnFilters) {
                        const filterVal = columnFilters[key].toLowerCase();
                        // Mapping key cho đúng với dữ liệu, ví dụ 'time' cần xử lý chuỗi
                        const itemVal = item[key] ? String(item[key]).toLowerCase() : '';
                        if (filterVal && !itemVal.includes(filterVal)) return false;
                    }
                    return true;
                });
            }

            setData(fetchedData);
        } else {
            setData([]);
        }
    } catch (err) {
        console.error("Lỗi tải dữ liệu:", err);
        setData([]);
    } finally {
        setLoading(false);
    }
  }, [selectedDate, page, pageSize, searchText, columnFilters]);

  useEffect(() => { fetchData() }, [fetchData]);

  // Handlers
  const handleToday = () => { setSelectedDate(new Date()); }
  const handleChangeDay = (days) => {
      const newDate = new Date(selectedDate); 
      newDate.setDate(newDate.getDate() + days);
      setSelectedDate(newDate);
  }
  const handleDateChange = (e) => {
      if(e.target.value) setSelectedDate(new Date(e.target.value));
  }
  
  const handleFileSelect = (e) => { const file = e.target.files[0]; if (file) setImportFile(file); }
  const triggerFileSelect = () => fileInputRef.current.click();
  const handleConfirmImport = () => { if (!importFile) return; setShowImportModal(false); alert(`Đã nhập khẩu file: ${importFile.name}`); setImportFile(null); }

  const handleExportExcel = () => {
      const visibleCols = columns.filter(c => c.visible && c.key !== 'actions');
      const headers = visibleCols.map(c => c.label);
      const keys = visibleCols.map(c => c.key);
      const csvRows = [headers.join(',')];
      data.forEach(item => {
          const rowData = keys.map(key => {
              let val = item[key];
              // Xử lý format riêng cho cột time khi xuất excel
              if (key === 'time') val = formatDateTimeDisplay(val);
              val = val !== null && val !== undefined ? String(val) : '';
              val = val.replace(/"/g, '""');
              return `"${val}"`;
          });
          csvRows.push(rowData.join(','));
      });
      const csvString = csvRows.join('\n');
      const blob = new Blob(['\uFEFF' + csvString], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `du_lieu_cham_cong_${formatInputDate(selectedDate)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
  }

  // --- ACTIONS HANDLERS ---
  const handleReload = () => {
      setSearchText('');
      setColumnFilters({});
      setColumns(DEFAULT_COLUMNS);
      fetchData();
  }

  const handleEditClick = (item) => {
    setSelectedItem(item);
    // Tách date và time từ chuỗi ISO (2025-12-14T20:10:19)
    let datePart = '';
    let timePart = '';
    if (item.time) {
        const parts = item.time.split('T');
        datePart = parts[0];
        timePart = parts[1] ? parts[1].substring(0, 5) : ''; // Lấy HH:mm
    }

    setEditForm({
        date: datePart,
        time: timePart
    });
    setEditModalVisible(true);
  }

  const handleDeleteClick = (item) => {
    setSelectedItem(item);
    setDeleteModalVisible(true);
  }

  // Giả lập lưu edit (chỉ update UI vì không có API save)
  const handleSaveEdit = () => {
    if (selectedItem) {
        setData(prevData => prevData.map(item => {
            if (item.id === selectedItem.id) {
                // Ghép lại thành ISO string giả lập
                const newIsoTime = `${editForm.date}T${editForm.time}:00`;
                return {
                    ...item,
                    time: newIsoTime
                };
            }
            return item;
        }));
    }
    setEditModalVisible(false);
    setSelectedItem(null);
  }

  // Giả lập xóa (chỉ update UI vì không có API delete)
  const handleConfirmDelete = () => {
    if (selectedItem) {
        setData(prevData => prevData.filter(item => item.id !== selectedItem.id));
    }
    setDeleteModalVisible(false);
    setSelectedItem(null);
  }

  return (
    <>
      <RawTimesheetStyles />
      <div className="page-container">

        {/* --- HEADER --- */}
        <div className="page-header-wrapper">
          <div className="header-left-group">
             <h1 className="page-title">Dữ liệu chấm công</h1>
             {/* <div className="warning-text">
                <CIcon icon={cilInfo} className="me-1" />
                Dữ liệu hiển thị theo ngày được chọn
             </div> */}
          </div>
          {/* <CButton color="light" className="bg-white border text-secondary fw-semibold" onClick={() => { setShowImportModal(true); setImportFile(null); }}>
            <CIcon icon={cilArrowThickFromBottom} className="me-2" /> Nhập khẩu
          </CButton> */}
        </div>

        <CCard className="card-full-height">
          <CCardBody className="p-0 d-flex flex-column flex-grow-1">
            <div className="toolbar-container">
              <div className="toolbar-left">
                <CInputGroup>
                  <CInputGroupText className="bg-white border-end-0 text-secondary"><CIcon icon={cilSearch} /></CInputGroupText>
                  <CFormInput className="border-start-0 ps-0" placeholder="Tìm tên hoặc mã NV..." value={searchText} onChange={(e) => setSearchText(e.target.value)} />
                </CInputGroup>
              </div>

              <div className="toolbar-right">
                {/* <CButton color="light" variant="outline" className="border-secondary text-dark" onClick={handleToday}>Hôm nay</CButton> */}

                {/* <div className="btn-group">
                  <CButton color="light" variant="outline" className="border-secondary text-secondary px-2" onClick={() => handleChangeDay(-1)}><CIcon icon={cilChevronLeft} /></CButton>
                  <CButton color="light" variant="outline" className="border-secondary text-secondary px-2" onClick={() => handleChangeDay(1)}><CIcon icon={cilChevronRight} /></CButton>
                </div> */}

                {/* Chọn ngày - Thay đổi từ Range picker sang Single date picker để phù hợp với API */}
                {/* <div className="date-control-group">
                   <div className="date-text-display">
                      {formatDisplayDate(selectedDate)}
                   </div>
                   <div className="date-calendar-btn" style={{position: 'relative'}}>
                      <CIcon icon={cilCalendar} />
                      <input 
                        type="date" 
                        style={{position: 'absolute', top:0, left:0, width:'100%', height:'100%', opacity: 0, cursor: 'pointer'}}
                        onChange={handleDateChange}
                        value={formatInputDate(selectedDate)}
                      />
                   </div>
                </div> */}

                {/* --- BTN GROUP --- */}
                <div className="btn-icon-group ms-2">
                  <CTooltip content="Tải lại">
                      <CButton color="light" variant="outline" className="btn-tool" onClick={handleReload}>
                          <CIcon icon={cilReload} />
                      </CButton>
                  </CTooltip>
                  <CTooltip content="Xuất khẩu"><CButton color="light" variant="outline" className="btn-tool" size="sm" onClick={handleExportExcel}>Xuất Excel</CButton></CTooltip>

                  <div className="popup-wrapper">
                    <CTooltip content="Bộ lọc"><CButton color="light" variant="outline" className={`btn-tool ${showFilterPopup ? 'active' : ''}`} onClick={() => { setShowFilterPopup(!showFilterPopup); setShowSettingsPopup(false); }}><CIcon icon={cilFilter} /></CButton></CTooltip>
                    <AdvancedFilterPopup visible={showFilterPopup} onClose={() => setShowFilterPopup(false)} columns={columns} filterValues={columnFilters} onApply={setColumnFilters} onClear={() => setColumnFilters({})} />
                  </div>

                  <div className="popup-wrapper">
                    <CTooltip content="Cài đặt"><CButton color="light" variant="outline" className={`btn-tool ${showSettingsPopup ? 'active' : ''}`} onClick={() => { setShowSettingsPopup(!showSettingsPopup); setShowFilterPopup(false); }}><CIcon icon={cilSettings} /></CButton></CTooltip>
                    <ColumnSettingsPopup visible={showSettingsPopup} onClose={() => setShowSettingsPopup(false)} columns={columns} onSave={setColumns} onReset={() => setColumns(DEFAULT_COLUMNS)} />
                  </div>
                </div>
              </div>
            </div>

            <div className="table-wrapper-fullscreen">
              <CTable hover className="custom-table mb-0">
                <CTableHead>
                  <CTableRow>
                    {columns.map(col => col.visible && (
                        <CTableHeaderCell key={col.key} style={{ minWidth: col.width }} className={col.key === 'actions' ? 'sticky-col-right' : ''}>
                            {col.label}
                        </CTableHeaderCell>
                    ))}
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                   {loading ? (
                       <CTableRow><CTableDataCell colSpan={columns.length} className="text-center p-5"><CSpinner color="primary"/></CTableDataCell></CTableRow>
                   ) : data.length > 0 ? (
                       data.map((item) => (
                           <CTableRow key={item.id}>
                               {columns.map(col => col.visible && (
                                   <CTableDataCell key={col.key} className={col.key === 'actions' ? 'sticky-col-right' : ''}>
                                       {col.key === 'time' ? (
                                           // Format cột time
                                           <span className="fw-semibold">{formatDateTimeDisplay(item.time)}</span>
                                       ) : col.key === 'actions' ? (
                                           <div className="row-actions">
                                                <CTooltip content="Sửa ngày giờ">
                                                    <button className="btn-action edit" onClick={() => handleEditClick(item)}>
                                                        <CIcon icon={cilPencil} />
                                                    </button>
                                                </CTooltip>
                                                <CTooltip content="Xóa">
                                                    <button className="btn-action delete" onClick={() => handleDeleteClick(item)}>
                                                        <CIcon icon={cilTrash} />
                                                    </button>
                                                </CTooltip>
                                           </div>
                                       ) : (
                                           item[col.key]
                                       )}
                                   </CTableDataCell>
                               ))}
                           </CTableRow>
                       ))
                   ) : null}
                </CTableBody>
              </CTable>

              {!loading && data.length === 0 && (
                <div className="empty-state-container">
                    <div className="empty-icon-wrapper"><CIcon icon={cilFile} size="xl" style={{ color: '#f9b115' }} /><div style={{ position: 'absolute', marginTop: '10px', marginLeft: '10px' }}><CIcon icon={cilSearch} size="sm" style={{ backgroundColor: 'white', borderRadius: '50%', padding: '1px' }}/></div></div>
                    <p className="empty-text">Không có dữ liệu cho ngày {formatDisplayDate(selectedDate)}</p>
                </div>
              )}
            </div>

          </CCardBody>
        </CCard>
      </div>

      <CModal alignment="center" size="lg" visible={showImportModal} onClose={() => setShowImportModal(false)}>
        <CModalHeader><CModalTitle className="fw-bold fs-5">Nhập khẩu dữ liệu chấm công</CModalTitle></CModalHeader>
        <CModalBody>
          <div className="import-steps"><span className="step-item active">1. Tải lên tệp</span><span className="step-item text-muted"> &gt; 2. Kiểm tra dữ liệu</span></div>
          <div className="upload-zone" onClick={!importFile ? triggerFileSelect : undefined}>
            {importFile ? (
                <div><CIcon icon={cilFile} size="3xl" className="text-success mb-3" /><div className="fw-bold text-success">{importFile.name}</div><CButton color="link" className="text-danger mt-2 text-decoration-none" onClick={(e) => { e.stopPropagation(); setImportFile(null); }}>Xóa file</CButton></div>
            ) : (<><div className="upload-text">Kéo thả tệp vào đây</div><input type="file" ref={fileInputRef} onChange={handleFileSelect} accept=".xls,.xlsx" style={{ display: 'none' }} /><CButton variant="outline" className="btn-upload-select" onClick={(e) => { e.stopPropagation(); triggerFileSelect(); }}><CIcon icon={cilCloudUpload} className="me-2" />Chọn tệp</CButton><div className="upload-hint">File .xls, .xlsx</div></>)}
          </div>
          <div className="text-center"><a href="#" className="link-orange">Tải xuống tệp mẫu</a></div>
        </CModalBody>
        <CModalFooter className="bg-light border-top-0"><CButton color="white" className="border" onClick={() => setShowImportModal(false)}>Hủy</CButton><CButton className="btn-orange text-white" onClick={handleConfirmImport}>Tiếp theo</CButton></CModalFooter>
      </CModal>

      {/* === EDIT MODAL === */}
      <CModal alignment="center" visible={editModalVisible} onClose={() => setEditModalVisible(false)}>
        <CModalHeader><CModalTitle>Chỉnh sửa chấm công</CModalTitle></CModalHeader>
        <CModalBody>
            <CForm>
                <div className="mb-3">
                    <CFormLabel>Ngày chấm công</CFormLabel>
                    <CFormInput type="date" value={editForm.date} onChange={(e) => setEditForm({...editForm, date: e.target.value})} />
                </div>
                <div className="mb-3">
                    <CFormLabel>Giờ chấm công</CFormLabel>
                    <CFormInput type="time" step="1" value={editForm.time} onChange={(e) => setEditForm({...editForm, time: e.target.value})} />
                </div>
            </CForm>
        </CModalBody>
        <CModalFooter>
            <CButton color="secondary" onClick={() => setEditModalVisible(false)}>Hủy</CButton>
            <CButton className="btn-orange text-white" onClick={handleSaveEdit}>Lưu thay đổi</CButton>
        </CModalFooter>
      </CModal>

      {/* === DELETE CONFIRM MODAL === */}
      <CModal alignment="center" visible={deleteModalVisible} onClose={() => setDeleteModalVisible(false)}>
        <CModalHeader><CModalTitle className="text-danger">Xóa dữ liệu chấm công</CModalTitle></CModalHeader>
        <CModalBody className="text-center py-4">
            <CIcon icon={cilWarning} size="3xl" className="text-warning mb-3"/>
            <h5>Bạn có chắc chắn muốn xóa dòng này?</h5>
            <p className="text-muted mb-0">{selectedItem?.employeeName} - {selectedItem && formatDateTimeDisplay(selectedItem.time)}</p>
        </CModalBody>
        <CModalFooter className="justify-content-center border-top-0 pb-4">
            <CButton color="secondary" onClick={() => setDeleteModalVisible(false)}>Không</CButton>
            <CButton color="danger" className="text-white" onClick={handleConfirmDelete}>Đồng ý xóa</CButton>
        </CModalFooter>
      </CModal>
    </>
  )
}

export default RawTimesheetPage







