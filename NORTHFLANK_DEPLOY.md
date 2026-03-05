# Deploy no Northflank (MVP)

> Plano free adequado para MVP/hobby, não produção definitiva.

## Arquitetura
- 1 Service (monólito: API + Admin + páginas públicas)
- 1 Addon Postgres
- 1 Job opcional nightly (`node dist/jobs/nightly.js`)

## Passos
1. Criar Addon Postgres e copiar `DATABASE_URL`.
2. Criar Service com Dockerfile deste repositório.
3. Variáveis: `PORT`, `DATABASE_URL`, `JWT_SECRET`, `SUPERADMIN_EMAIL`, `SUPERADMIN_PASSWORD`.
4. Expor porta `3000`.
5. Healthcheck: `GET /health`.
6. Comando de release/migrate: `npx prisma migrate deploy && npm run prisma:seed`.

## Domínio customizado
- Defina `customDomain` na página (único).
- No Northflank, associe o domínio no serviço.
- Configure DNS (CNAME/A conforme instrução do painel Northflank).
- TLS é automático quando domínio está verificado.
- Fallback permanente via `/p/{slug}`.

## Job nightly
- Criar Job agendado (diário) com comando:
  `node dist/jobs/nightly.js`
- Funções: expirar trials/assinaturas, limpar versões antigas (manter 10), logar relatório.
