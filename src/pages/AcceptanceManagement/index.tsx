import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Paper, Tabs, Tab, Button, TextField, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, IconButton, Chip, Dialog,
  DialogTitle, DialogContent, DialogActions, FormControl, InputLabel, Select,
  MenuItem, Grid, Card, CardContent, Snackbar, Alert, Tooltip, Stack, Badge
} from '@mui/material';
import {
  Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, Visibility as ViewIcon,
  Search as SearchIcon, Assignment as AssignmentIcon, CheckCircle as CheckCircleIcon,
  Pending as PendingIcon, Cancel as CancelIcon, Download as DownloadIcon
} from '@mui/icons-material';

// Types
interface AcceptanceTemplate {
  id: string; name: string; code: string; description: string;
  type: 'full' | 'simple' | 'phase'; status: 'active' | 'inactive';
  createdAt: string; usageCount: number;
}

interface AcceptanceReport {
  id: string; name: string; code: string; contractId: string; contractName: string;
  appendixId?: string; appendixName?: string; acceptanceDate: string; value: number;
  status: 'draft' | 'pending' | 'signed' | 'rejected'; signers: string[];
  createdAt: string;
}

type AcceptanceTab = 'templates' | 'reports';

const AcceptanceManagement: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<AcceptanceTab>('templates');
  const [templates, setTemplates] = useState<AcceptanceTemplate[]>([]);
  const [reports, setReports] = useState<AcceptanceReport[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  // Mock data
  useEffect(() => {
    const mockTemplates: AcceptanceTemplate[] = [
      {
        id: 'AT001', name: 'Mẫu nghiệm thu phần mềm', code: 'AT001',
        description: 'Mẫu nghiệm thu cho các dự án phát triển phần mềm',
        type: 'full', status: 'active', createdAt: '2024-01-15', usageCount: 15
      },
      {
        id: 'AT002', name: 'Mẫu nghiệm thu dịch vụ', code: 'AT002',
        description: 'Mẫu nghiệm thu cho các dịch vụ tư vấn',
        type: 'simple', status: 'active', createdAt: '2024-01-10', usageCount: 8
      }
    ];

    const mockReports: AcceptanceReport[] = [
      {
        id: 'NT001', name: 'Nghiệm thu hệ thống CRM', code: 'NT001',
        contractId: 'HD001', contractName: 'Hợp đồng phát triển CRM',
        appendixId: 'PL001', appendixName: 'Phụ lục module quản lý khách hàng',
        acceptanceDate: '2024-02-15', value: 500000000, status: 'signed',
        signers: ['Nguyễn Văn A', 'Trần Thị B'], createdAt: '2024-02-10'
      },
      {
        id: 'NT002', name: 'Nghiệm thu module báo cáo', code: 'NT002',
        contractId: 'HD001', contractName: 'Hợp đồng phát triển CRM',
        appendixId: 'PL002', appendixName: 'Phụ lục module báo cáo',
        acceptanceDate: '2024-02-20', value: 200000000, status: 'pending',
        signers: ['Nguyễn Văn A'], createdAt: '2024-02-18'
      }
    ];

    setTemplates(mockTemplates);
    setReports(mockReports);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': case 'signed': return 'success';
      case 'pending': return 'warning';
      case 'inactive': case 'rejected': return 'error';
      case 'draft': return 'default';
      default: return 'default';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const handleCreate = () => {
    setSnackbar({ 
      open: true, 
      message: currentTab === 'templates' ? 'Tạo mẫu nghiệm thu thành công!' : 'Tạo biên bản nghiệm thu thành công!', 
      severity: 'success' 
    });
    setCreateDialogOpen(false);
  };

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || template.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const filteredReports = reports.filter(report => {
    const matchesSearch = report.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || report.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <Box sx={{ width: '100%', p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 3 }}>
        ✅ Quản lý Nghiệm thu
      </Typography>

      {/* Dashboard Overview */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 3 }}>
        <Box sx={{ flex: '1 1 220px', maxWidth: { xs: '100%', sm: '220px' } }}>
          <Card><CardContent>
            <Typography color="textSecondary" gutterBottom>Tổng số mẫu</Typography>
            <Typography variant="h4">{templates.length}</Typography>
          </CardContent></Card>
        </Box>
        <Box sx={{ flex: '1 1 220px', maxWidth: { xs: '100%', sm: '220px' } }}>
          <Card><CardContent>
            <Typography color="textSecondary" gutterBottom>Biên bản đã ký</Typography>
            <Typography variant="h4" color="success.main">
              {reports.filter(r => r.status === 'signed').length}
            </Typography>
          </CardContent></Card>
        </Box>
        <Box sx={{ flex: '1 1 220px', maxWidth: { xs: '100%', sm: '220px' } }}>
          <Card><CardContent>
            <Typography color="textSecondary" gutterBottom>Chờ ký</Typography>
            <Typography variant="h4" color="warning.main">
              {reports.filter(r => r.status === 'pending').length}
            </Typography>
          </CardContent></Card>
        </Box>
        <Box sx={{ flex: '1 1 220px', maxWidth: { xs: '100%', sm: '220px' } }}>
          <Card><CardContent>
            <Typography color="textSecondary" gutterBottom>Tổng giá trị</Typography>
            <Typography variant="h6">
              {formatCurrency(reports.reduce((sum, r) => sum + r.value, 0))}
            </Typography>
          </CardContent></Card>
        </Box>
      </Box>

      <Paper sx={{ width: '100%' }}>
        <Tabs value={currentTab} onChange={(e, v) => setCurrentTab(v)} sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tab label={<Badge badgeContent={templates.length} color="primary">Mẫu Nghiệm thu</Badge>} value="templates" />
          <Tab label={<Badge badgeContent={reports.length} color="primary">Biên bản Nghiệm thu</Badge>} value="reports" />
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
                <><MenuItem value="draft">Bản nháp</MenuItem><MenuItem value="pending">Chờ ký</MenuItem>
                <MenuItem value="signed">Đã ký</MenuItem><MenuItem value="rejected">Từ chối</MenuItem></>
              )}
            </Select>
          </FormControl>

          <Button variant="contained" startIcon={<AddIcon />} onClick={() => setCreateDialogOpen(true)} sx={{ ml: 'auto' }}>
            {currentTab === 'templates' ? 'Tạo mẫu mới' : 'Tạo nghiệm thu mới'}
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
                      <Chip label={template.type === 'full' ? 'Đầy đủ' : template.type === 'simple' ? 'Đơn giản' : 'Giai đoạn'} size="small" />
                    </TableCell>
                    <TableCell>
                      <Badge badgeContent={template.usageCount} color="primary"><AssignmentIcon /></Badge>
                    </TableCell>
                    <TableCell>
                      <Chip label={template.status === 'active' ? 'Hoạt động' : 'Ngưng'} color={getStatusColor(template.status) as any} size="small" />
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={1}>
                        <Tooltip title="Xem chi tiết"><IconButton size="small"><ViewIcon /></IconButton></Tooltip>
                        <Tooltip title="Sửa"><IconButton size="small"><EditIcon /></IconButton></Tooltip>
                        <Tooltip title="Xóa"><IconButton size="small" color="error"><DeleteIcon /></IconButton></Tooltip>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {/* Reports Tab */}
        {currentTab === 'reports' && (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Mã NT</TableCell>
                  <TableCell>Tên nghiệm thu</TableCell>
                  <TableCell>Hợp đồng</TableCell>
                  <TableCell>Phụ lục</TableCell>
                  <TableCell>Ngày nghiệm thu</TableCell>
                  <TableCell>Giá trị</TableCell>
                  <TableCell>Trạng thái</TableCell>
                  <TableCell>Hành động</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredReports.map((report) => (
                  <TableRow key={report.id}>
                    <TableCell>{report.code}</TableCell>
                    <TableCell>{report.name}</TableCell>
                    <TableCell>
                      <Typography variant="body2">{report.contractName}</Typography>
                      <Typography variant="caption" color="text.secondary">{report.contractId}</Typography>
                    </TableCell>
                    <TableCell>
                      {report.appendixName ? (
                        <><Typography variant="body2">{report.appendixName}</Typography>
                        <Typography variant="caption" color="text.secondary">{report.appendixId}</Typography></>
                      ) : (
                        <Typography variant="body2" color="text.secondary">Không có</Typography>
                      )}
                    </TableCell>
                    <TableCell>{new Date(report.acceptanceDate).toLocaleDateString('vi-VN')}</TableCell>
                    <TableCell>{formatCurrency(report.value)}</TableCell>
                    <TableCell>
                      <Chip 
                        label={report.status === 'draft' ? 'Bản nháp' : report.status === 'pending' ? 'Chờ ký' : report.status === 'signed' ? 'Đã ký' : 'Từ chối'}
                        color={getStatusColor(report.status) as any}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={1}>
                        <Tooltip title="Xem chi tiết"><IconButton size="small"><ViewIcon /></IconButton></Tooltip>
                        <Tooltip title="Tải xuống"><IconButton size="small"><DownloadIcon /></IconButton></Tooltip>
                        {report.status === 'draft' && <Tooltip title="Sửa"><IconButton size="small"><EditIcon /></IconButton></Tooltip>}
                        {report.status === 'pending' && <Tooltip title="Ký"><IconButton size="small" color="success"><CheckCircleIcon /></IconButton></Tooltip>}
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
        <DialogTitle>{currentTab === 'templates' ? 'Tạo mẫu nghiệm thu mới' : 'Tạo biên bản nghiệm thu mới'}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mt: 1 }}>
            <Box sx={{ flex: '1 1 45%', minWidth: '250px' }}>
              <TextField fullWidth label={currentTab === 'templates' ? 'Tên mẫu nghiệm thu' : 'Tên nghiệm thu'} />
            </Box>
            <Box sx={{ flex: '1 1 45%', minWidth: '250px' }}>
              <TextField fullWidth label="Mã" />
            </Box>
            <Box sx={{ flex: '1 1 100%' }}>
              <TextField fullWidth label="Mô tả" multiline rows={3} />
            </Box>
            {currentTab === 'templates' ? (
              <Box sx={{ flex: '1 1 45%', minWidth: '250px' }}>
                <FormControl fullWidth>
                  <InputLabel>Loại</InputLabel>
                  <Select label="Loại">
                    <MenuItem value="full">Đầy đủ</MenuItem>
                    <MenuItem value="simple">Đơn giản</MenuItem>
                    <MenuItem value="phase">Giai đoạn</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            ) : (
              <>
                <Box sx={{ flex: '1 1 45%', minWidth: '250px' }}>
                  <FormControl fullWidth>
                    <InputLabel>Hợp đồng liên kết</InputLabel>
                    <Select label="Hợp đồng liên kết">
                      <MenuItem value="HD001">HD001 - Hợp đồng phát triển CRM</MenuItem>
                      <MenuItem value="HD002">HD002 - Hợp đồng tư vấn</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
                <Box sx={{ flex: '1 1 45%', minWidth: '250px' }}>
                  <FormControl fullWidth>
                    <InputLabel>Phụ lục liên kết</InputLabel>
                    <Select label="Phụ lục liên kết">
                      <MenuItem value="PL001">PL001 - Module quản lý khách hàng</MenuItem>
                      <MenuItem value="PL002">PL002 - Module báo cáo</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              </>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateDialogOpen(false)}>Hủy</Button>
          <Button variant="contained" onClick={handleCreate}>Lưu</Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={() => setSnackbar({...snackbar, open: false})}>
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
};

export default AcceptanceManagement;
