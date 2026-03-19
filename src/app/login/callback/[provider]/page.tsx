import { SocialLoginCallbackClient } from './SocialLoginCallbackClient';

type CallbackPageProps = {
  params: Promise<{
    provider: string;
  }>;
};

export default async function SocialLoginCallbackPage({ params }: CallbackPageProps) {
  const { provider } = await params;

  return <SocialLoginCallbackClient provider={provider} />;
}
