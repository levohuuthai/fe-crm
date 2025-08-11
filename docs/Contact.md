---

## 🧾 Screen 1: Contact List View (Danh sách liên hệ)

### 🎯 Mục đích:
Cung cấp giao diện quản lý toàn bộ danh sách contact với các tính năng lọc, tìm kiếm, tạo mới, chỉnh sửa cột hiển thị, và xuất dữ liệu.

---

### 🧱 Cấu trúc bảng (Data Table)

| Trường           | Mô tả                                           |
|------------------|--------------------------------------------------|
| Checkbox chọn    | Để thao tác hàng loạt                           |
| Name             | Họ và tên (ghép từ First Name + Last Name)     |
| First Name       | Tên chính                                       |
| Last Name        | Họ                                              |
| Email            | Địa chỉ email của contact                       |
| Phone Number     | Số điện thoại                                   |
| Contact Owner    | Người tạo / phụ trách contact                   |
| Create Date      | Ngày tạo contact                                |
| Lead Status      | Trạng thái lead (nếu dùng cho phân loại CRM)    |

> 👉 Người dùng có thể sắp xếp từng cột, chọn “Edit Columns” để cấu hình thứ tự, ẩn/hiện.

---

### 🔍 Bộ lọc & hành động nhanh

- **Search bar**: Tìm theo tên, email, số điện thoại
- **Filter dropdowns**:  
  - Contact Owner  
  - Create Date  
  - Last Activity  
  - Lead Status  
  - High Engagement (predefined segment)
- **Advanced filters**: Cho phép lọc nhiều điều kiện kết hợp (giống Hubspot)
- **Actions dropdown**: Xuất, xóa, gán tag...
- **Import**: Tải lên danh sách contact từ file .csv
- **Pagination**: Chuyển trang

---

## ➕ Nút: `Create Contact` (popup mượt trên nền list)

### 📍 Vị trí:
Góc phải phía trên danh sách (gần nút `Import`, `Actions`)

### 🪄 Hành vi UI:
- Khi click `Create Contact`, sẽ mở **popup dạng overlay** nằm ở trung tâm màn hình.
- **Dưới lớp popup**, list vẫn còn nhưng được làm mờ nhẹ hoặc đẩy xuống tạo cảm giác mượt.
- Popup có animation mượt `slide down` hoặc `fade in`.

---

## 🧾 Screen 2: Expandable Create Contact Input (giống Canva)

### 🎨 Hành vi UI:

- Khi nhấn nút `➕ Create Contact`, **thay vì mở modal nhỏ**, toàn bộ input sẽ **mở rộng thành khối khung lớn**.
- Giao diện giống thanh tìm kiếm của Canva (ảnh tham khảo).
- Input tràn chiều ngang + phần dưới có các chip hoặc nút hỗ trợ như:
  - `Khách hàng tiềm năng`
  - `Nhóm ngành`
  - `Trạng thái lead`
- Animation: `scale-expand` + `fade in` (trượt nhẹ xuống nếu có list bên dưới)

### 📋 Trường trong form:

| Trường           | Loại dữ liệu       | Bắt buộc |
|------------------|--------------------|----------|
| First Name       | Text input         | ✅       |
| Last Name        | Text input         | ❌       |
| Email            | Text input (email) | ✅       |
| Phone Number     | Text input         | ❌       |
| Job Title        | Text input         | ❌       |

### 🔘 Hành động:

- Nút `Save` → tạo contact mới, đóng popup, contact xuất hiện trong list
- Nút `Cancel` → đóng popup không lưu

> Sau khi Save thành công:
> - Hiện thông báo nhỏ: `"✅ Contact created successfully!"`
> - Tự động scroll về contact vừa tạo nếu có phân trang

---

### 💡 UX đề xuất khi mở popup:

```plaintext
✅ Background overlay bán trong suốt
✅ List contact bị làm mờ nhẹ hoặc đẩy xuống mượt
✅ Focus vào popup (auto-focus ô First Name)
✅ Có thể ESC để tắt popup nhanh

---

## 🧾 Screen 3: Contact Preview Panel (Slide-in từ phải)

> Mở khi người dùng click vào một dòng contact bất kỳ

### ⚙️ Hành vi:
- Trượt nhẹ từ phải vào
- Overlay phía sau mờ nhẹ
- Có thể đóng bằng `ESC` hoặc nút `×`

### 📋 Nội dung chính:

| Thành phần             | Mô tả |
|------------------------|------|
| Tên + Email lớn        | Hiển thị nổi bật |
| Avatar (nếu có)        | Tự sinh từ tên hoặc email |
| Nút hành động tròn nhỏ | 📝 Note – 📧 Email – 📞 Call – 📋 Task – 📅 Meeting – ☰ More |
| Dropdown: "About this contact" | Khi mở ra sẽ hiện các thông tin chi tiết như số điện thoại, job title, ngày tạo... |

---

## 💬 Screen 4: Modal – Ghi chú / Email / Gọi / Giao task / Lịch họp

> Khi ấn vào các nút Note, Email... hệ thống sẽ mở modal tương ứng

---

### 📝 Modal: Ghi chú (Note)

| Thành phần | Mô tả |
|------------|------|
| Rich Text Editor | Hỗ trợ định dạng chữ (bold, italic, gạch chân, heading, bullet list, link...) |
| Đính kèm file    | Hỗ trợ upload ảnh, file PDF, doc |
| Thẻ phân loại    | (tuỳ chọn) để gán tag cho note |
| Nút Save         | Lưu ghi chú và log lại trong timeline contact |

---

### 📧 Modal: Gửi Email

> Cấu trúc tương tự như modal Note, nhưng có thêm chức năng gửi thư:

- `To`: (Tự động lấy từ contact)
- `From`: (Tự động lấy từ email người dùng đã kết nối)
- `Subject`: Nhập tiêu đề thư
- `Body`: Soạn thư, định dạng văn bản, ảnh, file
- `Send / Send Later`:  
  - Dropdown cho chọn: `Gửi ngay`, `1 giờ sau`, `Ngày mai`, hoặc chọn thời gian custom

---

#### Nếu chưa kết nối inbox ➜ hiện modal:

### 📬 Modal: Connect Inbox

```plaintext
Connect your inbox to send emails directly from CRM

✔ Save time in CRM and your inbox  
✔ Send and schedule emails from CRM  
✔ Log replies and auto-create tasks  
✔ Smart suggestions from AI (optional)

🔘 [ Connect with Gmail ]  
🔘 [ I want to choose my email provider myself ▼ ]

→ Sau khi chọn xong ➜ Hiện trường nhập email
→ Nhấn Next ➜ chọn loại email: Gmail, Outlook, Exchange, IMAP
→ Sau khi xác thực OAuth → hiện “Inbox connected successfully”
