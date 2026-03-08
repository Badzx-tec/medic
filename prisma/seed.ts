import 'dotenv/config';
import { PrismaClient, Plan, SubscriptionStatus } from '@prisma/client';

const prisma = new PrismaClient();

const doctorDraft = {
  seo: {
    title: 'Dra. Ana Costa | Dermatologia clínica e acompanhamento dermatológico em São Paulo',
    description: 'Atendimento dermatológico particular com foco em escuta, clareza e acompanhamento individualizado no coração de São Paulo.'
  },
  branding: {
    eyebrow: 'Dermatologia clínica',
    tagline: 'Cuidado dermatológico com linguagem clara, acompanhamento cuidadoso e experiência premium de consultório.',
    accentColor: '#0E6A6C',
    logoText: 'Ana Costa Dermatologia'
  },
  professional: {
    name: 'Dra. Ana Costa',
    crmNumber: '123456',
    crmUF: 'SP',
    specialty: 'Dermatologia',
    rqeNumber: '78910',
    headline: 'Atendimento dermatológico com foco em conforto, orientação objetiva e conduta baseada em critério clínico.'
  },
  whatsapp: { phone: '5511999999999', message: 'Olá, vim pela página e gostaria de agendar uma consulta em São Paulo.' },
  contact: {
    phoneDisplay: '+55 11 99999-9999',
    email: 'agenda@cliniclink.demo',
    bookingUrl: 'https://cliniclink.demo/agendar/dra-ana-costa',
    instagramUrl: 'https://instagram.com/cliniclink.demo',
    sameAs: ['https://instagram.com/cliniclink.demo']
  },
  location: {
    address: 'Av. Paulista, 1000 - Bela Vista',
    mapsUrl: 'https://maps.google.com/?q=Av+Paulista+1000+Sao+Paulo',
    city: 'São Paulo',
    state: 'SP',
    postalCode: '01310-100',
    country: 'BR',
    summary: 'Consultório com acesso facilitado na região central.'
  },
  about: {
    summary: 'A Dra. Ana Costa atua em dermatologia clínica com atendimento particular voltado a diagnóstico cuidadoso, explicações objetivas e definição de conduta com serenidade. A experiência foi desenhada para quem valoriza clareza, pontualidade e continuidade no acompanhamento.',
    approach: 'Cada consulta é conduzida com escuta ativa, revisão do contexto do paciente e orientações práticas para o dia a dia, sempre com comunicação responsável e sem promessas inadequadas.',
    highlights: ['Consulta particular com agenda organizada', 'Atendimento clínico com orientações claras', 'Acompanhamento presencial em ambiente reservado'],
    credentials: ['CRM-SP 123456', 'RQE 78910', 'Atendimento particular com foco em dermatologia clínica'],
    languages: ['Português', 'Inglês']
  },
  care: {
    consultationModes: ['Consulta presencial', 'Retorno programado'],
    audience: ['Adultos', 'Adolescentes'],
    steps: [
      { title: 'Escuta inicial', description: 'Entendimento da queixa principal, contexto clínico e histórico dermatológico.' },
      { title: 'Avaliação em consultório', description: 'Exame direcionado com explicação clara sobre hipóteses e próximos passos.' },
      { title: 'Plano de acompanhamento', description: 'Orientações registradas, retorno quando necessário e canal rápido para agendamento.' }
    ]
  },
  hours: [
    { label: 'Segunda a quinta', value: '08h às 18h' },
    { label: 'Sexta-feira', value: '08h às 16h' },
    { label: 'Sábado', value: 'Atendimento sob agenda' }
  ],
  services: [
    { name: 'Consulta dermatológica', description: 'Avaliação clínica com foco em diagnóstico, orientações e acompanhamento individualizado.' },
    { name: 'Seguimento de condições cutâneas', description: 'Acompanhamento de queixas recorrentes com plano de retorno organizado e comunicação clara.' },
    { name: 'Revisão preventiva da pele', description: 'Consulta voltada a observação clínica e orientação de rotina, sempre com abordagem responsável.' }
  ],
  faq: [
    { q: 'Como funciona o agendamento?', a: 'O agendamento pode ser solicitado pelo WhatsApp. A equipe confirma disponibilidade, orienta o preparo quando necessário e envia a confirmação.' },
    { q: 'A consulta é presencial?', a: 'O atendimento principal é presencial em consultório. Retornos e orientações são organizados conforme a necessidade do acompanhamento.' },
    { q: 'Vocês emitem orientações por escrito?', a: 'Sim. As orientações essenciais e o planejamento do acompanhamento são alinhados ao final da consulta.' }
  ],
  sections: ['hero', 'about', 'services', 'care', 'professional-identification', 'hours', 'faq', 'cta-final', 'legal-footer']
};

