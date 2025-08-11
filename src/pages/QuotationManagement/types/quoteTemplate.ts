// Các kiểu dữ liệu chung
export type EstimationMode = 'fixed' | 'timeAndMaterial';

export interface BaseEstimationConfig {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  isDefault: boolean;
}

// Kiểu dữ liệu cho chế độ Fix Price
export interface EffortColumn {
  id: string;
  name: string;
  key: string;
  order: number;
  isFixed?: boolean; // Các cột cố định không thể xóa
  color?: string; // Màu sắc cho cột (tuỳ chọn)
  isEffort?: boolean; // Đánh dấu cột là cột effort (nhập số và tính vào tổng)
}

export interface FixedPriceEstimationConfig extends BaseEstimationConfig {
  type: 'fixed';
  columns: EffortColumn[];
  // Có thể thêm các trường khác nếu cần
}

// Kiểu dữ liệu cho chế độ T&M
export interface TimeAndMaterialRate {
  id: string;
  role: string;
  rate: number;
  unit: 'hour' | 'day';
  description?: string;
}

export interface TimeAndMaterialConfig extends BaseEstimationConfig {
  type: 'timeAndMaterial';
  rates: TimeAndMaterialRate[];
}

export type EstimationConfig = FixedPriceEstimationConfig | TimeAndMaterialConfig;

// Kiểu dữ liệu cho dữ liệu bảng ước tính
export interface EstimationRow {
  id: string;
  feature: string;
  detail?: string;
  description?: string;
  notes?: string;
  itReq?: string;
  uxUi?: string;
  efforts: Record<string, number>; // key là EffortColumn.key, value là giá trị effort
}

export interface EstimationTableData {
  mode: EstimationMode;
  configId?: string; // ID của config đang sử dụng
  rows: EstimationRow[];
  // Các trường khác nếu cần
}
// Các kiểu dữ liệu cũ
export interface QuoteTemplate {
  id: string;
  name: string;
  description?: string;
  type: 'customer' | 'internal';
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  placeholderCount: number;
  isDefault: boolean;
  extractedFields?: ExtractedField[];
  estimationConfig?: EstimationConfig; // Thêm cấu hình ước tính vào template
}

export interface ExtractedField {
  originalText: string;
  placeholder: string;
  type: string;
  description?: string;
  required: boolean;
  example?: string;
}

export type QuoteTemplateTab = 'templates' | 'quotes';

export interface UploadQuoteTemplateFormValues {
  name: string;
  description?: string;
  type: 'customer' | 'internal';
  file: File | null;
  extractedFields?: ExtractedField[];
}
