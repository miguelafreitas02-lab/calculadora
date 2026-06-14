// currency.js — Currency conversion module

const FALLBACK_RATES = {
  USD: 1,
  BRL: 5.05,
  EUR: 0.92,
  GBP: 0.79,
  JPY: 149.50,
  KRW: 1320.00,
  INR: 83.10,
  ARS: 870.00,
  MXN: 17.15,
  CAD: 1.36,
  AUD: 1.53
};

const CURRENCY_SYMBOLS = {
  USD: '$',
  BRL: 'R$',
  EUR: '€',
  GBP: '£',
  JPY: '¥',
  KRW: '₩',
  INR: '₹',
  ARS: 'ARS$',
  MXN: 'MX$',
  CAD: 'CA$',
  AUD: 'A$'
};

const CURRENCY_LOCALES = {
  USD: 'en-US',
  BRL: 'pt-BR',
  EUR: 'de-DE',
  GBP: 'en-GB',
  JPY: 'ja-JP',
  KRW: 'ko-KR',
  INR: 'hi-IN',
  ARS: 'es-AR',
  MXN: 'es-MX',
  CAD: 'en-CA',
  AUD: 'en-AU'
};

let rates = { ...FALLBACK_RATES };
let currentCurrency = 'USD';
const CACHE_KEY = 'currency-rates';
const CACHE_TTL = 3600000; // 1 hour in ms

/**
 * Fetch live exchange rates with caching
 */
async function fetchRates() {
  // Check sessionStorage cache first
  const cached = sessionStorage.getItem(CACHE_KEY);
  if (cached) {
    try {
      const data = JSON.parse(cached);
      if (Date.now() - data.timestamp < CACHE_TTL) {
        rates = data.rates;
        return;
      }
    } catch {
      // Cache corrupted, continue to fetch
    }
  }

  try {
    const response = await fetch('https://open.er-api.com/v6/latest/USD');
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();

    if (data && data.rates) {
      // Only keep supported currencies
      const supported = Object.keys(FALLBACK_RATES);
      supported.forEach(code => {
        if (data.rates[code]) {
          rates[code] = data.rates[code];
        }
      });

      // Cache the result
      sessionStorage.setItem(CACHE_KEY, JSON.stringify({
        rates: { ...rates },
        timestamp: Date.now()
      }));
    }
  } catch {
    // Use fallback rates silently
    rates = { ...FALLBACK_RATES };
  }
}

/**
 * Convert an amount from USD to target currency
 */
export function convertCurrency(amountUSD, targetCurrency) {
  const rate = rates[targetCurrency] || 1;
  return amountUSD * rate;
}

/**
 * Get the symbol for a currency code
 */
export function getCurrencySymbol(code) {
  return CURRENCY_SYMBOLS[code] || code;
}

/**
 * Format a currency value with proper locale formatting
 */
export function formatCurrency(amount, code) {
  const locale = CURRENCY_LOCALES[code] || 'en-US';
  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: code,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  } catch {
    return `${getCurrencySymbol(code)}${amount.toFixed(2)}`;
  }
}

/**
 * Get the current selected currency
 */
export function getCurrentCurrency() {
  return currentCurrency;
}

/**
 * Set the current currency and notify listeners
 */
export function setCurrentCurrency(code) {
  currentCurrency = code;
  localStorage.setItem('preferred-currency', code);
  window.dispatchEvent(new CustomEvent('currency-changed', { detail: { currency: code } }));
}

/**
 * Initialize currency module
 */
export async function initCurrency() {
  const stored = localStorage.getItem('preferred-currency');
  if (stored && FALLBACK_RATES[stored]) {
    currentCurrency = stored;
  }

  await fetchRates();

  // Set selector to current value
  const selector = document.getElementById('currency-select');
  if (selector) {
    selector.value = currentCurrency;
    selector.addEventListener('change', (e) => {
      setCurrentCurrency(e.target.value);
    });
  }

  return currentCurrency;
}
