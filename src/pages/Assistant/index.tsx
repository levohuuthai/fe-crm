import React, { useState, useRef, useEffect } from 'react';
import { Box, TextField, IconButton, Typography, Paper, Avatar, Button } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import SmartToyIcon from '@mui/icons-material/SmartToy';

import CloseIcon from '@mui/icons-material/Close';
import { useNavigate } from 'react-router-dom';

// Mock data for demo responses
const MOCK_RESPONSES: Record<string, string> = {
  'Các deal chưa chốt': 'Đây là danh sách các deal chưa chốt của bạn trong tháng 7:\n```\n| Tên Deal | Khách hàng | Giá trị |\n|----------|-------------|---------|\n| Deal 1   | Công ty A   | 100M    |\n| Deal 2   | Công ty B   | 80M     |\n```',
  'Tổng giá trị deal đã chốt': 'Tổng giá trị đã chốt của bạn trong tháng này là 377.043.143 ₫',
  'Tạo nhắc việc cho Công ty B': 'Đã tạo nhắc việc cho Deal của Công ty B vào ngày mai. Bạn có muốn thêm ghi chú không?',
  'Viết email cảm ơn khách hàng': 'Chào quý khách,\n\nCảm ơn anh/chị đã tin tưởng sử dụng dịch vụ của chúng tôi. Chúng tôi rất trân trọng sự hợp tác này...',
};

const DEFAULT_SUGGESTIONS = [
  'Các deal chưa chốt trong tháng này',
  'Tổng giá trị deal đã chốt',
  'Tạo nhắc việc cho Công ty B',
  'Viết email cảm ơn khách hàng'
];

interface Message {
  id: number;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

const AssistantPage: React.FC = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Initial bot greeting
  useEffect(() => {
    setMessages([
      {
        id: 1,
        text: 'Xin chào! Tôi là trợ lý ảo của CRM. Tôi có thể giúp gì cho bạn?',
        isUser: false,
        timestamp: new Date(),
      },
    ]);
  }, []);

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
        text: MOCK_RESPONSES[input] || 'Xin lỗi, tôi chưa hiểu yêu cầu của bạn. Bạn có thể thử lại không?',
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
    return new Intl.DateTimeFormat('vi-VN', {
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

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          p: 2,
          borderBottom: '1px solid #e0e0e0',
          backgroundColor: '#fff',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <SmartToyIcon color="primary" fontSize="large" />
          <Typography variant="h6" component="h1">
            Trợ lý thông minh CRM ITV
          </Typography>
        </Box>
        <IconButton onClick={() => navigate(-1)}>
          <CloseIcon />
        </IconButton>
      </Box>

      {/* Messages */}
      <Box
        sx={{
          flex: 1,
          overflowY: 'auto',
          p: 2,
          bgcolor: '#f9f9f9',
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
                  {message.isUser ? 'Bạn' : 'Trợ lý AI'} • {formatDate(message.timestamp)}
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
        <Box sx={{ p: 2, borderTop: '1px solid #e0e0e0', bgcolor: '#fff' }}>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            Bạn có thể hỏi:
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {DEFAULT_SUGGESTIONS.map((suggestion, index) => (
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
      <Box sx={{ p: 2, borderTop: '1px solid #e0e0e0', bgcolor: '#fff' }}>
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
              placeholder="Nhập tin nhắn..."
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
  );
};

export default AssistantPage;
