import React, { useState } from 'react';
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
      // Kiểm tra định dạng file
      if (!file.name.endsWith('.docx') && !file.name.endsWith('.doc') && !file.name.endsWith('.pdf')) {
        alert('Chỉ chấp nhận file .doc, .docx hoặc .pdf');
        return;
      }
      
      // Kiểm tra kích thước file (tối đa 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Kích thước file không được vượt quá 5MB');
        return;
      }
      
      setValues((prev) => ({ ...prev, file }));
      setAnalyzing(true);
      
      // Giả lập phân tích AI
      setTimeout(() => {
        // Mock dữ liệu được phân tích từ file
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
      alert('Vui lòng nhập tên mẫu báo giá');
      return;
    }
    
    if (!values.file) {
      alert('Vui lòng chọn file mẫu báo giá');
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
          <Typography variant="h6">Tải lên mẫu báo giá</Typography>
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
                label="Tên mẫu báo giá"
                name="name"
                value={values.name}
                onChange={handleChange}
                fullWidth
                margin="normal"
                required
                disabled={loading}
              />
              
              <TextField
                label="Mô tả"
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
                <InputLabel>Loại mẫu</InputLabel>
                <Select
                  label="Loại mẫu"
                  name="type"
                  value={values.type}
                  onChange={handleChange}
                  disabled={loading}
                >
                  <MenuItem value="customer">Cho khách hàng</MenuItem>
                  <MenuItem value="internal">Nội bộ</MenuItem>
                </Select>
              </FormControl>
              
              <Box mt={2} mb={2}>
                <input
                  accept=".docx,.doc,.pdf"
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
                    Chọn file mẫu (.docx, .doc, .pdf)
                  </Button>
                </label>
                {values.file && (
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    Đã chọn: {values.file.name}
                  </Typography>
                )}
              </Box>
            </Box>
            
            <Box>
              <Paper variant="outlined" sx={{ p: 2, height: '100%' }}>
                <Typography variant="subtitle1" gutterBottom>
                  Các trường được phân tích từ mẫu báo giá:
                </Typography>
                
                {analyzing ? (
                  <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" py={4}>
                    <CircularProgress size={40} />
                    <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
                      Đang phân tích nội dung mẫu báo giá...
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
                    Không tìm thấy trường nào có thể trích xuất từ file. Vui lòng kiểm tra lại nội dung file.
                  </Typography>
                ) : (
                  <Typography variant="body2" color="textSecondary">
                    Vui lòng tải lên file mẫu báo giá để AI phân tích và đề xuất các trường dữ liệu.
                  </Typography>
                )}
                
                <Box mt={3}>
                  <Typography variant="subtitle2" gutterBottom>
                    Hướng dẫn sử dụng:
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    - AI sẽ tự động phân tích nội dung mẫu báo giá và đề xuất các trường cần điền
                    <br />
                    - Bạn có thể chỉnh sửa tên placeholder và mô tả cho phù hợp
                    <br />
                    - Khi tạo báo giá, hệ thống sẽ tự động điền các thông tin vào các vị trí tương ứng
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
            {loading ? 'Đang tải lên...' : 'Lưu mẫu báo giá'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default UploadQuoteTemplate;
