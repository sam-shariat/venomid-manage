import { Address } from 'everscale-inpage-provider';

export interface State<T> {
  loading: boolean
  data?: T
  error?: string
}

export interface PrimaryName {
  nftAddress?: Address;
  name?: string;
}

export interface ObjectItem {
  key: string;
  value?: string;
}

export interface Message {
  type: any;
  title: string;
  msg: string;
  link?: string;
}

export interface CustomLink {
  type: string;
  title: string;
  url: string;
  image: string;
  content: string; 
}

export interface SortableConProps {
  children: React.ReactNode;
  onSortEnd: ({ oldIndex, newIndex }: { oldIndex: any; newIndex: any }) => void;
  useDragHandle: true;
}

export interface SortableItemProps {
  children: React.ReactNode;
  index: number;
}