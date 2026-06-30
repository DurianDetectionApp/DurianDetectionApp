# Hướng Dẫn Chạy & Thử Nghiệm Ứng Dụng Trên Điện Thoại Qua Expo Go

Tài liệu này hướng dẫn chi tiết các bước để khởi chạy và chạy thử ứng dụng di động **Durly** trực tiếp trên thiết bị iOS (iPhone) hoặc Android vật lý của bạn bằng ứng dụng **Expo Go**.

---

## 🛠️ Bước 1: Chuẩn Bị Trên Điện Thoại Di Động

1. **Tải ứng dụng Expo Go**:
   * **Android**: Vào cửa hàng **Google Play Store**, tìm kiếm và tải ứng dụng **`Expo Go`**.
   * **iOS (iPhone)**: Vào cửa hàng **App Store**, tìm kiếm và tải ứng dụng **`Expo Go`**.
2. **Kết nối mạng**:
   * **BẮT BUỘC**: Điện thoại di động và máy tính của bạn phải **kết nối chung một mạng Wi-Fi** (hoặc điện thoại phát 4G cho máy tính kết nối) để hai thiết bị có thể nhìn thấy và truyền dữ liệu cho nhau qua mạng nội bộ.

---

## 💻 Bước 2: Khởi Chạy Lệnh Trên Máy Tính

1. Mở cửa sổ Terminal (hoặc PowerShell) trong VS Code.
2. Di chuyển vào thư mục dự án `frontend` và khởi chạy máy chủ Metro Bundler:
   ```bash
   cd frontend
   npm run start
   ```
   *(Hoặc bạn có thể dùng lệnh tương đương: `npx expo start`)*

3. Sau khi chạy, một **mã QR lớn** sẽ tự động hiển thị ngay trên Terminal của máy tính kèm theo dòng chữ thông báo máy chủ đang hoạt động.

---

## 📲 Bước 3: Quét Mã QR Để Mở Ứng Dụng

### Đối với điện thoại Android:
1. Mở ứng dụng **Expo Go** đã cài đặt trên điện thoại.
2. Chọn mục **`Scan QR Code`** ở giao diện chính của Expo Go.
3. Đưa camera điện thoại quét mã QR hiển thị trên màn hình terminal máy tính.
4. Đợi ứng dụng tải và biên dịch JavaScript bundle (từ 0% đến 100%). Sau khi tải xong, giao diện ứng dụng sẽ chính thức hiển thị để bạn thao tác.

### Đối với điện thoại iPhone (iOS):
1. Mở ứng dụng **Camera mặc định** của iPhone.
2. Đưa camera quét mã QR hiển thị trên màn hình terminal máy tính.
3. Nhấp vào thông báo **`Mở bằng Expo Go`** xuất hiện dưới mã QR.
4. Đợi ứng dụng tải bundle và khởi động thành công.

---

## ⚠️ Các Lỗi Thường Gặp & Cách Sửa Nhanh (Troubleshooting)

### 1. Lỗi không tải được bundle (Treo ở 0% hoặc báo Network Error)
* **Nguyên nhân**: Do máy tính và điện thoại không kết nối chung một mạng Wi-Fi; hoặc do tường lửa (Firewall) trên máy tính Windows đang chặn cổng kết nối.
* **Cách khắc phục**:
  * Kiểm tra lại kết nối Wi-Fi trên cả 2 thiết bị.
  * Nếu vẫn lỗi, hãy dùng phương pháp phát mạng **4G (Hotspot)** từ điện thoại cho máy tính kết nối vào, sau đó chạy lại lệnh khởi chạy.
  * Bạn có thể chạy Expo ở chế độ Tunnel (kết nối qua ngầm ngách internet) bằng lệnh:
    ```bash
    npx expo start --tunnel
    ```
    *(Quét mã QR mới sinh ra để kết nối).*

### 2. Cần tải lại app (Reload) khi sửa code
* Khi bạn thay đổi code ở VS Code, Expo Go sẽ tự động tải lại (Fast Refresh). Nếu giao diện bị đơ lag, bạn chỉ cần:
  * **Trên terminal máy tính**: Nhấn phím **`r`** để ra lệnh tải lại từ xa.
  * **Trên điện thoại**: Lắc mạnh điện thoại để hiển thị **Developer Menu** của Expo -> Chọn **`Reload`**.
