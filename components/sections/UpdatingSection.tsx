import {
  useMediaQuery,
  Button,
  Container,
  Heading,
  Text,
  SimpleGrid,
  Box,
  Center,
  Flex,
} from '@chakra-ui/react';
import { useTranslate } from 'core/lib/hooks/use-translate';
import NextLink from 'next/link';
import { SITE_CLAIM_URL, SITE_PROFILE_URL } from 'core/utils/constants';
import Venom from 'components/Venom';

export default function UpdatingSection() {
  const { t } = useTranslate();
  const [notMobile] = useMediaQuery('(min-width: 800px)');
  return (
    <Box id="about">
      <Container
        as="main"
        maxW="container.xl"
        display="grid"
        placeContent="center"
        placeItems="center"
        minH="100vh">
        <>
          <Center display="flex" flexDirection={['column', 'column','column', 'row-reverse']} gap={16} fontFamily={'Poppins'}>
            <Center display="flex" flexDirection="column">
              <Venom srcUrl="/screens/rebuildingScreen.png" size={notMobile ? 'xs' : 'xs'} />
            </Center>

            <Flex flexDirection="column" gap={12} justifyContent={'center'} alignContent={'center'}>
              <Heading fontFamily={'Poppins'} fontWeight="bold" fontSize="6xl">
                REBUIDLING
              </Heading>

              <Text fontWeight="normal" fontSize={notMobile ? '4xl' : '2xl'}>
                We are rebuilding this page
              </Text>
              <NextLink href={SITE_CLAIM_URL} passHref>
                <Button colorScheme='green' size="lg" minWidth="100%" variant={'outline'}>
                  Back to venomid.network
                </Button>
              </NextLink>
            </Flex>
          </Center>
        </>
      </Container>
    </Box>
  );
}
