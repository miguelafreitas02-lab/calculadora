// ui/tabs.js — Tab navigation component

let activeTab = 'youtube';
let onTabChangeCallback = null;

/**
 * Initialize tab navigation system
 * @param {Function} onTabChange - Callback when tab changes
 */
export function initTabs(onTabChange) {
  onTabChangeCallback = onTabChange;

  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabPanels = document.querySelectorAll('.tab-panel');

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const tabId = btn.getAttribute('data-tab');
      switchTab(tabId, tabButtons, tabPanels);
    });

    // Keyboard navigation
    btn.addEventListener('keydown', (e) => {
      handleTabKeydown(e, tabButtons);
    });
  });

  // Set initial active tab
  const initialTab = tabButtons[0]?.getAttribute('data-tab') || 'youtube';
  switchTab(initialTab, tabButtons, tabPanels);
}

/**
 * Switch to a specific tab
 */
function switchTab(tabId, tabButtons, tabPanels) {
  activeTab = tabId;

  // Update button states
  tabButtons.forEach(btn => {
    const isActive = btn.getAttribute('data-tab') === tabId;
    btn.setAttribute('aria-selected', isActive ? 'true' : 'false');
    btn.setAttribute('tabindex', isActive ? '0' : '-1');
  });

  // Update panel visibility
  tabPanels.forEach(panel => {
    const isActive = panel.id === `panel-${tabId}`;
    panel.setAttribute('aria-hidden', isActive ? 'false' : 'true');

    if (isActive) {
      // Re-trigger animation
      panel.style.animation = 'none';
      panel.offsetHeight; // Force reflow
      panel.style.animation = '';
    }
  });

  // Scroll active tab into view on mobile
  const activeBtn = document.querySelector(`.tab-btn[data-tab="${tabId}"]`);
  if (activeBtn) {
    activeBtn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
  }

  // Notify callback
  if (onTabChangeCallback) {
    onTabChangeCallback(tabId);
  }
}

/**
 * Keyboard navigation within tabs (arrow keys)
 */
function handleTabKeydown(e, tabButtons) {
  const currentIndex = Array.from(tabButtons).indexOf(e.target);
  let nextIndex;

  switch (e.key) {
    case 'ArrowRight':
    case 'ArrowDown':
      e.preventDefault();
      nextIndex = (currentIndex + 1) % tabButtons.length;
      break;
    case 'ArrowLeft':
    case 'ArrowUp':
      e.preventDefault();
      nextIndex = (currentIndex - 1 + tabButtons.length) % tabButtons.length;
      break;
    case 'Home':
      e.preventDefault();
      nextIndex = 0;
      break;
    case 'End':
      e.preventDefault();
      nextIndex = tabButtons.length - 1;
      break;
    default:
      return;
  }

  tabButtons[nextIndex].focus();
  tabButtons[nextIndex].click();
}

/**
 * Get the currently active tab ID
 */
export function getActiveTab() {
  return activeTab;
}

/**
 * Programmatically switch to a tab
 */
export function setActiveTab(tabId) {
  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabPanels = document.querySelectorAll('.tab-panel');
  switchTab(tabId, tabButtons, tabPanels);
}
