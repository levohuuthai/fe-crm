# 🧾 Quotation Management UI Spec

---

## 1. 📋 Quotation List Screen

### 🧩 UI Elements

- 🔍 **Search bar**: Tìm theo tên báo giá hoặc tên khách hàng
- 🧰 **Bộ lọc trạng thái** (checkbox hoặc dropdown):
  - Draft
  - Đã gửi
  - Đã duyệt
  - Từ chối
- ➕ **Button**: "Tạo báo giá mới"
- 📄 **Bảng danh sách báo giá**:

| Tên báo giá | Khách hàng | Deal | Trạng thái | Ngày tạo | Tổng Effort (MD) | Tổng tiền | Hành động |
|-------------|-------------|------|------------|----------|------------------|-----------|-----------|

- Hành động gồm: Xem chi tiết, Tải PDF, Gửi Email

---

## 2. 📝 Màn hình: Tạo báo giá mới (Create Quotation)

### 🧩 Form thông tin báo giá

- **Tên báo giá**: Text input
- **Chọn khách hàng**: Dropdown
- **Chọn deal**: Dropdown (lọc theo khách hàng)
- **Chọn requirement**: Dropdown (lọc theo deal)
- **Trạng thái**: Hiển thị mặc định là `Draft`
- **Ghi chú**: Textarea (optional)
- **Button**: "Tiếp tục"

### 🔄 Luồng thao tác

- Khi chọn **Requirement**, hệ thống lấy dữ liệu từ mục quản lý requirement gồm:
  - Feature, Detail, Description, Note
- Nhấn **"Tiếp tục"** → Hiển thị **bảng Estimation ngay bên dưới**

---

## 3. 🧮 Bảng báo giá / Estimation Table

### 🧩 Bảng chi tiết estimation

| Feature | Detail | Description | Note | FE (MD) | BE (MD) | QC (MD) | PM (MD) | Tổng MD | Tổng MM |
|---------|--------|-------------|------|---------|---------|---------|---------|----------|----------|

- Dữ liệu cột trái (Feature đến Note): tự động fill từ requirement
- Người dùng điền effort (MD) cho từng vai trò
- **Tổng MD** = FE + BE + QC + PM (theo từng dòng)
- **Tổng MM** = Tổng MD / 20

### 📌 Các nút thao tác

- ➕ Thêm dòng mới
- 🗑️ Xoá dòng
- 💾 Lưu báo giá tạm
- 👁️‍🗨️ Xem trước PDF

---

## 4. 📄 Popup: Xem trước PDF & Xuất báo giá

### 🧩 UI Components

- **Header**:
  - Logo công ty
  - Tên khách hàng
  - Ngày tạo

- **Executive Summary**:
  - Sinh tự động bằng AI
  - Có thể chỉnh sửa nội dung

- **Bảng estimation**: Hiển thị lại từ bước 3

- **Tổng hợp**:
  - Tổng MD
  - Tổng MM
  - Đơn giá (unit price)
  - Tổng tiền (final cost)

- **Ghi chú bổ sung**: (optional)

### 🛠️ Action Buttons

- ✏️ Chỉnh sửa nội dung
- 💾 Lưu nháp
- 📤 Xuất PDF

### 🔄 Luồng thao tác

- Xem trước PDF cũng được sinh từ AI dựa vào bảng estimation nhé
- AI sinh nội dung PDF draft từ estimation
- Người dùng có thể chỉnh sửa phần mô tả, bảng giá, etc.
- Có thể **lưu nháp** hoặc **xuất PDF**
- Sau khi "Xuất PDF" → lưu báo giá vào hệ thống và chuyển trạng thái từ **Draft → Đã gửi**

---

# Update
Gửi báo giá qua Email (Estimation Email Sending Flow - Mockup)

Mục đích

Mô tả UI mockup (không có backend, không kết nối database) cho thao tác gửi báo giá (PDF chính thức) qua email cho khách hàng từ giao diện quản lý báo giá.

Vị trí thao tác trong giao diện

Trang: Quản lý báo giá / Estimation Management

Trong bảng danh sách báo giá có cột "Hành động" với các nút như:

📄 Xem PDF

✉️ Gửi mail (nút mở giao diện mockup popup)

Khi người dùng nhấn nút "✉️ Gửi mail"

Giao diện mockup: Popup (Modal) hoặc Side Panel hiển thị với các thành phần UI như sau:

Tiêu đề: Gửi báo giá cho khách hàng

Thành phần

Mô tả hiển thị trên UI mockup

To (Email)

Input field, giả lập giá trị tự động điền (cho phép chỉnh sửa)

CC (Tùy chọn)

Input field để người dùng thêm email CC nếu muốn

Subject

Input field hiển thị subject mặc định, có thể chỉnh sửa

File đính kèm

Text hiển thị tên file PDF giả lập, có nút icon 👁️ để "xem trước"

Xem trước PDF

Nút icon 👁️ mở popup giả lập chứa file PDF (không cần render thật)

Nội dung Email

Textarea chứa nội dung mẫu email có thể chỉnh sửa

Nội dung email mặc định hiển thị:
Kính gửi Anh/Chị {{Tên khách hàng}},

Innotech Vietnam xin gửi Anh/Chị báo giá cho dịch vụ {{Tên dịch vụ}} như đính kèm.

Nếu cần thêm thông tin, xin vui lòng liên hệ chúng tôi.

Trân trọng,  
{{Tên nhân viên phụ trách}}