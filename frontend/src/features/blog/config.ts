export const PUBLIC_WEBSITE_SLUG =
  import.meta.env.VITE_PUBLIC_WEBSITE_SLUG ?? 'optimus-manpower';

export const PUBLIC_WEBSITE_ID =
  import.meta.env.VITE_PUBLIC_WEBSITE_ID ?? '4';

const BLOG_ADMIN_DEV_PROXY_URL = '/blog-api';
const BLOG_ADMIN_PRODUCTION_PROXY_URL = '/api/blog-public';

export const API_BASE_URL = import.meta.env.DEV
  ? BLOG_ADMIN_DEV_PROXY_URL
  : import.meta.env.VITE_BLOG_PROXY_URL ??
    BLOG_ADMIN_PRODUCTION_PROXY_URL;
