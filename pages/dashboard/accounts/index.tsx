import React from 'react';
import { Provider } from 'react-redux';
import { NextPage, GetServerSideProps } from 'next';
import cookies from 'next-cookies';
import { IStore } from 'src/reducer';
import { initStore, useStore } from 'src/store';
import { ssrSessionUserData } from 'src/containers/Session/ssr';
import AccountsList from 'src/components/AccountsList';
import AuthGuard from 'src/components/AuthGuard';
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
  return (
    <AuthGuard>
      <Layout>
        <Page>
          <AccountsList />
        </Page>
      </Layout>
    </AuthGuard>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const store = initStore(undefined);
  const { auth_token } = cookies(context);

  await ssrSessionUserData(store, auth_token);

  return {
    props: {
      initialReduxState: store.getState(),
    },
  };
};

export default PageWrap;
