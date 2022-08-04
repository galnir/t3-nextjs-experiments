// src/pages/_app.tsx
import "../styles/globals.css";
import { SessionProvider } from "next-auth/react";
import type { AppType } from "next/dist/shared/lib/utils";
import { trpc } from "../utils/trpc";
import Layout from "../components/Layout";
import ErrorBoundary from "../components/ErrorBoundary";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const MyApp: AppType = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <Layout>
        <ErrorBoundary>
          <ToastContainer theme={"light"} toastClassName="p-4" />
          <Component {...pageProps} />
        </ErrorBoundary>
      </Layout>
    </SessionProvider>
  );
};

export default trpc.withTRPC(MyApp);
