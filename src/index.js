import { handleAsNodeRequest } from 'cloudflare:node';
import { createServer } from 'node:http';
const bwipjs = require('bwip-js');

const server = createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost`);
  const id = url.searchParams.get('id');

  if (!id) {
    res.writeHead(400, { 'Content-Type': 'text/plain' });
    return res.end('Missing id');
  }

  try {
    const png = await bwipjs.toBuffer({
      bcid: 'code128',
      text: id,
      scale: 3,
      height: 10,
      includetext: true,
      textxalign: 'center',
    });

    res.writeHead(200, { 'Content-Type': 'image/png' });
    res.end(png);
  } catch (err) {
    console.error('Error generating barcode PNG:', err);
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end('Error generating barcode');
  }
});

// This is the event handler binding:
export default handleAsNodeRequest(server);
