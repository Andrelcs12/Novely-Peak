"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import { api } from "@/lib/api";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const { data: sessionData } = await supabase.auth.getSession();

      const session = sessionData.session;

      // 1. não logado
      if (!session) {
        router.push("/onboarding");
        return;
      }

      try {
        // 2. busca user via API centralizada
        const user = await api.get("/auth/me");

        // 3. onboarding não feito
        if (!user.onboardingDone) {
          router.push("/onboarding-form");
          return;
        }

        // 4. tudo ok
        router.push("/dashboard");
      } catch (err) {
        router.push("/auth");
      }
    };

    checkUser();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center text-zinc-800">
      <p>Carregando...</p>
    </div>
  );
}