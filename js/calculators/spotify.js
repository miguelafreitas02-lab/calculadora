// calculators/spotify.js — Spotify streams revenue calculator

const RATE_PER_STREAM = 0.004;

/**
 * Calculate Spotify stream revenue
 * @param {Object} params
 * @param {number} params.streams - Monthly streams
 * @returns {{ total: number }}
 */
export function calculateSpotify({ streams }) {
  const total = streams * RATE_PER_STREAM;

  return {
    total: Math.round(total * 100) / 100
  };
}
