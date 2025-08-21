import React from 'react';
import { useTranslation } from 'react-i18next';
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

const getStatusLabel = (t: (key: string) => string, status: Status) => {
  switch (status) {
    case 'pending':
      return t('pages.requirements.status.pending');
    case 'in_discussion':
      return t('pages.requirements.status.in_discussion');
    case 'confirmed':
      return t('pages.requirements.status.confirmed');
    default:
      return t('common.unknown');
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
  const { t } = useTranslation();
  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              <TableCell>{t('pages.requirements.list.columns.id')}</TableCell>
              <TableCell>{t('pages.requirements.list.columns.name')}</TableCell>
              <TableCell>{t('pages.requirements.list.columns.type')}</TableCell>
              <TableCell>{t('pages.requirements.list.columns.customer')}</TableCell>
              <TableCell>{t('pages.requirements.list.columns.assignee')}</TableCell>
              <TableCell>{t('pages.requirements.list.columns.source')}</TableCell>
              <TableCell>{t('pages.requirements.list.columns.createdDate')}</TableCell>
              <TableCell>{t('pages.requirements.list.columns.deadline')}</TableCell>
              <TableCell>{t('pages.requirements.list.columns.status')}</TableCell>
              <TableCell>{t('pages.requirements.list.columns.actions')}</TableCell>
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
                      label={getStatusLabel(t, req.status)} 
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
                  <Typography variant="body1">{t('pages.requirements.list.empty')}</Typography>
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
        labelRowsPerPage={t('pages.requirements.pagination.rowsPerPage')}
        labelDisplayedRows={({ from, to, count }) =>
          t('pages.requirements.pagination.displayedRows', { from, to, count })
        }
      />
    </Paper>
  );
};

export default RequirementList;
