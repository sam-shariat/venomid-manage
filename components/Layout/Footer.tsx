import { Box, Container, Link, Text, useColorMode } from '@chakra-ui/react';
import { GITHUB_URL } from 'core/utils/constants';
export default function Footer() {
  return (
    <Box as="footer" w="full" py={5} mt={10} backgroundColor={'blackAlpha.200'}>
      <Container maxW="container.md" display="flex" justifyContent="center">
        <Text>2023 on Venom Blockchain</Text>
      </Container>
    </Box>
  );
}
