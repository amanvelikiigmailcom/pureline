// Pureline — Google Ads conversion tracking
// Pixel: AW-18437513193 / Label: 2j43CI-GvfQcEOm_2NdE — "Вацап написали"
// Only WhatsApp for now — pixel ready for future events
// Delegated click handler — works for dynamically injected wa.me links
// Outbound pattern with event_callback + 300ms fallback

const PIXEL_ID = 'AW-18437513193';
const TRACKING_CONFIG = {
  whatsapp_button: {
    label: '2j43CI-GvfQcEOm_2NdE',
    selector: 'a[href*="wa.me"]',
    isOutbound: true
  }
};
document.addEventListener('DOMContentLoaded', () => {
  document.addEventListener('click', (event) => {
    for (let key in TRACKING_CONFIG) {
      let config = TRACKING_CONFIG[key];
      if (!config.selector) continue;
      let targetElement = event.target.closest(config.selector);
      if (targetElement) {
        if (!config.isOutbound) {
          gtag('event', 'conversion', { 'send_to': `${PIXEL_ID}/${config.label}` });
          console.log(`[Ads] conversion: ${key}`);
        } else {
          event.preventDefault();
          let destinationUrl = targetElement.href;
          let hasFired = false;
          const proceedToUrl = () => {
            if (!hasFired) {
              hasFired = true;
              window.location.href = destinationUrl;
            }
          };
          gtag('event', 'conversion', {
            'send_to': `${PIXEL_ID}/${config.label}`,
            'event_callback': proceedToUrl
          });
          console.log(`[Ads] outbound conversion: ${key}`);
          setTimeout(proceedToUrl, 300);
        }
      }
    }
  });
});
