// import { CCol, CNav, CNavItem, CNavLink, CRow } from '@coreui/react'
// import { useEffect, useState } from 'react'
// import { getPayrollOverview } from '../api/overviewApi.js'
// import EmptyCard from '../components/UI/EmptyCard'
// import GaugeCard from '../components/UI/GaugeCard'
// import Panel from '../components/UI/Panel'
// import SummaryCard from '../components/UI/SummaryCard'
// import '../scss/overview.scss'

// export default function OverviewPage() {
//   // state cho KPI và lời nhắc
//   const [kpis, setKpis] = useState([
//     { title: 'Tổng lương', sub: 'Tất cả đơn vị · Quý này', value: '—' },
//     { title: 'Thuế TNCN', sub: '', value: '—' },
//     { title: 'Bảo hiểm khấu trừ', sub: '', value: '—' },
//   ])
//   const [reminders, setReminders] = useState([])
//   const [budget, setBudget] = useState({ percent: 0, plan: 0, actual: 0 })
//   const [loading, setLoading] = useState(false)
//   const [error, setError] = useState(null)

//   // gọi mock API 1 lần khi vào trang
//   useEffect(() => {
//     let mounted = true

//     async function load() {
//       try {
//         setLoading(true)
//         setError(null)

//         const res = await getPayrollOverview()
//         if (!mounted) return

//         const data = res.data || {}

//         // nếu API trả đúng cấu trúc MOCK_OVERVIEW ở trên
//         if (data.kpis) setKpis(data.kpis)
//         if (data.reminders) setReminders(data.reminders)
//         if (data.budget) setBudget(data.budget)
//       } catch (e) {
//         if (!mounted) return
//         setError('Không tải được dữ liệu overview')
//       } finally {
//         if (mounted) setLoading(false)
//       }
//     }

//     load()
//     return () => {
//       mounted = false
//     }
//   }, [])

//   return (
//     <div className="payroll-ovw">
//       {/* Tabs trên cùng */}
//       <div className="ovw-tabs">
//         <CNav variant="tabs">
//           <CNavItem>
//             <CNavLink active>Trợ lý AI</CNavLink>
//           </CNavItem>
//           <CNavItem>
//             <CNavLink>Báo cáo</CNavLink>
//           </CNavItem>
//           <CNavItem>
//             <CNavLink>Quy trình nghiệp vụ</CNavLink>
//           </CNavItem>
//         </CNav>
//       </div>

//       {/* KPI đầu trang */}
//       <CRow className="mb-4">
//         {kpis.map((k) => (
//           <CCol xs={12} md={4} key={k.title}>
//             <SummaryCard
//               title={k.title}
//               sub={k.sub}
//               // nếu đang loading thì hiện dấu — để không giật UI
//               value={loading && k.value !== '—' ? '…' : k.value}
//             />
//           </CCol>
//         ))}
//       </CRow>

//       {error && (
//         <div className="text-danger mb-3" style={{ fontSize: 13 }}>
//           {error}
//         </div>
//       )}

//       <CRow className="gy-4">
//         {/* Cột trái */}
//         <CCol xs={12} lg={8}>
//           <Panel title="Phân tích mức lương nhân viên" subtitle="Tất cả đơn vị">
//             <EmptyCard />
//           </Panel>

//           <Panel title="Cơ cấu thu nhập" subtitle="Tất cả đơn vị · Quý trước">
//             <EmptyCard />
//           </Panel>

//           <Panel
//             title="Tình hình thực hiện ngân sách lương"
//             subtitle="Năm nay · Đơn vị tính: Triệu đồng"
//           >
//             <GaugeCard
//               percent={budget.percent}
//               plan={budget.plan}
//               actual={budget.actual}
//             />
//           </Panel>

//           <Panel
//             title="Tình hình thực hiện ngân sách theo thời gian"
//             subtitle="01/01/2025 – 31/12/2025"
//           >
//             <EmptyCard />
//           </Panel>

//           <Panel title="Thu nhập bình quân theo thời gian" subtitle="Năm 2025">
//             <EmptyCard />
//           </Panel>

//           <Panel title="Thu nhập bình quân theo đơn vị" subtitle="Quý này">
//             <EmptyCard />
//           </Panel>
//         </CCol>

//         {/* Cột phải */}
//         <CCol xs={12} lg={4}>
//           <Panel title="Phản hồi phiếu lương">
//             <EmptyCard />
//           </Panel>

