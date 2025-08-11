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
import EstimationTable from '../EstimationTable';

const QuotationDetail: React.FC<QuotationDetailProps> = ({
  open,
  onClose,
  quotation,
}) => {
  if (!quotation) return null;

  const getStatusChip = (status: QuotationStatus) => {
    const statusMap: Record<QuotationStatus, { label: string; color: 'default' | 'info' | 'success' | 'error' }> = {
      draft: { label: 'Draft', color: 'default' },
      sent: { label: 'Đã gửi', color: 'info' },
      approved: { label: 'Đã duyệt', color: 'success' },
      rejected: { label: 'Từ chối', color: 'error' },
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
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
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
          <Typography variant="h6">Chi tiết báo giá</Typography>
          {getStatusChip(quotation.status)}
        </Box>
      </DialogTitle>
      <DialogContent>
        <Paper variant="outlined" sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
            Thông tin cơ bản
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
            <Box sx={{ minWidth: '200px', flex: 1 }}>
              <Typography variant="body2" color="text.secondary">Tên báo giá</Typography>
              <Typography variant="body1" sx={{ fontWeight: 'medium' }}>{quotation.name}</Typography>
            </Box>
            <Box sx={{ minWidth: '200px', flex: 1 }}>
              <Typography variant="body2" color="text.secondary">Khách hàng</Typography>
              <Typography variant="body1">{quotation.customer}</Typography>
            </Box>
            <Box sx={{ minWidth: '200px', flex: 1 }}>
              <Typography variant="body2" color="text.secondary">Deal</Typography>
              <Typography variant="body1">{quotation.dealName}</Typography>
            </Box>
            <Box sx={{ minWidth: '200px', flex: 1 }}>
              <Typography variant="body2" color="text.secondary">Requirement</Typography>
              <Typography variant="body1">{quotation.requirementName}</Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mt: 3 }}>
            <Box sx={{ minWidth: '200px', flex: 1 }}>
              <Typography variant="body2" color="text.secondary">Ngày tạo</Typography>
              <Typography variant="body1">{quotation.createdDate}</Typography>
            </Box>
            <Box sx={{ minWidth: '200px', flex: 1 }}>
              <Typography variant="body2" color="text.secondary">Tổng Effort</Typography>
              <Typography variant="body1">{quotation.totalEffort} MD</Typography>
            </Box>
            <Box sx={{ minWidth: '200px', flex: 1 }}>
              <Typography variant="body2" color="text.secondary">Tổng tiền</Typography>
              <Typography variant="body1" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                {formatCurrency(quotation.totalAmount)}
              </Typography>
            </Box>
          </Box>
        </Paper>

        {quotation.note && (
          <Paper variant="outlined" sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
              Ghi chú
            </Typography>
            <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
              {quotation.note}
            </Typography>
          </Paper>
        )}

        <Divider sx={{ my: 3 }} />

        <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main', mb: 2 }}>
          Chi tiết ước tính
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
              Chưa có dữ liệu ước tính.
            </Typography>
          </Paper>
        )}

        {quotation.executiveSummary && (
          <>
            <Divider sx={{ my: 3 }} />
            <Paper variant="outlined" sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                Tóm tắt điều hành
              </Typography>
              <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                {quotation.executiveSummary}
              </Typography>
            </Paper>
          </>
        )}
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose}>Đóng</Button>
        <Button 
          startIcon={<EditIcon />} 
          variant="outlined"
          onClick={() => console.log('Edit quotation')}
        >
          Chỉnh sửa
        </Button>
        <Button 
          startIcon={<PdfIcon />} 
          variant="outlined" 
          color="secondary"
          onClick={() => console.log('Download PDF')}
        >
          Tải PDF
        </Button>
        <Button 
          startIcon={<EmailIcon />} 
          variant="contained" 
          color="primary"
          onClick={() => console.log('Send email')}
        >
          Gửi Email
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default QuotationDetail;
