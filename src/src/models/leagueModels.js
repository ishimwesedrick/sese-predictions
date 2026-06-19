'use strict';

function getLeagueModel(leagueId) {
  const models = {
    DEFAULT: { id: 'DEFAULT', strength: 1.0 },
    EPL: { id: 'EPL', strength: 1.2 },
    LA_LIGA: { id: 'LA_LIGA', strength: 1.1 },
    SERIE_A: { id: 'SERIE_A', strength: 1.05 }
  };

  return models[leagueId] || models.DEFAULT;
}

module.exports = {
  getLeagueModel
};
