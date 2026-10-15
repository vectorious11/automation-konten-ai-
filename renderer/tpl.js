// Scalewise.id slide template for satori (object tree, no JSX).
const NAVY = '#0B1530', GOLD = '#F9BC15', SOFT = '#9AA5C8', DIM = '#8A94B8', CARD = '#1B2A5C';
const h = (type, style, ...kids) => ({ type, props: { style: { display: 'flex', ...style }, children: kids.flat().filter((k) => k !== null && k !== undefined && k !== false) } });
const txt = (style, ...kids) => ({ type: 'div', props: { style: { display: 'flex', flexWrap: 'wrap', ...style }, children: kids.flat() } });

// "==gold== **bold**" -> array of inline spans, split to words so wrapping works
function rich(t, base = {}) {
  // tokenise whole string into words with style; one margin between words (no double spaces)
  const toks = [];
  const re = /(==.+?==|\*\*.+?\*\*)/g;
  String(t == null ? '' : t).split(re).forEach((part) => {
    if (!part) return;
    let st = { ...base }, x = part;
    if (/^==.+==$/.test(part)) { x = part.slice(2, -2); st = { ...base, color: GOLD }; }
    else if (/^\*\*.+\*\*$/.test(part)) { x = part.slice(2, -2); st = { ...base, fontWeight: 700 }; }
    const m = x.match(/\S+/g) || [];
    m.forEach((w) => toks.push({ w, st }));
  });
  const gap = Math.round((base.fontSize || 40) * 0.26);
  return toks.map((k, i) => ({ type: 'span', props: { style: { ...k.st, marginRight: (i < toks.length - 1 && !/^[,.;:!?)\u201d\u2019%]/.test(toks[i + 1].w)) ? gap : 0 }, children: k.w } }));
}
const R = (t, size, extra = {}) => txt({ fontSize: size, lineHeight: 1.25, color: '#fff', ...extra }, rich(t, { fontSize: size, fontFamily: extra.fontFamily || 'Carlito', fontStyle: extra.fontStyle || 'normal', color: extra.color || '#fff', fontWeight: extra.fontWeight || 400 }));

