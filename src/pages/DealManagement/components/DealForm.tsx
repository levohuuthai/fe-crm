import React, { useState, useEffect, useMemo } from 'react';
import {
  Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField, 
  FormControl, InputLabel, Select, MenuItem, Divider, Typography, 
  Box, Switch, FormControlLabel, InputAdornment, FormHelperText
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { Deal, DealFormData, DealStage } from './DealTypes';

interface DealFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (dealData: DealFormData) => void;
  initialData?: Deal;
  title?: string;
}

/**
 * Component form thêm/sửa deal
 */
const DealForm: React.FC<DealFormProps> = ({
  open,
  onClose,
  onSubmit,
  initialData,
  title = 'Thêm Deal mới'
}) => {
  // Khởi tạo giá trị mặc định cho form sử dụng useMemo để tránh tạo mới mỗi lần render
  const defaultFormData = useMemo<DealFormData>(() => ({
    name: '',
    customer: '',
    value: 0,
    stage: DealStage.INITIAL_CONTACT,
    notes: '',
    deadline: '',
    owner: '',
    hasReminder: false,
    reminderDate: undefined,
    reminderNote: ''
  }), []);

  // State lưu trữ dữ liệu form
  const [formData, setFormData] = useState<DealFormData>(defaultFormData);
  
  // State lưu trữ lỗi validation
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Cập nhật form data khi initialData thay đổi
  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        customer: initialData.customer,
        value: initialData.value,
        stage: initialData.stage,
        notes: initialData.notes || '',
        deadline: initialData.deadline || '',
        owner: initialData.owner || '',
        hasReminder: !!initialData.reminderDate,
        reminderDate: initialData.reminderDate,
        reminderNote: initialData.reminderNote || ''
      });
    } else {
      setFormData(defaultFormData);
    }
    setErrors({});
  }, [initialData, defaultFormData]);

  // Xử lý thay đổi các trường input
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Xóa lỗi khi người dùng sửa trường
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Xử lý thay đổi select
  const handleSelectChange = (event: { target: { name: string; value: DealStage } }) => {
    const { name, value } = event.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Xử lý thay đổi ngày
  const handleDateChange = (name: 'deadline' | 'reminderDate', date: Date | null) => {
    setFormData(prev => ({
      ...prev,
      [name]: date?.toISOString() || ''
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Xử lý bật/tắt nhắc việc
  const handleReminderToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    setFormData(prev => ({
      ...prev,
      hasReminder: checked,
      // Nếu tắt nhắc việc, xóa dữ liệu nhắc việc
      reminderDate: checked ? prev.reminderDate : undefined,
      reminderNote: checked ? prev.reminderNote : ''
    }));
  };

  // Kiểm tra dữ liệu hợp lệ
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Vui lòng nhập tên deal';
    }
    
    if (!formData.customer.trim()) {
      newErrors.customer = 'Vui lòng nhập tên khách hàng';
    }
    
    if (formData.value <= 0) {
      newErrors.value = 'Giá trị deal phải lớn hơn 0';
    }
    
    // Kiểm tra ngày nhắc việc nếu bật nhắc việc
    if (formData.hasReminder && !formData.reminderDate) {
      newErrors.reminderDate = 'Vui lòng chọn ngày nhắc việc';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Xử lý gửi form
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
    }
  };
  


  // Danh sách các giai đoạn deal
  const stageOptions = [
    { value: DealStage.INITIAL_CONTACT, label: 'Liên hệ ban đầu' },
    { value: DealStage.REQUIREMENT_RECORDED, label: 'Đã ghi nhận yêu cầu' },
    { value: DealStage.QUOTE_SENT, label: 'Đã gửi báo giá' },
    { value: DealStage.CONTRACT_SENT, label: 'Gửi hợp đồng' },
    { value: DealStage.CLOSED_WON, label: 'Đã chốt' },
    { value: DealStage.CLOSED_LOST, label: 'Đã huỷ' }
  ];

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">{title}</Typography>
        </Box>
      </DialogTitle>
      
      <Divider />
      
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <Box sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
            gap: 2,
            py: 2
          }}>
            {/* Thông tin cơ bản */}
            <Box sx={{ gridColumn: '1 / -1' }}>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                Thông tin cơ bản
              </Typography>
            </Box>
            
            <Box>
              <TextField
                fullWidth
                label="Tên Deal *"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                error={!!errors.name}
                helperText={errors.name}
              />
            </Box>
            
            <Box>
              <TextField
                fullWidth
                label="Khách hàng *"
                name="customer"
                value={formData.customer}
                onChange={handleInputChange}
                error={!!errors.customer}
                helperText={errors.customer}
              />
            </Box>
            
            <Box>
              <TextField
                fullWidth
                label="Giá trị Deal *"
                name="value"
                type="number"
                value={formData.value}
                onChange={handleInputChange}
                InputProps={{
                  startAdornment: <InputAdornment position="start">đ</InputAdornment>,
                }}
                error={!!errors.value}
                helperText={errors.value}
              />
            </Box>
            
            <Box>
              <FormControl fullWidth error={!!errors.stage}>
                <InputLabel id="stage-select-label">Giai đoạn *</InputLabel>
                <Select
                  labelId="stage-select-label"
                  name="stage"
                  value={formData.stage}
                  label="Giai đoạn *"
                  onChange={handleSelectChange}
                >
                  {stageOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
                {errors.stage && <FormHelperText>{errors.stage}</FormHelperText>}
              </FormControl>
            </Box>
            
            <Box>
              <TextField
                fullWidth
                label="Chủ sở hữu *"
                name="owner"
                value={formData.owner}
                onChange={handleInputChange}
                error={!!errors.owner}
                helperText={errors.owner}
              />
            </Box>
            
            <Box sx={{ gridColumn: '1 / -1' }}>
              <TextField
                fullWidth
                label="Mô tả"
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                multiline
                rows={3}
              />
            </Box>
            
            <Box>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Hạn chốt"
                  value={formData.deadline ? new Date(formData.deadline) : null}
                  onChange={(date) => handleDateChange('deadline', date)}
                  slotProps={{ textField: { fullWidth: true } }}
                />
              </LocalizationProvider>
            </Box>
            
            {/* Phần nhắc việc */}
            <Box sx={{ gridColumn: '1 / -1', mt: 2 }}>
              <Divider />
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                <Typography variant="subtitle1" fontWeight="bold">
                  Nhắc việc
                </Typography>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.hasReminder}
                      onChange={handleReminderToggle}
                      color="primary"
                    />
                  }
                  label={formData.hasReminder ? 'Đã bật' : 'Tắt'}
                  sx={{ ml: 2 }}
                />
              </Box>
            </Box>
            
            {formData.hasReminder && (
              <>
                <Box>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      label="Ngày nhắc việc *"
                      value={formData.reminderDate ? new Date(formData.reminderDate) : null}
                      onChange={(date) => handleDateChange('reminderDate', date)}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          error: !!errors.reminderDate,
                          helperText: errors.reminderDate
                        }
                      }}
                      minDate={new Date()}
                    />
                  </LocalizationProvider>
                </Box>
                
                <Box sx={{ gridColumn: '1 / -1' }}>
                  <TextField
                    fullWidth
                    label="Ghi chú nhắc việc"
                    name="reminderNote"
                    value={formData.reminderNote}
                    onChange={handleInputChange}
                    multiline
                    rows={3}
                  />
                </Box>
              </>
            )}
          </Box>
        </form>
      </DialogContent>
      
      <Divider />
      
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose} variant="outlined" color="inherit">
          Hủy
        </Button>
        <Button type="submit" form="deal-form" variant="contained" color="primary">
          {initialData ? 'Cập nhật' : 'Thêm mới'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DealForm;
