import { cilSearch } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import {
  CButton,
  CDropdown,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
  CFormInput,
  CInputGroup,
  CInputGroupText,
} from '@coreui/react'
import './pageHeader.css'

/**
 * @param {object} props
 * @param {object} props.filters - State filter từ cha
 * @param {function} props.onFilterChange - Hàm setFilters từ cha
 * @param {function} props.onAddNew - Hàm xử lý khi bấm nút Thêm
 * @param {function} props.onExport - (MỚI) Hàm xử lý khi bấm Xuất Excel
 */
const PageHeader = ({ filters, onFilterChange, onAddNew, onExport }) => {

  // ... (code các hàm handle... của bạn giữ nguyên) ...
  const handleSearchChange = (e) => {
    onFilterChange((prev) => ({ ...prev, search: e.target.value }))
  }
  const handleStatusChange = (status) => {
    onFilterChange((prev) => ({ ...prev, status: status }))
  }
  const getStatusText = () => {
    if (filters.status === 'active') return 'Đang áp dụng'
    if (filters.status === 'inactive') return 'Ngừng áp dụng'
    return 'Trạng thái: Tất cả'
  }

  // (MỚI) Nếu chưa có hàm onExport, dùng tạm hàm này
  const handleExport = onExport || (() => alert('Chức năng Xuất Excel!'));

  return (
    <div className="shift-schedule-header">
      {/* HÀNG 1: TIÊU ĐỀ VÀ NÚT THÊM */}
      <div className="header-row-1">
        <h2 className="header-title">Ca làm việc</h2>

        {/* 1. Chỉ giữ lại nút "+ Thêm" đơn lẻ */}
        <CButton color="primary" onClick={onAddNew}>
          + Thêm
        </CButton>
      </div>

      {/* HÀNG 2: THANH LỌC VÀ TÌM KIẾM */}
      <div className="header-row-2">
        <div className="filter-group-left">
          <CInputGroup className="search-bar">
            <CInputGroupText>
              <CIcon icon={cilSearch} />
            </CInputGroupText>
            <CFormInput
              placeholder="Tìm kiếm theo Tên hoặc Mã ca"
              value={filters.search}
              onChange={handleSearchChange}
            />
          </CInputGroup>
        </div>
        <div className="filter-group-right">

          {/* 2. THÊM NÚT "XUẤT EXCEL" VÀO ĐÂY */}
          <CButton
            color="secondary"
            variant="outline"
            style={{ marginRight: '12px' }} // Thêm khoảng cách với nút bên phải
            onClick={handleExport}
          >
            Xuất tệp Excel
          </CButton>

          {/* 3. DROPDOWN TRẠNG THÁI (Giữ nguyên) */}
          <CDropdown>
            <CDropdownToggle color="secondary" variant="outline">
              {getStatusText()}
            </CDropdownToggle>
            <CDropdownMenu>
              <CDropdownItem onClick={() => handleStatusChange('all')}>
                Tất cả
              </CDropdownItem>
              <CDropdownItem onClick={() => handleStatusChange('active')}>
                Đang áp dụng
              </CDropdownItem>
              <CDropdownItem onClick={() => handleStatusChange('inactive')}>
                Ngừng áp dụng
              </CDropdownItem>
            </CDropdownMenu>
          </CDropdown>
        </div>
      </div>
    </div>
  )
}

export default PageHeader