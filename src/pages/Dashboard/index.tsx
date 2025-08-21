import React, { useState, useEffect, useRef } from 'react';
import { 
  Box, 
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  IconButton,
  TextField,
  InputAdornment,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  Avatar,
  Chip,
  useTheme,
  alpha,
  Popper,
  Divider,
  Zoom,
  Slide,
  CircularProgress,
  Tabs,
  Tab,
  Fade,
  ClickAwayListener
} from '@mui/material';
import CrmAssistantPanel from '../../components/CrmAssistantPanel';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  Search as SearchIcon, 
  SmartToy as AIIcon,
  Mic as MicIcon,
  KeyboardArrowUp as ScrollUpIcon,
  AutoAwesome as SparkleIcon,
  Close as CloseIcon,
  KeyboardArrowUp as KeyboardArrowUpIcon,
  ArrowBack as ArrowBackIcon,
  People as PeopleIcon,
  Handshake as HandshakeIcon
} from '@mui/icons-material';

// Import các component mới
import DynamicKPIStats from './components/DynamicKPIStats';
import TrendingInsightsPredictions from './components/TrendingInsightsPredictions';
import DynamicCharts from './components/DynamicCharts';
import SavedReports from './components/SavedReports';
import { globalAISearch } from '../../services/globalAISearch';

// Mock data for search results
const mockContacts = [
  {
    id: 1,
    name: 'Nguyễn Văn An',
    email: 'an.nguyen@company.com',
    phone: '0901234567',
    owner: 'Trần Thị B',
    leadStatus: 'Hot Lead',
    avatar: '/avatars/an.jpg'
  },
  {
    id: 2,
    name: 'Lê Thị Cẩm',
    email: 'cam.le@business.vn',
    phone: '0987654321',
    owner: 'Phạm Văn C',
    leadStatus: 'Qualified',
    avatar: '/avatars/cam.jpg'
  },
  {
    id: 3,
    name: 'Hoàng Minh Đức',
    email: 'duc.hoang@tech.com',
    phone: '0912345678',
    owner: 'Nguyễn Thị D',
    leadStatus: 'New Lead',
    avatar: '/avatars/duc.jpg'
  }
];

const mockDeals = [
  {
    id: 1,
    name: 'Hệ thống CRM cho ABC Corp',
    customer: 'ABC Corporation',
    owner: 'Trần Văn E',
    amount: 250000000,
    stage: 'Đã gửi báo giá'
  },
  {
    id: 2,
    name: 'Website thương mại điện tử',
    customer: 'XYZ Trading',
    owner: 'Lê Thị F',
    amount: 150000000,
    stage: 'Đang đàm phán'
  },
  {
    id: 3,
    name: 'Ứng dụng mobile banking',
    customer: 'Tech Bank',
    owner: 'Phạm Văn G',
    amount: 500000000,
    stage: 'Liên hệ ban đầu'
  }
];

