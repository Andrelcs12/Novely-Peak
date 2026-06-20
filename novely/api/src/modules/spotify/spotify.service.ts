import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PrismaService } from "@/prisma.service";
import { AuthService } from "../auth/auth.service";

@Injectable()
export class SpotifyService {
  constructor(
    private prisma: PrismaService,
    private authService: AuthService,
  ) {}

  private readonly clientId = process.env.SPOTIFY_CLIENT_ID!;
  private readonly clientSecret = process.env.SPOTIFY_CLIENT_SECRET!;
  private readonly redirectUri = process.env.SPOTIFY_REDIRECT_URI!;
  private readonly frontendUrl = process.env.FRONTEND_URL!;

  login(appUserId: string) {
    const scope = [
      "streaming",
      "user-read-email",
      "user-read-private",
      "user-read-playback-state",
      "user-modify-playback-state",
      "user-read-currently-playing",
      "playlist-read-private",
      "playlist-read-collaborative",
      "user-top-read", // Correctamente incluído aqui!
    ].join(" ");

    const state = Buffer.from(
      JSON.stringify({ userId: appUserId }),
    ).toString("base64url");

    const params = new URLSearchParams({
      client_id: this.clientId,
      response_type: "code",
      redirect_uri: this.redirectUri,
      scope,
      state,
    });

    return {
      // CORRIGIDO: Adicionado o '$' antes da interpolação das chaves
      url: `https://accounts.spotify.com/authorize?${params.toString()}`,
    };
  }

  async callback(code: string, state: string) {
    let appUserId: string;

    try {
      const decoded = JSON.parse(
        Buffer.from(state, "base64url").toString("utf-8"),
      );
      appUserId = decoded.userId;
    } catch {
      throw new UnauthorizedException("State inválido");
    }

    const tokenResponse = await fetch(
      "https://accounts.spotify.com/api/token",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization:
            "Basic " +
            Buffer.from(`${this.clientId}:${this.clientSecret}`).toString("base64"),
        },
        body: new URLSearchParams({
          grant_type: "authorization_code",
          code,
          redirect_uri: this.redirectUri,
        }),
      },
    );

    const tokenData = await tokenResponse.json();

    if (!tokenData.access_token) {
      console.error("Erro ao obter tokens do Spotify:", tokenData);
      throw new UnauthorizedException("Falha na autenticação com o Spotify");
    }

    const meResponse = await fetch("https://api.spotify.com/v1/me", {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });

    const me = await meResponse.json();

    await this.authService.getOrCreateUser({
      id: appUserId,
      email: me.email || `${me.id}@spotify.user`,
      metadata: {
        name: me.display_name,
        avatar_url: me.images?.[0]?.url,
      },
    });

    await this.prisma.userSpotify.upsert({
      where: { userId: appUserId },
      create: {
        userId: appUserId,
        spotifyId: me.id,
        accessToken: tokenData.access_token,
        refreshToken: tokenData.refresh_token,
        expiresAt: new Date(Date.now() + tokenData.expires_in * 1000),
      },
      update: {
        spotifyId: me.id,
        accessToken: tokenData.access_token,
        refreshToken: tokenData.refresh_token ?? undefined, // Evita sobrescrever com null se não vier no payload
        expiresAt: new Date(Date.now() + tokenData.expires_in * 1000),
      },
    });

    return {
      redirect: `${this.frontendUrl}/music`,
    };
  }

  async getValidAccessToken(appUserId: string) {
    const spotify = await this.prisma.userSpotify.findUnique({
      where: { userId: appUserId },
    });

    if (!spotify) return null;

    // Renova o token faltando 1 minuto para expirar
    const expiresSoon = spotify.expiresAt.getTime() - Date.now() < 60_000;

    if (!expiresSoon) {
      return {
        accessToken: spotify.accessToken,
        expiresAt: spotify.expiresAt,
      };
    }

    try {
      const response = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization:
            "Basic " +
            Buffer.from(`${this.clientId}:${this.clientSecret}`).toString("base64"),
        },
        body: new URLSearchParams({
          grant_type: "refresh_token",
          refresh_token: spotify.refreshToken,
        }),
      });

      const tokenData = await response.json();

      if (!tokenData.access_token) return null;

      const updated = await this.prisma.userSpotify.update({
        where: { userId: appUserId },
        data: {
          accessToken: tokenData.access_token,
          refreshToken: tokenData.refresh_token ?? spotify.refreshToken,
          expiresAt: new Date(Date.now() + tokenData.expires_in * 1000),
        },
      });

      return {
        accessToken: updated.accessToken,
        expiresAt: updated.expiresAt,
      };
    } catch (error) {
      console.error("Erro ao renovar token do Spotify:", error);
      return null;
    }
  }

  async getMySpotify(appUserId: string) {
    const spotify = await this.prisma.userSpotify.findUnique({
      where: { userId: appUserId },
    });

    if (!spotify) return { connected: false };

    const token = await this.getValidAccessToken(appUserId);

    return {
      connected: true,
      spotifyId: spotify.spotifyId,
      accessToken: token?.accessToken,
      expiresAt: token?.expiresAt,
    };
  }

  async getProfile(userId: string) {
    const token = await this.getValidAccessToken(userId);
    if (!token?.accessToken) throw new UnauthorizedException("Spotify não conectado");

    const response = await fetch("https://api.spotify.com/v1/me", {
      headers: { Authorization: `Bearer ${token.accessToken}` },
    });

    const data = await response.json();
    if (!response.ok) throw new UnauthorizedException("Erro ao buscar profile Spotify");

    return data;
  }

  async getTopTracks(userId: string) {
    const token = await this.getValidAccessToken(userId);
    if (!token?.accessToken) throw new UnauthorizedException("Spotify não conectado");

    const res = await fetch("https://api.spotify.com/v1/me/top/tracks?limit=10", {
      headers: { Authorization: `Bearer ${token.accessToken}` },
    });

    const data = await res.json();
    if (!res.ok) return []; // Retorna array vazio em vez de estourar erro 403 se faltar escopo

    return data.items ?? [];
  }

  async getTopArtists(userId: string) {
    const token = await this.getValidAccessToken(userId);
    if (!token?.accessToken) throw new UnauthorizedException("Spotify não conectado");

    const res = await fetch("https://api.spotify.com/v1/me/top/artists?limit=10", {
      headers: { Authorization: `Bearer ${token.accessToken}` },
    });

    const data = await res.json();
    if (!res.ok) return []; // Retorna array vazio de forma resiliente

    return data.items ?? [];
  }

  async getExtendedProfile(userId: string) {
    // MELHORIA: Executa em paralelo mas lida individualmente com falhas de escopo ou rede
    const [profileResult, tracksResult, artistsResult] = await Promise.allSettled([
      this.getProfile(userId),
      this.getTopTracks(userId),
      this.getTopArtists(userId),
    ]);

    return {
      profile: profileResult.status === "fulfilled" ? profileResult.value : null,
      topTracks: tracksResult.status === "fulfilled" ? tracksResult.value : [],
      topArtists: artistsResult.status === "fulfilled" ? artistsResult.value : [],
    };
  }

  async getPlaylists(userId: string) {
    const token = await this.getValidAccessToken(userId);
    if (!token?.accessToken) throw new UnauthorizedException("Spotify não conectado");

    const response = await fetch("https://api.spotify.com/v1/me/playlists", {
      headers: { Authorization: `Bearer ${token.accessToken}` },
    });

    const data = await response.json();
    if (!response.ok) throw new UnauthorizedException(`Spotify error ${response.status}`);

    return data;
  }
}