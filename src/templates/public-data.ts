import { buildWhatsappLink } from '../services/whatsapp.js';

export type PublicPageType = 'doctor' | 'clinic';

export type PublicRenderOptions = {
  canonicalUrl: string;
  pageUrl: string;
  faviconUrl: string;
  socialImageUrl: string;
  host: string;
};

export type NavItem = { href: string; label: string };
export type LinkItem = { label: string; value: string; href: string };
export type KeyValueItem = { label: string; value: string };
export type CardItem = { title: string; description: string };
export type StepItem = { title: string; description: string };
export type FaqItem = { q: string; a: string };
export type TeamMember = { name: string; role: string; subtitle: string };

export type PublicPageViewModel = {
  type: PublicPageType;
  accentColor: string;
  accentSoft: string;
  accentLine: string;
  accentStrong: string;
  initials: string;
  heroImageUrl: string;
  logoImageUrl: string | null;
  portraitUrl: string;
  mapPreviewUrl: string;
  nav: NavItem[];
  services: CardItem[];
  benefitCards: CardItem[];
  careSteps: StepItem[];
  faq: FaqItem[];
  team: TeamMember[];
  hours: Array<{ label: string; value: string }>;
  insurance: string[];
  heroSignals: string[];
  aboutHighlights: string[];
  credentials: string[];
  contactLinks: LinkItem[];
  whatsappLink: string;
  displayPhone: string;
  locationLine: string;
  aboutSummary: string;
  aboutApproach: string;
  languages: string[];
  consultationModes: string[];
  audience: string[];
  siteName: string;
  pageTitle: string;
  pageDescription: string;
  eyebrow: string;
  heroTitle: string;
  heroSubtitle: string;
  heroDescription: string;
  trustLabel: string;
  specialtyLabel: string;
  identityCards: KeyValueItem[];
  trustNotice: string;
  entityName: string;
  mapsUrl: string | null;
  bookingUrl: string | null;
  locationAddress: string;
  locationSummary: string;
  email: string | null;
  structuredData: string;
  faviconUrl: string;
  socialImageUrl: string;
  canonicalUrl: string;
  pageUrl: string;
  host: string;
  footerYear: number;
};

type IdentityBlock = {
  entityName: string;
  brandName: string;
  eyebrow: string;
  heroTitle: string;
  heroSubtitle: string;
  heroDescription: string;
  trustLabel: string;
  specialtyLabel: string;
  identityCards: KeyValueItem[];
  trustNotice: string;
};

function compact<T>(items: Array<T | null | undefined | false>) {
  return items.filter(Boolean) as T[];
}

function getBaseUrl(pageUrl: string) {
  try {
    return new URL(pageUrl).origin;
  } catch {
    return pageUrl;
  }
}

function resolveUrl(value: string | null | undefined, baseUrl: string) {
  if (!value) return null;
  try {
    return new URL(value, baseUrl).toString();
  } catch {
    return value;
  }
}

function safeJsonLd(data: unknown) {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}

