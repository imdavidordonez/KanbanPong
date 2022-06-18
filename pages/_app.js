import { SessionProvider as AuthProvider } from "next-auth/react";
import { Toaster } from "react-hot-toast";
import "../styles/globals.css";

// allow session state to be shared between pages.
function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <>
      <AuthProvider session={session}>
        <Component {...pageProps} />
      </AuthProvider>

      <Toaster />
    </>
  );
}

export default MyApp;
