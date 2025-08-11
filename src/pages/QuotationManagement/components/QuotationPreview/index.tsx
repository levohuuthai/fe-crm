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
import { QuotationPreviewProps } from '../../types';

const QuotationPreview: React.FC<QuotationPreviewProps> = ({
  open,
  onClose,
  quotation,
  onSaveDraft,
  onExportPdf,
}) => {
  const [pages, setPages] = useState<string[]>(['']);

  useEffect(() => {
    if (quotation) {
      const customPages = (quotation as any).pages;
      if (customPages && Array.isArray(customPages) && customPages.length > 0) {
        setPages(customPages);
      } else {
        setPages([
          `
          <div style="padding: 20mm;">
            <h1 style="text-align: center; margin-bottom: 30px;">BÁO GIÁ DỊCH VỤ</h1>
            <div style="display: flex; justify-content: space-between; margin-bottom: 20px;">
              <div>
                <p><strong>Khách hàng:</strong> ${quotation.customer || 'Quý khách hàng'}</p>
                <p><strong>Dự án:</strong> ${quotation.name || 'Dự án phần mềm'}</p>
              </div>
              <div style="text-align: right;">
                <p><strong>Mã báo giá:</strong> ${quotation.id || 'N/A'}</p>
                <p><strong>Ngày tạo:</strong> ${new Date(quotation.createdDate || new Date()).toLocaleDateString('vi-VN')}</p>
              </div>
            </div>
            
            <!-- Quotation items table -->
            <div style="margin: 20px 0;">
              <h3>CHI TIẾT DỊCH VỤ</h3>
              <table style="width: 100%; border-collapse: collapse; margin: 15px 0;">
                <thead>
                  <tr style="background-color: #f5f5f5;">
                    <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">STT</th>
                    <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Mô tả công việc</th>
                    <th style="border: 1px solid #ddd; padding: 8px; text-align: right;">Số ngày công</th>
                    <th style="border: 1px solid #ddd; padding: 8px; text-align: right;">Đơn giá (VND)</th>
                    <th style="border: 1px solid #ddd; padding: 8px; text-align: right;">Thành tiền (VND)</th>
                  </tr>
                </thead>
                <tbody>
                  ${(quotation.items || []).map((item, index) => {
                    const qcEffort = (item as any).qcEffort || 0;
                    const rate = (item as any).rate || 0;
                    const total = qcEffort * rate;
                    
                    return `
                      <tr>
                        <td style="border: 1px solid #ddd; padding: 8px;">${index + 1}</td>
                        <td style="border: 1px solid #ddd; padding: 8px;">${item.description || ''}</td>
                        <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">${qcEffort}</td>
                        <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">${rate.toLocaleString('vi-VN')}</td>
                        <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">${total.toLocaleString('vi-VN')}</td>
                      </tr>
                    `;
                  }).join('')}
                  <tr>
                    <td colspan="4" style="border: 1px solid #ddd; padding: 8px; text-align: right;"><strong>Tổng cộng:</strong></td>
                    <td style="border: 1px solid #ddd; padding: 8px; text-align: right; font-weight: bold;">
                      ${(quotation.items || []).reduce((sum, item) => {
                        const qcEffort = (item as any).qcEffort || 0;
                        const rate = (item as any).rate || 0;
                        return sum + (qcEffort * rate);
                      }, 0).toLocaleString('vi-VN')} VND
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <div style="margin-top: 30px;">
              <div style="margin-bottom: 20px;">
                <h3>ĐIỀU KHOẢN THANH TOÁN</h3>
                <div>${(quotation as any).paymentTerms || 'Thanh toán 100% khi ký hợp đồng.'}</div>
              </div>
              <div style="margin-top: 60px; display: flex; justify-content: space-between;">
                <div style="text-align: center; width: 50%;">
                  <p><strong>ĐẠI DIỆN BÊN BÁN</strong></p>
                  <p style="font-style: italic; margin-top: 50px;">(Ký, ghi rõ họ tên)</p>
                </div>
                <div style="text-align: center; width: 50%;">
                  <p><strong>ĐẠI DIỆN BÊN MUA</strong></p>
                  <p style="font-style: italic; margin-top: 50px;">(Ký, ghi rõ họ tên)</p>
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
        <Typography variant="h6">Xem trước và chỉnh sửa báo giá</Typography>
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
            <Typography>Đang tải dữ liệu báo giá...</Typography>
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit">
          Đóng
        </Button>
        <Button 
          onClick={handleSaveDraft} 
          variant="contained" 
          color="primary"
          startIcon={<SaveIcon />}
          disabled={!quotation}
        >
          Lưu nháp
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default QuotationPreview;
