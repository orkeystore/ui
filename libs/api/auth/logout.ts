import Cookies from 'js-cookie';
import fetcher from 'libs/utils/fetch';
import { IApiResultAuthLogout } from './types';

// eslint-disable-next-line @typescript-eslint/require-await
const fetchApiAuthLogout = async (): Promise<IApiResultAuthLogout> => {
  fetcher.removeHeader(`Authorization`);
  localStorage.removeItem('auth');
  Cookies.remove('auth_token');
  return { isLogout: true }
};

export default fetchApiAuthLogout;
