/** Calculates ERA: (earned runs * 9) / innings pitched */
const calculateERA = (earnedRuns, inningsPitched) => {
  return ((earnedRuns * 9) / inningsPitched).toFixed(2)
}

/** Calculates K/9: (strikeouts * 9) / innings pitched */
const calculateK9 = (strikeouts, inningsPitched) => {
  return ((strikeouts * 9) / inningsPitched).toFixed(2)
}

/** Calculates BB/9: (walks * 9) / innings pitched */
const calculateBB9 = (walks, inningsPitched) => {
  return ((walks * 9) / inningsPitched).toFixed(2)
}

/** Calculates WHIP: (walks + hits) / innings pitched */
const calculateWHIP = (walks, hits, inningsPitched) => {
  return ((walks + hits) / inningsPitched).toFixed(3)
}

/** Bundles some nice cumulative stats for each of the Rays' pitchers
 * for display in the StatsDrawer.
 */
export function transformPitchersData(games) {
  const pitchersStats = {}

  games.forEach((game) => {
    if (!game.pitcher) return

    if (!pitchersStats[game.pitcher]) {
      pitchersStats[game.pitcher] = {
        name: game.pitcher,
        gamesStarted: 0,
        inningsPitched: 0,
        earnedRuns: 0,
        strikeouts: 0,
        walks: 0,
        hits: 0,
      }
    }

    /* Update cumulative stats */
    pitchersStats[game.pitcher].gamesStarted++
    pitchersStats[game.pitcher].inningsPitched += parseFloat(game.inningsPitched || 0)
    pitchersStats[game.pitcher].earnedRuns += parseInt(game.earnedRuns || 0)
    pitchersStats[game.pitcher].strikeouts += parseInt(game.strikeouts || 0)
    pitchersStats[game.pitcher].walks += parseInt(game.baseOnBalls || 0)
    pitchersStats[game.pitcher].hits += parseInt(game.hits || 0)
  })

  /* Calculate advanced stats for each pitcher */
  return Object.values(pitchersStats).map((pitcher) => ({
    ...pitcher,
    inningsPitched: parseFloat(pitcher.inningsPitched.toFixed(1)),
    era: calculateERA(pitcher.earnedRuns, pitcher.inningsPitched),
    k9: calculateK9(pitcher.strikeouts, pitcher.inningsPitched),
    bb9: calculateBB9(pitcher.walks, pitcher.inningsPitched),
    whip: calculateWHIP(pitcher.walks, pitcher.hits, pitcher.inningsPitched),
  }))
}
