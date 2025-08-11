// Component chứa các bộ lọc tìm kiếm

import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import {
  TextField,
  Button,
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  SelectChangeEvent,
  MenuItem,
  Slider,
  IconButton,
  Collapse,
  Paper,
  InputAdornment
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
// Vietnamese locale is automatically handled by AdapterDateFns
// Localization is handled by AdapterDateFns
import {
  Search as SearchIcon,
  FilterList as FilterListIcon,
  Clear as ClearIcon
} from '@mui/icons-material';
import { DealFilters as DealFiltersType, DealStage } from './DealTypes';

interface DealFiltersProps {
  onFilterChange: (filters: DealFiltersType) => void;
  initialFilters?: Partial<DealFiltersType>;
}

/**
 * Component hiển thị bộ lọc tìm kiếm deal
 */
const DealFilters: React.FC<DealFiltersProps> = ({ onFilterChange, initialFilters }) => {
  // Sử dụng useMemo để tránh tạo lại object defaultFilters mỗi lần render
  const defaultFilters = useMemo<DealFiltersType>(() => ({
    searchTerm: '',
    stage: 'Tất cả',
    owner: 'Tất cả',
    dateRange: null,
    hasReminder: null,
    valueRange: {
      min: 0,
      max: 1000000000
    }
  }), []);

  // State lưu trữ các bộ lọc
  const [filters, setFilters] = useState<DealFiltersType>(() => ({
    ...defaultFilters,
    ...initialFilters,
    dateRange: initialFilters?.dateRange ?? null,
    valueRange: {
      min: initialFilters?.valueRange?.min ?? defaultFilters.valueRange.min,
      max: initialFilters?.valueRange?.max ?? defaultFilters.valueRange.max
    },
    hasReminder: initialFilters?.hasReminder ?? null
  }));
  
  // Sử dụng ref để lưu trữ timer cho debounce
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  
  // Hàm debounce để tránh gọi callback quá nhiều lần
  const debounce = useCallback((callback: () => void, delay: number) => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }
    debounceTimer.current = setTimeout(callback, delay);
  }, []);
  
  // State hiển thị/ẩn bộ lọc nâng cao
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  
  // State lưu trữ giá trị slider
  const [valueRange, setValueRange] = useState<number[]>([
    filters.valueRange.min,
    filters.valueRange.max
  ]);

  // Cập nhật filters khi initialFilters thay đổi
  useEffect(() => {
    if (initialFilters) {
      const newFilters: DealFiltersType = {
        ...defaultFilters,
        ...initialFilters,
        dateRange: initialFilters.dateRange ?? null,
        valueRange: {
          min: initialFilters.valueRange?.min ?? defaultFilters.valueRange.min,
          max: initialFilters.valueRange?.max ?? defaultFilters.valueRange.max
        },
        hasReminder: initialFilters.hasReminder ?? null
      };
      setFilters(newFilters);
      setValueRange([
        newFilters.valueRange.min,
        newFilters.valueRange.max
      ]);
    }
  }, [initialFilters, defaultFilters]);

  // Xử lý thay đổi các trường input
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const newFilters = {
      ...filters,
      [name]: value
    };
    
    setFilters(newFilters);
    
    // Tự động áp dụng bộ lọc với debounce 500ms
    debounce(() => {
      onFilterChange(newFilters);
    }, 500);
  };

  // Xử lý thay đổi trường select
  const handleSelectChange = (e: SelectChangeEvent<string>) => {
    const { name, value } = e.target;
    const newFilters = {
      ...filters,
      [name]: value
    };
    
    setFilters(newFilters);
    
    // Tự động áp dụng bộ lọc với debounce 300ms
    debounce(() => {
      onFilterChange(newFilters);
    }, 300);
  };

  // Xử lý thay đổi ngày tháng
  const handleDateChange = (field: 'start' | 'end', date: Date | null) => {
    const currentDateRange = filters.dateRange || { start: null, end: null };
    
    // Nếu date là null và field là 'end' và start cũng là null, không làm gì cả
    if (date === null && field === 'end' && currentDateRange.start === null) {
      return;
    }
    
    const newDateRange = {
      ...currentDateRange,
      [field]: date
    };
    
    // Nếu cả hai giá trị start và end đều null, đặt dateRange thành null
    const updatedDateRange = (newDateRange.start === null && newDateRange.end === null) 
      ? null 
      : newDateRange;
    
    const newFilters = {
      ...filters,
      dateRange: updatedDateRange
    };
    
    setFilters(newFilters);
    
    // Tự động áp dụng bộ lọc với debounce 300ms
    debounce(() => {
      onFilterChange(newFilters);
    }, 300);
  };

  // Xử lý thay đổi giá trị slider
  const handleValueRangeChange = (_event: Event, newValue: number | number[]) => {
    const values = newValue as number[];
    setValueRange(values);
    
    // Cập nhật filters ngay lập tức để giữ đồng bộ
    const newFilters = {
      ...filters,
      valueRange: {
        min: values[0],
        max: values[1]
      }
    };
    
    setFilters(newFilters);
    
    // Tự động áp dụng bộ lọc với debounce 500ms
    debounce(() => {
      onFilterChange(newFilters);
    }, 500);
  };

  // Xử lý khi thả slider
  const handleValueRangeChangeCommitted = () => {
    // Đảm bảo gọi lại lần cuối cùng với giá trị mới nhất
    debounce(() => {
      onFilterChange({
        ...filters,
        valueRange: {
          min: valueRange[0],
          max: valueRange[1]
        }
      });
    }, 0);
  };

  // Xử lý khi nhấn nút tìm kiếm (đã không còn sử dụng nhưng vẫn giữ lại để tránh lỗi)
  const handleSearch = () => {
    onFilterChange({
      ...filters,
      valueRange: {
        min: valueRange[0],
        max: valueRange[1]
      }
    });
  };

  // Xử lý khi nhấn nút xóa bộ lọc
  const handleClearFilters = () => {
    const resetFilters = {
      ...defaultFilters,
      dateRange: null,
      hasReminder: null
    };
    
    setFilters(resetFilters);
    setValueRange([
      defaultFilters.valueRange.min, 
      defaultFilters.valueRange.max
    ]);
    
    // Xóa timer debounce hiện tại
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }
    
    // Áp dụng bộ lọc mới ngay lập tức
    onFilterChange(resetFilters);
  };
  
  // Cleanup timer khi unmount
  useEffect(() => {
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, []);

  // Định dạng giá trị tiền
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0
    }).format(value);
  };

  // Danh sách các giai đoạn deal
  const stageOptions = [
    { value: 'Tất cả', label: 'Tất cả giai đoạn' },
    { value: DealStage.INITIAL_CONTACT, label: 'Liên hệ ban đầu' },
    { value: DealStage.REQUIREMENT_RECORDED, label: 'Đã ghi nhận yêu cầu' },
    { value: DealStage.QUOTE_SENT, label: 'Đã gửi báo giá' },
    { value: DealStage.CONTRACT_SENT, label: 'Đã gửi hợp đồng' },
    { value: DealStage.CLOSED_WON, label: 'Đã chốt' },
    { value: DealStage.CLOSED_LOST, label: 'Đã hủy' }
  ];

  return (
    <Paper sx={{ p: 2, mb: 3 }}>
      <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="h6" component="div">
          Tìm kiếm Deal
        </Typography>
        <Button
          startIcon={<FilterListIcon />}
          onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
          color="primary"
        >
          {showAdvancedFilters ? 'Ẩn bộ lọc nâng cao' : 'Bộ lọc nâng cao'}
        </Button>
      </Box>

      {/* Bộ lọc cơ bản */}
      <Box sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
        gap: 2,
        mb: 2
      }}>
        <Box>
          <TextField
            fullWidth
            name="searchTerm"
            label="Tìm kiếm theo tên, mô tả..."
            value={filters.searchTerm}
            onChange={handleInputChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
              endAdornment: filters.searchTerm ? (
                <InputAdornment position="end">
                  <IconButton
                    size="small"
                    onClick={() => setFilters(prev => ({ ...prev, searchTerm: '' }))}
                  >
                    <ClearIcon fontSize="small" />
                  </IconButton>
                </InputAdornment>
              ) : null
            }}
          />
        </Box>
        <Box>
          <FormControl fullWidth>
            <InputLabel id="stage-select-label">Giai đoạn</InputLabel>
            <Select
              labelId="stage-select-label"
              name="stage"
              value={filters.stage}
              label="Giai đoạn"
              onChange={handleSelectChange}
            >
              {stageOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center',
          gridColumn: { xs: '1 / -1', md: 'auto' }
        }}>
          {/* Đã xóa nút Tìm kiếm */}
        </Box>
      </Box>

      {/* Bộ lọc nâng cao */}
      <Collapse in={showAdvancedFilters}>
        <Box sx={{ mt: 3 }}>
          <Box sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
            gap: 2
          }}>
            <Box sx={{ gridColumn: '1 / -1' }}>
              <Typography gutterBottom>Giá trị Deal</Typography>
              <Box sx={{ px: 2 }}>
                <Slider
                  value={valueRange}
                  onChange={handleValueRangeChange}
                  onChangeCommitted={handleValueRangeChangeCommitted}
                  valueLabelDisplay="auto"
                  valueLabelFormat={(value) => formatCurrency(value)}
                  min={0}
                  max={1000000000}
                  step={10000000}
                />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                  <Typography variant="body2">{formatCurrency(valueRange[0])}</Typography>
                  <Typography variant="body2">{formatCurrency(valueRange[1])}</Typography>
                </Box>
              </Box>
            </Box>
            <Box>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Từ ngày"
                  value={filters.dateRange?.start || null}
                  onChange={(date) => handleDateChange('start', date)}
                  slotProps={{ textField: { fullWidth: true } }}
                />
              </LocalizationProvider>
            </Box>
            <Box>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Đến ngày"
                  value={filters.dateRange?.end || null}
                  onChange={(date) => handleDateChange('end', date)}
                  slotProps={{ textField: { fullWidth: true } }}
                  minDate={filters.dateRange?.start || undefined}
                  disabled={!filters.dateRange?.start}
                />
              </LocalizationProvider>
            </Box>
            <Box sx={{
              gridColumn: '1 / -1',
              display: 'flex',
              justifyContent: 'flex-end',
              mt: 2
            }}>
              <Button
                variant="outlined"
                color="secondary"
                onClick={handleClearFilters}
                startIcon={<ClearIcon />}
                sx={{ mr: 1 }}
              >
                Xóa bộ lọc
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSearch}
                startIcon={<SearchIcon />}
              >
                Áp dụng
              </Button>
            </Box>
          </Box>
        </Box>
      </Collapse>
    </Paper>
  );
};

export default DealFilters;
