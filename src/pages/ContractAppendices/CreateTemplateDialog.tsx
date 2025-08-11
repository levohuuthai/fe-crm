import React, { useState } from 'react';
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
  FormControlLabel,
  Switch,
  Typography,
  Box
} from '@mui/material';
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
  file?: File | null;
}

interface CreateTemplateDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (template: Partial<AppendixTemplate>) => void;
}

const CreateTemplateDialog: React.FC<CreateTemplateDialogProps> = ({ open, onClose, onSave }) => {
  const [template, setTemplate] = useState<Partial<AppendixTemplate>>({
    name: '',
    description: '',
    type: 'extension',
    status: 'active',
    file: null
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setTemplate(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (e: any) => {
    const { name, value } = e.target;
    setTemplate(prev => ({ ...prev, [name]: value }));
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTemplate(prev => ({ 
      ...prev, 
      status: e.target.checked ? 'active' : 'inactive' 
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setTemplate(prev => ({ ...prev, file }));
    }
  };

  const handleSubmit = () => {
    const now = new Date().toISOString();
    const newTemplate = {
      ...template,
      createdAt: now,
      updatedAt: now,
      createdBy: 'Current User', // This would come from authentication context in a real app
    };
    onSave(newTemplate);
    setTemplate({
      name: '',
      description: '',
      type: 'extension',
      status: 'active',
      file: null
    });
    setSelectedFile(null);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Tạo mẫu phụ lục mới</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
          <TextField
            name="name"
            label="Tên mẫu phụ lục"
            value={template.name}
            onChange={handleChange}
            fullWidth
            required
          />
          
          <TextField
            name="description"
            label="Mô tả"
            value={template.description}
            onChange={handleChange}
            fullWidth
            multiline
            rows={3}
          />
          
          <FormControl fullWidth>
            <InputLabel>Loại</InputLabel>
            <Select
              name="type"
              value={template.type}
              onChange={handleSelectChange}
              label="Loại"
            >
              <MenuItem value="extension">Gia hạn (extension)</MenuItem>
              <MenuItem value="value">Thay đổi giá trị (value)</MenuItem>
              <MenuItem value="other">Khác</MenuItem>
            </Select>
          </FormControl>
          
          <FormControlLabel
            control={
              <Switch 
                checked={template.status === 'active'}
                onChange={handleStatusChange}
                color="primary"
              />
            }
            label="Hoạt động"
          />
          
          <Box>
            <Button
              component="label"
              variant="outlined"
              startIcon={<CloudUploadIcon />}
              sx={{ mb: 1 }}
            >
              Upload file mẫu (PDF, DOCX)
              <input
                type="file"
                hidden
                accept=".pdf,.docx"
                onChange={handleFileChange}
              />
            </Button>
            {selectedFile && (
              <Typography variant="body2" color="textSecondary">
                File đã chọn: {selectedFile.name}
              </Typography>
            )}
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Huỷ</Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained" 
          color="primary"
          disabled={!template.name}
        >
          Lưu mẫu
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateTemplateDialog;
