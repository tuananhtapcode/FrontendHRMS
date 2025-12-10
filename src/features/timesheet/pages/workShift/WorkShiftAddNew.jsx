// import { cilCheck, cilWarning } from '@coreui/icons';
// import CIcon from '@coreui/icons-react';
// import {
//   CAlert,
//   CButton,
//   CCard,
//   CCardBody,
//   CCardHeader,
//   CCol,
//   CForm,
//   CFormCheck,
//   CFormInput,
//   CFormLabel,
//   CNav,
//   CNavItem,
//   CNavLink,
//   CRow
// } from '@coreui/react';
// import { useState } from 'react';
// import { useNavigate } from 'react-router-dom'; // Dùng để quay lại
// // import { workShiftApi } from '../../api/shiftscheduleApi.js'; // Import API

// const WorkShiftAddNew = () => {
//   const navigate = useNavigate() // Hook để điều hướng
//   const [activeTab, setActiveTab] = useState('Chung')
//   const [loading, setLoading] = useState(false)
//   const [alert, setAlert] = useState(null) // State cho thông báo

//   // Quản lý state cho tất cả các trường trong form
//   const [formData, setFormData] = useState({
//     name: '',
//     code: '',
//     unit: 'Tất cả đơn vị',
//     startTime: '08:00',
//     checkInFrom: '07:00',
//     checkInTo: '09:00',
//     endTime: '17:30',
//     checkOutFrom: '16:30',
//     checkOutTo: '18:30',
//     isNightShift: false, // Là ca đêm (Tính công)
//     isCountWork: true, // Tách theo khung giờ
//     workHours: 9.5,
//     workDays: 1,
//     // ... (Thêm các trường cho tab "Thiết lập nâng cao" nếu cần)
//   })

//   // Hàm xử lý khi thay đổi input
//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target
//     setFormData((prev) => ({
//       ...prev,
//       [name]: type === 'checkbox' ? checked : value,
//     }))
//   }

//   // Hàm xử lý khi bấm nút "Lưu"
//   const handleSubmit = async () => {
//     setLoading(true)
//     setAlert(null)
//     try {
//       // Gọi API để tạo ca mới
//       await workShiftApi.createWorkShift(formData)

//       // Hiển thị thông báo thành công
//       setAlert({ type: 'success', message: 'Thêm mới ca làm việc thành công!' })

//       // Tự động quay về trang danh sách sau 2 giây
//       setTimeout(() => {
//         navigate('/ca-lam-viec/danh-sach')
//       }, 2000)
//     } catch (error) {
//       console.error('Lỗi khi thêm mới ca:', error)
//       setAlert({ type: 'danger', message: 'Thêm mới thất bại. Vui lòng thử lại.' })
//       setLoading(false)
//     }
//     // Không tắt loading nếu thành công, vì đằng nào cũng chuyển trang
//   }

//   // Hàm xử lý khi bấm "Hủy"
//   const handleCancel = () => {
//     navigate('/timesheet/shiftscheduleShow') // Quay lại trang danh sách
//   }

//   return (
//     <CCard>
//       {/* HEADER: TIÊU ĐỀ VÀ CÁC NÚT */}
//       <CCardHeader className="d-flex justify-content-between align-items-center">
//         <h5 className="mb-0">Thêm mới ca làm việc</h5>
//         <div>
//           <CButton color="secondary" variant="outline" onClick={handleCancel} className="me-2">
//             Hủy
//           </CButton>
//           <CButton
//             color="warning"
//             onClick={handleSubmit}
//             disabled={loading}
//             style={{
//               backgroundColor: '#ea580c',
//               borderColor: '#ea580c',
//               color: 'white',
//               fontWeight: 600
//             }}
//             onMouseEnter={(e) => {
//               e.currentTarget.style.backgroundColor = '#c2410c';
//               e.currentTarget.style.borderColor = '#c2410c';
//             }}
//             onMouseLeave={(e) => {
//               e.currentTarget.style.backgroundColor = '#ea580c';
//               e.currentTarget.style.borderColor = '#ea580c';
//             }}
//           >
//             {loading ? 'Đang lưu...' : 'Lưu'}
//           </CButton>
//         </div>
//       </CCardHeader>

