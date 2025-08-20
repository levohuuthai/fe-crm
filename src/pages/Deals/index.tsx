import React, { useState, useMemo } from 'react';
import { Box, Typography, useTheme, alpha, Fade } from '@mui/material';
import SmartTable, { SmartTableColumn, SmartTableRow } from '../../components/SmartTable';
import FilterBar, { FilterConfig, FilterOwner, FilterStatus, SavedView, FilterQuery } from '../../components/FilterBar';
import { Person as PersonIcon, CalendarToday as CalendarIcon, Timeline as ActivityIcon, AttachMoney as MoneyIcon, Label as StatusIcon } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

// Mock users data (same as contacts)
const mockUsers = [
  { id: '1', name: 'Trần Thị B', email: 'tran.b@company.com', avatar: '/avatars/tran.jpg' },
  { id: '2', name: 'Phạm Văn C', email: 'pham.c@company.com', avatar: '/avatars/pham.jpg' },
  { id: '3', name: 'Nguyễn Thị D', email: 'nguyen.d@company.com', avatar: '/avatars/nguyen.jpg' },
  { id: '4', name: 'Lê Văn E', email: 'le.e@company.com', avatar: '/avatars/le.jpg' },
  { id: '5', name: 'Hoàng Thị F', email: 'hoang.f@company.com', avatar: '/avatars/hoang.jpg' }
];

// Deal stage options
const dealStageOptions = [
  { value: 'prospecting', label: 'Prospecting', color: '#2196f3' },
  { value: 'qualification', label: 'Qualification', color: '#ff9800' },
  { value: 'proposal', label: 'Proposal', color: '#9c27b0' },
  { value: 'negotiation', label: 'Negotiation', color: '#f44336' },
  { value: 'closed-won', label: 'Closed Won', color: '#4caf50' },
  { value: 'closed-lost', label: 'Closed Lost', color: '#9e9e9e' }
];

// Deal priority options
const dealPriorityOptions = [
  { value: 'low', label: 'Low', color: '#9e9e9e' },
  { value: 'medium', label: 'Medium', color: '#ff9800' },
  { value: 'high', label: 'High', color: '#f44336' },
  { value: 'urgent', label: 'Urgent', color: '#e91e63' }
];

// Columns will be defined via translatedColumns inside the component

// Mock deals data
const mockDealsData: SmartTableRow[] = [
  {
    id: '1',
    dealName: 'Hệ thống CRM cho ABC Corp',
    customer: 'ABC Corporation',
    amount: 500000000,
    stage: 'proposal',
    priority: 'high',
    owner: '1',
    probability: 75,
    expectedCloseDate: '2024-02-15',
    lastActivity: '2024-01-15'
  },
  {
    id: '2',
    dealName: 'Phần mềm quản lý kho XYZ',
    customer: 'XYZ Trading',
    amount: 300000000,
    stage: 'negotiation',
    priority: 'urgent',
    owner: '2',
    probability: 85,
    expectedCloseDate: '2024-01-30',
    lastActivity: '2024-01-14'
  },
  {
    id: '3',
    dealName: 'Giải pháp Cloud cho Tech Solutions',
    customer: 'Tech Solutions',
    amount: 800000000,
    stage: 'qualification',
    priority: 'medium',
    owner: '3',
    probability: 60,
    expectedCloseDate: '2024-03-20',
    lastActivity: '2024-01-12'
  },
  {
    id: '4',
    dealName: 'App mobile cho Innovation Startup',
    customer: 'Innovation Startup',
    amount: 250000000,
    stage: 'prospecting',
    priority: 'low',
    owner: '1',
    probability: 30,
    expectedCloseDate: '2024-04-10',
    lastActivity: '2024-01-10'
  },
  {
    id: '5',
    dealName: 'ERP System cho Big Enterprise',
    customer: 'Big Enterprise',
    amount: 1200000000,
    stage: 'proposal',
    priority: 'urgent',
    owner: '4',
    probability: 70,
    expectedCloseDate: '2024-02-28',
    lastActivity: '2024-01-13'
  },
  {
    id: '6',
    dealName: 'POS System cho Retail Chain',
    customer: 'Retail Chain',
    amount: 400000000,
    stage: 'closed-won',
    priority: 'high',
    owner: '2',
    probability: 100,
    expectedCloseDate: '2024-01-20',
    lastActivity: '2024-01-16'
  },
  {
    id: '7',
    dealName: 'Fintech Solution cho Financial Services',
    customer: 'Financial Services',
    amount: 600000000,
    stage: 'negotiation',
    priority: 'high',
    owner: '5',
    probability: 80,
    expectedCloseDate: '2024-02-05',
    lastActivity: '2024-01-15'
  },
  {
    id: '8',
    dealName: 'Healthcare Management System',
    customer: 'Healthcare Group',
    amount: 350000000,
    stage: 'qualification',
    priority: 'medium',
    owner: '3',
    probability: 50,
    expectedCloseDate: '2024-03-15',
    lastActivity: '2024-01-11'
  },
  {
    id: '9',
    dealName: 'E-commerce Platform cho Online Store',
    customer: 'Online Store Ltd',
    amount: 180000000,
    stage: 'closed-lost',
    priority: 'low',
    owner: '1',
    probability: 0,
    expectedCloseDate: '2024-01-10',
    lastActivity: '2024-01-08'
  },
  {
    id: '10',
    dealName: 'Digital Marketing Suite',
    customer: 'Marketing Agency',
    amount: 220000000,
    stage: 'prospecting',
    priority: 'medium',
    owner: '4',
    probability: 25,
    expectedCloseDate: '2024-04-30',
    lastActivity: '2024-01-09'
  }
];

