export interface ExtractedField {
  originalText: string;
  placeholder: string;
  type: string;
  description?: string;
}

export interface UploadTemplateFormValues {
  name: string;
  description: string;
  type: 'internal' | 'customer';
  file: File | null;
  extractedFields: ExtractedField[];
}

export interface UploadTemplateProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: UploadTemplateFormValues) => Promise<void>;
}
