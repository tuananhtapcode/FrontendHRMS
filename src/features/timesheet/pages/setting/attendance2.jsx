
import { cilFindInPage, cilMenu, cilPlus, cilReload, cilTrash } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import {
  CButton,
  CCard,
  CCardBody,
  CForm,
  CFormCheck,
  CFormInput,
  CFormLabel,
  CFormSelect,
  CFormTextarea,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
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

// Dữ liệu gốc để dùng cho chức năng "Lấy lại mặc định"
const DEFAULT_DETAILED_COLUMNS = [
  { id: 1, name: 'Số công hưởng lương', desc: 'Tổng số công hưởng lương của ca' },
  { id: 2, name: 'Đi muộn (phút)', desc: 'Số phút đi muộn trong ca' },
  { id: 3, name: 'Về sớm (phút)', desc: 'Số phút về sớm trong ca' },
  { id: 4, name: 'Công ăn ca', desc: 'Số công ăn ca được tự động tính theo thiết lập tại Ca làm việc' },
  { id: 5, name: 'Công điều động', desc: 'Số công điều động được tự động tính theo thiết lập tại Ca làm việc: tính khi nhân viên được điều động đến làm việc (được phân ca, chấm công) tại địa điểm khác với đơn vị công tác chính' },
  { id: 6, name: 'Tổng thời gian làm thêm (giờ)', desc: 'Gồm tổng số giờ làm thêm hưởng lương, nghỉ bù và phân tách theo từng khung giờ' },
];

const DEFAULT_SUMMARY_COLUMNS = [
  { id: 's1', name: 'Mã nhân viên', desc: 'Mã nhân viên' },
  { id: 's2', name: 'Họ và tên', desc: 'Tên nhân viên' },
  { id: 's3', name: 'Đơn vị công tác', desc: 'Đơn vị' },
  { id: 's4', name: 'Vị trí công việc', desc: 'Vị trí' },
  { id: 's5', name: 'Số công chuẩn', desc: '- Nếu áp dụng công chuẩn cố định: Số công chuẩn được lấy từ Thiết lập\\Quy định chấm công\\Số công chuẩn. \n- Nếu áp dụng công chuẩn theo tháng: Số công chuẩn được tính bằng cách đếm tổng số công làm việc được phân trong tháng (không tính ngày nghỉ tuần)' },
  { id: 's6', name: 'Công ngày thường', desc: 'Tổng số công làm việc ngày thường' },
  { id: 's7', name: 'Công ngày nghỉ', desc: 'Tổng số công làm việc ngày nghỉ' },
  { id: 's8', name: 'Công ngày lễ', desc: 'Tổng số công làm việc ngày lễ' },
  { id: 's9', name: 'Làm thêm giờ hưởng lương', desc: 'Tổng giờ làm thêm hưởng lương (chưa nhân hệ số) phân tách theo ngày thường, ngày nghỉ, ngày lễ và từng khung giờ' },
  { id: 's10', name: 'Làm thêm giờ nghỉ bù', desc: 'Tổng giờ làm thêm nghỉ bù (chưa nhân hệ số) phân tách theo ngày thường, ngày nghỉ, ngày lễ và từng khung giờ' },
  { id: 's11', name: 'Nghỉ phép', desc: 'Tổng số công nghỉ phép' },
  { id: 's12', name: 'Nghỉ lễ', desc: 'Tổng số công nghỉ lễ' },
  { id: 's13', name: 'Công tác', desc: 'Tổng số công đi công tác', hasSetting: true },
  { id: 's14', name: 'Nghỉ không lương', desc: 'Tổng số công nghỉ không lương', hasSetting: true },
  { id: 's15', name: 'Tổng công đi làm thực tế', desc: 'Tổng số công đi làm thực tế ngày thường, ngày nghỉ, ngày lễ chưa nhân hệ số (không tính nghỉ, đi công tác)' },
  { id: 's16', name: 'Tổng công hưởng lương', desc: 'Tính theo tùy chọn khi tạo bảng: Bằng Số công chuẩn - Nghỉ không lương hoặc Cộng tổng công thực tế (Công ngày thường + Công ngày nghỉ + Công ngày lễ + Nghỉ lễ + Nghỉ phép + Đi công tác + Nghỉ có hưởng lương khác)' },
  { id: 's17', name: 'Công ăn ca', desc: 'Tổng số công ăn ca' },
  { id: 's18', name: 'Công điều động', desc: 'Tổng số công điều động' },
  { id: 's19', name: 'Tổng thời gian làm thêm hưởng lương', desc: 'Tổng số giờ làm thêm hưởng lương (đã nhân hệ số)' },
  { id: 's20', name: 'Tổng thời gian làm thêm nghỉ bù', desc: 'Tổng số giờ làm thêm nghỉ bù (đã nhân hệ số)' },
  { id: 's21', name: 'Tổng giờ làm thêm', desc: 'Tổng thời gian làm thêm hưởng lương (đã nhân hệ số) + Tổng thời gian làm thêm nghỉ bù (đã nhân hệ số)' },
  { id: 's22', name: 'Số ngày phép chưa sử dụng', desc: 'Số ngày phép chưa sử dụng' },
  { id: 's23', name: 'Đi muộn về sớm', desc: 'Đi muộn về sớm', hasSetting: true },
  { id: 's24', name: 'Số lần cập nhật công', desc: 'Số lần cập nhật công', hasSetting: true },
  { id: 's25', name: 'Số lần đi công tác', desc: 'Số lần đi công tác' },
  { id: 's26', name: 'Trạng thái', desc: 'Trạng thái' },
];

const TimesheetConfig = () => {
  const [activeTab, setActiveTab] = useState('Tùy chỉnh bảng công')
  const [subTab, setSubTab] = useState('detailed') // 'detailed' | 'summary'
  const navigate = useNavigate()

  // State quản lý hover và các modal
  const [hoveredRow, setHoveredRow] = useState(null)
  const [deleteModal, setDeleteModal] = useState({ visible: false, item: null })
  const [resetModal, setResetModal] = useState(false)
  
  // State quản lý modal Thêm cột
  const [addModal, setAddModal] = useState(false)
  const [newColumnData, setNewColumnData] = useState({
    name: '',
    dataType: 'number', // Mặc định là Số
    isAutoSum: false,
    autoSumField: '',
    valueFormula: '',
    desc: ''
  })

  // Dữ liệu Bảng chấm công
  const [detailedColumns, setDetailedColumns] = useState(DEFAULT_DETAILED_COLUMNS)
  const [summaryColumns, setSummaryColumns] = useState(DEFAULT_SUMMARY_COLUMNS)

  // Logic chọn cột hiển thị dựa trên tab
  const columns = subTab === 'detailed' ? detailedColumns : summaryColumns;

  // --- HÀM XỬ LÝ MỞ MODAL XÓA ---
  const handleOpenDelete = (item) => {
    setDeleteModal({ visible: true, item: item });
  }

  // --- HÀM XÁC NHẬN XÓA ---
  const handleConfirmDelete = () => {
    if (deleteModal.item) {
      if (subTab === 'summary') {
        setSummaryColumns(prev => prev.filter(col => col.id !== deleteModal.item.id));
      } else {
        setDetailedColumns(prev => prev.filter(col => col.id !== deleteModal.item.id));
      }
      setDeleteModal({ visible: false, item: null });
    }
  }

  // --- HÀM XÁC NHẬN RESET ---
  const handleConfirmReset = () => {
    // Trả lại dữ liệu ban đầu cho cả 2 bảng
    setDetailedColumns(DEFAULT_DETAILED_COLUMNS);
    setSummaryColumns(DEFAULT_SUMMARY_COLUMNS);
    setResetModal(false);
  }

  // --- HÀM XỬ LÝ KHI NHẬP FORM THÊM CỘT ---
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewColumnData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  }

  // --- HÀM LƯU CỘT MỚI ---
  const handleSaveNewColumn = () => {
    // Validate đơn giản: Tên cột không được để trống
    if (!newColumnData.name.trim()) {
      alert("Vui lòng nhập tên cột!");
      return;
    }

    const newColumn = {
      id: Date.now(), // Tạo ID ngẫu nhiên
      name: newColumnData.name,
      desc: newColumnData.desc || 'Chưa có mô tả', // Nếu không nhập thì để mặc định
      hasSetting: !!newColumnData.valueFormula, // Giả sử nếu có công thức thì có setting
      // Các trường khác có thể lưu thêm nếu cần thiết cho logic backend sau này
      dataType: newColumnData.dataType,
      isAutoSum: newColumnData.isAutoSum,
      valueFormula: newColumnData.valueFormula
    };

    if (subTab === 'summary') {
      setSummaryColumns(prev => [...prev, newColumn]);
    } else {
      setDetailedColumns(prev => [...prev, newColumn]);
    }

    // Reset và đóng modal
    setNewColumnData({
      name: '',
      dataType: 'number',
      isAutoSum: false,
      autoSumField: '',
      valueFormula: '',
      desc: ''
    });
    setAddModal(false);
  }

  return (
    <div style={{ height: 'calc(100vh - 0px)', display: 'flex', flexDirection: 'column', padding: '1rem' }}>
      {/* HEADER */}
      <div className="d-flex justify-content-between align-items-center mb-3" style={{ flexShrink: 0 }}>
        <div className="d-flex align-items-center">
          <h4 className="mb-0 fw-bold">Quy định chấm công</h4>
        </div>
      </div>

      <CCard style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
        <CCardBody style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0, padding: '1.5rem' }}>
          {/* TABS CHÍNH */}
          <CNav variant="tabs" className="mb-4" style={{ flexShrink: 0 }}>
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

          {/* SUB-TABS (Chi tiết / Tổng hợp) */}
          <div className="d-flex align-items-center mb-3 ps-1" style={{ flexShrink: 0 }}>
            <span
              className={`cursor-pointer ${subTab === 'detailed' ? 'text-warning fw-bold' : 'text-dark'}`}
              style={{ cursor: 'pointer' }}
              onClick={() => setSubTab('detailed')}
            >
              Bảng chấm công chi tiết
            </span>
            <span className="mx-3 text-secondary">|</span>
            <span
              className={`cursor-pointer ${subTab === 'summary' ? 'text-warning fw-bold' : 'text-dark'}`}
              style={{ cursor: 'pointer' }}
              onClick={() => setSubTab('summary')}
            >
              Bảng chấm công tổng hợp
            </span>
          </div>

          {/* MÔ TẢ & NÚT ACTION */}
          <div className="d-flex justify-content-between align-items-center mb-3 ps-1" style={{ flexShrink: 0 }}>
            <p className="text-muted mb-0 fst-italic" style={{ fontSize: '0.9rem' }}>
               {subTab === 'detailed' 
                ? 'Thiết lập cấu trúc bảng chấm công chi tiết cho toàn công ty' 
                : 'Thiết lập cấu trúc bảng chấm công tổng hợp cho toàn công ty'}
            </p>
            <div>
              {/* Nút Lấy lại mặc định: Mở Reset Modal */}
              <CButton 
                color="light" 
                size="sm" 
                className="me-2 border text-secondary"
                onClick={() => setResetModal(true)}
              >
                <CIcon icon={cilReload} className="me-1" /> Lấy lại mặc định
              </CButton>
              <CButton color="light" size="sm" className="border text-secondary">
                <CIcon icon={cilFindInPage} className="me-1" /> Xem trước
              </CButton>
            </div>
          </div>

          {/* BẢNG DỮ LIỆU - FULL HEIGHT */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
            <div className="border rounded" style={{ flex: 1, overflow: 'auto', display: 'flex', flexDirection: 'column' }}>
              <CTable hover className="mb-0" style={{ tableLayout: 'fixed', width: '100%' }}>
                <CTableHead style={{ position: 'sticky', top: 0, backgroundColor: '#f8f9fa', zIndex: 10 }}>
                  <CTableRow>
                    <CTableHeaderCell className="text-secondary bg-light border-bottom" style={{ width: '40%', padding: '14px 20px', fontWeight: '600' }}>
                      Tên cột
                    </CTableHeaderCell>
                    <CTableHeaderCell className="text-secondary bg-light border-bottom" style={{ padding: '14px 20px', fontWeight: '600' }}>
                      Mô tả
                    </CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {columns.map((col) => (
                    <CTableRow 
                      key={col.id}
                      onMouseEnter={() => setHoveredRow(col.id)}
                      onMouseLeave={() => setHoveredRow(null)}
                    >
                      <CTableDataCell style={{ padding: '14px 20px' }}>
                        <div className="d-flex align-items-center justify-content-between">
                          <div className="d-flex align-items-center">
                            {/* Icon kéo thả */}
                            <CIcon
                              icon={cilMenu}
                              className="text-secondary me-3"
                              style={{ cursor: 'grab', opacity: 0.5 }}
                            />
                            <span className="fw-bold" style={{ fontSize: '0.9rem' }}>
                              {col.name}
                            </span>
                          </div>
                          {/* Thiết lập cách tính */}
                          {col.hasSetting && (
                             <span 
                               className="text-warning fw-bold cursor-pointer" 
                               style={{ fontSize: '0.85rem' }}
                             >
                               Thiết lập cách tính &gt;
                             </span>
                           )}
                        </div>
                      </CTableDataCell>
                      <CTableDataCell style={{ fontSize: '0.9rem', verticalAlign: 'middle', padding: '14px 20px' }}>
                        <div className="d-flex justify-content-between align-items-start">
                           <span style={{ whiteSpace: 'pre-line' }}>{col.desc}</span>
                           {/* Icon thùng rác: Chỉ hiện khi Hover */}
                           <div style={{ 
                             opacity: hoveredRow === col.id ? 1 : 0, 
                             transition: 'opacity 0.2s',
                             pointerEvents: hoveredRow === col.id ? 'auto' : 'none' 
                           }}>
                             <CButton 
                                color="link" 
                                className="p-0 text-danger" 
                                onClick={() => handleOpenDelete(col)}
                                style={{ boxShadow: 'none' }}
                             >
                               <CIcon icon={cilTrash} size="lg" />
                             </CButton>
                           </div>
                        </div>
                      </CTableDataCell>
                    </CTableRow>
                  ))}
                </CTableBody>
              </CTable>
            </div>

            {/* NÚT THÊM CỘT - STICKY BOTTOM */}
            <div className="mt-3" style={{ flexShrink: 0 }}>
              <CButton 
                color="link" 
                className="text-danger text-decoration-none p-0 fw-bold"
                onClick={() => setAddModal(true)} // MỞ MODAL THÊM CỘT
              >
                <CIcon icon={cilPlus} className="me-1" /> Thêm cột
              </CButton>
            </div>
          </div>
        </CCardBody>
      </CCard>

      {/* MODAL THÊM CỘT (MỚI THÊM) */}
      <CModal 
        visible={addModal} 
        onClose={() => setAddModal(false)}
        alignment="center"
        size="lg"
      >
        <CModalHeader>
          <CModalTitle style={{ fontWeight: 'bold' }}>Thêm cột</CModalTitle>
        </CModalHeader>
        <CModalBody className="p-4">
          <CForm>
            {/* Tên cột */}
            <div className="mb-3 row">
              <CFormLabel className="col-sm-3 col-form-label fw-bold">
                Tên cột <span className="text-danger">*</span>
              </CFormLabel>
              <div className="col-sm-9">
                <CFormInput 
                  name="name"
                  value={newColumnData.name}
                  onChange={handleInputChange}
                  style={{ borderColor: '#e5e7eb' }}
                />
              </div>
            </div>

            {/* Kiểu dữ liệu */}
            <div className="mb-3 row">
              <CFormLabel className="col-sm-3 col-form-label fw-bold">
                Kiểu dữ liệu <span className="text-danger">*</span>
              </CFormLabel>
              <div className="col-sm-9">
                <CFormSelect 
                  name="dataType"
                  value={newColumnData.dataType}
                  onChange={handleInputChange}
                  className="mb-2"
                >
                  <option value="number">Số</option>
                  <option value="text">Văn bản</option>
                  <option value="date">Ngày tháng</option>
                </CFormSelect>
                
                {/* Checkbox Tự động cộng tổng */}
                <CFormCheck 
                  id="autoSumCheck" 
                  name="isAutoSum"
                  checked={newColumnData.isAutoSum}
                  onChange={handleInputChange}
                  label="Tự động cộng tổng từ bảng chấm công chi tiết"
                  className="mb-2"
                />

                {/* Select chọn trường để cộng - Disabled nếu không tick checkbox */}
                <CFormSelect 
                  name="autoSumField"
                  value={newColumnData.autoSumField}
                  onChange={handleInputChange}
                  disabled={!newColumnData.isAutoSum}
                  style={{ backgroundColor: !newColumnData.isAutoSum ? '#f3f4f6' : '#fff' }}
                >
                  <option value="">Chọn trường để cộng dữ liệu</option>
                  <option value="work_day">Công ngày thường</option>
                  <option value="overtime">Làm thêm giờ</option>
                </CFormSelect>
              </div>
            </div>

            {/* Giá trị (Công thức) */}
            <div className="mb-3 row">
              <CFormLabel className="col-sm-3 col-form-label fw-bold">
                Giá trị
              </CFormLabel>
              <div className="col-sm-9">
                <CFormTextarea
                  name="valueFormula"
                  value={newColumnData.valueFormula}
                  onChange={handleInputChange}
                  rows={3}
                  placeholder='Gõ "=" để nhập công thức'
                ></CFormTextarea>
              </div>
            </div>

            {/* Mô tả */}
            <div className="mb-3 row">
              <CFormLabel className="col-sm-3 col-form-label fw-bold">
                Mô tả
              </CFormLabel>
              <div className="col-sm-9">
                <CFormTextarea
                  name="desc"
                  value={newColumnData.desc}
                  onChange={handleInputChange}
                  rows={3}
                ></CFormTextarea>
              </div>
            </div>

          </CForm>
        </CModalBody>
        <CModalFooter className="border-top-0 bg-light">
          <CButton color="light" className="bg-white border" onClick={() => setAddModal(false)}>
            Hủy
          </CButton>
          <CButton 
            color="warning" 
            className="text-white fw-bold" 
            onClick={handleSaveNewColumn}
            style={{backgroundColor: '#ea580c', borderColor: '#ea580c'}} // Màu cam đậm giống ảnh
          >
            Lưu
          </CButton>
        </CModalFooter>
      </CModal>

      {/* MODAL XÁC NHẬN XÓA (CŨ) */}
      <CModal 
        visible={deleteModal.visible} 
        onClose={() => setDeleteModal({ visible: false, item: null })}
        alignment="center"
      >
        <CModalHeader>
          <CModalTitle style={{ fontWeight: 'bold' }}>Thông báo</CModalTitle>
        </CModalHeader>
        <CModalBody>
          Cột <strong>{deleteModal.item?.name}</strong> đã được sử dụng trong bảng chấm công <strong>Bảng chấm công tổng hợp 01/11/2025 - 30/11/2025 - SinhvienDungThu</strong> vì vậy sau khi xóa, nếu cập nhật lại các bảng này thì cột <strong>{deleteModal.item?.name}</strong> sẽ bị mất. Bạn có chắc chắn muốn thực hiện chức năng này không?
        </CModalBody>
        <CModalFooter className="border-top-0">
          <CButton color="light" onClick={() => setDeleteModal({ visible: false, item: null })}>
            Hủy
          </CButton>
          <CButton color="warning" className="text-white" onClick={handleConfirmDelete} style={{backgroundColor: '#f9b115', borderColor: '#f9b115'}}>
            Đồng ý
          </CButton>
        </CModalFooter>
      </CModal>

      {/* MODAL XÁC NHẬN RESET (CŨ) */}
      <CModal 
        visible={resetModal} 
        onClose={() => setResetModal(false)}
        alignment="center"
      >
        <CModalHeader>
          <CModalTitle style={{ fontWeight: 'bold' }}>Thông báo</CModalTitle>
        </CModalHeader>
        <CModalBody>
          Bạn có chắc chắn muốn lấy lại thiết lập mặc định không?
        </CModalBody>
        <CModalFooter className="border-top-0">
          <CButton color="light" onClick={() => setResetModal(false)}>
            Hủy
          </CButton>
          <CButton color="warning" className="text-white" onClick={handleConfirmReset} style={{backgroundColor: '#f9b115', borderColor: '#f9b115'}}>
            Đồng ý
          </CButton>
        </CModalFooter>
      </CModal>

    </div>
  )
}

export default TimesheetConfig