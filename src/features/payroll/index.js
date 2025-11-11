// import { Suspense } from 'react'
// import { Navigate, Route, Routes } from 'react-router-dom'

// // Trang chính (tổng quan)
// import OverviewPage from './pages/OverviewPage'

// // Sau này bạn có thể thêm các trang con
// // const CalculationPage = lazy(() => import('./pages/calculation/CalculationPage'))
// // const DataPage = lazy(() => import('./pages/data/DataPage'))

// const PayrollModule = () => {
//   return (
//     <Suspense fallback={<div>Đang tải trang...</div>}>
//       <Routes>
//         {/* Trang tổng quan /payroll */}
//         <Route index element={<OverviewPage />} />
        


//         {/* Ví dụ các route khác (mở comment khi code xong các trang đó) */}
//         {/* <Route path="calculation/*" element={<CalculationPage />} /> */}
//         {/* <Route path="data/*" element={<DataPage />} /> */}

//         {/* Redirect khi path không khớp */}
//         <Route path="*" element={<Navigate to="." replace />} />
//       </Routes>
//     </Suspense>
//   )
// }

// export default PayrollModule
import { Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';



// Layout & pages
import PayrollLayout from './layout/PayrollLayout';
import OverviewPage from './pages/OverviewPage';
import AddComponentPage from './pages/components/AddComponentPage';
import ComponentsPage from './pages/components/ComponentsPage';

// Sau này có thể thêm lazy load các trang khác
// const CalculationPage = lazy(() => import('./pages/calculation/CalculationPage'))
// const DataPage = lazy(() => import('./pages/data/DataPage'))

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
          
          {/* Các route khác (sau này mở comment khi code xong) */}
          {/* <Route path="calculation/*" element={<CalculationPage />} /> */}
          {/* <Route path="data/*" element={<DataPage />} /> */}

          {/* Fallback nếu path không tồn tại */}
          <Route path="*" element={<Navigate to="." replace />} />
        </Route>
      </Routes>
    </Suspense>
  )
}

export default PayrollModule