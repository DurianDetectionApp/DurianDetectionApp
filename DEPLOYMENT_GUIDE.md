# Durian Ripeness Detection App – Deployment Guide

## 📋 Project Overview

**Objective:** Build a complete backend for a React Native Expo app that records durian tap sounds and uses an AI model to predict ripeness.

**Tech Stack:**

- **Frontend:** React Native (Expo) + TypeScript + Zustand + AsyncStorage + Axios
- **Backend:** Node.js + Express + TypeScript + Multer + Helmet + CORS
- **Database:** MongoDB + Mongoose
- **ML:** Python + scikit-learn (RandomForest model) + librosa + joblib
- **Deployment Targets:** Render / Railway

---

## ✅ What Has Been Built

### Backend (Complete)

- **Express/TypeScript Scaffold:** Full project structure with config, controllers, services, middleware, validators, models.
- **Audio Processing Endpoint:** `POST /predict`
  - Accepts multipart/form-data with `audio` field (WAV/MP3)
  - Calls Python inference script
  - Returns AI analysis result with ripeness prediction, confidence, variety, texture, description
- **Scan History API:**
  - `POST /api/v1/scans` – Save scan to MongoDB
  - `GET /api/v1/scans?username=...` – Retrieve user scans
  - `GET /api/v1/scans/global?limit=...` – Retrieve global recent scans
  - `DELETE /api/v1/scans/:id?username=...` – Delete scan
- **Python Inference:** `DURIAN_RIPENESS_CLASSIFICATION/src/predict.py`
  - Loads trained RandomForest model (`models/random_forest.pkl`)
  - Extracts audio features using librosa
  - Outputs JSON with label, confidence, probabilities
- **Database Integration:** Mongoose schemas and services for persistent scan history
- **Configuration:** dotenv-based environment variables with sensible defaults
- **Error Handling & Middleware:** Global error handlers, CORS, helmet, morgan logging

### Frontend (Updated)

- **API Integration:** `src/services/aiService.ts` wired to call `/predict` endpoint
- **Scan Recording:** `src/screens/RecordScreen.tsx` sends audio to backend
- **History Persistence:** `src/services/historyService.ts` + `src/store/historyStore.ts` syncs with server; falls back to AsyncStorage if offline
- **Production Ready:** Platform-aware API base URL; graceful fallback to mock analysis

### Status

✅ **Backend:** Builds successfully, TypeScript compiles without errors  
✅ **Frontend:** Integrated with backend, ready for end-to-end testing  
✅ **Python Script:** Syntax-validated, ready for deployment  
✅ **.env Example:** Created at `backend/.env.example`

---

## 🏗️ Architecture

### Request Flow

```
Frontend (RecordScreen)
    ↓ Sends audio (multipart/form-data)
    ↓
Backend (POST /predict)
    ↓ Extract multipart file
    ↓
Python Inference Service
    ↓ Call predict.py via child_process
    ↓ Parse stdout JSON
    ↓
Build AIResult (ripeness, confidence, variety, texture, description)
    ↓
Return to Frontend
    ↓
Frontend stores in MongoDB (via POST /api/v1/scans)
```

### Backend File Structure

```
backend/
├── server.ts              (Bootstrap; listens on PORT || 8080)
├── src/
│   ├── app.ts            (Express setup: helmet, cors, routes, middleware)
│   ├── config/
│   │   ├── env.ts        (Environment variables, defaults)
│   │   └── database.ts   (MongoDB/mongoose connection)
│   ├── controller/
│   │   ├── predict.controller.ts       (Audio analysis endpoint)
│   │   └── scanHistory.controller.ts   (Scan CRUD endpoints)
│   ├── service/
│   │   ├── pythonInference.service.ts  (Invoke Python prediction script)
│   │   ├── analysis.service.ts         (Map inference to AIResult)
│   │   └── scanHistory.service.ts      (Database operations)
│   ├── models/
│   │   ├── durian.ts                   (TypeScript interfaces: AIResult, etc.)
│   │   └── scanHistory.model.ts        (MongoDB schema)
│   ├── middleware/
│   │   ├── upload.ts                   (Multer memory storage)
│   │   ├── errorHandler.ts             (Global error handling)
│   │   └── notFoundHandler.ts
│   ├── router/
│   │   └── index.ts                    (Route definitions)
│   ├── validator/
│   │   └── scanHistory.validator.ts    (Zod schemas)
│   └── helper/
│       └── analysisProfiles.ts         (Variety/texture mappings)
├── tsconfig.json
├── package.json
└── .env.example
```

