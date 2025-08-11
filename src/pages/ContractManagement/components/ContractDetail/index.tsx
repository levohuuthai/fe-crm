import React from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Button, 
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  Chip
} from '@mui/material';
import { ArrowBack, Download, Print, Share, Delete, Edit } from '@mui/icons-material';

interface ContractDetailProps {
  contract: {
    id: string;
    name: string;
    templateName: string;
    status: 'draft' | 'pending' | 'signed' | 'expired' | 'cancelled';
    partyA: string;
    partyB: string;
    createdAt: string;
    updatedAt: string;
    createdBy: string;
    signedAt?: string;
    expiresAt?: string;
    contractData?: {
      tenBenA: string;
      tenBenB: string;
      ngayKy: string;
      diaChiA: string;
      dienThoaiA: string;
      maSoThueA: string;
      nguoiDaiDienA: string;
      chucVuA: string;
      giaTriHopDong: string;
    };
  };
  onClose: () => void;
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
}

const ContractDetail: React.FC<ContractDetailProps> = ({ 
  contract, 
  onClose, 
  onDelete,
  onEdit
}) => {
  const [deleteConfirmOpen, setDeleteConfirmOpen] = React.useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'signed': return 'success';
      case 'pending': return 'warning';
      case 'draft': return 'default';
      case 'expired': return 'error';
      case 'cancelled': return 'error';
      default: return 'default';
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Chưa xác định';
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, gap: 2 }}>
        <IconButton onClick={onClose}>
          <ArrowBack />
        </IconButton>
        <Typography variant="h5">
          Chi tiết hợp đồng: {contract.name}
        </Typography>
        <Chip 
          label={contract.status.toUpperCase()} 
          color={getStatusColor(contract.status) as any}
          size="small"
          sx={{ ml: 2 }}
        />
      </Box>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3, flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Typography variant="h6" gutterBottom>Thông tin chung</Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
              <Box sx={{ flex: '1 1 300px' }}>
                <Typography><strong>Mã hợp đồng:</strong> {contract.id}</Typography>
                <Typography><strong>Mẫu hợp đồng:</strong> {contract.templateName}</Typography>
                <Typography><strong>Ngày tạo:</strong> {formatDate(contract.createdAt)}</Typography>
              </Box>
              <Box sx={{ flex: '1 1 300px' }}>
                <Typography><strong>Người tạo:</strong> {contract.createdBy}</Typography>
                <Typography><strong>Cập nhật lần cuối:</strong> {formatDate(contract.updatedAt)}</Typography>
                {contract.signedAt && (
                  <Typography><strong>Ngày ký:</strong> {formatDate(contract.signedAt)}</Typography>
                )}
                {contract.expiresAt && (
                  <Typography><strong>Ngày hết hạn:</strong> {formatDate(contract.expiresAt)}</Typography>
                )}
              </Box>
            </Box>
          </Box>
          
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            <Button variant="outlined" startIcon={<Download />} size="small">
              Tải xuống
            </Button>
            <Button variant="outlined" startIcon={<Print />} size="small">
              In
            </Button>
            <Button variant="outlined" startIcon={<Share />} size="small">
              Chia sẻ
            </Button>
            <Button 
              variant="contained" 
              color="primary" 
              startIcon={<Edit />}
              onClick={() => onEdit(contract.id)}
              size="small"
            >
              Chỉnh sửa
            </Button>
            <Button 
              variant="outlined" 
              color="error" 
              startIcon={<Delete />}
              onClick={() => setDeleteConfirmOpen(true)}
              size="small"
            >
              Xóa
            </Button>
          </Box>
        </Box>

        <Divider sx={{ my: 3 }} />

        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom>Thông tin các bên</Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
            <Box sx={{ flex: '1 1 300px' }}>
              <Paper variant="outlined" sx={{ p: 2, height: '100%' }}>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  Bên A (Bên giao kết hợp đồng)
                </Typography>
                {contract.contractData ? (
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Typography><strong>Tên công ty:</strong> {contract.contractData.tenBenA}</Typography>
                    <Typography><strong>Địa chỉ:</strong> {contract.contractData.diaChiA}</Typography>
                    <Typography><strong>Điện thoại:</strong> {contract.contractData.dienThoaiA}</Typography>
                    <Typography><strong>Mã số thuế:</strong> {contract.contractData.maSoThueA}</Typography>
                    <Typography><strong>Người đại diện:</strong> {contract.contractData.nguoiDaiDienA}</Typography>
                    <Typography><strong>Chức vụ:</strong> {contract.contractData.chucVuA}</Typography>
                  </Box>
                ) : (
                  <Typography>Không có thông tin chi tiết</Typography>
                )}
              </Paper>
            </Box>
            <Box sx={{ flex: '1 1 300px' }}>
              <Paper variant="outlined" sx={{ p: 2, height: '100%' }}>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  Bên B (Đối tác)
                </Typography>
                {contract.contractData ? (
                  <Typography><strong>Tên công ty:</strong> {contract.contractData.tenBenB}</Typography>
                ) : (
                  <Typography>Không có thông tin chi tiết</Typography>
                )}
              </Paper>
            </Box>
          </Box>
        </Box>

        <Box>
          <Typography variant="h6" gutterBottom>Nội dung hợp đồng</Typography>
          <Paper variant="outlined" sx={{ p: 3 }}>
            <Typography variant="h5" align="center" gutterBottom>
              HỢP ĐỒNG DỊCH VỤ
            </Typography>
            <Typography paragraph align="center">
              Số: {contract.id}
            </Typography>
            
            <Typography paragraph align="center">
              <em>Căn cứ Bộ luật Dân sự số 91/2015/QH13 ngày 24 tháng 11 năm 2015 của Quốc hội</em><br />
              <em>Căn cứ Luật Thương mại số 36/2005/QH11 ngày 14 tháng 6 năm 2005 của Quốc hội</em>
            </Typography>
            
            <Typography paragraph align="center">
              <strong>Hôm nay, ngày {contract.contractData?.ngayKy || formatDate(contract.createdAt)}</strong>
            </Typography>
            
            <Typography paragraph>
              <strong>BÊN A:</strong> {contract.contractData?.tenBenA || contract.partyA}
            </Typography>
            
            <Typography paragraph>
              <strong>BÊN B:</strong> {contract.contractData?.tenBenB || contract.partyB}
            </Typography>
            
            <Typography paragraph>
              Hai bên cùng thỏa thuận ký kết Hợp đồng dịch vụ với những nội dung và điều khoản sau đây:
            </Typography>
            
            <Typography variant="h6" gutterBottom>ĐIỀU 1: NỘI DUNG CÔNG VIỆC</Typography>
            <Typography paragraph>
              Bên B đồng ý cung cấp dịch vụ theo yêu cầu của Bên A với nội dung chi tiết như trong Phụ lục đính kèm.
            </Typography>
            
            <Typography variant="h6" gutterBottom>ĐIỀU 2: THỜI HẠN HỢP ĐỒNG</Typography>
            <Typography paragraph>
              Hợp đồng có hiệu lực từ ngày ký đến ngày {contract.expiresAt ? formatDate(contract.expiresAt) : 'khi hoàn thành nghĩa vụ hợp đồng'}.
            </Typography>
            
            <Typography variant="h6" gutterBottom>ĐIỀU 3: GIÁ TRỊ HỢP ĐỒNG</Typography>
            <Typography paragraph>
              Tổng giá trị hợp đồng: {contract.contractData?.giaTriHopDong || 'Theo thỏa thuận giữa hai bên'}
            </Typography>
            
            <Box sx={{ mt: 6, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
              <Box sx={{ textAlign: 'center', minWidth: 200, flex: 1 }}>
                <Typography fontWeight="bold">ĐẠI DIỆN BÊN A</Typography>
                <Typography fontStyle="italic">(Ký, ghi rõ họ tên)</Typography>
                <Box sx={{ height: 80, mt: 2 }}></Box>
                <Typography fontWeight="bold">{contract.contractData?.nguoiDaiDienA || 'Người đại diện'}</Typography>
                <Typography>{contract.contractData?.chucVuA || 'Chức vụ'}</Typography>
              </Box>
              
              <Box sx={{ textAlign: 'center', minWidth: 200, flex: 1 }}>
                <Typography fontWeight="bold">ĐẠI DIỆN BÊN B</Typography>
                <Typography fontStyle="italic">(Ký, ghi rõ họ tên)</Typography>
                <Box sx={{ height: 80, mt: 2 }}></Box>
                <Typography fontWeight="bold">Người đại diện</Typography>
                <Typography>Chức vụ</Typography>
              </Box>
            </Box>
          </Paper>
        </Box>
      </Paper>

      {/* Delete confirmation dialog */}
      <Dialog open={deleteConfirmOpen} onClose={() => setDeleteConfirmOpen(false)}>
        <DialogTitle>Xác nhận xóa hợp đồng</DialogTitle>
        <DialogContent>
          <Typography>Bạn có chắc chắn muốn xóa hợp đồng này? Hành động này không thể hoàn tác.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmOpen(false)}>Hủy</Button>
          <Button 
            onClick={() => {
              onDelete(contract.id);
              setDeleteConfirmOpen(false);
            }} 
            color="error"
            variant="contained"
          >
            Xác nhận xóa
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ContractDetail;
