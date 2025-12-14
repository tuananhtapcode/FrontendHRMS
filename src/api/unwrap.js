// src/api/unwrap.js
export const unwrap = (res) => {
  // backend bạn trả ApiResponse<T>
  // { success, message, data, ... }
  const body = res?.data
  if (body && typeof body === 'object' && 'success' in body) {
    if (!body.success) throw new Error(body.message || 'Request failed')
    return body.data
  }
  // fallback nếu endpoint trả raw data (vd /auth/login)
  return body
}
