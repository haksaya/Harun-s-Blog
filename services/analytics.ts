// This service handles Google Analytics 4 integration for static sites.
// Replace 'G-XXXXXXXXXX' with your actual Measurement ID from Google Analytics.
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

  const script = document.createElement('script');
  script.id = 'ga-script';
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`;
  script.async = true;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  function gtag(...args: any[]) {
    window.dataLayer.push(args);
  }
  window.gtag = gtag;
  
  gtag('js', new Date());
  gtag('config', GA_TRACKING_ID, {
    send_page_view: false // We will manually trigger page views in the router/app
  });
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