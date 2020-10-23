import { useEffect } from 'react';
import { Provider, useSelector } from 'react-redux';
import { GetServerSideProps, NextPage } from 'next';
import cookies from 'next-cookies';
import useUpdateEffect from 'react-use/lib/useUpdateEffect';
import Layout from 'src/layouts/DashboardLayout';
import { initStore, useStore } from 'src/store';
import { IStore } from 'src/reducer';
import { ssrKeysFetchList } from 'src/containers/Keys/ssr';
import { ssrSessionUserData } from 'src/containers/Session/ssr';
import * as keysSelectors from 'src/containers/Keys/selectors';
import { useContainerKeys } from 'src/containers/Keys/hooks';
import AuthGuard from 'src/components/AuthGuard';
import KeysList from 'src/components/KeysList';
import { KeyPreviewModal } from 'src/components/KeyPreview';
import Page from 'src/components/Page';

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
  const loading = useSelector(keysSelectors.initialSelector);

  return (
    <AuthGuard>
      <Layout>
        <Page isLoading={loading.archive}>
          <KeysList archive />
          <KeyPreviewModal />
        </Page>
      </Layout>
    </AuthGuard>
  );
};

const useHooks = () => {
  const { resetList, fetchArchiveListWatch } = useContainerKeys();

  useUpdateEffect(() => {
    const req = fetchArchiveListWatch();
    return () => {
      req.abort();
    };
  }, [fetchArchiveListWatch]);

  useEffect(() => {
    return () => {
      resetList();
    };
  }, [resetList]);
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const store = initStore(undefined);
  const { auth_token } = cookies(context);

  await ssrSessionUserData(store, auth_token);
  await ssrKeysFetchList(store, true);

  return {
    props: {
      initialReduxState: store.getState(),
    },
  };
};

export default PageWrap;
