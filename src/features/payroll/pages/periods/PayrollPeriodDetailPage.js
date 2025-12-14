import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { 
  CCard, CCardBody, CCardHeader, CCol, CRow, CButton, CBadge, CSpinner 
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilArrowLeft, cilLockLocked, cilCheckCircle } from '@coreui/icons'
import { fetchPayrollPeriodById, closePayrollPeriod } from '../../api/payrollApi'

const PayrollPeriodDetailPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [period, setPeriod] = useState(null)
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false) // Loading cho nút bấm

  useEffect(() => {
    loadData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  const loadData = async () => {
    try {
      const data = await fetchPayrollPeriodById(id)
      setPeriod(data)
    } catch (error) {
      console.error("Lỗi:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleClosePeriod = async () => {
    if (!window.confirm("Bạn có chắc muốn đóng kỳ lương này? Hành động này không thể hoàn tác.")) return
    
    setProcessing(true)
    try {
      await closePayrollPeriod(id)
      alert("Đã đóng kỳ lương thành công!")
      loadData() // Load lại để cập nhật trạng thái
    } catch (error) {
      alert("Lỗi: " + error.message)
    } finally {
      setProcessing(false)
    }
  }

  if (loading) return <div className="text-center pt-5"><CSpinner color="primary"/></div>
  if (!period) return <div className="text-center pt-5 text-danger">Không tìm thấy kỳ lương</div>

  return (
    <div>
      {/* Nút quay lại */}
      <CButton color="link" className="px-0 mb-3 text-decoration-none" onClick={() => navigate('/payroll/periods')}>
        <CIcon icon={cilArrowLeft} className="me-1"/> Quay lại danh sách
      </CButton>

      <CCard className="shadow-sm border-0">
        <CCardHeader className="bg-white py-3 d-flex justify-content-between align-items-center">
          <h4 className="m-0 fw-bold">{period.name}</h4>
          <CBadge color={period.isClosed ? 'success' : 'warning'} className="fs-6 px-3 py-2">
            {period.isClosed ? 'ĐÃ ĐÓNG' : 'ĐANG MỞ'}
          </CBadge>
        </CCardHeader>
        
        <CCardBody>
          {/* Thông tin chính */}
          <div className="bg-light p-4 rounded mb-4">
            <CRow className="gy-3">
              <CCol md={4}>
                <div className="text-medium-emphasis small text-uppercase fw-bold">Thời gian áp dụng</div>
                <div className="fs-5">{period.startDate} <span className="text-muted mx-1">→</span> {period.endDate}</div>
              </CCol>
              <CCol md={4}>
                <div className="text-medium-emphasis small text-uppercase fw-bold">Ngày chi trả dự kiến</div>
                <div className="fs-5">{period.paymentDate}</div>
              </CCol>
              <CCol md={4}>
                <div className="text-medium-emphasis small text-uppercase fw-bold">ID Hệ thống</div>
                <div className="fs-5 font-monospace">#{period.payrollPeriodId || period.id}</div>
              </CCol>
            </CRow>
          </div>

          {/* Khu vực hành động */}
          <div className="d-flex justify-content-end gap-2 border-top pt-3">
            {!period.isClosed ? (
              <CButton 
                color="danger" 
                className="text-white"
                onClick={handleClosePeriod}
                disabled={processing}
              >
                {processing ? <CSpinner size="sm"/> : <CIcon icon={cilLockLocked} className="me-2"/>}
                Chốt & Đóng kỳ lương
              </CButton>
            ) : (
              <CButton color="secondary" variant="ghost" disabled>
                <CIcon icon={cilCheckCircle} className="me-2 text-success"/>
                Kỳ lương đã được chốt sổ
              </CButton>
            )}
          </div>
        </CCardBody>
      </CCard>
    </div>
  )
}

export default PayrollPeriodDetailPage