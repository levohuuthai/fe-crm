import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper } from '@mui/material';
import TemplateFilters from './TemplateFilters';
import TemplateTable from './TemplateTable';
import AIContractGeneration from '../AIContractGeneration';
import { Template, TemplateFilterValues } from './types';

// Mock data for demonstration
const mockTemplates: Template[] = [
  {
    id: '1',
    name: 'Hợp đồng dịch vụ phần mềm',
    type: 'internal',
    createdAt: '2025-01-15T00:00:00.000Z',
    updatedAt: '2025-01-15T00:00:00.000Z',
    createdBy: 'Nguyễn Văn A',
    placeholderCount: 8,
    isDefault: true,
    status: 'active',
  },
  {
    id: '2',
    name: 'Hợp đồng bảo trì',
    type: 'customer',
    createdAt: '2025-02-20T00:00:00.000Z',
    updatedAt: '2025-02-20T00:00:00.000Z',
    createdBy: 'Trần Thị B',
    placeholderCount: 5,
    isDefault: false,
    status: 'active',
  },
  {
    id: '3',
    name: 'Hợp đồng NDA',
    type: 'internal',
    createdAt: '2025-03-10T00:00:00.000Z',
    updatedAt: '2025-03-10T00:00:00.000Z',
    createdBy: 'Lê Văn C',
    placeholderCount: 6,
    isDefault: false,
    status: 'inactive',
  },
];

interface TemplateListProps {
  onUploadClick: () => void;
  templates?: Template[];
  loading?: boolean;
}

const TemplateList: React.FC<TemplateListProps> = ({ 
  onUploadClick, 
  templates: propTemplates = [], 
  loading: propLoading = false 
}) => {
  const [filters, setFilters] = useState<TemplateFilterValues>({
    search: '',
    type: 'all',
    status: 'all',
  });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [aiModalOpen, setAIModalOpen] = useState(false);
  const [lastAddedTemplateId, setLastAddedTemplateId] = useState<string | null>(null);
  
  // Sử dụng templates và loading từ props nếu được cung cấp, ngược lại sử dụng mockTemplates
  const templates = propTemplates.length > 0 ? propTemplates : mockTemplates;
  const loading = propLoading;

  // Lọc và phân trang templates
  const [filteredTemplates, setFilteredTemplates] = useState<Template[]>([]);
  const [totalRows, setTotalRows] = useState<number>(0);
  
  // Xử lý lọc và phân trang templates
  useEffect(() => {
    const filterAndPaginateTemplates = async () => {
      try {
        // Lọc templates dựa trên filters
        let filtered = [...templates];
        
        if (filters.search) {
          const searchLower = filters.search.toLowerCase();
          filtered = filtered.filter(template => 
            template.name.toLowerCase().includes(searchLower)
          );
        }
        
        if (filters.type !== 'all') {
          filtered = filtered.filter(
            template => template.type === filters.type
          );
        }
        
        if (filters.status !== 'all') {
          filtered = filtered.filter(
            template => template.status === filters.status
          );
        }
        
        setTotalRows(filtered.length);
        
        // Áp dụng phân trang
        const startIndex = page * rowsPerPage;
        const paginated = filtered.slice(
          startIndex,
          startIndex + rowsPerPage
        );
        
        setFilteredTemplates(paginated);
      } catch (error) {
        console.error('Error filtering templates:', error);
      }
    };

    filterAndPaginateTemplates();
  }, [filters, page, rowsPerPage, templates]);

  const handleFilterChange = (newFilters: TemplateFilterValues) => {
    setFilters(newFilters);
    setPage(0); // Reset to first page when filters change
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (newRowsPerPage: number) => {
    setRowsPerPage(newRowsPerPage);
    setPage(0); // Reset to first page when rows per page changes
  };

  const handleViewTemplate = (id: string) => {
    // TODO: Implement view template
    console.log('View template:', id);
  };

  const handleEditTemplate = (id: string) => {
    // TODO: Implement edit template
    console.log('Edit template:', id);
  };

  const handleSetDefault = (id: string) => {
    // TODO: Implement set default template
    console.log('Set default template:', id);
    
    // Trong trường hợp thực tế, đây sẽ là API call
    // Vì chúng ta đang sử dụng props templates, nên không thể cập nhật trực tiếp
    // Các thay đổi sẽ được xử lý ở component cha
  };

  const handleDeleteTemplate = (id: string) => {
    // TODO: Implement delete template
    if (window.confirm('Bạn có chắc chắn muốn xóa template này?')) {
      console.log('Delete template:', id);
      
      // Trong trường hợp thực tế, đây sẽ là API call
      // Vì chúng ta đang sử dụng props templates, nên không thể cập nhật trực tiếp
      setTotalRows(prev => prev - 1);
    }
  };

  // Handle saving AI-generated template
  const handleSaveAITemplate = (templateData: Omit<Template, 'id'>) => {
    try {
      // In a real implementation, this would be an API call
      // For now, we'll simulate adding to the templates array
      const newId = `ai-${Date.now()}`;
      const newTemplate: Template = {
        ...templateData,
        id: newId
      };

      // Add to templates array
      const updatedTemplates = [newTemplate, ...templates];
      
      // Update the templates state (in a real app, this would be handled by the parent component)
      // For our mock implementation, we'll update the local state
      setFilteredTemplates(prev => [newTemplate, ...prev]);
      setTotalRows(prev => prev + 1);
      setLastAddedTemplateId(newId);
      
      // Show success message
      alert('Template đã được lưu thành công!');
      
      return true;
    } catch (error) {
      console.error('Error saving AI template:', error);
      alert('Có lỗi xảy ra khi lưu template!');
      return false;
    }
  };

  return (
    <Box>
      <Box mb={3}>
        <Typography variant="h5" component="h2" gutterBottom>
          Danh sách Template Hợp đồng
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Quản lý và tạo mới các mẫu hợp đồng
        </Typography>
      </Box>

      <Paper sx={{ p: 3, mb: 3 }}>
        <TemplateFilters 
          filters={filters} 
          onFilterChange={handleFilterChange}
          onUploadClick={onUploadClick}
          onCreateWithAIClick={() => setAIModalOpen(true)}
        />
        
        <AIContractGeneration
          open={aiModalOpen}
          onClose={() => setAIModalOpen(false)}
          onSaveTemplate={handleSaveAITemplate}
        />
        
        {loading ? (
          <Box py={4} textAlign="center">
            <Typography>Đang tải dữ liệu...</Typography>
          </Box>
        ) : (
          <TemplateTable
            templates={filteredTemplates}
            page={page}
            rowsPerPage={rowsPerPage}
            totalRows={totalRows}
            onPageChange={handlePageChange}
            onRowsPerPageChange={handleRowsPerPageChange}
            onView={handleViewTemplate}
            onEdit={handleEditTemplate}
            onSetDefault={handleSetDefault}
            onDelete={handleDeleteTemplate}
          />
        )}
      </Paper>
    </Box>
  );
};

export default TemplateList;
