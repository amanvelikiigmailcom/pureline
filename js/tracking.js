// Pureline — Google Ads conversion tracking
// Pixel: AW-18437513193 / Label: 2j43CI-GvfQcEOm_2NdE — "Вацап написали"
// Native link handling with debounce — opens WhatsApp directly without popup/blocking

const PIXEL_ID = 'AW-18437513193';
const TRACKING_CONFIG = {
  whatsapp_button: {
    label: '2j43CI-GvfQcEOm_2NdE',
    selector: 'a[href*="wa.me"]'
  }
};

document.addEventListener('DOMContentLoaded', () => {
  let lastClickTime = 0;
  const DEBOUNCE_MS = 2000;

  document.addEventListener('click', (event) => {
    for (let key in TRACKING_CONFIG) {
      const config = TRACKING_CONFIG[key];
      if (!config.selector) continue;
      const targetElement = event.target.closest(config.selector);
      if (targetElement) {
        const now = Date.now();
        if (now - lastClickTime < DEBOUNCE_MS) {
          // Игнорируем повторный клик для Google Ads, чтобы не дублировать конверсии
          return;
        }
        lastClickTime = now;

        if (typeof gtag === 'function') {
          gtag('event', 'conversion', {
            'send_to': `${PIXEL_ID}/${config.label}`
          });
        }
        console.log(`[Ads] conversion: ${key}`);
        // Не вызываем event.preventDefault() — браузер мгновенно открывает нативный WhatsApp на телефоне
      }
    }
  });
});
