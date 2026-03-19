export type SocialProvider = 'kakao' | 'google';

export function getSocialCallbackPath(provider: SocialProvider) {
  return `/login/callback/${provider}`;
}

export function buildSocialCallbackUrl(provider: SocialProvider, origin: string) {
  return new URL(getSocialCallbackPath(provider), origin).toString();
}

export function buildSocialAuthUrl(provider: SocialProvider, redirectUri: string): string {
  if (provider === 'kakao') {
    const clientId = process.env.NEXT_PUBLIC_KAKAO_CLIENT_ID;
    if (!clientId) throw new Error('NEXT_PUBLIC_KAKAO_CLIENT_ID가 설정되지 않았습니다.');
    const url = new URL('https://kauth.kakao.com/oauth/authorize');
    url.searchParams.set('client_id', clientId);
    url.searchParams.set('redirect_uri', redirectUri);
    url.searchParams.set('response_type', 'code');
    return url.toString();
  }

  if (provider === 'google') {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    if (!clientId) throw new Error('NEXT_PUBLIC_GOOGLE_CLIENT_ID가 설정되지 않았습니다.');
    const url = new URL('https://accounts.google.com/o/oauth2/v2/auth');
    url.searchParams.set('client_id', clientId);
    url.searchParams.set('redirect_uri', redirectUri);
    url.searchParams.set('response_type', 'code');
    url.searchParams.set('scope', 'openid email profile');
    return url.toString();
  }

  throw new Error(`지원하지 않는 provider: ${provider}`);
}
