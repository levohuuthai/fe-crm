export type QuotationStatus = 'draft' | 'sent' | 'approved' | 'rejected';

export interface QuotationItem {
  id: number;
  feature: string;
  detail: string;
  description: string;
  note: string;
  frontendEffort: number;
  backendEffort: number;
  qcEffort: number;
  pmEffort: number;
  totalMD: number;
  totalMM: number;
}

export interface QuotationItem {
  id: number;
  feature: string;
  detail: string;
  description: string;
  note: string;
  frontendEffort: number;
  backendEffort: number;
  qcEffort: number;
  pmEffort: number;
  totalMD: number;
  totalMM: number;
  // Additional fields for rate calculation
  rate?: number;
}

export interface Quotation {
  id: number;
  name: string;
  customer: string;
  dealId: number;
  dealName: string;
  requirementId: number;
  requirementName: string;
  status: QuotationStatus;
  createdDate: string;
  note: string;
  items: QuotationItem[];
  totalEffort: number;
  totalAmount: number;
  executiveSummary?: string;
  // Các trường mới cho phép chỉnh sửa nội dung
  initialApproach?: string;
  workPackageDesc?: string;
  assumptionDesc?: string;
  outOfScopeDesc?: string;
  inputFromClientDesc?: string;
  referencedDocsDesc?: string;
  templateId?: string;
  templateName?: string;
  // Chế độ ước tính (fixed hoặc timeAndMaterial)
  estimationMode?: 'fixed' | 'timeAndMaterial';
  // Dữ liệu cấu hình ước tính
  estimationConfig?: any;
  // Additional fields for preview
  pages?: string[];
  paymentTerms?: string;
  // Alias for customer name
  customerName?: string;
  // Alias for project name
  projectName?: string;
  // Alias for quotation code
  code?: string;
  // Alias for createdDate
  createdAt?: string;
}

export interface QuotationFormProps {
  open: boolean;
  onClose: () => void;
  onSave: (quotation: Quotation) => void;
  customers: string[];
  deals: { id: number; name: string; customer: string }[];
  requirements: { id: number; name: string; dealId: number; features: any[] }[];
  templates: { id: string; name: string; type: 'customer' | 'internal' }[];
}

export interface QuotationDetailProps {
  open: boolean;
  onClose: () => void;
  quotation: Quotation | null;
}

export interface QuotationListProps {
  quotations: Quotation[];
  onViewDetail: (id: number) => void;
  onDownloadPdf: (id: number) => void;
  onSendEmail: (id: number) => void;
  page: number;
  rowsPerPage: number;
  onPageChange: (_: unknown, newPage: number) => void;
  onRowsPerPageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  totalCount: number;
}

export interface EstimationTableProps {
  items: QuotationItem[];
  onItemsChange: (items: QuotationItem[]) => void;
  readOnly?: boolean;
  disableFeatureFields?: boolean;
}

export interface QuotationPreviewProps {
  open: boolean;
  onClose: () => void;
  quotation: Quotation | null;
  onSaveDraft: (quotation: Quotation) => void;
  onExportPdf: (quotation: Quotation) => void;
  onEdit: () => void;
}
