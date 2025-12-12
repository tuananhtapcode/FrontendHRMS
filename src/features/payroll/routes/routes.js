
import { Route, Routes } from "react-router-dom";
import PayrollLayout from "../layout/PayrollLayout";
import OverviewPage from "../pages/OverviewPage";

import AddComponentPage from './pages/components/AddComponentPage';
import ComponentsPage from './pages/components/ComponentsPage';

const PayrollInternalRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<PayrollLayout />}>
        <Route index element={<OverviewPage />} />
        <Route path="components" element={<ComponentsPage />} />

        <Route path="components/add" element={<AddComponentPage />} />
        
        {/* <Route path="calculation/*" element={<CalculationPage />} /> */}
        {/* <Route path="data/*" element={<DataPage />} /> */}
      </Route>

      {/* Fallback */}
      <Route path="*" element={<OverviewPage />} />
    </Routes>
  );
};

export default PayrollInternalRoutes;