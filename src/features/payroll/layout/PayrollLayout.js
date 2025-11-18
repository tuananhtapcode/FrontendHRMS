
import { Outlet } from 'react-router-dom';

export default function PayrollLayout() {
  const nav = [
    { label: 'Tổng quan', to: '' },          // '' == /payroll
    { label: 'Thành phần lương', to: 'components' },
    // { label: 'Tính lương', to: 'calculation' },
    // { label: 'Dữ liệu', to: 'data' },
  ];

  return (
    <div style={{ padding: 0, margin: 0, width: '100%', minHeight: '100vh', boxSizing: 'border-box' }}>
      <Outlet />
    </div>

  );
}
