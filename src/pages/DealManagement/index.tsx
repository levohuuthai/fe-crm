import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { Box, Typography, Button, Paper, Dialog, DialogTitle, DialogContent, DialogActions, Tabs, Tab, Badge, Chip } from '@mui/material';
import { 
  Add as AddIcon, 
  FilterList as FilterListIcon, 
  Notifications as NotificationsIcon,
  SmartToy as SmartToyIcon 
} from '@mui/icons-material';
import { Deal, DealStage, DealFilters as DealFiltersType } from './components/DealTypes';
import SmartFilter from './components/SmartFilter';
import DealList from './components/DealList';
import DealFilters from './components/DealFilters';
import DealForm from './components/DealForm';
import DealStats from './components/DealStats';
import DealReminders from './components/DealReminders';

// Tạo dữ liệu giả
const createFakeDeals = (count: number): Deal[] => {
  const stages = Object.values(DealStage);
  const owners = ['Nguyễn Văn A', 'Trần Thị B', 'Lê Văn C', 'Phạm Thị D'];
  
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    name: `Deal ${i + 1}`,
    customer: `Công ty ${String.fromCharCode(65 + (i % 5))}`,
    stage: stages[Math.floor(Math.random() * stages.length)],
    value: Math.floor(Math.random() * 100000000) + 10000000, // 10M - 110M
    deadline: new Date(Date.now() + Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString(),
    owner: owners[Math.floor(Math.random() * owners.length)],
    notes: `Ghi chú cho deal ${i + 1}`,
    createdAt: new Date().toISOString(),
    hasReminder: Math.random() > 0.5,
    reminderNote: Math.random() > 0.7 ? `Nhắc nhở cho deal ${i + 1}` : undefined,
    reminderDate: Math.random() > 0.7 ? new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString() : undefined,
    reminderRecipient: Math.random() > 0.7 ? `email${i + 1}@example.com` : undefined
  }));
};

