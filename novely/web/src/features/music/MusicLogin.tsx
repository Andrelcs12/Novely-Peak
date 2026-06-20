"use client";

import { LogIn } from "lucide-react";
import Empty from "@/components/ui/empty";
import { supabase } from "@/lib/supabase";

export default function MusicLogin() {
  const conectarSpotify = async () => {
    const { data } = await supabase.auth.getSession();
    const token = data.session?.access_token;

    if (!token) return;

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/spotify/login`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    const json = await res.json();
    window.location.href = json.url;
  };

  return (
    <Empty
      image="/music/spotify.svg"
      title="Música para foco"
      description="Conecte sua conta Spotify para continuar"
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