// --- CẤU HÌNH ---
const API_BASE_URL = '/api/payroll'; 
const API_EMPLOYEE_ENDPOINT = `${API_BASE_URL}/employees`;

// --- DỮ LIỆU PHỤ TRỢ (Giả lập các bảng Department và JobPosition) ---
const MOCK_DEPARTMENTS = [
    { department_id: 1, name: 'Phòng Kỹ thuật', is_active: true },
    { department_id: 2, name: 'Phòng Kế toán', is_active: true },
    { department_id: 3, name: 'Phòng Nhân sự', is_active: true },
    { department_id: 4, name: 'Phòng Kinh doanh', is_active: true },
    { department_id: 5, name: 'Phòng Marketing', is_active: true },
    { department_id: 6, name: 'Phòng Chăm sóc Khách hàng', is_active: false }, // Đơn vị ngừng theo dõi
];

const MOCK_JOB_POSITIONS = [
    { job_position_id: 1, name: 'Lập trình viên' },
    { job_position_id: 2, name: 'Kế toán viên' },
    { job_position_id: 3, name: 'Trưởng phòng' },
    { job_position_id: 4, name: 'Tester' },
    { job_position_id: 5, name: 'Chuyên viên' },
    { job_position_id: 6, name: 'Giám đốc' },
];

