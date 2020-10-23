import { useCallback } from 'react';
import { useAppDispatch } from 'src/store';
import {
  IApiParamsReposCreate,
  IApiParamsReposList,
  IApiParamsReposRemove,
} from 'libs/api/repos/types';
import * as sessionSelectors from 'src/containers/Session/selectors';
import { actions as reposActions } from './reducer';
import * as reposSelectors from './selectors';
import { generatePassword } from 'libs/utils/generatePassword';
import { IApiPager } from 'libs/api/types';
import { useSelector } from 'react-redux';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const useContainerRepos = () => {
  const dispatch = useAppDispatch();
  const pager = useSelector(reposSelectors.pagerSelector);
  const search = useSelector(reposSelectors.searchSelector);
  const accessToken = useSelector(sessionSelectors.tokenSelector);

  const createNewRepo = useCallback(
    (params: Omit<IApiParamsReposCreate, 'accessToken'>) => {
      const token = generatePassword(64);
      return dispatch(reposActions.fetchCreateRepo({ ...params, accessToken: token }));
    },
    [dispatch],
  );

  const changePager = useCallback(
    (params: Partial<IApiPager>) => {
      return dispatch(reposActions.changePager(params));
    },
    [dispatch],
  );

  const resetState = useCallback(() => {
    return dispatch(reposActions.resetState());
  }, [dispatch]);

  const changeSearch = useCallback(
    (search?: string) => {
      return dispatch(reposActions.changeSearch({ search }));
    },
    [dispatch],
  );

  const toggleEditModal = useCallback(
    (opts: { isOpened: boolean }) => {
      return dispatch(reposActions.toggleEditModal(opts));
    },
    [dispatch],
  );

  const fetchListRepo = useCallback(
    (params?: IApiParamsReposList) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const refreshWhenTokenChanges = accessToken;
      return dispatch(reposActions.fetchListRepo(params));
    },
    [dispatch, accessToken],
  );

  const fetchListRepoWatch = useCallback(() => {
    const params = {
      page: pager.page,
      perPage: pager.perPage,
      search,
    };
    return fetchListRepo(params);
  }, [fetchListRepo, pager.page, pager.perPage, search]);

  const deleteRepos = useCallback(
    async (params: IApiParamsReposRemove) => {
      await dispatch(reposActions.fetchRemoveRepos(params));
    },
    [dispatch],
  );

  return {
    resetState,
    toggleEditModal,
    createNewRepo,
    deleteRepos,
    fetchListRepo,
    changePager,
    fetchListRepoWatch,
    changeSearch,
  };
};
