export async function onRequest(context) {
  const { request, env, params } = context;
  
  // 1. 获取前端请求的动态路径 (例如 v3/chat)
  const pathArray = params.path || [];
  const path = pathArray.join('/');
  const url = new URL(request.url);
  
  // 2. 简单的安全防护：防盗刷 (仅允许自己的域名调用)
  // 如果你在本地开发，可以暂时注释掉这段验证
  const origin = request.headers.get('Origin') || request.headers.get('Referer') || '';
  const myDomain = env.MY_BLOG_DOMAIN; // 可以在 Cloudflare 后台配置
  if (myDomain && origin && !origin.includes(myDomain)) {
    return new Response('Forbidden: Unauthorized origin', { status: 403 });
  }

  // 3. 拼接真实的 Coze API 地址
  const targetUrl = `https://api.coze.cn/${path}${url.search}`;
  
  // 4. 克隆请求头，并在服务端安全注入真实的 PAT Token
  const headers = new Headers(request.headers);
  headers.set('Authorization', `Bearer ${env.COZE_PAT}`);
  
  // 清理可能导致转发失败的浏览器特定 Header
  headers.delete('Host');
  headers.delete('Origin');
  headers.delete('Referer');

  // 5. 将请求转发给 Coze 并返回（原生支持 SSE 流式文本响应）
  const response = await fetch(targetUrl, {
    method: request.method,
    headers: headers,
    body: request.body,
  });

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: response.headers,
  });
}