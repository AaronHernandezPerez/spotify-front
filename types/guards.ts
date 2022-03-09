import { PlaylistStateType } from "../atoms/playlist";

export function isFullPlaylist(
  playlist: PlaylistStateType
): playlist is SpotifyApi.SinglePlaylistResponse {
  return !!(playlist as SpotifyApi.SinglePlaylistResponse)?.tracks?.items;
}
