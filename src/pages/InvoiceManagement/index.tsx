import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Paper, Tabs, Tab, Button, TextField, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, IconButton, Chip, Dialog,
  DialogTitle, DialogContent, DialogActions, FormControl, InputLabel, Select,
  MenuItem, Grid, Card, CardContent, Snackbar, Alert, Tooltip, Stack, Badge,
  LinearProgress,
  InputAdornment
} from '@mui/material';
import {
  Add as AddIcon, Edit as EditIcon, Visibility as ViewIcon, Search as SearchIcon,
  Payment as PaymentIcon, Receipt as ReceiptIcon, Send as SendIcon, Print as PrintIcon,
  CheckCircle as CheckCircleIcon, Warning as WarningIcon, Schedule as ScheduleIcon
} from '@mui/icons-material';

// Types
interface InvoiceTemplate {
  id: string; name: string; code: string; description: string;
  type: 'standard' | 'vat' | 'export'; status: 'active' | 'inactive';
  usageCount: number; defaultTaxRate: number;
}

interface Invoice {
  id: string; name: string; code: string; contractName: string;
  appendixName?: string; customerName: string; issueDate: string; dueDate: string;
  totalAmount: number; paidAmount: number; remainingAmount: number;
  status: 'draft' | 'sent' | 'partial' | 'paid' | 'overdue'; type: 'standard' | 'vat' | 'export';
}

type InvoiceTab = 'templates' | 'invoices';

