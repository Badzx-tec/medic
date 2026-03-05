import Fastify from 'fastify';
import jwt from '@fastify/jwt';
import cors from '@fastify/cors';
import rateLimit from '@fastify/rate-limit';
import fastifyStatic from '@fastify/static';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { env } from './lib/env.js';
import { authRoutes } from './routes/auth.js';
import { adminRoutes } from './routes/admin.js';
import { publicRoutes } from './routes/public.js';

const app = Fastify({ logger: { level: 'info' } });
const __dirname = path.dirname(fileURLToPath(import.meta.url));

await app.register(cors, { origin: true });
await app.register(rateLimit, { max: 100, timeWindow: '1 minute' });
await app.register(jwt, { secret: env.JWT_SECRET });
await app.register(fastifyStatic, { root: path.resolve(__dirname, '../dist/admin'), prefix: '/admin/' });

await app.register(authRoutes);
await app.register(adminRoutes);
await app.register(publicRoutes);

app.get('/admin*', async (_req, reply) => {
  reply.sendFile('index.html');
});

app.listen({ port: env.PORT, host: '0.0.0.0' });
