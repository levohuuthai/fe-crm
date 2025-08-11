import React, { useState } from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  ToggleButtonGroup, 
  ToggleButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent
} from '@mui/material';
import {
  BarChart as BarChartIcon,
  PieChart as PieChartIcon,
  ShowChart as LineChartIcon,
  TableChart as TableChartIcon
} from '@mui/icons-material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts';

// Dữ liệu mẫu cho biểu đồ doanh thu theo nhân viên
const REVENUE_DATA = [
  { name: 'Nguyễn Văn A', value: 1200 },
  { name: 'Trần Thị B', value: 950 },
  { name: 'Lê Văn C', value: 850 },
  { name: 'Phạm Thị D', value: 700 },
  { name: 'Hoàng Văn E', value: 500 },
];

// Dữ liệu mẫu cho biểu đồ trạng thái deal
const DEAL_STATUS_DATA = [
  { name: 'Lead', value: 45, color: '#f87171' },
  { name: 'Báo giá', value: 32, color: '#fbbf24' },
  { name: 'Đàm phán', value: 18, color: '#60a5fa' },
  { name: 'Win', value: 38, color: '#34d399' },
  { name: 'Lose', value: 23, color: '#9ca3af' },
];

// Dữ liệu mẫu cho khách hàng mới
const NEW_CUSTOMERS_DATA = [
  { name: 'Hôm nay', value: 12 },
  { name: 'Hôm qua', value: 10 },
  { name: '2 ngày trước', value: 8 },
  { name: '3 ngày trước', value: 15 },
  { name: '4 ngày trước', value: 7 },
];

// Dữ liệu mẫu cho doanh thu theo tháng
const REVENUE_BY_MONTH_DATA = [
  { name: 'T1', value: 800 },
  { name: 'T2', value: 950 },
  { name: 'T3', value: 1100 },
  { name: 'T4', value: 1250 },
  { name: 'T5', value: 1400 },
  { name: 'T6', value: 1600 },
];

// Dữ liệu mẫu cho tỉ lệ chuyển đổi
const CONVERSION_RATE_DATA = [
  { name: 'Chuyển đổi', value: 65, color: '#34d399' },
  { name: 'Không chuyển đổi', value: 35, color: '#f87171' },
];

// Dữ liệu mẫu cho biểu đồ doanh thu theo tháng
const MONTHLY_REVENUE_DATA = [
  { name: 'T1', value: 1200 },
  { name: 'T2', value: 1900 },
  { name: 'T3', value: 1500 },
  { name: 'T4', value: 2200 },
  { name: 'T5', value: 1800 },
  { name: 'T6', value: 2400 },
  { name: 'T7', value: 2100 },
];

// Màu sắc cho biểu đồ
const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444'];

// Loại biểu đồ
type ChartType = 'bar' | 'pie' | 'line' | 'table';

// Loại thời gian
type TimeRange = 'today' | 'week' | 'month' | 'quarter' | 'year';

interface DynamicChartsProps {
  query: string;
}

