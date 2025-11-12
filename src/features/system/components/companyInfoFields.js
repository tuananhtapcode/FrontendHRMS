export const fields = [
  {
    key: 'fullName',
    label: (
      <>
        Tên đầy đủ <span style={{ color: 'red' }}>*</span>
      </>
    ),
    placeholder: 'Nhập họ và tên',
    required: true,
  },
  {
    key: 'businessType',
    type: 'select',
    label: (
      <>
        Loại hình kinh doanh <span style={{ color: 'red' }}>*</span>
      </>
    ),
    options: [
      { label: 'Doanh nghiệp', value: 'Doanh nghiệp' },
      { label: 'Hộ kinh doanh', value: 'Hộ kinh doanh' },
    ],
  },
  {
    key: 'taxCode',
    label: (
      <>
        Mã số thuế <span style={{ color: 'red' }}>*</span>
      </>
    ),
    required: true,
    feedbackInvalid: 'Không được để trống',
  },
  {
    key: 'legalRepresentative',
    label: 'Người đại diện pháp luật',
    placeholder: 'Nhập người đại diện pháp luật',
  },
  {
    key: 'address',
    label: (
      <>
        {' '}
        Địa chỉ <span style={{ color: 'red' }}>*</span>{' '}
      </>
    ),
    placeholder: 'Nhập địa chỉ',
    required: true,
  },
  {
    key: 'phoneNumber',
    label: (
      <>
        Điện thoại <span style={{ color: 'red' }}>*</span>
      </>
    ),
    placeholder: 'Nhập số điện thoại',
    required: true,
    pattern: '^(0|84)(3|5|7|8|9)[0-9]{8}$',
  },
  {
    key: 'email',
    type: 'email',
    label: 'Email',
    placeholder: 'Nhập email',
  },
]
