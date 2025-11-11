// import { NavLink, Outlet } from 'react-router-dom';

// export default function PayrollLayout() {
//   const nav = [
//     { label: 'Tổng quan', to: '' },          // '' == /payroll
//     // { label: 'Tính lương', to: 'calculation' },
//     // { label: 'Dữ liệu', to: 'data' },
//   ];

//   return (
//     <div style={{ display:'grid', gridTemplateColumns:'240px 1fr', minHeight:'100vh' }}>
//       <aside style={{ borderRight:'1px solid #eee', padding:16 }}>
//         <h3 style={{ marginBottom:12 }}>Tiền lương</h3>
//         <ul style={{ display:'grid', gap:8 }}>
//           {nav.map(i => (
//             <li key={i.to}>
//               {/* NavLink dùng đường dẫn TƯƠNG ĐỐI */}
//               <NavLink to={i.to} end
//                 style={({isActive}) => ({
//                   display:'block', padding:'8px 10px', borderRadius:8,
//                   background:isActive ? '#f0f7ff' : 'transparent',
//                   color:isActive ? '#0b62e0' : '#333', textDecoration:'none'
//                 })}
//               >
//                 {i.label}
//               </NavLink>
//             </li>
//           ))}
//         </ul>
//       </aside>

//       <main style={{ padding:20 }}>
//         <Outlet />
//       </main>
//     </div>
//   );
// }
import { Outlet } from 'react-router-dom';

export default function PayrollLayout() {
  const nav = [
    { label: 'Tổng quan', to: '' },          // '' == /payroll
    { label: 'Thành phần lương', to: 'components' },
    // { label: 'Tính lương', to: 'calculation' },
    // { label: 'Dữ liệu', to: 'data' },
  ];

  return (
    // <div style={{ display:'grid', gridTemplateColumns:'240px 1fr', minHeight:'100vh' }}>
    //   <aside style={{ borderRight:'1px solid #eee', padding:16 }}>
    //     <h3 style={{ marginBottom:12 }}>Tiền lương</h3>
    //     <ul style={{ display:'grid', gap:8, listStyle:'none', padding:0, margin:0 }}>
    //       {nav.map(i => (
    //         <li key={i.to}>
    //           {/* NavLink dùng đường dẫn TƯƠNG ĐỐI */}
    //           <NavLink
    //             to={i.to}
    //             end
    //             style={({isActive}) => ({
    //               display:'block', padding:'8px 10px', borderRadius:8,
    //               background:isActive ? '#f0f7ff' : 'transparent',
    //               color:isActive ? '#0b62e0' : '#333', textDecoration:'none'
    //             })}
    //           >
    //             {i.label}
    //           </NavLink>
    //         </li>
    //       ))}
    //     </ul>
    //   </aside>

    //   <main style={{ padding:20 }}>
    //     <Outlet />
    //   </main>
    // </div>
    <div style={{ padding: 0, margin: 0, width: '100%', minHeight: '100vh', boxSizing: 'border-box' }}>
      <Outlet />
    </div>

  );
}