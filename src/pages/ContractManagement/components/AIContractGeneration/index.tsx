import React, { useState } from 'react';
import { Dialog, DialogContent, DialogTitle, IconButton, Box, Typography, TextField, Button } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AIPromptInput from './AIPromptInput';
import ContractPreview from './ContractPreview';
import { mockGenerateContract } from './mockData';
import { Template } from '../TemplateList/types';

interface AIContractGenerationProps {
  open: boolean;
  onClose: () => void;
  onSaveTemplate?: (template: Omit<Template, 'id'>) => void;
}

const AIContractGeneration: React.FC<AIContractGenerationProps> = ({ 
  open, 
  onClose,
  onSaveTemplate = () => console.log('Template saved') 
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [contractContent, setContractContent] = useState<string>('');
  const [chatHistory, setChatHistory] = useState<Array<{ role: 'user' | 'assistant', content: string }>>([]);
  const [saveDialogOpen, setSaveDialogOpen] = useState<boolean>(false);
  const [templateName, setTemplateName] = useState<string>('');
  const [savingTemplate, setSavingTemplate] = useState<boolean>(false);

  const handleGenerateContract = async (prompt: string) => {
    // Add user message to chat history
    setChatHistory(prev => [...prev, { role: 'user', content: prompt }]);
    
    // Set loading state
    setLoading(true);
    
    try {
      // In a real implementation, this would call an API
      // For now, we'll use a mock function with a delay to simulate API call
      setTimeout(() => {
        const generatedContract = mockGenerateContract(prompt);
        
        // Update contract content
        setContractContent(generatedContract);
        
        // Add assistant response to chat history
        setChatHistory(prev => [...prev, { 
          role: 'assistant', 
          content: 'Tôi đã tạo hợp đồng dựa trên yêu cầu của bạn. Bạn có thể xem và chỉnh sửa ở bên phải.' 
        }]);
        
        // End loading state
        setLoading(false);
      }, 2000);
    } catch (error) {
      console.error('Error generating contract:', error);
      setLoading(false);
      
      // Add error message to chat history
      setChatHistory(prev => [...prev, { 
        role: 'assistant', 
        content: 'Đã xảy ra lỗi khi tạo hợp đồng. Vui lòng thử lại.' 
      }]);
    }
  };

  const handleUpdateContract = (newContent: string) => {
    setContractContent(newContent);
  };

  // Handle opening the save template dialog
  const handleOpenSaveDialog = (content: string) => {
    if (content) {
      setSaveDialogOpen(true);
      // Extract a default name from the first line of the contract
      const firstLine = content.split('\n')[0];
      setTemplateName(firstLine || 'Hợp đồng mới');
    }
  };

  // Handle saving the template
  const handleSaveTemplate = () => {
    if (contractContent && templateName) {
      setSavingTemplate(true);
      
      // Count placeholders in the content
      const placeholderRegex = /\{\{([^}]+)\}\}/g;
      const placeholders = contractContent.match(placeholderRegex) || [];
      
      // Create new template object
      const newTemplate: Omit<Template, 'id'> = {
        name: templateName,
        type: 'AI',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: 'Người dùng hiện tại',
        placeholderCount: placeholders.length,
        isDefault: false,
        status: 'active',
        content: contractContent // Note: This field might need to be added to the Template interface
      };
      
      // Call the onSaveTemplate callback
      onSaveTemplate(newTemplate);
      
      // Close dialogs and reset state
      setSavingTemplate(false);
      setSaveDialogOpen(false);
      onClose();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="xl"
      PaperProps={{
        sx: {
          height: '90vh',
          maxHeight: '90vh',
          m: 2,
          borderRadius: 2
        }
      }}
    >
      <DialogTitle sx={{ 
        m: 0, 
        p: 2, 
        display: 'flex', 
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '1px solid rgba(0, 0, 0, 0.12)'
      }}>
        <Typography variant="h6" component="div">
          Tạo hợp đồng bằng AI
        </Typography>
        <IconButton
          edge="end"
          color="inherit"
          onClick={onClose}
          aria-label="close"
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      
      <DialogContent sx={{ p: 0, display: 'flex', overflow: 'hidden' }}>
        <Box sx={{ 
          width: '50%', 
          height: '100%',
          borderRight: '1px solid rgba(0, 0, 0, 0.12)',
          display: 'flex',
          flexDirection: 'column'
        }}>
          <AIPromptInput 
            onSubmit={handleGenerateContract} 
            loading={loading}
            chatHistory={chatHistory}
          />
        </Box>
        
        <Box sx={{ width: '50%', height: '100%' }}>
          <ContractPreview 
            content={contractContent} 
            onUpdate={handleUpdateContract}
            loading={loading}
            onSaveTemplate={handleOpenSaveDialog}
          />
        </Box>
      </DialogContent>

      {/* Save Template Dialog */}
      <Dialog 
        open={saveDialogOpen} 
        onClose={() => setSaveDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Lưu thành Template</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <Typography variant="body2" gutterBottom>
              Đặt tên cho template hợp đồng này để lưu vào hệ thống
            </Typography>
            <TextField
              autoFocus
              margin="dense"
              label="Tên template"
              fullWidth
              variant="outlined"
              value={templateName}
              onChange={(e) => setTemplateName(e.target.value)}
              sx={{ mb: 3, mt: 2 }}
            />
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
              <Button 
                onClick={() => setSaveDialogOpen(false)}
                disabled={savingTemplate}
              >
                Hủy
              </Button>
              <Button 
                variant="contained" 
                color="primary"
                onClick={handleSaveTemplate}
                disabled={!templateName.trim() || savingTemplate}
              >
                {savingTemplate ? 'Đang lưu...' : 'Lưu template'}
              </Button>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>
    </Dialog>
  );
};

export default AIContractGeneration;