const DealsPage: React.FC = () => {
  const theme = useTheme();
  const { t } = useTranslation();
  const translatedColumns: SmartTableColumn[] = useMemo(() => ([
    {
      id: 'dealName',
      label: t('pages.deals.columns.dealName'),
      type: 'text',
      width: 250,
      sortable: true,
      editable: true,
      required: true
    },
    {
      id: 'customer',
      label: t('pages.deals.columns.customer'),
      type: 'text',
      width: 200,
      sortable: true,
      editable: true,
      required: true
    },
    {
      id: 'amount',
      label: t('pages.deals.columns.amount'),
      type: 'currency',
      width: 150,
      sortable: true,
      editable: true,
      required: true,
      format: (value: number) => {
        if (value >= 1000000000) return `${(value / 1000000000).toFixed(1)}B₫`;
        if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M₫`;
        if (value >= 1000) return `${(value / 1000).toFixed(1)}K₫`;
        return `${value}₫`;
      }
    },
    {
      id: 'stage',
      label: t('pages.deals.columns.stage'),
      type: 'select',
      width: 150,
      sortable: true,
      editable: true,
      options: dealStageOptions
    },
    {
      id: 'priority',
      label: t('pages.deals.columns.priority'),
      type: 'select',
      width: 120,
      sortable: true,
      editable: true,
      options: dealPriorityOptions
    },
    {
      id: 'owner',
      label: t('pages.deals.columns.owner'),
      type: 'userSelect',
      width: 180,
      sortable: true,
      editable: true
    },
    {
      id: 'probability',
      label: t('pages.deals.columns.probability'),
      type: 'number',
      width: 120,
      sortable: true,
      editable: true,
      validate: (value: number) => {
        const num = Number(value);
        return num >= 0 && num <= 100 ? null : t('pages.deals.validation.probabilityRange');
      },
      format: (value: number) => `${value}%`
    },
    {
      id: 'expectedCloseDate',
      label: t('pages.deals.columns.expectedCloseDate'),
      type: 'date',
      width: 150,
      sortable: true,
      editable: true
    },
    {
      id: 'lastActivity',
      label: t('pages.deals.columns.lastActivity'),
      type: 'date',
      width: 140,
      sortable: true,
      editable: true
    },
    {
      id: 'actions',
      label: t('pages.deals.columns.actions'),
      type: 'actions',
      width: 100,
      sortable: false,
      editable: false
    }
  ]), [t]);
  const [dealsData, setDealsData] = useState<SmartTableRow[]>(mockDealsData);
  const [filteredData, setFilteredData] = useState<SmartTableRow[]>(mockDealsData);
  const [loading, setLoading] = useState(false);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [currentView, setCurrentView] = useState('all');

  // Filter configuration for Deals
  const filterConfigs: FilterConfig[] = [
    {
      id: 'owner',
      label: t('pages.deals.filters.owner'),
      type: 'owner',
      icon: <PersonIcon fontSize="small" />,
      enabled: true,
      fieldName: 'owner'
    },
    {
      id: 'expectedCloseDate',
      label: t('pages.deals.filters.expectedCloseDate'),
      type: 'date',
      icon: <CalendarIcon fontSize="small" />,
      enabled: true,
      fieldName: 'expectedCloseDate'
    },
    {
      id: 'lastActivity',
      label: t('pages.deals.filters.lastActivity'),
      type: 'date',
      icon: <ActivityIcon fontSize="small" />,
      enabled: true,
      fieldName: 'lastActivity'
    },
    {
      id: 'amount',
      label: t('pages.deals.filters.amount'),
      type: 'amount',
      icon: <MoneyIcon fontSize="small" />,
      enabled: true,
      fieldName: 'amount'
    },
    {
      id: 'stage',
      label: t('pages.deals.filters.stage'),
      type: 'status',
      icon: <StatusIcon fontSize="small" />,
      enabled: true,
      fieldName: 'stage'
    }
  ];

  // Saved views for Deals
  const savedViews: SavedView[] = [
    { id: 'all', label: t('pages.deals.views.all'), count: mockDealsData.length },
    { id: 'my', label: t('pages.deals.views.my'), count: 6 },
    { id: 'unassigned', label: t('pages.deals.views.unassigned'), count: 2 }
  ];

  // Filter owners (using existing mockUsers)
  const filterOwners: FilterOwner[] = mockUsers.map(user => ({
    id: user.id,
    name: user.name,
    email: user.email,
    avatar: user.avatar
  }));

  // Filter statuses (using existing dealStageOptions)
  const filterStatuses: FilterStatus[] = dealStageOptions.map(stage => ({
    value: stage.value,
    label: stage.label,
    color: stage.color
  }));

  // Handle filter query change
  const handleFilterQueryChange = (query: FilterQuery) => {
    // Mock filtering logic - in real app this would be API call
    let filtered = [...dealsData];

    // Filter by owners
    if (query.ownerIds.length > 0) {
      filtered = filtered.filter(deal => 
        query.ownerIds.includes(deal.owner) || 
        (query.ownerIds.includes('unassigned') && !deal.owner)
      );
    }

    // Filter by stage (using leadStatus field for consistency)
    if (query.leadStatus.length > 0) {
      filtered = filtered.filter(deal => 
        query.leadStatus.includes(deal.stage)
      );
    }

    // Filter by amount
    if (query.amount) {
      const { min, max } = query.amount;
      filtered = filtered.filter(deal => {
        const amount = deal.amount || 0;
        if (min && max) return amount >= min && amount <= max;
        if (min) return amount >= min;
        if (max) return amount <= max;
        return true;
      });
    }

    // Filter by expected close date (mock logic)
    if ((query as any).expectedCloseDate?.preset) {
      console.log('Filtering by expected close date:', (query as any).expectedCloseDate.preset);
    }

    // Filter by last activity date (mock logic)
    if ((query as any).lastActivity?.preset) {
      console.log('Filtering by last activity:', (query as any).lastActivity.preset);
    }

    setFilteredData(filtered);
  };

  // Handle view change
  const handleViewChange = (viewId: string) => {
    setCurrentView(viewId);
    // Mock view filtering logic
    let filtered = [...dealsData];
    
    switch (viewId) {
      case 'my':
        filtered = filtered.filter(deal => deal.owner === '1'); // Current user
        break;
      case 'unassigned':
        filtered = filtered.filter(deal => !deal.owner);
        break;
      default:
        filtered = dealsData;
    }
    
    setFilteredData(filtered);
  };

  // Handle cell edit
  const handleCellEdit = async (rowId: string, columnId: string, value: any): Promise<boolean> => {
    setLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Update data
    setDealsData(prev => 
      prev.map(row => 
        row.id === rowId ? { ...row, [columnId]: value } : row
      )
    );
    
    // Also update filtered data
    setFilteredData(prev => 
      prev.map(row => 
        row.id === rowId ? { ...row, [columnId]: value } : row
      )
    );
    
    setLoading(false);
    return true;
  };

  // Handle row double click
  const handleRowDoubleClick = (row: SmartTableRow) => {
    console.log('Open deal detail:', row);
    // Navigate to deal detail page or open side panel
  };

  // Handle bulk actions
  const handleBulkAction = (action: string, selectedRows: string[]) => {
    console.log('Bulk action:', action, selectedRows);
    switch (action) {
      case 'delete':
        setDealsData(prev => prev.filter(row => !selectedRows.includes(row.id)));
        setSelectedRows([]);
        break;
      case 'assign':
        // Open assign owner dialog
        break;
    }
  };

  // Calculate summary stats
  const totalValue = dealsData.reduce((sum, deal) => sum + (deal.amount || 0), 0);
  const wonDeals = dealsData.filter(deal => deal.stage === 'closed-won');
  const wonValue = wonDeals.reduce((sum, deal) => sum + (deal.amount || 0), 0);
  const activeDeals = dealsData.filter(deal => !['closed-won', 'closed-lost'].includes(deal.stage));

  const formatCurrency = (value: number) => {
    if (value >= 1000000000) return `${(value / 1000000000).toFixed(1)}B₫`;
    if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M₫`;
    if (value >= 1000) return `${(value / 1000).toFixed(1)}K₫`;
    return `${value}₫`;
  };

  return (
    <Fade in timeout={800}>
      <Box sx={{ 
        width: '100%', 
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}>
        {/* Page Header */}
        <Box sx={{ 
          mb: 3,
          flexShrink: 0,
          px: 1
        }}>
          <Typography 
            variant="h4" 
            component="h1" 
            sx={{ 
              fontWeight: 'bold',
              color: 'text.primary',
              mb: 1
            }}
          >
            {t('pages.deals.title')}
          </Typography>
          <Typography 
            variant="body1" 
            color="text.secondary"
            sx={{ mb: 3 }}
          >
            {t('pages.deals.subtitle')}
          </Typography>

          {/* Summary Cards */}
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
            gap: 2
          }}>
            <Box sx={{
              p: 2,
              borderRadius: 2,
              backgroundColor: alpha(theme.palette.primary.main, 0.1),
              border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`
            }}>
              <Typography variant="body2" color="text.secondary">{t('pages.deals.stats.totalValue')}</Typography>
              <Typography variant="h6" fontWeight="bold" color="primary">
                {formatCurrency(totalValue)}
              </Typography>
            </Box>
            
            <Box sx={{
              p: 2,
              borderRadius: 2,
              backgroundColor: alpha(theme.palette.success.main, 0.1),
              border: `1px solid ${alpha(theme.palette.success.main, 0.2)}`
            }}>
              <Typography variant="body2" color="text.secondary">{t('pages.deals.stats.won')}</Typography>
              <Typography variant="h6" fontWeight="bold" color="success.main">
                {formatCurrency(wonValue)}
              </Typography>
            </Box>
            
            <Box sx={{
              p: 2,
              borderRadius: 2,
              backgroundColor: alpha(theme.palette.warning.main, 0.1),
              border: `1px solid ${alpha(theme.palette.warning.main, 0.2)}`
            }}>
              <Typography variant="body2" color="text.secondary">{t('pages.deals.stats.active')}</Typography>
              <Typography variant="h6" fontWeight="bold" color="warning.main">
                {t('pages.deals.stats.activeDeals', { count: activeDeals.length })}
              </Typography>
            </Box>
            
            <Box sx={{
              p: 2,
              borderRadius: 2,
              backgroundColor: alpha(theme.palette.info.main, 0.1),
              border: `1px solid ${alpha(theme.palette.info.main, 0.2)}`
            }}>
              <Typography variant="body2" color="text.secondary">{t('pages.deals.stats.winRate')}</Typography>
              <Typography variant="h6" fontWeight="bold" color="info.main">
                {dealsData.length > 0 ? Math.round((wonDeals.length / dealsData.length) * 100) : 0}%
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Filter Bar */}
        <FilterBar
          entity="deals"
          availableFilters={filterConfigs}
          owners={filterOwners}
          statuses={filterStatuses}
          savedViews={savedViews}
          currency="₫"
          onQueryChange={handleFilterQueryChange}
          onViewChange={handleViewChange}
          sticky={true}
        />

        {/* Smart Table Container */}
        <Box sx={{
          flex: 1,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column'
        }}>
          <SmartTable
            columns={translatedColumns}
            data={filteredData}
            loading={loading}
            searchable={true}
            filterable={false}
            selectable={true}
            pagination={true}
            defaultRowsPerPage={25}
            onRowSelect={setSelectedRows}
            onCellEdit={handleCellEdit}
            onRowDoubleClick={handleRowDoubleClick}
            onBulkAction={handleBulkAction}
            users={mockUsers}
            emptyMessage={t('pages.deals.empty')}
            zebra={true}
          />
        </Box>
      </Box>
    </Fade>
  );
};

export default DealsPage;
