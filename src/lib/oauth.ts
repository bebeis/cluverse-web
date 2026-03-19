export type SocialProvider = 'kakao' | 'google';

export function getSocialCallbackPath(provider: SocialProvider) {
  return `/login/callback/${provider}`;
}

export function buildSocialCallbackUrl(provider: SocialProvider, origin: string) {
  return new URL(getSocialCallbackPath(provider), origin).toString();
}
