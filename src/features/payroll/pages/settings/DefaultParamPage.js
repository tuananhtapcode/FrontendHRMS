import {
  cilChevronLeft,
  cilChevronRight,
  cilExternalLink,
  cilFilter,
  cilHistory,
  cilInfo,
  cilInput,
  cilNewspaper,
  cilPencil,
  cilPlus,
  cilSearch,
  cilSettings,
  cilSync,
  cilTrash
} from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import {
  CButton,
  CCard,
  CCardBody,
  CCol,
  CDropdown,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
  CFormCheck,
  CFormInput,
  CFormLabel,
  CFormSelect,
  CFormSwitch,
  CInputGroup,
  CInputGroupText,
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
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CTabPane,
} from '@coreui/react'
import { useState } from 'react'

// Import SCSS
import '../../scss/default-param-page.scss'

// --- DỮ LIỆU MOCK ---
const MOCK_ORG_DATA = [
    { id: 1, name: 'Thuận Nguyễn Phúc', minSalary: null, insuranceCap: null }, 
];

const PROGRESSIVE_TAX_DATA = [
    { level: 1, yearFrom: '-', yearTo: '60.000.000,00', monthFrom: '-', monthTo: '5.000.000,00', rate: 5 },
    { level: 2, yearFrom: '60.000.000,00', yearTo: '120.000.000,00', monthFrom: '5.000.000,00', monthTo: '10.000.000,00', rate: 10 },
    { level: 3, yearFrom: '120.000.000,00', yearTo: '216.000.000,00', monthFrom: '10.000.000,00', monthTo: '18.000.000,00', rate: 15 },
    { level: 4, yearFrom: '216.000.000,00', yearTo: '384.000.000,00', monthFrom: '18.000.000,00', monthTo: '32.000.000,00', rate: 20 },
    { level: 5, yearFrom: '384.000.000,00', yearTo: '624.000.000,00', monthFrom: '32.000.000,00', monthTo: '52.000.000,00', rate: 25 },
    { level: 6, yearFrom: '624.000.000,00', yearTo: '960.000.000,00', monthFrom: '52.000.000,00', monthTo: '80.000.000,00', rate: 30 },
    { level: 7, yearFrom: '960.000.000,00', yearTo: '-', monthFrom: '80.000.000,00', monthTo: '-', rate: 35 },
];

const GROSS_UP_DATA = [
    { id: 1, condition: 'Đến 4.750.000', formula: 'TNQĐ/0,95' },
    { id: 2, condition: 'Trên 4.750.000 đến 9.250.000', formula: '(TNQĐ - 250.000)/0,9' },
    { id: 3, condition: 'Trên 9.250.000 đến 16.050.000', formula: '(TNQĐ - 750.000)/0,85' },
    { id: 4, condition: 'Trên 16.050.000 đến 27.250.000', formula: '(TNQĐ - 1.650.000)/0,8' },
    { id: 5, condition: 'Trên 27.250.000 đến 42.250.000', formula: '(TNQĐ - 3.250.000)/0,75' },
];

const MOCK_ALLOWANCE_DATA = [];
const MOCK_DEDUCTION_DATA = []; // Dữ liệu mock cho khấu trừ

