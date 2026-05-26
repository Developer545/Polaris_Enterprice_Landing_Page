/* ============================================================
   POLARIS — Main App: Nav, Hero, Marquee, Bento, Modules,
   Pricing, Quotes, Contact, CTA, Footer
   ============================================================ */
import React from 'react';
import { IndustriesToggle, FeatureTabs, DTECalculator, ModuleBuilder, PACKS } from './Interactive.jsx';

// ── Download Button — versión Cloud (Electron online) ─────
function DownloadButton({ className = "btn btn-ink", label = "Descargar para Windows" }) {
  const FALLBACK = "https://github.com/Developer545/polaris-releases/releases/latest";
  const [url, setUrl] = React.useState(FALLBACK);
  const [version, setVersion] = React.useState(null);
  React.useEffect(() => {
    fetch("https://api.github.com/repos/Developer545/polaris-releases/releases/latest")
      .then(r => r.json())
      .then(data => {
        // Asset online: cualquier .exe que NO tenga "local" en el nombre
        const exe = data.assets?.find(a => a.name.endsWith(".exe") && !a.name.toLowerCase().includes("local"));
        if (exe) { setUrl(exe.browser_download_url); }
        if (data.tag_name) { setVersion(data.tag_name); }
      })
      .catch(() => {});
  }, []);
  return (
    <a href={url} className={className} download rel="noopener">
      {label} {version && <span style={{ fontSize: '0.78em', opacity: 0.65 }}>({version})</span>} <span className="arrow">↓</span>
    </a>
  );
}

// ── Download Button — versión Local (PostgreSQL local) ────
function LocalDownloadButton({ className = "btn btn-ink", label = "Descargar Polaris Local" }) {
  const FALLBACK = "https://github.com/Developer545/polaris-releases/releases/latest";
  const [url, setUrl] = React.useState(FALLBACK);
  const [version, setVersion] = React.useState(null);
  const [size, setSize] = React.useState(null);
  React.useEffect(() => {
    fetch("https://api.github.com/repos/Developer545/polaris-releases/releases/latest")
      .then(r => r.json())
      .then(data => {
        // Asset local: .exe que contenga "local" en el nombre (Polaris Local-x.x.x-win-x64.exe)
        const exe = data.assets?.find(a =>
          a.name.endsWith(".exe") && a.name.toLowerCase().includes("local")
        );
        if (exe) {
          setUrl(exe.browser_download_url);
          setSize(Math.round(exe.size / 1024 / 1024) + ' MB');
        }
        if (data.tag_name) { setVersion(data.tag_name); }
      })
      .catch(() => {});
  }, []);
  return (
    <a href={url} className={className} download rel="noopener">
      {label}
      {version && <span style={{ fontSize: '0.78em', opacity: 0.65 }}> ({version})</span>}
      {size && <span style={{ fontSize: '0.75em', opacity: 0.55 }}> · {size}</span>}
      {' '}<span className="arrow">↓</span>
    </a>
  );
}

// ── Star icon (Polaris logo) ───────────────────────────────
function PolarisMark({ size = 22 }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" aria-hidden>
      <path d="M12 1.5 L13.4 9.3 L19.8 5.1 L15.6 11.5 L23.4 12.9 L15.6 14.3 L19.8 20.7 L13.4 16.5 L12 24.3 L10.6 16.5 L4.2 20.7 L8.4 14.3 L0.6 12.9 L8.4 11.5 L4.2 5.1 L10.6 9.3 Z" />
    </svg>
  );
}

