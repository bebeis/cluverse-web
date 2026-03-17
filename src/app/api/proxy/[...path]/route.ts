import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const API_PROXY_TARGET = process.env.API_PROXY_TARGET || 'http://api.cluverse.kro.kr';

const HOP_BY_HOP_HEADERS = new Set([
  'connection',
  'content-length',
  'host',
  'keep-alive',
  'proxy-authenticate',
  'proxy-authorization',
  'te',
  'trailer',
  'transfer-encoding',
  'upgrade',
]);

const rewriteSetCookie = (setCookie: string) => {
  const parts = setCookie.split(';').map(part => part.trim()).filter(Boolean);
  if (parts.length === 0) {
    return setCookie;
  }

  const rewritten = [parts[0]];
  let hasPath = false;

  for (const attr of parts.slice(1)) {
    const [rawKey, ...rest] = attr.split('=');
    const key = rawKey.trim().toLowerCase();
    const value = rest.join('=').trim();

    if (key === 'domain') {
      continue;
    }

    if (key === 'secure') {
      continue;
    }

    if (key === 'samesite') {
      rewritten.push('SameSite=Lax');
      continue;
    }

    if (key === 'path') {
      hasPath = true;
    }

    rewritten.push(value ? `${rawKey}=${value}` : rawKey);
  }

  if (!hasPath) {
    rewritten.push('Path=/');
  }

  return rewritten.join('; ');
};

const buildUpstreamUrl = (request: NextRequest, path: string[]) => {
  const upstreamUrl = new URL(path.join('/'), API_PROXY_TARGET.endsWith('/') ? API_PROXY_TARGET : `${API_PROXY_TARGET}/`);
  upstreamUrl.search = request.nextUrl.search;
  return upstreamUrl;
};

const buildRequestHeaders = (request: NextRequest) => {
  const headers = new Headers();

  request.headers.forEach((value, key) => {
    if (!HOP_BY_HOP_HEADERS.has(key.toLowerCase())) {
      headers.set(key, value);
    }
  });

  headers.set('x-forwarded-host', request.headers.get('host') || '');
  headers.set('x-forwarded-proto', request.nextUrl.protocol.replace(':', ''));

  return headers;
};

async function proxy(request: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  const { path } = await context.params;
  const upstreamUrl = buildUpstreamUrl(request, path);
  const headers = buildRequestHeaders(request);

  const upstreamResponse = await fetch(upstreamUrl, {
    method: request.method,
    headers,
    body: request.method === 'GET' || request.method === 'HEAD' ? undefined : await request.arrayBuffer(),
    cache: 'no-store',
    redirect: 'manual',
  });

  const responseHeaders = new Headers();

  upstreamResponse.headers.forEach((value, key) => {
    if (key.toLowerCase() === 'set-cookie' || HOP_BY_HOP_HEADERS.has(key.toLowerCase())) {
      return;
    }
    responseHeaders.set(key, value);
  });

  for (const cookie of upstreamResponse.headers.getSetCookie()) {
    responseHeaders.append('set-cookie', rewriteSetCookie(cookie));
  }

  return new NextResponse(upstreamResponse.body, {
    status: upstreamResponse.status,
    statusText: upstreamResponse.statusText,
    headers: responseHeaders,
  });
}

export { proxy as GET, proxy as POST, proxy as PUT, proxy as PATCH, proxy as DELETE, proxy as HEAD, proxy as OPTIONS };
