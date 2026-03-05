import 'dotenv/config';
import { PrismaClient, Plan, SubscriptionStatus } from '@prisma/client';

const prisma = new PrismaClient();

const doctorDraft = {
  seo: { title: 'Dra. Ana Costa | Dermatologia', description: 'Dermatologia clínica em São Paulo.' },
  professional: { name: 'Dra. Ana Costa', crmNumber: '123456', crmUF: 'SP', specialty: 'Dermatologia', rqeNumber: '78910' },
  whatsapp: { phone: '5511999999999', message: 'Olá, vim pela página e gostaria de agendar uma consulta/avaliação em Unidade Centro.' },
  location: { address: 'Av. Paulista, 1000 - São Paulo', mapsUrl: 'https://maps.google.com/?q=Av+Paulista+1000' },
  sections: ['hero', 'professional-identification', 'services', 'hours', 'faq', 'cta-final', 'legal-footer']
};

const clinicDraft = {
  seo: { title: 'Clínica Vida Plena', description: 'Clínica multidisciplinar em Campinas.' },
  clinic: { clinicName: 'Clínica Vida Plena', clinicCrmRegistration: 'CRM-SP 22334', directorName: 'Dr. Bruno Lima', directorCrm: 'CRM 112233/SP' },
  team: [{ name: 'Dra. Luiza Melo', crmNumber: '654321', crmUF: 'SP', specialty: 'Cardiologia', rqeNumber: '1122' }],
  whatsapp: { phone: '5511988888888', message: 'Olá, vim pela página e gostaria de agendar uma consulta/avaliação em Unidade Cambuí.' },
  location: { address: 'Rua 10, 200 - Campinas', mapsUrl: 'https://maps.google.com/?q=Rua+10+200+Campinas' },
  sections: ['hero', 'professional-identification', 'team', 'insurance', 'hours', 'location', 'legal-footer']
};

async function main() {
  const account = await prisma.account.upsert({
    where: { email: 'contato@cliniclink.demo' },
    update: {},
    create: { name: 'Conta Demo', email: 'contato@cliniclink.demo' }
  });

  await prisma.subscription.upsert({
    where: { accountId: account.id },
    update: {},
    create: {
      accountId: account.id,
      plan: Plan.PRO,
      paidUntil: new Date(Date.now() + 30 * 24 * 3600 * 1000),
      status: SubscriptionStatus.active
    }
  });

  await prisma.page.upsert({
    where: { slug: 'dra-ana-costa' },
    update: {},
    create: { accountId: account.id, type: 'doctor', slug: 'dra-ana-costa', status: 'published', draftJson: doctorDraft, themePreset: 'clinic-trust' }
  });

  await prisma.page.upsert({
    where: { slug: 'clinica-vida-plena' },
    update: {},
    create: { accountId: account.id, type: 'clinic', slug: 'clinica-vida-plena', status: 'published', draftJson: clinicDraft, themePreset: 'clinic-modern' }
  });

  console.log('Seed concluído. Superadmin é configurado por env vars.');
}

main().finally(() => prisma.$disconnect());
