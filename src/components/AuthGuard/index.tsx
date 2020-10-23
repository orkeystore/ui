import React from 'react';
import { useSelector } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { IStore } from 'src/reducer';
import * as userStateSelectors from 'src/containers/Session/selectors';
import { useRouter } from 'next/router';

export interface IPropsAuthGuard {}

export interface IConnectAuthGuard {
  isUserAuthorized: boolean;
}

const AuthGuard: React.FC<IPropsAuthGuard> = (props) => {
  const router = useRouter()

  const storeData = useSelector<IStore, IConnectAuthGuard>(
    createStructuredSelector({
      isUserAuthorized: userStateSelectors.isUserAuthorized,
    }),
  );

  if (typeof window !== 'undefined') {
    if (storeData.isUserAuthorized && router.pathname === '/auth/login') {
      router.push('/dashboard/keys');
    }

    if (!storeData.isUserAuthorized && router.pathname !== '/auth/login') {
      router.push('/auth/login');
    }
  }

  return <>{props.children}</>;
};

export default AuthGuard;
