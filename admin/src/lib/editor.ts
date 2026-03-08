export type PageType = 'doctor' | 'clinic';

export type PageRecord = {
  id: string;
  accountId: string;
  slug: string;
  status: string;
  type: PageType;
  themePreset: string;
  customDomain?: string | null;
  draftJson: any;
  account?: { id: string; name: string; email: string } | null;
};

export type ChecklistItem = {
  label: string;
  done: boolean;
  hint: string;
};

function deepClone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

export function createEditableDraft(input: any, type: PageType) {
  const draft = deepClone(input ?? {});
  draft.seo ??= { title: '', description: '', canonicalPath: '' };
  draft.branding ??= { eyebrow: '', tagline: '', accentColor: type === 'doctor' ? '#0E6A6C' : '#2953A6', heroImageUrl: '', portraitUrl: '', socialImageUrl: '', logoText: '' };
  draft.whatsapp ??= { phone: '', message: '' };
  draft.contact ??= { phoneDisplay: '', email: '', bookingUrl: '', instagramUrl: '', sameAs: [] };
  draft.location ??= { address: '', mapsUrl: '', city: '', state: '', postalCode: '', country: 'BR', summary: '' };
  draft.about ??= { summary: '', approach: '', highlights: [], credentials: [], languages: [] };
  draft.care ??= { consultationModes: [], audience: [], steps: [] };
  draft.hours ??= [];
  draft.services ??= [];
  draft.faq ??= [];
  draft.insurance ??= [];
  draft.sections ??= ['hero', 'about', 'services', 'faq', 'cta-final'];
  draft.testimonials ??= [];

  if (type === 'doctor') {
    draft.professional ??= { name: '', crmNumber: '', crmUF: '', specialty: '', rqeNumber: '', headline: '', photoUrl: '' };
  } else {
    draft.clinic ??= { clinicName: '', clinicCrmRegistration: '', directorName: '', directorCrm: '', summary: '', logoUrl: '', heroImageUrl: '' };
    draft.team ??= [];
  }

  return draft;
}

export function setDraftValue<T>(draft: T, path: Array<string | number>, value: unknown): T {
  const clone: any = Array.isArray(draft) ? [...(draft as any[])] : { ...(draft as any) };
  let cursor: any = clone;

  for (let index = 0; index < path.length - 1; index += 1) {
    const key = path[index];
    const current = cursor[key];
    const next = Array.isArray(current) ? [...current] : { ...(current ?? {}) };
    cursor[key] = next;
    cursor = next;
  }

  cursor[path[path.length - 1]] = value;
  return clone;
}

export function updateArrayItem<T>(items: T[], index: number, value: T) {
  return items.map((item, current) => (current === index ? value : item));
}

export function removeArrayItem<T>(items: T[], index: number) {
  return items.filter((_, current) => current !== index);
}

export function buildChecklist(draft: any, type: PageType): ChecklistItem[] {
  const baseItems: ChecklistItem[] = [
    {
      label: 'SEO principal',
      done: Boolean(draft?.seo?.title && draft?.seo?.description),
      hint: 'Defina título e descrição institucional.'
    },
    {
      label: 'Contato',
      done: Boolean(draft?.whatsapp?.phone && draft?.location?.address),
      hint: 'WhatsApp e endereço precisam estar claros.'
    },
    {
      label: 'Sobre / abordagem',
      done: Boolean(draft?.about?.summary && draft?.about?.approach),
      hint: 'Explique atendimento e posicionamento clínico.'
    },
    {
      label: 'Serviços ou áreas',
      done: Array.isArray(draft?.services) && draft.services.length >= 2,
      hint: 'Inclua pelo menos duas frentes de atendimento.'
    },
    {
      label: 'Dúvidas frequentes',
      done: Array.isArray(draft?.faq) && draft.faq.length >= 2,
      hint: 'FAQ melhora conversão e SEO.'
    },
    {
      label: 'Branding e mídia',
      done: Boolean(draft?.branding?.logoText && (draft?.branding?.portraitUrl || draft?.professional?.photoUrl || draft?.clinic?.heroImageUrl)),
      hint: 'Adicione marca textual e imagem principal.'
    }
  ];

  if (type === 'doctor') {
    baseItems.unshift({
      label: 'Identificação médica',
      done: Boolean(draft?.professional?.name && draft?.professional?.crmNumber && draft?.professional?.crmUF && draft?.professional?.specialty),
      hint: 'Nome, CRM, UF e especialidade são obrigatórios.'
    });
  } else {
    baseItems.unshift({
      label: 'Identificação da clínica',
      done: Boolean(draft?.clinic?.clinicName && draft?.clinic?.clinicCrmRegistration && draft?.clinic?.directorName && draft?.clinic?.directorCrm),
      hint: 'Registro e direção técnica precisam estar completos.'
    });
  }

  return baseItems;
}

export function getStatusTone(status: string) {
  switch (status) {
    case 'published':
      return 'bg-emerald-500/15 text-emerald-200 ring-1 ring-emerald-500/30';
    case 'expired':
      return 'bg-amber-500/15 text-amber-100 ring-1 ring-amber-500/30';
    default:
      return 'bg-slate-700/60 text-slate-100 ring-1 ring-white/10';
  }
}

export function slugToLabel(slug: string) {
  return slug
    .split('-')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}
