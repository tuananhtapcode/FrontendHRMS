// import { CButton } from '@coreui/react'

// export default function GuideLinksCard({
//   guides = [],
//   onAdd,
// }) {
//   if (!guides.length) {
//     return (
//       <div className="ovw-guide">
//         <div className="ovw-guide__empty">
//           <div className="ovw-guide__empty-title">
//             Chưa có hướng dẫn
//           </div>
//           <div className="ovw-guide__empty-desc">
//             Thêm liên kết quy trình, tài liệu, checklist để người dùng thao tác nhanh.
//           </div>
//           <div className="ovw-guide__empty-actions">
//             <CButton color="primary" size="sm" onClick={onAdd}>
//               Thêm liên kết
//             </CButton>
//           </div>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div className="ovw-guide">
//       <div className="ovw-guide__list">
//         {guides.map((g, i) => (
//           <a
//             key={i}
//             className="ovw-guide__item"
//             href={g.href || '#'}
//             onClick={(e) => {
//               if (!g.href) e.preventDefault()
//               g.onClick?.()
//             }}
//           >
//             <div className="ovw-guide__item-title">{g.title}</div>
//             {g.desc && <div className="ovw-guide__item-desc">{g.desc}</div>}
//           </a>
//         ))}
//       </div>
//       <div className="ovw-guide__footer">
//         <CButton color="link" size="sm" className="px-0" onClick={onAdd}>
//           Quản lý liên kết
//         </CButton>
//       </div>
//     </div>
//   )
// }

import { CButton } from '@coreui/react'

export default function GuideLinksCard({ guides = [], onAdd }) {
  if (!guides.length) {
    return (
      <div className="ovw-guide">
        <div className="ovw-guide__empty">
          <div className="ovw-guide__empty-title">Chưa có hướng dẫn</div>
          <div className="ovw-guide__empty-desc">
            Thêm liên kết quy trình, tài liệu, checklist để thao tác nhanh.
          </div>
          <div className="ovw-guide__empty-actions">
            <CButton color="primary" size="sm" onClick={onAdd}>
              Thêm liên kết
            </CButton>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="ovw-guide">
      <div className="ovw-guide__list">
        {guides.map((g, i) => (
          <a
            key={i}
            className="ovw-guide__item"
            href={g.href || '#'}
            onClick={(e) => {
              if (!g.href) e.preventDefault()
              g.onClick?.()
            }}
          >
            <div className="ovw-guide__item-title">{g.title}</div>
            {g.desc && <div className="ovw-guide__item-desc">{g.desc}</div>}
          </a>
        ))}
      </div>
      <div className="ovw-guide__footer">
        <CButton color="link" size="sm" className="px-0" onClick={onAdd}>
          Quản lý liên kết
        </CButton>
      </div>
    </div>
  )
}
