import fetcher from 'libs/utils/fetch';
import { IApiKeyEntry } from 'libs/api/types';

export interface IApiParamsKeysArchive {
  id: number;
}

export interface IApiResultKeysArchive {
  entry: IApiKeyEntry;
}

const fetchApiKeysArchive = async (params: IApiParamsKeysArchive): Promise<IApiResultKeysArchive> => {
  const result = await fetcher.fetchJson<IApiResultKeysArchive['entry']>(
    `{api}/entry/archive/${params.id.toString()}`,
    {
      method: 'POST',
    }
  );

  return { entry: result };
};

export default fetchApiKeysArchive;
