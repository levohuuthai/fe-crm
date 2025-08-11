# ✅ Acceptance Report (Nghiệm Thu) Management – UI Update Spec

## 1. Mục tiêu cập nhật

Bổ sung tính năng:
- Quản lý biên bản nghiệm thu đầy đủ (CRUD)
- Tạo mẫu biên bản nghiệm thu với nhiều loại khác nhau
- Tạo biên bản nghiệm thu từ mẫu hoặc tự tạo
- Theo dõi trạng thái nghiệm thu chi tiết
- Liên kết chặt chẽ với phụ lục hợp đồng
- Tự động hoá quy trình từ nghiệm thu đến hoá đơn

---

## 2. 📄 Tab: Mẫu Biên Bản Nghiệm Thu

### 🧩 UI Components

| Mã | Tên mẫu nghiệm thu | Mô tả | Loại | Ngày tạo | Trạng thái | Hành động |
|----|-------------------|-------|------|-----------|------------|-----------|  
| AT001 | Nhập tay | Text | Đầy đủ / Đơn giản / Giai đoạn | Date picker | Hoạt động / Ngưng | [+] Sửa / Xoá / Xem |

- 🔍 **Search bar**: Tìm kiếm theo tên mẫu hoặc mã mẫu
- 🧰 **Bộ lọc**:
  - Loại mẫu: Đầy đủ / Đơn giản / Giai đoạn / Tất cả
  - Trạng thái: Hoạt động / Ngưng / Tất cả
- 🔘 Nút: `+ Tạo mẫu nghiệm thu mới`

### 📝 Giao diện: Tạo Mẫu Biên Bản Nghiệm Thu

| Field | Loại input | Mô tả |
|-------|------------|-------|
| Tên mẫu nghiệm thu | Text input | Tên định danh cho mẫu nghiệm thu |
| Mã mẫu | Text input | Mã định danh (tự động tạo hoặc nhập tay) |
| Mô tả | Textarea | Mô tả chi tiết về mục đích và cách sử dụng mẫu |
| Loại | Dropdown | Đầy đủ / Đơn giản / Giai đoạn / Khác |
| Áp dụng cho | Dropdown | Tất cả hợp đồng / Dự án / Dịch vụ / Sản phẩm |
| Trạng thái | Checkbox | Hoạt động / Ngưng hoạt động |
| Cấu trúc mẫu | Form builder | Công cụ kéo thả để tạo cấu trúc mẫu nghiệm thu |
| Nội dung mẫu | Rich text editor | Trình soạn thảo văn bản định dạng |
| Tiêu chí nghiệm thu | Dynamic table | Bảng cho phép thêm/xoá/sửa các tiêu chí |
| Yêu cầu chữ ký | Checkbox group | Chọn các bên cần ký (khách hàng, nội bộ, đối tác) |
| Hướng dẫn sử dụng | Textarea | Hướng dẫn cách điền và sử dụng mẫu |

- 📎 Có thể upload file mẫu (PDF, DOCX, Excel)
- 🎨 Tuỳ chỉnh giao diện mẫu (màu sắc, logo, font chữ)
- 🔘 Nút: `Lưu mẫu`, `Xem trước`, `Huỷ`

### 🔍 Giao diện: Xem Chi Tiết Mẫu

- Hiển thị tất cả thông tin của mẫu nghiệm thu
- Cho phép xem trước mẫu nghiệm thu với dữ liệu mẫu
- Hiển thị số lượng biên bản đã được tạo từ mẫu này
- Nút hành động: `Sửa mẫu`, `Tạo nghiệm thu từ mẫu này`, `Xoá mẫu`

---

## 3. 📄 Tab: Biên Bản Nghiệm Thu

### 🧩 UI Components

| Mã NT | Tên nghiệm thu | Mã HĐ | Tên hợp đồng | Phụ lục | Ngày nghiệm thu | Giá trị | Trạng thái | Người ký | Hành động |
|-------|---------------|-------|--------------|---------|-----------------|------------|----------|-----------|  
| NT001 | Text | HĐ001 | Text | PL001 (nếu có) | Date | Draft / Pending / Signed / Rejected | Text | [+] Sửa / Xoá / Xem / Ký |

- 🔍 **Search bar**: Tìm theo tên hoặc mã biên bản nghiệm thu
- 🧰 **Bộ lọc**:
  - Trạng thái: Bản nháp / Chờ ký / Đã ký / Từ chối
  - Hợp đồng: Dropdown
  - Thời gian: Date range picker
- 🔘 Nút: `+ Tạo nghiệm thu mới`

### 📝 Giao diện: Tạo Biên Bản Nghiệm Thu

#### Bước 1: Chọn cách tạo
- 🔘 Sử dụng mẫu nghiệm thu (dropdown chọn mẫu)
- 🔘 Tạo mới thủ công

#### Bước 2: Điền thông tin (tuỳ vào bước 1)

| Field | Loại input | Mô tả |
|-------|------------|-------|
| Tên nghiệm thu | Text input | Tên biên bản nghiệm thu |
| Hợp đồng liên kết | Dropdown | Chọn hợp đồng cần nghiệm thu |
| Phụ lục liên kết | Dropdown | Optional, chọn phụ lục (nếu có) |
| Nội dung nghiệm thu | Rich text | Editor cho phép định dạng văn bản |
| Ngày nghiệm thu | Date picker | Ngày thực hiện nghiệm thu |
| Người nghiệm thu | Dropdown | Chọn từ danh sách nhân viên |
| Đại diện khách hàng | Text input | Người đại diện bên khách hàng |
| File đính kèm | Upload file | Upload BBNT có chữ ký hoặc tài liệu liên quan |
| Ghi chú nội bộ | Textarea | Optional, ghi chú không hiển thị cho khách hàng |

#### Hành động
- 💾 Lưu nháp: Lưu biên bản ở trạng thái nháp
- 📤 Gửi khách hàng: Chuyển trạng thái sang chờ ký
- ✍️ Ký nghiệm thu: Hoàn tất biên bản với chữ ký
- ❌ Huỷ: Quay lại màn hình danh sách

### 🔍 Giao diện: Xem Chi Tiết Nghiệm Thu

- Hiển thị tất cả thông tin của biên bản nghiệm thu
- Hiển thị lịch sử thay đổi trạng thái
- Cho phép tải xuống file đính kèm
- Nút hành động tuỳ theo trạng thái hiện tại:
  - Nếu là bản nháp: `Sửa`, `Gửi khách hàng`, `Xoá`
  - Nếu đang chờ ký: `Nhắc nhở`, `Ký`, `Huỷ yêu cầu`
  - Nếu đã ký: `Xem chữ ký`, `Tạo bản sao`

---

## 4. ⛳ Gợi ý mở rộng

- Tích hợp chữ ký điện tử cho biên bản nghiệm thu
- Gửi email thông báo tự động khi trạng thái thay đổi
- Tạo báo cáo thống kê về tình trạng nghiệm thu theo thời gian
- Cho phép xuất biên bản nghiệm thu ra nhiều định dạng (PDF, DOCX, Excel)
- Tích hợp với hệ thống thanh toán để tự động tạo hoá đơn sau khi nghiệm thu
