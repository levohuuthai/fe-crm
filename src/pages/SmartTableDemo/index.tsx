import React, { useState } from 'react';
import {
  Box,
  Typography,
  Container,
  Paper,
  Tabs,
  Tab,
  useTheme
} from '@mui/material';
import SmartTable, { SmartTableColumn, SmartTableRow } from '../../components/SmartTable';

// Mock users data
const mockUsers = [
  { id: '1', name: 'Admin User', email: 'admin@company.com', avatar: '/avatars/admin.jpg' },
  { id: '2', name: 'Sales Manager', email: 'sales@company.com', avatar: '/avatars/sales.jpg' },
  { id: '3', name: 'Tech Lead', email: 'tech@company.com', avatar: '/avatars/tech.jpg' }
];

// Simple demo data
const demoColumns: SmartTableColumn[] = [
  {
    id: 'name',
    label: 'Name',
    type: 'text',
    width: 200,
    sortable: true,
    editable: true,
    required: true
  },
  {
    id: 'email',
    label: 'Email',
    type: 'email',
    width: 250,
    sortable: true,
    editable: true,
    required: true
  },
  {
    id: 'status',
    label: 'Status',
    type: 'select',
    width: 120,
    sortable: true,
    editable: true,
    options: [
      { value: 'active', label: 'Active', color: '#4caf50' },
      { value: 'inactive', label: 'Inactive', color: '#f44336' },
      { value: 'pending', label: 'Pending', color: '#ff9800' }
    ]
  },
  {
    id: 'owner',
    label: 'Owner',
    type: 'userSelect',
    width: 180,
    sortable: true,
    editable: true
  },
  {
    id: 'value',
    label: 'Value',
    type: 'currency',
    width: 120,
    sortable: true,
    editable: true
  },
  {
    id: 'date',
    label: 'Date',
    type: 'date',
    width: 130,
    sortable: true,
    editable: true
  },
  {
    id: 'actions',
    label: 'Actions',
    type: 'actions',
    width: 100,
    sortable: false,
    editable: false
  }
];

const demoData: SmartTableRow[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    status: 'active',
    owner: '1',
    value: 1500000,
    date: '2024-01-15'
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    status: 'pending',
    owner: '2',
    value: 2500000,
    date: '2024-01-20'
  },
  {
    id: '3',
    name: 'Bob Johnson',
    email: 'bob@example.com',
    status: 'inactive',
    owner: '3',
    value: 750000,
    date: '2024-01-10'
  }
];

const SmartTableDemo: React.FC = () => {
  const theme = useTheme();
  const [tabValue, setTabValue] = useState(0);
  const [data, setData] = useState<SmartTableRow[]>(demoData);
  const [loading, setLoading] = useState(false);

  const handleCellEdit = async (rowId: string, columnId: string, value: any): Promise<boolean> => {
    setLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Update data
    setData(prev => 
      prev.map(row => 
        row.id === rowId ? { ...row, [columnId]: value } : row
      )
    );
    
    setLoading(false);
    return true;
  };

  const handleRowDoubleClick = (row: SmartTableRow) => {
    console.log('Row double clicked:', row);
  };

  const handleBulkAction = (action: string, selectedRows: string[]) => {
    console.log('Bulk action:', action, selectedRows);
  };

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      <Box>
        <Typography variant="h4" component="h1" sx={{ mb: 3, fontWeight: 'bold' }}>
          Smart Table Demo
        </Typography>
        
        <Paper sx={{ mb: 2 }}>
          <Tabs value={tabValue} onChange={(_, newValue) => setTabValue(newValue)}>
            <Tab label="Basic Demo" />
            <Tab label="Advanced Features" />
            <Tab label="Performance Test" />
          </Tabs>
        </Paper>

        {tabValue === 0 && (
          <SmartTable
            columns={demoColumns}
            data={data}
            loading={loading}
            searchable={true}
            filterable={true}
            selectable={true}
            pagination={true}
            defaultRowsPerPage={10}
            onCellEdit={handleCellEdit}
            onRowDoubleClick={handleRowDoubleClick}
            onBulkAction={handleBulkAction}
            users={mockUsers}
            emptyMessage="No data available"
            zebra={true}
          />
        )}

        {tabValue === 1 && (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h6">Advanced Features Coming Soon</Typography>
            <Typography variant="body2" color="text.secondary">
              Column freezing, advanced filtering, export options, etc.
            </Typography>
          </Box>
        )}

        {tabValue === 2 && (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h6">Performance Test</Typography>
            <Typography variant="body2" color="text.secondary">
              Test with large datasets, virtual scrolling, etc.
            </Typography>
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default SmartTableDemo;