const InvoiceManagement: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<InvoiceTab>('templates');
  const [templates, setTemplates] = useState<InvoiceTemplate[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  // Mock data
  useEffect(() => {
    const mockTemplates: InvoiceTemplate[] = [
      {
        id: 'IT001', name: 'Mẫu hóa đơn tiêu chuẩn', code: 'IT001',
        description: 'Mẫu hóa đơn cho các giao dịch thông thường',
        type: 'standard', status: 'active', usageCount: 25, defaultTaxRate: 10
      },
      {
        id: 'IT002', name: 'Mẫu hóa đơn VAT', code: 'IT002',
        description: 'Mẫu hóa đơn giá trị gia tăng',
        type: 'vat', status: 'active', usageCount: 18, defaultTaxRate: 10
      }
    ];

    const mockInvoices: Invoice[] = [
      {
        id: 'INV001', name: 'Hóa đơn phát triển CRM - Giai đoạn 1', code: 'INV001',
        contractName: 'Hợp đồng phát triển CRM', appendixName: 'Phụ lục module quản lý khách hàng',
        customerName: 'Công ty ABC', issueDate: '2024-02-01', dueDate: '2024-02-15',
        totalAmount: 500000000, paidAmount: 500000000, remainingAmount: 0,
        status: 'paid', type: 'vat'
      },
      {
        id: 'INV002', name: 'Hóa đơn phát triển CRM - Giai đoạn 2', code: 'INV002',
        contractName: 'Hợp đồng phát triển CRM', appendixName: 'Phụ lục module báo cáo',
        customerName: 'Công ty ABC', issueDate: '2024-02-15', dueDate: '2024-03-01',
        totalAmount: 300000000, paidAmount: 150000000, remainingAmount: 150000000,
        status: 'partial', type: 'vat'
      },
      {
        id: 'INV003', name: 'Hóa đơn tư vấn hệ thống', code: 'INV003',
        contractName: 'Hợp đồng tư vấn', customerName: 'Công ty XYZ',
        issueDate: '2024-01-20', dueDate: '2024-02-05', totalAmount: 100000000,
        paidAmount: 0, remainingAmount: 100000000, status: 'overdue', type: 'standard'
      }
    ];

    setTemplates(mockTemplates);
    setInvoices(mockInvoices);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': case 'paid': return 'success';
      case 'partial': case 'sent': return 'info';
      case 'overdue': return 'error';
      default: return 'default';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const getPaymentProgress = (invoice: Invoice) => {
    return (invoice.paidAmount / invoice.totalAmount) * 100;
  };

  const handleCreate = () => {
    setSnackbar({ 
      open: true, 
      message: currentTab === 'templates' ? 'Tạo mẫu hóa đơn thành công!' : 'Tạo hóa đơn thành công!', 
      severity: 'success' 
    });
    setCreateDialogOpen(false);
  };

  const handlePayment = () => {
    setSnackbar({ open: true, message: 'Ghi nhận thanh toán thành công!', severity: 'success' });
    setPaymentDialogOpen(false);
    setSelectedInvoice(null);
  };

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || template.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = invoice.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         invoice.customerName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || invoice.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Calculate dashboard stats
  const totalValue = invoices.reduce((sum, inv) => sum + inv.totalAmount, 0);
  const totalPaid = invoices.reduce((sum, inv) => sum + inv.paidAmount, 0);
  const overdueCount = invoices.filter(inv => inv.status === 'overdue').length;

  return (
    <Box sx={{ width: '100%', p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 3 }}>
        🧾 Quản lý Hóa đơn
      </Typography>

      {/* Dashboard Overview */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 3 }}>
        <Box sx={{ flex: '1 1 220px', maxWidth: { xs: '100%', sm: '220px' } }}>
          <Card><CardContent>
            <Typography color="textSecondary" gutterBottom>Tổng số hóa đơn</Typography>
            <Typography variant="h4">{invoices.length}</Typography>
          </CardContent></Card>
        </Box>
        <Box sx={{ flex: '1 1 220px', maxWidth: { xs: '100%', sm: '220px' } }}>
          <Card><CardContent>
            <Typography color="textSecondary" gutterBottom>Tổng giá trị</Typography>
            <Typography variant="h6">{formatCurrency(totalValue)}</Typography>
          </CardContent></Card>
        </Box>
        <Box sx={{ flex: '1 1 220px', maxWidth: { xs: '100%', sm: '220px' } }}>
          <Card><CardContent>
            <Typography color="textSecondary" gutterBottom>Đã thanh toán</Typography>
            <Typography variant="h6" color="success.main">{formatCurrency(totalPaid)}</Typography>
            <Typography variant="caption">({((totalPaid/totalValue)*100).toFixed(1)}%)</Typography>
          </CardContent></Card>
        </Box>
        <Box sx={{ flex: '1 1 220px', maxWidth: { xs: '100%', sm: '220px' } }}>
          <Card><CardContent>
            <Typography color="textSecondary" gutterBottom>Quá hạn</Typography>
            <Typography variant="h4" color="error.main">{overdueCount}</Typography>
          </CardContent></Card>
        </Box>
      </Box>

      <Paper sx={{ width: '100%' }}>
        <Tabs value={currentTab} onChange={(e, v) => setCurrentTab(v)} sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tab label={<Badge badgeContent={templates.length} color="primary">Mẫu Hóa Đơn</Badge>} value="templates" />
          <Tab label={<Badge badgeContent={invoices.length} color="primary">Quản lý Hóa Đơn</Badge>} value="invoices" />
        </Tabs>

        {/* Search and Filter Bar */}
        <Box sx={{ p: 2, display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
          <TextField
            placeholder="Tìm kiếm..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{ startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} /> }}
            sx={{ minWidth: 300 }}
          />
          
          <FormControl sx={{ minWidth: 150 }}>
            <InputLabel>Trạng thái</InputLabel>
            <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} label="Trạng thái">
              <MenuItem value="all">Tất cả</MenuItem>
              {currentTab === 'templates' ? (
                <><MenuItem value="active">Hoạt động</MenuItem><MenuItem value="inactive">Ngưng</MenuItem></>
              ) : (
                <><MenuItem value="draft">Bản nháp</MenuItem><MenuItem value="sent">Đã gửi</MenuItem>
                <MenuItem value="partial">TT một phần</MenuItem><MenuItem value="paid">Đã thanh toán</MenuItem>
                <MenuItem value="overdue">Quá hạn</MenuItem></>
              )}
            </Select>
          </FormControl>

          <Button variant="contained" startIcon={<AddIcon />} onClick={() => setCreateDialogOpen(true)} sx={{ ml: 'auto' }}>
            {currentTab === 'templates' ? 'Tạo mẫu mới' : 'Tạo hóa đơn mới'}
          </Button>
        </Box>

        {/* Templates Tab */}
        {currentTab === 'templates' && (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Mã</TableCell>
                  <TableCell>Tên mẫu</TableCell>
                  <TableCell>Mô tả</TableCell>
                  <TableCell>Loại</TableCell>
                  <TableCell>Thuế suất</TableCell>
                  <TableCell>Sử dụng</TableCell>
                  <TableCell>Trạng thái</TableCell>
                  <TableCell>Hành động</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredTemplates.map((template) => (
                  <TableRow key={template.id}>
                    <TableCell>{template.code}</TableCell>
                    <TableCell>{template.name}</TableCell>
                    <TableCell>{template.description}</TableCell>
                    <TableCell>
                      <Chip label={template.type === 'standard' ? 'Tiêu chuẩn' : template.type === 'vat' ? 'VAT' : 'Xuất khẩu'} size="small" />
                    </TableCell>
                    <TableCell>{template.defaultTaxRate}%</TableCell>
                    <TableCell>
                      <Badge badgeContent={template.usageCount} color="primary"><ReceiptIcon /></Badge>
                    </TableCell>
                    <TableCell>
                      <Chip label={template.status === 'active' ? 'Hoạt động' : 'Ngưng'} color={getStatusColor(template.status) as any} size="small" />
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={1}>
                        <Tooltip title="Xem chi tiết"><IconButton size="small"><ViewIcon /></IconButton></Tooltip>
                        <Tooltip title="Sửa"><IconButton size="small"><EditIcon /></IconButton></Tooltip>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {/* Invoices Tab */}
        {currentTab === 'invoices' && (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Mã HĐ</TableCell>
                  <TableCell>Tên hóa đơn</TableCell>
                  <TableCell>Khách hàng</TableCell>
                  <TableCell>Phụ lục</TableCell>
                  <TableCell>Ngày lập</TableCell>
                  <TableCell>Giá trị</TableCell>
                  <TableCell>Tiến độ TT</TableCell>
                  <TableCell>Trạng thái</TableCell>
                  <TableCell>Hành động</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredInvoices.map((invoice) => (
                  <TableRow key={invoice.id}>
                    <TableCell>{invoice.code}</TableCell>
                    <TableCell>
                      <Typography variant="body2">{invoice.name}</Typography>
                      <Typography variant="caption" color="text.secondary">{invoice.contractName}</Typography>
                    </TableCell>
                    <TableCell>{invoice.customerName}</TableCell>
                    <TableCell>
                      {invoice.appendixName ? (
                        <Typography variant="body2">{invoice.appendixName}</Typography>
                      ) : (
                        <Typography variant="body2" color="text.secondary">Không có</Typography>
                      )}
                    </TableCell>
                    <TableCell>{new Date(invoice.issueDate).toLocaleDateString('vi-VN')}</TableCell>
                    <TableCell>{formatCurrency(invoice.totalAmount)}</TableCell>
                    <TableCell>
                      <Box sx={{ width: 100 }}>
                        <LinearProgress variant="determinate" value={getPaymentProgress(invoice)} />
                        <Typography variant="caption">
                          {((invoice.paidAmount/invoice.totalAmount)*100).toFixed(0)}%
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={
                          invoice.status === 'draft' ? 'Bản nháp' :
                          invoice.status === 'sent' ? 'Đã gửi' :
                          invoice.status === 'partial' ? 'TT một phần' :
                          invoice.status === 'paid' ? 'Đã thanh toán' : 'Quá hạn'
                        }
                        color={getStatusColor(invoice.status) as any}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={1}>
                        <Tooltip title="Xem chi tiết"><IconButton size="small"><ViewIcon /></IconButton></Tooltip>
                        <Tooltip title="In hóa đơn"><IconButton size="small"><PrintIcon /></IconButton></Tooltip>
                        {(invoice.status === 'sent' || invoice.status === 'partial' || invoice.status === 'overdue') && (
                          <Tooltip title="Ghi nhận thanh toán">
                            <IconButton size="small" color="success" onClick={() => { setSelectedInvoice(invoice); setPaymentDialogOpen(true); }}>
                              <PaymentIcon />
                            </IconButton>
                          </Tooltip>
                        )}
                        <Tooltip title="Gửi email"><IconButton size="small"><SendIcon /></IconButton></Tooltip>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>

      {/* Create Dialog */}
      <Dialog open={createDialogOpen} onClose={() => setCreateDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>{currentTab === 'templates' ? 'Tạo mẫu hóa đơn mới' : 'Tạo hóa đơn mới'}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mt: 1 }}>
            <Box sx={{ flex: '1 1 45%', minWidth: '250px' }}>
              <TextField fullWidth label={currentTab === 'templates' ? 'Tên mẫu hóa đơn' : 'Tên hóa đơn'} />
            </Box>
            <Box sx={{ flex: '1 1 45%', minWidth: '250px' }}>
              <TextField fullWidth label="Mã" />
            </Box>
            <Box sx={{ flex: '1 1 100%' }}>
              <TextField fullWidth label="Mô tả" multiline rows={3} />
            </Box>
            {currentTab === 'templates' ? (
              <Box sx={{ flex: '1 1 45%', minWidth: '250px' }}>
                <TextField 
                  fullWidth 
                  label="Thuế suất (%)"
                  type="number"
                  defaultValue="10"
                  InputProps={{
                    endAdornment: <InputAdornment position="end">%</InputAdornment>,
                  }}
                />
              </Box>
            ) : (
              <>
                <Box sx={{ flex: '1 1 45%', minWidth: '250px' }}>
                  <FormControl fullWidth>
                    <InputLabel>Mẫu hóa đơn</InputLabel>
                    <Select label="Mẫu hóa đơn">
                      <MenuItem value="INV-TEMP-001">Mẫu hóa đơn chuẩn</MenuItem>
                      <MenuItem value="INV-TEMP-002">Mẫu hóa đơn đơn giản</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
                <Box sx={{ flex: '1 1 45%', minWidth: '250px' }}>
                  <FormControl fullWidth>
                    <InputLabel>Biên bản nghiệm thu</InputLabel>
                    <Select label="Biên bản nghiệm thu">
                      <MenuItem value="ACC-001">Nghiệm thu module CRM - Giai đoạn 1</MenuItem>
                      <MenuItem value="ACC-002">Nghiệm thu module báo cáo</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
                <Box sx={{ flex: '1 1 100%' }}>
                  <TextField 
                    fullWidth 
                    label="Giá trị"
                    type="number"
                    defaultValue="10000000"
                    InputProps={{
                      startAdornment: <InputAdornment position="start">VND</InputAdornment>,
                    }}
                  />
                </Box>
                <Box sx={{ flex: '1 1 45%', minWidth: '250px' }}>
                  <TextField
                    fullWidth
                    label="Ngày phát hành"
                    type="date"
                    defaultValue={new Date().toISOString().split('T')[0]}
                    InputLabelProps={{ shrink: true }}
                  />
                </Box>
                <Box sx={{ flex: '1 1 45%', minWidth: '250px' }}>
                  <TextField
                    fullWidth
                    label="Ngày đến hạn"
                    type="date"
                    defaultValue={new Date(Date.now() + 30*24*60*60*1000).toISOString().split('T')[0]}
                    InputLabelProps={{ shrink: true }}
                  />
                </Box>
              </>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateDialogOpen(false)}>Hủy</Button>
          {currentTab === 'invoices' && <Button variant="outlined">Lưu nháp</Button>}
          <Button variant="contained" onClick={handleCreate}>Lưu</Button>
        </DialogActions>
      </Dialog>

      {/* Payment Dialog */}
      <Dialog open={paymentDialogOpen} onClose={() => setPaymentDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Ghi nhận thanh toán</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mt: 1 }}>
            <Box sx={{ flex: '1 1 45%', minWidth: '250px' }}>
              <TextField
                fullWidth
                label="Ngày thanh toán"
                type="date"
                defaultValue={new Date().toISOString().split('T')[0]}
                InputLabelProps={{ shrink: true }}
              />
            </Box>
            <Box sx={{ flex: '1 1 45%', minWidth: '250px' }}>
              <TextField 
                fullWidth 
                label="Số tiền"
                type="number"
                defaultValue="5000000"
                InputProps={{
                  startAdornment: <InputAdornment position="start">VND</InputAdornment>,
                }}
              />
            </Box>
            <Box sx={{ flex: '1 1 100%' }}>
              <FormControl fullWidth>
                <InputLabel>Phương thức thanh toán</InputLabel>
                <Select label="Phương thức thanh toán" defaultValue="bank">
                  <MenuItem value="bank">Chuyển khoản ngân hàng</MenuItem>
                  <MenuItem value="cash">Tiền mặt</MenuItem>
                  <MenuItem value="card">Thẻ tín dụng</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Box sx={{ flex: '1 1 100%' }}>
              <TextField fullWidth label="Ghi chú" multiline rows={2} />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPaymentDialogOpen(false)}>Hủy</Button>
          <Button variant="contained" onClick={handlePayment}>Ghi nhận</Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={() => setSnackbar({...snackbar, open: false})}>
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
};

export default InvoiceManagement;
