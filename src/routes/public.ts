import { FastifyInstance } from 'fastify';
import QRCode from 'qrcode';
import { prisma } from '../lib/prisma.js';
import { renderPublicPage } from '../templates/public.js';
import { buildWhatsappLink } from '../services/whatsapp.js';

async function resolvePage(app: FastifyInstance, slug?: string, host?: string) {
  if (slug) return prisma.page.findUnique({ where: { slug } });
  if (!host) return null;
  const cleanHost = host.split(':')[0];
  return prisma.page.findFirst({ where: { customDomain: cleanHost } });
}

export async function publicRoutes(app: FastifyInstance) {
  app.get('/health', async () => ({ ok: true }));

  app.get('/p/:slug', async (req, reply) => {
    const page = await resolvePage(app, (req.params as any).slug);
    if (!page || page.status !== 'published') return reply.status(404).send('Not found');
    return reply.type('text/html').send(renderPublicPage(page.type, page.draftJson));
  });

  app.get('/p/:slug/qr/page.png', async (req, reply) => {
    const slug = (req.params as any).slug;
    const png = await QRCode.toBuffer(`${req.protocol}://${req.hostname}/p/${slug}`);
    return reply.type('image/png').send(png);
  });

  app.get('/p/:slug/qr/whatsapp.png', async (req, reply) => {
    const page = await resolvePage(app, (req.params as any).slug);
    if (!page) return reply.status(404).send();
    const draft: any = page.draftJson;
    const link = buildWhatsappLink(draft.whatsapp.phone, draft.whatsapp.message);
    const png = await QRCode.toBuffer(link);
    return reply.type('image/png').send(png);
  });

  app.get('/', async (req, reply) => {
    const page = await resolvePage(app, undefined, req.headers.host);
    if (!page || page.status !== 'published') return reply.status(404).send('Página não encontrada para este domínio.');
    return reply.type('text/html').send(renderPublicPage(page.type, page.draftJson));
  });
}
