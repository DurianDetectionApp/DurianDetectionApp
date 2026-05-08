import path from 'path';

import cors from 'cors';
import dotenv from 'dotenv';
import express, { Request, Response } from 'express';

import uploadRouter from './routes/upload.route';

// 1. Khởi tạo biến môi trường (nếu có file .env)
dotenv.config();

// 2. Khởi tạo ứng dụng Express
const app = express();
const PORT = process.env.PORT || 3000;

// 3. Cài đặt Middlewares cơ bản
app.use(cors()); // Cho phép Frontend (React Native) gọi API mà không bị chặn
app.use(express.json()); // Giúp Backend đọc được dữ liệu dạng JSON gửi lên
app.use(express.urlencoded({ extended: true }));

app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));
app.use('/api/upload', uploadRouter);

// 4. Khởi tạo một Route cơ bản để kiểm tra (Health Check)
app.get('/api/health', (req: Request, res: Response) => {
    res.status(200).json({
        status: 'success',
        message: 'Durian Backend Server is running smoothly! 🍈'
    });
});

// 5. Lắng nghe tại cổng đã định
app.listen(PORT, () => {
    console.log(`🚀 Server đang chạy tại: http://localhost:${PORT}`);
});