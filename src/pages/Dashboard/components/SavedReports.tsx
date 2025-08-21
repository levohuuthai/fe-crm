import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { 
  Box, 
  Paper, 
  Typography, 
  List, 
  ListItem, 
  ListItemText, 
  ListItemSecondaryAction, 
  IconButton, 
  Divider,
  Menu,
  MenuItem,
  Chip,
  TextField,
  InputAdornment
} from '@mui/material';
import {
  MoreVert as MoreVertIcon,
  Download as DownloadIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Search as SearchIcon,
  Share as ShareIcon,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon
} from '@mui/icons-material';

// Dữ liệu mẫu cho các báo cáo đã lưu (mặc định, dùng khi bản địa hóa chưa có)
const DEFAULT_SAVED_REPORTS = [
  {
    id: 1,
    title: 'Báo cáo doanh thu theo nhân viên Q2/2025',
    createdAt: '2025-06-30',
    type: 'bar',
    favorite: true,
    tags: ['doanh thu', 'nhân viên', 'quý 2']
  },
  {
    id: 2,
    title: 'Phân tích tỉ lệ chuyển đổi lead sang khách hàng',
    createdAt: '2025-06-25',
    type: 'pie',
    favorite: false,
    tags: ['lead', 'chuyển đổi', 'phễu bán hàng']
  },
  {
    id: 3,
    title: 'Báo cáo doanh thu theo tháng năm 2025',
    createdAt: '2025-06-20',
    type: 'line',
    favorite: true,
    tags: ['doanh thu', 'tháng', '2025']
  },
  {
    id: 4,
    title: 'Top 10 khách hàng tiềm năng tháng 6',
    createdAt: '2025-06-15',
    type: 'table',
    favorite: false,
    tags: ['khách hàng tiềm năng', 'top 10']
  },
  {
    id: 5,
    title: 'Phân tích hiệu quả chiến dịch marketing Q2',
    createdAt: '2025-06-10',
    type: 'bar',
    favorite: false,
    tags: ['marketing', 'chiến dịch', 'quý 2']
  }
];

const SavedReports: React.FC = () => {
  const { t } = useTranslation();
  // Lấy items bản địa hóa từ file dịch; nếu không có thì để trống và sẽ fallback
  const localizedItems = t('pages.dashboard.savedReports.items', { returnObjects: true }) as Record<string, { title: string; tags: string[] }> | undefined;
  // Trộn dữ liệu mặc định với tiêu đề & tag bản địa hóa theo id
  const SAVED_REPORTS = DEFAULT_SAVED_REPORTS.map((item) => {
    const loc = localizedItems?.[String(item.id)];
    return {
      ...item,
      title: loc?.title ?? item.title,
      tags: Array.isArray(loc?.tags) ? loc!.tags : item.tags,
    };
  });
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedReportId, setSelectedReportId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState<Record<number, boolean>>(
    SAVED_REPORTS.reduce((acc, report) => ({
      ...acc,
      [report.id]: report.favorite
    }), {})
  );

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, id: number) => {
    setAnchorEl(event.currentTarget);
    setSelectedReportId(id);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedReportId(null);
  };

  const handleToggleFavorite = (id: number) => {
    setFavorites(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const getChartIcon = (type: string) => {
    switch (type) {
      case 'bar':
        return '📊';
      case 'pie':
        return '🥧';
      case 'line':
        return '📈';
      case 'table':
        return '📋';
      default:
        return '📄';
    }
  };

  const filteredReports = SAVED_REPORTS.filter(report => 
    report.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    report.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <Paper elevation={2} sx={{ borderRadius: 2 }}>
      <Box sx={{ p: 2, borderBottom: '1px solid #e2e8f0' }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
          {t('pages.dashboard.savedReports.title')}
        </Typography>
        
        <TextField
          fullWidth
          size="small"
          placeholder={t('pages.dashboard.savedReports.searchPlaceholder')}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" />
              </InputAdornment>
            ),
          }}
          sx={{ mb: 1 }}
        />
      </Box>

      <List sx={{ maxHeight: '400px', overflow: 'auto' }}>
        {filteredReports.length === 0 ? (
          <ListItem>
            <ListItemText 
              primary={t('pages.dashboard.savedReports.emptyTitle')} 
              secondary={t('pages.dashboard.savedReports.emptySubtitle')} 
            />
          </ListItem>
        ) : (
          filteredReports.map((report) => (
            <React.Fragment key={report.id}>
              <ListItem 
                sx={{ 
                  cursor: 'pointer',
                  '&:hover': { 
                    backgroundColor: '#f8fafc' 
                  }
                }}
              >
                <Box sx={{ mr: 1, fontSize: '1.5rem' }}>
                  {getChartIcon(report.type)}
                </Box>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                        {report.title}
                      </Typography>
                      <IconButton 
                        size="small" 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleFavorite(report.id);
                        }}
                        sx={{ ml: 1, color: favorites[report.id] ? '#f43f5e' : 'inherit' }}
                      >
                        {favorites[report.id] ? <FavoriteIcon fontSize="small" /> : <FavoriteBorderIcon fontSize="small" />}
                      </IconButton>
                    </Box>
                  }
                  secondary={
                    <Box sx={{ mt: 0.5 }}>
                      <Typography variant="caption" color="text.secondary" display="block">
                        {t('pages.dashboard.savedReports.createdAt')}: {report.createdAt}
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 0.5 }}>
                        {report.tags.map((tag, idx) => (
                          <Chip 
                            key={idx} 
                            label={tag} 
                            size="small" 
                            sx={{ 
                              height: 20, 
                              fontSize: '0.65rem',
                              backgroundColor: '#f1f5f9'
                            }} 
                          />
                        ))}
                      </Box>
                    </Box>
                  }
                />
                <ListItemSecondaryAction>
                  <IconButton 
                    edge="end" 
                    onClick={(e) => handleMenuOpen(e, report.id)}
                  >
                    <MoreVertIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
              <Divider variant="inset" component="li" />
            </React.Fragment>
          ))
        )}
      </List>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        id={`report-menu-${selectedReportId}`}
      >
        <MenuItem onClick={handleMenuClose}>
          <DownloadIcon fontSize="small" sx={{ mr: 1 }} />
          {t('pages.dashboard.savedReports.menu.download')}
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <EditIcon fontSize="small" sx={{ mr: 1 }} />
          {t('pages.dashboard.savedReports.menu.edit')}
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <ShareIcon fontSize="small" sx={{ mr: 1 }} />
          {t('pages.dashboard.savedReports.menu.share')}
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleMenuClose} sx={{ color: 'error.main' }}>
          <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
          {t('pages.dashboard.savedReports.menu.delete')}
        </MenuItem>
      </Menu>
    </Paper>
  );
};

export default SavedReports;