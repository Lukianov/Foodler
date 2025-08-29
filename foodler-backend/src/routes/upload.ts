import { Router } from 'express';
import multer from 'multer';
import { uploadImage } from '../services/s3';
import { analyzeImage } from '../services/vision';
import { prisma } from '../db';

const upload = multer({ storage: multer.memoryStorage() });
export const uploadRouter = Router();

uploadRouter.post('/', upload.single('image'), async (req, res) => {
  try {
    const user = (req as any).user;
    if (!req.file) return res.status(400).json({ error: 'No file' });

    const imageUrl = await uploadImage(req.file);
    const products = await analyzeImage(imageUrl);

    const totalKcal = products.reduce((sum, p) => sum + (p.kcal || 0), 0);
    const log = await prisma.foodLog.create({
      data: {
        userId: user.telegramId,
        imageUrl,
        products,
        totalKcal,
      },
    });

    res.json(log);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Upload failed' });
  }
});
