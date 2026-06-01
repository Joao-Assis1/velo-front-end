/**
 * Masks a string as CPF (000.000.000-00)
 */
export const maskCPF = (value: string) => {
  return value
    .replace(/\D/g, '')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})/, '$1-$2')
    .replace(/(-\d{2})\d+?$/, '$1');
};

/**
 * Masks a string as Phone ((00) 00000-0000)
 */
export const maskPhone = (value: string) => {
  return value
    .replace(/\D/g, '')
    .replace(/(\d{2})(\d)/, '($1) $2')
    .replace(/(\d{5})(\d)/, '$1-$2')
    .replace(/(-\d{4})\d+?$/, '$1');
};

/**
 * Masks a string as Vehicle Plate (AAA-0000 or AAA-0A00)
 */
export const maskPlate = (value: string) => {
  return value
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '')
    .replace(/^([A-Z]{3})([0-9])/, '$1-$2')
    .substring(0, 8);
};

/**
 * Masks a string as CNH (11 digits)
 */
export const maskCNH = (value: string) => {
  return value
    .replace(/\D/g, '')
    .substring(0, 11);
};

/**
 * Masks a string as RENACH (11 digits)
 */
export const maskRENACH = (value: string) => {
  return value
    .replace(/[^A-Za-z0-9]/g, '')
    .toUpperCase()
    .substring(0, 11);
};

/**
 * Masks a string as Date (DD/MM/YYYY)
 */
export const maskDate = (value: string) => {
  return value
    .replace(/\D/g, '')
    .replace(/(\d{2})(\d)/, '$1/$2')
    .replace(/(\d{2})(\d)/, '$1/$2')
    .replace(/(\/\d{4})\d+?$/, '$1')
    .substring(0, 10);
};

/**
 * Validates if a CPF is formatted correctly (basic length check)
 */
export const isValidCPF = (cpf: string) => {
  const cleanCPF = cpf.replace(/\D/g, '');
  return cleanCPF.length === 11;
};

/**
 * Validates if a Phone is formatted correctly (basic length check)
 */
export const isValidPhone = (phone: string) => {
  const cleanPhone = phone.replace(/\D/g, '');
  return cleanPhone.length === 11;
};

/**
 * Validates if a Vehicle Plate is formatted correctly (Mercosul or Traditional)
 */
export const isValidPlate = (plate: string) => {
  const traditionalRegex = /^[A-Z]{3}-[0-9]{4}$/;
  const mercosulRegex = /^[A-Z]{3}-[0-9][A-Z][0-9]{2}$/;
  return traditionalRegex.test(plate) || mercosulRegex.test(plate);
};

export const maskTime = (value: string): string => {
  const digits = value.replace(/\D/g, '').substring(0, 4);
  return digits.length >= 3 ? `${digits.slice(0, 2)}:${digits.slice(2)}` : digits;
};

export const maskCardNumber = (value: string): string => {
  return value
    .replace(/\D/g, '')
    .substring(0, 16)
    .replace(/(.{4})/g, '$1 ')
    .trim();
};

export const maskCVV = (value: string): string => {
  return value.replace(/\D/g, '').substring(0, 4);
};

/**
 * Applies a pattern mask to a numeric string.
 * Use '#' as digit placeholder. Example: maskPattern("12345678901", "###.###.###-##") → "123.456.789-01"
 */
export const maskCurrency = (value: string): string => {
  const digits = value.replace(/\D/g, '');
  if (!digits) return '';
  const padded = digits.padStart(3, '0');
  const intPart = (padded.slice(0, -2).replace(/^0+/, '') || '0').replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return `${intPart},${padded.slice(-2)}`;
};

export const parseCurrency = (value: string): number => {
  return parseFloat(value.replace(/\./g, '').replace(',', '.')) || 0;
};

export function maskPattern(value: string, pattern: string): string {
  let i = 0;
  const digits = value.replace(/\D/g, "");
  return pattern
    .replace(/#/g, () => digits[i++] ?? "")
    .replace(/[#\-./]+$/, "");
}
