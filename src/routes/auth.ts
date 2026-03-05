import { FastifyInstance } from 'fastify';
import { env } from '../lib/env.js';

export async function authRoutes(app: FastifyInstance) {
  app.post('/api/auth/login', async (req, reply) => {
    const body = req.body as { email: string; password: string };
    if (body.email !== env.SUPERADMIN_EMAIL || body.password !== env.SUPERADMIN_PASSWORD) {
      return reply.status(401).send({ message: 'Credenciais inválidas' });
    }
    const token = app.jwt.sign({ role: 'superadmin', email: body.email });
    return { token };
  });
}
