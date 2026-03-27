const getServerEnv = (key: 'COZE_PAT' | 'MY_BLOG_DOMAIN') =>
  import.meta.env[key] || process.env[key];

export async function GET({ request }: { request: Request }) {
  const origin = request.headers.get('Origin') || request.headers.get('Referer') || '';
  const myDomain = getServerEnv('MY_BLOG_DOMAIN');

  const isLocalOrigin =
    origin.includes('localhost') || origin.includes('127.0.0.1') || origin.includes('[::1]');
  const hasRealDomain = myDomain && !myDomain.includes('yourdomain.com');

  if (hasRealDomain && origin && !isLocalOrigin && !origin.includes(myDomain)) {
    return new Response('Forbidden: Unauthorized origin', { status: 403 });
  }

  const token = getServerEnv('COZE_PAT');

  if (!token) {
    return Response.json({ error: 'Missing COZE_PAT' }, { status: 500 });
  }

  return Response.json({ token });
}