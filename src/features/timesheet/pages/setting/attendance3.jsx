
import {
  cilArrowLeft,
  cilList,
  cilPencil,
  cilPlus,
  cilSearch,
  cilTrash,
  cilWarning,
  cilX
} from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import {
  CBadge,
  CButton,
  CCard,
  CCardBody,
  CForm,
  CFormCheck,
  CFormInput,
  CFormLabel,
  CFormSelect,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CNav,
  CNavItem,
  CNavLink,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CTooltip
} from '@coreui/react'
import { useEffect, useMemo, useState } from 'react'
import { NavLink } from 'react-router-dom'

// ============================================================================
// 0. STYLE CSS (Hiệu ứng Hover & Tags)
// ============================================================================
const PageStyles = () => (
  <style>
    {`
      .row-actions {
        display: flex;
        justify-content: center;
        gap: 8px;
        opacity: 0;
        visibility: hidden;
        transform: translateY(4px);
        transition: all 0.15s ease-in-out;
      }
      tbody tr:hover .row-actions {
        opacity: 1;
        visibility: visible;
        transform: translateY(0);
      }
      .btn-action {
        width: 32px;
        height: 32px;
        border-radius: 50%;
        border: none;
        background: transparent;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        color: #6b7280;
        transition: all 0.15s ease;
      }
      .btn-action:hover {
        background: #f1f5f9;
        transform: scale(1.1);
      }
      .btn-action.edit:hover {
        color: #f59e0b;
        background-color: #fef3c7;
      }
      .btn-action.delete:hover {
        color: #ef4444;
        background-color: #fee2e2;
      }
      .section-title {
        font-size: 0.95rem;
        font-weight: 700;
        color: #666;
        margin-bottom: 1rem;
        text-transform: uppercase;
      }
      .multi-select-container {
        border: 1px solid #b1b7c1;
        border-radius: 0.375rem;
        padding: 0.375rem 0.75rem;
        display: flex;
        flex-wrap: wrap;
        gap: 4px;
        align-items: center;
        min-height: 38px;
        background-color: #fff;
      }
    `}
  </style>
)

// ============================================================================
// 1. MODAL XÁC NHẬN XÓA
// ============================================================================
const DeleteConfirmModal = ({ visible, onClose, onConfirm, message }) => {
  return (
    <CModal visible={visible} onClose={onClose} alignment="center">
      <CModalHeader onClose={onClose}>
        <CModalTitle className="fw-bold text-danger">Xác nhận xóa</CModalTitle>
      </CModalHeader>
      <CModalBody className="text-center py-4">
        <CIcon icon={cilWarning} size="4xl" className="text-warning mb-3" />
        <p className="mb-0 fs-5">{message || "Bạn có chắc chắn muốn xóa dữ liệu này không?"}</p>
        <p className="text-muted small">Hành động này không thể hoàn tác.</p>
      </CModalBody>
      <CModalFooter className="justify-content-center border-top-0 pb-4">
        <CButton color="secondary" variant="outline" className="px-4" onClick={onClose}>Hủy bỏ</CButton>
        <CButton color="danger" className="px-4 text-white" onClick={onConfirm}>Xóa</CButton>
      </CModalFooter>
    </CModal>
  )
}

