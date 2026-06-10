export const PUBLIC_WEBSITE_SLUG =
  import.meta.env.VITE_PUBLIC_WEBSITE_SLUG ?? 'optimus-manpower';

export const PUBLIC_WEBSITE_ID =
  import.meta.env.VITE_PUBLIC_WEBSITE_ID ?? '4';

const BLOG_ADMIN_PUBLIC_API_URL = 'https://blog-gpizm.ondigitalocean.app/api/v1/public';
const BLOG_ADMIN_DEV_PROXY_URL = '/blog-api';

const normalizeBlogApiUrl = (value: string | undefined) => {
  if (!value) return BLOG_ADMIN_PUBLIC_API_URL;

  const trimmed = value.replace(/\/+$/, '');
  if (trimmed === BLOG_ADMIN_DEV_PROXY_URL) {
    return trimmed;
  }

  if (
    trimmed.startsWith('/') ||
    trimmed.includes('blogbackend-up98j.ondigitalocean.app') ||
    trimmed.includes('manpowerbackend-2rehp.ondigitalocean.app')
  ) {
    return BLOG_ADMIN_PUBLIC_API_URL;
  }

  if (trimmed.endsWith('/api/v1')) {
    return `${trimmed}/public`;
  }

  return trimmed;
};

export const API_BASE_URL = normalizeBlogApiUrl(
  import.meta.env.DEV
    ? BLOG_ADMIN_DEV_PROXY_URL
    : import.meta.env.VITE_BLOG_API_URL ??
        import.meta.env.VITE_PUBLIC_API_BASE_URL,
);
