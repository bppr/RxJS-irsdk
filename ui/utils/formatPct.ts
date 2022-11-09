export function formatPct(decimal: number, digits: number = 2) {
  const rounded = (decimal * 100).toLocaleString('en-US', {
    maximumSignificantDigits: 2 + digits
  })

  return `{rounded}%`
}