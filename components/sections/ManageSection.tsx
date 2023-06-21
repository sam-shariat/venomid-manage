import React, { useEffect, useState } from 'react';
import { Address, ProviderRpcClient } from 'everscale-inpage-provider';
import { CONTRACT_ADDRESS, SITE_URL } from 'core/utils/constants';
// Our implemented util
import { BaseNftJson, getNftsByIndexes } from 'core/utils/nft';
import { venomContractAtom, venomSProviderAtom, addressAtom, isConnectedAtom } from 'core/atoms';
import { useAtom, useAtomValue } from 'jotai';
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
  // Method to returning a salted index code (base64)
  const saltCode = async () => {
    if (!provider) return;
    // Index StateInit you should take from github. It ALWAYS constant!
    const INDEX_BASE_64 =
      'te6ccgECIAEAA4IAAgE0AwEBAcACAEPQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgAgaK2zUfBAQkiu1TIOMDIMD/4wIgwP7jAvILHAYFHgOK7UTQ10nDAfhmifhpIds80wABn4ECANcYIPkBWPhC+RDyqN7TPwH4QyG58rQg+COBA+iogggbd0CgufK0+GPTHwHbPPI8EQ4HA3rtRNDXScMB+GYi0NMD+kAw+GmpOAD4RH9vcYIImJaAb3Jtb3Nwb3T4ZNwhxwDjAiHXDR/yvCHjAwHbPPI8GxsHAzogggujrde64wIgghAWX5bBuuMCIIIQR1ZU3LrjAhYSCARCMPhCbuMA+EbycyGT1NHQ3vpA0fhBiMjPjits1szOyds8Dh8LCQJqiCFus/LoZiBu8n/Q1PpA+kAwbBL4SfhKxwXy4GT4ACH4a/hs+kJvE9cL/5Mg+GvfMNs88gAKFwA8U2FsdCBkb2Vzbid0IGNvbnRhaW4gYW55IHZhbHVlAhjQIIs4rbNYxwWKiuIMDQEK103Q2zwNAELXTNCLL0pA1yb0BDHTCTGLL0oY1yYg10rCAZLXTZIwbeICFu1E0NdJwgGOgOMNDxoCSnDtRND0BXEhgED0Do6A34kg+Gz4a/hqgED0DvK91wv/+GJw+GMQEQECiREAQ4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAD/jD4RvLgTPhCbuMA0x/4RFhvdfhk0ds8I44mJdDTAfpAMDHIz4cgznHPC2FeIMjPkll+WwbOWcjOAcjOzc3NyXCOOvhEIG8TIW8S+ElVAm8RyM+EgMoAz4RAzgH6AvQAcc8LaV4gyPhEbxXPCx/OWcjOAcjOzc3NyfhEbxTi+wAaFRMBCOMA8gAUACjtRNDT/9M/MfhDWMjL/8s/zsntVAAi+ERwb3KAQG90+GT4S/hM+EoDNjD4RvLgTPhCbuMAIZPU0dDe+kDR2zww2zzyABoYFwA6+Ez4S/hK+EP4QsjL/8s/z4POWcjOAcjOzc3J7VQBMoj4SfhKxwXy6GXIz4UIzoBvz0DJgQCg+wAZACZNZXRob2QgZm9yIE5GVCBvbmx5AELtRNDT/9M/0wAx+kDU0dD6QNTR0PpA0fhs+Gv4avhj+GIACvhG8uBMAgr0pCD0oR4dABRzb2wgMC41OC4yAAAADCD4Ye0e2Q==';
    // Gettind a code from Index StateInit
    const tvc = await provider.splitTvc(INDEX_BASE_64);
    if (!tvc.code) throw new Error('tvc code is empty');
    // Salt structure that we already know
    const saltStruct = [
      { name: 'collection', type: 'address' },
      { name: 'owner', type: 'address' },
      { name: 'type', type: 'fixedbytes3' }, // according on standards, each index salted with string 'nft'
    ] as const;
    const { code: saltedCode } = await provider.setCodeSalt({
      code: tvc.code,
      salt: {
        structure: saltStruct,
        abiVersion: '2.1',
        data: {
          collection: new Address(CONTRACT_ADDRESS),
          owner: new Address(userAddress),
          type: btoa('nft'),
        },
      },
    });
    return saltedCode;
  };

  // Method, that return Index'es addresses by single query with fetched code hash
  const getAddressesFromIndex = async (codeHash: string): Promise<Address[] | undefined> => {
    const addresses = await provider?.getAccountsByCodeHash({ codeHash });
    return addresses?.accounts;
  };

  // Main method of this component
  const loadNFTs = async () => {
    setIsLoading(true);
    setListIsEmpty(false);
    try {
      // Take a salted code
      if (!provider?.isInitialized) return;
      const saltedCode = await saltCode();
      // Hash it
      const codeHash = await provider.getBocHash(String(saltedCode));
      if (!codeHash) {
        setIsLoading(false);
        return;
      }
      // Fetch all Indexes by hash
      const indexesAddresses = await getAddressesFromIndex(codeHash);
      if (!indexesAddresses || !indexesAddresses.length) {
        if (indexesAddresses && !indexesAddresses.length) setListIsEmpty(true);
        setIsLoading(false);
        return;
      }
      // Fetch all image URLs
      const _nftJsons = await getNftsByIndexes(provider, indexesAddresses);
      setNftJsons(_nftJsons);
      setIsLoading(false);
    } catch (e) {
      console.error(e);
      setIsLoading(false);
    }
  };
  useEffect(() => {
    if (userAddress && isConnected) loadNFTs();
    if (!userAddress) setListIsEmpty(false);
  }, [userAddress]);
  return (
    <Box>
      <Container
        as="main"
        maxW="container.md"
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
                    <Button m={1} minWidth={120} bgColor={'var(--purple0)'}>
                      Manage VID
                    </Button>
                  </Link>
                </Box>
              )}
            </Alert>
          )}
          <Stack direction={['column']} pb={4} pt={notMobile ? 10 : 6} width="100%" gap={2}>
            <Text
              width={'100%'}
              textAlign={'center'}
              fontWeight="bold"
              fontSize={notMobile ? '4xl' : '2xl'}
              my={notMobile ? 10 : 4}>
              {t('yourVids')}
            </Text>
            {isLoading && (
              <Center width={'100%'} height={150}>
                <Spinner size="lg" />
              </Center>
            )}
            {nftjsons?.map((nft) => (
              <Center
                width={'100%'}
                key={nft.name}
                flexDirection={'column'}
                gap={2}
                backgroundColor={colorMode === 'dark' ? 'blackAlpha.300' : 'white'}
                borderColor={'blackAlpha.200'}
                borderWidth={1}
                p={3}
                py={4}
                borderRadius={12}>
                <Flex minW={350} key={nft.name + ' name'} color={'var(--venom1)'} fontWeight={'bold'} fontSize={'2xl'} gap={2} justifyContent={'space-between'} my={2}>
                {nft.name}<Logo /> 
                </Flex>
                <Link href={'manage/'+nft.address}>
                  <Button bgColor={'var(--purple0)'} minW={350}>
                    Manage {nft.name}
                  </Button>
                </Link>
                <Link href={nft.external_url} target="_blank">
                  <Button minW={350} gap={2}>{nft.external_url?.slice(8)}</Button>
                </Link>
              </Center>
            ))}
          </Stack>
          {!userAddress && (
            <Text
              bgColor={'blackAlpha.300'}
              p={4}
              borderRadius={12}
              fontWeight="light"
              fontSize={'xl'}>
              {t('venomWalletConnect')}
            </Text>
          )}
          <Text fontWeight="light" fontSize={notMobile ? '2xl' : 'xl'} my={notMobile ? 10 : 6}>
            {t('manageDescription')}
          </Text>
        </>
      </Container>
    </Box>
  );
}

export default ManageSection;
