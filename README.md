# CLINICLINK

Plataforma multi-tenant para agências criarem páginas premium para médicos e clínicas com foco em WhatsApp + conformidade CFM.

## Stack
- Node.js 20+, TypeScript, Fastify, Prisma/Postgres, Zod, JWT
- Admin: React + Vite + Tailwind + TanStack Query + RHF + Framer Motion
- Público: SSR em EJS com JSON-LD e CTA WhatsApp

## Rodando local
1. Copie `.env.example` para `.env`.
2. `npm install`
3. `npx prisma migrate dev --name init`
4. `npm run prisma:seed`
5. `npm run dev`

App: `http://localhost:3000`, admin em `/admin`.

## Regras CFM implementadas
- Bloco de Identificação Profissional obrigatório para doctor/clinic.
- Doctor exige nome + CRM + UF + especialidade registrada + RQE quando houver.
- Clinic exige nome do estabelecimento + registro CRM + diretor técnico + CRM.
- Publicação bloqueada se validação falhar.
- Checklist anti-sensacionalismo no editor/publish.

## Limitações MVP
- Sem storage externo: prioriza imagens por URL.
- Upload base64 não implementado neste MVP.
- Northflank free é recomendado para MVP/hobby, não produção definitiva.
