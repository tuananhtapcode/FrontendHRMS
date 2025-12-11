// import { CButton } from '@coreui/react'

// // map màu theo reminder.color (warning/info/success/...)
// const dotClass = (color) => `rem-dot rem-dot--${color || 'info'}`

// export default function RemindersCard({
//   reminders = [],
//   loading = false,
//   onAction,
// }) {
//   if (loading) {
//     return (
//       <div className="ovw-reminders">
//         {[1, 2, 3].map((i) => (
//           <div className="rem-item rem-item--skeleton" key={i}>
//             <div className="rem-dot" />
//             <div className="rem-body">
//               <div className="rem-title skeleton-block" />
//               <div className="rem-desc skeleton-block" />
//             </div>
//           </div>
//         ))}
//       </div>
//     )
//   }

//   if (!reminders?.length) {
//     return (
//       <div className="ovw-reminders empty-mini">
//         <div className="empty-mini__txt">Không có lời nhắc.</div>
//       </div>
//     )
//   }

//   return (
//     <div className="ovw-reminders">
//       {reminders.map((r, i) => (
//         <div className="rem-item rem-item--interactive" key={i}>
//           <div className={dotClass(r.color)} />
//           <div className="rem-body">
//             <div className="rem-title">{r.title}</div>
//             <div className="rem-desc">{r.desc}</div>

//             {/* Nút hành động nhỏ kiểu web thật */}
//             {r.actionLabel && (
//               <div className="rem-actions">
//                 <CButton
//                   color="link"
//                   size="sm"
//                   className="px-0"
//                   onClick={() => onAction?.(r, i)}
//                 >
//                   {r.actionLabel}
//                 </CButton>
//               </div>
//             )}
//           </div>
//         </div>
//       ))}
//     </div>
//   )
// }

import { CButton } from '@coreui/react'

const dotClass = (color) => `rem-dot rem-dot--${color || 'info'}`

export default function RemindersCard({
  reminders = [],
  loading = false,
  onAction,
}) {
  if (loading) {
    return (
      <div className="ovw-reminders">
        {[1, 2, 3].map((i) => (
          <div className="rem-item rem-item--skeleton" key={i}>
            <div className="rem-dot" />
            <div className="rem-body">
              <div className="rem-title skeleton-block" />
              <div className="rem-desc skeleton-block" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (!reminders?.length) {
    return (
      <div className="ovw-reminders empty-mini">
        <div className="empty-mini__txt">Không có lời nhắc.</div>
      </div>
    )
  }

  return (
    <div className="ovw-reminders">
      {reminders.map((r, i) => (
        <div className="rem-item rem-item--interactive" key={i}>
          <div className={dotClass(r.color)} />
          <div className="rem-body">
            <div className="rem-title">{r.title}</div>
            <div className="rem-desc">{r.desc}</div>

            {r.actionLabel && (
              <div className="rem-actions">
                <CButton
                  color="link"
                  size="sm"
                  className="px-0"
                  onClick={() => onAction?.(r, i)}
                >
                  {r.actionLabel}
                </CButton>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