---

## 📦 Required Information to Proceed

### 1. **MongoDB Connection String (REQUIRED)**

- **What:** Full MongoDB URI for scan history persistence
- **Example:** `mongodb+srv://user:password@cluster.mongodb.net/durian-app?retryWrites=true&w=majority`
- **Options:**
  - MongoDB Atlas (cloud) – Recommended for Render/Railway
  - Local MongoDB – If self-hosted
- **Priority:** **HIGH** – Backend cannot save history without this

### 2. **Deployment Platform Choice**

- **Option A:** Render (recommended; free tier available)
- **Option B:** Railway
- Both handle:
  - Node.js environment
  - Environment variables
  - Build & deploy automation
- **Priority:** **MEDIUM** – Needed to set up deployment pipeline

### 3. **Python Runtime Environment**

- **Requirement:** Python 3.8+ installed on deployment host
- **Dependencies:** Install via `pip install -r DURIAN_RIPENESS_CLASSIFICATION/requirements.txt`
  - librosa, joblib, numpy, scikit-learn, soundfile
- **Alternative:** Provide `PYTHON_BIN` env var if Python is at non-standard path
- **Priority:** **HIGH** – Inference fails without this

### 4. **Frontend API Base URL (REQUIRED for Production)**

- **What:** Full URL of deployed backend (e.g., `https://durian-api.onrender.com`)
- **Used by:** Frontend's `EXPO_PUBLIC_API_BASE_URL` environment variable
- **Priority:** **HIGH** – Frontend cannot reach backend without this

### 5. **Optional: CORS Origin (for Security)**

- **What:** Restrict API calls to your frontend domain(s)
- **Example:** `https://your-expo-app.com` or leave as `*` for development
- **Default:** `*` (open to all origins)
- **Priority:** **LOW** – Works with default, but should lock down for production

### 6. **Optional: Prediction Threshold**

- **What:** Confidence threshold below which ripeness is marked as "undetected"
- **Default:** `0.5` (50%)
- **Range:** `0` to `1`
- **Priority:** **LOW** – Can tune after deployment

---

## 🌐 Cách Deploy Backend Ra URL HTTPS Công Khai

Mục tiêu của bước này là tạo ra một URL dạng `https://...` để app mobile có thể gọi được API thật trước khi lên store.

### Phương án khuyến nghị: Render

1. **Tạo MongoDB Atlas database**

- Dùng URI MongoDB Atlas của bạn trong biến môi trường `MONGODB_URI`.
- Không commit URI này vào GitHub; chỉ lưu trong Render environment variables hoặc file `.env` local.

2. **Push code lên GitHub**

- Render cần đọc repository từ GitHub để build và deploy.

3. **Tạo Web Service mới trên Render**

- Chọn repository này.
- Root directory: `backend`
- Build command: `npm run build`
- Start command: `npm run start`

4. **Khai báo environment variables trên Render**

- `MONGODB_URI` = URI MongoDB Atlas của bạn.
- `CORS_ORIGIN` = domain frontend hoặc `*` nếu đang test.
- `PYTHON_BIN` = `python` hoặc `python3` nếu Render nhận dạng khác.
- `AI_MODEL_DIR` = đường dẫn tới thư mục `DURIAN_RIPENESS_CLASSIFICATION` nếu cần.

5. **Deploy service**

- Render sẽ build TypeScript bằng `npm run build`.
- Sau khi start thành công, Render cấp cho bạn một URL HTTPS công khai, ví dụ `https://your-service.onrender.com`.

6. **Kiểm tra URL công khai**

- Mở `https://your-service.onrender.com/` để xem JSON trạng thái.
- Test `POST /predict` bằng file âm thanh mẫu.
- Test `GET /api/v1/scans?username=...` để chắc chắn MongoDB hoạt động.

7. **Gắn URL vào frontend mobile**

