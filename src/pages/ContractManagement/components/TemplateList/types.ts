export interface Template {
  id: string;
  name: string;
  type: 'internal' | 'customer' | 'AI';
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  placeholderCount: number;
  isDefault: boolean;
  status: 'active' | 'inactive';
  content?: string; // Contract content
}

export interface TemplateFilterValues {
  search: string;
  type: 'all' | 'internal' | 'customer' | 'AI';
  status: 'all' | 'active' | 'inactive';
}

export interface TemplateListProps {
  onUploadClick: () => void;
  onUploadTemplate: () => void;
  onViewTemplate: (id: string) => void;
  onEditTemplate: (id: string) => void;
  onSetDefault: (id: string) => void;
  onDeleteTemplate: (id: string) => void;
}
