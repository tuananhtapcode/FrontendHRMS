// import {
//   CButton,
//   CDropdown,
//   CDropdownItem,
//   CDropdownMenu,
//   CDropdownToggle,
//   CFormCheck,
//   CFormInput,
//   CFormLabel,
//   CFormSelect,
//   CInputGroup,
//   CInputGroupText,
//   CModal,
//   CModalBody,
//   CModalFooter,
//   CModalHeader,
//   CModalTitle,
//   CSpinner,
//   CTable,
//   CTableBody,
//   CTableDataCell,
//   CTableHead,
//   CTableHeaderCell,
//   CTableRow
// } from '@coreui/react'
// import React, { useEffect, useMemo, useRef, useState } from 'react'
// import { useNavigate } from 'react-router-dom'

// // Imports Icons
// import {
//   cilCalendar,
//   cilCaretBottom,
//   cilCaretRight,
//   cilChevronLeft,
//   cilChevronRight,
//   cilOptions,
//   cilPlus,
//   cilSearch,
//   cilSettings,
//   cilUser,
//   cilX
// } from '@coreui/icons'
// import CIcon from '@coreui/icons-react'
// import { shiftscheduleApi } from '../../api/shiftscheduleApi'
// // =====================================================================
// // 0. UTILS
// // =====================================================================
// const formatDateParam = (date) => {
//   const d = new Date(date);
//   const year = d.getFullYear();
//   const month = (d.getMonth() + 1).toString().padStart(2, '0');
//   const day = d.getDate().toString().padStart(2, '0');
//   return `${year}-${month}-${day}`;
// };

// const formatDisplayDate = (dateStr) => {
//   if (!dateStr) return '';
//   const [year, month, day] = dateStr.split('-');
//   return `${day}/${month}/${year}`;
// };

// const getDayName = (date) => {
//   const days = ['Chủ nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];
//   return days[date.getDay()];
// };

// const generateDaysArray = (start, end) => {
//   const arr = [];
//   const dt = new Date(start);
//   const endDate = new Date(end);
//   dt.setHours(0, 0, 0, 0);
//   endDate.setHours(0, 0, 0, 0);
//   const today = new Date(); today.setHours(0, 0, 0, 0);
//   const todayStr = formatDateParam(today);

//   while (dt <= endDate) {
//     arr.push({
//       date: dt.getDate().toString().padStart(2, '0'),
//       day: getDayName(dt),
//       fullDate: formatDateParam(dt),
//       isToday: formatDateParam(dt) === todayStr,
//       isWeekend: dt.getDay() === 0 || dt.getDay() === 6
//     });
//     dt.setDate(dt.getDate() + 1);
//   }
//   return arr;
// };

// // =====================================================================
// // 1. CSS CUSTOM
// // =====================================================================
// const ShiftByShiftStyles = () => (
//   <style>
//     {`
//     .page-container { padding: 1rem; display: flex; flex-direction: column; height: calc(100vh - 70px); }
//     .summary-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; flex-shrink: 0; }
//     .summary-title { font-size: 1.75rem; font-weight: 500; }
//     .summary-header-tabs { flex-grow: 1; margin-left: 2rem; display: flex; gap: 5px; }

//     .tab-button { background: none; border: none; padding: 0.5rem 1rem; color: var(--cui-body-color); font-weight: 500; cursor: pointer; border-radius: 0.375rem; transition: all 0.15s; }
//     .tab-button:hover { color: #ea580c; background-color: #fff7ed; }
//     .tab-button.active { color: #ea580c; border-bottom: 2px solid #ea580c; border-radius: 0; }

//     .summary-header-actions { display: flex; gap: 12px; flex-shrink: 0; }
//     .summary-filter-bar { display: flex; justify-content: space-between; align-items: center; gap: 12px; margin-bottom: 1rem; flex-shrink: 0; }
//     .filter-left, .filter-right { display: flex; gap: 12px; align-items: center; }
//     .date-range-picker { display: flex; align-items: center; border: 1px solid #ccc; border-radius: 0.375rem; background: #fff; }
//     .date-range-text { padding: 0 0.5rem; font-weight: 500; min-width: 220px; text-align: center; }
//     .date-range-icon { padding: 0 0.5rem; border-left: 1px solid #ccc; cursor: pointer; color: #666; }
//     .btn-orange { background-color: #ea580c; border-color: #ea580c; color: white; font-weight: 600; }
//     .btn-orange:hover { background-color: #c2410c; color: white; border-color: #c2410c; }

//     /* GRID STYLES */
//     .schedule-grid-container { flex-grow: 1; overflow: auto; border: 1px solid #ccc; border-radius: 0.375rem; position: relative; scroll-behavior: smooth; }
//     .schedule-grid { display: grid; width: max-content; min-width: 100%; }
//     .grid-cell { padding: 0.5rem; border-right: 1px solid #eee; border-bottom: 1px solid #eee; background-color: #fff; display: flex; align-items: center; }

//     .grid-header { font-weight: 600; justify-content: center; flex-direction: column; position: sticky; top: 0; z-index: 20; border-bottom: 1px solid #ccc; }
//     .grid-header.is-today { color: #e55353; background-color: #fff5f5 !important; }
//     .grid-header.is-weekend { background-color: #fafafa; color: #e55353; }

//     .grid-cell.col-header { font-weight: 600; position: sticky; left: 0; z-index: 10; border-right: 1px solid #ccc; background-color: #fff; min-width: 280px; }
//     .grid-cell.col-header.grid-header { z-index: 30; }

//     /* Group Header Row */
//     .group-header-row { grid-column: 1 / -1; background-color: #f8f9fa; font-weight: 700; padding: 0.75rem; border-bottom: 1px solid #ccc; position: sticky; left: 0; z-index: 9; }

//     /* Shift Info Cell */
//     .shift-info-cell { display: flex; flex-direction: row; align-items: flex-start; justify-content: flex-start; padding: 10px; }
//     .toggle-icon { cursor: pointer; margin-right: 8px; margin-top: 4px; color: #666; }
//     .shift-details { display: flex; flex-direction: column; }
//     .shift-code { font-weight: 700; color: #333; margin-bottom: 2px; }
//     .shift-time-range { font-size: 0.8rem; color: #666; display: flex; align-items: center; }

//     /* Assignment Cell */
//     .assignment-cell { min-height: 60px; flex-direction: column; justify-content: flex-start; padding: 5px 10px; align-items: stretch; }
//     .assignment-cell.is-today-col { background-color: #fff8f8; }

//     .cell-header-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 5px; }
//     .count-badge { display: flex; align-items: center; color: #666; font-weight: 500; font-size: 0.95rem; }
//     .count-badge .icon { margin-right: 5px; color: #888; }

//     .btn-add-assign { color: #ea580c; cursor: pointer; padding: 2px 4px; border-radius: 4px; font-size: 1.2rem; line-height: 1; }
//     .btn-add-assign:hover { background-color: #fff7ed; }

//     /* Expanded List */
//     .employee-list-scrollable { max-height: 250px; overflow-y: auto; padding-right: 2px; }
//     .assigned-emp-item { display: flex; align-items: center; justify-content: space-between; padding: 6px; background-color: #f8f9fa; border-radius: 4px; margin-bottom: 4px; border: 1px solid transparent; }
//     .assigned-emp-item:hover { border-color: #ddd; background-color: #fff; }
//     .emp-left { display: flex; align-items: center; gap: 8px; overflow: hidden; }
//     .mini-avatar { width: 24px; height: 24px; border-radius: 50%; color: #fff; font-size: 0.7rem; display: flex; align-items: center; justify-content: center; font-weight: bold; flex-shrink: 0; }
//     .emp-text { display: flex; flex-direction: column; overflow: hidden; }
//     .emp-name-txt { font-size: 0.8rem; font-weight: 600; color: #333; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
//     .emp-id-txt { font-size: 0.7rem; color: #777; }
//     .btn-remove-emp { color: #e55353; cursor: pointer; opacity: 0.6; padding: 2px; }
//     .btn-remove-emp:hover { opacity: 1; }

