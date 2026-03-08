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
    :root{--bg:#f3f6f8;--bg-soft:#f8fafb;--surface:#ffffff;--surface-2:#f7fafc;--surface-dark:#0f2237;--text:#102033;--muted:#5a6c7c;--line:#d9e3ea;--line-strong:#c8d5df;--accent:<%= page.accentColor %>;--accent-soft:<%= page.accentSoft %>;--accent-line:<%= page.accentLine %>;--accent-strong:<%= page.accentStrong %>;--shadow:0 24px 60px rgba(15,23,42,.08);--shadow-soft:0 14px 36px rgba(15,23,42,.06);--radius-2xl:34px;--radius-xl:28px;--radius-lg:22px;--radius-md:18px;--container:1220px;--ease:cubic-bezier(.22,.61,.36,1);--duration:440ms;--header-h:80px}
    *{box-sizing:border-box}html{scroll-behavior:smooth}body{margin:0;font-family:"Manrope",system-ui,sans-serif;color:var(--text);background:radial-gradient(circle at top left,var(--accent-soft),transparent 26%),linear-gradient(180deg,#f8fbfc 0%,var(--bg) 100%);-webkit-font-smoothing:antialiased;text-rendering:optimizeLegibility}
    a{color:inherit}img{display:block;max-width:100%}button,input,textarea,select{font:inherit}
    :focus-visible{outline:3px solid rgba(37,99,235,.18);outline-offset:3px;border-radius:14px}
    .skip-link{position:absolute;left:16px;top:-48px;z-index:120;background:#102033;color:#fff;padding:10px 14px;border-radius:14px;text-decoration:none}.skip-link:focus{top:16px}
    .container{max-width:var(--container);margin:0 auto;padding:0 24px}
    .site-header{position:sticky;top:0;z-index:70;background:rgba(248,251,252,.8);backdrop-filter:blur(18px);border-bottom:1px solid rgba(217,227,234,.7);transition:background var(--duration) var(--ease),box-shadow var(--duration) var(--ease),border-color var(--duration) var(--ease)}.site-header.is-scrolled{background:rgba(248,251,252,.92);box-shadow:0 16px 36px rgba(15,23,42,.06)}
    .header-inner{min-height:var(--header-h);display:flex;align-items:center;justify-content:space-between;gap:24px}
    .brand{display:inline-flex;align-items:center;gap:14px;text-decoration:none;min-width:0}.brand-mark,.brand-logo{width:46px;height:46px;border-radius:16px;flex:0 0 auto}.brand-mark{position:relative;overflow:hidden;background:linear-gradient(135deg,var(--accent),#102033 120%);box-shadow:inset 0 1px 0 rgba(255,255,255,.25),0 12px 30px rgba(16,32,51,.16)}.brand-mark::before,.brand-mark::after{content:"";position:absolute;inset:9px;border-radius:12px;border:1px solid rgba(255,255,255,.34)}.brand-mark::after{inset:auto 12px 12px auto;width:12px;height:12px;background:rgba(255,255,255,.88);border:none;border-radius:999px;box-shadow:0 0 0 6px rgba(255,255,255,.14)}.brand-logo{object-fit:cover;border:1px solid rgba(217,227,234,.9);box-shadow:var(--shadow-soft)}
    .brand-copy{display:flex;flex-direction:column;min-width:0}.brand-copy strong{font-size:15px;line-height:1.1}.brand-copy span{font-size:12px;color:var(--muted);white-space:nowrap;text-overflow:ellipsis;overflow:hidden}
    .main-nav{display:flex;align-items:center;gap:8px;flex-wrap:wrap}.main-nav a{text-decoration:none;padding:10px 12px;border-radius:999px;font-size:14px;font-weight:600;color:var(--muted);transition:background var(--duration) var(--ease),color var(--duration) var(--ease),transform var(--duration) var(--ease)}.main-nav a:hover,.main-nav a.is-active{background:rgba(255,255,255,.92);color:var(--text)}
    .header-actions,.hero-actions,.cta-actions{display:flex;align-items:center;gap:12px;flex-wrap:wrap}
    .btn{border:none;text-decoration:none;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;gap:10px;min-height:50px;padding:14px 20px;border-radius:17px;font-size:15px;font-weight:700;transition:transform var(--duration) var(--ease),box-shadow var(--duration) var(--ease),background var(--duration) var(--ease),border-color var(--duration) var(--ease)}.btn:hover,.btn:focus-visible{transform:translateY(-1px)}.btn-primary{background:var(--accent);color:#fff;box-shadow:0 18px 35px rgba(16,32,51,.16)}.btn-secondary{background:rgba(255,255,255,.82);color:var(--text);border:1px solid var(--line)}.btn-ghost{background:transparent;color:var(--muted);border:1px solid transparent}
    .eyebrow,.signal-chip,.stat-chip,.trust-pill{display:inline-flex;align-items:center;gap:9px;border-radius:999px;font-size:12px;font-weight:800;letter-spacing:.04em;text-transform:uppercase}.eyebrow{padding:11px 15px;background:rgba(255,255,255,.84);border:1px solid var(--accent-line);color:var(--accent)}.eyebrow::before,.signal-chip::before,.trust-pill::before{content:"";width:8px;height:8px;border-radius:999px;background:currentColor;box-shadow:0 0 0 6px rgba(14,106,108,.12)}
    .hero{padding:40px 0 26px}.hero-shell{display:grid;grid-template-columns:minmax(0,1.02fr) minmax(360px,.98fr);gap:26px;align-items:stretch}.hero-copy,.hero-stage,.surface-card,.metric-card,.benefit-card,.service-card,.trust-card,.detail-card,.faq-item,.cta-panel,.map-card{background:rgba(255,255,255,.88);border:1px solid rgba(217,227,234,.92);border-radius:var(--radius-2xl);box-shadow:var(--shadow)}
    .hero-copy{padding:52px;position:relative;overflow:hidden}.hero-copy::before{content:"";position:absolute;right:-44px;bottom:-110px;width:240px;height:240px;border-radius:999px;background:var(--accent-soft);filter:blur(4px)}.hero-title,.section-title,.panel-title,.cta-title{margin:0;font-family:"Fraunces",Georgia,serif;line-height:1.04;letter-spacing:-.035em;color:var(--surface-dark)}.hero-title{font-size:clamp(2.9rem,5vw,5.1rem);max-width:11ch;margin:18px 0 18px}.hero-subtitle{font-size:1.08rem;line-height:1.85;color:var(--muted);max-width:62ch;margin:0 0 28px}
    .hero-grid-meta{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px;margin-top:26px}.metric-card{padding:18px;background:linear-gradient(180deg,#ffffff,var(--surface-2))}.metric-card strong{display:block;font-size:12px;text-transform:uppercase;letter-spacing:.07em;color:var(--muted);margin-bottom:10px}.metric-card span{display:block;font-size:15px;font-weight:700;line-height:1.45}
    .hero-stage{padding:20px;display:grid;gap:16px;background:linear-gradient(180deg,rgba(255,255,255,.88),rgba(255,255,255,.94))}
    .hero-backdrop{position:relative;overflow:hidden;border-radius:28px;min-height:360px;background:#e9eff4;border:1px solid rgba(217,227,234,.92)}.hero-backdrop img{width:100%;height:100%;object-fit:cover;object-position:center}.hero-backdrop::after{content:"";position:absolute;inset:0;background:linear-gradient(180deg,rgba(255,255,255,.08),rgba(9,18,29,.18))}
    .stage-grid{display:grid;grid-template-columns:minmax(240px,.8fr) minmax(0,1fr);gap:16px}.portrait-card{position:relative;overflow:hidden;border-radius:26px;min-height:430px;background:linear-gradient(180deg,#eaf0f4,#dfe8ef);border:1px solid rgba(217,227,234,.92)}.portrait-card img{width:100%;height:100%;object-fit:cover;object-position:center top}
    .trust-card{padding:22px;background:linear-gradient(180deg,#fff,var(--surface-2))}.trust-card h2,.contact-panel h2,.authority-panel h2,.cta-title,.section-title{font-size:clamp(1.5rem,3vw,2.25rem)}.trust-grid,.detail-grid,.contact-grid,.service-grid,.benefit-grid,.info-grid,.hours-grid{display:grid;gap:14px}.trust-grid,.detail-grid,.info-grid,.hours-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.service-grid,.benefit-grid{grid-template-columns:repeat(3,minmax(0,1fr))}
    .mini-card{padding:16px 18px;border-radius:20px;background:var(--surface);border:1px solid var(--line)}.mini-card strong{display:block;font-size:12px;text-transform:uppercase;letter-spacing:.07em;color:var(--muted);margin-bottom:8px}.mini-card span,.mini-card p{display:block;font-size:14px;line-height:1.6;margin:0}
    .hero-ribbon{padding:8px 0 20px}.hero-ribbon-inner{display:flex;flex-wrap:wrap;gap:10px}.signal-chip,.trust-pill{padding:10px 14px;background:rgba(255,255,255,.86);border:1px solid rgba(217,227,234,.92);color:var(--accent)}.stat-chip{padding:10px 14px;background:var(--surface-dark);color:#f8fbfc;border:1px solid rgba(255,255,255,.08);text-transform:none;letter-spacing:0}
    .main-content{padding:10px 0 126px}.section{padding:18px 0}.section-shell{padding:34px}.surface-card{padding:0;overflow:hidden}.section-heading{display:flex;justify-content:space-between;align-items:flex-end;gap:18px;margin-bottom:28px}.section-kicker{display:block;font-size:12px;font-weight:800;text-transform:uppercase;letter-spacing:.08em;color:var(--accent);margin-bottom:10px}.section-title{font-size:clamp(1.8rem,3vw,2.45rem)}.section-description{margin:12px 0 0;color:var(--muted);line-height:1.85;max-width:64ch}
    .about-layout{display:grid;grid-template-columns:minmax(0,1.15fr) minmax(280px,.85fr);gap:22px}.about-panel,.authority-panel,.contact-panel,.faq-panel,.cta-panel{padding:28px}.lead{font-size:1.06rem;line-height:1.92;color:var(--muted);margin:0}.lead + .lead{margin-top:16px}.detail-list,.link-list,.hours-list,.faq-list,.timeline{list-style:none;margin:0;padding:0;display:grid;gap:14px}.detail-list li,.link-list li,.hours-list li{padding:16px 18px;border-radius:18px;background:var(--surface-2);border:1px solid var(--line)}.detail-list strong,.link-list strong,.hours-list strong{display:block;font-size:12px;text-transform:uppercase;letter-spacing:.07em;color:var(--muted);margin-bottom:8px}.link-list a{text-decoration:none;line-height:1.7}.link-list a:hover{color:var(--accent)}
    .benefit-card,.service-card{padding:22px;background:linear-gradient(180deg,#fff,var(--surface-2))}.benefit-card .index,.service-card .index{display:inline-flex;width:38px;height:38px;align-items:center;justify-content:center;border-radius:14px;background:var(--accent-soft);border:1px solid var(--accent-line);color:var(--accent);font-size:13px;font-weight:800;margin-bottom:16px}.benefit-card h3,.service-card h3,.timeline-item h3,.faq-item summary strong{margin:0 0 10px;font-size:1.02rem;line-height:1.35}.benefit-card p,.service-card p,.timeline-item p,.faq-answer{margin:0;color:var(--muted);line-height:1.8}
    .formats-row{display:flex;flex-wrap:wrap;gap:10px;margin-top:20px}.timeline{margin-top:26px}.timeline-item{display:grid;grid-template-columns:auto 1fr;gap:16px;padding:18px;border-radius:22px;border:1px solid var(--line);background:linear-gradient(180deg,#fff,var(--surface-2))}.timeline-step{width:36px;height:36px;display:grid;place-items:center;border-radius:999px;background:var(--accent);color:#fff;font-size:14px;font-weight:800;box-shadow:0 10px 24px rgba(16,32,51,.14)}
    .contact-layout{display:grid;grid-template-columns:minmax(0,1.05fr) minmax(280px,.95fr);gap:20px}.contact-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.map-card{padding:0;overflow:hidden}.map-card img{width:100%;height:100%;object-fit:cover;aspect-ratio:16/10}.map-card .map-copy{padding:22px}
    .faq-item{padding:0;overflow:hidden;background:linear-gradient(180deg,#fff,var(--surface-2));transition:box-shadow var(--duration) var(--ease),transform var(--duration) var(--ease)}.faq-item[open]{box-shadow:0 20px 40px rgba(15,23,42,.08)}.faq-item summary{cursor:pointer;list-style:none;display:flex;align-items:center;justify-content:space-between;gap:16px;padding:20px}.faq-item summary::-webkit-details-marker{display:none}.faq-item summary::after{content:"+";font-size:20px;font-weight:800;color:var(--accent);transition:transform var(--duration) var(--ease)}.faq-item[open] summary::after{transform:rotate(45deg)}.faq-answer{padding:0 20px 20px}
    .cta-panel{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:24px;align-items:center;background:radial-gradient(circle at top right,var(--accent-soft),transparent 28%),linear-gradient(135deg,#ffffff,var(--surface-2))}.cta-panel p{margin:14px 0 0;max-width:58ch;color:var(--muted);line-height:1.82}
    .footer{padding:0 0 120px}.footer-panel{display:flex;align-items:flex-start;justify-content:space-between;gap:18px;flex-wrap:wrap;padding:26px 28px}.footer-meta{max-width:64ch;font-size:14px;color:var(--muted);line-height:1.8}.footer-meta p{margin:0}.footer-links{display:flex;flex-wrap:wrap;gap:12px}.footer-links a{text-decoration:none;font-size:14px;font-weight:700;color:var(--muted)}
    .sticky-cta{position:fixed;left:16px;right:16px;bottom:16px;z-index:60;display:flex;gap:12px;padding:12px;border-radius:22px;background:rgba(255,255,255,.94);border:1px solid rgba(217,227,234,.96);box-shadow:0 24px 50px rgba(15,23,42,.14);backdrop-filter:blur(18px);opacity:0;transform:translateY(18px);pointer-events:none;transition:opacity var(--duration) var(--ease),transform var(--duration) var(--ease)}.sticky-cta.is-visible{opacity:1;transform:none;pointer-events:auto}.sticky-cta .btn{flex:1}
    .reveal{opacity:0;transform:translateY(20px);transition:opacity var(--duration) var(--ease),transform var(--duration) var(--ease)}.reveal.is-visible{opacity:1;transform:none}
    @media (max-width:1100px){.hero-shell,.about-layout,.contact-layout,.cta-panel{grid-template-columns:1fr}.service-grid,.benefit-grid{grid-template-columns:1fr 1fr}.hero-grid-meta,.trust-grid,.detail-grid,.contact-grid,.info-grid,.hours-grid{grid-template-columns:1fr 1fr}.main-nav{display:none}.hero-copy{padding:34px}.section-shell{padding:28px}.stage-grid{grid-template-columns:1fr}}
    @media (max-width:760px){.container{padding:0 18px}.hero{padding-top:22px}.hero-copy{padding:26px}.hero-title{max-width:none;font-size:clamp(2.4rem,11vw,3.6rem)}.service-grid,.benefit-grid,.hero-grid-meta,.trust-grid,.detail-grid,.contact-grid,.info-grid,.hours-grid{grid-template-columns:1fr}.section-heading{flex-direction:column;align-items:flex-start}.portrait-card{min-height:320px}.sticky-cta{flex-direction:column}.header-actions .btn-ghost{display:none}.cta-panel{padding:24px}}
    @media (prefers-reduced-motion:reduce){html{scroll-behavior:auto}*,*::before,*::after{animation:none !important;transition:none !important}.reveal{opacity:1;transform:none}.sticky-cta{opacity:1;transform:none;pointer-events:auto}}
  </style>
</head>
<body>
  <a href="#conteudo" class="skip-link">Ir para o conteúdo</a>
  <header class="site-header" data-site-header>
    <div class="container header-inner">
      <a class="brand" href="#inicio" aria-label="Voltar para o topo da página">
        <% if (page.logoImageUrl) { %>
          <img class="brand-logo" src="<%= page.logoImageUrl %>" alt="" loading="eager" decoding="async"/>
        <% } else { %>
          <span class="brand-mark" aria-hidden="true"></span>
        <% } %>
        <span class="brand-copy"><strong><%= page.siteName %></strong><span><%= page.eyebrow %></span></span>
      </a>
      <nav class="main-nav" aria-label="Navegação principal">
        <% page.nav.forEach(function(item){ %>
          <a href="<%= item.href %>"><%= item.label %></a>
        <% }) %>
      </nav>
      <div class="header-actions">
        <% if (page.bookingUrl) { %><a class="btn btn-ghost" href="<%= page.bookingUrl %>">Agendamento</a><% } %>
        <a class="btn btn-primary" href="<%= page.whatsappLink %>">Falar no WhatsApp</a>
      </div>
    </div>
  </header>

  <main id="conteudo">
    <section class="hero" id="inicio">
      <div class="container hero-shell">
        <article class="hero-copy reveal">
          <span class="eyebrow"><%= page.eyebrow %></span>
          <h1 class="hero-title"><%= page.heroTitle %></h1>
          <p class="hero-subtitle"><%= page.heroSubtitle %></p>
          <div class="hero-actions">
            <a class="btn btn-primary" href="<%= page.whatsappLink %>">Solicitar atendimento</a>
            <% if (page.bookingUrl) { %>
              <a class="btn btn-secondary" href="<%= page.bookingUrl %>">Ver agenda</a>
            <% } else if (page.mapsUrl) { %>
              <a class="btn btn-secondary" href="<%= page.mapsUrl %>">Como chegar</a>
            <% } %>
          </div>
          <div class="hero-grid-meta" aria-label="Sinais rápidos de confiança">
            <div class="metric-card"><strong>Especialidade</strong><span><%= page.specialtyLabel %></span></div>
            <div class="metric-card"><strong>Localização</strong><span><%= page.locationLine || page.locationAddress %></span></div>
            <div class="metric-card"><strong>Contato</strong><span><%= page.displayPhone %></span></div>
          </div>
        </article>

        <aside class="hero-stage reveal">
          <figure class="hero-backdrop">
            <img src="<%= page.heroImageUrl %>" alt="Ambiente de apresentação institucional" loading="eager" fetchpriority="high" decoding="async" sizes="(max-width: 1100px) 100vw, 42vw"/>
          </figure>
          <div class="stage-grid">
            <figure class="portrait-card">
              <img src="<%= page.portraitUrl %>" alt="<%= page.entityName %>" loading="eager" decoding="async" sizes="(max-width: 1100px) 100vw, 24vw"/>
            </figure>
            <section class="trust-card">
              <span class="trust-pill"><%= page.trustLabel %></span>
              <h2 class="panel-title" style="margin-top:14px">Identificação profissional e contexto institucional.</h2>
              <div class="trust-grid" style="margin-top:18px">
                <% page.identityCards.forEach(function(item){ %>
                  <div class="mini-card"><strong><%= item.label %></strong><span><%= item.value %></span></div>
                <% }) %>
              </div>
              <p class="section-description" style="margin-top:18px"><%= page.trustNotice %></p>
            </section>
          </div>
        </aside>
      </div>
    </section>

    <section class="hero-ribbon">
      <div class="container hero-ribbon-inner reveal">
        <% page.heroSignals.forEach(function(signal){ %><span class="signal-chip"><%= signal %></span><% }) %>
        <% if (page.consultationModes.length) { %><span class="stat-chip"><%= page.consultationModes.join(' · ') %></span><% } %>
      </div>
    </section>

    <div class="main-content">
      <section class="section" id="sobre">
        <div class="container">
          <div class="surface-card section-shell reveal">
            <div class="section-heading">
              <div>
                <span class="section-kicker">Apresentação</span>
                <h2 class="section-title">Uma experiência médica pensada para confiança, clareza e alto valor percebido.</h2>
                <p class="section-description"><%= page.aboutSummary %></p>
              </div>
            </div>
            <div class="about-layout">
              <section class="about-panel">
                <p class="lead"><%= page.aboutApproach %></p>
                <p class="lead">A página foi estruturada para comunicar presença clínica, organização e acolhimento sem excesso promocional, reforçando decisão de contato com mais segurança.</p>
              </section>
              <aside class="authority-panel">
                <h2 class="panel-title">Autoridade e credibilidade</h2>
                <ul class="detail-list" style="margin-top:18px">
                  <% page.credentials.forEach(function(item){ %><li><span><%= item %></span></li><% }) %>
                  <% if (page.languages.length) { %><li><strong>Idiomas</strong><span><%= page.languages.join(' · ') %></span></li><% } %>
                </ul>
              </aside>
            </div>
          </div>
        </div>
      </section>

      <section class="section" id="diferenciais">
        <div class="container">
          <div class="surface-card section-shell reveal">
            <div class="section-heading">
              <div>
                <span class="section-kicker">Diferenciais</span>
                <h2 class="section-title">Elementos que reforçam uma experiência premium de atendimento.</h2>
                <p class="section-description">Os melhores benchmarks convergem em poucos sinais muito claros: imagem forte, autoridade explícita, CTA direto e uma jornada fácil de entender.</p>
              </div>
            </div>
            <div class="benefit-grid">
              <% page.benefitCards.forEach(function(item, index){ %>
                <article class="benefit-card">
                  <span class="index">0<%= index + 1 %></span>
                  <h3><%= item.title %></h3>
                  <p><%= item.description %></p>
                </article>
              <% }) %>
            </div>
          </div>
        </div>
      </section>

      <section class="section" id="especialidades">
        <div class="container">
          <div class="surface-card section-shell reveal">
            <div class="section-heading">
              <div>
                <span class="section-kicker"><%= page.type === 'doctor' ? 'Áreas de atendimento' : 'Frentes assistenciais' %></span>
                <h2 class="section-title"><%= page.type === 'doctor' ? 'Atuação clínica com comunicação objetiva e composição visual mais editorial.' : 'Estrutura institucional que comunica organização e segurança com mais sofisticação.' %></h2>
              </div>
            </div>
            <div class="service-grid">
              <% page.services.forEach(function(service, index){ %>
                <article class="service-card">
                  <span class="index">0<%= index + 1 %></span>
                  <h3><%= service.name || service.title %></h3>
                  <p><%= service.description %></p>
                </article>
              <% }) %>
            </div>
          </div>
        </div>
      </section>

      <section class="section" id="jornada">
        <div class="container">
          <div class="surface-card section-shell reveal">
            <div class="section-heading">
              <div>
                <span class="section-kicker">Jornada do atendimento</span>
                <h2 class="section-title">Clareza sobre como funciona a consulta reduz atrito e melhora conversão.</h2>
                <p class="section-description">Esse é um padrão recorrente nos melhores sites institucionais: explicar pouco, mas explicar bem.</p>
              </div>
            </div>
            <% if (page.consultationModes.length || page.audience.length) { %>
              <div class="formats-row">
                <% page.consultationModes.forEach(function(item){ %><span class="signal-chip"><%= item %></span><% }) %>
                <% page.audience.forEach(function(item){ %><span class="stat-chip"><%= item %></span><% }) %>
              </div>
            <% } %>
            <div class="timeline">
              <% page.careSteps.forEach(function(step, index){ %>
                <article class="timeline-item">
                  <div class="timeline-step"><%= index + 1 %></div>
                  <div>
                    <h3><%= step.title %></h3>
                    <p><%= step.description %></p>
                  </div>
                </article>
              <% }) %>
            </div>
          </div>
        </div>
      </section>

      <section class="section" id="contato">
        <div class="container">
          <div class="surface-card section-shell reveal">
            <div class="section-heading">
              <div>
                <span class="section-kicker">Contato e agendamento</span>
                <h2 class="section-title">Canal direto, localização clara e experiência de contato mais resolvida.</h2>
                <p class="section-description"><%= page.locationSummary %></p>
              </div>
            </div>
            <div class="contact-layout">
              <div class="contact-panel">
                <div class="contact-grid">
                  <section>
                    <h2 class="panel-title">Canais principais</h2>
                    <ul class="link-list" style="margin-top:18px">
                      <% page.contactLinks.forEach(function(link){ %><li><strong><%= link.label %></strong><a href="<%= link.href %>"><%= link.value %></a></li><% }) %>
                    </ul>
                  </section>
                  <section>
                    <h2 class="panel-title">Horários e operação</h2>
                    <ul class="hours-list" style="margin-top:18px">
                      <% page.hours.forEach(function(item){ %><li><strong><%= item.label %></strong><span><%= item.value %></span></li><% }) %>
                    </ul>
                  </section>
                </div>
                <div class="detail-grid" style="margin-top:18px">
                  <div class="mini-card"><strong>Endereço</strong><span><%= page.locationAddress %></span></div>
                  <% if (page.locationLine) { %><div class="mini-card"><strong>Cidade</strong><span><%= page.locationLine %></span></div><% } %>
                  <% if (page.team.length) { %><div class="mini-card"><strong>Equipe em destaque</strong><span><%= page.team[0].name %> · <%= page.team[0].role %></span></div><% } %>
                  <% if (page.insurance.length) { %><div class="mini-card"><strong>Informações adicionais</strong><span><%= page.insurance[0] %></span></div><% } %>
                </div>
              </div>
              <aside class="map-card">
                <img src="<%= page.mapPreviewUrl %>" alt="Mapa ilustrativo da localização" loading="lazy" decoding="async"/>
                <div class="map-copy">
                  <h2 class="panel-title">Localização</h2>
                  <p class="section-description"><%= page.locationAddress %></p>
                  <% if (page.mapsUrl) { %><div class="hero-actions" style="margin-top:16px"><a class="btn btn-secondary" href="<%= page.mapsUrl %>">Abrir rota</a></div><% } %>
                </div>
              </aside>
            </div>
          </div>
        </div>
      </section>
      <% if (page.faq.length) { %>
      <section class="section" id="duvidas">
        <div class="container">
          <div class="surface-card section-shell reveal">
            <div class="section-heading">
              <div>
                <span class="section-kicker">Perguntas frequentes</span>
                <h2 class="section-title">Resposta clara, visual limpo e menos fricção antes do contato.</h2>
              </div>
            </div>
            <div class="faq-list">
              <% page.faq.forEach(function(item, index){ %>
                <details class="faq-item" <% if (index === 0) { %>open<% } %>>
                  <summary><strong><%= item.q %></strong></summary>
                  <div class="faq-answer"><%= item.a %></div>
                </details>
              <% }) %>
            </div>
          </div>
        </div>
      </section>
      <% } %>

      <section class="section">
        <div class="container">
          <div class="cta-panel reveal">
            <div>
              <span class="section-kicker">Próximo passo</span>
              <h2 class="cta-title">Agende um primeiro contato com uma presença institucional mais clara, premium e confiável.</h2>
              <p>Os benchmarks mais fortes convergem no mesmo ponto: uma página pública precisa comunicar autoridade sem excesso e levar o paciente a agir sem esforço. Esta experiência foi redesenhada exatamente para isso.</p>
            </div>
            <div class="cta-actions">
              <a class="btn btn-primary" href="<%= page.whatsappLink %>">Falar agora</a>
              <% if (page.bookingUrl) { %><a class="btn btn-secondary" href="<%= page.bookingUrl %>">Solicitar horário</a><% } %>
            </div>
          </div>
        </div>
      </section>
    </div>
  </main>

  <footer class="footer">
    <div class="container">
      <div class="surface-card footer-panel reveal">
        <div class="brand" style="align-items:flex-start">
          <% if (page.logoImageUrl) { %>
            <img class="brand-logo" src="<%= page.logoImageUrl %>" alt="" loading="lazy" decoding="async"/>
          <% } else { %>
            <span class="brand-mark" aria-hidden="true"></span>
          <% } %>
          <span class="brand-copy"><strong><%= page.siteName %></strong><span><%= page.trustLabel %></span></span>
        </div>
        <div class="footer-meta">
          <p><%= page.trustNotice %></p>
          <p><%= page.locationAddress %></p>
        </div>
        <div class="footer-links">
          <a href="#inicio">Voltar ao topo</a>
          <a href="<%= page.whatsappLink %>">WhatsApp</a>
          <% if (page.mapsUrl) { %><a href="<%= page.mapsUrl %>">Mapa</a><% } %>
        </div>
      </div>
    </div>
  </footer>

  <div class="sticky-cta" aria-label="Ações rápidas" data-sticky-cta>
    <a class="btn btn-primary" href="<%= page.whatsappLink %>">WhatsApp</a>
    <% if (page.bookingUrl) { %>
      <a class="btn btn-secondary" href="<%= page.bookingUrl %>">Agendar</a>
    <% } else if (page.mapsUrl) { %>
      <a class="btn btn-secondary" href="<%= page.mapsUrl %>">Como chegar</a>
    <% } %>
  </div>

  <script type="application/ld+json"><%- page.structuredData %></script>
  <script>(function(){const reduceMotion=window.matchMedia('(prefers-reduced-motion: reduce)').matches;const header=document.querySelector('[data-site-header]');const sticky=document.querySelector('[data-sticky-cta]');const sections=[...document.querySelectorAll('main section[id]')];const navLinks=[...document.querySelectorAll('.main-nav a')];const onScroll=()=>{if(header){header.classList.toggle('is-scrolled',window.scrollY>12)}if(sticky){sticky.classList.toggle('is-visible',window.scrollY>280)}};onScroll();window.addEventListener('scroll',onScroll,{passive:true});if(navLinks.length&&sections.length){const activate=(id)=>{navLinks.forEach((link)=>link.classList.toggle('is-active',link.getAttribute('href')==='#'+id))};const sectionObserver=new IntersectionObserver((entries)=>{entries.forEach((entry)=>{if(entry.isIntersecting){activate(entry.target.id)}})},{threshold:.55});sections.forEach((section)=>sectionObserver.observe(section))}const revealElements=document.querySelectorAll('.reveal');if(reduceMotion||!('IntersectionObserver'in window)){revealElements.forEach((element)=>element.classList.add('is-visible'));return}const revealObserver=new IntersectionObserver((entries)=>{entries.forEach((entry)=>{if(entry.isIntersecting){entry.target.classList.add('is-visible');revealObserver.unobserve(entry.target)}})},{threshold:.16,rootMargin:'0px 0px -40px 0px'});revealElements.forEach((element)=>revealObserver.observe(element))})();</script>
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
