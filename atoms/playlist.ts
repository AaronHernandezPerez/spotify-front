import { atom } from "recoil";

export type PlaylistStateType =
  | SpotifyApi.SinglePlaylistResponse
  | SpotifyApi.PlaylistObjectSimplified
  | null;

export const playListState = atom<PlaylistStateType>({
  key: "playlistIdState",
  default: null,
});
