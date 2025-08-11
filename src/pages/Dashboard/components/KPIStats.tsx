import React from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  Avatar,
  Chip
} from '@mui/material';
import {
  Person as PersonIcon,
  Description as DescriptionIcon,
  TrendingUp as TrendingUpIcon,
  AttachMoney as AttachMoneyIcon,
  EmojiEvents as EmojiEventsIcon
} from '@mui/icons-material';

// Dữ liệu mẫu cho các KPI
const KPI_DATA = {
  newCustomers: {
    value: 12,
    change: '+20%',
    positive: true
  },
  totalDeals: {
    value: 156,
    change: '+5%',
    positive: true
  },
  dealStages: {
    lead: 45,
    quote: 32,
    negotiation: 18,
    win: 38,
    lose: 23
  },
  revenue: {
    value: '2.4 tỷ',
    change: '+15%',
    positive: true
  },
  topEmployee: {
    name: 'Nguyễn Văn A',
    deals: 24,
    avatar: ''
  }
};

const KPIStats: React.FC = () => {
  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
        📊 Thống kê KPI tổng quan
      </Typography>
      
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(3, 1fr)', lg: 'repeat(5, 1fr)' }, gap: 2 }}>
        {/* Khách hàng mới */}
        <Box>
          <Paper 
            elevation={2}
            sx={{ 
              p: 2, 
              height: '100%', 
              display: 'flex', 
              flexDirection: 'column',
              borderTop: '4px solid #3b82f6',
              borderRadius: '8px'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Avatar sx={{ bgcolor: '#93c5fd', mr: 1 }}>
                <PersonIcon />
              </Avatar>
              <Typography variant="subtitle2" color="textSecondary">
                Khách hàng mới
              </Typography>
            </Box>
            
            <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
              {KPI_DATA.newCustomers.value}
            </Typography>
            
            <Box sx={{ mt: 'auto', display: 'flex', alignItems: 'center' }}>
              <Chip 
                label={KPI_DATA.newCustomers.change} 
                size="small" 
                color={KPI_DATA.newCustomers.positive ? "success" : "error"}
                sx={{ fontSize: '0.75rem' }}
              />
              <Typography variant="caption" sx={{ ml: 1, color: 'text.secondary' }}>
                so với hôm qua
              </Typography>
            </Box>
          </Paper>
        </Box>

        {/* Tổng deal */}
        <Box>
          <Paper 
            elevation={2}
            sx={{ 
              p: 2, 
              height: '100%', 
              display: 'flex', 
              flexDirection: 'column',
              borderTop: '4px solid #8b5cf6',
              borderRadius: '8px'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Avatar sx={{ bgcolor: '#c4b5fd', mr: 1 }}>
                <DescriptionIcon />
              </Avatar>
              <Typography variant="subtitle2" color="textSecondary">
                Tổng deal
              </Typography>
            </Box>
            
            <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
              {KPI_DATA.totalDeals.value}
            </Typography>
            
            <Box sx={{ mt: 'auto', display: 'flex', alignItems: 'center' }}>
              <Chip 
                label={KPI_DATA.totalDeals.change} 
                size="small" 
                color={KPI_DATA.totalDeals.positive ? "success" : "error"}
                sx={{ fontSize: '0.75rem' }}
              />
              <Typography variant="caption" sx={{ ml: 1, color: 'text.secondary' }}>
                so với tuần trước
              </Typography>
            </Box>
          </Paper>
        </Box>

        {/* Deal theo giai đoạn */}
        <Box>
          <Paper 
            elevation={2}
            sx={{ 
              p: 2, 
              height: '100%', 
              display: 'flex', 
              flexDirection: 'column',
              borderTop: '4px solid #ec4899',
              borderRadius: '8px'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Avatar sx={{ bgcolor: '#fbcfe8', mr: 1 }}>
                <TrendingUpIcon />
              </Avatar>
              <Typography variant="subtitle2" color="textSecondary">
                Deal theo giai đoạn
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 1 }}>
              <Chip label={`Lead: ${KPI_DATA.dealStages.lead}`} size="small" sx={{ bgcolor: '#fee2e2' }} />
              <Chip label={`Báo giá: ${KPI_DATA.dealStages.quote}`} size="small" sx={{ bgcolor: '#fef3c7' }} />
              <Chip label={`Đàm phán: ${KPI_DATA.dealStages.negotiation}`} size="small" sx={{ bgcolor: '#e0f2fe' }} />
              <Chip label={`Win: ${KPI_DATA.dealStages.win}`} size="small" sx={{ bgcolor: '#dcfce7' }} />
              <Chip label={`Lose: ${KPI_DATA.dealStages.lose}`} size="small" sx={{ bgcolor: '#f3f4f6' }} />
            </Box>
            
            <Typography variant="caption" sx={{ mt: 'auto', color: 'text.secondary' }}>
              Tổng: {Object.values(KPI_DATA.dealStages).reduce((a, b) => a + b, 0)} deal
            </Typography>
          </Paper>
        </Box>

        {/* Doanh thu thực tế */}
        <Box>
          <Paper 
            elevation={2}
            sx={{ 
              p: 2, 
              height: '100%', 
              display: 'flex', 
              flexDirection: 'column',
              borderTop: '4px solid #10b981',
              borderRadius: '8px'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Avatar sx={{ bgcolor: '#a7f3d0', mr: 1 }}>
                <AttachMoneyIcon />
              </Avatar>
              <Typography variant="subtitle2" color="textSecondary">
                Doanh thu thực tế
              </Typography>
            </Box>
            
            <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
              {KPI_DATA.revenue.value}
            </Typography>
            
            <Box sx={{ mt: 'auto', display: 'flex', alignItems: 'center' }}>
              <Chip 
                label={KPI_DATA.revenue.change} 
                size="small" 
                color={KPI_DATA.revenue.positive ? "success" : "error"}
                sx={{ fontSize: '0.75rem' }}
              />
              <Typography variant="caption" sx={{ ml: 1, color: 'text.secondary' }}>
                so với tháng trước
              </Typography>
            </Box>
          </Paper>
        </Box>

        {/* Nhân viên top deal */}
        <Box>
          <Paper 
            elevation={2}
            sx={{ 
              p: 2, 
              height: '100%', 
              display: 'flex', 
              flexDirection: 'column',
              borderTop: '4px solid #f59e0b',
              borderRadius: '8px'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Avatar sx={{ bgcolor: '#fde68a', mr: 1 }}>
                <EmojiEventsIcon />
              </Avatar>
              <Typography variant="subtitle2" color="textSecondary">
                Nhân viên top deal
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Avatar sx={{ mr: 1 }}>
                {KPI_DATA.topEmployee.avatar || KPI_DATA.topEmployee.name.charAt(0)}
              </Avatar>
              <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                {KPI_DATA.topEmployee.name}
              </Typography>
            </Box>
            
            <Box sx={{ mt: 'auto' }}>
              <Typography variant="body2">
                <strong>{KPI_DATA.topEmployee.deals} deals</strong> đã chốt trong tháng
              </Typography>
            </Box>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
};

export default KPIStats;