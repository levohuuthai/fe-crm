import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Paper,
  Typography,
  TextField,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Autocomplete,
  SelectChangeEvent,
  Tabs,
  Tab,
} from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon,
  FileDownload as ExportIcon,
} from '@mui/icons-material';

// Types
import { Quotation, QuotationStatus } from './types';
import { QuoteTemplate, QuoteTemplateTab } from './types/quoteTemplate';

// Components
import QuotationForm from './components/QuotationForm';
import QuotationDetail from './components/QuotationDetail';
import QuotationPreview from './components/QuotationPreview';
import QuotationList from './components/QuotationList';
import EmailQuotationDialog from './components/EmailQuotationDialog';
import QuotationTemplates from './components/QuotationTemplates';
import UploadQuoteTemplate from './components/UploadQuoteTemplate';
import { UploadQuoteTemplateFormValues } from './types/quoteTemplate';

// Fake data
const fakeCustomers = ['Công ty A', 'Công ty B', 'Công ty C', 'Công ty D'];
const fakeDeals = [
  { id: 1, name: 'Deal A1', customer: 'Công ty A' },
  { id: 2, name: 'Deal A2', customer: 'Công ty A' },
  { id: 3, name: 'Deal B1', customer: 'Công ty B' },
  { id: 4, name: 'Deal C1', customer: 'Công ty C' },
];

const fakeRequirements = [
  { 
    id: 1, 
    name: 'Yêu cầu A1.1', 
    dealId: 1, 
    description: 'Xây dựng website bán hàng cho Công ty A',
    features: [
      { 
        feature: 'Trang chủ', 
        detail: 'Thiết kế trang chủ hiện đại', 
        description: 'Trang chủ với slider banner, danh mục sản phẩm nổi bật, sản phẩm mới', 
        notes: 'Tích hợp animation cho banner'
      },
      { 
        feature: 'Trang sản phẩm', 
        detail: 'Danh sách sản phẩm có bộ lọc', 
        description: 'Hiển thị sản phẩm dạng lưới, có bộ lọc theo danh mục, giá, thương hiệu', 
        notes: 'Có chức năng so sánh sản phẩm'
      },
      { 
        feature: 'Giỏ hàng', 
        detail: 'Chức năng giỏ hàng đầy đủ', 
        description: 'Thêm, sửa, xóa sản phẩm trong giỏ hàng, tính tổng tiền', 
        notes: 'Lưu giỏ hàng vào localStorage'
      },
      { 
        feature: 'Thanh toán', 
        detail: 'Quy trình thanh toán', 
        description: 'Form nhập thông tin giao hàng, chọn phương thức thanh toán', 
        notes: 'Tích hợp thanh toán qua VNPay'
      }
    ] 
  },
  { 
    id: 2, 
    name: 'Yêu cầu A1.2', 
    dealId: 1, 
    description: 'Xây dựng hệ thống quản lý kho cho Công ty A',
    features: [
      { 
        feature: 'Quản lý sản phẩm', 
        detail: 'CRUD sản phẩm', 
        description: 'Thêm, sửa, xóa, xem chi tiết sản phẩm trong kho', 
        notes: 'Hỗ trợ import/export Excel'
      },
      { 
        feature: 'Quản lý nhập kho', 
        detail: 'Quy trình nhập kho', 
        description: 'Tạo phiếu nhập kho, xác nhận nhập kho, cập nhật số lượng tồn', 
        notes: 'Tích hợp với mã vạch'
      },
      { 
        feature: 'Quản lý xuất kho', 
        detail: 'Quy trình xuất kho', 
        description: 'Tạo phiếu xuất kho, xác nhận xuất kho, cập nhật số lượng tồn', 
        notes: 'Tự động xuất kho khi có đơn hàng'
      },
      { 
        feature: 'Báo cáo thống kê', 
        detail: 'Báo cáo tồn kho, nhập xuất', 
        description: 'Báo cáo tồn kho theo thời gian, báo cáo nhập xuất theo sản phẩm', 
        notes: 'Xuất báo cáo dạng PDF, Excel'
      }
    ] 
  },
  { 
    id: 3, 
    name: 'Yêu cầu A2.1', 
    dealId: 2, 
    description: 'Xây dựng app mobile cho Công ty A',
    features: [
      { 
        feature: 'Đăng nhập/Đăng ký', 
        detail: 'Hệ thống xác thực', 
        description: 'Đăng nhập bằng email/password, đăng ký tài khoản mới, quên mật khẩu', 
        notes: 'Hỗ trợ đăng nhập bằng Google, Facebook'
      },
      { 
        feature: 'Trang cá nhân', 
        detail: 'Thông tin người dùng', 
        description: 'Xem, cập nhật thông tin cá nhân, đổi mật khẩu', 
        notes: 'Upload avatar'
      },
      { 
        feature: 'Thông báo', 
        detail: 'Hệ thống thông báo', 
        description: 'Nhận thông báo realtime, xem lịch sử thông báo', 
        notes: 'Sử dụng Firebase Cloud Messaging'
      }
    ] 
  },
  { 
    id: 4, 
    name: 'Yêu cầu B1.1', 
    dealId: 3, 
    description: 'Xây dựng hệ thống Quản lý Kho cho Công ty B',
    features: [
      { 
        feature: 'Quản lý Kho', 
        detail: 'Nhập kho', 
        description: 'Cho phép người dùng nhập hàng mới vào kho', 
        notes: 'Từ AI (mẫu)'
      },
      { 
        feature: 'Quản lý Kho', 
        detail: 'Xuất kho', 
        description: 'Ghi nhận xuất kho khi giao hàng hoặc bán', 
        notes: 'Từ AI (mẫu)'
      },
      { 
        feature: 'Giám sát Kho', 
        detail: 'Cảnh báo tồn kho thấp', 
        description: 'Thông báo khi số lượng hàng tồn dưới mức tối thiểu', 
        notes: 'Từ AI (mẫu)'
      }
    ] 
  },
];

