// calculators/substack.js — Substack newsletter revenue calculator

const SUBSTACK_COMMISSION = 0.10;

/**
 * Calculate Substack paid newsletter revenue
 * @param {Object} params
 * @param {number} params.subscribers - Number of paid subscribers
 * @param {number} params.pricePerMonth - Monthly subscription price in USD
 * @returns {{ total: number }}
 */
export function calculateSubstack({ subscribers, pricePerMonth }) {
  const grossRevenue = subscribers * pricePerMonth;
  const total = grossRevenue * (1 - SUBSTACK_COMMISSION);

  return {
    total: Math.round(total * 100) / 100
  };
}
