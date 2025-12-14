import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  CCard, CCardHeader, CCardBody, CTable, CTableHead, CTableRow, 
  CTableHeaderCell, CTableBody, CTableDataCell, CBadge, CButton, CSpinner 
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilArrowRight, cilPlus, cilArrowLeft } from '@coreui/icons'
import { fetchPayrollPeriods } from '../../api/payrollApi'

const PayrollPeriodListPage = () => {
  const navigate = useNavigate()
  const [payrollPeriods, setPayrollPeriods] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    try {
      const data = await fetchPayrollPeriods()
      const sortedData = (data || []).sort((a, b) => new Date(b.startDate) - new Date(a.startDate))
      setPayrollPeriods(sortedData)
    } catch (error) {
      console.error("Lỗi tải kỳ lương:", error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return '-'
    const [y, m, d] = dateStr.split('-')
    return `${d}/${m}/${y}`
  }

  return (
    <div className="payroll-period-list">
      {/* ✅ 1. NÚT BACK (Đã sửa: Dùng div để không có hiệu ứng hover button) */}
      <div className="mb-3">
        <div 
          role="button"
          className="d-inline-flex align-items-center text-dark fw-semibold"
          style={{ cursor: 'pointer', userSelect: 'none' }} 
          onClick={() => navigate('/payroll')}
        >
          <CIcon icon={cilArrowLeft} className="me-2"/> 
          Quay lại Tổng quan
        </div>
      </div>

      <CCard className="mb-4 shadow-sm border-0">
        <CCardHeader className="d-flex justify-content-between align-items-center bg-white py-3">
          <h5 className="m-0 fw-bold text-primary">Quản lý Kỳ Lương</h5>
          <CButton color="primary" size="sm" onClick={() => console.log("Mở modal tạo mới")}>
            <CIcon icon={cilPlus} className="me-2" /> Tạo kỳ lương mới
          </CButton>
        </CCardHeader>
        
        <CCardBody className="p-0">
          <CTable hover responsive align="middle" className="mb-0">
            <CTableHead color="light">
              <CTableRow>
                <CTableHeaderCell className="ps-4">Tên kỳ lương</CTableHeaderCell>
                <CTableHeaderCell>Thời gian</CTableHeaderCell>
                <CTableHeaderCell>Ngày chi trả</CTableHeaderCell>
                <CTableHeaderCell className="text-center">Trạng thái</CTableHeaderCell>
                <CTableHeaderCell className="text-end pe-4">Hành động</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            
            <CTableBody>
              {loading ? (
                <CTableRow>
                  <CTableDataCell colSpan="5" className="text-center py-5">
                    <CSpinner color="primary" size="sm"/>
                  </CTableDataCell>
                </CTableRow>
              ) : payrollPeriods.length === 0 ? (
                <CTableRow>
                  <CTableDataCell colSpan="5" className="text-center py-4 text-muted">
                    Chưa có kỳ lương nào.
                  </CTableDataCell>
                </CTableRow>
              ) : (
                payrollPeriods.map((period) => (
                  <CTableRow key={period.payrollPeriodId || period.id}>
                    <CTableDataCell className="ps-4 fw-semibold">
                      {period.name}
                    </CTableDataCell>
                    <CTableDataCell>
                      {formatDate(period.startDate)} - {formatDate(period.endDate)}
                    </CTableDataCell>
                    <CTableDataCell>{formatDate(period.paymentDate)}</CTableDataCell>
                    <CTableDataCell className="text-center">
                      <CBadge color={period.isClosed ? 'success' : 'warning'} shape="rounded-pill">
                        {period.isClosed ? 'Đã đóng' : 'Đang mở'}
                      </CBadge>
                    </CTableDataCell>
                    
                    {/* Nút Xem chi tiết (giữ nguyên style bình thường) */}
                    <CTableDataCell className="text-end pe-4">
                      <CButton 
                        color="info"       
                        variant="outline"  
                        size="sm"
                        className="fw-semibold"
                        onClick={() => navigate(`/payroll/periods/${period.payrollPeriodId || period.id}`)}
                      >
                        Chi tiết <CIcon icon={cilArrowRight} size="sm" className="ms-1"/>
                      </CButton>
                    </CTableDataCell>
                  </CTableRow>
                ))
              )}
            </CTableBody>
          </CTable>
        </CCardBody>
      </CCard>
    </div>
  )
}

export default PayrollPeriodListPage