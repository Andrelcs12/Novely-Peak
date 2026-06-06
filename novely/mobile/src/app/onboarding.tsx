import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { Shield, Zap, Target, ArrowRight } from 'lucide-react-native';
import { COLORS } from '../constants/theme';

const { width } = Dimensions.get('window');

const STEPS = [
  {
    icon: Target,
    title: "Foco Absoluto",
    description: "Gerencie suas tarefas sob metodologia de Deep Work e elimine distrações secundárias."
  },
  {
    icon: Zap,
    title: "Performance Máxima",
    description: "Acompanhe métricas de produtividade em tempo real com arquitetura de alta resposta."
  },
  {
    icon: Shield,
    title: "Consistência Blindada",
    description: "Construa hábitos indestrutíveis através do nosso sistema de tracking inteligente."
  }
];

export default function Onboarding() {
  const [currentStep, setCurrentStep] = useState(0);
  const router = useRouter();
  const IconComponent = STEPS[currentStep].icon;

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      router.replace('/(auth)/login');
    }
  };

  return (
    <View className="flex-1 bg-background justify-between px-6 pt-16 pb-12">
      {/* Header */}
      <div className="flex-row justify-between items-center">
        
        <TouchableOpacity onPress={() => router.replace('/(auth)/login')}>
          <Text className="text-textMuted font-medium">Pular</Text>
        </TouchableOpacity>
      </div>

      {/* Conteúdo Central */}
      <View className="items-center px-4">
        <View className="w-24 h-24 bg-surface rounded-3xl items-center justify-center border border-border mb-8 shadow-2xl">
          <IconComponent size={42} color={COLORS.primary} />
        </View>
        
        <Text className="text-textPrimary text-3xl font-bold text-center mb-4 tracking-tight">
          {STEPS[currentStep].title}
        </Text>
        
        <Text className="text-textMuted text-base text-center leading-relaxed">
          {STEPS[currentStep].description}
        </Text>
      </View>

      {/* Footer / Controles */}
      <View className="space-y-6">
        {/* Indicadores de Progresso */}
        <View className="flex-row justify-center space-x-2 mb-6">
          {STEPS.map((_, index) => (
            <View 
              key={index} 
              className={`h-2 rounded-full transition-all duration-300 ${index === currentStep ? 'w-8 bg-primary' : 'w-2 bg-border'}`}
            />
          ))}
        </View>

        {/* Botão de Ação */}
        <TouchableOpacity 
          onPress={handleNext}
          activeOpacity={0.8}
          className="w-full bg-primary h-14 rounded-xl flex-row items-center justify-center space-x-2"
        >
          <Text className="text-textPrimary font-semibold text-lg">
            {currentStep === STEPS.length - 1 ? 'Começar' : 'Continuar'}
          </Text>
          <ArrowRight size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
}