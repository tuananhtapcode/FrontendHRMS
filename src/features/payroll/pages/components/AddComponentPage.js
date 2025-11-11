import { cilCalculator, cilInfo, cilSave } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import {
  CAlert, CButton, CCard, CCardBody, CCol, CContainer, CForm, CFormCheck,
  CFormInput, CFormLabel, CFormSelect, CFormTextarea, CInputGroup, CInputGroupText, CRow,
} from '@coreui/react'
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../../scss/components-page.scss'

export default function AddComponentPage() {
  const navigate = useNavigate()

  const unitOptions = useMemo(() => ['—', 'Thông tin nhân viên', 'Thuế TNCN', 'Lương'], [])
  const typeOptions = useMemo(() => ['Thu nhập', 'Phụ cấp', 'Khấu trừ', 'Bảo hiểm – Công đoàn', 'Lương', 'Khác'], [])
  const valueTypeOptions = useMemo(() => ['Tiền tệ', 'Số', 'Chữ', 'Ngày'], [])

  const [form, setForm] = useState({
    name: '', code: '', unit: unitOptions[0], kind: typeOptions[0],
    taxBehavior: 'chiuthue', norm: '', allowExceedNorm: false,
    valueType: valueTypeOptions[0], valueMode: 'formula', copyScope: 'Trong cùng đơn vị công tác',
    formula: '', description: '', showOnPayslip: 'yes',
  })
  const [submitting, setSubmitting] = useState(false)
  const [touched, setTouched] = useState(false)
  const [message, setMessage] = useState(null)

  const requiredInvalid = !form.name.trim()
  const update = (patch) => setForm((f) => ({ ...f, ...patch }))

  const handleSave = async (mode = 'save') => {
    setTouched(true)
    setMessage(null)
    if (requiredInvalid) {
      setMessage({ type: 'danger', text: 'Vui lòng nhập Tên thành phần.' })
      return
    }
    try {
      setSubmitting(true)
      // TODO: call API create here
      await new Promise((r) => setTimeout(r, 300))
      setMessage({ type: 'success', text: 'Đã lưu thành phần lương.' })
      if (mode === 'save') navigate('/payroll/components')
      if (mode === 'save_add') {
        setForm((f) => ({ ...f, name: '', code: '', formula: '', description: '' }))
        setTouched(false)
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="payroll-components">
      <div className="pc-header" style={{ paddingTop: 0, paddingBottom: '0.5rem' }}>
        <div className="left"><div className="title">Thêm thành phần</div></div>
        <div className="right" style={{ display: 'flex', gap: '.5rem' }}>
          <CButton color="secondary" variant="outline" onClick={() => navigate('/payroll/components')}>
            Hủy bỏ
          </CButton>
          <CButton color="success" variant="outline" disabled={submitting} onClick={() => handleSave('save_add')}>
            Lưu và thêm
          </CButton>
          <CButton color="success" disabled={submitting} onClick={() => handleSave('save')}>
            <CIcon icon={cilSave} className="me-1" /> Lưu
          </CButton>
        </div>
      </div>

      <CCard className="shadow-sm border-0 pc-table">
        <CCardBody>
          {message && <CAlert color={message.type} className="mb-3 py-2">{message.text}</CAlert>}

          <CForm className="payroll-form">
            <CContainer fluid>
              <CRow className="g-3 align-items-center">
                <CCol md={2}><CFormLabel className="fw-semibold">Tên thành phần <span className="text-danger">*</span></CFormLabel></CCol>
                <CCol md={6}><CFormInput value={form.name} onChange={(e) => update({ name: e.target.value })} invalid={touched && requiredInvalid} /></CCol>
              </CRow>

              <CRow className="g-3 align-items-center mt-1">
                <CCol md={2}><CFormLabel className="fw-semibold">Mã thành phần</CFormLabel></CCol>
                <CCol md={3}><CFormInput value={form.code} onChange={(e) => update({ code: e.target.value })} placeholder="Nhập mã viết liền" /></CCol>
              </CRow>

              <CRow className="g-3 align-items-center mt-1">
                <CCol md={2}><CFormLabel className="fw-semibold">Đơn vị áp dụng</CFormLabel></CCol>
                <CCol md={3}>
                  <CFormSelect value={form.unit} onChange={(e) => update({ unit: e.target.value })}>
                    {unitOptions.map((o) => <option key={o}>{o}</option>)}
                  </CFormSelect>
                </CCol>
              </CRow>

              <CRow className="g-3 align-items-center mt-1">
                <CCol md={2}><CFormLabel className="fw-semibold">Loại thành phần</CFormLabel></CCol>
                <CCol md={4}>
                  <CFormSelect value={form.kind} onChange={(e) => update({ kind: e.target.value })}>
                    {typeOptions.map((o) => <option key={o}>{o}</option>)}
                  </CFormSelect>
                </CCol>
              </CRow>

              <CRow className="g-3 align-items-center mt-1">
                <CCol md={2}><CFormLabel className="fw-semibold">Tính chất</CFormLabel></CCol>
                <CCol md={8} className="d-flex align-items-center gap-3 flex-wrap">
                  <CFormSelect className="w-auto" value={form.kind} onChange={(e) => update({ kind: e.target.value })}>
                    {typeOptions.map((o) => <option key={o}>{o}</option>)}
                  </CFormSelect>
                  <div className="vr" />
                  <CFormCheck inline type="radio" name="taxBehavior" label="Chịu thuế" checked={form.taxBehavior==='chiuthue'} onChange={() => update({ taxBehavior:'chiuthue' })}/>
                  <CFormCheck inline type="radio" name="taxBehavior" label="Miễn thuế toàn phần" checked={form.taxBehavior==='mienthue_toanphan'} onChange={() => update({ taxBehavior:'mienthue_toanphan' })}/>
                  <CFormCheck inline type="radio" name="taxBehavior" label="Miễn thuế một phần" checked={form.taxBehavior==='mienthue_motphan'} onChange={() => update({ taxBehavior:'mienthue_motphan' })}/>
                </CCol>
              </CRow>

              <CRow className="g-3 mt-1">
                <CCol md={2}><CFormLabel className="fw-semibold">Định mức</CFormLabel></CCol>
                <CCol md={6}>
                  <CFormTextarea rows={2} placeholder="Tự động gợi ý công thức và tham số khi gõ" value={form.norm} onChange={(e) => update({ norm:e.target.value })}/>
                  <CFormCheck className="mt-2" label="Cho phép giá trị tính vượt quá định mức" checked={form.allowExceedNorm} onChange={(e) => update({ allowExceedNorm:e.target.checked })}/>
                </CCol>
              </CRow>

              <CRow className="g-3 align-items-center mt-1">
                <CCol md={2}><CFormLabel className="fw-semibold">Kiểu giá trị</CFormLabel></CCol>
                <CCol md={3}>
                  <CFormSelect value={form.valueType} onChange={(e) => update({ valueType:e.target.value })}>
                    {valueTypeOptions.map((o) => <option key={o}>{o}</option>)}
                  </CFormSelect>
                </CCol>
              </CRow>

              <CRow className="g-3 mt-1">
                <CCol md={2}><CFormLabel className="fw-semibold">Giá trị</CFormLabel></CCol>
                <CCol md={8}>
                  <div className="d-flex flex-column gap-2">
                    <div className="d-flex align-items-center gap-2 flex-wrap">
                      <CFormCheck type="radio" name="valueMode" label="Tự động cộng/giống giá trị của các nhân viên" checked={form.valueMode==='copy'} onChange={() => update({ valueMode:'copy' })}/>
                      <CFormSelect className="w-auto" disabled={form.valueMode!=='copy'} value={form.copyScope} onChange={(e)=>update({ copyScope:e.target.value })}>
                        <option>Trong cùng đơn vị công tác</option><option>Toàn công ty</option>
                      </CFormSelect>
                      <CInputGroupText className="bg-transparent border-0 p-0 ms-1"><CIcon icon={cilInfo}/></CInputGroupText>
                    </div>

                    <div>
                      <CFormCheck type="radio" name="valueMode" label="Tính theo công thức tự đặt" checked={form.valueMode==='formula'} onChange={() => update({ valueMode:'formula' })}/>
                      <CInputGroup className="mt-2">
                        <CFormTextarea rows={2} placeholder="Tự động gợi ý công thức và tham số khi gõ" disabled={form.valueMode!=='formula'} value={form.formula} onChange={(e)=>update({ formula:e.target.value })}/>
                        <CInputGroupText role="button" title="Trợ giúp công thức"><CIcon icon={cilCalculator}/></CInputGroupText>
                      </CInputGroup>
                    </div>
                  </div>
                </CCol>
              </CRow>

              <CRow className="g-3 mt-1">
                <CCol md={2}><CFormLabel className="fw-semibold">Mô tả</CFormLabel></CCol>
                <CCol md={6}><CFormTextarea rows={2} value={form.description} onChange={(e)=>update({ description:e.target.value })}/></CCol>
              </CRow>

              <CRow className="g-3 align-items-center mt-1">
                <CCol md={2}><CFormLabel className="fw-semibold">Hiển thị trên phiếu lương</CFormLabel></CCol>
                <CCol md={6} className="d-flex align-items-center gap-3">
                  <CFormCheck type="radio" name="show" label="Có" checked={form.showOnPayslip==='yes'} onChange={()=>update({ showOnPayslip:'yes' })}/>
                  <CFormCheck type="radio" name="show" label="Không" checked={form.showOnPayslip==='no'} onChange={()=>update({ showOnPayslip:'no' })}/>
                  <CFormCheck type="radio" name="show" label="Chỉ hiển thị nếu giá trị khác 0" checked={form.showOnPayslip==='nonzero'} onChange={()=>update({ showOnPayslip:'nonzero' })}/>
                </CCol>
              </CRow>

              <CRow className="g-3 align-items-center mt-1">
                <CCol md={2}><CFormLabel className="fw-semibold">Nguồn tạo</CFormLabel></CCol>
                <CCol md={6} className="text-body">Tự thêm</CCol>
              </CRow>
            </CContainer>
          </CForm>
        </CCardBody>
      </CCard>

      <style>{`
        .payroll-form .vr { width:1px; height:24px; background: var(--cui-border-color); }
        .payroll-form .form-label { margin-bottom: .25rem; }
        .payroll-form .form-select, .payroll-form .form-control { max-width: 100%; }
        @media (min-width: 992px){ .payroll-form .form-label { display:flex; justify-content:flex-start; } }
      `}</style>
    </div>
  )
}
