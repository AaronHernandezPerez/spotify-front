import { useEffect, useState } from "react";
import { ChevronDownIcon } from "@heroicons/react/outline";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { shuffle } from "lodash";
import { useRecoilValue } from "recoil";
import { playListState } from "../atoms/playlist";
import useSpotify from "../hooks/useSpotify";
import Show from "./Show";
import ShowElse from "./ShowElse";
import Songs from "./Songs";
const colors = [
  "from-indigo-500",
  "from-blue-500",
  "from-green-500",
  "from-red-500",
  "from-yellow-500",
  "from-pink-500",
  "from-purple-500",
];

function Center() {
  const spotifyApi = useSpotify();
  const { data: session } = useSession();
  const [color, setColor] = useState(colors[0]);
  const playlist = useRecoilValue(playListState);

  useEffect(() => {
    let newColor;
    do {
      newColor = shuffle(colors).pop() as string;
    } while (newColor === color);
    setColor(newColor);
  }, [playlist && playlist.id]);

  const imageSize = 32;

  return (
    <div className="h-screen flex-grow overflow-y-scroll pb-24 text-white scrollbar-hide">
      <header className="absolute top-5 right-8">
        <div
          className="flex cursor-pointer items-center space-x-3 rounded-full bg-black p-1 pr-2 opacity-90 hover:opacity-80"
          onClick={() => signOut()}
        >
          <Image
            className="rounded-full"
            src={session?.user?.image || "/spotifyLogo.svg"}
            layout="fixed"
            width={imageSize}
            height={imageSize}
          />
          <h2>{session?.user?.name}</h2>
          <ChevronDownIcon className="h-5 w-5" />
        </div>
      </header>

      <section
        className={`flex h-80 items-end space-x-7 bg-gradient-to-b p-8 ${color} to-black`}
      >
        <Show when={!!playlist}>
          <div className="flex items-center">
            <img
              className="h-44 w-44 shadow-2xl"
              src={playlist?.images[0]?.url}
            />
          </div>
          <div>
            <p>PLAYLIST</p>
            <h1 className="2xl md:text-3xl xl:text-5xl">{playlist?.name}</h1>
          </div>

          <ShowElse>
            <h2 className="text-2xl md:text-4xl lg:text-6xl">
              Select a playlist!
            </h2>
          </ShowElse>
        </Show>
      </section>

      <Show when={!!playlist}>
        <div className="p-4">
          <Songs />
        </div>
      </Show>
    </div>
  );
}

export default Center;
