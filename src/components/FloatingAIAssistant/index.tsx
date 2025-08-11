import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Paper,
  TextField,
  IconButton,
  Typography,
  Chip,
  Fade,
  Zoom,
  useTheme,
  alpha,
  Tooltip,
  CircularProgress,
  Avatar
} from '@mui/material';
import {
  Send as SendIcon,
  Mic as MicIcon,
  Close as CloseIcon,
  Minimize as MinimizeIcon,
  SmartToy as AIIcon,
  TrendingUp as TrendingIcon,
  Psychology as InsightIcon,
  Timeline as PredictionIcon
} from '@mui/icons-material';
import { useLocation } from 'react-router-dom';
import { aiOrchestrator, AIRequest } from '../../services/aiOrchestration';

interface FloatingAIAssistantProps {
  isOnDashboard?: boolean;
}

const FloatingAIAssistant: React.FC<FloatingAIAssistantProps> = ({ isOnDashboard = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [position, setPosition] = useState<'center' | 'bottom'>('center');
  const [scrollY, setScrollY] = useState(0);
  const [responses, setResponses] = useState<any[]>([]);
  
  const theme = useTheme();
  const location = useLocation();
  const assistantRef = useRef<HTMLDivElement>(null);

  // Suggestions based on current page
  const getPageSuggestions = () => {
    const baseSuggestions = [
      "Phân tích xu hướng thị trường hiện tại",
      "Dự đoán deal nào có khả năng thành công cao nhất",
      "Tìm kiếm khách hàng tiềm năng",
      "Tạo báo cáo tổng quan kinh doanh"
    ];

    switch (location.pathname) {
      case '/dashboard':
        return [
          "Hiển thị KPI tháng này",
          "Phân tích xu hướng doanh thu",
          "Top 5 deal tiềm năng nhất",
          ...baseSuggestions
        ];
      case '/deals':
        return [
          "Dự đoán tỷ lệ thành công của các deal",
          "Phân tích pipeline hiện tại",
          "Đề xuất hành động cho deal đang pending",
          ...baseSuggestions
        ];
      case '/customers':
        return [
          "Phân tích hành vi khách hàng",
          "Tìm cơ hội cross-sell/up-sell",
          "Dự đoán customer churn",
          ...baseSuggestions
        ];
      default:
        return baseSuggestions;
    }
  };

  // Handle scroll to determine position
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrollY(currentScrollY);
      
      // On dashboard, move to bottom when scrolling
      if (isOnDashboard) {
        if (currentScrollY > 200) {
          setPosition('bottom');
        } else {
          setPosition('center');
        }
      } else {
        // On other pages, always show at bottom
        setPosition('bottom');
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isOnDashboard]);

  // Auto-open on dashboard, auto-minimize on other pages
  useEffect(() => {
    if (isOnDashboard && position === 'center') {
      setIsOpen(true);
      setIsMinimized(false);
    } else if (!isOnDashboard) {
      setIsMinimized(true);
    }
  }, [isOnDashboard, position]);

  // Handle AI query submission
  const handleSubmit = async (queryText: string) => {
    if (!queryText.trim()) return;

    setIsLoading(true);
    
    try {
      const request: AIRequest = {
        id: `req_${Date.now()}`,
        type: determineRequestType(queryText),
        data: { query: queryText, page: location.pathname },
        timestamp: new Date()
      };

      const response = await aiOrchestrator.processRequest(request);
      
      setResponses(prev => [...prev, {
        query: queryText,
        response: response.result,
        timestamp: new Date(),
        confidence: response.confidence
      }]);
      
      setQuery('');
    } catch (error) {
      console.error('Error processing AI query:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Determine request type based on query content
  const determineRequestType = (query: string): AIRequest['type'] => {
    const lowerQuery = query.toLowerCase();
    
    if (lowerQuery.includes('dự đoán') || lowerQuery.includes('predict')) {
      return 'deal_prediction';
    } else if (lowerQuery.includes('thị trường') || lowerQuery.includes('market') || lowerQuery.includes('xu hướng')) {
      return 'market_analysis';
    } else if (lowerQuery.includes('tìm') || lowerQuery.includes('search')) {
      return 'search';
    } else {
      return 'report_generation';
    }
  };

  // Get position styles
  const getPositionStyles = () => {
    if (position === 'center' && isOnDashboard) {
      return {
        position: 'fixed' as const,
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 1000,
        transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
      };
    } else {
      return {
        position: 'fixed' as const,
        bottom: 24,
        right: 24,
        zIndex: 1000,
        transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
      };
    }
  };

  // Minimized floating button
  if (isMinimized) {
    return (
      <Zoom in={true}>
        <Box sx={getPositionStyles()}>
          <Tooltip title="AI Assistant - Hỏi bất cứ điều gì!" placement="left">
            <Paper
              elevation={8}
              sx={{
                width: 64,
                height: 64,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'scale(1.1)',
                  boxShadow: '0 8px 25px rgba(102, 126, 234, 0.4)'
                }
              }}
              onClick={() => {
                setIsMinimized(false);
                setIsOpen(true);
              }}
            >
              <AIIcon sx={{ fontSize: 28 }} />
            </Paper>
          </Tooltip>
        </Box>
      </Zoom>
    );
  }

  return (
    <Fade in={isOpen}>
      <Box ref={assistantRef} sx={getPositionStyles()}>
        <Paper
          elevation={12}
          sx={{
            width: position === 'center' ? 600 : 400,
            maxHeight: position === 'center' ? 500 : 400,
            borderRadius: 3,
            overflow: 'hidden',
            background: alpha(theme.palette.background.paper, 0.95),
            backdropFilter: 'blur(20px)',
            border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
            transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
          }}
        >
          {/* Header */}
          <Box
            sx={{
              p: 2,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Avatar
                sx={{
                  width: 32,
                  height: 32,
                  background: 'rgba(255,255,255,0.2)'
                }}
              >
                <AIIcon />
              </Avatar>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 'bold', fontSize: '1rem' }}>
                  🤖 AI Assistant
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.9 }}>
                  Báo cáo thông minh • Luôn sẵn sàng hỗ trợ
                </Typography>
              </Box>
            </Box>
            <Box>
              <IconButton
                size="small"
                sx={{ color: 'white', mr: 1 }}
                onClick={() => setIsMinimized(true)}
              >
                <MinimizeIcon />
              </IconButton>
              <IconButton
                size="small"
                sx={{ color: 'white' }}
                onClick={() => setIsOpen(false)}
              >
                <CloseIcon />
              </IconButton>
            </Box>
          </Box>

          {/* Content */}
          <Box sx={{ p: 2, maxHeight: 300, overflow: 'auto' }}>
            {/* Quick Actions */}
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" sx={{ mb: 1, color: 'text.secondary' }}>
                Hành động nhanh
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Chip
                  icon={<TrendingIcon />}
                  label="Trending"
                  size="small"
                  onClick={() => handleSubmit("Hiển thị xu hướng thị trường hiện tại")}
                  sx={{ backgroundColor: alpha(theme.palette.success.main, 0.1) }}
                />
                <Chip
                  icon={<InsightIcon />}
                  label="Insights"
                  size="small"
                  onClick={() => handleSubmit("Phân tích insights kinh doanh")}
                  sx={{ backgroundColor: alpha(theme.palette.info.main, 0.1) }}
                />
                <Chip
                  icon={<PredictionIcon />}
                  label="Predictions"
                  size="small"
                  onClick={() => handleSubmit("Dự đoán deal tiềm năng")}
                  sx={{ backgroundColor: alpha(theme.palette.warning.main, 0.1) }}
                />
              </Box>
            </Box>

            {/* Suggestions */}
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" sx={{ mb: 1, color: 'text.secondary' }}>
                Gợi ý cho trang này
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {getPageSuggestions().slice(0, 3).map((suggestion, index) => (
                  <Chip
                    key={index}
                    label={suggestion}
                    size="small"
                    variant="outlined"
                    onClick={() => handleSubmit(suggestion)}
                    sx={{
                      fontSize: '0.75rem',
                      '&:hover': {
                        backgroundColor: alpha(theme.palette.primary.main, 0.1)
                      }
                    }}
                  />
                ))}
              </Box>
            </Box>

            {/* Recent Responses */}
            {responses.length > 0 && (
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" sx={{ mb: 1, color: 'text.secondary' }}>
                  Kết quả gần đây
                </Typography>
                <Box sx={{ maxHeight: 150, overflow: 'auto' }}>
                  {responses.slice(-2).map((item, index) => (
                    <Paper
                      key={index}
                      variant="outlined"
                      sx={{
                        p: 1.5,
                        mb: 1,
                        backgroundColor: alpha(theme.palette.primary.main, 0.05)
                      }}
                    >
                      <Typography variant="caption" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                        Q: {item.query}
                      </Typography>
                      <Typography variant="body2" sx={{ mt: 0.5, fontSize: '0.8rem' }}>
                        {typeof item.response === 'object' 
                          ? JSON.stringify(item.response).substring(0, 100) + '...'
                          : item.response
                        }
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'text.secondary', mt: 0.5, display: 'block' }}>
                        Độ tin cậy: {Math.round(item.confidence * 100)}%
                      </Typography>
                    </Paper>
                  ))}
                </Box>
              </Box>
            )}
          </Box>

          {/* Input */}
          <Box sx={{ p: 2, borderTop: `1px solid ${theme.palette.divider}` }}>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <TextField
                fullWidth
                size="small"
                placeholder="Hỏi AI về bất cứ điều gì..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit(query);
                  }
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    backgroundColor: alpha(theme.palette.background.default, 0.5)
                  }
                }}
              />
              <IconButton
                color="primary"
                onClick={() => handleSubmit(query)}
                disabled={isLoading || !query.trim()}
                sx={{
                  backgroundColor: theme.palette.primary.main,
                  color: 'white',
                  '&:hover': {
                    backgroundColor: theme.palette.primary.dark
                  },
                  '&:disabled': {
                    backgroundColor: theme.palette.action.disabled
                  }
                }}
              >
                {isLoading ? <CircularProgress size={20} color="inherit" /> : <SendIcon />}
              </IconButton>
              <IconButton
                sx={{
                  backgroundColor: alpha(theme.palette.grey[500], 0.1),
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.grey[500], 0.2)
                  }
                }}
              >
                <MicIcon />
              </IconButton>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Fade>
  );
};

export default FloatingAIAssistant;
