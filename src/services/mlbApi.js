import { MLB_API_BASE_URL } from '../constants/mlb'
//@xdescription MLBApiError is a custom error class for handling errors related to the MLB API
// It could be fun!
export class MLBApiError extends Error {
  constructor(message) {
    super(message)
    this.name = 'MLBApiError'
  }
}
//@description generates a URL to fetch the MLB schedule for a specific team (the Rays) and date range
// Hardcoding felt kind of hacky in this context, please don't judge me too harshly.
// I just wanted to get it working quickly and show that I know how to extract the data I need.
export async function fetchMLBSchedule(teamId, startDate, endDate) {
  const url = new URL(`${MLB_API_BASE_URL}/schedule`)
  url.searchParams.append('sportId', '1')
  url.searchParams.append('teamId', teamId)
  url.searchParams.append('hydrate', 'probablePitcher,stats')
  url.searchParams.append('startDate', startDate)
  url.searchParams.append('endDate', endDate)

  try {
    const response = await fetch(url.toString())
    if (!response.ok) {
      throw new MLBApiError(`API responded with status: ${response.status}`)
    }
    const data = await response.json()
    return data.dates.flatMap((date) => date.games)
  } catch (error) {
    console.error('Error fetching MLB schedule:', error)
    throw new MLBApiError('Failed to fetch MLB schedule')
  }
}
