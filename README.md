Contributors
- Vo Minh Nhat (full stack)
- Pham Le Gia Bao (Back-end and Database)
- Truong Thanh Quy (front-end)

  
🛒 MY SHOP - Hệ Thống Cửa Hàng Trực Tuyến
Chào mừng bạn đến với dự án MY SHOP, một nền tảng thương mại điện tử hiện đại tích hợp trí tuệ nhân tạo và hệ thống thanh toán tự động. Dự án được phát triển nhằm tối ưu hóa trải nghiệm mua sắm và quản lý cửa hàng.

🚀 Tính Năng Nổi Bật
🛒 Quản lý sản phẩm: Giao diện hiển thị sản phẩm mượt mà (iPhone, iPad, MacBook...) với đầy đủ thông tin chi tiết.

🤖 AI Support (Beta): Trợ lý ảo tư vấn khách hàng được tích hợp bằng mô hình Gemini AI, giúp trả lời các thắc mắc về sản phẩm ngay lập tức.

💳 Thanh toán SePay: Hệ thống thanh toán tự động qua mã QR. Tự động xác nhận giao dịch và cập nhật trạng thái đơn hàng thông qua Webhook.

🛡️ Quản trị hệ thống: Admin Portal riêng biệt để quản lý sản phẩm, đơn hàng và kho vận.

🔐 Bảo mật: Triển khai chứng chỉ SSL (HTTPS), bảo vệ dữ liệu người dùng và giao dịch.

🛠️ Công Nghệ Sử Dụng
Frontend
React.js: Thư viện chính xây dựng giao diện người dùng.

Axios: Xử lý các yêu cầu API đến Backend.

Backend
Java (Spring Boot): Framework mạnh mẽ cho logic xử lý hệ thống.

Node.js & Express: Hỗ trợ xử lý các dịch vụ tích hợp và Webhook.

Gemini API: Cung cấp "não bộ" cho trợ lý AI.

Cơ Sở Dữ Liệu & Hạ Tầng
Database: MongoDB Atlas (Lưu trữ linh hoạt) và MySQL.

Hosting: VPS Cloud với Web Server Nginx được cấu hình tối ưu.

CI/CD: Quản lý mã nguồn qua Git và triển khai thực tế trên domain nhatvm.id.vn.

📦 Cài Đặt Dự Án
1. Yêu cầu hệ thống
Node.js (v18+)

Java JDK 17

Cài đặt Git

2. Triển khai Local
Bash
# Clone dự án
git clone https://github.com/nhatvm/my-shop.git

# Cài đặt Backend
cd server
npm install
# Tạo file .env và điền các API Key (Gemini, SePay, MongoDB)

# Cài đặt Frontend
cd client-customer
npm install
npm start
👨‍💻 Tác Giả
Võ Minh Nhật (nhatvm) - Sinh viên Công nghệ thông tin, Đại học Văn Lang.

Dự án được hỗ trợ bởi các cộng sự trong các bài tập nhóm chuyên ngành.
