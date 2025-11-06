import { CDropdown, CDropdownItem, CDropdownMenu, CDropdownToggle, CTable } from '@coreui/react'
import style from '../../css.module.scss'

const EmployeeTable = ({ data }) => {
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

  return (
    <CTable
      responsive
      columns={columns}
      items={data}
      striped
      bordered
      hover
      className={style.customTable}
    />
  )
}

const MyDropdown = ({ title, defaultValue, items, handleClick }) => {
  return (
    <>
      <div style={{ marginBottom: 4, color: 'gray' }}>{title}</div>
      <CDropdown>
        <CDropdownToggle color="primary">{defaultValue}</CDropdownToggle>
        <CDropdownMenu>
          {items.map((item, index) => (
            <CDropdownItem key={index} onClick={() => handleClick(item)}>
              {item}
            </CDropdownItem>
          ))}
        </CDropdownMenu>
      </CDropdown>
    </>
  )
}

export { EmployeeTable, MyDropdown }
