// src/features/payroll/pages/periods/PayrollPeriodListPage.jsx
import {
  CBadge,
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { fetchPayrollPeriods } from '../../api/periodApi'

const statusColor = (status) => {
  const s = status?.toLowerCase() || ''
  if (s.includes('duyệt')) return 'success'
  if (s.includes('đóng') || s.includes('đã chi')) return 'secondary'
  if (s.includes('nháp')) return 'warning'
  return 'info'
}

export default function PayrollPeriodListPage() {
  const [periods, setPeriods] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    let ignore = false
    async function load() {
      try {
        const data = await fetchPayrollPeriods()
        if (!ignore) setPeriods(data || [])
      } finally {
        if (!ignore) setLoading(false)
      }
    }
    load()
    return () => {
      ignore = true
    }
  }, [])

  const gotoDetail = (p) => {
    navigate(`/payroll/periods/${p.id}`, {
      state: { period: p },
    })
  }

  return (
    <CCard>
      <CCardHeader className="d-flex justify-content-between align-items-center">
        <div>
          <div className="fw-semibold">Quản lý kỳ lương</div>
          <div className="text-medium-emphasis small">
            Danh sách tất cả kỳ lương (mới nhất ở trên cùng)
          </div>
        </div>

        <div className="d-flex gap-2">
          <CButton
            color="secondary"
            variant="outline"
            size="sm"
            onClick={() => navigate('/payroll')}
          >
            Quay lại tổng quan
          </CButton>

          {/* sau này nếu muốn có nút tạo mới thì bật cái này */}
          {/* 
          <CButton color="primary" size="sm">
            Tạo kỳ lương mới
          </CButton> 
          */}
        </div>
      </CCardHeader>

      <CCardBody>
        {loading ? (
          <div>Đang tải dữ liệu...</div>
        ) : (
          <CTable hover align="middle">
            <CTableHead color="light">
              <CTableRow>
                <CTableHeaderCell>Tên kỳ lương</CTableHeaderCell>
                <CTableHeaderCell>Trạng thái</CTableHeaderCell>
                <CTableHeaderCell>Chu kỳ</CTableHeaderCell>
                <CTableHeaderCell>Ngày chi trả</CTableHeaderCell>
                <CTableHeaderCell className="text-end">
                  SL Nhân viên
                </CTableHeaderCell>
                <CTableHeaderCell className="text-end">
                  Tổng thực chi
                </CTableHeaderCell>
                <CTableHeaderCell>Người lập</CTableHeaderCell>
                <CTableHeaderCell className="text-center">
                  Hành động
                </CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {periods.map((p) => (
                <CTableRow key={p.id}>
                  <CTableDataCell
                    role="button"
                    className="text-primary fw-semibold"
                    onClick={() =>
                      navigate(`/payroll/periods/${p.id}`, { state: { period: p } })
                    }
                  >
                    {p.name}
                  </CTableDataCell>
                  <CTableDataCell>
                    <CBadge color={statusColor(p.status)}>{p.status}</CBadge>
                  </CTableDataCell>
                  <CTableDataCell>{p.timeRange}</CTableDataCell>
                  <CTableDataCell>{p.paymentDate}</CTableDataCell>
                  <CTableDataCell className="text-end">
                    {p.headcount?.toLocaleString('vi-VN')}
                  </CTableDataCell>
                  <CTableDataCell className="text-end">
                    {p.totalPaid?.toLocaleString('vi-VN')} đ
                  </CTableDataCell>
                  <CTableDataCell>{p.createdBy}</CTableDataCell>
                  <CTableDataCell className="text-center">
                    <CButton
                      size="sm"
                      color="link"
                      onClick={() =>
                        navigate(`/payroll/periods/${p.id}`, { state: { period: p } })
                      }
                    >
                      Xem chi tiết
                    </CButton>
                  </CTableDataCell>
                </CTableRow>
              ))}
            </CTableBody>
          </CTable>
        )}
      </CCardBody>
    </CCard>
  )
}
