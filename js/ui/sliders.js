// ui/sliders.js — Custom slider component with logarithmic scale

import { abbreviateNumber, logScale, logScaleInverse } from './formatter.js';

/**
 * Initialize a logarithmic slider
 * @param {HTMLInputElement} slider - The range input element
 * @param {Object} config - Configuration with min, max, defaultValue, isLog
 */
export function initSlider(slider, config) {
  const { min, max, defaultValue, isLog = true, step } = config;
  const container = slider.closest('.slider-container');
  const valueLabel = container ? container.querySelector('.slider-value-label') : null;

  if (isLog) {
    // Set slider to 0-1000 range internally for smooth movement
    slider.min = 0;
    slider.max = 1000;
    slider.step = 1;

    // Set default position
    const defaultPos = logScaleInverse(defaultValue || min, min, max) * 1000;
    slider.value = Math.round(defaultPos);

    // Store config on the element for later retrieval
    slider.dataset.logMin = min;
    slider.dataset.logMax = max;
    slider.dataset.isLog = 'true';
  } else {
    slider.min = min;
    slider.max = max;
    slider.step = step || 1;
    slider.value = defaultValue || min;
    slider.dataset.isLog = 'false';
  }

  // Update label and fill on init
  updateSliderUI(slider, valueLabel, config);

  // Listen for input events
  slider.addEventListener('input', () => {
    updateSliderUI(slider, valueLabel, config);

    // Dispatch custom event with the actual value
    const actualValue = getSliderValue(slider);
    slider.dispatchEvent(new CustomEvent('slider-change', {
      bubbles: true,
      detail: { name: slider.id, value: actualValue }
    }));
  });
}

/**
 * Get the actual value from a slider (handles log scale)
 */
export function getSliderValue(slider) {
  if (slider.dataset.isLog === 'true') {
    const min = parseFloat(slider.dataset.logMin);
    const max = parseFloat(slider.dataset.logMax);
    const linearPos = parseFloat(slider.value) / 1000;
    return Math.round(logScale(linearPos, min, max));
  }
  return parseFloat(slider.value);
}

/**
 * Set a slider to a specific actual value
 */
export function setSliderValue(slider, value) {
  if (slider.dataset.isLog === 'true') {
    const min = parseFloat(slider.dataset.logMin);
    const max = parseFloat(slider.dataset.logMax);
    const pos = logScaleInverse(Math.max(min, Math.min(max, value)), min, max) * 1000;
    slider.value = Math.round(pos);
  } else {
    slider.value = value;
  }

  // Trigger UI update
  const container = slider.closest('.slider-container');
  const valueLabel = container ? container.querySelector('.slider-value-label') : null;
  updateSliderFill(slider);
  if (valueLabel) {
    const actualValue = getSliderValue(slider);
    valueLabel.textContent = abbreviateNumber(actualValue);
  }
}

/**
 * Update the slider visual UI (label position, fill color)
 */
function updateSliderUI(slider, valueLabel, config) {
  const actualValue = getSliderValue(slider);

  // Update label text
  if (valueLabel) {
    if (config.prefix) {
      valueLabel.textContent = config.prefix + abbreviateNumber(actualValue);
    } else {
      valueLabel.textContent = abbreviateNumber(actualValue);
    }

    // Position label above thumb in real-time (no CSS transition — instant).
    // Browser thumb center travels from thumbRadius to (trackWidth - thumbRadius).
    // Formula: left = percent * (100% - thumbWidth) + thumbRadius
    // CSS translateX(-50%) on the label handles centering over the thumb.
    const percent = (parseFloat(slider.value) - parseFloat(slider.min)) /
      (parseFloat(slider.max) - parseFloat(slider.min));
    const thumbWidth = 22; // matches CSS thumb width
    valueLabel.style.left = `calc(${percent * 100}% + ${thumbWidth / 2 - percent * thumbWidth}px)`;
  }

  // Update fill color
  updateSliderFill(slider);

  // Update ARIA attributes
  slider.setAttribute('aria-valuenow', actualValue);
  slider.setAttribute('aria-valuetext', abbreviateNumber(actualValue));
}

/**
 * Update slider fill (track fill) via CSS background
 */
function updateSliderFill(slider) {
  const percent = ((parseFloat(slider.value) - parseFloat(slider.min)) /
    (parseFloat(slider.max) - parseFloat(slider.min))) * 100;

  const color = getComputedStyle(document.documentElement)
    .getPropertyValue('--color-primary').trim() || '#6C5CE7';

  slider.style.background = `linear-gradient(to right, ${color} 0%, ${color} ${percent}%, var(--color-border) ${percent}%, var(--color-border) 100%)`;
}

/**
 * Initialize all sliders that are already in the DOM
 */
export function initAllSliders() {
  // Individual sliders are initialized by each calculator module
  // This function can be used for batch init if needed

  // Update all slider fills on theme change
  window.addEventListener('theme-changed', () => {
    document.querySelectorAll('.custom-slider').forEach(slider => {
      updateSliderFill(slider);
    });
  });
}
