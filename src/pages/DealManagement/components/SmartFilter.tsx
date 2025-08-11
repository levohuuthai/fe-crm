import React, { useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography,
  IconButton,
  Chip,
  Paper,
  InputAdornment
} from '@mui/material';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import SendIcon from '@mui/icons-material/Send';
import CloseIcon from '@mui/icons-material/Close';

interface SmartFilterProps {
  open: boolean;
  onClose: () => void;
  onApplyFilter: (query: string) => void;
  currentFilter?: string;
}

const exampleQueries = [
  'Các deal chưa chốt trong tháng 7 của Phạm Thị D',
  'Deal giá trị trên 100 triệu chưa gửi báo giá',
  'Hiển thị deal đang ở giai đoạn đàm phán',
  'Tìm deal của khách hàng ABC'
];

const SmartFilter: React.FC<SmartFilterProps> = ({
  open,
  onClose,
  onApplyFilter,
  currentFilter
}) => {
  const [query, setQuery] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleApply = () => {
    if (query.trim()) {
      setIsProcessing(true);
      // Giả lập xử lý trong 500ms
      setTimeout(() => {
        onApplyFilter(query);
        setIsProcessing(false);
        onClose();
      }, 500);
    }
  };

  const handleExampleClick = (example: string) => {
    setQuery(example);
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          minHeight: '400px',
          display: 'flex',
          flexDirection: 'column'
        }
      }}
    >
      <DialogTitle sx={{ 
        display: 'flex', 
        alignItems: 'center',
        borderBottom: '1px solid',
        borderColor: 'divider',
        padding: 2
      }}>
        <SmartToyIcon color="primary" sx={{ mr: 1 }} />
        <Typography variant="h6" component="span">
          Bộ lọc thông minh
        </Typography>
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      
      <DialogContent sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Nhập yêu cầu lọc của bạn bằng ngôn ngữ tự nhiên
          </Typography>
          
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Ví dụ: Các deal chưa chốt trong tháng 7"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleApply()}
            disabled={isProcessing}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={handleApply}
                    disabled={!query.trim() || isProcessing}
                    color="primary"
                  >
                    <SendIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Box>

        <Box sx={{ mt: 2, mb: 2 }}>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            Gợi ý tìm kiếm:
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {exampleQueries.map((example, index) => (
              <Chip
                key={index}
                label={example}
                onClick={() => handleExampleClick(example)}
                size="small"
                variant="outlined"
                sx={{ cursor: 'pointer' }}
              />
            ))}
          </Box>
        </Box>

        {currentFilter && (
          <Paper 
            variant="outlined" 
            sx={{ 
              mt: 'auto', 
              p: 2, 
              bgcolor: 'action.hover',
              borderRadius: 1
            }}
          >
            <Typography variant="body2" color="text.secondary">
              Bộ lọc hiện tại:
            </Typography>
            <Typography variant="body1">
              {currentFilter}
            </Typography>
          </Paper>
        )}
      </DialogContent>
      
      <DialogActions sx={{ p: 2, borderTop: '1px solid', borderColor: 'divider' }}>
        <Button onClick={onClose} color="inherit">
          Hủy
        </Button>
        <Button 
          onClick={handleApply} 
          variant="contained" 
          disabled={!query.trim() || isProcessing}
          startIcon={<SendIcon />}
        >
          {isProcessing ? 'Đang xử lý...' : 'Áp dụng'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SmartFilter;
