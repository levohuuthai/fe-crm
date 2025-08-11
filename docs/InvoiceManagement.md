# 🧾 Invoice Management – UI Update Spec

## 1. Mục tiêu cập nhật

Bổ sung tính năng:
- Quản lý hoá đơn đầy đủ (CRUD)
- Tạo mẫu hoá đơn với nhiều loại khác nhau
- Tạo hoá đơn từ mẫu hoặc tự tạo
- Theo dõi trạng thái thanh toán chi tiết
- Liên kết với biên bản nghiệm thu và phụ lục hợp đồng
- Quản lý lịch sử thanh toán và nhắc nhở

---

## 2. 📄 Tab: Mẫu Hoá Đơn

### 🧩 UI Components

| Mã | Tên mẫu hoá đơn | Mô tả | Loại | Ngày tạo | Trạng thái | Hành động |
|----|-------------------|-------|------|-----------|------------|-----------|  
| INV-T001 | Nhập tay | Text | Tiêu chuẩn / VAT / Xuất khẩu | Date picker | Hoạt động / Ngưng | [+] Sửa / Xoá / Xem |

- 🔍 **Search bar**: Tìm kiếm theo tên mẫu hoặc mã mẫu
- 🧰 **Bộ lọc**:
  - Loại mẫu: Tiêu chuẩn / VAT / Xuất khẩu / Tất cả
  - Trạng thái: Hoạt động / Ngưng / Tất cả
- 🔘 Nút: `+ Tạo mẫu hoá đơn mới`

### 📝 Giao diện: Tạo Mẫu Hoá Đơn

| Field | Loại input | Mô tả |
|-------|------------|-------|
| Tên mẫu hoá đơn | Text input | Tên định danh cho mẫu hoá đơn |
| Mô tả | Textarea | Mô tả chi tiết về mục đích và cách sử dụng mẫu |
| Loại | Dropdown | Tiêu chuẩn / VAT / Xuất khẩu / Khác |
| Trạng thái | Checkbox | Hoạt động / Ngưng hoạt động |
| Cấu trúc mẫu | Form builder | Công cụ kéo thả để tạo cấu trúc mẫu hoá đơn |
| Thuế suất mặc định | Dropdown | 0%, 5%, 8%, 10% |
| Điều khoản thanh toán | Textarea | Điều khoản mặc định về thời hạn và phương thức thanh toán |
| Thông tin tài khoản | Form | Thông tin tài khoản ngân hàng nhận thanh toán |
| Ghi chú mẫu | Textarea | Ghi chú bổ sung cho mẫu hoá đơn |

- 📎 Có thể upload file mẫu (PDF, DOCX, Excel)
- 🎨 Tuỳ chỉnh giao diện mẫu (màu sắc, logo, font chữ)
- 🔘 Nút: `Lưu mẫu`, `Xem trước`, `Huỷ`

### 🔍 Giao diện: Xem Chi Tiết Mẫu

- Hiển thị tất cả thông tin của mẫu hoá đơn
- Cho phép xem trước mẫu hoá đơn với dữ liệu mẫu
- Hiển thị số lượng hoá đơn đã được tạo từ mẫu này
- Nút hành động: `Sửa mẫu`, `Tạo hoá đơn từ mẫu này`, `Xoá mẫu`

---

## 3. 📄 Tab: Quản Lý Hoá Đơn

### 🧩 UI Components

| Mã HD | Tên hoá đơn | Mã HĐ/PL/NT | Khách hàng | Ngày lập | Hạn thanh toán | Giá trị | Đã thanh toán | Còn lại | Trạng thái | Hành động |
|-------|------------|-------------|------------|----------|----------------|---------|--------------|---------|------------|-----------|  
| INV001 | Text | HĐ001/PL001/NT001 | Text | Date | Date | Currency | Currency | Currency | Chưa TT / TT một phần / Đã TT / Quá hạn | [+] Sửa / Xoá / Xem / Thanh toán |

- 🔍 **Search bar**: Tìm theo mã hoá đơn, tên hoá đơn, mã hợp đồng hoặc khách hàng
- 🧰 **Bộ lọc nâng cao**:
  - Trạng thái thanh toán: Chưa thanh toán / Đã thanh toán một phần / Đã thanh toán / Quá hạn
  - Khách hàng: Dropdown với tìm kiếm
  - Nguồn liên kết: Hợp đồng / Phụ lục / Nghiệm thu / Không liên kết
  - Thời gian lập: Date range picker
  - Thời gian thanh toán: Date range picker
  - Giá trị: Range slider
  - Loại hoá đơn: Tiêu chuẩn / VAT / Xuất khẩu / Tất cả
- 📊 **Dashboard tổng quan**:
  - Tổng số hoá đơn: [Số lượng]
  - Tổng giá trị: [Currency]
  - Đã thanh toán: [Currency] ([%])
  - Chưa thanh toán: [Currency] ([%])
  - Quá hạn: [Số lượng] ([Currency])
