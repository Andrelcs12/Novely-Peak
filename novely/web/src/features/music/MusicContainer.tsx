"use client";

import { LogIn } from "lucide-react";
import Empty from "@/components/ui/empty";
import { supabase } from "@/lib/supabase";

export default function MusicContainer() {
  const conectarSpotify = async () => {
    const { data: sessionData } = await supabase.auth.getSession();
    const token = sessionData.session?.access_token;

    if (!token) {
      console.error("Usuário não autenticado");
      return;
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/spotify/login`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    const data = await response.json();
    window.location.href = data.url;
  };

  return (
    <Empty
      image="/music/spotify.svg"
      title="Música para foco"
      description="Conecte sua conta Spotify para acessar músicas e playlists."
      actions={[
        {
          label: "Conectar Spotify",
          onClick: conectarSpotify,
          icon: <LogIn size={16} />,
        },
      ]}
    />
  );
}