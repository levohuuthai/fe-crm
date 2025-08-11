import React, { useState } from 'react';
import {
  Box,
  Button,
  Paper,
  Typography,
  TextField,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Autocomplete,
  SelectChangeEvent,
} from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon,
  FilterList as FilterIcon,
  FileDownload as ExportIcon,
} from '@mui/icons-material';

// Types
import { Status, Requirement } from './types';
import DeleteConfirmDialog from './components/dialogs/DeleteConfirmDialog';
import RequirementList from './components/RequirementList';
import RequirementForm from './components/RequirementForm';
import RequirementDetail from './components/RequirementDetail';

// Fake data
const fakeCustomers = ['Công ty A', 'Công ty B', 'Công ty C', 'Công ty D'];
const fakeAssignees = ['Nguyễn Văn A', 'Trần Thị B', 'Lê Văn C', 'Phạm Thị D'];

const generateFakeRequirements = (count: number): Requirement[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    name: `Yêu cầu ${i + 1} - ${['Hệ thống kho', 'Website bán hàng', 'App di động', 'Phần mềm kế toán'][i % 4]}`,
    customer: fakeCustomers[Math.floor(Math.random() * fakeCustomers.length)],
    assignee: fakeAssignees[Math.floor(Math.random() * fakeAssignees.length)],
    status: ['pending', 'in_discussion', 'confirmed'][Math.floor(Math.random() * 3)] as Status,
    expectedDeadline: new Date(Date.now() + Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    createdDate: new Date(Date.now() - Math.floor(Math.random() * 90) * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  }));
};

const statusOptions = [
  { value: 'pending', label: 'Chờ xử lý' },
  { value: 'in_discussion', label: 'Đang thảo luận' },
  { value: 'confirmed', label: 'Đã xác nhận' }
];

