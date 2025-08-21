import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Checkbox,
  IconButton,
  Menu,
  MenuItem,
  TextField,
  Button,
  Chip,
  Avatar,
  Typography,
  Tooltip,
  CircularProgress,
  Alert,
  Skeleton,
  FormControl,
  Select,
  Popover,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  InputAdornment,
  InputLabel,
  Paper,
  Divider,
  Pagination,
  useTheme,
  alpha
} from '@mui/material';
import EditCellModal from '../EditCellModal';
import { useTranslation } from 'react-i18next';
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  Refresh as RefreshIcon,
  MoreVert as MoreVertIcon,
  ArrowUpward as ArrowUpwardIcon,
  ArrowDownward as ArrowDownwardIcon,
  PushPin as PushPinIcon,
  VisibilityOff as VisibilityOffIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  Close as CloseIcon,
  Visibility as PreviewIcon,
  Check as CheckIcon,
  Error as ErrorIcon
} from '@mui/icons-material';

// Types
export interface SmartTableColumn {
  id: string;
  label: string;
  type: 'text' | 'email' | 'phone' | 'number' | 'currency' | 'date' | 'select' | 'userSelect' | 'actions';
  width?: number;
  minWidth?: number;
  sortable?: boolean;
  editable?: boolean;
  required?: boolean;
  options?: { value: string; label: string; color?: string }[]; // for select type
  format?: (value: any) => string;
  validate?: (value: any) => string | null;
  frozen?: 'left' | 'right' | null;
  hidden?: boolean;
}

export interface SmartTableRow {
  id: string;
  [key: string]: any;
}

export interface SmartTableProps {
  columns: SmartTableColumn[];
  data: SmartTableRow[];
  loading?: boolean;
  error?: string;
  searchable?: boolean;
  filterable?: boolean;
  selectable?: boolean;
  pagination?: boolean;
  rowsPerPageOptions?: number[];
  defaultRowsPerPage?: number;
  emptyMessage?: string;
  onRowDoubleClick?: (row: SmartTableRow) => void;
  onCellEdit?: (rowId: string, columnId: string, value: any) => Promise<boolean>;
  onRowSelect?: (selectedRows: string[]) => void;
  onBulkAction?: (action: string, selectedRows: string[]) => void;
  onPreviewContact?: (contact: SmartTableRow) => void;
  users?: { id: string; name: string; email: string; avatar?: string }[]; // for userSelect
  zebra?: boolean;
}