// --- DỮ LIỆU NHÂN VIÊN GỐC (10 BẢN GHI) ---
const RAW_EMPLOYEES = [
    { 
        employee_id: 1, employee_code: 'NV000001', full_name: 'Thuận Nguyễn', gender: 'Male', date_of_birth: '2000-01-01', 
        hire_date: '2024-05-01', official_date: '2025-05-01', resigned_date: null, email: 'thuan.n@cty.com', study_date: null,
        department_id: 1, job_position_id: 1, status: 'Active', 
        tax_code: '837264872', personal_email: 'thuaniphone12@gmail.com', area: 'Khu vực 1',
        labor_nature: 'Chính thức', base_salary: 15000000, bh_salary: 15000000, 
        tax_method: 'Theo biểu lũy tiến', dependents: 0, self_deduction: true, union_fee: false, health_insurance: true,
    },
    { 
        employee_id: 2, employee_code: 'NV000002', full_name: 'Nguyễn Bình Tuấn Anh', gender: 'Male', date_of_birth: '1998-11-12', 
        hire_date: '2024-09-01', official_date: null, resigned_date: null, email: 'tuananh.n@cty.com', study_date: '2024-09-01',
        department_id: 2, job_position_id: 2, status: 'Active', 
        tax_code: '912847293', personal_email: 'tuananhnguyen@gmail.com', area: 'Khu vực 2',
        labor_nature: 'Thử việc', base_salary: 10000000, bh_salary: 10000000, 
        tax_method: 'Theo biểu lũy tiến', dependents: 2, self_deduction: true, union_fee: true, health_insurance: true,
    },
    { 
        employee_id: 3, employee_code: 'NV000003', full_name: 'Phạm Thanh Hương', gender: 'Female', date_of_birth: '1990-02-28', 
        hire_date: '2023-01-01', official_date: '2023-04-01', resigned_date: '2025-10-25', email: 'huong.p@cty.com', study_date: null,
        department_id: 3, job_position_id: 3, status: 'Resigned', 
        tax_code: '123456789', personal_email: 'huongpham@gmail.com', area: 'Khác',
        labor_nature: 'Chính thức', base_salary: 25000000, bh_salary: 20000000, 
        tax_method: 'Theo biểu lũy tiến', dependents: 1, self_deduction: true, union_fee: true, health_insurance: true,
    },
    { 
        employee_id: 4, employee_code: 'NV000004', full_name: 'Hoàng Minh Đức', gender: 'Male', date_of_birth: '1993-07-10', 
        hire_date: '2025-01-15', official_date: '2025-04-15', resigned_date: null, email: 'duc.h@cty.com', study_date: null,
        department_id: 1, job_position_id: 4, status: 'Active', 
        tax_code: '998877665', personal_email: 'minhduc789@gmail.com', area: 'Khu vực 1',
        labor_nature: 'Chính thức', base_salary: 13000000, bh_salary: 13000000, 
        tax_method: 'Theo biểu lũy tiến', dependents: 0, self_deduction: true, union_fee: false, health_insurance: true,
    },
    { 
        employee_id: 5, employee_code: 'NV000005', full_name: 'Vũ Thị Mai', gender: 'Female', date_of_birth: '1996-03-22', 
        hire_date: '2024-11-01', official_date: null, resigned_date: null, email: 'mai.v@cty.com', study_date: '2024-11-01',
        department_id: 4, job_position_id: 5, status: 'Active', 
        tax_code: '665544332', personal_email: 'vuthi.mai@gmail.com', area: 'Khu vực 3',
        labor_nature: 'Thử việc', base_salary: 11000000, bh_salary: 11000000, 
        tax_method: 'Theo biểu lũy tiến', dependents: 0, self_deduction: true, union_fee: false, health_insurance: true,
    },
    { 
        employee_id: 6, employee_code: 'NV000006', full_name: 'Trần Văn Long', gender: 'Male', date_of_birth: '1985-12-05', 
        hire_date: '2022-01-01', official_date: '2022-04-01', resigned_date: null, email: 'long.t@cty.com', study_date: null,
        department_id: 5, job_position_id: 6, status: 'OnLeave', 
        tax_code: '112233445', personal_email: 'longtran@gmail.com', area: 'Trụ sở chính',
        labor_nature: 'Chính thức', base_salary: 35000000, bh_salary: 20000000, 
        tax_method: 'Theo biểu lũy tiến', dependents: 3, self_deduction: true, union_fee: true, health_insurance: true,
    },
    { 
        employee_id: 7, employee_code: 'NV000007', full_name: 'Lý Kim Chi', gender: 'Female', date_of_birth: '1997-04-25', 
        hire_date: '2024-06-01', official_date: '2024-09-01', resigned_date: null, email: 'chi.l@cty.com', study_date: null,
        department_id: 2, job_position_id: 2, status: 'Active', 
        tax_code: '543210987', personal_email: 'lykimchi@gmail.com', area: 'Khu vực 2',
        labor_nature: 'Chính thức', base_salary: 9500000, bh_salary: 9500000, 
        tax_method: 'Theo biểu lũy tiến', dependents: 0, self_deduction: true, union_fee: false, health_insurance: true,
    },
    { 
        employee_id: 8, employee_code: 'NV000008', full_name: 'Ngô Thúy Hằng', gender: 'Female', date_of_birth: '1994-08-08', 
        hire_date: '2023-05-20', official_date: '2023-08-20', resigned_date: null, email: 'hang.n@cty.com', study_date: null,
        department_id: 3, job_position_id: 5, status: 'Active', 
        tax_code: '789012345', personal_email: 'ngothuyhang@gmail.com', area: 'Trụ sở chính',
        labor_nature: 'Chính thức', base_salary: 18000000, bh_salary: 18000000, 
        tax_method: 'Theo biểu lũy tiến', dependents: 1, self_deduction: true, union_fee: true, health_insurance: true,
    },
    { 
        employee_id: 9, employee_code: 'NV000009', full_name: 'Bùi Đức Tài', gender: 'Male', date_of_birth: '1999-09-09', 
        hire_date: '2025-02-01', official_date: null, resigned_date: null, email: 'tai.b@cty.com', study_date: '2025-02-01',
        department_id: 1, job_position_id: 1, status: 'Active', 
        tax_code: '456789012', personal_email: 'buidoctai@gmail.com', area: 'Khu vực 1',
        labor_nature: 'Thử việc', base_salary: 14000000, bh_salary: 14000000, 
        tax_method: 'Theo biểu lũy tiến', dependents: 0, self_deduction: true, union_fee: false, health_insurance: true,
    },
    { 
        employee_id: 10, employee_code: 'NV000010', full_name: 'Đoàn Phương Thảo', gender: 'Female', date_of_birth: '1991-03-03', 
        hire_date: '2021-10-01', official_date: '2022-01-01', resigned_date: null, email: 'thao.d@cty.com', study_date: null,
        department_id: 4, job_position_id: 3, status: 'Terminated', 
        tax_code: '009988776', personal_email: 'phuongthao@gmail.com', area: 'Khu vực 3',
        labor_nature: 'Chính thức', base_salary: 22000000, bh_salary: 18000000, 
        tax_method: 'Theo biểu lũy tiến', dependents: 4, self_deduction: true, union_fee: true, health_insurance: true,
    },
];


