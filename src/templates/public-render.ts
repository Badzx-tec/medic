import ejs from 'ejs';
import type { PublicPageViewModel } from './public-data.js';

const template = `<!doctype html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <title><%= page.pageTitle %></title>
  <meta name="description" content="<%= page.pageDescription %>"/>
  <meta name="theme-color" content="<%= page.accentColor %>"/>
  <meta name="color-scheme" content="light"/>
  <meta name="robots" content="index,follow,max-image-preview:large"/>
  <link rel="canonical" href="<%= page.canonicalUrl %>"/>
  <link rel="icon" type="image/svg+xml" href="<%= page.faviconUrl %>"/>
  <link rel="preconnect" href="https://fonts.googleapis.com"/>
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
  <link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600;9..144,700&family=Manrope:wght@400;500;600;700;800&display=swap" rel="stylesheet"/>
  <meta property="og:type" content="website"/>
  <meta property="og:locale" content="pt_BR"/>
  <meta property="og:site_name" content="<%= page.siteName %>"/>
  <meta property="og:title" content="<%= page.pageTitle %>"/>
  <meta property="og:description" content="<%= page.pageDescription %>"/>
  <meta property="og:url" content="<%= page.canonicalUrl %>"/>
  <meta property="og:image" content="<%= page.socialImageUrl %>"/>
  <meta property="og:image:alt" content="<%= page.pageTitle %>"/>
  <meta name="twitter:card" content="summary_large_image"/>
  <meta name="twitter:title" content="<%= page.pageTitle %>"/>
  <meta name="twitter:description" content="<%= page.pageDescription %>"/>
  <meta name="twitter:image" content="<%= page.socialImageUrl %>"/>
  <style>
    :root{--bg:#f4f6f8;--bg-elevated:#fff;--surface:#fff;--surface-subtle:#f9fbfc;--text:#102033;--muted:#5d6b7d;--border:#dbe3ea;--accent:<%= page.accentColor %>;--accent-soft:<%= page.accentSoft %>;--accent-line:<%= page.accentLine %>;--accent-strong:<%= page.accentStrong %>;--shadow:0 24px 60px rgba(15,23,42,.08);--shadow-soft:0 10px 30px rgba(15,23,42,.05);--radius-xl:32px;--radius-lg:24px;--radius-md:18px;--container:1180px;--header-height:76px;--ease:cubic-bezier(.22,.61,.36,1);--duration:420ms}
    *{box-sizing:border-box}html{scroll-behavior:smooth}body{margin:0;background:radial-gradient(circle at top left,var(--accent-soft),transparent 32%),linear-gradient(180deg,#f9fbfc 0%,var(--bg) 100%);color:var(--text);font-family:"Manrope",system-ui,sans-serif;-webkit-font-smoothing:antialiased;text-rendering:optimizeLegibility}
    a{color:inherit}img{max-width:100%;display:block}.muted{color:var(--muted)}
    .skip-link{position:absolute;left:16px;top:-48px;background:var(--text);color:#fff;padding:10px 14px;border-radius:12px;z-index:120;text-decoration:none}.skip-link:focus{top:16px}
    .container{max-width:var(--container);margin:0 auto;padding:0 24px}
    .site-header{position:sticky;top:0;z-index:50;backdrop-filter:blur(14px);background:rgba(249,251,252,.84);border-bottom:1px solid rgba(219,227,234,.7);transition:box-shadow var(--duration) var(--ease),background var(--duration) var(--ease)}.site-header.is-scrolled{box-shadow:0 16px 30px rgba(15,23,42,.07);background:rgba(249,251,252,.94)}
    .header-inner{min-height:var(--header-height);display:flex;align-items:center;justify-content:space-between;gap:24px}
    .brand{display:inline-flex;align-items:center;gap:14px;text-decoration:none;min-width:0}.brand-copy{display:flex;flex-direction:column;min-width:0}.brand-copy strong{font-size:15px;line-height:1.1}.brand-copy span{font-size:12px;color:var(--muted)}
    .brand-mark{width:42px;height:42px;border-radius:14px;position:relative;overflow:hidden;background:linear-gradient(135deg,var(--accent),#102033 120%);box-shadow:inset 0 1px 0 rgba(255,255,255,.25),0 12px 30px rgba(16,32,51,.16);flex:0 0 auto}.brand-mark::before,.brand-mark::after{content:"";position:absolute;inset:9px;border-radius:12px;border:1px solid rgba(255,255,255,.36)}.brand-mark::after{inset:auto 12px 12px auto;width:12px;height:12px;background:rgba(255,255,255,.88);border:none;border-radius:999px;box-shadow:0 0 0 6px rgba(255,255,255,.14)}
    .main-nav{display:flex;align-items:center;gap:8px;flex-wrap:wrap}.main-nav a{text-decoration:none;color:var(--muted);font-size:14px;font-weight:600;padding:10px 12px;border-radius:999px;transition:background var(--duration) var(--ease),color var(--duration) var(--ease),transform var(--duration) var(--ease)}.main-nav a:hover,.main-nav a:focus-visible{background:rgba(255,255,255,.85);color:var(--text);outline:none}
    .header-actions,.hero-actions{display:flex;align-items:center;gap:12px;flex-wrap:wrap}
    .eyebrow,.highlights li,.signal-list li{display:inline-flex;align-items:center;gap:8px;border-radius:999px;font-size:13px;font-weight:700}
    .eyebrow{background:rgba(255,255,255,.78);border:1px solid var(--accent-line);color:var(--accent);padding:10px 14px;letter-spacing:.04em;text-transform:uppercase}.eyebrow::before{content:"";width:8px;height:8px;border-radius:999px;background:currentColor;box-shadow:0 0 0 6px rgba(14,106,108,.12)}
    .btn{border:none;text-decoration:none;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;gap:10px;padding:14px 18px;min-height:48px;border-radius:16px;font-weight:700;font-size:15px;transition:transform var(--duration) var(--ease),box-shadow var(--duration) var(--ease),background var(--duration) var(--ease),border-color var(--duration) var(--ease)}.btn:hover,.btn:focus-visible{transform:translateY(-1px);outline:none}.btn-primary{background:var(--accent);color:#fff;box-shadow:0 18px 35px rgba(16,32,51,.15)}.btn-secondary{background:rgba(255,255,255,.8);color:var(--text);border:1px solid var(--border)}.btn-ghost{color:var(--muted);background:transparent;border:1px solid transparent}
    .hero{padding:40px 0 24px}.hero-grid,.about-grid,.cta-card{display:grid;gap:28px}.hero-grid{grid-template-columns:minmax(0,1.1fr) minmax(320px,.9fr);align-items:stretch}
    .hero-panel,.surface-card{background:rgba(255,255,255,.86);border:1px solid rgba(219,227,234,.9);border-radius:var(--radius-xl);box-shadow:var(--shadow)}.hero-panel{padding:48px;position:relative;overflow:hidden;isolation:isolate}.hero-panel::before{content:"";position:absolute;inset:auto -40px -80px auto;width:220px;height:220px;border-radius:999px;background:var(--accent-soft);z-index:-1}
    .hero-title,.section-title,.trust-card h2,.contact-card h2,.about-card h2,.cta-card h2{margin:0;font-family:"Fraunces",Georgia,serif;line-height:1.08;letter-spacing:-.03em}.hero-title{margin:18px 0 16px;font-size:clamp(2.6rem,5vw,4.6rem);max-width:12ch}.section-title,.trust-card h2,.contact-card h2,.about-card h2,.cta-card h2{font-size:clamp(1.5rem,3vw,2.2rem)}
    .hero-subtitle,.section-description,.card-body p,.timeline-item p,.faq-answer,.footer-meta,.about-copy,.link-list a,.detail-list span,.identity-list span{line-height:1.8}.hero-subtitle{font-size:1.08rem;max-width:62ch;color:var(--muted);margin:0 0 28px}
    .signal-list,.highlights,.detail-list,.identity-list,.link-list,.faq-list,.timeline{display:grid;gap:12px;list-style:none;margin:0;padding:0}.signal-list{display:flex;flex-wrap:wrap;gap:10px}.signal-list li{background:var(--surface);border:1px solid var(--border);padding:10px 14px;color:var(--muted)}
    .hero-visual{padding:24px;background:radial-gradient(circle at top right,var(--accent-soft),transparent 36%),linear-gradient(180deg,rgba(255,255,255,.9),rgba(255,255,255,.98))}
    .portrait-shell{min-height:100%;display:flex;flex-direction:column;gap:18px;justify-content:space-between}.portrait{position:relative;min-height:360px;border-radius:28px;border:1px solid var(--accent-line);background:linear-gradient(180deg,rgba(255,255,255,.18),rgba(16,32,51,.08)),radial-gradient(circle at 18% 18%,rgba(255,255,255,.95),transparent 35%),linear-gradient(135deg,var(--accent),#102033 120%);overflow:hidden;box-shadow:var(--shadow-soft);display:grid;place-items:end start}.portrait img{width:100%;height:100%;object-fit:cover}.portrait-fallback{width:100%;min-height:360px;padding:28px;display:flex;align-items:flex-end;position:relative}.portrait-fallback::before{content:"";position:absolute;inset:16px;border-radius:22px;border:1px solid rgba(255,255,255,.22)}.portrait-fallback span{font-family:"Fraunces",Georgia,serif;font-size:clamp(4rem,10vw,7rem);color:#fff;line-height:1;letter-spacing:-.08em;text-shadow:0 20px 40px rgba(0,0,0,.18);position:relative;z-index:1}
    .surface-card,.trust-card,.contact-card,.about-card,.cta-card,.team-card,.info-card,.faq-item,.hour-item{box-shadow:var(--shadow-soft)}.trust-card,.contact-card,.about-card,.cta-card,.team-card,.info-card,.faq-item,.hour-item{background:var(--surface);border:1px solid var(--border);border-radius:24px}
    .trust-card,.identity-card,.contact-card,.cta-card,.about-card,.team-card,.info-card,.hour-item{padding:22px}.trust-grid,.identity-grid,.cards-grid,.contact-grid,.hours-grid,.team-grid{display:grid;gap:14px}.trust-grid,.identity-grid,.team-grid,.contact-grid,.hours-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.cards-grid{grid-template-columns:repeat(3,minmax(0,1fr))}
    .mini-card{background:var(--surface-subtle);border:1px solid var(--border);border-radius:18px;padding:16px}.mini-card .label{display:block;color:var(--muted);font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:.05em;margin-bottom:8px}.mini-card strong,.mini-card p,.mini-card span{margin:0;font-size:14px;line-height:1.6}
    .main-content{padding:16px 0 120px}.section{padding:18px 0}.section-shell{padding:34px}.section-heading{display:flex;justify-content:space-between;align-items:flex-end;gap:16px;margin-bottom:28px}.section-kicker{display:block;font-size:12px;text-transform:uppercase;letter-spacing:.08em;font-weight:800;color:var(--accent);margin-bottom:10px}
    .about-grid{grid-template-columns:minmax(0,1.2fr) minmax(260px,.8fr)}.about-copy p{margin:0 0 18px}.highlights{display:flex;flex-wrap:wrap;gap:10px;margin-top:24px}.highlights li{padding:10px 14px;background:var(--accent-soft);border:1px solid var(--accent-line);color:var(--text)}
    .card-body{display:grid;gap:12px;height:100%}.card-body h3,.timeline-item h3,.faq-item summary strong{margin:0;font-size:1rem;line-height:1.35}
    .timeline-item{display:grid;grid-template-columns:auto 1fr;gap:16px;align-items:start;padding:18px;border-radius:20px;border:1px solid var(--border);background:linear-gradient(180deg,#fff,var(--surface-subtle))}.timeline-step{width:34px;height:34px;display:grid;place-items:center;border-radius:999px;background:var(--accent);color:#fff;font-weight:800;font-size:14px;box-shadow:0 10px 22px rgba(16,32,51,.15)}
    .identity-list li,.detail-list li,.link-list li{padding:14px 16px;border-radius:16px;background:var(--surface-subtle);border:1px solid var(--border)}.identity-list strong,.detail-list strong,.link-list strong{display:block;font-size:12px;text-transform:uppercase;letter-spacing:.06em;color:var(--muted);margin-bottom:6px}.link-list a{text-decoration:none}.link-list a:hover,.link-list a:focus-visible{color:var(--accent);outline:none}
    .faq-item{padding:0;overflow:hidden;transition:transform var(--duration) var(--ease),box-shadow var(--duration) var(--ease)}.faq-item[open]{box-shadow:0 16px 32px rgba(15,23,42,.08)}.faq-item summary{cursor:pointer;list-style:none;display:flex;align-items:center;justify-content:space-between;gap:12px;padding:18px 20px}.faq-item summary::-webkit-details-marker{display:none}.faq-item summary::after{content:"+";font-size:20px;line-height:1;color:var(--accent);font-weight:700;transition:transform var(--duration) var(--ease)}.faq-item[open] summary::after{transform:rotate(45deg)}.faq-answer{padding:0 20px 20px;color:var(--muted)}
    .cta-card{grid-template-columns:minmax(0,1fr) auto;padding:28px;align-items:center;background:radial-gradient(circle at top right,var(--accent-soft),transparent 30%),linear-gradient(135deg,#fff,var(--surface-subtle))}.cta-card p{margin:12px 0 0;color:var(--muted);max-width:58ch}
    .footer{padding:0 0 120px}.footer-panel{padding:26px 28px;display:flex;align-items:flex-start;justify-content:space-between;gap:18px;flex-wrap:wrap}.footer-meta{max-width:62ch;font-size:14px}.footer-meta p{margin:0}.footer-links{display:flex;flex-wrap:wrap;gap:12px}.footer-links a{color:var(--muted);text-decoration:none;font-size:14px;font-weight:700}
    .sticky-cta{position:fixed;left:16px;right:16px;bottom:16px;z-index:40;display:flex;gap:12px;padding:12px;border-radius:20px;background:rgba(255,255,255,.94);border:1px solid rgba(219,227,234,.95);box-shadow:0 24px 50px rgba(15,23,42,.14);backdrop-filter:blur(16px)}.sticky-cta .btn{flex:1}
    .reveal{opacity:0;transform:translateY(18px);transition:opacity var(--duration) var(--ease),transform var(--duration) var(--ease)}.reveal.is-visible{opacity:1;transform:none}
    @media (max-width:1040px){.hero-grid,.about-grid,.cta-card{grid-template-columns:1fr}.cards-grid,.trust-grid,.identity-grid,.contact-grid,.hours-grid,.team-grid{grid-template-columns:1fr 1fr}.main-nav{display:none}.hero-panel{padding:34px}.section-shell{padding:26px}}
    @media (max-width:720px){.container{padding:0 18px}.header-actions .btn-ghost{display:none}.hero{padding-top:20px}.hero-panel{padding:26px}.hero-title{max-width:none}.cards-grid,.trust-grid,.identity-grid,.contact-grid,.hours-grid,.team-grid{grid-template-columns:1fr}.section-heading{align-items:flex-start;flex-direction:column}.sticky-cta{flex-direction:column}.portrait,.portrait-fallback{min-height:280px}}
    @media (prefers-reduced-motion:reduce){html{scroll-behavior:auto}*,*::before,*::after{animation:none !important;transition:none !important}.reveal{opacity:1;transform:none}}
  </style>
</head>
<body>
  <a href="#conteudo" class="skip-link">Ir para o conteúdo</a>
  <header class="site-header" data-site-header>
    <div class="container header-inner">
      <a class="brand" href="#inicio" aria-label="Voltar para o topo da página"><span class="brand-mark" aria-hidden="true"></span><span class="brand-copy"><strong><%= page.siteName %></strong><span><%= page.eyebrow %></span></span></a>
      <nav class="main-nav" aria-label="Navegação principal"><% page.nav.forEach(function(item){ %><a href="<%= item.href %>"><%= item.label %></a><% }) %></nav>
      <div class="header-actions"><% if (page.bookingUrl) { %><a class="btn btn-ghost" href="<%= page.bookingUrl %>">Agendamento</a><% } %><a class="btn btn-primary" href="<%= page.whatsappLink %>">Falar no WhatsApp</a></div>
    </div>
  </header>
  <main id="conteudo">
    <section class="hero" id="inicio">
      <div class="container hero-grid">
        <article class="hero-panel reveal">
          <span class="eyebrow"><%= page.eyebrow %></span>
          <h1 class="hero-title"><%= page.heroTitle %></h1>
          <p class="hero-subtitle"><%= page.heroSubtitle %></p>
          <div class="hero-actions">
            <a class="btn btn-primary" href="<%= page.whatsappLink %>">Solicitar atendimento</a>
            <% if (page.bookingUrl) { %><a class="btn btn-secondary" href="<%= page.bookingUrl %>">Ver agenda</a><% } %>
            <% if (page.mapsUrl) { %><a class="btn btn-secondary" href="<%= page.mapsUrl %>">Como chegar</a><% } %>
          </div>
          <ul class="signal-list" aria-label="Sinais de confiança"><% page.heroSignals.forEach(function(signal){ %><li><%= signal %></li><% }) %></ul>
        </article>
        <aside class="hero-visual hero-panel reveal">
          <div class="portrait-shell">
            <div class="portrait" aria-label="Apresentação visual do perfil"><% if (page.portraitUrl) { %><img src="<%= page.portraitUrl %>" alt="<%= page.entityName %>" loading="eager" decoding="async"/><% } else { %><div class="portrait-fallback" aria-hidden="true"><span><%= page.initials %></span></div><% } %></div>
            <div class="trust-card">
              <h2>Identificação profissional</h2>
              <div class="trust-grid"><% page.identityCards.forEach(function(item){ %><div class="mini-card"><span class="label"><%= item.label %></span><strong><%= item.value %></strong></div><% }) %></div>
              <p class="muted"><%= page.trustNotice %></p>
            </div>
          </div>
        </aside>
      </div>
    </section>
    <div class="main-content">
      <section class="section" id="sobre"><div class="container"><div class="surface-card section-shell reveal"><div class="section-heading"><div><span class="section-kicker">Apresentação</span><h2 class="section-title">Uma experiência médica mais clara, organizada e acolhedora.</h2><p class="section-description"><%= page.aboutSummary %></p></div></div><div class="about-grid"><div class="about-copy"><p><%= page.aboutApproach %></p><ul class="highlights"><% page.aboutHighlights.forEach(function(item){ %><li><%= item %></li><% }) %></ul></div><aside class="about-card"><h2>Credenciais e contexto</h2><ul class="detail-list"><% page.credentials.forEach(function(item){ %><li><span><%= item %></span></li><% }) %><% if (page.languages.length) { %><li><strong>Idiomas</strong><span><%= page.languages.join(' · ') %></span></li><% } %><% if (page.consultationModes.length) { %><li><strong>Formato de atendimento</strong><span><%= page.consultationModes.join(' · ') %></span></li><% } %></ul></aside></div></div></div></section>
      <section class="section" id="especialidades"><div class="container"><div class="surface-card section-shell reveal"><div class="section-heading"><div><span class="section-kicker"><%= page.type === 'doctor' ? 'Áreas de atendimento' : 'Estrutura assistencial' %></span><h2 class="section-title"><%= page.type === 'doctor' ? 'Atendimento com leitura clínica cuidadosa e comunicação objetiva.' : 'Linhas de cuidado pensadas para uma experiência institucional mais fluida.' %></h2></div></div><div class="cards-grid"><% page.services.forEach(function(service){ %><article class="info-card"><div class="card-body"><h3><%= service.name || service.title %></h3><p><%= service.description %></p></div></article><% }) %></div></div></div></section>
      <section class="section" id="jornada"><div class="container"><div class="surface-card section-shell reveal"><div class="section-heading"><div><span class="section-kicker">Jornada do paciente</span><h2 class="section-title"><%= page.type === 'doctor' ? 'Como funciona o atendimento' : 'Como a jornada é organizada' %></h2><% if (page.audience.length) { %><p class="section-description">Perfis atendidos: <%= page.audience.join(' · ') %>.</p><% } %></div></div><div class="timeline"><% page.careSteps.forEach(function(step, index){ %><article class="timeline-item"><div class="timeline-step"><%= index + 1 %></div><div><h3><%= step.title %></h3><p><%= step.description %></p></div></article><% }) %></div></div></div></section>
      <section class="section" id="contato"><div class="container"><div class="surface-card section-shell reveal"><div class="section-heading"><div><span class="section-kicker">Contato e localização</span><h2 class="section-title">Informações essenciais para o primeiro contato.</h2><p class="section-description"><%= page.locationSummary %></p></div></div><div class="contact-grid"><section class="contact-card"><h2>Como falar com a equipe</h2><ul class="link-list"><% page.contactLinks.forEach(function(link){ %><li><strong><%= link.label %></strong><a href="<%= link.href %>"><%= link.value %></a></li><% }) %></ul></section><section class="contact-card"><h2>Presença local</h2><ul class="detail-list"><li><strong>Endereço</strong><span><%= page.locationAddress %></span></li><% if (page.locationLine) { %><li><strong>Cidade</strong><span><%= page.locationLine %></span></li><% } %><% if (page.mapsUrl) { %><li><strong>Rota e mapa</strong><span><a href="<%= page.mapsUrl %>">Abrir no mapa</a></span></li><% } %></ul></section></div><div class="hours-grid" style="margin-top:18px"><section class="contact-card"><h2>Horários</h2><div class="hours-grid"><% page.hours.forEach(function(item){ %><div class="hour-item"><strong><%= item.label %></strong><p class="muted"><%= item.value %></p></div><% }) %></div></section><% if (page.team.length || page.insurance.length) { %><section class="contact-card"><h2><%= page.team.length ? 'Equipe em destaque' : 'Informações adicionais' %></h2><% if (page.team.length) { %><div class="team-grid"><% page.team.forEach(function(member){ %><article class="team-card"><strong><%= member.name %></strong><p><%= member.role %></p><span class="muted"><%= member.subtitle %></span></article><% }) %></div><% } else { %><ul class="detail-list"><% page.insurance.forEach(function(item){ %><li><span><%= item %></span></li><% }) %></ul><% } %></section><% } %></div><% if (page.insurance.length) { %><div style="margin-top:18px"><div class="contact-card"><h2>Atendimento e observações</h2><ul class="detail-list"><% page.insurance.forEach(function(item){ %><li><span><%= item %></span></li><% }) %></ul></div></div><% } %></div></div></section>
      <section class="section" id="duvidas"><div class="container"><div class="surface-card section-shell reveal"><div class="section-heading"><div><span class="section-kicker">Dúvidas frequentes</span><h2 class="section-title">Informações úteis para facilitar a decisão de contato.</h2></div></div><div class="faq-list"><% page.faq.forEach(function(item, index){ %><details class="faq-item" <% if (index === 0) { %>open<% } %>><summary><strong><%= item.q %></strong></summary><div class="faq-answer"><%= item.a %></div></details><% }) %></div></div></div></section>
      <section class="section"><div class="container"><div class="cta-card reveal"><div><span class="section-kicker">Contato direto</span><h2>Agende seu primeiro contato com uma experiência mais clara e profissional.</h2><p>O canal principal de atendimento está pronto para orientar disponibilidade, formato da consulta e informações de localização.</p></div><div class="hero-actions" style="margin:0"><a class="btn btn-primary" href="<%= page.whatsappLink %>">Chamar no WhatsApp</a><% if (page.mapsUrl) { %><a class="btn btn-secondary" href="<%= page.mapsUrl %>">Ver rota</a><% } %></div></div></div></section>
    </div>
  </main>
  <footer class="footer"><div class="container"><div class="surface-card footer-panel reveal"><div class="brand" style="align-items:flex-start"><span class="brand-mark" aria-hidden="true"></span><span class="brand-copy"><strong><%= page.siteName %></strong><span><%= page.trustLabel %></span></span></div><div class="footer-meta"><p><%= page.trustNotice %></p><p><%= page.locationAddress %></p></div><div class="footer-links"><a href="#inicio">Voltar ao topo</a><a href="<%= page.whatsappLink %>">WhatsApp</a><% if (page.mapsUrl) { %><a href="<%= page.mapsUrl %>">Mapa</a><% } %></div></div></div></footer>
  <div class="sticky-cta" aria-label="Ações rápidas"><a class="btn btn-primary" href="<%= page.whatsappLink %>">WhatsApp</a><% if (page.bookingUrl) { %><a class="btn btn-secondary" href="<%= page.bookingUrl %>">Agendar</a><% } else if (page.mapsUrl) { %><a class="btn btn-secondary" href="<%= page.mapsUrl %>">Como chegar</a><% } %></div>
  <script type="application/ld+json"><%- page.structuredData %></script>
  <script>(function(){const reduceMotion=window.matchMedia('(prefers-reduced-motion: reduce)').matches;const header=document.querySelector('[data-site-header]');const onScroll=()=>{if(!header)return;header.classList.toggle('is-scrolled',window.scrollY>12)};onScroll();window.addEventListener('scroll',onScroll,{passive:true});const revealElements=document.querySelectorAll('.reveal');if(reduceMotion||!('IntersectionObserver'in window)){revealElements.forEach((element)=>element.classList.add('is-visible'));return}const observer=new IntersectionObserver((entries)=>{entries.forEach((entry)=>{if(entry.isIntersecting){entry.target.classList.add('is-visible');observer.unobserve(entry.target)}})},{threshold:.15,rootMargin:'0px 0px -40px 0px'});revealElements.forEach((element)=>observer.observe(element))})();</script>
</body>
</html>`;

