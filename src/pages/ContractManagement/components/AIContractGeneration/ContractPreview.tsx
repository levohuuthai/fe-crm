import React from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Skeleton, 
  Button,
  Divider
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import DownloadIcon from '@mui/icons-material/Download';
import EditIcon from '@mui/icons-material/Edit';

interface ContractPreviewProps {
  content: string;
  onUpdate: (newContent: string) => void;
  loading: boolean;
  onSaveTemplate?: (content: string) => void;
}

const ContractPreview: React.FC<ContractPreviewProps> = ({ 
  content, 
  onUpdate,
  loading,
  onSaveTemplate
}) => {
  // Function to handle content changes
  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onUpdate(e.target.value);
  };

  // Function to handle save template
  const handleSaveTemplate = () => {
    if (onSaveTemplate && content) {
      onSaveTemplate(content);
    }
  };

  return (
    <Box sx={{ 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column',
      p: 0
    }}>
      {/* Header */}
      <Box sx={{ 
        p: 2, 
        borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Typography variant="h6">
          Xem trước hợp đồng
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            size="small"
            startIcon={<EditIcon />}
            disabled={!content || loading}
          >
            Chỉnh sửa
          </Button>
          <Button
            variant="outlined"
            size="small"
            startIcon={<DownloadIcon />}
            disabled={!content || loading}
          >
            Tải xuống
          </Button>
          <Button
            variant="contained"
            color="primary"
            size="small"
            startIcon={<SaveIcon />}
            disabled={!content || loading}
            onClick={handleSaveTemplate}
          >
            Lưu thành Template
          </Button>
        </Box>
      </Box>
      
      {/* Content Area */}
      <Box sx={{ 
        flexGrow: 1, 
        overflowY: 'auto',
        p: 2
      }}>
        {loading ? (
          // Loading skeleton
          <Box>
            <Skeleton variant="text" height={40} width="60%" />
            <Skeleton variant="text" height={20} />
            <Skeleton variant="text" height={20} />
            <Skeleton variant="text" height={20} width="80%" />
            <Box sx={{ my: 2 }}>
              <Divider />
            </Box>
            <Skeleton variant="text" height={30} width="40%" />
            <Skeleton variant="text" height={20} />
            <Skeleton variant="text" height={20} />
            <Skeleton variant="text" height={20} width="90%" />
            <Box sx={{ my: 2 }}>
              <Divider />
            </Box>
            <Skeleton variant="text" height={30} width="40%" />
            <Skeleton variant="text" height={20} />
            <Skeleton variant="text" height={20} />
          </Box>
        ) : content ? (
          // Contract content editor
          <Paper 
            elevation={0} 
            sx={{ 
              height: '100%', 
              p: 2,
              backgroundColor: 'rgba(0, 0, 0, 0.02)',
              borderRadius: 2
            }}
          >
            <textarea
              value={content}
              onChange={handleContentChange}
              style={{
                width: '100%',
                height: '100%',
                padding: '16px',
                border: '1px solid rgba(0, 0, 0, 0.12)',
                borderRadius: '8px',
                resize: 'none',
                fontFamily: 'inherit',
                fontSize: '14px',
                lineHeight: '1.5',
                backgroundColor: 'white'
              }}
            />
          </Paper>
        ) : (
          // Empty state
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            color: 'text.secondary',
            textAlign: 'center',
            p: 3
          }}>
            <EditIcon sx={{ fontSize: 60, mb: 2, opacity: 0.7 }} />
            <Typography variant="h6" gutterBottom>
              Chưa có nội dung hợp đồng
            </Typography>
            <Typography variant="body1">
              Nhập yêu cầu của bạn ở bên trái và nhấn "Sinh hợp đồng" để AI tạo nội dung hợp đồng.
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default ContractPreview;
