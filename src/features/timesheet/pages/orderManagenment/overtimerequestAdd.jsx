import {
  CButton,
  CCard,
  CCardBody,
  CCol,
  CForm,
  CFormInput,
  CFormLabel,
  CFormSelect,
  CFormTextarea,
  CInputGroup,
  CInputGroupText,
  CRow,
  CSpinner,
} from '@coreui/react'
import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { cilArrowLeft, cilCalendar, cilClock } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { overtimeService } from '../../api/overtimeService'

// =====================================================================
// 1. CSS TÙY CHỈNH
// =====================================================================
const AddOvertimeRequestStyles = () => (
  <style>
    {`
    .page-container { padding: 1rem; background-color: #f3f4f7; min-height: 100vh; }
    .page-header { background-color: #fff; padding: 10px 20px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #d8dbe0; margin: -1rem -1rem 1rem -1rem; }
    .header-left { display: flex; align-items: center; gap: 10px; }
    .back-btn { border: none; background: transparent; color: #3c4b64; padding: 0; }
    .page-title { font-size: 1.2rem; font-weight: 700; margin: 0; color: #3c4b64; }
    .btn-orange { background-color: #ea580c; border-color: #ea580c; color: white; font-weight: 600; }
    .btn-orange:hover { background-color: #c2410c; color: white; border-color: #c2410c; }
    .form-label-custom { font-weight: 600; font-size: 0.9rem; color: #3c4b64; margin-bottom: 4px; }
    .required-mark { color: #e55353; margin-left: 3px; }
    .form-control-readonly { background-color: #ebedef; cursor: not-allowed; }
    `}
  </style>
)

// =====================================================================
// 2. COMPONENT HEADER
// =====================================================================
const AddHeader = ({ onBack, onSave, loading, isEditMode }) => (
  <div className="page-header">
    <div className="header-left">
      <button className="back-btn" onClick={onBack}>
        <CIcon icon={cilArrowLeft} size="lg" />
      </button>
      <h1 className="page-title">
        {isEditMode ? 'Cập nhật đăng ký làm thêm' : 'Thêm mới đăng ký làm thêm'}
      </h1>
    </div>
    <div className="header-right d-flex gap-2">
      <CButton variant="outline" onClick={onBack} disabled={loading}>
        Hủy
      </CButton>
      <CButton className="btn-orange" onClick={onSave} disabled={loading}>
        {loading ? <CSpinner size="sm" /> : 'Lưu dữ liệu'}
      </CButton>
    </div>
  </div>
)

