import React, { useState, useEffect, useRef } from 'react';
import {
  Dialog,
  DialogContent,
  Box,
  Typography,
  IconButton,
  TextField,
  InputAdornment,
  Paper,
  Chip,
  Button,
  Avatar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Skeleton,
  Alert,
  Snackbar,
  useTheme,
  alpha,
  Fade,
  Slide
} from '@mui/material';
import {
  Close as CloseIcon,
  Minimize as MinimizeIcon,
  Fullscreen as ExpandIcon,
  Send as SendIcon,
  AttachFile as AttachIcon,
  SmartToy as AIIcon,
  Person as PersonIcon,
  Business as BusinessIcon,
  TrendingUp as TrendingIcon,
  Email as EmailIcon,
  Add as AddIcon,
  Task as TaskIcon,
  OpenInNew as OpenIcon
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

// Types
export interface ChatMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  isCard?: boolean;
  cardData?: AssistantCardData;
}

export interface ContactData {
  id: string;
  name: string;
  email: string;
  phone: string;
  owner: string;
  leadStatus: string;
  statusColor: string;
}

export interface DealData {
  id: string;
  name: string;
  customer: string;
  amount: number;
  stage: string;
  stageColor: string;
  deadline: string;
}

export interface AssistantCardData {
  query: string;
  summary: string[];
  contacts: ContactData[];
  deals: DealData[];
  showContacts: boolean;
  showDeals: boolean;
}

export interface CrmAssistantPanelProps {
  open: boolean;
  initialQuery?: string;
  onClose: () => void;
  onMinimize: () => void;
}

// Mock data
const mockContacts: ContactData[] = [
  {
    id: '1',
    name: 'Nguyễn Văn An',
    email: 'an.nguyen@company.com',
    phone: '0901234567',
    owner: 'Trần Thị B',
    leadStatus: 'Hot Lead',
    statusColor: '#f44336'
  },
  {
    id: '2',
    name: 'Lê Thị Cẩm',
    email: 'cam.le@business.com',
    phone: '0987654321',
    owner: 'Phạm Văn C',
    leadStatus: 'Qualified',
    statusColor: '#4caf50'
  },
  {
    id: '3',
    name: 'Hoàng Minh Đức',
    email: 'duc.hoang@tech.vn',
    phone: '0912345678',
    owner: 'Nguyễn Thị D',
    leadStatus: 'New Lead',
    statusColor: '#2196f3'
  }
];

const mockDeals: DealData[] = [
  {
    id: '1',
    name: 'Hệ thống CRM cho ABC Corp',
    customer: 'ABC Corporation',
    amount: 250000000,
    stage: 'Đã gửi báo giá',
    stageColor: '#ff9800',
    deadline: '2024-02-15'
  },
  {
    id: '2',
    name: 'Giải pháp ERP XYZ',
    customer: 'XYZ Trading',
    amount: 180000000,
    stage: 'Đang đàm phán',
    stageColor: '#9c27b0',
    deadline: '2024-02-28'
  },
  {
    id: '3',
    name: 'Tư vấn Marketing Digital',
    customer: 'Innovation Startup',
    amount: 75000000,
    stage: 'Liên hệ ban đầu',
    stageColor: '#607d8b',
    deadline: '2024-03-10'
  }
];

// Helper functions
const formatAmount = (amount: number): string => {
  if (amount >= 1000000000) {
    return `${(amount / 1000000000).toFixed(1)}B₫`;
  } else if (amount >= 1000000) {
    return `${(amount / 1000000).toFixed(1)}M₫`;
  } else if (amount >= 1000) {
    return `${(amount / 1000).toFixed(1)}K₫`;
  }
  return `${amount}₫`;
};

const generateConversationTitle = (query: string): string => {
  const words = query.split(' ').slice(0, 6);
  return words.join(' ');
};

