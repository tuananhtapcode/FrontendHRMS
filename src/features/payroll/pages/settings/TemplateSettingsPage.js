import {
  cilBold,
  cilChevronLeft,
  cilChevronRight,
  cilDescription,
  cilItalic,
  cilOptions,
  cilPencil,
  cilUnderline
} from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import {
  CButton,
  CButtonGroup,
  CCard,
  CCardBody,
  CCol,
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
  CRow,
  CTabContent,
  CTabPane,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow
} from '@coreui/react'
import { useState } from 'react'

// Import SCSS
import '../../scss/template-settings-page.scss'

// Dữ liệu Mock ban đầu
const INITIAL_DATA = [
    { 
        id: 1, 
        name: 'Email thông báo cho nhân viên khi HR gửi yêu cầu xác nhận lương', 
        updatedDate: '01/01/2025', updater: 'Nguyễn Văn A', desc: 'Mẫu mặc định', status: 'Active',
        subject: 'Đề nghị xác nhận lương #Kỳ lương',
        content: `
            <p><strong>Gửi anh/chị,</strong></p>
            <p>Kính đề nghị anh/chị kiểm tra và xác nhận phiếu lương <strong>#Kỳ lương</strong> qua trang MISA AMIS (<a href="#" style="color: #2eb85c">https://amisapp.misa.vn</a>)</p>
            <p>Thời hạn nhận phản hồi: <strong>#Thời hạn phản hồi</strong>.</p>
            <p>Sau thời hạn này, nếu anh/chị không xác nhận thì mặc định là đồng ý.</p>
            <p>Mọi thắc mắc vui lòng liên hệ với <strong>Thuận Nguyễn</strong> hoặc phản hồi trực tiếp trên phiếu lương.</p>
            <p>Trân trọng cảm ơn!</p>
            <br/>
            <div style="text-align: center;">
                <button style="background-color: #2eb85c; color: white; padding: 10px 20px; border: none; border-radius: 4px; font-weight: bold; cursor: pointer;">Xem chi tiết</button>
            </div>
            <br/>
            <hr/>
        `
    },
    { 
        id: 2, 
        name: 'Email thông báo cho nhân viên khi HR gửi phiếu lương qua mail', 
        updatedDate: '15/02/2025', updater: 'Trần Thị B', desc: '', status: 'Active',
        subject: 'Phiếu lương #Kỳ lương',
        content: '<p>Chào bạn,</p><p>Gửi bạn phiếu lương tháng này đính kèm bên dưới.</p>'
    },
    { id: 3, name: 'Email thông báo cho nhân viên khi HR sửa phiếu lương', updatedDate: '-', updater: '-', desc: '-', status: 'Active', subject: 'Cập nhật phiếu lương', content: '<p>Phiếu lương của bạn đã được cập nhật.</p>' },
    { id: 4, name: 'Email thông báo cho nhân viên khi HR phản hồi thắc mắc', updatedDate: '-', updater: '-', desc: '-', status: 'Active', subject: 'Phản hồi thắc mắc lương', content: '<p>Về thắc mắc của bạn...</p>' },
    { id: 5, name: 'Email thông báo cho nhân viên khi HR chi trả lương', updatedDate: '-', updater: '-', desc: '-', status: 'Active', subject: 'Thông báo chi trả lương', content: '<p>Công ty đã thực hiện chi trả lương...</p>' },
];