//       <CCardBody>
//         {/* THANH TAB (Chung / Thiết lập nâng cao) */}
//         <CNav variant="tabs" role="tablist" className="mb-3">
//           <CNavItem role="presentation">
//             <CNavLink
//               active={activeTab === 'Chung'}
//               onClick={() => setActiveTab('Chung')}
//               role="tab"
//             >
//               Chung
//             </CNavLink>
//           </CNavItem>
//           <CNavItem role="presentation">
//             <CNavLink
//               active={activeTab === 'NangCao'}
//               onClick={() => setActiveTab('NangCao')}
//               role="tab"
//             >
//               Thiết lập nâng cao
//             </CNavLink>
//           </CNavItem>
//         </CNav>

//         {/* THÔNG BÁO (Thành công / Thất bại) */}
//         {alert && (
//           <CAlert color={alert.type} className="d-flex align-items-center">
//             <CIcon
//               icon={alert.type === 'success' ? cilCheck : cilWarning}
//               className="flex-shrink-0 me-2"
//               width={24}
//             />
//             <div>{alert.message}</div>
//           </CAlert>
//         )}

//         {/* --- NỘI DUNG TAB "CHUNG" --- */}
//         {activeTab === 'Chung' && (
//           <CForm className="p-3">
//             <h6 className="text-uppercase text-body-secondary">THÔNG TIN CHUNG</h6>
//             {/* Tên ca */}
//             <CRow className="mb-3">
//               <CFormLabel htmlFor="name" className="col-sm-3 col-form-label text-end">
//                 Tên ca <span className="text-danger">*</span>
//               </CFormLabel>
//               <CCol sm={9}>
//                 <CFormInput type="text" id="name" name="name" value={formData.name} onChange={handleChange} />
//               </CCol>
//             </CRow>
//             {/* Mã ca */}
//             <CRow className="mb-3">
//               <CFormLabel htmlFor="code" className="col-sm-3 col-form-label text-end">
//                 Mã ca <span className="text-danger">*</span>
//               </CFormLabel>
//               <CCol sm={9}>
//                 <CFormInput type="text" id="code" name="code" value={formData.code} onChange={handleChange} />
//               </CCol>
//             </CRow>


//             <hr className="my-4" />

//             {/* Giờ bắt đầu ca */}
//             <CRow className="mb-3 align-items-center">
//               <CFormLabel htmlFor="startTime" className="col-sm-3 col-form-label text-end">
//                 Giờ bắt đầu ca <span className="text-danger">*</span>
//               </CFormLabel>
//               <CCol sm={2}>
//                 <CFormInput type="time" id="startTime" name="startTime" value={formData.startTime} onChange={handleChange} />
//               </CCol>
//               <CCol sm={7} className="d-flex align-items-center">
//                 <CFormCheck id="checkIn" label="Chấm vào" className="me-2" defaultChecked />
//                 <span className="me-2">Từ</span>
//                 <CFormInput type="time" name="checkInFrom" value={formData.checkInFrom} onChange={handleChange} style={{ width: '100px' }} />
//                 <span className="mx-2">Đến</span>
//                 <CFormInput type="time" name="checkInTo" value={formData.checkInTo} onChange={handleChange} style={{ width: '100px' }} />
//               </CCol>
//             </CRow>

//             {/* Giờ kết thúc ca */}
//             <CRow className="mb-3 align-items-center">
//               <CFormLabel htmlFor="endTime" className="col-sm-3 col-form-label text-end">
//                 Giờ kết thúc ca <span className="text-danger">*</span>
//               </CFormLabel>
//               <CCol sm={2}>
//                 <CFormInput type="time" id="endTime" name="endTime" value={formData.endTime} onChange={handleChange} />
//               </CCol>
//               <CCol sm={7} className="d-flex align-items-center">
//                 <CFormCheck id="checkOut" label="Chấm ra" className="me-2" defaultChecked />
//                 <span className="me-2">Từ</span>
//                 <CFormInput type="time" name="checkOutFrom" value={formData.checkOutFrom} onChange={handleChange} style={{ width: '100px' }} />
//                 <span className="mx-2">Đến</span>
//                 <CFormInput type="time" name="checkOutTo" value={formData.checkOutTo} onChange={handleChange} style={{ width: '100px' }} />
//               </CCol>
//             </CRow>
//             {/* Checkbox nghỉ giữa ca */}
//             <CRow className="mb-3">
//               <CCol sm={9} className="offset-sm-3">
//                 <CFormCheck id="isNightShift" name="isNightShift" label="Là ca đêm (tính công)" value={formData.isNightShift} onChange={handleChange} />
//               </CCol>
//             </CRow>

