import Image from "next/image";
import { getProviders, signIn, ClientSafeProvider } from "next-auth/react";

function Login({ providers }: { providers: ClientSafeProvider }) {
  const iconSize = 208;

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-black ">
      <Image
        className=""
        src="/spotifyLogo.svg"
        layout="intrinsic"
        width={iconSize}
        height={iconSize}
      />
      {Object.values(providers).map((provider) => (
        <div className="">
          <button
            key={provider.name}
            className="mt-4 rounded-full bg-neutral-900 px-4 py-2 text-xl text-white hover:opacity-90"
            onClick={() => signIn(provider.id, { callbackUrl: "/" })}
          >
            Login with {provider.name}
          </button>
        </div>
      ))}
    </div>
  );
}

export async function getServerSideProps() {
  const providers = await getProviders();

  return {
    props: {
      providers,
    },
  };
}

export default Login;
