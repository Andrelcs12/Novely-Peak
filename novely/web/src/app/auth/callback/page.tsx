"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { api } from "@/lib/api";

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const run = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();

        if (error || !data.session) {
          router.replace("/auth");
          return;
        }

        // 🔥 SEMPRE garante usuário no backend
        const user = await api.get("/auth/me");

        // 🔥 REGRA ÚNICA DE DECISÃO
        const needsOnboarding =
          !user.onboardingIntroDone || !user.onboardingDone;

        if (needsOnboarding) {
          router.replace("/onboarding-form");
          return;
        }

        router.replace("/dashboard");
      } catch (err) {
        console.error("Auth callback error:", err);
        router.replace("/auth");
      }
    };

    run();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center text-sm text-gray-500">
      Finalizando login...
    </div>
  );
}