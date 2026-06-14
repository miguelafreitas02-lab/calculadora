// calculators/kwai.js — Kwai Creator Fund revenue calculator

const KWAI_RPM = 0.15;

/**
 * Calculate Kwai Creator Fund revenue
 * @param {Object} params
 * @param {number} params.views - Monthly views
 * @returns {{ total: number }}
 */
export function calculateKwai({ views }) {
  const total = (views / 1000) * KWAI_RPM;

  return {
    total: Math.round(total * 100) / 100
  };
}
