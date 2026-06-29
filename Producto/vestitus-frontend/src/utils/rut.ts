export function cleanRut(rut: string): string {
  return rut.replace(/\./g, '').replace(/-/g, '')
}

export function formatRut(rut: string): string {
  const cleaned = cleanRut(rut)
  if (cleaned.length < 2) return cleaned
  const body = cleaned.slice(0, -1)
  const dv = cleaned.slice(-1).toUpperCase()
  const formatted = body.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
  return `${formatted}-${dv}`
}

export function validateRut(rut: string): boolean {
  const cleaned = cleanRut(rut)
  if (cleaned.length < 2) return false

  const body = cleaned.slice(0, -1)
  const dv = cleaned.slice(-1).toUpperCase()

  if (!/^\d+$/.test(body)) return false

  let sum = 0
  let multiplier = 2
  for (let i = body.length - 1; i >= 0; i--) {
    sum += parseInt(body[i]) * multiplier
    multiplier = multiplier === 7 ? 2 : multiplier + 1
  }
  const expectedDv = 11 - (sum % 11)
  let expectedDvStr: string
  if (expectedDv === 11) expectedDvStr = '0'
  else if (expectedDv === 10) expectedDvStr = 'K'
  else expectedDvStr = expectedDv.toString()

  return expectedDvStr === dv
}

export function isOver18(birthDate: string): boolean {
  if (!birthDate) return false
  const birth = new Date(birthDate)
  const today = new Date()
  const age = today.getFullYear() - birth.getFullYear()
  const monthDiff = today.getMonth() - birth.getMonth()
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    return age - 1 >= 18
  }
  return age >= 18
}
