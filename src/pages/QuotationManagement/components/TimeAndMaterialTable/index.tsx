import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  IconButton,
  Button,
  Box,
  Typography,
  TableFooter,
  TablePagination,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Tooltip,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { TimeAndMaterialRate } from '../../types/quoteTemplate';

// Các vai trò mặc định
const DEFAULT_ROLES = [
  'Project Manager',
  'Business Analyst',
  'Developer',
  'Tester',
  'UI/UX Designer',
  'DevOps',
  'System Architect',
  'Technical Lead',
];

interface TimeAndMaterialTableProps {
  rates: TimeAndMaterialRate[];
  onRatesChange: (rates: TimeAndMaterialRate[]) => void;
}

const TimeAndMaterialTable: React.FC<TimeAndMaterialTableProps> = ({
  rates = [],
  onRatesChange,
}) => {
  const { t } = useTranslation();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [newRole, setNewRole] = useState('');
  const [customRole, setCustomRole] = useState('');

  // Xử lý thay đổi trang
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  // Xử lý thay đổi số dòng mỗi trang
  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Thêm dòng mới
  const handleAddRow = () => {
    if (!newRole && !customRole) return;
    
    const roleToAdd = newRole === 'custom' ? customRole : newRole;
    
    // Kiểm tra nếu vai trò đã tồn tại
    if (rates.some(rate => rate.role.toLowerCase() === roleToAdd.toLowerCase())) {
      alert(t('pages.quotations.tnm.messages.roleExists'));
      return;
    }

    const newRate: TimeAndMaterialRate = {
      id: `rate-${Date.now()}`,
      role: roleToAdd,
      rate: 0,
      unit: 'hour',
      description: ''
    };

    onRatesChange([...rates, newRate]);
    setNewRole('');
    setCustomRole('');
  };

  // Cập nhật giá trị
  const handleRateChange = (id: string, field: keyof TimeAndMaterialRate, value: any) => {
    const updatedRates = rates.map(rate => 
      rate.id === id ? { ...rate, [field]: value } : rate
    ) as TimeAndMaterialRate[];
    onRatesChange(updatedRates);
  };

  // Xóa dòng
  const handleDeleteRow = (id: string) => {
    onRatesChange(rates.filter(rate => rate.id !== id));
  };

  // Tính tổng tiền
  const calculateTotal = () => {
    return rates.reduce((sum, rate) => {
      return sum + (rate.rate || 0);
    }, 0);
  };

  // Tính tổng số giờ/ngày
  const calculateTotalHours = () => {
    return rates.reduce((sum, rate) => {
      const hours = rate.unit === 'hour' ? 1 : 8; // 1 ngày = 8 giờ
      return sum + (rate.rate || 0) * hours;
    }, 0);
  };

  return (
    <Box>
      {/* Thanh công cụ */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <FormControl variant="outlined" size="small" sx={{ minWidth: 200 }}>
            <InputLabel>{t('pages.quotations.tnm.selectRole')}</InputLabel>
            <Select
              value={newRole}
              onChange={(e) => setNewRole(e.target.value as string)}
              label={t('pages.quotations.tnm.selectRole')}
            >
              <MenuItem value="">
                <em>{t('pages.quotations.tnm.selectRole')}</em>
              </MenuItem>
              {DEFAULT_ROLES.map((role) => (
                <MenuItem key={role} value={role}>
                  {role}
                </MenuItem>
              ))}
              <MenuItem value="custom">
                <em>{t('pages.quotations.tnm.addCustomRole')}</em>
              </MenuItem>
            </Select>
          </FormControl>

          {newRole === 'custom' && (
            <TextField
              size="small"
              label={t('pages.quotations.tnm.roleName')}
              value={customRole}
              onChange={(e) => setCustomRole(e.target.value)}
              sx={{ minWidth: 200 }}
            />
          )}

          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleAddRow}
            disabled={!newRole || (newRole === 'custom' && !customRole.trim())}
          >
            {t('common.add')}
          </Button>
        </Box>
      </Box>

      {/* Bảng dữ liệu */}
      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell width={50}>{t('pages.quotations.preview.table.no')}</TableCell>
              <TableCell>{t('pages.quotations.tnm.columns.role')}</TableCell>
              <TableCell align="right">{t('pages.quotations.tnm.columns.hoursOrMd')}</TableCell>
              <TableCell>{t('pages.quotations.tnm.columns.unit')}</TableCell>
              <TableCell align="right">{t('pages.quotations.tnm.columns.unitPrice')}</TableCell>
              <TableCell align="right">{t('pages.quotations.tnm.columns.amount')}</TableCell>
              <TableCell width={80}></TableCell>
            </TableRow>
          </TableHead>
          
          <TableBody>
            {rates
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((rate, index) => (
                <TableRow key={rate.id} hover>
                  <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                  
                  <TableCell>
                    <TextField
                      value={rate.role}
                      onChange={(e) => handleRateChange(rate.id, 'role', e.target.value)}
                      size="small"
                      fullWidth
                    />
                  </TableCell>
                  
                  <TableCell>
                    <TextField
                      type="number"
                      value={rate.rate || ''}
                      onChange={(e) => handleRateChange(rate.id, 'rate', Number(e.target.value))}
                      size="small"
                      fullWidth
                      inputProps={{ min: 0, step: 0.01 }}
                    />
                  </TableCell>
                  
                  <TableCell>
                    <Select
                      value={rate.unit}
                      onChange={(e) => handleRateChange(rate.id, 'unit', e.target.value)}
                      size="small"
                      fullWidth
                    >
                      <MenuItem value="hour">{t('pages.quotations.tnm.units.hour')}</MenuItem>
                      <MenuItem value="day">{t('pages.quotations.tnm.units.day')}</MenuItem>
                    </Select>
                  </TableCell>
                  
                  <TableCell align="right">
                    {new Intl.NumberFormat('vi-VN', {
                      style: 'currency',
                      currency: 'VND',
                    }).format(rate.rate || 0)}
                    <Typography variant="caption" display="block" color="text.secondary">
                      /{rate.unit === 'hour' ? t('pages.quotations.tnm.perHour') : t('pages.quotations.tnm.perMd')}
                    </Typography>
                  </TableCell>
                  
                  <TableCell align="right">
                    {new Intl.NumberFormat('vi-VN', {
                      style: 'currency',
                      currency: 'VND',
                    }).format(rate.rate * (rate.unit === 'hour' ? 1 : 8) || 0)}
                    <Typography variant="caption" display="block" color="text.secondary">
                      ({rate.unit === 'hour' ? t('pages.quotations.tnm.hourHint') : t('pages.quotations.tnm.mdHint')})
                    </Typography>
                  </TableCell>
                  
                  <TableCell align="center">
                    <Tooltip title={t('common.delete')}>
                      <IconButton 
                        size="small" 
                        color="error"
                        onClick={() => handleDeleteRow(rate.id)}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
          
          {/* Tổng cộng */}
          <TableFooter>
            <TableRow>
              <TableCell colSpan={4} align="right">
                <strong>{t('pages.quotations.tnm.total')}:</strong>
              </TableCell>
              <TableCell align="right">
                <strong>
                  {new Intl.NumberFormat('vi-VN', {
                    style: 'currency',
                    currency: 'VND',
                  }).format(calculateTotal())}
                </strong>
              </TableCell>
              <TableCell align="right">
                <strong>
                  {new Intl.NumberFormat('vi-VN', {
                    style: 'currency',
                    currency: 'VND',
                  }).format(calculateTotalHours())}
                </strong>
                <Typography variant="caption" display="block" color="text.secondary">
                  ({t('pages.quotations.tnm.totalHours', { hours: calculateTotalHours() })})
                </Typography>
              </TableCell>
              <TableCell />
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
      
      {/* Phân trang */}
      <TablePagination
        rowsPerPageOptions={[5, 10, 25, 50]}
        component="div"
        count={rates.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        labelRowsPerPage={t('pages.quotations.pagination.rowsPerPage')}
        labelDisplayedRows={({ from, to, count }) => 
          t('pages.quotations.pagination.displayedRows', { from, to, count })
        }
      />
    </Box>
  );
};

export default TimeAndMaterialTable;
