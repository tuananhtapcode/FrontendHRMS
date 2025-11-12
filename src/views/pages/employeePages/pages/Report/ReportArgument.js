import { CButton } from '@coreui/react'

export const ReportArgument = ({ children, handleReset, handleApply }) => {
  return (
    <>
      <div className="fw-bold mb-2 mt-2">Tham số báo cáo</div>

      {children}

      <div
        className="d-flex justify-content-around gap-2 pt-3 mt-3 border-top"
        style={{ paddingBottom: 16 }}
      >
        <CButton className="fw-bold" color="secondary" onClick={handleReset}>
          Mặc định
        </CButton>
        <CButton className="fw-bold text-white" color="info" onClick={handleApply}>
          Áp dụng
        </CButton>
      </div>
    </>
  )
}
