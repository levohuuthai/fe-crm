import React from 'react';
import { Box, TextField, MenuItem, Button } from '@mui/material';
import { TemplateFilterValues } from './types';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation();
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
            placeholder={t('pages.contracts.templateList.filters.searchPlaceholder')}
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
            label={t('pages.contracts.templateList.filters.typeLabel')}
            value={filters.type}
            onChange={handleTypeChange}
            variant="outlined"
          >
            <MenuItem value="all">{t('pages.contracts.templateList.filters.typeOptions.all')}</MenuItem>
            <MenuItem value="internal">{t('pages.contracts.templateList.table.chips.type.internal')}</MenuItem>
            <MenuItem value="customer">{t('pages.contracts.templateList.table.chips.type.customer')}</MenuItem>
            <MenuItem value="AI">AI</MenuItem>
          </TextField>
        </Box>
        <Box>
          <TextField
            select
            fullWidth
            label={t('pages.contracts.templateList.filters.statusLabel')}
            value={filters.status}
            onChange={handleStatusChange}
            variant="outlined"
          >
            <MenuItem value="all">{t('pages.contracts.templateList.filters.statusOptions.all')}</MenuItem>
            <MenuItem value="active">{t('pages.contracts.templateList.table.chips.status.active')}</MenuItem>
            <MenuItem value="inactive">{t('pages.contracts.templateList.table.chips.status.inactive')}</MenuItem>
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
          {t('pages.contracts.templateList.filters.buttons.uploadTemplate')}
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
          {t('pages.contracts.templateList.filters.buttons.createWithAI')}
        </Button>
      </Box>
    </Box>
  );
};

export default TemplateFilters;
