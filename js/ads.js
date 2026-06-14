// ads.js — AdSense lazy-loading module

/**
 * Initialize ad containers with placeholder text
 */
function setupAdSlots() {
  const slots = document.querySelectorAll('.ad-container');
  slots.forEach(slot => {
    // Add accessible label
    slot.setAttribute('aria-hidden', 'true');
    slot.setAttribute('role', 'complementary');
    slot.setAttribute('aria-label', 'Advertisement');
  });
}

/**
 * Lazy load AdSense script after initial render
 * Delayed by 2 seconds to not impact LCP
 */
function loadAdSense() {
  // In production, replace with real AdSense publisher ID
  // This is a placeholder that won't load actual ads
  // Uncomment and configure when deploying:
  /*
  const script = document.createElement('script');
  script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js';
  script.async = true;
  script.crossOrigin = 'anonymous';
  script.dataset.adClient = 'ca-pub-XXXXXXXXXXXXXXXX';
  document.head.appendChild(script);
  */
}

/**
 * Initialize ads module
 */
export function initAds() {
  setupAdSlots();

  // Lazy load AdSense after 2 seconds
  setTimeout(() => {
    loadAdSense();
  }, 2000);
}
