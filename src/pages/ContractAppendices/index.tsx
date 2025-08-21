import React, { useState, useEffect } from 'react';
import { Box, Typography, Tabs, Tab, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, Button, IconButton, Snackbar, Alert } from '@mui/material';
import { Add, Edit, Delete, Visibility } from '@mui/icons-material';
import CreateTemplateDialog from './CreateTemplateDialog';
import CreateAppendixDialog from './CreateAppendixDialog';
import { useTranslation } from 'react-i18next';

// Tab value
type ContractAppendicesTab = 'templates' | 'appendices';

// Interface for appendix template
interface AppendixTemplate {
  id: string;
  name: string;
  description: string;
  type: string;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

// Interface for contract appendix
interface ContractAppendix {
  id: string;
  name: string;
  contractId: string;
  contractName: string;
  status: 'draft' | 'pending' | 'signed' | 'cancelled';
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

const ContractAppendices: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [currentTab, setCurrentTab] = useState<ContractAppendicesTab>('templates');
  const [templates, setTemplates] = useState<AppendixTemplate[]>([]);
  const [appendices, setAppendices] = useState<ContractAppendix[]>([]);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'info' | 'warning';
  }>({ open: false, message: '', severity: 'success' });
  
  // Dialog states
  const [createTemplateDialogOpen, setCreateTemplateDialogOpen] = useState(false);
  const [createAppendixDialogOpen, setCreateAppendixDialogOpen] = useState(false);

  const handleTabChange = (event: React.SyntheticEvent, newValue: ContractAppendicesTab) => {
    setCurrentTab(newValue);
  };
  
  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const handleOpenCreateTemplateDialog = () => {
    setCreateTemplateDialogOpen(true);
  };

  const handleCloseCreateTemplateDialog = () => {
    setCreateTemplateDialogOpen(false);
  };

  const handleOpenCreateAppendixDialog = () => {
    setCreateAppendixDialogOpen(true);
  };

  const handleCloseCreateAppendixDialog = () => {
    setCreateAppendixDialogOpen(false);
  };

  const handleSaveTemplate = (template: Partial<AppendixTemplate>) => {
    // In a real app, this would be an API call
    const newTemplate: AppendixTemplate = {
      id: `T${templates.length + 1}`,
      name: template.name || '',
      description: template.description || '',
      type: template.type || 'extension',
      status: template.status || 'active',
      createdAt: template.createdAt || new Date().toISOString(),
      updatedAt: template.updatedAt || new Date().toISOString(),
      createdBy: template.createdBy || 'Current User'
    };
    
    setTemplates([...templates, newTemplate]);
    setCreateTemplateDialogOpen(false);
    setSnackbar({
      open: true,
      message: t('pages.appendices.notifications.createTemplateSuccess'),
      severity: 'success',
    });
  };

  const handleSaveAppendix = (appendix: Partial<ContractAppendix>, action: 'draft' | 'submit' | 'sign') => {
    // In a real app, this would be an API call
    const newAppendix: ContractAppendix = {
      id: `PL${appendices.length + 1}`,
      name: appendix.name || '',
      contractId: appendix.contractId || '',
      contractName: appendix.contractName || '',
      status: action === 'draft' ? 'draft' : action === 'submit' ? 'pending' : 'signed',
      createdAt: appendix.createdAt || new Date().toISOString(),
      updatedAt: appendix.updatedAt || new Date().toISOString(),
      createdBy: appendix.createdBy || 'Current User'
    };
    
    setAppendices([...appendices, newAppendix]);
    setCreateAppendixDialogOpen(false);
    setSnackbar({
      open: true,
      message:
        action === 'draft'
          ? t('pages.appendices.notifications.saveDraftSuccess')
          : action === 'submit'
          ? t('pages.appendices.notifications.submitSuccess')
          : t('pages.appendices.notifications.signSuccess'),
      severity: 'success',
    });
  };

