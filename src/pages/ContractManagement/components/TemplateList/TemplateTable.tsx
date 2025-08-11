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
  Tooltip,
  Chip,
  Box,
  Typography,
  TablePagination,
} from '@mui/material';
import {
  Visibility as ViewIcon,
  Edit as EditIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { Template } from './types';

interface TemplateTableProps {
  templates: Template[];
  page: number;
  rowsPerPage: number;
  totalRows: number;
  onPageChange: (page: number) => void;
  onRowsPerPageChange: (rowsPerPage: number) => void;
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  onSetDefault: (id: string) => void;
  onDelete: (id: string) => void;
}

const TemplateTable: React.FC<TemplateTableProps> = ({
  templates,
  page,
  rowsPerPage,
  totalRows,
  onPageChange,
  onRowsPerPageChange,
  onView,
  onEdit,
  onSetDefault,
  onDelete,
}) => {
  const handleChangePage = (event: unknown, newPage: number) => {
    onPageChange(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    onRowsPerPageChange(parseInt(event.target.value, 10));
  };

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Tên template</TableCell>
              <TableCell align="center">Loại</TableCell>
              <TableCell align="center">Trạng thái</TableCell>
              <TableCell align="center">Số trường</TableCell>
              <TableCell align="center">Ngày tạo</TableCell>
              <TableCell align="center">Người tạo</TableCell>
              <TableCell align="center">Thao tác</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {templates.length > 0 ? (
              templates.map((template) => (
                <TableRow key={template.id} hover>
                  <TableCell>
                    <Box display="flex" alignItems="center">
                      {template.isDefault && (
                        <StarIcon
                          color="primary"
                          sx={{ fontSize: '1rem', mr: 1 }}
                        />
                      )}
                      <Typography variant="body2">{template.name}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell align="center">
                    <Chip
                      label={template.type === 'internal' ? 'Nội bộ' : 'Khách hàng'}
                      color={template.type === 'internal' ? 'primary' : 'default'}
                      size="small"
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Chip
                      label={template.status === 'active' ? 'Hoạt động' : 'Ngừng'}
                      color={template.status === 'active' ? 'success' : 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="center">{template.placeholderCount}</TableCell>
                  <TableCell align="center">
                    {new Date(template.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell align="center">{template.createdBy}</TableCell>
                  <TableCell align="center">
                    <Box display="flex" justifyContent="center">
                      <Tooltip title="Xem chi tiết">
                        <IconButton size="small" onClick={() => onView(template.id)}>
                          <ViewIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Chỉnh sửa">
                        <IconButton size="small" onClick={() => onEdit(template.id)}>
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title={template.isDefault ? 'Mặc định' : 'Đặt làm mặc định'}>
                        <span>
                          <IconButton
                            size="small"
                            onClick={() => onSetDefault(template.id)}
                            disabled={template.isDefault}
                            color={template.isDefault ? 'primary' : 'default'}
                          >
                            {template.isDefault ? (
                              <StarIcon fontSize="small" />
                            ) : (
                              <StarBorderIcon fontSize="small" />
                            )}
                          </IconButton>
                        </span>
                      </Tooltip>
                      <Tooltip title="Xóa">
                        <IconButton
                          size="small"
                          onClick={() => onDelete(template.id)}
                          color="error"
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                  <Typography variant="body2" color="textSecondary">
                    Không có dữ liệu
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={totalRows}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        labelRowsPerPage="Số dòng mỗi trang:"
        labelDisplayedRows={({ from, to, count }) =>
          `${from}-${to} trong ${count}`
        }
      />
    </Paper>
  );
};

export default TemplateTable;
