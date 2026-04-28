"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

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

      // 1. não logado → onboarding/login
      if (!session) {
        router.push("/onboarding");
        return;
      }

      // 2. logado → chama backend
      const res = await fetch("http://localhost:3000/auth/me", {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (!res.ok) {
        router.push("/login");
        return;
      }

      const user = await res.json();

      // 3. onboarding não feito → onboarding form
      if (!user.onboardingProfileDone) {
        router.push("/onboarding-form");
        return;
      }

      // 4. tudo ok → dashboard
      router.push("/dashboard");
    };

    checkUser();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p>Carregando...</p>
    </div>
  );
}