// ============================================================================
// 2. MODAL: THÊM/SỬA DANH MỤC WI-FI (Quản lý BSSID)
// ============================================================================
const AddWifiModal = ({ visible, onClose, defaultName = '', onSaveData }) => {
  const [wifiName, setWifiName] = useState('')
  const [bssids, setBssids] = useState(['', ''])

  useEffect(() => {
    if (visible) {
      setWifiName(defaultName || '')
      setBssids(['', ''])
    }
  }, [visible, defaultName])

  const handleAddBssidRow = () => setBssids([...bssids, ''])
  const handleRemoveBssidRow = (index) => setBssids(bssids.filter((_, i) => i !== index))
  const handleChangeBssid = (index, value) => {
    const newList = [...bssids]
    newList[index] = value
    setBssids(newList)
  }

  const handleSave = () => {
    if (!wifiName.trim()) return alert("Vui lòng nhập tên Wi-Fi")
    // Callback lưu dữ liệu ra ngoài
    onSaveData({ name: wifiName, bssid: bssids.filter(b => b).join('; ') })
    onClose()
  }

  return (
    <CModal visible={visible} onClose={onClose} alignment="center">
      <CModalHeader>
        <CModalTitle className="fw-bold">{defaultName ? 'Cập nhật Wi-Fi' : 'Thêm Wi-Fi'}</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <CForm>
          <div className="mb-3">
            <CFormLabel className="fw-bold" style={{ fontSize: '0.9rem' }}>Tên Wi-Fi <span className="text-danger">*</span></CFormLabel>
            <CFormInput value={wifiName} onChange={(e) => setWifiName(e.target.value)} />
          </div>
          <div className="mb-2">
            <CFormLabel className="fw-bold" style={{ fontSize: '0.9rem' }}>BSSID <span className="text-danger">*</span></CFormLabel>
            {bssids.map((bssid, index) => (
              <div key={index} className="d-flex align-items-center mb-2">
                <CFormInput value={bssid} onChange={(e) => handleChangeBssid(index, e.target.value)} className="me-2" />
                <CIcon icon={cilX} className="text-danger" style={{ cursor: 'pointer', fontSize: '1.2rem' }} onClick={() => handleRemoveBssidRow(index)} />
              </div>
            ))}
          </div>
          <div><span className="fw-bold" style={{ cursor: 'pointer', color: '#f9b115' }} onClick={handleAddBssidRow}>+ Thêm</span></div>
        </CForm>
      </CModalBody>
      <CModalFooter className="border-top-0">
        <CButton color="secondary" variant="outline" onClick={onClose}>Hủy</CButton>
        <CButton className="text-white fw-bold" style={{ backgroundColor: '#f26522', borderColor: '#f26522' }} onClick={handleSave}>Lưu</CButton>
      </CModalFooter>
    </CModal>
  )
}

