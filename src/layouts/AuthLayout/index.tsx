import { makeStyles } from '@material-ui/core';
import React from 'react';
import TopBar from 'src/components/TopBar';

export interface IPropsAuthLayout {}

const AuthLayout: React.FC = (props) => {
  const styles = useStyles();

  return (
    <div className={styles.wrap}>
      <div>
        <TopBar />
      </div>
      <div className={styles.formHolder}>{props.children}</div>
    </div>
  );
};

const useStyles = makeStyles(
  () => {
    return {
      wrap: {
        display: 'flex',
        flexDirection: 'column',
        flexGrow: 1,
        minHeight: '100vh',
      },
      formHolder: {
        flexGrow: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      },
    };
  },
  { classNamePrefix: 'AuthLayout-' },
);

export default AuthLayout;
