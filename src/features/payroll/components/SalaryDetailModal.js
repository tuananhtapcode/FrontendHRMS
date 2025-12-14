// src/features/payroll/components/SalaryDetailModal.js
import React, { useEffect, useState } from 'react'
import {
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CButton,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CSpinner,
  CPagination,
  CPaginationItem
} from '@coreui/react'
import { cilX } from '@coreui/icons'
import CIcon from '@coreui/icons-react'

// Import hàm gọi API (bạn cần đảm bảo export hàm này trong payrollApi.js)
import { fetchPayrolls } from "../api/payrollApi";

// Helper format tiền
const formatVND = (n) => {
  if (n == null) return '-'
  return new Intl.NumberFormat('vi-VN').format(Number(n)) + ' đ'
}

const SalaryDetailModal = ({ visible, onClose, periodId, periodName }) => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(0) // API bắt đầu từ page 0
  const [totalPages, setTotalPages] = useState(0)
  const [totalElements, setTotalElements] = useState(0)
  const pageSize = 10 // Số dòng trên modal

  // Reset state khi mở modal mới
  useEffect(() => {
    if (visible) {
      setPage(0)
      loadData(0)
    } else {
      setData([])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, periodId])

  const loadData = async (pageIndex) => {
    if (!periodId) return
    setLoading(true)
    try {
      // Gọi API lấy danh sách payroll theo kỳ
      const res = await fetchPayrolls({ 
        periodId: periodId, 
        page: pageIndex, 
        size: pageSize 
      })
      
      // Map data từ response JSON bạn cung cấp
      // res.content là mảng data
      setData(res.content || [])
      setTotalPages(res.totalPages || 0)
      setTotalElements(res.totalElements || 0)
    } catch (error) {
      console.error("Lỗi tải chi tiết kỳ lương:", error)
      setData([])
    } finally {
      setLoading(false)
    }
  }

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) {
      setPage(newPage)
      loadData(newPage)
    }
  }

  return (
    <CModal 
      visible={visible} 
      onClose={onClose} 
      size="xl" 
      alignment="center"
      backdrop="static"
    >
      <CModalHeader>
        <CModalTitle>
          Chi tiết: {periodName || 'Bảng lương'}
          <div className="small text-muted fw-normal" style={{ fontSize: '13px' }}>
            Tổng số nhân viên: {totalElements}
          </div>
        </CModalTitle>
      </CModalHeader>

      <CModalBody className="p-0">
        <CTable hover responsive align="middle" className="mb-0 border-bottom">
          <CTableHead color="light">
            <CTableRow>
              <CTableHeaderCell className="ps-4">Mã NV</CTableHeaderCell>
              <CTableHeaderCell>Họ và tên</CTableHeaderCell>
              {/* Bạn có thể thêm các cột khác nếu API trả về, ví dụ: Phòng ban */}
              <CTableHeaderCell className="text-end pe-4">Tổng Lương</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {loading ? (
              <CTableRow>
                <CTableDataCell colSpan={3} className="text-center py-5">
                  <CSpinner size="sm" color="primary" /> Đang tải dữ liệu...
                </CTableDataCell>
              </CTableRow>
            ) : data.length === 0 ? (
              <CTableRow>
                <CTableDataCell colSpan={3} className="text-center py-4 text-muted">
                  Không có dữ liệu lương trong kỳ này.
                </CTableDataCell>
              </CTableRow>
            ) : (
              data.map((item) => (
                <CTableRow key={item.payrollId}>
                  <CTableDataCell className="ps-4">
                    #{item.employeeId}
                  </CTableDataCell>
                  <CTableDataCell className="fw-semibold">
                    {item.employeeName}
                  </CTableDataCell>
                  <CTableDataCell className="text-end pe-4 fw-bold text-success">
                    {formatVND(item.totalSalary)}
                  </CTableDataCell>
                </CTableRow>
              ))
            )}
          </CTableBody>
        </CTable>

        {/* Phân trang trong Modal */}
        {!loading && totalPages > 1 && (
          <div className="d-flex justify-content-center py-3">
            <CPagination className="mb-0 cursor-pointer">
              <CPaginationItem 
                disabled={page === 0} 
                onClick={() => handlePageChange(page - 1)}
              >
                Trước
              </CPaginationItem>
              
              <CPaginationItem active>{page + 1}</CPaginationItem>
              
              <CPaginationItem 
                disabled={page >= totalPages - 1} 
                onClick={() => handlePageChange(page + 1)}
              >
                Sau
              </CPaginationItem>
            </CPagination>
          </div>
        )}
      </CModalBody>

      <CModalFooter>
        <CButton color="secondary" onClick={onClose}>
          <CIcon icon={cilX} className="me-2" /> Đóng
        </CButton>
      </CModalFooter>
    </CModal>
  )
}

export default SalaryDetailModal