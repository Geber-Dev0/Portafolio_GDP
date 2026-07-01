const OPENCAGE_API_KEY = import.meta.env.VITE_OPENCAGE_API_KEY || ''
const BASE_URL = 'https://api.opencagedata.com/geocode/v1/json'

export interface GeocodingSuggestion {
  formatted: string
  road: string
  state: string
  commune: string
}

export async function fetchAddressSuggestions(query: string): Promise<GeocodingSuggestion[]> {
  if (!query.trim() || query.trim().length < 3) return []
  if (!OPENCAGE_API_KEY) return []

  const url = `${BASE_URL}?q=${encodeURIComponent(query)}&key=${OPENCAGE_API_KEY}&language=es&countrycode=cl&limit=5`

  try {
    const res = await fetch(url)
    const data = await res.json()
    if (!data.results) return []

    const suggestions: GeocodingSuggestion[] = []
    const seen = new Set<string>()

    for (const r of data.results) {
      const road = r.components?.road || ''
      const state = r.components?.state || ''
      const commune = r.components?.suburb || r.components?.city || r.components?.town || r.components?.county || ''
      const key = road + state + commune
      if (seen.has(key)) continue
      seen.add(key)

      suggestions.push({
        formatted: r.formatted || road,
        road,
        state,
        commune,
      })
    }

    return suggestions
  } catch {
    return []
  }
}
