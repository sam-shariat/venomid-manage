import type { AppProps } from 'next/app';
import { SWRConfig } from 'swr';
import { fetcher } from 'core/utils';
import ThemeProvider from 'components/Provider/ThemeProvider';
import Layout from 'components/Layout';
import { useDirectionSetter } from 'core/lib/hooks/use-directionSetter';
import { SessionProvider } from 'next-auth/react';
import type { Session } from 'next-auth';
import '../styles/globals.css';

function MyApp({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps<{ session: Session }>) {
  useDirectionSetter();

  return (
    <SessionProvider session={session}>
      <ThemeProvider>
        <SWRConfig
          value={{
            fetcher,
            provider: () => new Map(),
            onError: (error, key) => {
              /**
               * Handle error globaly from SWR
               */
            },
          }}>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </SWRConfig>
      </ThemeProvider>
    </SessionProvider>
  );
}

export default MyApp;
