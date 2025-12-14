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
  { key: 'startDate', label: 'Từ ngày', _props: { scope: 'col' } },
  { key: 'endDate', label: 'Đến ngày', _props: { scope: 'col' } },
  { key: 'leaveType', label: 'Loại nghỉ', _props: { scope: 'col' } },
  { key: 'totalDays', label: 'Tồng số ngày nghỉ', _props: { scope: 'col' } },
  { key: 'status', label: 'Trạng thái', _props: { scope: 'col' } },
  { key: 'approvedAt', label: 'Ngày duyệt', _props: { scope: 'col' } },
  { key: 'approvedNote', label: 'Ghi chú', _props: { scope: 'col' } },
]

const overtimeRequestCols = [
  { key: 'createdAt', label: 'Ngày nộp đơn', _props: { scope: 'col' } },
  { key: 'date', label: 'Làm thêm ngày', _props: { scope: 'col' } },
  { key: 'startTime', label: 'Giờ bắt đầu', _props: { scope: 'col' } },
  { key: 'endTime', label: 'Giờ kết thúc', _props: { scope: 'col' } },
  { key: 'totalHours', label: 'Tổng giờ làm thêm', _props: { scope: 'col' } },
  { key: 'reason', label: 'Lý do làm thêm', _props: { scope: 'col' } },
  { key: 'status', label: 'Trạng thái', _props: { scope: 'col' } },
  { key: 'approvedAt', label: 'Thời gian duyệt', _props: { scope: 'col' } },
  { key: 'approvedNote', label: 'Ghi chú người duyệt', _props: { scope: 'col' } },
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
