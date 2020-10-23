import { IApiPager, IApiStorageItem } from 'libs/api/types';

export interface IStoreStorage {
  loading: boolean;
  initial: boolean;
  error: React.ReactNode;
  items: IApiStorageItem[];
  pager: IApiPager;
  filter: {
    entryName?: string;
  };
  pagerOptions: number[];
}
