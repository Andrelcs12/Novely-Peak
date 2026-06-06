import { Stack } from 'expo-router';
import { COLORS } from '../../constants/theme';

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false, // Esconde a barra predefinida do sistema
        contentStyle: { backgroundColor: COLORS.background }, // Garante o fundo escuro do Peak
        animation: 'slide_from_right', // Transição elegante para fluxos de auth
      }}
    >
      <Stack.Screen name="login" />
      {/* Se você criar telas como 'register' ou 'forgot-password' futuramente, elas herdarão isso automaticamente */}
    </Stack>
  );
}