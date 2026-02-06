export interface CustomRangeValidationResult {
  valid: boolean;
  error?: string;
}

export function validateCustomRange(
  from?: string,
  to?: string,
  maxDays = 365
): CustomRangeValidationResult {
  if (!from || !to) {
    return { valid: true };
  }

  const fromDate = new Date(from);
  const toDate = new Date(to);

  if (isNaN(fromDate.getTime()) || isNaN(toDate.getTime())) {
    return { valid: false, error: "Invalid date format." };
  }

  if (fromDate > toDate) {
    return { valid: false, error: "Start date must be before end date." };
  }

  const diffMs = toDate.getTime() - fromDate.getTime();
  const maxMs = maxDays * 24 * 60 * 60 * 1000;

  if (diffMs > maxMs) {
    return {
      valid: false,
      error: `Custom range cannot exceed ${maxDays} days.`,
    };
  }

  return { valid: true };
}
