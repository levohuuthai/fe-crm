import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Stepper, 
  Step, 
  StepLabel,
  Paper,
  TextField,
  IconButton,
  Chip
} from '@mui/material';
import { 
  Description as TemplateIcon,
  ArrowBack as ArrowBackIcon
} from '@mui/icons-material';
import PdfPageEditor from '../../../../components/PdfPageEditor';
import { Template } from '../TemplateList/types';
import { ExtractedField } from '../UploadTemplate/types';
import { toast } from 'react-toastify';
import PaymentScheduleStep, { PaymentItem } from '../PaymentScheduleStep';

// Mở rộng interface Template để thêm trường extractedFields
interface ExtendedTemplate extends Template {
  extractedFields?: ExtractedField[];
}

interface CreateContractProps {
  templates: ExtendedTemplate[];
  onBack: () => void;
  onCreate: (contract: any) => void;
}

const CreateContract: React.FC<CreateContractProps> = ({ 
  templates, 
  onBack,
  onCreate 
}) => {
  const [activeStep, setActiveStep] = useState(0);
  const [selectedTemplate, setSelectedTemplate] = useState<ExtendedTemplate | null>(null);
  // Sử dụng formData để lưu các giá trị nhập vào form
  const [formData, setFormData] = useState<Record<string, string>>({});
  // Lưu nội dung hợp đồng để hiển thị trong PdfPageEditor
  const [contractContent, setContractContent] = useState<string[]>(['']);
  // Lưu các đợt thanh toán
  const [payments, setPayments] = useState<PaymentItem[]>([]);
  
  // Hàm tạo nội dung HTML cho hợp đồng từ formData
  const generateContractHTML = React.useCallback(() => {
    // Tạo số hợp đồng
    const contractNumber = `HD${new Date().getFullYear()}${(new Date().getMonth() + 1).toString().padStart(2, '0')}${new Date().getDate().toString().padStart(2, '0')}001`;
    
    // Định dạng số tiền
    const formatCurrency = (amount: number) => {
      return new Intl.NumberFormat('vi-VN').format(amount);
    };
    
    // Tạo HTML cho bảng thanh toán
    const paymentScheduleHTML = payments.length > 0 ? `
      <h3 style="font-weight: bold; margin-top: 30px; margin-bottom: 20px;">ĐIỀU 2: LỊCH THANH TOÁN</h3>
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
        <thead>
          <tr style="background-color: #f2f2f2;">
            <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">STT</th>
            <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Điều kiện</th>
            <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Số tiền</th>
            <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Ngày thanh toán</th>
            <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Ghi chú</th>
          </tr>
        </thead>
        <tbody>
          ${payments.map((payment, index) => `
            <tr>
              <td style="border: 1px solid #ddd; padding: 8px;">${index + 1}</td>
              <td style="border: 1px solid #ddd; padding: 8px;">${payment.condition}</td>
              <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">${formatCurrency(payment.amount)} VNĐ</td>
              <td style="border: 1px solid #ddd; padding: 8px;">${payment.paymentDate ? new Date(payment.paymentDate).toLocaleDateString('vi-VN') : ''}</td>
              <td style="border: 1px solid #ddd; padding: 8px;">${payment.note}</td>
            </tr>
          `).join('')}
          <tr style="font-weight: bold; background-color: #f9f9f9;">
            <td style="border: 1px solid #ddd; padding: 8px;" colspan="2">Tổng cộng</td>
            <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">${formatCurrency(payments.reduce((sum, payment) => sum + payment.amount, 0))} VNĐ</td>
            <td style="border: 1px solid #ddd; padding: 8px;" colspan="2"></td>
          </tr>
        </tbody>
      </table>
    ` : '';
    
    // Tạo HTML cho hợp đồng
    return `
      <div style="text-align: center; margin-bottom: 20px;">
        <h2 style="font-weight: bold; text-transform: uppercase;">Cộng Hòa Xã Hội Chủ Nghĩa Việt Nam</h2>
        <h3 style="font-weight: bold;">Độc Lập – Tự Do – Hạnh Phúc</h3>
        <p style="margin-bottom: 20px;">__________</p>
        <h1 style="font-weight: bold; text-transform: uppercase; margin-bottom: 20px;">HỢP ĐỒNG NGUYÊN TẮC CUNG CẤP DỊCH VỤ PHẦN MỀM</h1>
        <h2 style="font-weight: bold; margin-bottom: 30px;">Số: ${contractNumber}</h2>
      </div>

      <p>
        Căn cứ vào Luật Thương Mại của Quốc hội nước Cộng Hòa Xã Hội Chủ Nghĩa Việt Nam được ban hành ngày 14/06/2005, có hiệu lực từ ngày 01/01/2006.
      </p>
      
      ${Object.entries(formData).map(([field, value]) => `<p>Căn cứ vào ${field}: <strong>${value}</strong></p>`).join('\n')}

      <h3 style="font-weight: bold; margin-top: 30px; margin-bottom: 20px;">ĐIỀU 1: NỘI DUNG HỢP ĐỒNG</h3>
      <p>
        Bên A ủy thác cho bên B công việc xây dựng và phát triển phần mềm và cung cấp các dịch vụ liên quan đến phần mềm của bên A.
      </p>
      <p>
        Bên B sẽ chịu trách nhiệm xây dựng phần mềm đúng như thỏa thuận của cả Bên A và Bên B.
      </p>
      <p>
        Về chi tiết nội dung công việc và chi phí thực hiện sẽ được trình bày trong từng Phụ lục cụ thể.
      </p>
      
      ${paymentScheduleHTML}
    `;
  }, [formData, payments]);
  
  // Cập nhật nội dung hợp đồng khi formData thay đổi
  useEffect(() => {
    // Chỉ cập nhật khi đã điền ít nhất một trường và đã đến bước xem trước
    if (activeStep === 3 && Object.keys(formData).length > 0 && Object.values(formData).some(value => value)) {
      setContractContent([generateContractHTML()]);
    }
  }, [formData, activeStep, generateContractHTML]);
  
  // Bước 1: Chọn template
  const renderTemplateSelection = () => (
    <Box>
      <Typography variant="h6" gutterBottom>
        Chọn mẫu hợp đồng
      </Typography>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
        {templates.map((template) => (
          <div 
            key={template.id} 
            style={{ 
              marginBottom: '16px'
            }}>
          
            <Paper 
              elevation={selectedTemplate?.id === template.id ? 4 : 1}
              sx={{ 
                p: 2, 
                cursor: 'pointer',
                border: selectedTemplate?.id === template.id ? '2px solid #1976d2' : '1px solid #e0e0e0',
                height: '100%',
                display: 'flex',
                flexDirection: 'column'
              }}
              onClick={() => setSelectedTemplate(template)}
            >
              <Box display="flex" alignItems="center" mb={1}>
                <TemplateIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="subtitle1" fontWeight="bold">
                  {template.name}
                </Typography>
              </Box>
              <Typography variant="body2" color="textSecondary" sx={{ flexGrow: 1 }}>
                {template.name} - {template.type}
              </Typography>
              <Chip 
                label={`${template.placeholderCount} trường`} 
                size="small" 
                sx={{ mt: 1, alignSelf: 'flex-start' }} 
              />
            </Paper>
          </div>
        ))}
      </div>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
        <Button 
          variant="contained" 
          disabled={!selectedTemplate}
          onClick={() => {
            // Khởi tạo formData chỉ với các trường được trích xuất từ template
            const formFields: Record<string, string> = {};
            
            // Thêm các trường từ template nếu có
            if (selectedTemplate?.extractedFields && selectedTemplate.extractedFields.length > 0) {
              selectedTemplate.extractedFields.forEach((field: ExtractedField) => {
                formFields[field.placeholder] = '';
              });
            } else {
              // Nếu không có trường nào được trích xuất, hiển thị thông báo
              alert('Không tìm thấy trường nào trong mẫu hợp đồng. Vui lòng chọn mẫu khác.');
              return;
            }
            
            // Khởi tạo formData với các trường cần điền từ template
            
            // Khởi tạo formData với các trường cần điền
            setFormData(formFields);
            // Chuyển sang bước điền thông tin
            setActiveStep(1);
          }}
        >
          Tiếp tục
        </Button>
      </Box>
    </Box>
  );

  // Bước 2: Điền thông tin qua form trực tiếp
  const renderContractForm = () => {
    // Kiểm tra xem đã điền đủ thông tin chưa
    const checkFormCompletion = () => {
      const fieldNames = Object.keys(formData);
      const missingFields = fieldNames.filter(field => !formData[field]);
      return missingFields.length === 0;
    };

    // Xử lý khi người dùng thay đổi giá trị của một trường
    const handleFieldChange = (fieldName: string, value: string) => {
      setFormData(prev => ({
        ...prev,
        [fieldName]: value
      }));
    };

    // Xử lý khi người dùng nhấn nút Tiếp tục
    const handleContinue = () => {
      if (checkFormCompletion()) {
        setActiveStep(2); // Chuyển sang bước hạng mục thanh toán
      } else {
        // Hiển thị thông báo nếu chưa điền đủ thông tin
        alert('Vui lòng điền đầy đủ thông tin trước khi tiếp tục.');
      }
    };

    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <IconButton onClick={() => setActiveStep(0)} sx={{ mr: 1 }}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6">
            Tạo hợp đồng: {selectedTemplate?.name}
          </Typography>
        </Box>
        
        <Paper 
          variant="outlined" 
          sx={{ 
            p: 3, 
            flexGrow: 1, 
            mb: 2, 
            overflowY: 'auto',
            maxHeight: '600px'
          }}
        >
          <Typography variant="h6" gutterBottom>
            Thông tin hợp đồng
          </Typography>
          
          <Typography variant="body2" color="text.secondary" paragraph>
            Vui lòng điền đầy đủ các thông tin sau để tạo hợp đồng.
          </Typography>
          
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
            gap: 3,
            mt: 2
          }}>
            {Object.keys(formData).map((fieldName) => (
              <TextField
                key={fieldName}
                label={fieldName}
                variant="outlined"
                fullWidth
                value={formData[fieldName]}
                onChange={(e) => handleFieldChange(fieldName, e.target.value)}
                required
                error={!formData[fieldName]}
                helperText={!formData[fieldName] ? 'Trường này là bắt buộc' : ''}
                sx={{ mb: 2 }}
              />
            ))}
          </Box>
        </Paper>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button 
            variant="outlined" 
            onClick={() => setActiveStep(0)}
            startIcon={<ArrowBackIcon />}
          >
            Quay lại
          </Button>
          <Button 
            variant="contained" 
            color="primary"
            onClick={handleContinue}
            disabled={!checkFormCompletion()}
          >
            Tiếp tục
          </Button>
        </Box>
      </Box>
    );
  };

  // Xử lý tạo hợp đồng
  const handleCreateContract = () => {
    if (!selectedTemplate) return;
    
    const newContract = {
      id: `C${Math.floor(1000 + Math.random() * 9000)}`,
      name: `Hợp đồng ${selectedTemplate?.name} - ${new Date().toLocaleDateString()}`,
      templateId: selectedTemplate?.id || '',
      templateName: selectedTemplate?.name || '',
      status: 'draft',
      partyA: 'Công ty TNHH ABC',
      partyB: 'Công ty TNHH XYZ',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: 'Người dùng hiện tại',
      // Lưu formData và payments vào contract
      contractData: formData,
      payments: payments
    };
    
    // Gọi hàm tạo hợp đồng
    onCreate(newContract);
    toast.success('Tạo hợp đồng thành công!');
  };

  // Bước 3: Xem trước và xác nhận
  const renderPreview = () => {
    if (!selectedTemplate) return null;

    return (
      <Box>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <IconButton onClick={() => setActiveStep(2)} sx={{ mr: 1 }}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6">
            Xem trước & Xác nhận
          </Typography>
        </Box>
        
        <Box sx={{ border: '1px solid #e0e0e0', borderRadius: 1, padding: 0, overflow: 'hidden', mb: 3 }}>
          <PdfPageEditor 
            initialContent={contractContent}
            onSave={setContractContent}
            onExportPdf={() => {
              toast.success('Xuất PDF thành công!');
            }}
          />
        </Box>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button 
            variant="outlined" 
            onClick={() => setActiveStep(1)}
            startIcon={<ArrowBackIcon />}
          >
            Quay lại
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleCreateContract}
          >
            Tạo hợp đồng
          </Button>
        </Box>
      </Box>
    );
  };
  // Bước 3: Thêm hạng mục thanh toán
  const renderPaymentSchedule = () => {
    return (
      <PaymentScheduleStep
        payments={payments}
        onPaymentsChange={setPayments}
        onBack={() => setActiveStep(1)}
        onNext={() => setActiveStep(3)}
      />
    );
  };

  const steps = [
    { label: 'Chọn mẫu hợp đồng', component: renderTemplateSelection },
    { label: 'Điền thông tin', component: renderContractForm },
    { label: 'Hạng mục thanh toán', component: renderPaymentSchedule },
    { label: 'Xem trước & Xác nhận', component: renderPreview },
  ];

  return (
    <Box sx={{ width: '100%' }}>
      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
        {steps.map((step, index) => (
          <Step key={step.label} completed={activeStep > index}>
            <StepLabel>{step.label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      
      <Box sx={{ mt: 2 }}>
        {steps[activeStep].component()}
      </Box>
    </Box>
  );
};

// Component này đã được thay thế bằng PdfPageEditor trong bước xem trước
// const ContractPreview: React.FC = () => {
//   return null;
// };

export default CreateContract;