- 🔘 Nút: `+ Tạo hoá đơn mới`

### 📝 Giao diện: Tạo Hoá Đơn

#### Bước 1: Chọn cách tạo
- 🔘 Sử dụng mẫu hoá đơn (dropdown chọn mẫu)
- 🔘 Tạo mới thủ công
- 🔘 Tạo từ nguồn (chọn một trong các nguồn):
  - Hợp đồng (dropdown chọn hợp đồng)
  - Phụ lục hợp đồng (dropdown chọn phụ lục)
  - Biên bản nghiệm thu (dropdown chọn nghiệm thu đã ký)

#### Bước 2: Điền thông tin (tuỳ vào bước 1)

| Field | Loại input | Mô tả | Liên kết với phụ lục |
|-------|------------|-------|----------------------|
| Tên hoá đơn | Text input | Tên mô tả hoá đơn | Tự động lấy từ phụ lục nếu được chọn |
| Mã hoá đơn | Auto-generated + editable | Mã định danh hoá đơn | Tự động tạo với prefix từ phụ lục |
| Nguồn liên kết | Dropdown | Chọn hợp đồng/phụ lục/nghiệm thu | Hiển thị phụ lục đã chọn |
| Khách hàng | Dropdown | Tự động lấy từ liên kết hoặc chọn mới | Lấy từ thông tin phụ lục |
| Ngày lập | Date picker | Ngày lập hoá đơn | Mặc định là ngày hiện tại |
| Hạn thanh toán | Date picker | Hạn chót thanh toán hoá đơn | Tính từ điều khoản thanh toán trong phụ lục |
| Loại hoá đơn | Dropdown | Tiêu chuẩn / VAT / Xuất khẩu / Khác | Theo loại phụ lục |
| Thuế suất | Dropdown | 0%, 5%, 8%, 10% | Theo quy định trong phụ lục |
| Danh sách sản phẩm/dịch vụ | Dynamic table | Bảng cho phép thêm/xoá/sửa các mục | Tự động điền từ phụ lục |
| - Tên sản phẩm/dịch vụ | Text input | Mô tả sản phẩm/dịch vụ | |
| - Số lượng | Number input | Số lượng | |
| - Đơn giá | Currency input | Giá trên một đơn vị | |
| - Thành tiền | Auto-calculated | Số lượng × Đơn giá | |
| - Thuế | Dropdown | Thuế suất cho từng mục | |
| Tổng tiền trước thuế | Auto-calculated | Tự động tính từ danh sách sản phẩm | |
| Thuế VAT | Auto-calculated | Tự động tính theo thuế suất | |
| Chiết khấu | Currency input | Giảm giá (nếu có) | |
| Tổng cộng | Auto-calculated | Tổng tiền sau thuế và chiết khấu | |
| File đính kèm | Upload file | Upload hoá đơn có chữ ký hoặc tài liệu liên quan | |
| Ghi chú thanh toán | Textarea | Hướng dẫn thanh toán, thông tin tài khoản... | |
| Ghi chú nội bộ | Textarea | Ghi chú không hiển thị cho khách hàng | |

#### Hành động
- 💾 Lưu nháp: Lưu hoá đơn ở trạng thái nháp
- 📤 Gửi khách hàng: Gửi hoá đơn cho khách hàng qua email
- 📱 Gửi SMS: Gửi thông báo SMS cho khách hàng
- 🖨️ In hoá đơn: Xuất hoá đơn dạng PDF để in
- ❌ Huỷ: Quay lại màn hình danh sách

### 💰 Giao diện: Ghi Nhận Thanh Toán

| Field | Loại input | Mô tả |
|-------|------------|-------|
| Hoá đơn | Display | Hiển thị thông tin hoá đơn đang thanh toán |
| Tổng giá trị | Display | Tổng giá trị hoá đơn |
| Đã thanh toán | Display | Số tiền đã thanh toán trước đó |
| Còn lại | Display | Số tiền còn phải thanh toán |
| Số tiền thanh toán | Currency input | Số tiền thanh toán lần này |
| Ngày thanh toán | Date picker | Ngày thực hiện thanh toán |
| Phương thức | Dropdown | Chuyển khoản / Tiền mặt / Thẻ tín dụng / Ví điện tử |
| Thông tin giao dịch | Text input | Số tham chiếu, mã giao dịch... |
| Ghi chú | Textarea | Thông tin bổ sung về giao dịch |
| Chứng từ | Upload file | Upload biên lai, UNC, hoặc chứng từ thanh toán |

### 🔍 Giao diện: Xem Chi Tiết Hoá Đơn

- Hiển thị tất cả thông tin của hoá đơn
- Hiển thị thông tin liên kết (hợp đồng/phụ lục/nghiệm thu)
- Hiển thị lịch sử thanh toán chi tiết:
  | Ngày | Số tiền | Phương thức | Người ghi nhận | Chứng từ | Ghi chú |
  |------|---------|-------------|----------------|----------|--------|
  | Date | Currency | Text | Text | Link | Text |
