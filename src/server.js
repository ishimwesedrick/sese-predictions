req.on('data', chunk => {
  body += chunk;
});

req.on('end', () => {
  try {
    const data = JSON.parse(body || '{}');

    if (!data.homeTeam || !data.awayTeam) {
      return send(res, 400, {
        error: 'Missing required fields'
      });
    }

    const home = {
      teamId: data.homeTeam,
      form: ['W', 'D', 'L', 'W', 'D'],
      goalsScored: 1.3,
      goalsConceded: 1.3,
      venuePoints: 1.2,
      h2hScore: 0.5
    };

    const away = {
      teamId: data.awayTeam,
      form: ['W', 'D', 'L', 'W', 'D'],
      goalsScored: 1.3,
      goalsConceded: 1.3,
      venuePoints: 1.2,
      h2hScore: 0.5
    };

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
      modelVersion: VERSION
    });

  } catch (e) {
    return send(res, 400, {
      error: 'Invalid JSON'
    });
  }
});

return;
