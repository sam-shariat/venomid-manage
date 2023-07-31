import {
  InputRightElement,
  Accordion,
  AccordionItem,
  AccordionButton,
  IconButton,
  AccordionPanel,
  Button,
  Tooltip,
  Textarea,
  Flex,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Badge,
  useMediaQuery,
  useColorMode,
  Input,
  InputLeftAddon,
  InputLeftElement,
  InputGroup,
  Stack,
  Text,
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { RiAddFill, RiFileCopy2Line, RiUploadCloudLine } from 'react-icons/ri';
import { useAtom } from 'jotai';
import { linksArrayAtom } from 'core/atoms';
import { capFirstLetter } from 'core/utils';
import { useStorageUpload } from '@thirdweb-dev/react';
import { SocialIcon } from 'components/logos';
import axios from 'axios';
import { ImageLink } from 'components/Profile';

export default function AddLinkButton() {
  const { colorMode } = useColorMode();
  const [linksArray, setLinksArray] = useAtom(linksArrayAtom);
  const { mutateAsync: upload } = useStorageUpload();
  const [notMobile] = useMediaQuery('(min-width: 800px)');
  const [type, setType] = useState('');
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [image, setImage] = useState('');
  const [imageUploading, setImageUploading] = useState(false);
  const [content, setContent] = useState('');
  const [availableLinks, setAvailableLinks] = useState([
    { type: 'simple link', av: true },
    { type: 'image link', av: true },
    { type: 'youtube video', av: true },
    { type: 'simple text', av: true },
    { type: 'ipfs image', av: true },
    { type: 'advanced text', av: false },
    { type: 'ipfs video', av: false },
    ,
  ]);
  const addToLinks = () => {
    let _newLinksArray = [
      ...linksArray,
      {
        type,
        title,
        url,
        image,
        content,
      },
    ];

    setLinksArray(_newLinksArray);
    setType('');
    setTitle('');
    setImage('');
    setUrl('');
    setContent('');
  };

  function buildFileSelector() {
    if (process.browser) {
      const fileSelector = document.createElement('input');
      fileSelector.type = 'file';
      fileSelector.multiple = false;
      fileSelector.onchange = async (e: any) => {
        sendproFileToIPFS(e.target.files[0]);
      };
      fileSelector.accept = 'image/x-png,image/gif,image/jpeg';
      return fileSelector;
    }
  }

  const imageFileSelect = buildFileSelector();

  const sendproFileToIPFS = async (e: any) => {
    if (e) {
      try {
        const formData = [e];
        console.log('uploading file to ipfs');
        setImageUploading(true);
        const uris = await upload({ data: formData });
        //const ImgHash = resFile.data.IpfsHash;
        //console.log(ImgHash);
        setImage('https://ipfs.io/ipfs/' + uris[0].slice(7));
        setImageUploading(false);
      } catch (error) {
        alert('Error sending File to IPFS, Please check your network and Try Again');
        setImageUploading(false);
        console.log(error);
      }
    }
  };

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
          <AccordionPanel p={4} minWidth={notMobile ? 'md' : '100%'}>
            <Stack gap={2}>
              <Menu>
                <MenuButton as={Button}>
                  {type ? capFirstLetter(type) : 'Select Link Type'}
                </MenuButton>
                <MenuList
                  py={0}
                  width={320}
                  border={1}
                  borderColor={'grey'}
                  bg={colorMode === 'light' ? 'var(--lightGrey)' : 'var(--darkGradient)'}>
                  {availableLinks.map((item) => (
                    <MenuItem
                      gap={2}
                      key={item.type}
                      justifyContent="space-between"
                      onClick={() => item !== undefined && item?.av && setType(item.type)}>
                      {capFirstLetter(item.type)}
                      {!item?.av && (
                        <Badge variant="outline" colorScheme="green">
                          Soon
                        </Badge>
                      )}
                    </MenuItem>
                  ))}
                </MenuList>
              </Menu>
              {type && (
                <>
                  <InputGroup size="lg" minWidth="xs" borderColor="gray">
                    <Input
                      disabled={type === ''}
                      value={title}
                      variant="filled"
                      placeholder={`Enter ${capFirstLetter(type)} Title/Heading`}
                      fontWeight="bold"
                      onChange={(e) => setTitle(e.currentTarget.value)}
                    />
                  </InputGroup>
                </>
              )}

              {(type.indexOf('link') >= 0 || type.indexOf('video') >= 0) && (
                <>
                  <InputGroup mt={2}>
                    <Input
                      size="lg"
                      value={url}
                      placeholder={`Enter ${capFirstLetter(type)} Address`}
                      onChange={(e) => setUrl(e.currentTarget.value)}
                      //onChange={(e) => setUrl(title.toLowerCase(),e.currentTarget.value)}
                    />
                    <InputRightElement>
                      <Tooltip
                        borderRadius={4}
                        label={<Text p={2}>Paste</Text>}
                        hasArrow
                        color="white"
                        bgColor={'black'}>
                        <IconButton
                          mt={2}
                          mr={2}
                          aria-label='paste-url'
                          onClick={() =>
                            navigator.clipboard.readText().then((text) => setUrl(text))
                          }>
                          <RiFileCopy2Line />
                        </IconButton>
                      </Tooltip>
                    </InputRightElement>
                  </InputGroup>

                  {type.indexOf('youtube') >= 0 && url.indexOf('youtube.com/watch') >= 0 && (
                    <iframe
                      width="100%"
                      height="200"
                      src={`https://www.youtube.com/embed/${url.slice(
                        url.indexOf('?v=') + 3,
                        url.length
                      )}`}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      title="Embedded youtube"
                    />
                  )}
                </>
              )}

              {type.indexOf('image') >= 0 && (
                <>
                  <Button
                    size="lg"
                    disabled={imageUploading}
                    gap={2}
                    onClick={() => imageFileSelect !== undefined && imageFileSelect.click()}>
                    <RiUploadCloudLine size="24" /> Upload Image
                  </Button>
                  <ImageLink url={image} alt={title} loading={imageUploading} />
                </>
              )}

              {type.indexOf('text') >= 0 && (
                <Textarea
                  minWidth="xs"
                  my={4}
                  rows={5}
                  maxLength={500}
                  placeholder={'Simple Text ...'}
                  size="lg"
                  bg={colorMode === 'dark' ? 'whiteAlpha.100' : 'blackAlpha.100'}
                  variant="outline"
                  border="none"
                  resize={'none'}
                  value={content}
                  onChange={(e) => setContent(e.currentTarget.value)}
                />
              )}
              <Flex mt={4}>
                <Button
                  color="white"
                  bgColor="var(--venom1)"
                  disabled={type === '' || title === ''}
                  onClick={addToLinks}>
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
