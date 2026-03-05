import ejs from 'ejs';
import { buildWhatsappLink } from '../services/whatsapp.js';

const template = `<!doctype html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <title><%= seo.title %></title>
  <meta name="description" content="<%= seo.description %>"/>
  <meta property="og:title" content="<%= seo.title %>"/>
  <meta property="og:description" content="<%= seo.description %>"/>
  <style>
    :root{--bg:#f7fbff;--text:#0f172a;--primary:#0b63ce} body{font-family:Inter,system-ui;margin:0;color:var(--text);background:var(--bg)}
    .wrap{max-width:1000px;margin:auto;padding:24px}.card{background:#fff;padding:20px;border-radius:16px;box-shadow:0 8px 24px #0001;margin-bottom:16px}
    .cta{display:inline-block;background:var(--primary);color:#fff;padding:12px 16px;border-radius:10px;text-decoration:none}
    .sticky{position:fixed;bottom:0;left:0;right:0;background:#fff;padding:10px;display:flex;gap:8px;justify-content:center;box-shadow:0 -4px 16px #0002}
  </style>
</head>
<body>
<div class="wrap">
  <section class="card"><h1><%= seo.title %></h1><p><%= seo.description %></p><a class="cta" href="<%= whatsappLink %>">Falar no WhatsApp</a></section>
  <section class="card" aria-label="Identificação Profissional">
    <% if (type === 'doctor') { %>
      <h2>Identificação Profissional</h2><p><strong><%= draft.professional.name %></strong> - MÉDICO</p>
      <p>CRM <%= draft.professional.crmNumber %>/<%= draft.professional.crmUF %> <% if (draft.professional.rqeNumber) { %>- RQE <%= draft.professional.rqeNumber %><% } %></p>
      <p>Especialidade: <%= draft.professional.specialty %></p>
    <% } else { %>
      <h2>Identificação Profissional</h2><p><strong><%= draft.clinic.clinicName %></strong> - Registro <%= draft.clinic.clinicCrmRegistration %></p>
      <h3>Diretor Técnico</h3><p><%= draft.clinic.directorName %> - <%= draft.clinic.directorCrm %></p>
    <% } %>
  </section>
  <section class="card"><h2>Localização</h2><p><%= draft.location.address %></p><a href="<%= draft.location.mapsUrl %>">Como chegar</a></section>
  <section class="card"><p>Este site não substitui consulta médica. Em urgência, procure pronto atendimento.</p></section>
</div>
<div class="sticky"><a class="cta" href="<%= whatsappLink %>">WhatsApp</a><a class="cta" href="<%= draft.location.mapsUrl %>">Rotas</a></div>
<script type="application/ld+json"><%- jsonLd %></script>
</body></html>`;

export function renderPublicPage(type: 'doctor' | 'clinic', draft: any) {
  const whatsappLink = buildWhatsappLink(draft.whatsapp.phone, draft.whatsapp.message);
  const jsonLd = JSON.stringify(type === 'doctor' ? {
    '@context': 'https://schema.org', '@type': 'Physician', name: draft.professional.name
  } : {
    '@context': 'https://schema.org', '@type': 'MedicalClinic', name: draft.clinic.clinicName
  });

  return ejs.render(template, { type, draft, seo: draft.seo, whatsappLink, jsonLd });
}