//           <Panel title="Lời nhắc">
//             <div className="ovw-reminders">
//               {reminders.map((r, i) => (
//                 <div className={`rem-item rem-${r.color}`} key={i}>
//                   <div className="rem-dot" />
//                   <div>
//                     <div className="rem-title">{r.title}</div>
//                     <div className="rem-desc">{r.desc}</div>
//                   </div>
//                 </div>
//               ))}

//               {(!reminders || reminders.length === 0) && !loading && (
//                 <div className="text-muted small">Không có lời nhắc.</div>
//               )}
//             </div>
//           </Panel>

//           <Panel title="Hướng dẫn nghiệp vụ">
//             <div className="ovw-help">
//               Thêm liên kết/hướng dẫn nghiệp vụ tại đây.
//             </div>
//           </Panel>
//         </CCol>
//       </CRow>
//     </div>
//   )
// }

// src/features/payroll/pages/OverviewPage.js

// src/features/payroll/pages/OverviewPage.js

// import { CCol, CNav, CNavItem, CNavLink, CRow } from '@coreui/react'
// import { useEffect, useMemo, useState } from 'react'
// import EmptyCard from '../components/UI/EmptyCard'
// import GaugeCard from '../components/UI/GaugeCard'
// import Panel from '../components/UI/Panel'
// import SummaryCard from '../components/UI/SummaryCard'
// import '../scss/overview.scss'

// import { fetchOverviewData } from '../api/overviewApi'

// // format tiền VNĐ
// const formatVND = (n) =>
//   typeof n === 'number'
//     ? new Intl.NumberFormat('vi-VN').format(n) + ' đ'
//     : '—'

// export default function OverviewPage() {
//   const [loading, setLoading] = useState(false)
//   const [error, setError] = useState(null)

//   const [summary, setSummary] = useState(null)
//   const [fundStructure, setFundStructure] = useState([])
//   const [salaryTrend, setSalaryTrend] = useState([])
//   const [currentPeriod, setCurrentPeriod] = useState(null)
//   const [reminders, setReminders] = useState([])
//   const [budget, setBudget] = useState(null)

//   useEffect(() => {
//     let mounted = true

//     async function load() {
//       try {
//         setLoading(true)
//         setError(null)

//         const res = await fetchOverviewData()
//         if (!mounted) return

//         setSummary(res.summary)
//         setFundStructure(res.fundStructure || [])
//         setSalaryTrend(res.salaryTrend || [])
//         setCurrentPeriod(res.currentPeriod || null)
//         setReminders(res.reminders || [])
//         setBudget(res.budget || null)
//       } catch (e) {
//         console.error('Overview load error:', e)
//         if (!mounted) return
//         setError('Không thể tải dữ liệu')
//       } finally {
//         if (mounted) setLoading(false)
//       }
//     }

//     load()
//     return () => {
//       mounted = false
//     }
//   }, [])

//   // Tính lương bình quân = tổng lương / headcount
//   const avgSalary = useMemo(() => {
//     if (!summary || !summary.totalSalary || !summary.headcount) return null
//     return summary.totalSalary / summary.headcount
//   }, [summary])

//   // KPI cho 4 ô trên cùng
//   const kpis = useMemo(() => {
//     if (!summary) {
//       return [
//         { title: 'Tổng lương', sub: 'Tất cả đơn vị · Kỳ hiện tại', value: '—' },
//         { title: 'Thuế TNCN', sub: '', value: '—' },
//         { title: 'Bảo hiểm khấu trừ', sub: '', value: '—' },
//         { title: 'Số lượng nhân sự / Lương bình quân', sub: '', value: '—' },
//       ]
//     }

//     return [
//       {
//         title: 'Tổng lương',
//         sub: 'Tất cả đơn vị · Kỳ hiện tại',
//         value: formatVND(summary.totalSalary),
//       },
//       {
//         title: 'Thuế TNCN',
//         sub: '',
//         value: formatVND(summary.personalIncomeTax),
//       },
//       {
//         title: 'Bảo hiểm khấu trừ',
//         sub: '',
//         value: formatVND(summary.insuranceDeduction),
//       },
//       {
//         title: 'Số lượng nhân sự / Lương bình quân',
//         sub: `${summary.headcount} người`,
//         value: avgSalary ? formatVND(Math.round(avgSalary)) : '—',
//       },
//     ]
//   }, [summary, avgSalary])

