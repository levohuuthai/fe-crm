import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Radio, 
  RadioGroup, 
  FormControlLabel, 
  FormControl, 
  FormLabel, 
  Paper,
  Divider,
  Alert,
  Snackbar
} from '@mui/material';
import { 
  EstimationMode, 
  EffortColumn, 
  EstimationRow, 
  TimeAndMaterialRate 
} from '../../types/quoteTemplate';
import FixedPriceTable from '../FixedPriceTable';
import TimeAndMaterialTable from '../TimeAndMaterialTable';

// Các cột effort mặc định cho chế độ Fix Price
const DEFAULT_EFFORT_COLUMNS: EffortColumn[] = [];

// Tỷ giá mặc định cho chế độ Time & Material
const DEFAULT_TM_RATES: TimeAndMaterialRate[] = [
  {
    id: 'rate-1',
    role: 'Developer',
    rate: 50,
    unit: 'hour',
    description: 'Senior Developer'
  },
  {
    id: 'rate-2',
    role: 'Designer',
    rate: 40,
    unit: 'hour',
    description: 'UI/UX Designer'
  }
];

interface EstimationStepProps {
  mode: EstimationMode;
  onModeChange: (mode: EstimationMode) => void;
  onEstimationDataChange?: (data: any) => void;
  // Dữ liệu requirement từ bước 1
  initialData?: {
    rows?: any[];
  };
}

const EstimationStep: React.FC<EstimationStepProps> = ({
  mode,
  onModeChange,
  onEstimationDataChange,
  initialData,
}) => {
  // State cho chế độ Fix Price
  const [fixedPriceRows, setFixedPriceRows] = useState<EstimationRow[]>([]);
  const [effortColumns, setEffortColumns] = useState<EffortColumn[]>(DEFAULT_EFFORT_COLUMNS);
  
  // State cho chế độ Time & Material
  const [tmRates, setTmRates] = useState<TimeAndMaterialRate[]>(DEFAULT_TM_RATES);
  
  // State thông báo
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error' | 'info' | 'warning'
  });

  // Khởi tạo dữ liệu mẫu khi component mount
  useEffect(() => {
    // Nếu có dữ liệu ban đầu từ requirement, sử dụng nó
    if (initialData?.rows && initialData.rows.length > 0 && fixedPriceRows.length === 0) {
      const mappedRows = initialData.rows.map(item => ({
        id: `row-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
        feature: item.feature || '',
        detail: item.detail || '',
        description: item.description || '',
        notes: item.note || '',
        itReq: '',
        uxUi: '',
        efforts: {},
      }));
      setFixedPriceRows(mappedRows);
    } 
    // Thêm một dòng trống mặc định cho Fixed Price nếu không có dữ liệu ban đầu
    else if (fixedPriceRows.length === 0) {
      setFixedPriceRows([createNewRow()]);
    }
  }, [fixedPriceRows.length, initialData]);

  // Tạo một dòng mới cho Fixed Price
  const createNewRow = (): EstimationRow => ({
    id: `row-${Date.now()}`,
    feature: '',
    detail: '',
    description: '',
    notes: '',
    itReq: '',
    uxUi: '',
    efforts: {},
  });

  // Xử lý thay đổi chế độ
  const handleModeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newMode = event.target.value as EstimationMode;
    onModeChange(newMode);
    
    // Thông báo khi chuyển chế độ
    setSnackbar({
      open: true,
      message: `Đã chuyển sang chế độ ${newMode === 'fixed' ? 'Fix Price' : 'Time & Material'}`,
      severity: 'info'
    });
  };

  // Xử lý thay đổi dữ liệu Fixed Price
  const handleFixedPriceDataChange = (rows: EstimationRow[], columns: EffortColumn[]) => {
    setFixedPriceRows(rows);
    setEffortColumns(columns);
    
    if (onEstimationDataChange) {
      onEstimationDataChange({
        mode: 'fixed',
        rows,
        columns
      });
    }
  };

  // Xử lý thay đổi dữ liệu Time & Material
  const handleTimeMaterialDataChange = (rates: TimeAndMaterialRate[]) => {
    setTmRates(rates);
    
    if (onEstimationDataChange) {
      onEstimationDataChange({
        mode: 'timeAndMaterial',
        rates
      });
    }
  };

  // Đóng thông báo
  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Box sx={{ mt: 3 }}>
      <Typography variant="h6" gutterBottom>
        Bảng ước tính
      </Typography>
      
      <Paper elevation={0} sx={{ p: 3, mb: 3, border: '1px solid #e0e0e0', borderRadius: 1 }}>
        <FormControl component="fieldset" fullWidth>
          <FormLabel component="legend" sx={{ mb: 2, fontWeight: 'bold', color: 'text.primary' }}>
            Chọn phương thức ước tính
          </FormLabel>
          <RadioGroup
            row
            aria-label="estimation-mode"
            name="estimation-mode"
            value={mode}
            onChange={handleModeChange}
          >
            <FormControlLabel
              value="fixed"
              control={<Radio color="primary" />}
              label="Fix Price"
              sx={{ 
                mr: 4,
                '& .MuiFormControlLabel-label': { fontWeight: 500 }
              }}
            />
            <FormControlLabel
              value="timeAndMaterial"
              control={<Radio color="primary" />}
              label="Time & Material"
              sx={{ '& .MuiFormControlLabel-label': { fontWeight: 500 } }}
            />
          </RadioGroup>
          
          <Divider sx={{ my: 2 }} />
          
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            {mode === 'fixed' 
              ? 'Chế độ Fix Price: Tạo bảng ước tính chi tiết với các cột effort tùy chỉnh.'
              : 'Chế độ Time & Material: Tạo bảng ước tính dựa trên số giờ và đơn giá.'}
          </Typography>
        </FormControl>
      </Paper>

      {/* Hiển thị bảng tương ứng với chế độ đã chọn */}
      {mode === 'fixed' ? (
        <FixedPriceTable
          rows={fixedPriceRows}
          effortColumns={effortColumns}
          onRowsChange={(rows) => handleFixedPriceDataChange(rows, effortColumns)}
          onColumnsChange={(columns) => handleFixedPriceDataChange(fixedPriceRows, columns)}
        />
      ) : (
        <TimeAndMaterialTable
          rates={tmRates}
          onRatesChange={handleTimeMaterialDataChange}
        />
      )}

      {/* Thông báo */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default EstimationStep;
