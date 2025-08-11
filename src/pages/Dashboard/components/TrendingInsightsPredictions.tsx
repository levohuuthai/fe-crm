import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Chip,
  Card,
  CardContent,
  LinearProgress,
  useTheme,
  alpha,
  Tab,
  Tabs,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  Psychology as PsychologyIcon,
  Timeline as TimelineIcon,
  Lightbulb as LightbulbIcon,
  ShowChart as ShowChartIcon,
  AttachMoney as MoneyIcon,
  People as PeopleIcon,
  Business as BusinessIcon,
  Refresh as RefreshIcon,
  Star as StarIcon,
  ArrowUpward as ArrowUpIcon,
  ArrowDownward as ArrowDownIcon
} from '@mui/icons-material';
import { aiOrchestrator, AIRequest } from '../../../services/aiOrchestration';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

interface TrendingItem {
  id: string;
  title: string;
  description: string;
  growth: string;
  confidence: number;
  category: 'market' | 'technology' | 'industry';
  icon: React.ReactNode;
  color: string;
}

interface InsightItem {
  id: string;
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  actionable: boolean;
  source: string;
  timestamp: Date;
}

interface PredictionItem {
  id: string;
  title: string;
  description: string;
  probability: number;
  timeframe: string;
  value?: string;
  type: 'deal' | 'market' | 'customer' | 'revenue';
  riskLevel: 'low' | 'medium' | 'high';
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

const TrendingInsightsPredictions: React.FC = () => {
  const theme = useTheme();
  const [tabValue, setTabValue] = useState(0);
  const [trendingData, setTrendingData] = useState<TrendingItem[]>([]);
  const [insightsData, setInsightsData] = useState<InsightItem[]>([]);
  const [predictionsData, setPredictionsData] = useState<PredictionItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadAllData();
    
    // Auto refresh every 2 minutes
    const interval = setInterval(loadAllData, 120000);
    return () => clearInterval(interval);
  }, []);

  const loadAllData = async () => {
    setIsLoading(true);
    
    try {
      // Load trending data
      const trendingRequest: AIRequest = {
        id: `trending_${Date.now()}`,
        type: 'market_analysis',
        data: { type: 'trending' },
        timestamp: new Date()
      };
      
      const trendingResponse = await aiOrchestrator.processRequest(trendingRequest);
      setTrendingData(generateTrendingData(trendingResponse.result));

      // Load insights data
      const insightsRequest: AIRequest = {
        id: `insights_${Date.now()}`,
        type: 'market_analysis',
        data: { type: 'insights' },
        timestamp: new Date()
      };
      
      const insightsResponse = await aiOrchestrator.processRequest(insightsRequest);
      setInsightsData(generateInsightsData(insightsResponse.result));

      // Load predictions data
      const predictionsRequest: AIRequest = {
        id: `predictions_${Date.now()}`,
        type: 'deal_prediction',
        data: { type: 'predictions' },
        timestamp: new Date()
      };
      
      const predictionsResponse = await aiOrchestrator.processRequest(predictionsRequest);
      setPredictionsData(generatePredictionsData(predictionsResponse.result));
      
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const generateTrendingData = (aiResult: any): TrendingItem[] => {
    const trends = aiResult?.trends || [];
    
    const defaultTrends: TrendingItem[] = [
      {
        id: 'cloud-computing',
        title: 'Cloud Computing',
        description: 'Doanh nghiệp SME đang chuyển đổi sang cloud với tốc độ kỷ lục',
        growth: '+25%',
        confidence: 0.92,
        category: 'technology',
        icon: <ShowChartIcon />,
        color: theme.palette.primary.main
      },
      {
        id: 'ai-solutions',
        title: 'AI/ML Solutions',
        description: 'Nhu cầu về giải pháp AI tăng vượt bậc trong các doanh nghiệp',
        growth: '+35%',
        confidence: 0.88,
        category: 'technology',
        icon: <PsychologyIcon />,
        color: theme.palette.secondary.main
      },
      {
        id: 'cybersecurity',
        title: 'Cybersecurity',
        description: 'An ninh mạng trở thành ưu tiên hàng đầu sau các vụ tấn công',
        growth: '+18%',
        confidence: 0.85,
        category: 'technology',
        icon: <BusinessIcon />,
        color: theme.palette.warning.main
      },
      {
        id: 'digital-transformation',
        title: 'Digital Transformation',
        description: 'Chuyển đổi số được đẩy mạnh trong mọi ngành nghề',
        growth: '+22%',
        confidence: 0.90,
        category: 'industry',
        icon: <TrendingUpIcon />,
        color: theme.palette.success.main
      }
    ];

    // Merge AI data with default data
    return trends.length > 0 ? trends.map((trend: any, index: number) => ({
      ...defaultTrends[index % defaultTrends.length],
      title: trend.name || defaultTrends[index % defaultTrends.length].title,
      growth: trend.growth || defaultTrends[index % defaultTrends.length].growth,
      confidence: trend.confidence || defaultTrends[index % defaultTrends.length].confidence
    })) : defaultTrends;
  };

  const generateInsightsData = (aiResult: any): InsightItem[] => {
    const insights = aiResult?.insights || [];
    
    const defaultInsights: InsightItem[] = [
      {
        id: 'market-growth',
        title: 'Thị trường công nghệ Q4 tăng trưởng mạnh',
        description: 'Doanh thu từ các dự án công nghệ tăng 28% so với Q3, chủ yếu từ segment AI và Cloud',
        impact: 'high',
        actionable: true,
        source: 'Market Analysis AI',
        timestamp: new Date()
      },
      {
        id: 'customer-behavior',
        title: 'Hành vi khách hàng thay đổi',
        description: 'Khách hàng SME có xu hướng đầu tư vào giải pháp tích hợp thay vì từng sản phẩm riêng lẻ',
        impact: 'medium',
        actionable: true,
        source: 'Customer Analytics',
        timestamp: new Date(Date.now() - 30 * 60 * 1000)
      },
      {
        id: 'competitive-landscape',
        title: 'Cảnh quan cạnh tranh thay đổi',
        description: 'Các đối thủ đang tập trung vào pricing strategy, cần điều chỉnh chiến lược giá',
        impact: 'high',
        actionable: true,
        source: 'Competitive Intelligence',
        timestamp: new Date(Date.now() - 60 * 60 * 1000)
      },
      {
        id: 'technology-adoption',
        title: 'Tốc độ áp dụng công nghệ tăng',
        description: 'Thời gian từ demo đến quyết định mua giảm 40%, khách hàng quyết định nhanh hơn',
        impact: 'medium',
        actionable: false,
        source: 'Sales Analytics',
        timestamp: new Date(Date.now() - 90 * 60 * 1000)
      }
    ];

    return insights.length > 0 ? insights.map((insight: string, index: number) => ({
      ...defaultInsights[index % defaultInsights.length],
      description: insight
    })) : defaultInsights;
  };

  const generatePredictionsData = (aiResult: any): PredictionItem[] => {
    const predictions = aiResult?.topDeals || [];
    
    const defaultPredictions: PredictionItem[] = [
      {
        id: 'deal-abc-corp',
        title: 'Deal ABC Corp - ERP System',
        description: 'Dự án triển khai hệ thống ERP cho ABC Corp có xác suất thành công cao',
        probability: 0.85,
        timeframe: '2 tuần',
        value: '250K',
        type: 'deal',
        riskLevel: 'low'
      },
      {
        id: 'market-ai-growth',
        title: 'Thị trường AI sẽ bùng nổ',
        description: 'Dự đoán thị trường AI/ML sẽ tăng trưởng 40% trong 6 tháng tới',
        probability: 0.78,
        timeframe: '6 tháng',
        type: 'market',
        riskLevel: 'medium'
      },
      {
        id: 'customer-xyz-expansion',
        title: 'Khách hàng XYZ mở rộng',
        description: 'XYZ Ltd có khả năng cao sẽ mua thêm module CRM trong Q1 năm sau',
        probability: 0.72,
        timeframe: '3 tháng',
        value: '180K',
        type: 'customer',
        riskLevel: 'low'
      },
      {
        id: 'revenue-milestone',
        title: 'Đạt mốc doanh thu 3M',
        description: 'Dự đoán sẽ đạt mốc doanh thu 3M trong Q1 năm sau dựa trên pipeline hiện tại',
        probability: 0.68,
        timeframe: '4 tháng',
        value: '3M',
        type: 'revenue',
        riskLevel: 'medium'
      }
    ];

    return predictions.length > 0 ? predictions.map((prediction: any, index: number) => ({
      ...defaultPredictions[index % defaultPredictions.length],
      title: prediction.name || defaultPredictions[index % defaultPredictions.length].title,
      probability: prediction.probability || defaultPredictions[index % defaultPredictions.length].probability,
      value: prediction.value ? `${prediction.value}` : defaultPredictions[index % defaultPredictions.length].value
    })) : defaultPredictions;
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return theme.palette.error.main;
      case 'medium': return theme.palette.warning.main;
      case 'low': return theme.palette.success.main;
      default: return theme.palette.text.secondary;
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'high': return theme.palette.error.main;
      case 'medium': return theme.palette.warning.main;
      case 'low': return theme.palette.success.main;
      default: return theme.palette.text.secondary;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'deal': return <MoneyIcon />;
      case 'market': return <ShowChartIcon />;
      case 'customer': return <PeopleIcon />;
      case 'revenue': return <TrendingUpIcon />;
      default: return <StarIcon />;
    }
  };

  return (
    <Paper elevation={2} sx={{ borderRadius: 2, overflow: 'hidden' }}>
      {/* Header */}
      <Box sx={{ 
        p: 3, 
        backgroundColor: alpha(theme.palette.primary.main, 0.05),
        borderBottom: `1px solid ${theme.palette.divider}`
      }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 1 }}>
              📊 Phân tích thông minh
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Trending • Insights • Predictions được hỗ trợ bởi AI
            </Typography>
          </Box>
          <Tooltip title="Làm mới dữ liệu">
            <IconButton onClick={loadAllData} color="primary">
              <RefreshIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs 
          value={tabValue} 
          onChange={(e, newValue) => setTabValue(newValue)}
          sx={{ px: 3 }}
        >
          <Tab 
            icon={<TrendingUpIcon />} 
            label="Trending" 
            iconPosition="start"
            sx={{ minHeight: 'auto', py: 2 }}
          />
          <Tab 
            icon={<LightbulbIcon />} 
            label="Insights" 
            iconPosition="start"
            sx={{ minHeight: 'auto', py: 2 }}
          />
          <Tab 
            icon={<TimelineIcon />} 
            label="Predictions" 
            iconPosition="start"
            sx={{ minHeight: 'auto', py: 2 }}
          />
        </Tabs>
      </Box>

      {/* Tab Panels */}
      <Box sx={{ p: 3 }}>
        {/* Trending Panel */}
        <TabPanel value={tabValue} index={0}>
          <Box 
            sx={{ 
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                sm: 'repeat(2, 1fr)'
              },
              gap: 2
            }}
          >
            {trendingData.map((trend) => (
              <Card 
                key={trend.id}
                elevation={1}
                sx={{ 
                  height: '100%',
                  border: `1px solid ${alpha(trend.color, 0.2)}`,
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: `0 4px 20px ${alpha(trend.color, 0.15)}`
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar
                      sx={{
                        backgroundColor: alpha(trend.color, 0.1),
                        color: trend.color,
                        mr: 2
                      }}
                    >
                      {trend.icon}
                    </Avatar>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                        {trend.title}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Chip
                          label={trend.growth}
                          size="small"
                          icon={<ArrowUpIcon sx={{ fontSize: 14 }} />}
                          sx={{
                            backgroundColor: alpha(theme.palette.success.main, 0.1),
                            color: theme.palette.success.main,
                            fontWeight: 'bold'
                          }}
                        />
                        <Typography variant="caption" color="text.secondary">
                          Độ tin cậy: {Math.round(trend.confidence * 100)}%
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    {trend.description}
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={trend.confidence * 100}
                    sx={{
                      mt: 2,
                      height: 6,
                      borderRadius: 3,
                      backgroundColor: alpha(trend.color, 0.1),
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: trend.color,
                        borderRadius: 3
                      }
                    }}
                  />
                </CardContent>
              </Card>
            ))}
          </Box>
        </TabPanel>

        {/* Insights Panel */}
        <TabPanel value={tabValue} index={1}>
          <List>
            {insightsData.map((insight, index) => (
              <React.Fragment key={insight.id}>
                <ListItem alignItems="flex-start" sx={{ px: 0 }}>
                  <ListItemAvatar>
                    <Avatar
                      sx={{
                        backgroundColor: alpha(getImpactColor(insight.impact), 0.1),
                        color: getImpactColor(insight.impact)
                      }}
                    >
                      <LightbulbIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                          {insight.title}
                        </Typography>
                        <Chip
                          label={insight.impact.toUpperCase()}
                          size="small"
                          sx={{
                            backgroundColor: alpha(getImpactColor(insight.impact), 0.1),
                            color: getImpactColor(insight.impact),
                            fontWeight: 'bold',
                            fontSize: '0.7rem'
                          }}
                        />
                        {insight.actionable && (
                          <Chip
                            label="ACTIONABLE"
                            size="small"
                            sx={{
                              backgroundColor: alpha(theme.palette.info.main, 0.1),
                              color: theme.palette.info.main,
                              fontSize: '0.7rem'
                            }}
                          />
                        )}
                      </Box>
                    }
                    secondary={
                      <Box>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                          {insight.description}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Nguồn: {insight.source} • {insight.timestamp.toLocaleTimeString('vi-VN')}
                        </Typography>
                      </Box>
                    }
                  />
                </ListItem>
                {index < insightsData.length - 1 && <Divider variant="inset" component="li" />}
              </React.Fragment>
            ))}
          </List>
        </TabPanel>

        {/* Predictions Panel */}
        <TabPanel value={tabValue} index={2}>
          <Box 
            sx={{ 
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                sm: 'repeat(2, 1fr)'
              },
              gap: 2
            }}
          >
            {predictionsData.map((prediction) => (
              <Card 
                key={prediction.id}
                elevation={1}
                sx={{ 
                  height: '100%',
                  border: `1px solid ${alpha(getRiskColor(prediction.riskLevel), 0.2)}`,
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: `0 4px 20px ${alpha(getRiskColor(prediction.riskLevel), 0.15)}`
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar
                      sx={{
                        backgroundColor: alpha(getRiskColor(prediction.riskLevel), 0.1),
                        color: getRiskColor(prediction.riskLevel),
                        mr: 2
                      }}
                    >
                      {getTypeIcon(prediction.type)}
                    </Avatar>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                        {prediction.title}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                        <Chip
                          label={`${Math.round(prediction.probability * 100)}% xác suất`}
                          size="small"
                          sx={{
                            backgroundColor: alpha(theme.palette.primary.main, 0.1),
                            color: theme.palette.primary.main,
                            fontWeight: 'bold'
                          }}
                        />
                        {prediction.value && (
                          <Chip
                            label={prediction.value}
                            size="small"
                            variant="outlined"
                          />
                        )}
                        <Typography variant="caption" color="text.secondary">
                          {prediction.timeframe}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {prediction.description}
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Chip
                      label={`Risk: ${prediction.riskLevel}`}
                      size="small"
                      sx={{
                        backgroundColor: alpha(getRiskColor(prediction.riskLevel), 0.1),
                        color: getRiskColor(prediction.riskLevel),
                        textTransform: 'capitalize'
                      }}
                    />
                    <LinearProgress
                      variant="determinate"
                      value={prediction.probability * 100}
                      sx={{
                        width: '60%',
                        height: 6,
                        borderRadius: 3,
                        backgroundColor: alpha(theme.palette.primary.main, 0.1),
                        '& .MuiLinearProgress-bar': {
                          backgroundColor: theme.palette.primary.main,
                          borderRadius: 3
                        }
                      }}
                    />
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Box>
        </TabPanel>
      </Box>
    </Paper>
  );
};

export default TrendingInsightsPredictions;