  // Tải dữ liệu khi component được mount
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // TODO: Replace with actual API call
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock data for templates
        const mockTemplates: AppendixTemplate[] = [
          {
            id: '1',
            name: 'Phụ lục gia hạn hợp đồng',
            description: 'Mẫu phụ lục gia hạn thời gian hợp đồng',
            type: 'extension',
            status: 'active',
            createdAt: '2025-06-30T10:00:00Z',
            updatedAt: '2025-06-30T10:00:00Z',
            createdBy: 'Nguyễn Văn A'
          },
          {
            id: '2',
            name: 'Phụ lục thay đổi giá trị',
            description: 'Mẫu phụ lục thay đổi giá trị hợp đồng',
            type: 'value',
            status: 'active',
            createdAt: '2025-06-29T15:30:00Z',
            updatedAt: '2025-06-29T15:30:00Z',
            createdBy: 'Trần Thị B'
          }
        ];
        
        // Mock data for appendices
        const mockAppendices: ContractAppendix[] = [
          {
            id: 'PL001',
            name: 'Phụ lục gia hạn HĐ-001',
            contractId: 'HĐ-001',
            contractName: 'Hợp đồng mua bán thiết bị',
            status: 'signed',
            createdAt: '2025-07-01T09:00:00Z',
            updatedAt: '2025-07-01T14:30:00Z',
            createdBy: 'Nguyễn Văn A'
          },
          {
            id: 'PL002',
            name: 'Phụ lục thay đổi giá trị HĐ-002',
            contractId: 'HĐ-002',
            contractName: 'Hợp đồng cung cấp dịch vụ',
            status: 'draft',
            createdAt: '2025-07-02T10:15:00Z',
            updatedAt: '2025-07-02T10:15:00Z',
            createdBy: 'Trần Thị B'
          }
        ];
        
