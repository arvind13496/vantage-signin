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
  function grade(r){
    if (r>=7.0) return { label:'AAA',  bg:'#0B1520', fg:'#fff', color:'#0B7A3B' };
    if (r>=4.5) return { label:'AA',   bg:'#3A4A5A', fg:'#fff', color:'#3A4A5A' };
    if (r>=3.0) return { label:'AA L', bg:'#3A4A5A', fg:'#fff', color:'#9A6700' };
    return       { label:'FAIL', bg:'#BE2A2A', fg:'#fff', color:'#BE2A2A' };
  }

  /* ---- 4 brand-agnostic foundations (Vantage owns these — 90%) ---- */
  const FOUNDATIONS = {
    Slate: {
      name:'Slate', reference:'Stripe-grade cool neutral', isDark:false,
      canvas:'#FFFFFF', surface:'#F6F8FA', surfaceAlt:'#EDF1F6', hairline:'#E2E8F0',
      ink:'#0B1520', inkMuted:'#5B6B7B', inkSubtle:'#94A2B0',
      success:'#15803D', warning:'#B45309', error:'#BE2A2A' },
    Porcelain: {
      name:'Porcelain', reference:'Mercury-style warmth', isDark:false,
      canvas:'#FFFFFF', surface:'#FAF9F6', surfaceAlt:'#F2F0EA', hairline:'#E9E5DD',
      ink:'#1A1714', inkMuted:'#6E665C', inkSubtle:'#A39C90',
      success:'#2F7A43', warning:'#9A6700', error:'#B23A2A' },
    Graphite: {
      name:'Graphite', reference:'Dark-mode-first, data-dense', isDark:true,
      canvas:'#0D1117', surface:'#161C24', surfaceAlt:'#1E2630', hairline:'#2B3441',
      ink:'#E8EEF4', inkMuted:'#93A1AF', inkSubtle:'#647281',
      success:'#3FB37F', warning:'#E0A33E', error:'#F06A6A' },
    Mist: {
      name:'Mist', reference:'Ramp / Linear airy light', isDark:false,
      canvas:'#FCFDFE', surface:'#F1F5F9', surfaceAlt:'#E4EBF2', hairline:'#DCE4EC',
      ink:'#0F1B2D', inkMuted:'#5A6675', inkSubtle:'#8A95A3',
      success:'#15803D', warning:'#B45309', error:'#BE2A2A' },
  };

  /* ---- Sample tenant brand kits — ONE colour + ONE accent (no secondary) ---- */
  const BRANDS = {
    vantage:    { key:'vantage',    name:'Vantage',           kind:'House default', initial:'V', primary:'#083344', accent:'#36C5A6' },
    salesforce: { key:'salesforce', name:'Salesforce',        kind:'Sample client', initial:'S', primary:'#0176D3', accent:'#FE9339' },
    slack:      { key:'slack',      name:'Slack',             kind:'Sample client', initial:'S', primary:'#4A154B', accent:'#36C5F0' },
    lighthouse: { key:'lighthouse', name:'Lighthouse Canton', kind:'Sample client', initial:'L', primary:'#1A2B4A', accent:'#C9A227' },
  };

  /* ---- Resolve a {foundation, brand:{primary,accent}} into the CSS var contract ---- */
  function vars(foundationKey, brand) {
    const f = FOUNDATIONS[foundationKey] || FOUNDATIONS.Slate;
    const primary = brand.primary;
    const accent  = brand.accent || primary;
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
      '--brand': primary,
      '--on-brand': onColor(primary),
      '--brand-weak': rgba(primary, 0.10),
      '--brand-soft': rgba(primary, 0.06),
      '--accent': accent,
      '--on-accent': onColor(accent),
    };
  }

  function apply(styleDecl, foundationKey, brand) {
    const v = vars(foundationKey, brand);
    Object.entries(v).forEach(([k, val]) => styleDecl.setProperty(k, val));
    return v;
  }

  /* Read ?foundation=Slate&brand=slack (or &primary=%23xxxxxx&accent=%23yyyyyy) */
  function fromUrl() {
    const q = new URLSearchParams(location.search);
    const foundation = FOUNDATIONS[q.get('foundation')] ? q.get('foundation') : 'Slate';
    let brand;
    if (q.get('primary')) {
      brand = { name: q.get('tenant') || 'Custom', initial: (q.get('tenant')||'C')[0].toUpperCase(),
                primary: q.get('primary'), accent: q.get('accent') || null };
    } else {
      brand = BRANDS[q.get('brand')] || BRANDS.vantage;
    }
    return { foundation, brand };
  }

  global.VantageTheme = { WHITE, DARK, FOUNDATIONS, BRANDS, contrast, onColor, grade, rgba, vars, apply, fromUrl };
})(window);
