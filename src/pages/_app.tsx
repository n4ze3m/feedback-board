import type { AppProps } from "next/app";
import { api } from "../utils/api";
import "../styles/globals.css";
import {
  createBrowserSupabaseClient,
  Session,
} from "@supabase/auth-helpers-nextjs";
import React from "react";
import { SessionContextProvider } from "@supabase/auth-helpers-react";
import { Poppins } from "@next/font/google";
const poppins = Poppins({
  weight: ["400", "500", "600", "700", "800", "900"],
  style: ["normal"],
  subsets: ["latin"],
});
import NextNProgress from 'nextjs-progressbar';
function MyApp({
  Component,
  pageProps,
}: AppProps<{
  initialSession: Session;
}>): JSX.Element {
  const [supabaseClient] = React.useState(() => createBrowserSupabaseClient());

  return (
    <>
    <NextNProgress />
      <style jsx global>
        {`
        html, body {
          font-family: ${poppins.style.fontFamily} !important;          
        }
      `}
      </style>
      <SessionContextProvider
        supabaseClient={supabaseClient}
        initialSession={pageProps.initialSession}
      >
        <Component {...pageProps} />
      </SessionContextProvider>
    </>
  );
}

export default api.withTRPC(MyApp);
