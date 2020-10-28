import { useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useAppDispatch } from 'src/store';
import { actions as keysActions, pureState } from './reducer';
import * as keysSelectors from './selectors';
import * as sessionSelectors from 'src/containers/Session/selectors';
import {
  IApiParamsKeysCreate,
  IApiParamsKeysRemove,
} from 'libs/api/keys/types';
import { SerializedError } from '@reduxjs/toolkit';
import { generatePassword } from 'libs/utils/generatePassword';
import { IApiParamsKeysArchive } from 'libs/api/keys/archive';
import { IApiPager } from 'libs/api/types';
import { IApiParamsKeysList } from 'libs/api/keys/list';
import api from 'libs/api';
import { IApiParamsKeysByIds } from 'libs/api/keys/byIds';
import qs from 'qs';
import { useRouter } from 'next/router';
import { IRouteQueryKeys } from './types';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const useContainerKeys = () => {
  const dispatch = useAppDispatch();
  const pager = useSelector(keysSelectors.keysPagerSelector);
  const search = useSelector(keysSelectors.keysSearchSelector);
  const accessToken = useSelector(sessionSelectors.tokenSelector);
  const isEditModalOpened = useSelector(keysSelectors.isEditModalOpened);
  const router = useRouter();

  const fetchKeysList = useCallback(
    (params: IApiParamsKeysList) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const refreshWhenTokenChanges = accessToken;
      return dispatch(keysActions.fetchKeysList(params));
    },
    [dispatch, accessToken],
  );

  const toggleEditModal = useCallback(
    (params: { isOpened: boolean }) => {
      return dispatch(keysActions.toggleEditModal(params));
    },
    [dispatch],
  );

  const fetchKeysListWatch = useCallback(() => {
    const params = {
      page: pager.page,
      perPage: pager.perPage,
      search,
    };

    return fetchKeysList(params);
  }, [fetchKeysList, pager.page, pager.perPage, search]);

  const fetchArchiveListWatch = useCallback(() => {
    const params = {
      page: pager.page,
      perPage: pager.perPage,
      search,
      isArchived: true,
    };

    return fetchKeysList(params);
  }, [fetchKeysList, pager.page, pager.perPage, search]);

  const fetchCreateKey = useCallback(
    async (params: Omit<IApiParamsKeysCreate, 'accessToken'>) => {
      const accessToken = generatePassword(64);
      const result = await dispatch(
        keysActions.fetchCreateKey({
          ...params,
          accessToken,
        }),
      );

      const { error } = result as { error: SerializedError };

      if (error) {
        return { error } as { error: SerializedError };
      }

      return result;
    },
    [dispatch],
  );

  const fetchRemoveKeyItem = useCallback(
    async (params: IApiParamsKeysRemove) => {
      return await dispatch(keysActions.fetchRemoveKeyItem(params));
    },
    [dispatch],
  );

  const fetchArchiveKeyItem = useCallback(
    (params: IApiParamsKeysArchive) => {
      return dispatch(keysActions.fetchArchiveKeyItem(params));
    },
    [dispatch],
  );

  const fetchRestoreKeyItem = useCallback(
    (params: IApiParamsKeysArchive) => {
      return dispatch(keysActions.fetchRestoreKeyItem(params));
    },
    [dispatch],
  );

  const changePager = useCallback(
    (params: Partial<IApiPager>) => {
      return dispatch(keysActions.changePager(params));
    },
    [dispatch],
  );

  const changeSearch = useCallback(
    (params: Partial<{ search?: string }>) => {
      return dispatch(keysActions.changeSearch(params));
    },
    [dispatch],
  );

  const requestKeysList = useCallback(async (params?: IApiParamsKeysList) => {
    return api.keys.list(params);
  }, []);

  const requestKeysByIds = useCallback(async (params: IApiParamsKeysByIds) => {
    return await api.keys.byIds(params);
  }, []);

  const resetList = useCallback(() => {
    return dispatch(keysActions.reset());
  }, [dispatch]);

  const routeWatcher = useCallback(() => {
    const defaultPage = pureState.list.pager.page;
    const defaultPerPage = pureState.list.pager.perPage;
    const params: IRouteQueryKeys = {};

    if (pager.page !== defaultPage) {
      params.page = pager.page;
    }

    if (pager.perPage !== defaultPerPage) {
      params.perPage = pager.perPage;
    }

    if (search && search.length > 0) {
      params.search = search;
    }

    if (isEditModalOpened) {
      params.newEntry = '1';
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
  }, [router, pager.page, pager.perPage, search, isEditModalOpened]);

  return {
    routeWatcher,
    resetList,
    changePager,
    changeSearch,
    fetchKeysList,
    fetchKeysListWatch,
    fetchArchiveListWatch,
    fetchCreateKey,
    fetchRemoveKeyItem,
    fetchRestoreKeyItem,
    fetchArchiveKeyItem,
    requestKeysList,
    requestKeysByIds,
    toggleEditModal,
  };
};
