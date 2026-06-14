// calculators/all-platforms.js — Consolidated multi-platform calculator

import { calculateYouTube } from './youtube.js';
import { calculateYTShorts } from './youtube-shorts.js';
import { calculateTikTok } from './tiktok.js';
import { calculateTwitch } from './twitch.js';
import { calculateSpotify } from './spotify.js';
import { calculateInstagram } from './instagram.js';
import { calculateKwai } from './kwai.js';
import { calculateSubstack } from './substack.js';
import { calculatePinterest } from './pinterest.js';

const PLATFORM_COLORS = {
  youtube: 'var(--color-youtube)',
  yt_shorts: 'var(--color-yt-shorts)',
  tiktok: 'var(--color-tiktok)',
  twitch: 'var(--color-twitch)',
  spotify: 'var(--color-spotify)',
  instagram: 'var(--color-instagram)',
  kwai: 'var(--color-kwai)',
  substack: 'var(--color-substack)',
  pinterest: 'var(--color-pinterest)'
};

/**
 * Calculate revenue across all platforms
 * @param {Object} inputs - Input values for all platforms
 * @returns {{ total: number, breakdown: Array<{ platform: string, value: number, color: string }> }}
 */
export function calculateAllPlatforms(inputs) {
  const breakdown = [];

  // YouTube
  const ytResult = calculateYouTube({
    views: inputs.youtube_views || 100000,
    niche: inputs.youtube_niche || 'entertainment',
    location: inputs.youtube_location || 'us_eu',
    midroll: inputs.youtube_midroll || false
  });
  breakdown.push({
    platform: 'YouTube',
    value: ytResult.total,
    color: PLATFORM_COLORS.youtube
  });

  // YouTube Shorts
  const ytsResult = calculateYTShorts({
    views: inputs.yt_shorts_views || 500000
  });
  breakdown.push({
    platform: 'YT Shorts',
    value: ytsResult.total,
    color: PLATFORM_COLORS.yt_shorts
  });

  // TikTok
  const ttResult = calculateTikTok({
    views: inputs.tiktok_views || 500000,
    qualifiedPercent: inputs.tiktok_qualified || 40,
    niche: inputs.tiktok_niche || 'entertainment'
  });
  breakdown.push({
    platform: 'TikTok',
    value: ttResult.total,
    color: PLATFORM_COLORS.tiktok
  });

  // Twitch
  const twResult = calculateTwitch({
    subs: inputs.twitch_subs || 100,
    avgViewers: inputs.twitch_viewers || 50,
    hoursLive: inputs.twitch_hours || 80
  });
  breakdown.push({
    platform: 'Twitch',
    value: twResult.total,
    color: PLATFORM_COLORS.twitch
  });

  // Spotify
  const spResult = calculateSpotify({
    streams: inputs.spotify_streams || 50000
  });
  breakdown.push({
    platform: 'Spotify',
    value: spResult.total,
    color: PLATFORM_COLORS.spotify
  });

  // Instagram
  const igResult = calculateInstagram({
    followers: inputs.instagram_followers || 50000,
    postsPerMonth: inputs.instagram_posts || 10,
    contentType: inputs.instagram_type || 'reels'
  });
  breakdown.push({
    platform: 'Instagram',
    value: igResult.total,
    color: PLATFORM_COLORS.instagram
  });

  // Kwai
  const kwResult = calculateKwai({
    views: inputs.kwai_views || 100000
  });
  breakdown.push({
    platform: 'Kwai',
    value: kwResult.total,
    color: PLATFORM_COLORS.kwai
  });

  // Substack
  const ssResult = calculateSubstack({
    subscribers: inputs.substack_subs || 100,
    pricePerMonth: inputs.substack_price || 10
  });
  breakdown.push({
    platform: 'Substack',
    value: ssResult.total,
    color: PLATFORM_COLORS.substack
  });

  // Pinterest
  const pinResult = calculatePinterest({
    views: inputs.pinterest_views || 100000
  });
  breakdown.push({
    platform: 'Pinterest',
    value: pinResult.total,
    color: PLATFORM_COLORS.pinterest
  });

  const total = breakdown.reduce((sum, item) => sum + item.value, 0);

  return {
    total: Math.round(total * 100) / 100,
    breakdown
  };
}
