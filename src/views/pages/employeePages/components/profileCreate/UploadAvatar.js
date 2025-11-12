import { useRef } from 'react'
import { CCol, CButton } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilAperture } from '@coreui/icons'

const UploadAvatar = () => {
  const fileInputRef = useRef(null)

  const handleButtonClick = () => {
    fileInputRef.current.click()
  }

  const handleFileChange = (event) => {
    const file = event.target.files[0]
    if (file) {
      console.log('Ảnh đã chọn:', file.name)
      // 👉 bạn có thể preview hoặc upload file ở đây
    }
  }

  return (
    <CCol className="d-flex align-items-center gap-2">
      <CButton onClick={handleButtonClick}>
        <CIcon icon={cilAperture} size="3xl" />
      </CButton>
      <h5 className="mb-0 text-secondary">Thêm ảnh đại diện</h5>

      {/* input file ẩn */}
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />
    </CCol>
  )
}

export default UploadAvatar
