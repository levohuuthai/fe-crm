import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Box, IconButton, Paper, TextField, Typography, Avatar, Button } from '@mui/material';
import { Close, Send as SendIcon, SmartToy as SmartToyIcon } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

// Localized suggestions and responses (not a React Hook)
const getAssistantSidebarContent = (t: any) => {
  const suggestions = [
    t('pages.assistant.suggestions.dealsNotClosedThisMonth'),
    t('pages.assistant.suggestions.totalClosedValue'),
    t('pages.assistant.suggestions.createReminderCompanyB'),
    t('pages.assistant.suggestions.writeThankYouEmail'),
  ];
  const responses: Record<string, string> = {
    [t('pages.assistant.suggestions.dealsNotClosedThisMonth')]: t('pages.assistant.responses.dealsNotClosedThisMonth'),
    [t('pages.assistant.suggestions.totalClosedValue')]: t('pages.assistant.responses.totalClosedValue'),
    [t('pages.assistant.suggestions.createReminderCompanyB')]: t('pages.assistant.responses.createReminderCompanyB'),
    [t('pages.assistant.suggestions.writeThankYouEmail')]: t('pages.assistant.responses.writeThankYouEmail'),
  };
  return { suggestions, responses };
};

interface Message {
  id: number;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

interface AIAssistantSidebarProps {
  open: boolean;
  onClose: () => void;
  children?: React.ReactNode;
}

export const AIAssistantSidebar = ({ open, onClose }: AIAssistantSidebarProps) => {
  const { t, i18n } = useTranslation();
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const locale = i18n.language && i18n.language.startsWith('ja') ? 'ja-JP' : 'en-US';
  const { suggestions, responses } = useMemo(() => getAssistantSidebarContent(t), [t, i18n.language]);

  // Initial bot greeting
  useEffect(() => {
    setMessages([
      {
        id: 1,
        text: t('pages.assistant.greeting'),
        isUser: false,
        timestamp: new Date(),
      },
    ]);
  }, [t, i18n.language]);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = () => {
    if (!input.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now(),
      text: input,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');

    // Simulate bot response
    setTimeout(() => {
      const botResponse: Message = {
        id: Date.now() + 1,
        text: responses[input] || t('pages.assistant.noUnderstand'),
        isUser: false,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botResponse]);
    }, 800);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat(locale, {
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const renderMessageContent = (text: string) => {
    if (text.includes('```')) {
      const parts = text.split('```');
      return (
        <div>
          {parts.map((part, index) => {
            if (index % 2 === 1) {
              // This is a code block
              return (
                <pre
                  key={index}
                  style={{
                    backgroundColor: '#f5f5f5',
                    padding: '10px',
                    borderRadius: '4px',
                    overflowX: 'auto',
                    margin: '8px 0',
                    fontFamily: 'monospace',
                    whiteSpace: 'pre-wrap',
                  }}
                >
                  {part.trim()}
                </pre>
              );
            }
            return <div key={index}>{part}</div>;
          })}
        </div>
      );
    }
    return <div style={{ whiteSpace: 'pre-line' }}>{text}</div>;
  };
  
  if (!open) return null;
  
  return (
    <Paper 
      elevation={0}
      sx={{ 
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Box sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <SmartToyIcon color="primary" />
            <Typography variant="subtitle1" fontWeight="bold">{t('pages.assistant.title')}</Typography>
          </Box>
          <IconButton onClick={onClose} size="small">
            <Close />
          </IconButton>
        </Box>
        
        {/* Messages */}
        <Box
          sx={{
            flex: 1,
            overflowY: 'auto',
            p: 1,
            bgcolor: '#f9f9f9',
            borderRadius: 1,
            mb: 2,
          }}
        >
          {messages.map((message) => (
            <Box
              key={message.id}
              sx={{
                display: 'flex',
                justifyContent: message.isUser ? 'flex-end' : 'flex-start',
                mb: 2,
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  maxWidth: '80%',
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    mb: 0.5,
                    justifyContent: message.isUser ? 'flex-end' : 'flex-start',
                  }}
                >
                  {!message.isUser && (
                    <Avatar sx={{ width: 24, height: 24, mr: 1, bgcolor: 'primary.main' }}>
                      <SmartToyIcon sx={{ fontSize: 16 }} />
                    </Avatar>
                  )}
                  <Typography variant="caption" color="text.secondary">
                    {message.isUser ? t('pages.assistant.you') : t('pages.assistant.assistant')} • {formatDate(message.timestamp)}
                  </Typography>
                </Box>
                <Paper
                  elevation={0}
                  sx={{
                    p: 2,
                    bgcolor: message.isUser ? 'primary.light' : 'background.paper',
                    color: message.isUser ? 'primary.contrastText' : 'text.primary',
                    borderRadius: 2,
                    borderTopLeftRadius: message.isUser ? 12 : 2,
                    borderTopRightRadius: message.isUser ? 2 : 12,
                  }}
                >
                  {renderMessageContent(message.text)}
                </Paper>
              </Box>
            </Box>
          ))}
          <div ref={messagesEndRef} />
        </Box>

        {/* Suggestions */}
        {messages.length <= 1 && (
          <Box sx={{ mb: 2, borderTop: '1px solid #e0e0e0', pt: 2 }}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              {t('pages.assistant.youCanAsk')}
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {suggestions.map((suggestion, index) => (
                <Button
                  key={index}
                  variant="outlined"
                  size="small"
                  onClick={() => handleSuggestionClick(suggestion)}
                  sx={{
                    textTransform: 'none',
                    borderRadius: 4,
                    fontSize: '0.8rem',
                  }}
                >
                  {suggestion}
                </Button>
              ))}
            </Box>
          </Box>
        )}

        {/* Input */}
        <Box>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
          >
            <Box sx={{ display: 'flex', gap: 1 }}>
              <TextField
                fullWidth
                variant="outlined"
                placeholder={t('pages.assistant.inputPlaceholder')}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                multiline
                maxRows={4}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 4,
                    backgroundColor: '#f5f5f5',
                    '&:hover fieldset': {
                      borderColor: 'primary.main',
                    },
                  },
                }}
              />
              <IconButton
                type="submit"
                color="primary"
                sx={{
                  alignSelf: 'flex-end',
                  backgroundColor: 'primary.main',
                  color: 'white',
                  '&:hover': {
                    backgroundColor: 'primary.dark',
                  },
                }}
                disabled={!input.trim()}
              >
                <SendIcon />
              </IconButton>
            </Box>
          </form>
        </Box>
      </Box>
    </Paper>
  );
};

export default AIAssistantSidebar;
