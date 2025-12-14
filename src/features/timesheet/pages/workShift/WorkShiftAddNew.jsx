import { cilCheck, cilWarning } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import {
  CAlert,
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CForm,
  CFormCheck,
  CFormInput,
  CFormLabel,
  CFormSelect,
  CNav,
  CNavItem,
  CNavLink,
  CRow,
  CSpinner,
} from '@coreui/react'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom' // QUAN TRỌNG: Thêm useParams
import { shiftscheduleApi } from '../../api/shiftscheduleApi'

const WorkShiftAddNew = () => {
  const navigate = useNavigate()
  const { id } = useParams() // Lấy ID từ URL (nếu có)

  // Xác định chế độ: Có ID => Edit Mode, Không có ID => Add Mode
  const isEditMode = Boolean(id)

  const [activeTab, setActiveTab] = useState('Chung')
  const [loading, setLoading] = useState(false)
  const [alert, setAlert] = useState(null)

  // Danh sách mã ca đã tồn tại (để check trùng)
  const [existingCodes, setExistingCodes] = useState([])

  // Dữ liệu mặc định
  const initialFormData = {
    code: '',
    name: '',
    startTime: '08:00:00',
    endTime: '17:00:00',
    expectedWorkMinutes: 480,
    breakMinutes: 60,
    graceMinutes: 0,
    overtimeEligible: false,
    overtimeRate: 1.5,
    payType: 'hourly',
    hourlyRate: 0,
  }

  const [formData, setFormData] = useState(initialFormData)

  // --- 1. KHỞI TẠO DỮ LIỆU ---
  useEffect(() => {
    const initData = async () => {
      try {
        // A. Lấy danh sách tất cả để validate trùng mã
        const resAll = await shiftscheduleApi.getAll()
        const rawData = resAll.data?.data || resAll.data || []

        if (Array.isArray(rawData)) {
          // Lọc danh sách mã để check trùng.
          // Nếu đang sửa, loại bỏ chính ca hiện tại ra khỏi danh sách check trùng.
          const codes = rawData
            .filter((item) => (isEditMode ? String(item.shiftId) !== String(id) : true))
            .map((item) => item.code.toLowerCase().trim())
          setExistingCodes(codes)
        }

        // B. Nếu là EDIT MODE -> Lấy chi tiết ca để điền vào form
        if (isEditMode) {
          setLoading(true)
          const resDetail = await shiftscheduleApi.getById(id)
          // Tùy cấu trúc API, dữ liệu có thể nằm ở .data hoặc .data.data
          const data = resDetail.data?.data || resDetail.data

          if (data) {
            setFormData({
              code: data.code,
              name: data.name,
              // Cắt chuỗi HH:mm:ss thành HH:mm để hiện thị đúng trên input type="time"
              startTime: data.startTime ? data.startTime.substring(0, 5) : '08:00',
              endTime: data.endTime ? data.endTime.substring(0, 5) : '17:00',
              expectedWorkMinutes: data.expectedWorkMinutes,
              breakMinutes: data.breakMinutes,
              graceMinutes: data.graceMinutes,
              overtimeEligible: data.overtimeEligible,
              overtimeRate: data.overtimeRate,
              payType: data.payType || 'hourly',
              hourlyRate: data.hourlyRate || 0,
            })
          }
          setLoading(false)
        }
      } catch (error) {
        console.error('Lỗi khởi tạo dữ liệu:', error)
        setAlert({ type: 'danger', message: 'Không thể tải dữ liệu ca làm việc.' })
        setLoading(false)
      }
    }

    initData()
  }, [id, isEditMode])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target

    setFormData((prev) => {
      // Nếu đổi loại lương
      if (name === 'payType') {
        return {
          ...prev,
          payType: value,
          hourlyRate: value === 'fixed' ? 20000 : prev.hourlyRate,
        }
      }

      return {
        ...prev,
        [name]: type === 'checkbox' ? checked : value,
      }
    })
  }

  // --- 2. XỬ LÝ LƯU ---
  const handleSubmit = async () => {
    setAlert(null)

    // Validate bắt buộc
    if (!formData.code || !formData.name) {
      setAlert({ type: 'danger', message: 'Vui lòng nhập Mã ca và Tên ca.' })
      return
    }

    // Validate trùng mã
    if (existingCodes.includes(formData.code.toLowerCase().trim())) {
      setAlert({ type: 'danger', message: `Mã ca "${formData.code}" đã tồn tại trên hệ thống!` })
      return
    }

    setLoading(true)
    try {
      // Chuẩn bị dữ liệu gửi đi (Format lại giờ và số)
      const payload = {
        ...formData,
        // Backend cần HH:mm:ss, input chỉ trả HH:mm
        startTime:
          formData.startTime.length === 5 ? `${formData.startTime}:00` : formData.startTime,
        endTime: formData.endTime.length === 5 ? `${formData.endTime}:00` : formData.endTime,
        expectedWorkMinutes: Number(formData.expectedWorkMinutes),
        breakMinutes: Number(formData.breakMinutes),
        graceMinutes: Number(formData.graceMinutes),
        hourlyRate: Number(formData.hourlyRate),
        overtimeRate: Number(formData.overtimeRate),
      }

      if (isEditMode) {
        // --- GỌI API UPDATE ---
        await shiftscheduleApi.update(id, payload)
        setAlert({ type: 'success', message: 'Cập nhật ca làm việc thành công!' })
      } else {
        // --- GỌI API CREATE ---
        await shiftscheduleApi.create(payload)
        setAlert({ type: 'success', message: 'Thêm mới ca làm việc thành công!' })
      }

      // Quay lại trang danh sách sau 1.5s
      setTimeout(() => {
        navigate('/timesheet/shiftscheduleShow')
      }, 1500)
    } catch (error) {
      console.error('Lỗi lưu dữ liệu:', error)
      setAlert({ type: 'danger', message: 'Có lỗi xảy ra. Vui lòng thử lại.' })
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    navigate('/timesheet/shiftscheduleShow')
  }

  return (
    <CCard>
      <CCardHeader className="d-flex justify-content-between align-items-center">
        {/* Tiêu đề thay đổi theo chế độ */}
        <h5 className="mb-0">{isEditMode ? 'Cập nhật ca làm việc' : 'Thêm mới ca làm việc'}</h5>
        <div>
          <CButton color="secondary" variant="outline" onClick={handleCancel} className="me-2">
            Hủy
          </CButton>
          <CButton
            color="warning"
            onClick={handleSubmit}
            disabled={loading}
            className="text-white fw-bold"
            style={{ backgroundColor: '#ea580c', borderColor: '#ea580c' }}
          >
            {loading ? <CSpinner size="sm" aria-hidden="true" /> : isEditMode ? 'Cập nhật' : 'Lưu'}
          </CButton>
        </div>
      </CCardHeader>

      <CCardBody>
        <CNav variant="tabs" role="tablist" className="mb-3">
          <CNavItem role="presentation">
            <CNavLink
              active={activeTab === 'Chung'}
              onClick={() => setActiveTab('Chung')}
              role="tab"
              style={{ cursor: 'pointer' }}
            >
              Thông tin chung
            </CNavLink>
          </CNavItem>
        </CNav>

        {alert && (
          <CAlert color={alert.type} className="d-flex align-items-center">
            <CIcon
              icon={alert.type === 'success' ? cilCheck : cilWarning}
              className="flex-shrink-0 me-2"
              width={24}
            />
            <div>{alert.message}</div>
          </CAlert>
        )}

        {/* Nếu đang loading dữ liệu edit thì hiện spinner to ở giữa */}
        {loading && isEditMode && !formData.code ? (
          <div className="text-center p-5">
            <CSpinner color="warning" />
          </div>
        ) : (
          <>
            {activeTab === 'Chung' && (
              <CForm className="p-3">
                {/* 1. THÔNG TIN CƠ BẢN */}
                <h6 className="text-uppercase text-body-secondary fw-bold mb-3">Cấu hình cơ bản</h6>
                <CRow className="mb-3">
                  <CFormLabel htmlFor="code" className="col-sm-3 col-form-label text-end">
                    Mã ca <span className="text-danger">*</span>
                  </CFormLabel>
                  <CCol sm={3}>
                    <CFormInput
                      type="text"
                      id="code"
                      name="code"
                      value={formData.code}
                      onChange={handleChange}
                      // Khi sửa, thường không cho sửa Mã (để đảm bảo tính nhất quán), nếu bạn muốn cho sửa thì bỏ disabled đi
                      disabled={isEditMode}
                      placeholder="Ví dụ: CA-SANG"
                    />
                    {isEditMode && (
                      <div className="form-text text-muted small">
                        Không thể thay đổi mã khi cập nhật.
                      </div>
                    )}
                  </CCol>

                  <CFormLabel htmlFor="name" className="col-sm-2 col-form-label text-end">
                    Tên ca <span className="text-danger">*</span>
                  </CFormLabel>
                  <CCol sm={4}>
                    <CFormInput
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                    />
                  </CCol>
                </CRow>

                <CRow className="mb-3">
                  <CFormLabel htmlFor="startTime" className="col-sm-3 col-form-label text-end">
                    Giờ bắt đầu
                  </CFormLabel>
                  <CCol sm={3}>
                    <CFormInput
                      type="time"
                      id="startTime"
                      name="startTime"
                      value={formData.startTime}
                      onChange={handleChange}
                    />
                  </CCol>

                  <CFormLabel htmlFor="endTime" className="col-sm-2 col-form-label text-end">
                    Giờ kết thúc
                  </CFormLabel>
                  <CCol sm={3}>
                    <CFormInput
                      type="time"
                      id="endTime"
                      name="endTime"
                      value={formData.endTime}
                      onChange={handleChange}
                    />
                  </CCol>
                </CRow>

                <hr className="my-4" />

                {/* 2. THỜI GIAN VÀ QUY ĐỊNH */}
                <h6 className="text-uppercase text-body-secondary fw-bold mb-3">
                  Thời gian & Quy định
                </h6>
                <CRow className="mb-3">
                  <CFormLabel className="col-sm-3 col-form-label text-end">
                    Số phút làm việc
                  </CFormLabel>
                  <CCol sm={3}>
                    <CFormInput
                      type="number"
                      name="expectedWorkMinutes"
                      value={formData.expectedWorkMinutes}
                      onChange={handleChange}
                    />
                  </CCol>

                  <CFormLabel className="col-sm-2 col-form-label text-end">
                    Thời gian nghỉ
                  </CFormLabel>
                  <CCol sm={3}>
                    <CFormInput
                      type="number"
                      name="breakMinutes"
                      value={formData.breakMinutes}
                      onChange={handleChange}
                    />
                  </CCol>
                </CRow>

                <CRow className="mb-3">
                  <CFormLabel className="col-sm-3 col-form-label text-end">
                    Cho phép đi muộn
                  </CFormLabel>
                  <CCol sm={3}>
                    <CFormInput
                      type="number"
                      name="graceMinutes"
                      value={formData.graceMinutes}
                      onChange={handleChange}
                    />
                  </CCol>
                </CRow>

                <hr className="my-4" />

                {/* 3. LƯƠNG & OT */}
                <h6 className="text-uppercase text-body-secondary fw-bold mb-3">
                  Lương & Tăng ca (OT)
                </h6>

                <CRow className="mb-3">
                  <CFormLabel className="col-sm-3 col-form-label text-end">Loại lương</CFormLabel>
                  <CCol sm={3}>
                    <CFormSelect name="payType" value={formData.payType} onChange={handleChange}>
                      <option value="hourly">Theo giờ (Hourly)</option>
                      <option value="fixed">Cố định (Fixed)</option>
                    </CFormSelect>
                  </CCol>

                  <CFormLabel className="col-sm-2 col-form-label text-end">
                    Mức lương/giờ
                  </CFormLabel>
                  <CCol sm={3}>
                    <CFormInput
                      type="number"
                      name="hourlyRate"
                      value={formData.hourlyRate}
                      onChange={handleChange}
                      disabled={formData.payType === 'fixed'}
                    />
                  </CCol>
                </CRow>

                <CRow className="mb-3 align-items-center">
                  <CCol sm={3} className="text-end">
                    <CFormLabel>Chế độ OT</CFormLabel>
                  </CCol>
                  <CCol sm={3}>
                    <CFormCheck
                      id="overtimeEligible"
                      name="overtimeEligible"
                      label="Được tính tăng ca"
                      checked={formData.overtimeEligible}
                      onChange={handleChange}
                    />
                  </CCol>

                  {formData.overtimeEligible && (
                    <>
                      <CFormLabel className="col-sm-2 col-form-label text-end">Hệ số OT</CFormLabel>
                      <CCol sm={3}>
                        <CFormInput
                          type="number"
                          step="0.1"
                          name="overtimeRate"
                          value={formData.overtimeRate}
                          onChange={handleChange}
                        />
                      </CCol>
                    </>
                  )}
                </CRow>
              </CForm>
            )}
          </>
        )}
      </CCardBody>
    </CCard>
  )
}

export default WorkShiftAddNew