//   const displayReminders = reminders.length
//     ? reminders
//     : [
//         { color: 'warning', title: 'LỜI NHẮC', desc: loading ? 'Đang tải...' : 'Không có dữ liệu' },
//       ]

//   return (
//     <div className="payroll-ovw">
//       {/* Tabs trên cùng */}
//       <div className="ovw-tabs">
//         <CNav variant="tabs">
//           <CNavItem><CNavLink active>Trợ lý AI</CNavLink></CNavItem>
//           <CNavItem><CNavLink>Báo cáo</CNavLink></CNavItem>
//           <CNavItem><CNavLink>Quy trình nghiệp vụ</CNavLink></CNavItem>
//         </CNav>
//       </div>

//       {/* Nếu lỗi tổng thể */}
//       {error && (
//         <div className="mb-3 text-danger" style={{ fontSize: 13 }}>
//           {error}
//         </div>
//       )}

//       {/* KPI đầu trang */}
//       <CRow className="mb-4">
//         {kpis.map((k) => (
//           <CCol xs={12} md={3} key={k.title}>
//             <SummaryCard title={k.title} sub={k.sub} value={k.value} />
//           </CCol>
//         ))}
//       </CRow>

//       <CRow className="gy-4">
//         {/* Cột trái */}
//         <CCol xs={12} lg={8}>
//           {/* Biểu đồ line – Biến động quỹ lương (tạm thời dùng EmptyCard + text mô tả) */}
//           <Panel title="Biến động quỹ lương" subtitle="Tổng quỹ lương & bình quân theo tháng">
//             {salaryTrend.length === 0 ? (
//               <EmptyCard />
//             ) : (
//               <div style={{ fontSize: 13 }}>
//                 {/* chỗ này sau có thể gắn chart.js / recharts */}
//                 {salaryTrend.map((m) => (
//                   <div key={m.month} style={{ display: 'flex', justifyContent: 'space-between' }}>
//                     <span>{m.month}</span>
//                     <span>Tổng: {formatVND(m.total)} · Bình quân: {formatVND(m.avg)}</span>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </Panel>

//           {/* Cơ cấu quỹ lương – giả lập pie (list) */}
//           <Panel title="Cơ cấu quỹ lương" subtitle="Tỷ trọng các khoản thu nhập/khấu trừ">
//             {fundStructure.length === 0 ? (
//               <EmptyCard />
//             ) : (
//               <div style={{ fontSize: 13 }}>
//                 {fundStructure.map((p) => (
//                   <div
//                     key={p.label}
//                     style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}
//                   >
//                     <span>{p.label}</span>
//                     <span>{formatVND(p.value)}</span>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </Panel>

//           {/* Ngân sách lương – Gauge */}
//           <Panel title="Tình hình thực hiện ngân sách lương" subtitle="Năm nay · Đơn vị tính: tỷ lệ %">
//             {budget ? (
//               <GaugeCard percent={budget.percent} plan={budget.plan} actual={budget.actual} />
//             ) : (
//               <EmptyCard />
//             )}
//           </Panel>
//         </CCol>

//         {/* Cột phải */}
//         <CCol xs={12} lg={4}>
//           {/* Thông tin kỳ lương hiện tại */}
//           <Panel title="Kỳ lương hiện tại">
//             {currentPeriod ? (
//               <div style={{ fontSize: 13, lineHeight: 1.4 }}>
//                 <div><strong>{currentPeriod.name}</strong></div>
//                 <div>Trạng thái: <strong>{currentPeriod.status}</strong></div>
//                 <div>Thời gian: {currentPeriod.timeRange}</div>
//                 <div>Ngày chi trả dự kiến: {currentPeriod.paymentDate}</div>
//                 <div>Người phê duyệt: {currentPeriod.approver}</div>
//                 <div>Tổng thực chi: <strong>{formatVND(currentPeriod.totalPaid)}</strong></div>
//                 <div>Nhân sự: {currentPeriod.headcount} người</div>
//               </div>
//             ) : (
//               <EmptyCard />
//             )}
//           </Panel>

//           {/* Lời nhắc */}
//           <Panel title="Lời nhắc">
//             <div className="ovw-reminders">
//               {displayReminders.map((r, i) => (
//                 <div className={`rem-item rem-${r.color}`} key={i}>
//                   <div className="rem-dot" />
//                   <div>
//                     <div className="rem-title">{r.title}</div>
//                     <div className="rem-desc">{r.desc}</div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </Panel>

