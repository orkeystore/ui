export type IApiKeyFormat = 'jwk' | 'jwks' | 'pem';
export type IApiKeyPrivacy = 'public' | 'private';

export interface IApiPager {
  page: number;
  perPage: number;
  totalPages?: number;
  totalItems?: number;
}

export interface IApiServerError {
  statusCode: number;
  message: string;
  json?: string;
}

export interface IApiAccountData {
  id: number;
  login: string;
  isAdmin: boolean;
}

export interface IApiKeyEntry {
  id: number;
  name: string;
  code: string;
  description: string;
  accountId: number;
  accessCode: string;
  rotateInterval: number;
  archivedAt: number | null;
  isSystem: boolean;
}

export interface IApiRepoData {
  id: number;
  name: string;
  code: string;
  accessToken: string;
  description: string;
  accountId: number;
  entries: IApiKeyEntry[];
}

export interface IApiPublicJWK {
  alg: string;
  kid: string;
  kty: string;
  e: string;
  n: string;
}

export interface IApiPrivateJWK extends IApiPublicJWK {
  d: string;
  p: string;
  q: string;
  dp: string;
  dq: string;
  qi: string;
}

export interface IApiStorageItem {
  key: IApiPublicJWK;
  expires: string;
  expUnix: number;
  activateUnix: number;
  entry: IApiKeyEntry;
}
