import { Button, Box, Stack, Switch, Text } from '@chakra-ui/react';
import React, { useEffect } from 'react';
import { useAtom, useAtomValue } from 'jotai';
import { addressAtom, useLineIconsAtom, lightModeAtom } from 'core/atoms';

interface Props {
  json: any;
  nftAddress: string;
}

export default function ManageSettings({ json, nftAddress }: Props) {
  const wallet = useAtomValue(addressAtom);
  const [useLineIcons,setUseLineIcons] = useAtom(useLineIconsAtom);
  const [lightMode,setLightMode] = useAtom(lightModeAtom);

  useEffect(() => {
    setUseLineIcons(json.lineIcons);
    setLightMode(json.lineIcons);
  },[]);

  return (
    <Stack my={5} width={'100%'}>
      <Text my={3} fontWeight="bold" fontSize="xl" textAlign='center'>
        Settings
      </Text>
      <Button px={4} variant="solid" size='lg' borderRadius={12} justifyContent='space-between' onClick={()=> setUseLineIcons(!useLineIcons)}>
        <Text>Use Line Icons</Text>
        <Switch as={Box} bg={'none'} size='lg' isChecked={useLineIcons} onClick={()=> setUseLineIcons(!useLineIcons)}/>
      </Button>
      <Button px={4} variant="solid" size='lg' borderRadius={12} justifyContent='space-between' onClick={()=> setLightMode(!lightMode)}>
        <Text>Light Colors</Text>
        <Switch as={Box} bg={'none'} size='lg' isChecked={lightMode} onClick={()=> setLightMode(!lightMode)}/>
      </Button>
    </Stack>
  );
}
