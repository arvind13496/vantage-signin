/* ============================================================================
   Vantage White-Label Theme — shared model for all pages.
   90/10 split: Foundation (Vantage-owned neutrals + semantics) + Brand slot.
   Brand slot = ONE tenant colour (primary) + ONE optional accent. No secondary.
   ============================================================================ */
(function (global) {
  const WHITE = '#FFFFFF';
  const DARK  = '#0B1117';

  const hexToRgb = hex => { const h = hex.replace('#',''); return [parseInt(h.slice(0,2),16), parseInt(h.slice(2,4),16), parseInt(h.slice(4,6),16)]; };
  const relLum = hex => { const [r,g,b] = hexToRgb(hex).map(v => { const c = v/255; return c <= 0.03928 ? c/12.92 : Math.pow((c+0.055)/1.055, 2.4); }); return 0.2126*r + 0.7152*g + 0.0722*b; };
  const contrast = (fg,bg) => { const l1 = relLum(fg), l2 = relLum(bg); const [hi,lo] = l1>l2 ? [l1,l2] : [l2,l1]; return (hi+0.05)/(lo+0.05); };
  const onColor = bg => contrast(WHITE,bg) >= contrast(DARK,bg) ? WHITE : DARK;
  const rgba = (hex,a) => { const [r,g,b] = hexToRgb(hex); return `rgba(${r},${g},${b},${a})`; };
  /* Blend `hex` over `base` at `ratio` (0..1 of hex), return a concrete hex —
     lets us run live WCAG math on muted/tinted fills, not just hand them to CSS. */
  const mixHex = (hex, ratio, base='#FFFFFF') => {
    const a = hexToRgb(hex), b = hexToRgb(base);
    return '#' + a.map((v,i)=> Math.round(v*ratio + b[i]*(1-ratio)).toString(16).padStart(2,'0')).join('');
  };
  function grade(r){
    if (r>=7.0) return { label:'AAA',  bg:'#0B1520', fg:'#fff', color:'#0B7A3B' };
    if (r>=4.5) return { label:'AA',   bg:'#3A4A5A', fg:'#fff', color:'#3A4A5A' };
    if (r>=3.0) return { label:'AA L', bg:'#3A4A5A', fg:'#fff', color:'#9A6700' };
    return       { label:'FAIL', bg:'#BE2A2A', fg:'#fff', color:'#BE2A2A' };
  }

  /* ---- 4 brand-agnostic foundations (Vantage owns these — 90%) ---- */
  /* Each foundation also carries a dedicated dark `sidebar` panel colour
     (decoupled from the light content surface) — the darker side panel. */
  const FOUNDATIONS = {
    Slate: {
      name:'Slate', reference:'Stripe-grade cool neutral', isDark:false,
      canvas:'#FFFFFF', surface:'#F6F8FA', surfaceAlt:'#EDF1F6', hairline:'#E2E8F0',
      ink:'#0B1520', inkMuted:'#5B6B7B', inkSubtle:'#94A2B0', sidebar:'#0E1726',
      success:'#15803D', warning:'#B45309', error:'#BE2A2A' },
    Porcelain: {
      name:'Porcelain', reference:'Mercury-style warmth', isDark:false,
      canvas:'#FFFFFF', surface:'#FAF9F6', surfaceAlt:'#F2F0EA', hairline:'#E9E5DD',
      ink:'#1A1714', inkMuted:'#6E665C', inkSubtle:'#A39C90', sidebar:'#211C17',
      success:'#2F7A43', warning:'#9A6700', error:'#B23A2A' },
    Graphite: {
      name:'Graphite', reference:'Dark-mode-first, data-dense', isDark:true,
      canvas:'#0D1117', surface:'#161C24', surfaceAlt:'#1E2630', hairline:'#2B3441',
      ink:'#E8EEF4', inkMuted:'#93A1AF', inkSubtle:'#647281', sidebar:'#090D13',
      success:'#3FB37F', warning:'#E0A33E', error:'#F06A6A' },
    Mist: {
      name:'Mist', reference:'Ramp / Linear airy light', isDark:false,
      canvas:'#FCFDFE', surface:'#F1F5F9', surfaceAlt:'#E4EBF2', hairline:'#DCE4EC',
      ink:'#0F1B2D', inkMuted:'#5A6675', inkSubtle:'#8A95A3', sidebar:'#0F1B2D',
      success:'#15803D', warning:'#B45309', error:'#BE2A2A' },
    Blush: {
      name:'Blush', reference:'Cool ink on soft blush-white', isDark:false,
      canvas:'#FFF0FA', surface:'#FBE6F2', surfaceAlt:'#F4DAEA', hairline:'#EFD2E4',
      ink:'#011526', inkMuted:'#5D5A66', inkSubtle:'#988E97', sidebar:'#011526',
      success:'#15803D', warning:'#9A6700', error:'#BE2A2A' },
    Pine: {
      name:'Pine', reference:'Forest green on warm cream', isDark:false,
      canvas:'#EBE8D7', surface:'#F2EFE2', surfaceAlt:'#E0DCC8', hairline:'#D5D0BA',
      ink:'#1C3F39', inkMuted:'#5C6B63', inkSubtle:'#8A968C', sidebar:'#1C3F39',
      success:'#2F6F3E', warning:'#92670E', error:'#9A3528' },
    Indigo: {
      name:'Indigo', reference:'Deep indigo, data-dense dark', isDark:true,
      canvas:'#080D2D', surface:'#141A47', surfaceAlt:'#2E3191', hairline:'#343B7A',
      ink:'#EAEBFB', inkMuted:'#A9AEE0', inkSubtle:'#7077B5', sidebar:'#060A22',
      success:'#3FB37F', warning:'#E0A33E', error:'#F06A6A' },
  };

  /* ---- Vantage platform identity — NOT a tenant; used for shell chrome only ---- */
  const PLATFORM = { name:'Vantage', initial:'V', primary:'#083344', accent:'#36C5A6' };

  /* ---- Sample tenant brand kits — ONE colour + ONE accent (no secondary) ---- */
  const BRANDS = {
    salesforce: { key:'salesforce', name:'Salesforce',        kind:'Sample client', initial:'S', primary:'#0176D3', accent:'#FE9339' },
    slack:      { key:'slack',      name:'Slack',             kind:'Sample client', initial:'S', primary:'#4A154B', accent:'#36C5F0' },
    lighthouse: { key:'lighthouse', name:'Lighthouse Canton', kind:'Sample client', initial:'L', primary:'#1A2B4A', accent:'#C9A227' },
  };

  /* A neutral, tenant-agnostic light grey shell panel derived from the
     foundation's own ink — keeps the temperature (cool/warm) without any brand. */
  const lightShell = f => mixHex(f.ink, f.isDark ? 0.16 : 0.05, f.canvas);

  /* ---- Resolve {foundation, brand, opts} into the CSS var contract ----
     opts.brandMode  : 'forward' (exact brand) | 'shell' (brand→accents, grey nav)
                       | 'harmonized' (brand muted to a ~38% wash, light+dark)
     opts.sidebarStyle: 'dark' (default panel) | 'light' (grey shell + drop shadow) */
  function vars(foundationKey, brand, opts) {
    opts = opts || {};
    const brandMode    = opts.brandMode    || 'forward';
    const sidebarStyle = opts.sidebarStyle || 'dark';
    const f = FOUNDATIONS[foundationKey] || FOUNDATIONS.Slate;
    const primary = brand.primary;
    const accent  = brand.accent || primary;
    const harmonized = brandMode === 'harmonized';

    /* Brand fill for buttons/CTAs/active.
       forward & shell -> EXACT primary (never toned down).
       harmonized      -> ~38% wash over the canvas, computed as a real hex
                          so its on-colour is chosen by live WCAG, not guessed. */
    const brandFill   = harmonized ? mixHex(primary, 0.38, f.canvas) : primary;
    const onBrandFill = onColor(brandFill);

    /* Side panel. dark = the foundation's panel; light = neutral grey shell
       lifted off the canvas with a drop shadow (depth, tenant-agnostic). */
    const isLight = sidebarStyle === 'light';
    const sb   = isLight ? lightShell(f) : f.sidebar;
    const onSb = onColor(sb);
    const sbShadow = !isLight ? 'none'
      : (f.isDark ? '2px 0 18px rgba(0,0,0,0.55), inset -1px 0 0 rgba(255,255,255,0.05)'
                  : '2px 0 18px rgba(16,24,40,0.10), inset -1px 0 0 rgba(16,24,40,0.04)');

    /* Active nav pill. shell mode tints with INK (grey, brand-agnostic);
       otherwise tints with the brand. Computed as hex for correct on-colour. */
    const activeSrc  = brandMode === 'shell' ? f.ink : primary;
    const activeWt   = isLight ? (harmonized ? 0.10 : 0.13) : 0.22;
    const sidebarActive = mixHex(activeSrc, activeWt, sb);

    return {
      '--canvas': f.canvas,
      '--surface': f.surface,
      '--surface-alt': f.surfaceAlt,
      '--hairline': f.hairline,
      '--ink': f.ink,
      '--ink-muted': f.inkMuted,
      '--ink-subtle': f.inkSubtle,
      '--success': f.success,
      '--warning': f.warning,
      '--error': f.error,
      '--on-error': onColor(f.error),
      '--on-success': onColor(f.success),
      /* side panel — dark or light grey shell */
      '--sidebar': sb,
      '--sidebar-shadow': sbShadow,
      '--on-sidebar': onSb,
      '--on-sidebar-muted': rgba(onSb, 0.62),
      '--on-sidebar-subtle': rgba(onSb, 0.42),
      '--sidebar-hairline': rgba(onSb, 0.12),
      '--sidebar-active': sidebarActive,
      '--on-sidebar-active': onColor(sidebarActive),
      '--sidebar-indicator': accent,
      /* brand fill (exact, or muted wash in harmonized) */
      '--brand': brandFill,
      '--on-brand': onBrandFill,
      '--brand-pure': primary,                 /* always the untouched brand hex */
      '--brand-weak': rgba(primary, harmonized ? 0.16 : 0.10),
      '--brand-soft': rgba(primary, 0.06),
      '--accent': accent,
      '--on-accent': onColor(accent),
    };
  }

  function apply(styleDecl, foundationKey, brand, opts) {
    const v = vars(foundationKey, brand, opts);
    Object.entries(v).forEach(([k, val]) => styleDecl.setProperty(k, val));
    return v;
  }

  /* Per-mode defaults for the 3 shareable URLs (?mode=forward|shell|harmonized) */
  const MODES = {
    forward:    { brandMode:'forward',    sidebarStyle:'dark',  foundation:'Slate',
                  label:'Brand-Forward',  note:'Tenant primary at full strength — exact-hex buttons.' },
    shell:      { brandMode:'shell',      sidebarStyle:'light', foundation:'Slate',
                  label:'Neutral Shell',  note:'Light grey shell + drop shadow; brand kept to accents.' },
    harmonized: { brandMode:'harmonized', sidebarStyle:'light', foundation:'Slate',
                  label:'Harmonized',     note:'Tenant brand muted to a ~38% wash. Light + dark.' },
  };

  /* Read ?mode=&foundation=&sidebar=&brand= (or &primary=&accent=&tenant=) */
  function fromUrl() {
    const q = new URLSearchParams(location.search);
    const mode = MODES[q.get('mode')] ? q.get('mode') : 'forward';
    const m = MODES[mode];
    const foundation = FOUNDATIONS[q.get('foundation')] ? q.get('foundation') : m.foundation;
    const sidebarStyle = (q.get('sidebar') === 'dark' || q.get('sidebar') === 'light')
      ? q.get('sidebar') : m.sidebarStyle;
    let brand;
    if (q.get('primary')) {
      brand = { name: q.get('tenant') || 'Custom', initial: (q.get('tenant')||'C')[0].toUpperCase(),
                primary: q.get('primary'), accent: q.get('accent') || null };
    } else {
      brand = BRANDS[q.get('brand')] || BRANDS.salesforce;
    }
    return { mode, foundation, brand, opts: { brandMode: m.brandMode, sidebarStyle } };
  }

  global.VantageTheme = { WHITE, DARK, PLATFORM, FOUNDATIONS, BRANDS, MODES, contrast, onColor, grade, rgba, mixHex, vars, apply, fromUrl };
})(window);
