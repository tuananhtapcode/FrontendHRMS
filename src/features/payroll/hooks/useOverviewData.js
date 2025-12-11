// src/features/payroll/hooks/useOverviewData.js
import { useEffect, useMemo, useState } from 'react'
import { fetchOverviewData } from '../api/overviewApi'

// format tiền VNĐ – dùng chung cho KPI & panel
const formatVND = (n) =>
  typeof n === 'number'
    ? new Intl.NumberFormat('vi-VN').format(n) + ' đ'
    : '—'

// fallback khi không có lời nhắc
const REMINDER_FALLBACK = (loading) => [
  {
    color: 'warning',
    title: 'LỜI NHẮC',
    desc: loading ? 'Đang tải...' : 'Không có dữ liệu',
  },
]

export function useOverviewData() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // gom toàn bộ dữ liệu overview vào 1 state
  const [overview, setOverview] = useState({
    summary: null,
    fundStructure: [],
    salaryTrend: [],
    currentPeriod: null,
    reminders: [],
    budget: null,
    guides: [], // ✅ ADD
  })

  const {
    summary,
    fundStructure,
    salaryTrend,
    currentPeriod,
    reminders,
    budget,
    guides, // ✅ ADD
  } = overview

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        setLoading(true)
        setError(null)

        const res = await fetchOverviewData()
        if (cancelled) return

        setOverview({
          summary: res?.summary ?? null,
          fundStructure: res?.fundStructure ?? [],
          salaryTrend: res?.salaryTrend ?? [],
          currentPeriod: res?.currentPeriod ?? null,
          reminders: res?.reminders ?? [],
          budget: res?.budget ?? null,
          guides: res?.guides ?? [], // ✅ ADD
        })
      } catch (e) {
        console.error('Overview load error:', e)
        if (!cancelled) {
          setError('Không thể tải dữ liệu')
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [])

  // Tính lương bình quân = tổng lương / headcount
  const avgSalary = useMemo(() => {
    if (!summary?.totalSalary || !summary?.headcount) return null
    return summary.totalSalary / summary.headcount
  }, [summary])

  // KPI cho 4 ô trên cùng
  const kpis = useMemo(() => {
    if (!summary) {
      return [
        { title: 'Tổng lương', sub: 'Tất cả đơn vị · Kỳ hiện tại', value: '—' },
        { title: 'Thuế TNCN', sub: '', value: '—' },
        { title: 'Bảo hiểm khấu trừ', sub: '', value: '—' },
        { title: 'Số lượng nhân sự / Lương bình quân', sub: '', value: '—' },
      ]
    }

    return [
      {
        title: 'Tổng lương',
        sub: 'Tất cả đơn vị · Kỳ hiện tại',
        value: formatVND(summary.totalSalary),
      },
      {
        title: 'Thuế TNCN',
        sub: '',
        value: formatVND(summary.personalIncomeTax),
      },
      {
        title: 'Bảo hiểm khấu trừ',
        sub: '',
        value: formatVND(summary.insuranceDeduction),
      },
      {
        title: 'Số lượng nhân sự / Lương bình quân',
        sub: `${summary.headcount} người`,
        value: avgSalary ? formatVND(Math.round(avgSalary)) : '—',
      },
    ]
  }, [summary, avgSalary])

  const displayReminders = reminders?.length
    ? reminders
    : REMINDER_FALLBACK(loading)

  // Trả ra tất cả thứ mà UI cần
  return {
    loading,
    error,
    summary,
    fundStructure,
    salaryTrend,
    currentPeriod,
    reminders: displayReminders,
    budget,
    guides,  // ✅ ADD để GuideLinksCard dùng
    kpis,
    formatVND,
  }
}
