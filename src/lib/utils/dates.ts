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

  // Extract only the date part and set it to 12:00 PM (noon) to avoid any timezone shifts
  // between the Vercel server (UTC) and the client browser (BRT).
  if (str.includes('T')) {
    const datePart = str.split('T')[0];
    const [year, month, day] = datePart.split('-').map(Number);
    if (year && month && day) {
      return new Date(year, month - 1, day, 12, 0, 0);
    }
  }

  const [datePart, timePart] = str.split(' ');
  const parts = datePart.split('/');
  if (parts.length !== 3) return null;
  const [day, month, year] = parts.map(Number);
  if (!day || !month || !year) return null;
  if (timePart) {
    const [hours = 0, minutes = 0] = timePart.split(':').map(Number);
    return new Date(year, month - 1, day, hours, minutes);
  }
  return new Date(year, month - 1, day, 12, 0, 0);
}
