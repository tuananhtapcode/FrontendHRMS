import { CCol, CRow } from '@coreui/react'

import QuickStatsChart from '../components/dashboard/QuickStatsChart'
import HumanResourceStats from '../components/dashboard/HumanResourceStats'
import EmployeeStructureChart from '../components/dashboard/EmployeeStructureChart'
import ReminderList from '../components/dashboard/ReminderList'
import LineChart from '../components/dashboard/LineChart'
import BarChart from '../components/dashboard/BarChart'
import { useEffect, useState } from 'react'
import { getDeparmentsStats, getEmployeesStats } from '../api/api'

const Dashboard = () => {
  const [departmentStats, setDeparmentStats] = useState([])
  const [employeesStats, setEmployeesStats] = useState([])
  const [fullTimeActive, setFullTimeActive] = useState([])
  const [partTimeActive, setPartTimeActive] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getDeparmentsStats()
        const labels = Object.keys(res)
        const values = Object.values(res)
        const data = {
          labels,
          datasets: [
            {
              backgroundColor: [
                '#41B883', // green (Vue green)
                '#E46651', // coral red
                '#00D8FF', // cyan
                '#DD1B16', // deep red
                '#FFC107', // amber
                '#9C27B0', // purple
                '#3F51B5', // indigo
                '#009688', // teal
                '#FF5722', // deep orange
                '#795548', // brown
                '#607D8B', // blue grey
                '#4CAF50', // green
                '#2196F3', // blue
                '#F44336', // red
                '#CDDC39', // lime
              ],
              data: values,
            },
          ],
        }
        setDeparmentStats(data)
      } catch (error) {
        console.error(error)
      }
    }
    fetchData()
  }, [])
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getEmployeesStats()
        const data = Object.entries(res.statusStats).map(([label, count]) => ({
          label,
          count,
        }))
        setEmployeesStats(data)
        setFullTimeActive(res.fullTimeActive)
        setPartTimeActive(res.partTimeActive)
      } catch (error) {
        console.error(error)
      }
    }
    fetchData()
  }, [])

  return (
    <>
      <CRow className="mb-4" xs={{ gutter: 4 }}>
        <CCol xl={4}>
          <QuickStatsChart title="Nhân viên toàn thời gian" color="success" data={fullTimeActive} />
        </CCol>
        <CCol xl={4}>
          <QuickStatsChart title="Nhân viên bán thời gian" color="warning" data={partTimeActive} />
        </CCol>
        <CCol xl={4}>
          <HumanResourceStats data={employeesStats} />
        </CCol>
      </CRow>
      <CRow className="mb-4" xs={{ gutter: 4 }} style={{ alignItems: 'stretch' }}>
        <CCol sm={6} xl={4} className="d-flex">
          <EmployeeStructureChart
            title="Cơ cấu nhân sự theo phòng ban"
            data={departmentStats}
            className="flex-fill w-100"
          />
        </CCol>
        <CCol sm={6} xl={4} className="d-flex">
          <EmployeeStructureChart
            title="Thống kê hợp đồng theo loại"
            data={undefined}
            className="flex-fill w-100"
          />
        </CCol>
        <CCol className="d-flex">
          <ReminderList className="flex-fill w-100" />
        </CCol>
      </CRow>

      <CRow className="mb-4" xs={{ gutter: 4 }}>
        <CCol sm={6}>
          <LineChart title="Biến động nhân sự" data={undefined} />
        </CCol>
        <CCol sm={6}>
          <BarChart title="Số lượng nhân sự" />
        </CCol>
      </CRow>
    </>
  )
}

export default Dashboard
