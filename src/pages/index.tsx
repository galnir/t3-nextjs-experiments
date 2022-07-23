import type { NextPage } from "next";
import { trpc } from "../utils/trpc";

const Home: NextPage = () => {
  const hello = trpc.proxy.example.hello.useQuery({ text: "from tRPC" });

  return (
    <>
      <div>
        <h1>Hi</h1>
      </div>
    </>
  );
};

export default Home;
