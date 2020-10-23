import fetcher from 'libs/utils/fetch';
import { IApiParamsAuthAccounts, IApiResultAuthAccounts } from './types';

const fetchApiAuthAccounts = async (_params?: IApiParamsAuthAccounts): Promise<IApiResultAuthAccounts> => {
  const result = await fetcher.fetchJson<IApiResultAuthAccounts>(
    '{api}/auth/accounts',
    {
      method: 'GET',
    }
  );

  return result;
};

export default fetchApiAuthAccounts;
