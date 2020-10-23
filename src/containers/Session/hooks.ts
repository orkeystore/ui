import { useCallback } from 'react';
import { IApiParamsAuthLogin } from 'libs/api/auth/types';
import { useAppDispatch } from 'src/store';
import { actions as sessionActions } from './reducer';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const useContainerSession = () => {
  const dispatch = useAppDispatch();

  const logout = useCallback(() => {
    return dispatch(sessionActions.fetchLogout());
  }, [dispatch]);

  const fetchMe = useCallback(() => dispatch(sessionActions.fetchMe()), [dispatch]);

  const fetchLoginUser = useCallback((params: IApiParamsAuthLogin) => {
    return dispatch(sessionActions.fetchLoginUser(params));
  }, [dispatch]);

  return {
    logout,
    fetchMe,
    fetchLoginUser,
  };
};
