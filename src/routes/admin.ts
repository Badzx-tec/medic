import { FastifyInstance } from 'fastify';
import { Prisma } from '@prisma/client';
import { prisma } from '../lib/prisma.js';
import { pageDraftSchema, hasForbiddenClaims, doctorSchema, clinicSchema } from '../schemas/page.js';
import { PLAN_LIMITS } from '../services/plan.js';

export async function adminRoutes(app: FastifyInstance) {
  app.addHook('onRequest', async (req) => {
    if (!req.url.startsWith('/api/admin')) return;
    await req.jwtVerify();
  });

  app.get('/api/admin/pages', async () => prisma.page.findMany({ include: { account: true } }));

  app.post('/api/admin/accounts', async (req) => {
    const body = req.body as { name: string; email: string; plan: 'TRIAL' | 'BASIC' | 'PRO'; paidUntil: string };
    const account = await prisma.account.create({ data: { name: body.name, email: body.email } });
    await prisma.subscription.create({ data: { accountId: account.id, plan: body.plan, paidUntil: new Date(body.paidUntil) } });
    return account;
  });

  app.post('/api/admin/pages', async (req, reply) => {
    const body = req.body as any;
    const parsed = pageDraftSchema.safeParse(body.draftJson);
    if (!parsed.success) return reply.status(400).send(parsed.error.flatten());

    const sub = await prisma.subscription.findUnique({ where: { accountId: body.accountId } });
    if (!sub) return reply.status(400).send({ message: 'Assinatura não encontrada' });

    const count = await prisma.page.count({ where: { accountId: body.accountId } });
    if (count >= PLAN_LIMITS[sub.plan]) return reply.status(400).send({ message: 'Limite do plano excedido' });

    return prisma.page.create({ data: body });
  });

  app.post('/api/admin/pages/:id/publish', async (req, reply) => {
    const page = await prisma.page.findUnique({ where: { id: (req.params as any).id } });
    if (!page) return reply.status(404).send({ message: 'Página não encontrada' });
    if (hasForbiddenClaims(page.draftJson)) return reply.status(400).send({ message: 'Conteúdo sensacionalista detectado' });

    if (page.type === 'doctor') {
      const ok = doctorSchema.safeParse(page.draftJson);
      if (!ok.success) return reply.status(400).send({ message: 'Campos CFM de médico inválidos' });
    }
    if (page.type === 'clinic') {
      const ok = clinicSchema.safeParse(page.draftJson);
      if (!ok.success) return reply.status(400).send({ message: 'Campos CFM de clínica inválidos' });
    }

    const version = await prisma.pageVersion.create({
      data: { pageId: page.id, versionJson: page.draftJson as Prisma.InputJsonValue, publishedAt: new Date() }
    });
    return prisma.page.update({ where: { id: page.id }, data: { status: 'published', publishedVersionId: version.id } });
  });
}