const notFoundTemplate = `<!doctype html>
<html lang="pt-BR"><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/><title>Perfil médico não encontrado</title><meta name="description" content="A página solicitada não está disponível para este domínio."/><style>:root{--bg:#f4f6f8;--text:#102033;--muted:#667587;--card:#fff;--accent:#0E6A6C}*{box-sizing:border-box}body{margin:0;background:linear-gradient(180deg,#f9fbfc,var(--bg));font-family:Manrope,system-ui,sans-serif;color:var(--text)}.wrap{min-height:100vh;display:grid;place-items:center;padding:24px}.card{max-width:680px;padding:40px;border-radius:28px;background:var(--card);border:1px solid #dbe3ea;box-shadow:0 24px 60px rgba(15,23,42,.08);text-align:center}.mark{width:56px;height:56px;margin:0 auto 18px;border-radius:18px;background:linear-gradient(135deg,var(--accent),#102033)}h1{margin:0 0 14px;font-family:Fraunces,Georgia,serif;font-size:clamp(2rem,5vw,3rem);letter-spacing:-.03em}p{margin:0;color:var(--muted);line-height:1.8}</style><link rel="preconnect" href="https://fonts.googleapis.com"/><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/><link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600&family=Manrope:wght@400;500;600;700&display=swap" rel="stylesheet"/></head><body><main class="wrap"><section class="card"><div class="mark" aria-hidden="true"></div><h1>Perfil não disponível</h1><p>A página solicitada não está publicada para este domínio. Se você esperava visualizar um perfil médico, confirme o endereço ou tente novamente em instantes.</p></section></main></body></html>`;

export function renderPublicHtml(page: PublicPageViewModel) {
  return ejs.render(template, { page });
}

export function renderPublicNotFoundHtml() {
  return ejs.render(notFoundTemplate, {});
}
