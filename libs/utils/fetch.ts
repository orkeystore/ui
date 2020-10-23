import { HttpRequestError } from '../errors/HttpResponseError';
import { API_SSR, API_URL } from 'src/constants/settings';
import { store } from 'src/store';
import { actions as sessionActions } from 'src/containers/Session/reducer';

class AppFetcher {
  public targetApi = typeof window === 'undefined' ? API_SSR : API_URL;

  constructor(public headers: Record<string, string> = {}) {}

  setHeader(prop: string, val: string) {
    this.headers = {
      ...this.headers,
      [prop]: val,
    };
  }

  removeHeader(prop: string) {
    if (this.headers) {
      delete this.headers[prop];
    }
  }

  async fetch(input: RequestInfo, init?: RequestInit): Promise<Response> {
    let processedInput;

    if (typeof input !== 'string') {
      input.url.replace('{api}', this.targetApi);

      processedInput = {
        ...input,
        url: input.url,
      };
    } else {
      processedInput = input.replace('{api}', this.targetApi);
    }

    const headers = {
      'Content-Type': 'application/json',
      ...this.headers,
      ...init?.headers,
    };

    return fetch(processedInput, {
      credentials: 'include',
      ...init,
      headers,
    });
  }

  async fetchJson<T>(input: RequestInfo, init?: RequestInit): Promise<T> {
    try {
      const res = await this.fetch(input, init);

      if (res.status < 300) {
        return (await res.json()) as T;
      } else {
        const data = (await res.json()) as {
          statusCode: number;
          message: string;
        };
        throw new HttpRequestError(data.statusCode, data.message);
      }
    } catch (err) {
      if (err instanceof HttpRequestError) {
        switch (err.status) {
          case 401:
            store &&
              store.dispatch(
                sessionActions.setSessionExpired({ isExpired: true }),
              );
            break;
          default:
        }
      }

      throw err;
    }
  }
}

export default new AppFetcher();
