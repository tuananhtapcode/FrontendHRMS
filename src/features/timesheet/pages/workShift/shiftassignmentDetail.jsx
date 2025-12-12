
import {
  cilFilter,
  cilPencil,
  cilPlus,
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
  CSpinner,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CTooltip
} from '@coreui/react';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// =====================================================================
// 0. CẤU HÌNH CỘT
// =====================================================================
const DEFAULT_COLUMNS = [
  { key: 'checkbox', label: '', visible: true, width: 40, type: 'checkbox' },
  { key: 'assignment_name', label: 'Tên bảng phân ca', visible: true, width: 200 },
  { key: 'shift_name', label: 'Ca làm việc', visible: true, width: 150 },
  { key: 'time_range', label: 'Thời gian áp dụng', visible: true, width: 220, align: 'center' },
  { key: 'unit_name', label: 'Đơn vị áp dụng', visible: true, width: 200 },
  { key: 'target_employees', label: 'Đối tượng áp dụng', visible: true, width: 300 },
  { key: 'actions', label: '', visible: true, width: 90, fixed: 'right' },
];

// =====================================================================
// 1. STYLE
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
    /* ✅ Sticky col */
    .sticky-col-first {
      position: sticky;
      left: 0;
      z-index: 9;
      background: #fff;
    }

    .sticky-col-last {
      position: sticky;
      right: 0;
      z-index: 9;
      background: #fff;
    }

    /* ✅ Action buttons */
    .row-actions {
      display: flex;
      justify-content: center;
      gap: 8px;

      opacity: 0;
      visibility: hidden;
      transform: translateY(4px);
      transition: all 0.15s ease-in-out;
    }

    /* Hover dòng thì show nút */
    tbody tr:hover .row-actions {
      opacity: 1;
      visibility: visible;
      transform: translateY(0);
    }

    .btn-action {
      width: 30px;
      height: 30px;
      border-radius: 50%;
      border: none;
      background: transparent;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      color: #6b7280;
      transition: all 0.15s ease;
    }

    .btn-action:hover {
      background: #f1f5f9;
      transform: scale(1.05);
    }

    .btn-action.edit:hover {
      color: #f59e0b;
      background-color: #fef3c7;
    }

    .btn-action.delete:hover {
      color: #ef4444;
      background-color: #fee2e2;
    }

    `}
  </style>
)

// =====================================================================
// 2. COMPONENTS
// =====================================================================

const PageHeader = () => {
  const navigate = useNavigate();
  return (
    <div className="page-header">
      <div className="page-title">Phân ca chi tiết</div>
      <div className="header-actions">
        <CButton className="btn-orange" onClick={() => navigate('/timesheet/ShiftAssignmentDetail/add')}>
          <CIcon icon={cilPlus} className="me-1" /> Thêm
        </CButton>
      </div>
    </div>
  )
}

// --- CẬP NHẬT: POPUP BỘ LỌC NÂNG CAO ---
const AdvancedFilterPopup = ({ visible, onClose, onApply, columns }) => {
  const [checkedColumns, setCheckedColumns] = useState({});
  const [columnSearchValues, setColumnSearchValues] = useState({});

  if (!visible) return null;

  const handleCheckColumn = (key) => setCheckedColumns(p => ({ ...p, [key]: !p[key] }));

  // 1. Logic nút Áp dụng: Chỉ lấy các cột được check VÀ có nhập giá trị
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

  // 2. Logic nút Bỏ lọc: Reset hết state và gửi object rỗng
  const handleClear = () => {
    setCheckedColumns({});
    setColumnSearchValues({});
    onApply({}); // Reset bộ lọc cha
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
      {/* Footer có 2 nút */}
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

const FilterBar = ({ filters, onFilterChange, onApplyAdvancedFilter, columns, onUpdateColumns, onResetDefaultColumns }) => {
  const [showFilterPopup, setShowFilterPopup] = useState(false);
  const [showSettingsPopup, setShowSettingsPopup] = useState(false);

  return (
    <div className="filter-bar">
      <div className="filter-left">
        <CInputGroup className="search-bar">
          <CInputGroupText className="bg-white border-end-0 text-secondary"><CIcon icon={cilSearch} size="sm" /></CInputGroupText>
          <CFormInput className="border-start-0 ps-0" placeholder="Tìm kiếm" value={filters.search} onChange={(e) => onFilterChange((prev) => ({ ...prev, search: e.target.value }))} size="sm" />
        </CInputGroup>
      </div>
      <div className="filter-right" style={{ position: 'relative' }}>
        <CDropdown>
          <CDropdownToggle variant="outline" color="secondary" size="sm" className="bg-white text-dark border-secondary">
            Tất cả đơn vị
          </CDropdownToggle>
          <CDropdownMenu><CDropdownItem>Tất cả đơn vị</CDropdownItem><CDropdownItem>Thuận Nguyễn Phúc</CDropdownItem></CDropdownMenu>
        </CDropdown>

        <div style={{ position: 'relative', display: 'inline-block' }}>
          <CTooltip content="Bộ lọc"><CButton variant="outline" color="dark" size="sm" className="btn-icon-only" onClick={() => { setShowFilterPopup(!showFilterPopup); setShowSettingsPopup(false); }} active={showFilterPopup}><CIcon icon={cilFilter} /></CButton></CTooltip>
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

const PageTable = ({ data, columns }) => {
  const visibleColumns = columns.filter(col => col.visible);

  return (
    <div className="table-wrapper-fullscreen">
      <CTable hover className="mb-0" align="middle" style={{ minWidth: 'max-content' }}>

        {/* ===================== HEADER ===================== */}
        <CTableHead>
          <CTableRow>
            {visibleColumns.map((col) => {
              let className = "table-header-cell";
              
              if (col.align) className += ` text-${col.align}`;
              if (col.fixed === 'left') className += " sticky-col-first";
              if (col.fixed === 'right') className += " sticky-col-last";

              return (
                <CTableHeaderCell
                  key={col.key}
                  className={className}
                  style={{ width: col.width }}
                >
                  {col.type === 'checkbox'
                    ? <div className="text-center"><CFormCheck /></div>
                    : col.label}
                </CTableHeaderCell>
              );
            })}
          </CTableRow>
        </CTableHead>

        {/* ===================== BODY ===================== */}
        <CTableBody>
          {data.length > 0 ? (
            data.map((item) => (
              <CTableRow key={item.id}>
                {visibleColumns.map((col) => {
                  
                  let className = "";
                  if (col.align) className += ` text-${col.align}`;
                  if (col.fixed === 'left') className += " sticky-col-first";
                  if (col.fixed === 'right') className += " sticky-col-last";

                  let content = item[col.key];

                  // Checkbox
                  if (col.type === 'checkbox') {
                    content = <div className="text-center"><CFormCheck /></div>;
                  }

                  // ================= ACTIONS BUTTONS =================
                  if (col.key === "actions") {
                    content = (
                      <div className="row-actions">

                        <CTooltip content="Chỉnh sửa">
                          <button
                            className="btn-action edit"
                            onClick={() => console.log("Edit:", item)}
                          >
                            <CIcon icon={cilPencil} />
                          </button>
                        </CTooltip>

                        <CTooltip content="Xóa">
                          <button
                            className="btn-action delete"
                            onClick={() => window.confirm(`Xóa "${item.assignment_name}"?`)}
                          >
                            <CIcon icon={cilTrash} />
                          </button>
                        </CTooltip>

                      </div>
                    );
                  }

                  return (
                    <CTableDataCell
                      key={`${item.id}-${col.key}`}
                      className={className}
                      style={{ fontSize: "0.9rem", color: "#333" }}
                    >
                      {content}
                    </CTableDataCell>
                  );

                })}
              </CTableRow>
            ))
          ) : (
            <CTableRow>
              <CTableDataCell colSpan={visibleColumns.length} className="text-center py-4 text-muted">
                Không có dữ liệu
              </CTableDataCell>
            </CTableRow>
          )}
        </CTableBody>

      </CTable>
    </div>
  );
};


// =====================================================================
// 5. MOCK DATA
// =====================================================================
const MOCK_DATA = [
  { id: 1, assignment_name: 'qwe', shift_name: 'Ca hành chính', time_range: '03/12/2025 - 03/12/2025', unit_name: 'Thuận Nguyễn Phúc', target_employees: 'Thuận Nguyễn; Trần Hải Lâm' },
  { id: 2, assignment_name: 'abc', shift_name: 'ABc', time_range: '03/12/2025 - 03/12/2025', unit_name: 'Thuận Nguyễn Phúc', target_employees: 'Thuận Nguyễn; Trần Hải Lâm' },
]

// =====================================================================
// 6. MAIN
// =====================================================================
const ShiftAssignmentDetail = () => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [columns, setColumns] = useState(DEFAULT_COLUMNS)
  const [filters, setFilters] = useState({ search: '', columnFilters: {} })

  useEffect(() => { setTimeout(() => { setData(MOCK_DATA); setLoading(false); }, 300); }, []);

  // --- CẬP NHẬT: LOGIC LỌC DỮ LIỆU ---
  const filteredData = useMemo(() => {
    return data.filter(item => {
      // 1. Tìm kiếm chung (Ô search)
      const search = filters.search.toLowerCase();
      const matchSearch = !search || Object.values(item).some(v => String(v).toLowerCase().includes(search));

      // 2. Tìm kiếm theo cột (Bộ lọc nâng cao)
      // Kiểm tra tất cả các key trong columnFilters.
      // item phải thỏa mãn TẤT CẢ các điều kiện lọc (Logic AND).
      const columnFilters = filters.columnFilters || {};
      const matchColumns = Object.keys(columnFilters).every(key => {
        const filterVal = columnFilters[key].toLowerCase();
        const itemVal = String(item[key] || '').toLowerCase();
        return itemVal.includes(filterVal);
      });

      // Kết hợp cả 2
      return matchSearch && matchColumns;
    });
  }, [data, filters]);

  if (loading) return <div className="d-flex justify-content-center p-5"><CSpinner color="warning" /></div>

  return (
    <>
      <PageStyles />
      <div className="page-container">
        <PageHeader />
        <FilterBar
          filters={filters} onFilterChange={setFilters}
          onApplyAdvancedFilter={(cf) => setFilters(p => ({ ...p, columnFilters: cf }))}
          columns={columns} onUpdateColumns={setColumns} onResetDefaultColumns={() => setColumns(DEFAULT_COLUMNS)}
        />
        <PageTable data={filteredData} columns={columns} />
      </div>
    </>
  )
}

export default ShiftAssignmentDetail