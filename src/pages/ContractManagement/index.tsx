import React, { useState, useEffect } from 'react';
import { Box, Typography, Snackbar, Alert, Tabs, Tab, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, Button, IconButton, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { Visibility, Delete, FileDownload, Add, Close, ArrowBack } from '@mui/icons-material';
import TemplateList from './components/TemplateList';
import UploadTemplate from './components/UploadTemplate';
import CreateContract from './components/CreateContract';
import ContractDetail from './components/ContractDetail';
import { UploadTemplateFormValues } from './components/UploadTemplate/types';

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
          message: 'Có lỗi xảy ra khi tải dữ liệu. Vui lòng thử lại.',
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
        message: 'Tải lên template thành công!',
        severity: 'success',
      });
    } catch (error) {
      console.error('Error uploading template:', error);
      setSnackbar({
        open: true,
        message: 'Có lỗi xảy ra khi tải lên template. Vui lòng thử lại.',
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
      message: 'Tạo hợp đồng mới thành công!',
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
      setSelectedContract(null);
      setSnackbar({
        open: true,
        message: 'Đã xóa hợp đồng thành công!',
        severity: 'success',
      });
    }
  };

  const handleEditContract = (contractId: string) => {
    // In a real app, this would navigate to an edit page or open an edit dialog
    setSnackbar({
      open: true,
      message: 'Chức năng chỉnh sửa hợp đồng đang được phát triển',
      severity: 'info' as const,
    });
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          Quản lý Hợp đồng
        </Typography>
      </Box>
      
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs 
          value={currentTab} 
          onChange={handleTabChange}
          aria-label="contract management tabs"
        >
          <Tab label="Mẫu hợp đồng" value="templates" />
          <Tab label="Hợp đồng" value="contracts" />
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
              Danh sách Hợp đồng
            </Typography>
            <Button 
              variant="contained" 
              color="primary"
              startIcon={<Add />}
              onClick={() => setCreateContractOpen(true)}
            >
              Tạo hợp đồng mới
            </Button>
          </Box>
          
          {loading ? (
            <Typography color="textSecondary" paragraph>
              Đang tải danh sách hợp đồng...
            </Typography>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Mã HĐ</TableCell>
                    <TableCell>Tên hợp đồng</TableCell>
                    <TableCell>Loại HĐ</TableCell>
                    <TableCell>Bên A</TableCell>
                    <TableCell>Bên B</TableCell>
                    <TableCell>Ngày tạo</TableCell>
                    <TableCell>Trạng thái</TableCell>
                    <TableCell>Hành động</TableCell>
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
                      <TableCell>{new Date(contract.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Chip 
                          label={
                            contract.status === 'signed' ? 'Đã ký' :
                            contract.status === 'pending' ? 'Chờ ký' :
                            contract.status === 'draft' ? 'Nháp' :
                            contract.status === 'expired' ? 'Hết hạn' : 'Đã hủy'
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
                          title="Xem chi tiết"
                          onClick={() => handleViewContract(contract)}
                        >
                          <Visibility fontSize="small" />
                        </IconButton>
                        <IconButton size="small" title="Tải về">
                          <FileDownload fontSize="small" />
                        </IconButton>
                        <IconButton 
                          size="small" 
                          title="Xóa"
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
            <span>Chi tiết hợp đồng</span>
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
                  ngayKy: new Date(selectedContract.createdAt).toLocaleDateString('vi-VN'),
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
        <DialogTitle>Xác nhận xóa</DialogTitle>
        <DialogContent>
          <Typography>Bạn có chắc chắn muốn xóa hợp đồng này? Hành động này không thể hoàn tác.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmOpen(false)}>Hủy</Button>
          <Button 
            onClick={handleConfirmDelete} 
            color="error"
            variant="contained"
          >
            Xác nhận xóa
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
            <Typography variant="h6">Tạo hợp đồng mới</Typography>
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
