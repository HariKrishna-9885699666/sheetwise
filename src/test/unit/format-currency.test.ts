import { describe, expect, it } from 'vitest'
import { formatCurrency, formatCurrencyCompact } from '@/lib/format-currency'

describe('format-currency', () => {
  it('formatCurrency returns em dash for null/undefined', () => {
    expect(formatCurrency(null)).toBe('—')
    expect(formatCurrency(undefined)).toBe('—')
  })

  it('formatCurrencyCompact uses compact suffixes', () => {
    expect(formatCurrencyCompact(999)).toContain('₹')
    expect(formatCurrencyCompact(1000)).toContain('K')
    expect(formatCurrencyCompact(100000)).toContain('L')
    expect(formatCurrencyCompact(10000000)).toContain('Cr')
  })
})

