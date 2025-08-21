import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Chip,
  Button,
  Typography,
  Popover,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Checkbox,
  TextField,
  InputAdornment,
  Divider,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Stack,
  IconButton,
  Skeleton,
  useTheme,
  alpha
} from '@mui/material';
import {
  Search as SearchIcon,
  KeyboardArrowDown as ArrowDownIcon,
  Close as CloseIcon,
  Person as PersonIcon,
  CalendarToday as CalendarIcon,
  Timeline as ActivityIcon,
  Label as StatusIcon,
  AttachMoney as MoneyIcon,
  Clear as ClearIcon
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

// Types
export interface FilterConfig {
  id: string;
  label: string;
  type: 'owner' | 'date' | 'status' | 'amount';
  icon: React.ReactNode;
  enabled: boolean;
  fieldName?: string; // The actual field name in the data
}

export interface SavedView {
  id: string;
  label: string;
  count?: number;
}

export interface FilterOwner {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface FilterStatus {
  value: string;
  label: string;
  color: string;
}

export interface FilterQuery {
  ownerIds: string[];
  leadStatus: string[];
  createdAt?: {
    preset?: string;
    start?: string;
    end?: string;
  };
  lastActivityAt?: {
    preset?: string;
    start?: string;
    end?: string;
  };
  amount?: {
    min?: number;
    max?: number;
    currency: string;
  };
}

export interface FilterBarProps {
  entity: 'contacts' | 'deals';
  availableFilters: FilterConfig[];
  owners: FilterOwner[];
  statuses: FilterStatus[];
  savedViews: SavedView[];
  currency?: string;
  onQueryChange: (query: FilterQuery) => void;
  onViewChange: (viewId: string) => void;
  sticky?: boolean;
}

const FilterBar: React.FC<FilterBarProps> = ({
  entity,
  availableFilters,
  owners,
  statuses,
  savedViews,
  currency = '₫',
  onQueryChange,
  onViewChange,
  sticky = true
}) => {
  const theme = useTheme();
  const { t } = useTranslation();
  const [activeView, setActiveView] = useState('all');
  const [appliedFilters, setAppliedFilters] = useState<FilterQuery>({
    ownerIds: [],
    leadStatus: [],
  });
  const [openPopover, setOpenPopover] = useState<string | null>(null);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [searchQueries, setSearchQueries] = useState<{ [key: string]: string }>({});
  const [tempFilters, setTempFilters] = useState<any>({});

  // Date presets
  const datePresets = [
    { value: 'today', label: t('components.filterBar.datePresets.today') },
    { value: 'yesterday', label: t('components.filterBar.datePresets.yesterday') },
    { value: 'last7days', label: t('components.filterBar.datePresets.last7days') },
    { value: 'last30days', label: t('components.filterBar.datePresets.last30days') },
    { value: 'thismonth', label: t('components.filterBar.datePresets.thismonth') },
    { value: 'lastmonth', label: t('components.filterBar.datePresets.lastmonth') },
    { value: 'custom', label: t('components.filterBar.datePresets.custom') }
  ];

  // Handle filter chip click
  const handleFilterClick = (filterId: string, event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    setOpenPopover(filterId);
    setSearchQueries(prev => ({ ...prev, [filterId]: '' }));
  };

  // Handle popover close
  const handlePopoverClose = () => {
    setOpenPopover(null);
    setAnchorEl(null);
    setTempFilters({});
  };

  // Handle owner selection
  const handleOwnerSelect = (ownerId: string) => {
    const newOwnerIds = appliedFilters.ownerIds.includes(ownerId)
      ? appliedFilters.ownerIds.filter(id => id !== ownerId)
      : [...appliedFilters.ownerIds, ownerId];
    
    const newQuery = { ...appliedFilters, ownerIds: newOwnerIds };
    setAppliedFilters(newQuery);
    onQueryChange(newQuery);
  };

  // Handle status selection
  const handleStatusSelect = (status: string) => {
    const newStatuses = appliedFilters.leadStatus.includes(status)
      ? appliedFilters.leadStatus.filter(s => s !== status)
      : [...appliedFilters.leadStatus, status];
    
    const newQuery = { ...appliedFilters, leadStatus: newStatuses };
    setAppliedFilters(newQuery);
    onQueryChange(newQuery);
  };

  // Handle date preset selection
  const handleDatePreset = (filterId: string, preset: string) => {
    const filter = availableFilters.find(f => f.id === filterId);
    const fieldName = filter?.fieldName || filterId;
    
    const newQuery = {
      ...appliedFilters,
      [fieldName]: { preset }
    };
    setAppliedFilters(newQuery);
    onQueryChange(newQuery);
    handlePopoverClose();
  };

  // Handle amount filter
  const handleAmountApply = () => {
    const { min, max } = tempFilters;
    if (min !== undefined || max !== undefined) {
      const newQuery = {
        ...appliedFilters,
        amount: { min, max, currency }
      };
      setAppliedFilters(newQuery);
      onQueryChange(newQuery);
    }
    handlePopoverClose();
  };

  // Handle view change
  const handleViewChange = (viewId: string) => {
    setActiveView(viewId);
    onViewChange(viewId);
  };

  // Clear all filters
  const handleClearAll = () => {
    const emptyQuery: FilterQuery = {
      ownerIds: [],
      leadStatus: [],
    };
    setAppliedFilters(emptyQuery);
    onQueryChange(emptyQuery);
  };

  // Remove specific filter token
  const handleRemoveToken = (tokenType: string, value?: string) => {
    let newQuery = { ...appliedFilters };
    
    if (tokenType === 'owner') {
      if (value) {
        newQuery.ownerIds = newQuery.ownerIds.filter(id => id !== value);
      }
    } else if (tokenType === 'status') {
      if (value) {
        newQuery.leadStatus = newQuery.leadStatus.filter(s => s !== value);
      }
    } else if (tokenType === 'amount') {
      delete newQuery.amount;
    } else {
      // Handle date fields dynamically
      delete (newQuery as any)[tokenType];
    }
    
    setAppliedFilters(newQuery);
    onQueryChange(newQuery);
  };

  // Filter owners based on search
  const filteredOwners = owners.filter(owner =>
    owner.name.toLowerCase().includes((searchQueries.owner || '').toLowerCase()) ||
    owner.email.toLowerCase().includes((searchQueries.owner || '').toLowerCase())
  );

  // Get applied filter tokens
  const getAppliedTokens = () => {
    const tokens: Array<{
      type: string;
      value?: string;
      label: string;
      avatar?: string;
      color?: string;
    }> = [];

    // Owner tokens
    appliedFilters.ownerIds.forEach(ownerId => {
      const owner = owners.find(o => o.id === ownerId);
      if (owner) {
        tokens.push({
          type: 'owner',
          value: ownerId,
          label: owner.name,
          avatar: owner.avatar
        });
      }
    });

    // Status tokens
    appliedFilters.leadStatus.forEach(status => {
      const statusConfig = statuses.find(s => s.value === status);
      if (statusConfig) {
        tokens.push({
          type: 'status',
          value: status,
          label: statusConfig.label,
          color: statusConfig.color
        });
      }
    });

    // Date tokens - dynamically check for any date fields
    availableFilters.forEach(filter => {
      if (filter.type === 'date') {
        const fieldName = filter.fieldName || filter.id;
        const dateFilter = (appliedFilters as any)[fieldName];
        if (dateFilter) {
          tokens.push({
            type: fieldName,
            label: `${filter.label}: ${dateFilter.preset || 'Custom range'}`
          });
        }
      }
    });

    // Amount token
    if (appliedFilters.amount) {
      const { min, max } = appliedFilters.amount;
      let label = 'Amount: ';
      if (min && max) {
        label += `${min}${currency} - ${max}${currency}`;
      } else if (min) {
        label += `≥ ${min}${currency}`;
      } else if (max) {
        label += `≤ ${max}${currency}`;
      }
      tokens.push({
        type: 'amount',
        label
      });
    }

    return tokens;
  };

  const appliedTokens = getAppliedTokens();
  const hasActiveFilters = appliedTokens.length > 0;

  return (
    <Box
      sx={{
        position: sticky ? 'sticky' : 'relative',
        top: sticky ? 0 : 'auto',
        zIndex: 10,
        backgroundColor: theme.palette.background.paper,
        borderBottom: `1px solid ${theme.palette.divider}`,
        py: 2,
        px: 1,
        mb: 2
      }}
    >
      {/* Saved Views */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>
          {t('components.filterBar.labels.view')}
        </Typography>
        {savedViews.map(view => (
          <Chip
            key={view.id}
            label={`${view.label}${view.count ? ` (${view.count})` : ''}`}
            variant={activeView === view.id ? 'filled' : 'outlined'}
            color={activeView === view.id ? 'primary' : 'default'}
            size="small"
            onClick={() => handleViewChange(view.id)}
            sx={{
              cursor: 'pointer',
              '&:hover': {
                backgroundColor: activeView === view.id 
                  ? alpha(theme.palette.primary.main, 0.8)
                  : alpha(theme.palette.primary.main, 0.1)
              }
            }}
          />
        ))}
      </Box>

      {/* Filter Chips */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: hasActiveFilters ? 2 : 0 }}>
        {availableFilters.filter(f => f.enabled).map(filter => {
          const fieldName = filter.fieldName || filter.id;
          const isActive = (filter.type === 'owner' && appliedFilters.ownerIds.length > 0) ||
                          (filter.type === 'status' && appliedFilters.leadStatus.length > 0) ||
                          (filter.type === 'date' && (appliedFilters as any)[fieldName]) ||
                          (filter.type === 'amount' && appliedFilters.amount);

          return (
            <Chip
              key={filter.id}
              icon={filter.icon as React.ReactElement}
              label={filter.label}
              variant={isActive ? 'filled' : 'outlined'}
              color={isActive ? 'primary' : 'default'}
              size="small"
              onClick={(e: React.MouseEvent<HTMLElement>) => handleFilterClick(filter.id, e)}
              deleteIcon={<ArrowDownIcon />}
              onDelete={(e: any) => handleFilterClick(filter.id, e)}
              sx={{
                cursor: 'pointer',
                '& .MuiChip-deleteIcon': {
                  fontSize: '16px',
                  ml: 0.5
                },
                '&:hover': {
                  backgroundColor: isActive 
                    ? alpha(theme.palette.primary.main, 0.8)
                    : alpha(theme.palette.primary.main, 0.1)
                }
              }}
            />
          );
        })}

        {hasActiveFilters && (
          <Button
            size="small"
            startIcon={<ClearIcon />}
            onClick={handleClearAll}
            sx={{ ml: 1 }}
          >
            {t('components.filterBar.buttons.clearAll')}
          </Button>
        )}
      </Box>

      {/* Applied Filter Tokens */}
      {hasActiveFilters && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
          <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>
            {t('components.filterBar.labels.applied')}
          </Typography>
          {appliedTokens.map((token, index) => (
            <Chip
              key={`${token.type}-${token.value || index}`}
              {...(token.avatar ? { avatar: <Avatar src={token.avatar} sx={{ width: 20, height: 20 }} /> } : {})}
              label={token.label}
              size="small"
              onDelete={() => handleRemoveToken(token.type, token.value)}
              sx={{
                backgroundColor: token.color ? alpha(token.color, 0.1) : alpha(theme.palette.primary.main, 0.1),
                color: token.color || theme.palette.primary.main,
                border: token.color ? `1px solid ${alpha(token.color, 0.3)}` : `1px solid ${alpha(theme.palette.primary.main, 0.3)}`,
                '& .MuiChip-deleteIcon': {
                  color: token.color || theme.palette.primary.main,
                  '&:hover': {
                    color: theme.palette.error.main
                  }
                }
              }}
            />
          ))}
        </Box>
      )}

      {/* Owner Filter Popover */}
      <Popover
        open={openPopover === 'owner'}
        anchorEl={anchorEl}
        onClose={handlePopoverClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        PaperProps={{
          sx: {
            width: 350,
            maxHeight: 400,
            borderRadius: 2,
            boxShadow: '0 8px 32px rgba(0,0,0,0.12)'
          }
        }}
      >
        <Box sx={{ p: 2 }}>
          {/* Search */}
          <TextField
            fullWidth
            size="small"
            placeholder={t('components.filterBar.placeholders.searchOwners')}
            value={searchQueries.owner || ''}
            onChange={(e) => setSearchQueries((prev: { [key: string]: string }) => ({ ...prev, owner: e.target.value }))}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              )
            }}
            sx={{ mb: 2 }}
          />

          {/* Quick options */}
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              {t('components.filterBar.labels.quickSelect')}
            </Typography>
            <Stack direction="row" spacing={1}>
              <Chip
                label={t('components.filterBar.chips.me')}
                size="small"
                variant="outlined"
                onClick={() => handleOwnerSelect('current-user')}
                sx={{ cursor: 'pointer' }}
              />
              <Chip
                label={t('components.filterBar.chips.unassigned')}
                size="small"
                variant="outlined"
                onClick={() => handleOwnerSelect('unassigned')}
                sx={{ cursor: 'pointer' }}
              />
            </Stack>
          </Box>

          <Divider sx={{ mb: 1 }} />

          {/* Owner list */}
          <List sx={{ maxHeight: 200, overflow: 'auto' }}>
            {filteredOwners.length === 0 ? (
              <ListItem>
                <ListItemText
                  primary={t('components.filterBar.messages.noResults')}
                  primaryTypographyProps={{ color: 'text.secondary', variant: 'body2' }}
                />
              </ListItem>
            ) : (
              filteredOwners.map(owner => (
                <ListItem
                  key={owner.id}
                  dense
                  sx={{ cursor: 'pointer', borderRadius: 1 }}
                  onClick={() => handleOwnerSelect(owner.id)}
                >
                  <Checkbox
                    checked={appliedFilters.ownerIds.includes(owner.id)}
                    size="small"
                    sx={{ mr: 1 }}
                  />
                  <ListItemAvatar>
                    <Avatar src={owner.avatar} sx={{ width: 32, height: 32 }}>
                      {owner.name.charAt(0)}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={owner.name}
                    secondary={owner.email}
                    primaryTypographyProps={{ fontWeight: 'medium', fontSize: '0.875rem' }}
                    secondaryTypographyProps={{ fontSize: '0.75rem' }}
                  />
                </ListItem>
              ))
            )}
          </List>
        </Box>
      </Popover>

      {/* Date Filter Popover */}
      <Popover
        open={availableFilters.some(f => f.type === 'date' && openPopover === f.id)}
        anchorEl={anchorEl}
        onClose={handlePopoverClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        PaperProps={{
          sx: {
            width: 280,
            borderRadius: 2,
            boxShadow: '0 8px 32px rgba(0,0,0,0.12)'
          }
        }}
      >
        <Box sx={{ p: 2 }}>
          <Typography variant="subtitle2" sx={{ mb: 2 }}>
            {availableFilters.find(f => f.id === openPopover)?.label || t('components.filterBar.labels.dateFilter')}
          </Typography>
          
          <List>
            {datePresets.map(preset => (
              <ListItem
                key={preset.value}
                dense
                sx={{ cursor: 'pointer', borderRadius: 1 }}
                onClick={() => handleDatePreset(openPopover!, preset.value)}
              >
                <ListItemText primary={preset.label} />
              </ListItem>
            ))}
          </List>
        </Box>
      </Popover>

      {/* Status Filter Popover */}
      <Popover
        open={availableFilters.some(f => f.type === 'status' && openPopover === f.id)}
        anchorEl={anchorEl}
        onClose={handlePopoverClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        PaperProps={{
          sx: {
            width: 300,
            borderRadius: 2,
            boxShadow: '0 8px 32px rgba(0,0,0,0.12)'
          }
        }}
      >
        <Box sx={{ p: 2 }}>
          <Typography variant="subtitle2" sx={{ mb: 2 }}>
            {availableFilters.find(f => f.id === openPopover)?.label || t('components.filterBar.labels.statusFilter')}
          </Typography>
          
          <List>
            {statuses.map(status => (
              <ListItem
                key={status.value}
                dense
                sx={{ cursor: 'pointer', borderRadius: 1 }}
                onClick={() => handleStatusSelect(status.value)}
              >
                <Checkbox
                  checked={appliedFilters.leadStatus.includes(status.value)}
                  size="small"
                  sx={{ mr: 1 }}
                />
                <Chip
                  label={status.label}
                  size="small"
                  sx={{
                    backgroundColor: alpha(status.color, 0.1),
                    color: status.color,
                    border: `1px solid ${alpha(status.color, 0.3)}`
                  }}
                />
              </ListItem>
            ))}
          </List>
        </Box>
      </Popover>

      {/* Amount Filter Popover */}
      <Popover
        open={openPopover === 'amount'}
        anchorEl={anchorEl}
        onClose={handlePopoverClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        PaperProps={{
          sx: {
            width: 320,
            borderRadius: 2,
            boxShadow: '0 8px 32px rgba(0,0,0,0.12)'
          }
        }}
      >
        <Box sx={{ p: 2 }}>
          <Typography variant="subtitle2" sx={{ mb: 2 }}>
            {t('components.filterBar.labels.amountRange')}
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <TextField
              label={t('components.filterBar.range.min')}
              type="number"
              size="small"
              value={tempFilters.min || ''}
              onChange={(e) => setTempFilters((prev: any) => ({ ...prev, min: e.target.value ? Number(e.target.value) : undefined }))}
              InputProps={{
                endAdornment: <InputAdornment position="end">{currency}</InputAdornment>
              }}
            />
            <TextField
              label={t('components.filterBar.range.max')}
              type="number"
              size="small"
              value={tempFilters.max || ''}
              onChange={(e) => setTempFilters((prev: any) => ({ ...prev, max: e.target.value ? Number(e.target.value) : undefined }))}
              InputProps={{
                endAdornment: <InputAdornment position="end">{currency}</InputAdornment>
              }}
            />
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
            <Button size="small" onClick={handlePopoverClose}>
              {t('components.filterBar.buttons.cancel')}
            </Button>
            <Button 
              size="small" 
              variant="contained" 
              onClick={handleAmountApply}
              disabled={!tempFilters.min && !tempFilters.max}
            >
              {t('components.filterBar.buttons.apply')}
            </Button>
          </Box>
        </Box>
      </Popover>
    </Box>
  );
};

export default FilterBar;
