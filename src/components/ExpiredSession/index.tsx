import React from 'react';
import { Dialog } from '@material-ui/core';
import { useSelector } from 'react-redux';
import { isSessionExpired } from 'src/containers/Session/selectors';
import LoginForm from 'src/components/LoginForm';

const ExpiredSession: React.FC = () => {
  const isExpired = useSelector(isSessionExpired)

  return (
    <Dialog open={isExpired}>
      <LoginForm />
    </Dialog>
  );
};

export default ExpiredSession;