const generateFakeQuotations = (count: number): Quotation[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    name: `Báo giá ${i + 1} - ${['Website bán hàng', 'Hệ thống kho', 'App di động', 'Phần mềm kế toán'][i % 4]}`,
    customer: fakeCustomers[Math.floor(Math.random() * fakeCustomers.length)],
    dealId: i % 4 + 1,
    dealName: fakeDeals[i % 4].name,
    requirementId: i % 4 + 1,
    requirementName: fakeRequirements[i % 4].name,
    status: ['draft', 'sent', 'approved', 'rejected'][Math.floor(Math.random() * 4)] as QuotationStatus,
    createdDate: new Date(Date.now() - Math.floor(Math.random() * 90) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    note: '',
    items: [],
    totalEffort: Math.floor(Math.random() * 100) + 20,
    totalAmount: (Math.floor(Math.random() * 100) + 20) * 500000,
  }));
};

const statusOptions = [
  { value: 'draft', label: 'Draft', color: 'default' },
  { value: 'sent', label: 'Đã gửi', color: 'info' },
  { value: 'approved', label: 'Đã duyệt', color: 'success' },
  { value: 'rejected', label: 'Từ chối', color: 'error' },
];

const QuotationManagement = () => {
  // Tab state
  const [currentTab, setCurrentTab] = useState<QuoteTemplateTab>('quotes');
  
  // State
  const [searchTerm, setSearchTerm] = useState('');
  const [customerFilter, setCustomerFilter] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [loading, setLoading] = useState(false);
  
  // Template states
  const [templates, setTemplates] = useState<QuoteTemplate[]>([]);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<QuoteTemplate | null>(null);
  
  // Quotations state
  const [quotations, setQuotations] = useState<Quotation[]>(generateFakeQuotations(25));
  
  // Create dialog state
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  
  // Detail dialog state
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [selectedQuotation, setSelectedQuotation] = useState<Quotation | null>(null);
  
  // Preview dialog state
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false);
  
  // Email dialog state
  const [emailDialogOpen, setEmailDialogOpen] = useState(false);
  const [emailQuotation, setEmailQuotation] = useState<Quotation | null>(null);
  
  // Load fake data on init
  useEffect(() => {
    setLoading(true);
    // Load quotations
    setQuotations(generateFakeQuotations(25));
    
    // Load templates
    const mockTemplates: QuoteTemplate[] = [
      {
        id: '1',
        name: 'Mẫu báo giá dự án phần mềm',
        description: 'Template báo giá dự án phần mềm tiêu chuẩn',
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
        name: 'Mẫu báo giá dịch vụ IT',
        description: 'Template báo giá dịch vụ IT outsourcing',
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
    setLoading(false);
  }, []);

  // Handlers
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setPage(0);
  };
  
  // Handle tab change
  const handleTabChange = (_event: React.SyntheticEvent, newValue: QuoteTemplateTab) => {
    setCurrentTab(newValue);
    setPage(0);
  };

  // Template handlers
  const handleOpenUploadDialog = () => {
    setUploadDialogOpen(true);
  };

  const handleCloseUploadDialog = () => {
    setUploadDialogOpen(false);
  };
  
  const handleUploadTemplate = async (values: UploadQuoteTemplateFormValues): Promise<void> => {
    try {
      setLoading(true);
      // TODO: Replace with actual API call
      console.log('Uploading template:', values);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Add new template to the list
      const newTemplate: QuoteTemplate = {
        id: `template-${Date.now()}`,
        name: values.name,
        description: values.description,
        type: values.type,
        status: 'active',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: 'Người dùng hiện tại',
        placeholderCount: Math.floor(Math.random() * 10) + 3, // Random number of placeholders
        isDefault: false,
        extractedFields: []
      };
      
      setTemplates(prev => [newTemplate, ...prev]);
      setUploadDialogOpen(false);
      
    } catch (error) {
      console.error('Error uploading template:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleViewTemplate = (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    if (template) {
      setSelectedTemplate(template);
      // Here you would implement the template viewing functionality
      console.log('Viewing template:', template);
    }
  };
  
  const handleDownloadTemplate = (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    if (template) {
      // Here you would implement the template download functionality
      console.log('Downloading template:', template);
    }
  };
  
  const handleDeleteTemplate = (templateId: string) => {
    // Here you would implement the template deletion functionality
    setTemplates(prev => prev.filter(t => t.id !== templateId));
    console.log('Deleted template with ID:', templateId);
  };
  
  const handleCustomerFilterChange = (_: any, newValue: string | null) => {
    setCustomerFilter(newValue);
    setPage(0);
  };

  const handleStatusFilterChange = (event: SelectChangeEvent<string>) => {
    setStatusFilter(event.target.value);
    setPage(0);
  };

  const handlePageChange = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleViewQuotationDetail = (id: number) => {
    const quotation = quotations.find(q => q.id === id);
    if (quotation) {
      setSelectedQuotation(quotation);
      setDetailDialogOpen(true);
    }
  };

  const handleDownloadPdf = (id: number) => {
    const quotation = quotations.find(q => q.id === id);
    if (quotation) {
      setSelectedQuotation(quotation);
      setPreviewDialogOpen(true);
    }
  };

  const handleSendEmail = (id: number) => {
    const quotation = quotations.find(q => q.id === id);
    if (quotation) {
      setEmailQuotation(quotation);
      setEmailDialogOpen(true);
    }
  };

  const handleEmailSend = (emailData: {
    to: string;
    cc: string;
    subject: string;
    content: string;
  }) => {
    // In a real app, this would call an API to send the email
    console.log('Sending email:', emailData);
    
    // Update quotation status to 'sent' if it was 'draft'
    if (emailQuotation?.status === 'draft') {
      const updatedQuotations = quotations.map(q => 
        q.id === emailQuotation.id 
          ? { ...q, status: 'sent' as const } 
          : q
      );
      setQuotations(updatedQuotations);
    }
    
    // Show success message
    alert('Email đã được gửi thành công!');
    setEmailDialogOpen(false);
  };

  const handleCreateQuotation = () => {
    setCreateDialogOpen(true);
  };

  const handleCloseCreateDialog = () => {
    setCreateDialogOpen(false);
  };

  const handleSaveQuotation = (quotation: Quotation) => {
    const newQuotation = {
      ...quotation,
      id: Math.max(...quotations.map(q => q.id), 0) + 1,
    };
    
    setQuotations([newQuotation, ...quotations]);
    setCreateDialogOpen(false);
  };

  // Filter quotations
  const filteredQuotations = quotations.filter(q => {
    const matchesSearch = q.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          q.customer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCustomer = !customerFilter || q.customer === customerFilter;
    const matchesStatus = statusFilter === 'all' || q.status === statusFilter;
    return matchesSearch && matchesCustomer && matchesStatus;
  });

  const paginatedQuotations = filteredQuotations.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  // Các hàm tiện ích đã được chuyển vào component QuotationList

  return (
    <Box sx={{ p: 3 }}>
      {emailQuotation && (
        <EmailQuotationDialog
          open={emailDialogOpen}
          onClose={() => setEmailDialogOpen(false)}
          onSend={handleEmailSend}
          customerName={emailQuotation.customer}
          serviceName={emailQuotation.name}
          responsiblePerson="Người phụ trách"
          pdfFileName={`BaoGia_${emailQuotation.id}.pdf`}
        />
      )}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Typography variant="h4" component="h1">
          Quản lý báo giá/ước tính
        </Typography>
        {currentTab === 'quotes' && (
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleCreateQuotation}
          >
            Tạo báo giá mới
          </Button>
        )}
      </Box>
      
      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs 
          value={currentTab} 
          onChange={handleTabChange}
          aria-label="quotation management tabs"
        >
          <Tab label="Mẫu báo giá" value="templates" />
          <Tab label="Báo giá" value="quotes" />
        </Tabs>
      </Box>
      
      {currentTab === 'templates' ? (
        <>
          <QuotationTemplates 
            templates={templates}
            loading={loading}
            onUploadClick={handleOpenUploadDialog}
            onViewTemplate={handleViewTemplate}
            onDeleteTemplate={handleDeleteTemplate}
            onDownloadTemplate={handleDownloadTemplate}
          />
          
          <UploadQuoteTemplate 
            open={uploadDialogOpen}
            onClose={handleCloseUploadDialog}
            onSubmit={handleUploadTemplate}
          />
        </>
      ) : (
        <>
          {/* Search and Filter */}
          <Paper sx={{ p: 2, mb: 3 }}>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems="center">
              <TextField
                label="Tìm kiếm"
                variant="outlined"
                size="small"
                value={searchTerm}
                onChange={handleSearch}
                sx={{ minWidth: 200, flex: 1 }}
                InputProps={{
                  startAdornment: <SearchIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />,
                }}
              />
              
              <Autocomplete
                options={fakeCustomers}
                value={customerFilter}
                onChange={handleCustomerFilterChange}
                renderInput={(params) => <TextField {...params} label="Khách hàng" size="small" />}
                sx={{ minWidth: 200 }}
              />
              
              <FormControl size="small" sx={{ minWidth: 150 }}>
                <InputLabel id="status-filter-label">Trạng thái</InputLabel>
                <Select
                  labelId="status-filter-label"
                  value={statusFilter}
                  label="Trạng thái"
                  onChange={handleStatusFilterChange}
                >
                  <MenuItem value="all">Tất cả</MenuItem>
                  {statusOptions.map(option => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              
              <Button 
                variant="outlined" 
                startIcon={<ExportIcon />}
                onClick={() => console.log('Export data')}
              >
                Xuất Excel
              </Button>
            </Stack>
          </Paper>

          {/* Quotation List */}
          <QuotationList
            quotations={paginatedQuotations}
            onViewDetail={handleViewQuotationDetail}
            onDownloadPdf={handleDownloadPdf}
            onSendEmail={handleSendEmail}
            page={page}
            rowsPerPage={rowsPerPage}
            onPageChange={handlePageChange}
            onRowsPerPageChange={handleRowsPerPageChange}
            totalCount={filteredQuotations.length}
          />
        </>
      )}
      
      {/* Dialog tạo báo giá mới */}
      <QuotationForm
        open={createDialogOpen}
        onClose={handleCloseCreateDialog}
        onSave={handleSaveQuotation}
        customers={fakeCustomers}
        deals={fakeDeals}
        requirements={fakeRequirements}
        templates={templates}
      />

      {/* Dialog xem chi tiết báo giá */}
      <QuotationDetail
        open={detailDialogOpen}
        onClose={() => setDetailDialogOpen(false)}
        quotation={selectedQuotation}
      />

      {/* Dialog xem trước và xuất PDF */}
      <QuotationPreview
        open={previewDialogOpen}
        onClose={() => setPreviewDialogOpen(false)}
        quotation={selectedQuotation}
        onSaveDraft={(quotation) => {
          // Cập nhật báo giá với nội dung mới
          const updatedQuotations = quotations.map(q => 
            q.id === quotation.id ? quotation : q
          );
          setQuotations(updatedQuotations);
          setPreviewDialogOpen(false);
          alert('Đã lưu nháp báo giá');
        }}
        onExportPdf={(quotation) => {
          console.log('Export PDF', quotation);
          alert('Đã xuất file PDF báo giá');
        }}
        onEdit={() => {
          setPreviewDialogOpen(false);
          // Mở lại form chỉnh sửa nếu cần
        }}
      />
    </Box>
  );
};

export default QuotationManagement;