const RequirementManagement = () => {
  // Pagination and filtering states
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [customerFilter, setCustomerFilter] = useState<string | null>(null);
  const [assigneeFilter, setAssigneeFilter] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  
  // Requirements state
  const [requirements, setRequirements] = useState<Requirement[]>(generateFakeRequirements(25));
  
  // Create dialog state
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  
  // Delete dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [requirementToDelete, setRequirementToDelete] = useState<number | null>(null);

  // Detail dialog state
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [selectedRequirement, setSelectedRequirement] = useState<Requirement | null>(null);

  const handleSaveRequirement = (requirement: Requirement) => {
    const newRequirement = {
      ...requirement,
      id: Math.max(...requirements.map(r => r.id), 0) + 1,
    };
    
    setRequirements([newRequirement, ...requirements]);
    setCreateDialogOpen(false);
  };

  // Filter requirements
  const filteredRequirements = requirements.filter(req => {
    const matchesSearch = req.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCustomer = !customerFilter || req.customer === customerFilter;
    const matchesAssignee = !assigneeFilter || req.assignee === assigneeFilter;
    const matchesStatus = statusFilter === 'all' || req.status === statusFilter;
    
    return matchesSearch && matchesCustomer && matchesAssignee && matchesStatus;
  });

  // Pagination
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setPage(0);
  };

  const handleCustomerFilterChange = (event: any, newValue: string | null) => {
    setCustomerFilter(newValue);
    setPage(0);
  };

  const handleAssigneeFilterChange = (event: any, newValue: string | null) => {
    setAssigneeFilter(newValue);
    setPage(0);
  };

  const handleStatusFilterChange = (event: SelectChangeEvent) => {
    setStatusFilter(event.target.value);
    setPage(0);
  };

  const handleEditRequirement = (id: number) => {
    // Implement edit requirement logic
    console.log(`Edit requirement with id ${id}`);
  };

  const handleDeleteRequirement = (id: number) => {
    setRequirementToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleViewRequirementDetail = (id: number) => {
    const requirement = requirements.find(req => req.id === id);
    if (requirement) {
      setSelectedRequirement(requirement);
      setDetailDialogOpen(true);
    }
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setRequirementToDelete(null);
  };

  const handleConfirmDelete = () => {
    if (requirementToDelete !== null) {
      setRequirements(requirements.filter(req => req.id !== requirementToDelete));
      setDeleteDialogOpen(false);
      setRequirementToDelete(null);
    }
  };

  const handleCreateRequirement = () => {
    setCreateDialogOpen(true);
  };

  const handleCloseCreateDialog = () => {
    setCreateDialogOpen(false);
  };

  const paginatedRequirements = filteredRequirements.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Typography variant="h4" component="h1">
          Quản lý Requirement
        </Typography>
        <Stack direction="row" spacing={2} sx={{ flexWrap: 'wrap', gap: 1 }}>
          <Button 
            variant="outlined" 
            startIcon={<ExportIcon />}
            onClick={() => console.log('Export to Excel')}
          >
            Xuất Excel
          </Button>
          <Button 
            variant="contained" 
            color="primary" 
            startIcon={<AddIcon />}
            onClick={handleCreateRequirement}
          >
            Tạo Requirement
          </Button>
        </Stack>
      </Box>

      <Paper sx={{ p: 2, mb: 2 }}>
        <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap' }}>
          <TextField
            variant="outlined"
            placeholder="Tìm kiếm theo tên requirement..."
            size="small"
            value={searchTerm}
            onChange={handleSearch}
            sx={{ minWidth: 250, flex: 1 }}
            InputProps={{
              startAdornment: <SearchIcon sx={{ color: 'action.active', mr: 1 }} />,
            }}
          />
          <Autocomplete
            options={fakeCustomers}
            value={customerFilter}
            onChange={handleCustomerFilterChange}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Khách hàng"
                size="small"
                sx={{ minWidth: 200 }}
                InputProps={{
                  ...params.InputProps,
                  startAdornment: <FilterIcon fontSize="small" sx={{ color: 'action.active', mr: 1 }} />,
                }}
              />
            )}
          />
          <Autocomplete
            options={fakeAssignees}
            value={assigneeFilter}
            onChange={handleAssigneeFilterChange}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Người phụ trách"
                size="small"
                sx={{ minWidth: 200 }}
                InputProps={{
                  ...params.InputProps,
                  startAdornment: <FilterIcon fontSize="small" sx={{ color: 'action.active', mr: 1 }} />,
                }}
              />
            )}
          />
          <FormControl sx={{ minWidth: 200 }} size="small">
            <InputLabel>Trạng thái</InputLabel>
            <Select
              value={statusFilter}
              label="Trạng thái"
              onChange={handleStatusFilterChange}
              startAdornment={<FilterIcon fontSize="small" sx={{ color: 'action.active', mr: 1 }} />}
            >
              <MenuItem value="all">Tất cả</MenuItem>
              {statusOptions.map((status) => (
                <MenuItem key={status.value} value={status.value}>
                  {status.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        <RequirementList
          requirements={paginatedRequirements}
          page={page}
          rowsPerPage={rowsPerPage}
          totalCount={filteredRequirements.length}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          onEdit={handleEditRequirement}
          onDelete={handleDeleteRequirement}
          onViewDetail={handleViewRequirementDetail}
        />
      </Paper>

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        onConfirm={handleConfirmDelete}
        title="Xác nhận xóa"
        content="Bạn có chắc chắn muốn xóa yêu cầu này?"
      />

      {/* Requirement Detail Dialog */}
      <RequirementDetail
        open={detailDialogOpen}
        onClose={() => setDetailDialogOpen(false)}
        requirement={selectedRequirement}
      />

      {/* Create Requirement Form */}
      <RequirementForm
        open={createDialogOpen}
        onClose={handleCloseCreateDialog}
        onSave={handleSaveRequirement}
        customers={fakeCustomers}
        assignees={fakeAssignees}
      />
    </Box>
  );
};

export default RequirementManagement;
