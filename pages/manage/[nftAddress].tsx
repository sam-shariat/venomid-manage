import type { NextPage } from 'next';
import Head from 'next/head';
import ManageSection from 'components/sections/ManageSection';
import Seo from 'components/Layout/Seo'
import { SITE_DESCRIPTION, SITE_URL, SITE_TITLE } from 'core/utils/constants';
import UpdatingSection from 'components/sections/UpdatingSection';

const Home: NextPage = () => {
  const origin = typeof window !== 'undefined' && window.location.origin ? window.location.origin : SITE_URL;
  return (
    <>
    <Seo />
    <Head>
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={SITE_TITLE} />
        <meta name="twitter:description" content={SITE_DESCRIPTION} />
        <meta name="twitter:image" content={`${origin}/vidorigin.png`} />
        <link rel="icon" type="image/png" href="/logos/vidicon.png" />
      </Head>
      
      {/* <ClaimSection /> */}
      {/* <ManageSection /> */}
      <UpdatingSection />
    </>
  );
};

export default Home;
