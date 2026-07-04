// Lightweight analytics helper. Safe no-op when providers are not loaded.
// Providers are activated by uncommenting the corresponding blocks in index.html.

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
    clarity?: (...args: unknown[]) => void;
  }
}

type EventParams = Record<string, string | number | boolean | undefined>;

export const trackEvent = (name: string, params: EventParams = {}) => {
  try {
    window.dataLayer?.push({ event: name, ...params });
    window.gtag?.("event", name, params);
    window.fbq?.("trackCustom", name, params);
    window.clarity?.("event", name);
  } catch {
    // silent — analytics must never break UX
  }
};

export const trackLead = (source: string) =>
  trackEvent("Lead", { source, event_category: "conversion" });

export const trackBooking = (source: string) =>
  trackEvent("Schedule", { source, event_category: "conversion" });