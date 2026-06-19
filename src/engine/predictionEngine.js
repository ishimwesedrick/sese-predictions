'use strict';

const DEFAULT_WEIGHTS = {
  form: 0.4,
  goals: 0.3,
  defense: 0.2,
  venue: 0.1
};

function predict(home, away, leagueModel, weights) {
  const homeScore =
    home.goalsScored * weights.goals +
    home.venuePoints * weights.venue +
    home.h2hScore * 0.1;

  const awayScore =
    away.goalsScored * weights.goals +
    away.venuePoints * 0.1 +
    away.h2hScore * 0.1;

  const total = homeScore + awayScore + 0.1;

  const homeWin = homeScore / total;
  const awayWin = awayScore / total;
  const draw = 1 - (homeWin + awayWin);

  let prediction = 'DRAW';
  if (homeWin > awayWin && homeWin > draw) prediction = 'HOME_WIN';
  if (awayWin > homeWin && awayWin > draw) prediction = 'AWAY_WIN';

  return {
    homeWin,
    awayWin,
    draw,
    prediction,
    confidence: Math.max(homeWin, awayWin, draw)
  };
}

module.exports = { predict, DEFAULT_WEIGHTS };
