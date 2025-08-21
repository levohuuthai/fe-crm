  import React, { useState } from 'react';
import {
  Box,
  Typography,
  Container,
  useTheme,
  alpha,
  Fade,
  Drawer
} from '@mui/material';
import SmartTable, { SmartTableColumn, SmartTableRow } from '../../components/SmartTable';
import FilterBar, { FilterConfig, FilterOwner, FilterStatus, SavedView, FilterQuery } from '../../components/FilterBar';
import ContactDetails from '../Contact/components/ContactDetails';
import { useTranslation } from 'react-i18next';
import {
  Person as PersonIcon,
  CalendarToday as CalendarIcon,
  Timeline as ActivityIcon,
  Label as StatusIcon
} from '@mui/icons-material';

// Mock users data
const mockUsers = [
  { id: '1', name: 'Trần Thị B', email: 'tran.b@company.com', avatar: '/avatars/tran.jpg' },
  { id: '2', name: 'Phạm Văn C', email: 'pham.c@company.com', avatar: '/avatars/pham.jpg' },
  { id: '3', name: 'Nguyễn Thị D', email: 'nguyen.d@company.com', avatar: '/avatars/nguyen.jpg' },
  { id: '4', name: 'Lê Văn E', email: 'le.e@company.com', avatar: '/avatars/le.jpg' },
  { id: '5', name: 'Hoàng Thị F', email: 'hoang.f@company.com', avatar: '/avatars/hoang.jpg' }
];

