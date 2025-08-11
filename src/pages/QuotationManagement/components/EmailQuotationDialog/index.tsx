import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  IconButton,
} from '@mui/material';
import { Close as CloseIcon, Visibility as PreviewIcon, Send as SendIcon } from '@mui/icons-material';

interface EmailQuotationDialogProps {
  open: boolean;
  onClose: () => void;
  onSend: (emailData: {
    to: string;
    cc: string;
    subject: string;
    content: string;
  }) => void;
  customerName: string;
  serviceName: string;
  responsiblePerson: string;
  pdfFileName: string;
}

const EmailQuotationDialog: React.FC<EmailQuotationDialogProps> = ({
  open,
  onClose,
  onSend,
  customerName,
  serviceName,
  responsiblePerson,
  pdfFileName,
}) => {
  const [emailData, setEmailData] = useState({
    to: '',
    cc: '',
    subject: `Báo giá dịch vụ ${serviceName}`,
    content: `Kính gửi Anh/Chị ${customerName || 'Quý khách'},

Innotech Vietnam xin gửi Anh/Chị báo giá cho dịch vụ ${serviceName || 'dịch vụ'} như đính kèm.

Nếu cần thêm thông tin, xin vui lòng liên hệ chúng tôi.

Trân trọng,  
${responsiblePerson || 'Đội ngũ Innotech Vietnam'}`,
  });

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setEmailData(prev => ({
      ...prev,
      [field]: e.target.value,
    }));
  };

  const handleSend = () => {
    onSend(emailData);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">Gửi báo giá cho khách hàng</Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent dividers>
        <Box mb={3}>
          <TextField
            fullWidth
            label="Đến (Email)"
            value={emailData.to}
            onChange={handleChange('to')}
            margin="normal"
            variant="outlined"
          />
          
          <TextField
            fullWidth
            label="CC (Tùy chọn)"
            value={emailData.cc}
            onChange={handleChange('cc')}
            margin="normal"
            variant="outlined"
          />
          
          <TextField
            fullWidth
            label="Tiêu đề"
            value={emailData.subject}
            onChange={handleChange('subject')}
            margin="normal"
            variant="outlined"
          />
          
          <Box mt={2} mb={2} display="flex" alignItems="center">
            <Typography variant="body1" sx={{ mr: 2 }}>
              File đính kèm: {pdfFileName}
            </Typography>
            <IconButton size="small" onClick={() => window.open(`/preview/${pdfFileName}`, '_blank')}>
              <PreviewIcon />
            </IconButton>
          </Box>
          
          <TextField
            fullWidth
            label="Nội dung email"
            value={emailData.content}
            onChange={handleChange('content')}
            margin="normal"
            variant="outlined"
            multiline
            rows={8}
          />
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose}>Hủy</Button>
        <Button
          variant="contained"
          color="primary"
          startIcon={<SendIcon />}
          onClick={handleSend}
          disabled={!emailData.to}
        >
          Gửi email
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EmailQuotationDialog;
