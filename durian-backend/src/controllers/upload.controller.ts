import path from 'path';

import type { Request, Response } from 'express';

export function uploadAudio(req: Request, res: Response): void {
    try {
        if (!req.file) {
            res.status(400).json({ message: 'Không tìm thấy file' });
            return;
        }

        const { filename, size, path: absolutePath, originalname, mimetype } = req.file;
        const relativePath = path.join('uploads', filename);

        res.status(200).json({
            message: 'Tải lên file thành công',
            file: {
                filename,
                size,
                path: absolutePath,
                relativePath,
                originalName: originalname,
                mimetype,
            },
        });
    } catch {
        res.status(500).json({
            message: 'Đã xảy ra lỗi không mong muốn. Vui lòng thử lại sau.',
        });
    }
}
