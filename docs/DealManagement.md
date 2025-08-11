## Deal List

### Displayed Fields:
| Field             | Description                                   |
|-------------------|-----------------------------------------------|
| Deal Name         | Name of the sales opportunity (deal)          |
| Customer          | Name of the customer linked to the deal       |
| Stage             | Current deal stage (e.g., contacted, negotiating, closed) |
| Value (VND)       | Monetary value of the deal                    |
| Deadline          | Deadline for closing the deal                 |
| Owner             | Staff in charge of the deal                   |
| Notes             | Internal notes or additional information      |

---

## Actions

### 1. Add Deal
- Button: `+ Add Deal`
- Opens a popup or detail page for entering deal information

### 2. Edit Deal
- Button: ✎ (pencil icon)
- Allows editing of existing deal information

### 3. Delete Deal
- Button: 🗑️
- Confirmation required: "Are you sure you want to delete this deal?"

### 4. View Deal Details
- Click on the deal name or the “Details” button
- Displays full deal information

---

## UI Suggestions
- Search bar: by deal name or customer name
- Advanced filters: by stage, deadline, or owner
- Table view: sortable columns
- Pagination: 10–20 rows per page

# update ngày 7/7

### 🧩 Mục tiêu giao diện:
Giao diện quản lý deal cần giúp nhân viên theo dõi nhanh tình trạng cơ hội bán hàng, hỗ trợ ra quyết định đúng thời điểm với các chỉ số nhắc nhở thông minh và bộ lọc trực quan.

---

## 🎨 Giao diện chính (UI Components)

### 1. Thanh tìm kiếm & bộ lọc
- Ô tìm kiếm: "Tìm theo tên Deal, Khách hàng, Nhân viên..."
- Bộ lọc gồm:
  - **Giai đoạn:** Liên hệ ban đầu, Đã ghi nhận yêu cầu, Đã gửi báo giá, Gửi hợp đồng, Đã chốt, Đã huỷ
  - **Người phụ trách**
  - **Ngày tạo** / **Deadline**
  - **Trạng thái nhắc việc**: Có/Không có nhắc việc
  - **Khoảng giá trị**: Từ - đến (VNĐ)

---

### 2. Danh sách Deal hiển thị dạng bảng:

| Tên Deal | Khách hàng | Giai đoạn | Giá trị | Hạn chốt | Người phụ trách | Nhắc việc | Thao tác |
|----------|-------------|-----------|---------|----------|------------------|-----------|-----------|

#### 🎨 Gợi ý màu cho Giai đoạn:
- Liên hệ ban đầu: `#ff9800` (Cam nhạt)
- Đã ghi nhận yêu cầu: `#fbc02d` (Vàng đậm)
- Đã gửi báo giá: `#1976d2` (Xanh dương)
- Gửi hợp đồng: `#7b1fa2` (Tím)
- Đã chốt: `#4caf50` (Xanh lá)
- Đã huỷ: `#e53935` (Đỏ)

#### 🔔 Hiển thị nhắc việc:
- Nếu ngày hôm nay >= (Hạn chốt - 3 ngày) => hiển thị biểu tượng 🔔 đỏ cạnh tên Deal.
- Tooltip khi hover: "Sắp đến hạn chốt trong X ngày nữa"

---

### 3. Các chỉ số tổng quan
Hiển thị phía trên bảng hoặc trong một widget tổng quan:
- **Tổng giá trị Deal:** `Total deal amount`
- **Tổng giá trị Deal có trọng số:** `Weighted deal amount`
- **Giá trị Deal đang mở:** `Open deal amount`
- **Giá trị Deal đã chốt:** `Close deal amount`
- **Số Deal mới trong tháng:** `New deal amount`
- **Tuổi trung bình Deal:** `Average deal age`

*Hiển thị bằng tiếng Việt:* Ví dụ:
- "Tổng giá trị Deal: 4.580.000.000₫"
- "Tuổi trung bình Deal: 12 ngày"

---

## ➕ Thêm / Chỉnh sửa Deal (Popup Form)

### Trường cần nhập:
- Tên Deal (Text)
- Khách hàng (Dropdown hoặc Auto-complete)
- Giai đoạn (Dropdown)
- Giá trị (Số tiền VNĐ)
- Hạn chốt (Datepicker)
- Người phụ trách (Dropdown)
- Ghi chú nội bộ (Textarea)
- **Bật nhắc việc?** (Checkbox)
  - Nếu bật → hiển thị thêm:
    - Thời điểm nhắc
    - Nội dung nhắc
    - Người nhận nhắc (Dropdown)

