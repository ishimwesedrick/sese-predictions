'use strict';

function buildTeamStats(matches) {
  const teams = {};

  for (const m of matches) {
    if (!teams[m.homeTeam]) {
      teams[m.homeTeam] = {
        played: 0,
        goalsScored: 0,
        goalsConceded: 0,
        form: []
      };
    }

    if (!teams[m.awayTeam]) {
      teams[m.awayTeam] = {
        played: 0,
        goalsScored: 0,
        goalsConceded: 0,
        form: []
      };
    }

    teams[m.homeTeam].played++;
    teams[m.homeTeam].goalsScored += m.homeGoals;
    teams[m.homeTeam].goalsConceded += m.awayGoals;

    teams[m.awayTeam].played++;
    teams[m.awayTeam].goalsScored += m.awayGoals;
    teams[m.awayTeam].goalsConceded += m.homeGoals;

    teams[m.homeTeam].form.push(
      m.homeGoals > m.awayGoals ? 1 : m.homeGoals === m.awayGoals ? 0 : -1
    );

    teams[m.awayTeam].form.push(
      m.awayGoals > m.homeGoals ? 1 : m.awayGoals === m.homeGoals ? 0 : -1
    );
  }

  for (const team of Object.values(teams)) {
    team.goalsScored = team.goalsScored / team.played;
    team.goalsConceded = team.goalsConceded / team.played;
    team.form = team.form.slice(-5);
  }

  return teams;
}

module.exports = { buildTeamStats };
