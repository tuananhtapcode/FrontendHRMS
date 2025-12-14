import { useEffect, useMemo, useState } from 'react'
import {
  CBadge,
  CButton,
  CCard,
  CCardBody,
  CCol,
  CForm,
  CFormInput,
  CFormLabel,
  CFormSelect,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CRow,
  CSpinner,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
import { cilDescription } from '@coreui/icons'
import CIcon from '@coreui/icons-react'

import '../../scss/payment-table-page.scss'

import {
  fetchPayrollPeriods,
  fetchPaymentSummaryByPeriod,
  approvePayrollPeriod,
  payPayrollPeriod,
} from '../../api/paymentApi'

const formatVND = (n) => {
  if (n === null || n === undefined) return '—'
  const num = typeof n === 'number' ? n : Number(n)
  if (Number.isNaN(num)) return '—'
  return new Intl.NumberFormat('vi-VN').format(num) + ' đ'
}

const getStatusBadge = (row) => {
  const headcount = Number(row.headcount || 0)
  const paidCount = Number(row.paidCount || 0)
  const approvedCount = Number(row.approvedCount || 0)
  const calculatedCount = Number(row.calculatedCount || 0)

  if (headcount > 0 && paidCount >= headcount) return { text: 'Đã chi trả', color: 'success' }
  if (paidCount > 0) return { text: 'Chi trả một phần', color: 'warning' }
  if (approvedCount > 0) return { text: 'Đã duyệt', color: 'info' }
  if (calculatedCount > 0) return { text: 'Đã tính', color: 'secondary' }
  return { text: 'Chưa có dữ liệu', color: 'secondary' }
}

const PaymentTablePage = () => {
  // ====== Table states ======
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [rows, setRows] = useState([])

  // ====== Detail modal states ======
  const [showDetail, setShowDetail] = useState(false)
  const [detailLoading, setDetailLoading] = useState(false)
  const [detailError, setDetailError] = useState('')
  const [selected, setSelected] = useState(null) // row đang chọn (kèm meta period)
  const [detail, setDetail] = useState(null) // summary fresh từ API

  // ====== Pay form in modal ======
  const [payMethod, setPayMethod] = useState('BANK_TRANSFER')
  const [paidAt, setPaidAt] = useState('') // datetime-local
  const [txRef, setTxRef] = useState('')
  const [note, setNote] = useState('')

  const mappedRows = useMemo(() => {
    return (rows || []).map((r) => {
      const totalToPay = Number(r.totalToPay || 0)
      const totalPaid = Number(r.totalPaid || 0)
      const remaining = totalToPay - totalPaid
      const st = getStatusBadge(r)

      return {
        ...r,
        totalToPay,
        totalPaid,
        remaining,
        statusText: st.text,
        statusColor: st.color,
      }
    })
  }, [rows])

  const mappedDetail = useMemo(() => {
    if (!detail) return null
    const totalToPay = Number(detail.totalToPay || 0)
    const totalPaid = Number(detail.totalPaid || 0)
    return {
      ...detail,
      totalToPay,
      totalPaid,
      remaining: totalToPay - totalPaid,
      ...getStatusBadge(detail),
    }
  }, [detail])

  const loadTable = async () => {
    try {
      setLoading(true)
      setError('')

      const periods = await fetchPayrollPeriods()
      const list = Array.isArray(periods) ? periods : []

      // gọi summary từng kỳ (backend hiện chưa có endpoint summary all)
      const results = await Promise.allSettled(
        list.map(async (p) => {
          const periodId = p.payrollPeriodId
          try {
            const s = await fetchPaymentSummaryByPeriod(periodId)
            if (s) {
              return {
                ...s,
                periodId: s.periodId ?? periodId,
                periodName: s.periodName ?? p.name,
                startDate: p.startDate,
                endDate: p.endDate,
                paymentDate: p.paymentDate,
                isClosed: p.isClosed,
              }
            }
            return {
              periodId,
              periodName: p.name,
              headcount: 0,
              totalToPay: 0,
              totalPaid: 0,
              paidCount: 0,
              approvedCount: 0,
              calculatedCount: 0,
              startDate: p.startDate,
              endDate: p.endDate,
              paymentDate: p.paymentDate,
              isClosed: p.isClosed,
            }
          } catch (e) {
            return {
              periodId,
              periodName: p.name,
              headcount: 0,
              totalToPay: 0,
              totalPaid: 0,
              paidCount: 0,
              approvedCount: 0,
              calculatedCount: 0,
              startDate: p.startDate,
              endDate: p.endDate,
              paymentDate: p.paymentDate,
              isClosed: p.isClosed,
              _error: true,
            }
          }
        }),
      )

      const summaries = results
        .filter((r) => r.status === 'fulfilled')
        .map((r) => r.value)

      // sort mới nhất lên trên nếu có startDate
      summaries.sort((a, b) => {
        const da = a.startDate ? new Date(a.startDate).getTime() : 0
        const db = b.startDate ? new Date(b.startDate).getTime() : 0
        return db - da
      })

      setRows(summaries)
    } catch (e) {
      console.error(e)
      setRows([])
      setError('Không tải được dữ liệu chi trả. Kiểm tra API / quyền truy cập.')
    } finally {
      setLoading(false)
    }
  }

  const openDetail = async (row) => {
    setSelected(row)
    setShowDetail(true)

    // reset pay form mặc định
    setPayMethod('BANK_TRANSFER')
    setPaidAt('')
    setTxRef('')
    setNote('')

    // load fresh summary
    await refreshDetail(row.periodId)
  }

  const refreshDetail = async (periodId) => {
    try {
      setDetailLoading(true)
      setDetailError('')
      const s = await fetchPaymentSummaryByPeriod(periodId)
      if (!s) {
        // kỳ chưa có payroll -> detail 0
        setDetail({
          periodId,
          periodName: selected?.periodName ?? `Period ${periodId}`,
          headcount: 0,
          totalToPay: 0,
          totalPaid: 0,
          paidCount: 0,
          approvedCount: 0,
          calculatedCount: 0,
          startDate: selected?.startDate,
          endDate: selected?.endDate,
          paymentDate: selected?.paymentDate,
          isClosed: selected?.isClosed,
        })
        return
      }
      setDetail({
        ...s,
        startDate: selected?.startDate,
        endDate: selected?.endDate,
        paymentDate: selected?.paymentDate,
        isClosed: selected?.isClosed,
      })
    } catch (e) {
      console.error(e)
      setDetail(null)
      setDetailError('Không tải được chi tiết kỳ lương.')
    } finally {
      setDetailLoading(false)
    }
  }

  const handleApprove = async () => {
    if (!selected?.periodId) return
    try {
      setDetailLoading(true)
      await approvePayrollPeriod(selected.periodId)
      await refreshDetail(selected.periodId)
      await loadTable()
    } catch (e) {
      console.error(e)
      setDetailError('Duyệt kỳ thất bại (có thể kỳ đã đóng hoặc không có payroll hợp lệ).')
    } finally {
      setDetailLoading(false)
    }
  }

  const handlePay = async () => {
    if (!selected?.periodId) return
    try {
      setDetailLoading(true)

      const req = {
        method: payMethod, // BANK_TRANSFER/CASH/OTHER
        // paidAt backend nhận LocalDateTime => nếu bỏ trống thì backend tự now()
        paidAt: paidAt ? paidAt.replace('T', ':00T') : null, // ✅ nếu bạn muốn bỏ qua thì cứ null
        transactionRef: txRef || null,
        note: note || null,
      }

      // ⚠️ paidAt format: nếu backend của bạn parse ISO chuẩn thì dùng paidAt 그대로 (YYYY-MM-DDTHH:mm)
      // Nếu backend kén format, bạn cứ set null để backend tự now()

      req.paidAt = paidAt || null

      await payPayrollPeriod(selected.periodId, req)
      await refreshDetail(selected.periodId)
      await loadTable()
    } catch (e) {
      console.error(e)
      setDetailError('Chi trả kỳ thất bại (cần APPROVED trước hoặc kỳ đã đóng).')
    } finally {
      setDetailLoading(false)
    }
  }

  useEffect(() => {
    loadTable()
  }, [])

  return (
    <div className="payment-table-page">
      {/* HEADER */}
      <div className="page-header">
        <h2 className="mb-0">Chi trả</h2>
        <div className="page-header-actions">
          <CButton variant="outline" color="dark" className="me-2">
            <CIcon icon={cilDescription} className="me-2" />
            Thiết lập ban đầu
          </CButton>
        </div>
      </div>

      {/* TABLE */}
      <CCard className="content-card mt-3">
        <CCardBody>
          {loading ? (
            <div className="d-flex align-items-center gap-2">
              <CSpinner size="sm" />
              <span>Đang tải dữ liệu chi trả...</span>
            </div>
          ) : error ? (
            <div className="text-danger">{error}</div>
          ) : (
            <CTable hover responsive className="mb-0">
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell>Kỳ lương</CTableHeaderCell>
                  <CTableHeaderCell className="text-end">Số nhân viên</CTableHeaderCell>
                  <CTableHeaderCell className="text-end">Tổng cần trả</CTableHeaderCell>
                  <CTableHeaderCell className="text-end">Đã chi trả</CTableHeaderCell>
                  <CTableHeaderCell className="text-end">Còn lại</CTableHeaderCell>
                  <CTableHeaderCell>Trạng thái</CTableHeaderCell>
                  <CTableHeaderCell className="text-end">Thao tác</CTableHeaderCell>
                </CTableRow>
              </CTableHead>

              <CTableBody>
                {mappedRows.map((r) => (
                  <CTableRow key={r.periodId}>
                    <CTableDataCell>
                      <div className="fw-semibold">{r.periodName}</div>
                      <div className="text-medium-emphasis" style={{ fontSize: 12 }}>
                        PeriodID: {r.periodId}
                        {r.paymentDate ? ` • Ngày trả: ${r.paymentDate}` : ''}
                        {r._error ? ' • (Lỗi load summary)' : ''}
                      </div>
                    </CTableDataCell>

                    <CTableDataCell className="text-end">{r.headcount ?? 0}</CTableDataCell>
                    <CTableDataCell className="text-end">{formatVND(r.totalToPay)}</CTableDataCell>
                    <CTableDataCell className="text-end">{formatVND(r.totalPaid)}</CTableDataCell>
                    <CTableDataCell className="text-end">{formatVND(r.remaining)}</CTableDataCell>

                    <CTableDataCell>
                      <CBadge color={r.statusColor}>{r.statusText}</CBadge>
                    </CTableDataCell>

                    <CTableDataCell className="text-end">
                      <CButton color="dark" variant="outline" size="sm" onClick={() => openDetail(r)}>
                        Xem chi tiết
                      </CButton>
                    </CTableDataCell>
                  </CTableRow>
                ))}

                {mappedRows.length === 0 && (
                  <CTableRow>
                    <CTableDataCell colSpan={7} className="text-center text-medium-emphasis py-4">
                      Chưa có kỳ lương nào.
                    </CTableDataCell>
                  </CTableRow>
                )}
              </CTableBody>
            </CTable>
          )}
        </CCardBody>
      </CCard>

      {/* DETAIL MODAL */}
      <CModal
        visible={showDetail}
        onClose={() => setShowDetail(false)}
        size="lg"
        alignment="center"
        backdrop="static"
      >
        <CModalHeader onClose={() => setShowDetail(false)}>
          <CModalTitle>
            Chi tiết chi trả — {selected?.periodName || 'Kỳ lương'}
          </CModalTitle>
        </CModalHeader>

        <CModalBody>
          {detailLoading ? (
            <div className="d-flex align-items-center gap-2">
              <CSpinner size="sm" />
              <span>Đang tải chi tiết...</span>
            </div>
          ) : detailError ? (
            <div className="text-danger">{detailError}</div>
          ) : mappedDetail ? (
            <>
              {/* Top summary */}
              <CRow className="g-3">
                <CCol md={6}>
                  <div className="text-medium-emphasis" style={{ fontSize: 13 }}>Kỳ lương</div>
                  <div className="fw-semibold">{mappedDetail.periodName}</div>
                  <div className="text-medium-emphasis" style={{ fontSize: 12 }}>
                    PeriodID: {mappedDetail.periodId}
                    {mappedDetail.startDate ? ` • ${mappedDetail.startDate}` : ''}
                    {mappedDetail.endDate ? ` → ${mappedDetail.endDate}` : ''}
                  </div>
                  <div className="text-medium-emphasis" style={{ fontSize: 12 }}>
                    {mappedDetail.paymentDate ? `Ngày chi trả: ${mappedDetail.paymentDate}` : ''}
                    {mappedDetail.isClosed !== undefined ? ` • Đóng kỳ: ${mappedDetail.isClosed ? 'Có' : 'Không'}` : ''}
                  </div>
                </CCol>

                <CCol md={6} className="d-flex justify-content-md-end align-items-start">
                  <CBadge color={mappedDetail.color} className="p-2">
                    {mappedDetail.text}
                  </CBadge>
                </CCol>

                <CCol md={3}>
                  <div className="text-medium-emphasis" style={{ fontSize: 13 }}>Số nhân viên</div>
                  <div className="fw-semibold">{mappedDetail.headcount ?? 0}</div>
                </CCol>
                <CCol md={3}>
                  <div className="text-medium-emphasis" style={{ fontSize: 13 }}>Tổng cần trả</div>
                  <div className="fw-semibold">{formatVND(mappedDetail.totalToPay)}</div>
                </CCol>
                <CCol md={3}>
                  <div className="text-medium-emphasis" style={{ fontSize: 13 }}>Đã chi trả</div>
                  <div className="fw-semibold">{formatVND(mappedDetail.totalPaid)}</div>
                </CCol>
                <CCol md={3}>
                  <div className="text-medium-emphasis" style={{ fontSize: 13 }}>Còn lại</div>
                  <div className="fw-semibold">{formatVND(mappedDetail.remaining)}</div>
                </CCol>
              </CRow>

              <hr />

              {/* Counts */}
              <CRow className="g-3">
                <CCol md={4}>
                  <div className="text-medium-emphasis" style={{ fontSize: 13 }}>PAID</div>
                  <div className="fw-semibold">{mappedDetail.paidCount ?? 0}</div>
                </CCol>
                <CCol md={4}>
                  <div className="text-medium-emphasis" style={{ fontSize: 13 }}>APPROVED</div>
                  <div className="fw-semibold">{mappedDetail.approvedCount ?? 0}</div>
                </CCol>
                <CCol md={4}>
                  <div className="text-medium-emphasis" style={{ fontSize: 13 }}>CALCULATED</div>
                  <div className="fw-semibold">{mappedDetail.calculatedCount ?? 0}</div>
                </CCol>
              </CRow>

              <hr />

              {/* Pay form (dùng cho API payPeriod) */}
              <CForm>
                <CRow className="mb-3">
                  <CCol md={4}>
                    <CFormLabel>Hình thức thanh toán</CFormLabel>
                  </CCol>
                  <CCol md={8}>
                    <CFormSelect value={payMethod} onChange={(e) => setPayMethod(e.target.value)}>
                      <option value="BANK_TRANSFER">Chuyển khoản</option>
                      <option value="CASH">Tiền mặt</option>
                      <option value="OTHER">Khác</option>
                    </CFormSelect>
                  </CCol>
                </CRow>

                <CRow className="mb-3">
                  <CCol md={4}>
                    <CFormLabel>Thời điểm chi trả</CFormLabel>
                  </CCol>
                  <CCol md={8}>
                    <CFormInput
                      type="datetime-local"
                      value={paidAt}
                      onChange={(e) => setPaidAt(e.target.value)}
                      placeholder="Để trống = now()"
                    />
                    <div className="text-medium-emphasis" style={{ fontSize: 12 }}>
                      Để trống thì backend tự set <b>now()</b>
                    </div>
                  </CCol>
                </CRow>

                <CRow className="mb-3">
                  <CCol md={4}>
                    <CFormLabel>Mã giao dịch</CFormLabel>
                  </CCol>
                  <CCol md={8}>
                    <CFormInput value={txRef} onChange={(e) => setTxRef(e.target.value)} placeholder="Optional" />
                  </CCol>
                </CRow>

                <CRow className="mb-0">
                  <CCol md={4}>
                    <CFormLabel>Ghi chú</CFormLabel>
                  </CCol>
                  <CCol md={8}>
                    <CFormInput value={note} onChange={(e) => setNote(e.target.value)} placeholder="Optional" />
                  </CCol>
                </CRow>
              </CForm>
            </>
          ) : (
            <div className="text-medium-emphasis">Không có dữ liệu chi tiết.</div>
          )}
        </CModalBody>

        <CModalFooter>
          <CButton
            color="secondary"
            variant="outline"
            disabled={detailLoading}
            onClick={() => refreshDetail(selected?.periodId)}
          >
            Làm mới
          </CButton>

          <CButton
            color="info"
            variant="outline"
            disabled={detailLoading || !selected?.periodId}
            onClick={handleApprove}
          >
            Duyệt kỳ
          </CButton>

          <CButton
            color="success"
            disabled={detailLoading || !selected?.periodId}
            onClick={handlePay}
          >
            Chi trả kỳ
          </CButton>
        </CModalFooter>
      </CModal>
    </div>
  )
}

export default PaymentTablePage