//           {/* Hướng dẫn */}
//           <Panel title="Hướng dẫn nghiệp vụ">
//             <div className="ovw-help">
//               Thêm liên kết/hướng dẫn nghiệp vụ tại đây.
//             </div>
//           </Panel>
//         </CCol>
//       </CRow>
//     </div>
//   )
// }

// src/features/payroll/pages/OverviewPage.jsx

// src/features/payroll/pages/OverviewPage.js
// src/features/payroll/pages/OverviewPage.js
// src/features/payroll/pages/OverviewPage.js
// import { CButton, CCol, CNav, CNavItem, CNavLink, CRow } from '@coreui/react'
// import { useNavigate } from 'react-router-dom'

// import EmptyCard from '../components/UI/EmptyCard'
// import GaugeCard from '../components/UI/GaugeCard'
// import Panel from '../components/UI/Panel'
// import SummaryCard from '../components/UI/SummaryCard'
// import '../scss/overview.scss'

// import CurrentPeriodChartCard from '../components/charts/CurrentPeriodChartCard'
// import FundStructurePieChart from '../components/charts/FundStructurePieChart'
// import SalaryTrendLineChart from '../components/charts/SalaryTrendLineChart'
// import GuideLinksCard from '../components/UI/GuideLinksCard'
// import RemindersCard from '../components/UI/RemindersCard'
// import { useOverviewData } from '../hooks/useOverviewData'

// // Helper tạo slug đẹp từ period (không dấu, không ký tự lạ)
// const makeSlugFromPeriod = (p) => {
//   const raw = p?.id || p?.code || p?.name || 'current'
//   return String(raw)
//     .normalize('NFD')
//     .replace(/[\u0300-\u036f]/g, '')   // bỏ dấu
//     .toLowerCase()
//     .replace(/[^a-z0-9]+/g, '-')       // ký tự lạ -> "-"
//     .replace(/-+/g, '-')               // gộp nhiều "-" -> một
//     .replace(/(^-|-$)/g, '')           // bỏ "-" đầu/cuối
// }

// export default function OverviewPage() {
//   const navigate = useNavigate()

//   const {
//     loading,
//     error,
//     summary,
//     fundStructure,
//     salaryTrend,
//     currentPeriod,
//     reminders,
//     budget,
//     kpis,
//     formatVND,
//   } = useOverviewData()


//   const guides = [
//     {
//       title: 'Quy trình tạo kỳ lương',
//       desc: '5 bước chuẩn để mở kỳ, tổng hợp, duyệt và chi trả',
//       onClick: () => navigate('/payroll/periods'),
//     },
//     {
//       title: 'Thiết lập thành phần lương',
//       desc: 'Quản lý earning / deduction / bảo hiểm / thuế',
//       onClick: () => navigate('/payroll/components'),
//     },
//     {
//       title: 'Tạo mẫu bảng lương',
//       desc: 'Dùng lại cho nhiều đơn vị/phòng ban',
//       onClick: () => navigate('/payroll/templates'),
//     },
//     {
//       title: 'Bảng chi trả',
//       desc: 'Theo dõi trạng thái chi trả từng nhân viên',
//       onClick: () => navigate('/payroll/payment/payment-table'),
//     },
//   ]

//   // fallback cho lời nhắc
//   const displayReminders = reminders.length
//     ? reminders
//     : [
//         {
//           color: 'info',
//           title: 'Lời nhắc',
//           desc: loading ? 'Đang tải dữ liệu...' : 'Hiện không có lời nhắc nào.',
//         },
//       ]

//   // Khi bấm "Xem chi tiết" kỳ lương hiện tại
//   const handleViewDetail = (p) => {
//     if (!p) return
//     const slug = makeSlugFromPeriod(p)

//     navigate(`/payroll/periods/${slug}`, {
//       state: { period: p }, // truyền luôn object kỳ lương qua trang detail
//     })
//   }

//   return (
//     <div className="payroll-ovw">
//       {/* Tabs trên cùng */}
//       <div className="ovw-tabs">
//         <CNav variant="tabs">
//           <CNavItem><CNavLink active>Trợ lý AI</CNavLink></CNavItem>
//           <CNavItem><CNavLink>Báo cáo</CNavLink></CNavItem>
//           <CNavItem><CNavLink>Quy trình nghiệp vụ</CNavLink></CNavItem>
//         </CNav>
//       </div>

