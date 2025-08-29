import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '';

function parseInitData(data: string) {
  const params = new URLSearchParams(data);
  const obj: Record<string, string> = {};
  params.forEach((value, key) => {
    obj[key] = value;
  });
  return obj;
}

function verify(initData: string) {
  const parsed = parseInitData(initData);
  const hash = parsed.hash;
  delete parsed.hash;
  const dataCheckArr = Object.keys(parsed)
    .sort()
    .map((key) => `${key}=${parsed[key]}`)
    .join('\n');
  const secret = crypto.createHash('sha256').update(BOT_TOKEN).digest();
  const hmac = crypto
    .createHmac('sha256', secret)
    .update(dataCheckArr)
    .digest('hex');
  return hmac === hash ? parsed : null;
}

export function telegramAuth(req: Request, res: Response, next: NextFunction) {
  const initData = req.headers['x-telegram-init-data'];
  if (typeof initData !== 'string') {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  const data = verify(initData);
  if (!data) {
    return res.status(401).json({ error: 'Invalid signature' });
  }
  (req as any).user = {
    telegramId: data.id,
    username: data.username,
    firstName: data.first_name,
  };
  next();
}
