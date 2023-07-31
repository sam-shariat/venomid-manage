import type { NextPage } from 'next';
import Head from 'next/head';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Address, Transaction } from 'everscale-inpage-provider';
import {
  useMediaQuery,
  useColorMode,
  Button,
  Tooltip,
  Container,
  Heading,
  Text,
  Flex,
  InputGroup,
  InputLeftAddon,
  InputRightElement,
  IconButton,
  Input,
  Textarea,
  Spinner,
  Center,
  Link,
  Stack,
} from '@chakra-ui/react';
import { VenomFoundation, BTC, ETH, Metamask } from 'components/logos';
import { useTranslate } from 'core/lib/hooks/use-translate';
import { Avatar } from 'components/Profile';
import { sleep, truncAddress } from 'core/utils';
import axios from 'axios';
import ManageSocials from 'components/manage/ManageSocials';
import ManageLinks from 'components/manage/ManageLinks';
import ManageSettings from 'components/manage/ManageSettings';
import { useAtom, useAtomValue } from 'jotai';
import {
  bioAtom,
  btcAtom,
  lightModeAtom,
  ethAtom,
  avatarAtom,
  nameAtom,
  jsonHashAtom,
  jsonAtom,
  socialsArrayAtom,
  nftContractAtom,
  linksArrayAtom,
  useLineIconsAtom,
} from 'core/atoms';
import {
  SITE_DESCRIPTION,
  SITE_PROFILE_URL,
  SITE_TITLE,
  SITE_CLAIM_URL,
  VENOMSCAN_NFT,
} from 'core/utils/constants';
import { ConnectButton } from 'components/venomConnect';
import { getNft } from 'core/utils/nft';
import NFTAbi from 'abi/Nft.abi.json';
import { Message } from 'types';
import MessageAlert from 'components/Layout/Message';
import { useConnect, useVenomProvider } from 'venom-react-hooks';
import Logo from 'components/Layout/Logo';
import { RiFileCopy2Line } from 'react-icons/ri';
import { useAddress, useConnect as useThirdWebConnect, metamaskWallet, useStorageUpload } from '@thirdweb-dev/react';

const metamaskConfig = metamaskWallet();

