import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { Readable } from 'node:stream';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;
const HOST = '0.0.0.0';

const staticDir = path.join(__dirname, 'app');

// Parser sommaire pour ID3v2
function parseID3v2(buf) {
  if (!buf || buf.length < 10) return null;
  if (buf.toString('latin1', 0, 3) !== 'ID3') return null;
  const major = buf[3];
  const rev = buf[4];
  const tagSize = ((buf[6] & 0x7f) << 21) | ((buf[7] & 0x7f) << 14) | ((buf[8] & 0x7f) << 7) | (buf[9] & 0x7f);
  const tags = { version: `2.${major}.${rev}`, rawSize: tagSize };
  let offset = 10;
  const end = Math.min(buf.length, 10 + tagSize);

  while (offset < end - 10) {
    const frameId = buf.toString('latin1', offset, offset + 4);
    if (!/^[A-Z0-9]{4}$/.test(frameId)) break;
    let frameSize;
    if (major === 4) {
      frameSize = ((buf[offset + 4] & 0x7f) << 21) | ((buf[offset + 5] & 0x7f) << 14) | ((buf[offset + 6] & 0x7f) << 7) | (buf[offset + 7] & 0x7f);
    } else {
      frameSize = buf.readUInt32BE(offset + 4);
    }
    if (frameSize <= 0 || offset + 10 + frameSize > end + 1000) break;
    const content = buf.subarray(offset + 10, Math.min(offset + 10 + frameSize, buf.length));

    if (frameId.startsWith('T') && frameId !== 'TXXX') {
      const text = content.length > 1 ? content.subarray(1).toString('utf-8').replace(/\0/g, '').trim() : '';
      tags[frameId] = text;
    } else if (frameId === 'TXXX') {
      const text = content.length > 1 ? content.subarray(1).toString('utf-8').replace(/\0/g, ' ').trim() : '';
      tags.TXXX = (tags.TXXX || []).concat(text);
    }
    offset += 10 + frameSize;
  }
  return tags;
}

function extractTargetUrl(req) {
  let url = req.query.url ? String(req.query.url) : null;
  if (!url && req.originalUrl && req.originalUrl.includes('url=')) {
    url = req.originalUrl.slice(req.originalUrl.indexOf('url=') + 4);
  }
  if (!url) return null;

  // Si l'URL entière est encore encodée (commence par http%3A ou https%3A)
  if (url.startsWith('http%3A') || url.startsWith('https%3A') || url.startsWith('http%3a') || url.startsWith('https%3a')) {
    try {
      url = decodeURIComponent(url);
    } catch (_) {}
  }

  // Si des paramètres secondaires comme &token= ou &alt= ont été séparés par le parser de requête Express
  if (req.query.token && !url.includes('token=')) {
    url += (url.includes('?') ? '&' : '?') + 'token=' + req.query.token;
  }
  if (req.query.alt && !url.includes('alt=')) {
    url += (url.includes('?') ? '&' : '?') + 'alt=' + req.query.alt;
  }

  return url;
}

// Route API : Contenu dynamique exclusif (creative-assets-api /v1/contents/1)
let cachedContent = null;
let lastContentFetch = 0;
// Cache réduit à 0ms pour réactivité immédiate (toujours interroger le flux en direct)
const CONTENT_CACHE_TTL = 0;

async function fetchRemoteCreativeContent(force = false) {
  const now = Date.now();
  if (!force && CONTENT_CACHE_TTL > 0 && cachedContent && (now - lastContentFetch < CONTENT_CACHE_TTL)) {
    return cachedContent;
  }
  try {
    const upstreamUrl = `https://creative-assets-api.web.app/v1/contents/1?_t=${now}`;
    const upstream = await fetch(upstreamUrl, {
      headers: {
        'User-Agent': 'Conjugarium-Creative-Client/1.0',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      }
    });
    if (upstream.ok) {
      const data = await upstream.json();
      cachedContent = data;
      lastContentFetch = now;
      return cachedContent;
    }
  } catch (err) {
    console.warn('Erreur récupération distante creative-assets-api:', err.message);
  }
  return cachedContent;
}

