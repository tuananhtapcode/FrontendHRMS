
export default function EmptyCard({ text = 'Không có dữ liệu' }) {
  return (
    <div className="empty">
      <div className="empty-ico">📄</div>
      <div className="empty-txt">{text}</div>
    </div>
  )
}
