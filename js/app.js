// app.js — Main application orchestrator

import { initI18n, setLanguage, t } from './i18n.js';
import { initTheme } from './theme.js';
import { initCurrency } from './currency.js';
import { initShare } from './share.js';
import { initAds } from './ads.js';
import { initTabs, getActiveTab } from './ui/tabs.js';
import { initSlider, getSliderValue } from './ui/sliders.js';
import { initTooltips } from './ui/tooltips.js';
import { renderResults, renderAllPlatformsResults, refreshResultsForCurrency } from './ui/results.js';

import { calculateYouTube } from './calculators/youtube.js';
import { calculateYTShorts } from './calculators/youtube-shorts.js';
import { calculateTikTok } from './calculators/tiktok.js';
import { calculateTwitch } from './calculators/twitch.js';
import { calculateSpotify } from './calculators/spotify.js';
import { calculateInstagram } from './calculators/instagram.js';
import { calculateKwai } from './calculators/kwai.js';
import { calculateSubstack } from './calculators/substack.js';
import { calculatePinterest } from './calculators/pinterest.js';
import { calculateAllPlatforms } from './calculators/all-platforms.js';

// ===== Initialization =====

async function initApp() {
  // 1. i18n
  await initI18n();

  // 2. Theme
  initTheme();

  // 3. Currency
  await initCurrency();

  // 4. Tabs
  initTabs(onTabChange);

  // 5. Sliders
  initAllCalculatorSliders();

  // 6. Tooltips
  initTooltips();

  // 7. Share
  initShare();

  // 8. Ads
  initAds();

  // Register global listeners
  registerEventListeners();

  // Initial calculation
  recalculate();

  // Add animate-in class to main sections
  document.querySelectorAll('.animate-target').forEach(el => {
    el.classList.add('animate-in');
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}

// ===== Slider Initialization =====

function initAllCalculatorSliders() {
  // YouTube
  const ytViews = document.getElementById('yt-views');
  if (ytViews) initSlider(ytViews, { min: 1000, max: 10000000, defaultValue: 100000, isLog: true });

  // YouTube Shorts
  const ytsViews = document.getElementById('yts-views');
  if (ytsViews) initSlider(ytsViews, { min: 10000, max: 500000000, defaultValue: 1000000, isLog: true });

  // TikTok
  const ttViews = document.getElementById('tt-views');
  if (ttViews) initSlider(ttViews, { min: 10000, max: 100000000, defaultValue: 500000, isLog: true });

  const ttQualified = document.getElementById('tt-qualified');
  if (ttQualified) initSlider(ttQualified, { min: 10, max: 80, defaultValue: 40, isLog: false, step: 1 });

  // Twitch
  const twSubs = document.getElementById('tw-subs');
  if (twSubs) initSlider(twSubs, { min: 0, max: 50000, defaultValue: 100, isLog: false, step: 10 });

  const twViewers = document.getElementById('tw-viewers');
  if (twViewers) initSlider(twViewers, { min: 1, max: 100000, defaultValue: 50, isLog: true });

  const twHours = document.getElementById('tw-hours');
  if (twHours) initSlider(twHours, { min: 1, max: 300, defaultValue: 80, isLog: false, step: 1 });

  // Spotify
  const spStreams = document.getElementById('sp-streams');
  if (spStreams) initSlider(spStreams, { min: 1000, max: 100000000, defaultValue: 50000, isLog: true });

  // Instagram
  const igFollowers = document.getElementById('ig-followers');
  if (igFollowers) initSlider(igFollowers, { min: 1000, max: 10000000, defaultValue: 50000, isLog: true });

  const igPosts = document.getElementById('ig-posts');
  if (igPosts) initSlider(igPosts, { min: 1, max: 30, defaultValue: 10, isLog: false, step: 1 });

  // Kwai
  const kwViews = document.getElementById('kw-views');
  if (kwViews) initSlider(kwViews, { min: 10000, max: 50000000, defaultValue: 100000, isLog: true });

  // Substack
  const ssSubs = document.getElementById('ss-subs');
  if (ssSubs) initSlider(ssSubs, { min: 0, max: 50000, defaultValue: 100, isLog: false, step: 10 });

  const ssPrice = document.getElementById('ss-price');
  if (ssPrice) initSlider(ssPrice, { min: 5, max: 50, defaultValue: 10, isLog: false, step: 1, prefix: '$' });

  // Pinterest
  const pinViews = document.getElementById('pin-views');
  if (pinViews) initSlider(pinViews, { min: 10000, max: 100000000, defaultValue: 100000, isLog: true });

  // All Platforms (simplified sliders)
  const allYtViews = document.getElementById('all-yt-views');
  if (allYtViews) initSlider(allYtViews, { min: 1000, max: 10000000, defaultValue: 100000, isLog: true });

  const allYtsViews = document.getElementById('all-yts-views');
  if (allYtsViews) initSlider(allYtsViews, { min: 10000, max: 500000000, defaultValue: 1000000, isLog: true });

  const allTtViews = document.getElementById('all-tt-views');
  if (allTtViews) initSlider(allTtViews, { min: 10000, max: 100000000, defaultValue: 500000, isLog: true });

  const allTwSubs = document.getElementById('all-tw-subs');
  if (allTwSubs) initSlider(allTwSubs, { min: 0, max: 50000, defaultValue: 100, isLog: false, step: 10 });

  const allSpStreams = document.getElementById('all-sp-streams');
  if (allSpStreams) initSlider(allSpStreams, { min: 1000, max: 100000000, defaultValue: 50000, isLog: true });

  const allIgFollowers = document.getElementById('all-ig-followers');
  if (allIgFollowers) initSlider(allIgFollowers, { min: 1000, max: 10000000, defaultValue: 50000, isLog: true });

  const allKwViews = document.getElementById('all-kw-views');
  if (allKwViews) initSlider(allKwViews, { min: 10000, max: 50000000, defaultValue: 100000, isLog: true });

  const allSsSubs = document.getElementById('all-ss-subs');
  if (allSsSubs) initSlider(allSsSubs, { min: 0, max: 50000, defaultValue: 100, isLog: false, step: 10 });

  const allPinViews = document.getElementById('all-pin-views');
  if (allPinViews) initSlider(allPinViews, { min: 10000, max: 100000000, defaultValue: 100000, isLog: true });
}

// ===== Event Listeners =====

function registerEventListeners() {
  // Listen for any slider change to recalculate
  document.addEventListener('slider-change', () => {
    recalculate();
  });

  // Listen for select/radio/toggle changes
  document.querySelectorAll('.custom-select').forEach(select => {
    select.addEventListener('change', () => recalculate());
  });

  document.querySelectorAll('input[type="radio"]').forEach(radio => {
    radio.addEventListener('change', () => recalculate());
  });

  document.querySelectorAll('.toggle-switch input').forEach(toggle => {
    toggle.addEventListener('change', () => recalculate());
  });

  // Currency change
  window.addEventListener('currency-changed', () => {
    recalculate();
  });

  // Language change
  window.addEventListener('language-changed', () => {
    // Re-render results labels are updated via data-i18n attributes
    recalculate();
  });

  // Language selector
  const langSelect = document.getElementById('language-select');
  if (langSelect) {
    langSelect.addEventListener('change', (e) => {
      setLanguage(e.target.value);
    });
  }

  // Pro Modal Interactions
  const proModal = document.getElementById('pro-modal');
  const closeProModal = document.getElementById('close-pro-modal');
  const openProButtons = document.querySelectorAll('.open-pro-modal');

  if (proModal) {
    openProButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        proModal.showModal();
      });
    });

    if (closeProModal) {
      closeProModal.addEventListener('click', () => {
        proModal.close();
      });
    }

    // Close when clicking outside of the modal container
    proModal.addEventListener('click', (e) => {
      const rect = proModal.getBoundingClientRect();
      const inDialog = (
        rect.top <= e.clientY &&
        e.clientY <= rect.top + rect.height &&
        rect.left <= e.clientX &&
        e.clientX <= rect.left + rect.width
      );
      if (!inDialog) {
        proModal.close();
      }
    });
  }
}

