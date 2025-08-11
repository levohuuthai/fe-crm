# 📊 Dashboard – Báo cáo bằng AI (AI-driven Reports)

> Màn hình Dashboard cho phép người dùng theo dõi tổng quan hiệu suất kinh doanh (deal, khách hàng, doanh thu...) và sử dụng AI chatbot để tạo báo cáo động theo yêu cầu.

---

## 🎯 Mục tiêu
- Hiển thị các chỉ số KPI theo thời gian thực.
- Cho phép người dùng sử dụng AI để tạo các báo cáo tùy biến bằng ngôn ngữ tự nhiên.
- Tích hợp cả biểu đồ, bảng và top performer.

---

## 🖼️ Screen: AI Dashboard Overview

### 🧱 1. **Khu vực AI Chatbot (trái màn hình hoặc header)**
> Khu vực nhập câu lệnh hoặc trò chuyện với AI để yêu cầu báo cáo.

**Ví dụ các prompt:**
- "Cho tôi xem hôm nay có bao nhiêu khách hàng mới"
- "Vẽ biểu đồ doanh thu theo nhân viên trong tháng này"
- "Ai là người chốt deal nhiều nhất trong quý?"

**Thành phần giao diện:**
- 🗨️ Text input (dạng chat hoặc dòng prompt)
- 🎤 Nút nhập giọng nói (tùy chọn)
- 🔄 Lịch sử báo cáo đã yêu cầu gần đây
- 📑 Nút “Lưu báo cáo này” hoặc “Export PDF”

---

### 📊 2. **Khu vực Thống kê KPI Tổng quan**

> Dãy card thể hiện số liệu chính, nằm ngay dưới thanh chatbot hoặc góc phải

| Chỉ số                | Mô tả                                          |
|----------------------|-----------------------------------------------|
| 🧍 Khách hàng mới     | Số khách hàng mới tạo hôm nay                 |
| 📄 Tổng deal          | Số deal hiện có trong hệ thống                |
| 🎯 Deal theo giai đoạn | Thống kê từng stage: Lead, Báo giá, Đàm phán, Win, Lose |
| 💰 Doanh thu thực tế  | Tổng giá trị các hợp đồng đã ký (sau chiết khấu) |
| 🏆 Nhân viên top deal | Nhân viên có số deal win nhiều nhất           |

---

### 📈 3. **Biểu đồ phân tích (AI sinh động)**

> Tự động sinh biểu đồ khi người dùng hỏi – UI chia vùng render biểu đồ ở trung tâm

**Loại biểu đồ:**
- Cột dọc (Tổng doanh số theo nhân viên)
- Tròn (Phân phối deal theo trạng thái)
- Line (Doanh thu theo tuần/tháng)
- Bảng ranking (Top 5 nhân viên / Top khách hàng theo giá trị HĐ)

**Tùy chọn:**
- 📆 Bộ lọc theo thời gian (hôm nay, tuần này, tháng này)
- 👤 Bộ lọc theo nhân viên / phòng ban

---

### 📁 4. **Các báo cáo đã tạo & lưu (History Panel)**

> Gồm danh sách các báo cáo người dùng đã gọi AI tạo

**Thông tin:**
- Tên câu hỏi
- Loại biểu đồ / Dạng bảng
- Ngày tạo
- Nút: 👁️ Xem lại | 📤 Export | 🗑️ Xoá

---

## 🧠 AI Logic – Gợi ý / Natural Language Support

> Giao diện hỗ trợ người dùng nhập lệnh nhanh với gợi ý thông minh

**Ví dụ gợi ý có thể hiển thị khi gõ:**
- "Doanh thu tháng..." ➝ gợi ý: “...theo từng nhân viên”
- "Top deal của tôi..." ➝ gợi ý: “...trong quý này là gì?”

---

## 🔘 Nút & Action Summary

| Nút | Hành vi |
|-----|---------|
| 🔍 Gửi câu hỏi | Truy lệnh tới AI |
| ⬇️ Tải báo cáo | Export file PDF / CSV |
| 💾 Lưu báo cáo | Ghi nhớ báo cáo vừa tạo vào danh sách |
| 📤 Gửi mail | (tuỳ chọn) gửi file báo cáo cho sếp/đội nhóm |
| 🗑️ Xoá báo cáo | Xoá khỏi danh sách đã lưu |