app.get('/api/content', async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  // Aucun cache navigateur ou intermédiaire pour voir immédiatement les changements
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');

  try {
    const force = req.query.refresh === 'true' || req.query.nocache === '1';
    const data = await fetchRemoteCreativeContent(force);
    if (data) {
      return res.json(data);
    }
    // Fallback de secours si l'API externe est injoignable
    res.sendFile(path.join(staticDir, 'config/chapters.json'));
  } catch (err) {
    console.error('Erreur route /api/content:', err);
    res.status(500).json({ error: 'Impossible de charger le contenu' });
  }
});

// Route API : Inspection et métadonnées audio dynamiques
app.get('/api/audio-metadata', async (req, res) => {
  const targetUrl = extractTargetUrl(req);
  if (!targetUrl) {
    return res.status(400).json({ error: 'Paramètre url requis' });
  }

  try {
    const startTime = Date.now();
    // Télécharge l'en-tête et les premières portions pour extraire les métadonnées ID3
    const response = await fetch(targetUrl, {
      headers: {
        'User-Agent': 'Conjugarium-Audio-Engine/1.0',
        'Range': 'bytes=0-16383'
      }
    });

    const latencyMs = Date.now() - startTime;
    const contentLengthHeader = response.headers.get('content-range')
      ? response.headers.get('content-range').split('/')[1]
      : response.headers.get('content-length');
    const totalBytes = contentLengthHeader ? parseInt(contentLengthHeader, 10) : null;
    const contentType = response.headers.get('content-type') || 'audio/mpeg';

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const id3 = parseID3v2(buffer);

    res.json({
      success: true,
      url: targetUrl,
      sourceType: targetUrl.includes('firebasestorage.googleapis.com') ? 'Firebase Storage (Google Cloud)' : 'Remote Stream',
      sizeBytes: totalBytes,
      sizeFormatted: totalBytes ? (totalBytes / (1024 * 1024)).toFixed(2) + ' Mo' : 'Inconnue',
      contentType: contentType,
      latencyMs: latencyMs,
      id3: {
        title: id3?.TIT2 || 'Saint Germain',
        year: id3?.TDRC || '2026',
        encoder: id3?.TENC || id3?.TSSE || 'Audio MP3',
        version: id3?.version || '2.4.0'
      },
      bitrateEstimated: '256 kbps',
      sampleRate: '48 kHz',
      channels: 'Stéréo'
    });
  } catch (err) {
    console.error('Erreur metadata audio:', err);
    res.status(500).json({ error: 'Impossible de récupérer les métadonnées du flux audio', details: err.message });
  }
});

// Route API : Proxy de streaming audio résilient avec support Range (HTTP 206) et CORS
app.get('/api/media-proxy', async (req, res) => {
  const targetUrl = extractTargetUrl(req);
  if (!targetUrl) {
    return res.status(400).send('Paramètre url requis');
  }

  try {
    const forwardHeaders = {
      'User-Agent': 'Conjugarium-Audio-Engine/1.0'
    };
    if (req.headers.range) {
      forwardHeaders['Range'] = req.headers.range;
    }

    const upstream = await fetch(targetUrl, { headers: forwardHeaders });

    res.status(upstream.status);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Accept-Ranges', 'bytes');

    if (upstream.headers.get('content-type')) {
      res.setHeader('Content-Type', upstream.headers.get('content-type'));
    }
    if (upstream.headers.get('content-length')) {
      res.setHeader('Content-Length', upstream.headers.get('content-length'));
    }
    if (upstream.headers.get('content-range')) {
      res.setHeader('Content-Range', upstream.headers.get('content-range'));
    }

    if (upstream.body) {
      Readable.fromWeb(upstream.body).pipe(res);
    } else {
      res.end();
    }
  } catch (err) {
    console.error('Erreur media proxy:', err);
    res.status(502).send('Erreur lors du streaming distant');
  }
});

// Serve static assets from app directory for both root and /app paths
app.use(express.static(staticDir));
app.use('/app', express.static(staticDir));

// Fallback to index.html for non-asset routes
app.get('*', (req, res) => {
  if (path.extname(req.path)) {
    return res.status(404).send('Not found');
  }
  res.sendFile(path.join(staticDir, 'index.html'));
});

app.listen(PORT, HOST, () => {
  console.log(`Server listening on http://${HOST}:${PORT}`);
});
