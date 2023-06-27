import { Button, Box, useMediaQuery, Text, Center } from '@chakra-ui/react';
import { VenomFoundation } from 'components/logos';
import { truncAddress } from 'core/utils';
import React, { useEffect } from 'react';
import { useConnect } from "venom-react-hooks";

export default function ConnectButton() {
  const [notMobile] = useMediaQuery('(min-width: 800px)');
  const { login, disconnect, isConnected, account } = useConnect();

  return (
    <>
      <Box>
        {!isConnected ? (
          <Button variant="solid" onClick={login}>
            <Center>
              <VenomFoundation />
              Connect
            </Center>
          </Button>
        ) : (
          <Button variant="solid" onClick={disconnect}>
            <Center>
              <VenomFoundation />
              {account?.balance && 
              <Text mx={2} color="var(--venom1)">
                {Math.round(Number((account?.balance as string)) / 10e5) / 10e2}
              </Text>}
              {notMobile && account && truncAddress(account?.address?.toString())}
            </Center>
          </Button>
        )}
      </Box>
    </>
  );
}
