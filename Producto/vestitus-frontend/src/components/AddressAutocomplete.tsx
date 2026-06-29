import { useState } from 'react'
import { useAddressAutocomplete } from '../hooks/useAddressAutocomplete'
import type { GeocodingSuggestion } from '../services/geocoding.service'
import { MapPin, Loader2 } from 'lucide-react'

interface Props {
  value: string
  onChange: (value: string) => void
  onSelect?: (suggestion: GeocodingSuggestion) => void
  required?: boolean
  placeholder?: string
}

export default function AddressAutocomplete({ value, onChange, onSelect, required, placeholder }: Props) {
  const [focused, setFocused] = useState(false)
  const { suggestions, loading } = useAddressAutocomplete(value)

  const handleSelect = (s: GeocodingSuggestion) => {
    onChange(s.formatted)
    onSelect?.(s)
    setFocused(false)
  }

  return (
    <div className="relative">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setTimeout(() => setFocused(false), 200)}
        required={required}
        placeholder={placeholder || 'Ej: Av. Providencia 1234, Santiago'}
        className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-full px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--gold)] text-[var(--text)]"
      />
      {loading && (
        <Loader2 className="absolute right-3 top-3 h-4 w-4 text-[var(--muted)] animate-spin" />
      )}
      {focused && suggestions.length > 0 && (
        <ul className="absolute z-50 mt-1 w-full bg-[var(--card)] border border-[var(--border)] rounded-xl shadow-lg overflow-hidden">
          {suggestions.map((s, i) => (
            <li
              key={i}
              onMouseDown={() => handleSelect(s)}
              className="flex items-center gap-2 px-4 py-2.5 text-sm text-[var(--text)] hover:bg-[var(--surface)] cursor-pointer border-b border-[var(--border)] last:border-b-0"
            >
              <MapPin className="h-3.5 w-3.5 text-[var(--muted)] flex-shrink-0" />
              {s.formatted}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
