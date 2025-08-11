import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  IconButton,
  Button,
  Typography,
  Tooltip,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { EstimationTableProps, QuotationItem } from '../../types';

const EstimationTable: React.FC<EstimationTableProps> = ({
  items,
  onItemsChange,
  readOnly = false,
  disableFeatureFields = false,
}) => {
  const [tableItems, setTableItems] = useState<QuotationItem[]>(items);

  useEffect(() => {
    setTableItems(items);
  }, [items]);

  const handleValueChange = (id: number, field: keyof QuotationItem, value: any) => {
    const updatedItems = tableItems.map(item => {
      if (item.id === id) {
        const updatedItem = { ...item, [field]: value };
        
        // Recalculate totals if effort fields change
        if (['frontendEffort', 'backendEffort', 'qcEffort', 'pmEffort'].includes(field)) {
          const fe = field === 'frontendEffort' ? Number(value) || 0 : updatedItem.frontendEffort;
          const be = field === 'backendEffort' ? Number(value) || 0 : updatedItem.backendEffort;
          const qc = field === 'qcEffort' ? Number(value) || 0 : updatedItem.qcEffort;
          const pm = field === 'pmEffort' ? Number(value) || 0 : updatedItem.pmEffort;
          
          const totalMD = fe + be + qc + pm;
          const totalMM = totalMD / 20; // Assuming 20 working days per month
          
          return {
            ...updatedItem,
            totalMD,
            totalMM,
          };
        }
        
        return updatedItem;
      }
      return item;
    });
    
    setTableItems(updatedItems);
    onItemsChange(updatedItems);
  };

  const handleAddRow = () => {
    const newId = tableItems.length > 0 ? Math.max(...tableItems.map(item => item.id)) + 1 : 1;
    const newItem: QuotationItem = {
      id: newId,
      feature: '',
      detail: '',
      description: '',
      note: '',
      frontendEffort: 0,
      backendEffort: 0,
      qcEffort: 0,
      pmEffort: 0,
      totalMD: 0,
      totalMM: 0,
    };
    
    const updatedItems = [...tableItems, newItem];
    setTableItems(updatedItems);
    onItemsChange(updatedItems);
  };

  const handleDeleteRow = (id: number) => {
    const updatedItems = tableItems.filter(item => item.id !== id);
    setTableItems(updatedItems);
    onItemsChange(updatedItems);
  };

  // Calculate totals
  const totalFE = tableItems.reduce((sum, item) => sum + item.frontendEffort, 0);
  const totalBE = tableItems.reduce((sum, item) => sum + item.backendEffort, 0);
  const totalQC = tableItems.reduce((sum, item) => sum + item.qcEffort, 0);
  const totalPM = tableItems.reduce((sum, item) => sum + item.pmEffort, 0);
  const totalMD = tableItems.reduce((sum, item) => sum + item.totalMD, 0);
  const totalMM = tableItems.reduce((sum, item) => sum + item.totalMM, 0);

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, alignItems: 'center' }}>
        <Typography variant="h6">Chi tiết ước tính</Typography>
        {!readOnly && (
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={handleAddRow}
            size="small"
          >
            Thêm dòng
          </Button>
        )}
      </Box>
      
      {/* Sử dụng cấu trúc bảng có thể cuộn ngang với các cột cố định chiều rộng */}
      <Box sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer 
          component={Paper} 
          variant="outlined"
          sx={{ 
            maxWidth: '100%',
            overflowX: 'auto',
          }}
        >
          <Table size="small" sx={{ tableLayout: 'fixed' }}>
            <TableHead>
              <TableRow>
                <TableCell width="50px" sx={{ position: 'sticky', left: 0, backgroundColor: '#fff', zIndex: 1 }}>STT</TableCell>
                <TableCell width="150px" sx={{ position: 'sticky', left: '50px', backgroundColor: '#fff', zIndex: 1 }}>Feature</TableCell>
                <TableCell width="200px" sx={{ position: 'sticky', left: '200px', backgroundColor: '#fff', zIndex: 1 }}>Chi tiết</TableCell>
                <TableCell width="250px" sx={{ position: 'sticky', left: '400px', backgroundColor: '#fff', zIndex: 1 }}>Mô tả</TableCell>
                <TableCell width="200px" sx={{ position: 'sticky', left: '650px', backgroundColor: '#fff', zIndex: 1 }}>Ghi chú</TableCell>
                <TableCell align="right" width="80px">FE (MD)</TableCell>
                <TableCell align="right" width="80px">BE (MD)</TableCell>
                <TableCell align="right" width="80px">QC (MD)</TableCell>
                <TableCell align="right" width="80px">PM (MD)</TableCell>
                <TableCell align="right" width="80px">Tổng MD</TableCell>
                <TableCell align="right" width="80px">Tổng MM</TableCell>
                {!readOnly && <TableCell align="center" width="80px">Hành động</TableCell>}
              </TableRow>
            </TableHead>
          <TableBody>
            {tableItems.map((item, index) => (
              <TableRow key={item.id}>
                <TableCell sx={{ position: 'sticky', left: 0, backgroundColor: '#fff', zIndex: 1 }}>{index + 1}</TableCell>
                <TableCell sx={{ position: 'sticky', left: '50px', backgroundColor: '#fff', zIndex: 1 }}>
                  {readOnly ? (
                    <Tooltip title={item.feature} arrow placement="top">
                      <div style={{ maxWidth: '150px', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                        {item.feature}
                      </div>
                    </Tooltip>
                  ) : (
                    <TextField
                      variant="outlined"
                      size="small"
                      value={item.feature}
                      onChange={(e) => handleValueChange(item.id, 'feature', e.target.value)}
                      fullWidth
                      multiline
                      maxRows={3}
                      disabled={disableFeatureFields}
                    />
                  )}
                </TableCell>
                <TableCell sx={{ position: 'sticky', left: '200px', backgroundColor: '#fff', zIndex: 1 }}>
                  {readOnly ? (
                    <Tooltip title={item.detail} arrow placement="top">
                      <div style={{ maxWidth: '150px', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                        {item.detail}
                      </div>
                    </Tooltip>
                  ) : (
                    <TextField
                      variant="outlined"
                      size="small"
                      value={item.detail}
                      onChange={(e) => handleValueChange(item.id, 'detail', e.target.value)}
                      fullWidth
                      multiline
                      maxRows={3}
                      disabled={disableFeatureFields}
                    />
                  )}
                </TableCell>
                <TableCell sx={{ position: 'sticky', left: '400px', backgroundColor: '#fff', zIndex: 1 }}>
                  {readOnly ? (
                    <Tooltip title={item.description} arrow placement="top">
                      <div style={{ maxWidth: '150px', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                        {item.description}
                      </div>
                    </Tooltip>
                  ) : (
                    <TextField
                      variant="outlined"
                      size="small"
                      value={item.description}
                      onChange={(e) => handleValueChange(item.id, 'description', e.target.value)}
                      fullWidth
                      multiline
                      maxRows={3}
                      disabled={disableFeatureFields}
                    />
                  )}
                </TableCell>
                <TableCell sx={{ position: 'sticky', left: '650px', backgroundColor: '#fff', zIndex: 1 }}>
                  {readOnly ? (
                    <Tooltip title={item.note} arrow placement="top">
                      <div style={{ maxWidth: '150px', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                        {item.note}
                      </div>
                    </Tooltip>
                  ) : (
                    <TextField
                      variant="outlined"
                      size="small"
                      value={item.note}
                      onChange={(e) => handleValueChange(item.id, 'note', e.target.value)}
                      fullWidth
                      multiline
                      maxRows={3}
                      disabled={disableFeatureFields}
                    />
                  )}
                </TableCell>
                <TableCell align="right">
                  {readOnly ? (
                    item.frontendEffort
                  ) : (
                    <TextField
                      variant="outlined"
                      size="small"
                      type="number"
                      value={item.frontendEffort}
                      onChange={(e) => handleValueChange(item.id, 'frontendEffort', Number(e.target.value))}
                      inputProps={{ min: 0 }}
                      sx={{ 
                        width: '50px',
                        '& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button': {
                          '-webkit-appearance': 'none',
                          margin: 0,
                        },
                        '& input[type=number]': {
                          '-moz-appearance': 'textfield',
                        },
                      }}
                    />
                  )}
                </TableCell>
                <TableCell align="right">
                  {readOnly ? (
                    item.backendEffort
                  ) : (
                    <TextField
                      variant="outlined"
                      size="small"
                      type="number"
                      value={item.backendEffort}
                      onChange={(e) => handleValueChange(item.id, 'backendEffort', Number(e.target.value))}
                      inputProps={{ min: 0 }}
                      sx={{ 
                        width: '50px',
                        '& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button': {
                          '-webkit-appearance': 'none',
                          margin: 0,
                        },
                        '& input[type=number]': {
                          '-moz-appearance': 'textfield',
                        },
                      }}
                    />
                  )}
                </TableCell>
                <TableCell align="right">
                  {readOnly ? (
                    item.qcEffort
                  ) : (
                    <TextField
                      variant="outlined"
                      size="small"
                      type="number"
                      value={item.qcEffort}
                      onChange={(e) => handleValueChange(item.id, 'qcEffort', Number(e.target.value))}
                      inputProps={{ min: 0 }}
                      sx={{ 
                        width: '50px',
                        '& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button': {
                          '-webkit-appearance': 'none',
                          margin: 0,
                        },
                        '& input[type=number]': {
                          '-moz-appearance': 'textfield',
                        },
                      }}
                    />
                  )}
                </TableCell>
                <TableCell align="right">
                  {readOnly ? (
                    item.pmEffort
                  ) : (
                    <TextField
                      variant="outlined"
                      size="small"
                      type="number"
                      value={item.pmEffort}
                      onChange={(e) => handleValueChange(item.id, 'pmEffort', Number(e.target.value))}
                      inputProps={{ min: 0 }}
                      sx={{ 
                        width: '50px',
                        '& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button': {
                          '-webkit-appearance': 'none',
                          margin: 0,
                        },
                        '& input[type=number]': {
                          '-moz-appearance': 'textfield',
                        },
                      }}
                    />
                  )}
                </TableCell>
                <TableCell align="right">
                  <strong>{item.totalMD.toFixed(1)}</strong>
                </TableCell>
                <TableCell align="right">
                  <strong>{item.totalMM.toFixed(2)}</strong>
                </TableCell>
                {!readOnly && (
                  <TableCell align="center">
                    <IconButton 
                      size="small" 
                      color="error" 
                      onClick={() => handleDeleteRow(item.id)}
                      disabled={tableItems.length <= 1}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                )}
              </TableRow>
            ))}
            
            {/* Totals row */}
            <TableRow sx={{ backgroundColor: 'action.hover' }}>
              <TableCell sx={{ position: 'sticky', left: 0, backgroundColor: '#f5f5f5', zIndex: 1 }}></TableCell>
              <TableCell sx={{ position: 'sticky', left: '50px', backgroundColor: '#f5f5f5', zIndex: 1 }}></TableCell>
              <TableCell sx={{ position: 'sticky', left: '200px', backgroundColor: '#f5f5f5', zIndex: 1 }}></TableCell>
              <TableCell sx={{ position: 'sticky', left: '400px', backgroundColor: '#f5f5f5', zIndex: 1 }}></TableCell>
              <TableCell sx={{ position: 'sticky', left: '650px', backgroundColor: '#f5f5f5', zIndex: 1 }} align="right">
                <strong>Tổng</strong>
              </TableCell>
              <TableCell align="right"><strong>{totalFE.toFixed(1)}</strong></TableCell>
              <TableCell align="right"><strong>{totalBE.toFixed(1)}</strong></TableCell>
              <TableCell align="right"><strong>{totalQC.toFixed(1)}</strong></TableCell>
              <TableCell align="right"><strong>{totalPM.toFixed(1)}</strong></TableCell>
              <TableCell align="right"><strong>{totalMD.toFixed(1)}</strong></TableCell>
              <TableCell align="right"><strong>{totalMM.toFixed(2)}</strong></TableCell>
              {!readOnly && <TableCell />}
            </TableRow>
          </TableBody>
          </Table>
        </TableContainer>
      </Box>
      
      <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
        <Typography variant="body2">
          <strong>Tổng MD:</strong> {totalMD.toFixed(1)}
        </Typography>
        <Typography variant="body2">
          <strong>Tổng MM:</strong> {totalMM.toFixed(2)}
        </Typography>
        <Typography variant="body2">
          <strong>Tổng tiền:</strong> {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalMD * 500000)}
        </Typography>
      </Box>
    </Box>
  );
};

export default EstimationTable;
