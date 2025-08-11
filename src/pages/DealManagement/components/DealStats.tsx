import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import { 
  AttachMoney as AttachMoneyIcon,
  Timeline as TimelineIcon,
  Assignment as AssignmentIcon,
  CheckCircle as CheckCircleIcon,
  CalendarToday as CalendarTodayIcon,
  AccessTime as AccessTimeIcon
} from '@mui/icons-material';
import { Deal, DealStage, STAGE_WEIGHTS } from './DealTypes';

interface DealStatsProps {
  deals: Deal[];
}

/**
 * Component hiển thị các chỉ số tổng quan của deal
 */
const DealStats: React.FC<DealStatsProps> = ({ deals }) => {
  // Tính toán các chỉ số tổng quan
  const calculateStats = () => {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    
    // Giá trị ban đầu
    const stats = {
      totalDealAmount: 0,
      weightedDealAmount: 0,
      openDealAmount: 0,
      closedDealAmount: 0,
      newDealsThisMonth: 0,
      totalDealAgeInDays: 0,
      dealCount: 0
    };
    
    deals.forEach(deal => {
      // Tổng giá trị deal
      stats.totalDealAmount += deal.value;
      
      // Tổng giá trị deal có trọng số
      const stage = deal.stage as DealStage;
      stats.weightedDealAmount += deal.value * STAGE_WEIGHTS[stage];
      
      // Giá trị deal đang mở và đã chốt
      if (stage === DealStage.CLOSED_WON) {
        stats.closedDealAmount += deal.value;
      } else if (stage !== DealStage.CLOSED_LOST) {
        stats.openDealAmount += deal.value;
      }
      
      // Số deal mới trong tháng
      const createdDate = new Date(deal.createdAt);
      if (createdDate.getMonth() === currentMonth && createdDate.getFullYear() === currentYear) {
        stats.newDealsThisMonth++;
      }
      
      // Tính tuổi trung bình deal
      const createdTime = new Date(deal.createdAt).getTime();
      const currentTime = today.getTime();
      const ageInDays = Math.floor((currentTime - createdTime) / (1000 * 60 * 60 * 24));
      stats.totalDealAgeInDays += ageInDays;
      stats.dealCount++;
    });
    
    // Tính tuổi trung bình deal
    const averageDealAge = stats.dealCount > 0 ? Math.round(stats.totalDealAgeInDays / stats.dealCount) : 0;
    
    return {
      totalDealAmount: stats.totalDealAmount,
      weightedDealAmount: stats.weightedDealAmount,
      openDealAmount: stats.openDealAmount,
      closedDealAmount: stats.closedDealAmount,
      newDealsThisMonth: stats.newDealsThisMonth,
      averageDealAge
    };
  };
  
  const stats = calculateStats();
  
  // Định dạng số tiền
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0
    }).format(value);
  };
  
  // Danh sách các chỉ số hiển thị
  const statItems = [
    {
      title: 'Tổng giá trị Deal',
      value: formatCurrency(stats.totalDealAmount),
      icon: <AttachMoneyIcon fontSize="large" sx={{ color: '#1976d2' }} />
    },
    {
      title: 'Tổng giá trị Deal có trọng số',
      value: formatCurrency(stats.weightedDealAmount),
      icon: <TimelineIcon fontSize="large" sx={{ color: '#7b1fa2' }} />
    },
    {
      title: 'Giá trị Deal đang mở',
      value: formatCurrency(stats.openDealAmount),
      icon: <AssignmentIcon fontSize="large" sx={{ color: '#ff9800' }} />
    },
    {
      title: 'Giá trị Deal đã chốt',
      value: formatCurrency(stats.closedDealAmount),
      icon: <CheckCircleIcon fontSize="large" sx={{ color: '#4caf50' }} />
    },
    {
      title: 'Số Deal mới trong tháng',
      value: `${stats.newDealsThisMonth} deal`,
      icon: <CalendarTodayIcon fontSize="large" sx={{ color: '#f57c00' }} />
    },
    {
      title: 'Tuổi trung bình Deal',
      value: `${stats.averageDealAge} ngày`,
      icon: <AccessTimeIcon fontSize="large" sx={{ color: '#d32f2f' }} />
    }
  ];

  return (
    <Box sx={{ mb: 3 }}>
      <Box sx={{ display: 'grid', gridTemplateColumns: {
        xs: '1fr',
        sm: '1fr 1fr',
        md: '1fr 1fr 1fr',
        lg: 'repeat(6, 1fr)'
      }, gap: 2 }}>
        {statItems.map((item, index) => (
          <Card sx={{ height: '100%', boxShadow: 2 }} key={`stat-item-${index}`}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                {item.icon}
                <Typography variant="h6" component="div" sx={{ ml: 1, fontWeight: 500 }}>
                  {item.title}
                </Typography>
              </Box>
              <Typography variant="h5" component="div" sx={{ fontWeight: 'bold', mt: 1 }}>
                {item.value}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  );
};

export default DealStats;
