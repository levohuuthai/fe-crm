import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
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
  const { t, i18n } = useTranslation();
  const locale = i18n.language && i18n.language.startsWith('ja') ? 'ja-JP' : 'en-US';
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

  const formatCurrency = (amount: number, locale: string) => {
    return new Intl.NumberFormat(locale, { style: 'currency', currency: 'VND' }).format(amount);
  };

  const handleCreate = () => {
    setSnackbar({ 
      open: true, 
      message: currentTab === 'templates' ? t('pages.acceptance.notifications.createTemplateSuccess') : t('pages.acceptance.notifications.createReportSuccess'), 
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
        {t('pages.acceptance.title')}
      </Typography>

      {/* Dashboard Overview */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 3 }}>
        <Box sx={{ flex: '1 1 220px', maxWidth: { xs: '100%', sm: '220px' } }}>
          <Card><CardContent>
            <Typography color="textSecondary" gutterBottom>{t('pages.acceptance.overview.totalTemplates')}</Typography>
            <Typography variant="h4">{templates.length}</Typography>
          </CardContent></Card>
        </Box>
        <Box sx={{ flex: '1 1 220px', maxWidth: { xs: '100%', sm: '220px' } }}>
          <Card><CardContent>
            <Typography color="textSecondary" gutterBottom>{t('pages.acceptance.overview.signedReports')}</Typography>
            <Typography variant="h4" color="success.main">
              {reports.filter(r => r.status === 'signed').length}
            </Typography>
          </CardContent></Card>
        </Box>
        <Box sx={{ flex: '1 1 220px', maxWidth: { xs: '100%', sm: '220px' } }}>
          <Card><CardContent>
            <Typography color="textSecondary" gutterBottom>{t('pages.acceptance.overview.pending')}</Typography>
            <Typography variant="h4" color="warning.main">
              {reports.filter(r => r.status === 'pending').length}
            </Typography>
          </CardContent></Card>
        </Box>
        <Box sx={{ flex: '1 1 220px', maxWidth: { xs: '100%', sm: '220px' } }}>
          <Card><CardContent>
            <Typography color="textSecondary" gutterBottom>{t('pages.acceptance.overview.totalValue')}</Typography>
            <Typography variant="h6">
              {formatCurrency(reports.reduce((sum, r) => sum + r.value, 0), locale)}
            </Typography>
          </CardContent></Card>
        </Box>
      </Box>

      <Paper sx={{ width: '100%' }}>
        <Tabs value={currentTab} onChange={(e, v) => setCurrentTab(v)} sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tab label={<Badge badgeContent={templates.length} color="primary">{t('pages.acceptance.tabs.templates')}</Badge>} value="templates" />
          <Tab label={<Badge badgeContent={reports.length} color="primary">{t('pages.acceptance.tabs.reports')}</Badge>} value="reports" />
        </Tabs>

        {/* Search and Filter Bar */}
        <Box sx={{ p: 2, display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
          <TextField
            placeholder={t('pages.acceptance.searchPlaceholder')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{ startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} /> }}
            sx={{ minWidth: 300 }}
          />
          
          <FormControl sx={{ minWidth: 150 }}>
            <InputLabel>{t('pages.acceptance.filters.status')}</InputLabel>
            <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} label={t('pages.acceptance.filters.status')}>
              <MenuItem value="all">{t('pages.acceptance.filters.all')}</MenuItem>
              {currentTab === 'templates' ? (
                <><MenuItem value="active">{t('pages.acceptance.status.active')}</MenuItem><MenuItem value="inactive">{t('pages.acceptance.status.inactive')}</MenuItem></>
              ) : (
                <><MenuItem value="draft">{t('pages.acceptance.status.draft')}</MenuItem><MenuItem value="pending">{t('pages.acceptance.status.pending')}</MenuItem>
                <MenuItem value="signed">{t('pages.acceptance.status.signed')}</MenuItem><MenuItem value="rejected">{t('pages.acceptance.status.rejected')}</MenuItem></>
              )}
            </Select>
          </FormControl>

          <Button variant="contained" startIcon={<AddIcon />} onClick={() => setCreateDialogOpen(true)} sx={{ ml: 'auto' }}>
            {currentTab === 'templates' ? t('pages.acceptance.actions.createTemplate') : t('pages.acceptance.actions.createReport')}
          </Button>
        </Box>

        {/* Templates Tab */}
        {currentTab === 'templates' && (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>{t('pages.acceptance.templates.columns.code')}</TableCell>
                  <TableCell>{t('pages.acceptance.templates.columns.name')}</TableCell>
                  <TableCell>{t('pages.acceptance.templates.columns.description')}</TableCell>
                  <TableCell>{t('pages.acceptance.templates.columns.type')}</TableCell>
                  <TableCell>{t('pages.acceptance.templates.columns.usage')}</TableCell>
                  <TableCell>{t('pages.acceptance.templates.columns.status')}</TableCell>
                  <TableCell>{t('pages.acceptance.templates.columns.actions')}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredTemplates.map((template) => (
                  <TableRow key={template.id}>
                    <TableCell>{template.code}</TableCell>
                    <TableCell>{template.name}</TableCell>
                    <TableCell>{template.description}</TableCell>
                    <TableCell>
                      <Chip label={template.type === 'full' ? t('pages.acceptance.types.full') : template.type === 'simple' ? t('pages.acceptance.types.simple') : t('pages.acceptance.types.phase')} size="small" />
                    </TableCell>
                    <TableCell>
                      <Badge badgeContent={template.usageCount} color="primary"><AssignmentIcon /></Badge>
                    </TableCell>
                    <TableCell>
                      <Chip label={template.status === 'active' ? t('pages.acceptance.status.active') : t('pages.acceptance.status.inactive')} color={getStatusColor(template.status) as any} size="small" />
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={1}>
                        <Tooltip title={t('common.viewDetails')}><IconButton size="small"><ViewIcon /></IconButton></Tooltip>
                        <Tooltip title={t('common.edit')}><IconButton size="small"><EditIcon /></IconButton></Tooltip>
                        <Tooltip title={t('common.delete')}><IconButton size="small" color="error"><DeleteIcon /></IconButton></Tooltip>
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
                  <TableCell>{t('pages.acceptance.reports.columns.code')}</TableCell>
                  <TableCell>{t('pages.acceptance.reports.columns.name')}</TableCell>
                  <TableCell>{t('pages.acceptance.reports.columns.contract')}</TableCell>
                  <TableCell>{t('pages.acceptance.reports.columns.appendix')}</TableCell>
                  <TableCell>{t('pages.acceptance.reports.columns.acceptanceDate')}</TableCell>
                  <TableCell>{t('pages.acceptance.reports.columns.value')}</TableCell>
                  <TableCell>{t('pages.acceptance.reports.columns.status')}</TableCell>
                  <TableCell>{t('pages.acceptance.reports.columns.actions')}</TableCell>
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
                        <Typography variant="body2" color="text.secondary">{t('pages.acceptance.none')}</Typography>
                      )}
                    </TableCell>
                    <TableCell>{new Date(report.acceptanceDate).toLocaleDateString(locale)}</TableCell>
                    <TableCell>{formatCurrency(report.value, locale)}</TableCell>
                    <TableCell>
                      <Chip 
                        label={report.status === 'draft' ? t('pages.acceptance.status.draft') : report.status === 'pending' ? t('pages.acceptance.status.pending') : report.status === 'signed' ? t('pages.acceptance.status.signed') : t('pages.acceptance.status.rejected')}
                        color={getStatusColor(report.status) as any}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={1}>
                        <Tooltip title={t('common.viewDetails')}><IconButton size="small"><ViewIcon /></IconButton></Tooltip>
                        <Tooltip title={t('common.download')}><IconButton size="small"><DownloadIcon /></IconButton></Tooltip>
                        {report.status === 'draft' && <Tooltip title={t('common.edit')}><IconButton size="small"><EditIcon /></IconButton></Tooltip>}
                        {report.status === 'pending' && <Tooltip title={t('pages.acceptance.actions.sign')}><IconButton size="small" color="success"><CheckCircleIcon /></IconButton></Tooltip>}
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
        <DialogTitle>{currentTab === 'templates' ? t('pages.acceptance.dialogs.createTemplateTitle') : t('pages.acceptance.dialogs.createReportTitle')}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mt: 1 }}>
            <Box sx={{ flex: '1 1 45%', minWidth: '250px' }}>
              <TextField fullWidth label={currentTab === 'templates' ? t('pages.acceptance.dialogs.fields.templateName') : t('pages.acceptance.dialogs.fields.reportName')} />
            </Box>
            <Box sx={{ flex: '1 1 45%', minWidth: '250px' }}>
              <TextField fullWidth label={t('pages.acceptance.dialogs.fields.code')} />
            </Box>
            <Box sx={{ flex: '1 1 100%' }}>
              <TextField fullWidth label={t('pages.acceptance.dialogs.fields.description')} multiline rows={3} />
            </Box>
            {currentTab === 'templates' ? (
              <Box sx={{ flex: '1 1 45%', minWidth: '250px' }}>
                <FormControl fullWidth>
                  <InputLabel>{t('pages.acceptance.dialogs.fields.type')}</InputLabel>
                  <Select label={t('pages.acceptance.dialogs.fields.type')}>
                    <MenuItem value="full">{t('pages.acceptance.types.full')}</MenuItem>
                    <MenuItem value="simple">{t('pages.acceptance.types.simple')}</MenuItem>
                    <MenuItem value="phase">{t('pages.acceptance.types.phase')}</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            ) : (
              <>
                <Box sx={{ flex: '1 1 45%', minWidth: '250px' }}>
                  <FormControl fullWidth>
                    <InputLabel>{t('pages.acceptance.dialogs.fields.linkedContract')}</InputLabel>
                    <Select label={t('pages.acceptance.dialogs.fields.linkedContract')}>
                      <MenuItem value="HD001">HD001 - {t('pages.acceptance.sample.contract1')}</MenuItem>
                      <MenuItem value="HD002">HD002 - {t('pages.acceptance.sample.contract2')}</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
                <Box sx={{ flex: '1 1 45%', minWidth: '250px' }}>
                  <FormControl fullWidth>
                    <InputLabel>{t('pages.acceptance.dialogs.fields.linkedAppendix')}</InputLabel>
                    <Select label={t('pages.acceptance.dialogs.fields.linkedAppendix')}>
                      <MenuItem value="PL001">PL001 - {t('pages.acceptance.sample.appendix1')}</MenuItem>
                      <MenuItem value="PL002">PL002 - {t('pages.acceptance.sample.appendix2')}</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              </>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateDialogOpen(false)}>{t('common.cancel')}</Button>
          <Button variant="contained" onClick={handleCreate}>{t('common.save')}</Button>
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
