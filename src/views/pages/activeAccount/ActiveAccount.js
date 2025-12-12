import React, { useEffect, useState } from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
  CAlert,
  CSpinner,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked } from '@coreui/icons'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../../../api/api'
import { useToast } from '../../../hooks/useToast'

const ActiveAccount = () => {
  const { token } = useParams()
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [repeatPassword, setRepeatPassword] = useState('')
  const [hidePassword, setHidePassword] = useState(true)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

  const { showToast, ToastContainer } = useToast()

  useEffect(() => {
    const verifyToken = async () => {
      try {
        // const res = await api.get(`/api/activate/${token}`)
        // setEmail(res.data.email)
      } catch (err) {
        setError(err.response?.data?.message || 'Token không hợp lệ hoặc đã hết hạn.')
      } finally {
        setLoading(false)
      }
    }
    verifyToken()
  }, [token])

  // Gửi password về backend
  const handleSubmit = async (e) => {
    e.preventDefault()

    if (password !== repeatPassword) {
      showToast('Thất bại!', 'Mật khẩu nhập lại không khớp!', 'danger')
      // setError('Mật khẩu nhập lại không khớp!')
      return
    }

    try {
      // setError(null)
      setLoading(true)
      await api.post('/api/activate', { token, password })
      setSuccess(true)
      setTimeout(() => navigate('/login'), 2000)
    } catch (err) {
      setError(err.response?.data?.message || 'Kích hoạt thất bại.')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center justify-content-center">
        <CSpinner color="primary" size="lg" />
      </div>
    )
  }

  return (
    <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={9} lg={7} xl={6}>
            <CCard className="mx-4 shadow-lg">
              <CCardBody className="p-4">
                {error && <CAlert color="danger">{error}</CAlert>}
                {success && <CAlert color="success">Kích hoạt thành công! Chuyển hướng...</CAlert>}
                {!success && !error && (
                  <>
                    <h2 className="mb-3 text-center">Kích hoạt tài khoản</h2>
                    <p className="mb-3 text-center">
                      Mật khẩu có tối thiểu 8 ký tự bao gồm số, chữ hoa, chữ thường. Mật khẩu và xác
                      nhận mật khẩu phải trùng nhau.
                    </p>
                    <p className="text-body-secondary text-center">
                      {email ? `Email: ${email}` : 'Đang xác thực token...'}
                    </p>
                    <CForm onSubmit={handleSubmit}>
                      <CInputGroup className="mb-3">
                        <CInputGroupText onClick={() => setHidePassword(!hidePassword)}>
                          <CIcon icon={cilLockLocked} />
                        </CInputGroupText>
                        <CFormInput
                          type={hidePassword ? 'password' : 'text'}
                          placeholder="Mật khẩu mới"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          autoComplete="new-password"
                          pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$"
                          required
                        />
                      </CInputGroup>

                      <CInputGroup className="mb-4">
                        <CInputGroupText onClick={() => setHidePassword(!hidePassword)}>
                          <CIcon icon={cilLockLocked} />
                        </CInputGroupText>
                        <CFormInput
                          type={hidePassword ? 'password' : 'text'}
                          placeholder="Nhập lại mật khẩu"
                          value={repeatPassword}
                          onChange={(e) => setRepeatPassword(e.target.value)}
                          autoComplete="new-password"
                          pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$"
                          required
                        />
                      </CInputGroup>

                      <div className="d-grid">
                        <CButton color="success" type="submit" disabled={loading}>
                          {loading ? <CSpinner size="sm" /> : 'Tạo tài khoản'}
                        </CButton>
                      </div>
                    </CForm>
                  </>
                )}
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </CContainer>
      <ToastContainer />
    </div>
  )
}

export default ActiveAccount
