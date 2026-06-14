// calculators/twitch.js — Twitch revenue calculator

const SUB_REVENUE_PER_SUB = 2.50;
const AD_CPM = 3.50;
const ADS_PER_HOUR = 3;

/**
 * Calculate Twitch revenue from subs and ads
 * @param {Object} params
 * @param {number} params.subs - Tier 1 subscriber count
 * @param {number} params.avgViewers - Average concurrent viewers
 * @param {number} params.hoursLive - Hours streamed per month
 * @returns {{ total: number, revenueSubs: number, revenueAds: number }}
 */
export function calculateTwitch({ subs, avgViewers, hoursLive }) {
  const revenueSubs = subs * SUB_REVENUE_PER_SUB;
  const revenueAds = (avgViewers * ADS_PER_HOUR * hoursLive / 1000) * AD_CPM;
  const total = revenueSubs + revenueAds;

  return {
    total: Math.round(total * 100) / 100,
    revenueSubs: Math.round(revenueSubs * 100) / 100,
    revenueAds: Math.round(revenueAds * 100) / 100
  };
}
