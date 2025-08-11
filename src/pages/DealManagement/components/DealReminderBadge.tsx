import React from 'react';
import { Badge, Tooltip, Box } from '@mui/material';
import { Notifications as NotificationsIcon } from '@mui/icons-material';

interface DealReminderBadgeProps {
  deadline: string; // ISO date string
  reminderNote?: string;
  size?: 'small' | 'medium' | 'large';
}

/**
 * Component hiển thị biểu tượng nhắc việc cho các deal sắp đến hạn chốt
 * Hiển thị biểu tượng chuông đỏ nếu ngày hôm nay >= (Hạn chốt - 3 ngày)
 */
const DealReminderBadge: React.FC<DealReminderBadgeProps> = ({ 
  deadline,
  reminderNote,
  size = 'medium'
 }) => {
  // Kiểm tra xem deal có sắp đến hạn không (còn 3 ngày nữa)
  const isDeadlineApproaching = () => {
    const deadlineDate = new Date(deadline);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays >= 0 && diffDays <= 3;
  };

  // Tính số ngày còn lại đến hạn chốt
  const getDaysRemaining = () => {
    const deadlineDate = new Date(deadline);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) {
      return 'Quá hạn';
    } else if (diffDays === 0) {
      return 'Đến hạn hôm nay';
    } else {
      return `Sắp đến hạn trong ${diffDays} ngày nữa`;
    }
  };

  // Xác định kích thước icon dựa trên size
  const getIconSize = () => {
    switch(size) {
      case 'small': return 'small';
      case 'large': return 'large';
      default: return 'medium';
    }
  };

  // Nếu không sắp đến hạn, không hiển thị gì
  if (!isDeadlineApproaching()) {
    return null;
  }

  // Tạo tooltip message
  const tooltipMessage = reminderNote 
    ? `${getDaysRemaining()}. ${reminderNote}` 
    : getDaysRemaining();

  return (
    <Tooltip title={tooltipMessage} arrow>
      <Box component="span" sx={{ ml: 1 }}>
        <Badge color="error" variant="dot">
          <NotificationsIcon 
            fontSize={getIconSize()} 
            color="error" 
            sx={{ animation: 'pulse 1.5s infinite' }}
          />
        </Badge>
      </Box>
    </Tooltip>
  );
};

export default DealReminderBadge;
