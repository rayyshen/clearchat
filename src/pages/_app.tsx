import type { AppProps } from 'next/app';
import { UserProvider } from '../context/UserContext';
import "../app/globals.css";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <UserProvider>
      <Component {...pageProps} />
    </UserProvider>
  );
}

export default MyApp;
