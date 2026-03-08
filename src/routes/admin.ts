import fs from 'node:fs/promises';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { FastifyInstance } from 'fastify';
import { Prisma } from '@prisma/client';
import { prisma } from '../lib/prisma.js';
import { pageDraftSchema, hasForbiddenClaims } from '../schemas/page.js';
import { PLAN_LIMITS } from '../services/plan.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const uploadsRoot = path.resolve(__dirname, '../../storage/uploads/pages');

type PageWriteBody = {
  accountId?: string;
  type?: 'doctor' | 'clinic';
  slug?: string;
  themePreset?: string;
  customDomain?: string | null;
  draftJson?: unknown;
};

type MediaUploadBody = {
  dataUrl?: string;
  kind?: 'hero' | 'portrait' | 'social' | 'clinic-logo' | 'clinic-hero';
};

function normalizeOptionalString(value: unknown) {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function parseDraftOrThrow(draftJson: unknown) {
  const parsed = pageDraftSchema.safeParse(draftJson);
  if (!parsed.success) {
    const error = new Error('Campos públicos inválidos');
    (error as Error & { statusCode?: number; details?: unknown }).statusCode = 400;
    (error as Error & { statusCode?: number; details?: unknown }).details = parsed.error.flatten();
    throw error;
  }
  return parsed.data;
}

function dataUrlToBuffer(dataUrl?: string) {
  const match = dataUrl?.match(/^data:(image\/(?:png|jpeg|jpg|webp));base64,([A-Za-z0-9+/=]+)$/);
  if (!match) {
    const error = new Error('Imagem inválida. Envie PNG, JPG ou WEBP.');
    (error as Error & { statusCode?: number }).statusCode = 400;
    throw error;
  }

  const mime = match[1] === 'image/jpg' ? 'image/jpeg' : match[1];
  const ext = mime === 'image/png' ? 'png' : mime === 'image/webp' ? 'webp' : 'jpg';
  const buffer = Buffer.from(match[2], 'base64');

  if (buffer.byteLength > 4 * 1024 * 1024) {
    const error = new Error('Imagem maior que o limite de 4 MB.');
    (error as Error & { statusCode?: number }).statusCode = 400;
    throw error;
  }

  return { buffer, ext };
}

function mapError(reply: any, error: unknown) {
  if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
    return reply.status(409).send({ message: 'Já existe uma página com esse slug ou domínio.' });
  }

  const statusCode = typeof error === 'object' && error && 'statusCode' in error && typeof (error as any).statusCode === 'number'
    ? (error as any).statusCode
    : 500;
  const details = typeof error === 'object' && error && 'details' in error ? (error as any).details : undefined;
  const message = error instanceof Error ? error.message : 'Erro interno';

  return reply.status(statusCode).send(details ? { message, details } : { message });
}

export async function adminRoutes(app: FastifyInstance) {
  app.addHook('onRequest', async (req) => {
    if (!req.url.startsWith('/api/admin')) return;
    await req.jwtVerify();
  });

  app.get('/api/admin/pages', async () =>
    prisma.page.findMany({
      include: { account: true },
      orderBy: { updatedAt: 'desc' }
    })
  );

  app.get('/api/admin/accounts', async () =>
    prisma.account.findMany({
      include: { subscription: true },
      orderBy: { createdAt: 'asc' }
    })
  );

  app.post('/api/admin/accounts', async (req) => {
    const body = req.body as { name: string; email: string; plan: 'TRIAL' | 'BASIC' | 'PRO'; paidUntil: string };
    const account = await prisma.account.create({ data: { name: body.name, email: body.email } });
    await prisma.subscription.create({ data: { accountId: account.id, plan: body.plan, paidUntil: new Date(body.paidUntil) } });
    return account;
  });

  app.post('/api/admin/pages', async (req, reply) => {
    try {
      const body = req.body as PageWriteBody;
      const draftJson = parseDraftOrThrow(body.draftJson);

      if (!body.accountId || !body.type || !body.slug) {
        return reply.status(400).send({ message: 'Conta, tipo e slug são obrigatórios.' });
      }

      const sub = await prisma.subscription.findUnique({ where: { accountId: body.accountId } });
      if (!sub) return reply.status(400).send({ message: 'Assinatura não encontrada' });

      const count = await prisma.page.count({ where: { accountId: body.accountId } });
      if (count >= PLAN_LIMITS[sub.plan]) return reply.status(400).send({ message: 'Limite do plano excedido' });

      return await prisma.page.create({
        data: {
          accountId: body.accountId,
          type: body.type,
          slug: body.slug.trim(),
          themePreset: body.themePreset?.trim() || 'clinic-trust',
          customDomain: normalizeOptionalString(body.customDomain),
          draftJson: draftJson as Prisma.InputJsonValue
        }
      });
    } catch (error) {
      return mapError(reply, error);
    }
  });

  app.patch('/api/admin/pages/:id', async (req, reply) => {
    try {
      const id = (req.params as { id: string }).id;
      const body = req.body as PageWriteBody;
      const page = await prisma.page.findUnique({ where: { id } });
      if (!page) return reply.status(404).send({ message: 'Página não encontrada' });

      const draftJson = parseDraftOrThrow(body.draftJson ?? page.draftJson);

      return await prisma.page.update({
        where: { id },
        data: {
          slug: body.slug?.trim() || page.slug,
          themePreset: body.themePreset?.trim() || page.themePreset,
          customDomain: body.customDomain === undefined ? page.customDomain : normalizeOptionalString(body.customDomain),
          draftJson: draftJson as Prisma.InputJsonValue
        }
      });
    } catch (error) {
      return mapError(reply, error);
    }
  });

  app.post('/api/admin/pages/:id/media', async (req, reply) => {
    try {
      const id = (req.params as { id: string }).id;
      const page = await prisma.page.findUnique({ where: { id } });
      if (!page) return reply.status(404).send({ message: 'Página não encontrada' });

      const body = req.body as MediaUploadBody;
      if (!body.kind) return reply.status(400).send({ message: 'Tipo de mídia obrigatório.' });

      const { buffer, ext } = dataUrlToBuffer(body.dataUrl);
      const dir = path.join(uploadsRoot, page.id);
      await fs.mkdir(dir, { recursive: true });

      const fileName = `${body.kind}-${Date.now()}-${randomUUID().slice(0, 8)}.${ext}`;
      const fullPath = path.join(dir, fileName);
      await fs.writeFile(fullPath, buffer);

      return {
        url: `/uploads/pages/${page.id}/${fileName}`
      };
    } catch (error) {
      return mapError(reply, error);
    }
  });

  app.post('/api/admin/pages/:id/publish', async (req, reply) => {
    const page = await prisma.page.findUnique({ where: { id: (req.params as any).id } });
    if (!page) return reply.status(404).send({ message: 'Página não encontrada' });

    const parsed = pageDraftSchema.safeParse(page.draftJson);
    if (!parsed.success) {
      return reply.status(400).send({ message: 'Campos públicos inválidos para publicação', details: parsed.error.flatten() });
    }

    if (hasForbiddenClaims(page.draftJson)) {
      return reply.status(400).send({ message: 'Conteúdo sensacionalista detectado' });
    }

    const version = await prisma.pageVersion.create({
      data: { pageId: page.id, versionJson: page.draftJson as Prisma.InputJsonValue, publishedAt: new Date() }
    });

    return prisma.page.update({ where: { id: page.id }, data: { status: 'published', publishedVersionId: version.id } });
  });
}
