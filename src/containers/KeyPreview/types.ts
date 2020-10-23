import { IApiResultKeysPreview } from 'libs/api/keys/preview';
import { IApiKeyFormat, IApiKeyPrivacy } from 'libs/api/types';

export interface IStoreKeyPreview {
  params: {
    format?: IApiKeyFormat;
    privacy?: IApiKeyPrivacy;
    code?: string;
    accessKey?: string;
  };
  modal: {
    isOpen?: boolean;
  };
  availFormats: { id: string; label: string }[];
  availPrivacy: { id: string; label: string }[];
  details: {
    error: string | null | boolean;
    loading: boolean;
    data?: IApiResultKeysPreview;
  };
}
