// // src/features/payroll/hooks/useOverviewData.js
// import { useEffect, useMemo, useState } from 'react'
// import { fetchOverviewData } from '../api/overviewApi'

// // format tiền VNĐ – dùng chung cho KPI & panel
// const formatVND = (n) =>
//   typeof n === 'number'
//     ? new Intl.NumberFormat('vi-VN').format(n) + ' đ'
//     : '—'

// // fallback khi không có lời nhắc
// const REMINDER_FALLBACK = (loading) => [
//   {
//     color: 'warning',
//     title: 'LỜI NHẮC',
//     desc: loading ? 'Đang tải...' : 'Không có dữ liệu',
//   },
// ]

// export function useOverviewData() {
//   const [loading, setLoading] = useState(false)
//   const [error, setError] = useState(null)

//   // gom toàn bộ dữ liệu overview vào 1 state
//   const [overview, setOverview] = useState({
//     summary: null,
//     fundStructure: [],
//     salaryTrend: [],
//     currentPeriod: null,
//     reminders: [],
//     budget: null,
//     guides: [], // ✅ ADD
//   })

//   const {
//     summary,
//     fundStructure,
//     salaryTrend,
//     currentPeriod,
//     reminders,
//     budget,
//     guides, // ✅ ADD
//   } = overview

//   useEffect(() => {
//     let cancelled = false

//     async function load() {
//       try {
//         setLoading(true)
//         setError(null)

//         const res = await fetchOverviewData()
//         if (cancelled) return

//         setOverview({
//           summary: res?.summary ?? null,
//           fundStructure: res?.fundStructure ?? [],
//           salaryTrend: res?.salaryTrend ?? [],
//           currentPeriod: res?.currentPeriod ?? null,
//           reminders: res?.reminders ?? [],
//           budget: res?.budget ?? null,
//           guides: res?.guides ?? [], // ✅ ADD
//         })
//       } catch (e) {
//         console.error('Overview load error:', e)
//         if (!cancelled) {
//           setError('Không thể tải dữ liệu')
//         }
//       } finally {
//         if (!cancelled) {
//           setLoading(false)
//         }
//       }
//     }

//     load()
//     return () => {
//       cancelled = true
//     }
//   }, [])

//   // Tính lương bình quân = tổng lương / headcount
//   const avgSalary = useMemo(() => {
//     if (!summary?.totalSalary || !summary?.headcount) return null
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

//   const displayReminders = reminders?.length
//     ? reminders
//     : REMINDER_FALLBACK(loading)

//   // Trả ra tất cả thứ mà UI cần
//   return {
//     loading,
//     error,
//     summary,
//     fundStructure,
//     salaryTrend,
//     currentPeriod,
//     reminders: displayReminders,
//     budget,
//     guides,  // ✅ ADD để GuideLinksCard dùng
//     kpis,
//     formatVND,
//   }
// }

import { useState, useEffect, useMemo } from 'react'
// 👇 Thay đổi import: Dùng hàm từ file api vừa tạo
import { fetchOverviewData } from '../api/overviewApi'

// Hàm format tiền tệ
const formatVND = (n) => {
  if (n === null || n === undefined) return '—'
  return new Intl.NumberFormat('vi-VN').format(n) + ' đ'
}

export const useOverviewData = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [apiData, setApiData] = useState(null)

  useEffect(() => {
    let mounted = true
    
    const fetchData = async () => {
      setLoading(true)
      try {
        // 👇 Gọi hàm API đã import
        const data = await fetchOverviewData()
        
        if (mounted) {
          setApiData(data) // Hàm unwrap đã lấy data ra rồi, nên ở đây là data luôn
        }
      } catch (err) {
        if (mounted) {
          console.error("Lỗi tải data dashboard:", err)
          setError(err.message || 'Không thể tải dữ liệu tổng quan')
        }
      } finally {
        if (mounted) setLoading(false)
      }
    }

    fetchData()
    return () => { mounted = false }
  }, [])

  // ... (Phần logic useMemo xử lý kpis, salaryTrend, v.v... GIỮ NGUYÊN NHƯ CŨ)
  
  // 1. Xử lý KPI đầu trang
  const kpis = useMemo(() => {
    if (!apiData) return [
        { title: 'Tổng lương', sub: 'Đang tải...', value: '—' },
        { title: 'Thuế TNCN', sub: '', value: '—' },
        { title: 'Bảo hiểm khấu trừ', sub: '', value: '—' },
        { title: 'Nhân sự / Lương TB', sub: '', value: '—' },
    ]

    return [
      {
        title: 'Tổng lương',
        sub: 'Thực chi kỳ này',
        value: formatVND(apiData.totalSalary),
      },
      {
        title: 'Thuế TNCN',
        sub: 'Đã khấu trừ',
        value: formatVND(apiData.personalIncomeTax),
      },
      {
        title: 'Bảo hiểm khấu trừ',
        sub: 'Người lao động đóng',
        value: formatVND(apiData.insuranceDeduction),
      },
      {
        title: 'Nhân sự / Lương TB',
        sub: `${apiData.headcount || 0} nhân sự`,
        value: formatVND(apiData.averageSalary),
      },
    ]
  }, [apiData])

  // 2. Trend
  const salaryTrend = useMemo(() => apiData?.salaryTrend || [], [apiData])

  // 3. Structure
  const fundStructure = useMemo(() => {
    if (!apiData?.fundStructure) return []
    const aggregated = apiData.fundStructure.reduce((acc, curr) => {
      const existing = acc.find(item => item.label === curr.label)
      if (existing) {
        existing.value += curr.value
      } else {
        acc.push({ ...curr }) 
      }
      return acc
    }, [])
    return aggregated.filter(item => item.value > 0)
  }, [apiData])

  // 4. Current Period
  const currentPeriod = useMemo(() => {
    const cp = apiData?.currentPeriod
    if (!cp) return null
    return {
      id: cp.payrollPeriodId,
      name: cp.name,
      status: cp.isClosed ? 'Đã đóng' : 'Đang mở', 
      timeRange: `${cp.startDate} — ${cp.endDate}`,
      paymentDate: cp.paymentDate || 'Chưa xác định',
      approver: null, 
      totalPaid: apiData.totalSalary,
      headcount: apiData.headcount
    }
  }, [apiData])

  // 5. Budget (Ẩn nếu planned = 0)
  const budget = useMemo(() => {
    if (!apiData || !apiData.plannedBudget || apiData.plannedBudget === 0) {
      return null 
    }
    return {
      percent: apiData.budgetUsagePercent,
      plan: apiData.plannedBudget,
      actual: apiData.actualBudget
    }
  }, [apiData])

  // 6. Reminders
  const reminders = useMemo(() => {
    if (!apiData?.reminders) return []
    return apiData.reminders.map((rem, index) => ({
      id: index,
      color: rem.type === 'warning' ? 'warning' : 'info',
      title: 'Thông báo hệ thống',
      desc: rem.message
    }))
  }, [apiData])

  const guides = [
    { title: 'Quy trình tạo kỳ lương', desc: '5 bước chuẩn để mở kỳ, tổng hợp...', onClick: () => {} },
    { title: 'Thiết lập thành phần lương', desc: 'Quản lý earning / deduction...', onClick: () => {} },
  ]

  return {
    loading,
    error,
    kpis,
    salaryTrend,
    fundStructure,
    currentPeriod,
    budget,
    reminders,
    guides,
    formatVND
  }
}