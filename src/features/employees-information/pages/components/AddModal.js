import {
  CButton,
  CFormInput,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
} from '@coreui/react'
import { useState } from 'react'

const AddModal = ({ visible, title, fields, onCancel, onSave }) => {
  const [form, setForm] = useState(Object.fromEntries(fields.map((field) => [field.key, ''])))

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  return (
    <CModal alignment="center" backdrop="static" visible={visible} onClose={onCancel}>
      <CModalHeader>
        <CModalTitle>{title}</CModalTitle>
      </CModalHeader>
      <CModalBody>
        {fields.map((field) => (
          <CFormInput
            key={field.key}
            label={field.label}
            placeholder={`Nhập ${field.label.toLowerCase()}`}
            value={fields.value}
            onChange={(e) => handleChange(field.key, e.target.value)}
          />
        ))}
      </CModalBody>
      <CModalFooter>
        <CButton color="secondary" onClick={onCancel}>
          Hủy
        </CButton>
        <CButton color="primary" onClick={() => onSave(form)}>
          Lưu
        </CButton>
      </CModalFooter>
    </CModal>
  )
}

export { AddModal }
