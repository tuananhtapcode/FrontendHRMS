// Mock API thuần JS
let _components = [
  { code: 'BHTN', name: 'BHTN', unit: '—', type: 'Bảo hiểm – Công đoàn', nature: 'Khấu trừ', valueType: 'Tiền tệ', value: '=BHTN', source: 'Mặc định', status: 'Đang theo dõi' },
  { code: 'BHXH', name: 'BHXH', unit: '—', type: 'Bảo hiểm – Công đoàn', nature: 'Khấu trừ', valueType: 'Tiền tệ', value: '=BHXH', source: 'Mặc định', status: 'Đang theo dõi' },
  { code: 'HE_SO_LUONG', name: 'Hệ số lương', unit: 'Thông tin nhân viên', type: 'Thông tin nhân viên', nature: 'Khác', valueType: 'Số', value: '—', source: 'Mặc định', status: 'Đang theo dõi' },
  { code: 'LUONG_CO_BAN', name: 'Lương cơ bản', unit: '—', type: 'Lương', nature: 'Khác', valueType: 'Tiền tệ', value: '—', source: 'Mặc định', status: 'Đang theo dõi' },
  { code: 'GIOI_TINH', name: 'Giới tính', unit: 'Thông tin nhân viên', type: 'Thông tin nhân viên', nature: 'Khác', valueType: 'Chữ', value: '—', source: 'Mặc định', status: 'Đang theo dõi' },
  { code: 'TAM_UNG', name: 'Tạm ứng', unit: '—', type: 'Lương', nature: 'Khác', valueType: 'Tiền tệ', value: '—', source: 'Mặc định', status: 'Đang theo dõi' },
  { code: 'SO_NGUOI_PHU_THUOC', name: 'Số người phụ thuộc', unit: 'Thuế TNCN', type: 'Thuế TNCN', nature: 'Khác', valueType: 'Số', value: '—', source: 'Mặc định', status: 'Đang theo dõi' },
]

const delay = (ms) => new Promise((r) => setTimeout(r, ms))

export async function listComponents() {
  await delay(250)
  return { data: _components.slice() }
}
export async function createComponent(payload) {
  await delay(200)
  const exists = _components.some((x) => x.code === payload.code)
  const doc = exists ? { ...payload, code: payload.code + '_' + Math.random().toString(36).slice(2,5).toUpperCase() } : payload
  _components = [doc, ..._components]
  return { data: doc }
}
export async function updateComponent(code, patch) {
  await delay(200)
  _components = _components.map((x) => (x.code === code ? { ...x, ...patch } : x))
  return { data: _components.find((x) => x.code === code) }
}
export async function deleteComponent(code) {
  await delay(200)
  _components = _components.filter((x) => x.code !== code)
  return { ok: true }
}