import { describe, it, expect } from 'vitest'
import { isValidCountryCode, normalizeCountryCode } from './countryCode'

describe('isValidCountryCode', () => {
  it('accepts valid ISO 3166-1 alpha-2 codes', () => {
    expect(isValidCountryCode('ES')).toBe(true)
    expect(isValidCountryCode('US')).toBe(true)
    expect(isValidCountryCode('FR')).toBe(true)
    expect(isValidCountryCode('MK')).toBe(true)
    expect(isValidCountryCode('KI')).toBe(true)
  })

  it('accepts lowercase and mixed-case codes', () => {
    expect(isValidCountryCode('es')).toBe(true)
    expect(isValidCountryCode('Us')).toBe(true)
  })

  it('rejects codes that are not ISO 3166-1 alpha-2', () => {
    expect(isValidCountryCode('XXX')).toBe(false)
    expect(isValidCountryCode('12')).toBe(false)
    expect(isValidCountryCode('X')).toBe(false)
    expect(isValidCountryCode('ZZ')).toBe(false)
    expect(isValidCountryCode('Spain')).toBe(false)
  })

  it('rejects empty or whitespace-only values', () => {
    expect(isValidCountryCode('')).toBe(false)
    expect(isValidCountryCode('  ')).toBe(false)
  })
})

describe('normalizeCountryCode', () => {
  it('uppercases and trims valid codes', () => {
    expect(normalizeCountryCode(' es ')).toBe('ES')
    expect(normalizeCountryCode('us')).toBe('US')
  })

  it('returns null for invalid codes', () => {
    expect(normalizeCountryCode('XXX')).toBeNull()
    expect(normalizeCountryCode('12')).toBeNull()
    expect(normalizeCountryCode('')).toBeNull()
  })
})
