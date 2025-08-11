import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Chip,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { Requirement, AIFeature } from '../../types';

interface RequirementDetailProps {
  open: boolean;
  onClose: () => void;
  requirement: Requirement | null;
}

const getStatusColor = (status: string) => {
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

const getStatusLabel = (status: string) => {
  switch (status) {
    case 'pending':
      return 'Pending';
    case 'in_discussion':
      return 'In Discussion';
    case 'confirmed':
      return 'Confirmed';
    default:
      return status;
  }
};

const RequirementDetail: React.FC<RequirementDetailProps> = ({ open, onClose, requirement }) => {
  if (!requirement) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{ sx: { maxHeight: '90vh' } }}
    >
      <DialogTitle sx={{ fontWeight: 'bold' }}>
        Chi tiết yêu cầu
      </DialogTitle>
      <DialogContent dividers>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
            📌 Thông tin cơ bản
          </Typography>
          <Paper variant="outlined" sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
              <Box sx={{ width: { xs: '100%', sm: 'calc(50% - 8px)' } }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Tên yêu cầu
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                  {requirement.name}
                </Typography>
              </Box>
              <Box sx={{ width: { xs: '100%', sm: 'calc(50% - 8px)' } }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Khách hàng
                </Typography>
                <Typography variant="body1">
                  {requirement.customer}
                </Typography>
              </Box>
              <Box sx={{ width: { xs: '100%', sm: 'calc(50% - 8px)' } }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Người phụ trách
                </Typography>
                <Typography variant="body1">
                  {requirement.assignee}
                </Typography>
              </Box>
              <Box sx={{ width: { xs: '100%', sm: 'calc(50% - 8px)' } }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Trạng thái
                </Typography>
                <Chip 
                  label={getStatusLabel(requirement.status)} 
                  color={getStatusColor(requirement.status) as "warning" | "info" | "success" | "default"}
                  size="small"
                />
              </Box>
              <Box sx={{ width: { xs: '100%', sm: 'calc(50% - 8px)' } }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Hạn dự kiến
                </Typography>
                <Typography variant="body1">
                  {requirement.expectedDeadline}
                </Typography>
              </Box>
              <Box sx={{ width: { xs: '100%', sm: 'calc(50% - 8px)' } }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Ngày tạo
                </Typography>
                <Typography variant="body1">
                  {requirement.createdDate}
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Box>

        <Divider sx={{ my: 3 }} />

        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main', mt: 4 }}>
            📝 Mô tả yêu cầu
          </Typography>
          <Paper variant="outlined" sx={{ p: 2 }}>
            <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
              {requirement.description || 'Chưa có mô tả.'}
            </Typography>
          </Paper>
        </Box>

        <Divider sx={{ my: 3 }} />

        <Box>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main', mt: 4 }}>
            🤖 Phân tích yêu cầu (tạo bởi AI)
          </Typography>
          {requirement.features && requirement.features.length > 0 ? (
            <TableContainer component={Paper} variant="outlined">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>STT</TableCell>
                    <TableCell>Tính năng</TableCell>
                    <TableCell>Chi tiết</TableCell>
                    <TableCell>Mô tả</TableCell>
                    <TableCell>Ghi chú</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {requirement.features.map((feature: AIFeature, index: number) => (
                    <TableRow key={index}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{feature.feature}</TableCell>
                      <TableCell>{feature.detail}</TableCell>
                      <TableCell sx={{ whiteSpace: 'pre-wrap' }}>{feature.description}</TableCell>
                      <TableCell sx={{ whiteSpace: 'pre-wrap' }}>{feature.notes}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Paper variant="outlined" sx={{ p: 2 }}>
              <Typography variant="body1" color="text.secondary">
                No AI-generated features available.
              </Typography>
            </Paper>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Đóng</Button>
      </DialogActions>
    </Dialog>
  );
};

export default RequirementDetail;
