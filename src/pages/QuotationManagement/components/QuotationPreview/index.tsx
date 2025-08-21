import React, { useState, useEffect } from 'react';
import { PdfPageEditor } from '../../../../components/PdfPageEditor';
import { 
  Button, 
  Dialog, 
  DialogActions, 
  DialogContent, 
  DialogTitle, 
  Typography,
  Box 
} from '@mui/material';
import { Save as SaveIcon } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { QuotationPreviewProps } from '../../types';

const QuotationPreview: React.FC<QuotationPreviewProps> = ({
  open,
  onClose,
  quotation,
  onSaveDraft,
  onExportPdf,
}) => {
  const { t, i18n } = useTranslation();
  const [pages, setPages] = useState<string[]>(['']);

  const locale = i18n.language === 'ja' ? 'ja-JP' : i18n.language === 'vi' ? 'vi-VN' : 'en-US';

  useEffect(() => {
    if (quotation) {
      const customPages = (quotation as any).pages;
      if (customPages && Array.isArray(customPages) && customPages.length > 0) {
        setPages(customPages);
      } else {
        setPages([
          `
          <div style="padding: 20mm;">
            <h1 style="text-align: center; margin-bottom: 30px;">${t('pages.quotations.preview.page.heading')}</h1>
            <div style="display: flex; justify-content: space-between; margin-bottom: 20px;">
              <div>
                <p><strong>${t('pages.quotations.preview.page.customer')}:</strong> ${quotation.customer || t('pages.quotations.preview.page.customerDefault')}</p>
                <p><strong>${t('pages.quotations.preview.page.project')}:</strong> ${quotation.name || t('pages.quotations.preview.page.projectDefault')}</p>
              </div>
              <div style="text-align: right;">
                <p><strong>${t('pages.quotations.preview.page.quotationId')}:</strong> ${quotation.id || 'N/A'}</p>
                <p><strong>${t('pages.quotations.preview.page.createdDate')}:</strong> ${new Date(quotation.createdDate || new Date()).toLocaleDateString(locale)}</p>
              </div>
            </div>
            
            <!-- Quotation items table -->
            <div style="margin: 20px 0;">
              <h3>${t('pages.quotations.preview.page.itemsTitle')}</h3>
              <table style="width: 100%; border-collapse: collapse; margin: 15px 0;">
                <thead>
                  <tr style="background-color: #f5f5f5;">
                    <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">${t('pages.quotations.preview.page.columns.stt')}</th>
                    <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">${t('pages.quotations.preview.page.columns.description')}</th>
                    <th style="border: 1px solid #ddd; padding: 8px; text-align: right;">${t('pages.quotations.preview.page.columns.days')}</th>
                    <th style="border: 1px solid #ddd; padding: 8px; text-align: right;">${t('pages.quotations.preview.page.columns.unitPriceVnd')}</th>
                    <th style="border: 1px solid #ddd; padding: 8px; text-align: right;">${t('pages.quotations.preview.page.columns.amountVnd')}</th>
                  </tr>
                </thead>
                <tbody>
                  ${(quotation.items || []).map((item, index) => {
                    const qcEffort = (item as any).qcEffort || 0;
                    const rate = (item as any).rate || 0;
                    const total = qcEffort * rate;
                    const nf = new Intl.NumberFormat(locale);
                    
                    return `
                      <tr>
                        <td style="border: 1px solid #ddd; padding: 8px;">${index + 1}</td>
                        <td style="border: 1px solid #ddd; padding: 8px;">${item.description || ''}</td>
                        <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">${qcEffort}</td>
                        <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">${nf.format(rate)}</td>
                        <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">${nf.format(total)}</td>
                      </tr>
                    `;
                  }).join('')}
                  <tr>
                    <td colspan="4" style="border: 1px solid #ddd; padding: 8px; text-align: right;"><strong>${t('pages.quotations.preview.page.total')}</strong></td>
                    <td style="border: 1px solid #ddd; padding: 8px; text-align: right; font-weight: bold;">
                      ${new Intl.NumberFormat(locale).format((quotation.items || []).reduce((sum, item) => {
                        const qcEffort = (item as any).qcEffort || 0;
                        const rate = (item as any).rate || 0;
                        return sum + (qcEffort * rate);
                      }, 0))} VND
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <div style="margin-top: 30px;">
              <div style="margin-bottom: 20px;">
                <h3>${t('pages.quotations.preview.page.paymentTerms')}</h3>
                <div>${(quotation as any).paymentTerms || t('pages.quotations.preview.page.paymentTermsDefault')}</div>
              </div>
              <div style="margin-top: 60px; display: flex; justify-content: space-between;">
                <div style="text-align: center; width: 50%;">
                  <p><strong>${t('pages.quotations.preview.page.sellerRep')}</strong></p>
                  <p style="font-style: italic; margin-top: 50px;">${t('pages.quotations.preview.page.signNote')}</p>
                </div>
                <div style="text-align: center; width: 50%;">
                  <p><strong>${t('pages.quotations.preview.page.buyerRep')}</strong></p>
                  <p style="font-style: italic; margin-top: 50px;">${t('pages.quotations.preview.page.signNote')}</p>
                </div>
              </div>
            </div>
          </div>
          `
        ]);
      }
    }
  }, [quotation]);

  const handleSave = (updatedPages: string[]) => {
    setPages(updatedPages);
  };

  const handleSaveDraft = () => {
    if (onSaveDraft && quotation) {
      // Create an updated quotation with the pages
      const updatedQuotation = {
        ...quotation,
        // Add pages to the quotation data
        ...(pages.length > 0 && { pages })
      };
      onSaveDraft(updatedQuotation);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xl"
      fullWidth
      sx={{ '& .MuiDialog-paper': { maxWidth: '95%', height: '95vh' } }}
    >
      <DialogTitle>
        <Typography variant="h6">{t('pages.quotations.preview.dialogTitle')}</Typography>
      </DialogTitle>
      <DialogContent sx={{ p: 0, display: 'flex', flexDirection: 'column', height: '100%' }}>
        {quotation ? (
          <PdfPageEditor 
            initialContent={pages}
            onSave={handleSave}
            onExportPdf={() => onExportPdf && onExportPdf(quotation)}
          />
        ) : (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <Typography>{t('pages.quotations.preview.loading')}</Typography>
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit">
          {t('pages.quotations.preview.buttons.close')}
        </Button>
        <Button 
          onClick={handleSaveDraft} 
          variant="contained" 
          color="primary"
          startIcon={<SaveIcon />}
          disabled={!quotation}
        >
          {t('pages.quotations.preview.buttons.saveDraft')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default QuotationPreview;
