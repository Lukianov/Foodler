import { Router } from 'express';
import { prisma } from '../db';

export const diaryRouter = Router();

diaryRouter.get('/today', async (req, res) => {
  try {
    const user = (req as any).user;
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    const end = new Date(start);
    end.setDate(end.getDate() + 1);

    const logs = await prisma.foodLog.findMany({
      where: {
        userId: user.telegramId,
        timestamp: {
          gte: start,
          lt: end,
        },
      },
      orderBy: { timestamp: 'asc' },
    });

    const totalKcal = logs.reduce((sum, log) => sum + log.totalKcal, 0);
    res.json({ logs, totalKcal });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to fetch diary' });
  }
});
