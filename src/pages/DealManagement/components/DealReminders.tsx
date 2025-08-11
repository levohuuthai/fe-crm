// Component hiển thị danh sách nhắc việc

import React, { useState, useMemo } from 'react';
import {
  Box,
  Card,
  CardHeader,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  IconButton,
  Tooltip,
  Divider,
  Badge,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControlLabel,
  Switch,
  useTheme,
  MenuItem,
  Select,
  SelectChangeEvent
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  NotificationsActive as NotificationsActiveIcon,
  Check as CheckIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  MoreVert as MoreVertIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import { format, isToday, isTomorrow, differenceInDays } from 'date-fns';
import { vi } from 'date-fns/locale';
import { Deal, DealStage } from './DealTypes';
import DealStageChip from './DealStageChip';

interface DealReminderItem extends Deal {
  daysUntilDeadline: number;
}

interface DealRemindersProps {
  deals: Deal[];
  onViewDeal: (dealId: number) => void;
  onEditDeal: (dealId: number) => void;
  onMarkComplete: (dealId: number) => void;
  onStageChange?: (dealId: number, newStage: DealStage) => void;
  onRemindersCountChange?: (count: number) => void;
}

/**
 * Component hiển thị danh sách nhắc việc cho các deal sắp đến hạn
 */
const DealReminders: React.FC<DealRemindersProps> = ({
  deals,
  onViewDeal,
  onEditDeal,
  onMarkComplete,
  onStageChange,
  onRemindersCountChange
}) => {
  const theme = useTheme();
  const [selectedReminder, setSelectedReminder] = useState<DealReminderItem | null>(null);
  const [reminderDialogOpen, setReminderDialogOpen] = useState(false);
  const [reminderNote, setReminderNote] = useState('');
  const [reminderCompleted, setReminderCompleted] = useState(false);

  // Lọc và sắp xếp các deal có nhắc việc hoặc đến hạn trong 7 ngày tới
  const reminders = useMemo(() => {
    const now = new Date();
    const reminderItems: DealReminderItem[] = deals
      .filter(deal => {
        // Lọc các deal có nhắc việc hoặc đến hạn trong 7 ngày tới
        if (!deal.deadline && !deal.reminderDate) return false;
        
        const deadlineDate = deal.deadline ? new Date(deal.deadline) : null;
        const reminderDate = deal.reminderDate ? new Date(deal.reminderDate) : null;
        
        // Tính số ngày còn lại đến hạn chốt
        const daysUntilDeadline = deadlineDate 
          ? differenceInDays(deadlineDate, now)
          : Infinity;
        
        // Tính số ngày còn lại đến ngày nhắc việc
        const daysUntilReminder = reminderDate
          ? differenceInDays(reminderDate, now)
          : Infinity;
        
        // Chỉ hiển thị các deal có hạn chốt hoặc nhắc việc trong 7 ngày tới
        // Và không hiển thị các deal đã đóng
        return (
          (daysUntilDeadline >= 0 && daysUntilDeadline <= 7) || 
          (daysUntilReminder >= 0 && daysUntilReminder <= 7)
        ) && 
        deal.stage !== DealStage.CLOSED_WON && 
        deal.stage !== DealStage.CLOSED_LOST;
      })
      .map(deal => {
        const deadlineDate = deal.deadline ? new Date(deal.deadline) : null;
        const daysUntilDeadline = deadlineDate 
          ? differenceInDays(deadlineDate, now)
          : Infinity;
        
        return {
          ...deal,
          daysUntilDeadline
        };
      });
    
    // Sắp xếp theo thứ tự ưu tiên: các deal gần đến hạn nhất lên đầu
    return reminderItems.sort((a, b) => a.daysUntilDeadline - b.daysUntilDeadline);
  }, [deals]);

  // Xử lý khi click vào một nhắc việc
  const handleReminderClick = (reminder: DealReminderItem) => {
    setSelectedReminder(reminder);
    setReminderNote(reminder.reminderNote || '');
    setReminderCompleted(false);
    setReminderDialogOpen(true);
  };

  // Đóng dialog chi tiết nhắc việc
  const handleCloseDialog = () => {
    setReminderDialogOpen(false);
    setSelectedReminder(null);
  };

  // Đánh dấu hoàn thành nhắc việc
  const handleMarkComplete = () => {
    if (selectedReminder) {
      onMarkComplete(selectedReminder.id);
      handleCloseDialog();
    }
  };

  // Hiển thị ngày tháng theo định dạng phù hợp
  const formatDate = (date: Date | null | string): string => {
    if (!date) return '';
    
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    
    if (isToday(dateObj)) {
      return 'Hôm nay';
    } else if (isTomorrow(dateObj)) {
      return 'Ngày mai';
    } else {
      return format(dateObj, 'dd/MM/yyyy', { locale: vi });
    }
  };

  // Hiển thị thông báo khi không có nhắc việc nào
  if (reminders.length === 0) {
    return (
      <Card variant="outlined" sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <CardHeader
          title={
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <NotificationsIcon sx={{ mr: 1, color: theme.palette.text.secondary }} />
              <Typography variant="h6">Nhắc việc</Typography>
            </Box>
          }
        />
        <Divider />
        <CardContent sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Typography variant="body1" color="text.secondary" align="center">
            Không có nhắc việc nào trong 7 ngày tới
          </Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card variant="outlined" sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <CardHeader
          title={
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Badge badgeContent={reminders.length} color="error" sx={{ mr: 1 }}>
                <NotificationsActiveIcon color="primary" />
              </Badge>
              <Typography variant="h6">Nhắc việc</Typography>
            </Box>
          }
          action={
            <Tooltip title="Xem tất cả nhắc việc">
              <IconButton size="small">
                <MoreVertIcon />
              </IconButton>
            </Tooltip>
          }
        />
        <Divider />
        <CardContent sx={{ p: 0, flexGrow: 1, overflow: 'auto', maxHeight: 400 }}>
          <List disablePadding>
            {reminders.map((reminder, index) => {
              const isUrgent = reminder.daysUntilDeadline <= 2;
              
              return (
                <React.Fragment key={reminder.id}>
                  {index > 0 && <Divider />}
                  <ListItem
                    component="div"
                    onClick={() => handleReminderClick(reminder)}
                    sx={{
                      py: 1.5,
                      backgroundColor: isUrgent ? 'error.50' : 'inherit',
                      cursor: 'pointer',
                      '&:hover': {
                        backgroundColor: isUrgent ? 'error.100' : 'action.hover',
                      }
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 40 }}>
                      <NotificationsIcon 
                        color={isUrgent ? "error" : "action"} 
                        sx={{ animation: isUrgent ? 'pulse 1.5s infinite' : 'none' }}
                      />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography variant="body1" noWrap>
                          {reminder.name}
                        </Typography>
                      }
                      secondary={
                        <Box sx={{ display: 'flex', flexDirection: 'column', mt: 0.5 }}>
                          <Typography variant="body2" color="text.secondary" noWrap>
                            {reminder.customer}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5, flexWrap: 'wrap', gap: 0.5 }}>
                            <Chip 
                              label={
                                <Typography variant="caption">
                                  Hạn chốt: {formatDate(reminder.deadline)}
                                </Typography>
                              }
                              size="small"
                              color={isUrgent ? "error" : "default"}
                              variant="outlined"
                            />
                          </Box>
                        </Box>
                      }
                      primaryTypographyProps={{ variant: 'body1' }}
                      secondaryTypographyProps={{ component: 'div' }}
                    />
                    <ListItemSecondaryAction sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Select
                        value={reminder.stage}
                        onChange={(e: SelectChangeEvent<DealStage>) => {
                          if (onStageChange) {
                            onStageChange(reminder.id, e.target.value as DealStage);
                          }
                        }}
                        size="small"
                        sx={{ 
                          minWidth: 150,
                          '& .MuiSelect-select': { 
                            py: 0.5,
                            display: 'flex',
                            alignItems: 'center'
                          }
                        }}
                        renderValue={(selected) => (
                          <DealStageChip 
                            stage={selected as DealStage} 
                            size="small" 
                            showTooltip={false} 
                          />
                        )}
                      >
                        {Object.values(DealStage).map((stage) => (
                          <MenuItem key={stage} value={stage}>
                            <DealStageChip stage={stage} size="small" showTooltip={false} />
                            <Box component="span" sx={{ ml: 1 }}>
                              {stage}
                            </Box>
                          </MenuItem>
                        ))}
                      </Select>
                    </ListItemSecondaryAction>
                  </ListItem>
                </React.Fragment>
              );
            })}
          </List>
        </CardContent>
      </Card>

      {/* Dialog hiển thị chi tiết nhắc việc */}
      <Dialog
        open={reminderDialogOpen}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 2 }
        }}
      >
        {selectedReminder && (
          <>
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
              <Typography variant="h6">Chi tiết nhắc việc</Typography>
              <IconButton onClick={handleCloseDialog} size="small">
                <CloseIcon />
              </IconButton>
            </DialogTitle>
            
            <Divider />
            
            <DialogContent sx={{ py: 2 }}>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle1" fontWeight="bold">
                  {selectedReminder.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Khách hàng: {selectedReminder.customer}
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                <DealStageChip stage={selectedReminder.stage} />
                <Chip 
                  label={`Giá trị: ${selectedReminder.value.toLocaleString('vi-VN')} VND`}
                  variant="outlined"
                />
              </Box>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2">
                  <strong>Hạn chốt:</strong> {formatDate(selectedReminder.deadline)}
                  {selectedReminder.daysUntilDeadline <= 3 && (
                    <Chip 
                      label={`Còn ${selectedReminder.daysUntilDeadline} ngày`}
                      color="error"
                      size="small"
                      sx={{ ml: 1 }}
                    />
                  )}
                </Typography>
              </Box>
              
              {selectedReminder.notes && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2">
                    <strong>Ghi chú:</strong>
                  </Typography>
                  <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                    {selectedReminder.notes}
                  </Typography>
                </Box>
              )}
              
              <Divider sx={{ my: 2 }} />
              
              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  Ghi chú nhắc việc:
                </Typography>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  value={reminderNote}
                  onChange={(e) => setReminderNote(e.target.value)}
                  placeholder="Thêm ghi chú cho nhắc việc này..."
                  variant="outlined"
                  size="small"
                />
              </Box>
              
              <Box sx={{ mt: 2 }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={reminderCompleted}
                      onChange={(e) => setReminderCompleted(e.target.checked)}
                    />
                  }
                  label="Đánh dấu đã hoàn thành"
                />
              </Box>
            </DialogContent>
            
            <Divider />
            
            <DialogActions sx={{ px: 3, py: 2 }}>
              <Button
                startIcon={<DeleteIcon />}
                color="inherit"
                onClick={handleCloseDialog}
              >
                Đóng
              </Button>
              
              <Button
                startIcon={<EditIcon />}
                variant="outlined"
                color="primary"
                onClick={() => {
                  onEditDeal(selectedReminder.id);
                  handleCloseDialog();
                }}
              >
                Chỉnh sửa Deal
              </Button>
              
              <Button
                startIcon={<CheckIcon />}
                variant="contained"
                color="primary"
                onClick={handleMarkComplete}
                disabled={!reminderCompleted}
              >
                Hoàn thành
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </>
  );
};

export default DealReminders;
