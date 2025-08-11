/**
 * Mock data and functions to simulate AI contract generation
 */

/**
 * Generate a mock contract based on the provided prompt
 * @param prompt User's input prompt
 * @returns Generated contract content
 */
export const mockGenerateContract = (prompt: string): string => {
  // Extract key information from prompt (in a real implementation, this would be done by AI)
  const companyNames = extractCompanyNames(prompt);
  const contractType = extractContractType(prompt);
  const contractValue = extractContractValue(prompt);
  const contractDuration = extractContractDuration(prompt);
  
  // Generate contract based on extracted information
  return `
HỢP ĐỒNG ${contractType.toUpperCase()}

Số: ${Math.floor(Math.random() * 1000)}/2025/HĐDV

GIỮA

${companyNames.party1 || 'CÔNG TY CỔ PHẦN ITV'} (Bên A)

VÀ

${companyNames.party2 || 'CÔNG TY ABC'} (Bên B)

Hôm nay, ngày ${new Date().getDate()} tháng ${new Date().getMonth() + 1} năm ${new Date().getFullYear()}, tại Thành phố Hồ Chí Minh, chúng tôi gồm:

BÊN A: ${companyNames.party1 || 'CÔNG TY CỔ PHẦN ITV'}
- Địa chỉ: 123 Đường Nguyễn Văn Linh, Quận 7, TP.HCM
- Điện thoại: 028.1234.5678
- Mã số thuế: 0123456789
- Đại diện: Ông Nguyễn Văn A
- Chức vụ: Giám đốc

BÊN B: ${companyNames.party2 || 'CÔNG TY ABC'}
- Địa chỉ: 456 Đường Lê Lợi, Quận 1, TP.HCM
- Điện thoại: 028.8765.4321
- Mã số thuế: 9876543210
- Đại diện: Bà Trần Thị B
- Chức vụ: Giám đốc

Sau khi bàn bạc, hai bên thống nhất ký kết Hợp đồng ${contractType} với các điều khoản sau:

ĐIỀU 1: NỘI DUNG HỢP ĐỒNG

1.1. Bên A đồng ý cung cấp cho Bên B dịch vụ ${contractType} theo các yêu cầu và tiêu chuẩn được quy định trong Phụ lục đính kèm Hợp đồng này.

1.2. Bên B đồng ý sử dụng dịch vụ và thanh toán cho Bên A theo quy định tại Hợp đồng này.

ĐIỀU 2: GIÁ TRỊ HỢP ĐỒNG VÀ PHƯƠNG THỨC THANH TOÁN

2.1. Tổng giá trị hợp đồng: ${contractValue || '500.000.000 VNĐ (Năm trăm triệu đồng)'}.

2.2. Phương thức thanh toán: Thanh toán theo từng giai đoạn như sau:
   - Đợt 1: 30% giá trị hợp đồng, tương đương ${calculatePercentage(contractValue, 30)} - Thanh toán sau khi ký hợp đồng.
   - Đợt 2: 40% giá trị hợp đồng, tương đương ${calculatePercentage(contractValue, 40)} - Thanh toán sau khi hoàn thành giai đoạn 1.
   - Đợt 3: 30% giá trị hợp đồng, tương đương ${calculatePercentage(contractValue, 30)} - Thanh toán sau khi nghiệm thu và bàn giao.

2.3. Hình thức thanh toán: Chuyển khoản ngân hàng.

ĐIỀU 3: THỜI GIAN THỰC HIỆN

3.1. Thời gian thực hiện hợp đồng: ${contractDuration || '6 tháng'} kể từ ngày ký.

3.2. Lịch trình thực hiện chi tiết được quy định trong Phụ lục đính kèm.

ĐIỀU 4: QUYỀN VÀ NGHĨA VỤ CỦA BÊN A

4.1. Quyền của Bên A:
   - Yêu cầu Bên B thanh toán đúng hạn theo quy định tại Hợp đồng.
   - Yêu cầu Bên B cung cấp thông tin, tài liệu cần thiết để thực hiện Hợp đồng.

4.2. Nghĩa vụ của Bên A:
   - Cung cấp dịch vụ đúng tiến độ và chất lượng theo thỏa thuận.
   - Bảo mật thông tin của Bên B trong quá trình thực hiện Hợp đồng.

ĐIỀU 5: QUYỀN VÀ NGHĨA VỤ CỦA BÊN B

5.1. Quyền của Bên B:
   - Yêu cầu Bên A cung cấp dịch vụ đúng tiến độ và chất lượng.
   - Được cung cấp thông tin về tiến độ thực hiện dự án.

5.2. Nghĩa vụ của Bên B:
   - Thanh toán đầy đủ và đúng hạn cho Bên A.
   - Cung cấp thông tin, tài liệu cần thiết cho Bên A để thực hiện Hợp đồng.

ĐIỀU 6: ĐIỀU KHOẢN CHUNG

6.1. Hợp đồng này có hiệu lực kể từ ngày ký và sẽ chấm dứt sau khi hai bên hoàn thành nghĩa vụ.

6.2. Mọi tranh chấp phát sinh sẽ được giải quyết thông qua thương lượng. Trường hợp không thể thương lượng được, tranh chấp sẽ được đưa ra Tòa án có thẩm quyền để giải quyết.

6.3. Hợp đồng này được lập thành 04 bản, mỗi bên giữ 02 bản có giá trị pháp lý như nhau.

ĐẠI DIỆN BÊN A                                  ĐẠI DIỆN BÊN B
`;
};

