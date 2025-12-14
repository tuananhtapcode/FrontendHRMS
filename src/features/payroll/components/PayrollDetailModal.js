import React, { useEffect, useState } from 'react'
import {
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CButton,
  CRow,
  CCol,
  CSpinner,
  CBadge,
  CCard,
  CCardBody
} from '@coreui/react'
import { cilPrint, cilX } from '@coreui/icons'
import CIcon from '@coreui/icons-react'

// Giả sử bạn đã có hàm này trong api/payrollApi.js
import { fetchPayrollDetail } from '../api/payrollApi' 

// Helper format tiền
const formatVND = (n) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(n || 0)
}

const PayrollDetailModal = ({ visible, onClose, payrollId }) => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)

  // Gọi API mỗi khi Modal mở ra và có payrollId mới
  useEffect(() => {
    if (visible && payrollId) {
      setLoading(true)
      fetchPayrollDetail(payrollId)
        .then((res) => {
          // Xử lý dữ liệu trả về (res có thể là object wrapper hoặc data trực tiếp tùy axios config)
          // Dựa trên JSON bạn gửi: res = { payrollId: 1, items: [...] }
          setData(res) 
        })
        .catch((err) => {
          console.error('Lỗi tải chi tiết lương:', err)
          setData(null)
        })
        .finally(() => setLoading(false))
    } else {
      // Reset data khi đóng modal
      setData(null)
    }
  }, [visible, payrollId])

  // Tách items thành Earnings (Thu nhập) và Deductions (Khấu trừ)
  const earnings = data?.items?.filter(item => item.type?.toLowerCase() === 'earning') || []
  const deductions = data?.items?.filter(item => item.type?.toLowerCase() === 'deduction') || []

  // Tính tổng khấu trừ (nếu API chưa trả về field này)
  const totalDeduction = deductions.reduce((sum, item) => sum + item.amount, 0)

  return (
    <CModal visible={visible} onClose={onClose} size="lg" alignment="center" backdrop="static">
      <CModalHeader>
        <CModalTitle>Chi tiết Phiếu Lương</CModalTitle>
      </CModalHeader>

      <CModalBody className="bg-light">
        {loading ? (
          <div className="text-center py-5">
            <CSpinner color="primary" />
            <div className="mt-2 text-muted small">Đang tải dữ liệu...</div>
          </div>
        ) : !data ? (
          <div className="text-center py-4 text-danger">Không tìm thấy dữ liệu bảng lương.</div>
        ) : (
          <div className="payroll-slip">
            {/* 1. Header Thông tin chung */}
            <CCard className="mb-3 border-0 shadow-sm">
              <CCardBody>
                <div className="d-flex justify-content-between">
                  <div>
                    <h5 className="fw-bold mb-1">Mã Phiếu: #{data.payrollId}</h5>
                    <div className="text-muted small">Mã Nhân viên: {data.employeeId}</div>
                    {/* Nếu API trả về tên nhân viên thì hiển thị ở đây */}
                    {data.employeeName && <div className="fw-bold text-primary">{data.employeeName}</div>}
                  </div>
                  <div className="text-end">
                    <div className="text-muted small mb-1">Kỳ lương ID: {data.payrollPeriodId}</div>
                    <CBadge color="success">Đã chốt</CBadge>
                  </div>
                </div>
              </CCardBody>
            </CCard>

            {/* 2. Phần chi tiết Thu nhập & Khấu trừ */}
            <CRow>
              {/* Cột trái: CÁC KHOẢN THU NHẬP */}
              <CCol md={6}>
                <CCard className="h-100 border-0 shadow-sm">
                  <CCardBody>
                    <h6 className="text-success fw-bold border-bottom pb-2 mb-3 text-uppercase">
                      Khoản Thu Nhập
                    </h6>
                    
                    {/* Render List Earnings */}
                    {earnings.length > 0 ? (
                      earnings.map((item, idx) => (
                        <div key={idx} className="d-flex justify-content-between mb-2 small">
                          <span>{item.name} <span className="text-muted fst-italic">({item.code})</span></span>
                          <span className="fw-semibold">{formatVND(item.amount)}</span>
                        </div>
                      ))
                    ) : (
                      <div className="text-muted small fst-italic">Không có dữ liệu</div>
                    )}

                    {/* Dòng tổng thu nhập (Lấy từ API totalSalary) */}
                    <div className="d-flex justify-content-between mt-3 pt-2 border-top">
                      <strong className="text-dark">Tổng Thu Nhập</strong>
                      <strong className="text-success fs-6">{formatVND(data.totalSalary)}</strong>
                    </div>
                  </CCardBody>
                </CCard>
              </CCol>

              {/* Cột phải: CÁC KHOẢN KHẤU TRỪ */}
              <CCol md={6}>
                <CCard className="h-100 border-0 shadow-sm mt-3 mt-md-0">
                  <CCardBody>
                    <h6 className="text-danger fw-bold border-bottom pb-2 mb-3 text-uppercase">
                      Khoản Khấu Trừ
                    </h6>

                    {/* Render List Deductions */}
                    {deductions.length > 0 ? (
                      deductions.map((item, idx) => (
                        <div key={idx} className="d-flex justify-content-between mb-2 small">
                          <span>{item.name} <span className="text-muted fst-italic">({item.code})</span></span>
                          <span className="fw-semibold text-danger">-{formatVND(item.amount)}</span>
                        </div>
                      ))
                    ) : (
                      <div className="text-muted small fst-italic">Không có khoản khấu trừ</div>
                    )}

                    <div className="d-flex justify-content-between mt-3 pt-2 border-top">
                      <strong className="text-dark">Tổng Khấu Trừ</strong>
                      <strong className="text-danger">-{formatVND(totalDeduction)}</strong>
                    </div>
                  </CCardBody>
                </CCard>
              </CCol>
            </CRow>

            {/* 3. Footer: THỰC LĨNH */}
            <CCard className="mt-3 border-success bg-success bg-opacity-10 shadow-sm">
              <CCardBody className="d-flex justify-content-between align-items-center py-3">
                <span className="fw-bold text-success text-uppercase">Thực Lĩnh (Net Salary)</span>
                {/* Thực lĩnh = Tổng thu nhập - Tổng khấu trừ */}
                <span className="fs-4 fw-bold text-success">
                  {formatVND(data.totalSalary - totalDeduction)}
                </span>
              </CCardBody>
            </CCard>
          </div>
        )}
      </CModalBody>

      <CModalFooter className="bg-white">
        <CButton color="secondary" variant="ghost" onClick={onClose}>
          <CIcon icon={cilX} className="me-2" /> Đóng
        </CButton>
        <CButton color="primary">
          <CIcon icon={cilPrint} className="me-2" /> In Phiếu Lương
        </CButton>
      </CModalFooter>
    </CModal>
  )
}

export default PayrollDetailModal