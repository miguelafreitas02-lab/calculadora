// share.js — URL sharing and clipboard module

/**
 * Collect all current input values from the active platform calculators
 */
function collectInputValues() {
  const data = {};

  // Collect all sliders
  const sliders = document.querySelectorAll('.custom-slider');
  sliders.forEach(slider => {
    if (slider.id) {
      data[slider.id] = slider.value;
    }
  });

  // Collect all selects
  const selects = document.querySelectorAll('.calculator-panel select');
  selects.forEach(select => {
    if (select.id) {
      data[select.id] = select.value;
    }
  });

  // Collect all radio buttons
  const radios = document.querySelectorAll('.calculator-panel input[type="radio"]:checked');
  radios.forEach(radio => {
    if (radio.name) {
      data[radio.name] = radio.value;
    }
  });

  // Collect all toggles
  const toggles = document.querySelectorAll('.calculator-panel input[type="checkbox"]');
  toggles.forEach(toggle => {
    if (toggle.id) {
      data[toggle.id] = toggle.checked;
    }
  });

  // Save active tab
  const activeTab = document.querySelector('.tab-btn[aria-selected="true"]');
  if (activeTab) {
    data._activeTab = activeTab.getAttribute('data-tab');
  }

  return data;
}

/**
 * Apply input values from decoded share data
 */
function applyInputValues(data) {
  if (!data || typeof data !== 'object') return;

  // Apply slider values
  Object.entries(data).forEach(([key, value]) => {
    if (key.startsWith('_')) return;

    const el = document.getElementById(key);
    if (!el) return;

    if (el.type === 'range') {
      el.value = value;
      el.dispatchEvent(new Event('input', { bubbles: true }));
    } else if (el.tagName === 'SELECT') {
      el.value = value;
      el.dispatchEvent(new Event('change', { bubbles: true }));
    } else if (el.type === 'checkbox') {
      el.checked = !!value;
      el.dispatchEvent(new Event('change', { bubbles: true }));
    }
  });

  // Apply radio values
  Object.entries(data).forEach(([key, value]) => {
    if (key.startsWith('_')) return;

    const radio = document.querySelector(`input[type="radio"][name="${key}"][value="${value}"]`);
    if (radio) {
      radio.checked = true;
      radio.dispatchEvent(new Event('change', { bubbles: true }));
    }
  });

  // Switch to the saved tab
  if (data._activeTab) {
    const tab = document.querySelector(`.tab-btn[data-tab="${data._activeTab}"]`);
    if (tab) {
      tab.click();
    }
  }
}

/**
 * Generate a shareable URL with all current input values
 */
export function generateShareURL() {
  const data = collectInputValues();
  const json = JSON.stringify(data);
  const base64 = btoa(unescape(encodeURIComponent(json)));
  const url = new URL(window.location.href);
  url.searchParams.set('data', base64);
  // Remove hash if present
  url.hash = '';
  return url.toString();
}

/**
 * Load shared data from URL on initialization
 */
export function loadFromShareURL() {
  const url = new URL(window.location.href);
  const encodedData = url.searchParams.get('data');
  if (!encodedData) return false;

  try {
    const json = decodeURIComponent(escape(atob(encodedData)));
    const data = JSON.parse(json);
    // Wait for DOM to be ready, then apply
    requestAnimationFrame(() => {
      applyInputValues(data);
    });
    return true;
  } catch {
    return false;
  }
}

/**
 * Copy text to clipboard with visual feedback
 */
export async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Fallback for older browsers
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.left = '-9999px';
    document.body.appendChild(textarea);
    textarea.select();
    try {
      document.execCommand('copy');
      document.body.removeChild(textarea);
      return true;
    } catch {
      document.body.removeChild(textarea);
      return false;
    }
  }
}

/**
 * Initialize share functionality with button listeners
 */
export function initShare() {
  const shareBtn = document.getElementById('share-btn');
  const copyBtn = document.getElementById('copy-btn');
  const shareUrlDisplay = document.getElementById('share-url-display');

  if (shareBtn) {
    shareBtn.addEventListener('click', () => {
      const url = generateShareURL();
      if (shareUrlDisplay) {
        shareUrlDisplay.textContent = url;
        shareUrlDisplay.classList.add('visible');
      }
    });
  }

  if (copyBtn) {
    copyBtn.addEventListener('click', async () => {
      const url = generateShareURL();
      const success = await copyToClipboard(url);
      if (success) {
        const originalText = copyBtn.textContent;
        copyBtn.textContent = '✓';
        copyBtn.classList.add('copy-success-anim');
        setTimeout(() => {
          copyBtn.textContent = originalText;
          copyBtn.classList.remove('copy-success-anim');
        }, 2000);
      }
    });
  }

  // Load shared data if present in URL
  loadFromShareURL();
}
