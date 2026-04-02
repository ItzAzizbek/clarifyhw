const environment = (import.meta.env.VITE_ENVIRONMENT || 'DEVELOPMENT').trim().toUpperCase();
const selectedEnvironment = environment === 'PRODUCTION' ? 'PRODUCTION' : 'DEVELOPMENT';

const selectedClientUrl =
  selectedEnvironment === 'PRODUCTION'
    ? import.meta.env.VITE_CLIENT_URL_PRODUCTION?.trim()
    : import.meta.env.VITE_CLIENT_URL_DEVELOPMENT?.trim();

const selectedApiUrl =
  selectedEnvironment === 'PRODUCTION'
    ? import.meta.env.VITE_API_URL_PRODUCTION?.trim()
    : import.meta.env.VITE_API_URL_DEVELOPMENT?.trim();

export const clientUrl = selectedClientUrl?.replace(/\/$/, '');
export const apiUrl = selectedApiUrl?.replace(/\/$/, '');

export function buildApiUrl(path) {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${apiUrl}${normalizedPath}`;
}

export const appEnvironment = selectedEnvironment;
