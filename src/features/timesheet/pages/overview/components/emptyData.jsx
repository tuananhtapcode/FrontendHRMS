import { cilFile } from '@coreui/icons'; // Dùng icon file cho giống
import CIcon from '@coreui/icons-react';
import './emptyData.css'; // Import file CSS

const EmptyData = () => {
  return (
    <div className="empty-data-container">
      <div className="empty-data-icon">
        <CIcon icon={cilFile} size="xxl" />
      </div>
      <span className="empty-data-text">Không có dữ liệu</span>
    </div>
  );
};

export default EmptyData;