//     /* POPUP SETTINGS */
//     .settings-popup { position: absolute; top: 100%; right: 0; width: 320px; background: white; border: 1px solid #d8dbe0; box-shadow: 0 4px 12px rgba(0,0,0,0.15); border-radius: 4px; z-index: 100; margin-top: 5px; }
//     .popup-header { display: flex; justify-content: space-between; align-items: center; padding: 12px 16px; border-bottom: 1px solid #ebedef; font-weight: 700; }
//     .popup-body { padding: 16px; }
//     .popup-section { margin-bottom: 16px; }
//     .popup-section-title { font-weight: 600; font-size: 0.9rem; margin-bottom: 8px; display: block; }
//     .popup-footer { padding: 12px 16px; border-top: 1px solid #ebedef; display: flex; justify-content: flex-end; gap: 8px; background-color: #f9fafb; }

//     /* Modal Table */
//     .custom-modal-table th { background-color: #f8f9fa; font-weight: 600; font-size: 0.85rem; }
//     .custom-modal-table td { vertical-align: middle; font-size: 0.9rem; }
//     .emp-info { display: flex; align-items: center; gap: 8px; }
//     .emp-avatar { width: 24px; height: 24px; border-radius: 50%; font-size: 0.7rem; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; }
//     `}
//   </style>
// )

// // =====================================================================
// // 2. MOCK DATA
// // =====================================================================
// const [MOCK_SHIFTS_DEFINITIONS, MOCK_EMPLOYEES] = (() => {
//   const shifts = [
//     { id: 'abc123', name: 'abc123', start: '08:00', end: '08:30', group: 'Ca Sáng' },
//     { id: 'HC', name: 'HC', start: '08:00', end: '17:30', group: 'Ca Hành Chính' },
//     { id: 'TC1', name: 'TC1', start: '08:00', end: '17:30', group: 'Ca Tăng Cường' },
//     { id: 'CA_DEM', name: 'Ca Đêm', start: '22:00', end: '06:00', group: 'Ca Đêm' },
//   ]

//   const employees = [
//     { id: 'NV000001', name: 'Thuận Nguyễn', unit: 'Thuận Nguyễn Phúc', avatarColor: '#d63384' },
//     { id: 'NV000002', name: 'Trần Hải Lâm', unit: 'Thuận Nguyễn Phúc', avatarColor: '#6f42c1' },
//     { id: 'NV000003', name: 'Phạm Thành Nam', unit: 'Thuận Nguyễn Phúc', avatarColor: '#0dcaf0' },
//     { id: 'NV000004', name: 'Lê Văn Cường', unit: 'Kho Vận', avatarColor: '#ffc107' },
//     { id: 'NV000005', name: 'Nguyễn Thị D', unit: 'Hành Chính', avatarColor: '#20c997' },
//   ]

//   return [shifts, employees]
// })()

// // =====================================================================
// // 3. SUB-COMPONENTS
// // =====================================================================

// const EmployeeSelectionModal = ({ visible, onClose, onConfirm, employees, shiftInfo, dateInfo }) => {
//   const [selectedIds, setSelectedIds] = useState([]);
//   const [search, setSearch] = useState('');

//   useEffect(() => {
//     if (visible) { setSelectedIds([]); setSearch(''); }
//   }, [visible]);

//   const handleCheck = (id) => setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);

//   const filteredEmployees = employees.filter(e =>
//     e.name.toLowerCase().includes(search.toLowerCase()) ||
//     e.id.toLowerCase().includes(search.toLowerCase())
//   );

//   return (
//     <CModal visible={visible} onClose={onClose} size="lg" alignment="center">
//       <CModalHeader><CModalTitle className="fw-bold">Chọn nhân viên</CModalTitle></CModalHeader>
//       <CModalBody className="p-0">
//         <div className="p-3 border-bottom">
//           <div className="mb-3 p-2 bg-light rounded text-muted small">
//             Đang phân ca: <span className="fw-bold text-dark">{shiftInfo?.name}</span>
//             <span className="mx-2">|</span>
//             Ngày: <span className="fw-bold text-dark">{dateInfo}</span>
//           </div>
//           <div className="d-flex gap-2">
//             <CInputGroup style={{ width: '300px' }}>
//               <CInputGroupText className="bg-white"><CIcon icon={cilSearch} /></CInputGroupText>
//               <CFormInput placeholder="Tìm kiếm" value={search} onChange={e => setSearch(e.target.value)} />
//             </CInputGroup>

//           </div>
//         </div>
//         <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
//           <CTable hover className="mb-0 custom-modal-table">
//             <CTableHead>
//               <CTableRow>
//                 <CTableHeaderCell className="text-center" style={{ width: '50px' }}><CFormCheck /></CTableHeaderCell>
//                 <CTableHeaderCell>Mã nhân viên</CTableHeaderCell>
//                 <CTableHeaderCell>Tên nhân viên</CTableHeaderCell>
//                 <CTableHeaderCell>Đơn vị công tác</CTableHeaderCell>
//                 <CTableHeaderCell>Vị trí công việc</CTableHeaderCell>
//               </CTableRow>
//             </CTableHead>
//             <CTableBody>
//               {filteredEmployees.map(emp => (
//                 <CTableRow key={emp.id}>
//                   <CTableDataCell className="text-center"><CFormCheck checked={selectedIds.includes(emp.id)} onChange={() => handleCheck(emp.id)} /></CTableDataCell>
//                   <CTableDataCell>{emp.id}</CTableDataCell>
//                   <CTableDataCell>
//                     <div className="emp-info"><div className="emp-avatar" style={{ backgroundColor: emp.avatarColor }}>{emp.name.split(' ').pop().substring(0, 2).toUpperCase()}</div>{emp.name}</div>
//                   </CTableDataCell>
//                   <CTableDataCell>{emp.unit}</CTableDataCell>
//                   <CTableDataCell>-</CTableDataCell>
//                 </CTableRow>
//               ))}
//             </CTableBody>
//           </CTable>
//         </div>
//       </CModalBody>
//       <CModalFooter>
//         <CButton color="light" onClick={onClose}>Hủy</CButton>
//         <CButton className="btn-orange text-white" onClick={() => onConfirm(selectedIds)}>Chọn</CButton>
//       </CModalFooter>
//     </CModal>
//   )
// }

// const DateRangeModal = ({ visible, onClose, initialStart, initialEnd, onApply }) => {
//   const [start, setStart] = useState(initialStart);
//   const [end, setEnd] = useState(initialEnd);
//   useEffect(() => { if (visible) { setStart(initialStart); setEnd(initialEnd); } }, [visible, initialStart, initialEnd]);
//   return (
//     <CModal visible={visible} onClose={onClose} alignment="center" size="sm">
//       <CModalHeader><CModalTitle>Chọn khoảng thời gian</CModalTitle></CModalHeader>
//       <CModalBody>
//         <div className="mb-3"><CFormLabel>Từ ngày</CFormLabel><CFormInput type="date" value={start} onChange={e => setStart(e.target.value)} /></div>
//         <div className="mb-3"><CFormLabel>Đến ngày</CFormLabel><CFormInput type="date" value={end} onChange={e => setEnd(e.target.value)} /></div>
//       </CModalBody>
//       <CModalFooter><CButton color="light" onClick={onClose}>Hủy</CButton><CButton className="btn-orange text-white" onClick={() => { onApply(start, end); onClose(); }}>Áp dụng</CButton></CModalFooter>
//     </CModal>
//   )
// }

