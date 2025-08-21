import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Box,
  Stepper,
  Step,
  StepLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Paper
} from '@mui/material';
// Using textarea instead of TinyMCE to avoid additional dependencies
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { useTranslation } from 'react-i18next';

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

interface Contract {
  id: string;
  name: string;
  status: string;
}

interface ContractAppendix {
  id: string;
  name: string;
  contractId: string;
  contractName: string;
  status: 'draft' | 'pending' | 'signed' | 'cancelled';
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  content?: string;
  notes?: string;
  file?: File | null;
  templateId?: string;
}

interface CreateAppendixDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (appendix: Partial<ContractAppendix>, action: 'draft' | 'submit' | 'sign') => void;
  templates: AppendixTemplate[];
}

const CreateAppendixDialog: React.FC<CreateAppendixDialogProps> = ({ 
  open, 
  onClose, 
  onSave,
  templates 
}) => {
  const { t } = useTranslation();
  const [activeStep, setActiveStep] = useState(0);
  const [creationMethod, setCreationMethod] = useState<'template' | 'manual'>('template');
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [appendix, setAppendix] = useState<Partial<ContractAppendix>>({
    name: '',
    contractId: '',
    content: '',
    notes: '',
    status: 'draft',
    file: null
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [editorContent, setEditorContent] = useState('');

  // Fetch contracts (mock)
  useEffect(() => {
    if (open) {
      // Mock contracts data - in a real app this would be an API call
      const mockContracts: Contract[] = [
        { id: 'HĐ-001', name: t('pages.appendices.sample.contract1', 'CRM development contract'), status: 'active' },
        { id: 'HĐ-002', name: t('pages.appendices.sample.contract2', 'Consulting contract'), status: 'active' },
        { id: 'HĐ-003', name: t('pages.appendices.sample.contract3', 'Maintenance contract'), status: 'active' }
      ];
      setContracts(mockContracts);
    }
  }, [open]);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleMethodChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCreationMethod(event.target.value as 'template' | 'manual');
  };

  const handleTemplateChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const templateId = event.target.value as string;
    setSelectedTemplate(templateId);
    
    // If a template is selected, we can pre-fill some information
    const template = templates.find(t => t.id === templateId);
    if (template) {
      setAppendix(prev => ({
        ...prev,
        templateId: templateId,
        name: template.type === 'extension' ? t('pages.appendices.defaults.extensionAppendixName') : t('pages.appendices.defaults.valueAppendixName')
      }));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setAppendix(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name === 'contractId') {
      const selectedContract = contracts.find(c => c.id === value);
      setAppendix(prev => ({ 
        ...prev, 
        [name]: value,
        contractName: selectedContract?.name || ''
      }));
    } else {
      setAppendix(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setAppendix(prev => ({ ...prev, file }));
    }
  };

  const handleEditorChange = (content: string) => {
    setEditorContent(content);
    setAppendix(prev => ({ ...prev, content }));
  };

  const handleSave = (action: 'draft' | 'submit' | 'sign') => {
    const now = new Date().toISOString();
    const newAppendix = {
      ...appendix,
      content: editorContent,
      createdAt: now,
      updatedAt: now,
      createdBy: 'Current User', // This would come from authentication context in a real app
      status: action === 'draft' ? 'draft' as const : action === 'submit' ? 'pending' as const : 'signed' as const
    };
    onSave(newAppendix, action);
    resetForm();
  };

  const resetForm = () => {
    setActiveStep(0);
    setCreationMethod('template');
    setSelectedTemplate('');
    setAppendix({
      name: '',
      contractId: '',
      content: '',
      notes: '',
      status: 'draft',
      file: null
    });
    setSelectedFile(null);
    setEditorContent('');
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{t('pages.appendices.dialogs.createAppendixTitle')}</DialogTitle>
      <DialogContent>
        <Stepper activeStep={activeStep} sx={{ pt: 3, pb: 5 }}>
          <Step>
            <StepLabel>{t('pages.appendices.dialogs.steps.chooseMethod')}</StepLabel>
          </Step>
          <Step>
            <StepLabel>{t('pages.appendices.dialogs.steps.fillInformation')}</StepLabel>
          </Step>
        </Stepper>

        {activeStep === 0 ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Typography variant="subtitle1">{t('pages.appendices.dialogs.chooseMethodTitle')}</Typography>
            <RadioGroup
              value={creationMethod}
              onChange={handleMethodChange}
              name="creation-method"
            >
              <FormControlLabel 
                value="template" 
                control={<Radio />} 
                label={t('pages.appendices.dialogs.methods.useTemplate')} 
              />
              {creationMethod === 'template' && (
                <FormControl fullWidth sx={{ ml: 4, mb: 2 }}>
                  <InputLabel>{t('pages.appendices.dialogs.fields.selectTemplate')}</InputLabel>
                  <Select
                    value={selectedTemplate}
                    onChange={(e) => handleTemplateChange(e as any)}
                    label={t('pages.appendices.dialogs.fields.selectTemplate')}
                    name="templateId"
                    disabled={templates.length === 0}
                  >
                    {templates.map((template) => (
                      <MenuItem key={template.id} value={template.id}>
                        {template.name} - {template.type === 'extension' ? t('pages.appendices.types.extension') : template.type === 'value' ? t('pages.appendices.types.value') : t('pages.appendices.types.other')}
                      </MenuItem>
                    ))}
                  </Select>
                  {templates.length === 0 && (
                    <Typography variant="caption" color="error">
                      {t('pages.appendices.dialogs.noTemplatesWarning')}
                    </Typography>
                  )}
                </FormControl>
              )}
              <FormControlLabel 
                value="manual" 
                control={<Radio />} 
                label={t('pages.appendices.dialogs.methods.manual')} 
              />
            </RadioGroup>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              name="name"
              label={t('pages.appendices.dialogs.fields.appendixName')}
              value={appendix.name}
              onChange={handleChange}
              fullWidth
              required
              margin="normal"
            />
            
            <FormControl fullWidth margin="normal">
              <InputLabel>{t('pages.appendices.dialogs.fields.linkedContract')}</InputLabel>
              <Select
                name="contractId"
                value={appendix.contractId}
                onChange={(e) => handleSelectChange(e as any)}
                label={t('pages.appendices.dialogs.fields.linkedContract')}
                required
              >
                {contracts.map((contract) => (
                  <MenuItem key={contract.id} value={contract.id}>
                    {contract.id} - {contract.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            
            <TextField
              name="createdAt"
              label={t('pages.appendices.dialogs.fields.createdAt')}
              type="date"
              value={appendix.createdAt || new Date().toISOString().split('T')[0]}
              onChange={handleChange}
              fullWidth
              InputLabelProps={{
                shrink: true,
              }}
              margin="normal"
            />
            
            <Box sx={{ mb: 2 }}>
              <Button
                component="label"
                variant="outlined"
                startIcon={<CloudUploadIcon />}
                sx={{ mb: 1 }}
              >
                {t('pages.appendices.dialogs.actions.uploadAttachment')}
                <input
                  type="file"
                  hidden
                  accept=".pdf,.docx,.xlsx,.jpg,.png"
                  onChange={handleFileChange}
                />
              </Button>
              {selectedFile && (
                <Typography variant="body2" color="textSecondary">
                  {t('pages.appendices.dialogs.selectedFile')}: {selectedFile.name}
                </Typography>
              )}
            </Box>
            
            <Typography variant="subtitle1" sx={{ mt: 2 }}>{t('pages.appendices.dialogs.fields.appendixContent')}</Typography>
            <Paper variant="outlined" sx={{ p: 1 }}>
              <TextField
                fullWidth
                multiline
                rows={10}
                placeholder={t('pages.appendices.dialogs.placeholders.appendixContent')}
                value={editorContent}
                onChange={(e) => handleEditorChange(e.target.value)}
                variant="outlined"
                sx={{ '& .MuiOutlinedInput-root': { p: 1 } }}
                defaultValue={creationMethod === 'template' && selectedTemplate ? t('pages.appendices.dialogs.defaults.contentFromTemplate') : ""}
              />
            </Paper>
            
            <TextField
              name="notes"
              label={t('pages.appendices.dialogs.fields.internalNotes')}
              value={appendix.notes}
              onChange={handleChange}
              fullWidth
              multiline
              rows={2}
              margin="normal"
            />
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>{t('common.cancel')}</Button>
        {activeStep > 0 && (
          <Button onClick={handleBack}>
            {t('common.back')}
          </Button>
        )}
        {activeStep === 0 ? (
          <Button 
            onClick={handleNext} 
            variant="contained" 
            color="primary"
            disabled={creationMethod === 'template' && !selectedTemplate}
          >
            {t('common.next')}
          </Button>
        ) : (
          <>
            <Button 
              onClick={() => handleSave('draft')} 
              variant="outlined"
            >
              {t('pages.appendices.dialogs.actions.saveDraft')}
            </Button>
            <Button 
              onClick={() => handleSave('submit')} 
              variant="contained" 
              color="primary"
              disabled={!appendix.name || !appendix.contractId}
            >
              {t('pages.appendices.dialogs.actions.submit')}
            </Button>
            <Button 
              onClick={() => handleSave('sign')} 
              variant="contained" 
              color="success"
              disabled={!appendix.name || !appendix.contractId}
            >
              {t('pages.appendices.dialogs.actions.signAppendix')}
            </Button>
          </>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default CreateAppendixDialog;