        setTemplates(mockTemplates);
        setAppendices(mockAppendices);
      } catch (error) {
        console.error('Error loading data:', error);
        setSnackbar({
          open: true,
          message: t('pages.appendices.notifications.loadError'),
          severity: 'error',
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          {t('pages.appendices.title')}
        </Typography>
      </Box>
      
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs 
          value={currentTab} 
          onChange={handleTabChange}
          aria-label="contract appendices tabs"
        >
          <Tab label={t('pages.appendices.tabs.templates')} value="templates" />
          <Tab label={t('pages.appendices.tabs.appendices')} value="appendices" />
        </Tabs>
      </Box>
      
      {currentTab === 'templates' ? (
        <Paper sx={{ p: 3 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Typography variant="h6" gutterBottom>
              {t('pages.appendices.templates.title')}
            </Typography>
            <Button 
              variant="contained" 
              color="primary"
              startIcon={<Add />}
              onClick={handleOpenCreateTemplateDialog}
            >
              {t('pages.appendices.actions.createTemplate')}
            </Button>
          </Box>
          
          {loading ? (
            <Typography color="textSecondary" paragraph>
              {t('pages.appendices.loading.templates')}
            </Typography>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>{t('pages.appendices.templates.columns.code')}</TableCell>
                    <TableCell>{t('pages.appendices.templates.columns.name')}</TableCell>
                    <TableCell>{t('pages.appendices.templates.columns.description')}</TableCell>
                    <TableCell>{t('pages.appendices.templates.columns.type')}</TableCell>
                    <TableCell>{t('pages.appendices.templates.columns.createdAt')}</TableCell>
                    <TableCell>{t('pages.appendices.templates.columns.status')}</TableCell>
                    <TableCell>{t('pages.appendices.templates.columns.actions')}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {templates.map((template) => (
                    <TableRow 
                      key={template.id} 
                      hover 
                      sx={{ cursor: 'pointer' }}
                    >
                      <TableCell>{template.id}</TableCell>
                      <TableCell>{template.name}</TableCell>
                      <TableCell>{template.description}</TableCell>
                      <TableCell>{template.type}</TableCell>
                      <TableCell>{new Date(template.createdAt).toLocaleDateString(i18n.language)}</TableCell>
                      <TableCell>
                        <Chip 
                          label={template.status === 'active' ? t('pages.appendices.status.active') : t('pages.appendices.status.inactive')}
                          color={template.status === 'active' ? 'success' : 'default'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <IconButton size="small" color="primary" title={t('common.viewDetails')}>
                            <Visibility fontSize="small" />
                          </IconButton>
                          <IconButton size="small" color="secondary" title={t('common.edit')}>
                            <Edit fontSize="small" />
                          </IconButton>
                          <IconButton size="small" color="error" title={t('common.delete')}>
                            <Delete fontSize="small" />
                          </IconButton>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Paper>
      ) : (
        <Paper sx={{ p: 3 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Typography variant="h6" gutterBottom>
              {t('pages.appendices.appendices.title')}
            </Typography>
            <Button 
              variant="contained" 
              color="primary"
              startIcon={<Add />}
              onClick={handleOpenCreateAppendixDialog}
            >
              {t('pages.appendices.actions.createAppendix')}
            </Button>
          </Box>
          
          {loading ? (
            <Typography color="textSecondary" paragraph>
              {t('pages.appendices.loading.appendices')}
            </Typography>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>{t('pages.appendices.appendices.columns.code')}</TableCell>
                    <TableCell>{t('pages.appendices.appendices.columns.name')}</TableCell>
                    <TableCell>{t('pages.appendices.appendices.columns.contractId')}</TableCell>
                    <TableCell>{t('pages.appendices.appendices.columns.contractName')}</TableCell>
                    <TableCell>{t('pages.appendices.appendices.columns.createdAt')}</TableCell>
                    <TableCell>{t('pages.appendices.appendices.columns.status')}</TableCell>
                    <TableCell>{t('pages.appendices.appendices.columns.actions')}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {appendices.map((appendix) => (
                    <TableRow 
                      key={appendix.id} 
                      hover 
                      sx={{ cursor: 'pointer' }}
                    >
                      <TableCell>{appendix.id}</TableCell>
                      <TableCell>{appendix.name}</TableCell>
                      <TableCell>{appendix.contractId}</TableCell>
                      <TableCell>{appendix.contractName}</TableCell>
                      <TableCell>{new Date(appendix.createdAt).toLocaleDateString(i18n.language)}</TableCell>
                      <TableCell>
                        <Chip 
                          label={
                            appendix.status === 'signed' ? t('pages.appendices.status.signed') :
                            appendix.status === 'pending' ? t('pages.appendices.status.pending') :
                            appendix.status === 'draft' ? t('pages.appendices.status.draft') :
                            t('pages.appendices.status.cancelled')
                          }
                          color={
                            appendix.status === 'signed' ? 'success' :
                            appendix.status === 'pending' ? 'warning' :
                            appendix.status === 'draft' ? 'info' :
                            'error'
                          }
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <IconButton size="small" color="primary" title={t('common.viewDetails')}>
                            <Visibility fontSize="small" />
                          </IconButton>
                          <IconButton size="small" color="secondary" title={t('common.edit')}>
                            <Edit fontSize="small" />
                          </IconButton>
                          <IconButton size="small" color="error" title={t('common.delete')}>
                            <Delete fontSize="small" />
                          </IconButton>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Paper>
      )}
      
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={6000} 
        onClose={handleCloseSnackbar}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      {/* Dialogs */}
      <CreateTemplateDialog 
        open={createTemplateDialogOpen}
        onClose={handleCloseCreateTemplateDialog}
        onSave={handleSaveTemplate}
      />

      <CreateAppendixDialog
        open={createAppendixDialogOpen}
        onClose={handleCloseCreateAppendixDialog}
        onSave={handleSaveAppendix}
        templates={templates}
      />
    </Box>
  );
};

export default ContractAppendices;
