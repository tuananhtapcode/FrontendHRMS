const timekeepingRemoteCols = [
  { key: 'fullName', label: 'Mã nhân viên', _props: { scope: 'col' } },
  { key: 'phoneNumber', label: 'Họ và tên', _props: { scope: 'col' } },
  { key: 'personalEmail', label: 'Ca làm việc', _props: { scope: 'col' } },
  { key: 'laborStatus', label: 'Múi giờ', _props: { scope: 'col' } },
  { key: 'dateOfBirth', label: 'Thời gian chấm công', _props: { scope: 'col' } },
  { key: 'gender', label: 'Trạng thái', _props: { scope: 'col' } },
  { key: 'address', label: 'Tài liệu đính kèm', _props: { scope: 'col' } },
  { key: 'address', label: 'Định vị GPS', _props: { scope: 'col' } },
]

const attendanceCols = [
  { key: 'fromDate', label: 'Từ ngày', _props: { scope: 'col' } },
  { key: 'toDate', label: 'Đến ngày', _props: { scope: 'col' } },
  { key: 'timezone', label: 'Múi giờ', _props: { scope: 'col' } },
  { key: 'employeeName', label: 'Nhân viên xin nghỉ', _props: { scope: 'col' } },
  { key: 'leaveDays', label: 'Số ngày nghỉ', _props: { scope: 'col' } },
  { key: 'workLocation', label: 'Địa điểm làm việc', _props: { scope: 'col' } },
  { key: 'leaveType', label: 'Loại nghỉ', _props: { scope: 'col' } },
  { key: 'salaryRate', label: 'Tỷ lệ hưởng lương', _props: { scope: 'col' }, hidden: true },
  { key: 'leaveReason', label: 'Lý do nghỉ', _props: { scope: 'col' } },
  { key: 'approver', label: 'Người duyệt', _props: { scope: 'col' }, hidden: true },
  { key: 'replacement', label: 'Người thay thế', _props: { scope: 'col' }, hidden: true },
  { key: 'relatedPeople', label: 'Người liên quan', _props: { scope: 'col' }, hidden: true },
  { key: 'note', label: 'Ghi chú', _props: { scope: 'col' } },
  { key: 'status', label: 'Trạng thái', _props: { scope: 'col' } },
]

const overtimeRequestCols = [
  { key: 'submittedDate', label: 'Ngày nộp đơn', _props: { scope: 'col' } },
  { key: 'otFrom', label: 'Làm thêm từ', _props: { scope: 'col' } },
  { key: 'breakFrom', label: 'Nghỉ giữa ca từ', hidden: true, _props: { scope: 'col' } },
  { key: 'breakTo', label: 'Nghỉ giữa ca đến', hidden: true, _props: { scope: 'col' } },
  { key: 'otTo', label: 'Làm thêm đến', _props: { scope: 'col' } },
  {
    key: 'actualWorkingHours',
    label: 'Giờ chấm công thực tế',
    hidden: true,
    _props: { scope: 'col' },
  },
  { key: 'employeeName', label: 'Nhân viên đăng ký ca làm thêm', _props: { scope: 'col' } },
  { key: 'multiDay', label: 'Tạo đơn cho nhiều ngày', _props: { scope: 'col' } },
  { key: 'timezone', label: 'Múi giờ', _props: { scope: 'col' } },
  { key: 'otHours', label: 'Số giờ làm thêm', _props: { scope: 'col' } },
  { key: 'otTimePoint', label: 'Thời điểm làm thêm', _props: { scope: 'col' } },
  { key: 'shiftApplied', label: 'Ca áp dụng', _props: { scope: 'col' } },
  { key: 'otType', label: 'Loại làm thêm', hidden: true, _props: { scope: 'col' } },
  { key: 'workLocation', label: 'Địa điểm làm việc', _props: { scope: 'col' } },
  { key: 'reason', label: 'Lý do làm thêm', _props: { scope: 'col' } },
  { key: 'approver', label: 'Người duyệt', _props: { scope: 'col' } },
  { key: 'note', label: 'Ghi chú', _props: { scope: 'col' } },
  { key: 'status', label: 'Trạng thái', _props: { scope: 'col' } },
]

const changeShiftCols = [
  { key: 'workDate', label: 'Ngày làm việc', _props: { scope: 'col' } },
  { key: 'timezone', label: 'Múi giờ', _props: { scope: 'col' } },
  { key: 'employeeName', label: 'Nhân viên đổi ca', _props: { scope: 'col' } },
  { key: 'currentShift', label: 'Ca hiện tại', _props: { scope: 'col' } },
  { key: 'requestDate', label: 'Ngày đăng ký đổi', _props: { scope: 'col' } },
  { key: 'requestedShift', label: 'Ca đăng ký đổi', _props: { scope: 'col' } },
  { key: 'workLocation', label: 'Địa điểm làm việc', _props: { scope: 'col' } },
  { key: 'swapWith', label: 'Đổi ca với', _props: { scope: 'col' }, hidden: true },
  { key: 'reason', label: 'Lý do đổi ca', _props: { scope: 'col' } },
  { key: 'approver', label: 'Người duyệt', _props: { scope: 'col' } },
  { key: 'relatedPeople', label: 'Người liên quan', _props: { scope: 'col' } },
  { key: 'note', label: 'Ghi chú', _props: { scope: 'col' } },
  { key: 'status', label: 'Trạng thái', _props: { scope: 'col' } },
]

export { timekeepingRemoteCols, attendanceCols, overtimeRequestCols, changeShiftCols }
