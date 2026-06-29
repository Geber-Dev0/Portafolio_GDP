import { useState, useEffect, useRef } from 'react'
import { fetchAddressSuggestions } from '../services/geocoding.service'
import type { GeocodingSuggestion } from '../services/geocoding.service'

export function useAddressAutocomplete(query: string) {
  const [suggestions, setSuggestions] = useState<GeocodingSuggestion[]>([])
  const [loading, setLoading] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout>>()

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current)

    if (!query.trim() || query.trim().length < 3) {
      setSuggestions([])
      return
    }

    setLoading(true)
    timerRef.current = setTimeout(async () => {
      const results = await fetchAddressSuggestions(query)
      setSuggestions(results)
      setLoading(false)
    }, 300)

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [query])

  return { suggestions, loading }
}
