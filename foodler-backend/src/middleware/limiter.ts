import { Request, Response, NextFunction } from 'express';

const limit = 3;
const counters: Record<string, { count: number; date: string }> = {};

export function limiter(req: Request, res: Response, next: NextFunction) {
  const user = (req as any).user;
  if (!user) return res.status(401).json({ error: 'Unauthorized' });

  const today = new Date().toISOString().slice(0, 10);
  const counter = counters[user.telegramId];

  if (!counter || counter.date !== today) {
    counters[user.telegramId] = { count: 0, date: today };
  }

  if (counters[user.telegramId].count >= limit && !user.isPremium) {
    return res.status(402).json({ error: 'Daily limit reached' });
  }

  counters[user.telegramId].count++;
  next();
}