function build(s, n, total, logoUri, k = 1) {
  const z = (v) => Math.round(v * k);
  const L = s.layout || 'numbered';
  const label = s.label ? R(String(s.label).toUpperCase(), z(26), { color: SOFT, fontWeight: 700, letterSpacing: 4, marginBottom: z(20) }) : null;
  const head = (size) => s.headline ? R(s.headline, z(size), { fontWeight: 700, lineHeight: 1.1, marginBottom: z(30) }) : null;
  const foot = s.footer ? R(s.footer, z(s.footer_gold ? 40 : 36), { fontFamily: 'Caladea', fontStyle: 'italic', color: s.footer_gold ? GOLD : SOFT, lineHeight: 1.35, marginTop: z(26) }) : null;
  const spacer = h('div', { flexGrow: 1 });
  let main = [];
  if (L === 'hook') {
    main = [h('div', { flexDirection: 'column', flexGrow: 1, justifyContent: 'center', paddingBottom: z(120) },
      R(s.headline, z(88), { fontWeight: 700, lineHeight: 1.1 }),
      s.subtitle ? R(s.subtitle, z(48), { fontFamily: 'Caladea', fontStyle: 'italic', color: GOLD, lineHeight: 1.25, marginTop: z(44) }) : null)];
    if (total > 1 && n === 1) main.push(h('div', { position: 'absolute', left: 0, bottom: 0, alignItems: 'center', fontSize: 34, color: SOFT }, R('Geser', 34, { color: SOFT }), h('div', { marginLeft: 14, color: GOLD, fontSize: 40, fontWeight: 700 }, '→')));
  } else if (L === 'quote') {
    main = [label, h('div', { background: CARD, borderRadius: 32, padding: `${z(44)}px ${z(48)}px`, marginBottom: z(36) }, R(s.quote, z(46))),
      R(s.headline, z(76), { fontWeight: 700, color: GOLD, lineHeight: 1.1, marginBottom: z(30) }),
      s.body ? R(s.body, z(42)) : null, spacer, foot];
  } else if (L === 'numbered' || L === 'checklist') {
    const cards = (s.items || []).map((it, i) => h('div', { background: CARD, borderRadius: 30, padding: `${z(26)}px ${z(36)}px`, alignItems: 'center', minHeight: z(120), marginBottom: z(22) },
      h('div', { width: z(56), flexShrink: 0, flexGrow: 0, marginRight: z(46), justifyContent: 'center', fontFamily: 'Caladea', fontWeight: 700, color: GOLD, fontSize: z(68) }, String(i + 1)),
      h('div', { flexGrow: 1, flexShrink: 1 }, R(typeof it === 'string' ? it : it.t, z(42)))));
    main = [label, head(72), s.body ? R(s.body, z(42), { marginBottom: z(26) }) : null, h('div', { flexDirection: 'column' }, cards),
      s.closing ? R(s.closing, z(40), { marginTop: z(12) }) : null, spacer, foot];
  } else if (L === 'compare') {
    const col = (c, hi) => h('div', { flexDirection: 'column', flexGrow: 1, flexBasis: 0, borderRadius: 32, padding: `${z(44)}px ${z(38)}px`, minHeight: z(820), background: hi ? CARD : '#14204A', border: hi ? `3px solid ${GOLD}` : '2px solid #3A4A80' },
      R(String((c && c.title) || '').toUpperCase(), z(26), { fontWeight: 700, letterSpacing: 4, color: hi ? GOLD : DIM, marginBottom: z(32) }),
      ((c && c.items) || []).map((x) => R(x, z(42), { color: hi ? '#fff' : DIM, marginBottom: z(34) })));
    main = [label, head(72), h('div', { gap: 34 }, col(s.left, false), col(s.right, true)), spacer, foot];
  } else if (L === 'timeline') {
    const rows = (s.rows || []).map((r, i, a) => h('div', { alignItems: 'center', marginBottom: z(30) },
      h('div', { width: z(220), minHeight: z(100), borderRadius: 30, justifyContent: 'center', alignItems: 'center', marginRight: z(36), flexShrink: 0, background: r.outline ? CARD : GOLD, border: r.outline ? `3px solid ${GOLD}` : 'none', color: r.outline ? GOLD : NAVY, fontWeight: 700, fontSize: z(38) }, String(r.tag)),
      h('div', { flexGrow: 1, flexShrink: 1 }, R(r.text, z(40)))));
    main = [label, head(72), h('div', { flexDirection: 'column' }, rows), spacer, foot];
  } else if (L === 'cta') {
    main = [h('div', { flexDirection: 'column', flexGrow: 1, justifyContent: 'center', paddingBottom: z(30) },
      R(s.headline, z(80), { fontWeight: 700, lineHeight: 1.1 }),
      h('div', { height: 4, background: GOLD, marginTop: z(44), marginBottom: z(46), width: '100%' }),
      s.cta_title ? R(s.cta_title, z(62), { fontFamily: 'Caladea', fontWeight: 700, color: GOLD, lineHeight: 1.15, marginBottom: z(24) }) : null,
      s.body ? R(s.body, z(42)) : null,
      s.link ? R(s.link, z(36), { color: SOFT, marginTop: z(36) }) : null),
      R(s.footer || 'More Scale, More Wise.', z(48), { fontFamily: 'Caladea', fontStyle: 'italic', color: GOLD })];
  }
  const header = h('div', { justifyContent: 'space-between', alignItems: 'flex-start', height: 84, flexShrink: 0 },
    h('div', { alignItems: 'center' },
      { type: 'img', props: { src: logoUri, width: 72, height: 72, style: { width: 72, height: 72, borderRadius: 18, marginRight: 16 } } },
      h('div', { flexDirection: 'column' },
        h('div', { fontSize: 34, color: '#fff', lineHeight: 1.05 }, h('span', { fontWeight: 700 }, 'Scalewise'), h('span', {}, '.id')),
        h('div', { fontSize: 18, color: GOLD, fontWeight: 700, marginTop: 4 }, 'for Brand Partner'))),
    h('div', { fontFamily: 'Caladea', fontStyle: 'italic', fontSize: 26, color: SOFT, marginTop: 14, letterSpacing: 2 }, `${n} / ${total}`));
  return h('div', { width: 1080, height: 1350, flexDirection: 'column', paddingTop: 130, paddingBottom: 130, paddingLeft: 80, paddingRight: 80, fontFamily: 'Carlito', color: '#fff', backgroundImage: 'linear-gradient(160deg, #0B1530, #12214F)' },
    header, h('div', { flexDirection: 'column', flexGrow: 1, paddingTop: 40, minHeight: 0 }, main));
}
module.exports = { build };
