/**
 * Convert "DD/MM/YYYY" (DatePicker format) → "YYYY-MM-DD" (API format)
 */
export function toApiDate(ddmmyyyy: string): string {
  if (!ddmmyyyy) return ddmmyyyy;
  const [dd, mm, yyyy] = ddmmyyyy.split("/");
  if (!dd || !mm || !yyyy) return ddmmyyyy;
  return `${yyyy}-${mm}-${dd}`;
}