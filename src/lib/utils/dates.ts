import { format } from 'date-fns';

/** Converts DD/MM/YYYY → YYYY-MM-DD for API submission. Returns empty string if invalid. */
export function brDateToISO(ddmmyyyy: string): string {
  const parts = ddmmyyyy.replace(/\D/g, '');
  if (parts.length !== 8) return '';
  const day = parts.slice(0, 2);
  const month = parts.slice(2, 4);
  const year = parts.slice(4, 8);
  return `${year}-${month}-${day}`;
}

export function formatBRDate(str: string | null | undefined): string {
  const d = parseBRDate(str);
  return d ? format(d, 'dd/MM/yyyy') : (str ?? '');
}

/**
 * Parses a date string in DD/MM/YYYY or DD/MM/YYYY HH:mm format
 * returned by the API and converts it to a JS Date object.
 */
export function parseBRDate(str: string | null | undefined): Date | null {
  if (!str) return null;
  const [datePart, timePart] = str.split(' ');
  const parts = datePart.split('/');
  if (parts.length !== 3) return null;
  const [day, month, year] = parts.map(Number);
  if (!day || !month || !year) return null;
  if (timePart) {
    const [hours = 0, minutes = 0] = timePart.split(':').map(Number);
    return new Date(year, month - 1, day, hours, minutes);
  }
  return new Date(year, month - 1, day);
}