- Set `EXPO_PUBLIC_API_BASE_URL=https://your-service.onrender.com`.
- Build lại app Expo để bản phát hành dùng API production.

### Phương án thay thế: Railway

Nếu bạn muốn dùng Railway thay Render, quy trình gần như giống hệt:

1. Tạo project Railway từ GitHub repo.
2. Chọn thư mục `backend`.
3. Thêm các biến môi trường giống như ở Render.
4. Deploy và lấy URL HTTPS từ dashboard Railway.
5. Gắn URL đó vào `EXPO_PUBLIC_API_BASE_URL` rồi build lại app.

### Nếu platform không có Python (lỗi `spawnSync ... ENOENT`)

Nếu khi gọi `/predict` bạn thấy lỗi dạng `spawnSync py ENOENT` hoặc `python: not found`, nghĩa là môi trường chạy Node không có Python/đã cài dependency cần cho inference. Hai lựa chọn an toàn:

- **Dùng Docker (khuyến nghị):** tạo một Docker image chứa cả Node và Python, cài dependencies Python (librosa, joblib, soundfile, v.v.) rồi deploy image lên Render/Railway. Mình đã thêm `Dockerfile` vào repository gốc để bạn có thể dùng ngay.

- **Hoặc** chuyển sang host có Python sẵn (ví dụ một VM hoặc dịch vụ hỗ trợ multiple runtimes) và set `PYTHON_BIN` phù hợp.

Nếu bạn chọn Docker trên Render:

1. Trên Render, khi tạo service chọn **Docker** as the environment (hoặc chỉnh service để dùng Dockerfile ở repo root).
2. Bật **Auto Deploy** từ GitHub hoặc trigger manual deploy.
3. Render sẽ build Docker image bằng `Dockerfile` trong repo gốc; image chứa Python và Node và sẽ chạy `node dist/server.js`.
4. Sau deploy, thử lại `POST /api/v1/predict`.

Mình đã thêm `Dockerfile` và `.dockerignore` vào repository để bạn dùng. Nếu muốn, mình có thể hướng dẫn cụ thể các bước chuyển service sang Docker trên Render.

---

## 🚀 Deployment Checklist

### Pre-Deployment

- [ ] Clone/download this repository
- [ ] Create `.env` file in `backend/` directory (copy from `.env.example`)
- [ ] Fill in required values:
  - `MONGODB_URI` – Your MongoDB connection string
  - `PORT` – Leave as 8080 (Render/Railway will set PORT env var)
  - `HOST` – Leave as 0.0.0.0 (binds to all interfaces)
  - `CORS_ORIGIN` – Your frontend domain (or `*` for development)

### Deploy Backend to Render

1. **Create Render Account** – https://render.com
2. **Connect Repository** – Push code to GitHub
3. **Create New Web Service**
   - Select repository
   - Build Command: `npm run build`
   - Start Command: `npm run start`
4. **Add Environment Variables**
   - `MONGODB_URI` – Your connection string
   - `CORS_ORIGIN` – Your frontend URL
   - `AI_MODEL_DIR` – (Optional) Path to models folder
5. **Deploy** – Render will build and start server
6. **Get Backend URL** – e.g., `https://durian-api.onrender.com`

### Deploy Backend to Railway

1. **Create Railway Account** – https://railway.app
2. **Connect Repository** – Link GitHub repo
3. **Add Environment Variables** (same as Render above)
4. **Deploy** – Railway will auto-detect Node.js and build
5. **Get Backend URL** – Available in Railway dashboard

### Verify Deployment

```bash
# Test if server is running
curl https://your-backend-url.com/health

# Test audio prediction (multipart/form-data)
curl -X POST https://your-backend-url.com/predict \
  -F "audio=@sample_audio.wav"

# Test scan history API
curl https://your-backend-url.com/api/v1/scans?username=testuser
```

---

## 🔑 Environment Variables Reference