// // --- POPUP CÀI ĐẶT (ĐÃ BỔ SUNG LẠI) ---
// const SettingsPopup = ({ visible, onClose, currentSettings, onSave }) => {
//   const [localSettings, setLocalSettings] = useState(currentSettings);
//   useEffect(() => { if (visible) setLocalSettings(currentSettings); }, [visible, currentSettings]);
//   if (!visible) return null;
//   return (
//     <div className="settings-popup">
//       <div className="popup-header"><span>Tùy chỉnh</span><CButton color="link" className="p-0 text-secondary" onClick={onClose}><CIcon icon={cilX} /></CButton></div>
//       <div className="popup-body">
//         <div className="popup-section">
//           <span className="popup-section-title">Tùy chọn hiển thị thời gian</span>
//           <CFormCheck type="radio" label="Hiển thị chi tiết giờ" checked={localSettings.showTime === true} onChange={() => setLocalSettings(p => ({ ...p, showTime: true }))} />
//           <CFormCheck type="radio" label="Ẩn chi tiết giờ" checked={localSettings.showTime === false} onChange={() => setLocalSettings(p => ({ ...p, showTime: false }))} />
//         </div>
//         <div className="popup-section mb-0">
//           <span className="popup-section-title">Gom nhóm bản ghi</span>
//           <CFormCheck type="radio" label="Có" checked={localSettings.grouped === true} onChange={() => setLocalSettings(p => ({ ...p, grouped: true }))} />
//           {localSettings.grouped && (<div className="ms-4 mt-2"><CFormSelect size="sm" value={localSettings.groupBy} onChange={(e) => setLocalSettings(p => ({ ...p, groupBy: e.target.value }))}><option value="group">Nhóm ca</option></CFormSelect></div>)}
//           <CFormCheck type="radio" label="Không" className="mt-2" checked={localSettings.grouped === false} onChange={() => setLocalSettings(p => ({ ...p, grouped: false }))} />
//         </div>
//       </div>
//       <div className="popup-footer"><CButton color="light" size="sm" onClick={() => setLocalSettings({ showTime: true, grouped: false, groupBy: 'group' })}>Mặc định</CButton><CButton className="btn-orange" size="sm" onClick={() => { onSave(localSettings); onClose(); }}>Lưu</CButton></div>
//     </div>
//   )
// }

// // =====================================================================
// // 5. MAIN COMPONENT: SHIFT ASSIGNMENT BY SHIFT
// // =====================================================================
// const ShiftAssignmentByShift = () => {
//   const navigate = useNavigate();
//   const [loading, setLoading] = useState(true);

//   const today = new Date();
//   const [startDate, setStartDate] = useState(formatDateParam(new Date(today.getFullYear(), today.getMonth(), 1)));
//   const [endDate, setEndDate] = useState(formatDateParam(new Date(today.getFullYear(), today.getMonth() + 1, 0)));
//   const [weekDays, setWeekDays] = useState([]);

//   // Data State
//   const [assignments, setAssignments] = useState({});
//   const [displayedShifts, setDisplayedShifts] = useState(MOCK_SHIFTS_DEFINITIONS);
//   const [filters, setFilters] = useState({ search: '' });

//   // Settings & Expand
//   const [expandedShifts, setExpandedShifts] = useState({});
//   const [viewSettings, setViewSettings] = useState({ showTime: true, grouped: false, groupBy: 'group' });
//   const [showSettings, setShowSettings] = useState(false);

//   const [modalState, setModalState] = useState({ visible: false, shift: null, date: null });
//   const [showDateRangeModal, setShowDateRangeModal] = useState(false);
//   const scrollContainerRef = useRef(null);
//   const [triggerScrollToToday, setTriggerScrollToToday] = useState(false);

//   // Init Data
//   useEffect(() => {
//     setWeekDays(generateDaysArray(startDate, endDate));
//   }, [startDate, endDate]);

//   useEffect(() => {
//     setLoading(true);
//     setTimeout(() => {
//       const currentMonthPrefix = `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, '0')}`;
//       const mockAssign = {};
//       const addMock = (shiftId, day, empIndices) => {
//         const key = `${shiftId}_${currentMonthPrefix}-${day}`;
//         mockAssign[key] = empIndices.map(i => MOCK_EMPLOYEES[i]);
//       };
//       addMock('abc123', '03', [0]);
//       addMock('HC', '03', [0, 1]);
//       addMock('HC', '04', [0, 1, 2]);
//       addMock('HC', '05', [0, 1, 2, 3, 4]);
//       setAssignments(mockAssign);
//       setLoading(false);
//     }, 300);
//   }, []);

//   // --- LOGIC GOM NHÓM (NEW) ---
//   const groupedData = useMemo(() => {
//     if (!viewSettings.grouped) return null;
//     const groups = {};
//     displayedShifts.forEach(shift => {
//       const groupKey = shift.group || 'Khác';
//       if (!groups[groupKey]) groups[groupKey] = [];
//       groups[groupKey].push(shift);
//     });
//     return groups;
//   }, [displayedShifts, viewSettings.grouped]);

//   // Search Logic
//   useEffect(() => {
//     if (filters.search.trim()) {
//       const term = filters.search.toLowerCase();
//       setDisplayedShifts(MOCK_SHIFTS_DEFINITIONS.filter(s =>
//         s.name.toLowerCase().includes(term) || s.id.toLowerCase().includes(term)
//       ));
//     } else {
//       setDisplayedShifts(MOCK_SHIFTS_DEFINITIONS);
//     }
//   }, [filters.search]);

//   // Scroll Logic
//   useEffect(() => {
//     if (triggerScrollToToday && !loading && weekDays.length > 0) {
//       setTimeout(() => {
//         const container = scrollContainerRef.current;
//         const todayHeader = container?.querySelector('.grid-header.is-today');
//         if (container && todayHeader) {
//           const scrollPos = todayHeader.offsetLeft - 280;
//           container.scrollTo({ left: scrollPos, behavior: 'smooth' });
//         }
//         setTriggerScrollToToday(false);
//       }, 100);
//     }
//   }, [triggerScrollToToday, loading, weekDays]);

//   // Handlers
//   const handlePrevMonth = () => {
//     const curr = new Date(startDate); curr.setMonth(curr.getMonth() - 1);
//     setStartDate(formatDateParam(new Date(curr.getFullYear(), curr.getMonth(), 1)));
//     setEndDate(formatDateParam(new Date(curr.getFullYear(), curr.getMonth() + 1, 0)));
//   }
//   const handleNextMonth = () => {
//     const curr = new Date(startDate); curr.setMonth(curr.getMonth() + 1);
//     setStartDate(formatDateParam(new Date(curr.getFullYear(), curr.getMonth(), 1)));
//     setEndDate(formatDateParam(new Date(curr.getFullYear(), curr.getMonth() + 1, 0)));
//   }
//   const handleDateRangeApply = (s, e) => {
//     setStartDate(s); setEndDate(e);
//   }
//   const handleJumpToToday = () => {
//     const now = new Date();
//     setStartDate(formatDateParam(new Date(now.getFullYear(), now.getMonth(), 1)));
//     setEndDate(formatDateParam(new Date(now.getFullYear(), now.getMonth() + 1, 0)));
//     setTriggerScrollToToday(true);
//   }

//   // Toggle & Modals
//   const toggleExpand = (shiftId) => setExpandedShifts(prev => ({ ...prev, [shiftId]: !prev[shiftId] }));
//   const handleOpenAddModal = (shift, date) => setModalState({ visible: true, shift, date });
//   const handleConfirmAdd = (selectedIds) => {
//     if (selectedIds.length > 0) {
//       const key = `${modalState.shift.id}_${modalState.date.fullDate}`;
//       const newEmployees = selectedIds.map(id => MOCK_EMPLOYEES.find(e => e.id === id)).filter(Boolean);
//       setAssignments(prev => {
//         const currentList = prev[key] || [];
//         const uniqueNew = newEmployees.filter(ne => !currentList.some(curr => curr.id === ne.id));
//         return { ...prev, [key]: [...currentList, ...uniqueNew] }
//       });
//     }
//     setModalState({ visible: false, shift: null, date: null });
//   }
//   const handleRemoveEmployee = (shiftId, dateFull, empId) => {
//     const key = `${shiftId}_${dateFull}`;
//     setAssignments(prev => ({ ...prev, [key]: (prev[key] || []).filter(e => e.id !== empId) }));
//   }
// const handleExportExcel = () => {
//   // Header
//   const headerRow = ['Ca làm việc', 'Thời gian', ...weekDays.map(d => `${d.day} (${d.date})`)];
//   const csvRows = [headerRow.join(',')];

//   // Data rows
//   const shiftsToExport = viewSettings.grouped && groupedData
//     ? Object.entries(groupedData).flatMap(([group, shifts]) => [{ isGroup: true, name: group }, ...shifts])
//     : displayedShifts;

