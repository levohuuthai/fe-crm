import React from 'react';
import { Box, Tooltip } from '@mui/material';
import { DealStage, STAGE_COLORS } from './DealTypes';

interface DealStageChipProps {
  stage: DealStage;
  size?: 'small' | 'medium' | 'large';
  showTooltip?: boolean;
}

/**
 * Component hiển thị giai đoạn deal với màu sắc tương ứng
 */
const DealStageChip: React.FC<DealStageChipProps> = ({ 
  stage, 
  size = 'medium',
  showTooltip = false
 }) => {
  // Xác định kích thước padding dựa trên size
  const getPadding = () => {
    switch(size) {
      case 'small': return '2px 6px';
      case 'large': return '6px 12px';
      default: return '4px 8px';
    }
  };

  // Xác định font size dựa trên size
  const getFontSize = () => {
    switch(size) {
      case 'small': return '0.75rem';
      case 'large': return '0.95rem';
      default: return '0.875rem';
    }
  };

  // Lấy màu sắc tương ứng với giai đoạn
  const stageColor = STAGE_COLORS[stage];
  
  // Tạo màu nền nhạt hơn dựa trên màu chính
  const getBgColor = () => {
    // Chuyển hex sang rgba với alpha = 0.15
    const hexToRgba = (hex: string, alpha: number) => {
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);
      return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    };
    
    return hexToRgba(stageColor, 0.15);
  };

  const chip = (
    <Box
      component="span"
      sx={{
        display: 'inline-block',
        padding: getPadding(),
        borderRadius: '16px',
        backgroundColor: getBgColor(),
        color: stageColor,
        fontSize: getFontSize(),
        fontWeight: 500,
        lineHeight: 1.5,
        textAlign: 'center',
        whiteSpace: 'nowrap',
        verticalAlign: 'baseline',
        transition: 'all 0.2s ease-in-out',
      }}
    >
      {stage}
    </Box>
  );

  // Nếu có showTooltip, bao bọc bằng Tooltip
  return showTooltip ? (
    <Tooltip title={`Giai đoạn: ${stage}`} arrow>
      {chip}
    </Tooltip>
  ) : chip;
};

export default DealStageChip;
