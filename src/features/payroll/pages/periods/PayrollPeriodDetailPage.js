import {
  CBadge,
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
} from '@coreui/react'
import { useEffect, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { fetchPayrollPeriodById } from '../../api/periodApi'

// Helper màu status (tạm đơn giản)
const statusColor = (status = '') => {
  const s = status.toLowerCase()
  if (s.includes('duyệt')) return 'success'
  if (s.includes('chờ') || s.includes('pending')) return 'warning'
  if (s.includes('đóng') || s.includes('hủy')) return 'secondary'
  return 'info'
}

export default function PayrollPeriodDetailPage() {
  // ⚠️ Route là "periods/:id" nên phải lấy { id }
  const { id } = useParams()
  const location = useLocation()
  const navigate = useNavigate()

  // Nếu đi từ Overview, ta đã truyền state.period
  const [period, setPeriod] = useState(location.state?.period || null)
  const [loading, setLoading] = useState(!location.state?.period)
  const [error, setError] = useState(null)

  useEffect(() => {
    // Nếu đã có dữ liệu từ state (từ Overview) thì không cần gọi API nữa
    if (location.state?.period) return

    let cancelled = false

    ;(async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await fetchPayrollPeriodById(id)
        if (!cancelled) setPeriod(data)
      } catch (e) {
        console.error('fetchPayrollPeriodById error:', e)
        if (!cancelled) setError('Không tìm thấy kỳ lương')
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()

    return () => {
      cancelled = true
    }
  }, [id, location.state])

  if (loading) {
    return <div>Đang tải dữ liệu kỳ lương...</div>
  }

  if (error || !period) {
    return (
      <CCard>
        <CCardHeader className="d-flex justify-content-between align-items-center">
          <div className="fw-semibold">Chi tiết kỳ lương</div>
          <CButton
            color="secondary"
            variant="outline"
            size="sm"
            onClick={() => navigate('/payroll/periods')}
          >
            Quay về danh sách
          </CButton>
        </CCardHeader>
        <CCardBody>
          <p>{error || 'Không tìm thấy dữ liệu kỳ lương.'}</p>
        </CCardBody>
      </CCard>
    )
  }

  return (
    <CCard>
      <CCardHeader className="d-flex justify-content-between align-items-center">
        <div className="d-flex align-items-center gap-3">
          <div className="fw-semibold fs-5">Chi tiết kỳ lương</div>
          <div className="fw-semibold">{period.name}</div>
          <CBadge color={statusColor(period.status)} className="px-3 py-1">
            {period.status}
          </CBadge>
        </div>
        <div className="d-flex gap-2">
          <CButton
            color="secondary"
            variant="outline"
            size="sm"
            onClick={() => navigate(-1)}
          >
            Quay lại
          </CButton>
        </div>
      </CCardHeader>

      <CCardBody>
        <CRow className="mb-3">
          <CCol md={6}>
            <p><strong>Chu kỳ:</strong> {period.timeRange}</p>
            <p><strong>Ngày chi trả dự kiến:</strong> {period.paymentDate}</p>
            <p><strong>Người phê duyệt / lập:</strong> {period.approver || period.createdBy}</p>
          </CCol>
          <CCol md={6}>
            <p>
              <strong>Tổng thực chi:</strong>{' '}
              {period.totalPaid != null
                ? period.totalPaid.toLocaleString('vi-VN') + ' đ'
                : '—'}
            </p>
            <p>
              <strong>SL Nhân viên:</strong>{' '}
              {period.headcount != null
                ? period.headcount.toLocaleString('vi-VN')
                : '—'}
            </p>
          </CCol>
        </CRow>

        {/* Sau này thêm bảng nhân viên / biểu đồ ở đây */}
      </CCardBody>
    </CCard>
  )
}