| Variable               | Default                                 | Required | Description                                               |
| ---------------------- | --------------------------------------- | -------- | --------------------------------------------------------- |
| `PORT`                 | 8080                                    | No       | Server port; Render/Railway override via process.env.PORT |
| `HOST`                 | 0.0.0.0                                 | No       | Bind address (0.0.0.0 = listen on all interfaces)         |
| `MONGODB_URI`          | ─                                       | **YES**  | MongoDB connection string for scan history                |
| `CORS_ORIGIN`          | \*                                      | No       | Allowed CORS origins; lock down for production            |
| `PYTHON_BIN`           | python                                  | No       | Path to Python executable if non-standard                 |
| `AI_MODEL_DIR`         | ./DURIAN_RIPENESS_CLASSIFICATION/models | No       | Directory containing random_forest.pkl                    |
| `PREDICTION_THRESHOLD` | 0.5                                     | No       | Confidence threshold; below = "undetected"                |

---

## 📝 API Responses

### POST /predict

**Request:** `multipart/form-data` with `audio` file  
**Response (200):**

```json
{
  "ripeness": "ripe",
  "confidence": 0.92,
  "variety": "Musang King",
  "texture": "Creamy",
  "description": "Excellent ripeness; ready to eat. Rich aroma detected.",
  "timestamp": "2026-05-18T12:34:56Z",
  "modelVersion": "1.0",
  "processingTimeMs": 234
}
```

### POST /api/v1/scans

**Request:**

```json
{
  "username": "user123",
  "ripeness": "ripe",
  "confidence": 0.92,
  "variety": "Musang King",
  "texture": "Creamy",
  "description": "...",
  "timestamp": "2026-05-18T12:34:56Z"
}
```

**Response (201):** Scan object with `_id`

### GET /api/v1/scans?username=user123

**Response (200):** Array of user's scans

### DELETE /api/v1/scans/:id?username=user123

**Response (200):** `{ deleted: true }`

---

## 🛠️ Troubleshooting

| Issue                           | Cause                                    | Solution                                                                  |
| ------------------------------- | ---------------------------------------- | ------------------------------------------------------------------------- |
| Backend won't start             | PORT already in use                      | Change PORT in .env                                                       |
| "Cannot find Python"            | Python not installed on host             | Install Python 3.8+ or set PYTHON_BIN                                     |
| "Module librosa not found"      | Python dependencies missing              | Run `pip install -r DURIAN_RIPENESS_CLASSIFICATION/requirements.txt`      |
| "Cannot connect to MongoDB"     | MONGODB_URI incorrect or network blocked | Verify connection string; check IP whitelist (Atlas)                      |
| Frontend can't reach backend    | CORS_ORIGIN mismatch or wrong API URL    | Check EXPO_PUBLIC_API_BASE_URL in frontend; verify CORS_ORIGIN in backend |
| Prediction returns "undetected" | Confidence below threshold               | Tune PREDICTION_THRESHOLD in .env or check audio quality                  |

---

## 📞 Next Steps

1. **Provide:**
   - [ ] MongoDB connection string (MONGODB_URI)
   - [ ] Deployment platform preference (Render or Railway)
   - [ ] Frontend deployment URL (for CORS_ORIGIN)

2. **Setup:**
   - [ ] Create Render/Railway account and connect repository
   - [ ] Set environment variables on deployment platform
   - [ ] Trigger initial deployment

3. **Validate:**
   - [ ] Test backend health endpoint
   - [ ] Test /predict with sample audio
   - [ ] Test /api/v1/scans endpoints
   - [ ] Connect frontend to live backend URL

---

## 📄 Files Summary

| Location                          | Purpose                                 | Status   |
| --------------------------------- | --------------------------------------- | -------- |
| `backend/`                        | Complete Express/TypeScript backend     | ✅ Ready |
| `frontend/`                       | React Native Expo app (updated)         | ✅ Ready |
| `DURIAN_RIPENESS_CLASSIFICATION/` | Python inference script + trained model | ✅ Ready |
| `backend/.env.example`            | Template for environment variables      | ✅ Ready |

---

---

**Trạng thái kết nối hiện tại**

