import fetcher from 'libs/utils/fetch';
import { IApiResultAuthLogin } from './types';
import { HttpRequestError } from 'libs/errors/HttpResponseError';
import Cookies from 'js-cookie';

// eslint-disable-next-line @typescript-eslint/require-await
const fetchApiAuthMe = async (token?: string): Promise<IApiResultAuthLogin> => {
  const parsedToken = typeof token !== 'undefined' ? token : Cookies.get('auth_token');

  if (!parsedToken) {
    throw new HttpRequestError(401, 'No jwt presents');
  }

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  fetcher.setHeader(`Authorization`, `Bearer ${parsedToken}`);

  const sesssionData = await fetcher.fetchJson<IApiResultAuthLogin>('{api}/auth/me', {
    method: 'GET',
  });

  return sesssionData;
};

export default fetchApiAuthMe;
