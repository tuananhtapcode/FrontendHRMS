
import { cilArrowBottom, cilCheckAlt } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import {
  CDropdown,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
} from '@coreui/react';
import { useState } from 'react';
import './statCard.css'; // Import file CSS

const StatCard = ({ variant, icon, title, initialFilter, children }) => {
  const [selectedFilter, setSelectedFilter] = useState(initialFilter || 'Hôm nay');
  const cardClassName = `stat-card-custom ${variant}`;

  const handleSelect = (filter) => {
    setSelectedFilter(filter);
    // TODO: Sau này bạn có thể gọi API tải lại dữ liệu ở đây
  };

  return (
    <div className={cardClassName}>
      
      {/* --- PHẦN MỚI: Lớp chứa background để cắt sóng --- */}
      <div className="stat-card-bg-container">
        <div className="wave-background"></div>
      </div>
      {/* ----------------------------------------------- */}

      <div className="stat-card-left">
        <div className="stat-card-header">
          <span>{title}</span>
          
          {/* SỬ DỤNG CDROPDOWN CỦA COREUI */}
          <CDropdown variant="btn-group" className="stat-card-filter">
            <CDropdownToggle color="transparent" size="sm">
              {selectedFilter}
              <CIcon icon={cilArrowBottom} size="sm" />
            </CDropdownToggle>
            <CDropdownMenu >
              <CDropdownItem onClick={() => handleSelect('Hôm nay')}>
                Hôm nay
                {selectedFilter === 'Hôm nay' && <CIcon icon={cilCheckAlt} className="ms-2 text-success" />}
              </CDropdownItem>
              <CDropdownItem onClick={() => handleSelect('Tuần này')}>
                Tuần này
                {selectedFilter === 'Tuần này' && <CIcon icon={cilCheckAlt} className="ms-2 text-success" />}
              </CDropdownItem>
            </CDropdownMenu>
          </CDropdown>
          {/* KẾT THÚC CDROPDOWN */}

        </div>
        <div className="stat-card-body">{children}</div>
      </div>
      <div className="stat-card-right">{icon}</div>
      
      {/* (Đã xóa div wave-background ở đây vì chuyển lên trên rồi) */}
    </div>
  );
};

export default StatCard;