// Helper functions to extract information from the prompt
const extractCompanyNames = (prompt: string): { party1: string; party2: string } => {
  const party1 = prompt.includes('ITV') ? 'CÔNG TY CỔ PHẦN ITV' : '';
  
  // Try to extract company name after "và Công ty" or "và"
  let party2 = '';
  const companyMatch = prompt.match(/(?:và|giữa)(?:\s+Công\s+ty)?\s+([A-Za-z0-9\s]+)(?:,|\.|$)/i);
  if (companyMatch && companyMatch[1]) {
    party2 = `CÔNG TY ${companyMatch[1].trim().toUpperCase()}`;
  }
  
  return { party1, party2 };
};

const extractContractType = (prompt: string): string => {
  if (prompt.toLowerCase().includes('phát triển phần mềm')) {
    return 'phát triển phần mềm';
  } else if (prompt.toLowerCase().includes('dịch vụ phần mềm')) {
    return 'dịch vụ phần mềm';
  } else if (prompt.toLowerCase().includes('bảo trì')) {
    return 'bảo trì phần mềm';
  } else if (prompt.toLowerCase().includes('thương mại')) {
    return 'thương mại';
  } else if (prompt.toLowerCase().includes('nda') || prompt.toLowerCase().includes('bảo mật')) {
    return 'bảo mật thông tin (NDA)';
  } else {
    return 'dịch vụ';
  }
};

const extractContractValue = (prompt: string): string => {
  // Try to extract monetary values (e.g., 500 triệu, 1 tỷ)
  const valueMatch = prompt.match(/(\d+(?:\.\d+)?)\s*(triệu|tỷ|trieu|ty)/i);
  if (valueMatch) {
    const value = parseFloat(valueMatch[1]);
    const unit = valueMatch[2].toLowerCase();
    
    if (unit === 'tỷ' || unit === 'ty') {
      return `${value.toLocaleString('vi-VN')}.000.000.000 VNĐ (${value} tỷ đồng)`;
    } else {
      return `${value.toLocaleString('vi-VN')}.000.000 VNĐ (${value} triệu đồng)`;
    }
  }
  
  return '500.000.000 VNĐ (Năm trăm triệu đồng)';
};

const extractContractDuration = (prompt: string): string => {
  // Try to extract time duration (e.g., 6 tháng, 1 năm)
  const durationMatch = prompt.match(/(\d+)\s*(tháng|năm|thang|nam)/i);
  if (durationMatch) {
    const duration = parseInt(durationMatch[1]);
    const unit = durationMatch[2].toLowerCase();
    
    if (unit === 'năm' || unit === 'nam') {
      return `${duration} năm`;
    } else {
      return `${duration} tháng`;
    }
  }
  
  return '6 tháng';
};

const calculatePercentage = (value: string, percentage: number): string => {
  // Extract numeric value from contract value string
  const numericMatch = value ? value.match(/(\d+(?:\.\d+)?)/g) : null;
  
  if (numericMatch && numericMatch.length > 0) {
    const numericValue = parseFloat(numericMatch[0].replace(/\./g, ''));
    const result = (numericValue * percentage / 100).toLocaleString('vi-VN');
    return `${result}.000 VNĐ`;
  }
  
  // Default values if extraction fails
  const defaultValues: Record<number, string> = {
    30: '150.000.000 VNĐ',
    40: '200.000.000 VNĐ',
    50: '250.000.000 VNĐ'
  };
  
  return defaultValues[percentage] || `${percentage}% giá trị hợp đồng`;
};
