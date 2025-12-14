
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
  CRow,
  CSpinner,
  CInputGroup,
  CInputGroupText
} from '@coreui/react'
import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom' 
import {
  cilArrowLeft,
  cilCalendar
} from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { leaveService } from '../../api/leaveService';

// =====================================================================
// 1. CSS TÙY CHỈNH
// =====================================================================
const AddLeaveRequestStyles = () => (
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
    .quick-reasons { margin-top: 8px; display: flex; gap: 8px; }
    .reason-tag { font-size: 0.8rem; padding: 2px 10px; border: 1px solid #f9b115; color: #f9b115; border-radius: 12px; background: #fff; cursor: pointer; transition: all 0.2s; }
    .reason-tag:hover { background: #fff4d9; }
    `}
  </style>
)

// =====================================================================
// 2. HEADER (Tự đổi tiêu đề Thêm/Sửa)
// =====================================================================
const AddHeader = ({ onBack, onSave, loading, isEditMode }) => (
  <div className="page-header">
    <div className="header-left">
      <button className="back-btn" onClick={onBack}>
        <CIcon icon={cilArrowLeft} size="lg" />
      </button>
      <h1 className="page-title">{isEditMode ? "Cập nhật đơn xin nghỉ" : "Thêm mới đơn xin nghỉ"}</h1>
    </div>
    <div className="header-right d-flex gap-2">
      <CButton variant="outline" onClick={onBack} disabled={loading}>Hủy</CButton>
      <CButton className="btn-orange" onClick={onSave} disabled={loading}>
        {loading ? <CSpinner size="sm" /> : 'Lưu dữ liệu'}
      </CButton>
    </div>
  </div>
)

// =====================================================================
// 3. MAIN FORM
// =====================================================================
const LeaveRequestAdd = () => {
  const navigate = useNavigate()
  const { id } = useParams(); 
  const isEditMode = !!id;    

  const [employees, setEmployees] = useState([])
  const [loading, setLoading] = useState(false) 
  const [dataLoading, setDataLoading] = useState(false) 

  const [formData, setFormData] = useState({
    employeeId: '',
    accountApproverId: '',
    startDate: '',
    endDate: '',
    leaveType: 'PAID',
    totalDays: 0,
    reason: '',
    status: 'PENDING'
  })

  // --- 1. Load danh sách nhân viên ---
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await leaveService.getAllEmployees();
        const list = res?.data?.employees || [];
        setEmployees(list);
        
        // Chỉ set mặc định nếu là Thêm mới (không có ID)
        if (!isEditMode && list.length > 0) {
            setFormData(prev => ({ ...prev, employeeId: list[0].employeeId }));
        }
      } catch (error) {
        console.error("Lỗi lấy danh sách nhân viên:", error);
      }
    };
    fetchEmployees();
  }, [isEditMode]);

  // --- 2. Load DỮ LIỆU CŨ (Nếu đang ở chế độ Sửa) ---
  useEffect(() => {
    if (isEditMode) {
        const fetchDetail = async () => {
            setDataLoading(true);
            try {
                // Gọi API lấy chi tiết đơn
                const res = await leaveService.getById(id);
                console.log("Dữ liệu cũ tải về:", res);

                // Điền dữ liệu vào form
                if (res) {
                    setFormData({
                        employeeId: res.employeeId,
                        accountApproverId: res.accountApproverId || '',
                        startDate: res.startDate,
                        endDate: res.endDate,
                        leaveType: res.leaveType,
                        totalDays: res.totalDays,
                        reason: res.reason,
                        status: res.status
                    });
                }
            } catch (error) {
                console.error("Lỗi lấy chi tiết:", error);
                alert("Không thể tải thông tin đơn này. Có thể đơn không tồn tại.");
            } finally {
                setDataLoading(false);
            }
        };
        fetchDetail();
    }
  }, [id, isEditMode]);

  // --- 3. Tự động tính số ngày ---
  useEffect(() => {
    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      
      if (!isNaN(start) && !isNaN(end) && end >= start) {
        start.setHours(0, 0, 0, 0);
        end.setHours(0, 0, 0, 0);
        
        const diffTime = Math.abs(end - start);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; 
        setFormData(prev => ({ ...prev, totalDays: diffDays }));
      } else {
        setFormData(prev => ({ ...prev, totalDays: 0 }));
      }
    }
  }, [formData.startDate, formData.endDate]);

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const addReason = (text) => {
    setFormData(prev => ({ ...prev, reason: text }))
  }

  // --- 4. XỬ LÝ LƯU (THÊM HOẶC CẬP NHẬT) ---
  const handleSave = async () => {
    if (!formData.employeeId || !formData.startDate || !formData.endDate || !formData.reason) {
      alert("Vui lòng nhập đầy đủ các thông tin bắt buộc (*)");
      return;
    }
    
    // Kiểm tra trùng
    if (formData.accountApproverId && parseInt(formData.employeeId) === parseInt(formData.accountApproverId)) {
        alert("Người duyệt không được trùng với người nộp!");
        return;
    }

    setLoading(true);
    try {
      const payload = {
        employeeId: parseInt(formData.employeeId),
        accountApproverId: formData.accountApproverId ? parseInt(formData.accountApproverId) : null,
        startDate: formData.startDate,
        endDate: formData.endDate,
        leaveType: formData.leaveType,
        totalDays: parseFloat(formData.totalDays),
        reason: formData.reason,
        status: formData.status
      };

      if (isEditMode) {
          console.log("Đang cập nhật đơn ID:", id);
          await leaveService.update(id, payload);
          alert("Đã cập nhật thành công!");
      } else {
          console.log("Đang tạo mới");
          await leaveService.create(payload);
          alert("Đã tạo mới thành công!");
      }
      
      navigate(-1); 
    } catch (error) {
      console.error("Lỗi khi lưu:", error);
      const serverMsg = error.response?.data?.message || "Lỗi không xác định";
      alert(`Không thể lưu. Lỗi server: ${serverMsg}`);
    } finally {
      setLoading(false);
    }
  }

  if (dataLoading) {
      return <div className="d-flex justify-content-center align-items-center vh-100"><CSpinner color="primary"/></div>;
  }

  return (
    <>
      <AddLeaveRequestStyles />
      <div className="page-container">
        {/* Truyền isEditMode để đổi tiêu đề */}
        <AddHeader onBack={() => navigate(-1)} onSave={handleSave} loading={loading} isEditMode={isEditMode} />

        <div style={{ padding: '0 1rem 2rem 1rem' }}>
          
          <CCard className="mb-4 border-0 shadow-sm">
            <CCardBody style={{ padding: '2rem' }}>
              <CForm>
                
                {/* HÀNG 1 */}
                <CRow className="mb-3">
                  <CCol md={6}>
                    <CFormLabel className="form-label-custom">
                      Người nộp đơn<span className="required-mark">*</span>
                    </CFormLabel>
                    <CFormSelect name="employeeId" value={formData.employeeId} onChange={handleChange} disabled={isEditMode}>
                      <option value="">-- Chọn nhân viên --</option>
                      {employees.map(emp => (
                        <option key={emp.employeeId} value={emp.employeeId}>
                           {emp.employeeCode} - {emp.fullName}
                        </option>
                      ))}
                    </CFormSelect>
                  </CCol>

                  <CCol md={6}>
                    <CFormLabel className="form-label-custom">
                      Người duyệt<span className="required-mark">*</span>
                    </CFormLabel>
                    <CFormSelect name="accountApproverId" value={formData.accountApproverId} onChange={handleChange}>
                      <option value="">-- Chọn người duyệt --</option>
                      {employees.map(emp => (
                        <option key={emp.employeeId} value={emp.employeeId}>
                           {emp.fullName}
                        </option>
                      ))}
                    </CFormSelect>
                  </CCol>
                </CRow>

                {/* HÀNG 2 */}
                <CRow className="mb-3">
                  <CCol md={6}>
                    <CFormLabel className="form-label-custom">
                      Từ ngày<span className="required-mark">*</span>
                    </CFormLabel>
                    <CInputGroup>
                       <CFormInput type="date" name="startDate" value={formData.startDate} onChange={handleChange} />
                       <CInputGroupText><CIcon icon={cilCalendar} /></CInputGroupText>
                    </CInputGroup>
                  </CCol>

                  <CCol md={6}>
                    <CFormLabel className="form-label-custom">
                      Đến ngày<span className="required-mark">*</span>
                    </CFormLabel>
                    <CInputGroup>
                       <CFormInput type="date" name="endDate" value={formData.endDate} onChange={handleChange} />
                       <CInputGroupText><CIcon icon={cilCalendar} /></CInputGroupText>
                    </CInputGroup>
                  </CCol>
                </CRow>

                {/* HÀNG 3 */}
                <CRow className="mb-3">
                  <CCol md={4}>
                    <CFormLabel className="form-label-custom">Loại nghỉ</CFormLabel>
                    <CFormSelect name="leaveType" value={formData.leaveType} onChange={handleChange}>
                      <option value="PAID">Nghỉ phép có lương</option>
                      <option value="UNPAID">Nghỉ không lương</option>
                    </CFormSelect>
                  </CCol>

                  <CCol md={4}>
                    <CFormLabel className="form-label-custom">Trạng thái</CFormLabel>
                    <CFormSelect name="status" value={formData.status} onChange={handleChange}>
                      <option value="PENDING">Chờ duyệt</option>
                      <option value="APPROVED">Đã duyệt</option>
                      <option value="REJECTED">Từ chối</option>
                    </CFormSelect>
                  </CCol>

                  <CCol md={4}>
                    <CFormLabel className="form-label-custom">Tổng số ngày</CFormLabel>
                    <CFormInput type="number" name="totalDays" value={formData.totalDays} readOnly className="form-control-readonly" />
                  </CCol>
                </CRow>

                {/* HÀNG 4 */}
                <CRow className="mb-3">
                   <CCol md={12}>
                    <CFormLabel className="form-label-custom">Lý do nghỉ<span className="required-mark">*</span></CFormLabel>
                    <CFormTextarea rows={3} name="reason" value={formData.reason} onChange={handleChange} placeholder="Nhập lý do chi tiết..."></CFormTextarea>
                    
                    <div className="quick-reasons">
                      <span className="reason-tag" onClick={() => addReason('Nghỉ phép cá nhân')}>Việc cá nhân</span>
                      <span className="reason-tag" onClick={() => addReason('Nghỉ ốm')}>Nghỉ ốm</span>
                      <span className="reason-tag" onClick={() => addReason('Đi khám bệnh')}>Đi khám bệnh</span>
                    </div>
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

export default LeaveRequestAdd;