import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

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

// Suggestion translation keys
const SUGGESTION_KEYS = [
  'pages.dashboard.aiChatbot.suggestions.todayNewCustomers',
  'pages.dashboard.aiChatbot.suggestions.revenueByEmployeeThisMonth',
  'pages.dashboard.aiChatbot.suggestions.topCloserThisQuarter',
  'pages.dashboard.aiChatbot.suggestions.compareRevenueThisVsLastMonth',
  'pages.dashboard.aiChatbot.suggestions.conversionRateThisQuarter'
];

// Sample history (localized via t when rendered)
const SAMPLE_HISTORY = [
  { id: 1, queryKey: 'pages.dashboard.aiChatbot.history.q1', timestampKey: 'pages.dashboard.aiChatbot.history.time.1030am' },
  { id: 2, queryKey: 'pages.dashboard.aiChatbot.history.q2', timestampKey: 'pages.dashboard.aiChatbot.history.time.yesterday' },
  { id: 3, queryKey: 'pages.dashboard.aiChatbot.history.q3', timestampKey: 'pages.dashboard.aiChatbot.history.time.monday' }
];

interface AIChatbotProps {
  onGenerateReport: (query: string) => void;
}

const AIChatbot: React.FC<AIChatbotProps> = ({ onGenerateReport }) => {
  const { t } = useTranslation();
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
          {t('pages.dashboard.aiChatbot.title', { defaultValue: '🤖 AI Assistant - Smart Reports' })}
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
            placeholder={t('pages.dashboard.aiChatbot.placeholder', { defaultValue: 'Enter a question or report request...' })}
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
        {SUGGESTION_KEYS.map((key, index) => (
          <Chip
            key={index}
            label={t(key)}
            onClick={() => {
              const text = t(key);
              setQuery(text);
              onGenerateReport(text);
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
            {t('pages.dashboard.aiChatbot.recentReports', { defaultValue: 'Recent reports' })}
          </Typography>
          <Paper variant="outlined" sx={{ maxHeight: 200, overflow: 'auto', p: 1 }}>
            <List dense>
              {SAMPLE_HISTORY.map((item) => (
                <React.Fragment key={item.id}>
                  <ListItem 
                    onClick={() => {
                      const q = t(item.queryKey);
                      setQuery(q);
                      onGenerateReport(q);
                      setQuery('');
                    }}
                    sx={{ cursor: 'pointer' }}
                  >
                    <ListItemText 
                      primary={t(item.queryKey)} 
                      secondary={t(item.timestampKey)} 
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
          {t('pages.dashboard.aiChatbot.saveReport', { defaultValue: 'Save report' })}
        </Button>
        <Button 
          startIcon={<DownloadIcon />} 
          variant="outlined" 
          size="small"
        >
          {t('common.download')}
        </Button>
      </Box>
    </Paper>
  );
};

export default AIChatbot;