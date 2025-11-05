import {
  CButton,
  CCol,
  CDropdown,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
  CRow,
  CTable,
} from '@coreui/react'
import { useState } from 'react'
import style from '../css.module.scss'

const ProfileView = () => {
  const dropdownItems = [
    'Tất cả nhân viên',
    'Đang làm việc',
    'Đã nghỉ việc',
    'Thử việc',
    'Tiếp nhận tuần này',
    'Chưa có hợp đồng',
  ]

  const [selectOption, setSelectOption] = useState(dropdownItems[0])

  const columns = [
    {
      key: 'id',
      label: 'Mã nhân viên',
      _props: { scope: 'col' },
    },
    {
      key: 'fullName',
      label: 'Họ và tên',
      _props: { scope: 'col' },
    },
    {
      key: 'gender',
      label: 'Giới tính',
      _props: { scope: 'col' },
    },
    {
      key: 'dateOfBirth',
      label: 'Ngày sinh',
      _props: { scope: 'col' },
    },
    {
      key: 'phoneNumber',
      label: 'Số điện thoại',
      _props: { scope: 'col' },
    },
    {
      key: 'companyEmail',
      label: 'Email cơ quan',
      _props: { scope: 'col' },
    },
    {
      key: 'jobPosition',
      label: 'Vị trí công việc',
      _props: { scope: 'col' },
    },
    {
      key: 'workUnit',
      label: 'Đơn vị công tác',
      _props: { scope: 'col' },
    },
    {
      key: 'trialDate',
      label: 'Ngày thử việc',
      _props: { scope: 'col' },
    },
    {
      key: 'officialDate',
      label: 'Ngày chính thức',
      _props: { scope: 'col' },
    },
    {
      key: 'contractType',
      label: 'Loại hợp đồng',
      _props: { scope: 'col' },
    },
    {
      key: 'laborStatus',
      label: 'Trạng thái lao động',
      _props: { scope: 'col' },
    },
    {
      key: 'seniority',
      label: 'Thâm niên',
      _props: { scope: 'col' },
    },
    {
      key: 'insuranceParticipation',
      label: 'Tham gia bảo hiểm',
      _props: { scope: 'col' },
    },
  ]
  const employees = [
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

  return (
    <>
      <CRow>
        <CCol xs="auto" className="me-auto">
          <CDropdown>
            <CDropdownToggle size="lg" className="fw-bold">
              {selectOption}
            </CDropdownToggle>
            <CDropdownMenu>
              {dropdownItems.map((item, index) => {
                return (
                  <CDropdownItem key={index} onClick={() => setSelectOption(item)}>
                    {item}
                  </CDropdownItem>
                )
              })}
            </CDropdownMenu>
          </CDropdown>
        </CCol>
        <CCol xs="auto">
          <CButton
            as="a"
            color="info"
            className="text-white fw-bold"
            role="button"
            href="/#/employees-information/profile/create"
          >
            Thêm
          </CButton>
        </CCol>
      </CRow>
      <CTable
        responsive
        columns={columns}
        items={employees}
        striped
        bordered
        hover
        className={style.customTable}
      />
    </>
  )
}

export default ProfileView
