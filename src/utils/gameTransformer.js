import { RAYS_TEAM_ID, MLB_TEAM_ABBREVIATIONS, SEASON_START_DATE } from '../constants/mlb'

/// @description Filters out games that have not concluded AND games that took place before the Rays' regular season starts
export function filterFinalGames(games) {
  return games.filter(
    (game) =>
      game.status.detailedState === 'Final' &&
      new Date(game.gameDate) >= new Date(SEASON_START_DATE),
  )
}

// @description sets the Rays and the opponents as either home or away for further processing.
// returns gamePk, date, location, opponent, result, score, pitcher, and pitching stats
export function transformGameData(game) {
  const raysIsHome = game.teams.home.team.id === RAYS_TEAM_ID
  const team = raysIsHome ? game.teams.home : game.teams.away
  const opponent = raysIsHome ? game.teams.away : game.teams.home

  const pitchingStats = getPitchingStats(team.probablePitcher)

  return {
    gamePk: game.gamePk,
    date: formatGameDate(game.gameDate),
    location: raysIsHome ? 'vs.' : '@',
    opponent: MLB_TEAM_ABBREVIATIONS[opponent.team.name] || opponent.team.name,
    result: determineGameResult(team.score, opponent.score),
    score: `${team.score}-${opponent.score}`,
    pitcher: team.probablePitcher?.fullName ?? 'N/A',
    ...extractPitchingStats(pitchingStats),
  }
}

// @description searches for the pitcher.stats object that contains the Rays' starting pitcher's stats
function getPitchingStats(pitcher) {
  return pitcher?.stats?.find(
    (stat) => stat.group?.displayName === 'pitching' && stat.type?.displayName === 'gameLog',
  )?.stats
}

// @description sets win or loss value for regular season games.
function determineGameResult(teamScore, opponentScore) {
  if (teamScore > opponentScore) return 'Win'
  if (teamScore < opponentScore) return 'Loss'
  return 'Tie'
}

//@description formats the date to MM/DD for aesthetic purposes
function formatGameDate(dateString) {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: '2-digit',
    day: '2-digit',
  })
}

//@description extracts the highlight pitching stats from the stats object selected by getPitchingStats()
// I asked my dad which stats to include, and he suggested I keep it simple with these four.
function extractPitchingStats(stats) {
  return {
    inningsPitched: stats?.inningsPitched ?? 'N/A',
    strikeouts: stats?.strikeOuts ?? 'N/A',
    baseOnBalls: stats?.baseOnBalls ?? 'N/A',
    earnedRuns: stats?.earnedRuns ?? 'N/A',
  }
}
