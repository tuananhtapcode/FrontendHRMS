
import {
  CButton,
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
  CSpinner,
  CTooltip // Nhớ import CTooltip
} from '@coreui/react'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'

// Imports Icons
import {
  cilBuilding,
  cilCalendar,
  cilChevronLeft,
  cilChevronRight,
  cilOptions,
  cilPencil,
  cilSearch,
  cilSettings, // Icon Sửa
  cilTrash // Icon Xóa
  ,





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
    const today = new Date(); today.setHours(0,0,0,0);
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
// 1. CSS CUSTOM (Đã thêm CSS cho Hover Action)
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
    .filter-left { display: flex; gap: 12px; align-items: center; }
    .filter-left .search-bar { width: 250px; }
    .filter-right { display: flex; gap: 12px; align-items: center; }
    
    .date-range-picker { display: flex; align-items: center; border: 1px solid #ccc; border-radius: 0.375rem; background: #fff; }
    .date-range-picker .btn { border: none; }
    .date-range-text { padding: 0 0.5rem; font-weight: 500; font-size: 0.9rem; min-width: 220px; text-align: center; }
    .date-range-icon { padding: 0 0.5rem; border-left: 1px solid #ccc; cursor: pointer; color: #666; }
    .date-range-icon:hover { background-color: #f0f0f0; }

    .schedule-grid-container { flex-grow: 1; overflow: auto; border: 1px solid #ccc; border-radius: 0.375rem; position: relative; scroll-behavior: smooth; }
    .schedule-grid { display: grid; width: max-content; min-width: 100%; }

    .grid-cell { padding: 0.5rem; border-right: 1px solid #eee; border-bottom: 1px solid #eee; background-color: #fff; display: flex; align-items: center; }
    .grid-header { font-weight: 600; justify-content: center; flex-direction: column; position: sticky; top: 0; z-index: 20; border-bottom: 1px solid #ccc; }
    .grid-header.is-today { color: #e55353; background-color: #fff5f5 !important; }
    .grid-header.is-weekend { background-color: #fafafa; color: #e55353; }
    .grid-header .day-of-week { font-size: 0.8rem; text-transform: uppercase; }
    .grid-header .date-number { font-size: 1.2rem; }

    .grid-cell.col-header { font-weight: 600; position: sticky; left: 0; z-index: 10; border-right: 1px solid #ccc; background-color: #fff; min-width: 280px; }
    .grid-cell.col-header.grid-header { z-index: 30; } 
    .group-header-row { grid-column: 1 / -1; background-color: #f8f9fa; font-weight: 700; padding: 0.75rem; border-bottom: 1px solid #ccc; position: sticky; left: 0; }

    .btn-orange { background-color: #ea580c; border-color: #ea580c; color: white; font-weight: 600; }
    .btn-orange:hover { background-color: #c2410c; color: white; border-color: #c2410c; }

    .unit-cell { display: flex; align-items: center; }
    .unit-avatar { width: 36px; height: 36px; border-radius: 6px; background-color: #ebedef; color: #4f5d73; display: flex; align-items: center; justify-content: center; margin-right: 10px; }
    .unit-info { line-height: 1.2; }
    .unit-name { font-weight: 600; font-size: 0.9rem; color: #333; }
    .unit-meta { font-size: 0.75rem; color: #8a93a2; }

    /* === SHIFT CELL & ACTIONS === */
    .shift-cell { 
        min-height: 60px; 
        vertical-align: top; 
        display: flex; 
        flex-direction: column; 
        align-items: flex-start; 
        justify-content: center;
        position: relative; /* Quan trọng để định vị nút */
    }
    .shift-cell:hover { background-color: #f8f9fa; }
    .shift-cell.is-today-col { background-color: #fff8f8; }
    
    .shift-tag { font-size: 0.85rem; font-weight: 600; display: flex; align-items: center; color: #333; }
    .shift-dot { width: 6px; height: 6px; border-radius: 50%; margin-right: 6px; background-color: #333; }
    .shift-time { font-size: 0.75rem; color: #768192; margin-left: 12px; margin-top: 1px; }

    /* CSS cho các nút Hover */
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

    .settings-popup { position: absolute; top: 100%; right: 0; width: 320px; background: white; border: 1px solid #d8dbe0; box-shadow: 0 4px 12px rgba(0,0,0,0.15); border-radius: 4px; z-index: 100; margin-top: 5px; }
    .popup-header { display: flex; justify-content: space-between; align-items: center; padding: 12px 16px; border-bottom: 1px solid #ebedef; font-weight: 700; }
    .popup-body { padding: 16px; }
    .popup-section { margin-bottom: 16px; }
    .popup-section-title { font-weight: 600; font-size: 0.9rem; margin-bottom: 8px; display: block; }
    .popup-footer { padding: 12px 16px; border-top: 1px solid #ebedef; display: flex; justify-content: flex-end; gap: 8px; background-color: #f9fafb; }
    .text-orange { color: #ea580c; cursor: pointer; font-weight: 500; text-decoration: none; }
    .text-orange:hover { text-decoration: underline; }
    `}
  </style>
)

// =====================================================================
// 2. MOCK DATA
// =====================================================================
const [MOCK_UNITS, MOCK_UNIT_SHIFTS, MOCK_AVAILABLE_SHIFTS] = (() => {
  const units = [
    { id: 'PKT', name: 'Phòng Kỹ Thuật', memberCount: 12, parent: 'Khối CN' },
    { id: 'PNS', name: 'Phòng Nhân Sự', memberCount: 5, parent: 'Khối BO' },
    { id: 'KHO', name: 'Kho Vận', memberCount: 8, parent: 'Khối VH' },
    { id: 'PKD', name: 'Phòng Kinh Doanh', memberCount: 15, parent: 'Khối BO' },
    { id: 'BGD', name: 'Ban Giám Đốc', memberCount: 3, parent: 'BGD' },
  ]

  const today = new Date();
  const currentMonthPrefix = `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, '0')}`;
  const dayStr = today.getDate().toString().padStart(2, '0');
  
  const shifts = [
    { id: 1, unitId: 'PKT', date: `${currentMonthPrefix}-${dayStr}`, shiftCode: 'HC', startTime: '08:00', endTime: '17:30' },
    { id: 2, unitId: 'PKT', date: `${currentMonthPrefix}-02`, shiftCode: 'HC', startTime: '08:00', endTime: '17:30' },
    { id: 3, unitId: 'PNS', date: `${currentMonthPrefix}-${dayStr}`, shiftCode: 'HC', startTime: '08:00', endTime: '17:30' },
    { id: 4, unitId: 'KHO', date: `${currentMonthPrefix}-${dayStr}`, shiftCode: 'TCT', startTime: '08:00', endTime: '08:30' },
    { id: 5, unitId: 'PKT', date: `${currentMonthPrefix}-${dayStr}`, shiftCode: 'TCT', startTime: '18:00', endTime: '20:00' },
  ]

  const availableShifts = [
      { id: 'HC', name: 'HC (08:00 - 17:30)', start: '08:00', end: '17:30' },
      { id: 'abc123', name: 'abc123 (08:00 - 08:30)', start: '08:00', end: '08:30' },
      { id: 'TCT', name: 'TCT (08:00 - 08:30)', start: '08:00', end: '08:30' },
      { id: 'CA_CHIEU', name: 'Ca Chiều (13:30 - 22:00)', start: '13:30', end: '22:00' },
  ]

  return [units, shifts, availableShifts]
})()

// =====================================================================
// 3. SUB-COMPONENTS & MODALS
// =====================================================================

// --- MODAL SỬA (EDIT) ---
const EditUnitShiftModal = ({ visible, onClose, onSave, targetCell, availableShifts, units }) => {
    const [selectedShift, setSelectedShift] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        if (visible && targetCell) {
            // Lấy ca đầu tiên nếu có, hoặc rỗng
            const currentShift = targetCell.shifts && targetCell.shifts.length > 0 ? targetCell.shifts[0].shiftCode : '';
            setSelectedShift(currentShift);
            setSearchTerm('');
        }
    }, [visible, targetCell]);

    const unitName = targetCell ? units.find(u => u.id === targetCell.unitId)?.name : '';
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
            <CModalHeader><CModalTitle>Phân ca cho Đơn vị</CModalTitle></CModalHeader>
            <CModalBody>
                <p className="mb-2"><strong>Đơn vị:</strong> {unitName}</p>
                <p className="mb-3"><strong>Ngày:</strong> {formatDisplayDate(targetCell?.date)}</p>
                
                <CFormLabel>Chọn ca làm việc áp dụng</CFormLabel>
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

// --- MODAL XÓA (DELETE) ---
const DeleteUnitShiftModal = ({ visible, onClose, onConfirm, targetCell, units }) => {
    const unitName = targetCell ? units.find(u => u.id === targetCell.unitId)?.name : '';
    
    return (
        <CModal visible={visible} onClose={onClose} alignment="center">
            <CModalHeader><CModalTitle>Xác nhận xóa</CModalTitle></CModalHeader>
            <CModalBody>
                Bạn có chắc chắn muốn xóa phân ca ngày <strong>{formatDisplayDate(targetCell?.date)}</strong> của đơn vị <strong>{unitName}</strong> không?
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
    useEffect(() => { if(visible) { setStart(initialStart); setEnd(initialEnd); } }, [visible, initialStart, initialEnd]);
    return (
        <CModal visible={visible} onClose={onClose} alignment="center" size="sm">
            <CModalHeader><CModalTitle>Chọn khoảng thời gian</CModalTitle></CModalHeader>
            <CModalBody>
                <div className="mb-3"><CFormLabel>Từ ngày</CFormLabel><CFormInput type="date" value={start} onChange={e => setStart(e.target.value)} /></div>
                <div className="mb-3"><CFormLabel>Đến ngày</CFormLabel><CFormInput type="date" value={end} onChange={e => setEnd(e.target.value)} /></div>
            </CModalBody>
            <CModalFooter><CButton color="light" onClick={onClose}>Hủy</CButton><CButton className="btn-orange" onClick={() => { onApply(start, end); onClose(); }}>Áp dụng</CButton></CModalFooter>
        </CModal>
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
                <div className="popup-section mb-0"><span className="popup-section-title">Gom nhóm</span><CFormCheck type="radio" label="Có" checked={localSettings.grouped === true} onChange={() => setLocalSettings(p => ({...p, grouped: true}))} />{localSettings.grouped && (<div className="ms-4 mt-2"><CFormSelect size="sm" value={localSettings.groupBy} onChange={(e) => setLocalSettings(p => ({...p, groupBy: e.target.value}))}><option value="parent">Đơn vị cha</option></CFormSelect></div>)}<CFormCheck type="radio" label="Không" className="mt-2" checked={localSettings.grouped === false} onChange={() => setLocalSettings(p => ({...p, grouped: false}))} /></div>
            </div>
            <div className="popup-footer"><CButton color="light" size="sm" onClick={() => setLocalSettings({ showTime: false, grouped: false, groupBy: 'parent' })}>Mặc định</CButton><CButton className="btn-orange" size="sm" onClick={() => { onSave(localSettings); onClose(); }}>Lưu</CButton></div>
        </div>
    )
}

// =====================================================================
// 4. COMPONENT CHÍNH
// =====================================================================
const ShiftAssignmentByUnit = () => {
  const [units, setUnits] = useState([])
  const [displayedUnits, setDisplayedUnits] = useState([]) 
  const [shifts, setShifts] = useState({}) 
  const [weekDays, setWeekDays] = useState([])
  const [loading, setLoading] = useState(true)

  const today = new Date();
  const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
  const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
  
  const [startDate, setStartDate] = useState(formatDateParam(firstDay));
  const [endDate, setEndDate] = useState(formatDateParam(lastDay));

  const [filters, setFilters] = useState({ search: '', status: 'all' })
  const [viewSettings, setViewSettings] = useState({ showTime: false, grouped: false, groupBy: 'parent' })
  
  const [showSettings, setShowSettings] = useState(false)
  const [showDateRangeModal, setShowDateRangeModal] = useState(false)
  const [triggerScrollToToday, setTriggerScrollToToday] = useState(false);
  const scrollContainerRef = useRef(null);

  // -- STATE QUẢN LÝ MODAL SỬA/XÓA --
  const [modalState, setModalState] = useState({
      editVisible: false,
      deleteVisible: false,
      targetCell: null // { unitId, date, shifts: [] }
  });

  const navigate = useNavigate()

  useEffect(() => {
      setWeekDays(generateDaysArray(startDate, endDate));
  }, [startDate, endDate]);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
        setUnits(MOCK_UNITS);
        const shiftMap = MOCK_UNIT_SHIFTS.reduce((acc, shift) => {
            const key = `${shift.unitId}_${shift.date}`;
            if (!acc[key]) acc[key] = [];
            acc[key].push(shift);
            return acc;
        }, {});
        setShifts(shiftMap);
        setLoading(false);
    }, 300);
  }, []); 

  // SCROLL LOGIC
  useEffect(() => {
      if (triggerScrollToToday && !loading && weekDays.length > 0) {
          setTimeout(() => {
              const container = scrollContainerRef.current;
              const todayHeader = container?.querySelector('.grid-header.is-today');
              if (container && todayHeader) {
                  container.scrollTo({ left: todayHeader.offsetLeft - 280, behavior: 'smooth' }); 
              }
              setTriggerScrollToToday(false);
          }, 100);
      }
  }, [triggerScrollToToday, loading, weekDays]);

  useEffect(() => {
    if (units.length > 0) {
      let result = [...units];
      if (filters.search.trim()) {
        const searchTerm = filters.search.toLowerCase();
        result = result.filter(u => u.name.toLowerCase().includes(searchTerm));
      }
      if (filters.status !== 'all') {
        result = result.filter(u => {
          const hasAnyShift = weekDays.some(day => {
             const key = `${u.id}_${day.fullDate}`;
             return shifts[key] && shifts[key].length > 0;
          });
          return filters.status === 'assigned' ? hasAnyShift : !hasAnyShift;
        });
      }
      setDisplayedUnits(result);
    }
  }, [filters, units, shifts, weekDays]);

  // Handlers Date Nav
  const handlePrevMonth = () => {
      const curr = new Date(startDate); curr.setMonth(curr.getMonth() - 1);
      setStartDate(formatDateParam(new Date(curr.getFullYear(), curr.getMonth(), 1)));
      setEndDate(formatDateParam(new Date(curr.getFullYear(), curr.getMonth() + 1, 0)));
  }
  const handleNextMonth = () => {
      const curr = new Date(startDate); curr.setMonth(curr.getMonth() + 1);
      setStartDate(formatDateParam(new Date(curr.getFullYear(), curr.getMonth(), 1)));
      setEndDate(formatDateParam(new Date(curr.getFullYear(), curr.getMonth() + 1, 0)));
  }
  const handleJumpToToday = () => {
      const now = new Date();
      setStartDate(formatDateParam(new Date(now.getFullYear(), now.getMonth(), 1)));
      setEndDate(formatDateParam(new Date(now.getFullYear(), now.getMonth() + 1, 0)));
      setTriggerScrollToToday(true);
  }

  const groupedData = useMemo(() => {
      if (!viewSettings.grouped) return null;
      const groups = {};
      displayedUnits.forEach(u => {
          let groupKey = u.parent || 'Khác';
          if (!groups[groupKey]) groups[groupKey] = [];
          groups[groupKey].push(u);
      });
      return groups;
  }, [displayedUnits, viewSettings]);

  const getShiftsForCell = (unitId, date) => {
    const key = `${unitId}_${date}`;
    return shifts[key] || [];
  }

  const handleExportExcel = () => {
    const headerRow = ['Mã ĐV', 'Tên Đơn vị', 'Thành viên', ...weekDays.map(d => `${d.day} (${d.date})`)];
    const csvRows = [headerRow.join(',')];
    displayedUnits.forEach(u => {
      const row = [`"${u.id}"`, `"${u.name}"`, `"${u.memberCount}"`];
      weekDays.forEach(day => {
        const cellShifts = getShiftsForCell(u.id, day.fullDate);
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
    link.setAttribute('download', 'bang_phan_ca_don_vi.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  // --- HANDLER CHO NÚT SỬA/XÓA ---
  const handleCellClick = (action, unitId, date, cellShifts) => {
      const target = { unitId, date, shifts: cellShifts };
      if (action === 'edit') {
          setModalState({ ...modalState, editVisible: true, targetCell: target });
      } else if (action === 'delete') {
          if (cellShifts && cellShifts.length > 0) {
              setModalState({ ...modalState, deleteVisible: true, targetCell: target });
          }
      }
  }

  // Save Shift Logic
  const handleSaveShift = (newShiftInfo) => {
      const { targetCell } = modalState;
      if (!targetCell || !newShiftInfo) return;

      const key = `${targetCell.unitId}_${targetCell.date}`;
      const newShiftEntry = {
          id: Date.now(), 
          unitId: targetCell.unitId,
          date: targetCell.date,
          shiftCode: newShiftInfo.id,
          startTime: newShiftInfo.start,
          endTime: newShiftInfo.end
      };

      setShifts(prev => ({
          ...prev,
          [key]: [newShiftEntry]
      }));
  }

  // Delete Shift Logic
  const handleDeleteShift = () => {
      const { targetCell } = modalState;
      if (!targetCell) return;
      const key = `${targetCell.unitId}_${targetCell.date}`;
      
      setShifts(prev => {
          const next = { ...prev };
          delete next[key];
          return next;
      });
  }

  const renderUnitRow = (unit) => (
    <React.Fragment key={unit.id}>
        <div className="grid-cell col-header unit-cell">
            <CFormCheck className="me-2" />
            <div className="unit-avatar"><CIcon icon={cilBuilding} /></div>
            <div className="unit-info">
                <div className="unit-name">{unit.name}</div>
                <div className="unit-meta">{unit.memberCount} thành viên</div>
            </div>
        </div>
        {weekDays.map((day) => {
            const cellShifts = getShiftsForCell(unit.id, day.fullDate);
            const hasShift = cellShifts.length > 0;
            return (
                <div key={`${unit.id}_${day.date}`} className={`grid-cell shift-cell ${day.isToday ? 'is-today-col' : ''}`}>
                    {/* Hover Actions */}
                    <div className="cell-hover-actions">
                        <CTooltip content={hasShift ? "Sửa phân ca" : "Thêm phân ca"}>
                            <button className="action-btn-mini edit" onClick={() => handleCellClick('edit', unit.id, day.fullDate, cellShifts)}>
                                <CIcon icon={cilPencil} size="sm" />
                            </button>
                        </CTooltip>
                        {hasShift && (
                            <CTooltip content="Xóa phân ca">
                                <button className="action-btn-mini delete" onClick={() => handleCellClick('delete', unit.id, day.fullDate, cellShifts)}>
                                    <CIcon icon={cilTrash} size="sm" />
                                </button>
                            </CTooltip>
                        )}
                    </div>

                    {/* Shift Display */}
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
            <button className="tab-button" onClick={() => navigate('/timesheet/shiftassignmentSummary')}>Nhân viên</button>
            <button className="tab-button active" onClick={() => {}}>Đơn vị</button>
            <button className="tab-button" onClick={() => navigate('/timesheet/shiftassignmentSummary/shift')}>Ca làm việc</button>
          </div>
          <div className="summary-header-actions">
            <CButton color="secondary" variant="outline" onClick={handleJumpToToday}>Hôm nay</CButton>
            <CButton color="secondary" variant="outline" className="ms-auto"><CIcon icon={cilOptions} /></CButton>
          </div>
        </div>

        <div className="summary-filter-bar">
          <div className="filter-left">
            <CInputGroup className="search-bar">
              <CInputGroupText><CIcon icon={cilSearch} /></CInputGroupText>
              <CFormInput placeholder="Tìm kiếm đơn vị..." value={filters.search} onChange={(e) => setFilters(p => ({...p, search: e.target.value}))} />
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
              <CDropdownToggle color="secondary" variant="outline">Tất cả khối</CDropdownToggle>
              <CDropdownMenu><CDropdownItem>Khối BO</CDropdownItem><CDropdownItem>Khối CN</CDropdownItem></CDropdownMenu>
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
            <div className="schedule-grid" style={{ gridTemplateColumns: `280px repeat(${weekDays.length}, minmax(180px, 1fr))` }}>
              <div className="grid-cell col-header grid-header"><CFormCheck className="me-2" /> Đơn vị</div>
              {weekDays.map((day) => (<div key={day.fullDate} className={`grid-cell grid-header ${day.isToday ? 'is-today' : ''} ${day.isWeekend ? 'is-weekend' : ''}`}><div className="day-of-week">{day.day}</div><div className="date-number">{day.date}</div></div>))}
              {viewSettings.grouped && groupedData ? Object.keys(groupedData).map(groupName => (<React.Fragment key={groupName}><div className="group-header-row">{groupName} ({groupedData[groupName].length})</div>{groupedData[groupName].map(u => renderUnitRow(u))}</React.Fragment>)) : displayedUnits.map(u => renderUnitRow(u))}
              {displayedUnits.length === 0 && <div style={{gridColumn: `1 / span ${weekDays.length + 1}`, padding: '2rem', textAlign: 'center', color: '#888'}}>Không tìm thấy đơn vị nào phù hợp trong khoảng thời gian này.</div>}
            </div>
          )}
        </div>
      </div>

      <DateRangeModal visible={showDateRangeModal} onClose={() => setShowDateRangeModal(false)} initialStart={startDate} initialEnd={endDate} onApply={(s, e) => { setStartDate(s); setEndDate(e); }} />
      
      {/* MODALS SỬA/XÓA */}
      <EditUnitShiftModal 
        visible={modalState.editVisible} 
        onClose={() => setModalState(p => ({...p, editVisible: false}))} 
        onSave={handleSaveShift}
        targetCell={modalState.targetCell}
        availableShifts={MOCK_AVAILABLE_SHIFTS}
        units={MOCK_UNITS}
      />

      <DeleteUnitShiftModal 
        visible={modalState.deleteVisible} 
        onClose={() => setModalState(p => ({...p, deleteVisible: false}))} 
        onConfirm={handleDeleteShift}
        targetCell={modalState.targetCell}
        units={MOCK_UNITS}
      />

    </React.Fragment>
  )
}

export default ShiftAssignmentByUnit

