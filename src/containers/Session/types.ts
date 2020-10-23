import { IApiAccountData } from 'libs/api/types';

interface IMenuLink {
  id: number;
  name: string;
  path: string;
  title: string;
  icon: string;
}

export interface IStoreSession {
  isUserAuthorized: boolean;
  isAlreadyFetched: boolean;
  isSessionExpired: boolean;
  token?: string;
  account?: IApiAccountData;
  mainMenuLinks: IMenuLink[];
  host?: string;
  privateHost?: string;
  publicHost?: string;
  errors: {
    loginForm: string | null;
  };
}

export interface OwnProps {}

export type ConnectedProps = IStoreSession;

export type ContainerProps = OwnProps & ConnectedProps;
