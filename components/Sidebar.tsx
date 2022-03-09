import { useCallback, useEffect, useState } from "react";
import {
  HomeIcon,
  SearchIcon,
  LibraryIcon,
  PlusCircleIcon,
  HeartIcon,
  RssIcon,
  LogoutIcon,
} from "@heroicons/react/outline";
import { useSession } from "next-auth/react";
import useSpotify from "../hooks/useSpotify";
import { useRecoilState } from "recoil";
import { playListState } from "../atoms/playlist";
function Sidebar() {
  const { data: session } = useSession();
  const spotifyApi = useSpotify();

  const [playlist, setPlaylist] = useRecoilState(playListState);
  const [playlists, setPlaylists] = useState<
    SpotifyApi.PlaylistObjectSimplified[]
  >([]);

  useEffect(() => {
    if (spotifyApi.getAccessToken()) {
      spotifyApi.getUserPlaylists().then((data) => {
        setPlaylists(data.body.items);
      });
    }
  }, [session, useSpotify]);

  const setPlaylistCurried = useCallback(
    (playlist: SpotifyApi.PlaylistObjectSimplified) => () => {
      setPlaylist(playlist);
      spotifyApi
        .getPlaylist(playlist.id)
        .then(({ body }) => {
          setPlaylist(body);
        })
        .catch((error) => {
          console.error("getPlaylistError", error);
          setPlaylist(null);
          // TODO: temporally hide failing playlist?
        });
    },
    [playlist]
  );

  return (
    <div className="hidden h-screen overflow-y-scroll border-r border-neutral-900 p-5 pb-28 text-xs text-neutral-500  scrollbar-hide sm:max-w-[12rem] md:block lg:max-w-[15rem] lg:text-sm">
      <div className=" select-none space-y-4 ">
        <button className="flex items-center space-x-2 hover:text-white">
          <HomeIcon className="h-5 w-5" />
          <p>Home</p>
        </button>
        <button className="flex items-center space-x-2 hover:text-white">
          <SearchIcon className="h-5 w-5" />
          <p>Search</p>
        </button>
        <button className="flex items-center space-x-2 hover:text-white">
          <LibraryIcon className="h-5 w-5" />
          <p>Your library</p>
        </button>
        <hr className="border-t-[0.1px] border-neutral-900" />

        <button className="flex items-center space-x-2 hover:text-white">
          <PlusCircleIcon className="h-5 w-5" />
          <p>Create Playlist</p>
        </button>
        <button className="flex items-center space-x-2 hover:text-white">
          <HeartIcon className="h-5 w-5" />
          <p>Liked Songs</p>
        </button>
        <button className="flex items-center space-x-2 hover:text-white">
          <RssIcon className="h-5 w-5" />
          <p>Your Episodes</p>
        </button>
        <hr className="border-t-[0.1px] border-neutral-900" />

        <h5 className="select-text text-center text-lg">Playlists!</h5>
        {playlists.map((playlist) => (
          <p
            onClick={setPlaylistCurried(playlist)}
            key={playlist.id}
            className="cursor-pointer hover:text-white"
          >
            {playlist.name}
          </p>
        ))}
      </div>
    </div>
  );
}

export default Sidebar;
