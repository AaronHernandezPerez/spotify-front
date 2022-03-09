import { useRecoilState } from "recoil";
import { millisToMinutesAndSeconds } from "../helpers";
import spotifyApi from "../lib/spotify";
import { atomCurrentTrackIdState, isPlayingState } from "../atoms/Song";

function Song({
  track,
  order,
}: {
  track: SpotifyApi.TrackObjectFull;
  order: number;
}) {
  const [currentTrackId, setCurrentTrackId] = useRecoilState(
    atomCurrentTrackIdState
  );
  const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState);

  const playSong = () => {
    setCurrentTrackId(track.id);
    setIsPlaying(true);
    spotifyApi
      .play({
        uris: [track.uri],
      })
      .catch((error) => {
        console.error("spotifyApi.play error", error);
        if (error.reason === "PREMIUM_REQUIRED") {
          // TODO: inform user
        }
      });
  };

  return (
    <div
      className="grid cursor-pointer grid-cols-2 rounded-lg py-4 px-5 text-neutral-500 hover:bg-neutral-900"
      onClick={playSong}
    >
      <div className="flex items-center space-x-4">
        <p>{order}</p>
        <img className="h-10 w-10" src={track.album.images[0].url} />
        <div>
          <p className="w-36 truncate text-white lg:w-64">{track.name}</p>
          <p className="w-36">{track.artists[0].name}</p>
        </div>
      </div>

      <div className="ml-auto flex items-center justify-between md:ml-0">
        <p className="hidden w-40 md:block">{track.album.name}</p>
        <p>{millisToMinutesAndSeconds(track.duration_ms)}</p>
      </div>
    </div>
  );
}

export default Song;
