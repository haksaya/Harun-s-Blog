// This service handles Google Analytics 4 integration for static sites.
export const GA_TRACKING_ID = 'G-W0YED0N94E';

declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}

// Initialize GA4 by injecting the script tag dynamically
export const initGA = () => {
  if (typeof window === 'undefined') return;
  
  // Prevent duplicate injection
  if (document.getElementById('ga-script')) return;

  // Initialize dataLayer first
  window.dataLayer = window.dataLayer || [];
  window.gtag = function() {
    window.dataLayer.push(arguments);
  };
  
  window.gtag('js', new Date());
  window.gtag('config', GA_TRACKING_ID, {
    send_page_view: true
  });

  // Then load the script
  const script = document.createElement('script');
  script.id = 'ga-script';
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`;
  script.async = true;
  document.head.appendChild(script);
};

// Log a page view
export const logPageView = (title: string, path: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'page_view', {
      page_title: title,
      page_path: path,
    });
  }
};

// Log a custom event (e.g., used generator, clicked random post)
export const logEvent = (action: string, category: string, label: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
    });
  }
};