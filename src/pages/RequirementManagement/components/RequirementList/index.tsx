import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
  TablePagination,
  Typography
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Requirement, Status } from '../../types';

interface RequirementListProps {
  requirements: Requirement[];
  page: number;
  rowsPerPage: number;
  totalCount: number;
  onPageChange: (event: unknown, newPage: number) => void;
  onRowsPerPageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
  onViewDetail: (id: number) => void;
}

const getStatusColor = (status: Status) => {
  switch (status) {
    case 'pending':
      return 'warning';
    case 'in_discussion':
      return 'info';
    case 'confirmed':
      return 'success';
    default:
      return 'default';
  }
};

const getStatusLabel = (status: Status) => {
  switch (status) {
    case 'pending':
      return 'Chờ xử lý';
    case 'in_discussion':
      return 'Đang thảo luận';
    case 'confirmed':
      return 'Đã xác nhận';
    default:
      return 'Unknown';
  }
};

const RequirementList: React.FC<RequirementListProps> = ({
  requirements,
  page,
  rowsPerPage,
  totalCount,
  onPageChange,
  onRowsPerPageChange,
  onEdit,
  onDelete,
  onViewDetail
}) => {
  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Tên Requirement</TableCell>
              <TableCell>Loại Requirement</TableCell>
              <TableCell>Khách hàng</TableCell>
              <TableCell>Người phụ trách</TableCell>
              <TableCell>Nguồn tạo</TableCell>
              <TableCell>Ngày tạo</TableCell>
              <TableCell>Deadline</TableCell>
              <TableCell>Trạng thái</TableCell>
              <TableCell>Thao tác</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {requirements.length > 0 ? (
              requirements.map((req) => (
                <TableRow 
                  hover 
                  key={req.id} 
                  onClick={() => onViewDetail(req.id)}
                  sx={{ cursor: 'pointer' }}
                >
                  <TableCell>{req.id}</TableCell>
                  <TableCell>{req.name}</TableCell>
                  <TableCell>{req.type || 'N/A'}</TableCell>
                  <TableCell>{req.customer}</TableCell>
                  <TableCell>{req.assignee}</TableCell>
                  <TableCell>{req.source || 'N/A'}</TableCell>
                  <TableCell>{req.createdDate}</TableCell>
                  <TableCell>{req.expectedDeadline}</TableCell>
                  <TableCell>
                    <Chip 
                      label={getStatusLabel(req.status)} 
                      color={getStatusColor(req.status) as any} 
                      size="small" 
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton size="small" onClick={() => onEdit(req.id)}>
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton size="small" onClick={() => onDelete(req.id)}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={10} align="center">
                  <Typography variant="body1">Không có dữ liệu</Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component="div"
        count={totalCount}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
        labelRowsPerPage="Số dòng mỗi trang:"
        labelDisplayedRows={({ from, to, count }) => `${from}-${to} của ${count}`}
      />
    </Paper>
  );
};

export default RequirementList;
