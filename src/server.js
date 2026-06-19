req.on('data', chunk => {
  raw += chunk;
});

req.on('end', () => {
  try {
    const data = JSON.parse(raw || '{}');

    if (!data.homeTeam || !data.awayTeam) {
      return send(res, 400, {
        error: 'Missing required fields'
      });
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
    return send(res, 400, {
      error: 'Invalid JSON'
    });
  }
});

return;
