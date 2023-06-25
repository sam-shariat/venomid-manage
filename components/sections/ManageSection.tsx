import React, { useEffect, useState } from 'react';
import { CONTRACT_ADDRESS, SITE_URL } from 'core/utils/constants';
// Our implemented util
import { BaseNftJson, getAddressesFromIndex, getNftsByIndexes, saltCode } from 'core/utils/nft';
import { venomContractAtom, venomSProviderAtom, addressAtom, isConnectedAtom } from 'core/atoms';
import { useAtom, useAtomValue } from 'jotai';
import NextLink from 'next/link';
import {
  Button,
  Container,
  Heading,
  Text,
  InputGroup,
  Input,
  InputLeftAddon,
  Stack,
  SimpleGrid,
  Box,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
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

interface Message {
  type: any;
  title: string;
  msg: string;
  link?: string;
}

function ManageSection() {
  const [listIsEmpty, setListIsEmpty] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [nftjsons, setNftJsons] = useState<BaseNftJson[] | undefined>(undefined);
  const provider = useAtomValue(venomSProviderAtom);
  const venomContract = useAtomValue(venomContractAtom);
  const isConnected = useAtomValue(isConnectedAtom);
  const userAddress = useAtomValue(addressAtom);
  const { t } = useTranslate();
  const [notMobile] = useMediaQuery('(min-width: 800px)');
  const [message, setMessage] = useState<Message>({ type: '', title: '', msg: '', link: '' });
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
      const saltedCode = await saltCode(provider, userAddress);
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
      if (userAddress && isConnected && provider) {
        if (!provider?.isInitialized) {
          console.log('provider not ready');
          await sleep(1000);
          getNfts();
          return;
        }
      }

      loadNFTs();
      if (!userAddress) setListIsEmpty(false);
    }
    getNfts();
  }, [userAddress, isConnected, provider]);
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
          {message.msg.length > 0 && (
            <Alert
              flexDirection={notMobile ? 'row' : 'column'}
              alignItems={notMobile ? 'left' : 'center'}
              justifyContent={notMobile ? 'left' : 'center'}
              textAlign={notMobile ? 'left' : 'center'}
              status={message.type}
              gap={2}
              borderRadius={10}>
              <AlertIcon />
              <Box width={'100%'}>
                <AlertTitle>{message.title.toUpperCase()}</AlertTitle>
                <AlertDescription>{message.msg}</AlertDescription>
              </Box>
              {message.link && (
                <Box>
                  <Link href={message.link} target="_blank" id={`venom-id-nft-link`}>
                    <Button m={1} minWidth={120}>
                      View NFT
                    </Button>
                  </Link>
                  <Link href={SITE_URL} target="_blank" id={`venom-id-manage-nft-link`}>
                    <Button m={1} color='white' minWidth={120} bgColor={'var(--purple1)'}>
                      Manage VID
                    </Button>
                  </Link>
                </Box>
              )}
            </Alert>
          )}
          <Stack direction={['column']} pb={4} pt={notMobile ? 10 : 6} width="100%" gap={2}>
            {isConnected && <Text
              width={'100%'}
              textAlign={'center'}
              fontWeight="bold"
              fontSize={notMobile ? '4xl' : '2xl'}
              my={notMobile ? 10 : 4}>
              {t('yourVids')}
            </Text>}
            {isLoading && (
              <Center width={'100%'} height={150}>
                <Spinner size="lg" />
              </Center>
            )}
            <SimpleGrid columns={[1, 1, nftjsons && nftjsons?.length > 1 ? 2 : 1]} gap={4}>
              {nftjsons?.map((nft) => (
                <Center
                  width={'100%'}
                  key={nft.name}
                  flexDirection={'column'}
                  gap={2}
                  background={colorMode === 'dark' ? 'blackAlpha.300' : 'white'}
                  borderColor={'blackAlpha.200'}
                  borderWidth={1}
                  p={4}
                  borderRadius={12}>
                  <Flex
                    minW={350}
                    key={nft.name + ' name'}
                    color={'var(--venom1)'}
                    fontWeight={'bold'}
                    fontSize={'2xl'}
                    gap={2}
                    justifyContent={'space-between'}
                    my={2}>
                    {nft.name}
                    <Logo />
                  </Flex>
                  <NextLink href={'manage/' + nft.address} passHref>
                    <Button color='white' bgColor={'var(--purple2)'} minW={350}>
                      Manage {nft.name}
                    </Button>
                  </NextLink>
                  <Link href={nft.external_url} target="_blank">
                    <Button minW={350} gap={2}>
                      {nft.external_url?.slice(8)}
                    </Button>
                  </Link>
                </Center>
              ))}
            </SimpleGrid>
          </Stack>
          {!userAddress && (
            <Center my={8} flexDirection="column" minH={'75vh'}>
              <Text my={4}>{t('venomWalletConnect')}</Text>
              <ConnectButton />
            </Center>
          )}
          {isConnected && <Text fontWeight="light" fontSize={notMobile ? '2xl' : 'xl'} my={notMobile ? 10 : 6}>
            {t('manageDescription')}
          </Text>}
        </>
      </Container>
    </Box>
  );
}

export default ManageSection;
