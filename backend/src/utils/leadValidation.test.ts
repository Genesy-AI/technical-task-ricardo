import { describe, it, expect } from 'vitest'
import { validateBulkLead } from './leadValidation'

const validLead = {
  firstName: 'Ada',
  lastName: 'Lovelace',
  email: 'ada@example.com',
  jobTitle: 'Engineer',
  countryCode: 'GB',
  companyName: 'Analytical Engines',
}

describe('validateBulkLead', () => {
  it('accepts a fully valid lead and returns normalized data', () => {
    const result = validateBulkLead(validLead)
    expect(result.valid).toBe(true)
    if (result.valid) {
      expect(result.lead).toEqual({
        firstName: 'Ada',
        lastName: 'Lovelace',
        email: 'ada@example.com',
        jobTitle: 'Engineer',
        countryCode: 'GB',
        companyName: 'Analytical Engines',
      })
    }
  })

  it('trims whitespace on all fields', () => {
    const result = validateBulkLead({
      ...validLead,
      firstName: ' Ada ',
      countryCode: ' gb ',
    })
    expect(result.valid).toBe(true)
    if (result.valid) {
      expect(result.lead.firstName).toBe('Ada')
      expect(result.lead.countryCode).toBe('GB')
    }
  })

  it('accepts a lead without optional fields, storing them as null', () => {
    const result = validateBulkLead({
      firstName: 'Ada',
      lastName: 'Lovelace',
      email: 'ada@example.com',
    })
    expect(result.valid).toBe(true)
    if (result.valid) {
      expect(result.lead.jobTitle).toBeNull()
      expect(result.lead.countryCode).toBeNull()
      expect(result.lead.companyName).toBeNull()
    }
  })

  it.each([
    ['firstName', { ...validLead, firstName: '' }],
    ['lastName', { ...validLead, lastName: '  ' }],
    ['email', { ...validLead, email: undefined }],
  ])('rejects a lead with missing %s', (_field, lead) => {
    const result = validateBulkLead(lead)
    expect(result.valid).toBe(false)
  })

  it('rejects a lead with an invalid country code', () => {
    const result = validateBulkLead({ ...validLead, countryCode: 'XXX' })
    expect(result.valid).toBe(false)
    if (!result.valid) {
      expect(result.errors).toContain('Invalid country code: XXX')
    }
  })

  it('rejects numeric-looking country codes', () => {
    const result = validateBulkLead({ ...validLead, countryCode: '12' })
    expect(result.valid).toBe(false)
  })

  it('normalizes lowercase country codes instead of rejecting them', () => {
    const result = validateBulkLead({ ...validLead, countryCode: 'es' })
    expect(result.valid).toBe(true)
    if (result.valid) {
      expect(result.lead.countryCode).toBe('ES')
    }
  })

  it('rejects non-object input', () => {
    expect(validateBulkLead(null).valid).toBe(false)
    expect(validateBulkLead('string').valid).toBe(false)
  })
})
