import React, { useState, useRef } from 'react';
import {
  Box,
  Button,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Autocomplete,
  FormControlLabel,
  Radio,
  RadioGroup,
  FormLabel,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableFooter,
  Tabs,
  Tab,
  Link,
  List,
  ListItem,
  ListItemText,
  IconButton,
  CircularProgress,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Card,
  CardContent,
} from '@mui/material';
import {
  Add as AddIcon,
  Refresh as RefreshIcon,
  Save as SaveIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { 
  AIFeature, 
  Requirement, 
  NonFunctionalRequirement, 
  TestRequirement, 
  UIMockup, 
  DataModelEntity, 
  IntegrationRequirement 
} from '../../types';

interface RequirementFormProps {
  open: boolean;
  onClose: () => void;
  onSave: (requirement: Requirement) => void;
  customers: string[];
  assignees: string[];
}

const RequirementForm: React.FC<RequirementFormProps> = ({
  open,
  onClose,
  onSave,
  customers,
  assignees,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  // Form state
  const [newRequirement, setNewRequirement] = useState<Partial<Requirement>>({
    name: '',
    type: '',
    customer: '',
    assignee: '',
    source: 'manual',
    status: 'pending',
    expectedDeadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    createdDate: new Date().toISOString().split('T')[0],
    description: '',
    features: []
  });
  
  // Creation method state
  const [creationMethod, setCreationMethod] = useState<'manual' | 'upload'>('manual');
  
  // AI generation state
  const [aiFeatures, setAiFeatures] = useState<AIFeature[]>([]);
  const [aiDescription, setAiDescription] = useState('');
  const [showAiResult, setShowAiResult] = useState(false);
  
  // SRS tabs state
  const [currentTab, setCurrentTab] = useState(0);
  const [nonFunctionalRequirements, setNonFunctionalRequirements] = useState<NonFunctionalRequirement[]>([]);
  const [testRequirements, setTestRequirements] = useState<TestRequirement[]>([]);
  const [uiMockups, setUiMockups] = useState<UIMockup[]>([]);
  const [dataModelEntities, setDataModelEntities] = useState<DataModelEntity[]>([]);
  const [integrationRequirements, setIntegrationRequirements] = useState<IntegrationRequirement[]>([]);
  
  // Refs
  const aiResultRef = useRef<HTMLDivElement>(null);
  
  // Editing state
  const [editingFeature, setEditingFeature] = useState<AIFeature | null>(null);
  const [editingField, setEditingField] = useState<keyof AIFeature | null>(null);
  const [editingValue, setEditingValue] = useState('');

  const handleSaveRequirement = () => {
    if (newRequirement.name && newRequirement.customer && newRequirement.assignee && newRequirement.type) {
      const requirement: Requirement = {
        ...newRequirement as Requirement,
        id: Math.floor(Math.random() * 10000), // Temporary ID, will be replaced by backend
        createdDate: new Date().toISOString().split('T')[0],
        status: 'pending',
        features: aiFeatures,
        // Sử dụng mô tả từ người dùng nếu có, nếu không thì sử dụng mô tả từ AI
        description: newRequirement.description || aiDescription,
        // Cập nhật nguồn tạo dựa trên phương thức
        source: creationMethod === 'manual' ? 
          (showAiResult ? 'AI sinh từ mô tả' : 'Nhập tay') : 
          'AI sinh từ file upload'
      };
      
      onSave(requirement);
      resetForm();
    }
  };

  const resetForm = () => {
    setShowAiResult(false);
    
    // Reset form
    setAiFeatures([]);
    setAiDescription('');
    setCreationMethod('manual');
    setCurrentTab(0);
    setNonFunctionalRequirements([]);
    setTestRequirements([]);
    setUiMockups([]);
    setDataModelEntities([]);
    setIntegrationRequirements([]);
    setNewRequirement({
      name: '',
      type: '',
      customer: '',
      assignee: '',
      source: 'manual',
      status: 'pending',
      expectedDeadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      createdDate: new Date().toISOString().split('T')[0],
      description: '',
      features: []
    });
  };

  const handleEditCell = (feature: AIFeature, field: keyof AIFeature, value: string) => {
    setAiFeatures(prev => 
      prev.map(f => 
        f.id === feature.id ? { ...f, [field]: value } : f
      )
    );
  };

  const handleAddNewRow = () => {
    const newId = aiFeatures.length > 0 ? Math.max(...aiFeatures.map(f => f.id)) + 1 : 1;
    setAiFeatures([
      ...aiFeatures,
      {
        id: newId,
        feature: '',
        detail: '',
        description: '',
        notes: 'Từ AI (mẫu)'
      }
    ]);
  };

  const handleDeleteRow = (id: number) => {
    setAiFeatures(prev => prev.filter(f => f.id !== id));
  };

  const handleRegenerate = () => {
    // Mock regenerate with new data
    const mockFeatures: AIFeature[] = [
      { 
        id: 1, 
        feature: 'Quản lý Kho', 
        detail: 'Luân chuyển kho',
        description: 'Theo dõi mọi hoạt động nhập xuất kho',
        notes: 'Tạo lại bởi AI (mẫu)'
      },
      { 
        id: 2, 
        feature: 'Tồn kho', 
        detail: 'Mức tồn kho',
        description: 'Theo dõi mức tồn kho hiện tại',
        notes: 'Tạo lại bởi AI (mẫu)'
      }
    ];
    setAiFeatures(mockFeatures);
  };

  const generateAIResponse = () => {
    // Giả lập việc gọi API để tạo yêu cầu từ AI
    setIsLoading(true);
    setTimeout(() => {
      // Mock AI response
      const mockFeatures: AIFeature[] = [
        { 
          id: 1, 
          feature: 'Quản lý Kho', 
          detail: 'Nhập kho',
          description: 'Cho phép người dùng nhập hàng mới vào kho',
          notes: 'Từ AI (mẫu)'
        },
        { 
          id: 2, 
          feature: 'Quản lý Kho', 
          detail: 'Xuất kho',
          description: 'Ghi nhận xuất kho khi giao hàng hoặc bán',
          notes: 'Từ AI (mẫu)'
        },
        { 
          id: 3, 
          feature: 'Giám sát Kho', 
          detail: 'Cảnh báo tồn kho thấp',
          description: 'Thông báo khi số lượng hàng tồn dưới mức tối thiểu',
          notes: 'Từ AI (mẫu)'
        }
      ];
      
      // Mock data for other SRS sections
      const mockNonFunctional: NonFunctionalRequirement[] = [
        { id: 1, key: 'Hiệu suất', value: 'Hệ thống phải xử lý ít nhất 100 giao dịch/phút' },
        { id: 2, key: 'Bảo mật', value: 'Mã hóa dữ liệu người dùng, xác thực 2 yếu tố' },
        { id: 3, key: 'Khả dụng', value: 'Uptime 99.9%, thời gian khôi phục < 1 giờ' },
      ];
      
      const mockTestRequirements: TestRequirement[] = [
        { id: 1, testCase: 'Nhập kho', condition: 'Số lượng > 0', expectedResult: 'Cập nhật số lượng tồn kho' },
        { id: 2, testCase: 'Xuất kho', condition: 'Số lượng <= Tồn kho', expectedResult: 'Giảm số lượng tồn kho' },
        { id: 3, testCase: 'Cảnh báo', condition: 'Tồn kho < Ngưỡng tối thiểu', expectedResult: 'Hiển thị cảnh báo' },
      ];
      
      const mockUiMockups: UIMockup[] = [
        { id: 1, description: 'Giao diện quản lý kho', figmaLink: 'https://figma.com/example' },
      ];
      
      const mockDataModel: DataModelEntity[] = [
        { id: 1, entityName: 'Product', fields: 'id, name, description, quantity, min_quantity', description: 'Thông tin sản phẩm' },
        { id: 2, entityName: 'Transaction', fields: 'id, product_id, type, quantity, date', description: 'Giao dịch nhập/xuất' },
      ];
      
      const mockIntegration: IntegrationRequirement[] = [
        { id: 1, system: 'ERP', method: 'REST API', purpose: 'Đồng bộ dữ liệu sản phẩm' },
        { id: 2, system: 'Notification Service', method: 'WebSocket', purpose: 'Gửi cảnh báo tồn kho thấp' },
      ];
      
      setAiDescription('Hệ thống quản lý kho với đầy đủ các chức năng nhập xuất tồn');
      setAiFeatures(mockFeatures);
      setNonFunctionalRequirements(mockNonFunctional);
      setTestRequirements(mockTestRequirements);
      setUiMockups(mockUiMockups);
      setDataModelEntities(mockDataModel);
      setIntegrationRequirements(mockIntegration);
      setShowAiResult(true);
      setIsLoading(false);
      
      // Scroll to the AI result section
      setTimeout(() => {
        aiResultRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }, 2000);
  };

  const [activeStep, setActiveStep] = useState(0);
  
  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const isStep1Valid = () => {
    return (
      newRequirement.name && 
      newRequirement.type && 
      newRequirement.customer && 
      newRequirement.assignee && 
      newRequirement.expectedDeadline
    );
  };
  
  const isStep2Valid = () => {
    if (creationMethod === 'manual') {
      return newRequirement.description && newRequirement.description.length > 10;
    }
    return true; // For upload method, we'll validate when file is selected
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
    >
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h6">Tạo Requirement mới (AI)</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>
              {activeStep === 0 ? 'Bước 1/2' : 'Bước 2/2'}
            </Typography>
            <Box sx={{ width: 100, display: 'flex', alignItems: 'center' }}>
              <Box
                sx={{
                  width: `${(activeStep + 1) * 50}%`,
                  height: 4,
                  backgroundColor: 'primary.main',
                  borderRadius: 1
                }}
              />
              <Box
                sx={{
                  width: `${(2 - activeStep - 1) * 50}%`,
                  height: 4,
                  backgroundColor: 'grey.300',
                  borderRadius: 1
                }}
              />
            </Box>
          </Box>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2 }}>
          <Stepper activeStep={activeStep} orientation="vertical" sx={{ '& .MuiStepLabel-root': { padding: '8px 0' } }}>
            {/* Step 1: Basic Information */}
            <Step>
              <StepLabel>
                <Typography variant="subtitle1">Nhập thông tin cơ bản</Typography>
              </StepLabel>
              <StepContent>
                <Card variant="outlined" sx={{ mb: 2 }}>
                  <CardContent>
                    <TextField
                      label="Tên Requirement"
                      fullWidth
                      required
                      value={newRequirement.name || ''}
                      onChange={(e) => setNewRequirement({...newRequirement, name: e.target.value})}
                      margin="normal"
                      size="small"
                      placeholder="Nhập tên yêu cầu"
                    />
                    <FormControl fullWidth margin="normal" size="small" required>
                      <InputLabel>Loại Requirement</InputLabel>
                      <Select
                        value={newRequirement.type || ''}
                        label="Loại Requirement"
                        onChange={(e) => setNewRequirement({...newRequirement, type: e.target.value})}
                      >
                        <MenuItem value="RFI">RFI</MenuItem>
                        <MenuItem value="Bank">Bank</MenuItem>
                        <MenuItem value="Industry">Industry</MenuItem>
                        <MenuItem value="Client">Client</MenuItem>
                        <MenuItem value="Internal">Internal</MenuItem>
                      </Select>
                    </FormControl>
                    <Box sx={{ display: 'flex', gap: 2, mt: 2, flexWrap: 'wrap' }}>
                      <Autocomplete
                        options={customers}
                        value={newRequirement.customer || null}
                        onChange={(_, newValue) => setNewRequirement({...newRequirement, customer: newValue || ''})}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Khách hàng"
                            size="small"
                            sx={{ minWidth: 250, flex: 1 }}
                            required
                          />
                        )}
                      />
                      <Autocomplete
                        options={assignees}
                        value={newRequirement.assignee || null}
                        onChange={(_, newValue) => setNewRequirement({...newRequirement, assignee: newValue || ''})}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Người phụ trách"
                            size="small"
                            sx={{ minWidth: 250 }}
                            required
                          />
                        )}
                      />
                      <TextField
                        label="Hạn chót"
                        type="date"
                        size="small"
                        sx={{ minWidth: 200 }}
                        value={newRequirement.expectedDeadline || ''}
                        onChange={(e) => setNewRequirement({...newRequirement, expectedDeadline: e.target.value})}
                        InputLabelProps={{
                          shrink: true,
                        }}
                        required
                      />
                    </Box>
                  </CardContent>
                </Card>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                  <Button
                    variant="contained"
                    onClick={handleNext}
                    disabled={!isStep1Valid()}
                  >
                    Tiếp theo
                  </Button>
                </Box>
              </StepContent>
            </Step>
            
            {/* Step 2: Requirement Creation Method */}
            <Step>
              <StepLabel>
                <Typography variant="subtitle1">Chọn cách tạo yêu cầu</Typography>
              </StepLabel>
              <StepContent>
                <Card variant="outlined" sx={{ mb: 2 }}>
                  <CardContent>
                    <FormControl component="fieldset" sx={{ mb: 2 }}>
                      <FormLabel component="legend">Cách tạo</FormLabel>
                      <RadioGroup 
                        row 
                        value={creationMethod} 
                        onChange={(e) => setCreationMethod(e.target.value as 'manual' | 'upload')}
                      >
                        <FormControlLabel value="manual" control={<Radio />} label="Nhập mô tả thủ công" />
                        <FormControlLabel value="upload" control={<Radio />} label="Upload file đặc tả (.pdf, .docx)" />
                      </RadioGroup>
                    </FormControl>
                    
                    {creationMethod === 'manual' ? (
                      <TextField
                        multiline
                        rows={4}
                        fullWidth
                        placeholder="Ví dụ: Tôi cần một hệ thống quản lý kho với chức năng nhập xuất tồn, cảnh báo tồn kho tối thiểu..."
                        variant="outlined"
                        sx={{ mb: 2 }}
                        value={newRequirement.description || ''}
                        onChange={(e) => setNewRequirement({...newRequirement, description: e.target.value})}
                      />
                    ) : (
                      <Box sx={{ border: '1px dashed #ccc', p: 3, borderRadius: 1, textAlign: 'center', mb: 2 }}>
                        <input
                          accept=".pdf,.docx"
                          style={{ display: 'none' }}
                          id="file-upload"
                          type="file"
                          onChange={(e) => {
                            // Xử lý file upload ở đây
                            if (e.target.files && e.target.files[0]) {
                              // Giả lập việc xử lý file và tạo mô tả
                              setTimeout(() => {
                                setNewRequirement({
                                  ...newRequirement,
                                  description: `Mô tả được tạo từ file ${e.target.files?.[0].name}`
                                });
                              }, 1000);
                            }
                          }}
                        />
                        <label htmlFor="file-upload">
                          <Button 
                            variant="outlined" 
                            component="span"
                          >
                            Chọn file (.pdf, .docx)
                          </Button>
                        </label>
                        <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>
                          Hỗ trợ file .pdf, .docx
                        </Typography>
                      </Box>
                    )}
                  </CardContent>
                </Card>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                  <Button onClick={handleBack}>Quay lại</Button>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={generateAIResponse}
                    disabled={!isStep2Valid() || isLoading}
                    startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : null}
                  >
                    {isLoading ? 'Đang xử lý...' : 'Tạo yêu cầu tự động (AI)'}
                  </Button>
                </Box>
              </StepContent>
            </Step>
          </Stepper>
          
          
          {showAiResult && activeStep === 1 && (
            <Box ref={aiResultRef} sx={{ mt: 2, mb: 3, border: '1px solid #e0e0e0', borderRadius: 1, p: 2 }}>
              <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span>Kết quả phân tích từ AI:</span>
                <Button 
                  variant="outlined" 
                  size="small"
                  startIcon={<RefreshIcon />}
                  onClick={handleRegenerate}
                >
                  Tạo lại
                </Button>
              </Typography>
              <Typography variant="body1" gutterBottom>
                {aiDescription}
              </Typography>
              
              <Box sx={{ borderBottom: 1, borderColor: 'divider', mt: 2 }}>
                <Tabs 
                  value={currentTab} 
                  onChange={(e, newValue) => setCurrentTab(newValue)}
                  variant="scrollable"
                  scrollButtons="auto"
                >
                  <Tab label="Yêu cầu chức năng" />
                  <Tab label="Yêu cầu phi chức năng" />
                  <Tab label="Yêu cầu kiểm thử" />
                  <Tab label="UI Mockup/mô tả" />
                  <Tab label="Mô hình dữ liệu" />
                  <Tab label="Yêu cầu tích hợp" />
                </Tabs>
              </Box>
              
              {/* Tab 0: Yêu cầu chức năng */}
              {currentTab === 0 && (
                <TableContainer component={Paper} sx={{ mt: 2 }}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold', width: '20%' }}>Feature</TableCell>
                        <TableCell sx={{ fontWeight: 'bold', width: '20%' }}>Detail</TableCell>
                        <TableCell sx={{ fontWeight: 'bold', width: '40%' }}>Description</TableCell>
                        <TableCell sx={{ fontWeight: 'bold', width: '15%' }}>Notes</TableCell>
                        <TableCell sx={{ width: '5%' }}></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {aiFeatures.map((feature) => (
                        <TableRow key={feature.id} hover>
                          <TableCell 
                            onClick={() => {
                              setEditingFeature(feature);
                              setEditingField('feature');
                              setEditingValue(feature.feature);
                            }}
                            sx={{ cursor: 'pointer' }}
                          >
                            {editingFeature?.id === feature.id && editingField === 'feature' ? (
                              <TextField
                                size="small"
                                fullWidth
                                variant="standard"
                                value={editingValue}
                                onChange={(e) => setEditingValue(e.target.value)}
                                onBlur={() => {
                                  handleEditCell(feature, 'feature', editingValue);
                                  setEditingFeature(null);
                                  setEditingField(null);
                                }}
                                onKeyPress={(e) => {
                                  if (e.key === 'Enter') {
                                    handleEditCell(feature, 'feature', editingValue);
                                    setEditingFeature(null);
                                    setEditingField(null);
                                  }
                                }}
                                autoFocus
                              />
                            ) : (
                              feature.feature
                            )}
                          </TableCell>
                          <TableCell
                            onClick={() => {
                              setEditingFeature(feature);
                              setEditingField('detail');
                              setEditingValue(feature.detail);
                            }}
                            sx={{ cursor: 'pointer' }}
                          >
                            {editingFeature?.id === feature.id && editingField === 'detail' ? (
                              <TextField
                                size="small"
                                fullWidth
                                variant="standard"
                                value={editingValue}
                                onChange={(e) => setEditingValue(e.target.value)}
                                onBlur={() => {
                                  handleEditCell(feature, 'detail', editingValue);
                                  setEditingFeature(null);
                                  setEditingField(null);
                                }}
                                onKeyPress={(e) => {
                                  if (e.key === 'Enter') {
                                    handleEditCell(feature, 'detail', editingValue);
                                    setEditingFeature(null);
                                    setEditingField(null);
                                  }
                                }}
                                autoFocus
                              />
                            ) : (
                              feature.detail
                            )}
                          </TableCell>
                          <TableCell
                            onClick={() => {
                              setEditingFeature(feature);
                              setEditingField('description');
                              setEditingValue(feature.description);
                            }}
                            sx={{ cursor: 'pointer' }}
                          >
                            {editingFeature?.id === feature.id && editingField === 'description' ? (
                              <TextField
                                size="small"
                                fullWidth
                                variant="standard"
                                value={editingValue}
                                onChange={(e) => setEditingValue(e.target.value)}
                                onBlur={() => {
                                  handleEditCell(feature, 'description', editingValue);
                                  setEditingFeature(null);
                                  setEditingField(null);
                                }}
                                onKeyPress={(e) => {
                                  if (e.key === 'Enter') {
                                    handleEditCell(feature, 'description', editingValue);
                                    setEditingFeature(null);
                                    setEditingField(null);
                                  }
                                }}
                                autoFocus
                              />
                            ) : (
                              feature.description
                            )}
                          </TableCell>
                          <TableCell>{feature.notes}</TableCell>
                          <TableCell>
                            <IconButton 
                              size="small" 
                              color="error"
                              onClick={() => handleDeleteRow(feature.id)}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                    <TableFooter>
                      <TableRow>
                        <TableCell colSpan={5} align="center">
                          <Button 
                            startIcon={<AddIcon />} 
                            onClick={handleAddNewRow}
                            size="small"
                            sx={{ mr: 1 }}
                          >
                            Thêm dòng mới
                          </Button>
                        </TableCell>
                      </TableRow>
                    </TableFooter>
                  </Table>
                </TableContainer>
              )}
              
              {/* Tab 1: Yêu cầu phi chức năng */}
              {currentTab === 1 && (
                <TableContainer component={Paper} sx={{ mt: 2 }}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold', width: '30%' }}>Loại yêu cầu</TableCell>
                        <TableCell sx={{ fontWeight: 'bold', width: '70%' }}>Chi tiết</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {nonFunctionalRequirements.map((req) => (
                        <TableRow key={req.id} hover>
                          <TableCell>{req.key}</TableCell>
                          <TableCell>{req.value}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
              
              {/* Tab 2: Yêu cầu kiểm thử */}
              {currentTab === 2 && (
                <TableContainer component={Paper} sx={{ mt: 2 }}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold', width: '30%' }}>Test case</TableCell>
                        <TableCell sx={{ fontWeight: 'bold', width: '30%' }}>Điều kiện</TableCell>
                        <TableCell sx={{ fontWeight: 'bold', width: '40%' }}>Kết quả mong đợi</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {testRequirements.map((test) => (
                        <TableRow key={test.id} hover>
                          <TableCell>{test.testCase}</TableCell>
                          <TableCell>{test.condition}</TableCell>
                          <TableCell>{test.expectedResult}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
              
              {/* Tab 3: UI Mockup/mô tả */}
              {currentTab === 3 && (
                <Box sx={{ mt: 2 }}>
                  <List>
                    {uiMockups.map((mockup) => (
                      <ListItem key={mockup.id} divider>
                        <ListItemText 
                          primary={mockup.description}
                          secondary={
                            mockup.figmaLink && (
                              <Link href={mockup.figmaLink} target="_blank" rel="noopener">
                                Xem thiết kế trên Figma
                              </Link>
                            )
                          }
                        />
                      </ListItem>
                    ))}
                  </List>
                </Box>
              )}
              
              {/* Tab 4: Mô hình dữ liệu */}
              {currentTab === 4 && (
                <TableContainer component={Paper} sx={{ mt: 2 }}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold', width: '20%' }}>Thực thể</TableCell>
                        <TableCell sx={{ fontWeight: 'bold', width: '40%' }}>Trường dữ liệu</TableCell>
                        <TableCell sx={{ fontWeight: 'bold', width: '40%' }}>Mô tả</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {dataModelEntities.map((entity) => (
                        <TableRow key={entity.id} hover>
                          <TableCell>{entity.entityName}</TableCell>
                          <TableCell>
                            <code>{entity.fields}</code>
                          </TableCell>
                          <TableCell>{entity.description}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
              
              {/* Tab 5: Yêu cầu tích hợp */}
              {currentTab === 5 && (
                <TableContainer component={Paper} sx={{ mt: 2 }}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold', width: '30%' }}>Hệ thống</TableCell>
                        <TableCell sx={{ fontWeight: 'bold', width: '30%' }}>Phương thức</TableCell>
                        <TableCell sx={{ fontWeight: 'bold', width: '40%' }}>Mục đích</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {integrationRequirements.map((integration) => (
                        <TableRow key={integration.id} hover>
                          <TableCell>{integration.system}</TableCell>
                          <TableCell>{integration.method}</TableCell>
                          <TableCell>{integration.purpose}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2, gap: 1 }}>
                <Button 
                  variant="contained" 
                  color="primary"
                  startIcon={<SaveIcon />}
                  onClick={handleSaveRequirement}
                >
                  Xác nhận & Lưu
                </Button>
              </Box>
            </Box>
          )}
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default RequirementForm;
