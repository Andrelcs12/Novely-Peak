"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const handle = async () => {
      const hash = window.location.hash;

      // Supabase já processa automaticamente via OAuth redirect
      const { data } = await supabase.auth.getSession();

      const session = data.session;

      if (!session) {
        router.push("/auth");
        return;
      }

      // aqui você decide o fluxo
      router.push("/onboarding-form");
    };

    handle();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      Carregando login...
    </div>
  );
}