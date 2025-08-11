# 📎 Appendix Contract – UI Update Spec

## 1. Mục tiêu cập nhật

Bổ sung tính năng:
- Tạo mẫu phụ lục hợp đồng
- Tạo phụ lục hợp đồng từ mẫu hoặc tự tạo

---

## 2. 📄 Tab: Mẫu Phụ Lục Hợp Đồng

### 🧩 UI Components

| Mã | Tên mẫu phụ lục | Mô tả | Loại | Ngày tạo | Trạng thái | Hành động |
|----|------------------|-------|------|-----------|-------------|-----------|
| Tự động | Nhập tay | Text | extension / value | Date picker | Hoạt động / Ngưng | [+] Sửa / Xoá |

- 🔘 Nút: `+ Tạo mẫu phụ lục mới`

### 📝 Giao diện: Tạo Mẫu Phụ Lục

| Field | Loại input |
|-------|------------|
| Tên mẫu phụ lục | Text input |
| Mô tả | Textarea |
| Loại | Dropdown (extension / value / khác) |
| Trạng thái | Checkbox hoặc mặc định là `Hoạt động` |

- 📎 Có thể upload file mẫu (PDF, DOCX)
- 🔘 Nút: `Lưu mẫu`, `Huỷ`

---

## 3. 📄 Tab: Phụ Lục Hợp Đồng

### 🧩 UI Components

| Mã PL | Tên phụ lục | Mã HĐ | Tên hợp đồng | Ngày tạo | Trạng thái | Hành động |
|-------|-------------|-------|---------------|-----------|-------------|-----------|

- 🔘 Nút: `+ Tạo phụ lục mới`

### 📝 Giao diện: Tạo Phụ Lục Hợp Đồng

#### Bước 1: Chọn cách tạo
- 🔘 Sử dụng mẫu phụ lục (dropdown chọn mẫu)
- 🔘 Tạo mới thủ công

#### Bước 2: Điền thông tin (tuỳ vào bước 1)

| Field | Loại input |
|-------|------------|
| Tên phụ lục | Text input |
| Gắn với hợp đồng | Dropdown |
| Ngày tạo | Date picker |
| File đính kèm | Upload file |
| Nội dung phụ lục | Rich text hoặc upload từ mẫu |
| Ghi chú nội bộ | Optional |

#### Hành động
- 💾 Lưu nháp
- 📤 Gửi duyệt
- ✍️ Ký phụ lục

---

## 4. ⛳ Gợi ý mở rộng

- Cho phép sao chép nội dung từ mẫu vào nội dung phụ lục (nếu có)
- Gắn logic kiểm tra trạng thái hợp đồng trước khi tạo phụ lục
- Cho phép lọc danh sách mẫu theo loại (extension, value,...)
