import { useRecoilValue } from "recoil";
import { playListState } from "../atoms/playlist";
import { isFullPlaylist } from "../types/guards";
import Song from "./Song";

function Songs() {
  const playList = useRecoilValue(playListState);
  if (!isFullPlaylist(playList)) {
    return null;
  }

  return (
    <div>
      {playList?.tracks?.items.map(({ track }, i) => (
        <Song key={track.id} order={i + 1} track={track} />
      ))}
    </div>
  );
}

export default Songs;
