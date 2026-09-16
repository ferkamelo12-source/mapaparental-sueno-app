import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import {
  ageInMonths,
  getSleepWindowForAge,
  SLEEP_WINDOWS,
  DAY_PLAN,
  MYTHS,
  PROBLEM_LABELS,
  MEDICAL_DISCLAIMER,
} from './content'

describe('getSleepWindowForAge', () => {
  it('returns the 0-3 month window at the lower boundary', () => {
    expect(getSleepWindowForAge(0)).toBe(SLEEP_WINDOWS[0])
  })

  it('returns the 0-3 month window at the upper boundary', () => {
    expect(getSleepWindowForAge(3)).toBe(SLEEP_WINDOWS[0])
  })

  it('returns the 4-6 month window right after the previous boundary', () => {
    expect(getSleepWindowForAge(4)).toBe(SLEEP_WINDOWS[1])
  })

  it('returns the 7-12 month window', () => {
    expect(getSleepWindowForAge(7)).toBe(SLEEP_WINDOWS[2])
    expect(getSleepWindowForAge(12)).toBe(SLEEP_WINDOWS[2])
  })

  it('returns the 13-24 month window', () => {
    expect(getSleepWindowForAge(13)).toBe(SLEEP_WINDOWS[3])
    expect(getSleepWindowForAge(24)).toBe(SLEEP_WINDOWS[3])
  })

  it('falls back to the last window for ages beyond 24 months', () => {
    expect(getSleepWindowForAge(30)).toBe(SLEEP_WINDOWS[SLEEP_WINDOWS.length - 1])
  })
})

describe('ageInMonths', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('counts full calendar months within the same year', () => {
    // new Date(year, monthIndex, day) is always LOCAL time, unlike a date-only
    // ISO string (which parses as UTC) — this keeps the test deterministic
    // regardless of the machine's timezone.
    vi.setSystemTime(new Date(2026, 5, 1)) // 1 jun 2026
    expect(ageInMonths('2026-01-15')).toBe(5)
  })

  it('counts months across a year boundary', () => {
    vi.setSystemTime(new Date(2026, 1, 1)) // 1 feb 2026
    expect(ageInMonths('2025-11-10')).toBe(3)
  })

  it('returns 0 for a birth date in the current calendar month', () => {
    vi.setSystemTime(new Date(2026, 2, 1)) // 1 mar 2026
    expect(ageInMonths('2026-03-25')).toBe(0)
  })

  it('ignores the day of the month, only comparing year and month', () => {
    vi.setSystemTime(new Date(2026, 2, 31)) // 31 mar 2026
    expect(ageInMonths('2026-01-01')).toBe(2)
  })

  it('is not affected by the UTC/local parsing gap for a birth date on the 1st', () => {
    // Regression test: new Date('2026-01-01') parses as UTC midnight, which in
    // timezones behind UTC rolls back to December 31st — this used to make a
    // baby born on the 1st look one month older than they are.
    vi.setSystemTime(new Date(2026, 0, 15)) // 15 ene 2026
    expect(ageInMonths('2026-01-01')).toBe(0)
  })
})

describe('content data integrity', () => {
  it('has exactly 4 sleep windows covering 0 to 24 months with no gaps', () => {
    expect(SLEEP_WINDOWS).toHaveLength(4)
    expect(SLEEP_WINDOWS[0].minMonths).toBe(0)
    expect(SLEEP_WINDOWS[SLEEP_WINDOWS.length - 1].maxMonths).toBe(24)
    for (let i = 1; i < SLEEP_WINDOWS.length; i++) {
      expect(SLEEP_WINDOWS[i].minMonths).toBe(SLEEP_WINDOWS[i - 1].maxMonths + 1)
    }
  })

  it('defines a plan entry for each of the 7 days with tasks and an audio track', () => {
    for (let day = 1; day <= 7; day++) {
      const entry = DAY_PLAN[day]
      expect(entry, `missing DAY_PLAN entry for day ${day}`).toBeDefined()
      expect(entry.tasks.length).toBeGreaterThan(0)
      expect(entry.audioTrack.length).toBeGreaterThan(0)
    }
  })

  it('has a label for every main problem option used by the quiz', () => {
    const expectedKeys = [
      'no_duerme_solo',
      'despertares_frecuentes',
      'siestas_cortas',
      'resistencia_dormir',
    ]
    expect(Object.keys(PROBLEM_LABELS).sort()).toEqual(expectedKeys.sort())
  })

  it('has 5 myths, each with a title and a reality', () => {
    expect(MYTHS).toHaveLength(5)
    for (const myth of MYTHS) {
      expect(myth.title.length).toBeGreaterThan(0)
      expect(myth.reality.length).toBeGreaterThan(0)
    }
  })

  it('has a non-empty medical disclaimer', () => {
    expect(MEDICAL_DISCLAIMER.length).toBeGreaterThan(0)
  })
})