//       {/* Nếu lỗi tổng thể */}
//       {error && (
//         <div className="mb-3 text-danger" style={{ fontSize: 13 }}>
//           {error}
//         </div>
//       )}

//       {/* Hàng KPI đầu trang */}
//       <CRow className="mb-4 g-3">
//         {kpis.map((k) => (
//           <CCol xs={12} sm={6} lg={3} key={k.title}>
//             <SummaryCard title={k.title} sub={k.sub} value={k.value} />
//           </CCol>
//         ))}
//       </CRow>

//       {/* HÀNG 1: Biến động quỹ lương */}
//       <CRow className="gy-4">
//         <CCol xs={12}>
//           <Panel
//             title="Biến động quỹ lương"
//             subtitle="Tổng quỹ lương & lương bình quân theo các kỳ"
//           >
//             {salaryTrend.length === 0 ? (
//               <EmptyCard />
//             ) : (
//               <div style={{ height: 300 }}>
//                 <SalaryTrendLineChart data={salaryTrend} formatVND={formatVND} />
//               </div>
//             )}
//           </Panel>
//         </CCol>
//       </CRow>

//       {/* HÀNG 2: Cơ cấu quỹ lương */}
//       <CRow className="gy-4">
//         <CCol xs={12}>
//           <Panel
//             title="Cơ cấu quỹ lương"
//             subtitle="Tỷ trọng các khoản thu nhập/khấu trừ"
//           >
//             {fundStructure.length === 0 ? (
//               <EmptyCard />
//             ) : (
//               <FundStructurePieChart data={fundStructure} height={260} />
//             )}
//           </Panel>
//         </CCol>
//       </CRow>

//       {/* HÀNG 3: Kỳ lương hiện tại */}
//       <CRow className="gy-4">
//         <CCol xs={12}>
//           <Panel title="Kỳ lương hiện tại">
//             {currentPeriod ? (
//               <>
//                 <CurrentPeriodChartCard
//                   period={currentPeriod}
//                   fundStructure={fundStructure}
//                   onViewDetail={handleViewDetail}
//                 />

//                 {/* Nút xem tất cả kỳ lương */}
//                 <div className="d-flex justify-content-end mt-2">
//                   <CButton
//                     color="link"
//                     size="sm"
//                     className="px-0"
//                     onClick={() => navigate('/payroll/periods')}
//                   >
//                     Xem tất cả kỳ lương
//                   </CButton>
//                 </div>
//               </>
//             ) : (
//               <EmptyCard />
//             )}
//           </Panel>
//         </CCol>
//       </CRow>

//       {/* HÀNG 4: Ngân sách + Lời nhắc */}
//       <CRow className="gy-4">
//         <CCol xs={12} lg={8}>
//           <Panel
//             title="Tình hình thực hiện ngân sách lương"
//             subtitle="Năm nay · Đơn vị tính: tỷ lệ %"
//           >
//             {budget ? (
//               <GaugeCard
//                 percent={budget.percent}
//                 plan={budget.plan}
//                 actual={budget.actual}
//               />
//             ) : (
//               <EmptyCard />
//             )}
//           </Panel>
//         </CCol>

//         <CCol xs={12} lg={4}>
//           <Panel title="Lời nhắc">
//             <RemindersCard
//               reminders={displayReminders}
//               loading={loading}
//               onAction={(r) => {
//                 // sau này điều hướng theo loại nhắc
//                 console.log('Reminder action:', r)
//               }}
//             />
//           </Panel>

//           <Panel title="Hướng dẫn nghiệp vụ">
//             <GuideLinksCard
//               guides={guides || []}
//               onAdd={() => console.log('Add guide')}
//             />
//           </Panel>
//         </CCol>
//       </CRow>
//     </div>
//   )
// }
import { CButton, CCol, CNav, CNavItem, CNavLink, CRow } from '@coreui/react'
import { useNavigate } from 'react-router-dom'

import EmptyCard from '../components/UI/EmptyCard'
import GuideLinksCard from '../components/UI/GuideLinksCard'
import Panel from '../components/UI/Panel'
import RemindersCard from '../components/UI/RemindersCard'
import SummaryCard from '../components/UI/SummaryCard'
import '../scss/overview.scss'

import CurrentPeriodChartCard from '../components/charts/CurrentPeriodChartCard'
import FundStructurePieChart from '../components/charts/FundStructurePieChart'
import SalaryTrendLineChart from '../components/charts/SalaryTrendLineChart'
import BudgetCard from '../components/UI/BudgetCard'
import { useOverviewData } from '../hooks/useOverviewData'

