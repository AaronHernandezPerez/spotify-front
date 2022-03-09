import { useCallback, useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { useRecoilState } from "recoil";
import { SwitchHorizontalIcon, VolumeOffIcon } from "@heroicons/react/outline";
import {
  FastForwardIcon,
  RewindIcon,
  PauseIcon,
  PlayIcon,
  ReplyIcon,
  VolumeUpIcon,
} from "@heroicons/react/solid";
import useSpotify from "../hooks/useSpotify";
import { atomCurrentTrackIdState, isPlayingState } from "../atoms/Song";
import useSongInfo from "../hooks/useSongInfo";
import debounce from "lodash/debounce";
import Show from "./Show";

function Player() {
  const spotifyApi = useSpotify();
  const { data: session, status } = useSession();
  const [currentTrackId, setCurrentTrackId] = useRecoilState(
    atomCurrentTrackIdState
  );
  const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState);
  const [volume, setVolume] = useState(50);
  const [disabled, setDisabled] = useState(false);
  const disabledClass = useMemo(() => (disabled ? "disabled" : ""), [disabled]);
  const songInfo = useSongInfo();

  const fetchCurrentSong = () => {
    if (!songInfo) {
      spotifyApi.getMyCurrentPlayingTrack().then(({ body }) => {
        if (body?.item?.id) {
          setCurrentTrackId(body.item.id);
          spotifyApi.getMyCurrentPlaybackState().then(({ body }) => {
            setIsPlaying(body.is_playing);
          });
        }
      });
    }
  };

  const handlePlayPause = () => {
    spotifyApi.getMyCurrentPlaybackState().then(({ body }) => {
      let promise;

      if (body?.is_playing) {
        promise = spotifyApi.pause();
        setIsPlaying(false);
      } else {
        promise = spotifyApi.play();
        setIsPlaying(true);
      }

      promise.catch((error) => {
        console.error(`playError ${isPlaying}`, error);
      });
    });
  };

  const clickHandler = (fn: (e?: any) => any) => (e: any) => {
    if (!disabled) {
      fn(e);
    }
  };

  const debounceAdjustVolume = useCallback(
    debounce(
      (volume) =>
        spotifyApi.setVolume(volume).catch((error) => {
          console.error("setVolume error", error);
        }),
      200,
      { maxWait: 500 }
    ),
    [spotifyApi, setVolume]
  );

  useEffect(() => {
    if (spotifyApi.getAccessToken() && !currentTrackId) {
      fetchCurrentSong();
      setVolume(50);
    }
  }, [currentTrackId, spotifyApi, session]);

  useEffect(() => {
    if (volume >= 0 && volume <= 100) {
      debounceAdjustVolume(volume);
    }
  }, [volume]);

  useEffect(() => {
    if (currentTrackId) {
      setDisabled(false);
    } else {
      setDisabled(true);
    }
  }, [currentTrackId]);

  return (
    <div className="grid h-24 grid-cols-3 bg-gradient-to-b from-black to-neutral-900 text-xs text-white md:px-8 md:text-base">
      {/* Left */}
      <div className="flex items-center space-x-4">
        <Show when={!!currentTrackId}>
          <img
            className="hidden h-10 w-10 md:block"
            src={songInfo?.album.images?.[0]?.url}
          />
          <div>
            <h3>{songInfo?.name}</h3>
            <p>{songInfo?.artists[0].name}</p>
          </div>
        </Show>
      </div>

      {/* Center */}
      <div className="flex items-center justify-evenly">
        <SwitchHorizontalIcon className={`button ${disabledClass}`} />
        <RewindIcon
          className={`button ${disabledClass}`}
          onClick={clickHandler(() =>
            spotifyApi.skipToPrevious().catch((error) => {
              console.error("skipToPrevious error", error);
            })
          )}
        />
        {isPlaying ? (
          <PauseIcon
            onClick={clickHandler(handlePlayPause)}
            className={`button h-10 w-10 ${disabledClass}`}
          />
        ) : (
          <PlayIcon
            onClick={clickHandler(handlePlayPause)}
            className={`button h-10 w-10 ${disabledClass}`}
          />
        )}
        <FastForwardIcon
          className={`button ${disabledClass}`}
          onClick={clickHandler(() =>
            spotifyApi.skipToNext().catch((error) => {
              console.error("skipToNext error", error);
            })
          )}
        />
        <ReplyIcon className={`button ${disabledClass}`} />
      </div>

      {/* Right */}
      <div className="flex items-center justify-end space-x-3 pr-5 md:space-x-4">
        <VolumeOffIcon
          className={`button ${disabledClass}`}
          onClick={clickHandler(() => volume > 0 && setVolume(volume - 10))}
        />
        <input
          className={`w-14 md:w-28 ${disabledClass}`}
          type="range"
          value={volume}
          onChange={clickHandler((e) => setVolume(Number(e.target.value)))}
          min={0}
          max={100}
        />
        <VolumeUpIcon
          className={`button ${disabledClass}`}
          onClick={clickHandler(() => volume < 100 && setVolume(volume + 10))}
        />
      </div>
    </div>
  );
}

export default Player;