// --- MAPPER (Chuyển đổi từ SQL snake_case sang JS camelCase và join tên) ---
const mapEmployeeData = (employee) => {
    const department = MOCK_DEPARTMENTS.find(d => d.department_id === employee.department_id);
    const jobPosition = MOCK_JOB_POSITIONS.find(j => j.job_position_id === employee.job_position_id);
    
    return {
        id: employee.employee_id,
        employeeCode: employee.employee_code,
        fullName: employee.full_name,
        gender: employee.gender === 'Male' ? 'Nam' : (employee.gender === 'Female' ? 'Nữ' : 'Khác'),
        dateOfBirth: employee.date_of_birth, 
        departmentName: department ? department.name : 'N/A', 
        departmentId: department ? department.department_id : null, // Thêm departmentId để lọc
        departmentIsActive: department ? department.is_active : false, // Thêm trạng thái đơn vị
        jobPositionName: jobPosition ? jobPosition.name : 'N/A', 
        rawStatus: employee.status, 
        displayStatus: (
             employee.status === 'Active' ? 'Đang làm việc' : 
             employee.status === 'Resigned' ? 'Đã nghỉ' :
             employee.status === 'OnLeave' ? 'Nghỉ phép' : 'Khác'
        ),
        
        // --- CÁC TRƯỜNG MỚI ---
        hireDate: employee.hire_date, 
        officialDate: employee.official_date,
        laborNature: employee.labor_nature,
        baseSalary: employee.base_salary,
        bhSalary: employee.bh_salary,
        taxMethod: employee.tax_method,
        dependents: employee.dependents,
        selfDeduction: employee.self_deduction,
        unionFee: employee.union_fee,
        healthInsurance: employee.health_insurance,
        taxCode: employee.tax_code,
        personalEmail: employee.personal_email,
        area: employee.area,
        studyDate: employee.study_date, 
        resignedDate: employee.resigned_date,
        email: employee.email // Email cơ quan
    };
};

const MAPPED_EMPLOYEES = RAW_EMPLOYEES.map(mapEmployeeData);


/**
 * Hàm lấy danh sách nhân viên.
 * QUAN TRỌNG: Hàm này phải là export const để Named Import hoạt động.
 */
export const getEmployees = async () => {
    // ... (logic fetch và fallback giữ nguyên)
    if (typeof fetch === 'function') {
        try {
            const response = await fetch(API_EMPLOYEE_ENDPOINT);
            if (response.ok) {
                const data = await response.json();
                return data;
            } else {
                throw new Error(`Lỗi API: ${response.status} ${response.statusText}`);
            }
        } catch (error) {
            // Fallback: Sử dụng dữ liệu Mock đã được map
            return new Promise((resolve) => {
                setTimeout(() => resolve(MAPPED_EMPLOYEES), 500);
            });
        }
    }
    
    // Trường hợp cuối: chỉ dùng Mock data
    return new Promise((resolve) => {
        setTimeout(() => resolve(MAPPED_EMPLOYEES), 500);
    });
};

// Export thêm các MOCK DATA để dùng trong filter
export { MOCK_DEPARTMENTS, MOCK_JOB_POSITIONS };
