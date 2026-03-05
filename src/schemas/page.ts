import { z } from 'zod';

export const doctorSchema = z.object({
  professional: z.object({
    name: z.string().min(3),
    crmNumber: z.string().min(3),
    crmUF: z.string().length(2),
    specialty: z.string().min(2),
    rqeNumber: z.string().optional()
  })
});

export const clinicSchema = z.object({
  clinic: z.object({
    clinicName: z.string().min(2),
    clinicCrmRegistration: z.string().min(3),
    directorName: z.string().min(3),
    directorCrm: z.string().min(3)
  }),
  team: z.array(z.object({
    name: z.string().min(3),
    crmNumber: z.string().min(3),
    crmUF: z.string().length(2),
    rqeNumber: z.string().optional()
  })).optional()
});

export const pageDraftSchema = z.object({
  seo: z.object({ title: z.string().min(3), description: z.string().min(10) }),
  whatsapp: z.object({
    phone: z.string().regex(/^\d{12,14}$/),
    message: z.string().min(8)
  }),
  location: z.object({ address: z.string().min(4), mapsUrl: z.string().url() }),
  sections: z.array(z.string()).min(1),
  services: z.array(z.object({ name: z.string(), description: z.string() })).optional(),
  faq: z.array(z.object({ q: z.string(), a: z.string() })).optional(),
  testimonials: z.array(z.object({ author: z.string(), text: z.string() })).optional()
}).and(z.union([doctorSchema, clinicSchema]));

export function hasForbiddenClaims(input: unknown) {
  const str = JSON.stringify(input).toLowerCase();
  const banned = ['antes e depois', 'garantia de resultado', 'cura garantida', 'sensacional'];
  return banned.some((term) => str.includes(term));
}
