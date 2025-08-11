import React from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  IconButton,
  MenuItem,
  Select,
  FormControl,
  InputAdornment
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon, ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { vi } from 'date-fns/locale';

// Định nghĩa kiểu dữ liệu cho đợt thanh toán
export interface PaymentItem {
  id: string;
  condition: string;
  amount: number;
  paymentDate: Date | null;
  status: 'pending' | 'waiting' | 'paid';
  note: string;
}

interface PaymentScheduleStepProps {
  payments: PaymentItem[];
  onPaymentsChange: (payments: PaymentItem[]) => void;
  onBack: () => void;
  onNext: () => void;
}

const PaymentScheduleStep: React.FC<PaymentScheduleStepProps> = ({
  payments,
  onPaymentsChange,
  onBack,
  onNext
}) => {
  // Định nghĩa các trạng thái thanh toán
  const paymentStatuses = [
    { value: 'pending', label: 'Chưa thanh toán' },
    { value: 'waiting', label: 'Chờ thanh toán' },
    { value: 'paid', label: 'Đã thanh toán' }
  ];

  // Hàm thêm đợt thanh toán mới
  const handleAddPayment = () => {
    const newPayment: PaymentItem = {
      id: `payment-${Date.now()}`,
      condition: '',
      amount: 0,
      paymentDate: new Date(),
      status: 'pending',
      note: ''
    };
    onPaymentsChange([...payments, newPayment]);
  };

  // Hàm xóa đợt thanh toán
  const handleDeletePayment = (id: string) => {
    onPaymentsChange(payments.filter(payment => payment.id !== id));
  };

  // Hàm cập nhật thông tin đợt thanh toán
  const handlePaymentChange = (id: string, field: keyof PaymentItem, value: any) => {
    onPaymentsChange(
      payments.map(payment => 
        payment.id === id ? { ...payment, [field]: value } : payment
      )
    );
  };

  // Không cần hàm formatCurrency vì đã xử lý trực tiếp trong TextField

  // Hàm xử lý khi người dùng nhập số tiền
  const handleAmountChange = (id: string, value: string) => {
    // Loại bỏ tất cả các ký tự không phải số
    const numericValue = value.replace(/[^0-9]/g, '');
    const amount = numericValue ? parseInt(numericValue, 10) : 0;
    handlePaymentChange(id, 'amount', amount);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <IconButton onClick={onBack} sx={{ mr: 1 }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h6">
          Hạng mục thanh toán
        </Typography>
      </Box>
      
      <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
        <Typography variant="body2" color="text.secondary" paragraph>
          Thêm các đợt thanh toán cho hợp đồng. Mỗi đợt thanh toán bao gồm điều kiện, số tiền, ngày thanh toán, trạng thái và ghi chú.
        </Typography>
        
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Điều kiện</TableCell>
                <TableCell>Số tiền</TableCell>
                <TableCell>Ngày thanh toán</TableCell>
                <TableCell>Trạng thái</TableCell>
                <TableCell>Ghi chú</TableCell>
                <TableCell>Xóa</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {payments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    <Typography variant="body2" color="text.secondary">
                      Chưa có đợt thanh toán nào. Nhấn "Thêm đợt thanh toán" để bắt đầu.
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                payments.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell>
                      <TextField
                        fullWidth
                        size="small"
                        value={payment.condition}
                        onChange={(e) => handlePaymentChange(payment.id, 'condition', e.target.value)}
                        placeholder="Ví dụ: Sau khi ký HĐ"
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        fullWidth
                        size="small"
                        value={payment.amount === 0 ? '' : payment.amount.toString()}
                        onChange={(e) => handleAmountChange(payment.id, e.target.value)}
                        placeholder="0"
                        InputProps={{
                          endAdornment: <InputAdornment position="end">VNĐ</InputAdornment>,
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={vi}>
                        <DatePicker
                          value={payment.paymentDate}
                          onChange={(date) => handlePaymentChange(payment.id, 'paymentDate', date)}
                          slotProps={{ textField: { size: 'small', fullWidth: true } }}
                        />
                      </LocalizationProvider>
                    </TableCell>
                    <TableCell>
                      <FormControl fullWidth size="small">
                        <Select
                          value={payment.status}
                          onChange={(e) => handlePaymentChange(payment.id, 'status', e.target.value)}
                        >
                          {paymentStatuses.map((status) => (
                            <MenuItem key={status.value} value={status.value}>
                              {status.label}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </TableCell>
                    <TableCell>
                      <TextField
                        fullWidth
                        size="small"
                        value={payment.note}
                        onChange={(e) => handlePaymentChange(payment.id, 'note', e.target.value)}
                        placeholder="Ghi chú"
                      />
                    </TableCell>
                    <TableCell>
                      <IconButton 
                        color="error" 
                        onClick={() => handleDeletePayment(payment.id)}
                        size="small"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
        
        <Box sx={{ mt: 2 }}>
          <Button
            startIcon={<AddIcon />}
            variant="outlined"
            onClick={handleAddPayment}
          >
            Thêm đợt thanh toán
          </Button>
        </Box>
      </Paper>
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Button 
          variant="outlined" 
          onClick={onBack}
        >
          Quay lại
        </Button>
        <Button 
          variant="contained" 
          color="primary"
          onClick={onNext}
        >
          Tiếp tục
        </Button>
      </Box>
    </Box>
  );
};

export default PaymentScheduleStep;