const DynamicCharts: React.FC<DynamicChartsProps> = ({ query }) => {
  const [chartType, setChartType] = useState<ChartType>('bar');
  const [timeRange, setTimeRange] = useState<TimeRange>('month');

  const handleChartTypeChange = (
    event: React.MouseEvent<HTMLElement>,
    newChartType: ChartType | null,
  ) => {
    if (newChartType !== null) {
      setChartType(newChartType);
    }
  };

  const handleTimeRangeChange = (event: SelectChangeEvent) => {
    setTimeRange(event.target.value as TimeRange);
  };

  // Xác định loại biểu đồ và dữ liệu dựa trên query
  const getChartTypeFromQuery = (query: string): { type: string; chartType: ChartType } => {
    const lowercaseQuery = query.toLowerCase();
    
    // Khách hàng mới
    if (lowercaseQuery.includes('khách hàng mới') || 
        (lowercaseQuery.includes('khách hàng') && lowercaseQuery.includes('mới'))) {
      return { type: 'newCustomers', chartType: 'bar' };
    }
    
    // Doanh thu theo nhân viên
    else if (lowercaseQuery.includes('doanh thu') && lowercaseQuery.includes('nhân viên')) {
      return { type: 'revenueByEmployee', chartType: 'bar' };
    }
    
    // Trạng thái deal
    else if ((lowercaseQuery.includes('deal') || lowercaseQuery.includes('giao dịch')) && 
             (lowercaseQuery.includes('trạng thái') || lowercaseQuery.includes('giai đoạn'))) {
      return { type: 'dealStatus', chartType: 'pie' };
    }
    
    // Doanh thu theo tháng
    else if (lowercaseQuery.includes('doanh thu') && 
             (lowercaseQuery.includes('tháng') || lowercaseQuery.includes('thời gian'))) {
      return { type: 'revenueByMonth', chartType: 'line' };
    }
    
    // Tỉ lệ chuyển đổi
    else if (lowercaseQuery.includes('tỉ lệ') || lowercaseQuery.includes('chuyển đổi')) {
      return { type: 'conversionRate', chartType: 'pie' };
    }
    
    // Mặc định hiển thị biểu đồ doanh thu theo nhân viên
    return { type: 'revenueByEmployee', chartType: 'bar' };
  };

  const { type: chartDataType } = getChartTypeFromQuery(query || '');
  
  // Tự động cập nhật loại biểu đồ dựa trên câu hỏi nếu có query mới
  React.useEffect(() => {
    if (query) {
      const { chartType: newChartType } = getChartTypeFromQuery(query);
      setChartType(newChartType);
    }
  }, [query]);
  
  // Lấy dữ liệu phù hợp với loại biểu đồ
  const getChartData = () => {
    switch (chartDataType) {
      case 'newCustomers':
        return NEW_CUSTOMERS_DATA;
      case 'dealStatus':
        return DEAL_STATUS_DATA;
      case 'revenueByMonth':
        return REVENUE_BY_MONTH_DATA;
      case 'conversionRate':
        return CONVERSION_RATE_DATA;
      case 'revenueByEmployee':
      default:
        return REVENUE_DATA;
    }
  };
  
  const chartData = getChartData();

  // Format giá trị tiền tệ
  const formatValue = (value: number) => {
    return `${value} triệu`;
  };

  return (
    <Paper elevation={2} sx={{ p: 3, borderRadius: 2, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
          📈 {query ? `Kết quả cho: "${query}"` : 'Phân tích dữ liệu kinh doanh'}
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 2 }}>
          <ToggleButtonGroup
            size="small"
            value={chartType}
            exclusive
            onChange={handleChartTypeChange}
            aria-label="chart type"
          >
            <ToggleButton value="bar" aria-label="bar chart">
              <BarChartIcon fontSize="small" />
            </ToggleButton>
            <ToggleButton value="pie" aria-label="pie chart">
              <PieChartIcon fontSize="small" />
            </ToggleButton>
            <ToggleButton value="line" aria-label="line chart">
              <LineChartIcon fontSize="small" />
            </ToggleButton>
            <ToggleButton value="table" aria-label="table">
              <TableChartIcon fontSize="small" />
            </ToggleButton>
          </ToggleButtonGroup>
          
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel id="time-range-label">Thời gian</InputLabel>
            <Select
              labelId="time-range-label"
              id="time-range"
              value={timeRange}
              label="Thời gian"
              onChange={handleTimeRangeChange}
            >
              <MenuItem value="today">Hôm nay</MenuItem>
              <MenuItem value="week">Tuần này</MenuItem>
              <MenuItem value="month">Tháng này</MenuItem>
              <MenuItem value="quarter">Quý này</MenuItem>
              <MenuItem value="year">Năm nay</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>

      <Box sx={{ height: 400, width: '100%' }}>
        {chartType === 'bar' && (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartDataType === 'revenueByMonth' ? MONTHLY_REVENUE_DATA : REVENUE_DATA}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value) => formatValue(value as number)} />
              <Legend />
              <Bar 
                dataKey="value" 
                name={chartDataType === 'revenueByMonth' ? 'Doanh thu theo tháng' : 'Doanh thu theo nhân viên'} 
                fill="#3b82f6" 
              />
            </BarChart>
          </ResponsiveContainer>
        )}

        {chartType === 'pie' && (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartDataType === 'dealStatus' ? DEAL_STATUS_DATA : REVENUE_DATA}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={150}
                fill="#8884d8"
                dataKey="value"
                nameKey="name"
                label={({ name, percent }) => `${name}: ${percent ? (percent * 100).toFixed(0) : 0}%`}
              >
                {chartData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={(entry as any).color || COLORS[index % COLORS.length]} 
                  />
                ))}
              </Pie>
              <Tooltip formatter={(value) => formatValue(value as number)} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        )}

        {chartType === 'line' && (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={MONTHLY_REVENUE_DATA}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value) => formatValue(value as number)} />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="value" 
                name="Doanh thu theo tháng" 
                stroke="#3b82f6" 
                activeDot={{ r: 8 }} 
              />
            </LineChart>
          </ResponsiveContainer>
        )}

        {chartType === 'table' && (
          <Box sx={{ height: '100%', overflow: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #e2e8f0' }}>
                  <th style={{ padding: '12px 16px', textAlign: 'left' }}>Tên</th>
                  <th style={{ padding: '12px 16px', textAlign: 'right' }}>Giá trị</th>
                </tr>
              </thead>
              <tbody>
                {(chartDataType === 'dealStatus' ? DEAL_STATUS_DATA : 
                  chartDataType === 'revenueByMonth' ? MONTHLY_REVENUE_DATA : REVENUE_DATA)
                  .map((item, index) => (
                    <tr 
                      key={index} 
                      style={{ 
                        borderBottom: '1px solid #e2e8f0',
                        backgroundColor: index % 2 === 0 ? '#f8fafc' : 'white'
                      }}
                    >
                      <td style={{ padding: '12px 16px' }}>{item.name}</td>
                      <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                        {formatValue(item.value)}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </Box>
        )}
      </Box>
    </Paper>
  );
};

export default DynamicCharts;