import { cilSave, cilWarning, cilArrowLeft } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import {
  CAlert, CButton, CCard, CCardBody, CCol, CContainer, CForm, CFormCheck,
  CFormInput, CFormLabel, CFormSelect, CFormTextarea,
  CModal,
  CModalBody, CModalFooter,
  CModalHeader, CModalTitle,
  CRow,
  CToast,
  CToastBody,
  CCloseButton,
  CToaster
} from '@coreui/react'
import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import '../../scss/components-page.scss'

// Import API thật
import { createSalaryComponent } from '../../api/salaryComponentApi'

export default function AddComponentPage() {
  const navigate = useNavigate()
  const toaster = useRef()

  const initialForm = {
    name: '',
    code: '',
    type: 'earning', // ✅ Sửa mặc định thành EARNING (theo Enum backend)
    rawAmount: 0,    
    description: '',
    isActive: true   
  }

  const [form, setForm] = useState(initialForm)
  const [formattedAmount, setFormattedAmount] = useState('0 ₫') 
  
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState(null) 
  const [toast, setToast] = useState(0)        

  const [visibleModal, setVisibleModal] = useState(false)
  const [saveAction, setSaveAction] = useState('save') 

  const update = (patch) => setForm((f) => ({ ...f, ...patch }))

  // Xử lý nhập tiền
  const handleAmountChange = (e) => {
  const n = e.target.valueAsNumber // số thật
  const safe = Number.isFinite(n) ? n : 0

  update({ rawAmount: safe })
  setFormattedAmount(
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(safe)
  )
}


  const handleClickSave = (mode) => {
    setMessage(null)
    if (!form.name.trim()) { setMessage({ type: 'danger', text: 'Vui lòng nhập Tên thành phần.' }); return }
    if (!form.code.trim()) { setMessage({ type: 'danger', text: 'Vui lòng nhập Mã thành phần.' }); return }
    setSaveAction(mode)
    setVisibleModal(true)
  }

  // ✅ LOGIC QUAN TRỌNG ĐÃ FIX:
  const handleConfirmSave = async () => {
    setVisibleModal(false)
    setSubmitting(true)

    // Chuẩn bị payload chuẩn
    const payload = {
      code: form.code,
      name: form.name,
      type: form.type,
      amount: Number.isFinite(form.rawAmount) ? form.rawAmount : 0,
      description: form.description,
      isActive: form.isActive
    }


    // Debug: Bạn có thể F12 xem console để chắc chắn payload đúng
    console.log("Sending Payload:", payload) 

    try {
      await createSalaryComponent(payload)

      const successToast = (
        <CToast autohide={true} delay={3000} color="success" className="text-white align-items-center">
          <div className="d-flex">
            <CToastBody>Thêm mới thành công!</CToastBody>
            <CCloseButton className="me-2 m-auto" white />
          </div>
        </CToast>
      )
      setToast(successToast)

      if (saveAction === 'save') {
        setTimeout(() => navigate('/payroll/components'), 1000)
      } else {
        setForm(initialForm)
        setFormattedAmount('0 ₫')
      }

    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Có lỗi xảy ra.'
      setMessage({ type: 'danger', text: errorMsg })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="payroll-components">
      <CToaster ref={toaster} push={toast} placement="top-end" />

      <CModal alignment="center" visible={visibleModal} onClose={() => setVisibleModal(false)}>
        <CModalHeader><CModalTitle>Xác nhận lưu</CModalTitle></CModalHeader>
        <CModalBody className="text-center py-4">
            <CIcon icon={cilWarning} size="4xl" className="text-warning mb-3"/>
            <p>Bạn có chắc chắn muốn thêm thành phần lương <strong>{form.name}</strong>?</p>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" variant="ghost" onClick={() => setVisibleModal(false)}>Hủy bỏ</CButton>
          <CButton color="success" className="text-white" onClick={handleConfirmSave} disabled={submitting}>
            {submitting ? 'Đang lưu...' : 'Đồng ý'}
          </CButton>
        </CModalFooter>
      </CModal>

      <div className="pc-header" style={{ paddingTop: 0, paddingBottom: '0.5rem' }}>
        <div className="left">
            <div className="d-flex align-items-center gap-2">
                <CButton color="light" variant="ghost" className="text-secondary p-0" onClick={() => navigate('/payroll/components')}>
                    <CIcon icon={cilArrowLeft} size="xl"/>
                </CButton>
                <div className="title mb-0">Thêm thành phần lương</div>
            </div>
        </div>
        <div className="right" style={{ display: 'flex', gap: '.5rem' }}>
          <CButton color="secondary" variant="outline" onClick={() => navigate('/payroll/components')}>Hủy bỏ</CButton>
          <CButton color="success" variant="outline" disabled={submitting} onClick={() => handleClickSave('save_add')}>Lưu và thêm</CButton>
          <CButton color="success" className="text-white" disabled={submitting} onClick={() => handleClickSave('save')}><CIcon icon={cilSave} className="me-1" /> Lưu</CButton>
        </div>
      </div>

      <CCard className="shadow-sm border-0 pc-table">
        <CCardBody>
          {message && <CAlert color={message.type} className="mb-3 py-2">{message.text}</CAlert>}

          <CForm className="payroll-form" style={{ maxWidth: '1000px' }}>
            <CContainer fluid>
              <CRow className="g-3 align-items-center mb-3">
                <CCol md={3}><CFormLabel className="fw-bold mb-0">Tên thành phần <span className="text-danger">*</span></CFormLabel></CCol>
                <CCol md={9}><CFormInput value={form.name} onChange={(e) => update({ name: e.target.value })} placeholder="Ví dụ: Phụ cấp ăn trưa" /></CCol>
              </CRow>

              <CRow className="g-3 align-items-center mb-3">
                <CCol md={3}><CFormLabel className="fw-bold mb-0">Mã thành phần <span className="text-danger">*</span></CFormLabel></CCol>
                <CCol md={9}>
                    <CFormInput value={form.code} onChange={(e) => update({ code: e.target.value.toUpperCase() })} placeholder="Ví dụ: PC_AN" />
                </CCol>
              </CRow>

              <CRow className="g-3 align-items-center mb-3">
                <CCol md={3}><CFormLabel className="fw-bold mb-0">Loại thành phần</CFormLabel></CCol>
                <CCol md={4}>
                  <CFormSelect value={form.type} onChange={(e) => update({ type: e.target.value })}>
                    {/* Value phải khớp với Enum Backend: EARNING/DEDUCTION */}
                    <option value="earning">Thu nhập (Earning)</option>
                    <option value="deduction">Khấu trừ (Deduction)</option>
                  </CFormSelect>
                </CCol>
              </CRow>

              <CRow className="g-3 align-items-center mb-3">
                <CCol md={3}><CFormLabel className="fw-bold mb-0">Giá trị mặc định</CFormLabel></CCol>
                <CCol md={4}>
                    <CFormInput
                      type="number"
                      value={form.rawAmount}
                      onChange={handleAmountChange}
                      min={0}
                    />

                    <div className="form-text text-primary fw-semibold">{formattedAmount}</div>
                </CCol>
              </CRow>

              <CRow className="g-3 mb-3">
                <CCol md={3}><CFormLabel className="fw-bold mb-0">Mô tả</CFormLabel></CCol>
                <CCol md={9}><CFormTextarea rows={3} value={form.description} onChange={(e)=>update({ description:e.target.value })}/></CCol>
              </CRow>

              <div className="border-bottom my-4"></div>

              <CRow className="g-3 align-items-center">
                <CCol md={3}><CFormLabel className="fw-bold mb-0">Trạng thái</CFormLabel></CCol>
                <CCol md={9} className="d-flex align-items-center gap-4">
                  <CFormCheck type="radio" name="status" label="Đang theo dõi" checked={form.isActive === true} onChange={()=>update({ isActive: true })} />
                  <CFormCheck type="radio" name="status" label="Ngừng theo dõi" checked={form.isActive === false} onChange={()=>update({ isActive: false })} />
                </CCol>
              </CRow>
            </CContainer>
          </CForm>
        </CCardBody>
      </CCard>
    </div>
  )
}