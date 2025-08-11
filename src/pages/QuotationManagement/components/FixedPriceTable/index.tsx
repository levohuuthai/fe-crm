import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  IconButton,
  Button,
  Box,
  Typography,
  Tooltip,
  TableFooter,
  TablePagination,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  DragIndicator as DragHandleIcon,
} from '@mui/icons-material';
import { EffortColumn, EstimationRow } from '../../types/quoteTemplate';

// Các cột cố định không thể xóa
const FIXED_COLUMNS: Omit<EffortColumn, 'id' | 'key' | 'order'>[] = [
  { name: 'Feature', isFixed: true },
  { name: 'Detail', isFixed: true },
  { name: 'Description', isFixed: true },
  { name: 'Notes', isFixed: true },
  { name: 'IT Req', isFixed: true, isEffort: true },
  { name: 'UX/UI', isFixed: true, isEffort: true },
];

interface FixedPriceTableProps {
  rows: EstimationRow[];
  effortColumns: EffortColumn[];
  onRowsChange: (rows: EstimationRow[]) => void;
  onColumnsChange: (columns: EffortColumn[]) => void;
}

const FixedPriceTable: React.FC<FixedPriceTableProps> = ({
  rows = [],
  effortColumns = [],
  onRowsChange,
  onColumnsChange,
}) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [newColumnName, setNewColumnName] = useState('');
  const [editingColumn, setEditingColumn] = useState<string | null>(null);
  const [editColumnName, setEditColumnName] = useState('');

  // Xử lý thay đổi trang
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  // Xử lý thay đổi số dòng mỗi trang
  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Thêm cột effort mới
  const handleAddColumn = () => {
    if (!newColumnName.trim()) return;
    
    // Đặt thứ tự của cột mới cao hơn các cột cố định nhưng thấp hơn cột hành động
    // Cột hành động sẽ có thứ tự cao nhất (1000)
    const newColumn: EffortColumn = {
      id: `col-${Date.now()}`,
      name: newColumnName.trim(),
      key: `effort-${Date.now()}`,
      order: 900, // Thứ tự cao để đảm bảo nằm sau các cột cố định nhưng trước cột hành động
      isFixed: false,
      color: '#ffffff' // Màu mặc định
    };

    onColumnsChange([...effortColumns, newColumn]);
    setNewColumnName('');
  };

  // Bắt đầu chỉnh sửa tên cột
  const startEditingColumn = (columnId: string, currentName: string) => {
    setEditingColumn(columnId);
    setEditColumnName(currentName);
  };

  // Lưu tên cột đã chỉnh sửa
  const saveColumnName = (columnId: string) => {
    const updatedColumns = effortColumns.map(col => 
      col.id === columnId ? { ...col, name: editColumnName } : col
    );
    onColumnsChange(updatedColumns);
    setEditingColumn(null);
  };

  // Xóa cột
  const handleDeleteColumn = (columnId: string) => {
    const columnToDelete = effortColumns.find(col => col.id === columnId);
    if (!columnToDelete?.isFixed) {
      const updatedColumns = effortColumns.filter(col => col.id !== columnId);
      onColumnsChange(updatedColumns);
      
      // Cập nhật dữ liệu hàng để xóa cột effort tương ứng
      const updatedRows = rows.map(row => {
        const { [columnToDelete?.key || '']: _, ...restEfforts } = row.efforts || {};
        return { ...row, efforts: restEfforts };
      });
      onRowsChange(updatedRows);
    }
  };

  // Cập nhật giá trị ô
  const handleCellChange = (
    rowId: string,
    field: string,
    value: string | number
  ) => {
    const updatedRows = rows.map(row => {
      if (row.id === rowId) {
        if (field.startsWith('effort-')) {
          return {
            ...row,
            efforts: {
              ...row.efforts,
              [field]: Number(value) || 0,
            },
          };
        }
        return { ...row, [field]: value };
      }
      return row;
    });
    onRowsChange(updatedRows);
  };

  // Thêm hàng mới
  const handleAddRow = () => {
    const newRow: EstimationRow = {
      id: `row-${Date.now()}`,
      feature: '',
      detail: '',
      description: '',
      notes: '',
      itReq: '',
      uxUi: '',
      efforts: {},
    };
    onRowsChange([...rows, newRow]);
  };

  // Xóa hàng
  const handleDeleteRow = (rowId: string) => {
    onRowsChange(rows.filter(row => row.id !== rowId));
  };

  // Tính tổng cho từng cột effort
  const calculateColumnTotal = (columnKey: string) => {
    return rows.reduce((sum, row) => {
      return sum + (Number(row.efforts?.[columnKey]) || 0);
    }, 0);
  };

  // Lấy tất cả các cột (cố định + động)
  const fixedColumnsWithIds = FIXED_COLUMNS.map((col, index) => ({
    ...col,
    id: `fixed-${index}`,
    key: col.name.toLowerCase().replace(/\s+/g, '-'),
    order: index, // Các cột cố định có thứ tự thấp (0-5)
  }));
  
  // Chỉ lấy các cột effort không trùng với các cột cố định
  const nonDuplicateEffortColumns = effortColumns.filter(effortCol => 
    !fixedColumnsWithIds.some(fixedCol => fixedCol.key === effortCol.key)
  );
  
  // Thêm cột Subtotal (days) với thứ tự cao
  const subtotalColumn = {
    id: 'subtotal-column',
    name: 'Subtotal (days)',
    key: 'subtotal',
    order: 950, // Thứ tự cao để đảm bảo nằm sau các cột effort nhưng trước cột hành động
    isFixed: true,
  };
  
  // Sắp xếp các cột theo thứ tự
  const allColumns = [
    ...fixedColumnsWithIds,
    ...nonDuplicateEffortColumns,
    subtotalColumn, // Thêm cột subtotal
  ].sort((a, b) => a.order - b.order);

  return (
    <Box>
      {/* Thanh công cụ */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Box>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleAddRow}
            size="small"
            sx={{ mr: 1 }}
          >
            Thêm dòng
          </Button>
        </Box>
        
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <TextField
            size="small"
            placeholder="Tên cột mới"
            value={newColumnName}
            onChange={(e) => setNewColumnName(e.target.value)}
            sx={{ mr: 1, minWidth: 150 }}
          />
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={handleAddColumn}
            size="small"
            disabled={!newColumnName.trim()}
          >
            Thêm cột
          </Button>
        </Box>
      </Box>

      {/* Bảng dữ liệu */}
      <TableContainer component={Paper} sx={{ maxHeight: 600, overflow: 'auto' }}>
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow>
              <TableCell width={50}>#</TableCell>
              {allColumns.map((column) => (
                <TableCell key={column.id}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <DragHandleIcon 
                      sx={{ 
                        mr: 1, 
                        cursor: 'move',
                        opacity: column.isFixed ? 0.3 : 1,
                        '&:hover': {
                          opacity: 1,
                        },
                      }} 
                    />
                    
                    {editingColumn === column.id ? (
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <TextField
                          value={editColumnName}
                          onChange={(e) => setEditColumnName(e.target.value)}
                          size="small"
                          sx={{ mr: 1 }}
                        />
                        <IconButton 
                          size="small" 
                          onClick={() => saveColumnName(column.id)}
                          color="primary"
                        >
                          <SaveIcon fontSize="small" />
                        </IconButton>
                        <IconButton 
                          size="small" 
                          onClick={() => setEditingColumn(null)}
                          color="error"
                        >
                          <CancelIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    ) : (
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Typography variant="subtitle2">
                          {column.name}
                        </Typography>
                        {!column.isFixed && (
                          <Box sx={{ ml: 1 }}>
                            <IconButton 
                              size="small" 
                              onClick={() => startEditingColumn(column.id, column.name)}
                              sx={{ p: 0.5 }}
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                            <IconButton 
                              size="small" 
                              onClick={() => handleDeleteColumn(column.id)}
                              sx={{ p: 0.5 }}
                              color="error"
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Box>
                        )}
                      </Box>
                    )}
                  </Box>
                </TableCell>
              ))}
              {/* Cột hành động luôn ở cuối */}
              <TableCell width={80}>Hành động</TableCell>
            </TableRow>
          </TableHead>
          
          <TableBody>
            {rows
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row, rowIndex) => (
                <TableRow key={row.id} hover>
                  <TableCell>{page * rowsPerPage + rowIndex + 1}</TableCell>
                  
                  {allColumns.map((column) => {
                    // Kiểm tra nếu column key là của các cột effort
                    const isEffortColumn = column.key === 'it-req' || column.key === 'ux/ui' || 
                                         column.key.startsWith('effort-') || 
                                         (column as EffortColumn).isEffort === true;
                    
                    // Log ra để kiểm tra key của các cột
                    console.log('Column key:', column.key, 'isEffort:', isEffortColumn);
                    
                    // Kiểm tra nếu là cột subtotal
                    const isSubtotalColumn = column.key === 'subtotal';
                    
                    return (
                      <TableCell key={`${row.id}-${column.key}`}>
                        {isEffortColumn ? (
                          <TextField
                            type="number"
                            value={column.key === 'it-req' ? row.itReq || '' : 
                                  column.key === 'ux/ui' ? row.uxUi || '' : 
                                  row.efforts?.[column.key] || ''}
                            onChange={(e) => {
                              const value = e.target.value;
                              // Xử lý đặc biệt cho các cột IT Req và UX/UI
                              if (column.key === 'it-req') {
                                handleCellChange(row.id, 'itReq', value);
                              } else if (column.key === 'ux/ui') {
                                handleCellChange(row.id, 'uxUi', value);
                              } else {
                                handleCellChange(row.id, column.key, value);
                              }
                            }}
                            size="small"
                            fullWidth
                            inputProps={{ min: 0, step: 0.5 }}
                          />
                        ) : isSubtotalColumn ? (
                          // Hiển thị tổng ngày công cho mỗi dòng
                          <Typography variant="body2" fontWeight="bold">
                            {Object.keys(row.efforts || {}).reduce((sum, key) => sum + (Number(row.efforts?.[key]) || 0), 0) + 
                             (Number(row.itReq) || 0) + (Number(row.uxUi) || 0)}
                          </Typography>
                        ) : (
                          <TextField
                            value={row[column.key as keyof EstimationRow] || ''}
                            onChange={(e) => 
                              handleCellChange(row.id, column.key, e.target.value)
                            }
                            size="small"
                            fullWidth
                            multiline
                            maxRows={4}
                          />
                        )}
                      </TableCell>
                    );
                  })}
                  
                  <TableCell>
                    <Tooltip title="Xóa dòng">
                      <IconButton 
                        size="small" 
                        color="error"
                        onClick={() => handleDeleteRow(row.id)}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
          
          {/* Dòng tổng cộng */}
          <TableFooter>
            <TableRow>
              <TableCell colSpan={FIXED_COLUMNS.length + 1} align="right">
                <strong>Tổng cộng:</strong>
              </TableCell>
              {effortColumns.map((column) => (
                <TableCell key={`total-${column.key}`}>
                  <strong>{calculateColumnTotal(column.key)}</strong>
                </TableCell>
              ))}
              {/* Cột Subtotal tổng */}
              <TableCell>
                <strong>
                  {rows.reduce((sum, row) => {
                    const rowTotal = Object.keys(row.efforts || {}).reduce(
                      (rowSum, key) => rowSum + (Number(row.efforts?.[key]) || 0), 0
                    ) + (Number(row.itReq) || 0) + (Number(row.uxUi) || 0);
                    return sum + rowTotal;
                  }, 0)}
                </strong>
              </TableCell>
              <TableCell />
            </TableRow>
            {/* Thêm dòng Tổng cộng - Theo giai đoạn (ngày công) */}
            <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
              <TableCell colSpan={FIXED_COLUMNS.length + effortColumns.length + 1} align="right">
                <strong>Tổng cộng - Theo giai đoạn (ngày công):</strong>
              </TableCell>
              <TableCell>
                <strong>
                  {rows.reduce((sum, row) => {
                    const rowTotal = Object.keys(row.efforts || {}).reduce(
                      (rowSum, key) => rowSum + (Number(row.efforts?.[key]) || 0), 0
                    ) + (Number(row.itReq) || 0) + (Number(row.uxUi) || 0);
                    return sum + rowTotal;
                  }, 0)}
                </strong>
              </TableCell>
              <TableCell />
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
      
      {/* Phân trang */}
      <TablePagination
        rowsPerPageOptions={[5, 10, 25, 50]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        labelRowsPerPage="Số dòng mỗi trang:"
        labelDisplayedRows={({ from, to, count }) => 
          `${from}-${to} trong tổng số ${count}`
        }
      />
    </Box>
  );
};

export default FixedPriceTable;
