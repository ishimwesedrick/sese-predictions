'use strict';

const http = require('http');

const {
  predict,
  DEFAULT_WEIGHTS
} = require('./engine/predictionEngine');

const {
  getLeagueModel
} = require('./models/leagueModels');

const PORT = process.env.PORT || 3000;
const VERSION = '1.0.0';

function send(res, status, body) {
  const payload = JSON.stringify(body);

  res.writeHead(status, {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(payload)
  });

  res.end(payload);
}

function buildStats(teamId) {
  return {
    teamId,
    form: ['W', 'D', 'L', 'W', 'D'],
    goalsScored: 1.3,
    goalsConceded: 1.3,
    venuePoints: 1.2,
    h2hScore: 0.5
  };
}

async function router(req, res) {
  const url = req.url.split('?')[0];
  const method = req.method.toUpperCase();

  if (url === '/health' && method === 'GET') {
    return send(res, 200, {
      status: 'ok',
      version: VERSION,
      uptime: Math.floor(process.uptime())
    });
  }

  if (url === '/predict' && method === 'POST') {
  let body = '';

  req.on('data', chunk => {
    body += chunk;
  });

  req.on('end', () => {
    try {
      console.log('RAW BODY:', body); // DEBUG (important)

      const data = JSON.parse(body);

      if (!data.homeTeam || !data.awayTeam) {
        return send(res, 400, { error: 'Missing required fields' });
      }

      const home = buildStats(data.homeTeam);
      const away = buildStats(data.awayTeam);

      const leagueModel = getLeagueModel(
        (data.league || 'DEFAULT').toUpperCase()
      );

      const result = predict(
        home,
        away,
        leagueModel,
        DEFAULT_WEIGHTS
      );

      return send(res, 200, {
        homeWin: result.homeWin,
        draw: result.draw,
        awayWin: result.awayWin,
        prediction: result.prediction,
        confidence: result.confidence,
        league: leagueModel.id,
        modelVersion: VERSION
      });

    } catch (e) {
      console.log('JSON ERROR:', e.message);
      return send(res, 400, { error: 'Invalid JSON' });
    }
  });

  return;
}

  return send(res, 404, {
    error: 'Not found'
  });
}

const server = http.createServer(router);

server.listen(PORT, () => {
  console.log('[SESE Predictions] Server started');
  console.log('Port:', PORT);
  console.log('Version:', VERSION);
});

server.on('error', (e) => {
  console.error('[server] Fatal:', e.message);
  process.exit(1);
});

module.exports = server;
  
  
