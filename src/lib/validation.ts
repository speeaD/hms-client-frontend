/**
 * Client-side validation only. This app has no backend yet, but these limits
 * exist so the same rules can be re-applied server-side without surprises,
 * and so the UI never accepts obviously malformed or oversized input.
 */
const MAX_PHONE_LENGTH = 11; // arbitrary, but long enough for international numbers
const MAX_NAME_LENGTH = 100;
const MAX_EMAIL_LENGTH = 254; // RFC 5321 limit
// Deliberately simple/conservative: good enough to catch typos client-side.
// Real deliverability/format checks belong server-side (e.g. via a verified
// mail step), not in a regex.
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// Strips control characters (including line breaks) so a name/email field
// can't be used to inject newlines into logs or downstream emails/headers.
const CONTROL_CHARS = /[\u0000-\u001F\u007F]/g;

/**
 * For live onChange handlers: strips dangerous control characters and caps
 * length, but does NOT trim — trimming on every keystroke would eat a
 * trailing space the user is about to type through (e.g. "James Pemberton").
 */
export function sanitizeOnChange(value: string, maxLength: number): string {
  return value.replace(CONTROL_CHARS, "").slice(0, maxLength);
}

/** For validation/submission: also trims leading/trailing whitespace. */
export function sanitizeText(value: string, maxLength: number): string {
  return sanitizeOnChange(value, maxLength).trim();
}

export function sanitizePhone(value: number, maxLength: number): number {
  const stringValue = value.toString();
  const sanitizedValue = stringValue.replace(CONTROL_CHARS, "").slice(0, maxLength);
  return parseInt(sanitizedValue, 10);
}

export interface GuestFormErrors {
  name?: string;
  email?: string;
  phone?: string;
}

export function validateGuestForm(name: string, email: string, phone: number): GuestFormErrors {
  const errors: GuestFormErrors = {};

  const cleanName = sanitizeText(name, MAX_NAME_LENGTH);
  if (!cleanName) {
    errors.name = "Enter your full name.";
  } else if (cleanName.length < 2) {
    errors.name = "Name is too short.";
  }

  const cleanEmail = sanitizeText(email, MAX_EMAIL_LENGTH);
  if (!cleanEmail) {
    errors.email = "Enter your email address.";
  } else if (!EMAIL_PATTERN.test(cleanEmail)) {
    errors.email = "Enter a valid email address.";
  }

  const cleanPhone = sanitizePhone(phone, MAX_PHONE_LENGTH);
  if (!cleanPhone) {
    errors.phone = "Enter your phone number.";
  } else if (cleanPhone.toString().length < 7) {
    errors.phone = "Phone number is too short.";
  }

  return errors;
}

export function isGuestFormValid(name: string, email: string, phone: number): boolean {
  const errors = validateGuestForm(name, email, phone);
  return Object.keys(errors).length === 0;
}
