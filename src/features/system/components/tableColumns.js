const accountCols = [
  { key: 'accountId', label: 'Mã tài khoản', _props: { scope: 'col' } },
  { key: 'employeeName', label: 'Họ và tên', _props: { scope: 'col' } },
  { key: 'phoneNumber', label: 'Số điện thoại', _props: { scope: 'col' } },
  { key: 'email', label: 'Email', _props: { scope: 'col' } },
  { key: 'username', label: 'Tên đăng nhập', _props: { scope: 'col' } },
  { key: 'roleName', label: 'Vai trò', _props: { scope: 'col' } },
  { key: 'isActive', label: 'Trạng thái', _props: { scope: 'col' } },
]

const employeeCols = [
  { key: 'id', label: 'Mã nhân viên', _props: { scope: 'col' } },
  { key: 'fullName', label: 'Họ và tên', _props: { scope: 'col' } },
  { key: 'workUnit', label: 'Đơn vị công tác', _props: { scope: 'col' } },
  { key: 'jobPosition', label: 'Vị trí công việc', _props: { scope: 'col' } },
  { key: 'laborStatus', label: 'Trạng thái lao động', _props: { scope: 'col' } },
  { key: 'jobPosition', label: 'Chức danh', _props: { scope: 'col' } },
  { key: 'workUnit', label: 'Quản lý trực tiếp', _props: { scope: 'col' } },
  { key: 'trialDate', label: 'Ngày thử việc', _props: { scope: 'col' } },
  { key: 'officialDate', label: 'Ngày chính thức', _props: { scope: 'col' } },
  { key: 'phoneNumber', label: 'Số điện thoại', _props: { scope: 'col' } },
  { key: 'companyPhoneNumber', label: 'Số điện thoại cơ quan', _props: { scope: 'col' } },
  { key: 'personalEmail', label: 'Email cá nhân', _props: { scope: 'col' } },
  { key: 'companyEmail', label: 'Email cơ quan', _props: { scope: 'col' } },
  { key: 'dateOfBirth', label: 'Ngày sinh', _props: { scope: 'col' } },
  { key: 'gender', label: 'Giới tính', _props: { scope: 'col' } },
]

const logsCols = [
  { key: 'id', label: 'ID', _props: { scope: 'col' } },
  { key: 'entityName', label: 'Đối tượng thao tác', _props: { scope: 'col' } },
  { key: 'action', label: 'Hành động', _props: { scope: 'col' } },
  { key: 'performedName', label: 'Người thực hiện', _props: { scope: 'col' } },
  { key: 'performedAt', label: 'Ngày giờ', _props: { scope: 'col' } },
  { key: 'note', label: 'Mô tả', _props: { scope: 'col' } },
]
export { accountCols, logsCols }
