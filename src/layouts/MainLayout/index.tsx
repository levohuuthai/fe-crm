import { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Box, CssBaseline, useTheme, useMediaQuery, alpha } from '@mui/material';
import Sidebar from '../../components/Sidebar';
import { AIAssistantSidebar } from '../../components/AIAssistantSidebar';
import FloatingAIAssistant from '../../components/FloatingAIAssistant';

const DRAWER_WIDTH = 80;
const AI_SIDEBAR_WIDTH = 450;
const CONTENT_PADDING = 3; // 24px padding
const CONTENT_MARGIN = 10; // 16px margin

const MainLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [aiSidebarOpen, setAiSidebarOpen] = useState(false);
  const [contentHeight, setContentHeight] = useState('auto');
  const [isScrolled, setIsScrolled] = useState(false);
  
  const theme = useTheme();
  const location = useLocation();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const toggleAiSidebar = () => {
    setAiSidebarOpen(!aiSidebarOpen);
  };

  // Update content height when window is resized
  useEffect(() => {
    const updateContentHeight = () => {
      const viewportHeight = window.innerHeight;
      setContentHeight(`${viewportHeight - CONTENT_MARGIN * 2}px`);
    };

    // Set initial height
    updateContentHeight();

    // Add scroll event listener
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('resize', updateContentHeight);
    window.addEventListener('scroll', handleScroll);

    // Clean up event listeners
    return () => {
      window.removeEventListener('resize', updateContentHeight);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Close mobile drawer when route changes
  useEffect(() => {
    if (isMobile) {
      setMobileOpen(false);
    }
    // Scroll to top when route changes
    window.scrollTo(0, 0);
  }, [location.pathname, isMobile]);

  return (
    <Box sx={{ 
      display: 'flex', 
      height: '100vh',
      overflow: 'hidden',
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      width: '100%',
      backgroundColor: theme.palette.mode === 'light' ? '#f0f2f5' : theme.palette.background.default,
    }}>
      <CssBaseline />
      
      {/* Left Sidebar - Fixed background */}
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          bottom: 0,
          width: DRAWER_WIDTH,
          zIndex: 0,
          backgroundColor: theme.palette.grey[100],
          backgroundImage: 'linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%)',
          transition: 'all 0.3s ease-in-out',
        }}
      >
        <Sidebar 
          drawerWidth={DRAWER_WIDTH} 
          mobileOpen={mobileOpen} 
          onClose={handleDrawerToggle}
          onAiAssistantClick={toggleAiSidebar} 
        />
      </Box>
      
      {/* Main Content Area - Floating panel */}
      <Box
        component="main"
        sx={{
          position: 'relative',
          flex: 1,
          ml: { xs: 0, sm: `${DRAWER_WIDTH}px` },
          p: 0,
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 1,
          transition: 'all 0.3s ease-in-out',
        }}
      >
        {/* Content Wrapper with floating effect */}
        <Box
          sx={{
            position: 'relative',
            flex: 1,
            mt: `${CONTENT_MARGIN}px`,
            mr: `${CONTENT_MARGIN}px`,
            mb: `${CONTENT_MARGIN}px`,
            ml: 0,
            borderRadius: 2,
            backgroundColor: theme.palette.background.paper,
            boxShadow: '0 4px 20px 0 rgba(0, 0, 0, 0.05), 0 0 0 1px rgba(0, 0, 0, 0.02)',
            display: 'flex',
            flexDirection: 'column',
            transform: isScrolled ? 'translateY(6px)' : 'translateY(0)',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            height: `calc(100vh - ${CONTENT_MARGIN * 2}px)`,
            maxHeight: `calc(100vh - ${CONTENT_MARGIN * 2}px)`,
            overflow: 'hidden',
            '&:hover': {
              boxShadow: '0 15px 35px -10px rgba(0,0,0,0.15)',
              transform: isScrolled ? 'translateY(8px)' : 'translateY(-2px)',
            },
            [theme.breakpoints.down('sm')]: {
              m: 1,
              borderRadius: 3,
              height: `calc(100vh - ${8}px)`,
              maxHeight: `calc(100vh - ${8}px)`,
            },
          }}
        >
          {/* Scrollable content area */}
          <Box 
            sx={{ 
              flex: 1,
              overflow: 'auto',
              p: CONTENT_PADDING,
              position: 'relative',
              '&::-webkit-scrollbar': {
                width: '6px',
                height: '6px',
              },
              '&::-webkit-scrollbar-thumb': {
                backgroundColor: alpha(theme.palette.primary.main, 0.5),
                borderRadius: '3px',
                '&:hover': {
                  backgroundColor: theme.palette.primary.main,
                },
              },
              '&::-webkit-scrollbar-track': {
                backgroundColor: alpha(theme.palette.grey[300], 0.3),
              },
            }}
          >
            <Box 
              sx={{
                minHeight: 'min-content',
                height: 'fit-content',
              }}
            >
              <Outlet />
            </Box>
          </Box>
        </Box>
      </Box>
      
      {/* Floating AI Assistant - Available on all pages */}
      <FloatingAIAssistant isOnDashboard={location.pathname === '/dashboard'} />
      
      {/* Right Sidebar - AI Assistant */}
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          right: 0,
          bottom: 0,
          width: aiSidebarOpen ? `${AI_SIDEBAR_WIDTH}px` : 0,
          transition: theme.transitions.create(['width', 'opacity', 'transform'], {
            easing: theme.transitions.easing.easeInOut,
            duration: theme.transitions.duration.standard,
          }),
          overflow: 'hidden',
          backgroundColor: theme.palette.background.paper,
          boxShadow: '-5px 0 15px rgba(0,0,0,0.05)',
          zIndex: 2,
          opacity: aiSidebarOpen ? 1 : 0,
          transform: aiSidebarOpen ? 'translateX(0)' : 'translateX(20px)',
          borderLeft: `1px solid ${theme.palette.divider}`,
        }}
      >
        <AIAssistantSidebar open={aiSidebarOpen} onClose={toggleAiSidebar}>
          <Box sx={{ p: 3 }}/>
        </AIAssistantSidebar>
      </Box>
    </Box>
  );
};

export default MainLayout;