// ===== Tab Change Handler =====

function onTabChange(tabId) {
  recalculate();
}

// ===== Recalculate =====

function recalculate() {
  const activeTab = getActiveTab();

  switch (activeTab) {
    case 'youtube':
      recalculateYouTube();
      break;
    case 'yt-shorts':
      recalculateYTShorts();
      break;
    case 'tiktok':
      recalculateTikTok();
      break;
    case 'twitch':
      recalculateTwitch();
      break;
    case 'spotify':
      recalculateSpotify();
      break;
    case 'instagram':
      recalculateInstagram();
      break;
    case 'kwai':
      recalculateKwai();
      break;
    case 'substack':
      recalculateSubstack();
      break;
    case 'pinterest':
      recalculatePinterest();
      break;
    case 'all':
      recalculateAll();
      break;
  }
}

function recalculateYouTube() {
  const views = getSliderValue(document.getElementById('yt-views'));
  const niche = document.getElementById('yt-niche')?.value || 'entertainment';
  const location = document.querySelector('input[name="yt-location"]:checked')?.value || 'us_eu';
  const midroll = document.getElementById('yt-midroll')?.checked || false;

  const result = calculateYouTube({ views, niche, location, midroll });

  const rpmEl = document.getElementById('yt-rpm-value');
  if (rpmEl) rpmEl.textContent = `$${result.rpm_effective.toFixed(2)}`;

  renderResults(result.total, [
    { label: 'YouTube Ad Revenue', value: result.total, color: 'var(--color-youtube)' }
  ]);
}

