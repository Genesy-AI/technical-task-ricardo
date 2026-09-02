import { isValidCountryCode, normalizeCountryCode } from './countryCode'

export interface ValidatedLead {
  firstName: string
  lastName: string
  email: string
  jobTitle: string | null
  countryCode: string | null
  companyName: string | null
}

export type LeadValidationResult =
  | { valid: true; lead: ValidatedLead }
  | { valid: false; errors: string[] }

const asTrimmedString = (value: unknown): string =>
  typeof value === 'string' ? value.trim() : ''

export function validateBulkLead(raw: unknown): LeadValidationResult {
  if (!raw || typeof raw !== 'object') {
    return { valid: false, errors: ['Lead must be an object'] }
  }

  const input = raw as Record<string, unknown>
  const errors: string[] = []

  const firstName = asTrimmedString(input.firstName)
  const lastName = asTrimmedString(input.lastName)
  const email = asTrimmedString(input.email)
  const jobTitle = asTrimmedString(input.jobTitle)
  const companyName = asTrimmedString(input.companyName)
  const rawCountryCode = asTrimmedString(input.countryCode)

  if (!firstName) errors.push('firstName is required')
  if (!lastName) errors.push('lastName is required')
  if (!email) errors.push('email is required')

  if (rawCountryCode && !isValidCountryCode(rawCountryCode)) {
    errors.push(`Invalid country code: ${rawCountryCode}`)
  }

  if (errors.length > 0) {
    return { valid: false, errors }
  }

  return {
    valid: true,
    lead: {
      firstName,
      lastName,
      email,
      jobTitle: jobTitle || null,
      countryCode: rawCountryCode ? normalizeCountryCode(rawCountryCode) : null,
      companyName: companyName || null,
    },
  }
}
