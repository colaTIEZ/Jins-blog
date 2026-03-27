import type { APIContext } from 'astro';

type ServerEnvKey = 'COZE_PAT' | 'MY_BLOG_DOMAIN';

const LOCAL_HOSTS = new Set(['localhost', '127.0.0.1', '[::1]']);

const getServerEnv = (locals: APIContext['locals'], key: ServerEnvKey) => {
  const runtimeEnv = (locals as { runtime?: { env?: Record<string, string | undefined> } }).runtime
    ?.env;

  return runtimeEnv?.[key] || import.meta.env[key] || process.env[key];
};

const parseDomainAllowlist = (raw: string | undefined) =>
  (raw || '')
    .split(',')
    .map((item) => item.trim().toLowerCase())
    .filter((item) => item && !item.includes('yourdomain.com'))
    .map((item) => item.replace(/^https?:\/\//, '').replace(/\/.*/, ''));

const isAllowedOrigin = (originOrReferer: string, allowlist: string[]) => {
  if (!originOrReferer) return true;

  let host = '';
  try {
    host = new URL(originOrReferer).host.toLowerCase();
  } catch {
    return false;
  }

  if (LOCAL_HOSTS.has(host)) return true;

  return allowlist.some((domain) => host === domain || host.endsWith(`.${domain}`));
};

export const prerender = false;

export async function GET({ request, locals }: APIContext) {
  const originOrReferer = request.headers.get('Origin') || request.headers.get('Referer') || '';
  const allowlist = parseDomainAllowlist(getServerEnv(locals, 'MY_BLOG_DOMAIN'));

  if (allowlist.length > 0 && !isAllowedOrigin(originOrReferer, allowlist)) {
    return new Response('Forbidden: Unauthorized origin', { status: 403 });
  }

  const token = getServerEnv(locals, 'COZE_PAT');

  if (!token) {
    return Response.json({ error: 'Missing COZE_PAT' }, { status: 500 });
  }

  return Response.json(
    { token },
    {
      headers: {
        'cache-control': 'no-store'
      }
    }
  );
}