# Hướng Dẫn Khởi Chạy Dự Án Durly Ở Local (Từng Bước Một)

Tài liệu này hướng dẫn chi tiết các bước để khởi chạy cả 3 dịch vụ của dự án **Durly** trên máy tính cá nhân của bạn để phục vụ demo phỏng vấn.

---

## 🛠️ Bước 1: Chuẩn Bị Môi Trường Hệ Thống

Trước khi khởi chạy, hãy chắc chắn máy tính của bạn đã cài đặt các công cụ sau:
1. **Node.js**: Phiên bản 18 trở lên (để chạy Backend và Frontend).
2. **Python**: Phiên bản 3.10 trở lên (để chạy AI Service).
3. **FFmpeg**: Đã được cài đặt và thêm vào đường dẫn hệ thống (System PATH) để hỗ trợ giải mã tín hiệu âm thanh.
4. **MongoDB**: Đã khởi chạy MongoDB cục bộ (Local) hoặc có kết nối internet để trỏ tới MongoDB Atlas.

---

## 💻 Bước 2: Quy Trình Khởi Chạy 3 Dịch Vụ

Bạn mở **3 tab Terminal** khác nhau trong VS Code (hoặc Command Prompt/PowerShell ngoài máy) và chạy tuần tự các lệnh sau:

### 1. Terminal 1: Khởi chạy AI Model Service (Python FastAPI)
* **Nhiệm vụ**: Chạy dịch vụ phân tích âm thanh bằng Python trên cổng `8000`.
* **Câu lệnh**:
  ```bash
  cd DURIAN_RIPENESS_CLASSIFICATION
  # Kích hoạt môi trường ảo (Nếu dùng Windows)
  .venv\Scripts\activate
  # Chạy server FastAPI
  python api/server.py
  ```
  *(Đợi terminal hiển thị dòng chữ: `Uvicorn running on http://0.0.0.0:8000`)*

### 2. Terminal 2: Khởi chạy Backend API (Node.js Express)
* **Nhiệm vụ**: Chạy API trung gian điều phối và kết nối database trên cổng `3000`.
* **Câu lệnh**:
  ```bash
  cd backend
  # Chạy server ở chế độ Development
  npm run dev
  ```
  *(Đợi terminal hiển thị: `[db] MongoDB connected` và `Server is running on port 3000`)*

### 3. Terminal 3: Khởi chạy Frontend Web Client (Expo React Native)
* **Nhiệm vụ**: Khởi chạy giao diện người dùng trên trình duyệt (thường ở cổng `8081`).
* **Câu lệnh**:
  ```bash
  cd frontend
  # Khởi chạy bản Web
  npm run web
  ```
  *(Trình duyệt sẽ tự động mở trang web ở địa chỉ **`http://localhost:8081`**)*

---

## 🧪 Bước 3: Kiểm Tra Nhanh Trạng Thái Hoạt Động (Health Checks)

Sau khi chạy xong cả 3 dịch vụ, bạn có thể mở các tab ẩn danh trên trình duyệt để kiểm tra xem các dịch vụ đã liên kết ổn định chưa:

1. **Kiểm tra AI Service**: Truy cập **[http://localhost:8000/healthz](http://localhost:8000/healthz)**. 
   * *Kết quả mong muốn*: Trả về JSON `{"status":"ok","model_loaded":true}`.
2. **Kiểm tra Backend API**: Truy cập **[http://localhost:3000/health](http://localhost:3000/health)**.
   * *Kết quả mong muốn*: Trả về JSON `{"name":"Durly API","status":"ok","version":"1.0.0"}`.
3. **Thao tác Demo**: Truy cập **`http://localhost:8081`**, nhấn **Start Recording** -> Gõ tạo tiếng động -> **Stop Recording** -> **View Results 🎉**.
