"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { supabase } from "@/lib/supabase";

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const finishLogin = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      console.log("SESSION", session);

      if (!session) {
        router.push("/login");
        return;
      }

      router.push("/dashboard");
    };

    finishLogin();
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      Finalizando login...
    </div>
  );
}