// Mock contacts data (store canonical position keys)
const mockContactsData: SmartTableRow[] = [
  {
    id: '1',
    name: 'Nguyễn Văn An',
    email: 'an.nguyen@company.com',
    phone: '0901234567',
    company: 'ABC Corporation',
    position: 'itDirector',
    owner: '1',
    leadStatus: 'hot',
    lastContact: '2024-01-15',
    value: 250000000
  },
  {
    id: '2',
    name: 'Lê Thị Cẩm',
    email: 'cam.le@business.vn',
    phone: '0987654321',
    company: 'XYZ Trading',
    position: 'marketingManager',
    owner: '2',
    leadStatus: 'qualified',
    lastContact: '2024-01-10',
    value: 150000000
  },
  {
    id: '3',
    name: 'Hoàng Minh Đức',
    email: 'duc.hoang@tech.com',
    phone: '0912345678',
    company: 'Tech Solutions',
    position: 'cto',
    owner: '3',
    leadStatus: 'new',
    lastContact: '2024-01-08',
    value: 500000000
  },
  {
    id: '4',
    name: 'Trần Thị Mai',
    email: 'mai.tran@startup.io',
    phone: '0923456789',
    company: 'Innovation Startup',
    position: 'ceo',
    owner: '1',
    leadStatus: 'qualified',
    lastContact: '2024-01-12',
    value: 300000000
  },
  {
    id: '5',
    name: 'Phạm Văn Nam',
    email: 'nam.pham@enterprise.com',
    phone: '0934567890',
    company: 'Big Enterprise',
    position: 'procurementManager',
    owner: '4',
    leadStatus: 'cold',
    lastContact: '2023-12-20',
    value: 100000000
  },
  {
    id: '6',
    name: 'Võ Thị Lan',
    email: 'lan.vo@retail.vn',
    phone: '0945678901',
    company: 'Retail Chain',
    position: 'operationsDirector',
    owner: '2',
    leadStatus: 'hot',
    lastContact: '2024-01-14',
    value: 400000000
  },
  {
    id: '7',
    name: 'Đỗ Minh Tuấn',
    email: 'tuan.do@finance.com',
    phone: '0956789012',
    company: 'Financial Services',
    position: 'headOfDigital',
    owner: '5',
    leadStatus: 'qualified',
    lastContact: '2024-01-11',
    value: 200000000
  },
  {
    id: '8',
    name: 'Bùi Thị Hoa',
    email: 'hoa.bui@healthcare.vn',
    phone: '0967890123',
    company: 'Healthcare Group',
    position: 'itManager',
    owner: '3',
    leadStatus: 'new',
    lastContact: '2024-01-09',
    value: 180000000
  },
  {
    id: '9',
    name: 'Ngô Văn Kiên',
    email: 'kien.ngo@logistics.com',
    phone: '0978901234',
    company: 'Logistics Solutions',
    position: 'supplyChainManager',
    owner: '1',
    leadStatus: 'hot',
    lastContact: '2024-01-16',
    value: 320000000
  },
  {
    id: '10',
    name: 'Đặng Thị Linh',
    email: 'linh.dang@education.edu',
    phone: '0989012345',
    company: 'Education Institute',
    position: 'technologyDirector',
    owner: '2',
    leadStatus: 'qualified',
    lastContact: '2024-01-13',
    value: 280000000
  },
  {
    id: '11',
    name: 'Lý Minh Quang',
    email: 'quang.ly@manufacturing.vn',
    phone: '0990123456',
    company: 'Manufacturing Corp',
    position: 'productionManager',
    owner: '3',
    leadStatus: 'new',
    lastContact: '2024-01-07',
    value: 450000000
  },
  {
    id: '12',
    name: 'Phan Thị Nga',
    email: 'nga.phan@tourism.com',
    phone: '0901234568',
    company: 'Tourism Group',
    position: 'digitalMarketingHead',
    owner: '4',
    leadStatus: 'cold',
    lastContact: '2023-12-25',
    value: 120000000
  },
  {
    id: '13',
    name: 'Vũ Văn Hùng',
    email: 'hung.vu@construction.vn',
    phone: '0912345679',
    company: 'Construction Ltd',
    position: 'projectManager',
    owner: '5',
    leadStatus: 'qualified',
    lastContact: '2024-01-11',
    value: 380000000
  },
  {
    id: '14',
    name: 'Trịnh Thị Oanh',
    email: 'oanh.trinh@banking.com',
    phone: '0923456780',
    company: 'Banking Solutions',
    position: 'itDirector',
    owner: '1',
    leadStatus: 'hot',
    lastContact: '2024-01-15',
    value: 600000000
  },
  {
    id: '15',
    name: 'Hồ Văn Phúc',
    email: 'phuc.ho@insurance.vn',
    phone: '0934567891',
    company: 'Insurance Group',
    position: 'digitalTransformationLead',
    owner: '2',
    leadStatus: 'qualified',
    lastContact: '2024-01-12',
    value: 350000000
  },
  {
    id: '16',
    name: 'Mai Thị Quỳnh',
    email: 'quynh.mai@media.com',
    phone: '0945678902',
    company: 'Media Corporation',
    position: 'technologyManager',
    owner: '3',
    leadStatus: 'new',
    lastContact: '2024-01-08',
    value: 220000000
  },
  {
    id: '17',
    name: 'Đinh Văn Sơn',
    email: 'son.dinh@energy.vn',
    phone: '0956789013',
    company: 'Energy Solutions',
    position: 'operationsDirector',
    owner: '4',
    leadStatus: 'cold',
    lastContact: '2023-12-18',
    value: 480000000
  },
  {
    id: '18',
    name: 'Lương Thị Tâm',
    email: 'tam.luong@pharma.com',
    phone: '0967890124',
    company: 'Pharmaceutical Inc',
    position: 'rdManager',
    owner: '5',
    leadStatus: 'qualified',
    lastContact: '2024-01-10',
    value: 290000000
  },
  {
    id: '19',
    name: 'Cao Văn Thắng',
    email: 'thang.cao@automotive.vn',
    phone: '0978901235',
    company: 'Automotive Group',
    position: 'engineeringManager',
    owner: '1',
    leadStatus: 'hot',
    lastContact: '2024-01-14',
    value: 520000000
  },
  {
    id: '20',
    name: 'Đoàn Thị Uyên',
    email: 'uyen.doan@agriculture.com',
    phone: '0989012346',
    company: 'Agriculture Tech',
    position: 'innovationDirector',
    owner: '2',
    leadStatus: 'qualified',
    lastContact: '2024-01-11',
    value: 180000000
  },
  {
    id: '21',
    name: 'Tô Văn Vinh',
    email: 'vinh.to@textile.vn',
    phone: '0990123457',
    company: 'Textile Manufacturing',
    position: 'qualityManager',
    owner: '3',
    leadStatus: 'new',
    lastContact: '2024-01-06',
    value: 150000000
  },
  {
    id: '22',
    name: 'Bạch Thị Xuân',
    email: 'xuan.bach@chemicals.com',
    phone: '0901234569',
    company: 'Chemical Industries',
    position: 'processManager',
    owner: '4',
    leadStatus: 'cold',
    lastContact: '2023-12-22',
    value: 340000000
  },
  {
    id: '23',
    name: 'Lâm Văn Yên',
    email: 'yen.lam@electronics.vn',
    phone: '0912345680',
    company: 'Electronics Corp',
    position: 'productManager',
    owner: '5',
    leadStatus: 'qualified',
    lastContact: '2024-01-09',
    value: 420000000
  },
  {
    id: '24',
    name: 'Ứng Thị Zara',
    email: 'zara.ung@fashion.com',
    phone: '0923456781',
    company: 'Fashion Retail',
    position: 'ecommerceDirector',
    owner: '1',
    leadStatus: 'hot',
    lastContact: '2024-01-13',
    value: 260000000
  },
  {
    id: '25',
    name: 'Khương Văn An',
    email: 'an.khuong@sports.vn',
    phone: '0934567892',
    company: 'Sports Equipment',
    position: 'salesDirector',
    owner: '2',
    leadStatus: 'qualified',
    lastContact: '2024-01-10',
    value: 190000000
  }
];

