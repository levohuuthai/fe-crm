import React, { useState } from 'react';
import { 
  Box, 
  TextField, 
  Button, 
  CircularProgress, 
  Typography, 
  Paper,
  Chip,
  Divider
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import PersonIcon from '@mui/icons-material/Person';
import { useTranslation } from 'react-i18next';

interface AIPromptInputProps {
  onSubmit: (prompt: string) => void;
  loading: boolean;
  chatHistory: Array<{ role: 'user' | 'assistant', content: string }>;
}

// Prompt suggestions will be loaded from i18n

const AIPromptInput: React.FC<AIPromptInputProps> = ({ 
  onSubmit, 
  loading, 
  chatHistory 
}) => {
  const { t } = useTranslation();
  const [prompt, setPrompt] = useState<string>('');
  const PROMPT_SUGGESTIONS = t('pages.contracts.aiGeneration.prompt.suggestions.items', { returnObjects: true }) as string[];
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim() && !loading) {
      onSubmit(prompt.trim());
      setPrompt('');
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    const newPrompt = t('pages.contracts.aiGeneration.prompt.suggestions.compose', { suggestion });
    setPrompt(newPrompt);
  };

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      height: '100%',
      p: 0
    }}>
      {/* Chat History */}
      <Box sx={{ 
        flexGrow: 1, 
        overflowY: 'auto',
        p: 2,
        display: 'flex',
        flexDirection: 'column',
        gap: 2
      }}>
        {chatHistory.length === 0 ? (
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            color: 'text.secondary',
            textAlign: 'center',
            p: 3
          }}>
            <SmartToyIcon sx={{ fontSize: 60, mb: 2, opacity: 0.7 }} />
            <Typography variant="h6" gutterBottom>
              {t('pages.contracts.aiGeneration.prompt.emptyState.title')}
            </Typography>
            <Typography variant="body1" sx={{ maxWidth: '80%', mx: 'auto' }}>
              {t('pages.contracts.aiGeneration.prompt.emptyState.description')}
            </Typography>
            <Typography variant="body2" sx={{ mt: 2, fontStyle: 'italic' }}>
              {t('pages.contracts.aiGeneration.prompt.emptyState.example')}
            </Typography>
          </Box>
        ) : (
          chatHistory.map((message, index) => (
            <Paper
              key={index}
              elevation={0}
              sx={{
                p: 2,
                backgroundColor: message.role === 'assistant' ? 'rgba(0, 0, 0, 0.04)' : 'transparent',
                borderRadius: 2,
                maxWidth: '90%',
                alignSelf: message.role === 'assistant' ? 'flex-start' : 'flex-end',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  backgroundColor: message.role === 'assistant' ? 'primary.main' : 'secondary.main',
                  borderRadius: '50%',
                  width: 32,
                  height: 32,
                  color: 'white'
                }}>
                  {message.role === 'assistant' ? <SmartToyIcon fontSize="small" /> : <PersonIcon fontSize="small" />}
                </Box>
                <Typography variant="body1">
                  {message.content}
                </Typography>
              </Box>
            </Paper>
          ))
        )}
      </Box>

      {/* Prompt Suggestions */}
      {chatHistory.length === 0 && (
        <Box sx={{ px: 2, py: 1 }}>
          <Typography variant="subtitle2" gutterBottom>
            {t('pages.contracts.aiGeneration.prompt.suggestions.title')}
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {PROMPT_SUGGESTIONS.map((suggestion, index) => (
              <Chip
                key={index}
                label={suggestion}
                onClick={() => handleSuggestionClick(suggestion)}
                color="primary"
                variant="outlined"
                clickable
              />
            ))}
          </Box>
        </Box>
      )}

      <Divider />

      {/* Input Area */}
      <Box 
        component="form" 
        onSubmit={handleSubmit}
        sx={{ 
          p: 2, 
          display: 'flex',
          alignItems: 'flex-end',
          gap: 1
        }}
      >
        <TextField
          multiline
          maxRows={4}
          placeholder={t('pages.contracts.aiGeneration.input.placeholder')}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          fullWidth
          variant="outlined"
          disabled={loading}
          sx={{ 
            '& .MuiOutlinedInput-root': {
              borderRadius: 2
            }
          }}
        />
        <Button
          variant="contained"
          color="primary"
          endIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SendIcon />}
          disabled={!prompt.trim() || loading}
          type="submit"
          sx={{ 
            height: 56,
            borderRadius: 2,
            px: 3
          }}
        >
          {loading ? t('pages.contracts.aiGeneration.input.generating') : t('pages.contracts.aiGeneration.input.generate')}
        </Button>
      </Box>
    </Box>
  );
};

export default AIPromptInput;
