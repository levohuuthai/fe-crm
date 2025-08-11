// Types
export type Status = 'pending' | 'in_discussion' | 'confirmed';

export interface AIFeature {
  id: number;
  feature: string;
  detail: string;
  description: string;
  notes: string;
}

export interface NonFunctionalRequirement {
  id: number;
  key: string;
  value: string;
}

export interface TestRequirement {
  id: number;
  testCase: string;
  condition: string;
  expectedResult: string;
}

export interface UIMockup {
  id: number;
  description: string;
  imageUrl?: string;
  figmaLink?: string;
}

export interface DataModelEntity {
  id: number;
  entityName: string;
  fields: string;
  description?: string;
}

export interface IntegrationRequirement {
  id: number;
  system: string;
  method: string;
  purpose: string;
}

export interface Requirement {
  id: number;
  name: string;
  type?: string; // Loại Requirement: RFI, Bank, Industry, Client, Internal
  customer: string;
  assignee: string;
  source?: string; // Nguồn tạo: Nhập tay, AI sinh từ mô tả, AI sinh từ file upload
  status: Status;
  expectedDeadline: string;
  createdDate: string;
  description?: string;
  features?: AIFeature[];
}

// Props types
export interface DeleteConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  content?: string;
}

export interface AIProcessingDialogProps {
  open: boolean;
  progress: number;
  message: string;
}
