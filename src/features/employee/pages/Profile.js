import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
import { useEffect, useState } from 'react'
import { employeeColumns } from '../../employees-information/pages/components/tableColumns'
import { getMyEmployeeInformation } from '../api/api'

const Profile = () => {
  const [data, setData] = useState([])
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getMyEmployeeInformation()
        setData(res)
      } catch (error) {
        console.error('Error fetching employee profile:', error)
      }
    }
    fetchData()
  }, [])

  return (
    <>
      <CCard className="shadow-sm border-0">
        <CCardHeader className="d-flex justify-content-between align-items-center bg-white border-bottom-0">
          <div>
            <h2 className="mb-1 fw-semibold">Thông tin nhân viên</h2>
          </div>
          {/* <CButton color="primary" variant="outline" onClick={() => handleEdit()}>
            Chỉnh sửa
          </CButton> */}
        </CCardHeader>

        <CCardBody>
          <CTable striped bordered hover responsive className="align-middle">
            <CTableBody>
              {employeeColumns.map((col, index) => (
                <CTableRow key={index}>
                  <CTableHeaderCell
                    style={{ width: '30%', whiteSpace: 'nowrap' }}
                    className="fw-semibold bg-light"
                  >
                    {col.label}
                  </CTableHeaderCell>
                  <CTableDataCell>{data[col.key]}</CTableDataCell>
                </CTableRow>
              ))}
            </CTableBody>
          </CTable>
        </CCardBody>
      </CCard>
    </>
  )
}

export default Profile
