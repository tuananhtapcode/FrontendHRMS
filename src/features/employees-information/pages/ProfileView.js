import { useState } from 'react'
import { CRow, CCol, CButton, CFormInput, CCard, CCardBody } from '@coreui/react'
import { cilPlus } from '@coreui/icons'
import { MyDropdown } from '../components/common/MyComponents'
import CIcon from '@coreui/icons-react'
import { SearchableTable } from '../../../components/zReuse/zComponents'
import { employeeColumns } from './components/tableColumns'

const data = [
  {
    id: 'NV001',
    fullName: 'Nguyễn Văn A',
    gender: 'Nam',
    dateOfBirth: '1995-03-12',
    phoneNumber: '0905123456',
    companyEmail: 'nguyenvana@company.com',
    jobPosition: 'Lập trình viên Frontend',
    workUnit: 'Phòng Công nghệ thông tin',
    trialDate: '2022-01-10',
    officialDate: '2022-04-10',
    contractType: 'Hợp đồng 1 năm',
    laborStatus: 'Chính thức',
    seniority: '2 năm 6 tháng',
    insuranceParticipation: 'Có',
  },
  {
    id: 'NV002',
    fullName: 'Trần Thị B',
    gender: 'Nữ',
    dateOfBirth: '1998-08-25',
    phoneNumber: '0987123456',
    companyEmail: 'tranthib@company.com',
    jobPosition: 'Nhân sự',
    workUnit: 'Phòng Hành chính - Nhân sự',
    trialDate: '2023-02-01',
    officialDate: '2023-05-01',
    contractType: 'Hợp đồng không thời hạn',
    laborStatus: 'Chính thức',
    seniority: '1 năm 4 tháng',
    insuranceParticipation: 'Có',
  },
  {
    id: 'NV003',
    fullName: 'Lê Hoàng C',
    gender: 'Nam',
    dateOfBirth: '1997-11-05',
    phoneNumber: '0912123123',
    companyEmail: 'lehoangc@company.com',
    jobPosition: 'Kế toán viên',
    workUnit: 'Phòng Kế toán',
    trialDate: '2024-06-15',
    officialDate: '',
    contractType: 'Thử việc',
    laborStatus: 'Thử việc',
    seniority: '3 tháng',
    insuranceParticipation: 'Chưa',
  },
  {
    id: 'NV004',
    fullName: 'Phạm Minh D',
    gender: 'Nữ',
    dateOfBirth: '1992-05-18',
    phoneNumber: '0935456789',
    companyEmail: 'phamminhd@company.com',
    jobPosition: 'Trưởng phòng Marketing',
    workUnit: 'Phòng Marketing',
    trialDate: '2020-03-01',
    officialDate: '2020-06-01',
    contractType: 'Hợp đồng dài hạn',
    laborStatus: 'Nghỉ thai sản',
    seniority: '5 năm',
    insuranceParticipation: 'Có',
  },
  {
    id: 'NV005',
    fullName: 'Đỗ Quốc E',
    gender: 'Nam',
    dateOfBirth: '1990-09-10',
    phoneNumber: '0977543210',
    companyEmail: 'doquoce@company.com',
    jobPosition: 'Bảo vệ',
    workUnit: 'Ban An ninh',
    trialDate: '2019-01-01',
    officialDate: '2019-04-01',
    contractType: 'Hợp đồng 3 năm',
    laborStatus: 'Chính thức',
    seniority: '6 năm',
    insuranceParticipation: 'Có',
  },
]

const dropdownItems = [
  'Tất cả nhân viên',
  'Đang làm việc',
  'Đã nghỉ việc',
  'Thử việc',
  'Tiếp nhận tuần này',
  'Chưa có hợp đồng',
]

const ProfileView = () => {
  const [selectOption, setSelectOption] = useState(dropdownItems[0])
  const [searchText, setSearchText] = useState('')

  // Filter dữ liệu theo dropdown + search
  const filteredData = data.filter(
    (item) =>
      (selectOption === 'Tất cả nhân viên' || item.laborStatus === selectOption) &&
      (item.fullName.toLowerCase().includes(searchText.toLowerCase()) ||
        item.id.toLowerCase().includes(searchText.toLowerCase())),
  )

  return (
    <CCard className="p-3 shadow-sm">
      <CCardBody>
        <CRow className="align-items-center mb-3" style={{ gap: '12px' }}>
          {/* Dropdown + Search */}
          <CCol md={4} sm={12}>
            <MyDropdown
              title="Trạng thái nhân viên"
              defaultValue={selectOption}
              items={dropdownItems}
              handleClick={setSelectOption}
            />
          </CCol>
          <CCol md={4} sm={12}>
            <CFormInput
              placeholder="Tìm theo tên hoặc mã NV..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </CCol>
          <CCol xs="auto">
            <CButton
              color="info"
              className="text-white fw-bold d-flex align-items-center gap-1"
              href="/#/employees-information/profile/create"
            >
              <CIcon icon={cilPlus} /> Thêm
            </CButton>
          </CCol>
        </CRow>

        {/* Table */}
        <SearchableTable columns={employeeColumns} data={filteredData} />
      </CCardBody>
    </CCard>
  )
}

export default ProfileView
