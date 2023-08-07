import React from 'react'
import { SITE_DESCRIPTION, SITE_FULL_DESCRIPTION, SITE_TITLE, SITE_URL, SOCIAL_TWITTER, TWITTER_URL } from 'core/utils/constants'
import { DefaultSeo } from 'next-seo'

interface Props {
  title?: string;
  description?: string;
}
export default function Seo({title,description}:Props) {
  const origin = typeof window !== 'undefined' && window.location.origin ? window.location.origin : SITE_URL;
  return (
    <DefaultSeo
      title={title ? title : SITE_TITLE}
      defaultTitle={SITE_TITLE}
      titleTemplate={`%s | ${description ? description : SITE_DESCRIPTION}`}
      description={description ? description : SITE_FULL_DESCRIPTION}
      canonical={origin}
      themeColor={'#101212'}
      defaultOpenGraphImageWidth={1200}
      defaultOpenGraphImageHeight={550}
      openGraph={{
        type: 'website',
        siteName: SITE_TITLE,
        url: origin,
        images: [
          {
            url: `${origin}/vidorigin.png`,
            alt: `${SITE_TITLE} Open Graph Image`,
          },
        ],
      }}
      twitter={{
        handle: `@${SOCIAL_TWITTER}`,
        site: `@${SOCIAL_TWITTER}`,
        cardType: 'summary_large_image',
      }}
      additionalLinkTags={[
        {
          rel: 'icon',
          href: `/logos/vidicon.png`,
        },
        {
          rel: 'apple-touch-icon',
          href: `/logos/vidicon.png`,
          sizes: '76x76'
        },
        {
          rel: 'manifest',
          href: '/manifest.json'
        },
      ]}
    />
  )
}
