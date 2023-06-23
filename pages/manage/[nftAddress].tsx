import type { NextPage } from 'next';
import Head from 'next/head';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Address, Transaction } from 'everscale-inpage-provider';
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
import { sleep, truncAddress } from 'core/utils';
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
  venomContractAddressAtom,
} from 'core/atoms';
import { SITE_DESCRIPTION, SITE_TITLE, VENOMSCAN_NFT } from 'core/utils/constants';
import { ConnectButton } from 'components/venomConnect';
import { getNft } from 'core/utils/nft';
import NFTAbi from 'abi/Collection.abi.json';
import { Message } from 'types';
import MessageAlert from 'components/Layout/Message';

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
  const [isSaving, setIsSaving] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const [message, setMessage] = useState<Message>({ type: '', title: '', msg: '', link: '' });
  const VenomContractAddress = useAtomValue(venomContractAddressAtom);
  const minFee = 660000000;
  const router = useRouter();
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
          Authorization: `Bearer ${process.env.PINATA_JWT}`,
          pinata_api_key: `${process.env.PINATA_API_KEY}`,
          pinata_secret_api_key: `${process.env.PINATA_API_SECRET}`,
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

  async function saveVid(e: string) {
    if (!isConnected) {
      setMessage({
        type: 'info',
        title: 'connect wallet',
        msg: 'please connect your venom wallet',
      });
      return;
    }
    if(!provider?.isInitialized){
      setMessage({
        type: 'info',
        title: 'Provider Not Ready',
        msg: 'Please wait a few seconds and try again, Your Wallet Provider is not ready, yet',
      });
      return;
    }
    setMessage({ type: '', title: '', msg: '' });
    console.log('before saving');
    const nftContract = new provider.Contract(NFTAbi, new Address(nftAddress));
    if (nftContract?.methods) {
      console.log('saving');
      setIsSaving(true);
      // @ts-ignore: Unreachable code error
      const saveTx = await nftContract?.methods.setData({ data: jsonHash })
        .send({
          amount: String(minFee),
          bounce: true,
          from: new Address(userAddress),
        })
        .catch((e: any) => {
          if (e.code === 3) {
            // rejected by a user
            setIsSaving(false);
            return Promise.resolve(null);
          } else {
            setIsSaving(false);
            console.log(e);
            return Promise.reject(e);
          }
        });

      if (saveTx) {
        console.log('save tx : ', saveTx);
        setIsConfirming(true)
        let receiptTx: Transaction | undefined;
        const subscriber = provider && new provider.Subscriber();
        if (subscriber)
          await subscriber
            .trace(saveTx)
            .tap((tx_in_tree: any) => {
              console.log('tx_in_tree : ', tx_in_tree);
              if (tx_in_tree.account.equals(nftAddress)) {
                receiptTx = tx_in_tree;
              }
            })
            .finished();

        
        let events = await venomContract.decodeTransactionEvents({
          transaction: receiptTx as Transaction,
        });
        console.log(events);
        // if (events.length !== 1 || events[0].event !== 'NftCreated') {
        //   setMessage({
        //     type: 'error',
        //     title: 'Error',
        //     msg: 'Something went wrong, Please try again',
        //   });
        // } else {
        //   // @ts-ignore: Unreachable code error
        //   const nftAddress = String(events[0].data?.nft && events[0].data?.nft?._address);
        //   setMessage({
        //     type: 'success',
        //     title: 'Mint Successful',
        //     msg: 'Venom ID Claimed Successfuly, You can now manage and share your venom profile',
        //     link: VENOMSCAN_NFT + nftAddress,
        //   });
        // }
        setIsSaving(false);
        setIsConfirming(false);
        console.log(events);
      }
      console.log('save finished');
    }
  }

  useEffect(() => {
    if (provider?.isInitialized && venomContract !== undefined && isConnected) {
      console.log("venom contract ",venomContract)
    }
  }, [provider]);

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
            Authorization: `Bearer ${process.env.PINATA_JWT}`,
            pinata_api_key: `${process.env.PINATA_API_KEY}`,
            pinata_secret_api_key: `${process.env.PINATA_API_SECRET}`,
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
      if (userAddress && isConnected && provider) {
        try {
          if (provider?.isInitialized === false) {
            console.log('provider not ready')
            await sleep(1000);
            getProfileJson();
            return
          }
          console.log('getting nft : ',nftAddress)
          setIsLoading(true);
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
          console.log("error fetching nft",error)
          setIsLoading(false);
        }
      }
    }
    getProfileJson();
  }, [userAddress,isConnected,provider]);

  

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
            <Heading fontWeight="bold" fontSize="2xl" my={4} mt={10} textShadow="0 0 20px #00000070">
              {!isLoading ? json.name : 'Loading Venom ID'}
            </Heading>
            {avatar ? <Avatar url={avatar} /> : <Avatar url={'/logos/vidbg.svg'} />}
            <Button
              isLoading={avatarUploading || isLoading}
              mb={4}
              backgroundColor="var(--venom1)"
              onClick={() => imageFileSelect !== undefined && imageFileSelect.click()}>
              Select Avatar Image
            </Button>
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
            {!isLoading && <Text mt={10} fontWeight="bold" fontSize="xl">
              Bio & Socials
            </Text>}
            {!isLoading && <Textarea
              minWidth="xs"
              my={4}
              rows={4}
              maxLength={500}
              placeholder={"I'm Sam. Blockchain Developer ..."}
              size="lg"
              resize={'none'}
              value={json ? bio : 'Loading'}
              onChange={(e) => setBio(e.currentTarget.value)}
            />}
            {!isLoading && <ManageSocials json={json} nftAddress={nftAddress}/>}
            <MessageAlert message={message} notMobile={notMobile} />
            <Button
              mt={10}
              width={notMobile ? 'md' : 'xs'}
              size="lg"
              isLoading={jsonUploading}
              disabled={isLoading}
              loadingText={isSaving ? 'Saving To VID NFT' : isConfirming ? 'Confirming...' : ''}
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
