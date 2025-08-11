import React from 'react';
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
  // Helper functions
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
    <>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Tên báo giá</TableCell>
              <TableCell>Khách hàng</TableCell>
              <TableCell>Deal</TableCell>
              <TableCell>Trạng thái</TableCell>
              <TableCell>Ngày tạo</TableCell>
              <TableCell align="right">Tổng Effort (MD)</TableCell>
              <TableCell align="right">Tổng tiền</TableCell>
              <TableCell align="center">Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {quotations.map((quotation: Quotation) => (
              <TableRow key={quotation.id}>
                <TableCell>{quotation.name}</TableCell>
                <TableCell>{quotation.customer}</TableCell>
                <TableCell>{quotation.dealName}</TableCell>
                <TableCell>{getStatusChip(quotation.status)}</TableCell>
                <TableCell>{quotation.createdDate}</TableCell>
                <TableCell align="right">{quotation.totalEffort}</TableCell>
                <TableCell align="right">{formatCurrency(quotation.totalAmount)}</TableCell>
                <TableCell align="center">
                  <IconButton 
                    size="small" 
                    color="primary" 
                    onClick={() => onViewDetail(quotation.id)}
                    title="Xem chi tiết"
                  >
                    <ViewIcon fontSize="small" />
                  </IconButton>
                  <IconButton 
                    size="small" 
                    color="secondary" 
                    onClick={() => onDownloadPdf(quotation.id)}
                    title="Tải PDF"
                  >
                    <PdfIcon fontSize="small" />
                  </IconButton>
                  <IconButton 
                    size="small" 
                    color="info" 
                    onClick={() => onSendEmail(quotation.id)}
                    title="Gửi Email"
                  >
                    <EmailIcon fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {quotations.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  Không có báo giá nào
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
          labelRowsPerPage="Số hàng mỗi trang:"
        />
      </TableContainer>
    </>
  );
};

export default QuotationList;
