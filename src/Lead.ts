import { ValidationError } from './errors.js';

/**
 * Input for creating a Lead. At least one of email/phone is required.
 * Any extra property is sent as-is and stored server-side in the lead's
 * meta JSON (e.g. utm_source, utm_campaign, usecase).
 */
export interface CreateLeadInput {
  name?: string;
  email?: string;
  phone?: string;
  recaptchaToken?: string;
  meta?: Record<string, string | number | boolean>;
  [extra: string]: unknown;
}

const RESERVED_KEYS = new Set(['name', 'email', 'phone', 'recaptchaToken', 'meta']);

/**
 * A lead captured through the CRM Lead API. This is the primary object the
 * SDK works with: `client.leads.create(...)` resolves to a `Lead`.
 */
export class Lead {
  constructor(
    public readonly id: number,
    public readonly success: boolean
  ) {}

  static fromResponse(data: Record<string, unknown>): Lead {
    return new Lead(Number(data.id ?? 0), Boolean(data.success ?? false));
  }
}

/**
 * @throws ValidationError when neither email nor phone is set
 */
export function validateCreateLeadInput(input: CreateLeadInput): void {
  if (!input.email && !input.phone) {
    throw new ValidationError('Either email or phone must be provided.');
  }
}

export function toFormFields(input: CreateLeadInput): Record<string, unknown> {
  const fields: Record<string, unknown> = { ...input.meta };

  for (const [key, value] of Object.entries(input)) {
    if (!RESERVED_KEYS.has(key) && value !== undefined) {
      fields[key] = value;
    }
  }

  if (input.recaptchaToken) fields.recaptcha_token = input.recaptchaToken;
  if (input.name) fields.name = input.name;
  if (input.email) fields.email = input.email;
  if (input.phone) fields.phone = input.phone;

  return fields;
}