//   shiftsToExport.forEach(shift => {
//     if (shift.isGroup) {
//       csvRows.push(`"${shift.name}","","${','.repeat(weekDays.length - 1)}"`);
//     } else {
//       const row = [
//         `"${shift.name}"`,
//         viewSettings.showTime ? `"${shift.start} - ${shift.end}"` : '""',
//         ...weekDays.map(day => {
//           const assigned = assignments[`${shift.id}_${day.fullDate}`] || [];
//           return `"${assigned.map(e => e.name).join(', ')}"`;
//         })
//       ];
//       csvRows.push(row.join(','));
//     }
//   });

//   // Download
//   const csvString = csvRows.join('\n');
//   const blob = new Blob(['\uFEFF' + csvString], { type: 'text/csv;charset=utf-8;' });
//   const url = URL.createObjectURL(blob);
//   const link = document.createElement('a');
//   link.href = url;
//   link.download = `Phan_ca_${startDate}_${endDate}.csv`;
//   document.body.appendChild(link);
//   link.click();
//   document.body.removeChild(link);
//   URL.revokeObjectURL(url);
// };

//   // --- RENDER ROW HELPER ---
//   const renderShiftRow = (shift) => (
//     <React.Fragment key={shift.id}>
//       <div className="grid-cell col-header shift-info-cell">
//         <div className="toggle-icon" onClick={() => toggleExpand(shift.id)}>
//           <CIcon icon={expandedShifts[shift.id] ? cilCaretBottom : cilCaretRight} />
//         </div>
//         <div className="shift-details">
//           <div className="shift-code">{shift.name}</div>
//           {viewSettings.showTime && <div className="shift-time-range">({shift.start} - {shift.end})</div>}
//         </div>
//       </div>
//       {weekDays.map(day => {
//         const assignedList = assignments[`${shift.id}_${day.fullDate}`] || [];
//         const count = assignedList.length;
//         return (
//           <div key={`${shift.id}_${day.fullDate}`} className={`grid-cell assignment-cell ${day.isToday ? 'is-today-col' : ''}`}>
//             <div className="cell-header-row">
//               <div className="count-badge"><CIcon icon={cilUser} size="sm" className="icon" /><span>{count}</span></div>
//               <div className="btn-add-assign" onClick={() => handleOpenAddModal(shift, day)}><CIcon icon={cilPlus} /></div>
//             </div>
//             {expandedShifts[shift.id] && count > 0 && (
//               <div className="employee-list-scrollable">
//                 {assignedList.map(emp => (
//                   <div key={emp.id} className="assigned-emp-item">
//                     <div className="emp-left">
//                       <div className="mini-avatar" style={{ backgroundColor: emp.avatarColor }}>{emp.name.substring(0, 1)}</div>
//                       <div className="emp-text"><span className="emp-name-txt" title={emp.name}>{emp.name}</span><span className="emp-id-txt">{emp.id}</span></div>
//                     </div>
//                     <div className="btn-remove-emp" onClick={() => handleRemoveEmployee(shift.id, day.fullDate, emp.id)}><CIcon icon={cilX} size="sm" /></div>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>
//         )
//       })}
//     </React.Fragment>
//   );

//   return (
//     <React.Fragment>
//       <ShiftByShiftStyles />

//       <div className="page-container">
//         {/* HEADER */}
//         <div className="summary-header">
//           <h2 className="summary-title">Bảng phân ca tổng hợp</h2>
//           <div className="summary-header-tabs">
//             <button className="tab-button" onClick={() => navigate('/timesheet/shiftassignmentSummary')}>Nhân viên</button>
//             {/* <button className="tab-button" onClick={() => navigate('/timesheet/shiftassignmentSummary/unit')}>Đơn vị</button> */}
//             <button className="tab-button active">Ca làm việc</button>
//           </div>
//           <div className="summary-header-actions">
//             <CButton color="secondary" variant="outline" onClick={handleJumpToToday}>Hôm nay</CButton>
//             <CButton color="secondary" variant="outline" className="ms-auto"><CIcon icon={cilOptions} /></CButton>
//           </div>
//         </div>

//         {/* FILTER BAR */}
//         <div className="summary-filter-bar">
//           <div className="filter-left">
//             <CInputGroup className="search-bar"><CInputGroupText><CIcon icon={cilSearch} /></CInputGroupText>
//               {/* Đã sửa onChange để cập nhật state search */}
//               <CFormInput
//                 placeholder="Tìm kiếm ca..."
//                 value={filters.search}
//                 onChange={e => setFilters({ search: e.target.value })}
//               />
//             </CInputGroup>
//           </div>
//           <div className="filter-right">
//             <div className="date-range-picker">
//               <CButton color="secondary" variant="ghost" onClick={handlePrevMonth}><CIcon icon={cilChevronLeft} /></CButton>
//               <span className="date-range-text">{formatDisplayDate(startDate)} - {formatDisplayDate(endDate)}</span>
//               <CButton color="secondary" variant="ghost" onClick={handleNextMonth}><CIcon icon={cilChevronRight} /></CButton>
//               <span className="date-range-icon" onClick={() => setShowDateRangeModal(true)}><CIcon icon={cilCalendar} /></span>
//             </div>

//             <div title="Xuất Excel">
//               <CButton color="secondary" variant="outline" onClick={handleExportExcel}>Xuất Excel</CButton>
//             </div>

//             {/* Nút Cài đặt - Đã thêm sự kiện onClick */}
//             <div style={{ position: 'relative' }}>
//               <CButton color="secondary" variant="outline" onClick={() => setShowSettings(!showSettings)}><CIcon icon={cilSettings} /></CButton>
//               <SettingsPopup visible={showSettings} onClose={() => setShowSettings(false)} currentSettings={viewSettings} onSave={setViewSettings} />
//             </div>
//           </div>
//         </div>

//         {/* GRID TABLE */}
//         <div className="schedule-grid-container" ref={scrollContainerRef}>
//           {loading ? <div className="d-flex justify-content-center p-5"><CSpinner color="primary" /></div> : (
//             <div className="schedule-grid" style={{ gridTemplateColumns: `280px repeat(${weekDays.length}, minmax(150px, 1fr))` }}>
//               {/* Header Row */}
//               <div className="grid-cell col-header grid-header">Ca làm việc</div>
//               {weekDays.map((day) => (
//                 <div key={day.fullDate} className={`grid-cell grid-header ${day.isToday ? 'is-today' : ''} ${day.isWeekend ? 'is-weekend' : ''}`}>
//                   <div className="day-of-week">{day.day}</div>
//                   <div className="date-number">{day.date}</div>
//                 </div>
//               ))}

//               {/* Data Rows (Hỗ trợ Gom nhóm) */}
//               {viewSettings.grouped && groupedData ?
//                 Object.keys(groupedData).map(groupName => (
//                   <React.Fragment key={groupName}>
//                     {/* Dòng tiêu đề nhóm */}
//                     <div className="group-header-row">{groupName} ({groupedData[groupName].length})</div>
//                     {groupedData[groupName].map(shift => renderShiftRow(shift))}
//                   </React.Fragment>
//                 ))
//                 : displayedShifts.map(shift => renderShiftRow(shift))
//               }
//             </div>
//           )}
//         </div>
//       </div>

//       {/* MODALS */}
//       <EmployeeSelectionModal
//         visible={modalState.visible}
//         onClose={() => setModalState({ visible: false, shift: null, date: null })}
//         shiftInfo={modalState.shift}
//         dateInfo={modalState.date ? `${modalState.date.day}, ${modalState.date.fullDate}` : ''}
//         employees={MOCK_EMPLOYEES}
//         onConfirm={handleConfirmAdd}
//       />

//       <DateRangeModal
//         visible={showDateRangeModal}
//         onClose={() => setShowDateRangeModal(false)}
//         initialStart={startDate}
//         initialEnd={endDate}
//         onApply={handleDateRangeApply}
//       />
//     </React.Fragment>
//   )
// }

// export default ShiftAssignmentByShift

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
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'