function recalculateYTShorts() {
  const views = getSliderValue(document.getElementById('yts-views'));
  const result = calculateYTShorts({ views });

  renderResults(result.total, [
    { label: 'YT Shorts Creator Pool', value: result.total, color: 'var(--color-yt-shorts)' }
  ]);
}

function recalculateTikTok() {
  const views = getSliderValue(document.getElementById('tt-views'));
  const qualifiedPercent = getSliderValue(document.getElementById('tt-qualified'));
  const niche = document.getElementById('tt-niche')?.value || 'entertainment';

  const result = calculateTikTok({ views, qualifiedPercent, niche });

  renderResults(result.total, [
    { label: 'TikTok Creativity Program', value: result.total, color: 'var(--color-tiktok)' }
  ]);
}

function recalculateTwitch() {
  const subs = getSliderValue(document.getElementById('tw-subs'));
  const avgViewers = getSliderValue(document.getElementById('tw-viewers'));
  const hoursLive = getSliderValue(document.getElementById('tw-hours'));

  const result = calculateTwitch({ subs, avgViewers, hoursLive });

  renderResults(result.total, [
    { label: t('twitch.revenue_subs'), value: result.revenueSubs, color: 'var(--color-twitch)' },
    { label: t('twitch.revenue_ads'), value: result.revenueAds, color: '#B388FF' }
  ]);
}

function recalculateSpotify() {
  const streams = getSliderValue(document.getElementById('sp-streams'));
  const result = calculateSpotify({ streams });

  renderResults(result.total, [
    { label: 'Spotify Streams', value: result.total, color: 'var(--color-spotify)' }
  ]);
}

function recalculateInstagram() {
  const followers = getSliderValue(document.getElementById('ig-followers'));
  const postsPerMonth = getSliderValue(document.getElementById('ig-posts'));
  const contentType = document.getElementById('ig-type')?.value || 'reels';

  const result = calculateInstagram({ followers, postsPerMonth, contentType });

  renderResults(result.total, [
    { label: 'Instagram Revenue', value: result.total, color: 'var(--color-instagram)' }
  ]);
}

function recalculateKwai() {
  const views = getSliderValue(document.getElementById('kw-views'));
  const result = calculateKwai({ views });

  renderResults(result.total, [
    { label: 'Kwai Creator Fund', value: result.total, color: 'var(--color-kwai)' }
  ]);
}

function recalculateSubstack() {
  const subscribers = getSliderValue(document.getElementById('ss-subs'));
  const pricePerMonth = getSliderValue(document.getElementById('ss-price'));

  const result = calculateSubstack({ subscribers, pricePerMonth });

  renderResults(result.total, [
    { label: 'Substack Newsletter', value: result.total, color: 'var(--color-substack)' }
  ]);
}

function recalculatePinterest() {
  const views = getSliderValue(document.getElementById('pin-views'));
  const result = calculatePinterest({ views });

  renderResults(result.total, [
    { label: 'Pinterest Creator Rewards', value: result.total, color: 'var(--color-pinterest)' }
  ]);
}

function recalculateAll() {
  const inputs = {
    youtube_views: getSliderValue(document.getElementById('all-yt-views')),
    youtube_niche: 'entertainment',
    youtube_location: 'us_eu',
    youtube_midroll: false,
    yt_shorts_views: getSliderValue(document.getElementById('all-yts-views')),
    tiktok_views: getSliderValue(document.getElementById('all-tt-views')),
    tiktok_qualified: 40,
    tiktok_niche: 'entertainment',
    twitch_subs: getSliderValue(document.getElementById('all-tw-subs')),
    twitch_viewers: 50,
    twitch_hours: 80,
    spotify_streams: getSliderValue(document.getElementById('all-sp-streams')),
    instagram_followers: getSliderValue(document.getElementById('all-ig-followers')),
    instagram_posts: 10,
    instagram_type: 'reels',
    kwai_views: getSliderValue(document.getElementById('all-kw-views')),
    substack_subs: getSliderValue(document.getElementById('all-ss-subs')),
    substack_price: 10,
    pinterest_views: getSliderValue(document.getElementById('all-pin-views'))
  };

  const result = calculateAllPlatforms(inputs);
  renderAllPlatformsResults(result.total, result.breakdown);
}
