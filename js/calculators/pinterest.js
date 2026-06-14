// calculators/pinterest.js — Pinterest Creator Rewards revenue calculator

const PINTEREST_CPM = 1.50;

/**
 * Calculate Pinterest Creator Rewards revenue
 * @param {Object} params
 * @param {number} params.views - Monthly views
 * @returns {{ total: number }}
 */
export function calculatePinterest({ views }) {
  const total = (views / 1000) * PINTEREST_CPM;

  return {
    total: Math.round(total * 100) / 100
  };
}
