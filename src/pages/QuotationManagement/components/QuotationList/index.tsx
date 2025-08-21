import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TablePagination,
  Paper,
  IconButton,
  Chip,
} from '@mui/material';
import {
  Visibility as ViewIcon,
  Email as EmailIcon,
  PictureAsPdf as PdfIcon,
} from '@mui/icons-material';
import { QuotationListProps, Quotation, QuotationStatus } from '../../types';

const QuotationList: React.FC<QuotationListProps> = ({
  quotations,
  page,
  rowsPerPage,
  totalCount,
  onPageChange,
  onRowsPerPageChange,
  onViewDetail,
  onDownloadPdf,
  onSendEmail,
}) => {
  const { t, i18n } = useTranslation();
  // Helper functions
  const getStatusChip = (status: QuotationStatus) => {
    const statusMap: Record<QuotationStatus, { label: string; color: 'default' | 'info' | 'success' | 'error' }> = {
      draft: { label: t('pages.quotations.status.draft'), color: 'default' },
      sent: { label: t('pages.quotations.status.sent'), color: 'info' },
      approved: { label: t('pages.quotations.status.approved'), color: 'success' },
      rejected: { label: t('pages.quotations.status.rejected'), color: 'error' },
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

  const formatDate = (dateString: string) => {
    const lang = i18n.language || 'en';
    const locale = lang.startsWith('ja') ? 'ja-JP' : lang.startsWith('vi') ? 'vi-VN' : 'en-US';
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return dateString;
    return new Intl.DateTimeFormat(locale, {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).format(date);
  };

  return (
    <>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>{t('pages.quotations.columns.name')}</TableCell>
              <TableCell>{t('pages.quotations.columns.customer')}</TableCell>
              <TableCell>{t('pages.quotations.columns.deal')}</TableCell>
              <TableCell>{t('pages.quotations.columns.status')}</TableCell>
              <TableCell>{t('pages.quotations.columns.createdAt')}</TableCell>
              <TableCell align="right">{t('pages.quotations.columns.effort')}</TableCell>
              <TableCell align="right">{t('pages.quotations.columns.amount')}</TableCell>
              <TableCell align="center">{t('pages.quotations.columns.actions')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {quotations.map((quotation: Quotation) => (
              <TableRow key={quotation.id}>
                <TableCell>{quotation.name}</TableCell>
                <TableCell>{quotation.customer}</TableCell>
                <TableCell>{quotation.dealName}</TableCell>
                <TableCell>{getStatusChip(quotation.status)}</TableCell>
                <TableCell>{formatDate(quotation.createdDate)}</TableCell>
                <TableCell align="right">{quotation.totalEffort}</TableCell>
                <TableCell align="right">{formatCurrency(quotation.totalAmount)}</TableCell>
                <TableCell align="center">
                  <IconButton 
                    size="small" 
                    color="primary" 
                    onClick={() => onViewDetail(quotation.id)}
                    title={t('common.view')}
                  >
                    <ViewIcon fontSize="small" />
                  </IconButton>
                  <IconButton 
                    size="small" 
                    color="secondary" 
                    onClick={() => onDownloadPdf(quotation.id)}
                    title={t('common.download')}
                  >
                    <PdfIcon fontSize="small" />
                  </IconButton>
                  <IconButton 
                    size="small" 
                    color="info" 
                    onClick={() => onSendEmail(quotation.id)}
                    title={t('common.sendEmail')}
                  >
                    <EmailIcon fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {quotations.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  {t('common.noData')}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <TablePagination
          component="div"
          count={totalCount}
          page={page}
          onPageChange={(_, newPage) => onPageChange(_, newPage)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(e: React.ChangeEvent<HTMLInputElement>) => onRowsPerPageChange(e)}
          rowsPerPageOptions={[5, 10, 25]}
          labelRowsPerPage={t('pages.quotations.pagination.rowsPerPage')}
        />
      </TableContainer>
    </>
  );
};

export default QuotationList;
