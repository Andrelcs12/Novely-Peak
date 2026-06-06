import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image } from 'react-native';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react-native';
import { COLORS } from '../../constants/theme';

export default function Login() {
  const [secureText, setSecureText] = useState(true);

  return (
    <View className="flex-1 bg-background px-6 justify-center">
      <View className="items-center mb-10">
        <Image 
  source={require('../../../assets/images/logo.png')} 
  style={{ width: 32, height: 32 }} // Trava nativa em pixels (tamanho perfeito de ícone)
  resizeMode="contain"
  alt="Peak Logo"
/>
        <Text className="text-textPrimary text-2xl font-bold font-bold tracking-tight">Acesse o Peak</Text>
        <Text className="text-textMuted text-sm font-regular mt-1">Insira suas credenciais para continuar</Text>
      </View>

      <View className="space-y-4">
        {/* Input Email */}
        <View className="w-full h-14 bg-surface rounded-xl border border-border flex-row items-center px-4 mb-3">
          <Mail size={18} color={COLORS.textMuted} />
          <TextInput 
            placeholder="E-mail profissional"
            placeholderTextColor={COLORS.textMuted}
            className="flex-1 ml-3 text-textPrimary text-base font-regular"
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        {/* Input Senha */}
        <View className="w-full h-14 bg-surface rounded-xl border border-border flex-row items-center px-4 mb-6">
          <Lock size={18} color={COLORS.textMuted} />
          <TextInput 
            placeholder="Sua senha secreta"
            placeholderTextColor={COLORS.textMuted}
            secureTextEntry={secureText}
            className="flex-1 ml-3 text-textPrimary text-base font-regular"
            autoCapitalize="none"
          />
          <TouchableOpacity onPress={() => setSecureText(!secureText)}>
            {secureText ? <Eye size={18} color={COLORS.textMuted} /> : <EyeOff size={18} color={COLORS.textMuted} />}
          </TouchableOpacity>
        </View>

        {/* Botão de Login */}
        <TouchableOpacity 
          activeOpacity={0.8}
          className="w-full bg-primary h-14 rounded-xl items-center justify-center shadow-lg shadow-primary/20"
        >
          <Text className="text-textPrimary font-semibold font-bold text-lg">Entrar no painel</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}