- Hiển thị lịch sử gửi nhắc nhở:
  | Ngày gửi | Phương thức | Nội dung | Trạng thái |
  |----------|------------|---------|------------|
  | Date | Email/SMS | Text | Đã gửi/Lỗi |
- Cho phép tải xuống hoá đơn dạng PDF
- Nút hành động tuỳ theo trạng thái hiện tại:
  - Nếu chưa thanh toán: `Sửa`, `Ghi nhận thanh toán`, `Gửi nhắc nhở`, `Đánh dấu quá hạn`
  - Nếu đã thanh toán một phần: `Ghi nhận thanh toán tiếp`, `Gửi nhắc nhở`, `Điều chỉnh thanh toán`
  - Nếu đã thanh toán: `Xuất biên lai`, `Tạo bản sao`, `Đánh dấu hoàn thành`
  - Nếu quá hạn: `Ghi nhận thanh toán`, `Gửi nhắc nhở`, `Đánh dấu xử lý đặc biệt`

### 📊 Báo cáo và Thống kê

- **Báo cáo doanh thu**:
  - Theo thời gian (ngày/tuần/tháng/quý/năm)
  - Theo khách hàng
  - Theo loại hoá đơn
  - Theo nguồn (hợp đồng/phụ lục/nghiệm thu)
- **Báo cáo thanh toán**:
  - Tỷ lệ thanh toán đúng hạn
  - Thời gian thanh toán trung bình
  - Hoá đơn quá hạn và phân tích
- **Dự báo dòng tiền**:
  - Dự kiến thu trong 30/60/90 ngày tới
  - Phân tích xu hướng thanh toán

---

## 4. 🔄 Tích hợp với Phụ lục Hợp đồng

### Luồng tích hợp

1. **Tạo phụ lục hợp đồng**:
   - Khi một phụ lục hợp đồng được tạo và ký kết, hệ thống cho phép tạo hoá đơn trực tiếp từ phụ lục
   - Thông tin từ phụ lục sẽ được tự động điền vào hoá đơn

2. **Liên kết dữ liệu**:
   - Hoá đơn lưu trữ mã phụ lục liên kết
   - Phụ lục hiển thị thông tin hoá đơn đã tạo
   - Thay đổi trạng thái phụ lục có thể ảnh hưởng đến hoá đơn (ví dụ: huỷ phụ lục → đánh dấu hoá đơn cần xem xét)

3. **Điều kiện thanh toán**:
   - Điều kiện thanh toán từ phụ lục được áp dụng tự động cho hoá đơn
   - Hạn thanh toán được tính dựa trên ngày ký phụ lục và điều khoản thanh toán

4. **Giá trị và sản phẩm/dịch vụ**:
   - Giá trị và danh sách sản phẩm/dịch vụ từ phụ lục được tự động điền vào hoá đơn
   - Thuế suất áp dụng theo quy định trong phụ lục

### Giao diện tích hợp

- **Trong chi tiết phụ lục hợp đồng**:
  - Tab "Hoá đơn liên quan" hiển thị danh sách hoá đơn đã tạo từ phụ lục
  - Nút "Tạo hoá đơn" để tạo hoá đơn mới từ phụ lục

- **Trong chi tiết hoá đơn**:
  - Hiển thị thông tin phụ lục liên kết với link truy cập nhanh
  - Hiển thị trạng thái hiện tại của phụ lục

---

## 5. ⛳ Gợi ý mở rộng

- **Tích hợp xuất hoá đơn điện tử**:
  - Kết nối với các nhà cung cấp hoá đơn điện tử (VNPT, Viettel, FPT...)
  - Tự động xuất hoá đơn điện tử khi hoá đơn được tạo
  - Quản lý mã số hoá đơn điện tử và trạng thái

- **Hệ thống nhắc nhở thông minh**:
  - Tự động gửi email/SMS nhắc nhở trước hạn thanh toán
  - Lịch trình nhắc nhở tùy chỉnh (3 ngày, 1 ngày trước hạn, ngày đến hạn, sau hạn)
  - Mẫu nhắc nhở khác nhau tùy theo mức độ quá hạn

- **Tích hợp cổng thanh toán trực tuyến**:
  - Cho phép khách hàng thanh toán trực tuyến qua link
  - Hỗ trợ nhiều cổng thanh toán (VNPay, Momo, Ngân lượng...)
  - Tự động cập nhật trạng thái thanh toán khi giao dịch hoàn tất

- **Quản lý công nợ nâng cao**:
  - Phân tích tuổi nợ (Aging Analysis)
  - Đánh giá khả năng thanh toán của khách hàng
  - Cảnh báo rủi ro công nợ

- **Tự động hoá quy trình**:
  - Tự động tạo hoá đơn định kỳ cho các hợp đồng dài hạn
  - Tự động gửi báo cáo thanh toán định kỳ cho quản lý
  - Tích hợp với hệ thống kế toán
