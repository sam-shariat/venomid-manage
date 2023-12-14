import {
  Box,
  Button,
  Container,
  Flex,
  HStack,
  Stack,
  Drawer,
  IconButton,
  useColorMode,
  useColorModeValue,
  useMediaQuery,
  Text,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  useDisclosure,
  Link,
} from '@chakra-ui/react';
import NextLink from 'next/link';
import { colorModeAtom, localeAtom } from 'core/atoms';
import { ConnectButton } from 'components/venomConnect';
import { useAtom, useAtomValue } from 'jotai';
import Logo from './Logo';
import {
  RiMoonFill,
  RiSunFill,
  RiMenu2Fill,
  RiCloseFill,
  RiExternalLinkLine,
} from 'react-icons/ri';
import { Locale } from 'translations';
import { useEffect } from 'react';
import { ConnectWallet } from '@thirdweb-dev/react';
import { useConnect } from 'venom-react-hooks';
import { useRouter } from 'next/router';
import { SITE_CLAIM_URL } from 'core/utils/constants';

export default function Header() {
  const [colorM, setColorM] = useAtom(colorModeAtom);
  const { colorMode, toggleColorMode } = useColorMode();
  const { isConnected } = useConnect();
  const router = useRouter();
  const nftAddress = String(router.query.nftAddress);
  const [locale, setLocale] = useAtom(localeAtom);
  const [notMobile] = useMediaQuery('(min-width: 800px)');
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    console.log(colorMode + ' is ' + colorM);
    if (colorMode !== colorM) {
      toggleColorMode();
    }
  }, [colorMode]);

  return (
    <Box
      as="nav"
      borderBottom="1px"
      backgroundColor={useColorModeValue('blackAlpha.100', 'blackAlpha.500')}
      borderBottomColor={useColorModeValue('blackAlpha.100', 'whiteAlpha.100')}
      py={2}>
      <Container maxW="container.xl">
        <Flex justifyContent="space-between">
          <HStack>
            {/* {!notMobile && (
              <IconButton aria-label="venomid-mobile-menu" variant="ghost" onClick={onOpen}>
                <RiMenu2Fill />
              </IconButton>
            )} */}
            <NextLink href="/" passHref>
              <Button
                id="venomidmanagelogo"
                color="var(--venom1)"
                fontWeight="bold"
                variant="ghost"
                gap={2}
                px={2}>
                <Logo />
                <Text>{notMobile ? 'VenomID' : 'VID'}.Tools</Text>
              </Button>
            </NextLink>
            {/* {notMobile && (
              <NextLink href="/" passHref>
                <Button variant="ghost" textAlign="left">
                  Manage
                </Button>
              </NextLink>
            )}
            {notMobile && (
              <NextLink href="/docs" passHref>
                <Button variant="ghost" textAlign="left">
                  API Docs
                </Button>
              </NextLink>
            )}
            {notMobile && (
              <Button
                as={Link}
                href={SITE_CLAIM_URL}
                target='_blank'
                variant="ghost"
                
                gap={2}>
                Claim VID <RiExternalLinkLine size={'18px'} />
              </Button>
            )} */}

            {/* 
            {notMobile && (
              <NextLink href="https://venomid.network/#roadmap" passHref>
                <Button variant="ghost" textAlign="left">
                  RoadMap
                </Button>
              </NextLink>
            )}
            {notMobile && (
              <NextLink href="https://venomid.network/#about" passHref>
                <Button variant="ghost" textAlign="left">
                  About
                </Button>
              </NextLink>
            )} */}
          </HStack>
          <HStack dir="ltr">
            {/* {notMobile && isConnected && nftAddress.length > 32 && (
              <ConnectWallet
                theme={colorMode}
                btnTitle="ETH Wallet"
                style={{
                  backgroundColor: colorMode === 'light' ? 'var(--light)' : 'var(--dark)',
                  color: colorMode === 'dark' ? 'white' : 'black',
                  border: '1px solid gray',
                }}
              />
            )}
            <ConnectButton /> */}
            
              <IconButton
                aria-label="theme"
                variant="ghost"
                onClick={() => {
                  setColorM(colorMode === 'light' ? 'dark' : 'light');
                  toggleColorMode();
                }}
                icon={colorMode === 'light' ? <RiMoonFill /> : <RiSunFill />}
              />
            
          </HStack>
        </Flex>
      </Container>
      <Drawer placement={'left'} onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent backgroundColor={colorMode === 'light' ? 'var(--white)' : 'var(--dark)'}>
          <DrawerHeader
            display="flex"
            borderBottomWidth="1px"
            gap={4}
            justifyContent="space-between">
            <NextLink href="/" passHref>
              <Button color="var(--venom1)" fontWeight="bold" variant="ghost" px={1}>
                <Logo />
                <Text pl={1}>VenomID.Tools</Text>
              </Button>
            </NextLink>
            <HStack>
              <IconButton
                variant="ghost"
                aria-label="theme"
                onClick={() => {
                  setColorM(colorMode === 'light' ? 'dark' : 'light');
                  toggleColorMode();
                }}
                icon={colorMode === 'light' ? <RiMoonFill /> : <RiSunFill />}
              />
              <IconButton aria-label="closemenu" variant="ghost" onClick={onClose}>
                <RiCloseFill />
              </IconButton>
            </HStack>
          </DrawerHeader>
          <DrawerBody>
            <Stack gap={2} pt={4}>
              {/* {isConnected && nftAddress.length > 32 && (
                <ConnectWallet
                  theme={colorMode}
                  btnTitle="ETH Wallet"
                  style={{
                    backgroundColor: colorMode === 'light' ? 'var(--light)' : 'var(--dark)',
                    color: colorMode === 'dark' ? 'white' : 'black',
                    border: '1px solid gray',
                  }}
                />
              )} */}
              {/* <NextLink href="/" passHref>
                <Button variant="ghost" width="100%" justifyContent="left">
                  Manage
                </Button>
              </NextLink>
              <NextLink href="/docs" passHref>
                <Button variant="ghost" width="100%" justifyContent="left">
                  API Docs
                </Button>
              </NextLink>
              <Button
                as={Link}
                href={SITE_CLAIM_URL}
                target='_blank'
                variant="ghost"
                justifyContent={'left'}
                gap={2}>
                Claim VID <RiExternalLinkLine size={'18px'} />
              </Button> */}

              {/* 
              <NextLink href="https://venomid.network/#roadmap" passHref>
                <Button variant="ghost" width="100%" justifyContent="left">
                  RoadMap
                </Button>
              </NextLink>
              <NextLink href="https://venomid.network/#about" passHref>
                <Button variant="ghost" width="100%" justifyContent="left">
                  About
                </Button>
              </NextLink> */}
            </Stack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Box>
  );
}