// Imports Icons
import {
  cilCalendar,
  cilCaretBottom,
  cilCaretRight,
  cilChevronLeft,
  cilChevronRight,
  cilOptions,
  cilPlus,
  cilSearch,
  cilSettings,
  cilUser,
  cilX,
} from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { shiftscheduleApi } from '../../api/shiftscheduleApi'

// =====================================================================
// 0. UTILS
// =====================================================================
const formatDateParam = (date) => {
  const d = new Date(date)
  const year = d.getFullYear()
  const month = (d.getMonth() + 1).toString().padStart(2, '0')
  const day = d.getDate().toString().padStart(2, '0')
  return `${year}-${month}-${day}`
}

const formatDisplayDate = (dateStr) => {
  if (!dateStr) return ''
  const [year, month, day] = dateStr.split('-')
  return `${day}/${month}/${year}`
}

const getDayName = (date) => {
  const days = ['Chủ nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7']
  return days[date.getDay()]
}

const generateDaysArray = (start, end) => {
  const arr = []
  const dt = new Date(start)
  const endDate = new Date(end)
  dt.setHours(0, 0, 0, 0)
  endDate.setHours(0, 0, 0, 0)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const todayStr = formatDateParam(today)

  while (dt <= endDate) {
    arr.push({
      date: dt.getDate().toString().padStart(2, '0'),
      day: getDayName(dt),
      fullDate: formatDateParam(dt),
      isToday: formatDateParam(dt) === todayStr,
      isWeekend: dt.getDay() === 0 || dt.getDay() === 6,
    })
    dt.setDate(dt.getDate() + 1)
  }
  return arr
}

// Hàm tạo màu ngẫu nhiên cho Avatar nếu API không trả về
const getRandomColor = () => {
  return `#${Math.floor(Math.random() * 16777215)
    .toString(16)
    .padStart(6, '0')}`
}

