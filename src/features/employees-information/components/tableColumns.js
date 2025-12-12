const deparmentCols = [
  { key: 'code', label: 'Mã phòng ban', _props: { scope: 'col' } },
  { key: 'name', label: 'Tên phòng ban', _props: { scope: 'col' } },
  { key: 'description', label: 'Mô tả', _props: { scope: 'col' } },
]

const jobPositionCols = [
  { key: 'job_position_id', label: 'Mã vị trí', _props: { scope: 'col' } },
  { key: 'name', label: 'Tên vị trí', _props: { scope: 'col' } },
  { key: 'description', label: 'Mô tả', _props: { scope: 'col' } },
  { key: 'level', label: 'Cấp', _props: { scope: 'col' } },
  { key: 'min_salary', label: 'Lương thấp nhất', _props: { scope: 'col' } },
  { key: 'max_salary', label: 'Lương cao nhất', _props: { scope: 'col' } },
  { key: 'is_active', label: 'Trạng thái', _props: { scope: 'col' } },
]

export { deparmentCols, jobPositionCols }
