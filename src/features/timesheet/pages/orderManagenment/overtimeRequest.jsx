
import {
    cilCloudUpload, cilFile, cilFilter, cilPencil, cilPlus, cilReload, cilSearch, cilSettings, cilTrash, cilX
} from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import {
    CButton, CDropdown, CDropdownItem, CDropdownMenu, CDropdownToggle, CFormCheck, CFormInput, CInputGroup, CInputGroupText,
    CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle, CSpinner, CTable, CTableBody, CTableDataCell, CTableHead, CTableHeaderCell, CTableRow, CTooltip
} from '@coreui/react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// ✅ IMPORT SERVICE
import { overtimeService } from '../../api/overtimeService';

// =====================================================================
// 0. CẤU HÌNH CỘT (UPDATE THEO API)
// =====================================================================
const DEFAULT_COLUMNS = [
    { key: 'checkbox', label: '', visible: true, width: 50, type: 'checkbox' },
    { key: 'emp_code', label: 'Mã NV', visible: true, width: 100 },
    { key: 'applicant', label: 'Người làm OT', visible: true, width: 180 },
    { key: 'approver', label: 'Người duyệt', visible: false, width: 180 }, // Cột này cần map tên
    { key: 'date', label: 'Ngày làm', visible: true, width: 120, align: 'center' },
    { key: 'startTime', label: 'Bắt đầu', visible: true, width: 100, align: 'center' },
    { key: 'endTime', label: 'Kết thúc', visible: true, width: 100, align: 'center' },
    { key: 'totalHours', label: 'Tổng giờ', visible: true, width: 100, align: 'center' },
    { key: 'reason', label: 'Lý do', visible: true, width: 200 },
    { key: 'status', label: 'Trạng thái', visible: true, width: 140, align: 'center' },
    { key: 'actions', label: '', visible: true, width: 80 }
];

const INITIAL_FILTERS = { 
    search: '', 
    status: 'all', 
    columnFilters: {} 
};

// Map trạng thái sang tiếng Việt
const mapStatusToVN = (status) => {
    switch (status) {
        case 'APPROVED': return 'Đã duyệt';
        case 'PENDING': return 'Chờ duyệt';
        case 'REJECTED': return 'Từ chối';
        case 'CANCELLED': return 'Đã hủy';
        default: return status;
    }
};

// Map Filter Frontend -> Backend
const mapStatusToBackend = (vnStatus) => {
    switch (vnStatus) {
        case 'Đã duyệt': return 'APPROVED';
        case 'Chờ duyệt': return 'PENDING';
        case 'Từ chối': return 'REJECTED';
        default: return null;
    }
};

