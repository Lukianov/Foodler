import dotenv from 'dotenv';
dotenv.config();

export const config = {
  openaiKey: process.env.OPENAI_API_KEY || '',
};
