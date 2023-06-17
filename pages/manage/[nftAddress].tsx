import type { NextPage } from 'next';
import Head from 'next/head';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Address, ProviderRpcClient } from 'everscale-inpage-provider';
import {
  useMediaQuery,
  useColorMode,
  Button,
  Container,
  Heading,
  Text,
  Flex,
  InputGroup,
  InputLeftAddon,
  Input,
  Textarea,
  Spinner,
  Center,
  Link,
} from '@chakra-ui/react';
import { VenomFoundation, BTC, ETH } from 'components/logos';
import { useTranslate } from 'core/lib/hooks/use-translate';
import { Avatar } from 'components/Profile';
import { truncAddress } from 'core/utils';
import axios from 'axios';
import ManageSocials from 'components/manage/ManageSocials';
import { useAtom, useAtomValue } from 'jotai';
import {
  bioAtom,
  btcAtom,
  discordAtom,
  ethAtom,
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
  avatarAtom,
  nameAtom,
  jsonHashAtom,
  jsonAtom,
  addressAtom,
  venomSProviderAtom,
  venomContractAtom,
  isConnectedAtom,
} from 'core/atoms';
import { SITE_DESCRIPTION, SITE_TITLE, VENOMSCAN_NFT } from 'core/utils/constants';
import { ConnectButton } from 'components/venomConnect';
import { getNft } from 'core/utils/nft';

const PINATA_API_KEY = 'dcca70e972f1baccb51e';
const PINATA_API_SECRET = '53499a4c990104e74e67c06c8b694554862f1df2979646d64b5e6ab343c9b981';
const PINATA_JWT =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiJmYTI2NzQ2NS0wNDJhLTRkZTMtYjM4NC1mMDUwMTI1MjllYTEiLCJlbWFpbCI6InNhbXNoYXJpYXQ3QGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJwaW5fcG9saWN5Ijp7InJlZ2lvbnMiOlt7ImlkIjoiRlJBMSIsImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxfV0sInZlcnNpb24iOjF9LCJtZmFfZW5hYmxlZCI6ZmFsc2UsInN0YXR1cyI6IkFDVElWRSJ9LCJhdXRoZW50aWNhdGlvblR5cGUiOiJzY29wZWRLZXkiLCJzY29wZWRLZXlLZXkiOiJkY2NhNzBlOTcyZjFiYWNjYjUxZSIsInNjb3BlZEtleVNlY3JldCI6IjUzNDk5YTRjOTkwMTA0ZTc0ZTY3YzA2YzhiNjk0NTU0ODYyZjFkZjI5Nzk2NDZkNjRiNWU2YWIzNDNjOWI5ODEiLCJpYXQiOjE2NjQyMzMwOTd9.MStisWxVXiMIx_RiKQqu6Ddc6jzNADZnFIFQaGcNIFk';

