import { CCol, CNav, CNavItem, CNavLink, CRow } from '@coreui/react'
import EmptyCard from '../components/UI/EmptyCard'
import GaugeCard from '../components/UI/GaugeCard'
import Panel from '../components/UI/Panel'
import SummaryCard from '../components/UI/SummaryCard'
import '../scss/overview.scss'

export default function OverviewPage() {
  const kpis = [
    { title: 'Tổng lương', sub: 'Tất cả đơn vị · Quý này', value: '—' },
    { title: 'Thuế TNCN', sub: '', value: '—' },
    { title: 'Bảo hiểm khấu trừ', sub: '', value: '—' },
  ]

  const reminders = [
    { color: 'warning', title: 'CHƯA GỬI PHIẾU LƯƠNG', desc: 'Không có dữ liệu' },
    { color: 'info',    title: 'NV CHÍNH THỨC CHƯA THAM GIA BHXH', desc: 'Không có nhân viên nào' },
    { color: 'success', title: 'LƯƠNG ĐÓNG BH NGOÀI QUY ĐỊNH', desc: 'Không có dữ liệu' },
  ]

  return (
    <div className="payroll-ovw">
      {/* Tabs trên cùng */}
      <div className="ovw-tabs">
        <CNav variant="tabs">
          <CNavItem><CNavLink active>Trợ lý AI</CNavLink></CNavItem>
          <CNavItem><CNavLink>Báo cáo</CNavLink></CNavItem>
          <CNavItem><CNavLink>Quy trình nghiệp vụ</CNavLink></CNavItem>
        </CNav>
      </div>

      {/* KPI đầu trang */}
      <CRow className="mb-4">
        {kpis.map(k => (
          <CCol xs={12} md={4} key={k.title}>
            <SummaryCard title={k.title} sub={k.sub} value={k.value} />
          </CCol>
        ))}
      </CRow>

      <CRow className="gy-4">
        {/* Cột trái */}
        <CCol xs={12} lg={8}>
          <Panel title="Phân tích mức lương nhân viên" subtitle="Tất cả đơn vị">
            <EmptyCard />
          </Panel>

          <Panel title="Cơ cấu thu nhập" subtitle="Tất cả đơn vị · Quý trước">
            <EmptyCard />
          </Panel>

          <Panel title="Tình hình thực hiện ngân sách lương" subtitle="Năm nay · Đơn vị tính: Triệu đồng">
            <GaugeCard percent={12} plan={0} actual={0} />
          </Panel>

          <Panel title="Tình hình thực hiện ngân sách theo thời gian" subtitle="01/01/2025 – 31/12/2025">
            <EmptyCard />
          </Panel>

          <Panel title="Thu nhập bình quân theo thời gian" subtitle="Năm 2025">
            <EmptyCard />
          </Panel>

          <Panel title="Thu nhập bình quân theo đơn vị" subtitle="Quý này">
            <EmptyCard />
          </Panel>
        </CCol>

        {/* Cột phải */}
        <CCol xs={12} lg={4}>
          <Panel title="Phản hồi phiếu lương">
            <EmptyCard />
          </Panel>

          <Panel title="Lời nhắc">
            <div className="ovw-reminders">
              {reminders.map((r, i) => (
                <div className={`rem-item rem-${r.color}`} key={i}>
                  <div className="rem-dot" />
                  <div>
                    <div className="rem-title">{r.title}</div>
                    <div className="rem-desc">{r.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </Panel>

          <Panel title="Hướng dẫn nghiệp vụ">
            <div className="ovw-help">Thêm liên kết/hướng dẫn nghiệp vụ tại đây.</div>
          </Panel>
        </CCol>
      </CRow>
    </div>
  )
}
