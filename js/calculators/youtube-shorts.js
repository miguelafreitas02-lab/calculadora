// calculators/youtube-shorts.js — YouTube Shorts revenue calculator

const SHORTS_RPM = 0.05;

/**
 * Calculate YouTube Shorts Creator Pool revenue
 * @param {Object} params
 * @param {number} params.views - Monthly views
 * @returns {{ total: number }}
 */
export function calculateYTShorts({ views }) {
  const total = (views / 1000) * SHORTS_RPM;

  return {
    total: Math.round(total * 100) / 100
  };
}
