import { IApiKeyEntry } from '../types';

export interface IApiParamsKeysCreate {
  name: string;
  code: string;
  accessToken: string;
  rotation?: string;
}

export interface IApiResultKeysCreate {
  key: IApiKeyEntry;
  error?: {
    message: string;
  }
}

export interface IApiParamsKeysRemove {
  id: number;
}

export interface IApiResultKeysRemove {
  deleted: IApiKeyEntry[];
}
