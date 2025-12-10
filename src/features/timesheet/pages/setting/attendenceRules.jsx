
import { cilPencil } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import {
  CButton,
  CCard,
  CCardBody,
  CCol,
  CForm,
  CFormCheck,
  CFormInput,
  CFormLabel,
  CFormSwitch,
  CNav,
  CNavItem,
  CNavLink,
  CRow
} from '@coreui/react'
import { useState } from 'react'
import { NavLink } from 'react-router-dom'

const AttendanceRules = () => {
  const [activeTab, setActiveTab] = useState('Chung')

  // 1. DỮ LIỆU MẶC ĐỊNH (CONST) - Bao gồm tất cả các trường
  const defaultValues = {
    // --- 1. Cho phép nhân viên ---
    allowRegisterShift: false,
    allowViewDaily: true,
    allowViewTime: true,
    allowAppCheck: false,

    // --- 2. Các thiết lập chung ---
    remoteWork: 'no',
    locationBased: 'no',
    twoTimesheets: 'no',
    advancePayment: 'no',
    
    // --- 3. Tự động cập nhật ---
    autoUpdate: 'no',

    // --- 4. Công tác ---
    businessTrip: 'request',

    // --- 5. Không đủ ca ---
    incompleteShift: 'half',

    // --- 6. Ngày lễ ---
    holidayWorkCoef: 'real_time', // Mặc định theo ảnh là cái thứ 3
    holidayOff: 'salary_coef',

    // --- 7. Thông báo chấm công (App) - Radio & Số phút ---
    notifyInStart: 'start',      // 'start' hoặc 'before'
    notifyInStartMinutes: 0,     // Số phút

    notifyOutMid: 'start',       // 'start' hoặc 'after'
    notifyOutMidMinutes: 0,

    notifyInMid: 'start',        // 'start' hoặc 'before'
    notifyInMidMinutes: 0,

    notifyOutEnd: 'start',       // 'start' hoặc 'after'
    notifyOutEndMinutes: 0,
    
    // --- 8. Múi giờ ---
    timezone: 'keep',

    // --- 9. MỚI: Thông báo chưa chấm công ---
    notifyMissing: 'no',
    notifyMethodApp: true,
    notifyMethodEmail: false,
    notifyReceiverEmp: true,
    notifyReceiverMgr: false,

    // --- 10. MỚI: Tính công linh hoạt ---
    flexibleWork: 'no',
    flexibleTarget: 'company', 
    flexibleStandardType: 'day', 
    flexibleStandardHours: 8,
    flexibleUnderTime: 'real', // Mặc định theo ảnh: Chỉ tính công thực tế
    flexibleOverTime: 'no_calc', // Mặc định theo ảnh: Không tính công vượt
    flexibleLateEarly: 'setting', // Mặc định theo ảnh: Vẫn tính đi muộn
  };

  // 2. STATE QUẢN LÝ DỮ LIỆU
  const [formData, setFormData] = useState(defaultValues);
  const [editing, setEditing] = useState(false);
  const [originalData, setOriginalData] = useState(null); // State backup để hoàn tác

  // 3. XỬ LÝ CHANGE INPUT
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // 4. LOGIC CÁC NÚT BẤM
  
  // Nút Sửa: Backup dữ liệu + Bật chế độ sửa
  const handleStartEdit = () => {
    setOriginalData({ ...formData });
    setEditing(true);
  };

  // Nút Hủy: Hoàn tác dữ liệu + Tắt chế độ sửa
  const handleCancel = () => {
    if (originalData) {
      setFormData(originalData);
    }
    setOriginalData(null);
    setEditing(false);
  };

  // Nút Lưu: Giữ nguyên dữ liệu mới + Tắt chế độ sửa
  const handleSave = () => {
    console.log("Dữ liệu đã lưu:", formData);
    // Gọi API save tại đây
    setOriginalData(null);
    setEditing(false);
  };

  // Nút Lấy lại mặc định: Reset về defaultValues
  const handleResetDefault = () => {
    if (window.confirm("Bạn có chắc chắn muốn quay về thiết lập mặc định?")) {
      setFormData(defaultValues);
    }
  };

  // Logic kiểm tra điều kiện enable cho các phần con
  const isNotifyMissingEnabled = editing && formData.notifyMissing === 'yes';
  const isFlexibleEnabled = editing && formData.flexibleWork === 'yes';

  return (
    <div className="p-3">
      {/* HEADER VÀ NÚT GỢI Ý */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="mb-0 fw-bold">Quy định chấm công</h4>
        <CButton color="white" style={{ border: '1px solid #f9b115', color: '#f9b115' }}>
          + Gợi ý hình thức chấm công
        </CButton>
      </div>

      <CCard>
        <CCardBody>
          {/* THANH TAB NAVIGATION */}
          <CNav variant="tabs" className="mb-4">
            {[
              { label: 'Chung', path: '/timesheet/attendanceRules' },
              { label: 'Số công chuẩn', path: '/timesheet/attendanceRules/standardwork' },
              { label: 'Tùy chỉnh bảng công', path: '/timesheet/attendanceRules/custom' },
              { label: 'Chấm công trên ứng dụng', path: '/timesheet/attendanceRules/app' },
            ].map((tab) => (
              <CNavItem key={tab.label}>
                <CNavLink
                  as={NavLink}
                  to={tab.path}
                  style={({ isActive }) => ({
                    color: isActive ? '#f9b115' : '#666',
                    borderBottom: isActive ? '2px solid #f9b115' : 'none',
                    fontWeight: isActive ? 'bold' : 'normal',
                  })}
                >
                  {tab.label}
                </CNavLink>
              </CNavItem>
            ))}
          </CNav>

          {/* NỘI DUNG TAB "CHUNG" */}
          {activeTab === 'Chung' && (
            <CForm>
              {/* Dòng tiêu đề section 1 */}
              <div
                className="d-flex justify-content-between align-items-center mb-3 bg-light p-2 rounded"
                style={{ position: 'sticky', top: 0, zIndex: 10 }}
              >
                <span className="fw-bold text-secondary" style={{ fontSize: '0.85rem' }}>
                  Thiết lập chung các quy định chấm công trong công ty
                </span>
                <div>
                  {!editing ? (
                    <>
                      <CButton
                        color="light"
                        size="sm"
                        className="me-2 text-secondary border"
                        onClick={handleResetDefault}
                      >
                        Lấy lại mặc định
                      </CButton>
                      <CButton
                        color="warning"
                        size="sm"
                        className="text-white"
                        onClick={handleStartEdit}
                      >
                        <CIcon icon={cilPencil} size="sm" className="me-1" /> Sửa
                      </CButton>
                    </>
                  ) : (
                    <>
                      <CButton
                        color="danger"
                        size="sm"
                        className="me-2 text-white"
                        onClick={handleCancel}
                      >
                        Hủy
                      </CButton>
                      <CButton
                        color="warning"
                        size="sm"
                        className="text-white"
                        onClick={handleSave}
                      >
                        Lưu
                      </CButton>
                    </>
                  )}
                </div>
              </div>

              {/* 1. Cho phép nhân viên thực hiện các nghiệp vụ */}
              <div className="mb-4 border-bottom pb-3">
                <CFormLabel className="fw-bold mb-2">
                  <CIcon className="me-2 text-warning" size="sm" />
                  Cho phép nhân viên thực hiện các nghiệp vụ
                </CFormLabel>
                <div className="ms-4">
                  <CFormCheck 
                    disabled={!editing} 
                    name="allowRegisterShift"
                    checked={formData.allowRegisterShift} // Đã sửa: bind vào state
                    onChange={handleChange}
                    id="allow1" 
                    label="Đăng ký ca" 
                    className="mb-2" 
                  />
                  <CFormCheck 
                    disabled={!editing} 
                    name="allowViewDaily"
                    checked={formData.allowViewDaily} // Đã sửa: bind vào state
                    onChange={handleChange}
                    id="allow2" 
                    label="Theo dõi bảng chấm công chi tiết hàng ngày" 
                    className="mb-2" 
                  />
                  <CFormCheck 
                    disabled={!editing} 
                    name="allowViewTime"
                    checked={formData.allowViewTime} // Đã sửa: bind vào state
                    onChange={handleChange}
                    id="allow3" 
                    label={<span>Theo dõi thời gian làm việc trên bảng chấm công, lịch phân ca <span className="text-danger">(Danh sách đơn vị áp dụng [1])</span></span>} 
                    className="mb-2" 
                  />
                  <CFormCheck 
                    disabled={!editing} 
                    name="allowAppCheck"
                    checked={formData.allowAppCheck} // Đã sửa: bind vào state
                    onChange={handleChange}
                    id="allow4" 
                    label="Chấm công trên ứng dụng ngoài khung giờ chấm của ca" 
                    className="mb-2" 
                  />
                </div>
              </div>

              {/* Các Radio Groups đơn giản */}
              {[
                { label: 'Áp dụng hình thức làm việc từ xa', name: 'remoteWork' }, 
                { label: 'Phân ca, chấm công theo địa điểm làm việc', name: 'locationBased' }, 
                { label: 'Quản lý 2 bảng chấm công khác nhau trong cùng 1 tháng', name: 'twoTimesheets' }, 
                { label: 'Cho phép ứng công khi chưa hết tháng', name: 'advancePayment' }
              ].map((item) => (
                <div className="mb-4 border-bottom pb-3" key={item.name}>
                  <CRow>
                    <CCol md={4}><CFormLabel className="fw-bold">{item.label}</CFormLabel></CCol>
                    <CCol md={8}>
                      <div className="d-flex gap-4">
                        <CFormCheck 
                          disabled={!editing} 
                          type="radio" 
                          name={item.name} 
                          id={`${item.name}Yes`} 
                          label="Có" 
                          value="yes" 
                          checked={formData[item.name] === 'yes'} 
                          onChange={handleChange} 
                        />
                        <CFormCheck 
                          disabled={!editing} 
                          type="radio" 
                          name={item.name} 
                          id={`${item.name}No`} 
                          label="Không" 
                          value="no" 
                          checked={formData[item.name] === 'no'} 
                          onChange={handleChange} 
                        />
                      </div>
                    </CCol>
                  </CRow>
                </div>
              ))}

              {/* Tự động cập nhật dữ liệu */}
              <div className="mb-4 border-bottom pb-3">
                <CRow>
                  <CCol md={4}>
                    <CFormLabel className="fw-bold">
                      Tự động cập nhật dữ liệu bảng chấm công chi tiết{' '}
                      <span className="text-danger" style={{ fontSize: '0.8rem' }}>
                        Thiết lập chi tiết
                      </span>
                    </CFormLabel>
                  </CCol>
                  <CCol md={8}>
                    <div className="d-flex gap-4">
                      <CFormCheck
                        disabled={!editing}
                        type="radio"
                        name="autoUpdate"
                        id="autoUpdateYes"
                        label="Có"
                        value="yes"
                        checked={formData.autoUpdate === 'yes'}
                        onChange={handleChange}
                      />
                      <CFormCheck
                        disabled={!editing}
                        type="radio"
                        name="autoUpdate"
                        id="autoUpdateNo"
                        label="Không"
                        value="no"
                        checked={formData.autoUpdate === 'no'}
                        onChange={handleChange}
                      />
                    </div>
                  </CCol>
                </CRow>
                <div className="text-muted mt-1" style={{ fontSize: '0.8rem' }}>
                  Ghi chú: Bảng chấm công chi tiết sẽ được tự động cập nhật từ các dữ liệu chấm
                  công, phân ca, đơn từ... vào thời điểm được thiết lập
                </div>
              </div>

              {/* Căn cứ tính công đi công tác */}
              <div className="mb-4 border-bottom pb-3">
                <CFormLabel className="fw-bold mb-2">Căn cứ tính công đi công tác</CFormLabel>
                <div className="ms-4">
                  <CFormCheck
                    disabled={!editing}
                    type="radio"
                    name="businessTrip"
                    id="bt1"
                    label="Theo đơn đề nghị đi công tác"
                    value="request"
                    checked={formData.businessTrip === 'request'}
                    onChange={handleChange}
                    className="mb-2"
                  />
                  <CFormCheck
                    disabled={!editing}
                    type="radio"
                    name="businessTrip"
                    id="bt2"
                    label="Theo cả đơn và thời gian chấm công thực tế"
                    value="real"
                    checked={formData.businessTrip === 'real'}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Tính công khi thời gian làm việc chưa đủ một ca */}
              <div className="mb-4 border-bottom pb-3">
                <CFormLabel className="fw-bold mb-2">
                  Tính công khi thời gian làm việc chưa đủ một ca
                </CFormLabel>
                <div className="ms-4">
                  <div className="mb-3">
                    <CFormCheck
                      type="radio"
                      disabled={!editing}
                      name="incompleteShift"
                      id="is1"
                      label={<span className="fw-bold">Tính nửa công</span>}
                      value="half"
                      checked={formData.incompleteShift === 'half'}
                      onChange={handleChange}
                    />
                    <div className="text-muted ms-4" style={{ fontSize: '0.8rem' }}>
                      Ví dụ: Ca làm việc 8h, nhân viên nghỉ không lương 2h và đi làm 6h thì được
                      tính 0.5 công.
                    </div>
                  </div>
                  <div>
                    <CFormCheck
                      type="radio"
                      disabled={!editing}
                      name="incompleteShift"
                      id="is2"
                      label={<span className="fw-bold">Tính theo số giờ làm thực tế</span>}
                      value="real_time"
                      checked={formData.incompleteShift === 'real_time'}
                      onChange={handleChange}
                    />
                    <div className="text-muted ms-4" style={{ fontSize: '0.8rem' }}>
                      Ví dụ: Ca làm việc 8h, nhân viên nghỉ không lương 2h và đi làm 6h thì được
                      tính 0.75 công.
                    </div>
                  </div>
                </div>
              </div>

              {/* Tính công cho ngày lễ */}
              <div className="mb-4 border-bottom pb-3">
                <div className="d-flex align-items-center mb-2">
                  <span className="fw-bold me-3">Tính công cho ngày lễ</span>
                  <CFormSwitch disabled={!editing} label="Quy định riêng theo tính chất lao động" id="holidaySwitch" />
                </div>

                <div className="ms-4">
                  {/* Nhóm 1 */}
                  <strong style={{ fontSize: '0.9rem' }}>Ngày lễ có đi làm</strong>
                  <div className="ms-3 mb-3">
                    <CFormCheck
                      type="radio"
                      disabled={!editing}
                      name="holidayWorkCoef"
                      id="hw1"
                      label="Chỉ tính công đi làm ngày lễ theo hệ số"
                      value="salary_coef"
                      checked={formData.holidayWorkCoef === 'salary_coef'}
                      onChange={handleChange}
                      className="mb-1"
                    />
                    <CFormCheck
                      type="radio"
                      disabled={!editing}
                      name="holidayWorkCoef"
                      id="hw2"
                      label="Tính cả công nghỉ lễ nguyên lương và công đi làm ngày lễ theo hệ số"
                      value="leave_compensate"
                      checked={formData.holidayWorkCoef === 'leave_compensate'}
                      onChange={handleChange}
                      className="mb-1"
                    />
                    <CFormCheck
                      type="radio"
                      disabled={!editing}
                      name="holidayWorkCoef"
                      id="hw3"
                      label="Tính công nghỉ lễ theo thời gian thực tế nghỉ và công đi làm ngày lễ theo hệ số"
                      value="real_time"
                      checked={formData.holidayWorkCoef === 'real_time'}
                      onChange={handleChange}
                    />
                  </div>

                  {/* Nhóm 2 */}
                  <strong style={{ fontSize: '0.9rem' }}>Không đi làm ngày lễ</strong>
                  <div className="ms-3">
                    <CFormCheck
                      type="radio"
                      disabled={!editing}
                      name="holidayOff"
                      id="ho1"
                      label="Tính công nghỉ lễ nguyên lương"
                      value="salary_coef"
                      checked={formData.holidayOff === 'salary_coef'}
                      onChange={handleChange}
                      className="mb-1"
                    />
                    <CFormCheck
                      type="radio"
                      disabled={!editing}
                      name="holidayOff"
                      id="ho2"
                      label="Không tính công nghỉ lễ"
                      value="no_salary"
                      checked={formData.holidayOff === 'no_salary'}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>

              {/* Thông báo chấm công (App) */}
              <div className="mb-4 border-bottom pb-3">
                <CFormLabel className="fw-bold mb-2">
                  Thông báo cho nhân viên khi đến giờ chấm công trên ứng dụng
                </CFormLabel>
                <div className="ms-4">
                  {/* Dòng 1: Chấm vào đầu ca */}
                  <CRow className="mb-3">
                    <CCol md={3}>
                      <CFormCheck id="notify1" disabled={!editing} label="Chấm vào đầu ca:" defaultChecked />
                    </CCol>
                    <CCol md={9}>
                      <div className="d-flex align-items-center mb-2">
                        <CFormCheck
                          type="radio"
                          disabled={!editing}
                          name="notifyInStart"
                          id="nis1"
                          label="Giờ bắt đầu được phép chấm vào"
                          value="start"
                          checked={formData.notifyInStart === 'start'}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="d-flex align-items-center">
                        <CFormCheck
                          type="radio"
                          disabled={!editing}
                          name="notifyInStart"
                          id="nis2"
                          label="Trước giờ bắt đầu ca"
                          value="before"
                          checked={formData.notifyInStart === 'before'}
                          onChange={handleChange}
                          className="me-2"
                        />
                        <CFormInput 
                          type="number" 
                          name="notifyInStartMinutes"
                          value={formData.notifyInStartMinutes} // Đã sửa: bind vào state
                          onChange={handleChange}
                          disabled={!editing} 
                          size="sm" 
                          style={{ width: '60px' }} 
                        />
                        <span className="ms-2">phút</span>
                      </div>
                    </CCol>
                  </CRow>

                  {/* Dòng 2: Chấm ra giữa ca */}
                  <CRow className="mb-3">
                    <CCol md={3}>
                      <CFormCheck id="notify2" disabled={!editing} label="Chấm ra giữa ca:" defaultChecked />
                    </CCol>
                    <CCol md={9}>
                      <div className="d-flex align-items-center mb-2">
                        <CFormCheck
                          type="radio"
                          disabled={!editing}
                          name="notifyOutMid"
                          id="nom1"
                          label="Giờ bắt đầu được phép chấm ra"
                          value="start"
                          checked={formData.notifyOutMid === 'start'}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="d-flex align-items-center">
                        <CFormCheck
                          type="radio"
                          disabled={!editing}
                          name="notifyOutMid"
                          id="nom2"
                          label="Sau giờ bắt đầu nghỉ giữa ca"
                          value="after"
                          checked={formData.notifyOutMid === 'after'}
                          onChange={handleChange}
                          className="me-2"
                        />
                        <CFormInput 
                          type="number" 
                          name="notifyOutMidMinutes"
                          value={formData.notifyOutMidMinutes} // Đã sửa: bind vào state
                          onChange={handleChange}
                          disabled={!editing} 
                          size="sm" 
                          style={{ width: '60px' }} 
                        />
                        <span className="ms-2">phút</span>
                      </div>
                    </CCol>
                  </CRow>

                  {/* Dòng 3: Chấm vào giữa ca */}
                  <CRow className="mb-3">
                    <CCol md={3}>
                      <CFormCheck id="notify3" disabled={!editing} label="Chấm vào giữa ca:" defaultChecked />
                    </CCol>
                    <CCol md={9}>
                      <div className="d-flex align-items-center mb-2">
                        <CFormCheck
                          type="radio"
                          disabled={!editing}
                          name="notifyInMid"
                          id="nim1"
                          label="Giờ bắt đầu được phép chấm vào"
                          value="start"
                          checked={formData.notifyInMid === 'start'}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="d-flex align-items-center">
                        <CFormCheck
                          type="radio"
                          disabled={!editing}
                          name="notifyInMid"
                          id="nim2"
                          label="Trước giờ kết thúc nghỉ giữa ca"
                          value="before"
                          checked={formData.notifyInMid === 'before'}
                          onChange={handleChange}
                          className="me-2"
                        />
                        <CFormInput 
                          type="number" 
                          name="notifyInMidMinutes"
                          value={formData.notifyInMidMinutes} // Đã sửa: bind vào state
                          onChange={handleChange}
                          disabled={!editing} 
                          size="sm" 
                          style={{ width: '60px' }} 
                        />
                        <span className="ms-2">phút</span>
                      </div>
                    </CCol>
                  </CRow>

                  {/* Dòng 4: Chấm ra cuối ca */}
                  <CRow className="mb-3">
                    <CCol md={3}>
                      <CFormCheck id="notify4" disabled={!editing} label="Chấm ra cuối ca:" defaultChecked />
                    </CCol>
                    <CCol md={9}>
                      <div className="d-flex align-items-center mb-2">
                        <CFormCheck
                          type="radio"
                          disabled={!editing}
                          name="notifyOutEnd"
                          id="noe1"
                          label="Giờ bắt đầu được phép chấm ra"
                          value="start"
                          checked={formData.notifyOutEnd === 'start'}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="d-flex align-items-center">
                        <CFormCheck
                          type="radio"
                          disabled={!editing}
                          name="notifyOutEnd"
                          id="noe2"
                          label="Sau giờ kết thúc ca"
                          value="after"
                          checked={formData.notifyOutEnd === 'after'}
                          onChange={handleChange}
                          className="me-2"
                        />
                        <CFormInput 
                          type="number" 
                          name="notifyOutEndMinutes"
                          value={formData.notifyOutEndMinutes} // Đã sửa: bind vào state
                          onChange={handleChange}
                          disabled={!editing} 
                          size="sm" 
                          style={{ width: '60px' }} 
                        />
                        <span className="ms-2">phút</span>
                      </div>
                    </CCol>
                  </CRow>
                </div>
              </div>

              {/* ========================================================================================== */}
              {/* THÔNG BÁO CHO NHÂN VIÊN CHƯA CHẤM CÔNG */}
              {/* ========================================================================================== */}
              <div className="mb-4 border-bottom pb-3">
                <CRow>
                  <CCol md={4}>
                    <CFormLabel className="fw-bold">Thông báo cho nhân viên chưa chấm công</CFormLabel>
                  </CCol>
                  <CCol md={8}>
                    <div className="d-flex gap-4 mb-3">
                      <CFormCheck type="radio" disabled={!editing} name="notifyMissing" id="nmYes" label="Có" value="yes" checked={formData.notifyMissing === 'yes'} onChange={handleChange} />
                      <CFormCheck type="radio" disabled={!editing} name="notifyMissing" id="nmNo" label="Không" value="no" checked={formData.notifyMissing === 'no'} onChange={handleChange} />
                    </div>
                  </CCol>
                    {/* Nội dung chi tiết - SÁT LỀ */}
                    <div className="ms-4" style={{ opacity: isNotifyMissingEnabled ? 1 : 0.5, transition: 'opacity 0.3s' }}>
                        <div className="mb-3">
                            <div className="fw-bold mb-2" style={{fontSize: '0.9rem'}}>Hình thức thông báo</div>
                            <div>
                                <CFormCheck 
                                    className="mb-2" id="nmMethodApp" name="notifyMethodApp" label="Qua ứng dụng" 
                                    checked={formData.notifyMethodApp} onChange={handleChange} disabled={!isNotifyMissingEnabled}
                                />
                                <CFormCheck 
                                    id="nmMethodEmail" name="notifyMethodEmail" label="Qua email" 
                                    checked={formData.notifyMethodEmail} onChange={handleChange} disabled={!isNotifyMissingEnabled}
                                />
                            </div>
                        </div>
                        <div>
                            <div className="fw-bold mb-2" style={{fontSize: '0.9rem'}}>Người nhận thông báo</div>
                            <div>
                                <CFormCheck 
                                    className="mb-2" id="nmRecEmp" name="notifyReceiverEmp" label="Nhân viên chưa chấm công" 
                                    checked={formData.notifyReceiverEmp} onChange={handleChange} disabled={!isNotifyMissingEnabled}
                                />
                                <CFormCheck 
                                    id="nmRecMgr" name="notifyReceiverMgr" label="Quản lý trực tiếp" 
                                    checked={formData.notifyReceiverMgr} onChange={handleChange} disabled={!isNotifyMissingEnabled}
                                />
                            </div>
                        </div>
                    </div>
                  
                </CRow>
              </div>

              {/* ========================================================================================== */}
              {/* ÁP DỤNG TÍNH CÔNG THEO GIỜ LINH HOẠT */}
              {/* ========================================================================================== */}
              <div className="mb-4 border-bottom pb-3">
                <CRow>
                  <CCol md={4}>
                    <CFormLabel className="fw-bold">Áp dụng tính công theo giờ linh hoạt</CFormLabel>
                  </CCol>
                  <CCol md={8}>
                    <div className="d-flex gap-4 mb-3">
                      <CFormCheck type="radio" disabled={!editing} name="flexibleWork" id="ftYes" label="Có" value="yes" checked={formData.flexibleWork === 'yes'} onChange={handleChange} />
                      <CFormCheck type="radio" disabled={!editing} name="flexibleWork" id="ftNo" label="Không" value="no" checked={formData.flexibleWork === 'no'} onChange={handleChange} />
                    </div>
                  </CCol>
                    {/* Nội dung chi tiết - SÁT LỀ */}
                    <div className="ms-4" style={{ opacity: isFlexibleEnabled ? 1 : 0.5, transition: 'opacity 0.3s' }}>
                        {/* Đối tượng áp dụng */}
                        <div className="mb-3">
                            <div className="fw-bold mb-2" style={{fontSize: '0.9rem'}}>Đối tượng áp dụng</div>
                            <div>
                                <CFormCheck type="radio" className="mb-1" name="flexibleTarget" id="ftComp" label="Toàn bộ công ty" value="company" checked={formData.flexibleTarget === 'company'} onChange={handleChange} disabled={!isFlexibleEnabled} />
                                <CFormCheck type="radio" className="mb-1" name="flexibleTarget" id="ftOrg" label="Theo cơ cấu tổ chức" value="org" checked={formData.flexibleTarget === 'org'} onChange={handleChange} disabled={!isFlexibleEnabled} />
                                <CFormCheck type="radio" className="mb-1" name="flexibleTarget" id="ftPos" label="Theo vị trí công việc" value="pos" checked={formData.flexibleTarget === 'pos'} onChange={handleChange} disabled={!isFlexibleEnabled} />
                                <CFormCheck type="radio" name="flexibleTarget" id="ftEmp" label="Theo nhân viên" value="emp" checked={formData.flexibleTarget === 'emp'} onChange={handleChange} disabled={!isFlexibleEnabled} />
                            </div>
                        </div>

                        {/* Số giờ làm việc tiêu chuẩn */}
                        <div className="mb-3">
                            <div className="fw-bold mb-2" style={{fontSize: '0.9rem'}}>Số giờ làm việc tiêu chuẩn</div>
                            <div>
                                <div className="d-flex align-items-center mb-2">
                                    <CFormCheck type="radio" name="flexibleStandardType" id="fstDay" label="Giờ/Ngày" value="day" checked={formData.flexibleStandardType === 'day'} onChange={handleChange} disabled={!isFlexibleEnabled} className="me-2" />
                                    <CFormInput type="number" size="sm" style={{width: '60px'}} value={formData.flexibleStandardHours} onChange={handleChange} name="flexibleStandardHours" disabled={!isFlexibleEnabled || formData.flexibleStandardType !== 'day'} />
                                    <span className="text-danger ms-2" style={{fontSize: '0.85rem'}}>Thiết lập riêng cho từng đối tượng</span>
                                </div>
                                <CFormCheck type="radio" name="flexibleStandardType" id="fstMonth" label="Giờ/Tháng" value="month" checked={formData.flexibleStandardType === 'month'} onChange={handleChange} disabled={!isFlexibleEnabled} />
                            </div>
                        </div>

                        {/* Quy định cách tính công */}
                        <div className="mb-3">
                            <div className="fw-bold mb-2" style={{fontSize: '0.9rem'}}>Quy định cách tính công</div>
                            
                            {/* Nếu không làm đủ số giờ */}
                            <CRow className="mb-2">
                                <CCol sm={4} className="text-secondary" style={{fontSize: '0.9rem'}}>Nếu không làm đủ số giờ làm việc tiêu chuẩn</CCol>
                                <CCol sm={8}>
                                    <CFormCheck type="radio" className="mb-1" name="flexibleUnderTime" id="fut1" label="Vẫn tính đủ công theo giờ tiêu chuẩn" value="standard" checked={formData.flexibleUnderTime === 'standard'} onChange={handleChange} disabled={!isFlexibleEnabled} />
                                    <CFormCheck type="radio" className="mb-1" name="flexibleUnderTime" id="fut2" label="Chỉ tính công theo số giờ làm việc thực tế" value="real" checked={formData.flexibleUnderTime === 'real'} onChange={handleChange} disabled={!isFlexibleEnabled} />
                                    <CFormCheck type="radio" name="flexibleUnderTime" id="fut3" label="Bù trừ giờ làm thêm vào giờ công đến khi đủ số giờ tiêu chuẩn" value="compensate" checked={formData.flexibleUnderTime === 'compensate'} onChange={handleChange} disabled={!isFlexibleEnabled} />
                                </CCol>
                            </CRow>

                            {/* Nếu vượt quá số giờ */}
                            <CRow>
                                <CCol sm={4} className="text-secondary" style={{fontSize: '0.9rem'}}>Nếu vượt quá số giờ làm việc tiêu chuẩn</CCol>
                                <CCol sm={8}>
                                    <CFormCheck type="radio" className="mb-1" name="flexibleOverTime" id="fot1" label="Không tính công vượt, chỉ tính bằng giờ công tiêu chuẩn" value="no_calc" checked={formData.flexibleOverTime === 'no_calc'} onChange={handleChange} disabled={!isFlexibleEnabled} />
                                    <CFormCheck type="radio" name="flexibleOverTime" id="fot2" label="Tính đúng công theo số giờ làm việc thực tế" value="real" checked={formData.flexibleOverTime === 'real'} onChange={handleChange} disabled={!isFlexibleEnabled} />
                                </CCol>
                            </CRow>
                        </div>

                        {/* Quy định đi muộn về sớm */}
                        <div>
                            <div className="fw-bold mb-2" style={{fontSize: '0.9rem'}}>Quy định đi muộn về sớm</div>
                            <div>
                                <CFormCheck type="radio" className="mb-1" name="flexibleLateEarly" id="fle1" label="Không tính đi muộn về sớm" value="no_calc" checked={formData.flexibleLateEarly === 'no_calc'} onChange={handleChange} disabled={!isFlexibleEnabled} />
                                <CFormCheck type="radio" name="flexibleLateEarly" id="fle2" label="Vẫn tính đi muộn, về sớm theo thiết lập của ca làm việc" value="setting" checked={formData.flexibleLateEarly === 'setting'} onChange={handleChange} disabled={!isFlexibleEnabled} />
                            </div>
                        </div>
                    </div>
                  
                </CRow>
              </div>

              {/* Phần cuối cùng: Múi giờ */}
              <div className="mb-4">
                <CFormLabel className="fw-bold mb-2">Cách ghi nhận giờ chấm công khi nhân viên làm việc theo múi giờ nước ngoài</CFormLabel>
                <div className="ms-4">
                  <CFormCheck type="radio" disabled={!editing} name="timezone" id="tz1" label="Giữ nguyên giờ chấm công tại múi giờ nước ngoài" checked={formData.timezone === 'keep'} onChange={handleChange} value="keep" />
                  <CFormCheck type="radio" disabled={!editing} name="timezone" id="tz2" label="Quy đổi giờ chấm công về múi giờ Việt Nam" checked={formData.timezone === 'convert'} onChange={handleChange} value="convert" />
                </div>
              </div>

            </CForm>
          )}
        </CCardBody>
      </CCard>
    </div>
  )
}

export default AttendanceRules