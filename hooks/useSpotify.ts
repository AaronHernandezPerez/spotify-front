import { useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import spotifyApi from "../lib/spotify";

function useSpotify() {
  const { data: session, status } = useSession();

  useEffect(() => {
    if (session) {
      console.log("session", session);
      if (session.error === "RefreshTokenError") {
        console.error("RefreshTokenError", { status });
        signOut();
      }

      if (session.user?.accessToken) {
        spotifyApi.setAccessToken(session.user?.accessToken);
      } else {
        console.log("No access token");
      }
    } else {
      console.error("No session");
    }
  }, [session]);

  return spotifyApi;
}

export default useSpotify;
