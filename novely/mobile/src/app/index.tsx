import { Redirect } from 'expo-router';

export default function Index() {
  // Simulação de flag. Mudar para true se quiser pular direto para auth
  const hasSeenOnboarding = false;

  if (!hasSeenOnboarding) {
    return <Redirect href="/onboarding" />;
  }

  return <Redirect href="/(auth)/login" />;
}