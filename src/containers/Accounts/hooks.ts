import { useCallback } from 'react';
import { IApiParamsAuthAccount, IApiParamsAuthRemove } from 'libs/api/auth/types';
import { useAppDispatch } from 'src/store';
import { actions as accountsActions } from './reducer';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const useContainerAccounts = () => {
  const dispatch = useAppDispatch();

  const fetchCreateAccount = useCallback(async (params: IApiParamsAuthAccount) => {
    return await dispatch(
      accountsActions.fetchCreateAccount(params),
    );
  }, [dispatch]);

  const fetchRemoveAccounts = useCallback(async (params: IApiParamsAuthRemove) => {
    return await dispatch(
      accountsActions.fetchRemoveAccounts(params)
    )
  }, [dispatch]);

  const fetchAccountsList = useCallback(async () => {
    return await dispatch(
      accountsActions.fetchAccountsList()
    );
  }, [dispatch]);

  return {
    fetchAccountsList,
    fetchCreateAccount,
    fetchRemoveAccounts,
  }
};
