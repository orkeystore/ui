import React, { useEffect } from 'react';
import { useUpdateEffect } from 'react-use';
import { Provider } from 'react-redux';
import { NextPage, GetServerSideProps } from 'next';
import cookies from 'next-cookies';
import { IStore } from 'src/reducer';
import { initStore, useStore } from 'src/store';
import { useContainerRepos } from 'src/containers/Repos/hooks';
import { ssrReposFetchList } from 'src/containers/Repos/ssr';
import { ssrSessionUserData } from 'src/containers/Session/ssr';
import AuthGuard from 'src/components/AuthGuard';
import Page from 'src/components/Page';
import { RepositoryFormModal } from 'src/components/RepositoryForm';
import ReposList from 'src/components/ReposList';
import Layout from 'src/layouts/DashboardLayout';

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
          <ReposList />
          <RepositoryFormModal />
        </Page>
      </Layout>
    </AuthGuard>
  );
};

const useHooks = () => {
  const { fetchListRepoWatch, resetState } = useContainerRepos();
  useEffect(() => {
    return () => {
      resetState();
    };
  }, [resetState]);

  useUpdateEffect(() => {
    const req = fetchListRepoWatch();
    return () => {
      req.abort();
    };
  }, [fetchListRepoWatch]);
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const store = initStore(undefined);
  const { auth_token } = cookies(context);

  await ssrSessionUserData(store, auth_token);
  await ssrReposFetchList(store);

  return {
    props: {
      initialReduxState: store.getState(),
    },
  };
};

export default PageWrap;
