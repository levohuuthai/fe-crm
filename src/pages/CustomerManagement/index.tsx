import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TextField,
  Button,
  IconButton,
  MenuItem
} from '@mui/material';
import { 
  Add as AddIcon, 
  Edit as EditIcon, 
  Delete as DeleteIcon,
  Search as SearchIcon,
  FilterList as FilterIcon
} from '@mui/icons-material';

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText
} from '@mui/material';

// Fake data
const fakeCustomers = Array.from({ length: 25 }, (_, i) => ({
  id: i + 1,
  name: `Khách hàng ${i + 1}`,
  phone: `0987${Math.floor(100000 + Math.random() * 900000)}`,
  email: `customer${i + 1}@example.com`,
  company: `Công ty ${String.fromCharCode(65 + (i % 5))}`,
  status: ['Tiềm năng', 'Đang chăm sóc', 'Đã ký hợp đồng'][Math.floor(Math.random() * 3)],
  owner: `Nhân viên ${String.fromCharCode(65 + (i % 5))}`,
  createdAt: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toLocaleDateString(),
  notes: `Ghi chú cho khách hàng ${i + 1}`
}));

const statusOptions = ['Tất cả', 'Tiềm năng', 'Đang chăm sóc', 'Đã ký hợp đồng'];

type Customer = typeof fakeCustomers[0];

