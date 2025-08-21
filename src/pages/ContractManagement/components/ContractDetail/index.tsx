import React from 'react';
import { useTranslation } from 'react-i18next';
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
  const { t, i18n } = useTranslation();
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
    if (!dateString) return t('common.unknown');
    const lang = i18n.language || 'en';
    const locale = lang.startsWith('ja') ? 'ja-JP' : lang.startsWith('vi') ? 'vi-VN' : 'en-US';
    return new Date(dateString).toLocaleDateString(locale);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, gap: 2 }}>
        <IconButton onClick={onClose}>
          <ArrowBack />
        </IconButton>
        <Typography variant="h5">
          {t('pages.contracts.detail.title', { defaultValue: 'Contract details' })}: {contract.name}
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
            <Typography variant="h6" gutterBottom>
              {t('pages.contracts.detail.generalInfo', { defaultValue: 'General information' })}
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
              <Box sx={{ flex: '1 1 300px' }}>
                <Typography><strong>{t('pages.contracts.detail.fields.contractId', { defaultValue: 'Contract ID' })}:</strong> {contract.id}</Typography>
                <Typography><strong>{t('pages.contracts.detail.fields.templateName', { defaultValue: 'Template name' })}:</strong> {contract.templateName}</Typography>
                <Typography><strong>{t('pages.contracts.detail.fields.createdAt', { defaultValue: 'Created at' })}:</strong> {formatDate(contract.createdAt)}</Typography>
              </Box>
              <Box sx={{ flex: '1 1 300px' }}>
                <Typography><strong>{t('pages.contracts.detail.fields.createdBy', { defaultValue: 'Created by' })}:</strong> {contract.createdBy}</Typography>
                <Typography><strong>{t('pages.contracts.detail.fields.updatedAt', { defaultValue: 'Updated at' })}:</strong> {formatDate(contract.updatedAt)}</Typography>
                {contract.signedAt && (
                  <Typography><strong>{t('pages.contracts.detail.fields.signedAt', { defaultValue: 'Signed at' })}:</strong> {formatDate(contract.signedAt)}</Typography>
                )}
                {contract.expiresAt && (
                  <Typography><strong>{t('pages.contracts.detail.fields.expiresAt', { defaultValue: 'Expires at' })}:</strong> {formatDate(contract.expiresAt)}</Typography>
                )}
              </Box>
            </Box>
          </Box>
          
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            <Button variant="outlined" startIcon={<Download />} size="small">
              {t('common.download', { defaultValue: 'Download' })}
            </Button>
            <Button variant="outlined" startIcon={<Print />} size="small">
              {t('pages.contracts.detail.actions.print', { defaultValue: 'Print' })}
            </Button>
            <Button variant="outlined" startIcon={<Share />} size="small">
              {t('pages.contracts.detail.actions.share', { defaultValue: 'Share' })}
            </Button>
            <Button 
              variant="contained" 
              color="primary" 
              startIcon={<Edit />}
              onClick={() => onEdit(contract.id)}
              size="small"
            >
              {t('common.edit', { defaultValue: 'Edit' })}
            </Button>
            <Button 
              variant="outlined" 
              color="error" 
              startIcon={<Delete />}
              onClick={() => setDeleteConfirmOpen(true)}
              size="small"
            >
              {t('common.delete', { defaultValue: 'Delete' })}
            </Button>
          </Box>
        </Box>

        <Divider sx={{ my: 3 }} />

        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            {t('pages.contracts.detail.partiesInfo', { defaultValue: 'Parties information' })}
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
            <Box sx={{ flex: '1 1 300px' }}>
              <Paper variant="outlined" sx={{ p: 2, height: '100%' }}>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  {t('pages.contracts.detail.partyA.title', { defaultValue: 'Party A (Contracting party)' })}
                </Typography>
                {contract.contractData ? (
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Typography><strong>{t('pages.contracts.detail.party.companyName', { defaultValue: 'Company name' })}:</strong> {contract.contractData.tenBenA}</Typography>
                    <Typography><strong>{t('pages.contracts.detail.party.address', { defaultValue: 'Address' })}:</strong> {contract.contractData.diaChiA}</Typography>
                    <Typography><strong>{t('pages.contracts.detail.party.phone', { defaultValue: 'Phone' })}:</strong> {contract.contractData.dienThoaiA}</Typography>
                    <Typography><strong>{t('pages.contracts.detail.party.taxId', { defaultValue: 'Tax ID' })}:</strong> {contract.contractData.maSoThueA}</Typography>
                    <Typography><strong>{t('pages.contracts.detail.party.representative', { defaultValue: 'Representative' })}:</strong> {contract.contractData.nguoiDaiDienA}</Typography>
                    <Typography><strong>{t('pages.contracts.detail.party.position', { defaultValue: 'Position' })}:</strong> {contract.contractData.chucVuA}</Typography>
                  </Box>
                ) : (
                  <Typography>{t('common.noData', { defaultValue: 'No data' })}</Typography>
                )}
              </Paper>
            </Box>
            <Box sx={{ flex: '1 1 300px' }}>
              <Paper variant="outlined" sx={{ p: 2, height: '100%' }}>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  {t('pages.contracts.detail.partyB.title', { defaultValue: 'Party B (Partner)' })}
                </Typography>
                {contract.contractData ? (
                  <Typography><strong>{t('pages.contracts.detail.party.companyName', { defaultValue: 'Company name' })}:</strong> {contract.contractData.tenBenB}</Typography>
                ) : (
                  <Typography>{t('common.noData', 'No data')}</Typography>
                )}
              </Paper>
            </Box>
          </Box>
        </Box>

        <Box>
          <Typography variant="h6" gutterBottom>
            {t('pages.contracts.detail.contractContent', { defaultValue: 'Contract content' })}
          </Typography>
          <Paper variant="outlined" sx={{ p: 3 }}>
            <Typography variant="h5" align="center" gutterBottom>
              {t('pages.contracts.detail.sample.heading', { defaultValue: 'SERVICE CONTRACT' })}
            </Typography>
            <Typography paragraph align="center">
              {t('pages.contracts.detail.sample.code', { defaultValue: 'No.' })}: {contract.id}
            </Typography>
            
            <Typography paragraph align="center">
              <em>Căn cứ Bộ luật Dân sự số 91/2015/QH13 ngày 24 tháng 11 năm 2015 của Quốc hội</em><br />
              <em>Căn cứ Luật Thương mại số 36/2005/QH11 ngày 14 tháng 6 năm 2005 của Quốc hội</em>
            </Typography>
            
            <Typography paragraph align="center">
              <strong>Hôm nay, ngày {contract.contractData?.ngayKy || formatDate(contract.createdAt)}</strong>
            </Typography>
            
            <Typography paragraph>
              <strong>{t('pages.contracts.detail.sample.partyA', { defaultValue: 'PARTY A' })}:</strong> {contract.contractData?.tenBenA || contract.partyA}
            </Typography>
            
            <Typography paragraph>
              <strong>{t('pages.contracts.detail.sample.partyB', { defaultValue: 'PARTY B' })}:</strong> {contract.contractData?.tenBenB || contract.partyB}
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
        <DialogTitle>{t('pages.contracts.detail.deleteDialog.title', { defaultValue: 'Confirm contract deletion' })}</DialogTitle>
        <DialogContent>
          <Typography>{t('pages.contracts.detail.deleteDialog.text', { defaultValue: 'Are you sure you want to delete this contract? This action cannot be undone.' })}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmOpen(false)}>{t('common.cancel', { defaultValue: 'Cancel' })}</Button>
          <Button 
            onClick={() => {
              onDelete(contract.id);
              setDeleteConfirmOpen(false);
            }} 
            color="error"
            variant="contained"
          >
            {t('pages.contracts.detail.deleteDialog.confirm', { defaultValue: 'Delete' })}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ContractDetail;
