
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
  CTooltip
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
  cilReload,
  cilSearch,
  cilSettings,
  cilX
} from '@coreui/icons'
import CIcon from '@coreui/icons-react'

// =====================================================================
// 0. UTILS & CONFIG
// =====================================================================
const DEFAULT_COLUMNS = [
  { key: 'empId', label: 'Mã nhân viên', visible: true, width: '120px' },
  { key: 'name', label: 'Họ và tên', visible: true, width: '200px' },
  { key: 'position', label: 'Vị trí công việc', visible: true, width: '200px' },
  { key: 'unit', label: 'Đơn vị công tác', visible: true, width: '180px' },
  { key: 'timekeeperId', label: 'Mã chấm công', visible: true, width: '120px' },
  { key: 'date', label: 'Ngày chấm công', visible: true, width: '150px' },
  { key: 'time', label: 'Giờ chấm công', visible: true, width: '150px' },
  { key: 'attachment', label: 'Tài liệu đính kèm', visible: true, width: '150px' },
]

const formatDisplayDate = (d) => {
    if (!d) return '';
    const year = d.getFullYear();
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const day = d.getDate().toString().padStart(2, '0');
    return `${day}/${month}/${year}`;
}

const formatInputDate = (d) => {
    if (!d) return '';
    const year = d.getFullYear();
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const day = d.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
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
    .date-text-display { padding: 0 12px; font-size: 0.875rem; font-weight: 600; color: #3c4b64; min-width: 190px; text-align: center; line-height: 38px; border-right: 1px solid #ced4da; background-color: #fff; }
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
// 2. MOCK DATA
// =====================================================================
const generateMockData = () => {
    const data = [];
    const units = ['Phòng Kỹ Thuật', 'Phòng Nhân Sự', 'Kho', 'Phòng Kinh Doanh'];
    const positions = ['Developer', 'Tester', 'HR Specialist', 'Thủ kho', 'Sales'];
    const today = new Date();
    
    for(let i= -10; i<=10; i++) {
        const d = new Date(today);
        d.setDate(today.getDate() + i);
        const dateStr = formatInputDate(d);
        for(let emp=1; emp<=5; emp++) {
             data.push({
                 id: `log_${emp}_${i}_in`,
                 empId: `NV00${emp}`,
                 name: `Nhân viên ${emp}`,
                 position: positions[emp % positions.length],
                 unit: units[emp % units.length],
                 timekeeperId: `TK00${emp}`,
                 timezone: 'GMT+7',
                 date: dateStr,
                 rawDate: d,
                 time: '08:00:00', 
                 attachment: emp % 2 === 0 ? 'img.jpg' : null
             });
        }
    }
    return data;
};

const MOCK_DB = generateMockData();

// =====================================================================
// 3. SUB-COMPONENTS
// =====================================================================
const AdvancedFilterPopup = ({ visible, onClose, columns, filterValues, onApply, onClear }) => {
    const [tempValues, setTempValues] = useState(filterValues);
    useEffect(() => { if (visible) setTempValues(filterValues) }, [visible, filterValues]);
    if (!visible) return null;
    return (
      <div className="popup-container">
        <div className="popup-header"><h5 className="popup-title">Lọc theo cột</h5><CButton color="link" onClick={onClose} className="p-0 text-secondary"><CIcon icon={cilX} /></CButton></div>
        <div className="popup-body">
          {columns.map(col => col.visible && (
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
        <div className="popup-body">{tempColumns.map(col => <div key={col.key} className="filter-item"><CFormCheck id={`vis-check-${col.key}`} label={col.label} checked={col.visible} onChange={() => setTempColumns(p => p.map(c => c.key === col.key ? { ...c, visible: !c.visible } : c))} /></div>)}</div>
        <div className="popup-footer"><CButton color="light" size="sm" onClick={() => { onReset(); onClose(); }}>Mặc định</CButton><CButton size="sm" className="btn-orange text-white" onClick={() => { onSave(tempColumns); onClose(); }}>Lưu</CButton></div>
      </div>
    )
}

const DateRangeModal = ({ visible, onClose, initialStart, initialEnd, onApply }) => {
    const [start, setStart] = useState('');
    const [end, setEnd] = useState('');
    useEffect(() => { if(visible) { setStart(formatInputDate(initialStart)); setEnd(formatInputDate(initialEnd)); } }, [visible, initialStart, initialEnd]);
    return (
        <CModal visible={visible} onClose={onClose} alignment="center" size="sm">
            <CModalHeader><CModalTitle className="fs-6 fw-bold">Chọn khoảng thời gian</CModalTitle></CModalHeader>
            <CModalBody>
                <div className="mb-3"><CFormLabel className="sm">Từ ngày</CFormLabel><CFormInput type="date" value={start} onChange={e => setStart(e.target.value)} /></div>
                <div className="mb-0"><CFormLabel className="sm">Đến ngày</CFormLabel><CFormInput type="date" value={end} onChange={e => setEnd(e.target.value)} /></div>
            </CModalBody>
            <CModalFooter className="border-top-0 pt-0">
                <CButton color="light" size="sm" onClick={onClose}>Hủy</CButton>
                <CButton className="btn-orange text-white" size="sm" onClick={() => { onApply(new Date(start), new Date(end)); onClose(); }}>Áp dụng</CButton>
            </CModalFooter>
        </CModal>
    )
}

// =====================================================================
// 4. MAIN COMPONENT
// =====================================================================
const RawTimesheetPage = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Date State
  const [startDate, setStartDate] = useState(new Date()); 
  const [endDate, setEndDate] = useState(new Date());

  // UI State
  const [columns, setColumns] = useState(DEFAULT_COLUMNS);
  const [searchText, setSearchText] = useState('');
  const [selectedUnit, setSelectedUnit] = useState('all');
  const [columnFilters, setColumnFilters] = useState({});
  const [showFilterPopup, setShowFilterPopup] = useState(false);
  const [showSettingsPopup, setShowSettingsPopup] = useState(false);
  const [showDateModal, setShowDateModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [importFile, setImportFile] = useState(null);
  const fileInputRef = useRef(null);

  // --- FETCH DATA LOGIC ---
  const fetchData = useCallback(async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 300));

    const sDate = new Date(startDate); sDate.setHours(0,0,0,0);
    const eDate = new Date(endDate); eDate.setHours(23,59,59,999);

    let result = MOCK_DB.filter(item => {
        const itemDate = new Date(item.rawDate);
        if (itemDate < sDate || itemDate > eDate) return false;
        if (searchText && !item.name.toLowerCase().includes(searchText.toLowerCase()) && !item.empId.toLowerCase().includes(searchText.toLowerCase())) return false;
        if (selectedUnit !== 'all' && item.unit !== selectedUnit) return false;
        for (const key in columnFilters) {
             const filterVal = columnFilters[key].toLowerCase();
             if (filterVal && !String(item[key]).toLowerCase().includes(filterVal)) return false;
        }
        return true;
    });

    result.sort((a, b) => b.rawDate - a.rawDate || b.time.localeCompare(a.time));
    setData(result);
    setLoading(false);
  }, [startDate, endDate, searchText, selectedUnit, columnFilters]);

  useEffect(() => { fetchData() }, [fetchData]);

  // Handlers
  const handleToday = () => { const now = new Date(); setStartDate(now); setEndDate(now); }
  const handleChangeDay = (days) => {
      const newStart = new Date(startDate); newStart.setDate(newStart.getDate() + days);
      const newEnd = new Date(endDate); newEnd.setDate(newEnd.getDate() + days);
      setStartDate(newStart); setEndDate(newEnd);
  }
  const handleDateRangeApply = (s, e) => { setStartDate(s); setEndDate(e); }
  const handleFileSelect = (e) => { const file = e.target.files[0]; if (file) setImportFile(file); }
  const triggerFileSelect = () => fileInputRef.current.click();
  const handleConfirmImport = () => { if (!importFile) return; setShowImportModal(false); alert(`Đã nhập khẩu file: ${importFile.name}`); setImportFile(null); }

  const handleExportExcel = () => {
      const visibleCols = columns.filter(c => c.visible);
      const headers = visibleCols.map(c => c.label);
      const keys = visibleCols.map(c => c.key);
      const csvRows = [headers.join(',')];
      data.forEach(item => {
          const rowData = keys.map(key => {
              let val = item[key] !== null && item[key] !== undefined ? String(item[key]) : '';
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
      link.setAttribute('download', `du_lieu_cham_cong_${formatInputDate(new Date())}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
  }

  // --- HANDLE RELOAD (RESET TO DEFAULT) ---
  const handleReload = () => {
      setSearchText('');
      setColumnFilters({});
      setSelectedUnit('all');
      setColumns(DEFAULT_COLUMNS);
      // fetchData sẽ tự động chạy lại do useEffect theo dõi các state trên
  }

  return (
    <>
      <RawTimesheetStyles />
      <div className="page-container">
        
        {/* --- HEADER --- */}
        <div className="page-header-wrapper">
          <div className="header-left-group">
             <h1 className="page-title">Dữ liệu chấm công</h1>
             <div className="warning-text">
                <CIcon icon={cilInfo} className="me-1" /> 
                Dữ liệu chấm công chỉ được lưu trữ tối đa 6 tháng
             </div>
          </div>
          <CButton color="light" className="bg-white border text-secondary fw-semibold" onClick={() => { setShowImportModal(true); setImportFile(null); }}>
            <CIcon icon={cilArrowThickFromBottom} className="me-2" /> Nhập khẩu
          </CButton>
        </div>

        <CCard className="card-full-height">
          <CCardBody className="p-0 d-flex flex-column flex-grow-1">
            <div className="toolbar-container">
              <div className="toolbar-left">
                <CInputGroup>
                  <CInputGroupText className="bg-white border-end-0 text-secondary"><CIcon icon={cilSearch} /></CInputGroupText>
                  <CFormInput className="border-start-0 ps-0" placeholder="Tìm kiếm" value={searchText} onChange={(e) => setSearchText(e.target.value)} />
                </CInputGroup>
              </div>

              <div className="toolbar-right">
                <CButton color="light" variant="outline" className="border-secondary text-dark" onClick={handleToday}>Hôm nay</CButton>

                <div className="btn-group">
                  <CButton color="light" variant="outline" className="border-secondary text-secondary px-2" onClick={() => handleChangeDay(-1)}><CIcon icon={cilChevronLeft} /></CButton>
                  <CButton color="light" variant="outline" className="border-secondary text-secondary px-2" onClick={() => handleChangeDay(1)}><CIcon icon={cilChevronRight} /></CButton>
                </div>

                <div className="date-control-group">
                   <div className="date-text-display">
                      {formatDisplayDate(startDate)} - {formatDisplayDate(endDate)}
                   </div>
                   <div className="date-calendar-btn" onClick={() => setShowDateModal(true)} title="Chọn khoảng thời gian">
                      <CIcon icon={cilCalendar} />
                   </div>
                </div>

                <div style={{ width: '180px' }}>
                  <CFormSelect value={selectedUnit} onChange={(e) => setSelectedUnit(e.target.value)}>
                    <option value="all">Tất cả đơn vị</option>
                    <option value="Phòng Kỹ Thuật">Phòng Kỹ Thuật</option>
                    <option value="Phòng Nhân Sự">Phòng Nhân Sự</option>
                  </CFormSelect>
                </div>

                {/* --- BTN GROUP (ĐÃ SỬA RELOAD) --- */}
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
                        <CTableHeaderCell key={col.key} style={{ minWidth: col.width }}>{col.label}</CTableHeaderCell>
                    ))}
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                   {loading ? (
                       <CTableRow><CTableDataCell colSpan={10} className="text-center p-5"><CSpinner color="primary"/></CTableDataCell></CTableRow>
                   ) : data.length > 0 ? (
                       data.map((item) => (
                           <CTableRow key={item.id}>
                               {columns.map(col => col.visible && (
                                   <CTableDataCell key={col.key}>
                                       {col.key === 'attachment' && item.attachment ? <span className="text-primary cursor-pointer"><CIcon icon={cilPaperclip}/> {item.attachment}</span> : item[col.key]}
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
                    <p className="empty-text">Không có dữ liệu</p>
                </div>
              )}
            </div>

          </CCardBody>
        </CCard>
      </div>

      <DateRangeModal visible={showDateModal} onClose={() => setShowDateModal(false)} initialStart={startDate} initialEnd={endDate} onApply={handleDateRangeApply} />

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
    </>
  )
}

export default RawTimesheetPage