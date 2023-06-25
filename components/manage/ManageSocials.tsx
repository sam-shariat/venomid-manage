import { Stack } from '@chakra-ui/react';
import React, { useEffect } from 'react';
import ManageLink from 'components/manage/ManageLink';
import { signIn, signOut, useSession } from "next-auth/react"
import {
  RiTwitterFill,
  RiTelegramFill,
  RiFacebookFill,
  RiDiscordFill,
  RiMediumFill,
  RiYoutubeFill,
  RiLinkedinFill,
  RiGithubFill,
  RiPinterestFill,
  RiInstagramFill,
  RiSailboatFill,
  RiTwitterLine,
  RiTelegramLine,
  RiFacebookLine,
  RiDiscordLine,
  RiMediumLine,
  RiYoutubeLine,
  RiLinkedinLine,
  RiGithubLine,
  RiPinterestLine,
  RiInstagramLine,
  RiSailboatLine,
} from 'react-icons/ri';
import { useAtom, useAtomValue } from 'jotai';
import {
  addressAtom,
  discordAtom,
  facebookAtom,
  githubAtom,
  instagramAtom,
  linkedinAtom,
  mediumAtom,
  openseaAtom,
  pinterestAtom,
  telegramAtom,
  twitterAtom,
  youtubeAtom,
  useLineIconsAtom
} from 'core/atoms';

interface Props {
  json: any;
  nftAddress: string;
}

export default function ManageSocials({ json, nftAddress }: Props) {
  const [twitter, setTwitter] = useAtom(twitterAtom);
  const wallet = useAtomValue(addressAtom);
  const useLineIcons = useAtomValue(useLineIconsAtom);
  const [discord, setDiscord] = useAtom(discordAtom);
  const [medium, setMedium] = useAtom(mediumAtom);
  const [linkedin, setLinkedin] = useAtom(linkedinAtom);
  const [youtube, setYoutube] = useAtom(youtubeAtom);
  const [github, setGithub] = useAtom(githubAtom);
  const [pinterest, setPinterest] = useAtom(pinterestAtom);
  const [instagram, setInstagram] = useAtom(instagramAtom);
  const [opensea, setOpensea] = useAtom(openseaAtom);
  const [telegram, setTelegram] = useAtom(telegramAtom);
  const [facebook, setFacebook] = useAtom(facebookAtom);
  const { data: session, status } = useSession()

  function verifyTwitter(){
    console.log('verifying twitter');
    signIn()
  }

  useEffect(() => {
    setTwitter(json.socials.twitter);
    setDiscord(json.socials.discord);
    setMedium(json.socials.medium);
    setLinkedin(json.socials.linkedin);
    setYoutube(json.socials.youtube);
    setPinterest(json.socials.pinterest);
    setGithub(json.socials.github);
    setInstagram(json.socials.instagram);
    setOpensea(json.socials.opensea);
    setTelegram(json.socials.telegram);
    setFacebook(json.socials.facebook);
  },[]);

  return (
    <Stack my={2}>
      <ManageLink
        icon={useLineIcons ? <RiTwitterLine size="28" /> : <RiTwitterFill size="28" />}
        title="Twitter"
        url={twitter}
        setUrl={setTwitter}
      />
      <ManageLink
        icon={useLineIcons ? <RiDiscordLine size="28" /> : <RiDiscordFill size="28" />}
        title="Discord"
        url={discord}
        setUrl={setDiscord}
      />

      <ManageLink
        icon={useLineIcons ? <RiMediumLine size="28" /> : <RiMediumFill size="28" />}
        title="Medium"
        url={medium}
        setUrl={setMedium}
      />

      <ManageLink
        icon={useLineIcons ? <RiLinkedinLine size="28" /> : <RiLinkedinFill size="28" />}
        title="LinkedIn"
        url={linkedin}
        setUrl={setLinkedin}
      />

      <ManageLink
        icon={useLineIcons ? <RiYoutubeLine size="28" /> : <RiYoutubeFill size="28" />}
        title="Youtube"
        url={youtube}
        setUrl={setYoutube}
      />
      <ManageLink
        icon={useLineIcons ? <RiGithubLine size="28" /> : <RiGithubFill size="28" />}
        title="Github"
        url={github}
        setUrl={setGithub}
      />
      <ManageLink
        icon={useLineIcons ? <RiPinterestLine size="28" /> : <RiPinterestFill size="28" />}
        title="Pinterest"
        url={pinterest}
        setUrl={setPinterest}
      />
      <ManageLink
        icon={useLineIcons ? <RiFacebookLine size="28" /> : <RiFacebookFill size="28" />}
        title="Facebook"
        url={facebook}
        setUrl={setFacebook}
      />
      <ManageLink
        icon={useLineIcons ? <RiInstagramLine size="28" /> : <RiInstagramFill size="28" />}
        title="Instagram"
        url={instagram}
        setUrl={setInstagram}
      />
      <ManageLink
        icon={useLineIcons ? <RiSailboatLine size="28" /> : <RiSailboatFill size="28" />}
        title="Opensea"
        url={opensea}
        setUrl={setOpensea}
      />
      <ManageLink
        icon={useLineIcons ? <RiTelegramLine size="28" /> : <RiTelegramFill size="28" />}
        title="Telegram"
        url={telegram}
        setUrl={setTelegram}
      />
    </Stack>
  );
}
