import React, { useState } from 'react';
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

// Define validation schema
const schema = yup.object({
  name: yup.string().required('Tên template là bắt buộc'),
  description: yup.string().optional(),
  type: yup.string().oneOf(['internal', 'customer']).required('Loại template là bắt buộc'),
  file: yup.mixed<File>().required('File template là bắt buộc')
    .test('fileType', 'Chỉ chấp nhận file .docx', (value) => {
      if (!value) return false;
      const file = value as File;
      return file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
    }),
  extractedFields: yup.array().of(
    yup.object({
      originalText: yup.string().required(),
      placeholder: yup.string().required(),
      type: yup.string().required(),
      description: yup.string().optional()
    })
  ).default([])
}).required();

interface ExtractedField {
  originalText: string;
  placeholder: string;
  type: string;
  description?: string;
}

const UploadTemplate: React.FC<UploadTemplateProps> = ({ open, onClose, onSubmit }) => {
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [extractedFields, setExtractedFields] = useState<ExtractedField[]>([]);

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
      
      // Giả lập phân tích AI
      setTimeout(() => {
        // Mock dữ liệu được phân tích từ file
        const mockExtractedFields: ExtractedField[] = [
          {
            originalText: 'CÔNG TY TNHH GIẤY CAO PHÁT',
            placeholder: 'TEN_CONG_TY_A',
            type: 'text',
            description: 'Tên công ty bên A'
          },
          {
            originalText: 'Thửa đất số 352, Tờ bản đồ số 14, Khu Phố Mỹ Hiệp, Phường Thái Hoà, Thành phố Tân Uyên, Tỉnh Bình Dương',
            placeholder: 'DIA_CHI_A',
            type: 'text',
            description: 'Địa chỉ bên A'
          },
          {
            originalText: '0274 3775 179',
            placeholder: 'DIEN_THOAI_A',
            type: 'phone',
            description: 'Số điện thoại bên A'
          },
          {
            originalText: '3701711279',
            placeholder: 'MA_SO_THUE_A',
            type: 'taxcode',
            description: 'Mã số thuế bên A'
          },
          {
            originalText: 'LÊ THỊ KIM CHI',
            placeholder: 'NGUOI_DAI_DIEN_A',
            type: 'text',
            description: 'Người đại diện bên A'
          },
          {
            originalText: 'Giám đốc',
            placeholder: 'CHUC_VU_A',
            type: 'text',
            description: 'Chức vụ người đại diện bên A'
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
          <Typography variant="h6">Tải lên Template mới</Typography>
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
                label="Tên template"
                fullWidth
                margin="normal"
                error={!!errors.name}
                helperText={errors.name?.message}
                disabled={loading}
              />
              
              <TextField
                {...register('description')}
                label="Mô tả"
                fullWidth
                multiline
                rows={3}
                margin="normal"
                disabled={loading}
              />
              
              <FormControl fullWidth margin="normal" error={!!errors.type}>
                <InputLabel>Loại template</InputLabel>
                <Select
                  label="Loại template"
                  defaultValue="customer"
                  disabled={loading}
                  {...register('type')}
                >
                  <MenuItem value="customer">Cho khách hàng</MenuItem>
                  <MenuItem value="internal">Nội bộ</MenuItem>
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
                    Chọn file template (.docx)
                  </Button>
                </label>
                {selectedFile && (
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    Đã chọn: {selectedFile.name}
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
                  Các trường được phân tích từ hợp đồng:
                </Typography>
                
                {analyzing ? (
                  <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" py={4}>
                    <CircularProgress size={40} />
                    <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
                      Đang phân tích nội dung hợp đồng...
                    </Typography>
                  </Box>
                ) : extractedFields.length > 0 ? (
                  <TableContainer component={Paper} variant="outlined">
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Trường gốc trong file</TableCell>
                          <TableCell>Placeholder gợi ý</TableCell>
                          <TableCell>Kiểu dữ liệu</TableCell>
                          <TableCell>Mô tả</TableCell>
                          <TableCell align="center">Thao tác</TableCell>
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
                                  <MenuItem value="text">Văn bản</MenuItem>
                                  <MenuItem value="number">Số</MenuItem>
                                  <MenuItem value="date">Ngày tháng</MenuItem>
                                  <MenuItem value="phone">Điện thoại</MenuItem>
                                  <MenuItem value="email">Email</MenuItem>
                                  <MenuItem value="taxcode">Mã số thuế</MenuItem>
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
                    Không tìm thấy trường nào có thể trích xuất từ file. Vui lòng kiểm tra lại nội dung file.
                  </Typography>
                ) : (
                  <Typography variant="body2" color="textSecondary">
                    Vui lòng tải lên file hợp đồng để AI phân tích và đề xuất các trường dữ liệu.
                  </Typography>
                )}
                
                <Box mt={3}>
                  <Typography variant="subtitle2" gutterBottom>
                    Hướng dẫn sử dụng:
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    - AI sẽ tự động phân tích nội dung hợp đồng và đề xuất các trường cần điền
                    <br />
                    - Bạn có thể chỉnh sửa tên placeholder và mô tả cho phù hợp
                    <br />
                    - Khi tạo hợp đồng, hệ thống sẽ tự động điền các thông tin vào các vị trí tương ứng
                  </Typography>
                </Box>
              </Paper>
            </Box>
          </Box>
        </DialogContent>
        
        <DialogActions sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
          <Button onClick={handleClose} disabled={loading}>
            Hủy
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={loading || analyzing || extractedFields.length === 0}
            startIcon={loading ? <CircularProgress size={20} /> : null}
          >
            {loading ? 'Đang tải lên...' : 'Lưu Template'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default UploadTemplate;
