import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
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
  const { t, i18n } = useTranslation();
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
        description: t('pages.dashboard.trendingDefaults.trends.cloud', 'SMEs are moving to cloud at record speed'),
        growth: '+25%',
        confidence: 0.92,
        category: 'technology',
        icon: <ShowChartIcon />,
        color: theme.palette.primary.main
      },
      {
        id: 'ai-solutions',
        title: 'AI/ML Solutions',
        description: t('pages.dashboard.trendingDefaults.trends.ai', 'Demand for AI solutions surges across enterprises'),
        growth: '+35%',
        confidence: 0.88,
        category: 'technology',
        icon: <PsychologyIcon />,
        color: theme.palette.secondary.main
      },
      {
        id: 'cybersecurity',
        title: 'Cybersecurity',
        description: t('pages.dashboard.trendingDefaults.trends.cyber', 'Cybersecurity becomes top priority after attacks'),
        growth: '+18%',
        confidence: 0.85,
        category: 'technology',
        icon: <BusinessIcon />,
        color: theme.palette.warning.main
      },
      {
        id: 'digital-transformation',
        title: 'Digital Transformation',
        description: t('pages.dashboard.trendingDefaults.trends.dx', 'Digital transformation accelerates across industries'),
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
        title: t('pages.dashboard.trendingDefaults.insights.marketGrowth.title', 'Tech market booms in Q4'),
        description: t('pages.dashboard.trendingDefaults.insights.marketGrowth.desc', 'Revenue from tech projects up 28% vs Q3, led by AI and Cloud'),
        impact: 'high',
        actionable: true,
        source: 'Market Analysis AI',
        timestamp: new Date()
      },
      {
        id: 'customer-behavior',
        title: t('pages.dashboard.trendingDefaults.insights.customerBehavior.title', 'Customer behavior shifts'),
        description: t('pages.dashboard.trendingDefaults.insights.customerBehavior.desc', 'SMEs prefer integrated solutions over standalone products'),
        impact: 'medium',
        actionable: true,
        source: 'Customer Analytics',
        timestamp: new Date(Date.now() - 30 * 60 * 1000)
      },
      {
        id: 'competitive-landscape',
        title: t('pages.dashboard.trendingDefaults.insights.competitive.title', 'Competitive landscape shifts'),
        description: t('pages.dashboard.trendingDefaults.insights.competitive.desc', 'Rivals focus on pricing; adjust pricing strategy'),
        impact: 'high',
        actionable: true,
        source: 'Competitive Intelligence',
        timestamp: new Date(Date.now() - 60 * 60 * 1000)
      },
      {
        id: 'technology-adoption',
        title: t('pages.dashboard.trendingDefaults.insights.techAdoption.title', 'Faster tech adoption'),
        description: t('pages.dashboard.trendingDefaults.insights.techAdoption.desc', 'Time from demo to purchase down 40%—faster decisions'),
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
        title: t('pages.dashboard.trendingDefaults.predictions.abcDeal.title', 'Deal ABC Corp - ERP System'),
        description: t('pages.dashboard.trendingDefaults.predictions.abcDeal.desc', 'ERP implementation for ABC Corp likely to succeed'),
        probability: 0.85,
        timeframe: t('pages.dashboard.trendingDefaults.predictions.abcDeal.timeframe', '2 weeks'),
        value: '250K',
        type: 'deal',
        riskLevel: 'low'
      },
      {
        id: 'market-ai-growth',
        title: t('pages.dashboard.trendingDefaults.predictions.aiMarket.title', 'AI market will surge'),
        description: t('pages.dashboard.trendingDefaults.predictions.aiMarket.desc', 'AI/ML market to grow 40% in next 6 months'),
        probability: 0.78,
        timeframe: t('pages.dashboard.trendingDefaults.predictions.aiMarket.timeframe', '6 months'),
        type: 'market',
        riskLevel: 'medium'
      },
      {
        id: 'customer-xyz-expansion',
        title: t('pages.dashboard.trendingDefaults.predictions.xyzCustomer.title', 'Customer XYZ expansion'),
        description: t('pages.dashboard.trendingDefaults.predictions.xyzCustomer.desc', 'XYZ Ltd likely to buy CRM module in Q1 next year'),
        probability: 0.72,
        timeframe: t('pages.dashboard.trendingDefaults.predictions.xyzCustomer.timeframe', '3 months'),
        value: '180K',
        type: 'customer',
        riskLevel: 'low'
      },
      {
        id: 'revenue-milestone',
        title: t('pages.dashboard.trendingDefaults.predictions.revenueMilestone.title', 'Reach 3M revenue milestone'),
        description: t('pages.dashboard.trendingDefaults.predictions.revenueMilestone.desc', 'Forecast to reach 3M revenue in Q1 next year'),
        probability: 0.68,
        timeframe: t('pages.dashboard.trendingDefaults.predictions.revenueMilestone.timeframe', '4 months'),
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
              {t('pages.dashboard.trendingInsights.header')}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {t('pages.dashboard.trendingInsights.subtitle')}
            </Typography>
          </Box>
          <Tooltip title={t('pages.dashboard.trendingInsights.tooltip.refresh')}>
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
            label={t('pages.dashboard.trendingInsights.tabs.trending')} 
            iconPosition="start"
            sx={{ minHeight: 'auto', py: 2 }}
          />
          <Tab 
            icon={<LightbulbIcon />} 
            label={t('pages.dashboard.trendingInsights.tabs.insights')} 
            iconPosition="start"
            sx={{ minHeight: 'auto', py: 2 }}
          />
          <Tab 
            icon={<TimelineIcon />} 
            label={t('pages.dashboard.trendingInsights.tabs.predictions')} 
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
                          {t('pages.dashboard.trendingInsights.labels.confidence')}: {Math.round(trend.confidence * 100)}%
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
                            label={t('pages.dashboard.trendingInsights.labels.actionable')}
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
                          {t('pages.dashboard.trendingInsights.labels.source')}: {insight.source} • {insight.timestamp.toLocaleTimeString(i18n.language)}
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
                          label={t('pages.dashboard.trendingInsights.labels.probability', { percent: Math.round(prediction.probability * 100) })}
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
                      label={`${t('pages.dashboard.trendingInsights.labels.risk')}: ${prediction.riskLevel}`}
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
