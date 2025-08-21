import React, { useMemo, useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
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
  Box,
  Typography,
  CircularProgress,
  Paper,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { Close as CloseIcon, CloudUpload as UploadIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { UploadTemplateFormValues, UploadTemplateProps } from './types';
import { useTranslation } from 'react-i18next';

// Validation schema will be created inside the component to access translations

interface ExtractedField {
  originalText: string;
  placeholder: string;
  type: string;
  description?: string;
}

const UploadTemplate: React.FC<UploadTemplateProps> = ({ open, onClose, onSubmit }) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [extractedFields, setExtractedFields] = useState<ExtractedField[]>([]);

  // Localized validation schema
  const schema = useMemo(() =>
    yup.object({
      name: yup.string().required(t('pages.contracts.uploadTemplate.validation.nameRequired')),
      description: yup.string().optional(),
      type: yup
        .string()
        .oneOf(['internal', 'customer'])
        .required(t('pages.contracts.uploadTemplate.validation.typeRequired')),
      file: yup
        .mixed<File>()
        .required(t('pages.contracts.uploadTemplate.validation.fileRequired'))
        .test('fileType', t('pages.contracts.uploadTemplate.validation.fileType'), (value) => {
          if (!value) return false;
          const file = value as File;
          return file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
        }),
      extractedFields: yup
        .array()
        .of(
          yup.object({
            originalText: yup.string().required(),
            placeholder: yup.string().required(),
            type: yup.string().required(),
            description: yup.string().optional(),
          })
        )
        .default([]),
    })
  , [t]);

  type FormData = yup.InferType<typeof schema>;

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema) as any,
    defaultValues: {
      name: '',
      description: '',
      type: 'customer' as const,
      file: undefined,
      extractedFields: [],
    },
  });

  const selectedFile = watch('file');

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setValue('file', file);
      setAnalyzing(true);
      
      // Simulate AI analysis
      setTimeout(() => {
        // Mock extracted data from file
        const mockExtractedFields: ExtractedField[] = [
          {
            originalText: 'CÔNG TY TNHH GIẤY CAO PHÁT',
            placeholder: 'TEN_CONG_TY_A',
            type: 'text',
            description: t('pages.contracts.uploadTemplate.sample.descriptions.partyAName')
          },
          {
            originalText: 'Thửa đất số 352, Tờ bản đồ số 14, Khu Phố Mỹ Hiệp, Phường Thái Hoà, Thành phố Tân Uyên, Tỉnh Bình Dương',
            placeholder: 'DIA_CHI_A',
            type: 'text',
            description: t('pages.contracts.uploadTemplate.sample.descriptions.partyAAddress')
          },
          {
            originalText: '0274 3775 179',
            placeholder: 'DIEN_THOAI_A',
            type: 'phone',
            description: t('pages.contracts.uploadTemplate.sample.descriptions.partyAPhone')
          },
          {
            originalText: '3701711279',
            placeholder: 'MA_SO_THUE_A',
            type: 'taxcode',
            description: t('pages.contracts.uploadTemplate.sample.descriptions.partyATax')
          },
          {
            originalText: 'LÊ THỊ KIM CHI',
            placeholder: 'NGUOI_DAI_DIEN_A',
            type: 'text',
            description: t('pages.contracts.uploadTemplate.sample.descriptions.partyARepresentative')
          },
          {
            originalText: 'Giám đốc',
            placeholder: 'CHUC_VU_A',
            type: 'text',
            description: t('pages.contracts.uploadTemplate.sample.descriptions.partyATitle')
          }
        ];
        
        setExtractedFields(mockExtractedFields);
        setValue('extractedFields', mockExtractedFields);
        setAnalyzing(false);
      }, 2000);
    }
  };
  
  const handleUpdatePlaceholder = (index: number, field: keyof ExtractedField, value: string) => {
    const updatedFields = [...extractedFields];
    updatedFields[index] = { ...updatedFields[index], [field]: value };
    setExtractedFields(updatedFields);
    setValue('extractedFields', updatedFields);
  };

  const handleFormSubmit: SubmitHandler<FormData> = async (data) => {
    try {
      setLoading(true);
      await onSubmit(data as UploadTemplateFormValues);
      handleClose();
    } catch (error) {
      console.error('Error uploading template:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    reset();
    setExtractedFields([]);
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="lg" fullWidth>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">{t('pages.contracts.uploadTemplate.title')}</Typography>
          <IconButton onClick={handleClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <form onSubmit={handleSubmit(handleFormSubmit as any)}>
        <DialogContent dividers>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 2fr' }, gap: 3 }}>
            <Box>
              <TextField
                {...register('name')}
                label={t('pages.contracts.uploadTemplate.fields.name')}
                fullWidth
                margin="normal"
                error={!!errors.name}
                helperText={errors.name?.message}
                disabled={loading}
              />
              
              <TextField
                {...register('description')}
                label={t('pages.contracts.uploadTemplate.fields.description')}
                fullWidth
                multiline
                rows={3}
                margin="normal"
                disabled={loading}
              />
              
              <FormControl fullWidth margin="normal" error={!!errors.type}>
                <InputLabel>{t('pages.contracts.uploadTemplate.fields.type')}</InputLabel>
                <Select
                  label={t('pages.contracts.uploadTemplate.fields.type')}
                  defaultValue="customer"
                  disabled={loading}
                  {...register('type')}
                >
                  <MenuItem value="customer">{t('pages.contracts.uploadTemplate.fields.typeOptions.customer')}</MenuItem>
                  <MenuItem value="internal">{t('pages.contracts.uploadTemplate.fields.typeOptions.internal')}</MenuItem>
                </Select>
              </FormControl>
              
              <Box mt={2} mb={2}>
                <input
                  accept=".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
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
                    {t('pages.contracts.uploadTemplate.fields.fileButton')}
                  </Button>
                </label>
                {selectedFile && (
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    {t('pages.contracts.uploadTemplate.fields.selectedFilePrefix')} {selectedFile.name}
                  </Typography>
                )}
                {errors.file && (
                  <Typography color="error" variant="caption" display="block">
                    {errors.file.message as React.ReactNode}
                  </Typography>
                )}
              </Box>
            </Box>
            
            <Box>
              <Paper variant="outlined" sx={{ p: 2, height: '100%' }}>
                <Typography variant="subtitle1" gutterBottom>
                  {t('pages.contracts.uploadTemplate.analysis.title')}
                </Typography>
                
                {analyzing ? (
                  <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" py={4}>
                    <CircularProgress size={40} />
                    <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
                      {t('pages.contracts.uploadTemplate.analysis.analyzingText')}
                    </Typography>
                  </Box>
                ) : extractedFields.length > 0 ? (
                  <TableContainer component={Paper} variant="outlined">
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>{t('pages.contracts.uploadTemplate.analysis.headers.originalText')}</TableCell>
                          <TableCell>{t('pages.contracts.uploadTemplate.analysis.headers.placeholder')}</TableCell>
                          <TableCell>{t('pages.contracts.uploadTemplate.analysis.headers.type')}</TableCell>
                          <TableCell>{t('pages.contracts.uploadTemplate.analysis.headers.description')}</TableCell>
                          <TableCell align="center">{t('pages.contracts.uploadTemplate.analysis.headers.actions')}</TableCell>
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
                                  <MenuItem value="text">{t('pages.contracts.uploadTemplate.analysis.typeOptions.text')}</MenuItem>
                                  <MenuItem value="number">{t('pages.contracts.uploadTemplate.analysis.typeOptions.number')}</MenuItem>
                                  <MenuItem value="date">{t('pages.contracts.uploadTemplate.analysis.typeOptions.date')}</MenuItem>
                                  <MenuItem value="phone">{t('pages.contracts.uploadTemplate.analysis.typeOptions.phone')}</MenuItem>
                                  <MenuItem value="email">{t('pages.contracts.uploadTemplate.analysis.typeOptions.email')}</MenuItem>
                                  <MenuItem value="taxcode">{t('pages.contracts.uploadTemplate.analysis.typeOptions.taxcode')}</MenuItem>
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
                                setValue('extractedFields', updatedFields);
                              }} disabled={loading}>
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                ) : selectedFile ? (
                  <Typography variant="body2" color="textSecondary">
                    {t('pages.contracts.uploadTemplate.analysis.noFieldsFound')}
                  </Typography>
                ) : (
                  <Typography variant="body2" color="textSecondary">
                    {t('pages.contracts.uploadTemplate.analysis.uploadPrompt')}
                  </Typography>
                )}
                
                <Box mt={3}>
                  <Typography variant="subtitle2" gutterBottom>
                    {t('pages.contracts.uploadTemplate.guidance.title')}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    - {t('pages.contracts.uploadTemplate.guidance.items.0')}
                    <br />
                    - {t('pages.contracts.uploadTemplate.guidance.items.1')}
                    <br />
                    - {t('pages.contracts.uploadTemplate.guidance.items.2')}
                  </Typography>
                </Box>
              </Paper>
            </Box>
          </Box>
        </DialogContent>
        
        <DialogActions sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
          <Button onClick={handleClose} disabled={loading}>
            {t('pages.contracts.uploadTemplate.buttons.cancel')}
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={loading || analyzing || extractedFields.length === 0}
            startIcon={loading ? <CircularProgress size={20} /> : null}
          >
            {loading ? t('pages.contracts.uploadTemplate.buttons.saving') : t('pages.contracts.uploadTemplate.buttons.save')}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default UploadTemplate;
