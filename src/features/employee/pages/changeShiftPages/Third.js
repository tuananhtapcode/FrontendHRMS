import { CButtonGroup, CCard, CCol, CFormCheck, CRow } from '@coreui/react'
import { SearchableTable } from '../../../../components/zReuse/zComponents'
import { changeShiftCols } from '../../components/tableColumns'

const Third = () => {
  const buttons = ['Tất cả', 'Chưa gửi', 'Chờ duyệt', 'Đã duyệt', 'Bị từ chối']

  return (
    <CRow>
      <CCol md={2}>
        <CCard>
          <CButtonGroup vertical role="group" className="w-100">
            {buttons.map((label, index) => {
              const count = Math.floor(Math.random() * 10) // ví dụ tạm số lượng, thay bằng data thật
              return (
                <CFormCheck
                  key={index}
                  type="radio"
                  button={{ color: 'primary', variant: 'outline' }}
                  name="vbtnradio-tab2"
                  id={`vbtnradio${index}-tab2`}
                  autoComplete="off"
                  defaultChecked={index === 1}
                  label={
                    <div className="d-flex justify-content-between align-items-center w-100 px-2">
                      <span>{label}</span>
                      <span className="badge bg-primary">{count}</span>
                    </div>
                  }
                />
              )
            })}
          </CButtonGroup>
        </CCard>
      </CCol>
      <CCol style={{ width: '1px' }}>
        <SearchableTable columns={changeShiftCols} />
      </CCol>
    </CRow>
  )
}

export default Third