const Dashboard = () => {
  const theme = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [currentQuery, setCurrentQuery] = useState<string>('');
  const [isLoaded, setIsLoaded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [showScrollToTop, setShowScrollToTop] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [activeTab, setActiveTab] = useState<'contacts' | 'deals'>('contacts');
  const [expandedSections, setExpandedSections] = useState({ contacts: false, deals: false });
  const [assistantOpen, setAssistantOpen] = useState(false);
  const [assistantMinimized, setAssistantMinimized] = useState(false);
  const [assistantQuery, setAssistantQuery] = useState('');

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

  // Handle keyboard events
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsSearchOpen(false);
      inputRef.current?.blur();
    }
  };

  // Format amount with K/M/B suffix
  const formatAmount = (amount: number): string => {
    if (amount >= 1000000000) {
      return `${(amount / 1000000000).toFixed(1)}B₫`;
    } else if (amount >= 1000000) {
      return `${(amount / 1000000).toFixed(1)}M₫`;
    } else if (amount >= 1000) {
      return `${(amount / 1000).toFixed(1)}K₫`;
    }
    return `${amount}₫`;
  };

  // Get contact display info based on query
  const getContactDisplay = (contact: any) => {
    const hasNumber = /\d/.test(searchQuery);
    return hasNumber ? contact.phone : contact.email;
  };

  // Handle item click navigation
  const handleContactClick = (contactId: number) => {
    navigate(`/contacts/${contactId}`);
    setIsSearchOpen(false);
  };

  const handleDealClick = (dealId: number) => {
    navigate(`/deals/${dealId}`);
    setIsSearchOpen(false);
  };

  // Handle "View all" clicks
  const handleViewAllContacts = () => {
    setActiveTab('contacts');
    setExpandedSections({ contacts: true, deals: false });
    setShowSearchResults(true);
    setIsSearchOpen(false);
  };

  const handleViewAllDeals = () => {
    setActiveTab('deals');
    setExpandedSections({ contacts: false, deals: true });
    setShowSearchResults(true);
    setIsSearchOpen(false);
  };

  // Handle CRM Assistant
  const handleOpenAssistant = () => {
    setAssistantQuery(searchQuery);
    setAssistantOpen(true);
    setIsSearchOpen(false);
  };

  const handleCloseAssistant = () => {
    setAssistantOpen(false);
    setAssistantMinimized(false);
  };

  const handleMinimizeAssistant = () => {
    setAssistantMinimized(true);
    setAssistantOpen(false);
  };

  // Handle back button
  const handleBackToDropdown = () => {
    setShowSearchResults(false);
    setIsSearchOpen(true);
  };

  // Handle show more
  const handleShowMore = (section: 'contacts' | 'deals') => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: true
    }));
  };

  // Generate extended mock data for expanded sections
  const getExtendedContacts = () => {
    const extended = [];
    for (let i = 0; i < 15; i++) {
      extended.push({
        ...mockContacts[i % mockContacts.length],
        id: mockContacts[i % mockContacts.length].id + i * 100,
        name: `${mockContacts[i % mockContacts.length].name} ${i + 1}`
      });
    }
    return extended;
  };

  const getExtendedDeals = () => {
    const extended = [];
    for (let i = 0; i < 15; i++) {
      extended.push({
        ...mockDeals[i % mockDeals.length],
        id: mockDeals[i % mockDeals.length].id + i * 100,
        name: `${mockDeals[i % mockDeals.length].name} ${i + 1}`,
        amount: mockDeals[i % mockDeals.length].amount + i * 10000000
      });
    }
    return extended;
  };

  // Get status chip color
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'hot lead': return 'error';
      case 'qualified': return 'success';
      case 'new lead': return 'info';
      case 'đã gửi báo giá': return 'warning';
      case 'đang đàm phán': return 'primary';
      case 'liên hệ ban đầu': return 'default';
      default: return 'default';
    }
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
    <Box sx={{ 
      position: 'relative', 
      width: '100%', 
      height: '100%',
      overflow: 'auto'
    }}>
        <Fade in={isLoaded} timeout={800}>
          <Box sx={{ p: 3, width: '100%', height: '100%' }}>
            {/* Welcome Header - Crunchbase style */}
            {!showSearchResults && (
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
                {t('pages.dashboard.welcomeBack')}
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
                {t('pages.dashboard.smartDashboard')}
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
                        placeholder={t('pages.dashboard.searchPlaceholder')}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onFocus={handleInputFocus}
                        onKeyDown={handleKeyDown}
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
                    
                    {/* Enhanced Search Dropdown */}
                    {isSearchOpen && !isMinimized && (
                      <Popper
                        open={isSearchOpen}
                        anchorEl={searchRef.current}
                        placement="bottom-start"
                        style={{ width: 'auto', minWidth: searchRef.current?.clientWidth, maxWidth: 500, zIndex: 1301 }}
                      >
                        <Paper
                          elevation={3}
                          sx={{
                            mt: 1,
                            borderRadius: 0,
                            maxHeight: 'none',
                            overflow: 'visible',
                            border: `1px solid ${alpha(theme.palette.divider, 0.3)}`,
                            backgroundColor: theme.palette.background.paper
                          }}
                        >
                          <Box sx={{ overflow: 'visible' }}>
                            {/* Contacts Section */}
                            <Box sx={{ py: 0.5 }}>
                              <Typography 
                                variant="caption" 
                                sx={{ 
                                  px: 1.5, 
                                  py: 0.5, 
                                  display: 'block',
                                  color: 'text.secondary',
                                  fontWeight: 'medium',
                                  textTransform: 'uppercase',
                                  letterSpacing: 0.5,
                                  fontSize: '0.65rem'
                                }}
                              >
                                {t('common.contacts')}
                              </Typography>
                              {mockContacts.slice(0, 3).map((contact) => (
                                <ListItemButton
                                  key={contact.id}
                                  onClick={() => handleContactClick(contact.id)}
                                  sx={{
                                    px: 1.5,
                                    py: 0.75,
                                    borderRadius: 0,
                                    mx: 1,
                                    mb: 0.5,
                                    '&:hover': {
                                      backgroundColor: alpha(theme.palette.primary.main, 0.08)
                                    }
                                  }}
                                >
                                  <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', minWidth: 0 }}>
                                    <Avatar 
                                      sx={{ 
                                        width: 24, 
                                        height: 24, 
                                        mr: 1,
                                        fontSize: '0.75rem',
                                        backgroundColor: theme.palette.primary.main
                                      }}
                                    >
                                      {contact.name.charAt(0)}
                                    </Avatar>
                                    <Box sx={{ 
                                      display: 'flex', 
                                      alignItems: 'center', 
                                      justifyContent: 'space-between',
                                      width: '100%',
                                      minWidth: 0
                                    }}>
                                      <Typography 
                                        variant="body2" 
                                        sx={{ 
                                          fontWeight: 'bold',
                                          color: 'text.primary',
                                          whiteSpace: 'nowrap',
                                          overflow: 'hidden',
                                          textOverflow: 'ellipsis',
                                          mr: 1,
                                          flex: 1
                                        }}
                                      >
                                        {contact.name}
                                        <Typography 
                                          component="span" 
                                          variant="caption" 
                                          sx={{ 
                                            color: 'text.secondary',
                                            ml: 0.5,
                                            fontWeight: 'normal'
                                          }}
                                        >
                                          — {getContactDisplay(contact)}
                                        </Typography>
                                      </Typography>
                                      <Chip
                                        label={contact.leadStatus}
                                        size="small"
                                        color={getStatusColor(contact.leadStatus) as any}
                                        sx={{
                                          height: 16,
                                          fontSize: '0.65rem',
                                          flexShrink: 0
                                        }}
                                      />
                                    </Box>
                                  </Box>
                                </ListItemButton>
                              ))}
                              <ListItemButton
                                onClick={handleViewAllContacts}
                                sx={{
                                  px: 1.5,
                                  py: 0.5,
                                  borderRadius: 0,
                                  mx: 1,
                                  color: 'primary.main',
                                  '&:hover': {
                                    backgroundColor: alpha(theme.palette.primary.main, 0.08)
                                  }
                                }}
                              >
                                <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                                  {t('common.viewAllContacts')}
                                </Typography>
                              </ListItemButton>
                            </Box>

                            <Divider sx={{ mx: 1 }} />

                            {/* Deals Section */}
                            <Box sx={{ py: 0.5 }}>
                              <Typography 
                                variant="caption" 
                                sx={{ 
                                  px: 1.5, 
                                  py: 0.5, 
                                  display: 'block',
                                  color: 'text.secondary',
                                  fontWeight: 'medium',
                                  textTransform: 'uppercase',
                                  letterSpacing: 0.5,
                                  fontSize: '0.65rem'
                                }}
                              >
                                {t('common.deals')}
                              </Typography>
                              {mockDeals.slice(0, 3).map((deal) => (
                                <ListItemButton
                                  key={deal.id}
                                  onClick={() => handleDealClick(deal.id)}
                                  sx={{
                                    px: 1.5,
                                    py: 0.75,
                                    borderRadius: 0,
                                    mx: 1,
                                    mb: 0.5,
                                    '&:hover': {
                                      backgroundColor: alpha(theme.palette.primary.main, 0.08)
                                    }
                                  }}
                                >
                                  <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', minWidth: 0 }}>
                                    <Box 
                                      sx={{ 
                                        width: 24, 
                                        height: 24, 
                                        mr: 1,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        backgroundColor: alpha(theme.palette.success.main, 0.1),
                                        borderRadius: 0,
                                        fontSize: '0.75rem'
                                      }}
                                    >
                                      💼
                                    </Box>
                                    <Box sx={{ 
                                      display: 'flex', 
                                      alignItems: 'center', 
                                      justifyContent: 'space-between',
                                      width: '100%',
                                      minWidth: 0
                                    }}>
                                      <Typography 
                                        variant="body2" 
                                        sx={{ 
                                          fontWeight: 'bold',
                                          color: 'text.primary',
                                          whiteSpace: 'nowrap',
                                          overflow: 'hidden',
                                          textOverflow: 'ellipsis',
                                          mr: 1,
                                          flex: 1
                                        }}
                                      >
                                        {deal.name}
                                        <Typography 
                                          component="span" 
                                          variant="caption" 
                                          sx={{ 
                                            color: 'text.secondary',
                                            ml: 0.5,
                                            fontWeight: 'normal'
                                          }}
                                        >
                                          — {formatAmount(deal.amount)}
                                        </Typography>
                                      </Typography>
                                      <Chip
                                        label={deal.stage}
                                        size="small"
                                        color={getStatusColor(deal.stage) as any}
                                        sx={{
                                          height: 16,
                                          fontSize: '0.65rem',
                                          flexShrink: 0
                                        }}
                                      />
                                    </Box>
                                  </Box>
                                </ListItemButton>
                              ))}
                              <ListItemButton
                                onClick={handleViewAllDeals}
                                sx={{
                                  px: 1.5,
                                  py: 0.5,
                                  borderRadius: 0,
                                  mx: 1,
                                  color: 'primary.main',
                                  '&:hover': {
                                    backgroundColor: alpha(theme.palette.primary.main, 0.08)
                                  }
                                }}
                              >
                                <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                                  {t('common.viewAllDeals')}
                                </Typography>
                              </ListItemButton>
                            </Box>
                            
                            {/* CRM Assistant Entry */}
                            {searchQuery && (
                              <>
                                <Divider sx={{ my: 1 }} />
                                <Box sx={{ px: 1 }}>
                                  <ListItemButton
                                    onClick={handleOpenAssistant}
                                    sx={{
                                      px: 1.5,
                                      py: 1,
                                      borderRadius: 0,
                                      backgroundColor: alpha(theme.palette.warning.main, 0.05),
                                      border: `1px solid ${alpha(theme.palette.warning.main, 0.2)}`,
                                      '&:hover': {
                                        backgroundColor: alpha(theme.palette.warning.main, 0.1)
                                      }
                                    }}
                                  >
                                    <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                                      <SparkleIcon 
                                        sx={{ 
                                          color: 'warning.main', 
                                          mr: 1.5,
                                          fontSize: '1.2rem'
                                        }} 
                                      />
                                      <Typography 
                                        variant="body2" 
                                        sx={{ 
                                          fontWeight: 'medium',
                                          color: 'warning.dark'
                                        }}
                                      >
                                        {t('pages.dashboard.askAssistant', { query: (searchQuery.length > 30 ? searchQuery.substring(0, 30) + '...' : searchQuery) })}
                                      </Typography>
                                    </Box>
                                  </ListItemButton>
                                </Box>
                              </>
                            )}
                          </Box>
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
                        {t('common.aiAssistantMinimized')}
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
            )}

            {/* Fixed Search Input for Search Results */}
            {showSearchResults && (
              <Box
                sx={{
                  position: 'fixed',
                  bottom: 20,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  zIndex: 1000,
                  width: 'auto',
                  maxWidth: 700,
                  minWidth: 500
                }}
              >
                <Paper
                  elevation={4}
                  sx={{
                    p: 2,
                    borderRadius: 4,
                    border: `2px solid ${alpha(theme.palette.warning.main, 0.6)}`,
                    backgroundColor: alpha(theme.palette.warning.main, 0.15),
                    backdropFilter: 'blur(12px)',
                    boxShadow: `0 6px 24px ${alpha(theme.palette.warning.main, 0.3)}`,
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                      backgroundColor: alpha(theme.palette.warning.main, 0.25),
                      boxShadow: `0 12px 40px ${alpha(theme.palette.warning.main, 0.4)}`,
                      transform: 'translateY(-4px)'
                    }
                  }}
                >
                  <TextField
                    fullWidth
                    placeholder={t('pages.dashboard.searchPlaceholder')}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleSearch();
                      }
                    }}
                    variant="outlined"
                    size="small"
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
                        backgroundColor: alpha(theme.palette.background.paper, 0.9),
                        fontSize: '0.9rem',
                        '&:hover': {
                          backgroundColor: theme.palette.background.paper,
                        },
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: alpha(theme.palette.background.paper, 0.8),
                          borderWidth: 2,
                        },
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                          borderColor: theme.palette.background.paper,
                          borderWidth: 2,
                        },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                          borderColor: theme.palette.background.paper,
                          borderWidth: 2,
                        }
                      }
                    }}
                  />
                </Paper>
              </Box>
            )}

            {/* Search Results Component */}
            {showSearchResults && (
              <Box sx={{ mb: 4 }}>
                {/* Header */}
                <Box
                  sx={{
                    position: 'sticky',
                    top: 0,
                    zIndex: 100,
                    backgroundColor: theme.palette.background.paper,
                    borderBottom: `1px solid ${theme.palette.divider}`,
                    p: 1.5,
                    mb: 2
                  }}
                >
                  <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <IconButton
                        onClick={handleBackToDropdown}
                        size="small"
                        sx={{
                          mr: 1,
                          width: 28,
                          height: 28,
                          backgroundColor: alpha(theme.palette.primary.main, 0.1),
                          '&:hover': {
                            backgroundColor: alpha(theme.palette.primary.main, 0.2)
                          }
                        }}
                      >
                        <ArrowBackIcon fontSize="small" />
                      </IconButton>
                      <Typography variant="body2" sx={{ fontWeight: 'bold', fontSize: '0.875rem' }}>
                        {t('pages.dashboard.back')}
                      </Typography>
                    </Box>
                    <Typography variant="h6" sx={{ fontSize: '1.1rem', color: 'text.primary', fontWeight: 'medium' }}>
                      {t('pages.dashboard.searchFor', { query: searchQuery || t('pages.dashboard.aiSearchResults') })}
                    </Typography>
                  </Box>
                  
                  {/* Tag Chips */}
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Chip
                      icon={<PeopleIcon fontSize="small" />}
                      label={t('common.contacts')}
                      variant={activeTab === 'contacts' ? 'filled' : 'outlined'}
                      color={activeTab === 'contacts' ? 'primary' : 'default'}
                      onClick={() => navigate('/contacts')}
                      sx={{ cursor: 'pointer', fontSize: '0.8rem' }}
                    />
                    <Chip
                      icon={<HandshakeIcon fontSize="small" />}
                      label={t('common.deals')}
                      variant={activeTab === 'deals' ? 'filled' : 'outlined'}
                      color={activeTab === 'deals' ? 'primary' : 'default'}
                      onClick={() => navigate('/deals')}
                      sx={{ cursor: 'pointer', fontSize: '0.8rem' }}
                    />
                  </Box>
                </Box>

                {/* Content Sections */}
                <Box sx={{ px: 2 }}>
                  {/* Contacts Section */}
                  <Box sx={{ mb: 4 }}>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 'bold',
                        mb: 2,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1
                      }}
                    >
                      {t('pages.dashboard.sections.contacts')}
                      <Chip
                        label={expandedSections.contacts ? getExtendedContacts().length : mockContacts.length}
                        size="small"
                        variant="outlined"
                      />
                    </Typography>
                    
                    <Paper
                      elevation={1}
                      sx={{
                        borderRadius: '6px',
                        border: `1px solid ${alpha(theme.palette.divider, 0.3)}`,
                        backgroundColor: theme.palette.background.paper,
                        overflow: 'hidden'
                      }}
                    >
                      {(expandedSections.contacts ? getExtendedContacts() : mockContacts.slice(0, 3)).map((contact) => (
                        <ListItemButton
                          key={contact.id}
                          onClick={() => handleContactClick(contact.id)}
                          sx={{
                            px: 2,
                            py: 1,
                            borderRadius: 0,
                            '&:hover': {
                              backgroundColor: alpha(theme.palette.primary.main, 0.08)
                            },
                            '&:not(:last-child)': {
                              borderBottom: `1px solid ${alpha(theme.palette.divider, 0.2)}`
                            }
                          }}
                        >
                          <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', minWidth: 0 }}>
                            <Avatar
                              sx={{
                                width: 24,
                                height: 24,
                                mr: 1.5,
                                fontSize: '0.75rem',
                                backgroundColor: theme.palette.primary.main
                              }}
                            >
                              {contact.name.charAt(0)}
                            </Avatar>
                            <Box sx={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              width: '100%',
                              minWidth: 0
                            }}>
                              <Typography
                                variant="body2"
                                sx={{
                                  fontWeight: 'bold',
                                  color: 'text.primary',
                                  whiteSpace: 'nowrap',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  mr: 1,
                                  flex: 1
                                }}
                              >
                                {contact.name}
                                <Typography
                                  component="span"
                                  variant="caption"
                                  sx={{
                                    color: 'text.secondary',
                                    ml: 0.5,
                                    fontWeight: 'normal'
                                  }}
                                >
                                  — {getContactDisplay(contact)} · {contact.owner}
                                </Typography>
                              </Typography>
                              <Chip
                                label={contact.leadStatus}
                                size="small"
                                color={getStatusColor(contact.leadStatus) as any}
                                sx={{
                                  height: 18,
                                  fontSize: '0.65rem',
                                  flexShrink: 0
                                }}
                              />
                            </Box>
                          </Box>
                        </ListItemButton>
                      ))}
                      
                      {!expandedSections.contacts && (
                        <ListItemButton
                          onClick={() => handleShowMore('contacts')}
                          sx={{
                            px: 2,
                            py: 1,
                            borderRadius: 0,
                            color: 'primary.main',
                            borderTop: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
                            justifyContent: 'center',
                            '&:hover': {
                              backgroundColor: alpha(theme.palette.primary.main, 0.08)
                            }
                          }}
                        >
                          <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                            {t('pages.dashboard.showMoreContacts')}
                          </Typography>
                        </ListItemButton>
                      )}
                    </Paper>
                  </Box>

                  {/* Deals Section */}
                  <Box>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 'bold',
                        mb: 2,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1
                      }}
                    >
                      {t('pages.dashboard.sections.deals')}
                      <Chip
                        label={expandedSections.deals ? getExtendedDeals().length : mockDeals.length}
                        size="small"
                        variant="outlined"
                      />
                    </Typography>
                    
                    <Paper
                      elevation={1}
                      sx={{
                        borderRadius: '6px',
                        border: `1px solid ${alpha(theme.palette.divider, 0.3)}`,
                        backgroundColor: theme.palette.background.paper,
                        overflow: 'hidden'
                      }}
                    >
                      {(expandedSections.deals ? getExtendedDeals() : mockDeals.slice(0, 3)).map((deal) => (
                        <ListItemButton
                          key={deal.id}
                          onClick={() => handleDealClick(deal.id)}
                          sx={{
                            px: 2,
                            py: 1,
                            borderRadius: 0,
                            '&:hover': {
                              backgroundColor: alpha(theme.palette.primary.main, 0.08)
                            },
                            '&:not(:last-child)': {
                              borderBottom: `1px solid ${alpha(theme.palette.divider, 0.2)}`
                            }
                          }}
                        >
                          <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', minWidth: 0 }}>
                            <Box
                              sx={{
                                width: 24,
                                height: 24,
                                mr: 1.5,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                backgroundColor: alpha(theme.palette.success.main, 0.1),
                                borderRadius: 1,
                                fontSize: '0.75rem'
                              }}
                            >
                              💼
                            </Box>
                            <Box sx={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              width: '100%',
                              minWidth: 0
                            }}>
                              <Typography
                                variant="body2"
                                sx={{
                                  fontWeight: 'bold',
                                  color: 'text.primary',
                                  whiteSpace: 'nowrap',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  mr: 1,
                                  flex: 1
                                }}
                              >
                                {deal.name}
                                <Typography
                                  component="span"
                                  variant="caption"
                                  sx={{
                                    color: 'text.secondary',
                                    ml: 0.5,
                                    fontWeight: 'normal'
                                  }}
                                >
                                  — {deal.customer} · {deal.owner} · {formatAmount(deal.amount)}
                                </Typography>
                              </Typography>
                              <Chip
                                label={deal.stage}
                                size="small"
                                color={getStatusColor(deal.stage) as any}
                                sx={{
                                  height: 18,
                                  fontSize: '0.65rem',
                                  flexShrink: 0
                                }}
                              />
                            </Box>
                          </Box>
                        </ListItemButton>
                      ))}
                      
                      {!expandedSections.deals && (
                        <ListItemButton
                          onClick={() => handleShowMore('deals')}
                          sx={{
                            px: 2,
                            py: 1,
                            borderRadius: 0,
                            color: 'primary.main',
                            borderTop: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
                            justifyContent: 'center',
                            '&:hover': {
                              backgroundColor: alpha(theme.palette.primary.main, 0.08)
                            }
                          }}
                        >
                          <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                            {t('pages.dashboard.showMoreDeals')}
                          </Typography>
                        </ListItemButton>
                      )}
                    </Paper>
                  </Box>
                </Box>
              </Box>
            )}

            {/* Dynamic KPI Stats - Crunchbase "THIS MONTH ON CRUNCHBASE" style */}
            {!showSearchResults && <DynamicKPIStats />}

            {/* Main Content Grid */}
            {!showSearchResults && (
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
            )}

            {/* Footer */}
            <Box sx={{ mt: 4, pt: 2, borderTop: `1px solid ${theme.palette.divider}`, textAlign: 'center' }}>
              <Typography variant="caption" color="text.secondary">
                {t('pages.dashboard.footer')}
              </Typography>
            </Box>
          </Box>
        </Fade>
        
        {/* CRM Assistant Panel */}
        <CrmAssistantPanel
          open={assistantOpen}
          initialQuery={assistantQuery}
          onClose={handleCloseAssistant}
          onMinimize={handleMinimizeAssistant}
        />
        
        {/* Minimized Assistant Button */}
        {assistantMinimized && (
          <Zoom in={assistantMinimized}>
            <Paper
              elevation={6}
              sx={{
                position: 'fixed',
                bottom: 20,
                right: 20,
                width: 60,
                height: 60,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                backgroundColor: 'warning.main',
                color: 'warning.contrastText',
                zIndex: 1300,
                '&:hover': {
                  transform: 'scale(1.1)',
                  boxShadow: `0 8px 25px ${alpha(theme.palette.warning.main, 0.4)}`
                },
                transition: 'all 0.3s ease-in-out'
              }}
              onClick={() => {
                setAssistantMinimized(false);
                setAssistantOpen(true);
              }}
            >
              <SparkleIcon sx={{ fontSize: '1.5rem' }} />
            </Paper>
          </Zoom>
        )}
      </Box>
  );
};

export default Dashboard;
