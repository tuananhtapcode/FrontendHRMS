import {
  CButton,
  CSpinner,
} from '@coreui/react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

// Imports cho Icons
import {
  cilDescription, // Icon tài liệu (dùng lại)
  cilPlus, // Icon dấu cộng
} from '@coreui/icons'
import CIcon from '@coreui/icons-react'

// =====================================================================
// 1. CSS TÙY CHỈNH (Cho trang trống)
// =====================================================================
const OvertimeRequestStyles = () => (
  <style>
    {`
    .page-container {
      padding: 1rem;
      height: calc(100vh - 100px); /* Trừ đi header của layout chính */
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: #fff; /* Nền trắng */
    }

    .empty-state-wrapper {
      text-align: center;
      max-width: 500px;
    }

    .empty-state-icon {
      width: 80px;
      height: 80px;
      color: #6f42c1; /* Màu tím nhạt giống trong ảnh Đơn xin nghỉ */
      margin-bottom: 1.5rem;
      opacity: 0.8;
    }

    .empty-state-title {
      font-size: 1.25rem;
      font-weight: 700;
      color: #3c4b64;
      margin-bottom: 0.5rem;
    }

    .empty-state-description {
      color: #768192;
      margin-bottom: 1.5rem;
      font-size: 0.95rem;
    }

    /* Custom nút Thêm (Primary Blue) */
    .btn-add-primary {
      padding: 0.5rem 1.5rem;
      font-weight: 600;
      display: inline-flex;
      align-items: center;
      gap: 8px;
      box-shadow: 0 2px 4px rgba(50, 31, 219, 0.2); /* Bóng mờ màu xanh */
    }
    `}
  </style>
)

// =====================================================================
// 2. COMPONENT TRẠNG THÁI TRỐNG (EMPTY STATE)
// =====================================================================
const EmptyState = ({ onAdd }) => {
  return (
    <div className="empty-state-wrapper">
      {/* Icon tài liệu */}
      <div className="mb-3">
        <CIcon icon={cilDescription} className="empty-state-icon" />
      </div>

      {/* Sửa tiêu đề */}
      <h3 className="empty-state-title">Đơn đăng kí đi muộn, về sớm</h3>

      {/* Sửa mô tả */}
      <p className="empty-state-description">
        Tổng hợp danh sách đơn đăng kí đi muộn, về sớm hoặc làm thêm giờ của nhân viên trong công ty
      </p>

      {/* Nút Thêm (Màu Primary, Không Dropdown) */}
      <CButton 
        color="primary" 
        className="btn-add-primary" 
        onClick={onAdd}
      >
        <CIcon icon={cilPlus} size="sm" />
        Thêm
      </CButton>
    </div>
  )
}

// =====================================================================
// 3. COMPONENT CHA (MAIN)
// =====================================================================
const OvertimeRequestPage = () => {
  // Giả sử chưa có dữ liệu (data = [])
  const [data, setData] = useState([]) 
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleAddNew = () => {
    // Sửa URL điều hướng đến trang thêm mới của Đăng kí làm thêm/đi muộn
    navigate('/timesheet/overtimeRequest/add') 
  }

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <CSpinner color="primary" />
      </div>
    )
  }

  return (
    <>
      <OvertimeRequestStyles />
      
      <div className="page-container">
        {/* Vì chưa có dữ liệu nên hiển thị màn hình Empty State */}
        {data.length === 0 ? (
          <EmptyState onAdd={handleAddNew} />
        ) : (
          <div>
            {/* Sau này nếu có dữ liệu thì hiển thị bảng ở đây */}
            <p>Đã có dữ liệu...</p>
          </div>
        )}
      </div>
    </>
  )
}

export default OvertimeRequestPage