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
import { enUS, ja, vi } from 'date-fns/locale';
import { useTranslation } from 'react-i18next';

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
  const { t, i18n } = useTranslation();

  // Payment statuses (localized)
  const paymentStatuses = [
    { value: 'pending', label: t('pages.contracts.createContract.paymentSchedule.status.pending', 'Pending payment') },
    { value: 'waiting', label: t('pages.contracts.createContract.paymentSchedule.status.waiting', 'Awaiting payment') },
    { value: 'paid', label: t('pages.contracts.createContract.paymentSchedule.status.paid', 'Paid') }
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

  const getDateFnsLocale = () => {
    const lang = i18n.language || 'en';
    if (lang.startsWith('ja')) return ja;
    if (lang.startsWith('vi')) return vi;
    return enUS;
  };

  const currencySuffix = () => {
    const lang = i18n.language || 'en';
    if (lang.startsWith('ja')) return 'JPY';
    if (lang.startsWith('vi')) return 'VNĐ';
    return 'USD';
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <IconButton onClick={onBack} sx={{ mr: 1 }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h6">
          {t('pages.contracts.createContract.paymentSchedule.title', 'Payment items')}
        </Typography>
      </Box>
      
      <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
        <Typography variant="body2" color="text.secondary" paragraph>
          {t('pages.contracts.createContract.paymentSchedule.description', 'Add payment milestones for the contract. Each includes condition, amount, payment date, status, and notes.')}
        </Typography>
        
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>{t('pages.contracts.createContract.paymentSchedule.columns.condition', 'Condition')}</TableCell>
                <TableCell>{t('pages.contracts.createContract.paymentSchedule.columns.amount', 'Amount')}</TableCell>
                <TableCell>{t('pages.contracts.createContract.paymentSchedule.columns.paymentDate', 'Payment date')}</TableCell>
                <TableCell>{t('pages.contracts.createContract.paymentSchedule.columns.status', 'Status')}</TableCell>
                <TableCell>{t('pages.contracts.createContract.paymentSchedule.columns.note', 'Note')}</TableCell>
                <TableCell>{t('pages.contracts.createContract.paymentSchedule.columns.delete', 'Delete')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {payments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    <Typography variant="body2" color="text.secondary">
                      {t('pages.contracts.createContract.paymentSchedule.empty', 'No payment items yet. Click "Add payment" to start.')}
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
                        placeholder={t('pages.contracts.createContract.paymentSchedule.placeholders.condition', 'e.g., After signing the contract')}
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
                          endAdornment: <InputAdornment position="end">{currencySuffix()}</InputAdornment>,
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={getDateFnsLocale()}>
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
                        placeholder={t('pages.contracts.createContract.paymentSchedule.placeholders.note', 'Notes')}
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
            {t('pages.contracts.createContract.paymentSchedule.actions.add', 'Add payment')}
          </Button>
        </Box>
      </Paper>
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Button 
          variant="outlined" 
          onClick={onBack}
        >
          {t('common.back', 'Back')}
        </Button>
        <Button 
          variant="contained" 
          color="primary"
          onClick={onNext}
        >
          {t('common.next', 'Next')}
        </Button>
      </Box>
    </Box>
  );
};

export default PaymentScheduleStep;
