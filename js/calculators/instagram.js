// calculators/instagram.js — Instagram revenue calculator

const CPM_BY_TYPE = {
  reels: 12,
  feed: 8,
  stories: 5
};

const ENGAGEMENT_RATE = 0.035;

/**
 * Calculate Instagram estimated revenue
 * @param {Object} params
 * @param {number} params.followers - Total followers
 * @param {number} params.postsPerMonth - Posts per month
 * @param {string} params.contentType - Content type (reels, feed, stories)
 * @returns {{ total: number }}
 */
export function calculateInstagram({ followers, postsPerMonth, contentType }) {
  const cpm = CPM_BY_TYPE[contentType] || 8;
  const engagedAudience = followers * ENGAGEMENT_RATE;
  const total = (engagedAudience / 1000) * cpm * postsPerMonth;

  return {
    total: Math.round(total * 100) / 100
  };
}
