import React, { useState, useEffect, useRef } from 'react';
import { 
  Box, 
  Typography, 
  Container, 
  useTheme, 
  alpha, 
  Fade, 
  Paper,
  TextField,
  IconButton,
  InputAdornment,
  Popper,
  ClickAwayListener,
  List,
  ListItemButton,
  ListItemText,
  CircularProgress,
  Zoom,
  Slide
} from '@mui/material';
import { useLocation } from 'react-router-dom';
import { 
  Search as SearchIcon, 
  SmartToy as AIIcon,
  Mic as MicIcon,
  Close as CloseIcon,
  KeyboardArrowUp as KeyboardArrowUpIcon
} from '@mui/icons-material';

// Import các component mới
import DynamicKPIStats from './components/DynamicKPIStats';
import TrendingInsightsPredictions from './components/TrendingInsightsPredictions';
import DynamicCharts from './components/DynamicCharts';
import SavedReports from './components/SavedReports';
import { globalAISearch } from '../../services/globalAISearch';

const Dashboard = () => {
  const theme = useTheme();
  const location = useLocation();
  const [currentQuery, setCurrentQuery] = useState<string>('');
  const [isLoaded, setIsLoaded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isMinimized, setIsMinimized] = useState<boolean>(false);
  const [showScrollToTop, setShowScrollToTop] = useState<boolean>(false);
  const [scrollY, setScrollY] = useState(0);
  
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Simulate loading for smooth animation
    const timer = setTimeout(() => setIsLoaded(true), 200);
    return () => clearTimeout(timer);
  }, []);

  // Handle scroll to determine position
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrollY(currentScrollY);
      
      // Always show minimized search bar when scrolling down
      // and show full search bar at the top
      if (currentScrollY > 200) {
        setIsMinimized(true);
        setShowScrollToTop(true);
      } else {
        setIsMinimized(false);
        setShowScrollToTop(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Load suggestions when search is opened
  useEffect(() => {
    if (isSearchOpen && searchQuery.length === 0) {
      loadSuggestions();
    }
  }, [isSearchOpen]);

  const loadSuggestions = async () => {
    try {
      const suggestions = await globalAISearch.getSearchSuggestions('', location.pathname);
      setSuggestions(suggestions);
    } catch (error) {
      console.error('Error loading suggestions:', error);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsLoading(true);
    try {
      const results = await globalAISearch.contextualSearch(searchQuery);
      console.log('Search results:', results);
      // Process results as needed
      handleGenerateReport(searchQuery);
    } catch (error) {
      console.error('Error searching:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setSearchQuery(suggestion);
    handleSearch();
  };

  const handleInputFocus = () => {
    setIsSearchOpen(true);
  };

  const handleClickAway = () => {
    setIsSearchOpen(false);
  };

  const handleScrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // Xử lý khi người dùng gửi yêu cầu báo cáo mới
  const handleGenerateReport = (query: string) => {
    console.log('Generating report for query:', query);
    setCurrentQuery(query);
    // Ở đây trong thực tế sẽ gọi API để xử lý yêu cầu và tạo báo cáo
  };

  return (
    <Container maxWidth="xl" sx={{ position: 'relative' }}>
        <Fade in={isLoaded} timeout={800}>
          <Box sx={{ py: 3 }}>
            {/* Welcome Header - Crunchbase style */}
            <Box 
              sx={{ 
                textAlign: 'center',
                mb: 6,
                py: 4,
                background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)} 0%, ${alpha(theme.palette.secondary.main, 0.05)} 100%)`,
                borderRadius: 3,
                border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`
              }}
            >
              <Typography 
                variant="h3" 
                component="h1" 
                gutterBottom 
                sx={{ 
                  fontWeight: 'bold', 
                  color: theme.palette.text.primary,
                  mb: 2
                }}
              >
                Chào mừng trở lại, Admin
              </Typography>
              <Typography 
                variant="h6" 
                color="text.secondary"
                sx={{ 
                  mb: 3,
                  maxWidth: 600,
                  mx: 'auto'
                }}
              >
                Dashboard thông minh
              </Typography>
              
              {/* AI Search Input - Crunchbase style */}
              <ClickAwayListener onClickAway={handleClickAway}>
                <Box 
                  ref={searchRef}
                  sx={{
                    position: isMinimized ? 'fixed' : 'relative',
                    bottom: isMinimized ? 20 : 'auto',
                    right: isMinimized ? 20 : 'auto',
                    left: isMinimized ? 'auto' : 'auto',
                    zIndex: 1000,
                    width: isMinimized ? 'auto' : '100%',
                    maxWidth: isMinimized ? 300 : 600,
                    mx: 'auto',
                    transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                    transform: 'translateY(0)',
                    opacity: 1,
                    boxShadow: isMinimized ? '0 8px 32px rgba(0,0,0,0.15)' : 'none',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2
                  }}
                >
                  <Zoom in={true} style={{ transitionDelay: isMinimized ? '100ms' : '0ms' }}>
                    <Paper
                      elevation={isMinimized ? 4 : 1}
                      sx={{
                        p: isMinimized ? 1 : 2,
                        borderRadius: 8,
                        border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                        backgroundColor: isMinimized ? 
                          alpha(theme.palette.background.paper, 0.95) : 
                          alpha(theme.palette.background.paper, 0.8),
                        backdropFilter: 'blur(8px)',
                        boxShadow: isMinimized ? 
                          `0 4px 20px ${alpha(theme.palette.primary.main, 0.15)}` : 
                          'none',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        '&:hover': {
                          boxShadow: isMinimized ? 
                            `0 8px 32px ${alpha(theme.palette.primary.main, 0.25)}` : 
                            'none',
                          transform: isMinimized ? 'translateY(-2px)' : 'none'
                        }
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <TextField
                        inputRef={inputRef}
                        fullWidth
                        placeholder="Hỏi AI về dữ liệu kinh doanh, thị trường, khách hàng..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onFocus={handleInputFocus}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            handleSearch();
                          }
                        }}
                        variant="outlined"
                        size={isMinimized ? "small" : "medium"}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <AIIcon color="primary" />
                            </InputAdornment>
                          ),
                          endAdornment: (
                            <InputAdornment position="end">
                              {searchQuery ? (
                                <IconButton
                                  size="small"
                                  onClick={() => setSearchQuery('')}
                                  edge="end"
                                >
                                  <CloseIcon fontSize="small" />
                                </IconButton>
                              ) : null}
                              {isLoading ? (
                                <CircularProgress size={20} />
                              ) : (
                                <IconButton
                                  size="small"
                                  onClick={handleSearch}
                                  edge="end"
                                  color="primary"
                                >
                                  <SearchIcon />
                                </IconButton>
                              )}
                              <IconButton
                                size="small"
                                edge="end"
                              >
                                <MicIcon />
                              </IconButton>
                            </InputAdornment>
                          ),
                          sx: {
                            borderRadius: 8,
                            backgroundColor: alpha(theme.palette.background.paper, 0.5),
                            fontSize: '1rem',
                            '&:hover': {
                              backgroundColor: alpha(theme.palette.background.paper, 0.8),
                            },
                            '& .MuiOutlinedInput-notchedOutline': {
                              borderColor: alpha(theme.palette.primary.main, 0.3),
                              borderWidth: 2,
                            },
                            '&:hover .MuiOutlinedInput-notchedOutline': {
                              borderColor: alpha(theme.palette.primary.main, 0.5),
                              borderWidth: 2,
                            },
                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                              borderColor: theme.palette.primary.main,
                              borderWidth: 2,
                            }
                          }
                        }}
                      />
                    </Box>
                    
                    {/* Suggestions Dropdown */}
                    {isSearchOpen && !isMinimized && (
                      <Popper
                        open={isSearchOpen}
                        anchorEl={searchRef.current}
                        placement="bottom-start"
                        style={{ width: searchRef.current?.clientWidth, zIndex: 1301 }}
                      >
                        <Paper
                          elevation={3}
                          sx={{
                            mt: 1,
                            p: 1,
                            borderRadius: 2,
                            maxHeight: 300,
                            overflow: 'auto',
                            border: `1px solid ${theme.palette.divider}`
                          }}
                        >
                          <List dense>
                            {suggestions.map((suggestion, index) => (
                              <ListItemButton
                                key={index}
                                onClick={() => handleSuggestionClick(suggestion)}
                              >
                                <ListItemText primary={suggestion} />
                              </ListItemButton>
                            ))}
                          </List>
                        </Paper>
                      </Popper>
                    )}
                    
                    {/* Minimized Label */}
                    {isMinimized && (
                      <Typography 
                        variant="caption" 
                        sx={{ 
                          ml: 1, 
                          color: 'text.secondary',
                          display: { xs: 'none', sm: 'inline' }
                        }}
                      >
                        AI Assistant - Hỏi bất cứ điều gì!
                      </Typography>
                    )}
                  </Paper>
                  </Zoom>
                  
                  {/* Scroll to top button */}
                  <Slide direction="up" in={showScrollToTop} mountOnEnter unmountOnExit>
                    <IconButton 
                      color="primary"
                      size="medium"
                      onClick={handleScrollToTop}
                      sx={{
                        position: 'fixed',
                        bottom: isMinimized ? 80 : 20,
                        right: 20,
                        backgroundColor: alpha(theme.palette.background.paper, 0.9),
                        boxShadow: `0 4px 14px ${alpha(theme.palette.primary.main, 0.2)}`,
                        border: `1px solid ${alpha(theme.palette.primary.main, 0.3)}`,
                        '&:hover': {
                          backgroundColor: alpha(theme.palette.background.paper, 1),
                          boxShadow: `0 6px 20px ${alpha(theme.palette.primary.main, 0.3)}`,
                        }
                      }}
                    >
                      <KeyboardArrowUpIcon />
                    </IconButton>
                  </Slide>
                </Box>
              </ClickAwayListener>
            </Box>

            {/* Dynamic KPI Stats - Crunchbase "THIS MONTH ON CRUNCHBASE" style */}
            <DynamicKPIStats />

            {/* Main Content Grid */}
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '2fr 1fr' }, gap: 4, mb: 4 }}>
              {/* Left Column - Trending, Insights, Predictions */}
              <Box>
                <TrendingInsightsPredictions />
              </Box>

              {/* Right Column - Charts and Reports */}
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                {/* Dynamic Charts */}
                <Box>
                  <DynamicCharts query={currentQuery} />
                </Box>

                {/* Saved Reports */}
                <Box>
                  <SavedReports />
                </Box>
              </Box>
            </Box>

            {/* AI Orchestration Status */}
            <Box 
              sx={{ 
                mt: 4, 
                p: 3, 
                backgroundColor: alpha(theme.palette.background.paper, 0.8),
                borderRadius: 2,
                border: `1px solid ${theme.palette.divider}`,
                textAlign: 'center'
              }}
            >
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                🤖 Powered by AI Orchestration System
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Orchestrator • Pipeline • Agent • Monitoring • Dynamic Routing
              </Typography>
            </Box>

            {/* Footer */}
            <Box sx={{ mt: 4, pt: 2, borderTop: `1px solid ${theme.palette.divider}`, textAlign: 'center' }}>
              <Typography variant="caption" color="text.secondary">
                © 2025 CRM Dashboard - Powered by AI Orchestration • Real-time Data • Smart Predictions
              </Typography>
            </Box>
          </Box>
        </Fade>
      </Container>
  );
};

export default Dashboard;
