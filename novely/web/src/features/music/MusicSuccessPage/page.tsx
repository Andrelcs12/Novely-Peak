"use client";

import { useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";

// troque por qualquer track URI válido
const TEST_TRACK_URI = "spotify:track:7qiZfU4dY1lWllzX7mPBI3";

declare global {
  interface Window {
    onSpotifyWebPlaybackSDKReady: () => void;
    Spotify: any;
  }
}

export default function MusicSuccessPage() {
  const [status, setStatus] = useState("Carregando...");
  const [deviceId, setDeviceId] = useState<string | null>(null);
  const tokenRef = useRef<string | null>(null);

  useEffect(() => {
    const load = async () => {
      const { data: sessionData } = await supabase.auth.getSession();
      const appToken = sessionData.session?.access_token;

      if (!appToken) {
        setStatus("Você precisa estar logado.");
        return;
      }

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/spotify/me`, {
        headers: { Authorization: `Bearer ${appToken}` },
      });
      const data = await res.json();

      if (!data.connected || !data.accessToken) {
        setStatus("Spotify não conectado.");
        return;
      }

      tokenRef.current = data.accessToken;
      loadSdk();
    };

    load();
  }, []);

  const loadSdk = () => {
    const script = document.createElement("script");
    script.src = "https://sdk.scdn.co/spotify-player.js";
    script.async = true;
    document.body.appendChild(script);

    window.onSpotifyWebPlaybackSDKReady = () => {
      const player = new window.Spotify.Player({
        name: "Novely Peak Player",
        getOAuthToken: (cb: (token: string) => void) => cb(tokenRef.current!),
        volume: 0.5,
      });

      player.addListener("ready", ({ device_id }: any) => {
        setDeviceId(device_id);
        setStatus("Player pronto.");
      });

      player.addListener("not_ready", () => setStatus("Player ficou offline."));
      player.addListener("authentication_error", () =>
        setStatus("Token inválido/expirado.")
      );
      player.addListener("account_error", () =>
        setStatus("Isso exige conta Spotify Premium.")
      );

      player.connect();
    };
  };

  const playTestTrack = async () => {
    if (!deviceId || !tokenRef.current) return;

    await fetch(
      `https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${tokenRef.current}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ uris: [TEST_TRACK_URI] }),
      }
    );
  };

  return (
    <div>
      <h1>Spotify conectado</h1>
      <p>{status}</p>
      <Button  onClick={playTestTrack} disabled={!deviceId}>
        Tocar música de teste
      </Button>
    </div>
  );
}