const TemplateSettingsPage = () => {
    const [activeTab, setActiveTab] = useState('email'); 
    
    // --- STATE DỮ LIỆU ---
    // Sử dụng state 'data' để quản lý danh sách, cho phép cập nhật lại khi sửa
    const [data, setData] = useState(INITIAL_DATA);
    
    // --- STATE MODAL ---
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDetailModal, setShowDetailModal] = useState(false); 
    
    // State lưu bản ghi đang được chọn để xem/sửa (Object copy)
    const [selectedTemplate, setSelectedTemplate] = useState(null);

    // --- HÀM XỬ LÝ CLICK ---
    
    // 1. Click nút bút chì -> Mở modal Sửa trực tiếp
    const handleEdit = (template, e) => {
        if(e) e.stopPropagation(); 
        // Clone object để sửa không ảnh hưởng trực tiếp đến bảng khi chưa lưu
        setSelectedTemplate({ ...template });
        setShowEditModal(true);
    };

    // 2. Click vào dòng -> Mở modal Xem chi tiết
    const handleRowClick = (template) => {
        setSelectedTemplate({ ...template });
        setShowDetailModal(true);
    };

    // 3. Chuyển từ Xem chi tiết -> Sửa
    const handleSwitchToEdit = () => {
        setShowDetailModal(false);
        setTimeout(() => setShowEditModal(true), 150);
    }

    // --- LOGIC CẬP NHẬT FORM (Binding 2 chiều) ---
    const handleInputChange = (field, value) => {
        setSelectedTemplate(prev => ({
            ...prev,
            [field]: value
        }));
    };

    // --- LOGIC LƯU DỮ LIỆU (SAVE) ---
    const handleSave = () => {
        // Tìm vị trí bản ghi cũ trong mảng
        const index = data.findIndex(item => item.id === selectedTemplate.id);
        
        if (index !== -1) {
            // Tạo mảng mới với dữ liệu đã cập nhật
            const newData = [...data];
            newData[index] = { 
                ...selectedTemplate,
                updatedDate: new Date().toLocaleDateString('en-GB'), // Cập nhật ngày sửa hiện tại
                updater: 'Current User' // Giả lập người sửa
            };
            
            // Cập nhật state data -> Giao diện tự động render lại
            setData(newData);
            console.log("Đã cập nhật bản ghi:", newData[index]);
        }
        
        setShowEditModal(false);
    }

    return (
        <div className="template-settings-page">
            {/* HEADER */}
            <div className="page-header mb-3">
                <h4 className="mb-0">Biểu mẫu</h4>
            </div>

            <CCard className="card-tabs border-0 shadow-sm">
                <CCardBody className="p-0">
                    {/* TABS NAVIGATION */}
                    <div className="border-bottom px-3 pt-2">
                        <CNav variant="tabs" className="border-bottom-0">
                            <CNavItem><CNavLink active={activeTab === 'email'} onClick={() => setActiveTab('email')} style={{cursor: 'pointer'}}>Mẫu email</CNavLink></CNavItem>
                            <CNavItem><CNavLink active={activeTab === 'print'} onClick={() => setActiveTab('print')} style={{cursor: 'pointer'}}>Mẫu in phiếu lương</CNavLink></CNavItem>
                            <CNavItem><CNavLink active={activeTab === 'export'} onClick={() => setActiveTab('export')} style={{cursor: 'pointer'}}>Mẫu xuất khẩu</CNavLink></CNavItem>
                        </CNav>
                    </div>

                    {/* TABS CONTENT */}
                    <div className="p-0">
                        <CTabContent>
                            <CTabPane role="tabpanel" visible={activeTab === 'email'}>
                                <div className="table-responsive">
                                    <CTable hover align="middle" className="mb-0 border-top-0 pointer-cursor-table">
                                        <CTableHead color="light">
                                            <CTableRow>
                                                <CTableHeaderCell style={{width: '35%', paddingLeft: '1.5rem'}}>Tên mẫu</CTableHeaderCell>
                                                <CTableHeaderCell style={{width: '15%'}}>Ngày cập nhật</CTableHeaderCell>
                                                <CTableHeaderCell style={{width: '15%'}}>Người cập nhật</CTableHeaderCell>
                                                <CTableHeaderCell style={{width: '15%'}}>Mô tả</CTableHeaderCell>
                                                <CTableHeaderCell style={{width: '12%'}}>Trạng thái</CTableHeaderCell>
                                                <CTableHeaderCell style={{width: '8%'}} className="text-center">Chức năng</CTableHeaderCell>
                                            </CTableRow>
                                        </CTableHead>
                                        <CTableBody>
                                            {data.map((item) => (
                                                <CTableRow key={item.id} onClick={() => handleRowClick(item)}>
                                                    <CTableDataCell style={{paddingLeft: '1.5rem'}} className="fw-semibold text-primary">{item.name}</CTableDataCell>
                                                    <CTableDataCell>{item.updatedDate}</CTableDataCell>
                                                    <CTableDataCell>{item.updater}</CTableDataCell>
                                                    <CTableDataCell>{item.desc}</CTableDataCell>
                                                    <CTableDataCell>
                                                        <div className={`d-flex align-items-center ${item.status === 'Active' ? 'text-success' : 'text-secondary'}`}>
                                                            <div className={`status-dot me-2 ${item.status === 'Active' ? 'bg-success' : 'bg-secondary'}`}></div> 
                                                            {item.status === 'Active' ? 'Đang sử dụng' : 'Ngừng sử dụng'}
                                                        </div>
                                                    </CTableDataCell>
                                                    <CTableDataCell className="text-center">
                                                        <CButton color="light" size="sm" className="btn-icon" onClick={(e) => handleEdit(item, e)}>
                                                            <CIcon icon={cilPencil} />
                                                        </CButton>
                                                    </CTableDataCell>
                                                </CTableRow>
                                            ))}
                                        </CTableBody>
                                    </CTable>
                                </div>
                            </CTabPane>

                            <CTabPane role="tabpanel" visible={activeTab === 'print'}>
                                <div className="text-center py-5 text-medium-emphasis"><CIcon icon={cilDescription} size="5xl" className="mb-3"/><p>Chưa có mẫu in phiếu lương nào</p></div>
                            </CTabPane>
                            <CTabPane role="tabpanel" visible={activeTab === 'export'}>
                                 <div className="text-center py-5 text-medium-emphasis"><CIcon icon={cilDescription} size="5xl" className="mb-3"/><p>Chưa có mẫu xuất khẩu nào</p></div>
                            </CTabPane>
                        </CTabContent>
                    </div>

                     {/* Footer Pagination */}
                    <div className="p-3 border-top d-flex justify-content-between align-items-center">
                         <span className="small fw-bold">Tổng số bản ghi: {activeTab === 'email' ? data.length : 0}</span>
                         <div className="d-flex align-items-center small">
                             <span>Số bản ghi/trang</span>
                             <CFormSelect size="sm" className="mx-2" style={{ width: '70px' }}><option>25</option></CFormSelect>
                             <span className="me-3">1 - {activeTab === 'email' ? data.length : 0} bản ghi</span>
                             <div className="btn-group">
                                 <CButton color="link" size="sm" disabled><CIcon icon={cilChevronLeft} /></CButton>
                                 <CButton color="link" size="sm" disabled><CIcon icon={cilChevronRight} /></CButton>
                             </div>
                         </div>
                    </div>
                </CCardBody>
            </CCard>

            {/* --- MODAL XEM CHI TIẾT (PREVIEW) --- */}
            <CModal 
                visible={showDetailModal} 
                onClose={() => setShowDetailModal(false)}
                alignment="center"
                size="xl"
            >
                <CModalHeader onClose={() => setShowDetailModal(false)} className="border-0 pb-0"></CModalHeader>
                <CModalBody className="pt-0">
                    <h5 className="fw-bold mb-4">{selectedTemplate?.name}</h5>
                    <div className="bg-light p-4 rounded">
                        <div className="bg-white p-4 rounded shadow-sm" style={{maxWidth: '800px', margin: '0 auto'}}>
                            <h6 className="fw-bold mb-3">{selectedTemplate?.subject}</h6>
                            {/* Render nội dung */}
                            <div className="email-content-preview" dangerouslySetInnerHTML={{ __html: selectedTemplate?.content }} />
                        </div>
                    </div>
                </CModalBody>
                <CModalFooter className="bg-light border-0">
                    <CButton color="white" className="border bg-white" onClick={handleSwitchToEdit}>Chỉnh sửa</CButton>
                    <CButton color="success" className="text-white" onClick={() => setShowDetailModal(false)}>Đóng</CButton>
                </CModalFooter>
            </CModal>

            {/* --- MODAL SỬA MẪU EMAIL --- */}
            <CModal 
                visible={showEditModal} 
                onClose={() => setShowEditModal(false)}
                alignment="center"
                size="xl" 
                className="template-edit-modal"
            >
                <CModalHeader onClose={() => setShowEditModal(false)}>
                    <CModalTitle className="fw-bold">Sửa mẫu email</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    <CForm>
                        <CRow className="mb-3 align-items-center">
                            <CCol md={2}><CFormLabel className="fw-bold mb-0">Tên mẫu <span className="text-danger">*</span></CFormLabel></CCol>
                            <CCol md={10}>
                                {/* BINDING DỮ LIỆU: onChange gọi handleInputChange */}
                                <CFormInput 
                                    value={selectedTemplate?.name || ''} 
                                    onChange={(e) => handleInputChange('name', e.target.value)}
                                />
                            </CCol>
                        </CRow>
                        <CRow className="mb-3">
                            <CCol md={2}><CFormLabel className="fw-bold mb-0">Mô tả</CFormLabel></CCol>
                            <CCol md={10}>
                                <CFormTextarea 
                                    rows={2} 
                                    value={selectedTemplate?.desc || ''} 
                                    onChange={(e) => handleInputChange('desc', e.target.value)}
                                />
                            </CCol>
                        </CRow>
                        <CRow className="mb-3 align-items-center">
                            <CCol md={2}><CFormLabel className="fw-bold mb-0">Trạng thái</CFormLabel></CCol>
                            <CCol md={10}>
                                <div className="d-flex">
                                    <CFormCheck 
                                        type="radio" name="status" id="statusActive" label="Đang sử dụng" 
                                        checked={selectedTemplate?.status === 'Active'} 
                                        onChange={() => handleInputChange('status', 'Active')}
                                        className="me-4 text-success fw-bold" style={{color: '#2eb85c'}} 
                                    />
                                    <CFormCheck 
                                        type="radio" name="status" id="statusInactive" label="Ngừng sử dụng" 
                                        checked={selectedTemplate?.status !== 'Active'}
                                        onChange={() => handleInputChange('status', 'Inactive')}
                                    />
                                </div>
                            </CCol>
                        </CRow>
                        <CRow className="mb-3 align-items-center">
                            <CCol md={2}><CFormLabel className="fw-bold mb-0">Tiêu đề <span className="text-danger">*</span></CFormLabel></CCol>
                            <CCol md={10}>
                                <CFormInput 
                                    value={selectedTemplate?.subject || ''} 
                                    onChange={(e) => handleInputChange('subject', e.target.value)}
                                />
                            </CCol>
                        </CRow>

                        {/* FAKE RICH TEXT EDITOR */}
                        {/* Lưu ý: Để chỉnh sửa content thực sự, cần một thư viện Editor (ví dụ ReactQuill). 
                            Ở đây dùng contentEditable giả lập, nên ta dùng onInput để bắt thay đổi */}
                        <div className="editor-container border rounded mt-4">
                            <div className="editor-toolbar bg-light p-2 border-bottom d-flex gap-2">
                                <CButtonGroup size="sm" className="bg-white">
                                    <CButton color="light"><CIcon icon={cilBold} size="sm"/></CButton>
                                    <CButton color="light"><CIcon icon={cilItalic} size="sm"/></CButton>
                                    <CButton color="light"><CIcon icon={cilUnderline} size="sm"/></CButton>
                                </CButtonGroup>
                                {/* ... các nút toolbar khác ... */}
                            </div>
                            
                            <div 
                                className="editor-content p-3" 
                                style={{minHeight: '300px', outline: 'none'}} 
                                contentEditable={true}
                                dangerouslySetInnerHTML={{ __html: selectedTemplate?.content }}
                                onInput={(e) => handleInputChange('content', e.currentTarget.innerHTML)} // Cập nhật nội dung HTML khi gõ
                            />
                            
                            <div className="editor-footer p-2 bg-light border-top d-flex align-items-center gap-2 flex-wrap">
                                <span className="small fw-bold text-secondary">Trường trộn:</span>
                                <CButton color="secondary" size="sm" variant="outline" className="border-dashed">Người gửi phiếu lương</CButton>
                                <CButton color="secondary" size="sm" variant="outline" className="border-dashed">Kỳ lương</CButton>
                                <CButton color="secondary" size="sm" variant="outline" className="border-dashed">Thời hạn phản hồi (ngày/giờ)</CButton>
                                <CButton color="secondary" size="sm" variant="outline" className="border-dashed"><CIcon icon={cilOptions}/></CButton>
                            </div>
                        </div>

                    </CForm>
                </CModalBody>
                <CModalFooter className="bg-light border-0 justify-content-between">
                    <CButton color="white" className="border">Xem trước mẫu email</CButton>
                    <div>
                        <CButton color="white" className="border me-2" onClick={() => setShowEditModal(false)}>Hủy bỏ</CButton>
                        <CButton color="success" className="text-white" onClick={handleSave}>Lưu</CButton>
                    </div>
                </CModalFooter>
            </CModal>
        </div>
    );
}

export default TemplateSettingsPage