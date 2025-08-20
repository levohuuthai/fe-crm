import React, { useState, useEffect } from 'react';
import { Box, Typography, Snackbar, Alert, Tabs, Tab, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, Button, IconButton, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { Visibility, Delete, FileDownload, Add, Close, ArrowBack } from '@mui/icons-material';
import TemplateList from './components/TemplateList';
import UploadTemplate from './components/UploadTemplate';
import CreateContract from './components/CreateContract';
import ContractDetail from './components/ContractDetail';
import { UploadTemplateFormValues } from './components/UploadTemplate/types';
import { useTranslation } from 'react-i18next';

// Import interface Template từ TemplateList/types.ts
import { Template as TemplateType } from './components/TemplateList/types';

// Mở rộng interface Template để phù hợp với TemplateList/types.ts
interface Template extends TemplateType {
  description?: string;
  extractedFields?: any[];
}

// Interface cho hợp đồng
interface Contract {
  id: string;
  name: string;
  templateId: string;
  templateName: string;
  status: 'draft' | 'pending' | 'signed' | 'expired' | 'cancelled';
  partyA: string;
  partyB: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  signedAt?: string;
  expiresAt?: string;
}

// Tab value
type ContractTab = 'templates' | 'contracts';

const ContractManagement: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [currentTab, setCurrentTab] = useState<ContractTab>('templates');
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [createContractOpen, setCreateContractOpen] = useState(false);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [contractToDelete, setContractToDelete] = useState<string | null>(null);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'info' | 'warning';
  }>({ open: false, message: '', severity: 'success' });

  const handleOpenUploadDialog = () => {
    setUploadDialogOpen(true);
  };

  const handleCloseUploadDialog = () => {
    setUploadDialogOpen(false);
  };

  // Tải dữ liệu khi component được mount
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // TODO: Replace with actual API call
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock data
        const mockTemplates: Template[] = [
          {
            id: '1',
            name: 'Hợp đồng mua bán',
            description: 'Template hợp đồng mua bán hàng hóa',
            type: 'customer',
            status: 'active',
            createdAt: '2025-06-30T10:00:00Z',
            updatedAt: '2025-06-30T10:00:00Z',
            createdBy: 'Nguyễn Văn A',
            placeholderCount: 8,
            isDefault: true,
            extractedFields: []
          },
          {
            id: '2',
            name: 'Hợp đồng dịch vụ',
            description: 'Template hợp đồng cung cấp dịch vụ',
            type: 'internal',
            status: 'active',
            createdAt: '2025-06-29T15:30:00Z',
            updatedAt: '2025-06-29T15:30:00Z',
            createdBy: 'Trần Thị B',
            placeholderCount: 5,
            isDefault: false,
            extractedFields: []
          }
        ];
        
        setTemplates(mockTemplates);
      } catch (error) {
        console.error('Error fetching templates:', error);
        setSnackbar({
          open: true,
          message: t('pages.contracts.notifications.loadError'),
          severity: 'error',
        });
      }
      
      // Tải dữ liệu hợp đồng mẫu
      try {
        const mockContracts: Contract[] = [
          {
            id: 'C001',
            name: 'Hợp đồng mua bán số 2025/001',
            templateId: '1',
            templateName: 'Hợp đồng mua bán',
            status: 'signed',
            partyA: 'Công ty TNHH ABC',
            partyB: 'Ông Nguyễn Văn A',
            createdAt: '2025-07-01T09:00:00Z',
            updatedAt: '2025-07-01T09:30:00Z',
            createdBy: 'Nguyễn Văn B',
            signedAt: '2025-07-01T10:00:00Z',
            expiresAt: '2025-12-31T23:59:59Z'
          },
          {
            id: 'C002',
            name: 'Hợp đồng dịch vụ số 2025/002',
            templateId: '2',
            templateName: 'Hợp đồng dịch vụ',
            status: 'pending',
            partyA: 'Công ty TNHH ABC',
            partyB: 'Công ty TNHH XYZ',
            createdAt: '2025-07-02T14:00:00Z',
            updatedAt: '2025-07-02T14:30:00Z',
            createdBy: 'Trần Thị C'
          },
          {
            id: 'C003',
            name: 'Hợp đồng thuê nhà số 2025/003',
            templateId: '3',
            templateName: 'Hợp đồng thuê nhà',
            status: 'draft',
            partyA: 'Công ty TNHH ABC',
            partyB: 'Bà Lê Thị D',
            createdAt: '2025-07-03T10:00:00Z',
            updatedAt: '2025-07-03T10:15:00Z',
            createdBy: 'Nguyễn Văn B',
            expiresAt: '2026-07-02T23:59:59Z'
          }
        ];
        
        setContracts(mockContracts);
      } catch (error) {
        console.error('Error loading contracts:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const handleUploadTemplate = async (values: UploadTemplateFormValues): Promise<void> => {
    try {
      setLoading(true);
      // TODO: Replace with actual API call
      console.log('Uploading template:', values);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Tạo template mới với ID ngẫu nhiên
      const newTemplate: Template = {
        id: Math.random().toString(36).substring(2, 9),
        name: values.name,
        description: values.description || '',
        type: values.type,
        status: 'active',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: 'Người dùng hiện tại', // Trong thực tế sẽ lấy từ thông tin đăng nhập
        placeholderCount: values.extractedFields.length,
        isDefault: false,
        extractedFields: values.extractedFields
      };
      
      // Thêm template mới vào danh sách
      setTemplates(prevTemplates => [newTemplate, ...prevTemplates]);
      
      setSnackbar({
        open: true,
        message: t('pages.contracts.notifications.uploadTemplateSuccess'),
        severity: 'success',
      });
    } catch (error) {
      console.error('Error uploading template:', error);
      setSnackbar({
        open: true,
        message: t('pages.contracts.notifications.uploadTemplateError'),
        severity: 'error',
      });
      throw error; // Ném lỗi để component UploadTemplate xử lý
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: ContractTab) => {
    setCurrentTab(newValue);
  };
  
  const handleCreateContract = (newContract: any) => {
    setContracts(prev => [newContract, ...prev]);
    setCreateContractOpen(false);
    setSelectedContract(newContract);
    setSnackbar({
      open: true,
      message: t('pages.contracts.notifications.createContractSuccess'),
      severity: 'success',
    });
  };

  const handleViewContract = (contract: Contract) => {
    setSelectedContract(contract);
  };

  const handleCloseDetail = () => {
    setSelectedContract(null);
  };

  const handleDeleteClick = (contractId: string) => {
    setContractToDelete(contractId);
    setDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    if (contractToDelete) {
      setContracts(prev => prev.filter(c => c.id !== contractToDelete));
      setDeleteConfirmOpen(false);
      setContractToDelete(null);
      setSnackbar({
        open: true,
        message: t('pages.contracts.notifications.deleteContractSuccess'),
        severity: 'success',
      });
    }
  };

  const handleEditContract = (contractId: string) => {
    // In a real app, this would navigate to an edit page or open an edit dialog
    setSnackbar({
      open: true,
      message: t('pages.contracts.notifications.editInfo'),
      severity: 'info' as const,
    });
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          {t('pages.contracts.title')}
        </Typography>
      </Box>
      
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs 
          value={currentTab} 
          onChange={handleTabChange}
          aria-label="contract management tabs"
        >
          <Tab label={t('pages.contracts.tabs.templates')} value="templates" />
          <Tab label={t('pages.contracts.tabs.contracts')} value="contracts" />
        </Tabs>
      </Box>
      
      {currentTab === 'templates' ? (
        <>
          <TemplateList 
            templates={templates}
            loading={loading}
            onUploadClick={handleOpenUploadDialog} 
          />
          
          <UploadTemplate 
            open={uploadDialogOpen}
            onClose={handleCloseUploadDialog}
            onSubmit={handleUploadTemplate}
          />
        </>
      ) : (
        <Paper sx={{ p: 3 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Typography variant="h6" gutterBottom>
              {t('pages.contracts.list.title')}
            </Typography>
            <Button 
              variant="contained" 
              color="primary"
              startIcon={<Add />}
              onClick={() => setCreateContractOpen(true)}
            >
              {t('pages.contracts.list.buttonCreate')}
            </Button>
          </Box>
          
          {loading ? (
            <Typography color="textSecondary" paragraph>
              {t('pages.contracts.loading.contracts')}
            </Typography>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>{t('pages.contracts.columns.code')}</TableCell>
                    <TableCell>{t('pages.contracts.columns.name')}</TableCell>
                    <TableCell>{t('pages.contracts.columns.type')}</TableCell>
                    <TableCell>{t('pages.contracts.columns.partyA')}</TableCell>
                    <TableCell>{t('pages.contracts.columns.partyB')}</TableCell>
                    <TableCell>{t('pages.contracts.columns.createdAt')}</TableCell>
                    <TableCell>{t('pages.contracts.columns.status')}</TableCell>
                    <TableCell>{t('pages.contracts.columns.actions')}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {contracts.map((contract) => (
                    <TableRow 
                      key={contract.id} 
                      hover 
                      onClick={() => handleViewContract(contract)}
                      sx={{ cursor: 'pointer' }}
                    >
                      <TableCell>{contract.id}</TableCell>
                      <TableCell>{contract.name}</TableCell>
                      <TableCell>{contract.templateName}</TableCell>
                      <TableCell>{contract.partyA}</TableCell>
                      <TableCell>{contract.partyB}</TableCell>
                      <TableCell>{new Date(contract.createdAt).toLocaleDateString(i18n.language)}</TableCell>
                      <TableCell>
                        <Chip 
                          label={
                            contract.status === 'signed' ? t('pages.contracts.status.signed') :
                            contract.status === 'pending' ? t('pages.contracts.status.pending') :
                            contract.status === 'draft' ? t('pages.contracts.status.draft') :
                            contract.status === 'expired' ? t('pages.contracts.status.expired') : t('pages.contracts.status.cancelled')
                          }
                          color={
                            contract.status === 'signed' ? 'success' :
                            contract.status === 'pending' ? 'warning' :
                            contract.status === 'draft' ? 'default' : 'error'
                          }
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <IconButton 
                          size="small" 
                          title={t('pages.contracts.tooltips.view')}
                          onClick={() => handleViewContract(contract)}
                        >
                          <Visibility fontSize="small" />
                        </IconButton>
                        <IconButton size="small" title={t('pages.contracts.tooltips.download')}>
                          <FileDownload fontSize="small" />
                        </IconButton>
                        <IconButton 
                          size="small" 
                          title={t('pages.contracts.tooltips.delete')}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteClick(contract.id);
                          }}
                        >
                          <Delete fontSize="small" color="error" />
                        </IconButton>
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
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      {/* Contract Detail Dialog */}
      <Dialog 
        open={!!selectedContract} 
        onClose={handleCloseDetail}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>
          <Box display="flex" alignItems="center">
            <IconButton onClick={handleCloseDetail} sx={{ mr: 1 }}>
              <ArrowBack />
            </IconButton>
            <span>{t('pages.contracts.dialogs.detailTitle')}</span>
          </Box>
        </DialogTitle>
        <DialogContent dividers>
          {selectedContract && (
            <ContractDetail
              contract={{
                ...selectedContract,
                contractData: {
                  tenBenA: selectedContract.partyA,
                  tenBenB: selectedContract.partyB,
                  ngayKy: new Date(selectedContract.createdAt).toLocaleDateString(i18n.language),
                  diaChiA: '123 Lê Lợi, Q.1, TP.HCM',
                  dienThoaiA: '0901234567',
                  maSoThueA: '0123456789',
                  nguoiDaiDienA: 'Nguyễn Văn A',
                  chucVuA: 'Giám đốc',
                  giaTriHopDong: '50,000,000 VNĐ'
                }
              }}
              onClose={handleCloseDetail}
              onDelete={handleDeleteClick}
              onEdit={handleEditContract}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
      >
        <DialogTitle>{t('pages.contracts.dialogs.deleteConfirmTitle')}</DialogTitle>
        <DialogContent>
          <Typography>{t('pages.contracts.dialogs.deleteConfirmText')}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmOpen(false)}>{t('common.cancel')}</Button>
          <Button 
            onClick={handleConfirmDelete} 
            color="error"
            variant="contained"
          >
            {t('common.delete')}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog tạo hợp đồng mới */}
      <Dialog 
        open={createContractOpen} 
        onClose={() => setCreateContractOpen(false)}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: { 
            height: '90vh',
            maxHeight: '90vh',
            width: '95%',
            maxWidth: '1400px'
          }
        }}
      >
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">{t('pages.contracts.dialogs.createTitle')}</Typography>
            <IconButton onClick={() => setCreateContractOpen(false)}>
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <CreateContract 
            templates={templates} 
            onBack={() => setCreateContractOpen(false)}
            onCreate={handleCreateContract}
          />
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default ContractManagement;
