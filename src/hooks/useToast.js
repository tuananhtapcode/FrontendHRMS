import { CToast, CToastBody, CToaster, CToastHeader } from '@coreui/react'
import { useRef, useState } from 'react'

export const useToast = () => {
  const [toast, addToast] = useState()
  const toaster = useRef()

  const showToast = (title, message, outlineColor) => {
    addToast(
      <CToast className={`border border-${outlineColor}`}>
        <CToastHeader closeButton>
          <strong className="me-auto">{title}</strong>
        </CToastHeader>
        <CToastBody>{message}</CToastBody>
      </CToast>,
    )
  }

  const ToastContainer = () => (
    <CToaster className="p-3" placement="top-end" push={toast} ref={toaster} />
  )

  return { showToast, ToastContainer }
}
