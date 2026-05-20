/* ============================================================
   POLARIS — Interactive components
   POSDemo, IndustriesToggle, FeatureTabs, DTECalculator
   ============================================================ */

// ── Industries data ────────────────────────────────────────
const INDUSTRIES = [
  {
    id: 'retail',
    num: '01',
    name: 'Tiendas & Retail',
    tag: 'Comercio',
    url: 'app.polarisenterprise.com/caja',
    products: [
      { emoji: '🍫', name: 'Chocolate Diana 80g', price: 1.25 },
      { emoji: '🥤', name: 'Coca-Cola 600ml', price: 1.10 },
      { emoji: '🍞', name: 'Pan francés (uno)', price: 0.20 },
      { emoji: '🧴', name: 'Shampoo Sedal 400ml', price: 4.95 },
      { emoji: '🧼', name: 'Jabón Protex barra', price: 1.45 },
      { emoji: '📰', name: 'La Prensa Gráfica', price: 0.75 },
    ],
  },
  {
    id: 'restaurante',
    num: '02',
    name: 'Restaurantes',
    tag: 'Gastronomía',
    url: 'app.polarisenterprise.com/mesas',
    products: [
      { emoji: '🫓', name: 'Pupusa de queso', price: 0.75 },
      { emoji: '🌮', name: 'Tacos al pastor (3)', price: 3.50 },
      { emoji: '🍔', name: 'Hamburguesa clásica', price: 5.95 },
      { emoji: '🍟', name: 'Yuca frita', price: 2.25 },
      { emoji: '🥤', name: 'Refresco de horchata', price: 1.50 },
      { emoji: '☕', name: 'Café americano', price: 1.25 },
    ],
  },
  {
    id: 'distribuidora',
    num: '03',
    name: 'Distribuidoras',
    tag: 'Distribución',
    url: 'app.polarisenterprise.com/orden',
    products: [
      { emoji: '📦', name: 'Caja agua x24', price: 8.40 },
      { emoji: '🛢️', name: 'Aceite Capullo 1L', price: 3.95 },
      { emoji: '🧂', name: 'Sal Marsel 1kg', price: 0.95 },
      { emoji: '🌾', name: 'Arroz Diana 5lb', price: 4.50 },
      { emoji: '🫘', name: 'Frijol rojo 5lb', price: 6.75 },
      { emoji: '🥫', name: 'Atún Sardimar lata', price: 1.65 },
    ],
  },
  {
    id: 'servicios',
    num: '04',
    name: 'Servicios',
    tag: 'B2B & profesional',
    url: 'app.polarisenterprise.com/facturar',
    products: [
      { emoji: '💼', name: 'Consultoría hora', price: 45.00 },
      { emoji: '🔧', name: 'Mantenimiento PC', price: 25.00 },
      { emoji: '📊', name: 'Asesoría contable', price: 80.00 },
      { emoji: '🎨', name: 'Diseño de logo', price: 150.00 },
      { emoji: '🚐', name: 'Traslado / flete', price: 35.00 },
      { emoji: '🛠️', name: 'Instalación red', price: 120.00 },
    ],
  },
];

