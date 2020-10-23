import React from 'react';
import { Provider } from 'react-redux';
import { useStore } from 'src/store';
import LoginForm from 'src/components/LoginForm';
import AuthLayout from 'src/layouts/AuthLayout';
import AuthGuard from 'src/components/AuthGuard';

const PageAuthLogin = () => {
  const store = useStore();

  return (
    <Provider store={store}>
      <AuthGuard>
        <AuthLayout>
          <LoginForm />
        </AuthLayout>
      </AuthGuard>
    </Provider>
  );
};

export default PageAuthLogin;
