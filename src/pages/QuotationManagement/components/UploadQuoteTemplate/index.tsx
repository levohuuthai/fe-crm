import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Box,
  IconButton,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { Close as CloseIcon, CloudUpload as UploadIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { UploadQuoteTemplateFormValues, ExtractedField } from '../../types/quoteTemplate';

interface UploadQuoteTemplateProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: UploadQuoteTemplateFormValues) => Promise<void>;
}

const UploadQuoteTemplate: React.FC<UploadQuoteTemplateProps> = ({
  open,
  onClose,
  onSubmit,
}) => {
  const { t } = useTranslation();
  const [values, setValues] = useState<UploadQuoteTemplateFormValues>({
    name: '',
    description: '',
    type: 'customer',
    file: null,
    extractedFields: [],
  });
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [extractedFields, setExtractedFields] = useState<ExtractedField[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | { target: { name?: string; value: unknown } }) => {
    const { name, value } = e.target;
    if (name) {
      setValues((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    
    if (file) {
      // Validate file type
      if (!file.name.endsWith('.docx') && !file.name.endsWith('.doc') && !file.name.endsWith('.pdf')) {
        alert(t('pages.quotations.templateUpload.validations.invalidFormat'));
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert(t('pages.quotations.templateUpload.validations.oversize'));
        return;
      }
      
      setValues((prev) => ({ ...prev, file }));
      setAnalyzing(true);
      
      // Mock AI analysis
      setTimeout(() => {
        // Mock extracted fields from file
        const mockExtractedFields: ExtractedField[] = [
          {
            originalText: 'CÔNG TY TNHH GIẤY CAO PHÁT',
            placeholder: 'TEN_CONG_TY_A',
            type: 'text',
            description: 'Tên công ty bên A',
            required: true,
            example: 'Công ty TNHH ABC'
          },
          {
            originalText: 'Số 352, Khu Phố Mỹ Hiệp, Phường Thái Hoà, Thành phố Tân Uyên, Tỉnh Bình Dương',
            placeholder: 'DIA_CHI_A',
            type: 'text',
            description: 'Địa chỉ bên A',
            required: true,
            example: 'Số 123, Đường ABC, Quận 1, TP.HCM'
          },
          {
            originalText: '0274 3775 179',
            placeholder: 'DIEN_THOAI_A',
            type: 'phone',
            description: 'Số điện thoại bên A',
            required: true,
            example: '0901234567'
          },
          {
            originalText: '3701711279',
            placeholder: 'MA_SO_THUE_A',
            type: 'taxcode',
            description: 'Mã số thuế bên A',
            required: true,
            example: '0123456789'
          },
          {
            originalText: 'LÊ THỊ KIM CHI',
            placeholder: 'NGUOI_DAI_DIEN_A',
            type: 'text',
            description: 'Người đại diện bên A',
            required: true,
            example: 'Nguyễn Văn A'
          },
          {
            originalText: 'Giám đốc',
            placeholder: 'CHUC_VU_A',
            type: 'text',
            description: 'Chức vụ người đại diện bên A',
            required: true,
            example: 'Giám đốc'
          },
          {
            originalText: '10.000.000 VNĐ',
            placeholder: 'GIA_TRI_HOP_DONG',
            type: 'number',
            description: 'Giá trị hợp đồng',
            required: true,
            example: '50.000.000 VNĐ'
          },
          {
            originalText: '01/08/2025',
            placeholder: 'NGAY_BAT_DAU',
            type: 'date',
            description: 'Ngày bắt đầu hợp đồng',
            required: true,
            example: '01/01/2025'
          }
        ];
        
        setExtractedFields(mockExtractedFields);
        setValues(prev => ({ ...prev, extractedFields: mockExtractedFields }));
        setAnalyzing(false);
      }, 2000);
    }
  };
  
  const handleUpdatePlaceholder = (index: number, field: keyof ExtractedField, value: string) => {
    const updatedFields = [...extractedFields];
    updatedFields[index] = { ...updatedFields[index], [field]: value };
    setExtractedFields(updatedFields);
    setValues(prev => ({ ...prev, extractedFields: updatedFields }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!values.name.trim()) {
      alert(t('pages.quotations.templateUpload.validations.missingName'));
      return;
    }
    
    if (!values.file) {
      alert(t('pages.quotations.templateUpload.validations.missingFile'));
      return;
    }
    
    try {
      setLoading(true);
      await onSubmit(values);
      handleClose();
    } catch (error) {
      console.error('Error submitting template:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setValues({
      name: '',
      description: '',
      type: 'customer',
      file: null,
      extractedFields: [],
    });
    setExtractedFields([]);
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="lg" fullWidth>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">{t('pages.quotations.templateUpload.title')}</Typography>
          <IconButton onClick={handleClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent dividers>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 2fr' }, gap: 3 }}>
            <Box>
              <TextField
                label={t('pages.quotations.templateUpload.fields.name')}
                name="name"
                value={values.name}
                onChange={handleChange}
                fullWidth
                margin="normal"
                required
                disabled={loading}
              />
              
              <TextField
                label={t('pages.quotations.templateUpload.fields.description')}
                name="description"
                value={values.description}
                onChange={handleChange}
                fullWidth
                multiline
                rows={3}
                margin="normal"
                disabled={loading}
              />
              
              <FormControl fullWidth margin="normal">
                <InputLabel>{t('pages.quotations.templateUpload.fields.type')}</InputLabel>
                <Select
                  label={t('pages.quotations.templateUpload.fields.type')}
                  name="type"
                  value={values.type}
                  onChange={handleChange}
                  disabled={loading}
                >
                  <MenuItem value="customer">{t('pages.quotations.templateUpload.options.type.customer')}</MenuItem>
                  <MenuItem value="internal">{t('pages.quotations.templateUpload.options.type.internal')}</MenuItem>
                </Select>
              </FormControl>
              
              <Box mt={2} mb={2}>
                <input
                  accept={t('pages.quotations.templateUpload.file.accept') as string}
                  style={{ display: 'none' }}
                  id="template-upload"
                  type="file"
                  onChange={handleFileChange}
                  disabled={loading || analyzing}
                />
                <label htmlFor="template-upload">
                  <Button
                    variant="outlined"
                    component="span"
                    startIcon={<UploadIcon />}
                    disabled={loading || analyzing}
                  >
                    {t('pages.quotations.templateUpload.file.choose')}
                  </Button>
                </label>
                {values.file && (
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    {t('pages.quotations.templateUpload.file.selected')} {values.file.name}
                  </Typography>
                )}
              </Box>
            </Box>
            
            <Box>
              <Paper variant="outlined" sx={{ p: 2, height: '100%' }}>
                <Typography variant="subtitle1" gutterBottom>
                  {t('pages.quotations.templateUpload.extracted.title')}
                </Typography>
                
                {analyzing ? (
                  <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" py={4}>
                    <CircularProgress size={40} />
                    <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
                      {t('pages.quotations.templateUpload.analyzing')}
                    </Typography>
                  </Box>
                ) : extractedFields.length > 0 ? (
                  <TableContainer component={Paper} variant="outlined">
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>{t('pages.quotations.templateUpload.extracted.columns.original')}</TableCell>
                          <TableCell>{t('pages.quotations.templateUpload.extracted.columns.placeholder')}</TableCell>
                          <TableCell>{t('pages.quotations.templateUpload.extracted.columns.type')}</TableCell>
                          <TableCell>{t('pages.quotations.templateUpload.extracted.columns.description')}</TableCell>
                          <TableCell align="center">{t('pages.quotations.templateUpload.extracted.columns.actions')}</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {extractedFields.map((field, index) => (
                          <TableRow key={index}>
                            <TableCell>{field.originalText}</TableCell>
                            <TableCell>
                              <TextField
                                size="small"
                                value={field.placeholder}
                                onChange={(e) => handleUpdatePlaceholder(index, 'placeholder', e.target.value)}
                                fullWidth
                                disabled={loading}
                              />
                            </TableCell>
                            <TableCell>
                              <FormControl fullWidth size="small">
                                <Select
                                  value={field.type}
                                  onChange={(e) => handleUpdatePlaceholder(index, 'type', e.target.value)}
                                  disabled={loading}
                                >
                                  <MenuItem value="text">{t('pages.quotations.templateUpload.fieldTypes.text')}</MenuItem>
                                  <MenuItem value="number">{t('pages.quotations.templateUpload.fieldTypes.number')}</MenuItem>
                                  <MenuItem value="date">{t('pages.quotations.templateUpload.fieldTypes.date')}</MenuItem>
                                  <MenuItem value="phone">{t('pages.quotations.templateUpload.fieldTypes.phone')}</MenuItem>
                                  <MenuItem value="email">{t('pages.quotations.templateUpload.fieldTypes.email')}</MenuItem>
                                  <MenuItem value="taxcode">{t('pages.quotations.templateUpload.fieldTypes.taxcode')}</MenuItem>
                                </Select>
                              </FormControl>
                            </TableCell>
                            <TableCell>
                              <TextField
                                size="small"
                                value={field.description || ''}
                                onChange={(e) => handleUpdatePlaceholder(index, 'description', e.target.value)}
                                fullWidth
                                disabled={loading}
                              />
                            </TableCell>
                            <TableCell align="center">
                              <IconButton size="small" color="error" onClick={() => {
                                const updatedFields = [...extractedFields];
                                updatedFields.splice(index, 1);
                                setExtractedFields(updatedFields);
                                setValues(prev => ({ ...prev, extractedFields: updatedFields }));
                              }} disabled={loading}>
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                ) : values.file ? (
                  <Typography variant="body2" color="textSecondary">
                    {t('pages.quotations.templateUpload.extracted.empty')}
                  </Typography>
                ) : (
                  <Typography variant="body2" color="textSecondary">
                    {t('pages.quotations.templateUpload.extracted.needFile')}
                  </Typography>
                )}
                
                <Box mt={3}>
                  <Typography variant="subtitle2" gutterBottom>
                    {t('pages.quotations.templateUpload.guide.title')}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    - {t('pages.quotations.templateUpload.guide.line1')}
                    <br />
                    - {t('pages.quotations.templateUpload.guide.line2')}
                    <br />
                    - {t('pages.quotations.templateUpload.guide.line3')}
                  </Typography>
                </Box>
              </Paper>
            </Box>
          </Box>
        </DialogContent>
        
        <DialogActions sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
          <Button onClick={handleClose} disabled={loading}>
            {t('common.cancel')}
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={loading || analyzing || extractedFields.length === 0}
            startIcon={loading ? <CircularProgress size={20} /> : null}
          >
            {loading ? t('pages.quotations.templateUpload.actions.uploading') : t('pages.quotations.templateUpload.actions.saveTemplate')}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default UploadQuoteTemplate;