// ── Industries Toggle ──────────────────────────────────────
function IndustriesToggle() {
  const [active, setActive] = React.useState(0);
  const [cart, setCart] = React.useState([]);
  const [dteOpen, setDteOpen] = React.useState(false);

  const current = INDUSTRIES[active];

  const switchIndustry = (idx) => {
    setActive(idx);
    setCart([]);
    setDteOpen(false);
  };

  const addToCart = (p) => {
    setCart((prev) => {
      const existing = prev.find((x) => x.name === p.name);
      if (existing) return prev.map((x) => x.name === p.name ? { ...x, qty: x.qty + 1 } : x);
      return [...prev, { ...p, qty: 1 }];
    });
    setDteOpen(false);
  };
  const updateQty = (name, delta) => {
    setCart((prev) => prev
      .map((x) => x.name === name ? { ...x, qty: x.qty + delta } : x)
      .filter((x) => x.qty > 0)
    );
  };

  const subtotal = cart.reduce((s, x) => s + x.price * x.qty, 0);
  const iva = subtotal * 0.13;
  const total = subtotal + iva;
  const count = cart.reduce((s, x) => s + x.qty, 0);

  const emit = () => {
    if (cart.length === 0) return;
    setDteOpen(true);
  };

  return (
    <div className="industries-wrap">
      {/* tabs */}
      <div className="industry-tabs">
        {INDUSTRIES.map((ind, i) => (
          <button
            key={ind.id}
            className={'industry-tab' + (i === active ? ' active' : '')}
            onClick={() => switchIndustry(i)}
          >
            <span className="ind-num">/{ind.num}</span>
            <span className="ind-name">{ind.name}</span>
            <span className="ind-arrow">→</span>
          </button>
        ))}
      </div>

      {/* screen */}
      <div className="industry-screen">
        <div className="mockup-chrome">
          <div className="dots"><span></span><span></span><span></span></div>
          <div className="url">{current.url}</div>
          <span className="kicker" style={{ fontSize: 10 }}>{current.tag}</span>
        </div>
        <div className="screen-body">
          {/* products */}
          <div className="screen-products">
            {current.products.map((p) => {
              const inCart = cart.find((c) => c.name === p.name);
              return (
                <button
                  key={p.name}
                  className={'product-tile' + (inCart ? ' added' : '')}
                  onClick={() => addToCart(p)}
                >
                  <div className="pt-thumb">{p.emoji}</div>
                  <div className="pt-name">{p.name}</div>
                  <div className="pt-price">${p.price.toFixed(2)}{inCart && <span style={{color:'var(--accent-2)'}}> · ×{inCart.qty}</span>}</div>
                </button>
              );
            })}
          </div>
          {/* cart */}
          <div className="screen-cart">
            <div className="cart-head">
              <span className="ctitle">Caja activa</span>
              <span className="ccount">{count} items</span>
            </div>
            <div className="cart-items">
              {cart.length === 0 ? (
                <div className="cart-empty">
                  ↑ Hacé clic en productos<br/>para empezar una venta
                </div>
              ) : (
                cart.map((c) => (
                  <div key={c.name} className="cart-item">
                    <div>
                      <div className="ci-name">{c.name}</div>
                      <div className="ci-qty-row">
                        <button className="cart-qty-btn" onClick={() => updateQty(c.name, -1)}>−</button>
                        <span>×{c.qty}</span>
                        <button className="cart-qty-btn" onClick={() => updateQty(c.name, +1)}>+</button>
                      </div>
                    </div>
                    <div className="ci-price">${(c.price * c.qty).toFixed(2)}</div>
                  </div>
                ))
              )}
            </div>
            <div className="cart-totals">
              <div className="cart-line"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
              <div className="cart-line"><span>IVA 13%</span><span>${iva.toFixed(2)}</span></div>
              <div className="cart-line total"><span>Total</span><span className="num">${total.toFixed(2)}</span></div>
            </div>
            <button className="btn-emit" onClick={emit} disabled={cart.length === 0}>
              {cart.length === 0 ? 'Agregá productos primero' : 'Generar DTE →'}
            </button>
          </div>
        </div>

        {dteOpen && (
          <div className="dte-result">
            <button className="dr-close" onClick={() => setDteOpen(false)}>×</button>
            <div className="dr-head">
              <div className="dr-name">DTE emitido</div>
              <div className="dr-badge">✓ Transmitido al MH</div>
            </div>
            <div className="dr-row"><span>Tipo</span><span>Factura CF</span></div>
            <div className="dr-row"><span>Núm. control</span><span>DTE-01-{Math.floor(Math.random()*1e7).toString().padStart(7,'0')}</span></div>
            <div className="dr-row"><span>Cód. generación</span><span>{Array.from({length:4},() => Math.random().toString(16).slice(2,6).toUpperCase()).join('-')}</span></div>
            <div className="dr-row"><span>Fecha</span><span>{new Date().toLocaleString('es-SV', { dateStyle: 'short', timeStyle: 'short' })}</span></div>
            <div className="dr-row" style={{ marginTop: 10, paddingTop: 10, borderTop: '1px solid color-mix(in oklab, var(--canvas) 14%, transparent)' }}>
              <span>Total facturado</span>
              <span className="dr-total">${total.toFixed(2)}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Feature Tabs ───────────────────────────────────────────
const FEATURES = [
  {
    num: '01',
    name: 'POS',
    title: <>Caja registradora <em>ultra rápida.</em></>,
    desc: 'Procesá una venta sin mouse. Atajos por teclado, scanner USB, impresora térmica y cajón monedero conectados out-of-the-box.',
    bullets: [
      ['Atajos completos.', 'F1 nueva venta · F2 buscar · F4 cobrar · F8 imprimir. Tu cajero memoriza la caja en una semana.'],
      ['Hardware listo.', 'ESC/POS, lectores HID y display al cliente. Probado con marcas que se venden acá: Epson, Bixolon, Honeywell.'],
      ['Multi-pago.', 'Efectivo, tarjeta, transferencia, vales o mixto. Cierre de caja con cuadre automático.'],
    ],
    mock: 'pos',
  },
  {
    num: '02',
    name: 'DTE',
    title: <>Hacienda contesta <em>en segundos.</em></>,
    desc: 'CF, CCF, Nota de Crédito, Nota de Débito, Comprobante de Retención, Liquidación. Firma digital, sellado de tiempo y transmisión automática. Sin pelearte con XML.',
    bullets: [
      ['6 tipos de DTE.', 'Todos los documentos que el MH te exige, listos al primer click.'],
      ['Contingencia integrada.', 'Si Hacienda se cae, tu venta sigue. Reenvío automático cuando se restablece.'],
      ['Histórico auditable.', 'Cada documento queda con su firma, hash y respuesta del MH descargable.'],
    ],
    mock: 'dte',
  },
  {
    num: '03',
    name: 'Inventario',
    title: <>Kardex que no <em>se pelea</em> con tu bodega.</>,
    desc: 'Cada venta y cada compra mueve el inventario solo. Stock por sucursal, alertas de mínimo, costos promedio o PEPS. Toma física con código de barras desde el teléfono.',
    bullets: [
      ['Multi-bodega.', 'Sucursal principal, almacén, vehículo de reparto. Traslados internos con un click.'],
      ['Costos reales.', 'Promedio ponderado o PEPS. El margen que ves es el margen que ganás.'],
      ['Conteo físico móvil.', 'App de bodega con scanner del celular. Sin importar inventarios desde Excel.'],
    ],
    mock: 'inv',
  },
  {
    num: '04',
    name: 'Reportes',
    title: <>Tus números, <em>sin Excel.</em></>,
    desc: 'Dashboard ejecutivo con los KPIs que te importan. Ventas por hora, producto, cajero, sucursal. Comparativas mes a mes. Exporta a PDF o Excel en un click.',
    bullets: [
      ['Tiempo real.', 'Lo que pasó en caja hace 5 minutos ya está en tu reporte.'],
      ['Drill-down.', 'De ventas del mes a la factura individual sin perder contexto.'],
      ['Cierre contable.', 'Reportes en formato MH listos para tu contador. Sin reproceso.'],
    ],
    mock: 'rep',
  },
  {
    num: '05',
    name: 'Equipo',
    title: <>Cada quien ve <em>lo suyo.</em></>,
    desc: 'Roles granulares: admin, cajero, vendedor, gerente, contador. Auditoría completa de quién hizo qué y cuándo. Apertura y cierre de turno por usuario.',
    bullets: [
      ['Permisos al detalle.', '¿El cajero puede anular? ¿Aplicar descuento? Vos decidís.'],
      ['Auditoría.', 'Log de cada movimiento sensible. Anulaciones, descuentos, precios manuales.'],
      ['Turnos.', 'Apertura, arqueo y cierre de caja por turno y usuario.'],
    ],
    mock: 'team',
  },
];

function FeatureMockup({ kind }) {
  if (kind === 'pos') {
    return (
      <div className="mockup-frame" style={{ height: '100%' }}>
        <div className="mockup-chrome">
          <div className="dots"><span></span><span></span><span></span></div>
          <div className="url">app.polarisenterprise.com/caja/nueva</div>
        </div>
        <div style={{ padding: 24, background: 'var(--canvas)', minHeight: 360 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 240px', gap: 16, height: '100%' }}>
            <div>
              <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
                <input className="kicker" style={{ flex: 1, padding: '10px 14px', borderRadius: 100, border: '1px solid var(--line)', background: 'var(--paper)', fontFamily: 'var(--mono)' }} placeholder="ESCANEÁ O BUSCÁ..." readOnly value="7501234567890" />
                <span className="mk-act primary" style={{ padding: '8px 14px' }}>F2 buscar</span>
              </div>
              <div style={{ background: 'var(--paper)', border: '1px solid var(--line)', borderRadius: 10, overflow: 'hidden' }}>
                {[
                  ['Coca-Cola 2L', 2, 2.95, 5.90],
                  ['Pan francés', 12, 0.20, 2.40],
                  ['Aceite Capullo 1L', 1, 3.95, 3.95],
                  ['Detergente Sapolio', 3, 1.85, 5.55],
                ].map(([n, q, p, t]) => (
                  <div key={n} style={{ display: 'grid', gridTemplateColumns: '1fr 50px 80px 80px', padding: '10px 14px', fontSize: 12, borderBottom: '1px solid var(--line-2)', alignItems: 'center' }}>
                    <span>{n}</span>
                    <span className="kicker" style={{ fontSize: 11 }}>×{q}</span>
                    <span className="kicker" style={{ fontSize: 11, textAlign: 'right' }}>${p.toFixed(2)}</span>
                    <span style={{ fontFamily: 'var(--mono)', fontWeight: 600, textAlign: 'right' }}>${t.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ background: 'var(--ink)', color: 'var(--canvas)', padding: 18, borderRadius: 10, display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div className="kicker" style={{ color: 'color-mix(in oklab, var(--canvas) 50%, transparent)' }}>Total a cobrar</div>
              <div className="italic-serif" style={{ fontSize: 44, lineHeight: 1, color: 'var(--canvas)' }}>$17.80</div>
              <div style={{ borderTop: '1px solid color-mix(in oklab, var(--canvas) 14%, transparent)', paddingTop: 14, display: 'flex', flexDirection: 'column', gap: 8 }}>
                {['Efectivo', 'Tarjeta', 'Transferencia', 'Mixto'].map((m, i) => (
                  <button key={m} className="mk-act" style={{ background: i===0?'var(--warm)':'transparent', color: i===0?'var(--ink)':'var(--canvas)', borderColor: i===0?'var(--warm)':'color-mix(in oklab, var(--canvas) 20%, transparent)', justifyContent: 'space-between', display: 'flex', padding: '8px 14px' }}>
                    <span>{m}</span>
                    <span className="kicker" style={{ color: 'inherit', opacity: .6 }}>F{4+i}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  if (kind === 'dte') {
    return (
      <div className="mockup-frame" style={{ height: '100%' }}>
        <div className="mockup-chrome">
          <div className="dots"><span></span><span></span><span></span></div>
          <div className="url">app.polarisenterprise.com/dte/emitidos</div>
        </div>
        <div style={{ padding: 20, background: 'var(--canvas)', minHeight: 380 }}>
          {[
            ['DTE-01-00000234', 'Factura CF', '$245.30', 'Transmitido'],
            ['DTE-03-00000089', 'CCF', '$1,820.00', 'Transmitido'],
            ['DTE-05-00000012', 'Nota Crédito', '−$45.50', 'Transmitido'],
            ['DTE-01-00000235', 'Factura CF', '$98.75', 'Pendiente'],
            ['DTE-04-00000043', 'Comp. Retención', '$220.00', 'Transmitido'],
          ].map(([id, t, amt, st], i) => (
            <div key={id} style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr .8fr auto', padding: '14px 16px', background: 'var(--paper)', border: '1px solid var(--line)', borderRadius: 10, marginBottom: 8, fontSize: 13, alignItems: 'center', gap: 12 }}>
              <span style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--ink-2)' }}>{id}</span>
              <span>{t}</span>
              <span style={{ fontFamily: 'var(--mono)', fontWeight: 600 }}>{amt}</span>
              <span className="pill" style={{ padding: '3px 10px', fontSize: 10, background: st === 'Transmitido' ? 'color-mix(in oklab, var(--success) 12%, var(--paper))' : 'color-mix(in oklab, var(--warm) 14%, var(--paper))', color: st === 'Transmitido' ? 'var(--success)' : 'var(--ink)', border: 0 }}>{st === 'Transmitido' ? '✓ ' : '⏱ '}{st}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  if (kind === 'inv') {
    return (
      <div className="mockup-frame" style={{ height: '100%' }}>
        <div className="mockup-chrome">
          <div className="dots"><span></span><span></span><span></span></div>
          <div className="url">app.polarisenterprise.com/inventario</div>
        </div>
        <div style={{ padding: 20, background: 'var(--canvas)', minHeight: 380 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 16 }}>
            {[['Productos','1,284'],['Stock bajo','12'],['Valor inventario','$48,920']].map(([l, v]) => (
              <div key={l} style={{ background: 'var(--paper)', border: '1px solid var(--line)', borderRadius: 10, padding: 14 }}>
                <div className="kicker" style={{ marginBottom: 6 }}>{l}</div>
                <div className="italic-serif" style={{ fontSize: 24, color: l === 'Stock bajo' ? 'var(--accent-2)' : 'var(--ink)' }}>{v}</div>
              </div>
            ))}
          </div>
          <div style={{ background: 'var(--paper)', border: '1px solid var(--line)', borderRadius: 10, overflow: 'hidden' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', padding: '10px 16px', fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '.06em', textTransform: 'uppercase', color: 'var(--ink-3)', background: 'var(--canvas)', borderBottom: '1px solid var(--line)' }}>
              <span>Producto</span><span>SKU</span><span>Stock</span><span>Valor</span>
            </div>
            {[
              ['Aceite Capullo 1L', 'ACP-001', 142, '$420.30'],
              ['Pan francés', 'PAN-002', 'BAJO 8', '$1.60'],
              ['Coca-Cola 2L', 'CC2-001', 89, '$220.55'],
              ['Detergente Sapolio', 'DET-018', 36, '$54.00'],
              ['Atún Sardimar', 'ATN-004', 'BAJO 4', '$6.60'],
            ].map(([n, s, st, v]) => (
              <div key={s} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', padding: '10px 16px', fontSize: 12, borderBottom: '1px solid var(--line-2)', alignItems: 'center' }}>
                <span>{n}</span>
                <span style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--ink-3)' }}>{s}</span>
                <span style={{ fontFamily: 'var(--mono)', fontWeight: 600, color: typeof st === 'string' && st.startsWith('BAJO') ? 'var(--accent-2)' : 'var(--ink)' }}>{st}</span>
                <span style={{ fontFamily: 'var(--mono)' }}>{v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
  if (kind === 'rep') {
    return (
      <div className="mockup-frame" style={{ height: '100%' }}>
        <div className="mockup-chrome">
          <div className="dots"><span></span><span></span><span></span></div>
          <div className="url">app.polarisenterprise.com/reportes</div>
        </div>
        <div style={{ padding: 22, background: 'var(--canvas)', minHeight: 380 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 16 }}>
            <span className="italic-serif" style={{ fontSize: 22 }}>Mayo 2026</span>
            <span className="kicker">vs. abril ↑12%</span>
          </div>
          <div style={{ background: 'var(--paper)', border: '1px solid var(--line)', borderRadius: 10, padding: 18, marginBottom: 14 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
              <span style={{ fontSize: 12, fontWeight: 600 }}>Ventas por día</span>
              <span className="kicker">$48,920 total</span>
            </div>
            <div style={{ height: 140, display: 'flex', alignItems: 'flex-end', gap: 4 }}>
              {[45, 62, 38, 70, 55, 90, 78, 50, 68, 88, 95, 72, 60, 82, 91, 58, 76, 48, 65, 88, 100, 70].map((h, i) => (
                <div key={i} style={{ flex: 1, background: h > 85 ? 'var(--accent-2)' : 'var(--accent)', borderRadius: '3px 3px 0 0', height: `${h}%`, opacity: i === 14 ? 1 : .85 }} />
              ))}
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
            <div style={{ background: 'var(--paper)', border: '1px solid var(--line)', borderRadius: 10, padding: 14 }}>
              <div className="kicker" style={{ marginBottom: 6 }}>Top producto</div>
              <div style={{ fontSize: 14, fontWeight: 600 }}>Coca-Cola 2L</div>
              <div className="kicker" style={{ marginTop: 4 }}>284 unidades · $838</div>
            </div>
            <div style={{ background: 'var(--paper)', border: '1px solid var(--line)', borderRadius: 10, padding: 14 }}>
              <div className="kicker" style={{ marginBottom: 6 }}>Hora pico</div>
              <div style={{ fontSize: 14, fontWeight: 600 }}>12:00 – 14:00</div>
              <div className="kicker" style={{ marginTop: 4 }}>32% del día</div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  if (kind === 'team') {
    const team = [
      { name: 'Ana López', role: 'Administradora', perms: ['Todo'], st: 'En turno', avatar: 'A' },
      { name: 'Carlos M.', role: 'Cajero', perms: ['Vender', 'Cobrar'], st: 'En turno', avatar: 'C' },
      { name: 'Beatriz R.', role: 'Vendedora', perms: ['Vender'], st: 'En turno', avatar: 'B' },
      { name: 'Juan P.', role: 'Bodega', perms: ['Inventario'], st: 'Fuera', avatar: 'J' },
      { name: 'Mario E.', role: 'Contador', perms: ['Reportes', 'DTE'], st: 'Acceso remoto', avatar: 'M' },
    ];
    return (
      <div className="mockup-frame" style={{ height: '100%' }}>
        <div className="mockup-chrome">
          <div className="dots"><span></span><span></span><span></span></div>
          <div className="url">app.polarisenterprise.com/equipo</div>
        </div>
        <div style={{ padding: 20, background: 'var(--canvas)', minHeight: 380 }}>
          {team.map((t) => (
            <div key={t.name} style={{ display: 'grid', gridTemplateColumns: '44px 1fr auto auto', alignItems: 'center', gap: 14, padding: 14, background: 'var(--paper)', border: '1px solid var(--line)', borderRadius: 10, marginBottom: 8 }}>
              <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--canvas)', border: '1px solid var(--line)', display: 'grid', placeItems: 'center', fontFamily: 'var(--serif)', fontStyle: 'italic', color: 'var(--accent)', fontSize: 18 }}>{t.avatar}</div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600 }}>{t.name}</div>
                <div className="kicker" style={{ marginTop: 2 }}>{t.role}</div>
              </div>
              <div style={{ display: 'flex', gap: 4 }}>
                {t.perms.map((p) => <span className="chip" key={p}>{p}</span>)}
              </div>
              <span className="pill" style={{ fontSize: 10, padding: '3px 10px', border: 0, background: t.st === 'Fuera' ? 'var(--canvas)' : t.st === 'Acceso remoto' ? 'color-mix(in oklab, var(--warm) 14%, var(--paper))' : 'color-mix(in oklab, var(--success) 12%, var(--paper))', color: t.st === 'Fuera' ? 'var(--ink-3)' : t.st === 'Acceso remoto' ? 'var(--ink)' : 'var(--success)' }}>{t.st}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
}

function FeatureTabs() {
  const [active, setActive] = React.useState(0);
  const f = FEATURES[active];
  return (
    <div>
      <div className="features-tabs-nav">
        {FEATURES.map((feat, i) => (
          <button key={feat.num} className={'ftab' + (i === active ? ' active' : '')} onClick={() => setActive(i)}>
            <span className="ftab-num">/{feat.num}</span>
            <span>{feat.name}</span>
          </button>
        ))}
      </div>
      <div className="feature-panel" key={active}>
        <div className="feature-panel-info">
          <h3>{f.title}</h3>
          <p>{f.desc}</p>
          <ul className="feature-bullets">
            {f.bullets.map(([b, body]) => (
              <li key={b}><span><b>{b}</b> {body}</span></li>
            ))}
          </ul>
        </div>
        <div className="feature-mockup">
          <FeatureMockup kind={f.mock} />
        </div>
      </div>
    </div>
  );
}

// ── DTE Calculator ─────────────────────────────────────────
const PACKS = [
  { count: 100,  price: 5.99,   sup: 'Correo' },
  { count: 250,  price: 11.99,  sup: 'Correo' },
  { count: 500,  price: 19.99,  sup: 'WhatsApp directo' },
  { count: 1000, price: 34.99,  sup: 'WhatsApp + prioridad' },
  { count: 2500, price: 69.99,  sup: 'Prioritario 24h' },
  { count: 5000, price: 109.99, sup: 'Prioritario 24h' },
];

// volume slider — non-linear mapping for smoother UX
const VOL_POINTS = [10, 25, 50, 100, 200, 350, 500, 750, 1000, 1500, 2000, 3500, 5000, 7500, 10000];

function recommendPack(monthlyVol) {
  // pick smallest pack >= volume; else biggest
  for (const p of PACKS) if (p.count >= monthlyVol) return p;
  return PACKS[PACKS.length - 1];
}

function DTECalculator() {
  const [sliderIdx, setSliderIdx] = React.useState(7); // 750/mo default
  const monthlyVol = VOL_POINTS[sliderIdx];
  const rec = recommendPack(monthlyVol);
  const costPerDte = rec.price / rec.count;
  // competitor reference cost: assume $0.08/DTE typical SaaS
  const competitorMonthly = monthlyVol * 0.08;
  const polarisMonthly = monthlyVol * costPerDte;
  const savings = Math.max(0, competitorMonthly - polarisMonthly);

  return (
    <div className="calc-wrap">
      <div className="calc-input-card">
        <h3>¿Cuántos DTE <em>facturás al mes?</em></h3>
        <p style={{ fontSize: 14, color: 'var(--ink-2)', marginBottom: 28 }}>
          Movemos la perilla y te decimos el paquete con el costo por DTE más bajo. Sin compromiso, sin vencimiento.
        </p>

        <span className="kicker">Volumen mensual estimado</span>
        <div className="calc-volume-display">
          <span className="calc-volume-num">{monthlyVol.toLocaleString('es-SV')}</span>
          <span className="calc-volume-unit">DTE / mes</span>
        </div>

        <div className="calc-slider-track">
          <div className="calc-slider-fill" style={{ width: `${(sliderIdx / (VOL_POINTS.length - 1)) * 100}%` }} />
          <input
            type="range"
            min="0"
            max={VOL_POINTS.length - 1}
            value={sliderIdx}
            onChange={(e) => setSliderIdx(parseInt(e.target.value))}
            className="calc-slider-input"
            aria-label="Volumen mensual"
          />
        </div>
        <div className="calc-ticks">
          <span>10</span><span>500</span><span>2K</span><span>5K</span><span>10K</span>
        </div>

        <div style={{ marginTop: 32, paddingTop: 24, borderTop: '1px solid var(--line)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
          <div>
            <span className="kicker">Costo por DTE</span>
            <div className="italic-serif" style={{ fontSize: 28, marginTop: 4 }}>${costPerDte.toFixed(3)}</div>
          </div>
          <div>
            <span className="kicker">Mes estimado</span>
            <div className="italic-serif" style={{ fontSize: 28, marginTop: 4, color: 'var(--accent)' }}>${polarisMonthly.toFixed(2)}</div>
          </div>
        </div>
      </div>

      <div className="calc-summary-card">
        <span className="label">Te recomendamos</span>
        <div className="calc-recommendation">
          <div className="name">Pack <b>{rec.count.toLocaleString('es-SV')}</b></div>
          <div className="desc">${rec.price.toFixed(2)} por paquete · Soporte {rec.sup.toLowerCase()}.</div>
        </div>

        <div className="calc-price-row">
          <div>
            <span className="label">Vs. competencia</span>
            <div className="val">${competitorMonthly.toFixed(0)}<span className="small">/mes ref.</span></div>
          </div>
          <div>
            <span className="label">Con Polaris Ent.</span>
            <div className="val">${polarisMonthly.toFixed(0)}<span className="small">/mes</span></div>
          </div>
        </div>

        <div className="calc-savings">
          <span>Ahorrás cada mes</span>
          <span className="big">${savings.toFixed(0)}</span>
        </div>

        <a href="#contacto" className="calc-cta">Hablemos del pack {rec.count.toLocaleString('es-SV')} →</a>
      </div>
    </div>
  );
}

// ── Module Builder ─────────────────────────────────────────

const MODULES_DATA = [
  // Tier 1 — Esenciales
  { id: 'pos',       tier: 1, name: 'Caja POS',              price: 20, desc: 'Ventas rápidas, scanner, atajos de teclado y multi-pago.',      deps: [] },
  { id: 'crm',       tier: 1, name: 'Clientes / CRM',         price: 12, desc: 'Historial de compras, segmentos y descuentos por categoría.',   deps: [] },
  { id: 'reportes',  tier: 1, name: 'Reportes ejecutivos',    price: 12, desc: 'Dashboards en tiempo real exportables a PDF y Excel.',          deps: ['pos'] },
  // Tier 2 — Operacional
  { id: 'inventario',tier: 2, name: 'Inventario + Kardex',    price: 20, desc: 'Multi-bodega, costos PEPS/promedio, conteo físico móvil.',      deps: [] },
  { id: 'compras',   tier: 2, name: 'Compras + Proveedores',  price: 18, desc: 'Órdenes de compra, recepción y cuentas por pagar.',             deps: ['inventario'] },
  { id: 'cxc',       tier: 2, name: 'Cuentas por cobrar',     price: 15, desc: 'Antigüedad de saldos, abonos parciales y recordatorios.',       deps: ['crm'] },
  // Tier 3 — Avanzado
  { id: 'planilla',  tier: 3, name: 'Empleados + Planilla SV',price: 38, desc: 'ISSS, AFP, ISR automático. Boletas y constancias mensuales.',   deps: [] },
  { id: 'api',       tier: 3, name: 'API & Conectores',       price: 45, desc: 'Integrá tu e-commerce, contabilidad o sistema heredado.',       deps: [] },
];

const BUNDLES_DATA = [
  { id: 'starter',    name: 'Starter',     color: 'default', desc: 'Para empezar',      modules: ['pos'] },
  { id: 'tienda',     name: 'Tienda',      color: 'accent',  desc: 'La tienda completa', modules: ['pos', 'inventario', 'crm'] },
  { id: 'operaciones',name: 'Operaciones', color: 'warm',    desc: 'Control total',      modules: ['pos', 'inventario', 'compras', 'cxc', 'reportes'] },
  { id: 'empresa',    name: 'Empresa',     color: 'dark',    desc: 'Para crecer',        modules: ['pos', 'inventario', 'compras', 'cxc', 'planilla', 'reportes'] },
];

function getBundlePrice(moduleIds) {
  const raw = moduleIds.reduce((s, id) => {
    const m = MODULES_DATA.find((x) => x.id === id);
    return s + (m ? m.price : 0);
  }, 0);
  const disc = moduleIds.length >= 5 ? 0.15 : moduleIds.length >= 3 ? 0.10 : 0;
  return { raw, disc: Math.round(raw * disc), final: Math.round(raw * (1 - disc)) };
}

function ModuleCard({ mod, isSelected, onToggle }) {
  const depNames = mod.deps.map((d) => MODULES_DATA.find((x) => x.id === d)?.name).filter(Boolean);
  return (
    <div className={`mb-module-card${isSelected ? ' selected' : ''}`} onClick={() => onToggle(mod.id)} role="checkbox" aria-checked={isSelected} tabIndex={0} onKeyDown={(e) => e.key === ' ' && onToggle(mod.id)}>
      <div className="mb-mod-check">{isSelected ? '✓' : ''}</div>
      <div className="mb-mod-info">
        <div className="mb-mod-name">{mod.name}</div>
        <div className="mb-mod-desc">{mod.desc}</div>
        {mod.deps.length > 0 && <div className="mb-mod-deps">requiere: {depNames.join(', ')}</div>}
      </div>
      <div className="mb-mod-price">${mod.price}<span>/mes</span></div>
    </div>
  );
}

function ModuleBuilder() {
  const [selected, setSelected] = React.useState(new Set());
  const [sucursales, setSucursales] = React.useState(1);

  const toggle = (id) => {
    const mod = MODULES_DATA.find((m) => m.id === id);
    const next = new Set(selected);
    if (next.has(id)) {
      next.delete(id);
      // remove modules that depend on this
      MODULES_DATA.forEach((m) => { if (m.deps.includes(id)) next.delete(m.id); });
    } else {
      next.add(id);
      // auto-add dependencies
      mod.deps.forEach((d) => next.add(d));
    }
    setSelected(next);
  };

  const applyBundle = (bundle) => setSelected(new Set(bundle.modules));

  const activeBundleId = BUNDLES_DATA.find((b) => {
    const bs = new Set(b.modules);
    return bs.size === selected.size && [...bs].every((m) => selected.has(m));
  })?.id;

  const rawTotal  = [...selected].reduce((s, id) => s + (MODULES_DATA.find((m) => m.id === id)?.price || 0), 0);
  const discPct   = selected.size >= 5 ? 15 : selected.size >= 3 ? 10 : 0;
  const discAmt   = Math.round(rawTotal * discPct / 100);
  const extraBranches = Math.max(0, sucursales - 1);
  const branchCost    = extraBranches * 15;
  const finalTotal    = rawTotal - discAmt + branchCost;

  const tiers = [
    { label: 'Tier 1 — Esenciales', num: 1 },
    { label: 'Tier 2 — Operacional', num: 2 },
    { label: 'Tier 3 — Avanzado', num: 3 },
  ];

  return (
    <div className="module-builder">

      {/* Bundle presets */}
      <div className="mb-bundles">
        {BUNDLES_DATA.map((b) => {
          const { final, disc } = getBundlePrice(b.modules);
          const isActive = activeBundleId === b.id;
          return (
            <button key={b.id} className={`mb-bundle-btn mb-bundle-${b.color}${isActive ? ' active' : ''}`} onClick={() => applyBundle(b)}>
              {disc > 0 && <span className="mb-bundle-badge">−{b.modules.length >= 5 ? 15 : 10}%</span>}
              <span className="mb-bundle-name">{b.name}</span>
              <span className="mb-bundle-desc">{b.desc}</span>
              <span className="mb-bundle-price">${final}<small>/mes</small></span>
              {disc > 0 && <span className="mb-bundle-save">ahorrás ${disc} vs individual</span>}
            </button>
          );
        })}
      </div>

      <div className="mb-main">
        {/* Left: module list */}
        <div className="mb-modules">
          {tiers.map((tier) => (
            <React.Fragment key={tier.num}>
              <div className="mb-tier-label">{tier.label}</div>
              {MODULES_DATA.filter((m) => m.tier === tier.num).map((mod) => (
                <ModuleCard key={mod.id} mod={mod} isSelected={selected.has(mod.id)} onToggle={toggle} />
              ))}
            </React.Fragment>
          ))}

          {/* Multi-sucursal */}
          <div className="mb-tier-label">Multi-sucursal</div>
          <div className="mb-sucursal-card">
            <div>
              <div className="mb-suc-name">Sucursales adicionales</div>
              <div className="mb-suc-price">$15/mes por sucursal</div>
              <div className="mb-suc-note">Primera sucursal incluida · precio cliente activo</div>
            </div>
            <div className="mb-suc-counter">
              <button onClick={() => setSucursales((v) => Math.max(1, v - 1))}>−</button>
              <span>{sucursales}</span>
              <button onClick={() => setSucursales((v) => Math.min(10, v + 1))}>+</button>
            </div>
          </div>
        </div>

        {/* Right: summary */}
        <div className="mb-summary">
          <div className="mb-sum-label">Resumen del plan</div>

          {selected.size === 0 && extraBranches === 0 ? (
            <div className="mb-sum-empty">Elegí un bundle o seleccioná módulos</div>
          ) : (
            <>
              <div className="mb-sum-lines">
                {[...selected].map((id) => {
                  const mod = MODULES_DATA.find((m) => m.id === id);
                  return mod ? (
                    <div className="mb-sum-line" key={id}>
                      <span>{mod.name}</span>
                      <span>${mod.price}/mes</span>
                    </div>
                  ) : null;
                })}
                {extraBranches > 0 && (
                  <div className="mb-sum-line">
                    <span>{extraBranches} sucursal{extraBranches > 1 ? 'es' : ''} extra</span>
                    <span>${branchCost}/mes</span>
                  </div>
                )}
              </div>

              {discPct > 0 && (
                <div className="mb-sum-discount">
                  <span>Descuento bundle ({discPct}%)</span>
                  <span>−${discAmt}/mes</span>
                </div>
              )}

              <div className="mb-sum-total">
                <span>Add-ons / mes</span>
                <div className="mb-sum-total-num">${finalTotal}<small>/mes</small></div>
              </div>
              <div className="mb-sum-note">+ packs DTE según tu volumen mensual</div>

              <a href="#contacto" className="mb-sum-cta">Cotizar este plan →</a>

              {discPct === 0 && selected.size >= 2 && selected.size < 3 && (
                <div className="mb-upsell">
                  Agregá 1 módulo más y ahorrás 10% en todo el plan
                </div>
              )}
              {discPct === 10 && selected.size < 5 && (
                <div className="mb-upsell">
                  Con {5 - selected.size} módulo{5 - selected.size > 1 ? 's' : ''} más subís al 15% de descuento
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// Export
Object.assign(window, {
  IndustriesToggle, FeatureTabs, DTECalculator, ModuleBuilder,
});
