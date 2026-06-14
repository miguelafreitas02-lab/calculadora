// ui/formatter.js — Number and currency formatting utilities

/**
 * Abbreviate large numbers: 1500000 → "1.5M", 200000 → "200K"
 */
export function abbreviateNumber(num) {
  if (num === null || num === undefined || isNaN(num)) return '0';

  const absNum = Math.abs(num);
  const sign = num < 0 ? '-' : '';

  if (absNum >= 1e9) {
    return sign + (absNum / 1e9).toFixed(1).replace(/\.0$/, '') + 'B';
  }
  if (absNum >= 1e6) {
    return sign + (absNum / 1e6).toFixed(1).replace(/\.0$/, '') + 'M';
  }
  if (absNum >= 1e3) {
    return sign + (absNum / 1e3).toFixed(1).replace(/\.0$/, '') + 'K';
  }
  return sign + Math.round(absNum).toString();
}

/**
 * Format a number with locale-appropriate thousand separators
 */
export function formatNumber(num, decimals = 0) {
  if (isNaN(num)) return '0';
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(num);
}

/**
 * Convert a linear slider position (0-1) to a logarithmic value
 */
export function logScale(linearPos, min, max) {
  const logMin = Math.log10(min);
  const logMax = Math.log10(max);
  return Math.pow(10, linearPos * (logMax - logMin) + logMin);
}

/**
 * Convert a logarithmic value to a linear slider position (0-1)
 */
export function logScaleInverse(value, min, max) {
  const logMin = Math.log10(min);
  const logMax = Math.log10(max);
  return (Math.log10(value) - logMin) / (logMax - logMin);
}