// =====================================================================
// 3. MAIN FORM
// =====================================================================
const OvertimeRequestAdd = () => {
  const navigate = useNavigate()
  const { id } = useParams() // Lấy ID từ URL
  const isEditMode = !!id // Kiểm tra chế độ Sửa

  const [employees, setEmployees] = useState([])
  const [loading, setLoading] = useState(false)
  const [dataLoading, setDataLoading] = useState(false)

  // State Form chuẩn theo Database
  const [formData, setFormData] = useState({
    employeeId: '',
    accountApproverId: '',
    date: '', // YYYY-MM-DD
    startTime: '17:30', // HH:mm
    endTime: '20:30', // HH:mm
    totalHours: 0,
    reason: '',
    status: 'PENDING',
  })

  // --- 1. Load danh sách nhân viên ---
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await overtimeService.getAllEmployees()
        const list = res?.data?.employees || []
        setEmployees(list)

        // Mặc định chọn người đầu tiên nếu thêm mới
        if (!isEditMode && list.length > 0) {
          setFormData((prev) => ({ ...prev, employeeId: list[0].employeeId }))
        }
      } catch (error) {
        console.error('Lỗi lấy danh sách nhân viên:', error)
      }
    }
    fetchEmployees()
  }, [isEditMode])

  // --- 2. Load dữ liệu cũ để sửa ---
  useEffect(() => {
    if (isEditMode) {
      const fetchDetail = async () => {
        setDataLoading(true)
        try {
          const res = await overtimeService.getById(id)

          // ✅ LẤY ĐÚNG DATA
          const data = res?.data || res

          console.log('EDIT DETAIL DATA:', data)

          if (data) {
            setFormData({
              employeeId: data.employeeId?.toString() || '',
              accountApproverId: data.accountApproverId?.toString() || '',
              date: data.date || '',
              startTime: data.startTime ? data.startTime.slice(0, 5) : '00:00',
              endTime: data.endTime ? data.endTime.slice(0, 5) : '00:00',
              totalHours: data.totalHours || 0,
              reason: data.reason || '',
              status: data.status || 'PENDING',
            })
          }
        } catch (error) {
          console.error('Lỗi lấy chi tiết:', error)
          alert('Không tìm thấy đơn OT này.')
        } finally {
          setDataLoading(false)
        }
      }
      fetchDetail()
    }
  }, [id, isEditMode])

  // --- 3. Tự động tính tổng giờ (Total Hours) ---
  useEffect(() => {
    if (formData.startTime && formData.endTime) {
      const [startH, startM] = formData.startTime.split(':').map(Number)
      const [endH, endM] = formData.endTime.split(':').map(Number)

      // Tính ra phút
      const startTotalM = startH * 60 + startM
      const endTotalM = endH * 60 + endM

      if (endTotalM > startTotalM) {
        const diffMinutes = endTotalM - startTotalM
        const hours = (diffMinutes / 60).toFixed(1) // Làm tròn 1 số thập phân (VD: 2.5)
        setFormData((prev) => ({ ...prev, totalHours: hours }))
      } else {
        setFormData((prev) => ({ ...prev, totalHours: 0 }))
      }
    }
  }, [formData.startTime, formData.endTime])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // --- 4. XỬ LÝ LƯU (CREATE / UPDATE) ---
  const handleSave = async () => {
    // Validate
    if (!formData.employeeId || !formData.date || !formData.reason) {
      alert('Vui lòng nhập đầy đủ các thông tin bắt buộc (*)')
      return
    }
    if (!formData.accountApproverId) {
      alert('Vui lòng chọn người duyệt!')
      return
    }

    if (formData.totalHours <= 0) {
      alert('Giờ kết thúc phải lớn hơn giờ bắt đầu!')
      return
    }

    if (
      formData.accountApproverId &&
      parseInt(formData.employeeId) === parseInt(formData.accountApproverId)
    ) {
      alert('Người duyệt không được trùng người nộp!')
      return
    }

    setLoading(true)
    try {
      // Payload chuẩn format API
      const payload = {
        employeeId: parseInt(formData.employeeId),
        accountApproverId: formData.accountApproverId ? parseInt(formData.accountApproverId) : null,
        date: formData.date,
        startTime: formData.startTime + ':00', // Thêm giây cho chuẩn Time
        endTime: formData.endTime + ':00',
        totalHours: parseFloat(formData.totalHours),
        reason: formData.reason,
        status: formData.status,
      }

      console.log('Payload:', payload)

      if (isEditMode) {
        await overtimeService.update(id, payload)
        alert('Cập nhật thành công!')
      } else {
        await overtimeService.create(payload)
        alert('Tạo mới thành công!')
      }
      navigate(-1)
    } catch (error) {
      console.error('Lỗi lưu:', error)
      const msg = error.response?.data?.message || 'Lỗi không xác định'
      alert(`Không thể lưu. Lỗi server: ${msg}`)
    } finally {
      setLoading(false)
    }
  }

  if (dataLoading)
    return (
      <div className="text-center p-5">
        <CSpinner color="primary" />
      </div>
    )

  return (
    <>
      <AddOvertimeRequestStyles />
      <div className="page-container">
        <AddHeader
          onBack={() => navigate(-1)}
          onSave={handleSave}
          loading={loading}
          isEditMode={isEditMode}
        />

        <div style={{ padding: '0 1rem 2rem 1rem' }}>
          <CCard className="mb-4 border-0 shadow-sm">
            <CCardBody className="form-card">
              <CForm>
                {/* HÀNG 1: NGƯỜI NỘP + NGƯỜI DUYỆT */}
                <CRow className="mb-3">
                  <CCol md={6}>
                    <CFormLabel className="form-label-custom">
                      Người nộp đơn<span className="required-mark">*</span>
                    </CFormLabel>
                    <CFormSelect
                      name="employeeId"
                      value={formData.employeeId}
                      onChange={handleChange}
                      disabled={isEditMode}
                    >
                      <option value="">-- Chọn nhân viên --</option>
                      {employees.map((e) => (
                        <option key={e.employeeId} value={e.employeeId}>
                          {e.employeeCode} - {e.fullName}
                        </option>
                      ))}
                    </CFormSelect>
                  </CCol>

                  <CCol md={6}>
                    <CFormLabel className="form-label-custom">
                      Người duyệt (Approver)<span className="required-mark">*</span>
                    </CFormLabel>
                    <CFormSelect
                      name="accountApproverId"
                      value={formData.accountApproverId}
                      onChange={handleChange}
                    >
                      <option value="">-- Chọn người duyệt --</option>
                      {employees.map((e) => (
                        <option key={e.employeeId} value={e.employeeId}>
                          {e.fullName}
                        </option>
                      ))}
                    </CFormSelect>
                  </CCol>
                </CRow>

                {/* HÀNG 2: NGÀY + GIỜ BẮT ĐẦU */}
                <CRow className="mb-3">
                  <CCol md={6}>
                    <CFormLabel className="form-label-custom">
                      Ngày làm thêm<span className="required-mark">*</span>
                    </CFormLabel>
                    <CInputGroup>
                      <CFormInput
                        type="date"
                        name="date"
                        value={formData.date}
                        onChange={handleChange}
                      />
                      <CInputGroupText>
                        <CIcon icon={cilCalendar} />
                      </CInputGroupText>
                    </CInputGroup>
                  </CCol>

                  <CCol md={6}>
                    <CFormLabel className="form-label-custom">
                      Bắt đầu từ<span className="required-mark">*</span>
                    </CFormLabel>
                    <CInputGroup>
                      <CFormInput
                        type="time"
                        name="startTime"
                        value={formData.startTime}
                        onChange={handleChange}
                      />
                      <CInputGroupText>
                        <CIcon icon={cilClock} />
                      </CInputGroupText>
                    </CInputGroup>
                  </CCol>
                </CRow>

                {/* HÀNG 3: GIỜ KẾT THÚC + TỔNG GIỜ */}
                <CRow className="mb-3">
                  <CCol md={6}>
                    <CFormLabel className="form-label-custom">
                      Kết thúc lúc<span className="required-mark">*</span>
                    </CFormLabel>
                    <CInputGroup>
                      <CFormInput
                        type="time"
                        name="endTime"
                        value={formData.endTime}
                        onChange={handleChange}
                      />
                      <CInputGroupText>
                        <CIcon icon={cilClock} />
                      </CInputGroupText>
                    </CInputGroup>
                  </CCol>

                  <CCol md={6}>
                    <CFormLabel className="form-label-custom">Tổng số giờ (Tự tính)</CFormLabel>
                    <CFormInput
                      type="text"
                      value={formData.totalHours}
                      readOnly
                      className="form-control-readonly fw-bold text-success"
                    />
                  </CCol>
                </CRow>

                {/* HÀNG 4: LÝ DO + TRẠNG THÁI */}
                <CRow className="mb-3">
                  <CCol md={8}>
                    <CFormLabel className="form-label-custom">
                      Lý do làm thêm<span className="required-mark">*</span>
                    </CFormLabel>
                    <CFormTextarea
                      rows={3}
                      name="reason"
                      value={formData.reason}
                      onChange={handleChange}
                      placeholder="Nhập lý do chi tiết..."
                    ></CFormTextarea>
                  </CCol>

                  <CCol md={4}>
                    <CFormLabel className="form-label-custom">Trạng thái</CFormLabel>
                    <CFormSelect name="status" value={formData.status} onChange={handleChange}>
                      <option value="PENDING">Chờ duyệt</option>
                      <option value="APPROVED">Đã duyệt</option>
                      <option value="REJECTED">Từ chối</option>
                    </CFormSelect>
                  </CCol>
                </CRow>
              </CForm>
            </CCardBody>
          </CCard>
        </div>
      </div>
    </>
  )
}

export default OvertimeRequestAdd