// =====================================================================
// 1. CSS CUSTOM
// =====================================================================
const ShiftByShiftStyles = () => (
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
    .filter-left, .filter-right { display: flex; gap: 12px; align-items: center; }
    .date-range-picker { display: flex; align-items: center; border: 1px solid #ccc; border-radius: 0.375rem; background: #fff; }
    .date-range-text { padding: 0 0.5rem; font-weight: 500; min-width: 220px; text-align: center; }
    .date-range-icon { padding: 0 0.5rem; border-left: 1px solid #ccc; cursor: pointer; color: #666; }
    .btn-orange { background-color: #ea580c; border-color: #ea580c; color: white; font-weight: 600; }
    .btn-orange:hover { background-color: #c2410c; color: white; border-color: #c2410c; }

    /* GRID STYLES */
    .schedule-grid-container { flex-grow: 1; overflow: auto; border: 1px solid #ccc; border-radius: 0.375rem; position: relative; scroll-behavior: smooth; }
    .schedule-grid { display: grid; width: max-content; min-width: 100%; }
    .grid-cell { padding: 0.5rem; border-right: 1px solid #eee; border-bottom: 1px solid #eee; background-color: #fff; display: flex; align-items: center; }
    
    .grid-header { font-weight: 600; justify-content: center; flex-direction: column; position: sticky; top: 0; z-index: 20; border-bottom: 1px solid #ccc; }
    .grid-header.is-today { color: #e55353; background-color: #fff5f5 !important; }
    .grid-header.is-weekend { background-color: #fafafa; color: #e55353; }
    
    .grid-cell.col-header { font-weight: 600; position: sticky; left: 0; z-index: 10; border-right: 1px solid #ccc; background-color: #fff; min-width: 280px; }
    .grid-cell.col-header.grid-header { z-index: 30; }

    /* Group Header Row */
    .group-header-row { grid-column: 1 / -1; background-color: #f8f9fa; font-weight: 700; padding: 0.75rem; border-bottom: 1px solid #ccc; position: sticky; left: 0; z-index: 9; }

    /* Shift Info Cell */
    .shift-info-cell { display: flex; flex-direction: row; align-items: flex-start; justify-content: flex-start; padding: 10px; }
    .toggle-icon { cursor: pointer; margin-right: 8px; margin-top: 4px; color: #666; }
    .shift-details { display: flex; flex-direction: column; }
    .shift-code { font-weight: 700; color: #333; margin-bottom: 2px; }
    .shift-time-range { font-size: 0.8rem; color: #666; display: flex; align-items: center; }

    /* Assignment Cell */
    .assignment-cell { min-height: 60px; flex-direction: column; justify-content: flex-start; padding: 5px 10px; align-items: stretch; }
    .assignment-cell.is-today-col { background-color: #fff8f8; }
    
    .cell-header-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 5px; }
    .count-badge { display: flex; align-items: center; color: #666; font-weight: 500; font-size: 0.95rem; }
    .count-badge .icon { margin-right: 5px; color: #888; }
    
    .btn-add-assign { color: #ea580c; cursor: pointer; padding: 2px 4px; border-radius: 4px; font-size: 1.2rem; line-height: 1; }
    .btn-add-assign:hover { background-color: #fff7ed; }

    /* Expanded List */
    .employee-list-scrollable { max-height: 250px; overflow-y: auto; padding-right: 2px; }
    .assigned-emp-item { display: flex; align-items: center; justify-content: space-between; padding: 6px; background-color: #f8f9fa; border-radius: 4px; margin-bottom: 4px; border: 1px solid transparent; }
    .assigned-emp-item:hover { border-color: #ddd; background-color: #fff; }
    .emp-left { display: flex; align-items: center; gap: 8px; overflow: hidden; }
    .mini-avatar { width: 24px; height: 24px; border-radius: 50%; color: #fff; font-size: 0.7rem; display: flex; align-items: center; justify-content: center; font-weight: bold; flex-shrink: 0; }
    .emp-text { display: flex; flex-direction: column; overflow: hidden; }
    .emp-name-txt { font-size: 0.8rem; font-weight: 600; color: #333; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .emp-id-txt { font-size: 0.7rem; color: #777; }
    .btn-remove-emp { color: #e55353; cursor: pointer; opacity: 0.6; padding: 2px; }
    .btn-remove-emp:hover { opacity: 1; }

    /* POPUP SETTINGS */
    .settings-popup { position: absolute; top: 100%; right: 0; width: 320px; background: white; border: 1px solid #d8dbe0; box-shadow: 0 4px 12px rgba(0,0,0,0.15); border-radius: 4px; z-index: 100; margin-top: 5px; }
    .popup-header { display: flex; justify-content: space-between; align-items: center; padding: 12px 16px; border-bottom: 1px solid #ebedef; font-weight: 700; }
    .popup-body { padding: 16px; }
    .popup-section { margin-bottom: 16px; }
    .popup-section-title { font-weight: 600; font-size: 0.9rem; margin-bottom: 8px; display: block; }
    .popup-footer { padding: 12px 16px; border-top: 1px solid #ebedef; display: flex; justify-content: flex-end; gap: 8px; background-color: #f9fafb; }

    /* Modal Table */
    .custom-modal-table th { background-color: #f8f9fa; font-weight: 600; font-size: 0.85rem; }
    .custom-modal-table td { vertical-align: middle; font-size: 0.9rem; }
    .emp-info { display: flex; align-items: center; gap: 8px; }
    .emp-avatar { width: 24px; height: 24px; border-radius: 50%; font-size: 0.7rem; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; }
    `}
  </style>
)

// =====================================================================
// 2. MOCK DATA (Đã loại bỏ)
// =====================================================================

// =====================================================================
// 3. SUB-COMPONENTS
// =====================================================================

const EmployeeSelectionModal = ({
  visible,
  onClose,
  onConfirm,
  employees,
  shiftInfo,
  dateInfo,
}) => {
  const [selectedIds, setSelectedIds] = useState([])
  const [search, setSearch] = useState('')

  useEffect(() => {
    if (visible) {
      setSelectedIds([])
      setSearch('')
    }
  }, [visible])

  const handleCheck = (id) =>
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]))

  // Sử dụng employees (Dữ liệu API) để lọc
  const filteredEmployees = employees.filter(
    (e) =>
      e.name?.toLowerCase().includes(search.toLowerCase()) ||
      e.id?.toLowerCase().includes(search.toLowerCase()),
  )

  return (
    <CModal visible={visible} onClose={onClose} size="lg" alignment="center">
      <CModalHeader>
        <CModalTitle className="fw-bold">Chọn nhân viên</CModalTitle>
      </CModalHeader>
      <CModalBody className="p-0">
        <div className="p-3 border-bottom">
          <div className="mb-3 p-2 bg-light rounded text-muted small">
            Đang phân ca: <span className="fw-bold text-dark">{shiftInfo?.name}</span>
            <span className="mx-2">|</span>
            Ngày: <span className="fw-bold text-dark">{dateInfo}</span>
          </div>
          <div className="d-flex gap-2">
            <CInputGroup style={{ width: '300px' }}>
              <CInputGroupText className="bg-white">
                <CIcon icon={cilSearch} />
              </CInputGroupText>
              <CFormInput
                placeholder="Tìm kiếm"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </CInputGroup>
          </div>
        </div>
        <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
          <CTable hover className="mb-0 custom-modal-table">
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell className="text-center" style={{ width: '50px' }}>
                  <CFormCheck />
                </CTableHeaderCell>
                <CTableHeaderCell>Mã nhân viên</CTableHeaderCell>
                <CTableHeaderCell>Tên nhân viên</CTableHeaderCell>
                <CTableHeaderCell>Đơn vị công tác</CTableHeaderCell>
                <CTableHeaderCell>Vị trí công việc</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {filteredEmployees.map((emp) => (
                <CTableRow key={emp.id}>
                  <CTableDataCell className="text-center">
                    <CFormCheck
                      checked={selectedIds.includes(emp.id)}
                      onChange={() => handleCheck(emp.id)}
                    />
                  </CTableDataCell>
                  <CTableDataCell>{emp.id}</CTableDataCell>
                  <CTableDataCell>
                    <div className="emp-info">
                      <div className="emp-avatar" style={{ backgroundColor: emp.avatarColor }}>
                        {emp.name?.split(' ').pop()?.substring(0, 2)?.toUpperCase() || 'NV'}
                      </div>
                      {emp.name}
                    </div>
                  </CTableDataCell>
                  <CTableDataCell>{emp.unit}</CTableDataCell>
                  <CTableDataCell>-</CTableDataCell>
                </CTableRow>
              ))}
            </CTableBody>
          </CTable>
        </div>
      </CModalBody>
      <CModalFooter>
        <CButton color="light" onClick={onClose}>
          Hủy
        </CButton>
        <CButton className="btn-orange text-white" onClick={() => onConfirm(selectedIds)}>
          Chọn
        </CButton>
      </CModalFooter>
    </CModal>
  )
}

// ... (Giữ nguyên DateRangeModal và SettingsPopup)
const DateRangeModal = ({ visible, onClose, initialStart, initialEnd, onApply }) => {
  const [start, setStart] = useState(initialStart)
  const [end, setEnd] = useState(initialEnd)
  useEffect(() => {
    if (visible) {
      setStart(initialStart)
      setEnd(initialEnd)
    }
  }, [visible, initialStart, initialEnd])
  return (
    <CModal visible={visible} onClose={onClose} alignment="center" size="sm">
      <CModalHeader>
        <CModalTitle>Chọn khoảng thời gian</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <div className="mb-3">
          <CFormLabel>Từ ngày</CFormLabel>
          <CFormInput type="date" value={start} onChange={(e) => setStart(e.target.value)} />
        </div>
        <div className="mb-3">
          <CFormLabel>Đến ngày</CFormLabel>
          <CFormInput type="date" value={end} onChange={(e) => setEnd(e.target.value)} />
        </div>
      </CModalBody>
      <CModalFooter>
        <CButton color="light" onClick={onClose}>
          Hủy
        </CButton>
        <CButton
          className="btn-orange text-white"
          onClick={() => {
            onApply(start, end)
            onClose()
          }}
        >
          Áp dụng
        </CButton>
      </CModalFooter>
    </CModal>
  )
}

const SettingsPopup = ({ visible, onClose, currentSettings, onSave }) => {
  const [localSettings, setLocalSettings] = useState(currentSettings)
  useEffect(() => {
    if (visible) setLocalSettings(currentSettings)
  }, [visible, currentSettings])
  if (!visible) return null
  return (
    <div className="settings-popup">
      <div className="popup-header">
        <span>Tùy chỉnh</span>
        <CButton color="link" className="p-0 text-secondary" onClick={onClose}>
          <CIcon icon={cilX} />
        </CButton>
      </div>
      <div className="popup-body">
        <div className="popup-section">
          <span className="popup-section-title">Tùy chọn hiển thị thời gian</span>
          <CFormCheck
            type="radio"
            label="Hiển thị chi tiết giờ"
            checked={localSettings.showTime === true}
            onChange={() => setLocalSettings((p) => ({ ...p, showTime: true }))}
          />
          <CFormCheck
            type="radio"
            label="Ẩn chi tiết giờ"
            checked={localSettings.showTime === false}
            onChange={() => setLocalSettings((p) => ({ ...p, showTime: false }))}
          />
        </div>
        <div className="popup-section mb-0">
          <span className="popup-section-title">Gom nhóm bản ghi</span>
          <CFormCheck
            type="radio"
            label="Có"
            checked={localSettings.grouped === true}
            onChange={() => setLocalSettings((p) => ({ ...p, grouped: true }))}
          />
          {localSettings.grouped && (
            <div className="ms-4 mt-2">
              <CFormSelect
                size="sm"
                value={localSettings.groupBy}
                onChange={(e) => setLocalSettings((p) => ({ ...p, groupBy: e.target.value }))}
              >
                <option value="group">Nhóm ca</option>
              </CFormSelect>
            </div>
          )}
          <CFormCheck
            type="radio"
            label="Không"
            className="mt-2"
            checked={localSettings.grouped === false}
            onChange={() => setLocalSettings((p) => ({ ...p, grouped: false }))}
          />
        </div>
      </div>
      <div className="popup-footer">
        <CButton
          color="light"
          size="sm"
          onClick={() => setLocalSettings({ showTime: true, grouped: false, groupBy: 'group' })}
        >
          Mặc định
        </CButton>
        <CButton
          className="btn-orange"
          size="sm"
          onClick={() => {
            onSave(localSettings)
            onClose()
          }}
        >
          Lưu
        </CButton>
      </div>
    </div>
  )
}

// =====================================================================
// 5. MAIN COMPONENT: SHIFT ASSIGNMENT BY SHIFT
// =====================================================================
const ShiftAssignmentByShift = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [loadingShifts, setLoadingShifts] = useState(true)
  const [loadingEmployees, setLoadingEmployees] = useState(true)

  const today = new Date()
  const [startDate, setStartDate] = useState(
    formatDateParam(new Date(today.getFullYear(), today.getMonth(), 1)),
  )
  const [endDate, setEndDate] = useState(
    formatDateParam(new Date(today.getFullYear(), today.getMonth() + 1, 0)),
  )
  const [weekDays, setWeekDays] = useState([])

  // Data State
  const [assignments, setAssignments] = useState({})
  const [shiftsData, setShiftsData] = useState([]) // Ca làm việc gốc từ API
  const [employeesData, setEmployeesData] = useState([]) // Nhân viên gốc từ API
  const [displayedShifts, setDisplayedShifts] = useState([])
  const [filters, setFilters] = useState({ search: '' })

  // Settings & Expand
  const [expandedShifts, setExpandedShifts] = useState({})
  const [viewSettings, setViewSettings] = useState({
    showTime: true,
    grouped: false,
    groupBy: 'group',
  })
  const [showSettings, setShowSettings] = useState(false)

  const [modalState, setModalState] = useState({ visible: false, shift: null, date: null })
  const [showDateRangeModal, setShowDateRangeModal] = useState(false)
  const scrollContainerRef = useRef(null)
  const [triggerScrollToToday, setTriggerScrollToToday] = useState(false)

  // =====================================================================
  // 6. FETCH API & INIT DATA
  // =====================================================================

  // 6.1. FETCH CA LÀM VIỆC TỪ API
  const fetchShiftsData = async () => {
    setLoadingShifts(true)
    try {
      const response = await shiftscheduleApi.getAllShifts()
      
      // SỬA ĐỔI: Sử dụng response.data.data hoặc response.data.items 
      // Nếu API trả về { data: [...] } hoặc { data: { shifts: [...] } }
      let dataArray = (response.data?.data && Array.isArray(response.data.data)) 
                      ? response.data.data 
                      : (response.data?.data?.shifts || response.data?.items) // Thử thêm 'shifts' nếu có cấu trúc phân trang

      if (dataArray && Array.isArray(dataArray)) {
        const shifts = dataArray.map((s) => ({
          // Đảm bảo ánh xạ đúng các trường từ API
          id: s.id || s._id,
          name: s.name || s.code, // Sử dụng code nếu không có name
          start: s.startTime || '00:00',
          end: s.endTime || '00:00',
          group: s.groupName || s.shiftType || 'Ca Khác',
        }))
        setShiftsData(shifts)
        setDisplayedShifts(shifts)
      } else {
        console.warn(
          'API Shifts trả về response thành công, nhưng data không phải là mảng:',
          response.data,
        )
      }
    } catch (error) {
      console.error('Lỗi khi tải danh sách ca làm việc:', error)
    } finally {
      setLoadingShifts(false)
    }
  }

  // 6.2. FETCH TẤT CẢ NHÂN VIÊN TỪ API (Đã Sửa Lỗi Truy Cập data)
  const fetchEmployeesData = async () => {
    setLoadingEmployees(true)
    try {
      const response = await shiftscheduleApi.getAllEmployees()

      // SỬA ĐỔI: Truy cập response.data.data.employees theo cấu trúc đã nhận được 
      let dataArray = response.data?.data?.employees // <-- Sửa lỗi truy cập chính xác

      if (dataArray && Array.isArray(dataArray)) {
        const employees = dataArray.map((e) => ({
          id: e.employeeId || e._id,
          name: e.fullName || e.name,
          unit: e.unit || e.departmentName || 'Không rõ',
          avatarColor: getRandomColor(),
        }))
        setEmployeesData(employees)
      } else {
        console.warn(
          'API Employees trả về response thành công, nhưng data không phải là mảng:',
          response.data,
        )
      }
    } catch (error) {
      console.error('Lỗi khi tải danh sách nhân viên:', error)
    } finally {
      setLoadingEmployees(false)
    }
  }

  // 6.3. FETCH DỮ LIỆU PHÂN CA (TẠM THỜI MOCK)
  const fetchAssignments = async () => {
    await new Promise((resolve) => setTimeout(resolve, 300))

    try {
      // MOCK DỮ LIỆU SỬ DỤNG ID THỰC TẾ
      const mockAssign = {}
      const mockEmpIds = employeesData.slice(0, 5).map((e) => e.id)
      const mockShiftIds = shiftsData.slice(0, 3).map((s) => s.id)

      if (mockShiftIds.length > 0 && mockEmpIds.length > 0) {
        const todayDate = new Date().getDate().toString().padStart(2, '0')
        const startDay = new Date(startDate).getDate().toString().padStart(2, '0')
        const currentMonthPrefix = formatDateParam(new Date()).substring(0, 7)

        // Hàm Mock (sử dụng ID thực)
        const addMock = (shiftId, day, empIds) => {
          const key = `${shiftId}_${currentMonthPrefix}-${day}`
          mockAssign[key] = empIds
            .map((id) => employeesData.find((e) => e.id === id))
            .filter(Boolean)
        }

        addMock(mockShiftIds[0], startDay, [mockEmpIds[0]])
        if (mockShiftIds.length > 1) {
          addMock(mockShiftIds[1], todayDate, mockEmpIds)
          addMock(mockShiftIds[1], (parseInt(todayDate) + 1).toString().padStart(2, '0'), [
            mockEmpIds[0],
            mockEmpIds[2],
          ])
        }
      }

      setAssignments(mockAssign)
    } catch (error) {
      console.error('Lỗi khi tải dữ liệu phân ca:', error)
    } finally {
      setLoading(false)
    }
  }

  // 6.4. HOOKS INIT & UPDATES
  useEffect(() => {
    fetchShiftsData()
    fetchEmployeesData()
  }, [])

  useEffect(() => {
    setWeekDays(generateDaysArray(startDate, endDate))
    if (!loadingEmployees && !loadingShifts) {
      fetchAssignments()
    }
  }, [startDate, endDate, loadingEmployees, loadingShifts])

  // --- LOGIC GOM NHÓM ---
  const groupedData = useMemo(() => {
    if (!viewSettings.grouped) return null
    const groups = {}
    displayedShifts.forEach((shift) => {
      const groupKey = shift.group || 'Khác'
      if (!groups[groupKey]) groups[groupKey] = []
      groups[groupKey].push(shift)
    })
    return groups
  }, [displayedShifts, viewSettings.grouped])

  // Search Logic (Lọc từ shiftsData thực tế)
  useEffect(() => {
    if (filters.search.trim()) {
      const term = filters.search.toLowerCase()
      setDisplayedShifts(
        shiftsData.filter(
          (s) => s.name?.toLowerCase().includes(term) || s.id?.toLowerCase().includes(term),
        ),
      )
    } else {
      setDisplayedShifts(shiftsData)
    }
  }, [filters.search, shiftsData])

  // Scroll Logic
  useEffect(() => {
    if (triggerScrollToToday && !loading && weekDays.length > 0) {
      setTimeout(() => {
        const container = scrollContainerRef.current
        const todayHeader = container?.querySelector('.grid-header.is-today')
        if (container && todayHeader) {
          const scrollPos = todayHeader.offsetLeft - 280
          container.scrollTo({ left: scrollPos, behavior: 'smooth' })
        }
        setTriggerScrollToToday(false)
      }, 100)
    }
  }, [triggerScrollToToday, loading, weekDays])

  // Handlers
  const handlePrevMonth = () => {
    const curr = new Date(startDate)
    curr.setMonth(curr.getMonth() - 1)
    setStartDate(formatDateParam(new Date(curr.getFullYear(), curr.getMonth(), 1)))
    setEndDate(formatDateParam(new Date(curr.getFullYear(), curr.getMonth() + 1, 0)))
  }
  const handleNextMonth = () => {
    const curr = new Date(startDate)
    curr.setMonth(curr.getMonth() + 1)
    setStartDate(formatDateParam(new Date(curr.getFullYear(), curr.getMonth(), 1)))
    setEndDate(formatDateParam(new Date(curr.getFullYear(), curr.getMonth() + 1, 0)))
  }
  const handleDateRangeApply = (s, e) => {
    setStartDate(s)
    setEndDate(e)
  }
  const handleJumpToToday = () => {
    const now = new Date()
    setStartDate(formatDateParam(new Date(now.getFullYear(), now.getMonth(), 1)))
    setEndDate(formatDateParam(new Date(now.getFullYear(), now.getMonth() + 1, 0)))
    setTriggerScrollToToday(true)
  }

  // Toggle & Modals
  const toggleExpand = (shiftId) =>
    setExpandedShifts((prev) => ({ ...prev, [shiftId]: !prev[shiftId] }))
  const handleOpenAddModal = (shift, date) => setModalState({ visible: true, shift, date })

  const handleConfirmAdd = (selectedIds) => {
    if (selectedIds.length > 0) {
      const key = `${modalState.shift.id}_${modalState.date.fullDate}`
      // Tìm nhân viên trong employeesData (dữ liệu thực)
      const newEmployees = selectedIds
        .map((id) => employeesData.find((e) => e.id === id))
        .filter(Boolean)
      setAssignments((prev) => {
        const currentList = prev[key] || []
        const uniqueNew = newEmployees.filter(
          (ne) => !currentList.some((curr) => curr.id === ne.id),
        )
        return { ...prev, [key]: [...currentList, ...uniqueNew] }
      })
    }
    setModalState({ visible: false, shift: null, date: null })
  }

  const handleRemoveEmployee = (shiftId, dateFull, empId) => {
    const key = `${shiftId}_${dateFull}`
    setAssignments((prev) => ({ ...prev, [key]: (prev[key] || []).filter((e) => e.id !== empId) }))
  }

  const handleExportExcel = () => {
    // Header
    const headerRow = ['Ca làm việc', 'Thời gian', ...weekDays.map((d) => `${d.day} (${d.date})`)]
    const csvRows = [headerRow.join(',')]

    // Data rows
    const shiftsToExport =
      viewSettings.grouped && groupedData
        ? Object.entries(groupedData).flatMap(([group, shifts]) => [
            { isGroup: true, name: group },
            ...shifts,
          ])
        : displayedShifts

    shiftsToExport.forEach((shift) => {
      if (shift.isGroup) {
        csvRows.push(`"${shift.name}","","${','.repeat(weekDays.length - 1)}"`)
      } else {
        const row = [
          `"${shift.name}"`,
          viewSettings.showTime ? `"${shift.start} - ${shift.end}"` : '""',
          ...weekDays.map((day) => {
            const assigned = assignments[`${shift.id}_${day.fullDate}`] || []
            return `"${assigned.map((e) => e.name).join(', ')}"`
          }),
        ]
        csvRows.push(row.join(','))
      }
    })

    // Download
    const csvString = csvRows.join('\n')
    const blob = new Blob(['\uFEFF' + csvString], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `Phan_ca_${startDate}_${endDate}.csv`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  // --- RENDER ROW HELPER ---
  const renderShiftRow = (shift) => (
    <React.Fragment key={shift.id}>
      <div className="grid-cell col-header shift-info-cell">
        <div className="toggle-icon" onClick={() => toggleExpand(shift.id)}>
          <CIcon icon={expandedShifts[shift.id] ? cilCaretBottom : cilCaretRight} />
        </div>
        <div className="shift-details">
          <div className="shift-code">{shift.name}</div>
          {viewSettings.showTime && (
            <div className="shift-time-range">
              ({shift.start} - {shift.end})
            </div>
          )}
        </div>
      </div>
      {weekDays.map((day) => {
        const assignedList = assignments[`${shift.id}_${day.fullDate}`] || []
        const count = assignedList.length
        return (
          <div
            key={`${shift.id}_${day.fullDate}`}
            className={`grid-cell assignment-cell ${day.isToday ? 'is-today-col' : ''}`}
          >
            <div className="cell-header-row">
              <div className="count-badge">
                <CIcon icon={cilUser} size="sm" className="icon" />
                <span>{count}</span>
              </div>
              <div className="btn-add-assign" onClick={() => handleOpenAddModal(shift, day)}>
                <CIcon icon={cilPlus} />
              </div>
            </div>
            {expandedShifts[shift.id] && count > 0 && (
              <div className="employee-list-scrollable">
                {assignedList.map((emp) => (
                  <div key={emp.id} className="assigned-emp-item">
                    <div className="emp-left">
                      <div className="mini-avatar" style={{ backgroundColor: emp.avatarColor }}>
                        {emp.name?.substring(0, 1) || 'N'}
                      </div>
                      <div className="emp-text">
                        <span className="emp-name-txt" title={emp.name}>
                          {emp.name}
                        </span>
                        <span className="emp-id-txt">{emp.id}</span>
                      </div>
                    </div>
                    <div
                      className="btn-remove-emp"
                      onClick={() => handleRemoveEmployee(shift.id, day.fullDate, emp.id)}
                    >
                      <CIcon icon={cilX} size="sm" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )
      })}
    </React.Fragment>
  )

  return (
    <React.Fragment>
      <ShiftByShiftStyles />

      <div className="page-container">
        {/* HEADER */}
        <div className="summary-header">
          <h2 className="summary-title">Bảng phân ca tổng hợp</h2>
          <div className="summary-header-tabs">
            <button
              className="tab-button"
              onClick={() => navigate('/timesheet/shiftassignmentSummary')}
            >
              Nhân viên
            </button>
            <button className="tab-button active">Ca làm việc</button>
          </div>
          <div className="summary-header-actions">
            <CButton color="secondary" variant="outline" onClick={handleJumpToToday}>
              Hôm nay
            </CButton>
            <CButton color="secondary" variant="outline" className="ms-auto">
              <CIcon icon={cilOptions} />
            </CButton>
          </div>
        </div>

        {/* FILTER BAR */}
        <div className="summary-filter-bar">
          <div className="filter-left">
            <CInputGroup className="search-bar">
              <CInputGroupText>
                <CIcon icon={cilSearch} />
              </CInputGroupText>
              <CFormInput
                placeholder="Tìm kiếm ca..."
                value={filters.search}
                onChange={(e) => setFilters({ search: e.target.value })}
              />
            </CInputGroup>
          </div>
          <div className="filter-right">
            <div className="date-range-picker">
              <CButton color="secondary" variant="ghost" onClick={handlePrevMonth}>
                <CIcon icon={cilChevronLeft} />
              </CButton>
              <span className="date-range-text">
                {formatDisplayDate(startDate)} - {formatDisplayDate(endDate)}
              </span>
              <CButton color="secondary" variant="ghost" onClick={handleNextMonth}>
                <CIcon icon={cilChevronRight} />
              </CButton>
              <span className="date-range-icon" onClick={() => setShowDateRangeModal(true)}>
                <CIcon icon={cilCalendar} />
              </span>
            </div>

            <div title="Xuất Excel">
              <CButton color="secondary" variant="outline" onClick={handleExportExcel}>
                Xuất Excel
              </CButton>
            </div>

            {/* Nút Cài đặt */}
            <div style={{ position: 'relative' }}>
              <CButton
                color="secondary"
                variant="outline"
                onClick={() => setShowSettings(!showSettings)}
              >
                <CIcon icon={cilSettings} />
              </CButton>
              <SettingsPopup
                visible={showSettings}
                onClose={() => setShowSettings(false)}
                currentSettings={viewSettings}
                onSave={setViewSettings}
              />
            </div>
          </div>
        </div>

        {/* GRID TABLE */}
        <div className="schedule-grid-container" ref={scrollContainerRef}>
          {loading || loadingShifts || loadingEmployees ? (
            <div className="d-flex justify-content-center p-5">
              <CSpinner color="primary" />
            </div>
          ) : (
            <div
              className="schedule-grid"
              style={{
                gridTemplateColumns: `280px repeat(${weekDays.length}, minmax(150px, 1fr))`,
              }}
            >
              {/* Header Row */}
              <div className="grid-cell col-header grid-header">Ca làm việc</div>
              {weekDays.map((day) => (
                <div
                  key={day.fullDate}
                  className={`grid-cell grid-header ${day.isToday ? 'is-today' : ''} ${day.isWeekend ? 'is-weekend' : ''}`}
                >
                  <div className="day-of-week">{day.day}</div>
                  <div className="date-number">{day.date}</div>
                </div>
              ))}

              {/* Data Rows */}
              {viewSettings.grouped && groupedData
                ? Object.keys(groupedData).map((groupName) => (
                    <React.Fragment key={groupName}>
                      <div className="group-header-row">
                        {groupName} ({groupedData[groupName].length})
                      </div>
                      {groupedData[groupName].map((shift) => renderShiftRow(shift))}
                    </React.Fragment>
                  ))
                : displayedShifts.map((shift) => renderShiftRow(shift))}
            </div>
          )}
        </div>
      </div>

      {/* MODALS */}
      <EmployeeSelectionModal
        visible={modalState.visible}
        onClose={() => setModalState({ visible: false, shift: null, date: null })}
        shiftInfo={modalState.shift}
        dateInfo={modalState.date ? `${modalState.date.day}, ${modalState.date.fullDate}` : ''}
        employees={employeesData} // Dữ liệu nhân viên thực tế từ API
        onConfirm={handleConfirmAdd}
      />

      <DateRangeModal
        visible={showDateRangeModal}
        onClose={() => setShowDateRangeModal(false)}
        initialStart={startDate}
        initialEnd={endDate}
        onApply={handleDateRangeApply}
      />
    </React.Fragment>
  )
}

export default ShiftAssignmentByShift