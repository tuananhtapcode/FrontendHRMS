import { cilPencil, cilTrash } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import {
  CButton,
  CFormCheck,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
import './pageTable.css'

/**
 * @param {object} props
 * @param {Array<object>} props.shifts - Mảng dữ liệu ca
 * @param {function} props.onEdit - Hàm gọi khi bấm Sửa
 * @param {function} props.onDelete - Hàm gọi khi bấm Xóa
 */
// 1. NHẬN THÊM onEdit VÀ onDelete TỪ PROPS
const PageTable = ({ shifts, onEdit, onDelete }) => {
  // Kiểm tra an toàn, nếu shifts không có, dùng mảng rỗng
  const safeShifts = Array.isArray(shifts) ? shifts : []

  return (
    <div className="shift-table-container">
      <CTable hover responsive>
        <CTableHead>
          <CTableRow>
            {/* 2. THÊM CLASSNAME "sticky-col-first" */}
            <CTableHeaderCell style={{ width: '40px' }} className="sticky-col-first">
              <CFormCheck />
            </CTableHeaderCell>

            <CTableHeaderCell className="sortable-header">Mã ca </CTableHeaderCell>
            <CTableHeaderCell>Tên ca</CTableHeaderCell>
            <CTableHeaderCell>Đơn vị áp dụng</CTableHeaderCell>
            <CTableHeaderCell>Giờ bắt đầu ca</CTableHeaderCell>
            <CTableHeaderCell>Chấm vào đầu ca từ</CTableHeaderCell>
            <CTableHeaderCell>Chấm vào đầu ca đến</CTableHeaderCell>

            {/* 3. THÊM LẠI CỘT TIÊU ĐỀ HÀNH ĐỘNG (NHƯNG DÍNH CỐ ĐỊNH) */}
            <CTableHeaderCell className="action-header sticky-col-last">
              {/* Không cần tiêu đề */}
            </CTableHeaderCell>
          </CTableRow>
        </CTableHead>

        <CTableBody>
          {safeShifts.map((shift) => (
            <CTableRow key={shift.id}>
              {/* 4. THÊM CLASSNAME "sticky-col-first" */}
              <CTableDataCell className="sticky-col-first">
                <CFormCheck />
              </CTableDataCell>

              <CTableDataCell>{shift.code}</CTableDataCell>
              <CTableDataCell>{shift.name}</CTableDataCell>
              <CTableDataCell>{shift.unit}</CTableDataCell>
              <CTableDataCell>{shift.startTime}</CTableDataCell>
              <CTableDataCell>{shift.checkInFrom}</CTableDataCell>

              {/* 5. TRẢ Ô "CHẤM VÀO ĐẾN" VỀ BÌNH THƯỜNG (KHÔNG CÒN NÚT) */}
              <CTableDataCell>
                <span>{shift.checkInTo}</span>
              </CTableDataCell>

              {/* 6. TẠO Ô HÀNH ĐỘNG MỚI (DÍNH CỐ ĐỊNH Ở CUỐI) */}
              <CTableDataCell className="action-cell-container sticky-col-last">
                <div className="row-actions">
                  <CButton
                    size="sm"
                    color="warning"
                    variant="outline"
                    onClick={() => onEdit(shift)}
                  >
                    <CIcon icon={cilPencil} />
                  </CButton>
                  <CButton
                    size="sm"
                    color="danger"
                    variant="outline"
                    onClick={() => onDelete(shift)}
                  >
                    <CIcon icon={cilTrash} />
                  </CButton>
                </div>
              </CTableDataCell>
            </CTableRow>
          ))}
        </CTableBody>
      </CTable>
    </div>
  )
}

export default PageTable