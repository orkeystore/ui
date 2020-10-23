import fetcher from 'libs/utils/fetch';
import { IApiPrivateJWK, IApiPublicJWK } from '../types';

export interface IApiParamsKeysPreview {
  id: number;
  isByEntry?: boolean;
}
export interface IApiResultKeysPreview {
  publicKey: { jwk: IApiPublicJWK; pem: string };
  privateKey?: { jwk: IApiPrivateJWK; pem: string };
  activatesAt: number;
  expiresAt: number;
  entryId: number;
}

const fetchApiKeysPreview = async (params: IApiParamsKeysPreview): Promise<IApiResultKeysPreview> => {
  const { id, isByEntry } = params;
  const targetUrl = isByEntry ? `{api}/key/byEntry/${id.toString()}` : `{api}/key/${id.toString()}`;
  return await fetcher.fetchJson<IApiResultKeysPreview>(targetUrl);
};

export default fetchApiKeysPreview;
