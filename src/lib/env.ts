import 'dotenv/config';
import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.string().default('development'),
  PORT: z.coerce.number().default(3000),
  DATABASE_URL: z.string(),
  JWT_SECRET: z.string().min(10),
  SUPERADMIN_EMAIL: z.string().email(),
  SUPERADMIN_PASSWORD: z.string().min(8)
});

export const env = envSchema.parse(process.env);
