import { atom } from "recoil";

export const atomCurrentTrackIdState = atom<string | null>({
  key: "atomCurrentTrackIdState",
  default: null,
});

export const isPlayingState = atom<boolean>({
  key: "isPlayingstate",
  default: false,
});
