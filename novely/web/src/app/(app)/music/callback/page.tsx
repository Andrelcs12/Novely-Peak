"use client";

import { useEffect, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export default function SpotifyCallbackPage() {
  const params = useSearchParams();
  const router = useRouter();

  const code = params.get("code");
  const state = params.get("state"); // 👈 IMPORTANTE: Pegar o state que o Spotify devolveu

  const fetched = useRef(false);

  useEffect(() => {
    const exchangeCode = async () => {
      if (!code || !state || fetched.current) return;
      fetched.current = true;

      try {
        // Envia code E state para o NestJS salvar tudo no banco de dados local
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/spotify/callback?code=${code}&state=${state}`
        );

        if (!res.ok) throw new Error("Erro no servidor backend");

        // Sucesso! Joga o usuário para o /music, que agora vai notar a conexão e abrir o player
        router.push("/music");
      } catch (err) {
        console.error("Erro ao conectar:", err);
        router.push("/music?error=failed_to_connect");
      }
    };

    exchangeCode();
  }, [code, state, router]);

  return (
    <div className="flex h-screen items-center justify-center">
      <p className="animate-pulse">Sincronizando sua conta Spotify...</p>
    </div>
  );
}