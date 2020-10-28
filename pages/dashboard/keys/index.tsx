import { useEffect } from 'react';
import { Provider, useSelector } from 'react-redux';
import { GetServerSideProps, NextPage } from 'next';
import cookies from 'next-cookies';
import useUpdateEffect from 'react-use/lib/useUpdateEffect';
import { initStore, useStore } from 'src/store';
import { IStore } from 'src/reducer';
import { ssrKeysFetchList, ssrRouteParserKeys } from 'src/containers/Keys/ssr';
import { ssrSessionUserData } from 'src/containers/Session/ssr';
import * as keysSelectors from 'src/containers/Keys/selectors';
import { useContainerKeys } from 'src/containers/Keys/hooks';
import AuthGuard from 'src/components/AuthGuard';
import KeysList from 'src/components/KeysList';
import { KeyPreviewModal } from 'src/components/KeyPreview';
import { KeyEntryFormModal } from 'src/components/KeyEntryForm';
import Page from 'src/components/Page';
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
  const loading = useSelector(keysSelectors.initialSelector);

  return (
    <AuthGuard>
      <Layout>
        <Page isLoading={loading.keys}>
          <KeysList />
          <KeyPreviewModal />
          <KeyEntryFormModal />
        </Page>
      </Layout>
    </AuthGuard>
  );
};

const useHooks = () => {
  const { fetchKeysListWatch, resetList, routeWatcher } = useContainerKeys();

  useUpdateEffect(() => {
    const req = fetchKeysListWatch();
    return () => {
      req.abort();
    };
  }, [fetchKeysListWatch]);

  useEffect(() => {
    return () => {
      resetList();
    };
  }, [resetList]);

  useEffect(() => {
    routeWatcher();
  }, [routeWatcher]);
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const store = initStore(undefined);
  const { auth_token } = cookies(context);

  ssrRouteParserKeys(store, context.query)
  await ssrSessionUserData(store, auth_token);
  await ssrKeysFetchList(store, false);

  return {
    props: {
      initialReduxState: store.getState(),
    },
  };
};

export default PageWrap;
