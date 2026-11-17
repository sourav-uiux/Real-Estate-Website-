export interface InquiryFormData {
  fullName: string;
  email: string;
  phone: string;
  preferredDate: string;
  message: string;
}

export interface InquiryValidationErrors {
  fullName?: string;
  email?: string;
  phone?: string;
  preferredDate?: string;
  message?: string;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_DIGIT_PATTERN = /\d/g;

export function validateInquiryForm(
  data: InquiryFormData,
  referenceDateIso = new Date().toISOString().slice(0, 10),
): InquiryValidationErrors {
  const errors: InquiryValidationErrors = {};

  const trimmedName = data.fullName.trim();
  if (trimmedName.length < 2) {
    errors.fullName = 'Please enter your full name.';
  }

  const trimmedEmail = data.email.trim();
  if (!trimmedEmail) {
    errors.email = 'Please enter a valid email address.';
  } else if (!EMAIL_PATTERN.test(trimmedEmail)) {
    errors.email = 'Email format appears incomplete (e.g., name@domain.com).';
  }

  const trimmedPhone = data.phone.trim();
  const digitsCount = (trimmedPhone.match(PHONE_DIGIT_PATTERN) ?? []).length;
  if (!trimmedPhone) {
    errors.phone = 'Please provide a telephone number for private coordination.';
  } else if (digitsCount < 7) {
    errors.phone = 'Telephone number must contain at least 7 digits.';
  }

  const trimmedDate = data.preferredDate.trim();
  if (!trimmedDate) {
    errors.preferredDate = 'Please select a preferred viewing date.';
  } else if (trimmedDate < referenceDateIso) {
    errors.preferredDate = 'Preferred viewing date must be today or in the future.';
  }

  const trimmedMessage = data.message.trim();
  if (trimmedMessage.length > 0 && trimmedMessage.length < 10) {
    errors.message = 'If including a note, please provide at least 10 characters.';
  }

  return errors;
}

export function isInquiryValid(errors: InquiryValidationErrors): boolean {
  return Object.keys(errors).length === 0;
}

export function filterGalleryByCategory<T extends { category: string }>(
  items: readonly T[],
  category: string,
): T[] {
  if (category === 'All') {
    return [...items];
  }
  return items.filter((item) => item.category === category);
}
