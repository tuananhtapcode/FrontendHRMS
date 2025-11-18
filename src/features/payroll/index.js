import { Suspense, lazy } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';



// Layout & pages
import PayrollLayout from './layout/PayrollLayout';
import OverviewPage from './pages/OverviewPage';
import AddComponentPage from './pages/components/AddComponentPage';
import ComponentsPage from './pages/components/ComponentsPage';

// Sau này có thể thêm lazy load các trang khác
// const CalculationPage = lazy(() => import('./pages/calculation/CalculationPage'))
// const DataPage = lazy(() => import('./pages/data/DataPage'))

const TemplatesPage = lazy(() => import('./pages/templates/TemplatesPage'));
const TemplateFormPage = lazy(() => import('./pages/templates/TemplateFormPage'));
const TimekeepingPage = lazy(() => import('./pages/data/TimekeepingPage'));
const PayrollPage = lazy(() => import('./pages/calculation/PayrollPage'));
// --- Thêm import cho trang Tổng hợp lương ---
const SalarySummaryPage = lazy(() => import('./pages/calculation/SalarySummaryPage'));

// --- Import cho trang Bảng chi trả ---
const PaymentTablePage = lazy(() => import('./pages/payment/PaymentTablePage'));
const PaymentSummaryPage = lazy(() => import('./pages/payment/PaymentSummaryPage'))

const EmployeeIncomeReportPage = lazy(() => import('./pages/reports/EmployeeIncomeReportPage'))

const SalaryOverTimeReportPage = lazy(() => import('./pages/reports/SalaryOverTimeReportPage'))
const CostSummaryReportPage = lazy(() => import('./pages/reports/CostSummaryReportPage'))
const PaymentSummaryReportPage = lazy(() => import('./pages/reports/PaymentSummaryReportPage'))
const SalaryHistoryReportPage = lazy(() => import('./pages/reports/SalaryHistoryReportPage'))


import { USE_MOCK } from '../payroll/config';

async function ensureMock() {
  if (import.meta.env.DEV && USE_MOCK) {
    const { worker } = await import('../payroll/mocks/browser')
    await worker.start({
      serviceWorker: { url: '/mockServiceWorker.js' },
      onUnhandledRequest: 'bypass', // tránh ảnh hưởng module khác
    })
  }
}
ensureMock()


const PayrollModule = () => {
  return (
    <Suspense fallback={<div>Đang tải trang...</div>}>
      <Routes>
        {/* Layout chung cho toàn bộ module Payroll */}
        <Route path="/" element={<PayrollLayout />}>
          {/* /payroll */}
          <Route index element={<OverviewPage />} />
          
          {/* /payroll/components */}
          <Route path="components" element={<ComponentsPage />} />
          <Route path="components/add" element={<AddComponentPage />} />

          {/* --- MỚI: Route cho Mẫu bảng lương --- */}
          {/* /payroll/templates */}
          <Route path="templates" element={<TemplatesPage />} />
          {/* /payroll/templates/new */}
          <Route path="templates/new" element={<TemplateFormPage />} />
          {/* /payroll/templates/edit/:id */}
          <Route path="templates/edit/:id" element={<TemplateFormPage />} />
          {/* --------------------------------- */}

          {/* /payroll/data */}
          <Route path="data" element={<Navigate to="data/timekeeping" replace />} />
          {/* /payroll/data/timekeeping */}
          <Route path="data/timekeeping" element={<TimekeepingPage />} />
          
          {/* Các route khác (sau này mở comment khi code xong) */}
          {/* /payroll/calculation/payroll-table */}
          <Route path="calculation/payroll-table" element={<PayrollPage />} />
          {/* /payroll/calculation/summary */}
          <Route path="calculation/summary" element={<SalarySummaryPage />} />
          {/* --- Route cho Bảng chi trả (Đúng với link của bạn) --- */}
          {/* /payroll/payment/payment-table */}
          <Route path="payment/payment-table" element={<PaymentTablePage />} />
          {/* ------------------------------------------- */}
          <Route path="payment/payment-summary" element={<PaymentSummaryPage />} />

          <Route path="reports/employee-income" element={<EmployeeIncomeReportPage />} />

          <Route path="reports/hourly-statistics" element={<SalaryOverTimeReportPage />} />
          <Route path="reports/cost-summary" element={<CostSummaryReportPage />} />
          <Route path="reports/payment-summary" element={<PaymentSummaryReportPage />} />
          <Route path="reports/salary-history" element={<SalaryHistoryReportPage />} />

          <Route path="*" element={<Navigate to="." replace />} />
        </Route>
      </Routes>
    </Suspense>
  )
}

export default PayrollModule