---

## ✏️ Thao tác trong bảng:
- ✎ Sửa
- 🗑️ Xoá
- Tooltip khi hover vào tên Deal sẽ hiển thị ghi chú gần nhất (nếu có)

---

## 🔔 Thông báo nhắc việc (Toàn hệ thống)
- Chuông ở góc phải: hiển thị số lượng nhắc việc chưa xử lý
- Click vào chuông → mở dropdown danh sách Deal sắp đến hạn hoặc cần follow-up.
- Ví dụ: "[Deal 2] sắp đến hạn chốt vào 10/7. Hãy cập nhật trạng thái hoặc liên hệ khách hàng."

---

## ✅ Ghi chú bổ sung
- Giao diện chuẩn responsive để hỗ trợ cả desktop và mobile.
- Thiết kế ưu tiên thông tin quan trọng, màu sắc phản ánh trạng thái rõ ràng.
- Mọi dữ liệu từ form tạo/sửa deal đều kiểm tra hợp lệ trước khi lưu.


# update ngày 8/7 - Bổ sung bộ lọc thông minh bằng chatbot

### 🧩 Mục tiêu giao diện:
Giao diện quản lý deal cần giúp nhân viên theo dõi nhanh tình trạng cơ hội bán hàng, hỗ trợ ra quyết định đúng thời điểm với các chỉ số nhắc nhở thông minh và bộ lọc trực quan. Giao diện nay bổ sung thêm bộ lọc chatbot sử dụng ngôn ngữ tự nhiên.

---

## 🔍 Bộ lọc thông minh bằng Chatbot (Natural Language Filter)

### ✅ Mục đích:
Cho phép người dùng nhập ngôn ngữ tự nhiên để lọc Deal theo nhu cầu mà không cần thao tác dropdown phức tạp.

### ✅ Vị trí hiển thị:
- Gắn thêm icon chatbot "🧠 Lọc thông minh" bên cạnh nút “Bộ lọc nâng cao”
- Khi click mở ra giao diện nhập chatbot dạng popover hoặc hộp thoại nhỏ bên dưới

### ✅ UI:
```plaintext
🧠 Bộ lọc thông minh bằng ngôn ngữ tự nhiên
Bạn muốn tìm gì?

[ Gõ: Các deal chưa chốt trong tháng 7 của Phạm Thị D ]
[ Gõ: Deal giá trị trên 100 triệu chưa gửi báo giá ]

⌨️ ______________________________________
            [ Gửi ]
```

---

### ✅ Cơ chế xử lý UI mockup (fake data):
1. Người dùng nhập câu truy vấn vào chatbot UI
2. Hệ thống tạm thời **fake JSON filter** nội bộ (chưa gọi API thật)
3. Bảng Deal bên dưới **lọc dữ liệu giả lập** theo điều kiện đó
4. Dòng thông báo hiển thị filter đang dùng, ví dụ:
   > "Đang lọc: Các deal chưa chốt trong tháng 7 của Phạm Thị D"

---

### 🔧 Ví dụ chuyển đổi từ ngôn ngữ tự nhiên sang filter:

#### Người dùng gõ:
> "Hiển thị các Deal chưa chốt trong tháng này của Phạm Thị D"

#### Hệ thống giả lập hiểu và tạo filter:
```json
{
  "filters": {
    "giai_doan": "≠ Đã chốt",
    "nguoi_phu_trach": "Phạm Thị D",
    "ngay_tao": "Từ 01/07/2025 đến 31/07/2025"
  }
}
```

➡️ Sau đó hiển thị bảng mock filter như:
```plaintext
Tên Deal | Khách hàng | Người phụ trách | Giai đoạn | Hạn chốt
---------|-------------|------------------|------------|----------
Deal 12  | Công ty A   | Phạm Thị D       | Gửi hợp đồng | 20/07/2025
Deal 19  | Công ty B   | Phạm Thị D       | Đã gửi báo giá | 25/07/2025
```

---

## 💡 Lưu ý khi chưa có backend:
- Toàn bộ dữ liệu là giả lập (fake data)
- Không cần API thật, chỉ cần filter nội bộ từ mảng JSON tạm thời
- Có thể test với 5–10 mẫu câu lọc phổ biến để trình diễn UI và logic

---

## 📌 Tổng kết:
- Tính năng chatbot filter có thể hoạt động ở UI mức fake/mock trước khi có backend
- Giúp bạn demo logic cho sếp hoặc trình diễn prototype rất trực quan
- Sau này chỉ cần map câu query → gọi API thật là hoàn thiện
