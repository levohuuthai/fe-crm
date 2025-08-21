import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

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

// Dữ liệu mẫu cho biểu đồ doanh thu theo nhân viên (tên nhân sự là dữ liệu mẫu, giữ nguyên)
const REVENUE_DATA = [
  { name: 'Nguyễn Văn A', value: 1200 },
  { name: 'Trần Thị B', value: 950 },
  { name: 'Lê Văn C', value: 850 },
  { name: 'Phạm Thị D', value: 700 },
  { name: 'Hoàng Văn E', value: 500 },
];

// Các tập dữ liệu dùng nhãn cần được bản địa hóa sẽ được tạo bên trong component bằng t()

// Dữ liệu mẫu cho khách hàng mới sẽ được tạo trong component

// Dữ liệu mẫu cho doanh thu theo tháng sẽ được tạo trong component

// Dữ liệu mẫu cho tỉ lệ chuyển đổi sẽ được tạo trong component

// Dữ liệu mẫu cho biểu đồ doanh thu theo tháng sẽ được tạo trong component

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
  const { t } = useTranslation();
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
  
  // Tạo dữ liệu bản địa hóa cho các tập dữ liệu dùng nhãn
  const dealStatusData = [
    { name: t('pages.dashboard.dynamicCharts.dealStatus.lead', { defaultValue: 'Lead' }), value: 45, color: '#f87171' },
    { name: t('pages.dashboard.dynamicCharts.dealStatus.quote', { defaultValue: 'Quote' }), value: 32, color: '#fbbf24' },
    { name: t('pages.dashboard.dynamicCharts.dealStatus.negotiation', { defaultValue: 'Negotiation' }), value: 18, color: '#60a5fa' },
    { name: t('pages.dashboard.dynamicCharts.dealStatus.win', { defaultValue: 'Win' }), value: 38, color: '#34d399' },
    { name: t('pages.dashboard.dynamicCharts.dealStatus.lose', { defaultValue: 'Lose' }), value: 23, color: '#9ca3af' },
  ];

  const newCustomersData = [
    { name: t('pages.dashboard.dynamicCharts.newCustomers.today', { defaultValue: 'Today' }), value: 12 },
    { name: t('pages.dashboard.dynamicCharts.newCustomers.yesterday', { defaultValue: 'Yesterday' }), value: 10 },
    { name: t('pages.dashboard.dynamicCharts.newCustomers.daysAgo2', { defaultValue: '2 days ago' }), value: 8 },
    { name: t('pages.dashboard.dynamicCharts.newCustomers.daysAgo3', { defaultValue: '3 days ago' }), value: 15 },
    { name: t('pages.dashboard.dynamicCharts.newCustomers.daysAgo4', { defaultValue: '4 days ago' }), value: 7 },
  ];

  const revenueByMonthData = [
    { name: t('pages.dashboard.dynamicCharts.months.m1', { defaultValue: 'Jan' }), value: 800 },
    { name: t('pages.dashboard.dynamicCharts.months.m2', { defaultValue: 'Feb' }), value: 950 },
    { name: t('pages.dashboard.dynamicCharts.months.m3', { defaultValue: 'Mar' }), value: 1100 },
    { name: t('pages.dashboard.dynamicCharts.months.m4', { defaultValue: 'Apr' }), value: 1250 },
    { name: t('pages.dashboard.dynamicCharts.months.m5', { defaultValue: 'May' }), value: 1400 },
    { name: t('pages.dashboard.dynamicCharts.months.m6', { defaultValue: 'Jun' }), value: 1600 },
  ];

  const conversionRateData = [
    { name: t('pages.dashboard.dynamicCharts.conversion.converted', { defaultValue: 'Converted' }), value: 65, color: '#34d399' },
    { name: t('pages.dashboard.dynamicCharts.conversion.notConverted', { defaultValue: 'Not converted' }), value: 35, color: '#f87171' },
  ];

  const monthlyRevenueData = [
    { name: t('pages.dashboard.dynamicCharts.months.m1', { defaultValue: 'Jan' }), value: 1200 },
    { name: t('pages.dashboard.dynamicCharts.months.m2', { defaultValue: 'Feb' }), value: 1900 },
    { name: t('pages.dashboard.dynamicCharts.months.m3', { defaultValue: 'Mar' }), value: 1500 },
    { name: t('pages.dashboard.dynamicCharts.months.m4', { defaultValue: 'Apr' }), value: 2200 },
    { name: t('pages.dashboard.dynamicCharts.months.m5', { defaultValue: 'May' }), value: 1800 },
    { name: t('pages.dashboard.dynamicCharts.months.m6', { defaultValue: 'Jun' }), value: 2400 },
    { name: t('pages.dashboard.dynamicCharts.months.m7', { defaultValue: 'Jul' }), value: 2100 },
  ];

  // Lấy dữ liệu phù hợp với loại biểu đồ
  const getChartData = () => {
    switch (chartDataType) {
      case 'newCustomers':
        return newCustomersData;
      case 'dealStatus':
        return dealStatusData;
      case 'revenueByMonth':
        return revenueByMonthData;
      case 'conversionRate':
        return conversionRateData;
      case 'revenueByEmployee':
      default:
        return REVENUE_DATA;
    }
  };
  
  const chartData = getChartData();

  // Format giá trị tiền tệ
  const formatValue = (value: number) => {
    return t('pages.dashboard.dynamicCharts.valueWithUnit', { value, defaultValue: `${value} triệu` });
  };

  return (
    <Paper elevation={2} sx={{ p: 3, borderRadius: 2, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
          {query
            ? t('pages.dashboard.dynamicCharts.resultsFor', { query, defaultValue: `📈 Results for: "${query}"` })
            : t('pages.dashboard.dynamicCharts.title', { defaultValue: '📈 Business data analytics' })}
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
            <InputLabel id="time-range-label">{t('pages.dashboard.dynamicCharts.time', { defaultValue: 'Time' })}</InputLabel>
            <Select
              labelId="time-range-label"
              id="time-range"
              value={timeRange}
              label={t('pages.dashboard.dynamicCharts.time', { defaultValue: 'Time' })}
              onChange={handleTimeRangeChange}
            >
              <MenuItem value="today">{t('pages.dashboard.dynamicCharts.timeRanges.today', { defaultValue: 'Today' })}</MenuItem>
              <MenuItem value="week">{t('pages.dashboard.dynamicCharts.timeRanges.week', { defaultValue: 'This week' })}</MenuItem>
              <MenuItem value="month">{t('pages.dashboard.dynamicCharts.timeRanges.month', { defaultValue: 'This month' })}</MenuItem>
              <MenuItem value="quarter">{t('pages.dashboard.dynamicCharts.timeRanges.quarter', { defaultValue: 'This quarter' })}</MenuItem>
              <MenuItem value="year">{t('pages.dashboard.dynamicCharts.timeRanges.year', { defaultValue: 'This year' })}</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>

      <Box sx={{ height: 400, width: '100%' }}>
        {chartType === 'bar' && (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartDataType === 'revenueByMonth' ? monthlyRevenueData : REVENUE_DATA}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value) => formatValue(value as number)} />
              <Legend />
              <Bar 
                dataKey="value" 
                name={chartDataType === 'revenueByMonth' 
                  ? t('pages.dashboard.dynamicCharts.series.revenueByMonth', { defaultValue: 'Revenue by month' }) 
                  : t('pages.dashboard.dynamicCharts.series.revenueByEmployee', { defaultValue: 'Revenue by employee' })} 
                fill="#3b82f6" 
              />
            </BarChart>
          </ResponsiveContainer>
        )}

        {chartType === 'pie' && (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartDataType === 'dealStatus' ? dealStatusData : REVENUE_DATA}
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
              data={monthlyRevenueData}
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
                name={t('pages.dashboard.dynamicCharts.series.revenueByMonth', { defaultValue: 'Revenue by month' })} 
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
                  <th style={{ padding: '12px 16px', textAlign: 'left' }}>{t('pages.dashboard.dynamicCharts.table.name', { defaultValue: 'Name' })}</th>
                  <th style={{ padding: '12px 16px', textAlign: 'right' }}>{t('pages.dashboard.dynamicCharts.table.value', { defaultValue: 'Value' })}</th>
                </tr>
              </thead>
              <tbody>
                {(chartDataType === 'dealStatus' ? dealStatusData : 
                  chartDataType === 'revenueByMonth' ? monthlyRevenueData : REVENUE_DATA)
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