const SmartTable: React.FC<SmartTableProps> = ({
  columns,
  data,
  loading = false,
  error,
  searchable = true,
  filterable = true,
  selectable = true,
  pagination = true,
  rowsPerPageOptions = [10, 20, 50],
  defaultRowsPerPage = 10,
  emptyMessage,
  onRowDoubleClick,
  onCellEdit,
  onRowSelect,
  onBulkAction,
  onPreviewContact,
  users = [],
  zebra = true
}) => {
  const theme = useTheme();
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' | null }>({ key: '', direction: null });
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editModalData, setEditModalData] = useState<{ rowId: string; columnId: string; value: any; rowData: SmartTableRow } | null>(null);
  const [columnMenuAnchor, setColumnMenuAnchor] = useState<{ element: HTMLElement; columnId: string } | null>(null);
  const [hoveredCell, setHoveredCell] = useState<{ rowId: string; columnId: string } | null>(null);
  const [userSelectAnchor, setUserSelectAnchor] = useState<{ element: HTMLElement; rowId: string; columnId: string } | null>(null);
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(defaultRowsPerPage);
  const [visibleColumns, setVisibleColumns] = useState<string[]>(columns.map(col => col.id));
  const [frozenColumns, setFrozenColumns] = useState<{ [key: string]: 'left' | 'right' | null }>({});
  
  const editInputRef = useRef<HTMLInputElement>(null);

  // Filter and sort data
  const filteredAndSortedData = useMemo(() => {
    let filtered = data;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(row =>
        Object.values(row).some(value =>
          String(value).toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }

    // Sort
    if (sortConfig.key && sortConfig.direction) {
      filtered = [...filtered].sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];
        
        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    return filtered;
  }, [data, searchQuery, sortConfig]);

  // Pagination
  const paginatedData = useMemo(() => {
    if (!pagination) return filteredAndSortedData;
    const startIndex = (page - 1) * rowsPerPage;
    return filteredAndSortedData.slice(startIndex, startIndex + rowsPerPage);
  }, [filteredAndSortedData, page, rowsPerPage, pagination]);

  const totalPages = Math.ceil(filteredAndSortedData.length / rowsPerPage);

  // Handle sort
  const handleSort = (columnId: string) => {
    const column = columns.find(col => col.id === columnId);
    if (!column?.sortable) return;

    setSortConfig(prev => {
      if (prev.key !== columnId) {
        return { key: columnId, direction: 'asc' };
      }
      if (prev.direction === 'asc') {
        return { key: columnId, direction: 'desc' };
      }
      if (prev.direction === 'desc') {
        return { key: '', direction: null };
      }
      return { key: columnId, direction: 'asc' };
    });
  };

  // Handle row selection
  const handleRowSelect = (rowId: string) => {
    const newSelected = selectedRows.includes(rowId)
      ? selectedRows.filter(id => id !== rowId)
      : [...selectedRows, rowId];
    
    setSelectedRows(newSelected);
    onRowSelect?.(newSelected);
  };

  const handleSelectAll = () => {
    const allRowIds = paginatedData.map(row => row.id);
    const newSelected = selectedRows.length === allRowIds.length ? [] : allRowIds;
    setSelectedRows(newSelected);
    onRowSelect?.(newSelected);
  };

  // Handle cell click for editing
  const handleCellClick = (row: SmartTableRow, column: SmartTableColumn) => {
    if (!column.editable || column.type === 'actions') return;

    setEditModalData({
      rowId: row.id,
      columnId: column.id,
      value: row[column.id],
      rowData: row
    });
    setEditModalOpen(true);
  };

  // Handle modal save
  const handleModalSave = async (value: any): Promise<boolean> => {
    if (!editModalData || !onCellEdit) return false;

    try {
      const success = await onCellEdit(editModalData.rowId, editModalData.columnId, value);
      return success;
    } catch (error) {
      console.error('Save error:', error);
      return false;
    }
  };

  // Handle modal close
  const handleModalClose = () => {
    setEditModalOpen(false);
    setEditModalData(null);
  };

  // Handle user selection
  const handleUserSelect = (userId: string) => {
    if (!userSelectAnchor || !onCellEdit) return;

    const user = users.find(u => u.id === userId);
    if (user) {
      onCellEdit(userSelectAnchor.rowId, userSelectAnchor.columnId, userId);
    }
    
    setUserSelectAnchor(null);
    setUserSearchQuery('');
  };

  // Filter users for popover
  const filteredUsers = useMemo(() => {
    if (!userSearchQuery) return users;
    return users.filter(user =>
      user.name.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(userSearchQuery.toLowerCase())
    );
  }, [users, userSearchQuery]);

  // Handle column menu
  const handleColumnMenu = (event: React.MouseEvent<HTMLElement>, columnId: string) => {
    event.stopPropagation();
    setColumnMenuAnchor({ element: event.currentTarget, columnId });
  };

  const handleColumnMenuAction = (action: string, columnId: string) => {
    switch (action) {
      case 'sort-asc':
        setSortConfig({ key: columnId, direction: 'asc' });
        break;
      case 'sort-desc':
        setSortConfig({ key: columnId, direction: 'desc' });
        break;
      case 'hide':
        setVisibleColumns(prev => prev.filter(id => id !== columnId));
        break;
    }
    setColumnMenuAnchor(null);
  };

  // Render cell content
  const renderCellContent = (row: SmartTableRow, column: SmartTableColumn) => {
    const value = row[column.id];
    const isHovered = hoveredCell?.rowId === row.id && hoveredCell?.columnId === column.id;

    // Special handling for Name column with preview button
    if (column.id === 'name' && onPreviewContact) {
      return (
        <Box 
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            width: '100%'
          }}
          onMouseEnter={() => setHoveredCell({ rowId: row.id, columnId: column.id })}
          onMouseLeave={() => setHoveredCell(null)}
        >
          <Typography variant="body2" sx={{ flex: 1, mr: 1 }}>
            {value}
          </Typography>
          {isHovered && (
            <Tooltip title={t('components.smartTable.tooltips.previewContact')}>
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  onPreviewContact(row);
                }}
                sx={{
                  opacity: 0.7,
                  '&:hover': {
                    opacity: 1,
                    backgroundColor: alpha(theme.palette.primary.main, 0.1)
                  }
                }}
              >
                <PreviewIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      );
    }

    switch (column.type) {
      case 'select':
        const option = column.options?.find(opt => opt.value === value);
        return option ? (
          <Chip
            label={option.label}
            size="small"
            sx={{
              backgroundColor: option.color ? alpha(option.color, 0.1) : undefined,
              color: option.color,
              border: option.color ? `1px solid ${alpha(option.color, 0.3)}` : undefined
            }}
          />
        ) : value;
      
      case 'userSelect':
        const user = users.find(u => u.id === value);
        return user ? (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Avatar sx={{ width: 24, height: 24 }} src={user.avatar}>
              {user.name.charAt(0)}
            </Avatar>
            <Typography variant="body2">{user.name}</Typography>
          </Box>
        ) : value;
      
      case 'currency':
        return column.format ? column.format(value) : `${value}₫`;
      
      case 'actions':
        return (
          <Box sx={{ display: 'flex', gap: 0.5 }}>
            <IconButton size="small">
              <EditIcon fontSize="small" />
            </IconButton>
            <IconButton size="small" color="error">
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Box>
        );
      
      default:
        return column.format ? column.format(value) : value;
    }
  };

  // Render edit input
  const renderEditInput = (column: SmartTableColumn, value: any, onChange: (value: any) => void) => {
    switch (column.type) {
      case 'select':
        return (
          <FormControl size="small" fullWidth>
            <Select
              value={value}
              onChange={(e) => onChange(e.target.value)}
              autoFocus
            >
              {column.options?.map(option => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        );
      
      case 'date':
        return (
          <TextField
            ref={editInputRef}
            type="date"
            size="small"
            fullWidth
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') handleModalSave(value);
              if (e.key === 'Escape') handleModalClose();
            }}
          />
        );
      
      case 'number':
      case 'currency':
        return (
          <TextField
            ref={editInputRef}
            type="number"
            size="small"
            fullWidth
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') handleModalSave(value);
              if (e.key === 'Escape') handleModalClose();
            }}
          />
        );
      
      default:
        return (
          <TextField
            ref={editInputRef}
            size="small"
            fullWidth
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') handleModalSave(value);
              if (e.key === 'Escape') handleModalClose();
            }}
          />
        );
    }
  };

  if (loading) {
    return (
      <Box>
        {/* Toolbar skeleton */}
        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <Skeleton variant="rectangular" width={200} height={40} />
          <Skeleton variant="rectangular" width={100} height={40} />
          <Skeleton variant="rectangular" width={100} height={40} />
        </Box>
        
        {/* Table skeleton */}
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                {columns.map(column => (
                  <TableCell key={column.id}>
                    <Skeleton variant="text" />
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {Array.from({ length: 5 }).map((_, index) => (
                <TableRow key={index}>
                  {columns.map(column => (
                    <TableCell key={column.id}>
                      <Skeleton variant="text" />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      width: '100%', 
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden'
    }}>
      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Toolbar */}
      <Box sx={{ 
        display: 'flex', 
        gap: 2, 
        mb: 2,
        flexWrap: 'wrap',
        alignItems: 'center',
        flexShrink: 0,
        px: 1
      }}>
        {searchable && (
          <TextField
            placeholder={t('components.smartTable.placeholders.search')}
            size="small"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              )
            }}
            sx={{ minWidth: 200 }}
          />
        )}
        
        {filterable && (
          <Button
            variant="outlined"
            startIcon={<FilterIcon />}
            size="small"
          >
            {t('components.smartTable.buttons.filters')}
          </Button>
        )}

        <Box sx={{ 
          ml: 'auto', 
          display: 'flex', 
          alignItems: 'center', 
          gap: 2,
          flexShrink: 0
        }}>
          <Typography variant="body2" color="text.secondary">
            {t('components.smartTable.labels.rows', { count: filteredAndSortedData.length })}
          </Typography>
        </Box>
      </Box>

      {/* Bulk Actions Bar */}
      {selectedRows.length > 0 && (
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          p: 2,
          mb: 2,
          backgroundColor: alpha(theme.palette.primary.main, 0.1),
          borderRadius: 1
        }}>
          <Typography variant="body2">
            {t('components.smartTable.labels.selected', { count: selectedRows.length })}
          </Typography>
          <Button size="small" onClick={() => onBulkAction?.('delete', selectedRows)}>
            {t('components.smartTable.actions.delete')}
          </Button>
          <Button size="small" onClick={() => onBulkAction?.('assign', selectedRows)}>
            {t('components.smartTable.actions.assignOwner')}
          </Button>
        </Box>
      )}

      {/* Table Container */}
      <Box sx={{
        flex: 1,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <TableContainer 
          component={Paper} 
          sx={{ 
            flex: 1,
            width: '100%',
            overflow: 'auto',
            '&::-webkit-scrollbar': {
              height: '8px',
              width: '8px',
            },
            '&::-webkit-scrollbar-track': {
              backgroundColor: alpha(theme.palette.grey[300], 0.2),
              borderRadius: '4px',
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: alpha(theme.palette.primary.main, 0.4),
              borderRadius: '4px',
              border: '2px solid transparent',
              backgroundClip: 'padding-box',
              '&:hover': {
                backgroundColor: alpha(theme.palette.primary.main, 0.6),
              }
            },
            '&::-webkit-scrollbar-corner': {
              backgroundColor: 'transparent',
            }
          }}
        >
        <Table 
          stickyHeader 
          sx={{ 
            minWidth: 1650, 
            width: '100%',
            tableLayout: 'fixed'
          }}
        >
          <TableHead>
            <TableRow>
              {selectable && (
                <TableCell 
                  padding="checkbox"
                  sx={{
                    minWidth: 50
                  }}
                >
                  <Checkbox
                    indeterminate={selectedRows.length > 0 && selectedRows.length < paginatedData.length}
                    checked={paginatedData.length > 0 && selectedRows.length === paginatedData.length}
                    onChange={handleSelectAll}
                  />
                </TableCell>
              )}
              
              {columns
                .filter(column => visibleColumns.includes(column.id))
                .map(column => (
                  <TableCell
                    key={column.id}
                    sx={{
                      minWidth: column.width || column.minWidth || 150,
                      cursor: column.sortable ? 'pointer' : 'default',
                      userSelect: 'none',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}
                    onClick={() => handleSort(column.id)}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="subtitle2" fontWeight="bold">
                        {column.label}
                      </Typography>
                      
                      {column.sortable && sortConfig.key === column.id && (
                        sortConfig.direction === 'asc' ? (
                          <ArrowUpwardIcon fontSize="small" />
                        ) : (
                          <ArrowDownwardIcon fontSize="small" />
                        )
                      )}
                      
                      <IconButton
                        size="small"
                        onClick={(e) => handleColumnMenu(e, column.id)}
                        sx={{ ml: 'auto' }}
                      >
                        <MoreVertIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </TableCell>
                ))}
            </TableRow>
          </TableHead>
          
          <TableBody>
            {paginatedData.length === 0 ? (
              <TableRow>
                <TableCell 
                  colSpan={columns.length + (selectable ? 1 : 0)} 
                  sx={{ textAlign: 'center', py: 8 }}
                >
                  <Typography variant="body1" color="text.secondary">
                    {emptyMessage || t('components.smartTable.empty')}
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.map((row, index) => (
                <TableRow
                  key={row.id}
                  hover
                  selected={selectedRows.includes(row.id)}
                  onDoubleClick={() => onRowDoubleClick?.(row)}
                  sx={{
                    cursor: onRowDoubleClick ? 'pointer' : 'default',
                    backgroundColor: zebra && index % 2 === 1 ? alpha(theme.palette.primary.main, 0.04) : 'transparent'
                  }}
                >
                  {selectable && (
                    <TableCell 
                      padding="checkbox"
                      sx={{
                        minWidth: 50
                      }}
                    >
                      <Checkbox
                        checked={selectedRows.includes(row.id)}
                        onChange={() => handleRowSelect(row.id)}
                      />
                    </TableCell>
                  )}
                  
                  {columns
                    .filter(column => visibleColumns.includes(column.id))
                    .map(column => (
                      <TableCell
                        key={column.id}
                        data-cell={`${row.id}-${column.id}`}
                        onClick={() => handleCellClick(row, column)}
                        sx={{
                          minWidth: column.width || column.minWidth || 150,
                          cursor: column.editable ? 'pointer' : 'default',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          '&:hover': column.editable ? {
                            backgroundColor: alpha(theme.palette.primary.main, 0.04)
                          } : {}
                        }}
                      >
                        {renderCellContent(row, column)}
                      </TableCell>
                    ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        </TableContainer>
      </Box>

      {/* Pagination */}
      {pagination && totalPages > 1 && (
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center',
          mt: 2,
          py: 2,
          px: 1,
          flexShrink: 0,
          borderTop: `1px solid ${theme.palette.divider}`
        }}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={(_: React.ChangeEvent<unknown>, newPage: number) => setPage(newPage)}
            color="primary"
            size="medium"
            showFirstButton
            showLastButton
          />
        </Box>
      )}

      {/* Column Menu */}
      <Menu
        anchorEl={columnMenuAnchor?.element}
        open={Boolean(columnMenuAnchor)}
        onClose={() => setColumnMenuAnchor(null)}
      >
        <MenuItem onClick={() => handleColumnMenuAction('sort-asc', columnMenuAnchor!.columnId)}>
          <ArrowUpwardIcon fontSize="small" sx={{ mr: 1 }} />
          {t('components.smartTable.columnMenu.sortAsc')}
        </MenuItem>
        <MenuItem onClick={() => handleColumnMenuAction('sort-desc', columnMenuAnchor!.columnId)}>
          <ArrowDownwardIcon fontSize="small" sx={{ mr: 1 }} />
          {t('components.smartTable.columnMenu.sortDesc')}
        </MenuItem>
        <Divider />
        <MenuItem onClick={() => handleColumnMenuAction('hide', columnMenuAnchor!.columnId)}>
          <VisibilityOffIcon fontSize="small" sx={{ mr: 1 }} />
          {t('components.smartTable.columnMenu.hideColumn')}
        </MenuItem>
      </Menu>

      {/* User Select Popover */}
      <Popover
        open={Boolean(userSelectAnchor)}
        anchorEl={userSelectAnchor?.element}
        onClose={() => {
          setUserSelectAnchor(null);
          setUserSearchQuery('');
        }}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        <Box sx={{ width: 300, maxHeight: 400 }}>
          <Box sx={{ p: 2, borderBottom: `1px solid ${theme.palette.divider}` }}>
            <TextField
              fullWidth
              size="small"
              placeholder={t('components.smartTable.placeholders.searchUsers')}
              value={userSearchQuery}
              onChange={(e) => setUserSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                )
              }}
            />
          </Box>
          
          <List sx={{ maxHeight: 300, overflow: 'auto' }}>
            {filteredUsers.map(user => (
              <ListItem
                key={user.id}
                component="div"
                sx={{ cursor: 'pointer' }}
                onClick={() => handleUserSelect(user.id)}
              >
                <ListItemAvatar>
                  <Avatar src={user.avatar} sx={{ width: 32, height: 32 }}>
                    {user.name.charAt(0)}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={user.name}
                  secondary={user.email}
                  primaryTypographyProps={{ fontWeight: 'bold' }}
                />
              </ListItem>
            ))}
          </List>
        </Box>
      </Popover>

      {/* Edit Cell Modal */}
      {editModalData && (
        <EditCellModal
          open={editModalOpen}
          column={columns.find(col => col.id === editModalData.columnId && col.type !== 'actions')!}
          value={editModalData.value}
          rowData={editModalData.rowData}
          users={users}
          onSave={handleModalSave}
          onClose={handleModalClose}
        />
      )}
    </Box>
  );
};

export default SmartTable;
