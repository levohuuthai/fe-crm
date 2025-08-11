import React, { useState } from 'react';
import { 
  Box, 
  TextField, 
  IconButton, 
  Paper, 
  Typography, 
  Chip,
  Button,
  List,
  ListItem,
  ListItemText,
  Divider
} from '@mui/material';
import { 
  Send as SendIcon, 
  Mic as MicIcon, 
  Save as SaveIcon, 
  Download as DownloadIcon,
  History as HistoryIcon
} from '@mui/icons-material';

// Danh sách gợi ý
const SUGGESTIONS = [
  "Cho tôi xem hôm nay có bao nhiêu khách hàng mới",
  "Vẽ biểu đồ doanh thu theo nhân viên trong tháng này",
  "Ai là người chốt deal nhiều nhất trong quý?",
  "So sánh doanh thu tháng này với tháng trước",
  "Tỉ lệ chuyển đổi từ lead sang khách hàng trong quý"
];

// Lịch sử trò chuyện mẫu
const SAMPLE_HISTORY = [
  { id: 1, query: "Doanh thu tháng này là bao nhiêu?", timestamp: "10:30 AM" },
  { id: 2, query: "Top 5 nhân viên có doanh số cao nhất", timestamp: "Hôm qua" },
  { id: 3, query: "Tỉ lệ chuyển đổi từ lead sang khách hàng", timestamp: "Thứ 2" }
];

interface AIChatbotProps {
  onGenerateReport: (query: string) => void;
}

const AIChatbot: React.FC<AIChatbotProps> = ({ onGenerateReport }) => {
  const [query, setQuery] = useState('');
  const [showHistory, setShowHistory] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onGenerateReport(query);
      setQuery('');
    }
  };

  return (
    <Paper 
      elevation={3} 
      sx={{ 
        p: 3, 
        mb: 3, 
        borderRadius: 2,
        background: 'linear-gradient(to right, #f5f7fa, #e4e8f0)'
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 'bold', color: '#334155' }}>
          🤖 AI Assistant - Báo cáo thông minh
        </Typography>
        <IconButton 
          color={showHistory ? "primary" : "default"} 
          onClick={() => setShowHistory(!showHistory)}
          sx={{ mr: 1 }}
        >
          <HistoryIcon />
        </IconButton>
      </Box>

      <form onSubmit={handleSubmit}>
        <Box sx={{ display: 'flex', mb: 2 }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Nhập câu hỏi hoặc yêu cầu báo cáo..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            sx={{ 
              mr: 1,
              '& .MuiOutlinedInput-root': {
                borderRadius: '30px',
                backgroundColor: '#fff'
              }
            }}
          />
          <IconButton 
            color="primary" 
            type="submit"
            sx={{ 
              backgroundColor: '#2563eb', 
              color: 'white',
              '&:hover': {
                backgroundColor: '#1d4ed8',
              },
              borderRadius: '50%',
              width: 56,
              height: 56
            }}
          >
            <SendIcon />
          </IconButton>
          <IconButton 
            sx={{ 
              ml: 1,
              backgroundColor: '#f3f4f6',
              borderRadius: '50%',
              width: 56,
              height: 56
            }}
          >
            <MicIcon />
          </IconButton>
        </Box>
      </form>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
        {SUGGESTIONS.map((suggestion, index) => (
          <Chip
            key={index}
            label={suggestion}
            onClick={() => {
              setQuery(suggestion);
              onGenerateReport(suggestion);
              setQuery('');
            }}
            sx={{ 
              backgroundColor: '#f1f5f9',
              '&:hover': {
                backgroundColor: '#e2e8f0',
              }
            }}
          />
        ))}
      </Box>

      {showHistory && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle2" sx={{ mb: 1, color: '#64748b' }}>
            Báo cáo gần đây
          </Typography>
          <Paper variant="outlined" sx={{ maxHeight: 200, overflow: 'auto', p: 1 }}>
            <List dense>
              {SAMPLE_HISTORY.map((item) => (
                <React.Fragment key={item.id}>
                  <ListItem 
                    onClick={() => {
                      setQuery(item.query);
                      onGenerateReport(item.query);
                      setQuery('');
                    }}
                    sx={{ cursor: 'pointer' }}
                  >
                    <ListItemText 
                      primary={item.query} 
                      secondary={item.timestamp} 
                    />
                    <Box>
                      <IconButton size="small">
                        <SaveIcon fontSize="small" />
                      </IconButton>
                      <IconButton size="small">
                        <DownloadIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </ListItem>
                  <Divider />
                </React.Fragment>
              ))}
            </List>
          </Paper>
        </Box>
      )}

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
        <Button 
          startIcon={<SaveIcon />} 
          variant="outlined" 
          size="small" 
          sx={{ mr: 1 }}
        >
          Lưu báo cáo
        </Button>
        <Button 
          startIcon={<DownloadIcon />} 
          variant="outlined" 
          size="small"
        >
          Tải xuống
        </Button>
      </Box>
    </Paper>
  );
};

export default AIChatbot;