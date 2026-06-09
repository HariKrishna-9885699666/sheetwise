import { describe, expect, it } from 'vitest'
import {
  getMonthTabName,
  isValidMonthTab,
  parseMonthTabName,
  formatDate,
  formatDateShort,
} from '@/lib/date-utils'

describe('date-utils', () => {
  it('getMonthTabName formats as "MMMM yyyy"', () => {
    const d = new Date('2024-05-15T12:00:00Z')
    expect(getMonthTabName(d)).toBe('May 2024')
  })

  it('isValidMonthTab returns true for correct format', () => {
    expect(isValidMonthTab('May 2024')).toBe(true)
  })

  it('isValidMonthTab returns false for invalid format', () => {
    expect(isValidMonthTab('2024-05')).toBe(false)
    expect(isValidMonthTab('Not a date')).toBe(false)
  })

  it('parseMonthTabName returns a Date for valid inputs', () => {
    const parsed = parseMonthTabName('May 2024')
    expect(Number.isNaN(parsed.getTime())).toBe(false)
    expect(parsed.getFullYear()).toBe(2024)
    expect(parsed.getMonth()).toBe(4) // May
  })

  it('formatDate returns Invalid Date for invalid date', () => {
    expect(formatDate('invalid-date')).toBe('Invalid Date')
  })

  it('formatDateShort returns Invalid Date for invalid date', () => {
    expect(formatDateShort('invalid-date')).toBe('Invalid Date')
  })
})

