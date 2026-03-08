import { z } from 'zod';

export const doctorSchema = z.object({
  professional: z.object({
    name: z.string().min(3),
    crmNumber: z.string().min(3),
    crmUF: z.string().length(2),
    specialty: z.string().min(2),
    rqeNumber: z.string().optional(),
    headline: z.string().min(6).max(140).optional(),
    photoUrl: z.string().url().optional()
  })
});

export const clinicSchema = z.object({
  clinic: z.object({
    clinicName: z.string().min(2),
    clinicCrmRegistration: z.string().min(3),
    directorName: z.string().min(3),
    directorCrm: z.string().min(3),
    summary: z.string().min(20).max(420).optional(),
    logoUrl: z.string().url().optional(),
    heroImageUrl: z.string().url().optional()
  }),
  team: z.array(z.object({
    name: z.string().min(3),
    crmNumber: z.string().min(3),
    crmUF: z.string().length(2),
    specialty: z.string().min(2).optional(),
    role: z.string().min(2).max(60).optional(),
    rqeNumber: z.string().optional()
  })).optional()
});

export const pageDraftSchema = z.object({
  seo: z.object({
    title: z.string().min(3),
    description: z.string().min(10),
    canonicalPath: z.string().min(1).optional()
  }),
  branding: z.object({
    eyebrow: z.string().min(3).max(60).optional(),
    tagline: z.string().min(6).max(140).optional(),
    accentColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
    heroImageUrl: z.string().url().optional(),
    portraitUrl: z.string().url().optional(),
    socialImageUrl: z.string().url().optional(),
    logoText: z.string().min(2).max(40).optional()
  }).optional(),
  whatsapp: z.object({
    phone: z.string().regex(/^\d{12,14}$/),
    message: z.string().min(8)
  }),
  contact: z.object({
    phoneDisplay: z.string().min(8).max(24).optional(),
    email: z.string().email().optional(),
    bookingUrl: z.string().url().optional(),
    instagramUrl: z.string().url().optional(),
    sameAs: z.array(z.string().url()).max(6).optional()
  }).optional(),
  location: z.object({
    address: z.string().min(4),
    mapsUrl: z.string().url(),
    city: z.string().min(2).max(80).optional(),
    state: z.string().min(2).max(40).optional(),
    postalCode: z.string().min(4).max(16).optional(),
    country: z.string().min(2).max(40).optional(),
    summary: z.string().min(6).max(140).optional()
  }),
  about: z.object({
    summary: z.string().min(20).max(900).optional(),
    approach: z.string().min(20).max(480).optional(),
    highlights: z.array(z.string().min(2).max(72)).max(6).optional(),
    credentials: z.array(z.string().min(2).max(120)).max(6).optional(),
    languages: z.array(z.string().min(2).max(40)).max(6).optional()
  }).optional(),
  care: z.object({
    consultationModes: z.array(z.string().min(2).max(40)).max(6).optional(),
    audience: z.array(z.string().min(2).max(60)).max(6).optional(),
    steps: z.array(z.object({
      title: z.string().min(2).max(60),
      description: z.string().min(8).max(220)
    })).max(5).optional()
  }).optional(),
  hours: z.array(z.object({
    label: z.string().min(2).max(40),
    value: z.string().min(2).max(80)
  })).max(8).optional(),
  sections: z.array(z.string()).min(1),
  services: z.array(z.object({ name: z.string(), description: z.string() })).optional(),
  faq: z.array(z.object({ q: z.string(), a: z.string() })).optional(),
  insurance: z.array(z.string().min(2).max(60)).max(10).optional(),
  testimonials: z.array(z.object({ author: z.string(), text: z.string() })).optional()
}).and(z.union([doctorSchema, clinicSchema]));

export function hasForbiddenClaims(input: unknown) {
  const str = JSON.stringify(input).toLowerCase();
  const banned = ['antes e depois', 'garantia de resultado', 'cura garantida', 'sensacional'];
  return banned.some((term) => str.includes(term));
}
