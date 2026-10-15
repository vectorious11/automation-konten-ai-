// Scalewise.id carousel templates. buildSlideHtml(slide, n, total, logoB64) -> full HTML (1080x1350)
function buildSlideHtml(s, n, total, logoB64) {
  const esc = (t) => String(t == null ? '' : t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const fmt = (t) => esc(t).replace(/==(.+?)==/g, '<span class="g">$1</span>').replace(/\*\*(.+?)\*\*/g, '<b>$1</b>').replace(/\n/g, '<br>');
  const L = s.layout || 'numbered';
  const label = s.label ? `<div class="label">${fmt(s.label)}</div>` : '';
  const head = (cls) => s.headline ? `<h1 class="${cls || ''}">${fmt(s.headline)}</h1>` : '';
  const sub = s.subtitle ? `<div class="sub">${fmt(s.subtitle)}</div>` : '';
  const body = s.body ? `<p class="body">${fmt(s.body)}</p>` : '';
  const foot = s.footer ? `<div class="foot ${s.footer_gold ? 'gold' : ''}">${fmt(s.footer)}</div>` : '';
  let main = '';
  if (L === 'hook') {
    main = `<div class="center">${head('hook')}${sub}</div>` + (total > 1 && n === 1 ? `<div class="swipe">Geser <svg width="40" height="22" viewBox="0 0 40 22"><path d="M2 11h34M27 3l9 8-9 8" stroke="#F9BC15" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg></div>` : '');
  } else if (L === 'quote') {
    main = `${label}<div class="bubble">${fmt(s.quote || '')}</div><h2 class="gold big">${fmt(s.headline || '')}</h2>${body}<div class="spacer"></div>${foot}`;
  } else if (L === 'numbered' || L === 'checklist') {
    const items = (s.items || []).map((it, i) => `<div class="card num"><div class="no">${i + 1}</div><div class="ct">${fmt(typeof it === 'string' ? it : it.t)}</div></div>`).join('');
    main = `${label}${head('mid')}${body}<div class="cards">${items}</div>${s.closing ? `<p class="body closing">${fmt(s.closing)}</p>` : ''}<div class="spacer"></div>${foot}`;
  } else if (L === 'compare') {
    const col = (c, cls) => `<div class="col ${cls}"><div class="clabel">${fmt((c && c.title) || '')}</div>${((c && c.items) || []).map((x) => `<p>${fmt(x)}</p>`).join('')}</div>`;
    main = `${label}${head('mid')}<div class="cols">${col(s.left, 'dim')}${col(s.right, 'hi')}</div>${foot}`;
  } else if (L === 'timeline') {
    const rows = (s.rows || []).map((r, i, a) => `<div class="row"><div class="pill ${i === a.length - 1 && r.outline ? 'out' : ''}">${fmt(r.tag)}</div><div class="rt">${fmt(r.text)}</div></div>`).join('');
    main = `${label}${head('mid')}<div class="rows">${rows}</div><div class="spacer"></div>${foot}`;
  } else if (L === 'cta') {
    main = `<div class="ctawrap">${head('hook')}<div class="line"></div><div class="ctah">${fmt(s.cta_title || 'Ngobrol Dulu, Gratis')}</div><p class="body">${fmt(s.body || '')}</p><p class="muted">${fmt(s.link || 'Link in Bio.')}</p></div><div class="more">${fmt(s.footer || 'More Scale, More Wise.')}</div>`;
  }
  const css = `
*{box-sizing:border-box;margin:0;padding:0}
html,body{width:1080px;height:1350px;overflow:hidden}
body{background:linear-gradient(160deg,#0B1530,#12214F);font-family:'Carlito','Calibri',sans-serif;color:#fff;position:relative}
.wrap{position:absolute;inset:0;padding:80px;display:flex;flex-direction:column}
.hdr{display:flex;justify-content:space-between;align-items:flex-start;height:84px;flex:none}
.brand{display:flex;align-items:center;gap:16px}
.logo{width:72px;height:72px;border-radius:18px;overflow:hidden;flex:none}
.logo img{width:72px;height:72px;display:block}
.wm{font-size:34px;line-height:1.05;font-weight:400}.wm b{font-weight:700}
.tag{color:#F9BC15;font-weight:700;font-size:18px;margin-top:4px}
.pg{font-family:'Caladea','Cambria',serif;font-style:italic;font-size:26px;color:#9AA5C8;margin-top:14px;letter-spacing:2px}
.content{flex:1;display:flex;flex-direction:column;padding-top:40px;min-height:0}
.label{font-size:26px;letter-spacing:4px;text-transform:uppercase;color:#9AA5C8;font-weight:700;margin-bottom:20px}
h1{font-weight:700;line-height:1.1;color:#fff}
h1.hook{font-size:88px}h1.mid{font-size:72px;margin-bottom:34px}
h2.big{font-size:76px;font-weight:700;line-height:1.1;margin:36px 0 30px}
.g,.gold{color:#F9BC15}
.sub{font-family:'Caladea','Cambria',serif;font-style:italic;color:#F9BC15;font-size:48px;line-height:1.25;margin-top:44px}
.center{flex:1;display:flex;flex-direction:column;justify-content:center;padding-bottom:120px}
.swipe{display:flex;align-items:center;gap:14px;color:#9AA5C8;font-size:34px;position:absolute;left:80px;bottom:80px}
.body{font-size:42px;line-height:1.3;color:#fff}
.body.closing{margin-top:34px;font-size:40px}
.bubble{background:#1B2A5C;border-radius:32px;padding:44px 48px;font-size:46px;line-height:1.3}
.cards{display:flex;flex-direction:column;gap:22px;margin-top:6px}
.card.num{background:#1B2A5C;border-radius:30px;padding:28px 36px;display:flex;align-items:center;gap:46px;min-height:120px}
.no{font-family:'Caladea','Cambria',serif;font-weight:700;color:#F9BC15;font-size:68px;width:56px;flex:none;text-align:center}
.ct{font-size:42px;line-height:1.25}
.cols{display:flex;gap:34px;margin-top:6px}
.col{flex:1;border-radius:32px;padding:44px 38px;min-height:870px}
.col.dim{background:#14204A;border:2px solid #3A4A80;color:#8A94B8}
.col.hi{background:#1B2A5C;border:3px solid #F9BC15;color:#fff}
.clabel{font-size:26px;letter-spacing:4px;font-weight:700;margin-bottom:32px;text-transform:uppercase}
.col.hi .clabel{color:#F9BC15}
.col p{font-size:42px;line-height:1.25;margin-bottom:34px}
.rows{display:flex;flex-direction:column;gap:30px}
.row{display:flex;gap:36px;align-items:center}
.pill{flex:none;width:220px;min-height:100px;border-radius:30px;background:#F9BC15;color:#0B1530;font-weight:700;font-size:38px;display:flex;align-items:center;justify-content:center;text-align:center}
.pill.out{background:#1B2A5C;border:3px solid #F9BC15;color:#F9BC15}
.rt{font-size:40px;line-height:1.25}
.spacer{flex:1}
.foot{font-family:'Caladea','Cambria',serif;font-style:italic;font-size:36px;line-height:1.35;color:#9AA5C8;margin-top:30px}
.foot.gold{color:#F9BC15;font-size:40px}
.ctawrap{flex:1;display:flex;flex-direction:column;justify-content:center;padding-bottom:40px}
.line{height:4px;background:#F9BC15;margin:44px 0 46px;width:100%}
.ctah{font-family:'Caladea','Cambria',serif;font-weight:700;font-size:60px;color:#F9BC15;margin-bottom:22px}
.muted{font-size:36px;color:#9AA5C8;margin-top:44px}
.more{font-family:'Caladea','Cambria',serif;font-style:italic;font-size:48px;color:#F9BC15}
`;
  return `<!doctype html><html><head><meta charset="utf-8"><style>${css}</style></head><body><div class="wrap"><div class="hdr"><div class="brand"><div class="logo"><img src="data:image/png;base64,${logoB64}"></div><div><div class="wm"><b>Scalewise</b>.id</div><div class="tag">for Brand Partner</div></div></div><div class="pg">${n} / ${total}</div></div><div class="content">${main}</div></div><script>(function(){var c=document.querySelector(".content"),z=1;while(c.scrollHeight>c.clientHeight+1&&z>0.62){z-=0.03;c.style.zoom=z;}})();</script></body></html>`;
}
if (typeof module !== 'undefined') module.exports = { buildSlideHtml };
