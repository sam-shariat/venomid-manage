import http from './http';
import fetcher from './swrFetcher';
import truncAddress from './stringUtils';

const sleep = async (ms: number) => new Promise((r) => setTimeout(r, ms));
const capFirstLetter = (str: string) => {
  const words = str.split(' ');
  const final = words
    .map((word) => {
      return word[0].toUpperCase() + word.substring(1);
    })
    .join(' ');
  return String(final);
};

const arrayRemove = (arr: Array, index: number) => {
  return arr.filter((item: any, ind: number) => index !== ind && item);
};

export { http, fetcher, truncAddress, sleep, capFirstLetter, arrayRemove };