const ManagePage: NextPage = () => {
  const { t } = useTranslate();
  const [name, setName] = useAtom(nameAtom);
  const [bio, setBio] = useAtom(bioAtom);
  const [btc, setBtc] = useAtom(btcAtom);
  const [eth, setEth] = useAtom(ethAtom);
  const twitter = useAtomValue(twitterAtom);
  const discord = useAtomValue(discordAtom);
  const provider = useAtomValue(venomSProviderAtom);
  const venomContract = useAtomValue(venomContractAtom);
  const isConnected = useAtomValue(isConnectedAtom);
  const userAddress = useAtomValue(addressAtom);
  const medium = useAtomValue(mediumAtom);
  const linkedin = useAtomValue(linkedinAtom);
  const youtube = useAtomValue(youtubeAtom);
  const github = useAtomValue(githubAtom);
  const pinterest = useAtomValue(pinterestAtom);
  const instagram = useAtomValue(instagramAtom);
  const opensea = useAtomValue(openseaAtom);
  const telegram = useAtomValue(telegramAtom);
  const facebook = useAtomValue(facebookAtom);
  const address = useAtomValue(addressAtom);
  const [notMobile] = useMediaQuery('(min-width: 800px)');
  const { colorMode } = useColorMode();
  const [avatar, setAvatar] = useAtom(avatarAtom);
  const [jsonHash, setJsonHash] = useAtom(jsonHashAtom);
  const [json, setJson] = useAtom(jsonAtom);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [jsonUploading, setJsonUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter()
  const nftAddress = String(router.query.nftAddress) ;

  function buildFileSelector() {
    if (process.browser) {
      const fileSelector = document.createElement('input');
      fileSelector.type = 'file';
      fileSelector.multiple = false;
      fileSelector.onchange = async (e: any) => {
        sendproFileToIPFS(e.target.files[0]);
      };
      fileSelector.accept = 'image/x-png,image/gif,image/jpeg';
      return fileSelector;
    }
  }

  const imageFileSelect = buildFileSelector();

  const uploadJson = async () => {
    const data = JSON.stringify(changedJson);
    console.log(data);
    try {
      console.log('uploading description to ipfs');
      setJsonUploading(true);
      const resFile = await axios({
        method: 'post',
        url: 'https://api.pinata.cloud/pinning/pinJSONToIPFS',
        data: data,
        headers: {
          Authorization: `Bearer ${PINATA_JWT}`,
          pinata_api_key: `${PINATA_API_KEY}`,
          pinata_secret_api_key: `${PINATA_API_SECRET}`,
          'Content-Type': 'application/json',
        },
      });

      setJsonHash('https://ipfs.io/ipfs/' + resFile.data.IpfsHash);
      setJsonUploading(false);
      console.log('https://ipfs.io/ipfs/' + resFile.data.IpfsHash);
      //Take a look at your Pinata Pinned section, you will see a new file added to you list.
    } catch (error) {
      setJsonUploading(false);
      alert('Error sending profile to IPFS ');
      console.log(error);
      return;
    }
  };

  const sendproFileToIPFS = async (e: any) => {
    if (e) {
      try {
        const formData = new FormData();
        formData.append('file', e);
        console.log('uploading file to ipfs');
        setAvatarUploading(true);
        const resFile = await axios({
          method: 'post',
          url: 'https://api.pinata.cloud/pinning/pinFileToIPFS',
          data: formData,
          headers: {
            Authorization: `Bearer ${PINATA_JWT}`,
            pinata_api_key: `${PINATA_API_KEY}`,
            pinata_secret_api_key: `${PINATA_API_SECRET}`,
            'Content-Type': 'multipart/form-data',
          },
        });

        //const ImgHash = resFile.data.IpfsHash;
        //console.log(ImgHash);
        setAvatar('https://ipfs.io/ipfs/' + resFile.data.IpfsHash);
        setAvatarUploading(false);
      } catch (error) {
        alert('Error sending File to IPFS: ');
        setAvatarUploading(false);
        console.log(error);
      }
    }
  };

  const changedJson = {
    name: name,
    venomAddress: userAddress,
    btcAddress: btc,
    ethAddress: eth,
    bio: bio,
    avatar: avatar,
    socials: {
      twitter: twitter,
      discord: discord,
      medium: medium,
      youtube: youtube,
      linkedin: linkedin,
      github: github,
      pinterest: pinterest,
      facebook: facebook,
      instagram: instagram,
      opensea: opensea,
      telegram: telegram,
    },
    lineIcons: false,
  };

  useEffect(() => {
    async function getProfileJson() {
      if (userAddress && isConnected) {
        setIsLoading(true);
        try {
          if (!provider?.isInitialized) return;
          const nftJson = await getNft(provider,new Address(nftAddress));
          console.log('nftJson : ',nftJson);
          const ipfsData = nftJson.attributes?.find((att) => att.trait_type === 'DATA')?.value;
          if(ipfsData === ''){
            setJson({name: nftJson.name, venomAddress: userAddress, socials: {}});
            setName(String(nftJson.name));
            setIsLoading(false);
            return;
          }
          const res = await axios.get(
            'https://ipfs.io/ipfs/'+ ipfsData
          );
          setJson(res.data);
          console.log(res.data);
          setName(res.data.name);
          setBio(res.data.bio);
          setBtc(res.data.btcAddress);
          setEth(res.data.ethAddress);
          setAvatar(res.data.avatar);
          setIsLoading(false);
        } catch (error) {
          setIsLoading(false);
        }
      }
    }
    getProfileJson();
  }, [userAddress]);

  return (
    <>
      <Head>
        <title>
          {json && !isLoading ? json.name : SITE_TITLE} |{' '}
          {json && !isLoading ? json.bio : SITE_DESCRIPTION}
        </title>
        <meta
          name="description"
          content={`${json && !isLoading ? json.name : SITE_TITLE} | ${
            json && !isLoading ? json.bio : SITE_DESCRIPTION
          }`}
        />
        <link rel="icon" href={json && !isLoading ? json.avatar : '/logos/vidicon.svg'} />
      </Head>

      {address !== '' ? (
        <Container
          as="main"
          maxW="container.lg"
          display="grid"
          placeContent="center"
          placeItems="center"
          minH="75vh">
          <>
            {avatar ? <Avatar url={avatar} /> : <Avatar url={'/logos/vidbg.svg'} />}
            <Button
              isLoading={avatarUploading}
              my={4}
              backgroundColor="var(--venom1)"
              onClick={() => imageFileSelect !== undefined && imageFileSelect.click()}>
              Select Avatar Image
            </Button>

            <Heading fontWeight="bold" fontSize="2xl" my={4}>
              {!isLoading ? json.name : 'Loading Venom ID'}
            </Heading>
            {!isLoading ? (
              <Flex mt={6} direction={'column'} gap={4} width="100%">
                <Link
                  size="lg"
                  href={VENOMSCAN_NFT + json.venomAddress}
                  target="_blank"
                  width={'100% !important'}>
                  <Button
                    variant="solid"
                    size="lg"
                    backgroundColor={colorMode === 'dark' ? 'whiteAlpha.100' : 'blackAlpha.100'}
                    minWidth={notMobile ? 'md' : 'xs'}>
                    <VenomFoundation /> Venom Address{' '}
                    <Text px={2} color="var(--venom1)">
                      {truncAddress(json.venomAddress)}
                    </Text>
                  </Button>
                </Link>
                <InputGroup size="lg" minWidth="xs">
                  <InputLeftAddon>
                    <Flex>
                      {notMobile && <BTC />}
                      BTC {notMobile && 'Address'}
                    </Flex>
                  </InputLeftAddon>
                  <Input
                    placeholder={'Enter Your BTC Address'}
                    value={json ? btc : 'Loading'}
                    onChange={(e) => setBtc(e.currentTarget.value)}
                  />
                </InputGroup>
                <InputGroup size="lg" minWidth="xs">
                  <InputLeftAddon>
                    <Flex>
                      {notMobile && <ETH />}
                      ETH {notMobile && 'Address'}
                    </Flex>
                  </InputLeftAddon>

                  <Input
                    placeholder={'Enter Your ETH Address'}
                    value={json ? eth : 'Loading'}
                    onChange={(e) => setEth(e.currentTarget.value)}
                  />
                </InputGroup>
              </Flex>
            ) : (
              <Center width={'100%'} height={150}>
                <Spinner size="lg" />
              </Center>
            )}
            <Text mt={10} fontWeight="bold" fontSize="xl">
              Bio & Socials
            </Text>
            <Textarea
              minWidth="xs"
              my={4}
              rows={4}
              maxLength={500}
              placeholder={"I'm Sam. Blockchain Developer ..."}
              size="lg"
              resize={'none'}
              value={json ? bio : 'Loading'}
              onChange={(e) => setBio(e.currentTarget.value)}
            />
            {!isLoading && <ManageSocials json={json} />}
            <Button
              mt={10}
              width={notMobile ? 'md' : 'xs'}
              size="lg"
              isLoading={jsonUploading}
              disabled={isLoading}
              backgroundColor="var(--venom1)"
              onClick={uploadJson}>
              Save Profile
            </Button>
            <Button disabled={isLoading} mt={2} width={notMobile ? 'md' : 'xs'} size="lg">
              View Venom Profile
            </Button>
          </>
        </Container>
      ) : (
        <Center my={8} flexDirection="column" minH="75vh">
          <Text my={4}>Please Connect Your Venom Wallet</Text>
          <ConnectButton />
        </Center>
      )}
    </>
  );
};

export default ManagePage;
