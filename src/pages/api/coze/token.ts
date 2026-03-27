// src/pages/api/coze/token.ts
import type { APIRoute } from 'astro';

export const prerender = false;

export const GET: APIRoute = async ({ request, locals }) => {
  // 现在的 locals.runtime.env 已经有了基本的类型提示
  const env = (locals as any).runtime?.env || {}; 
  
  const token = env.COZE_PAT;
  const myDomain = env.MY_BLOG_DOMAIN;

  const origin = request.headers.get('Origin') || request.headers.get('Referer') || '';
  const isLocal = origin.includes('localhost') || origin.includes('127.0.0.1');

  if (myDomain && origin && !isLocal && !origin.includes(myDomain)) {
    return new Response('Forbidden', { status: 403 });
  }

  if (!token) {
    return Response.json({ error: 'Missing environment variables' }, { status: 500 });
  }

  return Response.json({ token });
};