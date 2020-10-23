import { IApiAccountData } from 'libs/api/types';

export interface IStoreAccounts {
  create: {
    error: string | null | boolean;
    loading: boolean;
  };
  list: {
    error: string | null | boolean;
    loading: boolean;
    accounts: IApiAccountData[];
  };
}
