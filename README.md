# 📇 Bitrix24 Contact Management

Dự án này gồm 2 phần: **Backend (Node.js)** và **Frontend (Vue.js)** để quản lý danh sách contact tích hợp với **Bitrix24 OAuth2**.

## 📦 Tính năng

### ✅ Bài 1 – OAuth Bitrix24 (Backend)
- Nhận sự kiện **Install App**
- Lưu `access_token` và `refresh_token` vào file
- Làm mới token khi hết hạn
- Gọi API Bitrix24 với token hiện tại

### ✅ Bài 2 – Giao diện quản lý Contact (Frontend)
- Hiển thị danh sách contact
- Thêm, sửa, xóa contact
- Trường thông tin đầy đủ:
  - Họ tên
  - Địa chỉ: phường/xã, quận/huyện, tỉnh/thành phố
  - Số điện thoại
  - Email
  - Website
  - Ngân hàng: tên ngân hàng, số tài khoản

---

## ⚙️ Cài đặt

### 1️⃣ Clone repo
```bash
git clone https://github.com/qna2907/bitrix24-project.git
cd bitrix24-project
2️⃣ Chạy Backend (Node.js)
Cài đặt:
  cd bitrix-backend
  npm install
Cấu hình:
Tạo file .env với thông tin Bitrix24 App:
  CLIENT_ID= YOUR_CLIENT_ID
  CLIENT_SECRET= YOUR_CLIENT_SECRET
  BITRIX_DOMAIN= YOUR_BITRIX_DOMAIN
Chạy server:
  node server.js
Mở ngrok:
  ngrok http 3000 → Ghi lại URL, ví dụ: https://abcd1234.ngrok.io
Cập nhật OAuth Callback URL trong Bitrix24 Developer Portal:
3️⃣ Chạy Frontend (Vue.js)
  cd ../bitrix-frontend
  npm install
  npm run dev
🚀 Hướng dẫn sử dụng
1. Cài đặt App từ Bitrix24
  ngrok http 3000 → Ghi lại URL, ví dụ: https://abcd1234.ngrok.io
  Cập nhật OAuth Callback URL trong Bitrix24 Developer Portal
  https://yourdomain.bitrix24.vn/oauth/authorize/?client_id=your_client_id
  Token sẽ được lưu vào bitrix_token.json
2. Test gọi API Bitrix24
  http://localhost:3000/api/contact?domain=yourdomain.bitrix24.vn
3. Quản lý Contact qua giao diện Vue
  Chạy Frontend
  Thêm, sửa, xóa, tìm kiếm contact
  Dữ liệu được lưu vào file token.json (qua backend)
  ![image](https://github.com/user-attachments/assets/67d7686e-40c1-45a7-964d-0c4a6fbe9aae)
