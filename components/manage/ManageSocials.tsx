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
import ManageSocial from './ManageSocial';
import { useAtom, useAtomValue } from 'jotai';
import {
  useLineIconsAtom,
  socialsArrayAtom,
} from 'core/atoms';
import { SocialIcon } from 'components/logos';
import { SortableContainer, SortableElement } from 'react-sortable-hoc';
import { arrayMoveImmutable } from 'array-move';
import AddSocialButton from './AddSocialButton';
import { capFirstLetter, arrayRemove } from 'core/utils';
import { SortableItemProps, SortableConProps } from 'types';

interface Props {
  json: any;
  nftAddress: string;
}

export default function ManageSocials({ json, nftAddress }: Props) {
  const useLineIcons = useAtomValue(useLineIconsAtom);
  const [socialsArray, setSocialsArray] = useAtom(socialsArrayAtom);
  const [notMobile] = useMediaQuery('(min-width: 800px)');
  const { colorMode } = useColorMode();

  // @ts-ignore: Unreachable code error
  const setUrl = (name, value) => {
    let _newSocialsArray = socialsArray.map((item) =>
      item.key === name ? { key: item.key, value } : { key: item.key, value: item.value }
    );
    setSocialsArray(_newSocialsArray);
  };

  // @ts-ignore: Unreachable code error
  const removeUrl = (index) => {
    let _newSocialsArray = arrayRemove(socialsArray,index);
    console.log(_newSocialsArray)
    setSocialsArray(_newSocialsArray);
  };

  // @ts-ignore: Unreachable code error
  const SortableCon = SortableContainer(({ children, onSortEnd, useDragHandle }) => {
    return <ul>{children}</ul>;
  });

  // @ts-ignore: Unreachable code error
  const SortableItem = SortableElement(({ children, index }) => (
    <li style={{ listStyleType: 'none', padding: '0px 0px', margin: '12px 0px' }}>{children}</li>
  ));

  useEffect(() => {
    let _socials = [];
    for (const key in json.socials) {
      json.socials[key] && _socials.push({ key: key, value: json.socials[key] });
    }
    console.log(_socials);
    setSocialsArray(_socials);
  }, []);

  // @ts-ignore: Unreachable code error
  const onSortEnd = ({ oldIndex, newIndex }) => {
    setSocialsArray(arrayMoveImmutable(socialsArray, oldIndex, newIndex));
    console.log(socialsArray)
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
                Social Links
              </Text>
              <AccordionIcon />
            </Flex>
          </AccordionButton>

          <AccordionPanel pb={4} minWidth="100%">
            <Stack my={2}>
              <SortableCon onSortEnd={onSortEnd} useDragHandle>
                {socialsArray.map(
                  (item, index) =>
                    item.key && (
                      <SortableItem key={`item-${item.key}`} index={index}>
                        <ManageSocial
                          key={`item-${item.key}`}
                          icon={<SocialIcon line={useLineIcons} name={item.key} />}
                          title={capFirstLetter(item.key)}
                          url={item.value}
                          setUrl={setUrl}
                          ind={index}
                          removeUrl={removeUrl}
                        />
                      </SortableItem>
                    )
                )}
              </SortableCon>
              <AddSocialButton />
            </Stack>
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    </>
  );
}
