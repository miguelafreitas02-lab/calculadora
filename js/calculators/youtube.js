// calculators/youtube.js — YouTube long-form revenue calculator

const RPM_BY_NICHE = {
  finance: 18,
  education: 12,
  gaming: 8,
  entertainment: 6,
  lifestyle: 5
};

const LOCATION_MULTIPLIER = {
  us_eu: 1.0,
  latam: 0.35,
  asia: 0.25
};

/**
 * Calculate YouTube long-form video revenue
 * @param {Object} params
 * @param {number} params.views - Monthly views
 * @param {string} params.niche - Content niche
 * @param {string} params.location - Audience location
 * @param {boolean} params.midroll - Mid-roll ads enabled
 * @returns {{ total: number, rpm_effective: number }}
 */
export function calculateYouTube({ views, niche, location, midroll }) {
  const rpm = RPM_BY_NICHE[niche] || 6;
  const locMultiplier = LOCATION_MULTIPLIER[location] || 1.0;
  const midrollMultiplier = midroll ? 1.4 : 1.0;

  const rpmEffective = rpm * locMultiplier * midrollMultiplier;
  const total = (views / 1000) * rpmEffective;

  return {
    total: Math.round(total * 100) / 100,
    rpm_effective: Math.round(rpmEffective * 100) / 100
  };
}