//             <hr className="my-4" />

//             <h6 className="text-uppercase text-body-secondary">TÍNH CÔNG</h6>
//             <CRow className="mb-3">
//               <CCol sm={9} className="offset-sm-3">
//                 <CFormCheck
//                   id="isCountWork"
//                   name="isCountWork"
//                   label="Tách theo khung giờ làm việc"
//                   checked={formData.isCountWork}
//                   onChange={handleChange}
//                 />
//               </CCol>
//             </CRow>

//             {/* Giờ công & Ngày công */}
//             <CRow className="mb-3 align-items-center">
//               <CFormLabel htmlFor="workHours" className="col-sm-3 col-form-label text-end">
//                 Giờ công
//               </CFormLabel>
//               <CCol sm={3}>
//                 <CFormInput type="number" id="workHours" name="workHours" value={formData.workHours} onChange={handleChange} />
//               </CCol>
//               <CFormLabel htmlFor="workDays" className="col-sm-3 col-form-label text-end">
//                 Ngày công
//               </CFormLabel>
//               <CCol sm={3}>
//                 <CFormInput type="number" id="workDays" name="workDays" value={formData.workDays} onChange={handleChange} />
//               </CCol>
//             </CRow>

//             <h6 className="text-uppercase text-body-secondary mt-4">HỆ SỐ</h6>
//             {/* Vùng màu xám */}
//             <CRow className="bg-body-tertiary p-3 rounded mb-3">
//               <CCol md={12}>
//                 <div className="fw-bold mb-2">Hưởng lương</div>
//                 <CRow>
//                   <CFormLabel htmlFor="heSo1" className="col-sm-2 col-form-label">
//                     Ngày thường
//                   </CFormLabel>
//                   <CCol sm={2}>
//                     <CFormInput type="number" id="heSo1" name="heSo1" defaultValue={1} />
//                   </CCol>
//                   <CFormLabel htmlFor="heSo2" className="col-sm-2 col-form-label">
//                     Ngày nghỉ
//                   </CFormLabel>
//                   <CCol sm={2}>
//                     <CFormInput type="number" id="heSo2" name="heSo2" defaultValue={2} />
//                   </CCol>
//                   <CFormLabel htmlFor="heSo3" className="col-sm-2 col-form-label">
//                     Ngày lễ
//                   </CFormLabel>
//                   <CCol sm={2}>
//                     <CFormInput type="number" id="heSo3" name="heSo3" defaultValue={3} />
//                   </CCol>
//                 </CRow>
//                 <div className="fw-bold mt-3 mb-2">Nghỉ bù</div>
//                 <CRow>
//                   <CFormLabel htmlFor="nghiBu" className="col-sm-2 col-form-label">
//                     Ngày lễ
//                   </CFormLabel>
//                   <CCol sm={2}>
//                     <CFormInput type="number" id="nghiBu" name="nghiBu" defaultValue={0} />
//                   </CCol>
//                 </CRow>
//               </CCol>
//             </CRow>

//             {/* Checkbox cuối trang */}
//             <CRow className="mb-2">
//               <CCol sm={9} className="offset-sm-3">
//                 <CFormCheck
//                   id="check1"
//                   label="Nếu không có giờ vào thì lấy giờ vào ca"
//                 />
//               </CCol>
//             </CRow>
//             <CRow>
//               <CCol sm={9} className="offset-sm-3">
//                 <CFormCheck
//                   id="check2"
//                   label="Nếu không có giờ ra thì lấy giờ ra ca"
//                 />
//               </CCol>
//             </CRow>

//           </CForm>
//         )}

//         {/* --- NỘI DUNG TAB "THIẾT LẬP NÂNG CAO" --- */}
//         {activeTab === 'NangCao' && (
//           <div className="p-3">
//             <p>Nội dung cho thiết lập nâng cao sẽ ở đây...</p>
//           </div>
//         )}
//       </CCardBody>


