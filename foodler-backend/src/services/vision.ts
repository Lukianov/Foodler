import { openai } from '../config/openai';

export interface Product {
  name: string;
  grams?: number;
  kcal?: number;
}

export async function analyzeImage(imageUrl: string): Promise<Product[]> {
  const prompt = `Что изображено на фото? Назови продукты, примерный вес в граммах и примерную калорийность. Ответ в JSON: [{"name": ..., "grams": ..., "kcal": ...}]`;
  const messages = [
    { role: 'system', content: 'Ты диетолог...' },
    {
      role: 'user',
      content: [
        { type: 'image_url', image_url: imageUrl },
        { type: 'text', text: prompt },
      ],
    },
  ];

  const resp = await openai.responses.create({
    model: 'gpt-4o-mini',
    input: messages,
  });

  try {
    const text = resp.output[0].content[0].text;
    return JSON.parse(text) as Product[];
  } catch {
    return [];
  }
}
