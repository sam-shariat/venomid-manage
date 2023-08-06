import React, { useEffect, useState } from 'react';
import MessageAlert from 'components/Layout/Message';
import { BaseNftJson, getAddressesFromIndex, getNftsByIndexes, saltCode } from 'core/utils/nft';
import NextLink from 'next/link';
import { Avatar } from 'components/Profile';
import {
  Button,
  Container,
  Text,
  Stack,
  SimpleGrid,
  Box,
  Center,
  Flex,
  Link,
  useMediaQuery,
  useColorMode,
  Spinner,
} from '@chakra-ui/react';
import { useTranslate } from 'core/lib/hooks/use-translate';
import Logo from 'components/Layout/Logo';
import { sleep } from 'core/utils';
import { ConnectButton } from 'components/venomConnect';
import { useConnect, useVenomProvider } from 'venom-react-hooks';
import { primaryNameAtom, venomContractAtom, venomContractAddressAtom } from 'core/atoms';
import { useAtom, useAtomValue } from 'jotai';
import { Address, Transaction } from 'everscale-inpage-provider';
import { Message } from 'types';
import { AVATAR_API_URL } from 'core/utils/constants';
import { RiExternalLinkLine } from 'react-icons/ri';

function ManageSection() {
  const { provider } = useVenomProvider();
  const { isConnected, account } = useConnect();
  const [listIsEmpty, setListIsEmpty] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [nftjsons, setNftJsons] = useState<BaseNftJson[] | undefined>(undefined);
  const venomContract = useAtomValue(venomContractAtom);
  const venomContractAddress = useAtomValue(venomContractAddressAtom);
  const { t } = useTranslate();
  const [primaryName, setPrimaryName] = useAtom(primaryNameAtom);
  const [notMobile] = useMediaQuery('(min-width: 800px)');
  const [message, setMessage] = useState<Message>({ type: '', title: '', msg: '', link: '' });
  const [isSaving, setIsSaving] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const minFee = 660000000;
  const { colorMode } = useColorMode();
  if (nftjsons) {
    console.log(nftjsons);
  }

  // Main method of this component
  const loadNFTs = async () => {
    try {
      // Take a salted code
      if (!provider?.isInitialized) return;
      setIsLoading(true);
      setListIsEmpty(false);
      const saltedCode = await saltCode(provider, String(account?.address));
      // Hash it
      const codeHash = await provider.getBocHash(String(saltedCode));
      if (!codeHash) {
        setIsLoading(false);
        return;
      }
      // Fetch all Indexes by hash
      const indexesAddresses = await getAddressesFromIndex(codeHash, provider);
      if (!indexesAddresses || !indexesAddresses.length) {
        if (indexesAddresses && !indexesAddresses.length) setListIsEmpty(true);
        setIsLoading(false);
        return;
      }
      // Fetch all nfts
      const _nftJsons = await getNftsByIndexes(provider, indexesAddresses);
      setNftJsons(_nftJsons);
      setIsLoading(false);
    } catch (e) {
      console.error(e);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    async function getNfts() {
      if (account && isConnected && provider) {
        if (!provider?.isInitialized) {
          console.log('provider not ready');
          await sleep(1000);
          getNfts();
          return;
        }
      }
      loadNFTs();
      if (!account) setListIsEmpty(false);
    }
    getNfts();
  }, [isConnected, provider]);

  async function setAsPrimary(_nftAddress: string, _name: string) {
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
    console.log('before saving', _nftAddress, _name.slice(0, -4));
    if (provider.isInitialized) {
      console.log('saving ', provider);
      setIsSaving(true);
      const setPrimaryTx = await venomContract?.methods
        .setPrimaryName({ _nftAddress: new Address(_nftAddress), _name: _name.slice(0, -4) })
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

      if (setPrimaryTx) {
        console.log('setPrimary tx : ', setPrimaryTx);
        setIsConfirming(true);
        let receiptTx: Transaction | undefined;
        const subscriber = provider && new provider.Subscriber();
        if (subscriber)
          await subscriber
            .trace(setPrimaryTx)
            .tap((tx_in_tree: any) => {
              console.log('tx_in_tree : ', tx_in_tree);
              if (tx_in_tree.account.equals(venomContractAddress)) {
                setMessage({
                  type: 'success',
                  title: 'Update Successful',
                  msg: _name + ' was succesfully set as your primary name',
                });
              }
            })
            .finished();

        setIsSaving(false);
        setIsConfirming(false);
        setPrimaryName({ nftAddress: new Address(_nftAddress), name: _name.slice(0, -4) });
        loadNFTs();
      }
      console.log('save primary finished');
    }
  }
  return (
    <Box>
      <Container
        as="main"
        maxW="container.lg"
        display="grid"
        placeContent="center"
        placeItems="center"
        minH="75vh">
        <>
          <Stack direction={['column']} pb={4} pt={notMobile ? 10 : 6} width="100%" gap={2}>
            {isConnected && (
              <Text
                width={'100%'}
                textAlign={'center'}
                fontWeight="bold"
                fontSize={notMobile ? '4xl' : '2xl'}
                my={notMobile ? 10 : 4}>
                {t('yourVids')}
              </Text>
            )}
            {isLoading && (
              <Center width={'100%'} height={150}>
                <Spinner size="lg" />
              </Center>
            )}
            <MessageAlert message={message} notMobile={notMobile} />
            <SimpleGrid
              columns={[1, 1, nftjsons && nftjsons?.length > 1 ? 2 : 1]}
              gap={4}
              width={'100%'}>
              {nftjsons?.map((nft) => (
                <Center
                  width={'100%'}
                  key={nft.name}
                  flexDirection={'column'}
                  gap={2}
                  background={colorMode === 'dark' ? 'blackAlpha.300' : 'white'}
                  borderColor={
                    nft?.name !== undefined && primaryName.name === nft?.name.slice(0, -4)
                      ? 'grey'
                      : 'blackAlpha.200'
                  }
                  borderWidth={1}
                  p={'16px !important'}
                  borderRadius={12}>
                  <Flex
                    minW={320}
                    key={nft.name + ' name'}
                    gap={2}
                    flexDirection={'column'}
                    alignItems={'center'}
                    justifyContent={'center'}
                    my={2}>
                    <Text fontWeight={'bold'} fontSize={'2xl'}>
                      {String(nft.name).slice(0, -4).toLowerCase()}
                    </Text>
                    <Box width={100}>
                      <Avatar url={AVATAR_API_URL + String(nft.name).slice(0, -4).toLowerCase()} />
                    </Box>
                  </Flex>
                  <Button
                    color="white"
                    bgColor={'var(--venom2)'}
                    isLoading={isSaving || isConfirming}
                    onClick={() =>
                      nft?.name !== undefined &&
                      primaryName.name !== nft?.name.slice(0, -4) &&
                      setAsPrimary(String(nft?.address), String(nft?.name))
                    }
                    disabled={
                      isSaving ||
                      isConfirming ||
                      (nft?.name !== undefined && primaryName.name === nft?.name.slice(0, -4))
                    }
                    minW={320}>
                    {nft?.name !== undefined && primaryName.name === nft?.name.slice(0, -4)
                      ? 'Primary Name'
                      : 'Set As Primary'}
                  </Button>
                  <NextLink href={'manage/' + nft.address} passHref>
                    <Button variant={'outline'} colorScheme="purple" minW={320}>
                      Customize {nft.name}
                    </Button>
                  </NextLink>
                  <Link href={nft.external_url} target="_blank">
                    <Button minW={320} gap={2}>
                      {nft.external_url?.slice(8)}
                    </Button>
                  </Link>
                </Center>
              ))}
            </SimpleGrid>
            {listIsEmpty && !isLoading && (
              <Center display="flex" flexDirection="column" gap={4}>
                <Text fontSize="xl">You don't own any Venom IDs</Text>
                <Button
                  as={Link}
                  href="https://venomid.network"
                  target="_blank"
                  variant="outline"
                  textAlign="left"
                  borderWidth={1}
                  gap={2}
                  borderColor="grey">
                  Claim Your Venom ID
                  <RiExternalLinkLine size={'18px'} />
                </Button>
              </Center>
            )}
          </Stack>
          {!isConnected && (
            <Center my={8} flexDirection="column" minH={'75vh'}>
              <Text my={4}>{t('venomWalletConnect')}</Text>
              <ConnectButton />
            </Center>
          )}
          {isConnected && (
            <Text fontWeight="light" fontSize={notMobile ? '2xl' : 'xl'} my={notMobile ? 10 : 6}>
              {t('manageDescription')}
            </Text>
          )}
        </>
      </Container>
    </Box>
  );
}

export default ManageSection;
