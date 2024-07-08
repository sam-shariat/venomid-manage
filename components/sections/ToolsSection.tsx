import {
  Button,
  useColorMode,
  Text,
  useDisclosure,
  Flex,
  Link,
  Select,
  useColorModeValue,
  Stack,
  Input,
  useToast,
  Container,
  Box,
  Collapse,
  Heading,
  useMediaQuery,
  Center,
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import {
  RiCheckboxCircleFill,
  RiQuestionFill,
  RiShakeHandsLine,
  RiUploadCloudLine,
} from 'react-icons/ri';
import { useTranslate } from 'core/lib/hooks/use-translate';
import { useAtomValue } from 'jotai';
import { connectedAccountAtom, primaryNameAtom } from 'core/atoms';
import { useStorageUpload } from '@thirdweb-dev/react';
import { LinkIcon } from 'components/logos';
import { DISCORD_URL, SITE_URL, YLIDE_URL, ZEALY_URL } from 'core/utils/constants';
import NextLink from 'next/link';
import ChallengesSection from 'components/challenges/ChallengesSection';

export default function ToolsSection() {
  const { colorMode } = useColorMode();
  const [role, setRole] = useState('Graphic Designer');
  const toast = useToast();
  const [notMobile] = useMediaQuery('(min-width: 768px)');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const connectedAccount = useAtomValue(connectedAccountAtom);
  const primary = useAtomValue(primaryNameAtom);
  const { t } = useTranslate();

  return (
    <>
      <Box>
        <Container
          as="main"
          maxW="container.lg"
          display="grid"
          flexDir={'column'}
          justifyContent={'center'}
          alignContent={'center'}
          minH={'100vh'}
          flexGrow={1}>
          <Box py={6} gap={20} width={'100%'}>
            
            <Flex flexDirection={['column','column','column','row']} w={'100%'} gap={6} my={12}>
              {/* <MintNft /> */}
              <NextLink href="/send" passHref>
              <Button
                h={['220px', '220px', '160px']}
                size={'lg'}
                
                style={{ textDecoration: 'none' }}
                gap={6}
                flexDir={['column', 'column', 'row']}
                justifyContent={['center', 'center', 'start']}>
                <Flex align={'center'} gap={4}>
                  <LinkIcon type="RiSendPlane2Line" size={notMobile ? '70' : '40'} />
                  <Text display={['block', 'block', 'none']} fontSize={'xl'}>
                    Send
                  </Text>
                </Flex>
                <Flex flexDirection={'column'} align={['center', 'center', 'start']} gap={2}>
                  <Text display={['none', 'none', 'block']} fontSize={'xl'}>
                    Send
                  </Text>
                  <Flex
                    fontWeight={'normal'}
                    flexDirection={['column', 'column', 'row']}
                    gap={2}
                    align={['center', 'center', 'start']}>
                    <Text>Transfer Tokens and NFTs</Text>                    
                  </Flex>
                  <Text fontWeight={'normal'}> To any .venom domain or Address!</Text>
                </Flex>
              </Button>
              </NextLink>
              {/* <Button
                h={['220px', '220px', '160px']}
                size={'lg'}
                as={Link}
                style={{ textDecoration: 'none' }}
                href={DISCORD_URL}
                target="_blank"
                gap={6}
                flexDir={['column', 'column', 'row']}
                justifyContent={['center', 'center', 'start']}>
                <Flex align={'center'} gap={4}>
                  <LinkIcon type="discord" size={notMobile ? '70' : '40'} />
                  <Text display={['block', 'block', 'none']} fontSize={'xl'}>
                    Portfolio
                  </Text>
                </Flex>
                <Flex flexDirection={'column'} align={['center', 'center', 'start']} gap={2}>
                  <Text display={['none', 'none', 'block']} fontSize={'xl'}>
                    Portfolio
                  </Text>
                  <Flex
                    fontWeight={'normal'}
                    flexDirection={['column', 'column', 'row']}
                    gap={2}
                    align={['center', 'center', 'start']}>
                    <Text>Venom Portfolio Tracker</Text>
                  </Flex>
                  <Text fontWeight={'normal'}> Track Tokens and NFTs!</Text>
                </Flex>
              </Button> */}

            </Flex>
          </Box>
        </Container>
      </Box>
    </>
  );
}
