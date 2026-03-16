/**
 * Environment configuration for CoRide Finder.
 * Vite exposes variables prefixed with VITE_ via import.meta.env
 */
export const env = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api',
  isDev: import.meta.env.DEV,
  isProd: import.meta.env.PROD,
}
