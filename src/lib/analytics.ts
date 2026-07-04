// Lightweight analytics helper. Sends to third-party providers (if loaded)
// AND records to Supabase `analytics_events` for the built-in admin dashboard.
import { supabase } from "@/integrations/supabase/client";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
    clarity?: (...args: unknown[]) => void;
  }
}

type EventParams = Record<string, string | number | boolean | undefined>;

const SESSION_KEY = "lv_session_id";
const getSessionId = (): string => {
  if (typeof window === "undefined") return "ssr";
  try {
    let id = sessionStorage.getItem(SESSION_KEY);
    if (!id) {
      id = crypto.randomUUID();
      sessionStorage.setItem(SESSION_KEY, id);
    }
    return id;
  } catch {
    return "anon";
  }
};

export const trackEvent = (name: string, params: EventParams = {}) => {
  try {
    window.dataLayer?.push({ event: name, ...params });
    window.gtag?.("event", name, params);
    window.fbq?.("trackCustom", name, params);
    window.clarity?.("event", name);
  } catch {
    // silent — analytics must never break UX
  }
  // Persist to Supabase (fire-and-forget)
  try {
    if (typeof window === "undefined") return;
    const { source, ...rest } = params;
    supabase
      .from("analytics_events")
      .insert({
        event_name: name,
        path: window.location.pathname + window.location.search,
        referrer: document.referrer || null,
        session_id: getSessionId(),
        source: source ? String(source) : null,
        metadata: rest as unknown as Record<string, string | number | boolean | null>,
      })
      .then(() => {}, () => {});
  } catch {
    // ignore
  }
};

export const trackLead = (source: string) =>
  trackEvent("Lead", { source, event_category: "conversion" });

export const trackBooking = (source: string) =>
  trackEvent("Schedule", { source, event_category: "conversion" });

export const trackPageView = (path?: string) =>
  trackEvent("PageView", { path: path ?? (typeof window !== "undefined" ? window.location.pathname : "") });

export const trackClick = (source: string, label?: string) =>
  trackEvent("Click", { source, label });