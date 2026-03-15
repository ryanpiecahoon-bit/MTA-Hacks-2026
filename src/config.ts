const rawDomains = import.meta.env.VITE_ALLOWED_EMAIL_DOMAINS ?? "mta.ca,umoncton.ca";

// Proxy mode: use relative path so the app talks to Netlify's sheets function (same origin).
// Set VITE_USE_PROXY=true when script.google.com is blocked (e.g. school WiFi).
const useProxy = import.meta.env.VITE_USE_PROXY === "true" || import.meta.env.VITE_USE_PROXY === "1";
const explicitUrl = import.meta.env.VITE_APPS_SCRIPT_URL ?? "";
const appsScriptUrl = explicitUrl || (useProxy ? "/.netlify/functions/sheets" : "");

export const appConfig = {
  allowedDomains: rawDomains.split(",").map((d: string) => d.trim().toLowerCase()),
  appsScriptUrl,
  appName: "Office Hours Booking"
};
