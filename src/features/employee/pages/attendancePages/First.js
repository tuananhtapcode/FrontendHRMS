import { CButtonGroup, CCard, CCol, CFormCheck, CRow } from '@coreui/react'
import { cil4k } from '@coreui/icons'
import { EmployeeCard, SearchableTable } from '../../../../components/zReuse/zComponents'
import { attendanceCols } from '../../components/tableColumns'

const First = () => {
  // const tableStates = ['Hôm nay', 'Hôm qua', 'Tuần này', 'Tuần trước', 'Tháng này', 'Tháng trước']
  const buttons = ['Tất cả', 'Chưa gửi', 'Chờ duyệt', 'Đã duyệt', 'Bị từ chối']
  return (
    <>
      <CRow className="mb-4">
        <CCol>
          <EmployeeCard
            title="Số ngày phép cả năm"
            quantity={0}
            icon={cil4k}
            backgroundIcon="#e8f0ff"
          />
        </CCol>
        <CCol>
          <EmployeeCard
            title="Số ngày phép đã nghỉ"
            quantity={0}
            icon={cil4k}
            backgroundIcon="#e8fff3"
          />
        </CCol>
        <CCol>
          <EmployeeCard
            title="Số ngày phép còn lại cả năm"
            quantity={0}
            icon={cil4k}
            backgroundIcon="#fff6e8"
          />
        </CCol>
        <CCol>
          <EmployeeCard
            title="Số ngày còn lại đến tháng hiện tại"
            quantity={0}
            icon={cil4k}
            backgroundIcon="#ffe8e8"
          />
        </CCol>
        <CCol>
          <EmployeeCard
            title="Số ngày nghỉ không lương"
            quantity={0}
            icon={cil4k}
            backgroundIcon="#ffe8e8"
          />
        </CCol>
      </CRow>

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
          <SearchableTable columns={attendanceCols} />
        </CCol>
      </CRow>
    </>
  )
}

export default First
