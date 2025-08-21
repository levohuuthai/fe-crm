import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();
  const [emailData, setEmailData] = useState({
    to: '',
    cc: '',
    subject: t('pages.quotations.emailDialog.defaultSubject', { serviceName }),
    content: t('pages.quotations.emailDialog.defaultContent', {
      customerName: customerName || t('pages.quotations.emailDialog.dearCustomer'),
      serviceName: serviceName || t('pages.quotations.emailDialog.theService'),
      responsiblePerson: responsiblePerson || t('pages.quotations.emailDialog.teamSignature'),
      interpolation: { escapeValue: false },
    }),
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
          <Typography variant="h6">{t('pages.quotations.emailDialog.title')}</Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent dividers>
        <Box mb={3}>
          <TextField
            fullWidth
            label={t('pages.quotations.emailDialog.to')}
            value={emailData.to}
            onChange={handleChange('to')}
            margin="normal"
            variant="outlined"
          />
          
          <TextField
            fullWidth
            label={t('pages.quotations.emailDialog.ccOptional')}
            value={emailData.cc}
            onChange={handleChange('cc')}
            margin="normal"
            variant="outlined"
          />
          
          <TextField
            fullWidth
            label={t('pages.quotations.emailDialog.subject')}
            value={emailData.subject}
            onChange={handleChange('subject')}
            margin="normal"
            variant="outlined"
          />
          
          <Box mt={2} mb={2} display="flex" alignItems="center">
            <Typography variant="body1" sx={{ mr: 2 }}>
              {t('pages.quotations.emailDialog.attachment')}: {pdfFileName}
            </Typography>
            <IconButton size="small" onClick={() => window.open(`/preview/${pdfFileName}`, '_blank')}>
              <PreviewIcon />
            </IconButton>
          </Box>
          
          <TextField
            fullWidth
            label={t('pages.quotations.emailDialog.content')}
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
        <Button onClick={onClose}>{t('common.cancel')}</Button>
        <Button
          variant="contained"
          color="primary"
          startIcon={<SendIcon />}
          onClick={handleSend}
          disabled={!emailData.to}
        >
          {t('common.sendEmail')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EmailQuotationDialog;