// ============================================================================
// 3. MODAL: CẤU HÌNH WI-FI (Tags Wifi & Logic Sửa)
// ============================================================================
const ConfigureWifiModal = ({ visible, onClose, wifiList, onSave, defaultData }) => {
  const [unit, setUnit] = useState('')
  const [selectedWifis, setSelectedWifis] = useState([])
  const [employeeOption, setEmployeeOption] = useState('all')

  useEffect(() => {
    if (visible) {
      if (defaultData) {
        // Mode Sửa: Fill lại dữ liệu
        setUnit(defaultData.unit === 'Văn phòng HCM' ? '1' : '2')
        const wifiNames = defaultData.wifiName.split(',').map(s => s.trim())
        const matchedWifis = wifiList.filter(w => wifiNames.includes(w.name))
        setSelectedWifis(matchedWifis)
        setEmployeeOption(defaultData.employee === 'Tất cả nhân viên' ? 'all' : 'custom')
      } else {
        // Mode Thêm mới: Reset
        setUnit('')
        setSelectedWifis([])
        setEmployeeOption('all')
      }
    }
  }, [visible, defaultData, wifiList])

  const handleSelectWifi = (e) => {
    const wifiId = e.target.value
    if (!wifiId) return
    const wifiObj = wifiList.find(w => String(w.id) === String(wifiId))
    if (wifiObj && !selectedWifis.find(w => w.id === wifiObj.id)) {
      setSelectedWifis([...selectedWifis, wifiObj])
    }
    e.target.value = ""
  }

  const handleRemoveWifi = (wifiId) => setSelectedWifis(selectedWifis.filter(w => w.id !== wifiId))

  const handleSave = () => {
    if (!unit || selectedWifis.length === 0) return alert("Vui lòng chọn Đơn vị và ít nhất một Wi-Fi!")
    const unitName = unit === '1' ? 'Văn phòng HCM' : 'Nhà máy Bình Dương'
    const wifiNameString = selectedWifis.map(w => w.name).join(', ')
    onSave({
      unit: unitName,
      employee: employeeOption === 'all' ? 'Tất cả nhân viên' : 'Nhân viên chỉ định',
      wifiName: wifiNameString
    })
    onClose()
  }

  return (
    <CModal visible={visible} onClose={onClose} alignment="center" size="lg">
      <CModalHeader onClose={onClose}><CModalTitle className="fw-bold">{defaultData ? 'Cập nhật cấu hình' : 'Thêm cấu hình'}</CModalTitle></CModalHeader>
      <CModalBody className="p-4">
        <CForm>
          <div className="mb-4">
            <div className="section-title">THÔNG TIN CHUNG</div>
            <div className="mb-3">
              <CFormLabel className="fw-bold">Đơn vị áp dụng <span className="text-danger">*</span></CFormLabel>
              <CFormSelect value={unit} onChange={(e) => setUnit(e.target.value)}>
                <option value="">Chọn đơn vị áp dụng</option>
                <option value="1">Văn phòng HCM</option>
                <option value="2">Nhà máy Bình Dương</option>
              </CFormSelect>
            </div>
            <div className="mb-3">
              <CFormLabel className="fw-bold">Wi-Fi chấm công <span className="text-danger">*</span></CFormLabel>
              <div className="d-flex">
                <div className="flex-grow-1 multi-select-container">
                  {selectedWifis.map(wifi => (
                    <CBadge key={wifi.id} color="light" className="text-dark me-1 border" shape="rounded-pill">
                      {wifi.name} <CIcon icon={cilX} size="sm" style={{ cursor: 'pointer', marginLeft: '4px' }} onClick={() => handleRemoveWifi(wifi.id)} />
                    </CBadge>
                  ))}
                  <select className="border-0 flex-grow-1" style={{ outline: 'none', minWidth: '100px', backgroundColor: 'transparent' }} onChange={handleSelectWifi} defaultValue="">
                    <option value="" disabled hidden>Chọn Wi-Fi...</option>
                    {wifiList.map(wifi => (<option key={wifi.id} value={wifi.id}>{wifi.name}</option>))}
                  </select>
                </div>
              </div>
            </div>
          </div>
          <div>
            <div className="section-title">DANH SÁCH NHÂN VIÊN ÁP DỤNG</div>
            <div className="ms-1">
              <CFormCheck type="radio" name="employeeOption" id="allEmp" label="Tất cả nhân viên trong đơn vị" checked={employeeOption === 'all'} onChange={() => setEmployeeOption('all')} />
            </div>
          </div>
        </CForm>
      </CModalBody>
      <CModalFooter className="border-top-0 bg-light">
        <CButton color="secondary" variant="outline" onClick={onClose}>Hủy</CButton>
        <CButton className="text-white fw-bold" style={{ backgroundColor: '#f26522', borderColor: '#f26522' }} onClick={handleSave}>Lưu</CButton>
      </CModalFooter>
    </CModal>
  )
}

