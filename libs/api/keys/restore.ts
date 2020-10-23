import fetcher from 'libs/utils/fetch';
import { IApiKeyEntry } from 'libs/api/types';

export interface IApiParamsKeysRestore {
  id: number;
}

export interface IApiResultKeysRestore {
  entry: IApiKeyEntry;
}

const fetchApiKeysRestore = async (params: IApiParamsKeysRestore): Promise<IApiResultKeysRestore> => {
  const result = await fetcher.fetchJson<IApiResultKeysRestore['entry']>(
    `{api}/entry/restore/${params.id.toString()}`,
    {
      method: 'POST',
    }
  );

  return { entry: result };
};

export default fetchApiKeysRestore;
