import {
  Stack,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionIcon,
  AccordionPanel,
  Button,
  Text,
  Flex,
  useMediaQuery,
  useColorMode,
} from '@chakra-ui/react';
import React, { useEffect } from 'react';
import { useAtom, useAtomValue } from 'jotai';
import { linksArrayAtom } from 'core/atoms';
import { LinkIcon } from 'components/logos';
import { SortableContainer, SortableElement } from 'react-sortable-hoc';
import { arrayMoveImmutable } from 'array-move';
import AddLinkButton from './AddLinkButton';
import ManageLink from './ManageLink';
import { capFirstLetter, arrayRemove } from 'core/utils';
import { CustomLink, SortableItemProps, SortableConProps } from 'types';

interface Props {
  json: any;
  nftAddress: string;
}

export default function ManageLinks({ json, nftAddress }: Props) {
  const [linksArray, setLinksArray] = useAtom(linksArrayAtom);
  const [notMobile] = useMediaQuery('(min-width: 800px)');
  const { colorMode } = useColorMode();

  const SortableCon = SortableContainer(({ children, onSortEnd, useDragHandle }: SortableConProps) => {
    return <ul>{children}</ul>;
  });

  // @ts-ignore: Unreachable code error
  const setLinks = (index, title, url, image, content) => {
    let _newLinksArray = linksArray.map((item, ind) =>
      ind === index
        ? {
            type: item.type,
            title,
            url,
            image,
            content,
          }
        : {
            type: item.type,
            title: item.title,
            url: item.url,
            image: item.image,
            content: item.content,
          }
    );
    setLinksArray(_newLinksArray);
  };

  // @ts-ignore: Unreachable code error
  const removeLink = (index) => {
    let _newLinksArray = arrayRemove(linksArray, index);
    console.log(_newLinksArray);
    setLinksArray(_newLinksArray);
  };

  // @ts-ignore: Unreachable code error
  const SortableItem = SortableElement(({ children, index }: SortableItemProps) => (
    <li style={{ listStyleType: 'none', padding: '0px 0px', margin: '12px 0px' }}>{children}</li>
  ));

  useEffect(() => {
    // @ts-ignore: Unreachable code error
    let _links = [];
    if (json?.links) {
      json?.links.map((link: CustomLink) => {
        _links.push({
          type: link.type,
          title: link.title,
          url: link.url,
          image: link.image,
          content: link.content,
        });
      });
    }
    // @ts-ignore: Unreachable code error
    setLinksArray(_links);
  }, []);

  // @ts-ignore: Unreachable code error
  const onSortEnd = ({ oldIndex, newIndex }) => {
    setLinksArray(arrayMoveImmutable(linksArray, oldIndex, newIndex));
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
              <Text fontWeight={'bold'} display={'flex'} flex={1}>
                Links
              </Text>
              <AccordionIcon />
            </Flex>
          </AccordionButton>

          <AccordionPanel pb={4} minWidth="100%">
            <Stack gap={2}>
            
              <SortableCon onSortEnd={onSortEnd} useDragHandle>
                <>
                {linksArray.map((item, index) => (
                  <SortableItem key={`item-${item.title}-${index}`} index={index}>
                    <>
                    <ManageLink
                      key={`item-${item.key}`}
                      icon={<LinkIcon type={item.type} />}
                      title={item.title}
                      image={item.image}
                      url={item.url}
                      type={item.type}
                      content={item.content}
                      ind={index}
                      setUrl={setLinks}
                      removeUrl={removeLink}
                    />
                    </>
                  </SortableItem>
                ))}
                </>
              </SortableCon>
              <AddLinkButton />
            </Stack>
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    </>
  );
}
