import { CRow, CCol, CButton } from '@coreui/react'
import { deparmentCols } from '../../components/tableColumns'
import ReactPaginate from 'react-paginate'
import { SearchableTable } from '../../../../components/zReuse/zComponents'
import { useState } from 'react'
import { AddModal } from '../components/AddModal'

const SettingDepartmentalStructure = () => {
  const [visible, setVisible] = useState(false)
  const [pageCount, setPageCount] = useState(0)

  const handlePageClick = (event) => {
    setCurrentPage(event.selected)
  }
  return (
    <>
      <CRow className="mb-3 align-items-center">
        <CCol md={4} className="fw-bold fs-4">
          Cơ cấu phòng ban
        </CCol>
        <CCol className="gap-2 d-flex justify-content-end align-items-center">
          <CButton color="primary" onClick={() => setVisible(!visible)}>
            Thêm
          </CButton>
        </CCol>
      </CRow>
      <SearchableTable columns={deparmentCols} />
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
        title="Thêm phòng ban"
        fields={deparmentCols}
        onCancel={() => setVisible(false)}
        onSave={(data) => console.log('Form data: ', data)}
      />
    </>
  )
}

export default SettingDepartmentalStructure