// ============================================================================
// 4. COMPONENT: TRANG DANH MỤC WI-FI
// ============================================================================
const WifiListComponent = ({ onBack, wifiList, setWifiList, assignments }) => {
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [editingName, setEditingName] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [deleteModalVisible, setDeleteModalVisible] = useState(false)
  const [itemToDelete, setItemToDelete] = useState(null)

  const handleSaveData = (newData) => {
    if (editingName) {
      setWifiList(prev => prev.map(item => item.name === editingName ? { ...item, ...newData } : item))
    } else {
      const newId = Math.max(...wifiList.map(i => i.id), 0) + 1
      setWifiList(prev => [...prev, { id: newId, ...newData }])
    }
  }

  // LOGIC: Kiểm tra Wifi có đang được dùng không trước khi xóa
  const openDeleteModal = (item) => {
    const isUsed = assignments.some(assignment => {
      const usedWifis = assignment.wifiName.split(',').map(w => w.trim())
      return usedWifis.includes(item.name)
    })

    if (isUsed) {
      alert(`Không thể xóa Wi-Fi "${item.name}" vì đang được sử dụng trong cấu hình chấm công!`)
      return
    }
    setItemToDelete(item)
    setDeleteModalVisible(true)
  }

  const confirmDelete = () => {
    if (itemToDelete) setWifiList(prev => prev.filter(item => item.id !== itemToDelete.id))
    setDeleteModalVisible(false); setItemToDelete(null)
  }

  const handleAdd = () => { setEditingName(''); setIsModalVisible(true) }
  const handleEdit = (name) => { setEditingName(name); setIsModalVisible(true) }

  const filteredData = useMemo(() => {
    return wifiList.filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()) || (item.bssid && item.bssid.toLowerCase().includes(searchTerm.toLowerCase())))
  }, [wifiList, searchTerm])

  return (
    <div className="bg-white p-3 h-100">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div className="d-flex align-items-center gap-3">
          <CButton color="transparent" className="p-0 border-0" onClick={onBack}><CIcon icon={cilArrowLeft} size="xl" className="text-secondary" /></CButton>
          <h4 className="mb-0 fw-bold">Danh mục Wi-Fi</h4>
        </div>
        <CButton style={{ backgroundColor: '#f26522', border: 'none' }} className="text-white fw-bold" onClick={handleAdd}><CIcon icon={cilPlus} className="me-2" /> Thêm</CButton>
      </div>

      <div className="mb-4"><p className="mb-0"><strong>Lưu ý:</strong> Cần khai báo đầy đủ BSSID để tránh lỗi.</p></div>

      <div className="mb-3" style={{ maxWidth: '300px', position: 'relative' }}>
        <CFormInput placeholder="Tìm kiếm" className="ps-5" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
        <CIcon icon={cilSearch} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#999' }} />
      </div>

      <div className="border rounded">
        <CTable hover responsive className="mb-0" align="middle">
          <CTableHead className="bg-light">
            <CTableRow>
              <CTableHeaderCell className="py-3 ps-3 bg-light" style={{ width: '40%' }}>Tên Wi-Fi</CTableHeaderCell>
              <CTableHeaderCell className="py-3 bg-light" style={{ width: '40%' }}>BSSID</CTableHeaderCell>
              <CTableHeaderCell className="py-3 bg-light text-center" style={{ width: '20%' }}></CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {filteredData.length > 0 ? (
              filteredData.map(item => (
                <CTableRow key={item.id}>
                  <CTableDataCell className="ps-3">{item.name}</CTableDataCell>
                  <CTableDataCell>{item.bssid}</CTableDataCell>
                  <CTableDataCell>
                    <div className="row-actions">
                      <CTooltip content="Chỉnh sửa"><button className="btn-action edit" onClick={() => handleEdit(item.name)}><CIcon icon={cilPencil} /></button></CTooltip>
                      <CTooltip content="Xóa"><button className="btn-action delete" onClick={() => openDeleteModal(item)}><CIcon icon={cilTrash} /></button></CTooltip>
                    </div>
                  </CTableDataCell>
                </CTableRow>
              ))
            ) : (<CTableRow><CTableDataCell colSpan="3" className="text-center py-5 text-muted">Không tìm thấy dữ liệu</CTableDataCell></CTableRow>)}
          </CTableBody>
        </CTable>
      </div>
      <AddWifiModal visible={isModalVisible} onClose={() => setIsModalVisible(false)} defaultName={editingName} onSaveData={handleSaveData} />
      <DeleteConfirmModal visible={deleteModalVisible} onClose={() => setDeleteModalVisible(false)} onConfirm={confirmDelete} message={`Bạn có chắc muốn xóa "${itemToDelete?.name}"?`} />
    </div>
  )
}

