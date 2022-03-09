import type { NextPage } from "next";
import { getSession, GetSessionParams } from "next-auth/react";
import Head from "next/head";
import Center from "../components/Center";
import Player from "../components/Player";
import Sidebar from "../components/Sidebar";

const Home: NextPage = () => {
  return (
    <div className="h-screen overflow-hidden bg-black">
      <Head>
        <title>Spotify</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex">
        <Sidebar />
        <Center />
      </main>

      <footer className="sticky bottom-0">
        <Player />
      </footer>
    </div>
  );
};

export default Home;

export async function getServerSideProps(context: GetSessionParams) {
  const session = await getSession(context);

  return {
    props: {
      session,
    },
  };
}
