import { useEffect, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { atomCurrentTrackIdState } from "../atoms/Song";
import useSpotify from "./useSpotify";

function useSongInfo() {
  const spotifyApi = useSpotify();
  const currentTrackId = useRecoilValue(atomCurrentTrackIdState);

  const [songInfo, setSongInfo] = useState<SpotifyApi.TrackObjectFull | null>(
    null
  );

  useEffect(() => {
    (async () => {
      if (currentTrackId) {
        const trackInfo = await fetch(
          `https://api.spotify.com/v1/tracks/${currentTrackId}`,
          {
            headers: {
              Authorization: `Bearer ${spotifyApi.getAccessToken()}`,
            },
          }
        ).then((res) => res.json());

        setSongInfo(trackInfo);
      }
    })();
  }, [currentTrackId, spotifyApi]);

  return songInfo;
}

export default useSongInfo;
