// ui/tooltips.js — Tooltip component with dynamic positioning

/**
 * Initialize all tooltips in the document
 */
export function initTooltips() {
  const triggers = document.querySelectorAll('.tooltip-trigger');

  triggers.forEach(trigger => {
    const tooltipText = trigger.getAttribute('data-tooltip');
    if (!tooltipText) return;

    // Create tooltip element
    const tooltip = document.createElement('div');
    tooltip.className = 'tooltip-content';
    tooltip.textContent = tooltipText;
    trigger.appendChild(tooltip);

    // Desktop: hover
    trigger.addEventListener('mouseenter', () => {
      positionTooltip(trigger, tooltip);
      tooltip.classList.add('visible');
    });

    trigger.addEventListener('mouseleave', () => {
      tooltip.classList.remove('visible');
    });

    // Mobile: tap toggle
    trigger.addEventListener('click', (e) => {
      e.stopPropagation();
      const isVisible = tooltip.classList.contains('visible');

      // Close all other tooltips
      document.querySelectorAll('.tooltip-content.visible').forEach(t => {
        t.classList.remove('visible');
      });

      if (!isVisible) {
        positionTooltip(trigger, tooltip);
        tooltip.classList.add('visible');
      }
    });
  });

  // Close tooltips when clicking elsewhere
  document.addEventListener('click', () => {
    document.querySelectorAll('.tooltip-content.visible').forEach(t => {
      t.classList.remove('visible');
    });
  });
}

/**
 * Position tooltip above or below the trigger based on available space
 */
function positionTooltip(trigger, tooltip) {
  const triggerRect = trigger.getBoundingClientRect();
  const spaceAbove = triggerRect.top;
  const spaceBelow = window.innerHeight - triggerRect.bottom;

  // Remove existing position classes
  tooltip.classList.remove('tooltip-above', 'tooltip-below');

  // Position above if there's enough space, otherwise below
  if (spaceAbove > 120 || spaceAbove > spaceBelow) {
    tooltip.classList.add('tooltip-above');
  } else {
    tooltip.classList.add('tooltip-below');
  }
}

/**
 * Update tooltip text dynamically (for translated content)
 */
export function updateTooltipText(triggerId, newText) {
  const trigger = document.getElementById(triggerId);
  if (!trigger) return;

  const tooltip = trigger.querySelector('.tooltip-content');
  if (tooltip) {
    tooltip.textContent = newText;
  }
  trigger.setAttribute('data-tooltip', newText);
}
