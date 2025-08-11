import React from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  useTheme,
  useMediaQuery,
  Box,
  Avatar,
  Badge,
  IconButton,
  Tooltip,
  alpha
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  MonetizationOn as DealIcon,
  Assignment as RequirementIcon,
  Receipt as QuotationIcon,
  Description as ContractIcon,
  DescriptionOutlined as AppendixIcon,
  AssignmentTurnedIn as AcceptanceIcon,
  ReceiptLong as InvoiceIcon,
  SmartToy as AssistantIcon,
  Notifications as NotificationsIcon
} from '@mui/icons-material';
import { useLocation, useNavigate } from 'react-router-dom';

interface SidebarProps {
  drawerWidth: number;
  mobileOpen: boolean;
  onClose: () => void;
  onAiAssistantClick?: () => void;
}

const menuItems = [
  {
    text: 'Dashboard',
    fullText: 'Dashboard',
    icon: <DashboardIcon />,
    path: '/dashboard'
  },
  {
    text: 'Khách hàng',
    fullText: 'Khách hàng',
    icon: <PeopleIcon />,
    path: '/customers'
  },
  {
    text: 'Cơ hội',
    fullText: 'Cơ hội bán hàng',
    icon: <DealIcon />,
    path: '/deals'
  },
  {
    text: 'Requirement',
    fullText: 'Requirement',
    icon: <RequirementIcon />,
    path: '/requirements'
  },
  {
    text: 'Báo giá',
    fullText: 'Báo giá / Ước tính',
    icon: <QuotationIcon />,
    path: '/quotations'
  },
  {
    text: 'Hợp đồng',
    fullText: 'Hợp đồng',
    icon: <ContractIcon />,
    path: '/contracts'
  },
  {
    text: 'Phụ lục',
    fullText: 'Phụ lục hợp đồng',
    icon: <AppendixIcon />,
    path: '/contract-appendices'
  },
  {
    text: 'Nghiệm thu',
    fullText: 'Biên bản nghiệm thu',
    icon: <AcceptanceIcon />,
    path: '/acceptance'
  },
  {
    text: 'Hóa đơn',
    fullText: 'Hóa đơn',
    icon: <InvoiceIcon />,
    path: '/invoices'
  },
  {
    text: 'Liên hệ',
    fullText: 'Quản lý liên hệ',
    icon: <PeopleIcon />,
    path: '/contacts'
  }
];

