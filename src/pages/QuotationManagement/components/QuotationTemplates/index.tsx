import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Add as AddIcon,
  Visibility as VisibilityIcon,
  Delete as DeleteIcon,
  FileDownload as FileDownloadIcon,
} from '@mui/icons-material';
import { QuoteTemplate } from '../../types/quoteTemplate';

interface QuotationTemplatesProps {
  templates: QuoteTemplate[];
  loading: boolean;
  onUploadClick: () => void;
  onViewTemplate?: (templateId: string) => void;
  onDeleteTemplate?: (templateId: string) => void;
  onDownloadTemplate?: (templateId: string) => void;
}

const QuotationTemplates: React.FC<QuotationTemplatesProps> = ({
  templates,
  loading,
  onUploadClick,
  onViewTemplate,
  onDeleteTemplate,
  onDownloadTemplate,
}) => {
  return (
    <Paper sx={{ p: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h6">Mẫu báo giá</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={onUploadClick}
        >
          Tải lên mẫu báo giá
        </Button>
      </Box>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Tên mẫu</TableCell>
              <TableCell>Mô tả</TableCell>
              <TableCell>Loại</TableCell>
              <TableCell>Trạng thái</TableCell>
              <TableCell>Ngày tạo</TableCell>
              <TableCell>Người tạo</TableCell>
              <TableCell>Số trường</TableCell>
              <TableCell align="center">Thao tác</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  Đang tải...
                </TableCell>
              </TableRow>
            ) : templates.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  Chưa có mẫu báo giá nào. Hãy tải lên mẫu báo giá đầu tiên của bạn!
                </TableCell>
              </TableRow>
            ) : (
              templates.map((template) => (
                <TableRow key={template.id}>
                  <TableCell>{template.name}</TableCell>
                  <TableCell>{template.description || '-'}</TableCell>
                  <TableCell>
                    {template.type === 'customer' ? 'Khách hàng' : 'Nội bộ'}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={template.status === 'active' ? 'Đang sử dụng' : 'Không sử dụng'}
                      color={template.status === 'active' ? 'success' : 'default'}
                      size="small"
                    />
                    {template.isDefault && (
                      <Chip
                        label="Mặc định"
                        color="primary"
                        size="small"
                        sx={{ ml: 1 }}
                      />
                    )}
                  </TableCell>
                  <TableCell>
                    {new Date(template.createdAt).toLocaleDateString('vi-VN')}
                  </TableCell>
                  <TableCell>{template.createdBy}</TableCell>
                  <TableCell>{template.placeholderCount}</TableCell>
                  <TableCell align="center">
                    <Box>
                      {onViewTemplate && (
                        <Tooltip title="Xem chi tiết">
                          <IconButton
                            size="small"
                            onClick={() => onViewTemplate(template.id)}
                          >
                            <VisibilityIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}
                      {onDownloadTemplate && (
                        <Tooltip title="Tải xuống">
                          <IconButton
                            size="small"
                            onClick={() => onDownloadTemplate(template.id)}
                          >
                            <FileDownloadIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}
                      {onDeleteTemplate && (
                        <Tooltip title="Xóa">
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => onDeleteTemplate(template.id)}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default QuotationTemplates;
