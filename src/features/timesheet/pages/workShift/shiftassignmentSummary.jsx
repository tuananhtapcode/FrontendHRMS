
import {
  CButton,
  CCol,
  CDropdown,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
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
  CTooltip
} from '@coreui/react'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'

// Imports cho Icons
import {
  cilCalendar,
  cilChevronLeft,
  cilChevronRight,
  cilOptions,
  cilPencil,
  cilSearch,
  cilSettings,
  cilTrash,
  cilX
} from '@coreui/icons'
import CIcon from '@coreui/icons-react'

// =====================================================================
// 0. DATE UTILS
// =====================================================================
const formatDateParam = (date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const day = d.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
};

const formatDisplayDate = (dateStr) => {
    if (!dateStr) return '';
    const [year, month, day] = dateStr.split('-');
    return `${day}/${month}/${year}`;
};

const getDayName = (date) => {
    const days = ['Chủ nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];
    return days[date.getDay()];
};

const generateDaysArray = (start, end) => {
    const arr = [];
    const dt = new Date(start);
    const endDate = new Date(end);
    dt.setHours(0,0,0,0);
    endDate.setHours(0,0,0,0);
    
    const today = new Date();
    today.setHours(0,0,0,0);
    const todayStr = formatDateParam(today);

    while (dt <= endDate) {
        arr.push({
            date: dt.getDate().toString().padStart(2, '0'), 
            day: getDayName(dt),
            fullDate: formatDateParam(dt),
            isToday: formatDateParam(dt) === todayStr,
            isWeekend: dt.getDay() === 0 || dt.getDay() === 6 
        });
        dt.setDate(dt.getDate() + 1);
    }
    return arr;
};

// =====================================================================
// 1. CSS CUSTOM (Đã thêm CSS cho nút Sửa/Xóa khi hover)
// =====================================================================
const ShiftSummaryStyles = () => (
  <style>
    {`
    .page-container { padding: 1rem; display: flex; flex-direction: column; height: calc(100vh - 70px); }
    .summary-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; flex-shrink: 0; }
    .summary-title { font-size: 1.75rem; font-weight: 500; }
    .summary-header-tabs { flex-grow: 1; margin-left: 2rem; display: flex; gap: 5px; }
    .tab-button { background: none; border: none; padding: 0.5rem 1rem; color: var(--cui-body-color); font-weight: 500; cursor: pointer; border-radius: 0.375rem; transition: all 0.15s; }
    .tab-button:hover { color: #ea580c; background-color: #fff7ed; }
    .tab-button.active { color: #ea580c; border-bottom: 2px solid #ea580c; border-radius: 0; }
    .summary-header-actions { display: flex; gap: 12px; flex-shrink: 0; }

    .summary-filter-bar { display: flex; justify-content: space-between; align-items: center; gap: 12px; margin-bottom: 1rem; flex-shrink: 0; }
    .filter-right { display: flex; gap: 12px; align-items: center; }
    .filter-left { display: flex; gap: 12px; align-items: center; }
    .filter-left .search-bar { width: 250px; }
    
    
    .date-range-picker { display: flex; align-items: center; border: 1px solid #ccc; border-radius: 0.375rem; background: #fff; }
    .date-range-picker .btn { border: none; }
    .date-range-text { padding: 0 0.5rem; font-weight: 500; font-size: 0.9rem; min-width: 220px; text-align: center; }
    .date-range-icon { padding: 0 0.5rem; border-left: 1px solid #ccc; cursor: pointer; color: #666; }
    .date-range-icon:hover { background-color: #f0f0f0; }

    /* Container Grid */
    .schedule-grid-container { flex-grow: 1; overflow: auto; border: 1px solid #ccc; border-radius: 0.375rem; position: relative; scroll-behavior: smooth; }
    .schedule-grid { display: grid; width: max-content; min-width: 100%; }

    .grid-cell { padding: 0.5rem; border-right: 1px solid #eee; border-bottom: 1px solid #eee; background-color: #fff; display: flex; align-items: center; }
    .grid-header { font-weight: 600; justify-content: center; flex-direction: column; position: sticky; top: 0; z-index: 20; border-bottom: 1px solid #ccc; }
    .grid-header.is-today { color: #e55353; background-color: #fff5f5 !important; }
    .grid-header.is-weekend { background-color: #fafafa; color: #e55353; }
    .grid-header .day-of-week { font-size: 0.8rem; text-transform: uppercase; }
    .grid-header .date-number { font-size: 1.2rem; }

    .grid-cell.col-header { font-weight: 600; position: sticky; left: 0; z-index: 10; border-right: 1px solid #ccc; background-color: #fff; min-width: 250px; }
    .grid-cell.col-header.grid-header { z-index: 30; } 
    .group-header-row { grid-column: 1 / -1; background-color: #f8f9fa; font-weight: 700; padding: 0.75rem; border-bottom: 1px solid #ccc; position: sticky; left: 0; }

    .btn-orange { background-color: #ea580c; border-color: #ea580c; color: white; font-weight: 600; }
    .btn-orange:hover { background-color: #c2410c; color: white; border-color: #c2410c; }

    .employee-avatar { width: 32px; height: 32px; border-radius: 50%; background-color: #e0e0e0; color: #757575; display: flex; align-items: center; justify-content: center; font-weight: 600; margin-right: 10px; }
    .employee-info { line-height: 1.2; }
    .employee-name { font-weight: 500; font-size: 0.9rem; }
    .employee-id { font-size: 0.75rem; color: #8a93a2; }

    /* === SHIFT CELL & HOVER ACTIONS === */
    .shift-cell { 
        min-height: 60px; 
        vertical-align: top; 
        display: flex; 
        flex-direction: column; 
        align-items: flex-start; 
        justify-content: center;
        position: relative; /* Để định vị nút action */
    }
    .shift-cell:hover {
        background-color: #f8f9fa;
    }
    .shift-cell.is-today-col { background-color: #fff8f8; }
    
    .shift-tag { font-size: 0.85rem; font-weight: 600; display: flex; align-items: center; color: #333; }
    .shift-dot { width: 6px; height: 6px; border-radius: 50%; margin-right: 6px; background-color: #333; }
    .shift-time { font-size: 0.75rem; color: #768192; margin-left: 12px; margin-top: 1px; }

    /* Action Container: Ẩn mặc định, Hiện khi hover */
    .cell-hover-actions {
        display: none;
        position: absolute;
        top: 4px;
        right: 4px;
        background: rgba(255, 255, 255, 0.9);
        border-radius: 4px;
        padding: 2px;
        box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        z-index: 5;
    }
    .shift-cell:hover .cell-hover-actions {
        display: flex;
        gap: 4px;
    }
    .action-btn-mini {
        width: 24px;
        height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        border: none;
        background: transparent;
        color: #768192;
        border-radius: 3px;
        cursor: pointer;
        transition: all 0.2s;
    }
    .action-btn-mini:hover { background-color: #ebedef; }
    .action-btn-mini.edit:hover { color: #ea580c; background-color: #fff7ed; }
    .action-btn-mini.delete:hover { color: #e55353; background-color: #fee2e2; }

    /* Settings Popup */
    .settings-popup { position: absolute; top: 100%; right: 0; width: 320px; background: white; border: 1px solid #d8dbe0; box-shadow: 0 4px 12px rgba(0,0,0,0.15); border-radius: 4px; z-index: 100; margin-top: 5px; }
    .popup-header { display: flex; justify-content: space-between; align-items: center; padding: 12px 16px; border-bottom: 1px solid #ebedef; font-weight: 700; }
    .popup-body { padding: 16px; }
    .popup-section { margin-bottom: 16px; }
    .popup-section-title { font-weight: 600; font-size: 0.9rem; margin-bottom: 8px; display: block; }
    .popup-footer { padding: 12px 16px; border-top: 1px solid #ebedef; display: flex; justify-content: flex-end; gap: 8px; background-color: #f9fafb; }
    .text-orange { color: #ea580c; cursor: pointer; font-weight: 500; text-decoration: none; }
    .text-orange:hover { text-decoration: underline; }
    .selected-items-list { margin-top: 10px; display: flex; flex-wrap: wrap; gap: 5px; }
    .selected-item-tag { background: #f3f4f7; padding: 2px 8px; border-radius: 12px; font-size: 0.85rem; display: flex; align-items: center; gap: 5px; }
    `}
  </style>
)

// =====================================================================
// 2. MOCK DATA
// =====================================================================
const [MOCK_EMPLOYEES, MOCK_SHIFTS, MOCK_AVAILABLE_SHIFTS, MOCK_ORG_UNITS] = (() => {
  const employees = [
    { id: 'NV000001', name: 'Thuận Nguyễn', avatar: 'TN', unit: 'Phòng Kỹ Thuật', job: 'Developer' },
    { id: 'NV000002', name: 'Trần Hải Lâm', avatar: 'TL', unit: 'Phòng Kỹ Thuật', job: 'Tester' },
    { id: 'NV000003', name: 'Phạm Thành Nam', avatar: 'PN', unit: 'Phòng Nhân Sự', job: 'HR' },
    { id: 'NV000004', name: 'Lê Văn C', avatar: 'LC', unit: 'Phòng Nhân Sự', job: 'HR' },
    { id: 'NV000005', name: 'Nguyễn Văn Empty', avatar: 'NE', unit: 'Kho', job: 'Thủ kho' },
  ]

  const today = new Date();
  const currentMonthPrefix = `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, '0')}`;
  const dayStr = today.getDate().toString().padStart(2, '0');
  
  const shifts = [
    { id: 1, employeeId: 'NV000001', date: `${currentMonthPrefix}-${dayStr}`, shiftCode: 'HC', startTime: '08:00', endTime: '17:30' },
    { id: 2, employeeId: 'NV000001', date: `${currentMonthPrefix}-02`, shiftCode: 'HC', startTime: '08:00', endTime: '17:30' },
    { id: 3, employeeId: 'NV000002', date: `${currentMonthPrefix}-${dayStr}`, shiftCode: 'TCT', startTime: '08:00', endTime: '08:30' },
  ]

  const availableShifts = [
      { id: 'HC', name: 'HC (08:00 - 17:30)', start: '08:00', end: '17:30' },
      { id: 'abc123', name: 'abc123 (08:00 - 08:30)', start: '08:00', end: '08:30' },
      { id: 'TCT', name: 'TCT (08:00 - 08:30)', start: '08:00', end: '08:30' },
      { id: 'CA_CHIEU', name: 'Ca Chiều (13:30 - 22:00)', start: '13:30', end: '22:00' },
  ]

  const orgUnits = [
      { id: 'PKT', name: 'Phòng Kỹ Thuật' },
      { id: 'PNS', name: 'Phòng Nhân Sự' },
      { id: 'KHO', name: 'Kho' },
  ]

  return [employees, shifts, availableShifts, orgUnits]
})()

// =====================================================================
// 3. SUB-COMPONENTS
// =====================================================================

const SelectionModal = ({ visible, onClose, type, data, selectedIds, onConfirm }) => {
    const [localSelected, setLocalSelected] = useState([]);
    useEffect(() => { if(visible) setLocalSelected(selectedIds); }, [visible, selectedIds]);
    const handleToggle = (id) => setLocalSelected(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);

    return (
        <CModal visible={visible} onClose={onClose} alignment="center">
            <CModalHeader><CModalTitle>Chọn {type === 'employee' ? 'nhân viên' : 'cơ cấu'}</CModalTitle></CModalHeader>
            <CModalBody style={{ maxHeight: '400px', overflowY: 'auto' }}>
                <CInputGroup className="mb-3"><CInputGroupText><CIcon icon={cilSearch} /></CInputGroupText><CFormInput placeholder="Tìm kiếm..." /></CInputGroup>
                {data.map(item => (
                    <div key={item.id} className="d-flex align-items-center mb-2 p-2 border-bottom">
                        <CFormCheck checked={localSelected.includes(item.id)} onChange={() => handleToggle(item.id)} id={`select-${item.id}`} />
                        <label htmlFor={`select-${item.id}`} className="ms-2 flex-grow-1 cursor-pointer">
                            <div className="fw-bold">{item.name}</div>
                            {type === 'employee' && <div className="small text-muted">{item.id}</div>}
                        </label>
                    </div>
                ))}
            </CModalBody>
            <CModalFooter>
                <CButton color="secondary" variant="ghost" onClick={onClose}>Hủy</CButton>
                <CButton color="primary" onClick={() => onConfirm(localSelected)}>Xác nhận</CButton>
            </CModalFooter>
        </CModal>
    )
}

// --- MODAL SỬA CA LÀM VIỆC (EDIT SHIFT MODAL) ---
const EditShiftModal = ({ visible, onClose, onSave, targetCell, availableShifts, employees }) => {
    const [selectedShift, setSelectedShift] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        if (visible && targetCell) {
            // Nếu đã có ca, tự động chọn ca đó
            const currentShift = targetCell.shifts && targetCell.shifts.length > 0 ? targetCell.shifts[0].shiftCode : '';
            setSelectedShift(currentShift);
            setSearchTerm('');
        }
    }, [visible, targetCell]);

    const employeeName = targetCell ? employees.find(e => e.id === targetCell.empId)?.name : '';
    const filteredShifts = availableShifts.filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase()));

    const handleSave = () => {
        if (selectedShift) {
            const shiftInfo = availableShifts.find(s => s.id === selectedShift);
            onSave(shiftInfo);
        }
        onClose();
    };

    return (
        <CModal visible={visible} onClose={onClose} alignment="center">
            <CModalHeader><CModalTitle>Cập nhật ca làm việc</CModalTitle></CModalHeader>
            <CModalBody>
                <p className="mb-2"><strong>Nhân viên:</strong> {employeeName} ({targetCell?.empId})</p>
                <p className="mb-3"><strong>Ngày:</strong> {formatDisplayDate(targetCell?.date)}</p>
                
                <CFormLabel>Chọn ca làm việc</CFormLabel>
                <CInputGroup className="mb-2">
                    <CInputGroupText><CIcon icon={cilSearch}/></CInputGroupText>
                    <CFormInput placeholder="Tìm kiếm ca..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                </CInputGroup>
                
                <CFormSelect size="lg" value={selectedShift} onChange={(e) => setSelectedShift(e.target.value)}>
                    <option value="">-- Chọn ca --</option>
                    {filteredShifts.map(s => (
                        <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                </CFormSelect>
            </CModalBody>
            <CModalFooter>
                <CButton color="light" onClick={onClose}>Hủy</CButton>
                <CButton className="btn-orange" onClick={handleSave}>Lưu</CButton>
            </CModalFooter>
        </CModal>
    );
};

// --- MODAL XÓA CA LÀM VIỆC (DELETE CONFIRM MODAL) ---
const DeleteShiftModal = ({ visible, onClose, onConfirm, targetCell, employees }) => {
    const employeeName = targetCell ? employees.find(e => e.id === targetCell.empId)?.name : '';
    
    return (
        <CModal visible={visible} onClose={onClose} alignment="center">
            <CModalHeader><CModalTitle>Xác nhận xóa</CModalTitle></CModalHeader>
            <CModalBody>
                Bạn có chắc chắn muốn xóa phân ca ngày <strong>{formatDisplayDate(targetCell?.date)}</strong> của nhân viên <strong>{employeeName}</strong>?
            </CModalBody>
            <CModalFooter>
                <CButton color="light" onClick={onClose}>Hủy</CButton>
                <CButton color="danger" className="text-white" onClick={() => { onConfirm(); onClose(); }}>Xóa</CButton>
            </CModalFooter>
        </CModal>
    );
};

const DateRangeModal = ({ visible, onClose, initialStart, initialEnd, onApply }) => {
    const [start, setStart] = useState(initialStart);
    const [end, setEnd] = useState(initialEnd);

    useEffect(() => {
        if(visible) { setStart(initialStart); setEnd(initialEnd); }
    }, [visible, initialStart, initialEnd]);

    return (
        <CModal visible={visible} onClose={onClose} alignment="center" size="sm">
            <CModalHeader><CModalTitle>Chọn khoảng thời gian</CModalTitle></CModalHeader>
            <CModalBody>
                <div className="mb-3">
                    <CFormLabel>Từ ngày</CFormLabel>
                    <CFormInput type="date" value={start} onChange={e => setStart(e.target.value)} />
                </div>
                <div className="mb-3">
                    <CFormLabel>Đến ngày</CFormLabel>
                    <CFormInput type="date" value={end} onChange={e => setEnd(e.target.value)} />
                </div>
            </CModalBody>
            <CModalFooter>
                <CButton color="light" onClick={onClose}>Hủy</CButton>
                <CButton className="btn-orange" onClick={() => { onApply(start, end); onClose(); }}>Áp dụng</CButton>
            </CModalFooter>
        </CModal>
    )
}

const BulkAssignmentModal = ({ visible, onClose, availableShifts, employees, orgUnits }) => {
    const [formData, setFormData] = useState({ shiftId: '', date: new Date().toISOString().split('T')[0], targetType: 'employee', selectedTargets: [] });
    const [showSelection, setShowSelection] = useState(false);
    useEffect(() => { if(visible) setFormData({ shiftId: '', date: new Date().toISOString().split('T')[0], targetType: 'employee', selectedTargets: [] }) }, [visible]);
    
    return (
        <>
            <CModal visible={visible} onClose={onClose} alignment="center" size="lg">
                <CModalHeader><CModalTitle className="fw-bold">Phân ca hàng loạt</CModalTitle></CModalHeader>
                <CModalBody>
                    <CRow className="mb-3">
                        <CFormLabel className="col-sm-3 fw-bold">Ca làm việc <span className="text-danger">*</span></CFormLabel>
                        <CCol sm={9}><CFormSelect value={formData.shiftId} onChange={(e) => setFormData(p => ({...p, shiftId: e.target.value}))}><option value="">-- Chọn ca --</option>{availableShifts.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}</CFormSelect></CCol>
                    </CRow>
                    <CRow className="mb-3">
                        <CFormLabel className="col-sm-3 fw-bold">Thời gian áp dụng <span className="text-danger">*</span></CFormLabel>
                        <CCol sm={9}><CFormInput type="date" value={formData.date} onChange={(e) => setFormData(p => ({...p, date: e.target.value}))} /></CCol>
                    </CRow>
                    <CRow className="mb-3">
                        <CFormLabel className="col-sm-3 fw-bold">Đối tượng</CFormLabel>
                        <CCol sm={9} className="d-flex gap-4"><CFormCheck type="radio" label="Cơ cấu tổ chức" checked={formData.targetType === 'org'} onChange={() => setFormData(p => ({...p, targetType: 'org', selectedTargets: []}))} /><CFormCheck type="radio" label="Nhân viên" checked={formData.targetType === 'employee'} onChange={() => setFormData(p => ({...p, targetType: 'employee', selectedTargets: []}))} /></CCol>
                    </CRow>
                    <CRow><CCol sm={{ offset: 3, span: 9 }}><span className="text-orange" onClick={() => setShowSelection(true)}>+ Thêm {formData.targetType === 'employee' ? 'người' : 'cơ cấu'}</span><div className="selected-items-list">{formData.selectedTargets.map(id => (<div key={id} className="selected-item-tag border">{(formData.targetType === 'employee' ? employees : orgUnits).find(i => i.id === id)?.name || id}<CIcon icon={cilX} size="sm" className="cursor-pointer text-secondary" onClick={() => setFormData(p => ({...p, selectedTargets: p.selectedTargets.filter(tid => tid !== id)}))} /></div>))}</div></CCol></CRow>
                </CModalBody>
                <CModalFooter><CButton color="light" onClick={onClose}>Hủy</CButton><CButton className="btn-orange" onClick={() => { alert('Đã lưu!'); onClose(); }}>Lưu</CButton></CModalFooter>
            </CModal>
            <SelectionModal visible={showSelection} onClose={() => setShowSelection(false)} type={formData.targetType} data={formData.targetType === 'employee' ? employees : orgUnits} selectedIds={formData.selectedTargets} onConfirm={(ids) => { setFormData(p => ({...p, selectedTargets: ids})); setShowSelection(false); }} />
        </>
    )
}

const SettingsPopup = ({ visible, onClose, currentSettings, onSave }) => {
    const [localSettings, setLocalSettings] = useState(currentSettings);
    useEffect(() => { if(visible) setLocalSettings(currentSettings); }, [visible, currentSettings]);
    if (!visible) return null;
    return (
        <div className="settings-popup">
            <div className="popup-header"><span>Tùy chỉnh</span><CButton color="link" className="p-0 text-secondary" onClick={onClose}><CIcon icon={cilX}/></CButton></div>
            <div className="popup-body">
                <div className="popup-section"><span className="popup-section-title">Hiển thị thời gian</span><CFormCheck type="radio" label="Hiển thị chi tiết giờ" checked={localSettings.showTime === true} onChange={() => setLocalSettings(p => ({...p, showTime: true}))} /><CFormCheck type="radio" label="Ẩn chi tiết giờ" checked={localSettings.showTime === false} onChange={() => setLocalSettings(p => ({...p, showTime: false}))} /></div>
                <div className="popup-section mb-0"><span className="popup-section-title">Gom nhóm</span><CFormCheck type="radio" label="Có" checked={localSettings.grouped === true} onChange={() => setLocalSettings(p => ({...p, grouped: true}))} />{localSettings.grouped && (<div className="ms-4 mt-2"><CFormSelect size="sm" value={localSettings.groupBy} onChange={(e) => setLocalSettings(p => ({...p, groupBy: e.target.value}))}><option value="unit">Đơn vị công tác</option><option value="job">Vị trí công việc</option></CFormSelect></div>)}<CFormCheck type="radio" label="Không" className="mt-2" checked={localSettings.grouped === false} onChange={() => setLocalSettings(p => ({...p, grouped: false}))} /></div>
            </div>
            <div className="popup-footer"><CButton color="light" size="sm" onClick={() => setLocalSettings({ showTime: false, grouped: false, groupBy: 'unit' })}>Mặc định</CButton><CButton className="btn-orange" size="sm" onClick={() => { onSave(localSettings); onClose(); }}>Lưu</CButton></div>
        </div>
    )
}

// =====================================================================
// 4. COMPONENT CHA (MAIN)
// =====================================================================
const ShiftAssignmentSummary = () => {
  const [employees, setEmployees] = useState([])
  const [displayedEmployees, setDisplayedEmployees] = useState([]) 
  const [shifts, setShifts] = useState({}) // Object: { "NV01_2025-12-01": [ShiftData] }
  const [weekDays, setWeekDays] = useState([])
  const [loading, setLoading] = useState(true)

  const today = new Date();
  const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
  const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
  
  const [startDate, setStartDate] = useState(formatDateParam(firstDay));
  const [endDate, setEndDate] = useState(formatDateParam(lastDay));

  const [filters, setFilters] = useState({ search: '', status: 'all', unit: 'all' })
  const [viewSettings, setViewSettings] = useState({ showTime: false, grouped: false, groupBy: 'unit' })
  
  const [showSettings, setShowSettings] = useState(false)
  const [showBulkModal, setShowBulkModal] = useState(false)
  const [showDateRangeModal, setShowDateRangeModal] = useState(false)
  
  // -- State quản lý Modal Sửa/Xóa đơn lẻ --
  const [modalState, setModalState] = useState({
      editVisible: false,
      deleteVisible: false,
      targetCell: null // { empId, date, shifts: [] }
  });

  // State để kích hoạt scroll
  const [triggerScrollToToday, setTriggerScrollToToday] = useState(false);
  const scrollContainerRef = useRef(null); 

  const navigate = useNavigate()

  useEffect(() => {
      const days = generateDaysArray(startDate, endDate);
      setWeekDays(days);
  }, [startDate, endDate]);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
        setEmployees(MOCK_EMPLOYEES);
        const shiftMap = MOCK_SHIFTS.reduce((acc, shift) => {
            const key = `${shift.employeeId}_${shift.date}`;
            if (!acc[key]) acc[key] = [];
            acc[key].push(shift);
            return acc;
        }, {});
        setShifts(shiftMap);
        setLoading(false);
    }, 300);
  }, []); 

  useEffect(() => {
      if (triggerScrollToToday && !loading && weekDays.length > 0) {
          setTimeout(() => {
              const container = scrollContainerRef.current;
              const todayHeader = container?.querySelector('.grid-header.is-today');
              if (container && todayHeader) {
                  const scrollPos = todayHeader.offsetLeft - 250; 
                  container.scrollTo({ left: scrollPos, behavior: 'smooth' });
              }
              setTriggerScrollToToday(false); 
          }, 100);
      }
  }, [triggerScrollToToday, loading, weekDays]);

  useEffect(() => {
    if (employees.length > 0) {
      let result = [...employees];
      if (filters.search.trim()) {
        const searchTerm = filters.search.toLowerCase();
        result = result.filter(emp => emp.name.toLowerCase().includes(searchTerm));
      }
      if (filters.status !== 'all') {
        result = result.filter(emp => {
          const hasAnyShift = weekDays.some(day => {
             const key = `${emp.id}_${day.fullDate}`;
             return shifts[key] && shifts[key].length > 0;
          });
          return filters.status === 'assigned' ? hasAnyShift : !hasAnyShift;
        });
      }
      setDisplayedEmployees(result);
    }
  }, [filters, employees, shifts, weekDays]);

  // --- Handlers cho Date Nav ---
  const handlePrevMonth = () => {
      const curr = new Date(startDate);
      curr.setMonth(curr.getMonth() - 1);
      const first = new Date(curr.getFullYear(), curr.getMonth(), 1);
      const last = new Date(curr.getFullYear(), curr.getMonth() + 1, 0);
      setStartDate(formatDateParam(first)); setEndDate(formatDateParam(last));
  }
  const handleNextMonth = () => {
      const curr = new Date(startDate);
      curr.setMonth(curr.getMonth() + 1);
      const first = new Date(curr.getFullYear(), curr.getMonth(), 1);
      const last = new Date(curr.getFullYear(), curr.getMonth() + 1, 0);
      setStartDate(formatDateParam(first)); setEndDate(formatDateParam(last));
  }
  const handleJumpToToday = () => {
      const now = new Date();
      const first = new Date(now.getFullYear(), now.getMonth(), 1);
      const last = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      setStartDate(formatDateParam(first)); setEndDate(formatDateParam(last));
      setTriggerScrollToToday(true);
  }
  const handleDateRangeApply = (s, e) => { setStartDate(s); setEndDate(e); }

  const groupedData = useMemo(() => {
      if (!viewSettings.grouped) return null;
      const groups = {};
      displayedEmployees.forEach(emp => {
          let groupKey = viewSettings.groupBy === 'unit' ? emp.unit : emp.job;
          if (!groupKey) groupKey = 'Khác';
          if (!groups[groupKey]) groups[groupKey] = [];
          groups[groupKey].push(emp);
      });
      return groups;
  }, [displayedEmployees, viewSettings]);

  const getShiftsForCell = (employeeId, date) => {
    const key = `${employeeId}_${date}`;
    return shifts[key] || [];
  }

  // --- HANDLER SỬA/XÓA CA ---
  const handleCellClick = (action, empId, date, cellShifts) => {
      const target = { empId, date, shifts: cellShifts };
      if (action === 'edit') {
          setModalState({ ...modalState, editVisible: true, targetCell: target });
      } else if (action === 'delete') {
          // Chỉ mở modal xóa nếu có ca
          if (cellShifts && cellShifts.length > 0) {
              setModalState({ ...modalState, deleteVisible: true, targetCell: target });
          }
      }
  }

  const handleSaveShift = (newShiftInfo) => {
      const { targetCell } = modalState;
      if (!targetCell || !newShiftInfo) return;

      const key = `${targetCell.empId}_${targetCell.date}`;
      const newShiftEntry = {
          id: Date.now(), // Fake ID
          employeeId: targetCell.empId,
          date: targetCell.date,
          shiftCode: newShiftInfo.id,
          startTime: newShiftInfo.start,
          endTime: newShiftInfo.end
      };

      // Cập nhật State: Ghi đè ca cũ bằng ca mới (hoặc thêm mới)
      setShifts(prev => ({
          ...prev,
          [key]: [newShiftEntry]
      }));
  }

  const handleDeleteShift = () => {
      const { targetCell } = modalState;
      if (!targetCell) return;
      const key = `${targetCell.empId}_${targetCell.date}`;
      
      // Xóa key khỏi object shifts (hoặc set thành mảng rỗng)
      setShifts(prev => {
          const next = { ...prev };
          delete next[key];
          return next;
      });
  }

  const handleExportExcel = () => {
    const headerRow = ['Mã NV', 'Tên NV', 'Đơn vị', 'Vị trí', ...weekDays.map(d => `${d.day} (${d.date})`)];
    const csvRows = [headerRow.join(',')];
    displayedEmployees.forEach(emp => {
      const row = [`"${emp.id}"`, `"${emp.name}"`, `"${emp.unit}"`, `"${emp.job}"`];
      weekDays.forEach(day => {
        const cellShifts = getShiftsForCell(emp.id, day.fullDate);
        const cellContent = cellShifts.map(s => {
            let txt = s.shiftCode;
            if(viewSettings.showTime) txt += ` (${s.startTime}-${s.endTime})`;
            return txt;
        }).join(' + ');
        row.push(`"${cellContent}"`);
      });
      csvRows.push(row.join(','));
    });
    const csvString = csvRows.join('\n');
    const blob = new Blob(['\uFEFF' + csvString], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'bang_phan_ca.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const renderEmployeeRow = (emp) => (
    <React.Fragment key={emp.id}>
        <div className="grid-cell col-header employee-cell">
            <CFormCheck className="me-2" />
            <div className="employee-avatar">{emp.avatar}</div>
            <div className="employee-info">
                <div className="employee-name">{emp.name}</div>
                <div className="employee-id">{emp.id}</div>
            </div>
        </div>
        {weekDays.map((day) => {
            const cellShifts = getShiftsForCell(emp.id, day.fullDate);
            const hasShift = cellShifts.length > 0;
            return (
                <div key={`${emp.id}_${day.date}`} className={`grid-cell shift-cell ${day.isToday ? 'is-today-col' : ''}`}>
                    {/* Nút Action hiện khi Hover */}
                    <div className="cell-hover-actions">
                        <CTooltip content={hasShift ? "Sửa phân ca" : "Thêm phân ca"}>
                            <button className="action-btn-mini edit" onClick={() => handleCellClick('edit', emp.id, day.fullDate, cellShifts)}>
                                <CIcon icon={cilPencil} size="sm" />
                            </button>
                        </CTooltip>
                        {hasShift && (
                            <CTooltip content="Xóa phân ca">
                                <button className="action-btn-mini delete" onClick={() => handleCellClick('delete', emp.id, day.fullDate, cellShifts)}>
                                    <CIcon icon={cilTrash} size="sm" />
                                </button>
                            </CTooltip>
                        )}
                    </div>

                    {/* Hiển thị ca làm việc */}
                    {cellShifts.map((shift) => (
                        <div key={shift.id} className="shift-item">
                            <div className="shift-tag">
                                <span className="shift-dot"></span>{shift.shiftCode}
                            </div>
                            {viewSettings.showTime && <div className="shift-time">{shift.startTime} - {shift.endTime}</div>}
                        </div>
                    ))}
                </div>
            )
        })}
    </React.Fragment>
  );

  return (
    <React.Fragment>
      <ShiftSummaryStyles />
      <div className="page-container">
        <div className="summary-header">
          <h2 className="summary-title">Bảng phân ca tổng hợp</h2>
          <div className="summary-header-tabs">
            <button className="tab-button active">Nhân viên</button>
            <button className="tab-button" onClick={() => navigate('/timesheet/shiftassignmentSummary/unit')}>Đơn vị</button>
            <button className="tab-button" onClick={() => navigate('/timesheet/shiftassignmentSummary/shift')}>Ca làm việc</button>
          </div>
          <div className="summary-header-actions">
            <CButton color="secondary" variant="outline" onClick={handleJumpToToday}>Hôm nay</CButton>
            <CButton className="btn-orange" onClick={() => setShowBulkModal(true)}>Phân ca hàng loạt</CButton>
            <CButton color="secondary" variant="outline" className="ms-auto"><CIcon icon={cilOptions} /></CButton>
          </div>
        </div>

        <div className="summary-filter-bar">
          <div className="filter-left">
            <CInputGroup className="search-bar">
              <CInputGroupText><CIcon icon={cilSearch} /></CInputGroupText>
              <CFormInput placeholder="Tìm kiếm nhân viên..." value={filters.search} onChange={(e) => setFilters(p => ({...p, search: e.target.value}))} />
            </CInputGroup>
            <CDropdown>
              <CDropdownToggle color="secondary" variant="outline">Trạng thái: {filters.status === 'assigned' ? 'Đã phân ca' : filters.status === 'unassigned' ? 'Chưa phân ca' : 'Tất cả'}</CDropdownToggle>
              <CDropdownMenu>
                <CDropdownItem onClick={() => setFilters(p => ({...p, status: 'all'}))}>Tất cả</CDropdownItem>
                <CDropdownItem onClick={() => setFilters(p => ({...p, status: 'assigned'}))}>Đã phân ca</CDropdownItem>
                <CDropdownItem onClick={() => setFilters(p => ({...p, status: 'unassigned'}))}>Chưa phân ca</CDropdownItem>
              </CDropdownMenu>
            </CDropdown>
          </div>
          <div className="filter-right">
            <div className="date-range-picker">
              <CButton color="secondary" variant="ghost" onClick={handlePrevMonth}><CIcon icon={cilChevronLeft} /></CButton>
              <span className="date-range-text">{formatDisplayDate(startDate)} - {formatDisplayDate(endDate)}</span>
              <CButton color="secondary" variant="ghost" onClick={handleNextMonth}><CIcon icon={cilChevronRight} /></CButton>
              <span className="date-range-icon" onClick={() => setShowDateRangeModal(true)}><CIcon icon={cilCalendar} /></span>
            </div>
            <CDropdown>
              <CDropdownToggle color="secondary" variant="outline">Tất cả đơn vị</CDropdownToggle>
              <CDropdownMenu><CDropdownItem>HRS</CDropdownItem><CDropdownItem>Nhà máy</CDropdownItem></CDropdownMenu>
            </CDropdown>
            <div title="Xuất Excel"><CButton color="secondary" variant="outline" onClick={handleExportExcel}>Xuất Excel</CButton></div>
            <div style={{ position: 'relative' }}>
                <CButton color="secondary" variant="outline" onClick={() => setShowSettings(!showSettings)}><CIcon icon={cilSettings} /></CButton>
                <SettingsPopup visible={showSettings} onClose={() => setShowSettings(false)} currentSettings={viewSettings} onSave={setViewSettings} />
            </div>
          </div>
        </div>

        <div className="schedule-grid-container" ref={scrollContainerRef}>
          {loading ? <div className="d-flex justify-content-center p-5"><CSpinner color="primary" /></div> : (
            <div className="schedule-grid" style={{ gridTemplateColumns: `250px repeat(${weekDays.length}, minmax(180px, 1fr))` }}>
              <div className="grid-cell col-header grid-header"><CFormCheck className="me-2" /> Nhân viên</div>
              {weekDays.map((day) => (<div key={day.fullDate} className={`grid-cell grid-header ${day.isToday ? 'is-today' : ''} ${day.isWeekend ? 'is-weekend' : ''}`}><div className="day-of-week">{day.day}</div><div className="date-number">{day.date}</div></div>))}
              {viewSettings.grouped && groupedData ? Object.keys(groupedData).map(groupName => (<React.Fragment key={groupName}><div className="group-header-row">{groupName} ({groupedData[groupName].length})</div>{groupedData[groupName].map(emp => renderEmployeeRow(emp))}</React.Fragment>)) : displayedEmployees.map(emp => renderEmployeeRow(emp))}
              {displayedEmployees.length === 0 && <div style={{gridColumn: `1 / span ${weekDays.length + 1}`, padding: '2rem', textAlign: 'center', color: '#888'}}>Không tìm thấy nhân viên nào phù hợp trong khoảng thời gian này.</div>}
            </div>
          )}
        </div>
      </div>

      <BulkAssignmentModal visible={showBulkModal} onClose={() => setShowBulkModal(false)} availableShifts={MOCK_AVAILABLE_SHIFTS} employees={MOCK_EMPLOYEES} orgUnits={MOCK_ORG_UNITS} />
      <DateRangeModal visible={showDateRangeModal} onClose={() => setShowDateRangeModal(false)} initialStart={startDate} initialEnd={endDate} onApply={handleDateRangeApply} />
      
      {/* MODAL SỬA CA */}
      <EditShiftModal 
        visible={modalState.editVisible} 
        onClose={() => setModalState(p => ({...p, editVisible: false}))} 
        onSave={handleSaveShift}
        targetCell={modalState.targetCell}
        availableShifts={MOCK_AVAILABLE_SHIFTS}
        employees={MOCK_EMPLOYEES}
      />

      {/* MODAL XÓA CA */}
      <DeleteShiftModal 
        visible={modalState.deleteVisible} 
        onClose={() => setModalState(p => ({...p, deleteVisible: false}))} 
        onConfirm={handleDeleteShift}
        targetCell={modalState.targetCell}
        employees={MOCK_EMPLOYEES}
      />

    </React.Fragment>
  )
}

export default ShiftAssignmentSummary