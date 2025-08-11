import React from 'react';
import { Box, TextField, MenuItem, Button } from '@mui/material';
import { TemplateFilterValues } from './types';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import SmartToyIcon from '@mui/icons-material/SmartToy';

interface TemplateFiltersProps {
  filters: TemplateFilterValues;
  onFilterChange: (filters: TemplateFilterValues) => void;
  onUploadClick: () => void;
  onCreateWithAIClick?: () => void;
}

const TemplateFilters: React.FC<TemplateFiltersProps> = ({
  filters,
  onFilterChange,
  onUploadClick,
  onCreateWithAIClick = () => console.log('Create with AI clicked'),
}) => {
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({ ...filters, search: e.target.value });
  };

  const handleTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({ ...filters, type: e.target.value as any });
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({ ...filters, status: e.target.value as any });
  };

  return (
    <Box sx={{ mb: 3 }}>
      <Box sx={{ 
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', md: '1fr 1fr 1fr' },
        gap: 2,
        alignItems: 'center',
        mb: 2
      }}>
        <Box>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Tìm kiếm template..."
            value={filters.search}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: <SearchIcon sx={{ color: 'text.secondary', mr: 1 }} />,
            }}
          />
        </Box>
        <Box>
          <TextField
            select
            fullWidth
            label="Loại template"
            value={filters.type}
            onChange={handleTypeChange}
            variant="outlined"
          >
            <MenuItem value="all">Tất cả</MenuItem>
            <MenuItem value="internal">Nội bộ</MenuItem>
            <MenuItem value="customer">Khách hàng</MenuItem>
            <MenuItem value="AI">AI</MenuItem>
          </TextField>
        </Box>
        <Box>
          <TextField
            select
            fullWidth
            label="Trạng thái"
            value={filters.status}
            onChange={handleStatusChange}
            variant="outlined"
          >
            <MenuItem value="all">Tất cả</MenuItem>
            <MenuItem value="active">Đang hoạt động</MenuItem>
            <MenuItem value="inactive">Ngừng hoạt động</MenuItem>
          </TextField>
        </Box>
      </Box>
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'flex-end',
        gap: 2,
        mt: { xs: 2, md: 0 }
      }}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={onUploadClick}
          sx={{
            width: { xs: '100%', md: 'auto' },
            maxWidth: '250px'
          }}
        >
          Tải lên Template
        </Button>
        <Button
          variant="contained"
          color="primary"
          startIcon={<SmartToyIcon />}
          onClick={onCreateWithAIClick}
          sx={{
            width: { xs: '100%', md: 'auto' },
            maxWidth: '250px'
          }}
        >
          Tạo hợp đồng bằng AI
        </Button>
      </Box>
    </Box>
  );
};

export default TemplateFilters;
