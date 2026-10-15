const fs = require('fs'), path = require('path');
const satori = require('satori').default || require('satori');
const { Resvg } = require('@resvg/resvg-js');
const { build } = require('./tpl.js');
const F = (f) => fs.readFileSync(path.join(__dirname, 'fonts', f));
const fonts = [
  { name: 'Carlito', data: F('Carlito-Regular.ttf'), weight: 400, style: 'normal' },
  { name: 'Carlito', data: F('Carlito-Bold.ttf'), weight: 700, style: 'normal' },
  { name: 'Carlito', data: F('Carlito-Italic.ttf'), weight: 400, style: 'italic' },
  { name: 'Caladea', data: F('Caladea-Regular.ttf'), weight: 400, style: 'normal' },
  { name: 'Caladea', data: F('Caladea-Bold.ttf'), weight: 700, style: 'normal' },
  { name: 'Caladea', data: F('Caladea-Italic.ttf'), weight: 400, style: 'italic' },
];
const LOGO = 'data:image/png;base64,' + fs.readFileSync(path.join(__dirname, 'logo.png')).toString('base64');
async function renderSlide(slide, n, total) {
  // auto-fit: measure natural height with auto-height container, shrink until it fits
  let k = 1;
  for (; k > 0.6; k -= 0.04) {
    const tree = build(slide, n, total, LOGO, k);
    tree.props.style.height = undefined; delete tree.props.style.height;
    const svg = await satori(tree, { width: 1080, fonts });
    const hh = Number((svg.match(/height="([\d.]+)"/) || [])[1]);
    const needsMin = slide.layout === 'hook' || slide.layout === 'cta';
    if (hh <= 1350 || needsMin) { if (hh <= 1350 || k <= 0.7) break; }
  }
  const tree = build(slide, n, total, LOGO, k);
  const svg = await satori(tree, { width: 1080, height: 1350, fonts });
  return new Resvg(svg, { fitTo: { mode: 'width', value: 1080 } }).render().asPng();
}
module.exports = { renderSlide };
