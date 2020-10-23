import fetcher from 'libs/utils/fetch';
import { IApiParamsAuthAccount, IApiResultAuthAccount } from './types';

const fetchApiAuthAccount = async (params: IApiParamsAuthAccount): Promise<IApiResultAuthAccount | null> => {
  const result = await fetcher.fetchJson<IApiResultAuthAccount>(
    '{api}/auth/account',
    {
      method: 'POST',
      body: JSON.stringify(params)
    }
  );

  return result;
};

export default fetchApiAuthAccount;
