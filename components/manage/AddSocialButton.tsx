import {
  InputRightElement,
  Accordion,
  AccordionItem,
  AccordionButton,
  IconButton,
  AccordionPanel,
  Button,
  Flex,
  Tooltip,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useMediaQuery,
  useColorMode,
  Input,
  InputLeftAddon,
  InputGroup,
  Stack,
  Text,
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { RiAddFill, RiFileCopy2Line } from 'react-icons/ri';
import { useAtom } from 'jotai';
import { socialsArrayAtom } from 'core/atoms';
import { capFirstLetter } from 'core/utils';
import { SocialIcon } from 'components/logos';

export default function AddSocialButton() {
  const { colorMode } = useColorMode();
  const [notMobile] = useMediaQuery('(min-width: 800px)');
  const [availableSocials, setAvailableSocials] = useState([]);
  const [selectedSocial, setSelectedSocial] = useState('');
  const [selectedSocialUrl, setSelectedSocialUrl] = useState('');
  const [socialsArray, setSocialsArray] = useAtom(socialsArrayAtom);
  const addToSocial = () => {
    let _newSocialsArray = [
      ...socialsArray,
      { key: selectedSocial.toLowerCase(), value: selectedSocialUrl },
    ];
    setSocialsArray(_newSocialsArray);
    setSelectedSocialUrl('');
    setSelectedSocial('');
  };

  useEffect(() => {
    let _socials = [
      'Twitter',
      'Medium',
      'Linkedin',
      'Youtube',
      'Discord',
      'Instagram',
      'Facebook',
      'Pinterest',
      'Zealy',
      'Telegram',
      'Whatsapp',
      'Galxe',
      'Opensea',
      'Github',
      'Phone',
      'Email',
    ].sort();
    socialsArray.map((item) => {
      _socials.splice(_socials.indexOf(capFirstLetter(item.key)), 1);
    });
    setAvailableSocials(_socials);
  }, [socialsArray]);

  return (
    <>
      <Accordion
        allowToggle
        allowMultiple={false}
        borderRadius={10}
        minWidth={notMobile ? 'md' : 'xs'}
        size="lg"
        backgroundColor={colorMode === 'dark' ? 'whiteAlpha.100' : 'blackAlpha.100'}
        display={'flex'}
        flexGrow={1}>
        <AccordionItem border={0} borderRadius={10} width={'100%'}>
          <AccordionButton minWidth={notMobile ? 'md' : 'xs'}>
            <Flex
              alignItems="center"
              justifyContent="center"
              width={notMobile ? '100%' : '100%'}
              gap={2}>
              <RiAddFill size="28" />
              <Text fontWeight="bold">Add New</Text>
            </Flex>
          </AccordionButton>
          <AccordionPanel p={4} minWidth="100%">
            <Stack>
              <Menu>
                <MenuButton as={Button}>
                  {selectedSocial ? selectedSocial : 'Select Social Media'}
                </MenuButton>
                <MenuList
                  py={0}
                  width={320}
                  border={1}
                  borderColor={'grey'}
                  bg={colorMode === 'light' ? 'var(--lightGrey)' : 'var(--darkGradient)'}>
                  {availableSocials.map((item) => (
                    <MenuItem key={'i-' + item} onClick={() => setSelectedSocial(item)}>
                      {item}
                    </MenuItem>
                  ))}
                </MenuList>
              </Menu>
              {selectedSocial && (
                <InputGroup size="lg" minWidth="xs" borderColor="gray">
                  <InputLeftAddon>
                    <SocialIcon name={selectedSocial.toLowerCase()} />
                  </InputLeftAddon>
                  <Input
                    disabled={selectedSocial === ''}
                    value={selectedSocialUrl}
                    placeholder={`Enter your ${selectedSocial} URL`}
                    onChange={(e) => setSelectedSocialUrl(e.currentTarget.value)}
                  />
                  <InputRightElement>
                    <Tooltip
                      borderRadius={4}
                      label={<Text p={2}>Paste</Text>}
                      hasArrow
                      color="white"
                      bgColor={'black'}>
                      <IconButton
                        aria-label="paste-url"
                        onClick={() =>
                          navigator.clipboard.readText().then((text) => setSelectedSocialUrl(text))
                        }>
                        <RiFileCopy2Line />
                      </IconButton>
                    </Tooltip>
                  </InputRightElement>
                </InputGroup>
              )}
              <Flex mt={4}>
                <Button
                  color="white"
                  bgColor="var(--venom1)"
                  disabled={selectedSocialUrl === ''}
                  onClick={addToSocial}>
                  Add
                </Button>
              </Flex>
            </Stack>
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    </>
  );
}