const generateMockSummary = (query: string, t: (key: string, options?: any) => string): string[] => {
  const totalAmount = mockDeals.reduce((sum, deal) => sum + deal.amount, 0);
  const stageCounts = mockDeals.reduce<Record<string, number>>((acc, d) => {
    acc[d.stage] = (acc[d.stage] || 0) + 1;
    return acc;
  }, {});
  const mostCommonStage = Object.entries(stageCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || '';

  return [
    t('pages.assistant.mock.summary.foundContacts', { count: mockContacts.length }),
    t('pages.assistant.mock.summary.openDealsTotal', { count: mockDeals.length, total: formatAmount(totalAmount) }),
    t('pages.assistant.mock.summary.manyDealsAtStage', { stage: mostCommonStage }),
    t('pages.assistant.mock.summary.currentLeadConversion', { percent: 65 })
  ];
};

// Mini Table Component
const MiniTable: React.FC<{
  type: 'contacts' | 'deals';
  data: ContactData[] | DealData[];
  onAction: (action: string, id: string) => void;
}> = ({ type, data, onAction }) => {
  const theme = useTheme();
  const { t, i18n } = useTranslation();
  const locale = i18n.language && i18n.language.startsWith('ja') ? 'ja-JP' : 'en-US';
  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return new Intl.DateTimeFormat(locale, { year: 'numeric', month: '2-digit', day: '2-digit' }).format(d);
  };

  if (type === 'contacts') {
    const contacts = data as ContactData[];
    return (
      <TableContainer component={Paper} sx={{ maxHeight: 200, border: `1px solid ${alpha(theme.palette.divider, 0.3)}` }}>
        <Table size="small" stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold', fontSize: '0.75rem' }}>{t('pages.contacts.columns.name')}</TableCell>
              <TableCell sx={{ fontWeight: 'bold', fontSize: '0.75rem' }}>{t('pages.contacts.columns.email')}</TableCell>
              <TableCell sx={{ fontWeight: 'bold', fontSize: '0.75rem' }}>{t('pages.contacts.columns.owner')}</TableCell>
              <TableCell sx={{ fontWeight: 'bold', fontSize: '0.75rem' }}>{t('pages.contacts.columns.leadStatus')}</TableCell>
              <TableCell sx={{ fontWeight: 'bold', fontSize: '0.75rem' }}>{t('pages.contacts.columns.actions')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {contacts.map((contact) => (
              <TableRow key={contact.id} hover>
                <TableCell sx={{ fontSize: '0.8rem', fontWeight: 'medium' }}>{contact.name}</TableCell>
                <TableCell sx={{ fontSize: '0.75rem' }}>{contact.email}</TableCell>
                <TableCell sx={{ fontSize: '0.75rem' }}>{contact.owner}</TableCell>
                <TableCell>
                  <Chip
                    label={contact.leadStatus}
                    size="small"
                    sx={{
                      backgroundColor: alpha(contact.statusColor, 0.1),
                      color: contact.statusColor,
                      border: `1px solid ${alpha(contact.statusColor, 0.3)}`,
                      fontSize: '0.65rem',
                      height: 20
                    }}
                  />
                </TableCell>
                <TableCell>
                  <Button
                    size="small"
                    startIcon={<OpenIcon fontSize="small" />}
                    onClick={() => onAction('open', contact.id)}
                    sx={{ fontSize: '0.7rem', minWidth: 'auto', px: 1 }}
                  >
                    {t('pages.assistant.buttons.open')}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  }

  const deals = data as DealData[];
  return (
    <TableContainer component={Paper} sx={{ maxHeight: 200, border: `1px solid ${alpha(theme.palette.divider, 0.3)}` }}>
      <Table size="small" stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontWeight: 'bold', fontSize: '0.75rem' }}>{t('pages.deals.columns.dealName')}</TableCell>
            <TableCell sx={{ fontWeight: 'bold', fontSize: '0.75rem' }}>{t('pages.deals.columns.customer')}</TableCell>
            <TableCell sx={{ fontWeight: 'bold', fontSize: '0.75rem' }}>{t('pages.deals.columns.amount')}</TableCell>
            <TableCell sx={{ fontWeight: 'bold', fontSize: '0.75rem' }}>{t('pages.deals.columns.stage')}</TableCell>
            <TableCell sx={{ fontWeight: 'bold', fontSize: '0.75rem' }}>{t('pages.deals.columns.expectedCloseDate')}</TableCell>
            <TableCell sx={{ fontWeight: 'bold', fontSize: '0.75rem' }}>{t('pages.deals.columns.actions')}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {deals.map((deal) => (
            <TableRow key={deal.id} hover>
              <TableCell sx={{ fontSize: '0.8rem', fontWeight: 'medium' }}>{deal.name}</TableCell>
              <TableCell sx={{ fontSize: '0.75rem' }}>{deal.customer}</TableCell>
              <TableCell sx={{ fontSize: '0.8rem', fontWeight: 'bold', color: 'success.main' }}>
                {formatAmount(deal.amount)}
              </TableCell>
              <TableCell>
                <Chip
                  label={deal.stage}
                  size="small"
                  sx={{
                    backgroundColor: alpha(deal.stageColor, 0.1),
                    color: deal.stageColor,
                    border: `1px solid ${alpha(deal.stageColor, 0.3)}`,
                    fontSize: '0.65rem',
                    height: 20
                  }}
                />
              </TableCell>
              <TableCell sx={{ fontSize: '0.75rem' }}>{formatDate(deal.deadline)}</TableCell>
              <TableCell>
                <Box sx={{ display: 'flex', gap: 0.5 }}>
                  <Button
                    size="small"
                    startIcon={<OpenIcon fontSize="small" />}
                    onClick={() => onAction('open', deal.id)}
                    sx={{ fontSize: '0.7rem', minWidth: 'auto', px: 1 }}
                  >
                    {t('pages.assistant.buttons.open')}
                  </Button>
                  <Button
                    size="small"
                    startIcon={<TaskIcon fontSize="small" />}
                    onClick={() => onAction('task', deal.id)}
                    sx={{ fontSize: '0.7rem', minWidth: 'auto', px: 1 }}
                  >
                    {t('pages.assistant.buttons.task')}
                  </Button>
                </Box>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

// Assistant Card Component
const AssistantCard: React.FC<{
  data: AssistantCardData;
  loading?: boolean;
  onToggleSection: (section: 'contacts' | 'deals') => void;
  onAction: (action: string, id?: string) => void;
}> = ({ data, loading, onToggleSection, onAction }) => {
  const theme = useTheme();
  const { t } = useTranslation();

  if (loading) {
    return (
      <Paper sx={{ p: 3, mb: 2, borderRadius: 3, border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}` }}>
        <Skeleton variant="text" width="60%" height={32} sx={{ mb: 2 }} />
        <Box sx={{ mb: 2 }}>
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} variant="text" width="80%" height={24} sx={{ mb: 0.5 }} />
          ))}
        </Box>
        <Skeleton variant="rectangular" width="100%" height={120} sx={{ mb: 2, borderRadius: 1 }} />
        <Skeleton variant="rectangular" width="100%" height={120} sx={{ borderRadius: 1 }} />
      </Paper>
    );
  }

  return (
    <Paper sx={{ 
      p: 3, 
      mb: 2, 
      borderRadius: 3, 
      border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
      backgroundColor: alpha(theme.palette.primary.main, 0.02)
    }}>
      <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: 'primary.main' }}>
        {t('pages.assistant.resultsFor', { query: data.query })}
      </Typography>

      {/* Summary */}
      <Box sx={{ mb: 3 }}>
        {data.summary.map((item, index) => (
          <Typography key={index} variant="body2" sx={{ mb: 0.5, display: 'flex', alignItems: 'center' }}>
            <Box sx={{ width: 4, height: 4, borderRadius: '50%', backgroundColor: 'primary.main', mr: 1 }} />
            {item}
          </Typography>
        ))}
      </Box>

      {/* Filter Chips */}
      <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
        <Chip
          icon={<PersonIcon fontSize="small" />}
          label={t('common.contacts')}
          variant={data.showContacts ? 'filled' : 'outlined'}
          color={data.showContacts ? 'primary' : 'default'}
          onClick={() => onToggleSection('contacts')}
          sx={{ cursor: 'pointer' }}
        />
        <Chip
          icon={<BusinessIcon fontSize="small" />}
          label={t('common.deals')}
          variant={data.showDeals ? 'filled' : 'outlined'}
          color={data.showDeals ? 'primary' : 'default'}
          onClick={() => onToggleSection('deals')}
          sx={{ cursor: 'pointer' }}
        />
      </Box>

      {/* Top Contacts */}
      {data.showContacts && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1.5 }}>
            {t('pages.assistant.topContacts')}
          </Typography>
          <MiniTable type="contacts" data={data.contacts} onAction={onAction} />
        </Box>
      )}

      {/* Open Deals */}
      {data.showDeals && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1.5 }}>
            {t('pages.assistant.openDeals')}
          </Typography>
          <MiniTable type="deals" data={data.deals} onAction={onAction} />
        </Box>
      )}

      {/* Suggested Actions */}
      <Box>
        <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1.5 }}>
          {t('pages.assistant.nextSuggestions')}
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <Button
            size="small"
            startIcon={<AddIcon fontSize="small" />}
            variant="outlined"
            onClick={() => onAction('create-contact')}
          >
            {t('pages.assistant.actions.createContact')}
          </Button>
          <Button
            size="small"
            startIcon={<TrendingIcon fontSize="small" />}
            variant="outlined"
            onClick={() => onAction('create-deal')}
          >
            {t('pages.assistant.actions.createDeal')}
          </Button>
          <Button
            size="small"
            startIcon={<EmailIcon fontSize="small" />}
            variant="outlined"
            onClick={() => onAction('send-email')}
          >
            {t('pages.assistant.actions.sendDraftEmail')}
          </Button>
        </Box>
      </Box>
    </Paper>
  );
};

// Chat Message Component
const ChatMessage: React.FC<{
  message: ChatMessage;
  onToggleSection?: (section: 'contacts' | 'deals') => void;
  onAction?: (action: string, id?: string) => void;
}> = ({ message, onToggleSection, onAction }) => {
  const theme = useTheme();
  const isUser = message.type === 'user';

  return (
    <Box sx={{ 
      display: 'flex', 
      justifyContent: isUser ? 'flex-end' : 'flex-start',
      mb: 2
    }}>
      <Box sx={{ maxWidth: '80%', width: message.isCard ? '100%' : 'auto' }}>
        {message.isCard && message.cardData ? (
          <AssistantCard
            data={message.cardData}
            onToggleSection={onToggleSection!}
            onAction={onAction!}
          />
        ) : (
          <Paper sx={{
            p: 2,
            backgroundColor: isUser ? 'primary.main' : 'grey.100',
            color: isUser ? 'primary.contrastText' : 'text.primary',
            borderRadius: isUser ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
            maxWidth: 'fit-content'
          }}>
            <Typography variant="body2">
              {message.content}
            </Typography>
          </Paper>
        )}
      </Box>
    </Box>
  );
};

// Main CRM Assistant Panel Component
const CrmAssistantPanel: React.FC<CrmAssistantPanelProps> = ({
  open,
  initialQuery = '',
  onClose,
  onMinimize
}) => {
  const theme = useTheme();
  const { t } = useTranslation();

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [conversationTitle, setConversationTitle] = useState('');
  const [cardData, setCardData] = useState<AssistantCardData | null>(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '' });
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize with initial query
  useEffect(() => {
    if (open && initialQuery && messages.length === 0) {
      setConversationTitle(generateConversationTitle(initialQuery));
      handleSendMessage(initialQuery, true);
    }
  }, [open, initialQuery]);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (message: string, isInitial = false) => {
    if (!message.trim()) return;

    // Add user message
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: message,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate typing delay
    setTimeout(() => {
      setIsTyping(false);
      
      if (isInitial) {
        // Create card response for initial query
        const newCardData: AssistantCardData = {
          query: message,
          summary: generateMockSummary(message, t),
          contacts: mockContacts,
          deals: mockDeals,
          showContacts: true,
          showDeals: true
        };

        const assistantMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          type: 'assistant',
          content: '',
          timestamp: new Date(),
          isCard: true,
          cardData: newCardData
        };

        setCardData(newCardData);
        setMessages(prev => [...prev, assistantMessage]);
      } else {
        // Regular text response
        const responses = [
          'Tôi đã phân tích dữ liệu và tìm thấy một số thông tin hữu ích. Bạn có muốn tôi tạo báo cáo chi tiết không?',
          'Dựa trên dữ liệu hiện tại, tôi khuyên bạn nên tập trung vào các lead đang ở giai đoạn "Đã gửi báo giá".',
          'Có vẻ như bạn có nhiều cơ hội tiềm năng. Tôi có thể giúp bạn ưu tiên theo giá trị deal.',
          'Tôi nhận thấy một số xu hướng thú vị trong dữ liệu của bạn. Bạn muốn xem phân tích chi tiết không?'
        ];

        const assistantMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          type: 'assistant',
          content: responses[Math.floor(Math.random() * responses.length)],
          timestamp: new Date()
        };

        setMessages(prev => [...prev, assistantMessage]);
      }
    }, 1500);
  };

  const handleToggleSection = (section: 'contacts' | 'deals') => {
    if (!cardData) return;

    const updatedCardData = {
      ...cardData,
      [section === 'contacts' ? 'showContacts' : 'showDeals']: 
        !cardData[section === 'contacts' ? 'showContacts' : 'showDeals']
    };

    setCardData(updatedCardData);
    
    // Update the card message
    setMessages(prev => prev.map(msg => 
      msg.isCard ? { ...msg, cardData: updatedCardData } : msg
    ));
  };

  const handleAction = (action: string, id?: string) => {
    const actionMessages: { [key: string]: string } = {
      'open': '(mock) Đã mở chi tiết',
      'task': '(mock) Đã tạo task',
      'create-contact': '(mock) Đã tạo liên hệ mới',
      'create-deal': '(mock) Đã tạo cơ hội mới',
      'send-email': '(mock) Đã gửi email nháp'
    };

    setSnackbar({
      open: true,
      message: actionMessages[action] || '(mock) Đã thực hiện'
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(inputValue);
    }
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth={false}
        PaperProps={{
          sx: {
            width: '960px',
            height: '75vh',
            maxWidth: '90vw',
            maxHeight: '90vh',
            borderRadius: 3,
            overflow: 'hidden'
          }
        }}
        BackdropProps={{
          sx: {
            backgroundColor: alpha(theme.palette.common.black, 0.5),
            backdropFilter: 'blur(4px)'
          }
        }}
      >
        {/* Header */}
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          p: 2,
          borderBottom: `1px solid ${theme.palette.divider}`,
          backgroundColor: theme.palette.background.paper,
          position: 'sticky',
          top: 0,
          zIndex: 1
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <AIIcon color="primary" />
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 'bold', lineHeight: 1 }}>
                {t('pages.assistant.assistant')}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {conversationTitle || 'Start new chat'}
              </Typography>
            </Box>
          </Box>
          
          <Box sx={{ display: 'flex', gap: 0.5 }}>
            <IconButton size="small" onClick={onMinimize}>
              <MinimizeIcon fontSize="small" />
            </IconButton>
            <IconButton size="small">
              <ExpandIcon fontSize="small" />
            </IconButton>
            <IconButton size="small" onClick={onClose}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>
        </Box>

        {/* Chat Body */}
        <DialogContent sx={{ 
          flex: 1, 
          p: 0, 
          display: 'flex', 
          flexDirection: 'column',
          overflow: 'hidden'
        }}>
          <Box sx={{ 
            flex: 1, 
            overflow: 'auto', 
            p: 2,
            '&::-webkit-scrollbar': {
              width: '6px',
            },
            '&::-webkit-scrollbar-track': {
              backgroundColor: alpha(theme.palette.grey[300], 0.2),
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: alpha(theme.palette.primary.main, 0.3),
              borderRadius: '3px',
              '&:hover': {
                backgroundColor: alpha(theme.palette.primary.main, 0.5),
              }
            }
          }}>
            {messages.length === 0 ? (
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                height: '100%',
                flexDirection: 'column',
                color: 'text.secondary'
              }}>
                <AIIcon sx={{ fontSize: 48, mb: 2, opacity: 0.5 }} />
                <Typography variant="body1">
                  {t('pages.assistant.emptyPrompt')}
                </Typography>
              </Box>
            ) : (
              <>
                {messages.map((message) => (
                  <ChatMessage
                    key={message.id}
                    message={message}
                    onToggleSection={handleToggleSection}
                    onAction={handleAction}
                  />
                ))}
                
                {isTyping && (
                  <Box sx={{ display: 'flex', justifyContent: 'flex-start', mb: 2 }}>
                    <Paper sx={{
                      p: 2,
                      backgroundColor: 'grey.100',
                      borderRadius: '18px 18px 18px 4px',
                      maxWidth: 'fit-content'
                    }}>
                      <Typography variant="body2" color="text.secondary">
                        {t('pages.assistant.typing')}
                      </Typography>
                    </Paper>
                  </Box>
                )}
                
                <div ref={messagesEndRef} />
              </>
            )}
          </Box>

          {/* Composer */}
          <Box sx={{
            p: 2,
            borderTop: `1px solid ${theme.palette.divider}`,
            backgroundColor: theme.palette.background.paper,
            position: 'sticky',
            bottom: 0
          }}>
            <TextField
              fullWidth
              multiline
              maxRows={3}
              placeholder={t('pages.assistant.inputPlaceholder')}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton size="small" sx={{ mr: 0.5 }}>
                      <AttachIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="primary"
                      onClick={() => handleSendMessage(inputValue)}
                      disabled={!inputValue.trim()}
                    >
                      <SendIcon fontSize="small" />
                    </IconButton>
                  </InputAdornment>
                ),
                sx: {
                  borderRadius: 3,
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: alpha(theme.palette.primary.main, 0.3),
                  }
                }
              }}
            />
            <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
              {t('pages.assistant.mock.disclaimer')}
            </Typography>
          </Box>
        </DialogContent>
      </Dialog>

      {/* Snackbar for actions */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        message={snackbar.message}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </>
  );
};

export default CrmAssistantPanel;
