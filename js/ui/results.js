// ui/results.js — Results panel rendering with animated countUp

import { convertCurrency, formatCurrency, getCurrentCurrency } from '../currency.js';
import { t } from '../i18n.js';

let currentTotal = 0;

/**
 * Render the results panel for a single platform
 * @param {number} totalUSD - Total revenue in USD
 * @param {Array} breakdown - Array of { label, value, color } objects
 */
export function renderResults(totalUSD, breakdown = []) {
  const currency = getCurrentCurrency();
  const convertedTotal = convertCurrency(totalUSD, currency);

  // Update total synchronously
  const el = document.getElementById('result-total-value');
  if (el) {
    el.textContent = formatCurrency(convertedTotal, currency);
    el.dataset.currentValue = convertedTotal.toString();
  }

  // Render breakdown items
  renderBreakdown(breakdown, currency);

  currentTotal = totalUSD;
}

/**
 * Render results for All Platforms mode with bar chart
 * @param {number} totalUSD - Total combined revenue
 * @param {Array} breakdown - Array of { platform, value, color } objects
 */
export function renderAllPlatformsResults(totalUSD, breakdown = []) {
  const currency = getCurrentCurrency();
  const convertedTotal = convertCurrency(totalUSD, currency);

  // Update total synchronously
  const el = document.getElementById('result-total-value');
  if (el) {
    el.textContent = formatCurrency(convertedTotal, currency);
    el.dataset.currentValue = convertedTotal.toString();
  }

  // Render bar chart
  renderBarChart(breakdown, currency);

  currentTotal = totalUSD;
}

/**
 * Render breakdown list items
 */
function renderBreakdown(breakdown, currency) {
  const container = document.getElementById('breakdown-list');
  if (!container) return;

  // Clear existing content
  while (container.firstChild) {
    container.removeChild(container.firstChild);
  }

  if (breakdown.length === 0) return;

  breakdown.forEach(item => {
    const row = document.createElement('div');
    row.className = 'breakdown-item';

    const labelWrapper = document.createElement('div');
    labelWrapper.className = 'breakdown-label';

    const colorDot = document.createElement('span');
    colorDot.className = 'breakdown-color';
    colorDot.style.backgroundColor = item.color || 'var(--color-primary)';

    const labelText = document.createElement('span');
    labelText.textContent = item.label;

    labelWrapper.appendChild(colorDot);
    labelWrapper.appendChild(labelText);

    const valueText = document.createElement('span');
    valueText.className = 'breakdown-value';
    const convertedValue = convertCurrency(item.value, currency);
    valueText.textContent = formatCurrency(convertedValue, currency);

    row.appendChild(labelWrapper);
    row.appendChild(valueText);
    container.appendChild(row);
  });
}

/**
 * Render horizontal bar chart for All Platforms mode
 */
function renderBarChart(breakdown, currency) {
  const container = document.getElementById('breakdown-list');
  if (!container) return;

  // Clear existing content
  while (container.firstChild) {
    container.removeChild(container.firstChild);
  }

  if (breakdown.length === 0) return;

  const maxValue = Math.max(...breakdown.map(b => b.value), 1);

  const chartContainer = document.createElement('div');
  chartContainer.className = 'breakdown-bar-container';

  breakdown.forEach(item => {
    const row = document.createElement('div');
    row.className = 'breakdown-bar-row';

    const label = document.createElement('span');
    label.className = 'breakdown-bar-label';
    label.textContent = item.platform;

    const track = document.createElement('div');
    track.className = 'breakdown-bar-track';

    const fill = document.createElement('div');
    fill.className = 'breakdown-bar-fill';
    fill.style.backgroundColor = item.color;
    fill.style.width = `${(item.value / maxValue) * 100}%`;

    track.appendChild(fill);

    const amount = document.createElement('span');
    amount.className = 'breakdown-bar-amount';
    const convertedValue = convertCurrency(item.value, currency);
    amount.textContent = formatCurrency(convertedValue, currency);

    row.appendChild(label);
    row.appendChild(track);
    row.appendChild(amount);
    chartContainer.appendChild(row);
  });

  container.appendChild(chartContainer);
}

/**
 * Re-render results when currency changes
 */
export function refreshResultsForCurrency() {
  if (currentTotal > 0) {
    const currency = getCurrentCurrency();
    const converted = convertCurrency(currentTotal, currency);

    const el = document.getElementById('result-total-value');
    if (el) {
      el.textContent = formatCurrency(converted, currency);
      el.dataset.currentValue = converted.toString();
    }
  }
}
