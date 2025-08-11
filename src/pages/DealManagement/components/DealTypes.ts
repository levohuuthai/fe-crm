// Định nghĩa các types cho module Deal Management

// Enum cho các giai đoạn deal
export enum DealStage {
  INITIAL_CONTACT = 'Liên hệ ban đầu',
  REQUIREMENT_RECORDED = 'Đã ghi nhận yêu cầu',
  QUOTE_SENT = 'Đã gửi báo giá',
  CONTRACT_SENT = 'Gửi hợp đồng',
  CLOSED_WON = 'Đã chốt',
  CLOSED_LOST = 'Đã huỷ'
}

// Màu sắc cho từng giai đoạn
export const STAGE_COLORS: Record<DealStage, string> = {
  [DealStage.INITIAL_CONTACT]: '#ff9800', // Cam nhạt
  [DealStage.REQUIREMENT_RECORDED]: '#fbc02d', // Vàng đậm
  [DealStage.QUOTE_SENT]: '#1976d2', // Xanh dương
  [DealStage.CONTRACT_SENT]: '#7b1fa2', // Tím
  [DealStage.CLOSED_WON]: '#4caf50', // Xanh lá
  [DealStage.CLOSED_LOST]: '#e53935' // Đỏ
};

// Trọng số cho từng giai đoạn (để tính giá trị deal có trọng số)
export const STAGE_WEIGHTS: Record<DealStage, number> = {
  [DealStage.INITIAL_CONTACT]: 0.1,
  [DealStage.REQUIREMENT_RECORDED]: 0.3,
  [DealStage.QUOTE_SENT]: 0.5,
  [DealStage.CONTRACT_SENT]: 0.7,
  [DealStage.CLOSED_WON]: 1.0,
  [DealStage.CLOSED_LOST]: 0.0
};

// Interface cho Deal
export interface Deal {
  id: number;
  name: string;
  customer: string;
  stage: DealStage;
  value: number;
  deadline: string; // ISO date string
  owner: string;
  notes?: string;
  createdAt: string; // ISO date string
  hasReminder: boolean;
  reminderNote?: string;
  reminderDate?: string; // ISO date string
  reminderRecipient?: string;
}

// Interface cho bộ lọc
export interface DealFilters {
  searchTerm: string;
  stage: DealStage | 'Tất cả';
  owner: string | 'Tất cả';
  dateRange: {
    start: Date | null;
    end: Date | null;
  } | null;
  hasReminder: boolean | null;
  valueRange: {
    min: number;
    max: number;
  };
}

// Interface cho các chỉ số tổng quan
export interface DealStats {
  totalDealAmount: number;
  weightedDealAmount: number;
  openDealAmount: number;
  closedDealAmount: number;
  newDealsThisMonth: number;
  averageDealAge: number; // Số ngày trung bình
}

// Interface cho form thêm/sửa deal
export interface DealFormData {
  name: string;
  customer: string;
  stage: DealStage;
  value: number;
  deadline: string;
  owner: string;
  notes: string;
  hasReminder: boolean;
  reminderNote?: string;
  reminderDate?: string;
  reminderRecipient?: string;
}
