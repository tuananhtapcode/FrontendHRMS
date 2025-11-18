
import { cilFilter, cilPlus, cilSearch } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import {
  CBadge,
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CFormInput,
  CFormSelect,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow
} from '@coreui/react'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../../scss/components-page.scss'

import { listComponents } from '../../api/payrollApi.js'

export default function ComponentsPage() {
  const navigate = useNavigate()

  // data từ "server" (mock)
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // filter/pagination
  const [q, setQ] = useState('')
  const [status, setStatus] = useState('')
  const [org, setOrg] = useState('')
  const [page, setPage] = useState(1)
  const pageSize = 25

  useEffect(() => {
    let mounted = true
    async function run() {
      try {
        setLoading(true)
        setError(null)
        const res = await listComponents()
        if (!mounted) return
        setRows(res.data || [])
      } catch (e) {
        if (!mounted) return
        setError('Không tải được dữ liệu')
      } finally {
        if (mounted) setLoading(false)
      }
    }
    run()
    return () => { mounted = false }
  }, [])

  const filtered = useMemo(() => {
    let data = rows
    if (q) {
      const s = q.toLowerCase()
      data = data.filter(
        (r) =>
          (r.code || '').toLowerCase().includes(s) ||
          (r.name || '').toLowerCase().includes(s) ||
          (r.type || '').toLowerCase().includes(s) ||
          (r.nature || '').toLowerCase().includes(s),
      )
    }
    if (status) data = data.filter((r) => r.status === status)
    if (org) data = data.filter((r) => (r.unit || '') === org)
    return data
  }, [q, status, org, rows])

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const view = filtered.slice((page - 1) * pageSize, page * pageSize)

  const StatusBadge = ({ value }) => {
    const color = value === 'Đang theo dõi' ? 'success' : 'secondary'
    return <CBadge color={color} shape="rounded-pill">{value}</CBadge>
  }

  return (
    <div className="payroll-components">
      <div className="pc-header">
        <div className="left">
          <div className="title">Thành phần lương</div>
          <div className="filters">
            <div className="search">
              <CIcon icon={cilSearch} size="sm" />
              <CFormInput
                value={q}
                onChange={(e) => { setQ(e.target.value); setPage(1) }}
                placeholder="Tìm kiếm"
                size="sm"
              />
            </div>

            <CFormSelect
              className="w-auto"
              size="sm"
              value={status}
              onChange={(e) => { setStatus(e.target.value); setPage(1) }}
            >
              <option value="">Tất cả trạng thái</option>
              <option>Đang theo dõi</option>
              <option>Ngừng theo dõi</option>
            </CFormSelect>

            <CFormSelect
              className="w-auto"
              size="sm"
              value={org}
              onChange={(e) => { setOrg(e.target.value); setPage(1) }}
            >
              <option value="">Tất cả đơn vị</option>
              <option>—</option>
              <option>Thông tin nhân viên</option>
              <option>Thuế TNCN</option>
              <option>Lương</option>
            </CFormSelect>

            <CButton color="secondary" variant="outline" size="sm">
              <CIcon icon={cilFilter} className="me-1" /> Bộ lọc
            </CButton>
          </div>
        </div>

        <div className="right">
          <CButton
            color="success"
            size="sm"
            onClick={() => navigate('/payroll/components/add')}
          >
            <CIcon icon={cilPlus} className="me-1" /> Thêm mới
          </CButton>
        </div>
      </div>

      <CCard className="pc-table shadow-sm border-0">
        <CCardHeader className="bg-light small text-medium-emphasis">
          {loading ? 'Đang tải...' : error ? error : `Tổng số bản ghi: ${filtered.length}`}
        </CCardHeader>

        <CCardBody className="p-0">
          <CTable hover responsive align="middle" className="mb-0">
            <CTableHead color="light" className="text-medium-emphasis">
              <CTableRow>
                <CTableHeaderCell scope="col" className="w-1"></CTableHeaderCell>
                <CTableHeaderCell>Mã thành phần</CTableHeaderCell>
                <CTableHeaderCell>Tên thành phần</CTableHeaderCell>
                <CTableHeaderCell>Đơn vị áp dụng</CTableHeaderCell>
                <CTableHeaderCell>Loại thành phần</CTableHeaderCell>
                <CTableHeaderCell>Tính chất</CTableHeaderCell>
                <CTableHeaderCell>Kiểu giá trị</CTableHeaderCell>
                <CTableHeaderCell>Giá trị</CTableHeaderCell>
                <CTableHeaderCell>Nguồn tạo</CTableHeaderCell>
                <CTableHeaderCell>Trạng thái</CTableHeaderCell>
              </CTableRow>
            </CTableHead>

            <CTableBody>
              {!loading && view.map((r) => (
                <CTableRow key={r.code}>
                  <CTableDataCell className="w-1">
                    <input type="checkbox" aria-label={`select ${r.code}`} />
                  </CTableDataCell>
                  <CTableDataCell className="text-primary fw-semibold">{r.code}</CTableDataCell>
                  <CTableDataCell>{r.name}</CTableDataCell>
                  <CTableDataCell>{r.unit || '—'}</CTableDataCell>
                  <CTableDataCell>{r.type}</CTableDataCell>
                  <CTableDataCell>{r.nature}</CTableDataCell>
                  <CTableDataCell>{r.valueType}</CTableDataCell>
                  <CTableDataCell className="text-primary">{r.value || '—'}</CTableDataCell>
                  <CTableDataCell>{r.source}</CTableDataCell>
                  <CTableDataCell><StatusBadge value={r.status} /></CTableDataCell>
                </CTableRow>
              ))}

              {!loading && view.length === 0 && (
                <CTableRow>
                  <CTableDataCell colSpan={10} className="text-center py-5 text-medium-emphasis">
                    {error ? 'Có lỗi khi tải dữ liệu.' : 'Không có dữ liệu'}
                  </CTableDataCell>
                </CTableRow>
              )}

              {loading && (
                <CTableRow>
                  <CTableDataCell colSpan={10} className="text-center py-5 text-medium-emphasis">
                    Đang tải dữ liệu...
                  </CTableDataCell>
                </CTableRow>
              )}
            </CTableBody>
          </CTable>
        </CCardBody>

        <div className="pc-pagination">
          <div className="small text-medium-emphasis">
            Số bản ghi/trang <span className="badge">25</span>
          </div>
          <div className="nav">
            <button disabled={page <= 1} onClick={() => setPage(Math.max(1, page - 1))}>‹</button>
            <span className="page">{page}</span>
            <span>/</span>
            <span className="page">{totalPages}</span>
            <button disabled={page >= totalPages} onClick={() => setPage(Math.min(totalPages, page + 1))}>›</button>
          </div>
        </div>
      </CCard>
    </div>
  )
}