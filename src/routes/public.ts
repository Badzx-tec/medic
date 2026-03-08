import type { FastifyInstance, FastifyRequest } from 'fastify';
import QRCode from 'qrcode';
import { prisma } from '../lib/prisma.js';
import {
  renderPublicFaviconSvg,
  renderPublicNotFoundPage,
  renderPublicPage,
  renderPublicSocialCardSvg
} from '../templates/public.js';
import { buildWhatsappLink } from '../services/whatsapp.js';

function getRequestHost(req: FastifyRequest) {
  const forwardedHost = req.headers['x-forwarded-host'];
  const value = Array.isArray(forwardedHost) ? forwardedHost[0] : forwardedHost;
  return value ?? req.headers.host ?? 'localhost:3000';
}

function getRequestProtocol(req: FastifyRequest) {
  const forwardedProto = req.headers['x-forwarded-proto'];
  const value = Array.isArray(forwardedProto) ? forwardedProto[0] : forwardedProto;
  return value?.split(',')[0] ?? req.protocol ?? 'http';
}

function getRequestOrigin(req: FastifyRequest) {
  return `${getRequestProtocol(req)}://${getRequestHost(req)}`;
}

function getCanonicalUrl(req: FastifyRequest, fallbackPath: string, draft?: any) {
  const custom = draft?.seo?.canonicalPath;
  if (typeof custom === 'string' && custom.length > 0) {
    return custom.startsWith('http') ? custom : `${getRequestOrigin(req)}${custom}`;
  }
  return `${getRequestOrigin(req)}${fallbackPath}`;
}

async function resolvePage(slug?: string, host?: string) {
  if (slug) return prisma.page.findUnique({ where: { slug } });
  if (!host) return null;
  const cleanHost = host.split(':')[0];
  return prisma.page.findFirst({ where: { customDomain: cleanHost } });
}

function replyWithNotFound(reply: any) {
  return reply.status(404).type('text/html').send(renderPublicNotFoundPage());
}

export async function publicRoutes(app: FastifyInstance) {
  app.get('/health', async () => ({ ok: true }));

  app.get('/favicon.ico', async (_req, reply) => reply.status(204).send());

  app.get('/favicon.svg', async (req, reply) => {
    const page = await resolvePage(undefined, getRequestHost(req));
    if (!page || page.status !== 'published') return reply.status(204).send();
    return reply
      .header('cache-control', 'public, max-age=3600')
      .type('image/svg+xml')
      .send(renderPublicFaviconSvg(page.type, page.draftJson));
  });

  app.get('/social-card.svg', async (req, reply) => {
    const page = await resolvePage(undefined, getRequestHost(req));
    if (!page || page.status !== 'published') return reply.status(404).send();
    return reply
      .header('cache-control', 'public, max-age=3600')
      .type('image/svg+xml')
      .send(renderPublicSocialCardSvg(page.type, page.draftJson));
  });

  app.get('/p/:slug/favicon.svg', async (req, reply) => {
    const page = await resolvePage((req.params as any).slug);
    if (!page || page.status !== 'published') return reply.status(404).send();
    return reply
      .header('cache-control', 'public, max-age=3600')
      .type('image/svg+xml')
      .send(renderPublicFaviconSvg(page.type, page.draftJson));
  });

  app.get('/p/:slug/social-card.svg', async (req, reply) => {
    const page = await resolvePage((req.params as any).slug);
    if (!page || page.status !== 'published') return reply.status(404).send();
    return reply
      .header('cache-control', 'public, max-age=3600')
      .type('image/svg+xml')
      .send(renderPublicSocialCardSvg(page.type, page.draftJson));
  });

  app.get('/p/:slug', async (req, reply) => {
    const slug = (req.params as any).slug;
    const page = await resolvePage(slug);
    if (!page || page.status !== 'published') return replyWithNotFound(reply);

    return reply.type('text/html').send(renderPublicPage(page.type, page.draftJson, {
      canonicalUrl: getCanonicalUrl(req, `/p/${slug}`, page.draftJson),
      pageUrl: `${getRequestOrigin(req)}/p/${slug}`,
      faviconUrl: `${getRequestOrigin(req)}/p/${slug}/favicon.svg`,
      socialImageUrl: `${getRequestOrigin(req)}/p/${slug}/social-card.svg`,
      host: getRequestHost(req)
    }));
  });

  app.get('/p/:slug/qr/page.png', async (req, reply) => {
    const slug = (req.params as any).slug;
    const png = await QRCode.toBuffer(`${getRequestOrigin(req)}/p/${slug}`);
    return reply.type('image/png').send(png);
  });

  app.get('/p/:slug/qr/whatsapp.png', async (req, reply) => {
    const page = await resolvePage((req.params as any).slug);
    if (!page || page.status !== 'published') return reply.status(404).send();
    const draft: any = page.draftJson;
    const link = buildWhatsappLink(draft.whatsapp.phone, draft.whatsapp.message);
    const png = await QRCode.toBuffer(link);
    return reply.type('image/png').send(png);
  });

  app.get('/', async (req, reply) => {
    const page = await resolvePage(undefined, getRequestHost(req));
    if (!page || page.status !== 'published') return replyWithNotFound(reply);

    return reply.type('text/html').send(renderPublicPage(page.type, page.draftJson, {
      canonicalUrl: getCanonicalUrl(req, '/', page.draftJson),
      pageUrl: `${getRequestOrigin(req)}/`,
      faviconUrl: `${getRequestOrigin(req)}/favicon.svg`,
      socialImageUrl: `${getRequestOrigin(req)}/social-card.svg`,
      host: getRequestHost(req)
    }));
  });
}