const ContactsPage: React.FC = () => {
  const theme = useTheme();
  const { t } = useTranslation();

  // Canonical list of position keys (control which appear in UI)
  const positionKeys = React.useMemo(
    () => [
      'itDirector',
      'marketingManager',
      'cto',
      'ceo',
      'procurementManager',
      'operationsDirector',
      'headOfDigital',
      'itManager',
      'supplyChainManager',
      'technologyDirector',
      'productionManager',
      'digitalMarketingHead',
      'projectManager',
      'digitalTransformationLead',
      'technologyManager',
      'rdManager',
      'engineeringManager',
      'innovationDirector',
      'qualityManager',
      'processManager',
      'productManager',
      'ecommerceDirector',
      'salesDirector'
    ],
    []
  );

  // Positions options from i18n 'positions' namespace
  const positionsOptions = React.useMemo(
    () => positionKeys.map((key) => ({ value: key, label: t(`positions:${key}`) })),
    [positionKeys, t]
  );

  const [contactsData, setContactsData] = useState<SmartTableRow[]>(mockContactsData);
  const [filteredData, setFilteredData] = useState<SmartTableRow[]>(mockContactsData);
  const [loading, setLoading] = useState(false);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [currentView, setCurrentView] = useState('all');
  const [previewContact, setPreviewContact] = useState<SmartTableRow | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);

  // Lead status options (localized)
  const leadStatusOptions = React.useMemo(() => ([
    { value: 'new', label: t('pages.contacts.form.options.leadStatus.new'), color: '#2196f3' },
    { value: 'qualified', label: t('pages.contacts.form.options.leadStatus.qualified'), color: '#4caf50' },
    { value: 'hot', label: t('pages.contacts.form.options.leadStatus.hot'), color: '#ff5722' },
    { value: 'cold', label: t('pages.contacts.form.options.leadStatus.cold'), color: '#9e9e9e' },
    { value: 'converted', label: t('pages.contacts.form.options.leadStatus.converted'), color: '#8bc34a' }
  ]), [t, positionsOptions]);

  // Filter configuration for Contacts
  const filterConfigs: FilterConfig[] = [
    {
      id: 'owner',
      label: t('pages.contacts.filters.owner'),
      type: 'owner',
      icon: <PersonIcon fontSize="small" />,
      enabled: true,
      fieldName: 'owner'
    },
    {
      id: 'lastContact',
      label: t('pages.contacts.filters.lastContact'),
      type: 'date',
      icon: <ActivityIcon fontSize="small" />,
      enabled: true,
      fieldName: 'lastContact'
    },
    {
      id: 'leadStatus',
      label: t('pages.contacts.filters.leadStatus'),
      type: 'status',
      icon: <StatusIcon fontSize="small" />,
      enabled: true,
      fieldName: 'leadStatus'
    }
  ];

  // Saved views for Contacts
  const savedViews: SavedView[] = [
    { id: 'all', label: t('pages.contacts.views.all'), count: mockContactsData.length },
    { id: 'my', label: t('pages.contacts.views.my'), count: 8 },
    { id: 'unassigned', label: t('pages.contacts.views.unassigned'), count: 3 }
  ];

  // Filter owners (using existing mockUsers)
  const filterOwners: FilterOwner[] = mockUsers.map(user => ({
    id: user.id,
    name: user.name,
    email: user.email,
    avatar: user.avatar
  }));

  // Filter statuses (using existing leadStatusOptions)
  const filterStatuses: FilterStatus[] = leadStatusOptions.map(status => ({
    value: status.value,
    label: status.label,
    color: status.color
  }));

  // Translated columns for SmartTable
  const translatedColumns: SmartTableColumn[] = React.useMemo(() => ([
    {
      id: 'name',
      label: t('pages.contacts.columns.name'),
      type: 'text',
      width: 200,
      sortable: true,
      editable: true,
      required: true
    },
    {
      id: 'email',
      label: t('pages.contacts.columns.email'),
      type: 'email',
      width: 250,
      sortable: true,
      editable: true,
      required: true,
      validate: (value: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(value) ? null : t('pages.contacts.validation.emailInvalid');
      }
    },
    {
      id: 'phone',
      label: t('pages.contacts.columns.phone'),
      type: 'phone',
      width: 150,
      sortable: true,
      editable: true,
      validate: (value: string) => {
        const phoneRegex = /^[0-9]{10,11}$/;
        return phoneRegex.test(value.replace(/\D/g, '')) ? null : t('pages.contacts.validation.phoneInvalid');
      }
    },
    {
      id: 'company',
      label: t('pages.contacts.columns.company'),
      type: 'text',
      width: 200,
      sortable: true,
      editable: true
    },
    {
      id: 'position',
      label: t('pages.contacts.columns.position'),
      type: 'select',
      width: 200,
      sortable: true,
      editable: true,
      options: positionsOptions
    },
    {
      id: 'owner',
      label: t('pages.contacts.columns.owner'),
      type: 'userSelect',
      width: 180,
      sortable: true,
      editable: true
    },
    {
      id: 'leadStatus',
      label: t('pages.contacts.columns.leadStatus'),
      type: 'select',
      width: 150,
      sortable: true,
      editable: true,
      options: leadStatusOptions
    },
    {
      id: 'lastContact',
      label: t('pages.contacts.columns.lastContact'),
      type: 'date',
      width: 130,
      sortable: true,
      editable: true
    },
    {
      id: 'value',
      label: t('pages.contacts.columns.value'),
      type: 'currency',
      width: 150,
      sortable: true,
      editable: true,
      format: (value: number) => {
        if (value >= 1000000000) return `${(value / 1000000000).toFixed(1)}B₫`;
        if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M₫`;
        if (value >= 1000) return `${(value / 1000).toFixed(1)}K₫`;
        return `${value}₫`;
      }
    },
    {
      id: 'actions',
      label: t('pages.contacts.columns.actions'),
      type: 'actions',
      width: 100,
      sortable: false,
      editable: false
    }
  ]), [t]);

  // Handle filter query change
  const handleFilterQueryChange = (query: FilterQuery) => {
    // Mock filtering logic - in real app this would be API call
    let filtered = [...contactsData];

    // Filter by owners
    if (query.ownerIds.length > 0) {
      filtered = filtered.filter(contact => 
        query.ownerIds.includes(contact.owner) || 
        (query.ownerIds.includes('unassigned') && !contact.owner)
      );
    }

    // Filter by lead status
    if (query.leadStatus.length > 0) {
      filtered = filtered.filter(contact => 
        query.leadStatus.includes(contact.leadStatus)
      );
    }

    // Filter by last contact date (mock logic)
    if ((query as any).lastContact?.preset) {
      // Mock date filtering based on preset
      console.log('Filtering by last contact:', (query as any).lastContact.preset);
    }

    setFilteredData(filtered);
  };

  // Handle view change
  const handleViewChange = (viewId: string) => {
    setCurrentView(viewId);
    // Mock view filtering logic
    let filtered = [...contactsData];
    
    switch (viewId) {
      case 'my':
        filtered = filtered.filter(contact => contact.owner === '1'); // Current user
        break;
      case 'unassigned':
        filtered = filtered.filter(contact => !contact.owner);
        break;
      default:
        filtered = contactsData;
    }
    
    setFilteredData(filtered);
  };

  // Handle cell edit
  const handleCellEdit = async (rowId: string, columnId: string, value: any): Promise<boolean> => {
    setLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Update data
    setContactsData(prev => 
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
    console.log('Open contact detail:', row);
    // Navigate to contact detail page or open side panel
  };

  // Handle bulk actions
  const handleBulkAction = (action: string, selectedRows: string[]) => {
    console.log('Bulk action:', action, selectedRows);
    switch (action) {
      case 'delete':
        setContactsData(prev => prev.filter(row => !selectedRows.includes(row.id)));
        setSelectedRows([]);
        break;
      case 'assign':
        // Open assign owner dialog
        break;
    }
  };

  // Handle contact preview
  const handlePreviewContact = (contact: SmartTableRow) => {
    setPreviewContact(contact);
    setPreviewOpen(true);
  };

  // Handle close preview
  const handleClosePreview = () => {
    setPreviewOpen(false);
    setPreviewContact(null);
  };

  // Convert SmartTableRow to Contact format for ContactDetails
  const convertToContactFormat = (row: SmartTableRow) => {
    const nameParts = (row.name as string).split(' ');
    return {
      id: parseInt(row.id),
      firstName: nameParts[0] || '',
      lastName: nameParts.slice(1).join(' ') || '',
      email: row.email as string,
      phone: row.phone as string,
      owner: row.owner as string,
      createDate: row.createDate as string,
      leadStatus: row.leadStatus as string
    };
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
            {t('pages.contacts.title')}
          </Typography>
          <Typography 
            variant="body1" 
            color="text.secondary"
          >
            {t('pages.contacts.subtitle')}
          </Typography>
        </Box>

        {/* Filter Bar */}
        <FilterBar
          entity="contacts"
          availableFilters={filterConfigs}
          owners={filterOwners}
          statuses={filterStatuses}
          savedViews={savedViews}
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
            defaultRowsPerPage={10}
            onRowSelect={setSelectedRows}
            onCellEdit={handleCellEdit}
            onRowDoubleClick={handleRowDoubleClick}
            onBulkAction={handleBulkAction}
            onPreviewContact={handlePreviewContact}
            users={mockUsers}
            emptyMessage={t('pages.contacts.empty')}
            zebra={true}
          />
        </Box>

        {/* Contact Details Preview Drawer */}
        <Drawer
          anchor="right"
          open={previewOpen}
          onClose={handleClosePreview}
          PaperProps={{
            sx: {
              width: 400,
              p: 3,
              backgroundColor: 'background.paper'
            }
          }}
        >
          {previewContact && (
            <ContactDetails
              contact={convertToContactFormat(previewContact)}
              onClose={handleClosePreview}
              onOpenEmailWindow={() => {
                console.log('Open email window for:', previewContact.name);
                // TODO: Implement email window functionality
              }}
              onOpenNoteDialog={() => {
                console.log('Open note dialog for:', previewContact.name);
                // TODO: Implement note dialog functionality
              }}
            />
          )}
        </Drawer>
      </Box>
    </Fade>
  );
};

export default ContactsPage;