const ManagePage: NextPage = () => {
  const { provider } = useVenomProvider();
  const { isConnected, account } = useConnect();
  const { mutateAsync: upload } = useStorageUpload();
  const { t } = useTranslate();
  const ethAddressFromWallet = useAddress();
  const connectWithThirdweb = useThirdWebConnect();
  const [name, setName] = useAtom(nameAtom);
  const [bio, setBio] = useAtom(bioAtom);
  const lightMode = useAtomValue(lightModeAtom);
  const [btc, setBtc] = useAtom(btcAtom);
  const [eth, setEth] = useAtom(ethAtom);
  const links = useAtomValue(linksArrayAtom);
  const socials = useAtomValue(socialsArrayAtom);
  const lineIcons = useAtomValue(useLineIconsAtom);
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
  const minFee = 660000000;
  const router = useRouter();
  const nftAddress = String(router.query.nftAddress);
  const [nftContract, setNftContract] = useAtom(nftContractAtom);

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

  const sendproFileToIPFS = async (e: any) => {
    if (e) {
      try {
        const formData = [e];
        console.log('uploading file to ipfs thirdweb');
        setAvatarUploading(true);
        const uris = await upload({ data: formData });
        setAvatar('https://ipfs.io/ipfs/' + uris[0].slice(7));
        setAvatarUploading(false);
      } catch (error) {
        alert('Error sending File to IPFS: ');
        setAvatarUploading(false);
        console.log(error);
      }
    }
  };

  const uploadJson = async () => {
    let socialsObj: any = {};
    socials.map((social) => {
      socialsObj[social['key']] = social['value'];
    });

    const data = JSON.stringify({
      name: name,
      venomAddress: account?.address,
      btcAddress: btc,
      ethAddress: eth,
      bio: bio,
      avatar: avatar,
      links: links,
      socials: socialsObj,
      lineIcons: lineIcons,
      lightMode: lightMode
    });

    console.log(data);
    try {
      console.log('uploading description to ipfs');
      setJsonUploading(true);
      const uris = await upload({ data: [data] });
      setJsonHash('https://ipfs.io/ipfs/' + uris[0].slice(7));
      setJsonUploading(false);
      console.log('https://ipfs.io/ipfs/' + uris[0].slice(7));
      saveVid(uris[0].slice(7));
      //Take a look at your Pinata Pinned section, you will see a new file added to you list.
    } catch (error) {
      setJsonUploading(false);
      alert('Error sending profile to IPFS ');
      console.log(error);
      return;
    }
  };

  async function saveVid(_jsonHash: string) {
    if (!isConnected) {
      setMessage({
        type: 'info',
        title: 'connect wallet',
        msg: 'please connect your venom wallet',
      });
      return;
    }
    if (!provider) {
      setMessage({
        type: 'info',
        title: 'Provider Not Ready',
        msg: 'Please wait a few seconds and try again, Your Wallet Provider is not ready, yet',
      });
      return;
    }
    setMessage({ type: '', title: '', msg: '' });
    console.log('before saving');
    if (provider.isInitialized) {
      console.log('saving ', provider);
      setIsSaving(true);
      console.log('data : ', minFee, account?.address, _jsonHash, nftContract);
      // @ts-ignore: Unreachable code error
      const saveTx = await nftContract.methods
        .setData({ data: String(_jsonHash) })
        .send({
          amount: String(minFee),
          bounce: true,
          from: account?.address,
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
        setIsConfirming(true);
        let receiptTx: Transaction | undefined;
        const subscriber = provider && new provider.Subscriber();
        if (subscriber)
          await subscriber
            .trace(saveTx)
            .tap((tx_in_tree: any) => {
              console.log('tx_in_tree : ', tx_in_tree);
              if (tx_in_tree.account.equals(nftAddress)) {
                setMessage({
                  type: 'success',
                  title: 'Save Successful',
                  msg: 'Venom ID Profile Saved Successfuly, You can now View and Share your venom profile Link',
                });
              }
            })
            .finished();

        setIsSaving(false);
        setIsConfirming(false);
      }
      console.log('save finished');
    }
  }

  const shareProfile = async () => {
    let url = SITE_PROFILE_URL + name.slice(0, -4);
    let txt =
      'Check out my Venom ID profile NFT on the venom blockchain powered by @venomid_network';
    let href = `https://twitter.com/intent/tweet?original_referer=${SITE_CLAIM_URL}&text=${txt}&url=${url}`;
    window.open(href);
  };

  useEffect(() => {
    async function getProfileJson() {
      if (account && isConnected && provider) {
        try {
          if (provider?.isInitialized === false) {
            console.log('provider not ready');
            await sleep(1000);
            getProfileJson();
            return;
          }
          console.log('getting nft : ', nftAddress);
          setIsLoading(true);
          if (nftContract === undefined) {
            const _nftContract = new provider.Contract(NFTAbi, new Address(nftAddress));
            console.log('_nftContract ', _nftContract);
            setNftContract(_nftContract);
          }
          const nftJson = await getNft(provider, new Address(nftAddress));
          console.log('nftJson : ', nftJson);
          const ipfsData = nftJson.attributes?.find((att) => att.trait_type === 'DATA')?.value;
          if (ipfsData === '') {
            setJson({
              name: nftJson.name,
              venomAddress: String(account.address),
              btcAddress: '',
              ethAddress: '',
              bio: '',
              avatar: '',
              lineIcons: false,
              links: [],
              socials: {},
            });
            setName(String(nftJson.name));
            setBio('');
            setBtc('');
            setEth('');
            setAvatar('');
            setIsLoading(false);
            return;
          }
          const res = await axios.get('https://ipfs.io/ipfs/' + ipfsData);
          setJson(res.data);
          console.log(res.data);
          setName(res.data.name);
          setBio(res.data.bio);
          setBtc(res.data.btcAddress);
          setEth(res.data.ethAddress);
          setAvatar(res.data.avatar);
          setIsLoading(false);
        } catch (error) {
          console.log('error fetching nft', error);
          setIsLoading(false);
        }
      }
    }
    getProfileJson();
  }, [account]);

  // useEffect(()=> {
  //   setMessage({ type: '', title: '', msg: '', link: '' })
  // },[changedJson])

  return (
    <>
      <Head>
        <title>
          {json && !isLoading ? json.name : SITE_TITLE} |{' '}
          {json && !isLoading && json.bio !== '' ? json.bio : SITE_DESCRIPTION}
        </title>
        <meta
          name="description"
          content={`${json && !isLoading ? json.name : SITE_TITLE} | ${
            json && !isLoading && json.bio !== '' ? json.bio : SITE_DESCRIPTION
          }`}
        />
        <link
          rel="icon"
          href={json && !isLoading && json.avatar !== '' ? json.avatar : '/logos/vidicon.svg'}
        />
      </Head>

      {isConnected ? (
        <Container
          as="main"
          maxW="container.lg"
          display="grid"
          placeContent="center"
          placeItems="center"
          minH="75vh">
          <>
            <Heading
              fontWeight="bold"
              fontSize="2xl"
              my={4}
              mt={10}
              textShadow="0 0 20px #00000070">
              {!isLoading && json ? json.name : 'Loading Venom ID'}
            </Heading>
            {avatar ? <Avatar url={avatar} /> : <Avatar url={'/logos/vidbg.svg'} />}
            <Button
              isLoading={avatarUploading || isLoading}
              mb={4}
              color="white"
              backgroundColor="var(--venom2)"
              onClick={() => imageFileSelect !== undefined && imageFileSelect.click()}>
              Select Avatar Image
            </Button>
            {!isLoading && json ? (
              <Flex mt={6} direction={'column'} gap={4} width="100%">
                <Button
                  variant="solid"
                  size="lg"
                  as={Link}
                  target="_blank"
                  href={VENOMSCAN_NFT + json.venomAddress}
                  backgroundColor={colorMode === 'dark' ? 'whiteAlpha.100' : 'blackAlpha.100'}
                  minWidth={notMobile ? 'md' : 'xs'}>
                  <VenomFoundation /> Venom Address{' '}
                  <Text px={2} color="var(--venom1)">
                    {truncAddress(json.venomAddress)}
                  </Text>
                </Button>

                <InputGroup size="lg" minWidth="xs" borderColor="gray">
                  <InputLeftAddon>
                    <Flex>
                      {notMobile && <BTC />}
                      BTC
                    </Flex>
                  </InputLeftAddon>
                  <Input
                    placeholder={'Enter Your BTC Address'}
                    value={json ? btc : 'Loading'}
                    onChange={(e) => setBtc(e.currentTarget.value)}
                  />
                  <InputRightElement>
                    <Tooltip
                      borderRadius={4}
                      label={<Text p={2}>Paste</Text>}
                      hasArrow
                      color="white"
                      bgColor={'black'}>
                      <IconButton
                        aria-label='paste btc address'
                        onClick={() => navigator.clipboard.readText().then((text) => setBtc(text))}>
                        <RiFileCopy2Line />
                      </IconButton>
                    </Tooltip>
                  </InputRightElement>
                </InputGroup>
                <InputGroup size="lg" minWidth="xs" borderColor="gray">
                  <InputLeftAddon>
                    <Flex>
                      {notMobile && <ETH />}
                      ETH
                    </Flex>
                  </InputLeftAddon>
                  <Input
                    placeholder={'Enter Your ETH Address'}
                    value={json ? eth : 'Loading'}
                    onChange={(e) => setEth(e.currentTarget.value)}
                    pr={'92px'}
                  />
                  <InputRightElement gap={1} width={'92px'}>
                    <Tooltip
                      borderRadius={4}
                      label={<Text p={2}>{ethAddressFromWallet ? 'Use Connected ETH Address' : 'Connect ETH Wallet'}</Text>}
                      hasArrow
                      color="white"
                      bgColor={'black'}>
                      <IconButton
                      aria-label='connect eth wallet'
                        onClick={async () => {
                          if (ethAddressFromWallet) {
                            setEth(ethAddressFromWallet);
                          } else {
                            await connectWithThirdweb(metamaskConfig);
                            setEth(String(ethAddressFromWallet));
                          }
                        }}>
                        <Metamask />
                      </IconButton>
                    </Tooltip>
                    <Tooltip
                      borderRadius={4}
                      aria-label='paste eth address'
                      label={<Text p={2}>Paste</Text>}
                      hasArrow
                      color="white"
                      bgColor={'black'}>
                      <IconButton
                        onClick={() => navigator.clipboard.readText().then((text) => setEth(text))}>
                        <RiFileCopy2Line />
                      </IconButton>
                    </Tooltip>
                  </InputRightElement>
                </InputGroup>
              </Flex>
            ) : (
              <Center width={'100%'} height={150}>
                <Spinner size="lg" />
              </Center>
            )}
            {!isLoading && (
              <Text mt={10} fontWeight="bold" fontSize="xl">
                Bio
              </Text>
            )}
            {!isLoading && json && (
              <Textarea
                minWidth="xs"
                my={4}
                rows={5}
                maxLength={500}
                placeholder={"I'm Sam. Blockchain Developer ..."}
                size="lg"
                bg={colorMode === 'dark' ? 'whiteAlpha.100' : 'blackAlpha.100'}
                variant="outline"
                border="none"
                resize={'none'}
                value={json ? bio : 'Loading'}
                onChange={(e) => setBio(e.currentTarget.value)}
              />
            )}
            <Stack gap={2}>
              {!isLoading && json && <ManageLinks json={json} nftAddress={nftAddress} />}
              {!isLoading && json && <ManageSocials json={json} nftAddress={nftAddress} />}
              {!isLoading && json && <ManageSettings json={json} nftAddress={nftAddress} />}
            </Stack>
            <MessageAlert message={message} notMobile={notMobile} />
            <Button
              mt={10}
              width={notMobile ? 'md' : 'xs'}
              size="lg"
              color="white"
              isLoading={jsonUploading || isSaving || isConfirming}
              disabled={isLoading || isSaving || isConfirming}
              loadingText={isSaving ? 'Saving To VID NFT' : isConfirming ? 'Confirming...' : ''}
              backgroundColor="var(--venom1)"
              onClick={uploadJson}>
              Save Profile
            </Button>
            <Button
              mt={2}
              width={notMobile ? 'md' : 'xs'}
              size="lg"
              color="white"
              backgroundColor="var(--red1)"
              onClick={shareProfile}>
              Share Profile
            </Button>
            <Button
              as={Link}
              href={SITE_PROFILE_URL + name.slice(0, -4)}
              target="_blank"
              disabled={isLoading}
              mt={2}
              gap={2}
              width={notMobile ? 'md' : 'xs'}
              size="lg">
              <Logo />
              View at VenomID.Link
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