function svgToDataUri(svg: string) {
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

function parseHex(hex: string) {
  const clean = hex.replace('#', '');
  const normalized = clean.length === 3 ? clean.split('').map((char) => `${char}${char}`).join('') : clean;
  const int = Number.parseInt(normalized, 16);
  return {
    r: (int >> 16) & 255,
    g: (int >> 8) & 255,
    b: int & 255
  };
}

function alpha(hex: string, opacity: number) {
  const { r, g, b } = parseHex(hex);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}

function getInitials(value: string) {
  return value
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('') || 'CM';
}

function escapeXml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function buildPortraitPlaceholder(name: string, specialty: string, accentColor: string) {
  const initials = getInitials(name);
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 1200" role="img" aria-label="${escapeXml(name)}">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${escapeXml(alpha(accentColor, 0.22))}"/>
      <stop offset="100%" stop-color="#0f2237"/>
    </linearGradient>
    <linearGradient id="silhouette" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.9"/>
      <stop offset="100%" stop-color="#dce7ef" stop-opacity="0.28"/>
    </linearGradient>
  </defs>
  <rect width="960" height="1200" rx="64" fill="url(#bg)"/>
  <circle cx="740" cy="180" r="210" fill="${escapeXml(alpha(accentColor, 0.18))}"/>
  <circle cx="240" cy="1040" r="220" fill="${escapeXml(alpha(accentColor, 0.14))}"/>
  <path d="M478 270c117 0 212 95 212 212 0 77-41 145-103 182 117 42 201 154 201 285v83H172v-83c0-131 84-243 201-285-62-37-103-105-103-182 0-117 95-212 208-212z" fill="url(#silhouette)"/>
  <rect x="92" y="88" width="216" height="42" rx="21" fill="rgba(255,255,255,0.14)"/>
  <text x="120" y="116" font-family="Manrope, Arial, sans-serif" font-size="22" font-weight="700" fill="#f8fbfc">${escapeXml(specialty || 'Apresentação institucional')}</text>
  <text x="92" y="1120" font-family="Fraunces, Georgia, serif" font-size="180" font-weight="700" fill="rgba(255,255,255,0.12)">${escapeXml(initials)}</text>
</svg>`;
  return svgToDataUri(svg);
}

function buildHeroBackdropPlaceholder(name: string, accentColor: string, location: string) {
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 1080" role="img" aria-label="${escapeXml(name)}">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fbfdff"/>
      <stop offset="100%" stop-color="#eef4f7"/>
    </linearGradient>
    <linearGradient id="accent" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${escapeXml(accentColor)}"/>
      <stop offset="100%" stop-color="#102033"/>
    </linearGradient>
  </defs>
  <rect width="1600" height="1080" fill="url(#bg)"/>
  <circle cx="1320" cy="180" r="260" fill="${escapeXml(alpha(accentColor, 0.12))}"/>
  <circle cx="250" cy="880" r="260" fill="${escapeXml(alpha(accentColor, 0.08))}"/>
  <path d="M980 220c146 0 264 118 264 264s-118 264-264 264H620c-146 0-264-118-264-264s118-264 264-264h360z" fill="url(#accent)" opacity="0.12"/>
  <rect x="104" y="110" width="264" height="54" rx="27" fill="rgba(16,32,51,0.06)"/>
  <text x="140" y="146" font-family="Manrope, Arial, sans-serif" font-size="28" font-weight="700" fill="#102033">${escapeXml(location || 'Consulta particular')}</text>
  <text x="104" y="404" font-family="Fraunces, Georgia, serif" font-size="118" font-weight="700" fill="#102033">${escapeXml(name)}</text>
  <text x="104" y="486" font-family="Manrope, Arial, sans-serif" font-size="36" fill="#526476">Experiência institucional premium para atendimento médico particular.</text>
  <rect x="104" y="610" width="580" height="220" rx="36" fill="#ffffff" stroke="#dbe3ea"/>
  <rect x="140" y="650" width="168" height="18" rx="9" fill="${escapeXml(alpha(accentColor, 0.16))}"/>
  <rect x="140" y="708" width="480" height="16" rx="8" fill="#dfe7ee"/>
  <rect x="140" y="744" width="410" height="16" rx="8" fill="#e5edf3"/>
  <rect x="140" y="780" width="340" height="16" rx="8" fill="#edf3f7"/>
</svg>`;
  return svgToDataUri(svg);
}

function buildMapPreviewPlaceholder(address: string, accentColor: string) {
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 720" role="img" aria-label="Mapa ilustrativo">
  <rect width="1200" height="720" rx="36" fill="#eef4f7"/>
  <g stroke="#d7e0e8" stroke-width="20">
    <path d="M120 110H1080"/>
    <path d="M120 250H1080"/>
    <path d="M120 390H1080"/>
    <path d="M120 530H1080"/>
    <path d="M240 40V680"/>
    <path d="M520 40V680"/>
    <path d="M800 40V680"/>
    <path d="M1040 40V680"/>
  </g>
  <path d="M666 276c0 73-86 184-86 184s-86-111-86-184c0-48 38-86 86-86s86 38 86 86z" fill="${escapeXml(accentColor)}"/>
  <circle cx="580" cy="276" r="34" fill="#ffffff"/>
  <rect x="88" y="540" width="1024" height="116" rx="24" fill="#ffffff" stroke="#dbe3ea"/>
  <text x="132" y="596" font-family="Manrope, Arial, sans-serif" font-size="28" font-weight="700" fill="#102033">${escapeXml(address || 'Endereço sob confirmação no contato inicial')}</text>
  <text x="132" y="634" font-family="Manrope, Arial, sans-serif" font-size="22" fill="#526476">Localização ilustrativa para reforço visual do contato e da rota.</text>
</svg>`;
  return svgToDataUri(svg);
}

function getBenefitCards(type: PublicPageType, highlights: string[], approach: string) {
  const defaults = type === 'doctor'
    ? [
        { title: highlights[0] ?? 'Escuta clínica qualificada', description: 'Consulta construída para compreensão do contexto, orientação objetiva e definição de conduta com calma.' },
        { title: highlights[1] ?? 'Condução responsável do atendimento', description: 'Comunicação clara, explicação dos próximos passos e experiência de consultório mais previsível.' },
        { title: highlights[2] ?? 'Acompanhamento organizado', description: 'Jornada pensada para reduzir ruído operacional e facilitar retorno, contato e continuidade.' }
      ]
    : [
        { title: highlights[0] ?? 'Jornada assistencial coordenada', description: 'Estrutura institucional que reduz atrito entre primeiro contato, consulta e continuidade do cuidado.' },
        { title: highlights[1] ?? 'Equipe com leitura integrada', description: 'Fluxo pensado para dar mais clareza ao paciente e mais consistência à experiência clínica.' },
        { title: highlights[2] ?? 'Operação particular mais acolhedora', description: 'Organização, comunicação e presença de marca alinhadas a uma percepção premium de atendimento.' }
      ];

  return defaults.map((item, index) => ({
    title: item.title,
    description: index === 0 && approach ? approach : item.description
  }));
}

function formatDoctorRegistration(draft: any) {
  const crm = draft?.professional?.crmNumber;
  const uf = draft?.professional?.crmUF;
  const rqe = draft?.professional?.rqeNumber;
  if (!crm || !uf) return null;
  return rqe ? `CRM ${crm}/${uf} · RQE ${rqe}` : `CRM ${crm}/${uf}`;
}

function getDefaultServices(type: PublicPageType, draft: any): CardItem[] {
  if (type === 'doctor') {
    const specialty = draft?.professional?.specialty ?? 'Especialidade médica';
    return [
      { title: `Consulta em ${specialty}`, description: 'Atendimento clínico com escuta qualificada, avaliação cuidadosa e orientação clara.' },
      { title: 'Acompanhamento organizado', description: 'Retornos e próximos passos definidos com comunicação objetiva e previsibilidade.' },
      { title: 'Cuidado particular', description: 'Experiência pensada para acolhimento, privacidade e continuidade no acompanhamento.' }
    ];
  }

  return [
    { title: 'Especialidades integradas', description: 'Atendimento particular com agenda coordenada e fluidez entre equipes quando necessário.' },
    { title: 'Primeiro contato assistido', description: 'Triagem inicial para direcionar o paciente ao formato de atendimento mais adequado.' },
    { title: 'Continuidade do cuidado', description: 'Retornos e orientações organizados para manter clareza ao longo da jornada assistencial.' }
  ];
}

function getDefaultFaq(type: PublicPageType): FaqItem[] {
  if (type === 'doctor') {
    return [
      { q: 'Como funciona o agendamento?', a: 'O agendamento pode ser solicitado pelo WhatsApp. A equipe confirma disponibilidade e orienta os próximos passos.' },
      { q: 'Onde acontece o atendimento?', a: 'O atendimento ocorre em consultório, com localização e rota compartilhadas após a confirmação da agenda.' }
    ];
  }

  return [
    { q: 'Como entrar em contato com a clínica?', a: 'O contato inicial acontece pelo WhatsApp, com orientação rápida para agendamento e dúvidas operacionais.' },
    { q: 'A clínica atende mais de uma especialidade?', a: 'Quando aplicável, a clínica organiza o cuidado entre profissionais para dar mais clareza à jornada do paciente.' }
  ];
}

function getDefaultSteps(type: PublicPageType): StepItem[] {
  if (type === 'doctor') {
    return [
      { title: 'Contato inicial', description: 'Agendamento e alinhamento das orientações práticas antes da consulta.' },
      { title: 'Consulta em consultório', description: 'Avaliação clínica com explicação objetiva e definição de conduta.' },
      { title: 'Acompanhamento', description: 'Próximos passos e retornos organizados conforme a necessidade assistencial.' }
    ];
  }

  return [
    { title: 'Triagem de agenda', description: 'A equipe identifica a melhor forma de encaminhar o atendimento.' },
    { title: 'Atendimento presencial', description: 'A consulta acontece em ambiente organizado, com fluxo assistencial claro.' },
    { title: 'Continuidade', description: 'Novos retornos e orientações são coordenados para manter previsibilidade.' }
  ];
}

function buildOpeningHours(hours: Array<{ label: string; value: string }> | undefined) {
  if (!hours?.length) return undefined;
  return hours.map((item) => `${item.label}: ${item.value}`);
}

function buildPostalAddress(draft: any) {
  if (!draft?.location?.address) return undefined;
  return {
    '@type': 'PostalAddress',
    streetAddress: draft.location.address,
    addressLocality: draft.location.city,
    addressRegion: draft.location.state,
    postalCode: draft.location.postalCode,
    addressCountry: draft.location.country ?? 'BR'
  };
}

function getPageIdentity(type: PublicPageType, draft: any): IdentityBlock {
  if (type === 'doctor') {
    const name = draft?.professional?.name ?? 'Especialista';
    const specialty = draft?.professional?.specialty ?? 'Especialidade médica';
    const registration = formatDoctorRegistration(draft);
    return {
      entityName: name,
      brandName: draft?.branding?.logoText ?? name,
      eyebrow: draft?.branding?.eyebrow ?? specialty,
      heroTitle: name,
      heroSubtitle: draft?.branding?.tagline ?? draft?.professional?.headline ?? draft?.seo?.description ?? specialty,
      heroDescription: draft?.about?.summary ?? draft?.seo?.description ?? specialty,
      trustLabel: registration ?? specialty,
      specialtyLabel: specialty,
      identityCards: compact<KeyValueItem>([
        { label: 'Especialidade', value: specialty },
        registration ? { label: 'Registro profissional', value: registration } : null,
        draft?.location?.city ? { label: 'Cidade', value: `${draft.location.city}${draft.location.state ? `, ${draft.location.state}` : ''}` } : null
      ]),
      trustNotice: 'As informações desta página têm caráter institucional e não substituem avaliação médica individual.'
    };
  }

  const clinicName = draft?.clinic?.clinicName ?? 'Clínica médica';
  const director = draft?.clinic?.directorName;
  const directorCrm = draft?.clinic?.directorCrm;
  return {
    entityName: clinicName,
    brandName: draft?.branding?.logoText ?? clinicName,
    eyebrow: draft?.branding?.eyebrow ?? 'Clínica médica particular',
    heroTitle: clinicName,
    heroSubtitle: draft?.branding?.tagline ?? draft?.clinic?.summary ?? draft?.seo?.description ?? 'Atendimento particular',
    heroDescription: draft?.about?.summary ?? draft?.clinic?.summary ?? draft?.seo?.description ?? clinicName,
    trustLabel: draft?.clinic?.clinicCrmRegistration ?? 'Operação médica institucional',
    specialtyLabel: 'Equipe e linhas de cuidado',
    identityCards: compact<KeyValueItem>([
      draft?.clinic?.clinicCrmRegistration ? { label: 'Registro da clínica', value: draft.clinic.clinicCrmRegistration } : null,
      director ? { label: 'Diretor técnico', value: directorCrm ? `${director} · ${directorCrm}` : director } : null,
      draft?.location?.city ? { label: 'Cidade', value: `${draft.location.city}${draft.location.state ? `, ${draft.location.state}` : ''}` } : null
    ]),
    trustNotice: 'Conteúdo institucional destinado à apresentação da equipe e dos serviços da clínica, sem promessas de resultado.'
  };
}

export function buildPublicPageViewModel(type: PublicPageType, draft: any, options: PublicRenderOptions): PublicPageViewModel {
  const identity = getPageIdentity(type, draft);
  const baseUrl = getBaseUrl(options.pageUrl);
  const accentColor = draft?.branding?.accentColor ?? (type === 'doctor' ? '#0E6A6C' : '#2953A6');
  const whatsappLink = buildWhatsappLink(draft.whatsapp.phone, draft.whatsapp.message);
  const displayPhone = draft?.contact?.phoneDisplay ?? `+${draft.whatsapp.phone}`;
  const locationLine = compact([draft?.location?.city, draft?.location?.state]).join(', ');
  const aboutHighlights = draft?.about?.highlights?.length
    ? draft.about.highlights
    : compact([
        type === 'doctor' ? 'Atendimento particular com agenda organizada' : 'Atendimento particular com operação coordenada',
        draft?.care?.consultationModes?.[0],
        locationLine || draft?.location?.address
      ]);
  const credentials = [
    ...compact<string>(draft?.about?.credentials ?? []),
    ...identity.identityCards.map((item) => `${item.label}: ${item.value}`)
  ].filter((value, index, array) => array.indexOf(value) === index);
  const services = draft?.services?.length ? draft.services : getDefaultServices(type, draft);
  const faq = draft?.faq?.length ? draft.faq : getDefaultFaq(type);
  const careSteps = draft?.care?.steps?.length ? draft.care.steps : getDefaultSteps(type);
  const hours = draft?.hours?.length ? draft.hours : [{ label: 'Agenda', value: 'Horários confirmados no contato inicial' }];
  const team = type === 'clinic' && Array.isArray(draft?.team)
    ? draft.team.map((member: any) => ({
        name: member.name,
        role: member.role ?? member.specialty ?? 'Equipe clínica',
        subtitle: compact([member.specialty, member.crmNumber ? `CRM ${member.crmNumber}/${member.crmUF}` : null, member.rqeNumber ? `RQE ${member.rqeNumber}` : null]).join(' · ')
      }))
    : [];
  const insurance = Array.isArray(draft?.insurance) ? draft.insurance : [];
  const heroSignals = compact([identity.trustLabel, draft?.care?.consultationModes?.[0], locationLine || draft?.location?.address]);
  const contactLinks = compact<LinkItem>([
    { label: 'WhatsApp', value: displayPhone, href: whatsappLink },
    draft?.contact?.bookingUrl ? { label: 'Agendamento', value: 'Solicitar horário', href: draft.contact.bookingUrl } : null,
    draft?.location?.mapsUrl ? { label: 'Localização', value: draft.location.address, href: draft.location.mapsUrl } : null,
    draft?.contact?.email ? { label: 'E-mail', value: draft.contact.email, href: `mailto:${draft.contact.email}` } : null,
    draft?.contact?.instagramUrl ? { label: 'Instagram', value: '@cliniclink.demo', href: draft.contact.instagramUrl } : null
  ]);
  const nav = compact<NavItem>([
    { href: '#inicio', label: 'Início' },
    { href: '#sobre', label: 'Sobre' },
    services.length ? { href: '#especialidades', label: type === 'doctor' ? 'Atendimento' : 'Estrutura' } : null,
    aboutHighlights.length ? { href: '#diferenciais', label: 'Diferenciais' } : null,
    careSteps.length ? { href: '#jornada', label: 'Jornada' } : null,
    { href: '#contato', label: 'Contato' },
    faq.length ? { href: '#duvidas', label: 'Dúvidas' } : null
  ]);
  const heroImageUrl = resolveUrl(draft?.branding?.heroImageUrl ?? draft?.clinic?.heroImageUrl ?? null, baseUrl)
    ?? buildHeroBackdropPlaceholder(identity.entityName, accentColor, locationLine || draft?.location?.address || identity.eyebrow);
  const logoImageUrl = resolveUrl(draft?.clinic?.logoUrl ?? null, baseUrl);
  const portraitUrl = resolveUrl(
    draft?.branding?.portraitUrl ?? draft?.professional?.photoUrl ?? draft?.branding?.heroImageUrl ?? draft?.clinic?.heroImageUrl ?? null,
    baseUrl
  ) ?? buildPortraitPlaceholder(identity.entityName, identity.specialtyLabel, accentColor);
  const mapPreviewUrl = buildMapPreviewPlaceholder(draft?.location?.address ?? '', accentColor);
  const socialImageUrl = resolveUrl(draft?.branding?.socialImageUrl ?? options.socialImageUrl, baseUrl) ?? options.socialImageUrl;
  const faviconUrl = resolveUrl(options.faviconUrl, baseUrl) ?? options.faviconUrl;
  const socialLinks = draft?.contact?.sameAs?.length ? draft.contact.sameAs : compact([draft?.contact?.instagramUrl]);
  const benefitCards = getBenefitCards(type, aboutHighlights, draft?.about?.approach ?? '');
  const structuredData = compact<unknown>([
    {
      '@context': 'https://schema.org',
      '@type': type === 'doctor' ? 'Physician' : 'MedicalClinic',
      name: identity.entityName,
      description: draft?.seo?.description,
      url: options.canonicalUrl,
      image: socialImageUrl,
      logo: faviconUrl,
      telephone: displayPhone,
      medicalSpecialty: type === 'doctor' ? draft?.professional?.specialty : undefined,
      address: buildPostalAddress(draft),
      openingHours: buildOpeningHours(hours),
      availableLanguage: draft?.about?.languages,
      areaServed: locationLine || undefined,
      hasMap: draft?.location?.mapsUrl,
      sameAs: socialLinks
    },
    faq.length
      ? {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: faq.map((item: FaqItem) => ({
            '@type': 'Question',
            name: item.q,
            acceptedAnswer: { '@type': 'Answer', text: item.a }
          }))
        }
      : null,
    {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: draft?.seo?.title,
      description: draft?.seo?.description,
      url: options.canonicalUrl,
      inLanguage: 'pt-BR'
    }
  ]);

  return {
    type,
    accentColor,
     accentSoft: alpha(accentColor, 0.12),
     accentLine: alpha(accentColor, 0.18),
     accentStrong: alpha(accentColor, 0.22),
     initials: getInitials(identity.entityName),
     heroImageUrl,
     logoImageUrl,
     portraitUrl,
     mapPreviewUrl,
     nav,
     services,
     benefitCards,
     careSteps,
    faq,
    team,
    hours,
    insurance,
    heroSignals,
    aboutHighlights,
    credentials,
    contactLinks,
    whatsappLink,
    displayPhone,
    locationLine,
    aboutSummary: draft?.about?.summary ?? draft?.seo?.description ?? '',
    aboutApproach: draft?.about?.approach ?? 'A jornada foi desenhada para combinar acolhimento, clareza e uma experiência de contato fácil para o paciente.',
    languages: draft?.about?.languages ?? [],
    consultationModes: draft?.care?.consultationModes ?? [],
    audience: draft?.care?.audience ?? [],
    siteName: identity.brandName,
    pageTitle: draft?.seo?.title ?? identity.entityName,
    pageDescription: draft?.seo?.description ?? identity.heroSubtitle,
    eyebrow: identity.eyebrow,
    heroTitle: identity.heroTitle,
    heroSubtitle: identity.heroSubtitle,
    heroDescription: identity.heroDescription,
    trustLabel: identity.trustLabel,
    specialtyLabel: identity.specialtyLabel,
    identityCards: identity.identityCards,
    trustNotice: identity.trustNotice,
    entityName: identity.entityName,
    mapsUrl: draft?.location?.mapsUrl ?? null,
    bookingUrl: draft?.contact?.bookingUrl ?? null,
    locationAddress: draft?.location?.address ?? '',
    locationSummary: draft?.location?.summary ?? 'Localização compartilhada com facilidade de acesso e orientação por mapa.',
    email: draft?.contact?.email ?? null,
    structuredData: safeJsonLd(structuredData),
     faviconUrl,
     socialImageUrl,
    canonicalUrl: options.canonicalUrl,
    pageUrl: options.pageUrl,
    host: options.host,
    footerYear: new Date().getFullYear()
  };
}

export function renderPublicFaviconSvg(type: PublicPageType, draft: any) {
  const identity = getPageIdentity(type, draft);
  const accentColor = draft?.branding?.accentColor ?? (type === 'doctor' ? '#0E6A6C' : '#2953A6');
  const initials = getInitials(identity.brandName);

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" role="img" aria-label="${escapeXml(identity.brandName)}">
  <defs>
    <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${escapeXml(accentColor)}"/>
      <stop offset="100%" stop-color="#102033"/>
    </linearGradient>
  </defs>
  <rect width="64" height="64" rx="18" fill="url(#g)"/>
  <rect x="12" y="12" width="40" height="40" rx="14" fill="none" stroke="rgba(255,255,255,.34)"/>
  <text x="50%" y="54%" text-anchor="middle" dominant-baseline="middle" font-size="22" font-family="Manrope, Arial, sans-serif" font-weight="800" fill="#ffffff">${escapeXml(initials)}</text>
</svg>`;
}

export function renderPublicSocialCardSvg(type: PublicPageType, draft: any) {
  const identity = getPageIdentity(type, draft);
  const accentColor = draft?.branding?.accentColor ?? (type === 'doctor' ? '#0E6A6C' : '#2953A6');
  const subtitle = identity.heroSubtitle;
  const location = compact([draft?.location?.city, draft?.location?.state]).join(', ') || draft?.location?.address || '';
  const trust = identity.trustLabel;

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" role="img" aria-label="${escapeXml(identity.entityName)}">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#f8fbfc"/>
      <stop offset="100%" stop-color="#eef3f6"/>
    </linearGradient>
    <linearGradient id="accent" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${escapeXml(accentColor)}"/>
      <stop offset="100%" stop-color="#102033"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <circle cx="1030" cy="120" r="180" fill="${escapeXml(alpha(accentColor, 0.12))}"/>
  <circle cx="140" cy="540" r="180" fill="${escapeXml(alpha(accentColor, 0.08))}"/>
  <rect x="72" y="72" width="1056" height="486" rx="36" fill="#ffffff" stroke="#dbe3ea"/>
  <rect x="120" y="122" width="84" height="84" rx="24" fill="url(#accent)"/>
  <rect x="136" y="138" width="52" height="52" rx="18" fill="none" stroke="rgba(255,255,255,.34)"/>
  <text x="162" y="176" text-anchor="middle" font-size="28" font-family="Manrope, Arial, sans-serif" font-weight="800" fill="#ffffff">${escapeXml(getInitials(identity.entityName))}</text>
  <text x="240" y="160" font-size="26" font-family="Manrope, Arial, sans-serif" font-weight="700" fill="#2953A6">${escapeXml(identity.eyebrow)}</text>
  <text x="120" y="280" font-size="68" font-family="Fraunces, Georgia, serif" font-weight="700" fill="#102033">${escapeXml(identity.entityName)}</text>
  <text x="120" y="348" font-size="30" font-family="Manrope, Arial, sans-serif" font-weight="600" fill="#5d6b7d">${escapeXml(subtitle.slice(0, 96))}</text>
  <rect x="120" y="410" width="280" height="52" rx="20" fill="${escapeXml(alpha(accentColor, 0.1))}" stroke="${escapeXml(alpha(accentColor, 0.18))}"/>
  <text x="146" y="444" font-size="24" font-family="Manrope, Arial, sans-serif" font-weight="700" fill="#102033">${escapeXml(trust)}</text>
  <text x="120" y="518" font-size="24" font-family="Manrope, Arial, sans-serif" font-weight="600" fill="#5d6b7d">${escapeXml(location)}</text>
  <text x="120" y="560" font-size="20" font-family="Manrope, Arial, sans-serif" font-weight="600" fill="#8190a1">Página institucional com foco em confiança e contato direto.</text>
</svg>`;
}
