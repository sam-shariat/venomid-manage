import type { AppProps } from 'next/app';
import ThemeProvider from 'components/Provider/ThemeProvider';
import Layout from 'components/Layout';
import { useDirectionSetter } from 'core/lib/hooks/use-directionSetter';
import { VenomConfig } from 'venom-react-hooks';
import { initVenomConnect } from 'components/venomConnect/configure';
import '../styles/globals.css';
import { Analytics } from '@vercel/analytics/react';

function MyApp({ Component, pageProps }: AppProps) {
  useDirectionSetter();

  return (
    <ThemeProvider>
      <VenomConfig initVenomConnect={initVenomConnect}>
        <Layout>
          <Component {...pageProps} />
          <Analytics />
        </Layout>
      </VenomConfig>
    </ThemeProvider>
  );
}

export default MyApp;
