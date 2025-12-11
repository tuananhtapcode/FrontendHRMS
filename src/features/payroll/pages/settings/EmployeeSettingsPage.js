import { cilCheck, cilChevronLeft, cilChevronRight, cilFilter, cilList, cilPlus, cilReload, cilSearch, cilSettings } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import {
  CBadge,
  CButton,
  CCard,
  CCardBody,
  CCloseButton,
  CDropdown,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
  CFormCheck,
  CFormInput,
  CFormSelect,
  CInputGroup,
  CInputGroupText,
  CNav, CNavItem, CNavLink, // Dropdown items

  // CDropdownItemText, // <-- DÒNG NÀY ĐÃ BỊ GỠ BỎ ĐỂ KHẮC PHỤC LỖI
  COffcanvas,
  COffcanvasBody,
  COffcanvasHeader,
  COffcanvasTitle,
  CSpinner,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
import { useEffect, useMemo, useState } from 'react'

// Import API service và MOCK_DEPARTMENTS
import { getEmployees, MOCK_DEPARTMENTS } from '../../api/employeeApi'

// Import SCSS MỚI
import '../../scss/employee-settings-page.scss'

const EmployeeSettingsPage = () => {
  // 1. KHAI BÁO STATE
  const [employees, setEmployees] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState('employee')
  const [searchTerm, setSearchTerm] = useState('')

  // State cho dropdown "Trạng thái"
  const [selectedStatus, setSelectedStatus] = useState('Active'); // Mặc định là 'Đang làm việc'
  
  // State cho dropdown "Đơn vị"
  const [departmentSearchTerm, setDepartmentSearchTerm] = useState('');
  const [selectedDepartments, setSelectedDepartments] = useState([]); // Array of department IDs
  const [showInactiveDepartments, setShowInactiveDepartments] = useState(false);

  // State cho Offcanvas (Filter Sidebar)
  const [showFilterSidebar, setShowFilterSidebar] = useState(false);
  const [filterCriteria, setFilterCriteria] = useState({
      employeeCode: false,
      fullName: false,
      jobPosition: false,
      gender: false,
      dateOfBirth: false,
      area: false,
      taxCode: false,
      nationality: false, // Giả định có
      phone: false,
      personalEmail: false,
      bankAccount: false,
      bankName: false,
      bankNumber: false,
      studyDate: false,
      hireDate: false,
      laborNature: false,
      directManager: false, // Giả định có
      baseSalary: false,
      salaryTaxFreeAmount: false, // Giả định có
      bhSalary: false,
      socialInsuranceRate: false, // Giả định có
      healthInsuranceRate: false, // Giả định có
      unemploymentInsuranceRate: false, // Giả định có
      companySocialInsuranceRate: false, // Giả định có
      companyHealthInsuranceRate: false, // Giả định có
      companyUnemploymentInsuranceRate: false, // Giả định có
      taxRate: false,
      selfDeduction: false,
      dependents: false,
      unionFee: false,
      healthInsurance: false,
      resignDate: false, // Ngày nghỉ việc
  });


  // 2. HÀM GỌI API (FETCH DATA)
  const fetchData = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await getEmployees()
      setEmployees(data) 
    } catch (err) {
      console.error('Lỗi khi tải dữ liệu:', err)
      setError(err.message || 'Không thể tải dữ liệu nhân viên. Vui lòng thử lại.')
    } finally {
      setLoading(false)
    }
  }

  // 3. USE EFFECT: Chạy 1 lần khi trang vừa mở
  useEffect(() => {
    fetchData()
  }, []) 

  // Hàm render trạng thái (Badge màu xanh/đỏ)
  const getStatusBadge = (rawStatus) => {
    switch (rawStatus) {
      case 'Active': return 'success'
      case 'OnLeave': return 'warning'
      case 'Resigned': 
      case 'Terminated': return 'secondary'
      default: return 'primary'
    }
  }
  
  // Hàm format checkbox (Có / Không)
  const formatBoolean = (bool) => {
      return bool ? 'Có' : 'Không'
  }
  
  // Hàm format tiền tệ
  const formatCurrency = (value) => {
      if (value === null || value === undefined || value === 0) return '-';
      return new Intl.NumberFormat('vi-VN').format(value);
  }

  // Logic lọc nhân viên dựa trên searchTerm, selectedStatus, selectedDepartments
  const filteredEmployees = useMemo(() => {
    let currentFiltered = employees;

    // Lọc theo thanh tìm kiếm chính (Mã NV, Họ và tên)
    if (searchTerm) {
        currentFiltered = currentFiltered.filter(emp => 
            emp.employeeCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
            emp.fullName.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }

    // Lọc theo trạng thái
    if (selectedStatus === 'All') {
        // Không lọc
    } else if (selectedStatus === 'Active') {
        currentFiltered = currentFiltered.filter(emp => emp.rawStatus === 'Active' || emp.rawStatus === 'OnLeave');
    } else if (selectedStatus === 'Resigned') {
        currentFiltered = currentFiltered.filter(emp => emp.rawStatus === 'Resigned' || emp.rawStatus === 'Terminated');
    }

    // Lọc theo đơn vị (multi-select checkbox)
    if (selectedDepartments.length > 0) {
        currentFiltered = currentFiltered.filter(emp => selectedDepartments.includes(emp.departmentId));
    }

    return currentFiltered;
  }, [employees, searchTerm, selectedStatus, selectedDepartments]);
  
  const currentEmployeeCount = filteredEmployees.length;

  // Xử lý thay đổi trạng thái trong Dropdown
  const handleStatusChange = (status) => {
    setSelectedStatus(status);
  };

  // Xử lý tìm kiếm trong Dropdown Đơn vị
  const handleDepartmentSearchChange = (e) => {
      setDepartmentSearchTerm(e.target.value);
  };

  // Lọc danh sách phòng ban hiển thị trong dropdown
  const filteredDepartments = useMemo(() => {
    let filtered = MOCK_DEPARTMENTS;
    if (departmentSearchTerm) {
      filtered = filtered.filter(dep => 
        dep.name.toLowerCase().includes(departmentSearchTerm.toLowerCase())
      );
    }
    if (!showInactiveDepartments) {
        filtered = filtered.filter(dep => dep.is_active);
    }
    return filtered;
  }, [departmentSearchTerm, showInactiveDepartments]);

  // Xử lý chọn/bỏ chọn phòng ban
  const handleDepartmentCheckboxChange = (departmentId) => {
    setSelectedDepartments(prevSelected => 
      prevSelected.includes(departmentId)
        ? prevSelected.filter(id => id !== departmentId)
        : [...prevSelected, departmentId]
    );
  };

  // Xử lý thay đổi trạng thái "Hiển thị đơn vị ngừng theo dõi"
  const handleToggleInactiveDepartments = () => {
      setShowInactiveDepartments(prev => !prev);
  };

  // Xử lý thay đổi filter criteria trong sidebar
  const handleFilterCriteriaChange = (key) => {
      setFilterCriteria(prev => ({
          ...prev,
          [key]: !prev[key]
      }));
  };

  return (
    <div className="employee-settings-page">
      <div className="page-header mb-3 d-flex justify-content-between align-items-center">
        <div>
            <h4 className="mb-1">Nhân viên</h4>
            <span className="text-medium-emphasis">Quản lý thông tin nhân sự ({employees.length} người)</span>
        </div>
        <div className="d-flex align-items-center">
            <CButton variant="outline" color="dark" className="me-2 text-dark">
                <CIcon icon={cilList} className="me-2" /> Nhập khẩu
            </CButton>
            {/* Sử dụng class 'spin-on-loading' từ SCSS */}
            <CButton color="light" className="me-2" onClick={fetchData} disabled={loading}>
                <CIcon 
                    icon={cilReload} 
                    className={`me-1 ${loading ? 'spin-on-loading' : ''}`} 
                /> 
                {loading ? 'Đang tải...' : 'Lấy lại dữ liệu'}
            </CButton>
            <CButton color="primary">
                <CIcon icon={cilPlus} className="me-2" /> Thêm mới
            </CButton>
        </div>
      </div>
      
      {/* FILTER & TABS */}
      <div className="filter-bar d-flex justify-content-between align-items-center mb-3">
        <CInputGroup className="search-group">
            <CInputGroupText><CIcon icon={cilSearch} /></CInputGroupText>
            <CFormInput 
                placeholder="Tìm kiếm" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
        </CInputGroup>
        
        <div className="d-flex align-items-center">
             {/* Dropdown 1: Trạng thái */}
             <CDropdown className="me-2 dropdown-width">
                <CDropdownToggle color="secondary" variant="outline">{
                    selectedStatus === 'All' ? 'Tất cả trạng thái' :
                    selectedStatus === 'Active' ? 'Đang làm việc' : 'Đã nghỉ việc'
                }</CDropdownToggle>
                <CDropdownMenu>
                    <CDropdownItem 
                        onClick={() => handleStatusChange('All')} 
                        active={selectedStatus === 'All'}
                    >
                        Tất cả trạng thái {selectedStatus === 'All' && <CIcon icon={cilCheck} />}
                    </CDropdownItem>
                    <CDropdownItem 
                        onClick={() => handleStatusChange('Active')} 
                        active={selectedStatus === 'Active'}
                    >
                        Đang làm việc {selectedStatus === 'Active' && <CIcon icon={cilCheck} />}
                    </CDropdownItem>
                    <CDropdownItem 
                        onClick={() => handleStatusChange('Resigned')} 
                        active={selectedStatus === 'Resigned'}
                    >
                        Đã nghỉ việc {selectedStatus === 'Resigned' && <CIcon icon={cilCheck} />}
                    </CDropdownItem>
                </CDropdownMenu>
             </CDropdown>

             {/* Dropdown 2: Đơn vị */}
             <CDropdown className="me-3 dropdown-width">
                <CDropdownToggle color="secondary" variant="outline">
                    {selectedDepartments.length === 0 ? 'Tất cả đơn vị' : `${selectedDepartments.length} đơn vị đã chọn`}
                </CDropdownToggle>
                <CDropdownMenu>
                    {/* KHẮC PHỤC LỖI: Thay thế CDropdownItemText bằng div/li có class */}
                    <div className="dropdown-item-text"> 
                        <CInputGroup>
                            <CInputGroupText><CIcon icon={cilSearch} /></CInputGroupText>
                            <CFormInput 
                                placeholder="Tìm kiếm" 
                                value={departmentSearchTerm}
                                onChange={handleDepartmentSearchChange}
                            />
                        </CInputGroup>
                    </div>
                    {/* ----------------------------------------------------------- */}
                    <CDropdownItem divider />
                    {filteredDepartments.map(dep => (
                        <CDropdownItem key={dep.department_id}>
                            <CFormCheck 
                                id={`dept-${dep.department_id}`}
                                label={dep.name}
                                checked={selectedDepartments.includes(dep.department_id)}
                                onChange={() => handleDepartmentCheckboxChange(dep.department_id)}
                            />
                        </CDropdownItem>
                    ))}
                    <CDropdownItem divider />
                    <CDropdownItem>
                        <CFormCheck 
                            id="show-inactive-dept"
                            label="Hiển thị đơn vị ngừng theo dõi"
                            checked={showInactiveDepartments}
                            onChange={handleToggleInactiveDepartments}
                        />
                    </CDropdownItem>
                </CDropdownMenu>
             </CDropdown>

             {/* Icon Filter (Mở Offcanvas) */}
             <CIcon 
                icon={cilFilter} 
                size="lg" 
                className="text-secondary me-2 filter-icon" 
                onClick={() => setShowFilterSidebar(true)} 
                style={{cursor: 'pointer'}} 
            />
             <CIcon icon={cilSettings} size="lg" className="text-secondary settings-icon" style={{cursor: 'pointer'}} />
             <CButton color="light" className="ms-2 icon-button" onClick={fetchData}>
                <CIcon icon={cilReload} className={loading ? 'spin-on-loading' : ''}/>
             </CButton>
        </div>
      </div>
      
      {/* TABS */}
      <CNav variant="tabs" className="mb-3">
          <CNavItem>
              <CNavLink active={activeTab === 'employee'} onClick={() => setActiveTab('employee')} style={{cursor: 'pointer'}}>Nhân viên</CNavLink>
          </CNavItem>
          <CNavItem>
              <CNavLink active={activeTab === 'department'} onClick={() => setActiveTab('department')} style={{cursor: 'pointer'}}>Đơn vị công tác</CNavLink>
          </CNavItem>
      </CNav>


      <CCard>
        <CCardBody>
          {/* TRƯỜNG HỢP 1 & 2 (LOADING & ERROR) */}
          {loading && (<div className="text-center py-5"><CSpinner color="primary" /><p className="mt-2 text-medium-emphasis">Đang tải dữ liệu từ máy chủ...</p></div>)}
          {!loading && error && (<div className="text-center py-5 text-danger"><p className="mb-2">Lỗi: {error}</p><CButton color="light" size="sm" onClick={fetchData}>Thử lại</CButton></div>)}

          {/* TRƯỜNG HỢP 3: HIỂN THỊ DỮ LIỆU */}
          {!loading && !error && (
            <div className="table-responsive">
              <CTable hover align="middle" className="mb-0 border text-nowrap">
                <CTableHead color="light">
                  <CTableRow>
                    <CTableHeaderCell style={{width: '30px'}}><CFormCheck /></CTableHeaderCell>
                    <CTableHeaderCell style={{minWidth: '120px'}}>Mã nhân viên</CTableHeaderCell>
                    <CTableHeaderCell style={{minWidth: '200px'}}>Họ và tên</CTableHeaderCell>
                    
                    {/* THÔNG TIN LƯƠNG & BH (như ảnh image_3c147e.jpg) */}
                    <CTableHeaderCell style={{minWidth: '150px'}}>Tính chất lao động</CTableHeaderCell>
                    <CTableHeaderCell className="text-end" style={{minWidth: '120px'}}>Lương cơ bản</CTableHeaderCell>
                    <CTableHeaderCell className="text-end" style={{minWidth: '120px'}}>Lương đóng BH</CTableHeaderCell>
                    <CTableHeaderCell style={{minWidth: '150px'}}>Thuế suất</CTableHeaderCell>
                    <CTableHeaderCell className="text-center" style={{minWidth: '120px'}}>Số người phụ thuộc</CTableHeaderCell>
                    <CTableHeaderCell style={{minWidth: '150px'}}>Giảm trừ bản thân</CTableHeaderCell>
                    <CTableHeaderCell style={{minWidth: '150px'}}>Tham gia công đoàn</CTableHeaderCell>
                    <CTableHeaderCell style={{minWidth: '150px'}}>Tham gia bảo hiểm</CTableHeaderCell>
                    
                    {/* THÔNG TIN CÔNG VIỆC (Từ các ảnh khác) */}
                    <CTableHeaderCell style={{minWidth: '150px'}}>Đơn vị công tác</CTableHeaderCell>
                    <CTableHeaderCell style={{minWidth: '150px'}}>Vị trí công việc</CTableHeaderCell>
                    <CTableHeaderCell style={{minWidth: '120px'}}>Khu vực làm việc</CTableHeaderCell>
                    <CTableHeaderCell style={{minWidth: '120px'}}>Mã số thuế</CTableHeaderCell>
                    <CTableHeaderCell style={{minWidth: '200px'}}>Email cơ quan</CTableHeaderCell>
                    <CTableHeaderCell style={{minWidth: '200px'}}>Email cá nhân</CTableHeaderCell>
                    <CTableHeaderCell style={{minWidth: '120px'}}>Ngày thử việc</CTableHeaderCell>
                    <CTableHeaderCell style={{minWidth: '120px'}}>Ngày chính thức</CTableHeaderCell>
                    <CTableHeaderCell style={{minWidth: '120px'}}>Ngày học việc</CTableHeaderCell>
                    <CTableHeaderCell style={{minWidth: '120px'}}>Trạng thái</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {currentEmployeeCount > 0 ? (
                    filteredEmployees.map((emp) => (
                      <CTableRow key={emp.id}>
                        <CTableDataCell><CFormCheck /></CTableDataCell>
                        <CTableDataCell><strong>{emp.employeeCode}</strong></CTableDataCell>
                        <CTableDataCell>
                          <div className="d-flex align-items-center">
                              <div className="bg-light rounded-circle d-flex justify-content-center align-items-center me-2 avatar-badge" style={{width: 32, height: 32}}>
                                  <CBadge color={getStatusBadge(emp.rawStatus)} className="p-1 rounded-circle">
                                     {/* Lấy 2 chữ cái đầu của tên và họ */}
                                     {emp.fullName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                                  </CBadge>
                              </div>
                              {emp.fullName}
                          </div>
                        </CTableDataCell>
                        
                        {/* THÔNG TIN LƯƠNG & BH */}
                        <CTableDataCell>{emp.laborNature || '-'}</CTableDataCell>
                        <CTableDataCell className="text-end">{formatCurrency(emp.baseSalary)}</CTableDataCell>
                        <CTableDataCell className="text-end">{formatCurrency(emp.bhSalary)}</CTableDataCell>
                        <CTableDataCell>{emp.taxMethod || '-'}</CTableDataCell>
                        <CTableDataCell className="text-center">{emp.dependents}</CTableDataCell>
                        <CTableDataCell>{formatBoolean(emp.selfDeduction)}</CTableDataCell>
                        <CTableDataCell>{formatBoolean(emp.unionFee)}</CTableDataCell>
                        <CTableDataCell>{formatBoolean(emp.healthInsurance)}</CTableDataCell>
                        
                        {/* THÔNG TIN CÔNG VIỆC */}
                        <CTableDataCell>{emp.departmentName}</CTableDataCell>
                        <CTableDataCell>{emp.jobPositionName}</CTableDataCell>
                        <CTableDataCell>{emp.area}</CTableDataCell>
                        <CTableDataCell>{emp.taxCode || '-'}</CTableDataCell>
                        <CTableDataCell>{emp.email || '-'}</CTableDataCell>
                        <CTableDataCell>{emp.personalEmail || '-'}</CTableDataCell>
                        <CTableDataCell>{emp.hireDate || '-'}</CTableDataCell>
                        <CTableDataCell>{emp.officialDate || '-'}</CTableDataCell>
                        <CTableDataCell>{emp.studyDate || '-'}</CTableDataCell>
                        <CTableDataCell>
                          <CBadge color={getStatusBadge(emp.rawStatus)}>{emp.displayStatus}</CBadge>
                        </CTableDataCell>
                      </CTableRow>
                    ))
                  ) : (
                    <CTableRow>
                      <CTableDataCell colSpan="23" className="text-center py-4">
                        Không có dữ liệu nhân viên
                      </CTableDataCell>
                    </CTableRow>
                  )}
                </CTableBody>
              </CTable>
            </div>
          )}
        </CCardBody>
        <div className="p-3 border-top d-flex justify-content-between align-items-center">
             <span>Tổng số bản ghi: {currentEmployeeCount}</span>
             <div className="d-flex align-items-center">
                 <span>Số bản ghi/trang</span>
                 <CFormSelect size="sm" className="ms-2" style={{ width: '70px' }}><option>25</option></CFormSelect>
                 <span className="ms-3 me-3">1 - {currentEmployeeCount} bản ghi</span>
                 <CButton color="link" shape="square" size="sm" disabled>
                   <CIcon icon={cilChevronLeft} />
                 </CButton>
                 <CButton color="link" shape="square" size="sm" disabled>
                   <CIcon icon={cilChevronRight} />
                 </CButton>
             </div>
        </div>
      </CCard>

      {/* Offcanvas cho bộ lọc (Filter Sidebar) */}
      <COffcanvas 
        placement="end" 
        visible={showFilterSidebar} 
        onHide={() => setShowFilterSidebar(false)}
        className="custom-offcanvas-width" // Có thể thêm custom width
      >
        <COffcanvasHeader>
          <COffcanvasTitle>Bộ lọc</COffcanvasTitle>
          <CCloseButton className="text-reset" onClick={() => setShowFilterSidebar(false)} />
        </COffcanvasHeader>
        <COffcanvasBody>
          {/* Phần tìm kiếm trong Offcanvas */}
          <div className="filter-section">
              <CInputGroup>
                <CInputGroupText><CIcon icon={cilSearch} /></CInputGroupText>
                <CFormInput placeholder="Tìm kiếm" />
              </CInputGroup>
          </div>
          
          {/* Các mục lọc */}
          <div className="filter-section">
              <h6>Thông tin chung</h6>
              <CFormCheck 
                id="filter-employeeCode" 
                label="Mã nhân viên" 
                checked={filterCriteria.employeeCode} 
                onChange={() => handleFilterCriteriaChange('employeeCode')} 
              />
              <CFormCheck 
                id="filter-fullName" 
                label="Họ và tên" 
                checked={filterCriteria.fullName} 
                onChange={() => handleFilterCriteriaChange('fullName')} 
              />
              <CFormCheck 
                id="filter-jobPosition" 
                label="Vị trí công việc" 
                checked={filterCriteria.jobPosition} 
                onChange={() => handleFilterCriteriaChange('jobPosition')} 
              />
              <CFormCheck 
                id="filter-gender" 
                label="Giới tính" 
                checked={filterCriteria.gender} 
                onChange={() => handleFilterCriteriaChange('gender')} 
              />
              <CFormCheck 
                id="filter-dateOfBirth" 
                label="Ngày sinh" 
                checked={filterCriteria.dateOfBirth} 
                onChange={() => handleFilterCriteriaChange('dateOfBirth')} 
              />
              <CFormCheck 
                id="filter-area" 
                label="Khu vực làm việc" 
                checked={filterCriteria.area} 
                onChange={() => handleFilterCriteriaChange('area')} 
              />
              <CFormCheck 
                id="filter-taxCode" 
                label="Mã số thuế" 
                checked={filterCriteria.taxCode} 
                onChange={() => handleFilterCriteriaChange('taxCode')} 
              />
              <CFormCheck 
                id="filter-nationality" 
                label="Quốc tịch" 
                checked={filterCriteria.nationality} 
                onChange={() => handleFilterCriteriaChange('nationality')} 
              />
              <CFormCheck 
                id="filter-phone" 
                label="Điện thoại" 
                checked={filterCriteria.phone} 
                onChange={() => handleFilterCriteriaChange('phone')} 
              />
              <CFormCheck 
                id="filter-personalEmail" 
                label="Email cá nhân" 
                checked={filterCriteria.personalEmail} 
                onChange={() => handleFilterCriteriaChange('personalEmail')} 
              />
              <CFormCheck 
                id="filter-bankAccount" 
                label="Tài khoản ngân hàng" 
                checked={filterCriteria.bankAccount} 
                onChange={() => handleFilterCriteriaChange('bankAccount')} 
              />
              <CFormCheck 
                id="filter-bankName" 
                label="Ngân hàng" 
                checked={filterCriteria.bankName} 
                onChange={() => handleFilterCriteriaChange('bankName')} 
              />
              <CFormCheck 
                id="filter-bankNumber" 
                label="Chi nhánh" 
                checked={filterCriteria.bankNumber} 
                onChange={() => handleFilterCriteriaChange('bankNumber')} 
              />
          </div>

          <div className="filter-section">
              <h6>Thông tin hợp đồng & lương</h6>
              <CFormCheck 
                id="filter-studyDate" 
                label="Ngày học việc" 
                checked={filterCriteria.studyDate} 
                onChange={() => handleFilterCriteriaChange('studyDate')} 
              />
              <CFormCheck 
                id="filter-hireDate" 
                label="Ngày thử việc" 
                checked={filterCriteria.hireDate} 
                onChange={() => handleFilterCriteriaChange('hireDate')} 
              />
              <CFormCheck 
                id="filter-officialDate" 
                label="Ngày chính thức" 
                checked={filterCriteria.officialDate} 
                onChange={() => handleFilterCriteriaChange('officialDate')} 
              />
              <CFormCheck 
                id="filter-laborNature" 
                label="Tính chất lao động" 
                checked={filterCriteria.laborNature} 
                onChange={() => handleFilterCriteriaChange('laborNature')} 
              />
              <CFormCheck 
                id="filter-directManager" 
                label="Quản lý trực tiếp" 
                checked={filterCriteria.directManager} 
                onChange={() => handleFilterCriteriaChange('directManager')} 
              />
              <CFormCheck 
                id="filter-baseSalary" 
                label="Lương cơ bản" 
                checked={filterCriteria.baseSalary} 
                onChange={() => handleFilterCriteriaChange('baseSalary')} 
              />
              <CFormCheck 
                id="filter-salaryTaxFreeAmount" 
                label="Tiền lương miễn thuế" 
                checked={filterCriteria.salaryTaxFreeAmount} 
                onChange={() => handleFilterCriteriaChange('salaryTaxFreeAmount')} 
              />
              <CFormCheck 
                id="filter-bhSalary" 
                label="Lương đóng BH" 
                checked={filterCriteria.bhSalary} 
                onChange={() => handleFilterCriteriaChange('bhSalary')} 
              />
              <CFormCheck 
                id="filter-socialInsuranceRate" 
                label="Tỉ lệ đóng BHXH của nhân viên" 
                checked={filterCriteria.socialInsuranceRate} 
                onChange={() => handleFilterCriteriaChange('socialInsuranceRate')} 
              />
              <CFormCheck 
                id="filter-healthInsuranceRate" 
                label="Tỉ lệ đóng BHYT của nhân viên" 
                checked={filterCriteria.healthInsuranceRate} 
                onChange={() => handleFilterCriteriaChange('healthInsuranceRate')} 
              />
              <CFormCheck 
                id="filter-unemploymentInsuranceRate" 
                label="Tỉ lệ đóng BHTN của nhân viên" 
                checked={filterCriteria.unemploymentInsuranceRate} 
                onChange={() => handleFilterCriteriaChange('unemploymentInsuranceRate')} 
              />
              <CFormCheck 
                id="filter-companySocialInsuranceRate" 
                label="Tỉ lệ đóng BHXH của doanh nghiệp" 
                checked={filterCriteria.companySocialInsuranceRate} 
                onChange={() => handleFilterCriteriaChange('companySocialInsuranceRate')} 
              />
              <CFormCheck 
                id="filter-companyHealthInsuranceRate" 
                label="Tỉ lệ đóng BHYT của doanh nghiệp" 
                checked={filterCriteria.companyHealthInsuranceRate} 
                onChange={() => handleFilterCriteriaChange('companyHealthInsuranceRate')} 
              />
              <CFormCheck 
                id="filter-companyUnemploymentInsuranceRate" 
                label="Tỉ lệ đóng BHTN của doanh nghiệp" 
                checked={filterCriteria.companyUnemploymentInsuranceRate} 
                onChange={() => handleFilterCriteriaChange('companyUnemploymentInsuranceRate')} 
              />
              <CFormCheck 
                id="filter-taxRate" 
                label="Thuế suất" 
                checked={filterCriteria.taxRate} 
                onChange={() => handleFilterCriteriaChange('taxRate')} 
              />
              <CFormCheck 
                id="filter-selfDeduction" 
                label="Giảm trừ bản thân" 
                checked={filterCriteria.selfDeduction} 
                onChange={() => handleFilterCriteriaChange('selfDeduction')} 
              />
              <CFormCheck 
                id="filter-dependents" 
                label="Số người phụ thuộc" 
                checked={filterCriteria.dependents} 
                onChange={() => handleFilterCriteriaChange('dependents')} 
              />
              <CFormCheck 
                id="filter-unionFee" 
                label="Tham gia công đoàn" 
                checked={filterCriteria.unionFee} 
                onChange={() => handleFilterCriteriaChange('unionFee')} 
              />
              <CFormCheck 
                id="filter-healthInsurance" 
                label="Tham gia bảo hiểm" 
                checked={filterCriteria.healthInsurance} 
                onChange={() => handleFilterCriteriaChange('healthInsurance')} 
              />
              <CFormCheck 
                id="filter-resignDate" 
                label="Ngày nghỉ việc" 
                checked={filterCriteria.resignDate} 
                onChange={() => handleFilterCriteriaChange('resignDate')} 
              />
          </div>
        </COffcanvasBody>
        <div className="offcanvas-footer">
            <CButton color="light" onClick={() => setShowFilterSidebar(false)}>Bỏ lọc</CButton>
            <CButton color="primary" onClick={() => setShowFilterSidebar(false)}>Áp dụng</CButton>
        </div>
      </COffcanvas>
    </div>
  )
}

export default EmployeeSettingsPage
