import Head from "next/head";
import React from "react";
import Header from "../Header";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Head>
        <title>T3 App</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <div className="container h-screen px-4 py-2">
        <Header />
        <main>{children}</main>
      </div>
    </>
  );
}