const Sidebar: React.FC<SidebarProps> = ({ drawerWidth, mobileOpen, onClose, onAiAssistantClick }) => {
  const theme = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));


  const drawer = (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      height: '100%',
      backgroundColor: theme.palette.mode === 'light' ? '#f0f2f5' : theme.palette.background.default,
    }}>
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        height: '100%',
        position: 'relative'
      }}>
        {/* Top notification section */}
        <Box sx={{ 
          py: 2,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'relative',
          minHeight: '64px',
          '&:after': {
            content: '""',
            position: 'absolute',
            bottom: 0,
            left: '50%',
            width: '60%',
            height: '1px',
            background: 'linear-gradient(to right, transparent, rgba(0,0,0,0.05), transparent)',
            transform: 'translateX(-50%)',
          }
        }}>
          <Tooltip title="Thông báo" placement="right" arrow>
            <IconButton 
              size="large"
              sx={{ 
                p: 1.5,
                position: 'relative',
                backgroundColor: 'transparent',
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.03)',
                  transform: 'scale(1.1)',
                  '& .MuiBadge-badge': {
                    transform: 'scale(1.1)',
                  },
                },
                transition: 'all 0.2s ease-in-out',
                borderRadius: '50%',
              }}
            >
              <Badge 
                badgeContent={4} 
                color="error"
                overlap="circular"
                sx={{ 
                  '& .MuiBadge-badge': { 
                    fontSize: '10px',
                    height: '18px',
                    minWidth: '18px',
                    padding: '0 4px',
                    transition: 'all 0.2s ease-in-out',
                    boxShadow: '0 0 0 2px #f0f2f5',
                  } 
                }}
              >
                <NotificationsIcon sx={{ fontSize: '1.5rem' }} />
              </Badge>
            </IconButton>
          </Tooltip>
        </Box>
        
        {/* Middle scrollable menu section */}
        <Box sx={{ 
          flexGrow: 1, 
          overflowY: 'auto',
          overflowX: 'hidden',
          py: 1,
          '&::-webkit-scrollbar': {
            width: '0px',
          },
          '&:hover::-webkit-scrollbar': {
            width: '4px',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: alpha(theme.palette.primary.main, 0.4),
            borderRadius: '4px',
            '&:hover': {
              backgroundColor: theme.palette.primary.main,
            },
          },
          '&::-webkit-scrollbar-track': {
            backgroundColor: 'transparent',
          },
        }}>
          <List sx={{ display: 'flex', flexDirection: 'column', p: 0.5, gap: 0.5 }}>
            {menuItems.map((item) => (
              <ListItem 
                key={item.text} 
                disablePadding 
                sx={{ 
                  width: '100%',
                  position: 'relative',
                  '&:hover': {
                    '&:before': {
                      opacity: 1,
                    },
                  },
                  '&:before': {
                    content: '""',
                    position: 'absolute',
                    left: 0,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: '3px',
                    height: '60%',
                    backgroundColor: theme.palette.primary.main,
                    borderRadius: '0 3px 3px 0',
                    opacity: location.pathname === item.path ? 1 : 0,
                    transition: 'all 0.2s ease-in-out',
                  },
                }}
              >
                <Tooltip 
                  title={item.fullText} 
                  placement="right" 
                  arrow
                  componentsProps={{
                    tooltip: {
                      sx: {
                        bgcolor: theme.palette.grey[800],
                        fontSize: '0.8rem',
                        '& .MuiTooltip-arrow': {
                          color: theme.palette.grey[800],
                        },
                      },
                    },
                  }}
                >
                  <ListItemButton
                    selected={location.pathname === item.path}
                    onClick={() => {
                      navigate(item.path);
                      if (isMobile) onClose();
                    }}
                    sx={{
                      flexDirection: 'column',
                      alignItems: 'center',
                      py: 1,
                      px: 0.5,
                      borderRadius: 2,
                      mx: 0.5,
                      transition: 'all 0.2s ease-in-out',
                      '&.Mui-selected': {
                        backgroundColor: 'transparent',
                        '&:hover': {
                          backgroundColor: 'transparent',
                        },
                        '& .MuiListItemIcon-root': {
                          backgroundColor: alpha(theme.palette.primary.main, 0.1),
                          borderRadius: '12px',
                          padding: '8px',
                          '& svg': {
                            color: theme.palette.primary.main,
                          },
                        },
                        '& .MuiListItemText-root span': {
                          color: theme.palette.primary.main,
                          fontWeight: 500,
                        },
                      },
                      '&:hover': {
                        backgroundColor: 'transparent',
                        transform: 'translateX(2px)',
                        '& .MuiListItemIcon-root': {
                          '& svg': {
                            color: theme.palette.primary.main,
                          },
                        },
                      },
                    }}
                  >
                    <ListItemIcon sx={{ 
                      minWidth: 'auto', 
                      mb: 0.5,
                      padding: '4px',
                      transition: 'all 0.2s ease-in-out',
                      '& svg': {
                        fontSize: '1.5rem',
                        color: location.pathname === item.path 
                          ? theme.palette.primary.main 
                          : theme.palette.text.secondary,
                      },
                    }}>
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText 
                      primary={item.text} 
                      sx={{ 
                        margin: 0,
                        '& .MuiTypography-root': {
                          fontSize: '0.65rem',
                          textAlign: 'center',
                          lineHeight: 1.2,
                          color: location.pathname === item.path 
                            ? theme.palette.primary.main 
                            : theme.palette.text.secondary,
                          transition: 'all 0.2s ease-in-out',
                        },
                      }} 
                    />
                  </ListItemButton>
                </Tooltip>
              </ListItem>
            ))}
          </List>
        </Box>
        
        {/* Bottom fixed user controls section */}
        <Box sx={{ 
          position: 'relative',
          py: 1.5, 
          px: 0.5,
          '&:before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: '50%',
            width: '60%',
            height: '1px',
            background: 'linear-gradient(to right, transparent, rgba(0,0,0,0.1), transparent)',
            transform: 'translateX(-50%)',
          }
        }}>
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            gap: 1.5,
            position: 'relative',
            zIndex: 1,
          }}>
            <Tooltip 
              title="Trợ lý AI" 
              placement="right"
              arrow
              componentsProps={{
                tooltip: {
                  sx: {
                    bgcolor: theme.palette.grey[800],
                    fontSize: '0.8rem',
                    '& .MuiTooltip-arrow': {
                      color: theme.palette.grey[800],
                    },
                  },
                },
              }}
            >
              <IconButton 
                size="small"
                onClick={onAiAssistantClick}
                sx={{ 
                  p: 1.2,
                  backgroundColor: alpha(theme.palette.primary.main, 0.1),
                  color: theme.palette.primary.main,
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.primary.main, 0.2),
                    transform: 'scale(1.1)',
                  },
                  transition: 'all 0.2s ease-in-out',
                }}
              >
                <AssistantIcon fontSize="medium" />
              </IconButton>
            </Tooltip>
            
            <Tooltip 
              title="Tài khoản" 
              placement="right"
              arrow
              componentsProps={{
                tooltip: {
                  sx: {
                    bgcolor: theme.palette.grey[800],
                    fontSize: '0.8rem',
                    '& .MuiTooltip-arrow': {
                      color: theme.palette.grey[800],
                    },
                  },
                },
              }}
            >
              <Avatar 
                sx={{ 
                  width: 36, 
                  height: 36, 
                  cursor: 'pointer',
                  bgcolor: alpha(theme.palette.primary.main, 0.8),
                  color: '#fff',
                  fontSize: '0.9rem',
                  fontWeight: 500,
                  transition: 'all 0.2s ease-in-out',
                  '&:hover': {
                    transform: 'scale(1.1)',
                    boxShadow: `0 0 0 2px ${alpha(theme.palette.primary.main, 0.2)}`,
                  },
                }}
                src="/path-to-avatar.jpg"
              >
                U
              </Avatar>
            </Tooltip>
          </Box>
        </Box>
      </Box>
    </Box>
  );

  return (
    <Box
      component="nav"
      sx={{ 
        width: drawerWidth,
        height: '100vh',
        position: 'relative',
      }}
      aria-label="main navigation"
    >
      {/* Mobile drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onClose}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile
        }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': { 
            boxSizing: 'border-box',
            width: drawerWidth,
            borderRight: 'none',
            boxShadow: 3,
          },
        }}
      >
        {drawer}
      </Drawer>
      
      {/* Desktop drawer - Always visible, no Drawer component needed */}
      <Box
        sx={{
          display: { xs: 'none', sm: 'flex' },
          flexDirection: 'column',
          height: '100%',
          width: '100%',
          backgroundColor: 'background.paper',
        }}
      >
        {drawer}
      </Box>
    </Box>
  );
};

export default Sidebar;
