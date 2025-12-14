
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

// IMPORT API
import { shiftscheduleApi } from '../../api/shiftscheduleApi'

// =====================================================================
// 0. DATE UTILS
// =====================================================================
const formatDateParam = (date) => {
    if (!date) return '';
    const d = new Date(date);
    const year = d.getFullYear();
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const day = d.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
};

const formatDisplayDate = (dateStr) => {
    if (!dateStr) return '';
    const cleanDate = dateStr.split('T')[0];
    const [year, month, day] = cleanDate.split('-');
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
// 1. CSS CUSTOM
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

    .shift-cell { min-height: 60px; vertical-align: top; display: flex; flex-direction: column; align-items: flex-start; justify-content: center; position: relative; }
    .shift-cell:hover { background-color: #f8f9fa; }
    .shift-cell.is-today-col { background-color: #fff8f8; }
    .shift-tag { font-size: 0.85rem; font-weight: 600; display: flex; align-items: center; color: #333; }
    .shift-dot { width: 6px; height: 6px; border-radius: 50%; margin-right: 6px; background-color: #333; }
    .shift-time { font-size: 0.75rem; color: #768192; margin-left: 12px; margin-top: 1px; }

    .cell-hover-actions { display: none; position: absolute; top: 4px; right: 4px; background: rgba(255, 255, 255, 0.9); border-radius: 4px; padding: 2px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); z-index: 5; }
    .shift-cell:hover .cell-hover-actions { display: flex; gap: 4px; }
    .action-btn-mini { width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; border: none; background: transparent; color: #768192; border-radius: 3px; cursor: pointer; transition: all 0.2s; }
    .action-btn-mini:hover { background-color: #ebedef; }
    .action-btn-mini.edit:hover { color: #ea580c; background-color: #fff7ed; }
    .action-btn-mini.delete:hover { color: #e55353; background-color: #fee2e2; }

    .settings-popup { position: absolute; top: 100%; right: 0; width: 320px; background: white; border: 1px solid #d8dbe0; box-shadow: 0 4px 12px rgba(0,0,0,0.15); border-radius: 4px; z-index: 100; margin-top: 5px; }
    .popup-header { display: flex; justify-content: space-between; align-items: center; padding: 12px 16px; border-bottom: 1px solid #ebedef; font-weight: 700; }
    .popup-body { padding: 16px; }
    .popup-section { margin-bottom: 16px; }
    .popup-section-title { font-weight: 600; font-size: 0.9rem; margin-bottom: 8px; display: block; }
    .popup-footer { padding: 12px 16px; border-top: 1px solid #ebedef; display: flex; justify-content: flex-end; gap: 8px; background-color: #f9fafb; }
    `}
  </style>
)

// =====================================================================
// 2. SUB-COMPONENTS
// =====================================================================

// --- MODAL CHỌN CA TỪ DATABASE (ĐÃ SỬA LỖI TÌM ID) ---
const EditShiftModal = ({ visible, onClose, onSave, targetCell, availableShifts, employees }) => {
    const [selectedShiftId, setSelectedShiftId] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        if (visible && targetCell) {
            const currentShiftCode = targetCell.shifts && targetCell.shifts.length > 0 ? targetCell.shifts[0].shiftCode : '';
            
            // Tìm shift tương ứng để set giá trị mặc định
            const found = availableShifts.find(s => s.code === currentShiftCode || s.id === currentShiftCode || s.name.startsWith(currentShiftCode));
            
            // Lưu ý: convert về String để khớp với value của select option
            setSelectedShiftId(found ? String(found.id) : '');
            setSearchTerm('');
        }
    }, [visible, targetCell, availableShifts]);

    const employeeName = targetCell ? employees.find(e => e.id === targetCell.empId)?.name : 'N/A';
    
    // Lọc danh sách
    const filteredShifts = availableShifts.filter(s => 
        (s.name && s.name.toLowerCase().includes(searchTerm.toLowerCase())) || 
        (s.code && s.code.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const handleSave = () => {
        if (!selectedShiftId) {
            alert("Vui lòng chọn một ca làm việc!");
            return;
        }

        // --- SỬA QUAN TRỌNG TẠI ĐÂY ---
        // Ép kiểu về String để so sánh chính xác (vì value của select luôn là string)
        const shiftInfo = availableShifts.find(s => String(s.id) === String(selectedShiftId));
        
        if (!shiftInfo) {
            console.error("Không tìm thấy thông tin ca với ID:", selectedShiftId);
            alert("Lỗi dữ liệu ca làm việc. Vui lòng tải lại trang.");
            return;
        }

        onSave(shiftInfo); 
        onClose();
    };

    return (
        <CModal visible={visible} onClose={onClose} alignment="center">
            <CModalHeader><CModalTitle>Phân ca cho nhân viên</CModalTitle></CModalHeader>
            <CModalBody>
                <div className="mb-3 p-3 bg-light rounded border">
                    <div><strong>Nhân viên:</strong> {employeeName}</div>
                    <div><strong>Mã NV:</strong> {targetCell?.empId}</div>
                    <div><strong>Ngày:</strong> {formatDisplayDate(targetCell?.date)}</div>
                </div>
                
                <CFormLabel>Chọn Ca Làm Việc</CFormLabel>
                <CInputGroup className="mb-2">
                    <CInputGroupText><CIcon icon={cilSearch}/></CInputGroupText>
                    <CFormInput placeholder="Tìm tên ca..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                </CInputGroup>
                
                <CFormSelect 
                    size="lg" 
                    value={selectedShiftId} 
                    onChange={(e) => setSelectedShiftId(e.target.value)}
                >
                    <option value="">-- Chọn ca làm việc --</option>
                    {filteredShifts.map(s => (
                        <option key={s.id} value={s.id}>
                            {s.name} ({s.start} - {s.end})
                        </option>
                    ))}
                </CFormSelect>
                {filteredShifts.length === 0 && <div className="text-danger small mt-2">Không tìm thấy ca nào.</div>}
            </CModalBody>
            <CModalFooter>
                <CButton color="light" onClick={onClose}>Hủy</CButton>
                <CButton className="btn-orange" onClick={handleSave}>Lưu thay đổi</CButton>
            </CModalFooter>
        </CModal>
    );
};

// --- MODAL XÓA CA ---
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
    useEffect(() => { if(visible) { setStart(initialStart); setEnd(initialEnd); } }, [visible, initialStart, initialEnd]);
    return (
        <CModal visible={visible} onClose={onClose} alignment="center" size="sm">
            <CModalHeader><CModalTitle>Chọn thời gian</CModalTitle></CModalHeader>
            <CModalBody>
                <div className="mb-3"><CFormLabel>Từ ngày</CFormLabel><CFormInput type="date" value={start} onChange={e => setStart(e.target.value)} /></div>
                <div className="mb-3"><CFormLabel>Đến ngày</CFormLabel><CFormInput type="date" value={end} onChange={e => setEnd(e.target.value)} /></div>
            </CModalBody>
            <CModalFooter>
                <CButton color="light" onClick={onClose}>Hủy</CButton>
                <CButton className="btn-orange" onClick={() => { onApply(start, end); onClose(); }}>Áp dụng</CButton>
            </CModalFooter>
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
  const [shifts, setShifts] = useState({}) 
  const [availableShifts, setAvailableShifts] = useState([]); 
  const [orgUnits, setOrgUnits] = useState([]);
  
  const [displayedEmployees, setDisplayedEmployees] = useState([]) 
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
  const [showDateRangeModal, setShowDateRangeModal] = useState(false)
  
  const [modalState, setModalState] = useState({
      editVisible: false,
      deleteVisible: false,
      targetCell: null 
  });

  const [triggerScrollToToday, setTriggerScrollToToday] = useState(false);
  const scrollContainerRef = useRef(null); 
  const navigate = useNavigate()

  // 1. Fetch Dữ liệu Tĩnh (Employees, Shifts, Departments)
  useEffect(() => {
    const fetchStaticData = async () => {
        try {
            // --- A. LẤY NHÂN VIÊN (GỘP TRANG NHƯ ĐÃ SỬA) ---
            const firstEmpRes = await shiftscheduleApi.getAllEmployees({ page: 0, size: 50 });
            const empData = firstEmpRes?.data?.data || firstEmpRes?.data || {};
            
            let allEmployees = [];
            let totalPages = 1;

            if (Array.isArray(empData)) {
                allEmployees = empData;
            } else {
                const firstPageEmps = empData.employees || empData.content || [];
                allEmployees = [...firstPageEmps];
                totalPages = empData.totalPages || 1;
            }

            if (totalPages > 1) {
                const promises = [];
                for (let i = 1; i < totalPages; i++) {
                    promises.push(shiftscheduleApi.getAllEmployees({ page: i, size: 50 }));
                }
                const results = await Promise.all(promises);
                results.forEach(res => {
                    const d = res?.data?.data || res?.data || {};
                    const pageEmps = d.employees || d.content || [];
                    allEmployees = [...allEmployees, ...pageEmps];
                });
            }

            const formattedEmployees = allEmployees.map(e => ({
                ...e,
                id: e.employeeId || e.id,
                name: e.fullName || e.name,
                unit: e.departmentName || 'Chưa phân loại',
                job: e.jobTitle || 'Nhân viên',
                avatar: getInitials(e.fullName || e.name)
            }));
            setEmployees(formattedEmployees);


            // --- B. LẤY CA LÀM VIỆC (FIXED) ---
            const shiftRes = await shiftscheduleApi.getAllShifts(); // Gọi API
            
            // Xử lý dữ liệu trả về linh hoạt (Data wrapper, Pagination content, hoặc Array trực tiếp)
            const shiftPayload = shiftRes?.data?.data || shiftRes?.data || {};
            const rawShifts = Array.isArray(shiftPayload) 
                ? shiftPayload 
                : (shiftPayload.content || shiftPayload.data || []); // Lấy mảng ca từ trong object nếu có

            if (Array.isArray(rawShifts)) {
                const formattedShifts = rawShifts.map(s => ({
                    id: s.shiftId || s.id, 
                    code: s.shiftCode,     
                    name: s.shiftName || s.name || s.shiftCode, // Tên hiển thị
                    start: s.startTime,
                    end: s.endTime
                }));
                setAvailableShifts(formattedShifts);
            } else {
                console.error("Dữ liệu Ca làm việc không đúng định dạng:", shiftPayload);
                setAvailableShifts([]); // Set rỗng để tránh lỗi map
            }


            // --- C. LẤY PHÒNG BAN ---
            const deptRes = await shiftscheduleApi.getAllDepartments();
            const rawDepts = deptRes?.data?.data || deptRes?.data || [];
            if (Array.isArray(rawDepts)) {
                const formattedDepts = rawDepts.map(d => ({
                    id: d.departmentId || d.id,
                    name: d.departmentName || d.name
                }));
                setOrgUnits(formattedDepts);
            }

        } catch (error) {
            console.error("Lỗi tải dữ liệu ban đầu:", error);
        }
    };
    fetchStaticData();
  }, []);

  const getInitials = (name) => {
      if(!name) return 'NV';
      const parts = name.split(' ');
      if(parts.length >= 2) return parts[0][0] + parts[parts.length-1][0];
      return name.substring(0,2).toUpperCase();
  }

  useEffect(() => {
      const days = generateDaysArray(startDate, endDate);
      setWeekDays(days);
  }, [startDate, endDate]);

  // 3. Fetch Assignments
// 3. Fetch Assignments (ĐÃ SỬA KHỚP VỚI DTO BACKEND)
  const fetchAssignments = async () => {
    setLoading(true);
    try {
        const res = await shiftscheduleApi.getAllAssignments(startDate, endDate);
        
        // Backend trả về ApiResponse<List<DTO>>, dữ liệu nằm trong res.data.data
        const data = res?.data?.data || res?.data || [];
        
        const shiftMap = {};
        
        if (Array.isArray(data)) {
            data.forEach(item => {
                // --- SỬA QUAN TRỌNG TẠI ĐÂY ---
                // Backend trả về 'assignmentDate', không phải 'date'
                // Ta lấy ưu tiên assignmentDate, nếu không có mới tìm date
                const rawDate = item.assignmentDate || item.date;

                if (!rawDate) {
                    return; // Bỏ qua nếu không có ngày
                }

                try {
                    // LocalDate của Java thường là "YYYY-MM-DD", không có chữ T
                    // Nhưng cứ split('T')[0] cho an toàn (nếu chuỗi không có T nó vẫn lấy đúng)
                    const itemDate = rawDate.split('T')[0];
                    
                    const key = `${item.employeeId}_${itemDate}`;
                    
                    if (!shiftMap[key]) shiftMap[key] = [];
                    
                    shiftMap[key].push({
                        id: item.shiftAssignmentId || item.assignmentId || item.id, // Backend DTO dùng shiftAssignmentId
                        shiftCode: item.shiftCode || item.shiftName || 'Shift',
                        // Backend DTO trả về startTime/endTime dạng LocalTime ("08:00:00")
                        startTime: item.startTime, 
                        endTime: item.endTime,
                        ...item
                    });
                } catch (err) {
                    console.error("Lỗi parse data dòng:", item);
                }
            });
        }
        setShifts(shiftMap);
    } catch (error) {
        console.error("Lỗi tải dữ liệu phân ca:", error);
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssignments();
  }, [startDate, endDate]);

  // Logic Scroll & Filter
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
    const key = `${employeeId}_date`; // Note: Logic cũ dùng _date nhưng ở fetch dùng _itemDate. 
    // Tuy nhiên hàm fetch đã setShifts đúng key. Ở đây cần dùng đúng key để lấy.
    // Sửa lại cho khớp với logic fetch:
    const keyCorrect = `${employeeId}_${date}`;
    return shifts[keyCorrect] || [];
  }

  // --- HANDLER CLICK VÀO Ô ---
  const handleCellClick = (action, empId, date, cellShifts) => {
      const target = { empId, date, shifts: cellShifts };
      if (action === 'edit') {
          // Mở modal Edit
          setModalState({ ...modalState, editVisible: true, targetCell: target });
      } else if (action === 'delete') {
          if (cellShifts && cellShifts.length > 0) {
              setModalState({ ...modalState, deleteVisible: true, targetCell: target });
          }
      }
  }

  // --- HANDLE SAVE (BẢN CHUẨN KHỚP VỚI BACKEND) ---
  const handleSaveShift = async (selectedShiftInfo) => {
      const { targetCell } = modalState;
      if (!targetCell || !selectedShiftInfo) return;

      // 1. Ép kiểu ID về số (Backend: Long)
      const safeEmployeeId = Number(targetCell.empId);
      const safeShiftId = Number(selectedShiftInfo.id);

      // 2. Xử lý ngày: Backend yêu cầu "yyyy-MM-dd" (LocalDate)
      // targetCell.date gốc đã là "YYYY-MM-DD" nên ta giữ nguyên.
      // Tuyệt đối KHÔNG thêm "T00:00:00"
      const safeDate = targetCell.date.split('T')[0]; 

      // 3. Payload đúng chuẩn ShiftAssignmentDTO
      const payload = {
          employeeId: safeEmployeeId,
          shiftId: safeShiftId,
          assignmentDate: safeDate, // Tên trường phải là assignmentDate, không phải date
          isApproved: true, // Mặc định true (hoặc false tùy logic)
          note: ""          // Gửi chuỗi rỗng nếu không có note
      };

      console.log("🔥 Payload chuẩn gửi đi:", payload);

      try {
        const response = await shiftscheduleApi.assignShift(payload);
        console.log("✅ Server phản hồi:", response);

        // --- CẬP NHẬT UI NGAY LẬP TỨC (Optimistic Update) ---
        setShifts(prevShifts => {
            const newShifts = { ...prevShifts };
            const key = `${targetCell.empId}_${targetCell.date}`;
            
            // Tạo dữ liệu giả lập để hiển thị ngay trên bảng
            const newDisplayShift = {
                id: response.data?.data?.shiftAssignmentId || 'temp_' + Date.now(), // Lấy ID thật nếu có
                shiftCode: selectedShiftInfo.code || selectedShiftInfo.name, 
                startTime: selectedShiftInfo.start,
                endTime: selectedShiftInfo.end,
                employeeId: targetCell.empId,
                date: targetCell.date,
                // Các trường bổ sung cho khớp logic hiển thị
                assignmentDate: targetCell.date
            };

            // Ghi đè vào ô đó
            newShifts[key] = [newDisplayShift]; 
            return newShifts;
        });

        // Đóng modal
        setModalState(p => ({...p, editVisible: false}));

        // Tải lại dữ liệu thật để đồng bộ
        setTimeout(() => { fetchAssignments(); }, 500);
        
      } catch (error) {
          console.error("❌ Lỗi API:", error);
          const msg = error.response?.data?.message || "Lỗi khi lưu. Dữ liệu không hợp lệ.";
          alert(msg);
      }
  }

  // --- XÓA PHÂN CA ---
  const handleDeleteShift = async () => {
      const { targetCell } = modalState;
      if (!targetCell) return;
      
      try {
          const shiftsToDelete = targetCell.shifts;
          for (const s of shiftsToDelete) {
              if (s.id) { 
                  await shiftscheduleApi.deleteAssignment(s.id);
              }
          }
          await fetchAssignments();
      } catch (error) {
          console.error(error);
          alert("Lỗi khi xóa phân ca!");
      }
  }

  const handleExportExcel = () => {
    // Logic export excel giữ nguyên
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
                    {/* Action Hover */}
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

                    {cellShifts.map((shift, idx) => (
                        <div key={idx} className="shift-item">
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
          {/* ĐÃ CHỈNH SỬA TẠI ĐÂY: XÓA NÚT "ĐƠN VỊ" TRONG BỘ 3 NÚT */}
          <div className="summary-header-tabs">
            <button className="tab-button active">Nhân viên</button>
            <button className="tab-button" onClick={() => navigate('/timesheet/shiftassignmentSummary/shift')}>Ca làm việc</button>
          </div>
          <div className="summary-header-actions">
            <CButton color="secondary" variant="outline" onClick={handleJumpToToday}>Hôm nay</CButton>
            {/* <CButton className="btn-orange" onClick={() => alert("Chức năng này đang được bảo trì, vui lòng dùng nút sửa trong bảng!")}>Phân ca hàng loạt</CButton> */}
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

      <DateRangeModal visible={showDateRangeModal} onClose={() => setShowDateRangeModal(false)} initialStart={startDate} initialEnd={endDate} onApply={handleDateRangeApply} />
      
      {/* MODAL SỬA CA (Sử dụng dữ liệu ca từ database) */}
      <EditShiftModal 
        visible={modalState.editVisible} 
        onClose={() => setModalState(p => ({...p, editVisible: false}))} 
        onSave={handleSaveShift}
        targetCell={modalState.targetCell}
        availableShifts={availableShifts} // Danh sách ca từ database
        employees={employees}
      />

      {/* MODAL XÓA CA */}
      <DeleteShiftModal 
        visible={modalState.deleteVisible} 
        onClose={() => setModalState(p => ({...p, deleteVisible: false}))} 
        onConfirm={handleDeleteShift}
        targetCell={modalState.targetCell}
        employees={employees}
      />

    </React.Fragment>
  )
}

export default ShiftAssignmentSummary