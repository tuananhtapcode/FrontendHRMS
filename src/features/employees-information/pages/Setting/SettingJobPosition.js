import { CRow, CCol, CButton, CTooltip } from '@coreui/react'
import { jobPositionCols } from '../../components/tableColumns'
import ReactPaginate from 'react-paginate'
import { SearchableTable } from '../../../../components/zReuse/zComponents'
import { useEffect, useMemo, useState } from 'react'
import CIcon from '@coreui/icons-react'
import { cilCloudDownload } from '@coreui/icons'
import { AddModal } from '../components/AddModal'
import { getJobPositions } from '../../api/api'

const SettingJobPosition = () => {
  const [visible, setVisible] = useState(false)
  const [pageCount, setPageCount] = useState(10)
  const [currentPage, setCurrentPage] = useState(0)
  const [data, setData] = useState([])
  const states = useMemo(() => ['Tất cả', 'Đang theo dõi', 'Dừng theo dõi'], [])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const d = await getJobPositions(currentPage, 10)
        setData(d)
        // setData(d.items || [])
        setPageCount(d.totalPages || 1)
      } catch (err) {
        console.error(err)
      }
    }

    fetchData()
  }, [currentPage])

  console.log(data)

  const handlePageClick = (event) => {
    setCurrentPage(event.selected)
  }
  return (
    <>
      <CRow className="mb-3 align-items-center">
        <CCol md={4} className="fw-bold fs-4">
          Vị trí công việc
        </CCol>
        <CCol className="gap-2 d-flex justify-content-end align-items-center">
          <CTooltip content="Xuất file Excel" placement="bottom">
            <CButton color="secondary">
              <CIcon icon={cilCloudDownload} />
            </CButton>
          </CTooltip>
          <CButton color="primary" onClick={() => setVisible(!visible)}>
            Thêm
          </CButton>
        </CCol>
      </CRow>
      <SearchableTable states={states} data={data} columns={jobPositionCols} />
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
      <AddModal
        visible={visible}
        title="Thêm vị trí công việc"
        fields={jobPositionCols}
        onCancel={() => setVisible(false)}
        onSave={(data) => console.log(data)}
      />
    </>
  )
}

export default SettingJobPosition
