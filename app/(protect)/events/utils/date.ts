/**
 * Convert "DD/MM/YYYY" (DatePicker format) → "YYYY-MM-DD" (API format)
 */
export function toApiDate(ddmmyyyy: string): string {
  if (!ddmmyyyy) return ddmmyyyy;
  const [dd, mm, yyyy] = ddmmyyyy.split("/");
  if (!dd || !mm || !yyyy) return ddmmyyyy;
  return `${yyyy}-${mm}-${dd}`;
}

/**
 * Convert ISO date string (API format) → "DD/MM/YYYY" (DatePicker format)
 */
export function fromApiDate(iso: string | null | undefined): string {
  if (!iso) return "";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  const dd = String(date.getDate()).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const yyyy = date.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
}