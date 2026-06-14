// calculators/tiktok.js — TikTok Creativity Program revenue calculator

const RPM_BY_NICHE = {
  finance: 0.55,
  education: 0.45,
  entertainment: 0.33,
  gaming: 0.28,
  lifestyle: 0.25
};

/**
 * Calculate TikTok Creativity Program revenue
 * @param {Object} params
 * @param {number} params.views - Monthly views
 * @param {number} params.qualifiedPercent - Percentage of views that qualify (10-80)
 * @param {string} params.niche - Content niche
 * @returns {{ total: number, qualifiedViews: number }}
 */
export function calculateTikTok({ views, qualifiedPercent, niche }) {
  const rpm = RPM_BY_NICHE[niche] || 0.33;
  const qualifiedViews = views * (qualifiedPercent / 100);
  const total = (qualifiedViews / 1000) * rpm;

  return {
    total: Math.round(total * 100) / 100,
    qualifiedViews: Math.round(qualifiedViews)
  };
}
