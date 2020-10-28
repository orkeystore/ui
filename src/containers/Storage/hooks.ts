import { useCallback } from 'react';
import { useSelector } from 'react-redux';
import { IApiParamsKeysStorage } from 'libs/api/keys/storage';
import * as sessionSelectors from 'src/containers/Session/selectors';
import { IApiPager } from 'libs/api/types';
import { useAppDispatch } from 'src/store';
import { actions as storageActions, pureState } from './reducer';
import * as storageSelectors from './selectors';
import { IRouteQueryStorage, IStoreStorage } from './types';
import { useRouter } from 'next/router';
import qs from 'qs';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const useContainerStorage = () => {
  const dispatch = useAppDispatch();
  const storagePager = useSelector(storageSelectors.storagePager);
  const storageFilter = useSelector(storageSelectors.storageFilter);
  const accessToken = useSelector(sessionSelectors.tokenSelector);
  const router = useRouter();

  const resetState = useCallback(() => dispatch(storageActions.resetState()), [
    dispatch,
  ]);

  const changePager = useCallback(
    (pager: Partial<IApiPager>) => {
      return dispatch(storageActions.changePager(pager));
    },
    [dispatch],
  );

  const changeFilter = useCallback(
    (filter: Partial<IStoreStorage['filter']>) => {
      return dispatch(storageActions.changeFilter(filter));
    },
    [dispatch],
  );

  const fetchStorageItems = useCallback(
    (params: IApiParamsKeysStorage) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const refreshWhenTokenChanges = accessToken;
      return dispatch(storageActions.fetchStorageItems(params));
    },
    [dispatch, accessToken],
  );

  const fetchStorageItemsWatcher = useCallback(() => {
    const params = {
      page: storagePager.page,
      perPage: storagePager.perPage,
      search: storageFilter.entryName,
    };
    return fetchStorageItems(params);
  }, [
    fetchStorageItems,
    storagePager.page,
    storagePager.perPage,
    storageFilter,
  ]);

  const routeWatcher = useCallback(() => {
    const defaultPage = pureState.pager.page;
    const defaultPerPage = pureState.pager.perPage;
    const params: IRouteQueryStorage = {};

    if (storagePager.page !== defaultPage) {
      params.page = storagePager.page;
    }

    if (storagePager.perPage !== defaultPerPage) {
      params.perPage = storagePager.perPage;
    }

    if (storageFilter.entryName && storageFilter.entryName.length > 0) {
      params.search = storageFilter.entryName;
    }

    const query = qs.stringify(params);

    if (qs.stringify(router.query) !== query) {
      router.push(
        {
          query,
        },
        undefined,
        { shallow: true },
      );
    }
  }, [
    router,
    storagePager.page,
    storagePager.perPage,
    storageFilter.entryName,
  ]);

  return {
    routeWatcher,
    resetState,
    changePager,
    changeFilter,
    fetchStorageItems,
    fetchStorageItemsWatcher,
  };
};
