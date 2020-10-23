import fetcher from 'libs/utils/fetch';
import { IApiParamsAuthLogin, IApiResultAuthLogin } from './types';
import Cookies from 'js-cookie';

const fetchApiAuthLogin = async (params: IApiParamsAuthLogin): Promise<IApiResultAuthLogin> => {
  fetcher.removeHeader(`Authorization`);
  localStorage.removeItem('auth');

  const result = await fetcher.fetchJson<IApiResultAuthLogin>(
    '{api}/auth/token',
    {
      method: 'POST',
      body: JSON.stringify(params)
    }
  );

  if (result) {
    Cookies.set('auth_token', result.token);
    fetcher.setHeader(`Authorization`, `Bearer ${result.token}`);
  }

  return result;
};

export default fetchApiAuthLogin;
