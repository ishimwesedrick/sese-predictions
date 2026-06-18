'use strict';

const http = require('http');
const { predict, DEFAULT_WEIGHTS } = require('./engine/predictionEngine');
const { getLeagueModel } = require('./models/leagueModels');
function readBody(req) {
  return new Promise((resolve, reject) => {
    let raw = '';

    req.on('data', chunk => {
      raw += chunk;
    });

    req.on('end', () => {
      try {
        if (!raw || raw.trim() === '') {
          return reject(new Error('Empty body'));
        }

        resolve(JSON.parse(raw));
      } catch (e) {
        reject(new Error('Invalid JSON body'));
      }
    });

    req.on('error', reject);
  });
}
const PORT = process.env.PORT || 3000;
const VERSION = '1.0.0';

function send(res, status, body) {
  const payload = JSON.stringify(body);
  res.writeHead(status, { 'Content-Type': 'application/json' });
  res.end(payload);
}

async function router(req, res) {
  const url = req.url.split('?')[0];

  if (url === '/health' && req.method === 'GET') {
    return send(res, 200, {
      status: 'ok',
      version: VERSION,
      uptime: Math.floor(process.uptime())
    });
  }

  if (url === '/predict' && req.method === 'POST') {
    let body = '';

    req.on('data', chunk => body += chunk);

    req.on('end', () => {
      try {
        const data = JSON.parse(body || '{}');

        if (!data.homeTeam || !data.awayTeam) {
          return send(res, 400, { error: 'Missing required fields' });
        }

        let body = '';

req.on('data', chunk => body += chunk);

req.on('end', () => {
  try {
    const data = JSON.parse(body || '{}');

    if (!data.homeTeam || !data.awayTeam) {
      return send(res, 400, { error: 'Missing required fields' });
    }

    const home = buildStats(data.homeTeam, data.homeStats || {});
    const away = buildStats(data.awayTeam, data.awayStats || {});

    const leagueModel = getLeagueModel((data.league || 'DEFAULT').toUpperCase());

    const result = predict(home, away, leagueModel, DEFAULT_WEIGHTS);

    return send(res, 200, {
      homeWin: result.homeWin,
      draw: result.draw,
      awayWin: result.awayWin,
      prediction: result.prediction,
      confidence: result.confidence,
      modelVersion: VERSION
    });

  } catch (e) {
    return send(res, 400, { error: 'Invalid JSON' });
  }
});

return;

        return send(res, 200, {
          homeWin,
          draw,
          awayWin,
          prediction: 'HOME_WIN',
          confidence: 0.5,
          modelVersion: VERSION
        });

      } catch (e) {
        return send(res, 400, { error: 'Invalid JSON' });
      }
    });

    return;
  }

  return send(res, 404, { error: 'Not found' });
}

const server = http.createServer(router);

server.listen(PORT, () => {
  console.log('[SESE Predictions] Server started');
  console.log('Port:', PORT);
});