// ── Nav ────────────────────────────────────────────────────
function Nav() {
  const [scrolled, setScrolled] = React.useState(false);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  React.useEffect(() => {
    if (!mobileOpen) return;
    const handler = (e) => { if (!e.target.closest('.nav')) setMobileOpen(false); };
    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, [mobileOpen]);
  const links = [['#producto','Producto'],['#industrias','Industrias'],['#dte','DTE'],['#precios','Precios'],['#descargar','Descargar'],['#contacto','Contacto']];
  return (
    <nav className={'nav' + (scrolled ? ' scrolled' : '')}>
      <div className="nav-inner">
        <a href="#" className="nav-brand">
          <span className="star" style={{ color: 'var(--accent)' }}><PolarisMark size={22} /></span>
          <span>Polaris<span className="it"> Enterprise</span></span>
        </a>
        <div className="nav-links">
          {links.map(([href, label]) => <a key={href} href={href}>{label}</a>)}
        </div>
        <div className="nav-cta-group">
          <a className="nav-login" href="https://polaris-web-sooty.vercel.app" target="_blank" rel="noopener">Iniciar sesión</a>
          <a className="btn btn-ink" href="#descargar">Descargar <span className="arrow">→</span></a>
          <button
            className={'nav-hamburger' + (mobileOpen ? ' open' : '')}
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Menú"
            aria-expanded={mobileOpen}
          >
            <span /><span /><span />
          </button>
        </div>
      </div>
      <div className={'nav-mobile-menu' + (mobileOpen ? ' open' : '')}>
        {links.map(([href, label]) => (
          <a key={href} href={href} onClick={() => setMobileOpen(false)}>{label}</a>
        ))}
        <div className="nav-mobile-ctas">
          <a className="btn btn-ghost" href="https://polaris-web-sooty.vercel.app" target="_blank" rel="noopener" onClick={() => setMobileOpen(false)}>Iniciar sesión</a>
          <a className="btn btn-ink" href="#descargar" onClick={() => setMobileOpen(false)}>Descargar <span className="arrow">↓</span></a>
        </div>
      </div>
    </nav>
  );
}

// ── Hero ───────────────────────────────────────────────────
function Hero() {
  const [tick, setTick] = React.useState(0);
  React.useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 2800);
    return () => clearInterval(id);
  }, []);

  const baseHeights = [42, 64, 50, 88, 70, 95, 75];
  const heights = baseHeights.map((h, i) => Math.min(100, Math.max(20, h + ((tick + i) % 5 - 2) * 6)));

  const tickets = [
    { id: 'DTE-01-00234', total: '$245.30', glyph: '✓' },
    { id: 'DTE-03-00089', total: '$1,820.00', glyph: '✓' },
    { id: 'DTE-01-00235', total: '$98.75', glyph: '✓' },
  ];

  return (
    <header className="hero">
      <div className="container">
        <div className="hero-grid">
          <div>
            <div className="hero-meta">
              <span className="pill"><span className="pulse"></span>Validado Hacienda · 2024</span>
              <span className="meta-line"></span>
              <span className="kicker">SV · POS + DTE</span>
            </div>

            <h1 className="display">
              <span className="line">Tu negocio,</span>
              <span className="line"><em>con norte.</em></span>
            </h1>

            <div className="hero-sub-wrap">
              <span className="bracket">¶</span>
              <p className="hero-sub">
                El punto de venta y facturación electrónica que las empresas salvadoreñas
                <em className="italic-serif" style={{ color: 'var(--ink)' }}> sí entienden.</em> Desde la
                tiendita de la esquina hasta cadenas con varias sucursales — mismo software, configuración
                a la medida.
              </p>
            </div>

            <div className="hero-cta">
              <DownloadButton />
              <a className="btn btn-ghost" href="https://polaris-web-sooty.vercel.app" target="_blank" rel="noopener">Abrir versión web <span className="arrow">→</span></a>
            </div>

            <div className="hero-trust-row">
              <span className="trust-item">Sin tarjeta de crédito</span>
              <span className="trust-item">Instalación 2 min</span>
              <span className="trust-item">Funciona offline</span>
              <span className="trust-item">Soporte en SV</span>
            </div>

            <div className="scroll-indicator">
              <span>scroll</span>
              <div className="scroll-indicator-line"></div>
            </div>
          </div>

          <div style={{ position: 'relative' }}>
            <div className="mockup-frame float">
              <div className="mockup-chrome">
                <div className="dots"><span></span><span></span><span></span></div>
                <div className="url">app.polarisenterprise.com/panel</div>
              </div>
              <div className="mockup-body">
                <div className="mk-rail">
                  <div className="mk-rail-logo"><PolarisMark size={16} /></div>
                  <div className="mk-rail-item active" title="Panel">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><rect x="3" y="3" width="7" height="9"/><rect x="14" y="3" width="7" height="5"/><rect x="14" y="12" width="7" height="9"/><rect x="3" y="16" width="7" height="5"/></svg>
                  </div>
                  <div className="mk-rail-item" title="POS">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.7 13.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H6"/></svg>
                  </div>
                  <div className="mk-rail-item" title="DTE">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M4 2v20l3-2 3 2 3-2 3 2 3-2 1 2V2l-1 2-3-2-3 2-3-2-3 2-3-2z"/><line x1="9" y1="9" x2="15" y2="9"/><line x1="9" y1="13" x2="15" y2="13"/></svg>
                  </div>
                  <div className="mk-rail-item" title="Inventario">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/></svg>
                  </div>
                  <div className="mk-rail-item" title="Equipo">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                  </div>
                </div>
                <div className="mk-canvas">
                  <div className="mk-canvas-top">
                    <div className="mk-pagename">
                      <span className="crumb">Panel</span>
                      <span className="crumb-sep">/</span>
                      <span>Hoy</span>
                    </div>
                    <div className="mk-actions">
                      <span className="mk-act">Filtrar</span>
                      <span className="mk-act primary">+ Nueva venta</span>
                    </div>
                  </div>
                  <div className="mk-kpis">
                    <div className="mk-kpi">
                      <div className="mk-kpi-label">Ventas hoy</div>
                      <div className="mk-kpi-val">$2,840</div>
                      <div className="mk-kpi-delta">↑ 12%</div>
                    </div>
                    <div className="mk-kpi">
                      <div className="mk-kpi-label">DTE emitidos</div>
                      <div className="mk-kpi-val">34</div>
                      <div className="mk-kpi-delta">↑ 8%</div>
                    </div>
                    <div className="mk-kpi">
                      <div className="mk-kpi-label">Ticket promedio</div>
                      <div className="mk-kpi-val">$83.50</div>
                      <div className="mk-kpi-delta" style={{ color: 'var(--ink-3)' }}>= 0%</div>
                    </div>
                    <div className="mk-kpi">
                      <div className="mk-kpi-label">Por cobrar</div>
                      <div className="mk-kpi-val">$1,240</div>
                      <div className="mk-kpi-delta" style={{ color: 'var(--accent-2)' }}>↓ 4%</div>
                    </div>
                  </div>
                  <div className="mk-chart-card">
                    <div className="mk-chart-head">
                      <span className="mk-chart-title">Ventas por hora</span>
                      <span className="mk-chart-range">07:00 — 19:00</span>
                    </div>
                    <div className="mk-chart">
                      {heights.map((h, i) => (
                        <div key={i} className={'mk-bar' + (h > 80 ? ' warm' : i % 2 ? ' hi' : '')} style={{ height: `${h}%` }} />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mockup-tickets">
              {tickets.slice(0, 1 + (tick % 3)).map((t, i) => (
                <div className="ticket" key={tick + '-' + i} style={{ animationDelay: `${i * .15}s` }}>
                  <div className="tk-icon">✓</div>
                  <div className="tk-body">
                    <div className="tk-id">{t.id}</div>
                    <div className="tk-total">{t.total}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

// ── Marquee ────────────────────────────────────────────────
function Marquee({ speed = 32 }) {
  const items = [
    'Ministerio de Hacienda',
    'Normativa DTE 2024',
    'Firma digital',
    'Windows 10 / 11',
    'Impresoras ESC/POS',
    'Lectores USB HID',
    'Multi-sucursal',
    'Funciona offline',
    'Soporte en español',
    'Hosted in El Salvador',
  ];
  const doubled = [...items, ...items];
  return (
    <div className="marquee-wrap">
      <div className="marquee" style={{ animationDuration: `${speed}s` }}>
        {doubled.map((t, i) => (
          <span className="marquee-item" key={i}>
            <span className="glyph">✦</span>
            <span>{t}</span>
          </span>
        ))}
      </div>
    </div>
  );
}

// ── CountUp ────────────────────────────────────────────────
function CountUp({ to, decimals = 0, run }) {
  const [val, setVal] = React.useState(0);
  React.useEffect(() => {
    if (!run) return;
    const duration = 1600, frames = 60;
    const stepV = to / frames;
    let cur = 0;
    const id = setInterval(() => {
      cur = Math.min(cur + stepV, to);
      setVal(cur);
      if (cur >= to) clearInterval(id);
    }, duration / frames);
    return () => clearInterval(id);
  }, [run, to]);
  if (decimals > 0) return <>{val.toFixed(decimals)}</>;
  return <>{Math.round(val).toLocaleString('es-SV')}</>;
}

// ── Stats ──────────────────────────────────────────────────
function Stats() {
  const [visible, setVisible] = React.useState(false);
  const ref = React.useRef(null);
  React.useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setVisible(true); obs.disconnect(); }
    }, { threshold: 0.25 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  const stats = [
    { num: 500,  suffix: '+',    label: 'Negocios activos',  sub: 'en todo El Salvador' },
    { num: 2,    suffix: 'M+',   label: 'DTE emitidos',      sub: 'al Ministerio de Hacienda' },
    { num: 99.9, suffix: '%',    label: 'Uptime',            sub: 'promedio anual', dec: 1 },
    { num: 2,    suffix: ' min', label: 'Para instalar',     sub: 'y ya estás facturando' },
  ];
  return (
    <div className="stats-section" ref={ref}>
      <div className="container">
        <div className="stats-grid">
          {stats.map((s, i) => (
            <div className="stat-item" key={i}>
              <div className="stat-num">
                <CountUp to={s.num} decimals={s.dec || 0} run={visible} />{s.suffix}
              </div>
              <div className="stat-label">{s.label}</div>
              <div className="stat-sub">{s.sub}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── LogoWall ───────────────────────────────────────────────
function LogoWall() {
  const logos = [
    { name: 'Ferretería Los Ceibos', sector: 'Ferretería' },
    { name: 'Distribuidora Omega',   sector: 'Distribución' },
    { name: 'Restaurante La Fogata', sector: 'Restaurante' },
    { name: 'Farmacia Vida',         sector: 'Salud' },
    { name: 'Hotel Pacífico',        sector: 'Hotelería' },
    { name: 'Super Don Quique',      sector: 'Retail' },
    { name: 'Clínica Santa Rosa',    sector: 'Médico' },
    { name: 'Taller ElectroPro',     sector: 'Automotriz' },
  ];
  return (
    <div className="logo-wall">
      <div className="container">
        <p className="logo-wall-eyebrow">Negocios salvadoreños que ya usan Polaris Enterprise</p>
        <div className="logo-wall-grid">
          {logos.map((l, i) => (
            <div className="logo-tile" key={i}>
              <span className="logo-tile-sector">{l.sector}</span>
              <span className="logo-tile-name">{l.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Bento (Value props) ────────────────────────────────────
function Bento() {
  return (
    <section className="section" id="producto">
      <div className="container">
        <div className="section-head">
          <div className="meta">
            <span className="num">01</span>
            <span className="label">/ Producto</span>
          </div>
          <div>
            <h2 className="display">
              Un sistema. <span className="alt">Toda</span> tu operación.
            </h2>
            <p className="desc">
              Polaris Enterprise reemplaza tu Excel, tu hoja de pedidos, tu cuaderno de cuentas por cobrar y
              tu sistema viejo de facturación — en una sola instalación de Windows que tu cajero
              entiende en minutos.
            </p>
          </div>
        </div>

        <div className="bento">
          <div className="bento-cell span-4 dark">
            <div>
              <div className="glyph">A — Punto de venta</div>
              <h3 className="cell-title">Caja registradora <em>que no te frena.</em></h3>
              <div className="cell-desc">
                Procesá ventas con teclado, scanner y display al cliente. Pausá tickets, dividí cuentas,
                aplicá descuentos. Soporta efectivo, tarjeta, transferencia y vales en el mismo cobro.
              </div>
            </div>
            <div className="chip-row" style={{ marginTop: 24 }}>
              <span className="chip">F1 Nueva venta</span>
              <span className="chip">F2 Buscar</span>
              <span className="chip">F4 Cobrar</span>
              <span className="chip">F8 Imprimir</span>
              <span className="chip">+4</span>
            </div>
          </div>

          <div className="bento-cell span-2">
            <div>
              <div className="glyph">B — DTE</div>
              <h3 className="cell-title">6 tipos <em>aprobados.</em></h3>
              <div className="cell-desc">CF, CCF, NC, ND, retención, liquidación. Transmisión en segundos.</div>
            </div>
          </div>

          <div className="bento-cell span-2">
            <div>
              <div className="glyph">C — Inventario</div>
              <h3 className="cell-title">Stock <em>en tiempo real.</em></h3>
              <div className="cell-desc">Kardex automático con cada venta. Multi-bodega. Alertas de stock bajo.</div>
            </div>
            <div className="cell-art" style={{ right: 24, top: 24 }}>∞</div>
          </div>

          <div className="bento-cell span-2">
            <div>
              <div className="glyph">D — Reportes</div>
              <h3 className="cell-title">Sin <em>abrir Excel.</em></h3>
              <div className="cell-desc">Dashboard ejecutivo. KPIs por hora, día, mes. Exporta en 1 click.</div>
            </div>
          </div>

          <div className="bento-cell span-2">
            <div>
              <div className="glyph">E — Offline first</div>
              <h3 className="cell-title">Si se cae <em>internet.</em></h3>
              <div className="cell-desc">Seguís facturando. Polaris Enterprise sincroniza solo cuando vuelve la conexión.</div>
            </div>
          </div>

          <div className="bento-cell span-2">
            <div>
              <div className="glyph">F — Multi-usuario</div>
              <h3 className="cell-title">Roles <em>granulares.</em></h3>
              <div className="cell-desc">Admin, cajero, vendedor, bodega, contador. Permisos al detalle. Auditoría.</div>
            </div>
          </div>

          <div className="bento-cell span-2">
            <div>
              <div className="glyph">G — Hardware</div>
              <h3 className="cell-title">Plug <em>& play.</em></h3>
              <div className="cell-desc">Impresoras térmicas, scanners, cajón monedero, gaveta de billetes.</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Industries section wrapper ─────────────────────────────
function IndustriesSection() {
  return (
    <section className="section" id="industrias">
      <div className="container">
        <div className="section-head">
          <div className="meta">
            <span className="num">02</span>
            <span className="label">/ Industrias</span>
          </div>
          <div>
            <h2 className="display"><em>Tu</em> negocio. Polaris Enterprise se adapta.</h2>
            <p className="desc">
              Elegí tu giro y mirá cómo cambia el POS. Misma instalación, distintos productos, distintos flujos —
              configuración a medida sin pagar extra.
            </p>
          </div>
        </div>
        <IndustriesToggle />
      </div>
    </section>
  );
}

// ── Features section wrapper ───────────────────────────────
function FeaturesSection() {
  return (
    <section className="section" id="dte">
      <div className="container">
        <div className="section-head">
          <div className="meta">
            <span className="num">03</span>
            <span className="label">/ Funciones</span>
          </div>
          <div>
            <h2 className="display">Las funciones <em>que sí</em> usás.</h2>
            <p className="desc">Cinco pilares construidos para el mercado salvadoreño. Nada que adornar; todo que vender.</p>
          </div>
        </div>
        <FeatureTabs />
      </div>
    </section>
  );
}

// ── Comparison ────────────────────────────────────────────
function Comparison() {
  const rows = [
    { feature: 'Facturación DTE electrónica',   excel: false, otro: 'Parcial',  polaris: true },
    { feature: 'POS con scanner y teclado',      excel: false, otro: true,       polaris: true },
    { feature: 'Funciona sin internet',          excel: true,  otro: false,      polaris: true },
    { feature: 'Multi-sucursal / multi-bodega',  excel: false, otro: 'Extra',    polaris: true },
    { feature: 'Inventario + kardex automático', excel: false, otro: 'Básico',   polaris: true },
    { feature: 'Planilla ISSS / AFP / ISR',      excel: false, otro: false,      polaris: true },
    { feature: 'Sin renta mensual',              excel: true,  otro: false,      polaris: true },
    { feature: 'Soporte local en El Salvador',   excel: false, otro: false,      polaris: true },
    { feature: 'Actualizaciones automáticas',    excel: false, otro: 'Pagadas',  polaris: true },
  ];
  const Cell = ({ val }) => {
    if (val === true)  return <span className="cmp-yes">✓</span>;
    if (val === false) return <span className="cmp-no">✗</span>;
    return <span className="cmp-partial">{val}</span>;
  };
  return (
    <section className="section">
      <div className="container">
        <div className="section-head" style={{ gridTemplateColumns: '1fr' }}>
          <div>
            <h2 className="display">¿Por qué no seguir <em>con Excel?</em></h2>
            <p className="desc" style={{ marginTop: 16 }}>Una comparación directa — sin letra pequeña, sin vendedores en el teléfono.</p>
          </div>
        </div>
        <div className="cmp-table-wrap">
          <table className="cmp-table">
            <thead>
              <tr>
                <th className="cmp-feature-col">Funcionalidad</th>
                <th>Excel + Hacienda manual</th>
                <th>Otro sistema del mercado</th>
                <th className="cmp-polaris-col">Polaris Enterprise</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={i}>
                  <td className="cmp-feature">{r.feature}</td>
                  <td><Cell val={r.excel} /></td>
                  <td><Cell val={r.otro} /></td>
                  <td className="cmp-polaris-cell"><Cell val={r.polaris} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

// ── Modules ────────────────────────────────────────────────
function Modules() {
  const mods = [
    { n: '01', name: <React.Fragment>Caja <em>POS</em></React.Fragment>, desc: 'Ventas rápidas con scanner, atajos por teclado y multi-pago.', tags: ['Esc/Pos', 'F1-F12', 'Scanner'] },
    { n: '02', name: <React.Fragment>DTE <em>electrónico</em></React.Fragment>, desc: 'CF, CCF, NC, ND, retención y liquidación al Ministerio de Hacienda.', tags: ['Firma', 'MH', 'XML'] },
    { n: '03', name: <React.Fragment>Inventario y <em>kardex</em></React.Fragment>, desc: 'Multi-bodega, costos PEPS/promedio, conteo físico móvil.', tags: ['Multi-sede', 'PEPS'] },
    { n: '04', name: <React.Fragment>Cuentas por <em>cobrar</em></React.Fragment>, desc: 'Antigüedad de saldos, recordatorios y abonos parciales.', tags: ['Crédito', 'Alertas'] },
    { n: '05', name: <React.Fragment>Compras y <em>proveedores</em></React.Fragment>, desc: 'Órdenes de compra, recepción y cuentas por pagar.', tags: ['CxP', 'OC'] },
    { n: '06', name: <React.Fragment>Clientes / <em>CRM</em></React.Fragment>, desc: 'Historial de compras, segmentos y descuentos por categoría.', tags: ['Segmentos'] },
    { n: '07', name: <React.Fragment>Empleados y <em>planilla</em></React.Fragment>, desc: 'Cálculo ISSS, AFP, ISR. Constancias y boletas mensuales.', tags: ['ISSS', 'AFP', 'ISR'] },
    { n: '08', name: <React.Fragment>Reportes <em>ejecutivos</em></React.Fragment>, desc: 'Dashboards en tiempo real exportables a PDF y Excel.', tags: ['PDF', 'Excel'] },
    { n: '09', name: <React.Fragment>Multi-<em>sucursal</em></React.Fragment>, desc: 'Una vista consolidada de todas tus tiendas o restaurantes.', tags: ['Multi-tienda'] },
    { n: '10', name: <React.Fragment>API & <em>conectores</em></React.Fragment>, desc: 'Integrá tu e-commerce, contabilidad o sistema heredado.', tags: ['REST', 'Webhook'] },
    { n: '11', name: <React.Fragment>Backup <em>en la nube</em></React.Fragment>, desc: 'Respaldo diario cifrado. Recuperá tu negocio en minutos.', tags: ['Cloud', 'Cifrado'] },
    { n: '12', name: <React.Fragment>Soporte <em>local</em></React.Fragment>, desc: 'Atención en SV por WhatsApp, correo o remoto. Sin call center.', tags: ['SV', 'WhatsApp'] },
  ];
  return (
    <section className="section" id="modulos">
      <div className="container">
        <div className="section-head">
          <div className="meta">
            <span className="num">04</span>
            <span className="label">/ Módulos</span>
          </div>
          <div>
            <h2 className="display">Doce módulos, <span className="alt">una sola</span> instalación.</h2>
            <p className="desc">
              No vendemos add-ons. Todo viene incluido el día que instalás Polaris Enterprise — vos activás
              los módulos a medida que tu negocio los necesita.
            </p>
          </div>
        </div>
        <div className="modules-grid">
          {mods.map((m) => (
            <div className="module-tile" key={m.n}>
              <span className="m-num">/{m.n}</span>
              <div className="m-name">{m.name}</div>
              <div className="m-desc">{m.desc}</div>
              <div className="m-tags">
                {m.tags.map((t) => <span className="m-tag" key={t}>{t}</span>)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Module Pricing section wrapper ─────────────────────────
function ModulePricingSection() {
  return (
    <section className="section" id="modulos-precio">
      <div className="container">
        <div className="section-head">
          <div className="meta">
            <span className="num">04b</span>
            <span className="label">/ Armá tu plan</span>
          </div>
          <div>
            <h2 className="display">Módulos <em>a la medida.</em></h2>
            <p className="desc">
              Empezás con DTE y vas activando lo que necesitás. Sin contratos atados —
              cada módulo es un add-on mensual sobre tu plan de facturación.
            </p>
          </div>
        </div>
        <ModuleBuilder />
      </div>
    </section>
  );
}

// ── Calculator section wrapper ─────────────────────────────
function CalculatorSection() {
  return (
    <section className="section">
      <div className="container">
        <div className="section-head">
          <div className="meta">
            <span className="num">05</span>
            <span className="label">/ Calculadora DTE</span>
          </div>
          <div>
            <h2 className="display">¿Cuánto te va a <em>costar?</em> Lo calculamos.</h2>
            <p className="desc">Movés el slider con tu volumen mensual y te decimos el pack óptimo. Cero teléfonos, cero esperar cotización.</p>
          </div>
        </div>
        <DTECalculator />
      </div>
    </section>
  );
}

// ── Pricing ────────────────────────────────────────────────
function Pricing() {
  const [hover, setHover] = React.useState(2);
  return (
    <section className="section" id="precios">
      <div className="container">
        <div className="section-head">
          <div className="meta">
            <span className="num">06</span>
            <span className="label">/ Precios</span>
          </div>
          <div>
            <h2 className="display">Pagás por DTE. <em>Punto.</em></h2>
            <p className="desc">
              Sin licencias mensuales escondidas. Polaris Enterprise es <b>gratis</b> de descargar e instalar — solo comprás paquetes de DTE
              electrónicos cuando los necesitás. Tu saldo no expira.
            </p>
          </div>
        </div>

        <div className="pricing-banner">
          <span className="pb-glyph">$</span>
          <div>
            <div className="pb-title">El POS y los módulos son <em>gratis</em>. Solo pagás los DTE que emitís.</div>
            <div className="pb-desc">Si nunca facturás electrónico, nunca nos pagás. Si facturás 10,000 al mes — el costo unitario es el más bajo del mercado salvadoreño.</div>
          </div>
          <div className="pb-meta">Sin licencias · Sin renta</div>
        </div>

        <div className="pricing-grid">
          {PACKS.slice(0, 6).map((p, i) => (
            <div
              key={p.count}
              className={'pack' + (hover === i ? ' recommended' : '')}
              onMouseEnter={() => setHover(i)}
              onFocus={() => setHover(i)}
            >
              <div className="pk-num">/{String(i + 1).padStart(2, '0')}</div>
              <div className="pk-count">{p.count.toLocaleString('es-SV')}</div>
              <div className="pk-label">DTE electrónicos</div>
              <div className="pk-price">${p.price.toFixed(2)}</div>
              <div className="pk-per">${(p.price / p.count).toFixed(3)} c/u · {p.sup}</div>
              <a href="#contacto" className="pk-cta">{hover === i ? 'Empezar →' : 'Elegir'}</a>
            </div>
          ))}
        </div>

        <p style={{ textAlign: 'center', fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--ink-3)', marginTop: 22, letterSpacing: '.04em' }}>
          Todos los packs incluyen acceso completo al POS, ERP, DTE electrónico y actualizaciones automáticas · tu saldo NUNCA expira
        </p>
      </div>
    </section>
  );
}

// ── Quotes ─────────────────────────────────────────────────
function Quotes() {
  const quotes = [
    { q: 'Pasamos de facturar a mano a emitir 80 DTE al día sin contratar más gente.', name: 'Roberto V.', role: 'Ferretería · San Salvador' },
    { q: 'El cierre de mes lo hacíamos en 3 días. Ahora lo hago el último domingo en una hora.', name: 'Carla M.', role: 'Restaurante · Santa Tecla' },
    { q: 'Tengo 4 sucursales y los veo todos desde el mismo panel. Antes era un caos de Excels.', name: 'Mario H.', role: 'Distribuidora · Sonsonate' },
  ];
  return (
    <section className="section">
      <div className="container">
        <div className="section-head">
          <div className="meta">
            <span className="num">07</span>
            <span className="label">/ Lo que dicen</span>
          </div>
          <div>
            <h2 className="display">Negocios <em>reales,</em> resultados <span className="alt">reales.</span></h2>
            <p className="desc">Estas son citas representativas — pediles los datos completos a nuestro equipo.</p>
          </div>
        </div>
        <div className="quotes-grid">
          {quotes.map((qq, i) => (
            <div className="quote-card" key={i}>
              <div className="q-mark">"</div>
              <blockquote>{qq.q}</blockquote>
              <div className="q-by">
                <div className="q-avatar">{qq.name[0]}</div>
                <div>
                  <div className="q-name">{qq.name}</div>
                  <div className="q-role">{qq.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── FAQ ───────────────────────────────────────────────────
function FAQ() {
  const [open, setOpen] = React.useState(null);
  const items = [
    { q: '¿Funciona sin conexión a internet?',
      a: 'Sí. Polaris guarda todo localmente y sincroniza solo cuando recuperás la conexión. Nunca parás de vender ni de facturar.' },
    { q: '¿Qué pasa si Hacienda rechaza un DTE?',
      a: 'El sistema avisa en tiempo real con el código de error exacto del MH. Podés corregir y reenviar sin perder el correlativo ni detener la caja.' },
    { q: '¿Cuánto cuesta instalar Polaris Enterprise?',
      a: 'La descarga e instalación son completamente gratis. Solo comprás paquetes de DTE electrónicos cuando los necesitás. Sin contrato, sin renta mensual.' },
    { q: '¿Compatible con mi impresora térmica?',
      a: 'Soporta cualquier impresora ESC/POS: Epson, Bixolon, Star, ZKTeco, Sewoo y modelos genéricos USB o en red.' },
    { q: '¿Puedo manejar varias sucursales desde un solo panel?',
      a: 'Sí. Multi-sucursal incluido sin costo adicional. Ves ventas, inventario y DTEs de todas tus tiendas consolidados en tiempo real.' },
    { q: '¿Mis datos están seguros?',
      a: 'Backup diario cifrado en la nube. Tus datos también viven localmente — si el servidor cae, tu operación no para con él.' },
  ];
  return (
    <section className="section" id="faq">
      <div className="container">
        <div className="section-head">
          <div className="meta">
            <span className="num">08</span>
            <span className="label">/ FAQ</span>
          </div>
          <div>
            <h2 className="display">Preguntas <em>frecuentes.</em></h2>
            <p className="desc">Las mismas que nos hacen todos los días — respondidas aquí.</p>
          </div>
        </div>
        <div className="faq-list">
          {items.map((item, i) => (
            <div className={`faq-item${open === i ? ' open' : ''}`} key={i}>
              <button className="faq-trigger" onClick={() => setOpen(open === i ? null : i)}>
                <span>{item.q}</span>
                <span className="faq-icon">+</span>
              </button>
              <div className="faq-answer">{item.a}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Contact ────────────────────────────────────────────────
function Contact() {
  return (
    <section className="section" id="contacto">
      <div className="container">
        <div className="section-head">
          <div className="meta">
            <span className="num">09</span>
            <span className="label">/ Hablemos</span>
          </div>
          <div>
            <h2 className="display"><em>Decinos</em> de qué trata tu negocio.</h2>
            <p className="desc">Respondemos en menos de 24 horas — usualmente mucho antes. Sin formularios largos ni call center.</p>
          </div>
        </div>

        <div className="contact-grid">
          <a className="contact-card wa" href="https://wa.me/50300000000?text=Hola%2C%20me%20interesa%20Polaris%20Enterprise" target="_blank" rel="noopener">
            <span className="c-num">/01 — WhatsApp</span>
            <span className="c-name">Escribinos al <em>WhatsApp</em></span>
            <span className="c-meta">+503 0000-0000 · L–V 8am–6pm</span>
            <span className="c-arrow">↗</span>
          </a>
          <a className="contact-card" href="mailto:hola@polarisenterprise.com">
            <span className="c-num">/02 — Correo</span>
            <span className="c-name">Correo <em>directo.</em></span>
            <span className="c-meta">hola@polarisenterprise.com · respuesta &lt; 24h</span>
            <span className="c-arrow">↗</span>
          </a>
        </div>
      </div>
    </section>
  );
}

// ── Versiones Download ─────────────────────────────────────
function VersionesDownload() {
  return (
    <section className="section" id="descargar">
      <div className="container">
        <div className="section-head">
          <div className="meta">
            <span className="num">10</span>
            <span className="label">/ Descarga</span>
          </div>
          <div>
            <h2 className="display">Elegí tu <em>versión.</em></h2>
            <p className="desc">
              Dos versiones del mismo software — adaptadas a tu infraestructura. Sin pagar doble, sin cambiar de sistema.
            </p>
          </div>
        </div>

        <div className="version-cards">
          {/* ── Versión Cloud ───────────────────────────── */}
          <div className="version-card">
            <div className="vc-badge cloud">Cloud</div>
            <div className="vc-name">Polaris <em>Enterprise</em></div>
            <div className="vc-tagline">Tu POS conectado a la nube de Speeddan</div>
            <ul className="vc-list">
              <li><span className="vc-check">✓</span> Acceso desde cualquier PC — sin instalar</li>
              <li><span className="vc-check">✓</span> BD en la nube — zero mantenimiento</li>
              <li><span className="vc-check">✓</span> Multi-sucursal sincronizado en tiempo real</li>
              <li><span className="vc-check">✓</span> Actualizaciones automáticas silenciosas</li>
              <li><span className="vc-check">✓</span> Soporte técnico incluido</li>
              <li><span className="vc-neutral">~</span> Requiere internet para funcionar</li>
            </ul>
            <div className="vc-note">Ideal para negocios con conexión estable y varias sucursales.</div>
            <div className="vc-actions">
              <DownloadButton className="btn btn-ink" label="Descargar para Windows" />
              <a className="btn btn-ghost" href="https://polaris-web-sooty.vercel.app" target="_blank" rel="noopener">
                Abrir versión web <span className="arrow">→</span>
              </a>
            </div>
          </div>

          {/* ── Versión Local ───────────────────────────── */}
          <div className="version-card local-card">
            <div className="vc-badge local">Local · Nuevo</div>
            <div className="vc-name">Polaris <em>Local</em></div>
            <div className="vc-tagline">Todo en tu PC — sin depender de servidores</div>
            <ul className="vc-list">
              <li><span className="vc-check">✓</span> Funciona <strong>100% offline</strong> — BD en tu PC</li>
              <li><span className="vc-check">✓</span> DTE requiere internet solo al emitir</li>
              <li><span className="vc-check">✓</span> Pago único de licencia — sin mensualidades</li>
              <li><span className="vc-check">✓</span> Datos en tu máquina — máxima privacidad</li>
              <li><span className="vc-check">✓</span> Wizard de instalación guiada en 5 min</li>
              <li><span className="vc-check">✓</span> Backup automático diario en ZIP local</li>
            </ul>
            <div className="vc-note">Ideal para emprendedores individuales sin servidor propio.</div>
            <div className="vc-actions">
              <LocalDownloadButton className="btn btn-accent" label="Descargar Polaris Local" />
              <a className="btn btn-ghost" href="#contacto">
                Solicitar licencia <span className="arrow">→</span>
              </a>
            </div>
            <div className="vc-req">
              <strong>Requisitos:</strong> Windows 10/11 · PostgreSQL 14+ · 4 GB RAM · 2 GB espacio
            </div>
          </div>
        </div>

        {/* Tabla comparativa rápida */}
        <div className="vc-compare">
          <table className="cmp-table" style={{ marginTop: 40 }}>
            <thead>
              <tr>
                <th className="cmp-feature-col">Característica</th>
                <th>Enterprise (Cloud)</th>
                <th className="cmp-polaris-col">Local</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['Base de datos',       'Neon PostgreSQL (nube)',      'PostgreSQL en tu PC'],
                ['Internet requerido',  'Siempre',                    'Solo al emitir DTE'],
                ['Precio',             'Por paquetes DTE',            'Licencia única'],
                ['Multi-sucursal',     '✓ Nativo',                   'Con configuración'],
                ['Backup',             'Automático en nube',          'ZIP diario local'],
                ['Módulos premium',    'Incluidos en plan',           'Activados remotamente'],
                ['Activación',         'Web o descarga',              'Wizard + licencia'],
              ].map(([feat, cloud, local], i) => (
                <tr key={i}>
                  <td className="cmp-feature">{feat}</td>
                  <td>{cloud}</td>
                  <td className="cmp-polaris-cell">{local}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

// ── CTA Final ──────────────────────────────────────────────
function CTAFinal() {
  return (
    <section className="cta-final">
      <div className="container cta-final-inner">
        <h2 className="display">Tu negocio, <em>con norte.</em></h2>
        <p>Dos versiones. Un solo software. Empezá hoy.</p>
        <div className="cta-actions">
          <DownloadButton label="Enterprise — Windows" />
          <LocalDownloadButton className="btn btn-outline" label="Local — Windows" />
          <a href="https://polaris-web-sooty.vercel.app" target="_blank" rel="noopener" className="btn btn-ghost">Versión web <span className="arrow">→</span></a>
        </div>
        <div className="post-cta">
          <span>Windows 10 / 11</span>
          <span>Instalación 2 min</span>
          <span>Actualizaciones automáticas</span>
          <span>Soporte en SV</span>
        </div>
      </div>
    </section>
  );
}

// ── Footer ─────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <a href="#" className="nav-brand" style={{ marginBottom: 0 }}>
              <span className="star" style={{ color: 'var(--accent)' }}><PolarisMark size={22} /></span>
              <span>Polaris<span className="it"> Enterprise</span></span>
            </a>
            <div className="footer-brand-text">El software que las empresas <em className="italic-serif" style={{ color: 'var(--accent)' }}>salvadoreñas</em> sí entienden.</div>
          </div>
          <div className="footer-col">
            <h4>Producto</h4>
            <ul>
              <li><a href="#producto">Caja / POS</a></li>
              <li><a href="#dte">DTE</a></li>
              <li><a href="#modulos">Módulos</a></li>
              <li><a href="#precios">Precios</a></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Empresa</h4>
            <ul>
              <li><a href="#contacto">Contacto</a></li>
              <li><a href="#">Sobre nosotros</a></li>
              <li><a href="#">Carreras</a></li>
              <li><a href="#">Prensa</a></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Soporte</h4>
            <ul>
              <li><a href="#">Documentación</a></li>
              <li><a href="#">Cambios y versiones</a></li>
              <li><a href="#">Estado del servicio</a></li>
              <li><a href="#">Privacidad</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2026 Speeddan System — Hecho en El Salvador</span>
          <span>v1.0 · Mayo 2026</span>
        </div>
      </div>
    </footer>
  );
}

// ── Reveal observer ────────────────────────────────────────
function useReveal() {
  React.useEffect(() => {
    const els = document.querySelectorAll('.section, .marquee-wrap, .quote-card, .module-tile, .bento-cell, .pack');
    els.forEach((el) => el.classList.add('reveal'));
    requestAnimationFrame(() => {
      els.forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.top < window.innerHeight && r.bottom > 0) el.classList.add('visible');
      });
    });
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.05, rootMargin: '0px 0px -40px 0px' });
    els.forEach((el) => { if (!el.classList.contains('visible')) obs.observe(el); });
    return () => obs.disconnect();
  }, []);
}

// ── App ────────────────────────────────────────────────────
export default function App() {
  useReveal();

  return (
    <>
      <Nav />
      <Hero />
      <Marquee speed={32} />
      <Stats />
      <LogoWall />
      <Bento />
      <IndustriesSection />
      <FeaturesSection />
      <Comparison />
      <Modules />
      <ModulePricingSection />
      <CalculatorSection />
      <Pricing />
      <Quotes />
      <FAQ />
      <VersionesDownload />
      <Contact />
      <CTAFinal />
      <Footer />

      <a className="wa-float" href="https://wa.me/50300000000?text=Hola%2C%20me%20interesa%20Polaris%20Enterprise" target="_blank" rel="noopener" aria-label="WhatsApp">
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      </a>
    </>
  );
}
