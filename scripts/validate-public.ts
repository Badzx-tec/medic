import { renderPublicFaviconSvg, renderPublicPage, renderPublicSocialCardSvg } from '../src/templates/public.js';

function assert(condition: unknown, message: string) {
  if (!condition) throw new Error(message);
}

function extractJsonLd(html: string) {
  const match = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
  assert(match, 'JSON-LD não encontrado no HTML público.');
  return JSON.parse(match![1]);
}

const doctorDraft = {
  seo: {
    title: 'Dra. Marina Prado | Cardiologia clínica em Belo Horizonte',
    description: 'Atendimento cardiológico particular com experiência organizada, escuta clara e jornada de consulta pensada para confiança.'
  },
  branding: {
    logoText: 'Marina Prado Cardiologia',
    accentColor: '#0E6A6C',
    socialImageUrl: '/uploads/social-demo.jpg'
  },
  professional: {
    name: 'Dra. Marina Prado',
    crmNumber: '123456',
    crmUF: 'MG',
    specialty: 'Cardiologia',
    rqeNumber: '7788'
  },
  whatsapp: { phone: '5531999999999', message: 'Olá, gostaria de agendar uma consulta.' },
  contact: {
    phoneDisplay: '+55 31 99999-9999',
    bookingUrl: 'https://agendamento.demo/marina-prado',
    instagramUrl: 'https://instagram.com/marinaprado.demo'
  },
  location: {
    address: 'Av. Afonso Pena, 1000 - Centro',
    mapsUrl: 'https://maps.google.com/?q=Av+Afonso+Pena+1000+Belo+Horizonte',
    city: 'Belo Horizonte',
    state: 'MG',
    country: 'BR'
  },
  about: {
    summary: 'Consulta particular com foco em clareza, acompanhamento responsável e experiência acolhedora.',
    approach: 'O atendimento foi estruturado para unir escuta, orientação objetiva e previsibilidade no contato.',
    credentials: ['CRM-MG 123456', 'RQE 7788']
  },
  care: {
    consultationModes: ['Consulta presencial'],
    steps: [
      { title: 'Contato inicial', description: 'A equipe confirma disponibilidade e orienta o preparo necessário.' },
      { title: 'Consulta em consultório', description: 'A avaliação é conduzida com foco em compreensão e clareza.' }
    ]
  },
  hours: [{ label: 'Segunda a sexta', value: '08h às 18h' }],
  services: [
    { name: 'Consulta cardiológica', description: 'Avaliação clínica com explicação clara e acompanhamento individualizado.' }
  ],
  faq: [{ q: 'Como agendar?', a: 'O agendamento é feito pelo WhatsApp ou pelo link de agenda.' }],
  sections: ['hero', 'about', 'services', 'faq', 'cta-final'],
  testimonials: []
};

const clinicDraft = {
  seo: {
    title: 'Clínica Horizonte | Especialidades integradas em Curitiba',
    description: 'Clínica particular com jornada assistencial organizada, ambiente acolhedor e comunicação clara.'
  },
  branding: {
    logoText: 'Clínica Horizonte',
    accentColor: '#2953A6'
  },
  clinic: {
    clinicName: 'Clínica Horizonte',
    clinicCrmRegistration: 'CRM-PR 9988',
    directorName: 'Dr. Paulo Neri',
    directorCrm: 'CRM 445566/PR'
  },
  team: [{ name: 'Dra. Elisa Torres', crmNumber: '334455', crmUF: 'PR', specialty: 'Neurologia' }],
  whatsapp: { phone: '5541999999999', message: 'Olá, gostaria de falar com a clínica.' },
  location: {
    address: 'Rua das Flores, 200 - Centro',
    mapsUrl: 'https://maps.google.com/?q=Rua+das+Flores+200+Curitiba',
    city: 'Curitiba',
    state: 'PR',
    country: 'BR'
  },
  about: { summary: 'Operação clínica particular com fluxo de atendimento mais claro e organizado.' },
  services: [{ name: 'Consultas integradas', description: 'Atendimento coordenado entre profissionais da equipe.' }],
  faq: [{ q: 'Atende mais de uma especialidade?', a: 'Sim, a clínica integra especialidades em uma jornada única.' }],
  sections: ['hero', 'about', 'services', 'faq', 'cta-final'],
  testimonials: []
};

const doctorHtml = renderPublicPage('doctor', doctorDraft, {
  canonicalUrl: 'https://demo.cliniclink.com.br/p/dra-marina-prado',
  pageUrl: 'https://demo.cliniclink.com.br/p/dra-marina-prado',
  faviconUrl: 'https://demo.cliniclink.com.br/p/dra-marina-prado/favicon.svg',
  socialImageUrl: 'https://demo.cliniclink.com.br/p/dra-marina-prado/social-card.svg',
  host: 'demo.cliniclink.com.br'
});

assert(doctorHtml.includes('summary_large_image'), 'Twitter card premium ausente.');
assert(doctorHtml.includes('rel="canonical"'), 'Canonical ausente.');
assert(doctorHtml.includes('sticky-cta'), 'CTA fixo não renderizado.');
assert(doctorHtml.includes('https://demo.cliniclink.com.br/uploads/social-demo.jpg'), 'URL relativa de social image não foi resolvida.');

const doctorJsonLd = extractJsonLd(doctorHtml);
assert(Array.isArray(doctorJsonLd), 'JSON-LD deve ser um array.');
assert(doctorJsonLd.some((entry) => entry['@type'] === 'Physician'), 'Structured data Physician ausente.');
assert(doctorJsonLd.some((entry) => entry['@type'] === 'FAQPage'), 'Structured data FAQPage ausente.');

const clinicHtml = renderPublicPage('clinic', clinicDraft, {
  canonicalUrl: 'https://demo.cliniclink.com.br/p/clinica-horizonte',
  pageUrl: 'https://demo.cliniclink.com.br/p/clinica-horizonte',
  faviconUrl: 'https://demo.cliniclink.com.br/p/clinica-horizonte/favicon.svg',
  socialImageUrl: 'https://demo.cliniclink.com.br/p/clinica-horizonte/social-card.svg',
  host: 'demo.cliniclink.com.br'
});

const clinicJsonLd = extractJsonLd(clinicHtml);
assert(clinicJsonLd.some((entry) => entry['@type'] === 'MedicalClinic'), 'Structured data MedicalClinic ausente.');

const favicon = renderPublicFaviconSvg('doctor', doctorDraft);
assert(favicon.startsWith('<?xml'), 'Favicon SVG inválido.');
const socialCard = renderPublicSocialCardSvg('clinic', clinicDraft);
assert(socialCard.includes('Clínica Horizonte'), 'Social card SVG inválido.');

console.log('Public validation passed');
