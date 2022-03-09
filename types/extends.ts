import "next-auth";

declare module "next-auth" {
  interface Session {
    user?: {
      name?: string | null;
      email?: string | null;
      image?: string | null;
      accessToken?: string;
      refreshToken?: string;
      username?: string;
    };
    error?: string;
  }
}

declare module "next-auth/jwt" {
  interface DefaultJWT {
    accessToken?: string;
    refreshToken?: string;
    accessTokenExpires?: number;
    error?: string;
  }
}

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      SPOTIFY_ID: string;
      SPOTIFY_SECRET: string;
    }
  }
}
