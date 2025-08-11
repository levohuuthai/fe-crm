import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  IconButton,
  Paper,
  Divider,
  Menu,
  MenuItem,
  Tooltip,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  Popover,
  ButtonGroup
} from '@mui/material';
import {
  Close as CloseIcon,
  Minimize as MinimizeIcon,
  Maximize as MaximizeIcon,
  ExpandMore as ExpandMoreIcon,
  Schedule as ScheduleIcon,
  CalendarToday as CalendarIcon,
  Launch as LaunchIcon,
  AttachFile as AttachFileIcon,
  Image as ImageIcon,
  Link as LinkIcon,
  FormatBold as FormatBoldIcon,
  FormatItalic as FormatItalicIcon,
  FormatUnderlined as FormatUnderlinedIcon,
  ArrowDropDown as ArrowDropDownIcon,
  OpenInFull as OpenInFullIcon,
  CloseFullscreen as CloseFullscreenIcon,
  Edit as EditIcon,
  ContentCopy as ContentCopyIcon
} from '@mui/icons-material';

interface EmailWindowProps {
  open: boolean;
  onClose: () => void;
  recipientEmail?: string;
  fromContactDetails?: boolean;
}

const EmailWindow: React.FC<EmailWindowProps> = ({ open, onClose, recipientEmail = '', fromContactDetails = false }) => {
  // Default position in the center of the screen
  const defaultPosition = { x: window.innerWidth / 2 - 375, y: window.innerHeight / 2 - 300 };
  const [position, setPosition] = useState(defaultPosition);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isMinimized, setIsMinimized] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [showSendOptions, setShowSendOptions] = useState(false);
  const [sendLaterSelected, setSendLaterSelected] = useState(false);
  
  // Gmail integration and email state
  const [emailSubject, setEmailSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');
  const [emailTo, setEmailTo] = useState(recipientEmail || '');
  // Set from contact details based on prop
  useEffect(() => {
    if (open) {
      // Always position at the bottom right corner like Gmail
      // Adjust for Contact Details panel if needed
      let rightOffset = 20; // Default right margin
      
      if (fromContactDetails) {
        // If opened from contact details, adjust position to avoid overlap
        const contactDetailsWidth = 400; // Approximate width of contact details
        rightOffset = contactDetailsWidth + 20; // Position to the left of contact details
      }
      
      // Position at the very bottom of the screen
      // For Gmail-like behavior, we want it flush with the bottom
      const bottomPosition = window.innerHeight - (isMinimized ? 48 : 600);
      const rightPosition = window.innerWidth - 750 - rightOffset;
      
      setPosition({ 
        x: Math.max(20, rightPosition),
        y: bottomPosition
      });
    }
    
    // Update recipient when prop changes
    if (recipientEmail) {
      setEmailTo(recipientEmail);
    }
  }, [open, fromContactDetails, recipientEmail, isMinimized]);
  // We only need sendLaterAnchorEl for the Send Later popover
  const [sendLaterAnchorEl, setSendLaterAnchorEl] = useState<null | HTMLElement>(null);
  const [sendLaterOption, setSendLaterOption] = useState('1hour');
  const [customDate, setCustomDate] = useState(new Date().toISOString().split('T')[0]);
  const [customTime, setCustomTime] = useState('16:30');
  const windowRef = useRef<HTMLDivElement>(null);

  // Handle drag start
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isMaximized) return;
    
    if (windowRef.current && e.target === e.currentTarget) {
      setIsDragging(true);
      const rect = windowRef.current.getBoundingClientRect();
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
    }
  };

  // Handle dragging
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging && !isMaximized) {
        setPosition({
          x: e.clientX - dragOffset.x,
          y: e.clientY - dragOffset.y
        });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset, isMaximized]);

  // Handle maximize/restore window
  const handleMaximize = () => {
    setIsMaximized(!isMaximized);
    setIsMinimized(false);
  };
  
  // Function to handle temporary window detach (launch in new window)
  const handleDetach = () => {
    // Instead of creating a popup, navigate to a new route with the email data
    // We'll simulate this by opening a new tab with a URL that would handle this
    // In a real application, you would use React Router navigation
    
    // Create a URL with query parameters for the email data
    const emailParams = new URLSearchParams({
      to: emailTo,
      subject: emailSubject,
      body: emailBody
    }).toString();
    
    // Open a new tab with the email compose route
    window.open(`/email/compose?${emailParams}`, '_blank');
    
    // Close the current email window
    onClose();
  };

  // Handle send actions with Gmail integration
  const handleSendNow = () => {
    if (!emailTo) {
      alert('Please enter a recipient email address');
      return;
    }
    
    // Logic to send email via Gmail
    const mailtoLink = `mailto:${emailTo}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
    
    // Open the default mail client
    window.open(mailtoLink, '_blank');
    
    // Reset modal to minimized state after sending email
    setIsMaximized(false);
    setIsMinimized(true);
    
    console.log('Sending email now');
    alert('Email opened in your default mail client!');
    onClose();
  };

  // Send options and Send Later functionality
  const handleSendOptionsClick = (event: React.MouseEvent<HTMLElement>) => {
    setShowSendOptions(true);
    setSendLaterAnchorEl(event.currentTarget);
  };

  const handleSendOptionsClose = () => {
    setShowSendOptions(false);
    setSendLaterAnchorEl(null);
  };
  
  const handleSendLaterClick = () => {
    setSendLaterSelected(true);
    setShowSendOptions(false);
  };

  const handleSendLaterOptionsClick = (event: React.MouseEvent<HTMLElement>) => {
    setSendLaterAnchorEl(event.currentTarget);
  };

  const handleSendLaterClose = () => {
    setSendLaterAnchorEl(null);
  };

  const handleSendLaterOptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSendLaterOption(event.target.value);
  };

  const handleScheduleSend = () => {
    // Logic to schedule email
    let scheduledTime = '';
    
    switch(sendLaterOption) {
      case '1hour':
        scheduledTime = 'in 1 hour';
        break;
      case '2hours':
        scheduledTime = 'in 2 hours';
        break;
      case 'tomorrow_morning':
        scheduledTime = 'tomorrow morning (8am)';
        break;
      case 'tomorrow_afternoon':
        scheduledTime = 'tomorrow afternoon (1pm)';
        break;
      case 'custom':
        scheduledTime = `on ${customDate} at ${customTime}`;
        break;
    }
    
    console.log(`Email scheduled to be sent ${sendLaterOption === 'custom' ? `on ${customDate} at ${customTime}` : `with option: ${sendLaterOption}`}`);
    
    // Reset modal to minimized state after scheduling email
    setIsMaximized(false);
    setIsMinimized(true);
    
    handleSendLaterClose();
    // Don't close the modal completely, just minimize it
    // onClose();
  };

  if (!open) return null;

  return (
    <>
      {/* Overlay mờ chỉ khi modal được mở rộng (maximize) */}
      {open && isMaximized && (
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 1100,
          }}
        />
      )}
      <Paper
      ref={windowRef}
      sx={{
        position: 'fixed',
        // Khi mở rộng: căn giữa màn hình, khi thu nhỏ: nằm dưới cùng
        top: isMaximized ? '50%' : 'auto',
        left: isMaximized ? '50%' : position.x,
        bottom: isMaximized ? 'auto' : '20px',
        // Dịch chuyển ngược lại 50% kích thước của chính nó để căn giữa
        transform: isMaximized ? 'translate(-50%, -50%)' : 'none',
        // Điều chỉnh kích thước
        width: isMaximized ? '900px' : '550px',
        maxWidth: isMaximized ? '1200px' : '550px',
        // Các style khác giữ nguyên
        display: 'flex',
        flexDirection: 'column',
        boxShadow: isMinimized ? 1 : 3,
        zIndex: 1200,
        visibility: open ? 'visible' : 'hidden',
        opacity: open ? 1 : 0,
        transition: 'all 0.3s ease',
        overflow: 'hidden',
        maxHeight: isMaximized ? '600px' : '450px',
        height: isMinimized ? '48px' : 'auto',
        borderTopLeftRadius: '8px',
        borderTopRightRadius: '8px',
        borderBottomLeftRadius: isMinimized ? '0px' : '8px',
        borderBottomRightRadius: isMinimized ? '0px' : '8px',
        // Responsive
        '@media (min-width: 1800px)': {
          width: isMaximized ? '1100px' : '550px',
          maxWidth: isMaximized ? '1200px' : '550px',
          maxHeight: isMaximized ? '650px' : '450px',
        },
        '@media (min-width: 1600px)': {
          width: isMaximized ? '1000px' : '550px',
          maxHeight: isMaximized ? '600px' : '450px',
        },
        '@media (max-width: 1400px)': {
          width: isMaximized ? '800px' : '550px',
        },
        '@media (max-width: 1200px)': {
          width: isMaximized ? '700px' : '500px',
        },
        '@media (max-width: 992px)': {
          width: isMaximized ? '650px' : '450px',
        }
      }}
    >
      {/* Window header/title bar - Orange theme style */}
      <Box
        sx={{
          bgcolor: '#ff7a59', // Orange HubSpot theme color
          p: 1,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          cursor: 'move',
          userSelect: 'none',
          color: 'white',
          borderTopLeftRadius: '8px',
          borderTopRightRadius: '8px',
          '@media (min-width: 1600px)': {
            width: '100%',
          },
          '@media (max-width: 1200px)': {
            width: isMaximized ? 'calc(100% - 420px)' : '600px',
          },
          '@media (max-width: 900px)': {
            width: isMaximized ? '100%' : '100%',
            right: '0',
            bottom: '0',
            borderRadius: 0
          }
        }}
        onMouseDown={handleMouseDown}
      >
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton size="small" sx={{ color: 'white', mr: 1 }} onClick={() => setIsMinimized(!isMinimized)}>
            {isMinimized ? <ExpandMoreIcon fontSize="small" /> : <MinimizeIcon fontSize="small" />}
          </IconButton>
          <Typography variant="subtitle1" fontWeight="medium">
            New Email
          </Typography>
        </Box>
        <Box>
          <IconButton size="small" sx={{ color: 'white' }} onClick={handleDetach}>
            <LaunchIcon fontSize="small" />
          </IconButton>
          <IconButton size="small" sx={{ color: 'white' }} onClick={handleMaximize}>
            {isMaximized ? <CloseFullscreenIcon fontSize="small" /> : <OpenInFullIcon fontSize="small" />}
          </IconButton>
          <IconButton size="small" sx={{ color: 'white' }} onClick={onClose}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
      </Box>

      {/* Email content */}
      {!isMinimized && (
        <Box sx={{ p: 0, flexGrow: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          {/* Gmail/HubSpot style tabs - Orange theme */}
          <Box sx={{ bgcolor: '#f5f5f5', borderBottom: '1px solid #ddd' }}>
            <Box sx={{ display: 'flex', px: 2, py: 0.5 }}>
              <Typography sx={{ mr: 2, fontWeight: 'bold', fontSize: '13px', color: '#ff7a59' }}>Templates</Typography>
              <Typography sx={{ mr: 2, fontSize: '13px', display: 'flex', alignItems: 'center' }}>
                Sequences <Box component="span" sx={{ ml: 0.5, fontSize: '14px' }}>🔒</Box>
              </Typography>
              <Typography sx={{ mr: 2, fontSize: '13px' }}>Documents</Typography>
              <Typography sx={{ mr: 2, fontSize: '13px', display: 'flex', alignItems: 'center' }}>
                Meetings <ExpandMoreIcon fontSize="small" />
              </Typography>
              <Typography sx={{ fontSize: '13px', display: 'flex', alignItems: 'center' }}>
                Quotes <ExpandMoreIcon fontSize="small" />
              </Typography>
            </Box>
          </Box>
          
          {/* Email form fields - Simplified with underlines instead of boxes */}
          <Box sx={{ p: 1.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
              <Typography sx={{ width: 30, fontSize: '13px', mr: 2 }}>To</Typography>
              <TextField
                fullWidth
                value={emailTo}
                onChange={(e) => setEmailTo(e.target.value)}
                size="small"
                variant="standard"
                placeholder="recipient@example.com"
                sx={{ '& .MuiInputBase-input': { fontSize: '13px' } }}
              />
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
              <Typography sx={{ width: 30, fontSize: '13px', mr: 2 }}>From</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
                <Typography sx={{ fontSize: '13px' }}>
                  Tô Thế Mẫn <Typography component="span" sx={{ color: 'text.secondary', fontSize: '13px' }}>(totheman2@gmail.com)</Typography>
                </Typography>
              </Box>
              <Typography sx={{ fontSize: '13px', color: '#ff7a59', ml: 2, cursor: 'pointer' }}>Cc</Typography>
              <Typography sx={{ fontSize: '13px', color: '#ff7a59', ml: 2, cursor: 'pointer' }}>Bcc</Typography>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
              <Typography sx={{ width: 30, fontSize: '13px', mr: 2}}>Subject</Typography>
              <TextField
                fullWidth
                size="small"
                variant="standard"
                placeholder="Email subject"
                value={emailSubject}
                onChange={(e) => setEmailSubject(e.target.value)}
                sx={{ '& .MuiInputBase-input': { fontSize: '13px' } }}
              />
            </Box>
          </Box>
          
          <Divider />
          
          {/* Message body - Only this area should scroll */}
          <Box sx={{ p: 1.5, flexGrow: 1, display: 'flex', flexDirection: 'column', overflow: 'auto', maxHeight: isMaximized ? '400px' : '200px', '@media (min-width: 1600px)': { maxHeight: isMaximized ? '450px' : '200px' } }}>
            <TextField
              multiline
              placeholder="Type your message here..."
              minRows={3}
              maxRows={isMaximized ? 15 : 8}
              fullWidth
              variant="standard"
              value={emailBody}
              onChange={(e) => setEmailBody(e.target.value)}
              InputProps={{
                disableUnderline: true,
                sx: { p: 0 }
              }}
              sx={{ 
                flexGrow: 1,
                '& .MuiInputBase-root': {
                  height: 'auto',
                  alignItems: 'flex-start',
                  fontSize: '13px'
                },
                '& .MuiInputBase-input': {
                  overflow: 'auto',
                  fontSize: '13px'
                }
              }}
            />
            
            <Divider sx={{ my: 1 }} />

            {/* Formatting toolbar - with functional buttons */}
            <Box sx={{ display: 'flex', alignItems: 'center', borderTop: '1px solid #ddd', pt: 0.5, flexShrink: 0 }}>
              <IconButton size="small" onClick={() => {
                const textarea = document.querySelector('textarea');
                if (textarea) {
                  const start = textarea.selectionStart;
                  const end = textarea.selectionEnd;
                  const selectedText = emailBody.substring(start, end);
                  const newText = emailBody.substring(0, start) + `<b>${selectedText}</b>` + emailBody.substring(end);
                  setEmailBody(newText);
                } else {
                  setEmailBody(prev => `<b>${prev}</b>`);
                }
              }}><FormatBoldIcon fontSize="small" /></IconButton>
              <IconButton size="small" onClick={() => {
                const textarea = document.querySelector('textarea');
                if (textarea) {
                  const start = textarea.selectionStart;
                  const end = textarea.selectionEnd;
                  const selectedText = emailBody.substring(start, end);
                  const newText = emailBody.substring(0, start) + `<i>${selectedText}</i>` + emailBody.substring(end);
                  setEmailBody(newText);
                } else {
                  setEmailBody(prev => `<i>${prev}</i>`);
                }
              }}><FormatItalicIcon fontSize="small" /></IconButton>
              <IconButton size="small" onClick={() => {
                const textarea = document.querySelector('textarea');
                if (textarea) {
                  const start = textarea.selectionStart;
                  const end = textarea.selectionEnd;
                  const selectedText = emailBody.substring(start, end);
                  const newText = emailBody.substring(0, start) + `<u>${selectedText}</u>` + emailBody.substring(end);
                  setEmailBody(newText);
                } else {
                  setEmailBody(prev => `<u>${prev}</u>`);
                }
              }}><FormatUnderlinedIcon fontSize="small" /></IconButton>
              <Typography sx={{ fontSize: '12px', color: '#ff7a59', mx: 1, cursor: 'pointer' }}>More</Typography>
              <IconButton size="small" onClick={() => {
                alert('Attach file functionality would be implemented here');
              }}><AttachFileIcon fontSize="small" /></IconButton>
              <IconButton size="small" onClick={() => {
                alert('Insert image functionality would be implemented here');
              }}><ImageIcon fontSize="small" /></IconButton>
              <Typography sx={{ fontSize: '12px', color: '#ff7a59', mx: 1, cursor: 'pointer' }}>Insert</Typography>
              <IconButton size="small" onClick={() => {
                const url = prompt('Enter URL:');
                if (url) {
                  const textarea = document.querySelector('textarea');
                  if (textarea) {
                    const start = textarea.selectionStart;
                    const end = textarea.selectionEnd;
                    const selectedText = emailBody.substring(start, end);
                    const linkText = selectedText || url;
                    const newText = emailBody.substring(0, start) + 
                      `<a href="${url}">${linkText}</a>` + 
                      emailBody.substring(end);
                    setEmailBody(newText);
                  } else {
                    setEmailBody(prev => `${prev} <a href="${url}">${url}</a>`);
                  }
                }
              }}><LinkIcon fontSize="small" /></IconButton>
              
              <Box sx={{ flexGrow: 1 }} />
              
              <Typography sx={{ fontSize: '12px', color: '#ff7a59', display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                Associated with 1 record <ExpandMoreIcon fontSize="small" />
              </Typography>
            </Box>
          </Box>
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 1, borderTop: '1px solid #ddd' }}>
            <ButtonGroup variant="contained" sx={{ bgcolor: '#ff7a59', '& .MuiButton-contained': { bgcolor: '#ff7a59', '&:hover': { bgcolor: '#ff5c33' } } }}>
              <Button
                onClick={sendLaterSelected ? handleSendLaterOptionsClick : handleSendNow}
                sx={{
                  borderTopRightRadius: 0,
                  borderBottomRightRadius: 0,
                  bgcolor: '#ff7a59',
                  '&:hover': {
                    bgcolor: '#ff5c33',
                  }
                }}
              >
                {sendLaterSelected ? 'Send Later' : 'Send'}
              </Button>
              <Button
                onClick={handleSendOptionsClick}
                sx={{
                  borderTopLeftRadius: 0,
                  borderBottomLeftRadius: 0,
                  bgcolor: '#ff7a59',
                  '&:hover': {
                    bgcolor: '#ff5c33',
                  },
                  minWidth: '30px',
                  width: '30px'
                }}
              >
                <ExpandMoreIcon />
              </Button>
            </ButtonGroup>
            
            {/* Send Options Popover */}
            <Popover
              open={Boolean(sendLaterAnchorEl) && showSendOptions}
              anchorEl={sendLaterAnchorEl}
              onClose={handleSendOptionsClose}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              PaperProps={{
                sx: { width: 200, p: 1 }
              }}
            >
              <MenuItem onClick={handleSendNow} sx={{ py: 1 }}>
                Send Now
              </MenuItem>
              <MenuItem onClick={handleSendLaterClick} sx={{ py: 1 }}>
                Send Later
              </MenuItem>
            </Popover>
            
            {/* Send Later Options Popover */}
            <Popover
              open={Boolean(sendLaterAnchorEl) && !showSendOptions && sendLaterSelected}
              anchorEl={sendLaterAnchorEl}
              onClose={handleSendLaterClose}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              PaperProps={{
                sx: { width: 300, p: 2 }
              }}
            >
              <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 2 }}>
                Send later
              </Typography>
              <FormControl component="fieldset">
                <RadioGroup
                  value={sendLaterOption}
                  onChange={handleSendLaterOptionChange}
                >
                  <FormControlLabel value="1hour" control={<Radio />} label="In 1 hour" />
                  <FormControlLabel value="2hours" control={<Radio />} label="In 2 hours" />
                  <FormControlLabel value="tomorrow_morning" control={<Radio />} label="Tomorrow morning (8am)" />
                  <FormControlLabel value="tomorrow_afternoon" control={<Radio />} label="Tomorrow afternoon (1pm)" />
                  <FormControlLabel value="custom" control={<Radio />} label="Custom" />
                </RadioGroup>
              </FormControl>
              
              {sendLaterOption === 'custom' && (
                <Box sx={{ display: 'flex', gap: 2, mt: 2, mb: 2 }}>
                  <TextField
                    type="date"
                    size="small"
                    value={customDate}
                    onChange={(e) => setCustomDate(e.target.value)}
                    InputProps={{
                      startAdornment: <CalendarIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                    }}
                    sx={{ flex: 1 }}
                  />
                  <TextField
                    type="time"
                    size="small"
                    value={customTime}
                    onChange={(e) => setCustomTime(e.target.value)}
                    sx={{ width: '120px' }}
                  />
                </Box>
              )}
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                <Button
                  variant="contained"
                  onClick={handleScheduleSend}
                  sx={{
                    bgcolor: '#ff7a59',
                    '&:hover': {
                      bgcolor: '#ff5c33',
                    }
                  }}
                >
                  Schedule
                </Button>
                <Button variant="outlined" onClick={handleSendLaterClose}>
                  Cancel
                </Button>
              </Box>
            </Popover>
          </Box>
        </Box>
      )}
    </Paper>
    </>
  );
};

export default EmailWindow;