const clinicDraft = {
  seo: {
    title: 'Clínica Vida Plena | Especialidades integradas e atendimento particular em Campinas',
    description: 'Clínica particular com estrutura organizada, equipe multidisciplinar e experiência de atendimento pensada para acolhimento, clareza e continuidade.'
  },
  branding: {
    eyebrow: 'Clínica particular multidisciplinar',
    tagline: 'Uma experiência assistencial mais clara, bem organizada e acolhedora para quem busca acompanhamento particular em Campinas.',
    accentColor: '#2953A6',
    logoText: 'Vida Plena'
  },
  clinic: {
    clinicName: 'Clínica Vida Plena',
    clinicCrmRegistration: 'CRM-SP 22334',
    directorName: 'Dr. Bruno Lima',
    directorCrm: 'CRM 112233/SP',
    summary: 'Clínica particular com operação leve, agenda organizada e foco em experiência assistencial mais clara para pacientes e famílias.'
  },
  team: [
    { name: 'Dra. Luiza Melo', crmNumber: '654321', crmUF: 'SP', specialty: 'Cardiologia', role: 'Cardiologia clínica', rqeNumber: '1122' },
    { name: 'Dr. Rafael Nunes', crmNumber: '765432', crmUF: 'SP', specialty: 'Clínica Médica', role: 'Coordenação do cuidado', rqeNumber: '3344' }
  ],
  whatsapp: { phone: '5511988888888', message: 'Olá, vim pela página e gostaria de agendar uma consulta em Campinas.' },
  contact: {
    phoneDisplay: '+55 11 98888-8888',
    email: 'contato@cliniclink.demo',
    bookingUrl: 'https://cliniclink.demo/agendar/clinica-vida-plena',
    instagramUrl: 'https://instagram.com/cliniclink.demo',
    sameAs: ['https://instagram.com/cliniclink.demo']
  },
  location: {
    address: 'Rua 10, 200 - Cambuí',
    mapsUrl: 'https://maps.google.com/?q=Rua+10+200+Campinas',
    city: 'Campinas',
    state: 'SP',
    postalCode: '13025-000',
    country: 'BR',
    summary: 'Atendimento particular em endereço de fácil acesso na região do Cambuí.'
  },
  about: {
    summary: 'A Clínica Vida Plena foi concebida para oferecer uma jornada assistencial elegante, previsível e acolhedora, com ambiente discreto, equipe integrada e comunicação clara desde o primeiro contato.',
    approach: 'O cuidado é organizado para favorecer compreensão, continuidade e conveniência, sem perder a seriedade institucional esperada de uma operação médica particular.',
    highlights: ['Equipe integrada e agenda coordenada', 'Atendimento particular com experiência acolhedora', 'Fluxo de contato rápido para pacientes e famílias'],
    credentials: ['Registro da clínica CRM-SP 22334', 'Diretor técnico Dr. Bruno Lima - CRM 112233/SP'],
    languages: ['Português']
  },
  care: {
    consultationModes: ['Consultas presenciais', 'Retornos programados', 'Acompanhamento coordenado entre especialidades'],
    audience: ['Adultos', 'Famílias'],
    steps: [
      { title: 'Triagem de agenda', description: 'A equipe organiza o melhor encaixe de agenda e orienta o paciente antes da visita.' },
      { title: 'Atendimento em clínica', description: 'A consulta acontece em ambiente reservado, com recepção cuidadosa e fluxo assistencial claro.' },
      { title: 'Continuidade do cuidado', description: 'Retornos, encaminhamentos internos e novas avaliações são organizados de forma integrada.' }
    ]
  },
  hours: [
    { label: 'Segunda a sexta', value: '07h30 às 19h' },
    { label: 'Sábado', value: '08h às 13h' }
  ],
  services: [
    { name: 'Consultas em especialidades integradas', description: 'Atendimento particular com organização de agenda e continuidade assistencial entre profissionais.' },
    { name: 'Avaliação inicial da jornada do paciente', description: 'Primeiro contato estruturado para entender demanda, contexto e encaminhamento mais adequado.' },
    { name: 'Coordenação de retornos', description: 'Planejamento de retornos e acompanhamento para uma experiência mais previsível e segura.' }
  ],
  insurance: ['Atendimento particular', 'Recibo para reembolso conforme elegibilidade do convênio'],
  faq: [
    { q: 'Como funciona o primeiro contato?', a: 'O primeiro contato acontece pelo WhatsApp. A equipe entende a demanda e orienta o melhor formato de agendamento.' },
    { q: 'A clínica atende mais de uma especialidade?', a: 'Sim. A operação foi estruturada para integrar especialidades e facilitar a continuidade do cuidado quando indicado.' },
    { q: 'Há apoio para reembolso?', a: 'Quando aplicável, a equipe informa a documentação disponível para solicitação de reembolso junto ao convênio.' }
  ],
  sections: ['hero', 'about', 'services', 'care', 'professional-identification', 'team', 'insurance', 'hours', 'faq', 'cta-final', 'legal-footer']
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