//     </CCard>
//   )
// }

// export default WorkShiftAddNew;







import { cilCheck, cilWarning } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
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
  CNav,
  CNavItem,
  CNavLink,
  CRow
} from '@coreui/react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const WorkShiftAddNew = () => {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('Chung')
  const [loading, setLoading] = useState(false)
  const [alert, setAlert] = useState(null)

  // Quản lý state cho tất cả các trường trong form
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    unit: 'Tất cả đơn vị',
    startTime: '08:00',
    checkInFrom: '07:00',
    checkInTo: '09:00',
    endTime: '17:30',
    checkOutFrom: '16:30',
    checkOutTo: '18:30',
    isNightShift: false,
    isCountWork: true,
    workHours: 9.5,
    workDays: 1,
    
    // --- CÁC TRƯỜNG MỚI THÊM CHO PHẦN TRỪ CÔNG ---
    deductNoCheckIn: false,       // Checkbox: Không có giờ vào bị trừ công
    deductNoCheckInHours: 0,      // Giờ công bị trừ
    deductNoCheckInDays: 0,       // Ngày công bị trừ
    
    deductNoCheckOut: false,      // Checkbox: Không có giờ ra bị trừ công
    deductNoCheckOutHours: 0,     // Giờ công bị trừ
    deductNoCheckOutDays: 0,      // Ngày công bị trừ
    // ---------------------------------------------
  })

  // Hàm xử lý khi thay đổi input
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  // Hàm xử lý khi bấm nút "Lưu"
  const handleSubmit = async () => {
    setLoading(true)
    setAlert(null)
    try {
      console.log('Dữ liệu gửi đi:', formData); // Log để kiểm tra
      // await workShiftApi.createWorkShift(formData)

      setAlert({ type: 'success', message: 'Thêm mới ca làm việc thành công!' })
      setTimeout(() => {
        navigate('/ca-lam-viec/danh-sach')
      }, 2000)
    } catch (error) {
      console.error('Lỗi khi thêm mới ca:', error)
      setAlert({ type: 'danger', message: 'Thêm mới thất bại. Vui lòng thử lại.' })
      setLoading(false)
    }
  }

  const handleCancel = () => {
    navigate('/timesheet/shiftscheduleShow')
  }

  return (
    <CCard>
      {/* HEADER */}
      <CCardHeader className="d-flex justify-content-between align-items-center">
        <h5 className="mb-0">Thêm mới ca làm việc</h5>
        <div>
          <CButton color="secondary" variant="outline" onClick={handleCancel} className="me-2">
            Hủy
          </CButton>
          <CButton
            color="warning"
            onClick={handleSubmit}
            disabled={loading}
            style={{ backgroundColor: '#ea580c', borderColor: '#ea580c', color: 'white', fontWeight: 600 }}
          >
            {loading ? 'Đang lưu...' : 'Lưu'}
          </CButton>
        </div>
      </CCardHeader>

      <CCardBody>
        <CNav variant="tabs" role="tablist" className="mb-3">
          <CNavItem role="presentation">
            <CNavLink active={activeTab === 'Chung'} onClick={() => setActiveTab('Chung')} role="tab" style={{cursor: 'pointer'}}>
              Chung
            </CNavLink>
          </CNavItem>
          <CNavItem role="presentation">
            <CNavLink active={activeTab === 'NangCao'} onClick={() => setActiveTab('NangCao')} role="tab" style={{cursor: 'pointer'}}>
              Thiết lập nâng cao
            </CNavLink>
          </CNavItem>
        </CNav>

        {alert && (
          <CAlert color={alert.type} className="d-flex align-items-center">
            <CIcon icon={alert.type === 'success' ? cilCheck : cilWarning} className="flex-shrink-0 me-2" width={24} />
            <div>{alert.message}</div>
          </CAlert>
        )}

        {/* --- NỘI DUNG TAB "CHUNG" --- */}
        {activeTab === 'Chung' && (
          <CForm className="p-3">
            <h6 className="text-uppercase text-body-secondary">THÔNG TIN CHUNG</h6>
            <CRow className="mb-3">
              <CFormLabel htmlFor="name" className="col-sm-3 col-form-label text-end">Tên ca <span className="text-danger">*</span></CFormLabel>
              <CCol sm={9}><CFormInput type="text" id="name" name="name" value={formData.name} onChange={handleChange} /></CCol>
            </CRow>
            <CRow className="mb-3">
              <CFormLabel htmlFor="code" className="col-sm-3 col-form-label text-end">Mã ca <span className="text-danger">*</span></CFormLabel>
              <CCol sm={9}><CFormInput type="text" id="code" name="code" value={formData.code} onChange={handleChange} /></CCol>
            </CRow>

            <hr className="my-4" />

            <CRow className="mb-3 align-items-center">
              <CFormLabel htmlFor="startTime" className="col-sm-3 col-form-label text-end">Giờ bắt đầu ca <span className="text-danger">*</span></CFormLabel>
              <CCol sm={2}><CFormInput type="time" id="startTime" name="startTime" value={formData.startTime} onChange={handleChange} /></CCol>
              <CCol sm={7} className="d-flex align-items-center">
                <CFormCheck id="checkIn" label="Chấm vào" className="me-2" defaultChecked />
                <span className="me-2">Từ</span>
                <CFormInput type="time" name="checkInFrom" value={formData.checkInFrom} onChange={handleChange} style={{ width: '100px' }} />
                <span className="mx-2">Đến</span>
                <CFormInput type="time" name="checkInTo" value={formData.checkInTo} onChange={handleChange} style={{ width: '100px' }} />
              </CCol>
            </CRow>

            <CRow className="mb-3 align-items-center">
              <CFormLabel htmlFor="endTime" className="col-sm-3 col-form-label text-end">Giờ kết thúc ca <span className="text-danger">*</span></CFormLabel>
              <CCol sm={2}><CFormInput type="time" id="endTime" name="endTime" value={formData.endTime} onChange={handleChange} /></CCol>
              <CCol sm={7} className="d-flex align-items-center">
                <CFormCheck id="checkOut" label="Chấm ra" className="me-2" defaultChecked />
                <span className="me-2">Từ</span>
                <CFormInput type="time" name="checkOutFrom" value={formData.checkOutFrom} onChange={handleChange} style={{ width: '100px' }} />
                <span className="mx-2">Đến</span>
                <CFormInput type="time" name="checkOutTo" value={formData.checkOutTo} onChange={handleChange} style={{ width: '100px' }} />
              </CCol>
            </CRow>
            <CRow className="mb-3">
              <CCol sm={9} className="offset-sm-3">
                <CFormCheck id="isNightShift" name="isNightShift" label="Là ca đêm (tính công)" checked={formData.isNightShift} onChange={handleChange} />
              </CCol>
            </CRow>

            <hr className="my-4" />

            <h6 className="text-uppercase text-body-secondary">TÍNH CÔNG</h6>
            <CRow className="mb-3">
              <CCol sm={9} className="offset-sm-3">
                <CFormCheck id="isCountWork" name="isCountWork" label="Tách theo khung giờ làm việc" checked={formData.isCountWork} onChange={handleChange} />
              </CCol>
            </CRow>

            <CRow className="mb-3 align-items-center">
              <CFormLabel htmlFor="workHours" className="col-sm-3 col-form-label text-end">Giờ công</CFormLabel>
              <CCol sm={3}><CFormInput type="number" id="workHours" name="workHours" value={formData.workHours} onChange={handleChange} /></CCol>
              <CFormLabel htmlFor="workDays" className="col-sm-3 col-form-label text-end">Ngày công</CFormLabel>
              <CCol sm={3}><CFormInput type="number" id="workDays" name="workDays" value={formData.workDays} onChange={handleChange} /></CCol>
            </CRow>

            <h6 className="text-uppercase text-body-secondary mt-4">HỆ SỐ</h6>
            <CRow className="bg-body-tertiary p-3 rounded mb-3">
              <CCol md={12}>
                <div className="fw-bold mb-2">Hưởng lương</div>
                <CRow>
                  <CFormLabel htmlFor="heSo1" className="col-sm-2 col-form-label">Ngày thường</CFormLabel>
                  <CCol sm={2}><CFormInput type="number" id="heSo1" name="heSo1" defaultValue={1} /></CCol>
                  <CFormLabel htmlFor="heSo2" className="col-sm-2 col-form-label">Ngày nghỉ</CFormLabel>
                  <CCol sm={2}><CFormInput type="number" id="heSo2" name="heSo2" defaultValue={2} /></CCol>
                  <CFormLabel htmlFor="heSo3" className="col-sm-2 col-form-label">Ngày lễ</CFormLabel>
                  <CCol sm={2}><CFormInput type="number" id="heSo3" name="heSo3" defaultValue={3} /></CCol>
                </CRow>
                <div className="fw-bold mt-3 mb-2">Nghỉ bù</div>
                <CRow>
                  <CFormLabel htmlFor="nghiBu" className="col-sm-2 col-form-label">Ngày lễ</CFormLabel>
                  <CCol sm={2}><CFormInput type="number" id="nghiBu" name="nghiBu" defaultValue={0} /></CCol>
                </CRow>
              </CCol>
            </CRow>
            
            {/* 1. Logic cho Giờ Vào */}
            <CRow className="mb-2">
              <CCol sm={9} className="offset-sm-3">
                <CFormCheck 
                  id="deductNoCheckIn" 
                  name="deductNoCheckIn"
                  label="Nếu không có giờ vào thì bị trừ công" 
                  checked={formData.deductNoCheckIn}
                  onChange={handleChange}
                />
              </CCol>
            </CRow>
            
            {/* Chỉ hiện 2 ô nhập khi checkbox trên được chọn */}
            {formData.deductNoCheckIn && (
              <CRow className="mb-3">
                 <CCol sm={9} className="offset-sm-3">
                   <CRow>
                     <CCol sm={5} className="d-flex align-items-center">
                        <span className="me-3" style={{minWidth: '70px'}}>Giờ công</span>
                        <CFormInput 
                          type="number" 
                          name="deductNoCheckInHours" 
                          value={formData.deductNoCheckInHours} 
                          onChange={handleChange} 
                        />
                     </CCol>
                     <CCol sm={5} className="d-flex align-items-center offset-sm-1">
                        <span className="me-3" style={{minWidth: '70px'}}>Ngày công</span>
                        <CFormInput 
                          type="number" 
                          name="deductNoCheckInDays" 
                          value={formData.deductNoCheckInDays} 
                          onChange={handleChange} 
                        />
                     </CCol>
                   </CRow>
                 </CCol>
              </CRow>
            )}

            {/* 2. Logic cho Giờ Ra */}
            <CRow className="mb-2 mt-3">
              <CCol sm={9} className="offset-sm-3">
                <CFormCheck 
                  id="deductNoCheckOut" 
                  name="deductNoCheckOut"
                  label="Nếu không có giờ ra thì bị trừ công" 
                  checked={formData.deductNoCheckOut}
                  onChange={handleChange}
                />
              </CCol>
            </CRow>

             {/* Chỉ hiện 2 ô nhập khi checkbox trên được chọn */}
             {formData.deductNoCheckOut && (
              <CRow className="mb-3">
                 <CCol sm={9} className="offset-sm-3">
                   <CRow>
                     <CCol sm={5} className="d-flex align-items-center">
                        <span className="me-3" style={{minWidth: '70px'}}>Giờ công</span>
                        <CFormInput 
                          type="number" 
                          name="deductNoCheckOutHours" 
                          value={formData.deductNoCheckOutHours} 
                          onChange={handleChange} 
                        />
                     </CCol>
                     <CCol sm={5} className="d-flex align-items-center offset-sm-1">
                        <span className="me-3" style={{minWidth: '70px'}}>Ngày công</span>
                        <CFormInput 
                          type="number" 
                          name="deductNoCheckOutDays" 
                          value={formData.deductNoCheckOutDays} 
                          onChange={handleChange} 
                        />
                     </CCol>
                   </CRow>
                 </CCol>
              </CRow>
            )}
          </CForm>
        )}

        {activeTab === 'NangCao' && (
          <div className="p-3">
            <p>Nội dung cho thiết lập nâng cao sẽ ở đây...</p>
          </div>
        )}
      </CCardBody>
    </CCard>
  )
}

export default WorkShiftAddNew;









