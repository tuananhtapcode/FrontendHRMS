import {
  CTabs,
  CTabList,
  CTab,
  CTabContent,
  CTabPanel,
  CRow,
  CCol,
  CButton,
  CTooltip,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilCloudDownload } from '@coreui/icons'
import { accountCols, employeeCols } from '../components/tableColumns'
import { useEffect, useState } from 'react'
import { getAccounts } from '../api/api'
import ReactPaginate from 'react-paginate'
import { SearchableTable } from '../../../components/zReuse/zComponents'

const data = [
  {
    id: 'NV001',
    fullName: 'Nguyễn Văn A',
    gender: 'Nam',
    dateOfBirth: '1995-03-12',
    phoneNumber: '0905123456',
    companyEmail: 'nguyenvana@company.com',
    jobPosition: 'Lập trình viên Frontend',
    workUnit: 'Phòng Công nghệ thông tin',
    trialDate: '2022-01-10',
    officialDate: '2022-04-10',
    contractType: 'Hợp đồng 1 năm',
    laborStatus: 'Đang làm việc',
    seniority: '2 năm 6 tháng',
    insuranceParticipation: 'Có',
    personalEmail: 'ziptghz@gmail.com',
    address: 'Hà Nội, Việt Nam',
  },
  {
    id: 'NV002',
    fullName: 'Trần Thị B',
    gender: 'Nữ',
    dateOfBirth: '1998-08-25',
    phoneNumber: '0987123456',
    companyEmail: 'tranthib@company.com',
    jobPosition: 'Nhân sự',
    workUnit: 'Phòng Hành chính - Nhân sự',
    trialDate: '2023-02-01',
    officialDate: '2023-05-01',
    contractType: 'Hợp đồng không thời hạn',
    laborStatus: 'Chính thức',
    seniority: '1 năm 4 tháng',
    insuranceParticipation: 'Có',
  },
  {
    id: 'NV003',
    fullName: 'Lê Hoàng C',
    gender: 'Nam',
    dateOfBirth: '1997-11-05',
    phoneNumber: '0912123123',
    companyEmail: 'lehoangc@company.com',
    jobPosition: 'Kế toán viên',
    workUnit: 'Phòng Kế toán',
    trialDate: '2024-06-15',
    officialDate: '',
    contractType: 'Thử việc',
    laborStatus: 'Thử việc',
    seniority: '3 tháng',
    insuranceParticipation: 'Chưa',
  },
  {
    id: 'NV004',
    fullName: 'Phạm Minh D',
    gender: 'Nữ',
    dateOfBirth: '1992-05-18',
    phoneNumber: '0935456789',
    companyEmail: 'phamminhd@company.com',
    jobPosition: 'Trưởng phòng Marketing',
    workUnit: 'Phòng Marketing',
    trialDate: '2020-03-01',
    officialDate: '2020-06-01',
    contractType: 'Hợp đồng dài hạn',
    laborStatus: 'Nghỉ thai sản',
    seniority: '5 năm',
    insuranceParticipation: 'Có',
  },
  {
    id: 'NV005',
    fullName: 'Đỗ Quốc E',
    gender: 'Nam',
    dateOfBirth: '1990-09-10',
    phoneNumber: '0977543210',
    companyEmail: 'doquoce@company.com',
    jobPosition: 'Bảo vệ',
    workUnit: 'Ban An ninh',
    trialDate: '2019-01-01',
    officialDate: '2019-04-01',
    contractType: 'Hợp đồng 3 năm',
    laborStatus: 'Chính thức',
    seniority: '6 năm',
    insuranceParticipation: 'Có',
  },
]

const states = ['Tất cả', 'Đang làm việc', 'Đã nghỉ việc']

const CategoryMember = () => {
  const [accounts, setAccounts] = useState([])
  const [pageCount, setPageCount] = useState(10)
  const [currentPage, setCurrentPage] = useState(0)

  useEffect(() => {
    // const fetchData = async () => {
    //   try {
    //     const data = await getAccounts(currentPage, 10)
    //     setAccounts(data.items)
    //   } catch (err) {
    //     console.error(err)
    //   }
    // }
  }, [currentPage])

  const handlePageClick = (event) => {
    setCurrentPage(event.selected)
  }

  return (
    <>
      <CRow className="mb-3 align-items-center">
        <CCol md={4} className="fw-bold fs-4">
          Đối tượng
        </CCol>
        <CCol className="gap-2 d-flex justify-content-end align-items-center">
          <CTooltip content="Xuất file Excel" placement="bottom">
            <CButton color="secondary">
              <CIcon icon={cilCloudDownload} />
            </CButton>
          </CTooltip>
          <CButton color="primary">Thêm đối tượng</CButton>
        </CCol>
      </CRow>
      <CTabs defaultActiveItemKey={1}>
        <CTabList variant="underline-border">
          <CTab itemKey={1}>Người dùng</CTab>
          <CTab itemKey={2}>Nhân viên</CTab>
        </CTabList>
        <CTabContent>
          <CTabPanel className="p-3" itemKey={1}>
            <SearchableTable states={states} data={data} columns={accountCols} />
          </CTabPanel>
          <CTabPanel className="p-3" itemKey={2}>
            <SearchableTable states={states} data={data} columns={employeeCols} />
          </CTabPanel>
        </CTabContent>
      </CTabs>
      <ReactPaginate
        previousLabel={'← Trước'}
        nextLabel={'Sau →'}
        breakLabel={'...'}
        pageCount={pageCount}
        marginPagesDisplayed={1} // hiển thị 1 page ở mép
        pageRangeDisplayed={3} // hiển thị 3 page ở giữa
        onPageChange={handlePageClick}
        containerClassName={'pagination justify-content-center gap-2 mt-4'}
        pageClassName={'page-item'}
        pageLinkClassName={'page-link px-3 py-1 border rounded hover:bg-gray-100 cursor-pointer'}
        previousClassName={'page-item'}
        previousLinkClassName={'page-link px-3 py-1 border rounded hover:bg-gray-100'}
        nextClassName={'page-item'}
        nextLinkClassName={'page-link px-3 py-1 border rounded hover:bg-gray-100'}
        breakClassName={'page-item'}
        breakLinkClassName={'page-link px-3 py-1 border rounded'}
        activeClassName={'bg-blue-500 text-white'}
      />
    </>
  )
}

export default CategoryMember
