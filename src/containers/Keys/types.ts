import { IApiKeyEntry, IApiPager } from 'libs/api/types';

export interface IStoreKeys {
  initial: {
    keys: boolean;
    archive: boolean;
  };
  list: {
    loading: {
      keys: boolean;
      archive: boolean;
    };
    errors: {
      keys: React.ReactNode;
    };
    items: IApiKeyEntry[];
    pager: IApiPager;
    pagerOptions: number[];
    query?: string;
  };
  edit: {
    isModalOpened: boolean;
    loading: boolean;
    error: React.ReactNode;
    item?: IApiKeyEntry;
  };
  isRouteParsed?: boolean;
}
