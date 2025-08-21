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
import { useTranslation } from 'react-i18next';
import type { TFunction } from 'i18next';
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

const getStatusLabel = (status: string, t: (key: string, options?: any) => string) => {
  return t(`pages.requirements.detail.status.${status}`, { defaultValue: status });
};

const RequirementDetail: React.FC<RequirementDetailProps> = ({ open, onClose, requirement }) => {
  const { t } = useTranslation();
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
        {t('pages.requirements.detail.title', 'Requirement details')}
      </DialogTitle>
      <DialogContent dividers>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
            📌 {t('pages.requirements.detail.sections.basicInfo', 'Basic information')}
          </Typography>
          <Paper variant="outlined" sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
              <Box sx={{ width: { xs: '100%', sm: 'calc(50% - 8px)' } }}>
                <Typography variant="subtitle2" color="text.secondary">
                  {t('pages.requirements.detail.fields.name', 'Requirement name')}
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                  {requirement.name}
                </Typography>
              </Box>
              <Box sx={{ width: { xs: '100%', sm: 'calc(50% - 8px)' } }}>
                <Typography variant="subtitle2" color="text.secondary">
                  {t('pages.requirements.detail.fields.customer', 'Customer')}
                </Typography>
                <Typography variant="body1">
                  {requirement.customer}
                </Typography>
              </Box>
              <Box sx={{ width: { xs: '100%', sm: 'calc(50% - 8px)' } }}>
                <Typography variant="subtitle2" color="text.secondary">
                  {t('pages.requirements.detail.fields.assignee', 'Assignee')}
                </Typography>
                <Typography variant="body1">
                  {requirement.assignee}
                </Typography>
              </Box>
              <Box sx={{ width: { xs: '100%', sm: 'calc(50% - 8px)' } }}>
                <Typography variant="subtitle2" color="text.secondary">
                  {t('pages.requirements.detail.fields.status', 'Status')}
                </Typography>
                <Chip 
                  label={getStatusLabel(requirement.status, t)} 
                  color={getStatusColor(requirement.status) as "warning" | "info" | "success" | "default"}
                  size="small"
                />
              </Box>
              <Box sx={{ width: { xs: '100%', sm: 'calc(50% - 8px)' } }}>
                <Typography variant="subtitle2" color="text.secondary">
                  {t('pages.requirements.detail.fields.deadline', 'Expected deadline')}
                </Typography>
                <Typography variant="body1">
                  {requirement.expectedDeadline}
                </Typography>
              </Box>
              <Box sx={{ width: { xs: '100%', sm: 'calc(50% - 8px)' } }}>
                <Typography variant="subtitle2" color="text.secondary">
                  {t('pages.requirements.detail.fields.createdAt', 'Created at')}
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
            📝 {t('pages.requirements.detail.sections.description', 'Requirement description')}
          </Typography>
          <Paper variant="outlined" sx={{ p: 2 }}>
            <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
              {requirement.description || ''}
            </Typography>
          </Paper>
        </Box>

        <Divider sx={{ my: 3 }} />

        <Box>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main', mt: 4 }}>
            🤖 {t('pages.requirements.detail.sections.aiAnalysis', 'AI-generated requirement analysis')}
          </Typography>
          {requirement.features && requirement.features.length > 0 ? (
            <TableContainer component={Paper} variant="outlined">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>{t('pages.requirements.detail.table.headers.no', 'No.')}</TableCell>
                    <TableCell>{t('pages.requirements.detail.table.headers.feature', 'Feature')}</TableCell>
                    <TableCell>{t('pages.requirements.detail.table.headers.detail', 'Detail')}</TableCell>
                    <TableCell>{t('pages.requirements.detail.table.headers.description', 'Description')}</TableCell>
                    <TableCell>{t('pages.requirements.detail.table.headers.notes', 'Notes')}</TableCell>
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
                {t('pages.requirements.detail.empty.aiFeatures', 'No AI-generated features available.')}
              </Typography>
            </Paper>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>{t('pages.requirements.detail.buttons.close', 'Close')}</Button>
      </DialogActions>
    </Dialog>
  );
};

export default RequirementDetail;
