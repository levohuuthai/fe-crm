import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
  Avatar,
  List,
  ListItem,
  ListItemButton,
  ListItemAvatar,
  ListItemText,
  InputAdornment,
  CircularProgress,
  Alert,
  Chip,
  useTheme,
  alpha
} from '@mui/material';
import {
  Search as SearchIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Business as BusinessIcon,
  Work as WorkIcon,
  AttachMoney as MoneyIcon,
  Event as EventIcon,
  Label as LabelIcon
} from '@mui/icons-material';

export interface SmartTableColumn {
  id: string;
  label: string;
  type: 'text' | 'email' | 'phone' | 'number' | 'currency' | 'date' | 'select' | 'userSelect' | 'actions';
  editable?: boolean;
  sortable?: boolean;
  width?: number;
  minWidth?: number;
  align?: 'left' | 'center' | 'right';
  format?: (value: any) => string;
  validate?: (value: any) => string | null;
  required?: boolean;
  options?: Array<{
    value: any;
    label: string;
    color?: string;
  }>;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface EditCellModalProps {
  open: boolean;
  column: SmartTableColumn;
  value: any;
  rowData: any;
  users?: User[];
  onSave: (value: any) => Promise<boolean>;
  onClose: () => void;
}

const EditCellModal: React.FC<EditCellModalProps> = ({
  open,
  column,
  value: initialValue,
  rowData,
  users = [],
  onSave,
  onClose
}) => {
  const theme = useTheme();
  const [value, setValue] = useState(initialValue);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [userSearchQuery, setUserSearchQuery] = useState('');

  // Reset value when modal opens
  useEffect(() => {
    if (open) {
      setValue(initialValue);
      setError(null);
      setUserSearchQuery('');
    }
  }, [open, initialValue]);

  // Validate value
  const validateValue = (val: any): string | null => {
    if (column.required && (!val || val.toString().trim() === '')) {
      return `${column.label} là bắt buộc`;
    }
    
    if (column.validate) {
      return column.validate(val);
    }
    
    return null;
  };

  // Handle save
  const handleSave = async () => {
    const validationError = validateValue(value);
    if (validationError) {
      setError(validationError);
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const success = await onSave(value);
      if (success) {
        onClose();
      } else {
        setError('Không thể lưu thay đổi. Vui lòng thử lại.');
      }
    } catch (err) {
      setError('Có lỗi xảy ra khi lưu dữ liệu.');
    } finally {
      setSaving(false);
    }
  };

  // Handle cancel
  const handleCancel = () => {
    setValue(initialValue);
    setError(null);
    onClose();
  };

  // Filter users for userSelect
  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(userSearchQuery.toLowerCase())
  );

  // Get field icon
  const getFieldIcon = () => {
    switch (column.type) {
      case 'email': return <EmailIcon fontSize="small" />;
      case 'phone': return <PhoneIcon fontSize="small" />;
      case 'currency': return <MoneyIcon fontSize="small" />;
      case 'date': return <EventIcon fontSize="small" />;
      case 'userSelect': return <PersonIcon fontSize="small" />;
      case 'select': return <LabelIcon fontSize="small" />;
      default: return <BusinessIcon fontSize="small" />;
    }
  };

