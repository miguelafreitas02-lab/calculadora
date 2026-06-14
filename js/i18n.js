// i18n.js — Internationalization module

let currentTranslations = {};
let currentLang = 'en-US';

const RTL_LANGUAGES = ['ar'];

/**
 * Detect the user's preferred language on first visit
 * Falls back to en-US if no match
 */
function detectLanguage() {
  const stored = localStorage.getItem('preferred-language');
  if (stored) return stored;

  const browserLang = navigator.language || navigator.languages?.[0] || 'en-US';
  const supported = ['pt-BR', 'en-US', 'es', 'fr', 'de', 'ja', 'ko', 'hi', 'ar'];

  // Exact match
  if (supported.includes(browserLang)) return browserLang;

  // Prefix match (e.g. 'pt' matches 'pt-BR')
  const prefix = browserLang.split('-')[0];
  const match = supported.find(lang => lang.startsWith(prefix));
  if (match) return match;

  return 'en-US';
}

/**
 * Fetch and cache translation JSON for a given language
 */
async function loadTranslations(lang) {
  try {
    const response = await fetch(`./lang/${lang}.json`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    currentTranslations = await response.json();
    currentLang = lang;
    localStorage.setItem('preferred-language', lang);
  } catch (err) {
    // Fallback to en-US if requested language fails
    if (lang !== 'en-US') {
      await loadTranslations('en-US');
      return;
    }
    currentTranslations = {};
  }
}

/**
 * Get a translation by dot-separated key path
 * e.g. t('youtube.title') -> translations.youtube.title
 */
export function t(key) {
  const keys = key.split('.');
  let result = currentTranslations;
  for (const k of keys) {
    if (result && typeof result === 'object' && k in result) {
      result = result[k];
    } else {
      return key; // Return key as fallback
    }
  }
  return typeof result === 'string' ? result : key;
}

/**
 * Apply translations to all DOM elements with data-i18n attribute
 */
function applyTranslations() {
  // Text content
  const elements = document.querySelectorAll('[data-i18n]');
  elements.forEach(el => {
    const key = el.getAttribute('data-i18n');
    const translated = t(key);
    if (translated !== key) {
      el.textContent = translated;
    }
  });

  // Attributes (placeholder, aria-label, title)
  const attrElements = document.querySelectorAll('[data-i18n-attr]');
  attrElements.forEach(el => {
    const mappings = el.getAttribute('data-i18n-attr').split(';');
    mappings.forEach(mapping => {
      const [attr, key] = mapping.split(':');
      if (attr && key) {
        const translated = t(key.trim());
        if (translated !== key.trim()) {
          el.setAttribute(attr.trim(), translated);
        }
      }
    });
  });

  // Update page metadata
  const metaTitle = t('meta.title');
  if (metaTitle !== 'meta.title') {
    document.title = metaTitle;
  }

  const metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc) {
    const desc = t('meta.description');
    if (desc !== 'meta.description') {
      metaDesc.setAttribute('content', desc);
    }
  }
}

/**
 * Set document direction for RTL languages
 */
function applyDirection(lang) {
  const isRTL = RTL_LANGUAGES.includes(lang);
  document.documentElement.setAttribute('dir', isRTL ? 'rtl' : 'ltr');
  document.documentElement.setAttribute('lang', lang);
}

/**
 * Initialize i18n system
 */
export async function initI18n() {
  const lang = detectLanguage();
  await setLanguage(lang);
  return lang;
}

/**
 * Change language at runtime
 */
export async function setLanguage(lang) {
  await loadTranslations(lang);
  applyDirection(lang);
  applyTranslations();

  // Dispatch event for other modules to react
  window.dispatchEvent(new CustomEvent('language-changed', { detail: { lang } }));
}

/**
 * Get the current language code
 */
export function getCurrentLanguage() {
  return currentLang;
}
