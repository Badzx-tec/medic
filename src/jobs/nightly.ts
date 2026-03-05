import { prisma } from '../lib/prisma.js';

async function run() {
  const now = new Date();
  const expiredSubs = await prisma.subscription.updateMany({ where: { paidUntil: { lt: now } }, data: { status: 'expired' } });

  const pagesToExpire = await prisma.page.findMany({ include: { account: { include: { subscription: true } } } });
  let expiredPages = 0;
  for (const p of pagesToExpire) {
    if (p.account.subscription?.status === 'expired' && p.status === 'published') {
      await prisma.page.update({ where: { id: p.id }, data: { status: 'expired' } });
      expiredPages++;
    }
  }

  const versions = await prisma.pageVersion.findMany({ orderBy: { createdAt: 'desc' } });
  const grouped = new Map<string, string[]>();
  for (const v of versions) grouped.set(v.pageId, [...(grouped.get(v.pageId) ?? []), v.id]);
  let removed = 0;
  for (const ids of grouped.values()) {
    const purge = ids.slice(10);
    if (purge.length) {
      await prisma.pageVersion.deleteMany({ where: { id: { in: purge } } });
      removed += purge.length;
    }
  }

  const publishedCount = await prisma.page.count({ where: { status: 'published' } });
  console.log(JSON.stringify({ expiredSubs: expiredSubs.count, expiredPages, removedVersions: removed, publishedCount }));
}

run().finally(() => prisma.$disconnect());
