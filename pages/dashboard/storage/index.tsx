import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { NextPage, GetServerSideProps } from 'next';
import { useUpdateEffect } from 'react-use';
import cookies from 'next-cookies';

import { IStore } from 'src/reducer';
import { initStore, useStore } from 'src/store';
import { useContainerStorage } from 'src/containers/Storage/hooks';
import { ssrSessionUserData } from 'src/containers/Session/ssr';

import AuthGuard from 'src/components/AuthGuard';
import { KeyPreviewModal } from 'src/components/KeyPreview';
import Page from 'src/components/Page';
import StorageList from 'src/components/StorageList';

import Layout from 'src/layouts/DashboardLayout';
import { ssrStorageFetchItems } from 'src/containers/Storage/ssr';

const PageWrap: NextPage<{ initialReduxState: IStore }> = ({
  initialReduxState,
}) => {
  const store = useStore(initialReduxState);

  return (
    <Provider store={store}>
      <PageContent />
    </Provider>
  );
};

export const PageContent: React.FC = () => {
  useHooks();

  return (
    <AuthGuard>
      <Layout>
        <Page>
          <StorageList />
          <KeyPreviewModal />
        </Page>
      </Layout>
    </AuthGuard>
  );
};

const useHooks = () => {
  const { fetchStorageItemsWatcher, resetState } = useContainerStorage();

  useEffect(() => {
    return () => {
      resetState();
    };
  }, [resetState]);

  useUpdateEffect(() => {
    const req = fetchStorageItemsWatcher();

    return () => {
      req.abort();
    };
  }, [fetchStorageItemsWatcher]);
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const store = initStore(undefined);
  const { auth_token } = cookies(context);

  await ssrSessionUserData(store, auth_token);
  await ssrStorageFetchItems(store);

  return {
    props: {
      initialReduxState: store.getState(),
    },
  };
};

export default PageWrap;
