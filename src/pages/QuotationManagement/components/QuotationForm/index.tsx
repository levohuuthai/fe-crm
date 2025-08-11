import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Typography,
  TextField,
  Autocomplete,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stepper,
  Step,
  StepLabel,
  Paper,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import {
  NavigateNext as NextIcon,
  Save as SaveIcon,
  Description as TemplateIcon,
} from '@mui/icons-material';
import { QuotationFormProps, Quotation, QuotationItem } from '../../types';
import { EstimationMode } from '../../types/quoteTemplate';
import EstimationStep from '../EstimationStep/index';

const QuotationForm: React.FC<QuotationFormProps> = ({
  open,
  onClose,
  onSave,
  customers,
  deals,
  requirements,
  templates,
}) => {
  // Form state
  const [activeStep, setActiveStep] = useState(0);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [estimationMode, setEstimationMode] = useState<EstimationMode>('fixed');
  const [newQuotation, setNewQuotation] = useState<Partial<Quotation>>({
    name: '',
    customer: '',
    dealId: 0,
    dealName: '',
    requirementId: 0,
    requirementName: '',
    status: 'draft',
    createdDate: new Date().toISOString().split('T')[0],
    note: '',
    items: [],
    totalEffort: 0,
    totalAmount: 0,
    templateId: '',
    templateName: '',
    estimationMode: 'fixed',
  });
  
  // Reset touched state when modal is opened/closed
  useEffect(() => {
    if (open) {
      setTouched({});
    }
  }, [open]);

  // Filtered options based on selections
  const [filteredDeals, setFilteredDeals] = useState(deals);
  const [filteredRequirements, setFilteredRequirements] = useState(requirements);
  
  // Items for estimation table
  const [estimationItems, setEstimationItems] = useState<QuotationItem[]>([]);

  // Update filtered deals when customer changes
  useEffect(() => {
    if (newQuotation.customer) {
      setFilteredDeals(deals.filter(deal => deal.customer === newQuotation.customer));
    } else {
      setFilteredDeals(deals);
    }
  }, [newQuotation.customer, deals]);

  // Update filtered requirements when deal changes
  useEffect(() => {
    if (newQuotation.dealId) {
      setFilteredRequirements(requirements.filter(req => req.dealId === newQuotation.dealId));
    } else {
      setFilteredRequirements(requirements);
    }
  }, [newQuotation.dealId, requirements]);

  // Load requirement features when a requirement is selected
  useEffect(() => {
    if (newQuotation.requirementId) {
      const selectedRequirement = requirements.find(req => req.id === newQuotation.requirementId);
      if (selectedRequirement && selectedRequirement.features && selectedRequirement.features.length > 0) {
        console.log('Requirement features found:', selectedRequirement.features);
        // Convert requirement features to estimation items
        const items: QuotationItem[] = selectedRequirement.features.map((feature: any, index: number) => ({
          id: index + 1,
          feature: feature.feature || '',
          detail: feature.detail || '',
          description: feature.description || '',
          note: feature.notes || feature.note || '',
          frontendEffort: 0,
          backendEffort: 0,
          qcEffort: 0,
          pmEffort: 0,
          totalMD: 0,
          totalMM: 0,
        }));
        setEstimationItems(items);
      } else {
        console.log('No features found for requirement ID:', newQuotation.requirementId);
        setEstimationItems([]);
      }
    } else {
      setEstimationItems([]);
    }
  }, [newQuotation.requirementId, requirements]);

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleCustomerChange = (_: any, newValue: string | null) => {
    setNewQuotation({
      ...newQuotation,
      customer: newValue || '',
      dealId: 0,
      dealName: '',
      requirementId: 0,
      requirementName: '',
    });
  };

  const handleDealChange = (_: any, newValue: { id: number; name: string } | null) => {
    setNewQuotation({
      ...newQuotation,
      dealId: newValue?.id || 0,
      dealName: newValue?.name || '',
      requirementId: 0,
      requirementName: '',
    });
  };

  const handleRequirementChange = (_: any, newValue: { id: number; name: string } | null) => {
    setNewQuotation({
      ...newQuotation,
      requirementId: newValue?.id || 0,
      requirementName: newValue?.name || '',
    });
  };

  const handleItemsChange = (updatedItems: QuotationItem[]) => {
    setEstimationItems(updatedItems);
    
    // Calculate totals
    const totalEffort = updatedItems.reduce((sum, item) => sum + item.totalMD, 0);
    
    // Assuming a simple calculation for total amount (e.g., 500,000 VND per MD)
    const totalAmount = totalEffort * 500000;
    
    setNewQuotation({
      ...newQuotation,
      totalEffort,
      totalAmount,
    });
  };

  const handleSave = () => {
    if (newQuotation.name && newQuotation.customer && newQuotation.templateId) {
      onSave({
        ...newQuotation as Quotation,
        items: estimationItems,
      });
    }
  };


  
  const isStepOneValid = () => {
    return !!(newQuotation.name && newQuotation.customer && newQuotation.dealId && newQuotation.requirementId && newQuotation.templateId);
  };

  const steps = [
    'Thông tin báo giá',
    'Bảng ước tính',
    'Xem trước báo giá',
  ];

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
    >
      <DialogTitle>Tạo báo giá mới</DialogTitle>
      <DialogContent>
        <Stepper activeStep={activeStep} sx={{ pt: 3, pb: 5 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {activeStep === 0 && (
          <Box>
            <Typography variant="h6" gutterBottom>Thông tin cơ bản</Typography>
            
            <Box sx={{ mb: 3, border: '1px solid #e0e0e0', borderRadius: 1, p: 2, bgcolor: '#f9f9f9' }}>
              <Typography variant="subtitle2" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <TemplateIcon fontSize="small" sx={{ mr: 1 }} /> 
                Chọn mẫu báo giá
              </Typography>
              <FormControl 
                fullWidth 
                margin="dense" 
                required 
                error={touched.templateId && !newQuotation.templateId}
              >
                <InputLabel id="template-select-label">Mẫu báo giá</InputLabel>
                <Select
                  labelId="template-select-label"
                  id="template-select"
                  value={newQuotation.templateId || ''}
                  label="Mẫu báo giá"
                  onChange={(e) => {
                    const templateId = e.target.value;
                    const selectedTemplate = templates.find(t => t.id === templateId);
                    setNewQuotation({
                      ...newQuotation,
                      templateId: templateId,
                      templateName: selectedTemplate?.name || '',
                    });
                    setTouched(prev => ({ ...prev, templateId: true }));
                  }}
                  onBlur={() => setTouched(prev => ({ ...prev, templateId: true }))}
                  size="small"
                >
                  <MenuItem value="">
                    <em>Chọn mẫu báo giá</em>
                  </MenuItem>
                  {templates.map((template) => (
                    <MenuItem key={template.id} value={template.id}>
                      {template.name} {template.type === 'internal' ? '(Nội bộ)' : '(Khách hàng)'}
                    </MenuItem>
                  ))}
                </Select>
                {touched.templateId && !newQuotation.templateId && (
                  <FormHelperText>Vui lòng chọn mẫu báo giá</FormHelperText>
                )}
              </FormControl>
            </Box>
            
            <TextField
              label="Tên báo giá"
              fullWidth
              required
              value={newQuotation.name || ''}
              onChange={(e) => setNewQuotation({...newQuotation, name: e.target.value})}
              margin="normal"
              size="small"
              placeholder="Nhập tên báo giá"
            />
            <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
              <Autocomplete
                options={customers}
                value={newQuotation.customer || null}
                onChange={handleCustomerChange}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Khách hàng"
                    size="small"
                    sx={{ minWidth: 250, flex: 1 }}
                    required
                  />
                )}
                sx={{ minWidth: 250, flex: 1 }}
              />
              <Autocomplete
                options={filteredDeals}
                getOptionLabel={(option) => option.name}
                value={newQuotation.dealId ? filteredDeals.find(d => d.id === newQuotation.dealId) || null : null}
                onChange={handleDealChange}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Deal"
                    size="small"
                    sx={{ minWidth: 250, flex: 1 }}
                    required
                  />
                )}
                sx={{ minWidth: 250, flex: 1 }}
                disabled={!newQuotation.customer}
              />
            </Box>
            <Box sx={{ mb: 3 }}>
              <Autocomplete
                options={filteredRequirements}
                getOptionLabel={(option) => option.name}
                value={newQuotation.requirementId ? filteredRequirements.find(r => r.id === newQuotation.requirementId) || null : null}
                onChange={handleRequirementChange}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Requirement"
                    size="small"
                    required
                  />
                )}
                disabled={!newQuotation.dealId}
              />
            </Box>
            <TextField
              label="Trạng thái"
              value="Draft"
              size="small"
              disabled
              fullWidth
              margin="normal"
            />
            <TextField
              label="Ghi chú"
              multiline
              rows={4}
              fullWidth
              placeholder="Nhập ghi chú (nếu có)..."
              variant="outlined"
              sx={{ mb: 2, mt: 2 }}
              value={newQuotation.note || ''}
              onChange={(e) => setNewQuotation({...newQuotation, note: e.target.value})}
            />
          </Box>
        )}

        {activeStep === 1 && (
          <Box>
            <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
              <Typography variant="subtitle2" gutterBottom>Chọn phương thức ước tính</Typography>
              <EstimationStep
                mode={estimationMode as EstimationMode}
                onModeChange={(newMode) => {
                  setEstimationMode(newMode);
                  setNewQuotation(prev => ({ ...prev, estimationMode: newMode }));
                }}
                initialData={{
                  rows: estimationItems
                }}
                onEstimationDataChange={(data) => {
                  if (data.mode === 'fixed') {
                    const convertedItems = data.rows.map((row: any) => ({
                      id: row.id,
                      feature: row.feature || '',
                      detail: row.detail || '',
                      description: row.description || '',
                      note: row.notes || '',
                      frontendEffort: 0,
                      backendEffort: 0,
                      qcEffort: 0,
                      pmEffort: 0,
                      totalMD: Object.values(row.efforts || {}).reduce((sum: number, val: any) => sum + (Number(val) || 0), 0),
                      totalMM: 0,
                    }));
                    
                    setEstimationItems(convertedItems);
                    handleItemsChange(convertedItems);
                    
                    setNewQuotation(prev => ({
                      ...prev,
                      estimationMode: 'fixed',
                      estimationConfig: {
                        rows: data.rows,
                        columns: data.columns
                      }
                    }));
                  } else {
                    const convertedItems = data.rates.map((rate: any) => ({
                      id: rate.id,
                      feature: rate.role || '',
                      detail: rate.description || '',
                      description: '',
                      note: '',
                      frontendEffort: 0,
                      backendEffort: 0,
                      qcEffort: 0,
                      pmEffort: 0,
                      totalMD: rate.rate || 0,
                      totalMM: 0,
                    }));
                    
                    setEstimationItems(convertedItems);
                    handleItemsChange(convertedItems);
                    
                    setNewQuotation(prev => ({
                      ...prev,
                      estimationMode: 'timeAndMaterial',
                      estimationConfig: {
                        rates: data.rates
                      }
                    }));
                  }
                }}
              />
            </Paper>
          </Box>
        )}

        {activeStep === 2 && (
          <Box>
            <Typography variant="h6" gutterBottom>Xem trước báo giá</Typography>
            <Paper variant="outlined" sx={{ p: 3 }}>
              <Typography variant="h5" gutterBottom sx={{ mb: 3, textAlign: 'center', fontWeight: 'bold' }}>
                BÁO GIÁ DỊCH VỤ
              </Typography>
              
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" gutterBottom>Thông tin khách hàng</Typography>
                <Box sx={{ pl: 2 }}>
                  <Typography><strong>Tên khách hàng:</strong> {newQuotation.customer}</Typography>
                  <Typography><strong>Dự án:</strong> {newQuotation.dealName}</Typography>
                  <Typography><strong>Yêu cầu:</strong> {newQuotation.requirementName}</Typography>
                </Box>
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" gutterBottom>Chi tiết báo giá</Typography>
                <TableContainer component={Paper} variant="outlined">
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>STT</TableCell>
                        <TableCell>Hạng mục</TableCell>
                        <TableCell>Mô tả</TableCell>
                        <TableCell>Số ngày</TableCell>
                        <TableCell>Đơn giá</TableCell>
                        <TableCell>Thành tiền</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {estimationItems.map((item, index) => (
                        <TableRow key={item.id}>
                          <TableCell>{index + 1}</TableCell>
                          <TableCell>{item.feature}</TableCell>
                          <TableCell>{item.detail}</TableCell>
                          <TableCell>{item.totalMD}</TableCell>
                          <TableCell>500,000 VNĐ/ngày</TableCell>
                          <TableCell>{(item.totalMD * 500000).toLocaleString('vi-VN')} VNĐ</TableCell>
                        </TableRow>
                      ))}
                      <TableRow>
                        <TableCell colSpan={5} align="right"><strong>Tổng cộng:</strong></TableCell>
                        <TableCell><strong>{newQuotation.totalAmount?.toLocaleString('vi-VN')} VNĐ</strong></TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" gutterBottom>Ghi chú</Typography>
                <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
                  {newQuotation.note || 'Không có ghi chú'}
                </Typography>
              </Box>
            </Paper>
          </Box>
        )}
      </DialogContent>
      <DialogActions sx={{ p: 2, pt: 3 }}>
        <Button onClick={onClose}>Hủy</Button>
        {activeStep > 0 && (
          <Button onClick={handleBack}>
            Quay lại
          </Button>
        )}
        {activeStep < 2 ? (
          <Button 
            variant="contained" 
            onClick={handleNext}
            endIcon={<NextIcon />}
            disabled={activeStep === 0 ? !isStepOneValid() : false}
          >
            {activeStep === 1 ? 'Xem trước báo giá' : 'Tiếp theo'}
          </Button>
        ) : (
          <Button 
            variant="contained" 
            color="primary" 
            onClick={handleSave}
            startIcon={<SaveIcon />}
          >
            Lưu báo giá
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default QuotationForm;
