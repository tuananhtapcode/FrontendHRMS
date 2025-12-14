import React, { useEffect, useState, useMemo } from 'react'
import { CButton, CCol, CNav, CNavItem, CNavLink, CRow, CFormSelect, CSpinner } from '@coreui/react'
import { useNavigate } from 'react-router-dom'

// Import UI Components
import EmptyCard from '../components/UI/EmptyCard'
import GuideLinksCard from '../components/UI/GuideLinksCard'
import Panel from '../components/UI/Panel'
import RemindersCard from '../components/UI/RemindersCard'
import SummaryCard from '../components/UI/SummaryCard'
import BudgetCard from '../components/UI/BudgetCard'

// Import Charts
import CurrentPeriodChartCard from '../components/charts/CurrentPeriodChartCard'
import FundStructurePieChart from '../components/charts/FundStructurePieChart'
import SalaryTrendLineChart from '../components/charts/SalaryTrendLineChart'

// Import Hooks & API
import { useOverviewData } from '../hooks/useOverviewData'
import { fetchPayrollPeriods, fetchPayrolls } from '../api/payrollApi' 
import '../scss/overview.scss'

// Helper: Tạo slug URL
const makeSlugFromPeriod = (p) => {
  const raw = p?.id || p?.payrollPeriodId || p?.code || p?.name || 'current'
  return String(raw)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export default function OverviewPage() {
  const navigate = useNavigate()

  // 1. Dữ liệu Tổng quan mặc định (Default Dashboard Data)
  const {
    loading: defaultLoading,
    error,
    fundStructure: defaultStructure, // Dữ liệu cơ cấu "xịn" từ Dashboard API
    salaryTrend,
    currentPeriod: defaultPeriodInfo,
    reminders,
    budget,
    kpis,
    guides,
    formatVND,
  } = useOverviewData()

  // 2. States quản lý logic chọn kỳ
  const [allPeriods, setAllPeriods] = useState([]) 
  const [selectedPeriodId, setSelectedPeriodId] = useState('') 
  
  // State lưu dữ liệu tính toán cục bộ
  const [localStats, setLocalStats] = useState({
    loading: false,
    isDefault: true, // Mặc định là đang dùng data dashboard
    totalSalary: 0,
    headcount: 0,
    tax: 0,
    insurance: 0
  })

  // 3. Load danh sách kỳ lương khi vào trang
  useEffect(() => {
    const loadPeriods = async () => {
      try {
        const data = await fetchPayrollPeriods()
        // Sort: Mới nhất lên đầu
        const sorted = (data || []).sort((a, b) => new Date(b.startDate) - new Date(a.startDate))
        setAllPeriods(sorted)
        
        // Mặc định chọn kỳ đầu tiên (Mới nhất)
        if (sorted.length > 0) {
          setSelectedPeriodId(sorted[0].payrollPeriodId)
        }
      } catch (err) {
        console.error("Lỗi tải danh sách kỳ lương:", err)
      }
    }
    loadPeriods()
  }, [])

  // 4. LOGIC TÍNH TOÁN: Khi chọn kỳ khác -> Gọi API list -> Cộng dồn số liệu
  useEffect(() => {
    if (!selectedPeriodId) return

    const calculateLocalData = async () => {
      // Nếu ID chọn trùng với ID mặc định của Dashboard API -> Dùng luôn data xịn
      if (defaultPeriodInfo && String(selectedPeriodId) === String(defaultPeriodInfo.id)) {
        setLocalStats({ loading: false, isDefault: true })
        return
      }

      setLocalStats(prev => ({ ...prev, loading: true, isDefault: false }))
      
      try {
        // Gọi API lấy danh sách nhân viên của kỳ đã chọn (lấy size lớn để cộng tổng)
        const res = await fetchPayrolls({ periodId: selectedPeriodId, page: 0, size: 10000 })
        const list = res.content || []

        // Cộng dồn các chỉ số
        const totalSal = list.reduce((sum, item) => sum + (item.totalSalary || 0), 0)
        
        // Lưu ý: Nếu API list chưa trả về tax/insurance thì nó sẽ là 0
        const totalTax = list.reduce((sum, item) => sum + (item.personalIncomeTax || 0), 0)
        const totalIns = list.reduce((sum, item) => sum + (item.insuranceDeduction || 0), 0)

        setLocalStats({
          loading: false,
          isDefault: false, // Đánh dấu là đang dùng data tính toán
          totalSalary: totalSal,
          headcount: res.totalElements || list.length,
          tax: totalTax,
          insurance: totalIns
        })
      } catch (e) {
        console.error("Lỗi tính toán chi tiết:", e)
        setLocalStats(prev => ({ ...prev, loading: false, isDefault: false, totalSalary: 0, headcount: 0 }))
      }
    }

    calculateLocalData()
  }, [selectedPeriodId, defaultPeriodInfo])


  // 5. Chuẩn bị dữ liệu hiển thị 

  // A. KPIs (4 Card đầu trang) - Cập nhật theo kỳ chọn
  const displayKpis = useMemo(() => {
    if (localStats.isDefault && defaultPeriodInfo) {
      // Dữ liệu từ Dashboard API
      return kpis 
    }

    // Dữ liệu từ tính toán local (khi chọn kỳ quá khứ/tương lai)
    return [
      { title: 'Tổng lương', sub: 'Thực chi kỳ này', value: formatVND(localStats.totalSalary) },
      { title: 'Thuế TNCN', sub: 'Đã khấu trừ', value: formatVND(localStats.tax) },
      { title: 'Bảo hiểm', sub: 'Khấu trừ NLĐ', value: formatVND(localStats.insurance) },
      { title: 'Nhân sự', sub: 'Số người được tính', value: `${localStats.headcount} người` },
    ]
  }, [localStats, defaultPeriodInfo, kpis, formatVND])


  // B. Thông tin Card Kỳ lương hiện tại
  const displayPeriodInfo = useMemo(() => {
    const found = allPeriods.find(p => String(p.payrollPeriodId) === String(selectedPeriodId))
    if (!found) return null

    return {
      id: found.payrollPeriodId,
      name: found.name,
      status: found.isClosed ? 'Đã đóng' : 'Đang mở',
      timeRange: `${found.startDate} — ${found.endDate}`,
      paymentDate: found.paymentDate,
      approver: '---', 
      // Switch dữ liệu: Default vs Local
      totalPaid: localStats.isDefault ? defaultPeriodInfo?.totalPaid : localStats.totalSalary,
      headcount: localStats.isDefault ? defaultPeriodInfo?.headcount : localStats.headcount
    }
  }, [selectedPeriodId, allPeriods, localStats, defaultPeriodInfo])


  // C. ✅ FIX QUAN TRỌNG: Dữ liệu biểu đồ cột nhỏ (Mini Chart)
  const displayMiniStructure = useMemo(() => {
    if (localStats.isDefault) {
      return defaultStructure // Nếu là kỳ mặc định -> Có data chi tiết -> Hiển thị
    }
    // Nếu là kỳ khác (local calculation) -> Ta không có chi tiết từng khoản -> Trả về rỗng
    // Kết quả: Card sẽ hiện "Chưa có dữ liệu cơ cấu" thay vì hiện sai biểu đồ của kỳ khác.
    return [] 
  }, [localStats.isDefault, defaultStructure])


  // Handler điều hướng
  const handleViewDetail = (p) => {
    if (!p) return
    const slug = makeSlugFromPeriod(p)
    navigate(`/payroll/periods/${slug}`, { state: { period: p } })
  }

  // Dropdown Header
  const PeriodHeaderControl = () => (
    <div className="d-flex align-items-center justify-content-between w-100">
      <span className="me-3">Thông tin Kỳ lương</span>
      <div className="d-flex align-items-center">
        {localStats.loading && <CSpinner size="sm" color="primary" className="me-2" variant="grow"/>}
        <CFormSelect 
          size="sm" 
          className="w-auto fw-bold text-primary border-primary shadow-sm" 
          style={{minWidth: '220px', cursor: 'pointer'}}
          value={selectedPeriodId}
          onChange={(e) => setSelectedPeriodId(e.target.value)}
          onClick={(e) => e.stopPropagation()} 
        >
          {allPeriods.map(p => (
            <option key={p.payrollPeriodId} value={p.payrollPeriodId}>
              {p.name}
            </option>
          ))}
        </CFormSelect>
      </div>
    </div>
  )

  const displayReminders = reminders?.length ? reminders : [{ color: 'info', title: 'Hệ thống', desc: 'Không có lời nhắc.' }]

  return (
    <div className="payroll-ovw">
      {/* Tabs */}
      <div className="ovw-tabs">
        <CNav variant="tabs">
          <CNavItem><CNavLink active>Trợ lý AI</CNavLink></CNavItem>
          <CNavItem><CNavLink>Báo cáo</CNavLink></CNavItem>
          <CNavItem><CNavLink>Quy trình nghiệp vụ</CNavLink></CNavItem>
        </CNav>
      </div>

      {error && <div className="mb-3 text-danger small fw-bold">⚠️ {error}</div>}

      {/* --- HÀNG 1: KPI (Dynamic) --- */}
      <CRow className="mb-4 g-3">
        {displayKpis.map((k, index) => (
          <CCol xs={12} sm={6} lg={3} key={index}>
            <SummaryCard title={k.title} sub={k.sub} value={localStats.loading ? '...' : k.value} />
          </CCol>
        ))}
      </CRow>

      {/* --- HÀNG 2: BIẾN ĐỘNG QUỸ LƯƠNG (Static - Cả năm) --- */}
      <CRow className="gy-4 mb-4">
        <CCol xs={12}>
          <Panel title="Biến động quỹ lương" subtitle="Tổng quan xu hướng chi trả lương trong năm">
            {salaryTrend.length === 0 ? (
              <EmptyCard text="Chưa có dữ liệu" />
            ) : (
              <div style={{ height: 300 }}>
                <SalaryTrendLineChart data={salaryTrend} formatVND={formatVND} />
              </div>
            )}
          </Panel>
        </CCol>
      </CRow>

      {/* --- HÀNG 3: CƠ CẤU QUỸ LƯƠNG (Static - Cả năm) --- */}
      <CRow className="gy-4 mb-4">
        <CCol xs={12}>
          <Panel title="Cơ cấu quỹ lương" subtitle="Phân bổ thu nhập/khấu trừ (Tổng quan Năm 2025)">
            {defaultStructure.length === 0 ? (
              <EmptyCard text="Chưa có dữ liệu" />
            ) : (
              /* Luôn dùng defaultStructure cho biểu đồ tròn */
              <FundStructurePieChart data={defaultStructure} height={320} />
            )}
          </Panel>
        </CCol>
      </CRow>

      {/* --- HÀNG 4: KỲ LƯƠNG HIỆN TẠI (Dynamic - Có Dropdown) --- */}
      <CRow className="gy-4 mb-4">
        <CCol xs={12}>
          <Panel title={<PeriodHeaderControl />}>
            {displayPeriodInfo ? (
              <>
                <CurrentPeriodChartCard
                  period={displayPeriodInfo}
                  // ✅ Fix: Truyền displayMiniStructure (sẽ rỗng nếu chọn kỳ khác)
                  fundStructure={displayMiniStructure} 
                  onViewDetail={handleViewDetail}
                />
                <div className="d-flex justify-content-end mt-2">
                  <CButton
                    color="link"
                    size="sm"
                    className="px-0 text-decoration-none"
                    onClick={() => navigate('/payroll/periods')}
                  >
                    Quản lý danh sách kỳ lương &rarr;
                  </CButton>
                </div>
              </>
            ) : (
              <EmptyCard text="Vui lòng chọn một kỳ lương" />
            )}
          </Panel>
        </CCol>
      </CRow>

      {/* --- HÀNG 5: NGÂN SÁCH & LỜI NHẮC --- */}
      <CRow className="gy-4">
        {budget && (
          <CCol xs={12} lg={8}>
            <Panel title="Tình hình ngân sách lương" subtitle="Năm nay · Đơn vị tính: tỷ lệ %">
              <BudgetCard budget={budget} />
            </Panel>
          </CCol>
        )}

        <CCol xs={12} lg={budget ? 4 : 12}>
          <CRow className="gy-4">
            <CCol xs={12} md={budget ? 12 : 6}>
              <Panel title="Lời nhắc">
                <RemindersCard reminders={displayReminders} loading={defaultLoading} />
              </Panel>
            </CCol>
            <CCol xs={12} md={budget ? 12 : 6}>
              <Panel title="Hướng dẫn nghiệp vụ">
                <GuideLinksCard guides={guides || []} />
              </Panel>
            </CCol>
          </CRow>
        </CCol>
      </CRow>
    </div>
  )
}