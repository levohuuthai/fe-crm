import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();
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
    t('pages.quotations.steps.basicInfo'),
    t('pages.quotations.estimation.chooseMethod'),
    t('pages.quotations.steps.preview'),
  ];

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
    >
      <DialogTitle>{t('pages.quotations.dialogs.createTitle')}</DialogTitle>
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
            <Typography variant="h6" gutterBottom>{t('pages.quotations.steps.basicInfo')}</Typography>
            
            <Box sx={{ mb: 3, border: '1px solid #e0e0e0', borderRadius: 1, p: 2, bgcolor: '#f9f9f9' }}>
              <Typography variant="subtitle2" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <TemplateIcon fontSize="small" sx={{ mr: 1 }} /> 
                {t('pages.quotations.fields.template')}
              </Typography>
              <FormControl 
                fullWidth 
                margin="dense" 
                required 
                error={touched.templateId && !newQuotation.templateId}
              >
                <InputLabel id="template-select-label">{t('pages.quotations.fields.template')}</InputLabel>
                <Select
                  labelId="template-select-label"
                  id="template-select"
                  value={newQuotation.templateId || ''}
                  label={t('pages.quotations.fields.template')}
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
                    <em>{t('pages.quotations.placeholders.selectTemplate')}</em>
                  </MenuItem>
                  {templates.map((template) => (
                    <MenuItem key={template.id} value={template.id}>
                      {template.name}
                    </MenuItem>
                  ))}
                </Select>
                {touched.templateId && !newQuotation.templateId && (
                  <FormHelperText>{t('pages.quotations.validation.selectTemplate')}</FormHelperText>
                )}
              </FormControl>
            </Box>
            
            <TextField
              label={t('pages.quotations.fields.name')}
              fullWidth
              required
              value={newQuotation.name || ''}
              onChange={(e) => setNewQuotation({...newQuotation, name: e.target.value})}
              margin="normal"
              size="small"
              placeholder={t('pages.quotations.placeholders.name')}
            />
            <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
              <Autocomplete
                options={customers}
                value={newQuotation.customer || null}
                onChange={handleCustomerChange}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label={t('pages.quotations.fields.customer')}
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
                    label={t('pages.quotations.fields.deal')}
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
                    label={t('pages.quotations.fields.requirement')}
                    size="small"
                    required
                  />
                )}
                disabled={!newQuotation.dealId}
              />
            </Box>
            <TextField
              label={t('pages.quotations.fields.status')}
              value={t('pages.quotations.status.draft')}
              size="small"
              disabled
              fullWidth
              margin="normal"
            />
            <TextField
              label={t('pages.quotations.fields.note')}
              multiline
              rows={4}
              fullWidth
              placeholder={t('pages.quotations.placeholders.note')}
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
              <Typography variant="subtitle2" gutterBottom>{t('pages.quotations.estimation.chooseMethod')}</Typography>
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
            <Typography variant="h6" gutterBottom>{t('pages.quotations.steps.preview')}</Typography>
            <Paper variant="outlined" sx={{ p: 3 }}>
              
              
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" gutterBottom>{t('pages.quotations.preview.customerInfo')}</Typography>
                <Box sx={{ pl: 2 }}>
                  <Typography><strong>{t('pages.quotations.fields.customer')}:</strong> {newQuotation.customer}</Typography>
                  <Typography><strong>{t('pages.quotations.fields.deal')}:</strong> {newQuotation.dealName}</Typography>
                  <Typography><strong>{t('pages.quotations.fields.requirement')}:</strong> {newQuotation.requirementName}</Typography>
                </Box>
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" gutterBottom>{t('pages.quotations.preview.quotationDetails')}</Typography>
                <TableContainer component={Paper} variant="outlined">
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>{t('pages.quotations.preview.table.no')}</TableCell>
                        <TableCell>{t('pages.quotations.preview.table.item')}</TableCell>
                        <TableCell>{t('pages.quotations.preview.table.description')}</TableCell>
                        <TableCell>{t('pages.quotations.preview.table.days')}</TableCell>
                        <TableCell>{t('pages.quotations.preview.table.unitPrice')}</TableCell>
                        <TableCell>{t('pages.quotations.preview.table.amount')}</TableCell>
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
                        <TableCell colSpan={5} align="right"><strong>{t('pages.quotations.preview.table.total')}</strong></TableCell>
                        <TableCell><strong>{newQuotation.totalAmount?.toLocaleString('vi-VN')} VNĐ</strong></TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" gutterBottom>{t('pages.quotations.preview.notes')}</Typography>
                <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
                  {newQuotation.note || t('pages.quotations.preview.noNotes')}
                </Typography>
              </Box>
            </Paper>
          </Box>
        )}
      </DialogContent>
      <DialogActions sx={{ p: 2, pt: 3 }}>
        <Button onClick={onClose}>{t('common.cancel')}</Button>
        {activeStep > 0 && (
          <Button onClick={handleBack}>
            {t('common.back')}
          </Button>
        )}
        {activeStep < 2 ? (
          <Button 
            variant="contained" 
            onClick={handleNext}
            endIcon={<NextIcon />}
            disabled={activeStep === 0 ? !isStepOneValid() : false}
          >
            {activeStep === 1 ? t('pages.quotations.steps.preview') : t('common.next')}
          </Button>
        ) : (
          <Button 
            variant="contained" 
            color="primary" 
            onClick={handleSave}
            startIcon={<SaveIcon />}
          >
            {t('common.save')}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default QuotationForm;