- **Frontend ↔ Backend:** Đã tích hợp và gọi API `POST /predict` từ `frontend/src/services/aiService.ts`. Trong môi trường development (Expo) frontend có thể gọi backend nếu `EXPO_PUBLIC_API_BASE_URL` trỏ tới địa chỉ backend (localhost hoặc URL deploy). Để hoạt động trên production cần URL backend thực tế và biến môi trường tương ứng.
- **Backend ↔ Python AI model:** Backend đã có service gọi `DURIAN_RIPENESS_CLASSIFICATION/src/predict.py` qua `child_process`. Trên môi trường deploy cần có Python 3.8+ và các thư viện trong `requirements.txt`, đồng thời file model `random_forest.pkl` phải tồn tại trong `AI_MODEL_DIR`.
- **Backend ↔ MongoDB:** Mongoose schema và service đã sẵn sàng, nhưng chưa có connection string thực tế — bạn cần cung cấp `MONGODB_URI` để kết nối và lưu lịch sử quét.

**Danh sách thông tin & câu hỏi cần bạn cung cấp (Tiếng Việt, ngắn gọn nhưng đầy đủ)**

1. **Chuỗi kết nối MongoDB (MONGODB_URI)** — ví dụ: `mongodb+srv://user:pass@cluster.mongodb.net/durian_db?retryWrites=true&w=majority`.
2. **Bạn muốn triển khai trên nền tảng nào?** Chọn 1 trong: `Render`, `Railway`, hoặc khác (ghi rõ).
3. **URL backend sau khi deploy (hoặc muốn dùng tên miền riêng?)** — Ví dụ: `https://api.mydomain.com` (dùng để đặt `EXPO_PUBLIC_API_BASE_URL` và `CORS_ORIGIN`).
4. **Bạn đã cài model chưa?** Xác nhận file `DURIAN_RIPENESS_CLASSIFICATION/models/random_forest.pkl` có trong repo hay không.
5. **Đường dẫn Python (nếu khác mặc định)** — nếu máy deploy cần `PYTHON_BIN=/path/to/python`.
6. **Muốn lưu audio ở đâu không?** (Không lưu / Lưu lên S3 / Lưu lên filesystem của server). Nếu chọn S3, cung cấp `S3_BUCKET`, `S3_KEY`, `S3_SECRET` hoặc quyền IAM tương ứng.
7. **Bạn có muốn bật xác thực (JWT) cho API không?** Nếu có, cung cấp thông tin về secret hoặc yêu cầu tôi thêm cấu hình.
8. **Giới hạn confidence (PREDICTION_THRESHOLD)** — mặc định `0.5`, muốn thay đổi không?
9. **CORS_ORIGIN** — danh sách domain frontend được phép truy cập (ví dụ `https://myapp.com`).
10. **Thông tin repo/CI** — repo đã push lên GitHub chưa? Muốn tôi tạo `render.yaml`/Railway config hoặc GitHub Actions không?
11. **Thông tin Expo build (nếu cần):** có dùng EAS không? Cần `EXPO_PUBLIC_API_BASE_URL` để build bản production.
12. **Email liên hệ/owner** — để đặt thông tin liên hệ trong logs hoặc monitoring (tuỳ chọn).
13. **Yêu cầu bảo mật/monitoring** — có muốn bật logging chi tiết, Sentry, hoặc Alerts không?
14. **Ví dụ file audio (tùy chọn)** — nếu có sample audio muốn dùng để test, upload hoặc cung cấp link.

Gửi cho tôi những mục 1–4 trước, tôi sẽ: cấu hình `.env`, hướng dẫn chi tiết deploy trên nền tảng bạn chọn, và chạy kiểm tra end-to-end.

Có — frontend đã được nối để gọi backend.

Ngắn gọn:

Gọi prediction: aiService.ts gửi FormData tới /predict.
UI gọi API: RecordScreen.tsx dùng analyzeAudio() (production path).
Lịch sử: historyService.ts gọi các endpoint /api/v1/scans.
Lưu ý để gọi thật:

Backend phải chạy và EXPO_PUBLIC_API_BASE_URL (hoặc API_BASE_URL) trong app trỏ tới URL backend.
Backend cần Python + thư viện model và MONGODB_URI nếu muốn lưu lịch sử.
Nếu muốn, tôi có thể:
chạy một kiểm tra end-to-end local (start backend + gửi sample audio), hoặc
hướng dẫn bạn cấu hình EXPO_PUBLIC_API_BASE_URL và cách test trên thiết bị. Bạn chọn phương án nào?

**Version:** 1.0 | **Last Updated:** May 2026
