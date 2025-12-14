
import { cilPencil, cilSave, cilX } from '@coreui/icons'; // Thêm icon Save và X
import CIcon from '@coreui/icons-react';
import {
  CButton,
  CCard,
  CCardBody,
  CForm,
  CFormCheck,
  CFormInput,
  CFormSelect,
  CNav,
  CNavItem,
  CNavLink,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow
} from '@coreui/react';
import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

const StandardWorkDays = () => {
  const [activeTab, setActiveTab] = useState('Số công chuẩn')
  const navigate = useNavigate()

  // 1. Thêm state để quản lý trạng thái chỉnh sửa
  const [isEditing, setIsEditing] = useState(false);
  
  // State sao lưu dữ liệu gốc để dùng khi ấn "Hủy"
  const [originalData, setOriginalData] = useState(null);

  // State quản lý form
  const [formData, setFormData] = useState({
    // --- Cảnh báo phân ca ---
    warningOverLimit: 'no',
    warningType: 'remind',
    monthDefinition: 'calendar_month',
    monthDefFrom: 2,
    monthDefTo: 1,

    // --- Các phần cũ ---
    incompleteMonthMethod: 'standard_minus_unpaid', 
    applyFromDay: 2,
    applyToDay: 31,
    autoCalculate: 'no', 
    calcMethod: 'exclude_weekly',
    cycleType: 'month', 
    cycleFrom: 2,
    cycleTo: 1,
    updateDate: 1,
    manageBy: 'unit', 
  })

  // Dữ liệu giả cho bảng
  const tableData = [
    { id: 1, unit: 'SinhvienDungThu', standardDays: 24 },
  ]

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  // --- CÁC HÀM XỬ LÝ SỰ KIỆN ---

  // Bắt đầu chỉnh sửa
  const handleStartEdit = () => {
    setOriginalData({ ...formData }); // Lưu lại dữ liệu gốc
    setIsEditing(true);
  };

  // Lưu lại thay đổi
  const handleSave = () => {
    // Gọi API lưu dữ liệu ở đây...
    console.log("Dữ liệu đã lưu:", formData);
    setIsEditing(false);
    setOriginalData(null);
  };

  // Hủy bỏ thay đổi
  const handleCancel = () => {
    setFormData(originalData); // Khôi phục dữ liệu gốc
    setIsEditing(false);
    setOriginalData(null);
  };

  // --- LOGIC ĐIỀU KIỆN HIỂN THỊ (DISABLED) ---
  
  // 1. Logic cho phần Cảnh báo phân ca
  // Chỉ enable các phần con khi: Đang sửa VÀ chọn "Có"
  const isWarningDetailEnabled = isEditing && formData.warningOverLimit === 'yes';

  // 2. Logic cho phần Tự động tính
  // Chỉ enable các phần con khi: Đang sửa VÀ chọn "Có"
  const isAutoCalcDetailEnabled = isEditing && formData.autoCalculate === 'yes';

  return (
    <div className="p-3">
      {/* HEADER */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="mb-0 fw-bold">Quy định chấm công</h4>
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
                  end
                  active={tab.label === 'Số công chuẩn'}
                  style={({ isActive }) => ({
                    color: isActive || tab.label === 'Số công chuẩn' ? '#f9b115' : '#666',
                    borderBottom: isActive || tab.label === 'Số công chuẩn' ? '2px solid #f9b115' : 'none',
                    fontWeight: isActive || tab.label === 'Số công chuẩn' ? 'bold' : 'normal',
                  })}
                >
                  {tab.label}
                </CNavLink>
              </CNavItem>
            ))}
          </CNav>

          {/* NỘI DUNG TAB "SỐ CÔNG CHUẨN" */}
          <CForm>
            {/* Phần mô tả và nút Sửa/Lưu/Hủy */}
            <div className="d-flex justify-content-between align-items-start mb-4">
              <p className="text-muted mb-0" style={{ fontSize: '0.9rem' }}>
                Thiết lập số công chuẩn hàng tháng nếu tính công theo công chuẩn cố định: Tổng công hưởng lương = Số công chuẩn - Số ngày nghỉ không lương
              </p>
              
              {/* Logic đổi nút Sửa thành Lưu/Hủy */}
              <div>
                {!isEditing ? (
                  <CButton color="warning" size="sm" className="text-white" onClick={handleStartEdit}>
                    <CIcon icon={cilPencil} size="sm" className="me-1" /> Sửa
                  </CButton>
                ) : (
                  <div className="d-flex gap-2">
                    <CButton color="danger" size="sm" className="text-white" onClick={handleCancel}>
                      <CIcon icon={cilX} size="sm" className="me-1" /> Hủy
                    </CButton>
                    <CButton color="warning" size="sm" className="text-white" onClick={handleSave}>
                      <CIcon icon={cilSave} size="sm" className="me-1" /> Lưu
                    </CButton>
                  </div>
                )}
              </div>
            </div>

            {/* 1. Cảnh báo phân ca */}
            <div className="mb-4 border-bottom pb-4">
               {/* Dòng tiêu đề và Radio Có/Không */}
               <div className="d-flex align-items-center mb-3">
                  <span className="fw-bold me-3" style={{ fontSize: '0.9rem' }}>{'>'} Cảnh báo khi phân ca quá số công chuẩn của tháng</span>
                  <div className="d-flex gap-3">
                      {/* Radio tổng luôn enabled khi đang Edit, disabled khi xem */}
                      <CFormCheck 
                        type="radio" name="warningOverLimit" id="warnYes" label="Có" value="yes" 
                        checked={formData.warningOverLimit === 'yes'} onChange={handleChange} 
                        disabled={!isEditing}
                      />
                      <CFormCheck 
                        type="radio" name="warningOverLimit" id="warnNo" label="Không" value="no" 
                        checked={formData.warningOverLimit === 'no'} onChange={handleChange} 
                        disabled={!isEditing}
                      />
                  </div>
               </div>

               {/* Phần chi tiết (Hiển thị khi chọn Có) */}
               {formData.warningOverLimit === 'yes' && (
                 <div className="ms-4 ps-3 border-start" style={{ opacity: isWarningDetailEnabled ? 1 : 0.6 }}>
                    {/* Hình thức cảnh báo */}
                    <div className="mb-3">
                        <div className="fw-bold mb-2" style={{ fontSize: '0.9rem' }}>Hình thức cảnh báo</div>
                        <div className="ms-3">
                            <CFormCheck 
                              type="radio" className="mb-2" name="warningType" id="wt1" 
                              label="Chỉ nhắc nhở, vẫn cho lưu" value="remind" 
                              checked={formData.warningType === 'remind'} onChange={handleChange}
                              disabled={!isWarningDetailEnabled} // Logic disabled chi tiết
                            />
                            <CFormCheck 
                              type="radio" name="warningType" id="wt2" 
                              label="Chặn không cho lưu" value="block" 
                              checked={formData.warningType === 'block'} onChange={handleChange} 
                              disabled={!isWarningDetailEnabled}
                            />
                        </div>
                    </div>

                    {/* Thời gian của 1 tháng */}
                    <div>
                        <div className="fw-bold mb-2" style={{ fontSize: '0.9rem' }}>Thời gian của 1 tháng được hiểu là</div>
                        <div className="ms-3">
                            <CFormCheck 
                              type="radio" className="mb-2" name="monthDefinition" id="md1" 
                              label="Từ ngày mùng 1 đến ngày cuối cùng của tháng" value="calendar_month" 
                              checked={formData.monthDefinition === 'calendar_month'} onChange={handleChange} 
                              disabled={!isWarningDetailEnabled}
                            />
                            
                            <div className="d-flex align-items-center">
                                <CFormCheck 
                                  type="radio" name="monthDefinition" id="md2" 
                                  label="Từ ngày" value="custom" 
                                  checked={formData.monthDefinition === 'custom'} onChange={handleChange} 
                                  className="me-2"
                                  disabled={!isWarningDetailEnabled}
                                />
                                <CFormInput 
                                  type="number" size="sm" style={{width: '60px', backgroundColor: !isWarningDetailEnabled || formData.monthDefinition !== 'custom' ? '#e9ecef' : '#fff'}} 
                                  value={formData.monthDefFrom} 
                                  onChange={(e) => setFormData({...formData, monthDefFrom: e.target.value})} 
                                  disabled={!isWarningDetailEnabled || formData.monthDefinition !== 'custom'}
                                />
                                <span className="mx-2">tháng này đến ngày</span>
                                <CFormInput 
                                  type="number" size="sm" style={{width: '60px', backgroundColor: !isWarningDetailEnabled || formData.monthDefinition !== 'custom' ? '#e9ecef' : '#fff'}} 
                                  value={formData.monthDefTo} 
                                  onChange={(e) => setFormData({...formData, monthDefTo: e.target.value})} 
                                  disabled={!isWarningDetailEnabled || formData.monthDefinition !== 'custom'}
                                />
                                <span className="ms-2">tháng sau</span>
                            </div>
                        </div>
                    </div>
                 </div>
               )}
            </div>

            {/* 2. Cách tính công cho nhân viên không làm đủ tháng */}
            <div className="mb-4 border-bottom pb-4">
              <div className="fw-bold mb-2" style={{ fontSize: '0.9rem' }}>{'>'} Cách tính công cho nhân viên không làm đủ tháng</div>
              <div className="ms-4">
                  <div className="mb-2">
                    <CFormCheck 
                        type="radio" name="incompleteMonthMethod" id="imm1" 
                        label="Bằng số công chuẩn - số ngày nghỉ không lương (giống nhân viên làm đủ tháng)" 
                        value="standard_minus_unpaid" 
                        checked={formData.incompleteMonthMethod === 'standard_minus_unpaid'} onChange={handleChange} 
                        disabled={!isEditing}
                    />
                  </div>
                  <div className="mb-3">
                    <CFormCheck 
                        type="radio" name="incompleteMonthMethod" id="imm2" 
                        label="Bằng số công làm việc thực tế" value="actual_work" 
                        checked={formData.incompleteMonthMethod === 'actual_work'} onChange={handleChange} 
                        disabled={!isEditing}
                    />
                  </div>

                  {/* Input group lồng nhau */}
                  <div className="d-flex align-items-center flex-wrap gap-2 bg-light p-2 rounded" style={{fontSize: '0.9rem'}}>
                      <span>Áp dụng cho các nhân viên: Tiếp nhận từ ngày</span>
                      <CFormInput 
                        type="number" size="sm" style={{width: '60px'}} 
                        value={formData.applyFromDay} 
                        onChange={(e) => setFormData({...formData, applyFromDay: e.target.value})} 
                        disabled={!isEditing}
                      />
                      <span>trở về sau</span>
                  </div>
                  <div className="d-flex align-items-center flex-wrap gap-2 bg-light p-2 rounded mt-2" style={{fontSize: '0.9rem'}}>
                      <span style={{width: '215px', textAlign: 'right'}}>Nghỉ việc trước ngày</span>
                      <CFormInput 
                        type="number" size="sm" style={{width: '60px'}} 
                        value={formData.applyToDay} 
                        onChange={(e) => setFormData({...formData, applyToDay: e.target.value})} 
                        disabled={!isEditing}
                      />
                      <span>trở về trước</span>
                  </div>
              </div>
            </div>

            {/* 3. Bảng chi tiết số công chuẩn */}
            <div className="mb-4">
                <div className="fw-bold mb-3" style={{ fontSize: '0.9rem' }}>{'>'} Bảng chi tiết số công chuẩn</div>
                
                <div className="ms-4 mb-4 bg-light p-3 rounded">
                    {/* Tự động tính */}
                    <div className="d-flex align-items-center mb-3">
                        <span className="me-3 fw-bold" style={{fontSize: '0.9rem'}}>Tự động tính số công chuẩn</span>
                        <div className="d-flex gap-3">
                            <CFormCheck 
                              type="radio" name="autoCalculate" id="autoYes" label="Có" value="yes" 
                              checked={formData.autoCalculate === 'yes'} onChange={handleChange} 
                              disabled={!isEditing}
                            />
                            <CFormCheck 
                              type="radio" name="autoCalculate" id="autoNo" label="Không" value="no" 
                              checked={formData.autoCalculate === 'no'} onChange={handleChange} 
                              disabled={!isEditing}
                            />
                        </div>
                    </div>

                    {/* CÁC PHẦN CON CỦA TỰ ĐỘNG TÍNH */}
                    <div style={{ opacity: isAutoCalcDetailEnabled ? 1 : 0.6 }}>
                        {/* Cách tính */}
                        <div className="d-flex align-items-center mb-3">
                              <ul className="mb-0 ps-3">
                                <li style={{fontSize: '0.9rem'}}>
                                    <span className="fw-bold me-2">Cách tính:</span> 
                                    Bằng tổng số ngày của tháng loại trừ các ngày 
                                </li>
                              </ul>
                              <CFormSelect 
                                size="sm" style={{width: '150px', marginLeft: '10px'}} 
                                value={formData.calcMethod} onChange={handleChange} name="calcMethod"
                                disabled={!isAutoCalcDetailEnabled}
                              >
                                <option value="exclude_weekly">Nghỉ tuần</option>
                                <option value="exclude_holiday">Nghỉ lễ</option>
                              </CFormSelect>
                        </div>

                        {/* Chu kỳ tính */}
                        <div className="d-flex align-items-start mb-3">
                              <ul className="mb-0 ps-3">
                                <li style={{fontSize: '0.9rem'}}>
                                    <span className="fw-bold me-2">Chu kỳ tính:</span> 
                                </li>
                              </ul>
                              <div className="ms-2">
                                <div className="mb-2">
                                    <CFormCheck 
                                        type="radio" name="cycleType" id="cycle1" 
                                        label="Từ ngày mùng 1 đến ngày cuối cùng của tháng" value="month" 
                                        checked={formData.cycleType === 'month'} onChange={handleChange} 
                                        disabled={!isAutoCalcDetailEnabled}
                                    />
                                </div>
                                <div className="d-flex align-items-center">
                                    <CFormCheck 
                                        type="radio" name="cycleType" id="cycle2" 
                                        label="Từ ngày" value="custom" 
                                        checked={formData.cycleType === 'custom'} onChange={handleChange} 
                                        className="me-2"
                                        disabled={!isAutoCalcDetailEnabled}
                                    />
                                    <CFormInput 
                                      type="number" size="sm" style={{width: '50px'}} 
                                      value={formData.cycleFrom} onChange={(e) => setFormData({...formData, cycleFrom: e.target.value})} 
                                      disabled={!isAutoCalcDetailEnabled || formData.cycleType !== 'custom'}
                                    />
                                    <span className="mx-2">tháng trước đến ngày</span>
                                    <CFormInput 
                                      type="number" size="sm" style={{width: '50px'}} 
                                      value={formData.cycleTo} onChange={(e) => setFormData({...formData, cycleTo: e.target.value})} 
                                      disabled={!isAutoCalcDetailEnabled || formData.cycleType !== 'custom'}
                                    />
                                    <span className="ms-2">tháng sau</span>
                                </div>
                              </div>
                        </div>

                        {/* Thời điểm cập nhật */}
                        <div className="d-flex align-items-center mb-1">
                              <ul className="mb-0 ps-3">
                                <li style={{fontSize: '0.9rem'}}>
                                    <span className="fw-bold me-2">Thời điểm cập nhật công chuẩn:</span> Ngày
                                </li>
                              </ul>
                              <CFormInput 
                                type="number" size="sm" style={{width: '50px', marginLeft: '10px', marginRight: '10px'}} 
                                value={formData.updateDate} onChange={(e) => setFormData({...formData, updateDate: e.target.value})} 
                                disabled={!isAutoCalcDetailEnabled}
                              />
                              <span>hàng tháng</span>
                        </div>
                        <div className="text-muted ms-4 ps-3 mb-3" style={{fontSize: '0.8rem'}}>
                            Ví dụ: Vào ngày 1, chương trình sẽ tự động tính và cập nhật lại số công chuẩn trong kỳ 01/11/2020 - 30/11/2020
                        </div>
                    </div>
                </div>

                {/* Quản lý theo */}
                <div className="ms-4 mb-3">
                    <span className="fw-bold me-3" style={{fontSize: '0.9rem'}}>Quản lý theo</span>
                    <div className="d-inline-flex gap-3">
                        <CFormCheck 
                          type="radio" name="manageBy" id="manageUnit" label="Theo đơn vị" value="unit" 
                          checked={formData.manageBy === 'unit'} onChange={handleChange} 
                          disabled={!isEditing}
                        />
                        <CFormCheck 
                          type="radio" name="manageBy" id="managePos" label="Theo vị trí công việc" value="position" 
                          checked={formData.manageBy === 'position'} onChange={handleChange} 
                          disabled={!isEditing}
                        />
                        <CFormCheck 
                          type="radio" name="manageBy" id="manageArea" label="Theo khu vực làm việc" value="area" 
                          checked={formData.manageBy === 'area'} onChange={handleChange} 
                          disabled={!isEditing}
                        />
                    </div>
                </div>

                {/* Bảng dữ liệu */}
                <div className="ms-4 border rounded">
                    <CTable hover responsive className="mb-0">
                        <CTableHead color="light">
                            <CTableRow>
                                <CTableHeaderCell className="fw-bold">Đơn vị</CTableHeaderCell>
                                <CTableHeaderCell className="fw-bold">Số công chuẩn</CTableHeaderCell>
                            </CTableRow>
                        </CTableHead>
                        <CTableBody>
                            {tableData.map(row => (
                                <CTableRow key={row.id}>
                                    <CTableDataCell>{row.unit}</CTableDataCell>
                                    <CTableDataCell>{row.standardDays}</CTableDataCell>
                                </CTableRow>
                            ))}
                        </CTableBody>
                    </CTable>
                </div>

            </div>

          </CForm>
        </CCardBody>
      </CCard>
    </div>
  )
}

export default StandardWorkDays