const CustomerManagement = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('Tất cả');
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [formData, setFormData] = useState<Omit<Customer, 'id' | 'createdAt'>>({ 
    name: '', 
    phone: '', 
    email: '', 
    company: '', 
    status: 'Tiềm năng',
    owner: 'Nhân viên A',
    notes: '' 
  });

  const handleOpenDialog = (customer: Customer | null = null) => {
    if (customer) {
      setFormData({
        name: customer.name,
        phone: customer.phone,
        email: customer.email,
        company: customer.company,
        status: customer.status,
        owner: customer.owner,
        notes: customer.notes
      });
      setSelectedCustomer(customer);
    } else {
      setFormData({ 
        name: '', 
        phone: '', 
        email: '', 
        company: '', 
        status: 'Tiềm năng',
        owner: 'Nhân viên A',
        notes: '' 
      });
      setSelectedCustomer(null);
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedCustomer(null);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | { name?: string; value: unknown }>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name as string]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Xử lý lưu dữ liệu ở đây
    handleCloseDialog();
  };

  const handleDeleteClick = (customer: Customer) => {
    setSelectedCustomer(customer);
    setDeleteConfirmOpen(true);
  };

  const handleDeleteConfirm = () => {
    console.log('Xóa khách hàng:', selectedCustomer?.id);
    setDeleteConfirmOpen(false);
    setSelectedCustomer(null);
  };

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

  const handleStatusFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setStatusFilter(event.target.value);
    setPage(0);
  };

  const filteredCustomers = fakeCustomers.filter(customer => {
    const matchesSearch = 
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone.includes(searchTerm) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'Tất cả' || customer.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const paginatedCustomers = filteredCustomers.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Quản lý khách hàng
        </Typography>
        <Button 
          variant="contained" 
          color="primary" 
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Thêm khách hàng
        </Button>
      </Box>

      <Paper sx={{ p: 2, mb: 2 }}>
        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <TextField
            variant="outlined"
            placeholder="Tìm kiếm theo tên, SĐT, email..."
            size="small"
            fullWidth
            value={searchTerm}
            onChange={handleSearch}
            InputProps={{
              startAdornment: <SearchIcon sx={{ color: 'action.active', mr: 1 }} />,
            }}
          />
          <TextField
            select
            variant="outlined"
            size="small"
            value={statusFilter}
            onChange={handleStatusFilterChange}
            sx={{ minWidth: 200 }}
            InputProps={{
              startAdornment: <FilterIcon sx={{ color: 'action.active', mr: 1 }} />,
            }}
          >
            {statusOptions.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Tên</TableCell>
                <TableCell>Số điện thoại</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Công ty</TableCell>
                <TableCell>Trạng thái</TableCell>
                <TableCell>Người phụ trách</TableCell>
                <TableCell>Ngày tạo</TableCell>
                <TableCell>Thao tác</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedCustomers.map((customer) => (
                <TableRow key={customer.id} hover>
                  <TableCell>{customer.name}</TableCell>
                  <TableCell>{customer.phone}</TableCell>
                  <TableCell>{customer.email}</TableCell>
                  <TableCell>{customer.company}</TableCell>
                  <TableCell>
                    <Box 
                      component="span" 
                      sx={{
                        p: '4px 8px',
                        borderRadius: '4px',
                        bgcolor: customer.status === 'Đã ký hợp đồng' ? '#e8f5e9' : 
                                 customer.status === 'Đang chăm sóc' ? '#e3f2fd' : '#fff3e0',
                        color: customer.status === 'Đã ký hợp đồng' ? '#2e7d32' :
                               customer.status === 'Đang chăm sóc' ? '#1565c0' : '#e65100',
                      }}
                    >
                      {customer.status}
                    </Box>
                  </TableCell>
                  <TableCell>{customer.owner}</TableCell>
                  <TableCell>{customer.createdAt}</TableCell>
                  <TableCell>
                    <IconButton size="small" onClick={() => handleOpenDialog(customer)}>
                      <EditIcon fontSize="small" color="primary" />
                    </IconButton>
                    <IconButton size="small" onClick={() => handleDeleteClick(customer)}>
                      <DeleteIcon fontSize="small" color="error" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredCustomers.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Số dòng mỗi trang:"
          labelDisplayedRows={({ from, to, count }) => 
            `${from}-${to} trong số ${count}`
          }
        />
      </Paper>

      {/* Dialog thêm/sửa khách hàng */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <form onSubmit={handleSubmit}>
          <DialogTitle>{selectedCustomer ? 'Chỉnh sửa khách hàng' : 'Thêm khách hàng mới'}</DialogTitle>
          <DialogContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
              <TextField
                name="name"
                label="Tên khách hàng"
                value={formData.name}
                onChange={handleFormChange}
                fullWidth
                margin="normal"
                required
              />
              <Box sx={{ display: 'flex', gap: 2 }}>
                <TextField
                  name="phone"
                  label="Số điện thoại"
                  value={formData.phone}
                  onChange={handleFormChange}
                  fullWidth
                  margin="normal"
                  required
                />
                <TextField
                  name="email"
                  label="Email"
                  type="email"
                  value={formData.email}
                  onChange={handleFormChange}
                  fullWidth
                  margin="normal"
                  required
                />
              </Box>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <TextField
                  name="company"
                  label="Công ty"
                  value={formData.company}
                  onChange={handleFormChange}
                  fullWidth
                  margin="normal"
                />
                <TextField
                  name="owner"
                  select
                  label="Người phụ trách"
                  value={formData.owner}
                  onChange={handleFormChange}
                  fullWidth
                  margin="normal"
                >
                  {['Nhân viên A', 'Nhân viên B', 'Nhân viên C', 'Nhân viên D', 'Nhân viên E'].map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </TextField>
              </Box>
              <TextField
                name="status"
                select
                label="Trạng thái"
                value={formData.status}
                onChange={handleFormChange}
                fullWidth
                margin="normal"
              >
                {statusOptions.filter(opt => opt !== 'Tất cả').map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                name="notes"
                label="Ghi chú"
                value={formData.notes}
                onChange={handleFormChange}
                fullWidth
                margin="normal"
                multiline
                rows={3}
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Hủy</Button>
            <Button type="submit" variant="contained" color="primary">
              {selectedCustomer ? 'Cập nhật' : 'Thêm mới'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Dialog xác nhận xóa */}
      <Dialog
        open={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
      >
        <DialogTitle>Xác nhận xóa</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Bạn có chắc chắn muốn xóa khách hàng <strong>{selectedCustomer?.name}</strong>? Hành động này không thể hoàn tác.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmOpen(false)}>Hủy</Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">
            Xóa
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CustomerManagement;
