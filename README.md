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
  -> Đã cài đặt ứng dụng và lưu token thành công!
  Token sẽ được lưu vào bitrix_token.json
  {
  "access_token": "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  "refresh_token": "yyyyyyyyyyyyyyyy",
  "expires_in": zzzzz,
  "created_at": xxxxxxxx
}
2. Test gọi API Bitrix24
  http://localhost:3000/api/contact?domain=yourdomain.bitrix24.vn
  {
    "ID": xxxxxxxxxxxxxx,
    "NAME": "Nguyễn Văn A",
    "ADDRESS": "Hoàng Mai, Hà Nội",
    "PHONE": "xxxxxxxxxxxxxx",
    "EMAIL": "",
    "WEBSITE": "",
    "BANK_NAME": "",
    "ACCOUNT_NAME": ""
  },
3. Quản lý Contact qua giao diện Vue
  Chạy Frontend
  Thêm, sửa, xóa, tìm kiếm contact
  ![Ảnh chụp màn hình 2025-04-15 132537](https://github.com/user-attachments/assets/d6a4eb3e-0af5-4645-bafe-aa4a90f27717)
  Dữ liệu được lưu vào file token.json (qua backend)
  ![Ảnh chụp màn hình 2025-04-15 132648](https://github.com/user-attachments/assets/97a21175-d9c2-45ec-adf9-40634618827b)