// Helper tạo slug đẹp từ period
const makeSlugFromPeriod = (p) => {
  const raw = p?.id || p?.code || p?.name || 'current'
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

  const {
    loading,
    error,
    fundStructure,
    salaryTrend,
    currentPeriod,
    reminders,
    budget,
    kpis,
    guides,          // ✅ lấy từ hook
    formatVND,
  } = useOverviewData()

  const displayReminders = reminders?.length
    ? reminders
    : [
        {
          color: 'info',
          title: 'Lời nhắc',
          desc: loading ? 'Đang tải dữ liệu...' : 'Hiện không có lời nhắc nào.',
        },
      ]

  const handleViewDetail = (p) => {
    if (!p) return
    const slug = makeSlugFromPeriod(p)
    navigate(`/payroll/periods/${slug}`, { state: { period: p } })
  }

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

      {error && (
        <div className="mb-3 text-danger" style={{ fontSize: 13 }}>
          {error}
        </div>
      )}

      {/* KPI */}
      <CRow className="mb-4 g-3">
        {kpis.map((k) => (
          <CCol xs={12} sm={6} lg={3} key={k.title}>
            <SummaryCard title={k.title} sub={k.sub} value={k.value} />
          </CCol>
        ))}
      </CRow>

      {/* Biến động quỹ lương */}
      <CRow className="gy-4">
        <CCol xs={12}>
          <Panel title="Biến động quỹ lương" subtitle="Tổng quỹ lương & lương bình quân theo các kỳ">
            {salaryTrend.length === 0 ? (
              <EmptyCard />
            ) : (
              <div style={{ height: 300 }}>
                <SalaryTrendLineChart data={salaryTrend} formatVND={formatVND} />
              </div>
            )}
          </Panel>
        </CCol>
      </CRow>

      {/* Cơ cấu quỹ lương */}
      <CRow className="gy-4">
        <CCol xs={12}>
          <Panel title="Cơ cấu quỹ lương" subtitle="Tỷ trọng các khoản thu nhập/khấu trừ">
            {fundStructure.length === 0 ? (
              <EmptyCard />
            ) : (
              <FundStructurePieChart data={fundStructure} height={260} />
            )}
          </Panel>
        </CCol>
      </CRow>

      {/* Kỳ lương hiện tại */}
      <CRow className="gy-4">
        <CCol xs={12}>
          <Panel title="Kỳ lương hiện tại">
            {currentPeriod ? (
              <>
                <CurrentPeriodChartCard
                  period={currentPeriod}
                  fundStructure={fundStructure}
                  onViewDetail={handleViewDetail}
                />
                <div className="d-flex justify-content-end mt-2">
                  <CButton
                    color="link"
                    size="sm"
                    className="px-0"
                    onClick={() => navigate('/payroll/periods')}
                  >
                    Xem tất cả kỳ lương
                  </CButton>
                </div>
              </>
            ) : (
              <EmptyCard />
            )}
          </Panel>
        </CCol>
      </CRow>

      {/* Ngân sách + Lời nhắc + Hướng dẫn */}
      <CRow className="gy-4">
        <CCol xs={12} lg={8}>
          <Panel
            title="Tình hình thực hiện ngân sách lương"
            subtitle="Năm nay · Đơn vị tính: tỷ lệ %"
          >
            {budget ? (
              <BudgetCard
                budget={budget}
                onViewDetail={() => console.log('Go budget detail')}
                onOpenReport={() => navigate('/payroll/reports/cost-summary')}
                onSetupAlert={() => console.log('Setup alert')}
              />
            ) : (
              <EmptyCard />
            )}
          </Panel>
        </CCol>

        <CCol xs={12} lg={4}>
          <Panel title="Lời nhắc">
            <RemindersCard
              reminders={displayReminders}
              loading={loading}
              onAction={(r) => {
                // demo hành vi giống web thật
                if (r?.title?.includes('PHIẾU LƯƠNG')) {
                  navigate('/payroll/payment/payment-table')
                } else if (r?.title?.includes('BHXH')) {
                  navigate('/payroll/settings/employees')
                }
              }}
            />
          </Panel>

          <Panel title="Hướng dẫn nghiệp vụ">
            <GuideLinksCard
              guides={guides || []}
              onAdd={() => console.log('Add guide')}
            />
          </Panel>
        </CCol>
      </CRow>
    </div>
  )
}
