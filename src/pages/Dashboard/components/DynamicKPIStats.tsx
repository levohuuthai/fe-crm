import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Chip,
  LinearProgress,
  useTheme,
  alpha,
  Skeleton,
  IconButton,
  Tooltip,
  Fade,
  Grid,
  Stack
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  People as PeopleIcon,
  AttachMoney as MoneyIcon,
  Assignment as DealsIcon,
  Timeline as TimelineIcon,
  Refresh as RefreshIcon,
  Star as StarIcon,
  ViewModule as ViewModuleIcon,
  ViewCarousel as ViewCarouselIcon
} from '@mui/icons-material';
import { aiOrchestrator, AIRequest } from '../../../services/aiOrchestration';

interface KPIData {
  id: string;
  title: string;
  value: string | number;
  change: number;
  changeLabel: string;
  icon: React.ReactNode;
  color: string;
  description: string;
  isLoading?: boolean;
  lastUpdated?: Date;
}

interface DynamicUpdate {
  id: string;
  title: string;
  description: string;
  timestamp: Date;
  type: 'new_customer' | 'deal_closed' | 'revenue_milestone' | 'market_trend';
  value?: string;
  isNew?: boolean;
}

const DynamicKPIStats: React.FC = () => {
  const theme = useTheme();
  const [kpiData, setKpiData] = useState<KPIData[]>([]);
  const [dynamicUpdates, setDynamicUpdates] = useState<DynamicUpdate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());
  const [activeKpiIndex, setActiveKpiIndex] = useState<number>(0);
  const [showAllKpis, setShowAllKpis] = useState<boolean>(false);

  // Initialize KPI data
  useEffect(() => {
    loadKPIData();
    loadDynamicUpdates();
    
    // Set up real-time updates
    const interval = setInterval(() => {
      updateKPIData();
      addRandomUpdate();
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  // Rotate through KPI cards with animation
  useEffect(() => {
    if (kpiData.length === 0 || showAllKpis) return;
    
    const rotationInterval = setInterval(() => {
      setActiveKpiIndex(prevIndex => (prevIndex + 1) % kpiData.length);
    }, 5000); // Rotate every 5 seconds
    
    return () => clearInterval(rotationInterval);
  }, [kpiData.length, showAllKpis]);

  const loadKPIData = async () => {
    setIsLoading(true);
    
    // Simulate API call to get real-time data
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const currentDate = new Date();
    const kpis: KPIData[] = [
      {
        id: 'new_customers',
        title: 'Khách hàng mới',
        value: Math.floor(Math.random() * 20) + 15, // 15-35
        change: Math.random() * 30 - 10, // -10% to +20%
        changeLabel: 'so với tuần trước',
        icon: <PeopleIcon />,
        color: theme.palette.primary.main,
        description: 'Khách hàng mới đăng ký trong tuần',
        lastUpdated: currentDate
      },
      {
        id: 'total_deals',
        title: 'Tổng Deal',
        value: Math.floor(Math.random() * 50) + 120, // 120-170
        change: Math.random() * 25 - 5, // -5% to +20%
        changeLabel: 'so với tháng trước',
        icon: <DealsIcon />,
        color: theme.palette.success.main,
        description: 'Tổng số deal đang theo dõi',
        lastUpdated: currentDate
      },
      {
        id: 'revenue',
        title: 'Doanh thu thực tế',
        value: `${(Math.random() * 500 + 1500).toFixed(0)}K`,
        change: Math.random() * 40 - 10, // -10% to +30%
        changeLabel: 'so với tháng trước',
        icon: <MoneyIcon />,
        color: theme.palette.warning.main,
        description: 'Doanh thu đã thực hiện trong tháng',
        lastUpdated: currentDate
      },
      {
        id: 'deal_pipeline',
        title: 'Deal theo giai đoạn',
        value: `${Math.floor(Math.random() * 10) + 25}`,
        change: Math.random() * 20 - 5, // -5% to +15%
        changeLabel: 'deal đang closing',
        icon: <TimelineIcon />,
        color: theme.palette.info.main,
        description: 'Deal đang ở giai đoạn cuối',
        lastUpdated: currentDate
      },
      {
        id: 'top_performer',
        title: 'Nhân viên top deal',
        value: 'Nguyễn Văn A',
        change: 8, // Number of deals
        changeLabel: 'deal trong tháng',
        icon: <StarIcon />,
        color: theme.palette.secondary.main,
        description: 'Nhân viên có hiệu suất cao nhất',
        lastUpdated: currentDate
      }
    ];

    setKpiData(kpis);
    setIsLoading(false);
  };

  const loadDynamicUpdates = async () => {
    // Simulate loading dynamic updates similar to Crunchbase
    const updates: DynamicUpdate[] = [
      {
        id: 'update_1',
        title: 'Deal mới được tạo',
        description: 'Hệ thống ERP cho Công ty ABC - Giá trị: 250K',
        timestamp: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
        type: 'deal_closed',
        value: '250K',
        isNew: true
      },
      {
        id: 'update_2',
        title: 'Khách hàng mới đăng ký',
        description: 'XYZ Corporation đã đăng ký dịch vụ',
        timestamp: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
        type: 'new_customer',
        isNew: true
      },
      {
        id: 'update_3',
        title: 'Xu hướng thị trường',
        description: 'AI/ML solutions tăng trưởng 35% trong quý',
        timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
        type: 'market_trend'
      }
    ];

    setDynamicUpdates(updates);
  };

  const updateKPIData = async () => {
    // Simulate real-time KPI updates
    setKpiData(prev => prev.map(kpi => ({
      ...kpi,
      value: kpi.id === 'new_customers' 
        ? Math.floor(Math.random() * 20) + 15
        : kpi.id === 'total_deals'
        ? Math.floor(Math.random() * 50) + 120
        : kpi.id === 'revenue'
        ? `${(Math.random() * 500 + 1500).toFixed(0)}K`
        : kpi.value,
      change: Math.random() * 30 - 10,
      lastUpdated: new Date()
    })));
    
    setLastRefresh(new Date());
  };

  const addRandomUpdate = () => {
    const newUpdates = [
      {
        title: 'Deal được cập nhật',
        description: 'Deal CRM System chuyển sang giai đoạn Negotiation',
        type: 'deal_closed' as const
      },
      {
        title: 'Khách hàng mới',
        description: 'Tech Startup DEF đã quan tâm đến dịch vụ',
        type: 'new_customer' as const
      },
      {
        title: 'Cột mốc doanh thu',
        description: 'Đạt 2M doanh thu trong tháng này',
        type: 'revenue_milestone' as const,
        value: '2M'
      }
    ];

    const randomUpdate = newUpdates[Math.floor(Math.random() * newUpdates.length)];
    
    const update: DynamicUpdate = {
      id: `update_${Date.now()}`,
      title: randomUpdate.title,
      description: randomUpdate.description,
      timestamp: new Date(),
      type: randomUpdate.type,
      value: randomUpdate.value,
      isNew: true
    };

    setDynamicUpdates(prev => [update, ...prev.slice(0, 9)]); // Keep only 10 latest
    
    // Remove "new" flag after 10 seconds
    setTimeout(() => {
      setDynamicUpdates(prev => 
        prev.map(u => u.id === update.id ? { ...u, isNew: false } : u)
      );
    }, 10000);
  };

  const handleRefresh = async () => {
    await updateKPIData();
    addRandomUpdate();
  };

  const getChangeColor = (change: number) => {
    if (change > 0) return theme.palette.success.main;
    if (change < 0) return theme.palette.error.main;
    return theme.palette.text.secondary;
  };

  const getChangeIcon = (change: number) => {
    if (change > 0) return <TrendingUpIcon sx={{ fontSize: 16 }} />;
    if (change < 0) return <TrendingDownIcon sx={{ fontSize: 16 }} />;
    return null;
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    
    if (diffMins < 1) return 'vừa xong';
    if (diffMins < 60) return `${diffMins} phút trước`;
    if (diffHours < 24) return `${diffHours} giờ trước`;
    return date.toLocaleDateString('vi-VN');
  };

  return (
    <Box sx={{ mb: 4 }}>
      {/* Header similar to Crunchbase */}
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        mb: 3 
      }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
            THÁNG NÀY TRÊN CRM
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
            <Chip 
              label={`${dynamicUpdates.length} cập nhật mới`}
              size="small"
              sx={{ 
                backgroundColor: alpha(theme.palette.primary.main, 0.1),
                color: theme.palette.primary.main,
                fontWeight: 'bold'
              }}
            />
            <Typography variant="caption" color="text.secondary">
              Cập nhật lần cuối: {formatTimeAgo(lastRefresh)}
            </Typography>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Tooltip title={showAllKpis ? "Hiển thị luân phiên" : "Hiển thị tất cả"}>
            <IconButton 
              size="small" 
              onClick={() => setShowAllKpis(!showAllKpis)}
            >
              {showAllKpis ? <ViewCarouselIcon /> : <ViewModuleIcon />}
            </IconButton>
          </Tooltip>
          <Tooltip title="Làm mới dữ liệu">
            <IconButton onClick={handleRefresh} color="primary">
              <RefreshIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* KPI Stats Grid */}
      <Box sx={{ position: 'relative', minHeight: 180, mb: 4 }}>
        <Box sx={{ 
          display: showAllKpis ? 'grid' : 'block',
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(5, 1fr)'
          },
          gap: 3,
          position: 'relative',
          minHeight: 150
        }}>
          {kpiData.map((kpi, index) => (
            <Fade 
              key={kpi.id}
              in={showAllKpis || activeKpiIndex === index} 
              timeout={{ enter: 500, exit: 300 }}
              style={{
                display: (!showAllKpis && activeKpiIndex !== index) ? 'none' : 'block',
                transitionDelay: showAllKpis ? `${index * 100}ms` : '0ms'
              }}
            >
              <Paper
                elevation={2}
                sx={{
                  p: 2.5,
                  height: '100%',
                  borderRadius: 2,
                  background: `linear-gradient(135deg, ${alpha(kpi.color, 0.05)} 0%, ${alpha(kpi.color, 0.02)} 100%)`,
                  border: `1px solid ${alpha(kpi.color, 0.1)}`,
                  transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                  position: !showAllKpis ? 'absolute' : 'relative',
                  top: 0,
                  left: 0,
                  width: !showAllKpis ? '100%' : 'auto',
                  zIndex: !showAllKpis && activeKpiIndex === index ? 2 : 1,
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: `0 8px 25px ${alpha(kpi.color, 0.15)}`
                  }
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Box 
                    sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      p: 1, 
                      borderRadius: 1,
                      backgroundColor: alpha(kpi.color, 0.1)
                    }}
                  >
                    <Box sx={{ color: kpi.color }}>
                      {kpi.icon}
                    </Box>
                  </Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: kpi.color }}>
                    {kpi.title}
                  </Typography>
                </Box>
                
                {isLoading ? (
                  <Skeleton variant="rectangular" width="100%" height={40} />
                ) : (
                  <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1, color: 'text.primary' }}>
                    {kpi.value}
                  </Typography>
                )}

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  {getChangeIcon(kpi.change)}
                  <Typography
                    variant="caption"
                    sx={{
                      color: getChangeColor(kpi.change),
                      fontWeight: 'medium'
                    }}
                  >
                    {kpi.change > 0 ? '+' : ''}{kpi.change.toFixed(1)}%
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {kpi.changeLabel}
                  </Typography>
                </Box>

                <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                  {kpi.description}
                </Typography>
              </Paper>
            </Fade>
          ))}
        </Box>
      </Box>

      {/* Dynamic Updates Section - Similar to Crunchbase activity feed */}
      <Paper
        elevation={1}
        sx={{
          borderRadius: 2,
          overflow: 'hidden',
          border: `1px solid ${theme.palette.divider}`
        }}
      >
        <Box
          sx={{
            p: 2,
            backgroundColor: alpha(theme.palette.primary.main, 0.05),
            borderBottom: `1px solid ${theme.palette.divider}`
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            🔥 Hoạt động gần đây
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Cập nhật theo thời gian thực từ hệ thống
          </Typography>
        </Box>

        <Box sx={{ maxHeight: 300, overflow: 'auto' }}>
          {dynamicUpdates.map((update, index) => (
            <Box
              key={update.id}
              sx={{
                p: 2,
                borderBottom: index < dynamicUpdates.length - 1 ? `1px solid ${theme.palette.divider}` : 'none',
                backgroundColor: update.isNew ? alpha(theme.palette.success.main, 0.05) : 'transparent',
                transition: 'all 0.3s ease',
                '&:hover': {
                  backgroundColor: alpha(theme.palette.action.hover, 0.5)
                }
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box sx={{ flex: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                      {update.title}
                    </Typography>
                    {update.isNew && (
                      <Chip
                        label="MỚI"
                        size="small"
                        sx={{
                          height: 18,
                          fontSize: '0.7rem',
                          backgroundColor: theme.palette.success.main,
                          color: 'white'
                        }}
                      />
                    )}
                    {update.value && (
                      <Chip
                        label={update.value}
                        size="small"
                        variant="outlined"
                        sx={{ height: 18, fontSize: '0.7rem' }}
                      />
                    )}
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    {update.description}
                  </Typography>
                </Box>
                <Typography variant="caption" color="text.secondary" sx={{ ml: 2 }}>
                  {formatTimeAgo(update.timestamp)}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>
      </Paper>
    </Box>
  );
};

export default DynamicKPIStats;
