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
    ].join(" ");

    const state = Buffer.from(
      JSON.stringify({
        userId: appUserId,
      }),
    ).toString("base64url");

    const params = new URLSearchParams({
      client_id: this.clientId,
      response_type: "code",
      redirect_uri: this.redirectUri,
      scope,
      state,
    });

    return {
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
            Buffer.from(
              `${this.clientId}:${this.clientSecret}`,
            ).toString("base64"),
        },
        body: new URLSearchParams({
          grant_type: "authorization_code",
          code,
          redirect_uri: this.redirectUri,
        }),
      },
    );

    const tokenData = await tokenResponse.json();

    console.log("SPOTIFY TOKEN RESPONSE:", tokenData);

    if (!tokenData.access_token) {
      throw new UnauthorizedException(
        JSON.stringify(tokenData),
      );
    }

    const meResponse = await fetch(
      "https://api.spotify.com/v1/me",
      {
        headers: {
          Authorization: `Bearer ${tokenData.access_token}`,
        },
      },
    );

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
      where: {
        userId: appUserId,
      },
      create: {
        userId: appUserId,
        spotifyId: me.id,
        accessToken: tokenData.access_token,
        refreshToken: tokenData.refresh_token,
        expiresAt: new Date(
          Date.now() + tokenData.expires_in * 1000,
        ),
      },
      update: {
        spotifyId: me.id,
        accessToken: tokenData.access_token,
        refreshToken:
          tokenData.refresh_token,
        expiresAt: new Date(
          Date.now() + tokenData.expires_in * 1000,
        ),
      },
    });

    return {
      redirect: `${this.frontendUrl}/music`,
    };
  }

  async getValidAccessToken(appUserId: string) {
    const spotify = await this.prisma.userSpotify.findUnique({
      where: {
        userId: appUserId,
      },
    });

    if (!spotify) {
      return null;
    }

    const expiresSoon =
      spotify.expiresAt.getTime() - Date.now() < 60_000;

    if (!expiresSoon) {
      return {
        accessToken: spotify.accessToken,
        expiresAt: spotify.expiresAt,
      };
    }

    const response = await fetch(
      "https://accounts.spotify.com/api/token",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization:
            "Basic " +
            Buffer.from(
              `${this.clientId}:${this.clientSecret}`,
            ).toString("base64"),
        },
        body: new URLSearchParams({
          grant_type: "refresh_token",
          refresh_token: spotify.refreshToken,
        }),
      },
    );

    const tokenData = await response.json();

    if (!tokenData.access_token) {
      return null;
    }

    const updated = await this.prisma.userSpotify.update({
      where: {
        userId: appUserId,
      },
      data: {
        accessToken: tokenData.access_token,
        refreshToken:
          tokenData.refresh_token ??
          spotify.refreshToken,
        expiresAt: new Date(
          Date.now() + tokenData.expires_in * 1000,
        ),
      },
    });

    return {
      accessToken: updated.accessToken,
      expiresAt: updated.expiresAt,
    };
  }

  async getMySpotify(appUserId: string) {
    const spotify = await this.prisma.userSpotify.findUnique({
      where: {
        userId: appUserId,
      },
    });

    if (!spotify) {
      return {
        connected: false,
      };
    }

    const token = await this.getValidAccessToken(
      appUserId,
    );

    return {
      connected: true,
      spotifyId: spotify.spotifyId,
      accessToken: token?.accessToken,
      expiresAt: token?.expiresAt,
    };
  }


  async getProfile(userId: string) {
  const token = await this.getValidAccessToken(userId);

  const response = await fetch(
    "https://api.spotify.com/v1/me",
    {
      headers: {
        Authorization: `Bearer ${token?.accessToken}`,
      },
    }
  );

  return response.json();
}
}