  // Render input field based on column type
  const renderInputField = () => {
    switch (column.type) {
      case 'select':
        return (
          <FormControl fullWidth variant="standard">
            <InputLabel>{column.label}</InputLabel>
            <Select
              value={value || ''}
              onChange={(e) => setValue(e.target.value)}
            >
              {column.options?.map(option => (
                <MenuItem key={option.value} value={option.value}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {option.color && (
                      <Box
                        sx={{
                          width: 12,
                          height: 12,
                          borderRadius: '50%',
                          backgroundColor: option.color
                        }}
                      />
                    )}
                    {option.label}
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        );

      case 'userSelect':
        return (
          <Box>
            <TextField
              fullWidth
              label="Tìm kiếm người dùng"
              value={userSearchQuery}
              onChange={(e) => setUserSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" />
                  </InputAdornment>
                )
              }}
              sx={{ mb: 2 }}
            />
            
            <Box sx={{ maxHeight: 200, overflow: 'auto' }}>
              <List dense>
                {filteredUsers.map(user => (
                  <ListItem key={user.id} sx={{ p: 0, mb: 0.5 }}>
                    <ListItemButton
                      selected={value === user.id}
                      onClick={() => setValue(user.id)}
                      sx={{
                        borderRadius: 1,
                        '&.Mui-selected': {
                          backgroundColor: alpha(theme.palette.primary.main, 0.1),
                          '&:hover': {
                            backgroundColor: alpha(theme.palette.primary.main, 0.2),
                          }
                        }
                      }}
                    >
                    <ListItemAvatar>
                      <Avatar sx={{ width: 32, height: 32 }} src={user.avatar}>
                        {user.name.charAt(0)}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={user.name}
                      secondary={user.email}
                      primaryTypographyProps={{ variant: 'body2' }}
                      secondaryTypographyProps={{ variant: 'caption' }}
                    />
                    </ListItemButton>
                  </ListItem>
                ))}
                
                {filteredUsers.length === 0 && (
                  <Typography variant="body2" color="text.secondary" sx={{ p: 2, textAlign: 'center' }}>
                    Không tìm thấy người dùng nào
                  </Typography>
                )}
              </List>
            </Box>
          </Box>
        );

      case 'date':
        return (
          <TextField
            fullWidth
            type="date"
            label={column.label}
            value={value || ''}
            onChange={(e) => setValue(e.target.value)}
            InputLabelProps={{ shrink: true }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  {getFieldIcon()}
                </InputAdornment>
              )
            }}
          />
        );

      case 'number':
      case 'currency':
        return (
          <TextField
            fullWidth
            type="number"
            label={column.label}
            value={value || ''}
            onChange={(e) => setValue(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  {getFieldIcon()}
                </InputAdornment>
              ),
              endAdornment: column.type === 'currency' ? (
                <InputAdornment position="end">₫</InputAdornment>
              ) : undefined
            }}
          />
        );

      case 'email':
        return (
          <TextField
            fullWidth
            type="email"
            label={column.label}
            value={value || ''}
            onChange={(e) => setValue(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <EmailIcon fontSize="small" />
                </InputAdornment>
              )
            }}
          />
        );

      case 'phone':
        return (
          <TextField
            fullWidth
            type="tel"
            label={column.label}
            value={value || ''}
            onChange={(e) => setValue(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PhoneIcon fontSize="small" />
                </InputAdornment>
              )
            }}
          />
        );

      default:
        return (
          <TextField
            fullWidth
            label={column.label}
            value={value || ''}
            onChange={(e) => setValue(e.target.value)}
            multiline={column.type === 'text' && column.id === 'description'}
            rows={column.id === 'description' ? 3 : 1}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  {getFieldIcon()}
                </InputAdornment>
              )
            }}
          />
        );
    }
  };

  // Get current display value for selected option/user
  const getCurrentDisplayValue = () => {
    if (column.type === 'select' && column.options) {
      const option = column.options.find(opt => opt.value === value);
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
      ) : null;
    }
    
    if (column.type === 'userSelect' && users) {
      const user = users.find(u => u.id === value);
      return user ? (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Avatar sx={{ width: 24, height: 24 }} src={user.avatar}>
            {user.name.charAt(0)}
          </Avatar>
          <Typography variant="body2">{user.name}</Typography>
        </Box>
      ) : null;
    }
    
    return null;
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2
        }
      }}
    >
      <DialogTitle sx={{ pb: 1, pt: 2 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
          Chỉnh sửa cho {rowData.name || rowData.id}
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ pt: 3, pb: 2, px: 3 }}>
        {/* Input field */}
        <Box sx={{ mt: 1 }}>
          {renderInputField()}
        </Box>

        {/* Error message */}
        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}

        {/* Help text for validation */}
        {column.type === 'email' && (
          <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
            Ví dụ: example@company.com
          </Typography>
        )}
        
        {column.type === 'phone' && (
          <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
            Ví dụ: 0901234567 (10-11 số)
          </Typography>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 2, pb: 2, pt: 1 }}>
        <Button onClick={handleCancel} size="small">
          Hủy
        </Button>
        <Button 
          onClick={handleSave}
          variant="contained"
          size="small"
          disabled={saving}
        >
          {saving ? 'Đang lưu...' : 'Lưu'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditCellModal;