const DealManagement: React.FC = () => {
  // Khởi tạo dữ liệu giả
  const [deals, setDeals] = useState<Deal[]>(() => createFakeDeals(20));
  
  // State cho bộ lọc
  const [filters, setFilters] = useState<DealFiltersType>({
    searchTerm: '',
    stage: 'Tất cả',
    owner: 'Tất cả',
    dateRange: null,
    hasReminder: null,
    valueRange: { min: 0, max: 1000000000 }
  });
  
  // Lọc deals dựa trên filters
  const filteredDeals = useMemo(() => {
    return deals.filter(deal => {
      // Lọc theo searchTerm
      const matchesSearch = !filters.searchTerm || 
        deal.name.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        deal.customer.toLowerCase().includes(filters.searchTerm.toLowerCase());
      
      // Lọc theo stage
      const matchesStage = filters.stage === 'Tất cả' || deal.stage === filters.stage;
      
      // Lọc theo owner
      const matchesOwner = filters.owner === 'Tất cả' || deal.owner === filters.owner;
      
      // Lọc theo khoảng giá trị
      const matchesValue = deal.value >= (filters.valueRange?.min || 0) && 
                         deal.value <= (filters.valueRange?.max || Number.MAX_SAFE_INTEGER);
      
      // Lọc theo ngày
      let matchesDate = true;
      if (filters.dateRange?.start) {
        const startDate = new Date(filters.dateRange.start);
        startDate.setHours(0, 0, 0, 0);
        const dealDate = new Date(deal.deadline);
        dealDate.setHours(0, 0, 0, 0);
        matchesDate = dealDate >= startDate;
      }
      
      // Lọc theo nhắc nhở
      const matchesReminder = filters.hasReminder === null || 
                            (filters.hasReminder ? deal.hasReminder : !deal.hasReminder);
      
      return matchesSearch && matchesStage && matchesOwner && matchesValue && matchesDate && matchesReminder;
    });
  }, [deals, filters]);
  
  // Xử lý thay đổi bộ lọc
  const handleFilterChange = (newFilters: DealFiltersType) => {
    setFilters(newFilters);
  };
  
  // Xử lý đặt lại bộ lọc
  const handleResetFilters = () => {
    setFilters({
      searchTerm: '',
      stage: 'Tất cả',
      owner: 'Tất cả',
      dateRange: null,
      hasReminder: null,
      valueRange: { min: 0, max: 1000000000 }
    });
  };

  // State cho form thêm/sửa deal
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingDeal, setEditingDeal] = useState<Deal | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [dealToDelete, setDealToDelete] = useState<number | null>(null);
  
  // State cho tab hiện tại
  const [currentTab, setCurrentTab] = useState(0);
  const [remindersCount, setRemindersCount] = useState(0);
  const [smartFilterOpen, setSmartFilterOpen] = useState(false);
  const [currentFilter, setCurrentFilter] = useState('');
  
  // Xử lý chuyển tab
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
  };
  
  // Tính toán số lượng nhắc việc
  const calculateRemindersCount = useCallback((deals: Deal[]): number => {
    const now = new Date();
    return deals.filter(deal => {
      if (!deal.deadline && !deal.reminderDate) return false;
      
      const deadlineDate = deal.deadline ? new Date(deal.deadline) : null;
      const reminderDate = deal.reminderDate ? new Date(deal.reminderDate) : null;
      
      const daysUntilDeadline = deadlineDate ? Math.ceil((deadlineDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)) : Infinity;
      const daysUntilReminder = reminderDate ? Math.ceil((reminderDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)) : Infinity;
      
      return (
        ((daysUntilDeadline >= 0 && daysUntilDeadline <= 7) || 
         (daysUntilReminder >= 0 && daysUntilReminder <= 7)) && 
        deal.stage !== DealStage.CLOSED_WON && 
        deal.stage !== DealStage.CLOSED_LOST
      );
    }).length;
  }, []);

  // Cập nhật số lượng nhắc việc khi danh sách deals thay đổi
  useEffect(() => {
    const count = calculateRemindersCount(deals);
    setRemindersCount(count);
  }, [deals, calculateRemindersCount]);

  // Xử lý mở form thêm mới
  const handleAddNewDeal = () => {
    setEditingDeal(null);
    setIsFormOpen(true);
  };

  // Xử lý mở form chỉnh sửa
  const handleEditDeal = (deal: Deal) => {
    setEditingDeal(deal);
    setIsFormOpen(true);
  };

  // Xử lý xác nhận xóa
  const handleDeleteDeal = (dealId: number) => {
    setDealToDelete(dealId);
    setDeleteConfirmOpen(true);
  };

  // Xử lý xóa deal
  const handleConfirmDelete = () => {
    if (dealToDelete) {
      setDeals((prevDeals: Deal[]) => prevDeals.filter((deal: Deal) => deal.id !== dealToDelete));
      setDeleteConfirmOpen(false);
      setDealToDelete(null);
    }
  };

  // Xử lý thay đổi trạng thái deal
  const handleStageChange = (dealId: number, newStage: DealStage) => {
    setDeals(prevDeals => 
      prevDeals.map(deal => 
        deal.id === dealId
          ? { ...deal, stage: newStage }
          : deal
      )
    );
  };

  // Xử lý nhân bản deal
  const handleDuplicateDeal = (deal: Deal) => {
    const newDeal: Deal = {
      ...deal,
      id: Math.max(0, ...deals.map(d => d.id)) + 1,
      name: `${deal.name} (Bản sao)`,
      createdAt: new Date().toISOString()
    };
    setDeals((prevDeals: Deal[]) => [...prevDeals, newDeal]);
  };

  // Xử lý gửi form
  const handleSubmitDeal = (formData: any) => {
    if (editingDeal) {
      // Cập nhật deal
      setDeals((prevDeals: Deal[]) => 
        prevDeals.map((deal: Deal) => 
          deal.id === editingDeal.id 
            ? { ...deal, ...formData, id: editingDeal.id, createdAt: editingDeal.createdAt } as Deal
            : deal
        )
      );
    } else {
      // Thêm deal mới
      const newDeal: Deal = {
        ...formData,
        id: Math.max(0, ...deals.map(d => d.id)) + 1,
        createdAt: new Date().toISOString(),
        hasReminder: !!formData.reminderDate
      } as Deal;
      setDeals((prevDeals: Deal[]) => [...prevDeals, newDeal]);
    }
    setIsFormOpen(false);
  };

  // Xử lý đóng form
  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingDeal(null);
  };

  // Xử lý xem chi tiết deal
  const handleViewDeal = (deal: Deal | number) => {
    if (typeof deal === 'number') {
      const foundDeal = deals.find(d => d.id === deal);
      if (foundDeal) {
        console.log('Xem chi tiết deal:', foundDeal);
        // Có thể mở dialog chi tiết ở đây nếu cần
      }
    } else {
      console.log('Xem chi tiết deal:', deal);
      // Có thể mở dialog chi tiết ở đây nếu cần
    }
  };

  // Xử lý mở/đóng bộ lọc thông minh
  const handleSmartFilterOpen = () => setSmartFilterOpen(true);
  const handleSmartFilterClose = () => setSmartFilterOpen(false);

  // Xử lý áp dụng bộ lọc thông minh
  const handleApplySmartFilter = (query: string) => {
    setCurrentFilter(query);
    // TODO: Thêm logic xử lý query và cập nhật filteredDeals
    console.log('Áp dụng bộ lọc thông minh:', query);
  };

  // Xóa bộ lọc hiện tại
  const handleClearFilter = () => {
    setCurrentFilter('');
    // TODO: Đặt lại bộ lọc về mặc định
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Quản lý Deal
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleAddNewDeal}
        >
          Thêm Deal
        </Button>
      </Box>
      
      {/* Thống kê tổng quan */}
      <Box sx={{ mb: 3 }}>
        <DealStats deals={deals} />
      </Box>

      {/* Bộ lọc */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" component="div">
            <FilterListIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
            Bộ lọc
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button 
              variant="text" 
              size="small"
              onClick={handleResetFilters}
              startIcon={<FilterListIcon />}
            >
              Đặt lại bộ lọc
            </Button>
            <Button 
              variant="outlined"
              size="small"
              startIcon={<SmartToyIcon />}
              onClick={handleSmartFilterOpen}
            >
              Lọc thông minh
            </Button>
          </Box>
        </Box>
        
        <DealFilters 
          onFilterChange={handleFilterChange}
          initialFilters={filters}
        />
      </Paper>
      
      {/* Tab điều hướng */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
        <Tabs value={currentTab} onChange={handleTabChange} aria-label="deal tabs">
          <Tab label={`Tất cả Deal (${filteredDeals.length})`} />
          <Tab 
            label={
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Badge 
                  badgeContent={remindersCount} 
                  color="error" 
                  overlap="circular"
                  sx={{ mr: 1 }}
                >
                  <NotificationsIcon />
                </Badge>
                <Box component="span">Nhắc việc</Box>
              </Box>
            } 
          />
        </Tabs>
      </Box>
      
      {currentFilter && (
        <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              Đang lọc:
            </Typography>
            <Chip 
              label={currentFilter} 
              onDelete={handleClearFilter}
              color="primary"
              variant="outlined"
              size="small"
              sx={{ ml: 1 }}
            />
          </Box>
          <Button 
            size="small" 
            onClick={handleClearFilter}
            color="inherit"
          >
            Xóa bộ lọc
          </Button>
        </Box>
      )}

      {/* Hiển thị DealReminders hoặc DealList dựa trên tab hiện tại */}
      {currentTab === 0 ? (
        <>
          {/* Hiển thị số lượng kết quả */}
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Tìm thấy {filteredDeals.length} deal phù hợp
          </Typography>
          
          {/* Danh sách deal */}
          <DealList 
            deals={filteredDeals}
            onView={handleViewDeal}
            onEdit={handleEditDeal}
            onDelete={handleDeleteDeal}
            onDuplicate={handleDuplicateDeal}
          />
        </>
      ) : (
        /* Tab nhắc việc */
        <DealReminders
          deals={deals}
          onViewDeal={handleViewDeal}
          onEditDeal={(dealId) => {
            const deal = deals.find(d => d.id === dealId);
            if (deal) {
              handleEditDeal(deal);
            }
          }}
          onMarkComplete={(dealId) => {
            // Đánh dấu nhắc việc đã hoàn thành
            setDeals(prevDeals => 
              prevDeals.map(deal => 
                deal.id === dealId 
                  ? { ...deal, reminderCompleted: true } 
                  : deal
              )
            );
          }}
          onStageChange={handleStageChange}
        />
      )}

      {/* Form thêm/sửa deal */}
      <DealForm
        open={isFormOpen}
        onClose={handleCloseForm}
        onSubmit={handleSubmitDeal}
        initialData={editingDeal || undefined}
        title={editingDeal ? 'Chỉnh sửa Deal' : 'Thêm Deal mới'}
      />

      {/* Dialog bộ lọc thông minh */}
      <SmartFilter
        open={smartFilterOpen}
        onClose={handleSmartFilterClose}
        onApplyFilter={handleApplySmartFilter}
        currentFilter={currentFilter}
      />

      {/* Dialog xác nhận xóa */}
      <Dialog
        open={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
      >
        <DialogTitle>Xác nhận xóa</DialogTitle>
        <DialogContent>
          <Typography>Bạn có chắc chắn muốn xóa deal này không?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmOpen(false)}>Hủy</Button>
          <Button 
            onClick={handleConfirmDelete} 
            color="error"
            variant="contained"
          >
            Xóa
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DealManagement;