// ============================================================================
// 5. COMPONENT CHÍNH
// ============================================================================
const MobileAppAttendance = () => {
  const [subTab, setSubTab] = useState('wifi')
  const [showWifiList, setShowWifiList] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  // Dữ liệu dùng chung (Nâng state lên đây để chia sẻ)
  const [wifiLibrary, setWifiLibrary] = useState([
    { id: 1, name: 'Office_Guest', bssid: 'AA:BB:CC:DD:EE:FF' },
    { id: 2, name: 'Tuan_Wifi', bssid: '00:11:22:33:44:55' },
    { id: 3, name: 'CircleK VN', bssid: '11:22:33:44:55:66' },
  ])

  const [assignments, setAssignments] = useState([
    { id: 1, unit: 'Văn phòng HCM', employee: 'Tất cả nhân viên', wifiName: 'Office_Guest' },
    { id: 2, unit: 'Nhà máy Bình Dương', employee: 'Tất cả nhân viên', wifiName: 'Tuan_Wifi, CircleK VN' },
  ])

  // Modal States
  const [isConfigModalVisible, setIsConfigModalVisible] = useState(false)
  const [editingAssignment, setEditingAssignment] = useState(null)
  const [deleteModalVisible, setDeleteModalVisible] = useState(false)
  const [assignmentToDelete, setAssignmentToDelete] = useState(null)

  const handleOpenAddModal = () => { setEditingAssignment(null); setIsConfigModalVisible(true) }
  const handleEditAssignment = (item) => { setEditingAssignment(item); setIsConfigModalVisible(true) }

  const handleSaveAssignment = (data) => {
    if (editingAssignment) {
      setAssignments(prev => prev.map(item => item.id === editingAssignment.id ? { ...item, ...data } : item))
    } else {
      const newId = Math.max(...assignments.map(a => a.id), 0) + 1
      setAssignments(prev => [...prev, { id: newId, ...data }])
    }
  }

  const openDeleteAssignmentModal = (item) => { setAssignmentToDelete(item); setDeleteModalVisible(true) }
  const confirmDeleteAssignment = () => {
    if (assignmentToDelete) setAssignments(prev => prev.filter(item => item.id !== assignmentToDelete.id))
    setDeleteModalVisible(false); setAssignmentToDelete(null)
  }

  const filteredData = useMemo(() => {
    return assignments.filter(item =>
      item.unit.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.employee.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.wifiName.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [assignments, searchTerm])

  if (showWifiList) {
    return (
      <>
        <PageStyles />
        <WifiListComponent 
          onBack={() => setShowWifiList(false)} 
          wifiList={wifiLibrary} 
          setWifiList={setWifiLibrary} 
          assignments={assignments} // Truyền xuống để check logic xóa
        />
      </>
    )
  }

  return (
    <div className="p-3">
      <PageStyles />
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="mb-0 fw-bold">Quy định chấm công</h4>
      </div>

      <CCard>
        <CCardBody>
          <CNav variant="tabs" className="mb-4">
            {[{ label: 'Chung', path: '/timesheet/attendanceRules' }, { label: 'Số công chuẩn', path: '/timesheet/attendanceRules/standardwork' }, { label: 'Tùy chỉnh bảng công', path: '/timesheet/attendanceRules/custom' }, { label: 'Chấm công trên ứng dụng', path: '/timesheet/attendanceRules/app' }].map((tab) => (
              <CNavItem key={tab.label}>
                <CNavLink as={NavLink} to={tab.path} end style={({ isActive }) => ({ color: isActive ? '#f9b115' : '#666', borderBottom: isActive ? '2px solid #f9b115' : 'none', fontWeight: isActive ? 'bold' : 'normal' })}>
                  {tab.label}
                </CNavLink>
              </CNavItem>
            ))}
          </CNav>

          <div className="mb-3 d-flex align-items-center bg-light p-2 rounded">
            <span className="fw-bold me-3" style={{ fontSize: '0.9rem' }}>Cho phép nhân viên chấm công trên:</span>
            <div className="d-flex gap-3">
              <CFormCheck checked label="Ứng dụng web" disabled />
              <CFormCheck checked label="Ứng dụng mobile" disabled />
            </div>
          </div>

          <div className="mb-3 border-bottom pb-2">
            {[{ id: 'no_auth', label: 'Không xác thực' }, { id: 'wifi', label: 'Kết nối Wi-Fi' }, { id: 'gps', label: 'Định vị GPS' }, { id: 'qr', label: 'Quét mã QR' }, { id: 'face', label: 'Xác nhận khuôn mặt' }, { id: 'doc', label: 'Xác thực bằng tài liệu' }, { id: 'manage', label: 'Quản lý xác nhận' }].map((item, index, arr) => (
              <span key={item.id}>
                <span className={`cursor-pointer px-2 ${subTab === item.id ? 'text-warning fw-bold' : 'text-secondary'}`} style={{ fontSize: '0.9rem', cursor: 'pointer' }} onClick={() => setSubTab(item.id)}>
                  {item.label}
                </span>
                {index < arr.length - 1 && <span className="text-muted">|</span>}
              </span>
            ))}
          </div>

          {subTab === 'wifi' && (
            <div>
              <div className="mb-3">
                <p className="text-muted mb-0" style={{ fontSize: '0.85rem' }}>Cho phép nhân viên chấm công bằng cách kết nối Wi-Fi của công ty</p>
              </div>

              <div className="d-flex justify-content-between align-items-center mb-3">
                <div style={{ width: '300px', position: 'relative' }}>
                  <CFormInput size="sm" placeholder="Tìm kiếm" className="ps-5" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                  <CIcon icon={cilSearch} size="sm" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#999' }} />
                </div>
                <div className="d-flex gap-2">
                   <CButton color="white" size="sm" className="border text-secondary" onClick={() => setShowWifiList(true)}><CIcon icon={cilList} className="me-1" /> Danh mục Wi-Fi</CButton>
                   <CButton className="text-white fw-bold d-flex align-items-center" size="sm" style={{ backgroundColor: '#f26522', borderColor: '#f26522' }} onClick={handleOpenAddModal}>
                     <CIcon icon={cilPlus} className="me-1" size="sm" /> Thêm
                   </CButton>
                </div>
              </div>

              <div className="border rounded" style={{ minHeight: '400px' }}>
                <CTable hover responsive className="mb-0" align="middle">
                  <CTableHead>
                    <CTableRow>
                      <CTableHeaderCell className="bg-light border-bottom" style={{ width: '30%', padding: '12px 16px' }}>Đơn vị áp dụng</CTableHeaderCell>
                      <CTableHeaderCell className="bg-light border-bottom" style={{ width: '30%', padding: '12px 16px' }}>Nhân viên áp dụng</CTableHeaderCell>
                      <CTableHeaderCell className="bg-light border-bottom" style={{ padding: '12px 16px' }}>Wi-Fi chấm công</CTableHeaderCell>
                      <CTableHeaderCell className="bg-light border-bottom text-center" style={{ width: '120px' }}></CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {filteredData.length > 0 ? (
                      filteredData.map(item => (
                        <CTableRow key={item.id}>
                          <CTableDataCell style={{ padding: '12px 16px' }}>{item.unit}</CTableDataCell>
                          <CTableDataCell style={{ padding: '12px 16px' }}>{item.employee}</CTableDataCell>
                          <CTableDataCell style={{ padding: '12px 16px' }}>
                             {/* Hiển thị Tags Wifi */}
                             {item.wifiName.split(',').map((w, i) => (
                               <CBadge key={i} color="light" className="text-dark me-1 border">{w.trim()}</CBadge>
                             ))}
                          </CTableDataCell>
                          <CTableDataCell className="text-center">
                            <div className="row-actions">
                              <CTooltip content="Chỉnh sửa"><button className="btn-action edit" onClick={() => handleEditAssignment(item)}><CIcon icon={cilPencil} /></button></CTooltip>
                              <CTooltip content="Xóa"><button className="btn-action delete" onClick={() => openDeleteAssignmentModal(item)}><CIcon icon={cilTrash} /></button></CTooltip>
                            </div>
                          </CTableDataCell>
                        </CTableRow>
                      ))
                    ) : (<CTableRow><CTableDataCell colSpan="4" className="text-center py-5 text-muted">Không tìm thấy kết quả</CTableDataCell></CTableRow>)}
                  </CTableBody>
                </CTable>
              </div>
            </div>
          )}

          {subTab !== 'wifi' && (
            <div className="text-center py-5 text-muted">Nội dung cho tab <strong>{subTab}</strong> đang được cập nhật...</div>
          )}
        </CCardBody>
      </CCard>

      <ConfigureWifiModal visible={isConfigModalVisible} onClose={() => setIsConfigModalVisible(false)} wifiList={wifiLibrary} onSave={handleSaveAssignment} defaultData={editingAssignment} />
      <DeleteConfirmModal visible={deleteModalVisible} onClose={() => setDeleteModalVisible(false)} onConfirm={confirmDeleteAssignment} message={`Bạn có chắc chắn muốn xóa cấu hình chấm công wifi cho "${assignmentToDelete?.unit}" không?`} />
    </div>
  )
}

export default MobileAppAttendance