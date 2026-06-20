import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { SpotifyService } from "../spotify.service";

@Injectable()
export class SpotifyPlayerService {
  // Precisa do SpotifyService pra usar getValidAccessToken (que
  // renova o token quando ele tá perto de expirar). Antes esse
  // serviço lia o token direto do banco, sem nunca renovar.
  constructor(private spotifyService: SpotifyService) {}

  private async getToken(userId: string) {
    const token = await this.spotifyService.getValidAccessToken(userId);
    return token?.accessToken;
  }

  async getCurrentTrack(userId: string) {
    const token = await this.getToken(userId);

    if (!token) {
      return null;
    }

    const response = await fetch(
      "https://api.spotify.com/v1/me/player/currently-playing",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (response.status === 204) {
      return null;
    }

    return response.json();
  }

  // Centraliza todo comando de player (play/pause/next/previous/volume).
  // O ponto principal do fix: agora a gente de fato LÊ a resposta do
  // Spotify. Se ele recusar (403 = sem Premium, 404 = sem dispositivo
  // ativo, etc.), a gente joga um HttpException com o status real,
  // em vez de devolver um Response cru que o Nest serializa como {}
  // com status 200 — fazendo o frontend achar que deu tudo certo.
  private async sendPlayerCommand(
    userId: string,
    method: "PUT" | "POST",
    path: string,
    body?: Record<string, unknown>,
  ) {
    const token = await this.getToken(userId);

    if (!token) {
      throw new HttpException(
        "Spotify não conectado",
        HttpStatus.UNAUTHORIZED,
      );
    }

    const response = await fetch(
      `https://api.spotify.com/v1/me/player${path}`,
      {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: body ? JSON.stringify(body) : undefined,
      },
    );

    if (response.ok) {
      // Spotify responde 204 (sem corpo) pra esses comandos.
      return { success: true };
    }

    let message = `Spotify respondeu ${response.status}`;
    try {
      const data = await response.json();
      message = data?.error?.message ?? data?.error?.reason ?? message;
    } catch {
      // resposta sem corpo, mantém a mensagem padrão
    }

    console.error(`[SpotifyPlayer] ${method} ${path} ->`, response.status, message);
    throw new HttpException(message, response.status);
  }

  async play(
    userId: string,
    options?: { uris?: string[]; context_uri?: string },
  ) {
    const body: Record<string, unknown> = {};

    if (options?.context_uri) {
      body.context_uri = options.context_uri;
    } else if (options?.uris?.length) {
      body.uris = options.uris;
    }

    return this.sendPlayerCommand(
      userId,
      "PUT",
      "/play",
      Object.keys(body).length ? body : undefined,
    );
  }

  async pause(userId: string) {
    return this.sendPlayerCommand(userId, "PUT", "/pause");
  }

  async next(userId: string) {
    return this.sendPlayerCommand(userId, "POST", "/next");
  }

  async previous(userId: string) {
    return this.sendPlayerCommand(userId, "POST", "/previous");
  }

  async setVolume(userId: string, volumePercent: number) {
    const clamped = Math.max(0, Math.min(100, Math.round(volumePercent)));
    return this.sendPlayerCommand(
      userId,
      "PUT",
      `/volume?volume_percent=${clamped}`,
    );
  }
}