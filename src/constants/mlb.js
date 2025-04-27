/** The spec laid out a pretty clear request: fetch data from this API using these query parameters and present the data back to us.
 * I still wanted to show my understanding of ETL hygiene, so I put the hardcoded values in a constants file.
 */
export const RAYS_TEAM_ID = 139
export const MLB_API_BASE_URL = 'https://statsapi.mlb.com/api/v1'
export const SEASON_START_DATE = '2025-03-28'

/** I had this sparkline idea for the main visualization, but it required abbreviating a lot of data to fit in the strokes.
 * MLB_TEAM_ABBREVIATIONS is a result of that effort.
 * I ended up ditching the sparkline concept for the main visualization because it looked too sparse,
 * but I liked the abbreviations, so they stayed.
 * Also super weird, but the Athletics are just called "Athletics" this year.
 */
export const MLB_TEAM_ABBREVIATIONS = {
  'Arizona Diamondbacks': 'ARI',
  'Atlanta Braves': 'ATL',
  'Baltimore Orioles': 'BAL',
  'Boston Red Sox': 'BOS',
  'Chicago White Sox': 'CWS',
  'Chicago Cubs': 'CHC',
  'Cincinnati Reds': 'CIN',
  'Cleveland Guardians': 'CLE',
  'Colorado Rockies': 'COL',
  'Detroit Tigers': 'DET',
  'Houston Astros': 'HOU',
  'Kansas City Royals': 'KC',
  'Los Angeles Angels': 'LAA',
  'Los Angeles Dodgers': 'LAD',
  'Miami Marlins': 'MIA',
  'Milwaukee Brewers': 'MIL',
  'Minnesota Twins': 'MIN',
  'New York Yankees': 'NYY',
  'New York Mets': 'NYM',
  Athletics: 'ATH',
  'Philadelphia Phillies': 'PHI',
  'Pittsburgh Pirates': 'PIT',
  'San Diego Padres': 'SD',
  'San Francisco Giants': 'SF',
  'Seattle Mariners': 'SEA',
  'St. Louis Cardinals': 'STL',
  'Tampa Bay Rays': 'TB',
  'Texas Rangers': 'TEX',
  'Toronto Blue Jays': 'TOR',
  'Washington Nationals': 'WSH',
}
