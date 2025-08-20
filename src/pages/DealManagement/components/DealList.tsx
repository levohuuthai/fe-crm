import React, { useState } from 'react';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
  Tooltip,
  Typography,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  MoreVert as MoreVertIcon,
  Visibility as VisibilityIcon,
  ContentCopy as ContentCopyIcon
} from '@mui/icons-material';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { Deal } from './DealTypes';
import DealStageChip from './DealStageChip';
import DealReminderBadge from './DealReminderBadge';
import { useTranslation } from 'react-i18next';

interface DealListProps {
  deals: Deal[];
  onEdit: (deal: Deal) => void;
  onDelete: (dealId: number) => void;
  onView: (deal: Deal) => void;
  onDuplicate: (deal: Deal) => void;
}

/**
 * Component hiển thị danh sách deal dạng bảng
 */
const DealList: React.FC<DealListProps> = ({ deals, onEdit, onDelete, onView, onDuplicate }) => {
  const { t } = useTranslation();
  // State cho phân trang
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // State cho menu thao tác
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);

  // Xử lý thay đổi trang
  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  // Xử lý thay đổi số hàng mỗi trang
  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Xử lý mở menu thao tác
  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>, deal: Deal) => {
    setAnchorEl(event.currentTarget);
    setSelectedDeal(deal);
  };

  // Xử lý đóng menu thao tác
  const handleCloseMenu = () => {
    setAnchorEl(null);
    setSelectedDeal(null);
  };

  // Định dạng số tiền
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0
    }).format(value);
  };

  // Định dạng ngày tháng
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd/MM/yyyy', { locale: vi });
    } catch (error) {
      return t('common.unknown');
    }
  };

  // Lấy deals hiển thị trên trang hiện tại
  const visibleDeals = deals.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden', mb: 3 }}>
      <TableContainer sx={{ maxHeight: 600 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              <TableCell>{t('pages.deals.columns.dealName')}</TableCell>
              <TableCell>{t('pages.deals.columns.customer')}</TableCell>
              <TableCell>{t('pages.deals.columns.owner')}</TableCell>
              <TableCell>{t('pages.deals.columns.amount')}</TableCell>
              <TableCell>{t('pages.deals.columns.stage')}</TableCell>
              <TableCell>{t('pages.deals.columns.createdAt')}</TableCell>
              <TableCell>{t('pages.deals.columns.deadline')}</TableCell>
              <TableCell align="center">{t('pages.deals.columns.actions')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {visibleDeals.length > 0 ? (
              visibleDeals.map((deal) => (
                <TableRow hover key={deal.id}>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {deal.name}
                      </Typography>
                      {deal.reminderDate && (
                        <DealReminderBadge 
                          deadline={deal.reminderDate} 
                          reminderNote={deal.reminderNote} 
                          size="small"
                        />
                      )}
                    </Box>
                    {deal.notes && (
                      <Typography variant="body2" color="text.secondary" noWrap sx={{ maxWidth: 250 }}>
                        {deal.notes}
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell>{deal.customer}</TableCell>
                  <TableCell>{deal.owner || t('common.unknown')}</TableCell>
                  <TableCell>{formatCurrency(deal.value)}</TableCell>
                  <TableCell>
                    <DealStageChip stage={deal.stage} size="small" showTooltip />
                  </TableCell>
                  <TableCell>{formatDate(deal.createdAt)}</TableCell>
                  <TableCell>
                    {deal.deadline ? formatDate(deal.deadline) : '-'}
                  </TableCell>
                  <TableCell align="center">
                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                      <Tooltip title={t('common.edit')}>
                        <IconButton size="small" onClick={() => onEdit(deal)}>
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title={t('common.viewDetails')}>
                        <IconButton size="small" onClick={() => onView(deal)}>
                          <VisibilityIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <IconButton size="small" onClick={(e) => handleOpenMenu(e, deal)}>
                        <MoreVertIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  <Typography variant="body1" sx={{ py: 2 }}>
                    {t('pages.deals.empty')}
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
        count={deals.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        labelRowsPerPage={t('pages.deals.pagination.rowsPerPage')}
        labelDisplayedRows={({ from, to, count }) =>
          t('pages.deals.pagination.displayedRows', { from, to, count })
        }
      />

      {/* Menu thao tác */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleCloseMenu}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuItem onClick={() => {
          if (selectedDeal) onDuplicate(selectedDeal);
          handleCloseMenu();
        }}>
          <ListItemIcon>
            <ContentCopyIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>{t('pages.deals.ui.contextMenu.duplicate')}</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => {
          if (selectedDeal) onDelete(selectedDeal.id);
          handleCloseMenu();
        }}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText sx={{ color: 'error.main' }}>{t('pages.deals.ui.contextMenu.delete')}</ListItemText>
        </MenuItem>
      </Menu>
    </Paper>
  );
};

export default DealList;
