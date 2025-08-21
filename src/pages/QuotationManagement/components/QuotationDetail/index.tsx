import React from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Paper,
  Grid,
  Chip,
  Divider,
} from '@mui/material';
import {
  PictureAsPdf as PdfIcon,
  Email as EmailIcon,
  Edit as EditIcon,
} from '@mui/icons-material';
import { QuotationDetailProps, QuotationStatus } from '../../types';
import { useTranslation } from 'react-i18next';
import EstimationTable from '../EstimationTable';

const QuotationDetail: React.FC<QuotationDetailProps> = ({
  open,
  onClose,
  quotation,
}) => {
  const { t, i18n } = useTranslation();
  if (!quotation) return null;

  const getStatusChip = (status: QuotationStatus) => {
    const statusMap: Record<QuotationStatus, { label: string; color: 'default' | 'info' | 'success' | 'error' }> = {
      draft: { label: t('pages.quotations.status.draft', 'Draft'), color: 'default' },
      sent: { label: t('pages.quotations.status.sent', 'Sent'), color: 'info' },
      approved: { label: t('pages.quotations.status.approved', 'Approved'), color: 'success' },
      rejected: { label: t('pages.quotations.status.rejected', 'Rejected'), color: 'error' },
    };

    const statusInfo = statusMap[status];
    return (
      <Chip 
        label={statusInfo.label} 
        color={statusInfo.color}
        size="small"
      />
    );
  };

  const formatCurrency = (amount: number) => {
    const lang = i18n.language || 'en';
    const { locale, currency } =
      lang.startsWith('ja')
        ? { locale: 'ja-JP', currency: 'JPY' }
        : lang.startsWith('vi')
        ? { locale: 'vi-VN', currency: 'VND' }
        : { locale: 'en-US', currency: 'USD' };
    return new Intl.NumberFormat(locale, { style: 'currency', currency }).format(amount);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
    >
      <DialogTitle>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">{t('pages.quotations.detail.title', 'Quotation details')}</Typography>
          {getStatusChip(quotation.status)}
        </Box>
      </DialogTitle>
      <DialogContent>
        <Paper variant="outlined" sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
            {t('pages.quotations.detail.basicInfo', 'Basic information')}
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
            <Box sx={{ minWidth: '200px', flex: 1 }}>
              <Typography variant="body2" color="text.secondary">{t('pages.quotations.detail.fields.name', 'Quotation name')}</Typography>
              <Typography variant="body1" sx={{ fontWeight: 'medium' }}>{quotation.name}</Typography>
            </Box>
            <Box sx={{ minWidth: '200px', flex: 1 }}>
              <Typography variant="body2" color="text.secondary">{t('pages.quotations.detail.fields.customer', 'Customer')}</Typography>
              <Typography variant="body1">{quotation.customer}</Typography>
            </Box>
            <Box sx={{ minWidth: '200px', flex: 1 }}>
              <Typography variant="body2" color="text.secondary">{t('pages.quotations.detail.fields.deal', 'Deal')}</Typography>
              <Typography variant="body1">{quotation.dealName}</Typography>
            </Box>
            <Box sx={{ minWidth: '200px', flex: 1 }}>
              <Typography variant="body2" color="text.secondary">{t('pages.quotations.detail.fields.requirement', 'Requirement')}</Typography>
              <Typography variant="body1">{quotation.requirementName}</Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mt: 3 }}>
            <Box sx={{ minWidth: '200px', flex: 1 }}>
              <Typography variant="body2" color="text.secondary">{t('pages.quotations.detail.fields.createdDate', 'Created date')}</Typography>
              <Typography variant="body1">{quotation.createdDate}</Typography>
            </Box>
            <Box sx={{ minWidth: '200px', flex: 1 }}>
              <Typography variant="body2" color="text.secondary">{t('pages.quotations.detail.fields.totalEffort', 'Total effort')}</Typography>
              <Typography variant="body1">{quotation.totalEffort} MD</Typography>
            </Box>
            <Box sx={{ minWidth: '200px', flex: 1 }}>
              <Typography variant="body2" color="text.secondary">{t('pages.quotations.detail.fields.totalAmount', 'Total amount')}</Typography>
              <Typography variant="body1" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                {formatCurrency(quotation.totalAmount)}
              </Typography>
            </Box>
          </Box>
        </Paper>

        {quotation.note && (
          <Paper variant="outlined" sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
              {t('pages.quotations.detail.note', 'Note')}
            </Typography>
            <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
              {quotation.note}
            </Typography>
          </Paper>
        )}

        <Divider sx={{ my: 3 }} />

        <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main', mb: 2 }}>
          {t('pages.quotations.detail.estimateTitle', 'Estimation details')}
        </Typography>
        {quotation.items && quotation.items.length > 0 ? (
          <EstimationTable 
            items={quotation.items} 
            onItemsChange={() => {}} 
            readOnly={true} 
          />
        ) : (
          <Paper variant="outlined" sx={{ p: 2 }}>
            <Typography variant="body1" color="text.secondary">
              {t('pages.quotations.detail.noEstimateData', 'No estimation data.')}
            </Typography>
          </Paper>
        )}

        {quotation.executiveSummary && (
          <>
            <Divider sx={{ my: 3 }} />
            <Paper variant="outlined" sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                {t('pages.quotations.detail.executiveSummary', 'Executive summary')}
              </Typography>
              <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                {quotation.executiveSummary}
              </Typography>
            </Paper>
          </>
        )}
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose}>{t('common.close', 'Close')}</Button>
        <Button 
          startIcon={<EditIcon />} 
          variant="outlined"
          onClick={() => console.log('Edit quotation')}
        >
          {t('common.edit', 'Edit')}
        </Button>
        <Button 
          startIcon={<PdfIcon />} 
          variant="outlined" 
          color="secondary"
          onClick={() => console.log('Download PDF')}
        >
          {t('common.downloadPdf', 'Download PDF')}
        </Button>
        <Button 
          startIcon={<EmailIcon />} 
          variant="contained" 
          color="primary"
          onClick={() => console.log('Send email')}
        >
          {t('pages.quotations.detail.actions.sendEmail', 'Send Email')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default QuotationDetail;
