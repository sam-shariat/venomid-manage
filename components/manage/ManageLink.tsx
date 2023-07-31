import {
  Box,
  IconButton,
  Accordion,
  AccordionItem,
  Tooltip,
  AccordionButton,
  AccordionIcon,
  AccordionPanel,
  Button,
  Flex,
  Input,
  Textarea,
  InputRightElement,
  InputGroup,
  useMediaQuery,
  useColorMode,
  Text,
  Stack,
  Badge,
} from '@chakra-ui/react';
import { SortableHandle } from 'react-sortable-hoc';
import { MdOutlineDragIndicator } from 'react-icons/md';
import { RiFileCopy2Line, RiUploadCloudLine } from 'react-icons/ri';
import React, { useEffect, useState } from 'react';
import { capFirstLetter } from 'core/utils';
import { ImageLink } from 'components/Profile';
import { useStorageUpload } from '@thirdweb-dev/react';
import axios from 'axios';

const DragHandle = SortableHandle(() => (
  <span>
    <MdOutlineDragIndicator size="22" />
  </span>
));

interface Props {
  type: string;
  title: string;
  url: string;
  ind: number;
  icon: JSX.Element;
  image?: string;
  content?: string;
  setUrl?: any;
  removeUrl?: any;
}

export default function ManageLink({
  type,
  icon,
  title,
  url,
  image,
  content,
  setUrl,
  ind,
  removeUrl,
}: Props) {
  const { colorMode } = useColorMode();
  const [notMobile] = useMediaQuery('(min-width: 800px)');
  const [_title, setTitle] = useState(title);
  const [imageUploading, setImageUploading] = useState(false);
  const [_url, setURL] = useState(url);
  const [_content, setContent] = useState(content);
  const [_image, setImage] = useState(image);
  const { mutateAsync: upload } = useStorageUpload();

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
              gap={2}
              alignItems={'center'}
              textAlign="left"
              width={notMobile ? '100%' : '100%'}>
              <DragHandle />
              {icon}
              <Stack display={'flex'} flex={1} gap={0}>
                <Text fontWeight={'bold'} m={0}>
                  {_title}
                </Text>
                <Text fontSize="xs" mt={'0px !important'}>
                  {capFirstLetter(type)}
                </Text>
              </Stack>
              <AccordionIcon />
            </Flex>
          </AccordionButton>

          <AccordionPanel pb={4} minWidth="100%">
            <Stack gap={2}>
              <Input
                size="lg"
                value={_title}
                variant="filled"
                mt={2}
                placeholder={`Enter ${capFirstLetter(type)} Title/Heading`}
                fontWeight="bold"
                onChange={(e) => setTitle(e.currentTarget.value)}
                //onChange={(e) => setUrl(title.toLowerCase(),e.currentTarget.value)}
              />

              {(type.indexOf('link') >= 0 || type.indexOf('video')) >= 0 && (
                <InputGroup mt={2}>
                  <Input
                    size="lg"
                    value={_url}
                    placeholder={`Enter ${capFirstLetter(type)} URL`}
                    onChange={(e) => setURL(e.currentTarget.value)}
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
                        onClick={() => navigator.clipboard.readText().then((text) => setURL(text))}>
                        <RiFileCopy2Line />
                      </IconButton>
                    </Tooltip>
                  </InputRightElement>
                </InputGroup>
              )}

              {type.indexOf('youtube') >= 0 && _url.indexOf('youtube.com/watch') >= 0 && (
                <iframe
                  width="100%"
                  height="200"
                  src={`https://www.youtube.com/embed/${_url.slice(
                    _url.indexOf('?v=') + 3,
                    _url.length
                  )}`}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title="Embedded youtube"
                />
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
                  <ImageLink url={_image} alt={_title} loading={imageUploading} />
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
                  value={_content}
                  onChange={(e) => setContent(e.currentTarget.value)}
                />
              )}

              <Flex gap={2} width={'100%'}>
                <Button
                  color="white"
                  bgColor="var(--venom1)"
                  disabled={
                    _url === url && _title === title && _image === image && _content === content
                  }
                  onClick={() => setUrl(ind, _title, _url, _image, _content)}>
                  Save
                </Button>
                <Button onClick={() => removeUrl(ind)}>Remove</Button>
              </Flex>
            </Stack>
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    </>
  );
}
