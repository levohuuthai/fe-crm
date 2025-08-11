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
        { id: 'HĐ-001', name: 'Hợp đồng mua bán thiết bị', status: 'active' },
        { id: 'HĐ-002', name: 'Hợp đồng cung cấp dịch vụ', status: 'active' },
        { id: 'HĐ-003', name: 'Hợp đồng bảo trì', status: 'active' }
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
        name: `Phụ lục ${template.type === 'extension' ? 'gia hạn' : 'thay đổi giá trị'}`
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
      <DialogTitle>Tạo phụ lục hợp đồng mới</DialogTitle>
      <DialogContent>
        <Stepper activeStep={activeStep} sx={{ pt: 3, pb: 5 }}>
          <Step>
            <StepLabel>Chọn cách tạo</StepLabel>
          </Step>
          <Step>
            <StepLabel>Điền thông tin</StepLabel>
          </Step>
        </Stepper>

        {activeStep === 0 ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Typography variant="subtitle1">Chọn cách tạo phụ lục:</Typography>
            <RadioGroup
              value={creationMethod}
              onChange={handleMethodChange}
              name="creation-method"
            >
              <FormControlLabel 
                value="template" 
                control={<Radio />} 
                label="Sử dụng mẫu phụ lục" 
              />
              {creationMethod === 'template' && (
                <FormControl fullWidth sx={{ ml: 4, mb: 2 }}>
                  <InputLabel>Chọn mẫu</InputLabel>
                  <Select
                    value={selectedTemplate}
                    onChange={(e) => handleTemplateChange(e as any)}
                    label="Chọn mẫu"
                    name="templateId"
                    disabled={templates.length === 0}
                  >
                    {templates.map((template) => (
                      <MenuItem key={template.id} value={template.id}>
                        {template.name} - {template.type === 'extension' ? 'Gia hạn' : template.type === 'value' ? 'Thay đổi giá trị' : 'Khác'}
                      </MenuItem>
                    ))}
                  </Select>
                  {templates.length === 0 && (
                    <Typography variant="caption" color="error">
                      Chưa có mẫu phụ lục nào. Vui lòng tạo mẫu trước.
                    </Typography>
                  )}
                </FormControl>
              )}
              <FormControlLabel 
                value="manual" 
                control={<Radio />} 
                label="Tạo mới thủ công" 
              />
            </RadioGroup>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              name="name"
              label="Tên phụ lục"
              value={appendix.name}
              onChange={handleChange}
              fullWidth
              required
              margin="normal"
            />
            
            <FormControl fullWidth margin="normal">
              <InputLabel>Gắn với hợp đồng</InputLabel>
              <Select
                name="contractId"
                value={appendix.contractId}
                onChange={(e) => handleSelectChange(e as any)}
                label="Gắn với hợp đồng"
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
              label="Ngày tạo"
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
                Upload file đính kèm
                <input
                  type="file"
                  hidden
                  accept=".pdf,.docx,.xlsx,.jpg,.png"
                  onChange={handleFileChange}
                />
              </Button>
              {selectedFile && (
                <Typography variant="body2" color="textSecondary">
                  File đã chọn: {selectedFile.name}
                </Typography>
              )}
            </Box>
            
            <Typography variant="subtitle1" sx={{ mt: 2 }}>Nội dung phụ lục:</Typography>
            <Paper variant="outlined" sx={{ p: 1 }}>
              <TextField
                fullWidth
                multiline
                rows={10}
                placeholder="Nhập nội dung phụ lục..."
                value={editorContent}
                onChange={(e) => handleEditorChange(e.target.value)}
                variant="outlined"
                sx={{ '& .MuiOutlinedInput-root': { p: 1 } }}
                defaultValue={creationMethod === 'template' && selectedTemplate ? "Nội dung từ mẫu phụ lục..." : ""}
              />
            </Paper>
            
            <TextField
              name="notes"
              label="Ghi chú nội bộ (tuỳ chọn)"
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
        <Button onClick={onClose}>Huỷ</Button>
        {activeStep > 0 && (
          <Button onClick={handleBack}>
            Quay lại
          </Button>
        )}
        {activeStep === 0 ? (
          <Button 
            onClick={handleNext} 
            variant="contained" 
            color="primary"
            disabled={creationMethod === 'template' && !selectedTemplate}
          >
            Tiếp theo
          </Button>
        ) : (
          <>
            <Button 
              onClick={() => handleSave('draft')} 
              variant="outlined"
            >
              Lưu nháp
            </Button>
            <Button 
              onClick={() => handleSave('submit')} 
              variant="contained" 
              color="primary"
              disabled={!appendix.name || !appendix.contractId}
            >
              Gửi duyệt
            </Button>
            <Button 
              onClick={() => handleSave('sign')} 
              variant="contained" 
              color="success"
              disabled={!appendix.name || !appendix.contractId}
            >
              Ký phụ lục
            </Button>
          </>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default CreateAppendixDialog;