const DefaultParamPage = () => {
    const [activeTab, setActiveTab] = useState('deduction'); // Mặc định tab Khấu trừ
    
    // --- STATE CÁC TAB KHÁC ---
    const [minSalaryType, setMinSalaryType] = useState('department');
    const [isManagingSalaryGrade, setIsManagingSalaryGrade] = useState(true);
    const [salaryGradeType, setSalaryGradeType] = useState('coefficient'); 
    const [gradeLevelType, setGradeLevelType] = useState('title'); 
    const [maxGradeLevel, setMaxGradeLevel] = useState(7); 
    const [salaryGradeData, setSalaryGradeData] = useState([]); 
    const [isTaxEnabled, setIsTaxEnabled] = useState(true);
    const [probationTaxType, setProbationTaxType] = useState('10percent');
    const [apprenticeTaxType, setApprenticeTaxType] = useState('10percent');
    const [autoTaxHistory, setAutoTaxHistory] = useState(false);
    const [isInsEnabled, setIsInsEnabled] = useState(true);
    const [insType, setInsType] = useState('labor');
    const [insSalaryBase, setInsSalaryBase] = useState('fixed');

    // --- STATE MODAL ---
    const [showSalaryDetailModal, setShowSalaryDetailModal] = useState(false);
    const [showAddRowModal, setShowAddRowModal] = useState(false); 
    const [modalJobTitle, setModalJobTitle] = useState('');
    const [modalCoefficients, setModalCoefficients] = useState({}); 

    // --- STATE MODAL PHỤ CẤP & KHẤU TRỪ ---
    const [showAllowanceModal, setShowAllowanceModal] = useState(false);
    const [showDeductionModal, setShowDeductionModal] = useState(false); // Modal Khấu trừ
    
    // Chi tiết trong modal (dùng chung cấu trúc cho cả phụ cấp và khấu trừ)
    const [policyDetails, setPolicyDetails] = useState([
        { id: 1, position: '', quota: '', value: '' }
    ]);

    const formatCurrency = (value) => {
        if (value === null || value === undefined) return '-';
        return new Intl.NumberFormat('vi-VN').format(value);
    };

    const handleImport = () => { console.log("Importing..."); };
    const handleAddRow = () => { setModalJobTitle(''); setModalCoefficients({}); setShowAddRowModal(true); };
    const handleCoefficientChange = (index, value) => { setModalCoefficients(prev => ({ ...prev, [index]: value })); };
    const handleSaveNewRow = () => {
        if (!modalJobTitle || modalJobTitle === 'Chọn chức danh') return alert("Vui lòng chọn chức danh!");
        const newRow = { id: Date.now(), title: modalJobTitle, coefficients: { ...modalCoefficients } };
        setSalaryGradeData([...salaryGradeData, newRow]);
        setShowAddRowModal(false);
    };

    // --- LOGIC MODAL PHỤ CẤP/KHẤU TRỪ ---
    const handleAddDetailRow = () => {
        setPolicyDetails([...policyDetails, { id: Date.now(), position: '', quota: '', value: '' }]);
    };

    const handleRemoveDetailRow = (id) => {
        setPolicyDetails(policyDetails.filter(item => item.id !== id));
    };
    
    const handleSavePolicy = () => {
        console.log("Saving policy...");
        setShowAllowanceModal(false);
        setShowDeductionModal(false);
    };

    const handleOpenAllowanceModal = () => {
         setPolicyDetails([{ id: Date.now(), position: '', quota: '', value: '' }]);
         setShowAllowanceModal(true);
    }

    const handleOpenDeductionModal = () => {
         setPolicyDetails([{ id: Date.now(), position: '', quota: '', value: '' }]);
         setShowDeductionModal(true);
    }

    // ... (Code các Tab SalaryLevelTab, SalaryGradeTab, TaxTab, InsuranceTab giữ nguyên) ...
    // ... [Đoạn code này khá dài, tôi sẽ rút gọn phần hiển thị lại để tập trung vào phần mới]
    const SalaryLevelTab = () => (
        <CTabPane role="tabpanel" visible={activeTab === 'salaryLevel'} className="pt-3">
             <div className="d-flex justify-content-between align-items-start mb-4">
                 <p className="text-medium-emphasis mb-0">Thiết lập các mức lương theo quy định...</p>
                 <CButton color="white" className="border">Lấy lại mặc định</CButton>
            </div>
            <div className="mb-4">
                <div className="d-flex align-items-center mb-2"><CFormLabel className="mb-0 fw-bold me-2">Mức lương cơ sở (VND)</CFormLabel><CIcon icon={cilHistory} className="text-success" style={{cursor: 'pointer'}} /></div>
                <CFormInput defaultValue="2.340.000" className="fw-semibold border-top-0 border-start-0 border-end-0 rounded-0 px-0" style={{maxWidth: '200px', backgroundColor: 'transparent'}} />
            </div>
            <div className="mb-5"><CFormLabel className="fw-bold mb-2">Mức lương trần đóng BHXH, BHYT (VND)</CFormLabel><CFormInput defaultValue="46.800.000" className="fw-semibold border-top-0 border-start-0 border-end-0 rounded-0 px-0" style={{maxWidth: '200px', backgroundColor: 'transparent'}} /></div>
            <div className="d-flex align-items-center mb-3"><h6 className="fw-bold mb-0 me-4">Mức lương tối thiểu vùng</h6><div className="d-flex"><CFormCheck type="radio" name="minSalaryGroup" id="minSalaryDept" label="Theo cơ cấu tổ chức" checked={minSalaryType === 'department'} onChange={() => setMinSalaryType('department')} className="me-4" /><CFormCheck type="radio" name="minSalaryGroup" id="minSalaryArea" label="Theo khu vực làm việc" checked={minSalaryType === 'area'} onChange={() => setMinSalaryType('area')} /></div></div>
            <div className="table-responsive border rounded bg-white"><CTable hover align="middle" className="mb-0"><CTableHead color="light"><CTableRow><CTableHeaderCell style={{width: '40%', paddingLeft: '1.5rem'}}>Đơn vị</CTableHeaderCell><CTableHeaderCell className="text-end" style={{width: '30%'}}>Mức lương tối thiểu (VND)</CTableHeaderCell><CTableHeaderCell className="text-end" style={{width: '30%', paddingRight: '1.5rem'}}>Mức lương trần đóng BHTN (VND)</CTableHeaderCell></CTableRow></CTableHead><CTableBody>{MOCK_ORG_DATA.map((item) => (<CTableRow key={item.id}><CTableDataCell style={{paddingLeft: '1.5rem'}}>{item.name}</CTableDataCell><CTableDataCell className="text-end"><CInputGroup size="sm" className="justify-content-end"><CFormInput type="text" defaultValue={formatCurrency(item.minSalary)} className="text-end border-0 bg-transparent p-0" placeholder="-" /></CInputGroup></CTableDataCell><CTableDataCell className="text-end" style={{paddingRight: '1.5rem'}}><CInputGroup size="sm" className="justify-content-end"><CFormInput type="text" defaultValue={formatCurrency(item.insuranceCap)} className="text-end border-0 bg-transparent p-0" placeholder="-" /></CInputGroup></CTableDataCell></CTableRow>))}</CTableBody></CTable></div>
        </CTabPane>
    );

    const SalaryGradeTab = () => (
        <CTabPane role="tabpanel" visible={activeTab === 'salaryGrade'} className="pt-3">
             <p className="text-medium-emphasis mb-3">Thiết lập thang bảng lương của đơn vị...</p>
             <div className="mb-3"><CFormCheck id="manageGrade" label="Quản lý thang bảng lương" checked={isManagingSalaryGrade} onChange={(e) => setIsManagingSalaryGrade(e.target.checked)} className="fw-bold" /></div>
             {isManagingSalaryGrade && (<div className="ps-4"><CRow className="mb-4"><CCol md={8}><CRow className="mb-3"><CCol md={6}><CFormLabel className="fw-bold mb-2">Quản lý thang bảng lương theo</CFormLabel><div className="d-flex"><CFormCheck type="radio" name="gradeType" id="typeAmount" label="Mức lương" checked={salaryGradeType === 'amount'} onChange={() => setSalaryGradeType('amount')} className="me-4" /><CFormCheck type="radio" name="gradeType" id="typeCoeff" label="Hệ số" checked={salaryGradeType === 'coefficient'} onChange={() => setSalaryGradeType('coefficient')} /></div></CCol><CCol md={6}><CFormLabel className="fw-bold mb-2">Đơn giá tiền lương</CFormLabel><div className="d-flex align-items-center"><CFormInput disabled={salaryGradeType !== 'coefficient'} className="me-2" style={{maxWidth: '120px', backgroundColor: '#f2f2f2'}} />{salaryGradeType === 'coefficient' && (<div className="text-success small d-flex align-items-center" style={{cursor: 'pointer'}} onClick={() => setShowSalaryDetailModal(true)}><CIcon icon={cilPencil} size="sm" className="me-1"/> Chi tiết theo đơn vị</div>)}</div></CCol></CRow><CRow><CCol md={6}><CFormLabel className="fw-bold mb-2">Phân cấp bậc lương theo</CFormLabel><div className="d-flex"><CFormCheck type="radio" name="levelType" id="lvlTitle" label="Chức danh" checked={gradeLevelType === 'title'} onChange={() => setGradeLevelType('title')} className="me-4" /><CFormCheck type="radio" name="levelType" id="lvlPos" label="Vị trí công việc" checked={gradeLevelType === 'position'} onChange={() => setGradeLevelType('position')} /></div></CCol><CCol md={6}><CFormLabel className="fw-bold mb-2">Số bậc lương tối đa</CFormLabel><CFormInput type="number" value={maxGradeLevel} onChange={(e) => setMaxGradeLevel(Number(e.target.value))} style={{maxWidth: '80px'}} /></CCol></CRow></CCol></CRow><div className="d-flex justify-content-between align-items-end mb-3"><h6 className="fw-bold mb-0">Chi tiết thang bảng lương</h6><div className="d-flex gap-2"><CDropdown><CDropdownToggle color="white" className="border text-success fw-bold"><CIcon icon={cilPlus} className="me-1"/> Thêm dòng</CDropdownToggle><CDropdownMenu><CDropdownItem onClick={handleAddRow} style={{cursor: 'pointer'}}>Thêm 1 dòng</CDropdownItem><CDropdownItem onClick={handleImport} style={{cursor: 'pointer'}}><CIcon icon={cilInput} className="me-2"/> Nhập khẩu</CDropdownItem></CDropdownMenu></CDropdown><CButton color="white" className="border text-secondary"><CIcon icon={cilSync} className="me-1"/> Cập nhật hồ sơ</CButton><CButton color="white" className="border text-secondary"><CIcon icon={cilExternalLink} /></CButton></div></div><div className="mb-3" style={{maxWidth: '300px'}}><CInputGroup><CInputGroupText className="bg-white"><CIcon icon={cilSearch}/></CInputGroupText><CFormInput placeholder="Tìm kiếm" /></CInputGroup></div><div className="table-responsive border rounded bg-white"><CTable hover align="middle" className="mb-0 border text-nowrap"><CTableHead color="light"><CTableRow><CTableHeaderCell rowSpan={2} className="text-center align-middle" style={{minWidth: '200px'}}>{gradeLevelType === 'title' ? 'Chức danh' : 'Vị trí công việc'}</CTableHeaderCell><CTableHeaderCell colSpan={maxGradeLevel} className="text-center">Bậc lương</CTableHeaderCell></CTableRow><CTableRow>{Array.from({ length: maxGradeLevel }, (_, i) => (<CTableHeaderCell key={i} className="text-center" style={{minWidth: '80px', borderLeft: '1px solid #dee2e6'}}>{i + 1}</CTableHeaderCell>))}</CTableRow></CTableHead><CTableBody>{salaryGradeData.length === 0 ? (<CTableRow><CTableDataCell colSpan={maxGradeLevel + 1} className="text-center py-5 text-medium-emphasis">Không có dữ liệu</CTableDataCell></CTableRow>) : (salaryGradeData.map((row) => (<CTableRow key={row.id}><CTableDataCell className="fw-bold ps-3 text-start">{row.title}</CTableDataCell>{Array.from({ length: maxGradeLevel }, (_, i) => (<CTableDataCell key={i} className="text-center border-start">{row.coefficients[i] || '-'}</CTableDataCell>))}</CTableRow>)))}</CTableBody></CTable></div></div>)}
        </CTabPane>
    );

    const TaxTab = () => (
        <CTabPane role="tabpanel" visible={activeTab === 'tax'} className="pt-3">
             <div className="d-flex justify-content-between align-items-start mb-4"><p className="text-medium-emphasis mb-0">Thiết lập các quy tắc mặc định về thuế TNCN...</p><CButton color="white" className="border">Lấy lại mặc định</CButton></div><div className="mb-2"><CFormCheck id="taxEnabled" label="Thuế suất của nhân viên" checked={isTaxEnabled} onChange={(e) => setIsTaxEnabled(e.target.checked)} className="fw-bold text-success-dark" style={{color: '#2eb85c'}} /></div><div className="ps-4 mb-3"><CRow className="mb-2 align-items-center"><CCol xs="auto" style={{minWidth: '80px'}}>Thử việc:</CCol><CCol><div className="d-flex"><CFormCheck type="radio" name="probationTax" id="probExempt" label="Miễn thuế" checked={probationTaxType === 'exempt'} onChange={() => setProbationTaxType('exempt')} className="me-4" /><CFormCheck type="radio" name="probationTax" id="prob10" label="10%" checked={probationTaxType === '10percent'} onChange={() => setProbationTaxType('10percent')} className="me-4" /><CFormCheck type="radio" name="probationTax" id="probProg" label="Theo biểu lũy tiến" checked={probationTaxType === 'progressive'} onChange={() => setProbationTaxType('progressive')} /></div></CCol></CRow><CRow className="mb-2 align-items-center"><CCol xs="auto" style={{minWidth: '80px'}}>Học việc:</CCol><CCol><div className="d-flex"><CFormCheck type="radio" name="apprenticeTax" id="apprExempt" label="Miễn thuế" checked={apprenticeTaxType === 'exempt'} onChange={() => setApprenticeTaxType('exempt')} className="me-4" /><CFormCheck type="radio" name="apprenticeTax" id="appr10" label="10%" checked={apprenticeTaxType === '10percent'} onChange={() => setApprenticeTaxType('10percent')} className="me-4" /><CFormCheck type="radio" name="apprenticeTax" id="apprProg" label="Theo biểu lũy tiến" checked={apprenticeTaxType === 'progressive'} onChange={() => setApprenticeTaxType('progressive')} /></div></CCol></CRow><div className="text-success fw-bold d-flex align-items-center" style={{cursor: 'pointer'}}><CIcon icon={cilPlus} className="me-1"/> Thêm</div></div><div className="mb-4"><div className="d-flex align-items-center"><CFormSwitch id="autoTaxHistory" label="Tự động sinh lịch sử thuế suất khi thay đổi tính chất lao động" checked={autoTaxHistory} onChange={(e) => setAutoTaxHistory(e.target.checked)} /><CIcon icon={cilInfo} className="text-info ms-2" size="sm" /></div></div><h6 className="fw-bold mb-2" style={{fontSize: '0.9rem'}}>Biểu thuế lũy tiến</h6><div className="table-responsive border rounded bg-white mb-4"><CTable hover align="middle" className="mb-0 border text-center table-sm"><CTableHead style={{backgroundColor: '#f8f9fa'}}><CTableRow><CTableHeaderCell rowSpan={2} className="align-middle border-end" style={{backgroundColor: '#f8f9fa'}}>Bậc thuế</CTableHeaderCell><CTableHeaderCell colSpan={2} className="border-bottom border-end" style={{backgroundColor: '#f8f9fa'}}>Phần thu nhập tính thuế/năm (VND)</CTableHeaderCell><CTableHeaderCell colSpan={2} className="border-bottom border-end" style={{backgroundColor: '#f8f9fa'}}>Phần thu nhập tính thuế/tháng (VND)</CTableHeaderCell><CTableHeaderCell rowSpan={2} className="align-middle" style={{backgroundColor: '#f8f9fa'}}>Thuế suất (%)</CTableHeaderCell></CTableRow><CTableRow><CTableHeaderCell className="border-end py-2" style={{backgroundColor: '#f8f9fa'}}>Trên</CTableHeaderCell><CTableHeaderCell className="border-end py-2" style={{backgroundColor: '#f8f9fa'}}>Đến</CTableHeaderCell><CTableHeaderCell className="border-end py-2" style={{backgroundColor: '#f8f9fa'}}>Trên</CTableHeaderCell><CTableHeaderCell className="border-end py-2" style={{backgroundColor: '#f8f9fa'}}>Đến</CTableHeaderCell></CTableRow></CTableHead><CTableBody>{PROGRESSIVE_TAX_DATA.map((row) => (<CTableRow key={row.level}><CTableDataCell className="border-end">{row.level}</CTableDataCell><CTableDataCell className="text-end border-end">{row.yearFrom}</CTableDataCell><CTableDataCell className="text-end border-end">{row.yearTo}</CTableDataCell><CTableDataCell className="text-end border-end">{row.monthFrom}</CTableDataCell><CTableDataCell className="text-end border-end">{row.monthTo}</CTableDataCell><CTableDataCell className="text-end">{row.rate},00</CTableDataCell></CTableRow>))}</CTableBody></CTable></div><h6 className="fw-bold mb-2" style={{fontSize: '0.9rem'}}>Bảng quy đổi thu nhập không bao gồm thuế ra thu nhập tính thuế (Áp dụng khi tính theo lương NET)</h6><div className="table-responsive border rounded bg-white"><CTable hover align="middle" className="mb-0 border table-sm"><CTableHead style={{backgroundColor: '#f8f9fa'}}><CTableRow><CTableHeaderCell style={{width: '50px', backgroundColor: '#f8f9fa'}} className="text-center border-end">STT</CTableHeaderCell><CTableHeaderCell className="border-end" style={{width: '40%', backgroundColor: '#f8f9fa'}}>Thu nhập làm căn cứ quy đổi/tháng (TNQĐ)</CTableHeaderCell><CTableHeaderCell style={{backgroundColor: '#f8f9fa'}}>Thu nhập tính thuế</CTableHeaderCell></CTableRow></CTableHead><CTableBody>{GROSS_UP_DATA.map((row) => (<CTableRow key={row.id}><CTableDataCell className="text-center border-end">{row.id}</CTableDataCell><CTableDataCell className="border-end">{row.condition}</CTableDataCell><CTableDataCell>{row.formula}</CTableDataCell></CTableRow>))}</CTableBody></CTable></div>
        </CTabPane>
    );

    const InsuranceTab = () => (
        <CTabPane role="tabpanel" visible={activeTab === 'insurance'} className="pt-3">
             <div className="d-flex justify-content-between align-items-start mb-4"><p className="text-medium-emphasis mb-0">Thiết lập các quy tắc mặc định về bảo hiểm...</p><CButton color="white" className="border">Lấy lại mặc định</CButton></div><div className="mb-4"><CFormCheck id="insEnabled" label="Nhân viên được đóng bảo hiểm" checked={isInsEnabled} onChange={(e) => setIsInsEnabled(e.target.checked)} className="fw-bold text-success-dark mb-2" style={{color: '#2eb85c'}} /><div className="ps-4"><CRow><CCol md={5}><CFormCheck type="radio" name="insType" id="insTypeLabor" label="Theo tính chất lao động" checked={insType === 'labor'} onChange={() => setInsType('labor')} className="mb-2" /><div className="ps-4 mb-3"><CFormCheck id="insLaborProb" label="Thử việc" className="mb-1" /><CFormCheck id="insLaborOfficial" label="Chính thức" /></div></CCol><CCol md={7}><CFormCheck type="radio" name="insType" id="insTypeSeniority" label="Theo thâm niên (Tháng)" checked={insType === 'seniority'} onChange={() => setInsType('seniority')} className="mb-2" /><div className="ps-4"><CFormInput type="number" defaultValue="6" style={{maxWidth: '150px'}} /></div></CCol></CRow></div></div><div className="mb-4"><CFormCheck id="unionEnabled" label="Nhân viên đóng công đoàn phí" defaultChecked className="fw-bold text-success-dark mb-2" style={{color: '#2eb85c'}} /><div className="ps-4"><CFormCheck id="unionProb" label="Thử việc" className="mb-1" /><CFormCheck id="unionOfficial" label="Chính thức" /></div></div><div className="mb-4"><CFormCheck id="insSalaryEnabled" label="Lương đóng bảo hiểm (VND)" defaultChecked className="fw-bold text-success-dark mb-2" style={{color: '#2eb85c'}} /><div className="ps-4 d-flex flex-wrap gap-4 align-items-start"><CFormCheck type="radio" name="insSalaryBase" id="insSalBase1" label="Giống lương cơ bản" checked={insSalaryBase === 'base'} onChange={() => setInsSalaryBase('base')} /><div><CFormCheck type="radio" name="insSalaryBase" id="insSalBase2" label="Nhập số tiền (VND)" checked={insSalaryBase === 'fixed'} onChange={() => setInsSalaryBase('fixed')} /><CFormInput className="mt-1" defaultValue="0" style={{maxWidth: '150px'}} disabled={insSalaryBase !== 'fixed'} /></div><div><CFormCheck type="radio" name="insSalaryBase" id="insSalBase3" label="Bằng Lương cơ bản + Các khoản phụ cấp tính đóng bảo hiểm" checked={insSalaryBase === 'formula'} onChange={() => setInsSalaryBase('formula')} /><div className="small text-medium-emphasis mt-1 ms-4" style={{cursor: 'pointer'}}>Danh sách khoản phụ cấp</div></div></div></div><div className="mb-4"><div className="d-flex align-items-center"><CFormCheck id="manageInsHistory" label="Quản lý lịch sử tham gia bảo hiểm" defaultChecked className="fw-bold text-success-dark" style={{color: '#2eb85c'}} /><CIcon icon={cilInfo} className="text-secondary ms-2" size="sm" /></div></div><div className="mb-4"><div className="d-flex align-items-center mb-2"><h6 className="fw-bold mb-0 me-2" style={{fontSize: '0.9rem'}}>Tỉ lệ đóng đối với người Việt Nam</h6><CIcon icon={cilHistory} className="text-success" style={{cursor: 'pointer'}} size="sm" /></div><div className="table-responsive border rounded bg-white"><CTable hover align="middle" className="mb-0 border text-center table-sm"><CTableHead style={{backgroundColor: '#f8f9fa'}}><CTableRow><CTableHeaderCell colSpan={3} className="border-bottom border-end py-2">Người lao động đóng</CTableHeaderCell><CTableHeaderCell colSpan={4} className="border-bottom py-2">Doanh nghiệp đóng</CTableHeaderCell></CTableRow><CTableRow><CTableHeaderCell className="border-end py-2">BHXH (%)</CTableHeaderCell><CTableHeaderCell className="border-end py-2">BHYT (%)</CTableHeaderCell><CTableHeaderCell className="border-end py-2">BHTN (%)</CTableHeaderCell><CTableHeaderCell className="border-end py-2">BHXH (%)</CTableHeaderCell><CTableHeaderCell className="border-end py-2">BHYT (%)</CTableHeaderCell><CTableHeaderCell className="border-end py-2">BHTN (%)</CTableHeaderCell><CTableHeaderCell className="py-2">KPCĐ (%)</CTableHeaderCell></CTableRow></CTableHead><CTableBody><CTableRow><CTableDataCell className="border-end">8,00</CTableDataCell><CTableDataCell className="border-end">1,50</CTableDataCell><CTableDataCell className="border-end">1,00</CTableDataCell><CTableDataCell className="border-end">17,50</CTableDataCell><CTableDataCell className="border-end">3,00</CTableDataCell><CTableDataCell className="border-end">1,00</CTableDataCell><CTableDataCell>2,00</CTableDataCell></CTableRow></CTableBody></CTable></div></div><div className="mb-4"><div className="d-flex align-items-center mb-2"><h6 className="fw-bold mb-0 me-2" style={{fontSize: '0.9rem'}}>Tỉ lệ đóng đối với người nước ngoài</h6><CIcon icon={cilHistory} className="text-success" style={{cursor: 'pointer'}} size="sm" /></div><div className="table-responsive border rounded bg-white"><CTable hover align="middle" className="mb-0 border text-center table-sm"><CTableHead style={{backgroundColor: '#f8f9fa'}}><CTableRow><CTableHeaderCell colSpan={3} className="border-bottom border-end py-2">Người lao động đóng</CTableHeaderCell><CTableHeaderCell colSpan={4} className="border-bottom py-2">Doanh nghiệp đóng</CTableHeaderCell></CTableRow><CTableRow><CTableHeaderCell className="border-end py-2">BHXH (%)</CTableHeaderCell><CTableHeaderCell className="border-end py-2">BHYT (%)</CTableHeaderCell><CTableHeaderCell className="border-end py-2">BHTN (%)</CTableHeaderCell><CTableHeaderCell className="border-end py-2">BHXH (%)</CTableHeaderCell><CTableHeaderCell className="border-end py-2">BHYT (%)</CTableHeaderCell><CTableHeaderCell className="border-end py-2">BHTN (%)</CTableHeaderCell><CTableHeaderCell className="py-2">KPCĐ (%)</CTableHeaderCell></CTableRow></CTableHead><CTableBody><CTableRow><CTableDataCell className="border-end">8,00</CTableDataCell><CTableDataCell className="border-end">1,50</CTableDataCell><CTableDataCell className="border-end">-</CTableDataCell><CTableDataCell className="border-end">17,50</CTableDataCell><CTableDataCell className="border-end">3,00</CTableDataCell><CTableDataCell className="border-end">-</CTableDataCell><CTableDataCell>2,00</CTableDataCell></CTableRow></CTableBody></CTable></div></div>
        </CTabPane>
    );

    // 5. TAB PHỤ CẤP
    const AllowanceTab = () => (
        <CTabPane role="tabpanel" visible={activeTab === 'allowance'} className="pt-3">
             <div className="d-flex justify-content-between align-items-center mb-4">
                 <p className="text-medium-emphasis mb-0">
                    Khai báo chính sách phụ cấp áp dụng cho từng vị trí công việc...
                </p>
                 <CButton color="success" className="text-white fw-bold" onClick={handleOpenAllowanceModal}>
                    <CIcon icon={cilPlus} className="me-2"/> Thêm mới
                 </CButton>
            </div>

            <div className="d-flex justify-content-between align-items-center mb-3">
                <CInputGroup style={{maxWidth: '300px'}}>
                    <CInputGroupText className="bg-white"><CIcon icon={cilSearch}/></CInputGroupText>
                    <CFormInput placeholder="Tìm kiếm" />
                </CInputGroup>
                
                <div className="d-flex align-items-center gap-2">
                     <CFormSelect style={{width: '150px'}} className="bg-light">
                        <option>Đang áp dụng</option>
                     </CFormSelect>
                     <CFormSelect style={{width: '200px'}} className="bg-light">
                        <option>Tất cả đơn vị</option>
                     </CFormSelect>
                     <CButton color="white" className="border px-2"><CIcon icon={cilFilter}/></CButton>
                     <CButton color="white" className="border px-2"><CIcon icon={cilSettings}/></CButton>
                </div>
            </div>

            <div className="table-responsive border rounded bg-white">
                <CTable hover align="middle" className="mb-0">
                    <CTableHead color="light">
                        <CTableRow>
                            <CTableHeaderCell className="py-3 ps-4" style={{width: '25%'}}>Tên chính sách</CTableHeaderCell>
                            <CTableHeaderCell className="py-3" style={{width: '30%'}}>Đơn vị áp dụng</CTableHeaderCell>
                            <CTableHeaderCell className="py-3" style={{width: '25%'}}>Khoản phụ cấp</CTableHeaderCell>
                            <CTableHeaderCell className="py-3" style={{width: '20%'}}>Trạng thái</CTableHeaderCell>
                        </CTableRow>
                    </CTableHead>
                    <CTableBody>
                        {MOCK_ALLOWANCE_DATA.length === 0 ? (
                            <CTableRow>
                                <CTableDataCell colSpan={4} className="text-center py-5 border-0">
                                    <div className="d-flex flex-column align-items-center justify-content-center">
                                        <CIcon icon={cilNewspaper} size="5xl" className="text-success mb-3" style={{opacity: 0.5}} />
                                        <p className="text-medium-emphasis">Không có dữ liệu</p>
                                    </div>
                                </CTableDataCell>
                            </CTableRow>
                        ) : (
                            <CTableRow></CTableRow>
                        )}
                    </CTableBody>
                </CTable>
            </div>

            <div className="p-3 border-top d-flex justify-content-between align-items-center bg-white rounded-bottom">
                 <span className="small fw-bold">Tổng số bản ghi: 0</span>
                 <div className="d-flex align-items-center small">
                     <span>Số bản ghi/trang</span>
                     <CFormSelect size="sm" className="mx-2" style={{ width: '70px' }}><option>25</option></CFormSelect>
                     <span className="me-3">0 - 0 bản ghi</span>
                     <div className="btn-group">
                         <CButton color="link" size="sm" disabled><CIcon icon={cilChevronLeft} /></CButton>
                         <CButton color="link" size="sm" disabled><CIcon icon={cilChevronRight} /></CButton>
                     </div>
                 </div>
            </div>
        </CTabPane>
    );

    // 6. TAB KHẤU TRỪ (MỚI)
    const DeductionTab = () => (
        <CTabPane role="tabpanel" visible={activeTab === 'deduction'} className="pt-3">
             <div className="d-flex justify-content-between align-items-center mb-4">
                 <p className="text-medium-emphasis mb-0">
                    Khai báo chính sách khấu trừ áp dụng cho từng vị trí công việc để ghi nhận nhanh vào thông tin lương của nhân viên
                </p>
                 <CButton color="success" className="text-white fw-bold" onClick={handleOpenDeductionModal}>
                    <CIcon icon={cilPlus} className="me-2"/> Thêm mới
                 </CButton>
            </div>

            {/* Filter Bar */}
            <div className="d-flex justify-content-between align-items-center mb-3">
                <CInputGroup style={{maxWidth: '300px'}}>
                    <CInputGroupText className="bg-white"><CIcon icon={cilSearch}/></CInputGroupText>
                    <CFormInput placeholder="Tìm kiếm" />
                </CInputGroup>
                
                <div className="d-flex align-items-center gap-2">
                     <CFormSelect style={{width: '150px'}} className="bg-light">
                        <option>Đang áp dụng</option>
                     </CFormSelect>
                     <CFormSelect style={{width: '200px'}} className="bg-light">
                        <option>Tất cả đơn vị</option>
                     </CFormSelect>
                     <CButton color="white" className="border px-2"><CIcon icon={cilFilter}/></CButton>
                     <CButton color="white" className="border px-2"><CIcon icon={cilSettings}/></CButton>
                </div>
            </div>

            {/* Table */}
            <div className="table-responsive border rounded bg-white">
                <CTable hover align="middle" className="mb-0">
                    <CTableHead color="light">
                        <CTableRow>
                            <CTableHeaderCell className="py-3 ps-4" style={{width: '25%'}}>Tên chính sách</CTableHeaderCell>
                            <CTableHeaderCell className="py-3" style={{width: '30%'}}>Đơn vị áp dụng</CTableHeaderCell>
                            <CTableHeaderCell className="py-3" style={{width: '25%'}}>Khoản khấu trừ</CTableHeaderCell>
                            <CTableHeaderCell className="py-3" style={{width: '20%'}}>Trạng thái</CTableHeaderCell>
                        </CTableRow>
                    </CTableHead>
                    <CTableBody>
                        {MOCK_DEDUCTION_DATA.length === 0 ? (
                            <CTableRow>
                                <CTableDataCell colSpan={4} className="text-center py-5 border-0">
                                    <div className="d-flex flex-column align-items-center justify-content-center">
                                        <CIcon icon={cilNewspaper} size="5xl" className="text-success mb-3" style={{opacity: 0.5}} />
                                        <p className="text-medium-emphasis">Không có dữ liệu</p>
                                    </div>
                                </CTableDataCell>
                            </CTableRow>
                        ) : (
                            <CTableRow></CTableRow>
                        )}
                    </CTableBody>
                </CTable>
            </div>

            {/* Pagination Footer */}
            <div className="p-3 border-top d-flex justify-content-between align-items-center bg-white rounded-bottom">
                 <span className="small fw-bold">Tổng số bản ghi: 0</span>
                 <div className="d-flex align-items-center small">
                     <span>Số bản ghi/trang</span>
                     <CFormSelect size="sm" className="mx-2" style={{ width: '70px' }}><option>25</option></CFormSelect>
                     <span className="me-3">0 - 0 bản ghi</span>
                     <div className="btn-group">
                         <CButton color="link" size="sm" disabled><CIcon icon={cilChevronLeft} /></CButton>
                         <CButton color="link" size="sm" disabled><CIcon icon={cilChevronRight} /></CButton>
                     </div>
                 </div>
            </div>
        </CTabPane>
    );

    // Placeholder cho các tab khác
    const DefaultTab = ({ title }) => (
        <CTabPane role="tabpanel" visible={activeTab === title} className="p-3 text-center text-medium-emphasis">
            Nội dung tab {title} đang cập nhật...
        </CTabPane>
    );

    return (
        <div className="default-param-page">
            <div className="page-header mb-3">
                <h4 className="mb-0">Thông số mặc định</h4>
            </div>

            <CCard className="card-tabs border-0 shadow-sm">
                <CCardBody className="p-0">
                    <div className="border-bottom px-3 pt-2">
                        <CNav variant="tabs" className="border-bottom-0">
                            <CNavItem><CNavLink active={activeTab === 'salaryLevel'} onClick={() => setActiveTab('salaryLevel')} style={{cursor: 'pointer'}}>Mức lương</CNavLink></CNavItem>
                            <CNavItem><CNavLink active={activeTab === 'period'} onClick={() => setActiveTab('period')} style={{cursor: 'pointer'}}>Kỳ lương</CNavLink></CNavItem>
                            <CNavItem><CNavLink active={activeTab === 'salaryGrade'} onClick={() => setActiveTab('salaryGrade')} style={{cursor: 'pointer'}}>Thang bảng lương</CNavLink></CNavItem>
                            <CNavItem><CNavLink active={activeTab === 'tax'} onClick={() => setActiveTab('tax')} style={{cursor: 'pointer'}}>Thuế TNCN</CNavLink></CNavItem>
                            <CNavItem><CNavLink active={activeTab === 'insurance'} onClick={() => setActiveTab('insurance')} style={{cursor: 'pointer'}}>Bảo hiểm - Công đoàn</CNavLink></CNavItem>
                            <CNavItem><CNavLink active={activeTab === 'allowance'} onClick={() => setActiveTab('allowance')} style={{cursor: 'pointer'}}>Phụ cấp</CNavLink></CNavItem>
                            <CNavItem><CNavLink active={activeTab === 'deduction'} onClick={() => setActiveTab('deduction')} style={{cursor: 'pointer'}}>Khấu trừ</CNavLink></CNavItem>
                        </CNav>
                    </div>

                    <div className="px-4 pb-4">
                        <CTabContent>
                            <SalaryLevelTab />
                            <SalaryGradeTab />
                            <TaxTab />
                            <InsuranceTab />
                            <AllowanceTab />
                            <DeductionTab /> {/* Thêm Tab Khấu trừ */}
                            <DefaultTab title="period" />
                        </CTabContent>
                    </div>
                </CCardBody>
            </CCard>

            {/* CÁC MODAL CŨ GIỮ NGUYÊN */}
            <CModal visible={showSalaryDetailModal} onClose={() => setShowSalaryDetailModal(false)} alignment="center" size="lg">
                <CModalHeader onClose={() => setShowSalaryDetailModal(false)}><CModalTitle className="fw-bold fs-5">Đơn giá tiền lương chi tiết theo đơn vị</CModalTitle></CModalHeader>
                <CModalBody><CTable hover align="middle" className="mb-0 border"><CTableHead color="light"><CTableRow><CTableHeaderCell style={{width: '60%', paddingLeft: '1.5rem'}}>Đơn vị</CTableHeaderCell><CTableHeaderCell className="text-end" style={{width: '40%', paddingRight: '1.5rem'}}>Đơn giá tiền lương</CTableHeaderCell></CTableRow></CTableHead><CTableBody>{MOCK_ORG_DATA.map((item) => (<CTableRow key={item.id}><CTableDataCell style={{paddingLeft: '1.5rem'}}>{item.name}</CTableDataCell><CTableDataCell className="text-end" style={{paddingRight: '1.5rem'}}><CInputGroup size="sm" className="justify-content-end"><CFormInput type="text" className="text-end border-0 bg-transparent p-0" placeholder="-" /></CInputGroup></CTableDataCell></CTableRow>))}</CTableBody></CTable></CModalBody>
                <CModalFooter><CButton color="white" className="border" onClick={() => setShowSalaryDetailModal(false)}>Đóng</CButton></CModalFooter>
            </CModal>

            <CModal visible={showAddRowModal} onClose={() => setShowAddRowModal(false)} alignment="center" size="xl">
                <CModalHeader onClose={() => setShowAddRowModal(false)}><CModalTitle className="fw-bold fs-5">Thêm dòng</CModalTitle></CModalHeader>
                <CModalBody>
                     <div className="mb-4"><CFormLabel className="fw-bold">Chức danh <span className="text-danger">*</span></CFormLabel><CFormSelect value={modalJobTitle} onChange={(e) => setModalJobTitle(e.target.value)}><option>Chọn chức danh</option><option value="Giám đốc">Giám đốc</option><option value="Phó giám đốc">Phó giám đốc</option><option value="Trưởng phòng">Trưởng phòng</option><option value="Nhân viên">Nhân viên</option></CFormSelect></div>
                     <div className="mb-2"><CFormLabel className="fw-bold">Chi tiết thang, bậc lương</CFormLabel></div>
                     <div className="table-responsive border rounded"><CTable bordered align="middle" className="mb-0 text-center"><CTableHead color="light"><CTableRow><CTableHeaderCell style={{minWidth: '120px'}}>Bậc lương</CTableHeaderCell>{Array.from({ length: maxGradeLevel }, (_, i) => (<CTableHeaderCell key={i} style={{minWidth: '80px'}}>{i + 1}</CTableHeaderCell>))}</CTableRow></CTableHead><CTableBody><CTableRow><CTableDataCell className="text-start ps-3">Hệ số</CTableDataCell>{Array.from({ length: maxGradeLevel }, (_, i) => (<CTableDataCell key={i} className="p-1"><CFormInput size="sm" className="border-0 text-center" value={modalCoefficients[i] || ''} onChange={(e) => handleCoefficientChange(i, e.target.value)}/></CTableDataCell>))}</CTableRow></CTableBody></CTable></div>
                </CModalBody>
                <CModalFooter><CButton color="white" className="border" onClick={() => setShowAddRowModal(false)}>Hủy bỏ</CButton><CButton color="success" className="text-white" onClick={handleSaveNewRow}>Lưu</CButton></CModalFooter>
            </CModal>

             {/* --- MODAL THÊM CHÍNH SÁCH PHỤ CẤP --- */}
             <CModal 
                visible={showAllowanceModal} 
                onClose={() => setShowAllowanceModal(false)}
                alignment="center"
                size="xl" 
            >
                <CModalHeader onClose={() => setShowAllowanceModal(false)}>
                    <CModalTitle className="fw-bold fs-5">Thêm chính sách phụ cấp</CModalTitle>
                </CModalHeader>
                <CModalBody>
                     {/* THÔNG TIN CHUNG */}
                     <h6 className="text-uppercase fw-bold text-medium-emphasis mb-3" style={{fontSize: '0.85rem'}}>Thông tin chung</h6>
                     <CRow className="mb-3 align-items-center">
                        <CCol md={2}><CFormLabel className="fw-bold mb-0">Đơn vị áp dụng <span className="text-danger">*</span></CFormLabel></CCol>
                        <CCol md={10}><CFormSelect><option>Thuận Nguyễn Phúc</option></CFormSelect></CCol>
                     </CRow>
                     <CRow className="mb-3 align-items-center">
                        <CCol md={2}><CFormLabel className="fw-bold mb-0">Khoản phụ cấp <span className="text-danger">*</span></CFormLabel></CCol>
                        <CCol md={10}><CFormSelect><option></option></CFormSelect></CCol>
                     </CRow>
                     <CRow className="mb-4 align-items-center">
                        <CCol md={2}><CFormLabel className="fw-bold mb-0">Tên chính sách <span className="text-danger">*</span></CFormLabel></CCol>
                        <CCol md={10}><CFormInput defaultValue="Chính sách" /></CCol>
                     </CRow>

                     {/* GIÁ TRỊ PHỤ CẤP */}
                     <h6 className="text-uppercase fw-bold text-medium-emphasis mb-3" style={{fontSize: '0.85rem'}}>Giá trị phụ cấp</h6>
                     <div className="table-responsive">
                         <CTable bordered align="middle" className="mb-2">
                             <CTableHead color="light">
                                 <CTableRow>
                                     <CTableHeaderCell style={{width: '35%'}}>Vị trí công việc</CTableHeaderCell>
                                     <CTableHeaderCell style={{width: '30%'}}>Định mức</CTableHeaderCell>
                                     <CTableHeaderCell style={{width: '30%'}}>Giá trị</CTableHeaderCell>
                                     <CTableHeaderCell style={{width: '5%'}}></CTableHeaderCell>
                                 </CTableRow>
                             </CTableHead>
                             <CTableBody>
                                 {policyDetails.map((item, index) => (
                                     <CTableRow key={item.id}>
                                         <CTableDataCell className="p-1">
                                             <CFormSelect size="sm" className="border-0">
                                                <option>[Tất cả các vị trí trong đơn vị]</option>
                                             </CFormSelect>
                                         </CTableDataCell>
                                         <CTableDataCell className="p-1">
                                             <CFormInput size="sm" className="border-0" placeholder="Tự động gợi ý công thức và tham số khi gõ" />
                                         </CTableDataCell>
                                         <CTableDataCell className="p-1">
                                             <CFormInput size="sm" className="border-0" />
                                         </CTableDataCell>
                                         <CTableDataCell className="text-center p-1">
                                             {policyDetails.length > 1 && (
                                                <CIcon icon={cilTrash} className="text-danger" style={{cursor: 'pointer'}} onClick={() => handleRemoveDetailRow(item.id)} />
                                             )}
                                         </CTableDataCell>
                                     </CTableRow>
                                 ))}
                             </CTableBody>
                         </CTable>
                         <CButton color="white" className="border text-success fw-bold w-auto" onClick={handleAddDetailRow}>
                             <CIcon icon={cilPlus} className="me-1" /> Thêm vị trí
                         </CButton>
                     </div>
                </CModalBody>
                <CModalFooter>
                    <CButton color="white" className="border" onClick={() => setShowAllowanceModal(false)}>Hủy bỏ</CButton>
                    <CButton color="success" className="text-white" onClick={handleSavePolicy}>Lưu</CButton>
                </CModalFooter>
            </CModal>

             {/* --- MODAL THÊM CHÍNH SÁCH KHẤU TRỪ (MỚI) --- */}
             <CModal 
                visible={showDeductionModal} 
                onClose={() => setShowDeductionModal(false)}
                alignment="center"
                size="xl" 
            >
                <CModalHeader onClose={() => setShowDeductionModal(false)}>
                    <CModalTitle className="fw-bold fs-5">Thêm chính sách khấu trừ</CModalTitle>
                </CModalHeader>
                <CModalBody>
                     {/* THÔNG TIN CHUNG */}
                     <h6 className="text-uppercase fw-bold text-medium-emphasis mb-3" style={{fontSize: '0.85rem'}}>Thông tin chung</h6>
                     <CRow className="mb-3 align-items-center">
                        <CCol md={2}><CFormLabel className="fw-bold mb-0">Đơn vị áp dụng <span className="text-danger">*</span></CFormLabel></CCol>
                        <CCol md={10}><CFormSelect><option>Thuận Nguyễn Phúc</option></CFormSelect></CCol>
                     </CRow>
                     <CRow className="mb-3 align-items-center">
                        <CCol md={2}><CFormLabel className="fw-bold mb-0">Khoản khấu trừ <span className="text-danger">*</span></CFormLabel></CCol>
                        <CCol md={10}><CFormSelect><option></option></CFormSelect></CCol>
                     </CRow>
                     <CRow className="mb-4 align-items-center">
                        <CCol md={2}><CFormLabel className="fw-bold mb-0">Tên chính sách <span className="text-danger">*</span></CFormLabel></CCol>
                        <CCol md={10}><CFormInput defaultValue="Chính sách" /></CCol>
                     </CRow>

                     {/* GIÁ TRỊ KHẤU TRỪ */}
                     <h6 className="text-uppercase fw-bold text-medium-emphasis mb-3" style={{fontSize: '0.85rem'}}>Giá trị khấu trừ</h6>
                     <div className="table-responsive">
                         <CTable bordered align="middle" className="mb-2">
                             <CTableHead color="light">
                                 <CTableRow>
                                     <CTableHeaderCell style={{width: '35%'}}>Vị trí công việc</CTableHeaderCell>
                                     <CTableHeaderCell style={{width: '30%'}}>Định mức</CTableHeaderCell>
                                     <CTableHeaderCell style={{width: '30%'}}>Giá trị</CTableHeaderCell>
                                     <CTableHeaderCell style={{width: '5%'}}></CTableHeaderCell>
                                 </CTableRow>
                             </CTableHead>
                             <CTableBody>
                                 {policyDetails.map((item, index) => (
                                     <CTableRow key={item.id}>
                                         <CTableDataCell className="p-1">
                                             <CFormSelect size="sm" className="border-0">
                                                <option>[Tất cả các vị trí trong đơn vị]</option>
                                             </CFormSelect>
                                         </CTableDataCell>
                                         <CTableDataCell className="p-1">
                                             <CFormInput size="sm" className="border-0" placeholder="Tự động gợi ý công thức và tham số khi gõ" />
                                         </CTableDataCell>
                                         <CTableDataCell className="p-1">
                                             <CFormInput size="sm" className="border-0" />
                                         </CTableDataCell>
                                         <CTableDataCell className="text-center p-1">
                                             {policyDetails.length > 1 && (
                                                <CIcon icon={cilTrash} className="text-danger" style={{cursor: 'pointer'}} onClick={() => handleRemoveDetailRow(item.id)} />
                                             )}
                                         </CTableDataCell>
                                     </CTableRow>
                                 ))}
                             </CTableBody>
                         </CTable>
                         <CButton color="white" className="border text-success fw-bold w-auto" onClick={handleAddDetailRow}>
                             <CIcon icon={cilPlus} className="me-1" /> Thêm vị trí
                         </CButton>
                     </div>
                </CModalBody>
                <CModalFooter>
                    <CButton color="white" className="border" onClick={() => setShowDeductionModal(false)}>Hủy bỏ</CButton>
                    <CButton color="success" className="text-white" onClick={handleSavePolicy}>Lưu</CButton>
                </CModalFooter>
            </CModal>
        </div>
    );
}

export default DefaultParamPage