// =====================================================================
// 1. CSS & POPUP (GIỮ NGUYÊN)
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
        .status-cancelled { background-color: #e2e3e5; color: #636f83; }
        `}
    </style>
)

const AdvancedFilterPopup = ({ visible, onClose, onApply, columns }) => {
    const [checkedColumns, setCheckedColumns] = useState({});
    const [columnSearchValues, setColumnSearchValues] = useState({});
    if (!visible) return null;
    const handleApply = () => {
        const activeFilters = {};
        Object.keys(checkedColumns).forEach(key => {
            if (checkedColumns[key] && columnSearchValues[key]) activeFilters[key] = columnSearchValues[key];
        });
        onApply(activeFilters); onClose();
    };
    const handleClear = () => { setCheckedColumns({}); setColumnSearchValues({}); onApply({}); onClose(); };
    return (
        <div className="popup-container filter-popup">
            <div className="popup-header"><h5 className="popup-title">Bộ lọc nâng cao</h5><CButton color="link" onClick={onClose} className="p-0 text-secondary"><CIcon icon={cilX} /></CButton></div>
            <div className="popup-body">{columns.filter(c => c.key !== 'checkbox' && c.key !== 'actions' && c.visible).map(col => (<div key={col.key} className="mb-2"><CFormCheck label={col.label} checked={!!checkedColumns[col.key]} onChange={() => setCheckedColumns(p => ({ ...p, [col.key]: !p[col.key] }))} />{checkedColumns[col.key] && (<CFormInput size="sm" className="mt-1 ms-4" placeholder={`Lọc ${col.label}...`} value={columnSearchValues[col.key] || ''} onChange={e => setColumnSearchValues(p => ({ ...p, [col.key]: e.target.value }))} />)}</div>))}</div>
            <div className="popup-footer"><CButton color="light" size="sm" onClick={handleClear}>Bỏ lọc</CButton><CButton size="sm" className="btn-orange text-white" onClick={handleApply}>Áp dụng</CButton></div>
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
            <div className="popup-body">{tempColumns.map(col => col.key !== 'checkbox' && col.key !== 'actions' && (<div key={col.key} className="col-setting-item"><CFormCheck label={col.label} checked={col.visible} onChange={() => setTempColumns(p => p.map(c => c.key === col.key ? { ...c, visible: !c.visible } : c))} /></div>))}</div>
            <div className="popup-footer"><CButton color="light" size="sm" onClick={() => { onResetDefault(); onClose(); }}>Mặc định</CButton><CButton size="sm" className="btn-orange text-white" onClick={handleSave}>Lưu</CButton></div>
        </div>
    )
}

const PageHeader = ({ onImportClick, onAddClick }) => (
    <div className="page-header">
        <div className="page-title">Quản lý làm thêm giờ (OT)</div>
        <div className="header-actions">
            {/* <CButton color="secondary" variant="outline" className="fw-semibold bg-white text-dark border-secondary" onClick={onImportClick}><CIcon icon={cilCloudUpload} className="me-2" />Nhập khẩu</CButton> */}
            {/* <CButton className="btn-orange" onClick={onAddClick}><CIcon icon={cilPlus} className="me-1" /> Thêm</CButton> */}
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
                    <CFormInput className="border-start-0 ps-0" placeholder="Tìm kiếm (Tên, Mã NV, Lý do...)" value={filters.search} onChange={(e) => onFilterChange((prev) => ({ ...prev, search: e.target.value }))} size="sm" />
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
                <CTooltip content="Tải lại"><CButton variant="outline" color="dark" size="sm" className="btn-icon-only" onClick={onReload}><CIcon icon={cilReload} /></CButton></CTooltip>
                <CTooltip content="Xuất Excel"><CButton variant="outline" color="dark" size="sm" className="btn-icon-only" onClick={onExportExcel}>Xuất Excel</CButton></CTooltip>
                <div style={{ position: 'relative', display: 'inline-block' }}><CTooltip content="Bộ lọc nâng cao"><CButton variant="outline" color="dark" size="sm" className="btn-icon-only" onClick={() => { setShowFilterPopup(!showFilterPopup); setShowSettingsPopup(false); }} active={showFilterPopup}><CIcon icon={cilFilter} /></CButton></CTooltip><AdvancedFilterPopup visible={showFilterPopup} onClose={() => setShowFilterPopup(false)} onApply={onApplyAdvancedFilter} columns={columns} /></div>
                <div style={{ position: 'relative', display: 'inline-block' }}><CTooltip content="Cài đặt cột"><CButton variant="outline" color="dark" size="sm" className="btn-icon-only" onClick={() => { setShowSettingsPopup(!showSettingsPopup); setShowFilterPopup(false); }} active={showSettingsPopup}><CIcon icon={cilSettings} /></CButton></CTooltip><ColumnSettingsPopup visible={showSettingsPopup} onClose={() => setShowSettingsPopup(false)} columns={columns} onUpdateColumns={onUpdateColumns} onResetDefault={onResetDefaultColumns} /></div>
            </div>
        </div>
    )
}

const PageTable = ({ data, columns, onEdit, onDelete }) => {
    const visibleColumns = columns.filter(col => col.visible);
    return (
        <div className="table-wrapper-fullscreen">
            <CTable hover className="mb-0" align="middle" style={{ minWidth: '1500px' }}>
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
                                    
                                    // XỬ LÝ CỘT ACTIONS
                                    if (col.key === 'actions') { return (<CTableDataCell key={`${item.id}-${col.key}`} className="sticky-col-last"><div className="row-actions"><CTooltip content="Chỉnh sửa"><button className="btn-action edit" onClick={() => onEdit(item.id)}><CIcon icon={cilPencil} /></button></CTooltip><CTooltip content="Xóa"><button className="btn-action delete" onClick={() => onDelete(item.id)}><CIcon icon={cilTrash} /></button></CTooltip></div></CTableDataCell>); }
                                    
                                    if (col.type === 'checkbox') return <CTableDataCell key={`${item.id}-${col.key}`} className="text-center"><CFormCheck /></CTableDataCell>;
                                    
                                    // XỬ LÝ CỘT STATUS
                                    if (col.key === 'status') {
                                        let badgeClass = 'badge-status ';
                                        if (item.status === 'Đã duyệt') badgeClass += 'status-approved';
                                        else if (item.status === 'Từ chối') badgeClass += 'status-rejected';
                                        else if (item.status === 'Đã hủy') badgeClass += 'status-cancelled';
                                        else badgeClass += 'status-pending';
                                        return <CTableDataCell key={`${item.id}-${col.key}`} className="text-center"><span className={badgeClass}>{item.status}</span></CTableDataCell>;
                                    }
                                    
                                    // ✅ XỬ LÝ CỘT APPROVER (Render component React nếu có)
                                    if (col.key === 'approver' && typeof item[col.key] === 'object' && item[col.key] !== null && !Array.isArray(item[col.key])) {
                                        return <CTableDataCell key={`${item.id}-${col.key}`} className={className} style={{ fontSize: '0.9rem', color: '#333' }}>{item[col.key]}</CTableDataCell>;
                                    }

                                    // RENDER CÁC CỘT KHÁC (string, number)
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

    // --- HÀM FETCH DATA  ---
    const fetchData = useCallback(async (currentFilters) => {
        setIsFiltering(true);
        try {
            const params = { page: 0, size: 20 };
            const backendStatus = mapStatusToBackend(currentFilters.status);
            if (backendStatus) params.status = backendStatus;

            // 1. Gọi API song song: Lấy đơn OT + Lấy DS Nhân viên
            const [otRes, empRes] = await Promise.all([
                overtimeService.getAll(params),
                overtimeService.getAllEmployees()
            ]);

            // 2. Tạo từ điển nhân viên (Map ID -> Tên & Mã)
            const empMap = {};
            const empList = empRes?.data?.employees || [];

            if (empList.length > 0) {
                empList.forEach(e => {
                    // Dùng String() để đảm bảo key là string
                    empMap[String(e.employeeId)] = {
                        code: e.employeeCode,
                        name: e.fullName
                    };
                });
            }

            // 3. Map dữ liệu để hiển thị ra bảng
            const rawList = otRes?.data?.content || [];
            const mappedList = rawList.map(item => {
                // Tra cứu thông tin người làm OT
                const empInfo = empMap[String(item.employeeId)] || {
                    code: '---',
                    name: `ID: ${item.employeeId}`
                };

                // ✅ LOGIC TRA CỨU TÊN NGƯỜI DUYỆT (FIXED)
                let approverName;
                const approverId = item.accountApproverId; 
                
                if (approverId) {
                    const approverInfo = empMap[String(approverId)];
                    // Nếu tìm thấy tên trong Map thì dùng tên (string)
                    approverName = approverInfo ? approverInfo.name : `ID: ${approverId}`; 
                } else {
                    // Nếu ID là NULL, hiển thị component React (Object)
                    approverName = <span className="text-secondary fst-italic small">-- Chưa duyệt --</span>;
                }

                return {
                    id: item.id,
                    emp_code: empInfo.code,
                    applicant: empInfo.name,
                    approver: approverName, // String hoặc Component
                    date: item.date,
                    startTime: item.startTime ? item.startTime.slice(0, 5) : '',
                    endTime: item.endTime ? item.endTime.slice(0, 5) : '',
                    totalHours: item.totalHours,
                    reason: item.reason,
                    status: mapStatusToVN(item.status),
                };
            });

            // 4. Các logic lọc Search (Giữ nguyên, dùng String() để search được cả component)
            let finalResult = mappedList;
            if (currentFilters.search) {
                const searchLower = currentFilters.search.toLowerCase();
                finalResult = finalResult.filter(item =>
                    item.emp_code.toLowerCase().includes(searchLower) ||
                    item.applicant.toLowerCase().includes(searchLower) ||
                    String(item.approver).toLowerCase().includes(searchLower) || 
                    item.reason.toLowerCase().includes(searchLower)
                );
            }

            // 5. Logic lọc cột (Giữ nguyên)
            const colFilters = currentFilters.columnFilters;
            if (colFilters && Object.keys(colFilters).length > 0) {
                finalResult = finalResult.filter(item => {
                    return Object.keys(colFilters).every(key => {
                        const filterValue = colFilters[key].toString().toLowerCase().trim();
                        const itemValue = String(item[key] || '').toLowerCase();
                        return itemValue.includes(filterValue);
                    });
                });
            }

            setData(finalResult);

        } catch (error) {
            console.error("Lỗi tải dữ liệu OT:", error);
            setData([]);
        } finally {
            setLoading(false);
            setIsFiltering(false);
        }
    }, []);

    useEffect(() => {
        fetchData(filters);
    }, [filters, fetchData]);

    // --- XỬ LÝ XÓA ---
const handleDelete = async (id) => {
    const currentItem = data.find(item => item.id === id);

    // Tùy thông báo dựa trên trạng thái hiện tại
    const confirmMsg = currentItem && currentItem.status !== 'Chờ duyệt'
        ? `Đơn OT này đang "${currentItem.status}". Bạn có chắc chắn muốn hủy không?`
        : "Bạn có chắc chắn muốn xóa/hủy đơn OT này không?";

    if (window.confirm(confirmMsg)) {
        try {
            await overtimeService.cancel(id); 
            alert("Đã xóa/hủy thành công!");
            handleReload(); 
        } catch (error) {
            console.error("Lỗi xóa:", error);
            const serverMsg = error.response?.data?.message || "";
            alert(`Không thể xóa/hủy.\nLý do: ${serverMsg}`);
        }
    }
};


    const handleEdit = (id) => {
        // ✅ CHUYỂN HƯỚNG TỚI TRANG FORM SỬA KÈM ID
        navigate(`/timesheet/overtimeRequest/edit/${id}`);
    };

    const handleReload = () => {
        const defaultFilters = { search: '', status: 'all', columnFilters: {} }
        setFilters(defaultFilters)
        fetchData(defaultFilters)
    }

    // --- UI ---
    const handleFileSelect = (e) => { const file = e.target.files[0]; if (file) setImportFile(file); }
    const triggerFileSelect = () => fileInputRef.current.click();
    const handleConfirmImport = () => { if (!importFile) return; setVisibleImportModal(false); alert("Import thành công!"); }
    const handleExportExcel = () => { /* Logic export giữ nguyên */ };

    if (loading && !isFiltering) return <div className="d-flex justify-content-center align-items-center vh-100"><CSpinner color="primary" /></div>

    return (
        <>
            <PageStyles />
            <div className="page-container">
                <PageHeader onImportClick={() => { setVisibleImportModal(true); setImportFile(null); }} onAddClick={() => navigate('/timesheet/overtimeRequest/add')} />
                
                <FilterBar filters={filters} onFilterChange={setFilters} onExportExcel={handleExportExcel} onReload={handleReload} onApplyAdvancedFilter={(cf) => setFilters(p => ({ ...p, columnFilters: cf }))} columns={columns} onUpdateColumns={setColumns} onResetDefaultColumns={() => setColumns(DEFAULT_COLUMNS)} />
                
                {isFiltering ? (
                    <div className="d-flex justify-content-center p-5 table-wrapper-fullscreen"><CSpinner color="primary" /></div>
                ) : (
                    <PageTable 
                        data={data} 
                        columns={columns} 
                        onEdit={handleEdit}     // Hàm xử lý nút Bút chì
                        onDelete={handleDelete} // Hàm xử lý nút Xóa
                    />
                )}
            </div>
            {/* Modal Import giữ nguyên */}
            <CModal alignment="center" size="lg" visible={visibleImportModal} onClose={() => setVisibleImportModal(false)}>
                <CModalHeader><CModalTitle className="fw-bold fs-5">Nhập khẩu dữ liệu làm thêm</CModalTitle></CModalHeader>
                <CModalBody>
                    <div className="import-steps"><span className="step-item active">1. Tải lên tệp</span><span className="step-item text-muted"> &gt; 2. Kiểm tra dữ liệu</span></div>
                    <div className="upload-zone" onClick={!importFile ? triggerFileSelect : undefined}>
                        {importFile ? (<div><CIcon icon={cilFile} size="3xl" className="text-success mb-3" /><div className="fw-bold text-success">{importFile.name}</div><CButton color="link" className="text-danger mt-2 text-decoration-none" onClick={(e) => { e.stopPropagation(); setImportFile(null); }}>Xóa file</CButton></div>) : (<><div className="upload-text">Kéo thả tệp vào đây</div><input type="file" ref={fileInputRef} onChange={handleFileSelect} accept=".xls,.xlsx" style={{ display: 'none' }} /><CButton variant="outline" className="btn-upload-select" onClick={(e) => { e.stopPropagation(); triggerFileSelect(); }}><CIcon icon={cilCloudUpload} className="me-2" />Chọn tệp</CButton><div className="upload-hint">File .xls, .xlsx</div></>)}
                    </div>
                    <div className="text-center"><a href="#" style={{ color: '#ea580c', textDecoration: 'none', fontWeight: 600 }}>Tải xuống tệp mẫu</a></div>
                </CModalBody>
                <CModalFooter className="bg-light border-top-0"><CButton color="white" className="border" onClick={() => setVisibleImportModal(false)}>Hủy</CButton><CButton className="btn-orange text-white" onClick={handleConfirmImport}>Tiếp theo</CButton></CModalFooter>
            </CModal>
        </>
    )
}

export default OvertimeRequestPage;