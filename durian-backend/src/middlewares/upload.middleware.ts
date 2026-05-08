import fs from 'fs';
import path from 'path';

import multer from 'multer';
import type { Request } from 'express';

/** Chỉ chấp nhận WAV, M4A, MP3 theo MIME. */
const ALLOWED_AUDIO_MIMES = new Set([
    'audio/wav',
    'audio/x-wav',
    'audio/mp4',
    'audio/mpeg',
    'application/octet-stream',
]);

const UPLOAD_DIR = path.join(process.cwd(), 'uploads');
const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10MB

function audioFileFilter(
    _req: Request,
    file: Express.Multer.File,
    cb: multer.FileFilterCallback
): void {
    // [SỬA ĐỔI 1]: Thêm dòng log để xem chính xác client (Postman/App) đang gửi mimetype gì lên server.
    console.log("Định dạng file tải lên (mimetype):", file.mimetype);

    // [SỬA ĐỔI 2]: Tạo biến kiểm tra đuôi file (extension) dự phòng, đề phòng trường hợp thiết bị gửi sai mimetype.
    const isValidExtension = file.originalname.toLowerCase().match(/\.(wav|m4a|mp3)$/);

    // [SỬA ĐỔI 3]: Cho phép qua nếu thỏa mãn mimetype TRONG SET HOẶC đuôi file hợp lệ.
    if (ALLOWED_AUDIO_MIMES.has(file.mimetype) || isValidExtension) {
        cb(null, true);
        return;
    }
    
    // [SỬA ĐỔI 4]: Kèm theo mimetype thực tế vào câu báo lỗi để dễ debug nếu sau này bị lỗi lại.
    cb(new Error(`Chỉ cho phép tải lên file âm thanh. File của bạn có định dạng: ${file.mimetype}`));
}

const audioStorage = multer.diskStorage({
    destination(_req, _file, cb) {
        if (!fs.existsSync(UPLOAD_DIR)) {
            fs.mkdirSync(UPLOAD_DIR, { recursive: true });
        }
        cb(null, UPLOAD_DIR);
    },
    filename(_req, file, cb) {
        const original = path.basename(file.originalname);
        cb(null, `${Date.now()}-${original}`);
    },
});

const audioUploader = multer({
    storage: audioStorage,
    limits: { fileSize: MAX_FILE_SIZE_BYTES },
    fileFilter: audioFileFilter,
});

/** Middleware multipart: một file âm thanh với field `audioFile`. */
export const uploadAudioMiddleware = audioUploader.single('audioFile');