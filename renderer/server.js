const http = require('http');
const { renderSlide } = require('./render.js');
http.createServer((req, res) => {
  if (req.method === 'GET') { res.end('ok'); return; }
  let raw = '';
  req.on('data', (c) => (raw += c));
  req.on('end', async () => {
    try {
      const b = JSON.parse(raw);
      const png = await renderSlide(b.slide || {}, b.n || 1, b.total || 1);
      res.writeHead(200, { 'Content-Type': 'image/png' });
      res.end(png);
    } catch (e) {
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end(String(e && e.stack || e));
    }
  });
}).listen(3000, () => console.log('renderer on 3000'));
