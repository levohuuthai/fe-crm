## 🆕 Update: Luồng Tạo Mẫu Hợp Đồng Bằng AI (AI Contract Generation Flow)

### 🎯 Mục tiêu:
Cho phép người dùng trong CRM có thể tạo ra hợp đồng **mới hoàn toàn bằng AI**, dựa trên prompt, không cần upload sẵn template.

---

### 🪄 Luồng thao tác chi tiết:

#### Bước 1: Mở chức năng tạo hợp đồng bằng AI
- Truy cập menu `Quản lý hợp đồng & template hợp đồng`
- Tại tab `MẪU HỢP ĐỒNG`, người dùng thấy danh sách các mẫu hợp đồng đã có
- Bên cạnh nút `Tải lên Template`, bổ sung nút mới:
  - 🔵 Nút: `Tạo hợp đồng bằng AI`
  - 💡 Gợi ý đặt cạnh nút `Tải lên Template` để người dùng dễ so sánh hai lựa chọn

#### Bước 2: Giao diện tạo prompt mở dạng modal
- Khi click `Tạo hợp đồng bằng AI` ➜ mở **modal trung tâm** có giao diện giống ChatGPT:
  - Trường nhập yêu cầu dạng natural language:
    > "Tạo hợp đồng phát triển phần mềm giữa ITV và Công ty ABC, giá trị 500 triệu, thời gian 6 tháng, thanh toán từng giai đoạn..."

  - Có thể có nút gợi ý mẫu prompt nhanh (ví dụ: `+ Dịch vụ phần mềm`, `+ Hợp đồng thương mại`, ...)

#### Bước 3: AI xử lý & sinh ra nội dung hợp đồng
- Sau khi nhấn `Sinh hợp đồng`, hệ thống gọi OpenAI (hoặc AI nội bộ nhưng bây giờ bạn cứ fake data mockup giúp tôi) để sinh nội dung
- Modal hiển thị hai vùng:
  - Bên trái: Prompt đã nhập + lịch sử chat nếu cần
  - Bên phải: Bản hợp đồng sinh ra giống như UI của "Xem trước và chỉnh sửa báo giá" có thể chỉnh sửa được hợp đồng do AI sinh ra

#### Bước 4: Cho phép chỉnh sửa trước khi lưu
- Người dùng có thể:
  - 📝 Sửa trực tiếp nội dung hợp đồng
  - 🖼️ Thêm hình/logo
  - 🔧 Thêm placeholder (ví dụ {{Tên khách hàng}}, {{Ngày ký}},...)

#### Bước 5: Lưu mẫu hợp đồng
- Sau khi hoàn tất:
  - Nhấn `Lưu thành Template`
- Template mới được thêm vào danh sách tại tab `MẪU HỢP ĐỒNG`
