
## 🤖 Trợ lý AI CRM nội bộ (UI mockup giống ChatGPT)

### 🎯 Mục tiêu:
Tạo giao diện chatbot AI trong CRM để người dùng có thể:
- Hỏi thông tin về dữ liệu hệ thống (deal, khách hàng, báo cáo, v.v.)
- Nhờ hỗ trợ thao tác nhanh như tạo nhắc việc, tìm dữ liệu
- Sinh nội dung như email, tin nhắn follow-up,...

### ⚠️ Ghi chú:
- Đây là **UI mockup**, chưa kết nối AI thật
- Sau này sẽ tích hợp AI nội bộ được train riêng
- Chatbot là **route riêng biệt**: `/assistant`

---

## 🔹 Vị trí chatbot
- Icon 🤖 hoặc 🧠 đặt tại header (trên cùng bên phải, cạnh chuông thông báo)
- Khi click:
  - Nếu dùng popup: mở hộp thoại trung tâm dạng ChatGPT
  - Nếu là route riêng: chuyển trang sang `/assistant`

---

## 🔹 UI Chatbot (giống ChatGPT)
```plaintext
╔════════════════════════════════════╗
║ 🤖 Trợ lý thông minh CRM ITV      ║   [❌ Đóng]
╠════════════════════════════════════╣
║ Bạn có thể hỏi:                   ║
║ - Deal nào đang sắp hết hạn?      ║
║ - Tổng giá trị deal tháng này?    ║
║ - Tạo nhắc việc cho Công ty A     ║
║ - Viết giúp email cảm ơn khách    ║
╠════════════════════════════════════╣
║ 👤 [User]: Các deal chưa chốt      ║
║ 🤖 [Bot]: Dưới đây là danh sách:  ║
║                                    ║
║ ┌─────────────┬────────────┬──────┐║
║ │ Tên Deal    │ Khách hàng │ GT   │║
║ ├─────────────┼────────────┼──────┤║
║ │ Deal 1      │ Công ty A  │ 100M │║
║ │ Deal 2      │ Công ty B  │ 80M  │║
║ └─────────────┴────────────┴──────┘║
║                                    ║
║ ⌨️ [Nhập nội dung]   [📨 Gửi]       ║
╚════════════════════════════════════╝
```

---

## 🔹 Fake Data dùng cho demo

| Người dùng hỏi | Bot giả lập trả lời |
|----------------|----------------------|
| Các deal chưa chốt trong tháng này | Đây là danh sách các deal chưa chốt của bạn trong tháng 7: <br> 
```
| Tên Deal | Khách hàng | Giá trị |
|----------|-------------|---------|
| Deal 1   | Công ty A   | 100M    |
| Deal 2   | Công ty B   | 80M     |
``` |
| Tổng giá trị deal đã chốt của tôi | Tổng giá trị đã chốt của bạn trong tháng này là 377.043.143 ₫ |
| Tạo nhắc việc cho Công ty B vào ngày mai | Đã tạo nhắc việc cho Deal của Công ty B vào ngày mai. Bạn có muốn thêm ghi chú không? |
| Viết email cảm ơn khách hàng | Chào quý khách, cảm ơn anh/chị đã tin tưởng sử dụng dịch vụ của chúng tôi... |

---

## 🔹 Route cấu hình
- Path: `/assistant`
- Component React riêng: `AssistantChat.tsx` hoặc `AIChat.vue`
- Dùng layout toàn trang hoặc modal trung tâm
- Lưu session chat ở local hoặc trong state (tuỳ implement)

---

## 🔹 Các nhóm chức năng AI sẽ xử lý

| Nhóm chức năng | Ví dụ truy vấn |
|----------------|----------------|
| Truy vấn dữ liệu | "Deal nào chưa chốt trong tháng 7?" |
| Tạo nhắc việc | "Tạo nhắc việc cho Deal A vào mai" |
| Tổng hợp báo cáo | "Cho tôi biết tổng doanh thu của tháng này" |
| Sinh nội dung | "Viết email báo giá gửi Công ty ABC" |
| Gợi ý thao tác | "Tôi nên follow Deal nào trước?" |

---

## ✅ Tổng kết
- Giao diện trợ lý AI nên được xem như một tính năng toàn hệ thống, không chỉ cho Deal
- Có thể làm mockup độc lập để demo hoặc chạy nội bộ trước khi tích hợp AI thật
- Tập trung vào trải nghiệm người dùng giống ChatGPT, dễ dùng, phản hồi tự nhiên
- Trả lời có thể chứa **text và bảng dữ liệu**, tuỳ vào ngữ cảnh câu hỏi